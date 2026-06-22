#!/usr/bin/env python3
"""Deterministic Codex file-watch runner.

This runner intentionally avoids process-tree control. It keeps a per-role
pending packet until the role acknowledges it, but supersedes that packet when
newer watched-file or queue state appears. That prevents Release Management
approvals from being hidden behind stale "waiting for Reid" packets.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def local_now() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def read_text(path: Path) -> str:
    for encoding in ("utf-8-sig", "utf-16", "utf-16-le"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeError:
            continue
    return path.read_text(encoding="utf-8-sig", errors="replace")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def log(root: Path, message: str) -> None:
    with (root / "file-watch-runner.log").open("a", encoding="utf-8") as fh:
        fh.write(f"{utc_now()} {message}\n")


def parse_config(path: Path) -> dict:
    text = read_text(path)
    cfg: dict = {}
    for key in [
        "automation_id",
        "name",
        "status",
        "rrule",
        "target_thread_id",
        "watch_state_path",
        "max_change_packet_bytes",
        "queue_guard_path",
    ]:
        m = re.search(rf"(?m)^{key}\s*=\s*\"([^\"]*)\"", text)
        if m:
            cfg[key] = m.group(1)

    for key in ["baseline_on_first_run", "resume_on_first_run", "dedupe_by_hash", "resume_on_clean_file_change"]:
        m = re.search(rf"(?m)^{key}\s*=\s*(true|false)", text)
        if m:
            cfg[key] = m.group(1) == "true"

    def parse_string_list(key: str) -> list[str]:
        items: list[str] = []
        m = re.search(rf"(?s){re.escape(key)}\s*=\s*\[(.*?)\]", text)
        if m:
            for line in m.group(1).splitlines():
                pm = re.match(r'\s*"((?:\\"|[^"])*)"\s*,?\s*$', line)
                if pm:
                    items.append(pm.group(1).replace('\\"', '"'))
        return items

    paths = parse_string_list("watched_paths")
    daily_roots = parse_string_list("daily_session_watch_roots")
    daily_files = parse_string_list("daily_session_watch_files")
    if daily_roots:
        paths.extend(expand_daily_session_paths(daily_roots, daily_files))
    paths = list(dict.fromkeys(paths))
    cfg["watched_paths"] = paths

    pm = re.search(r'(?s)prompt_on_change\s*=\s*"""(.*?)"""', text)
    cfg["prompt_on_change"] = pm.group(1).strip() if pm else "File-watch change detected."
    cfg.setdefault("watch_state_path", "watch_state.json")
    cfg.setdefault("rrule", "")
    return cfg


def expand_daily_session_paths(roots: list[str], file_names: list[str] | None = None) -> list[str]:
    names = file_names or ["architecture.md", "configuration.md", "design.md", "other.md", "session.md"]
    today = datetime.now().strftime("%Y-%m-%d")
    expanded: list[str] = []
    for root_text in roots:
        session_dir = Path(root_text) / f"session{today}"
        if session_dir.exists():
            for name in names:
                candidate = session_dir / name
                if candidate.exists():
                    expanded.append(str(candidate))
    return expanded


def file_record(path_text: str, now: str) -> dict:
    path = Path(path_text)
    if path.exists():
        if path.is_dir():
            entries = []
            for child in sorted(path.iterdir(), key=lambda item: item.name.lower()):
                try:
                    stat = child.stat()
                    entries.append(
                        {
                            "name": child.name,
                            "is_dir": child.is_dir(),
                            "mtime": stat.st_mtime,
                            "size": stat.st_size,
                        }
                    )
                except OSError:
                    entries.append({"name": child.name, "error": "stat_failed"})
            data = json.dumps(entries, sort_keys=True, separators=(",", ":")).encode("utf-8")
            stat = path.stat()
            return {
                "last_checked_at": now,
                "sha256": hashlib.sha256(data).hexdigest(),
                "mtime": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat().replace("+00:00", "Z"),
                "size": len(data),
                "last_changed_at": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat().replace("+00:00", "Z"),
                "exists": True,
            }
        data = path.read_bytes()
        stat = path.stat()
        return {
            "last_checked_at": now,
            "sha256": hashlib.sha256(data).hexdigest(),
            "mtime": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat().replace("+00:00", "Z"),
            "size": stat.st_size,
            "last_changed_at": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat().replace("+00:00", "Z"),
            "exists": True,
        }
    return {
        "last_checked_at": now,
        "sha256": None,
        "mtime": None,
        "size": None,
        "last_changed_at": None,
        "exists": False,
    }


def comparable_files(files: dict | None) -> list[dict]:
    if not files:
        return []
    return [
        {
            "path": path,
            "sha256": rec.get("sha256"),
            "exists": bool(rec.get("exists")),
            "mtime": rec.get("mtime"),
            "size": rec.get("size"),
        }
        for path, rec in sorted(files.items())
    ]


def packet_signature(files: dict, queue_output: list[str]) -> str:
    body = {"files": comparable_files(files), "queue_guard_output": list(queue_output or [])}
    raw = json.dumps(body, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def pending_signature(pending: dict | None) -> str | None:
    if not pending:
        return None
    if pending.get("packet_signature"):
        return pending["packet_signature"]
    return packet_signature(pending.get("detected_new_files") or {}, pending.get("queue_guard_output") or [])


def load_json(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        return json.loads(read_text(path))
    except Exception:
        return None


def save_json(path: Path, data: dict) -> None:
    write_text(path, json.dumps(data, indent=2))


def invoke_queue_guard(path_text: str | None, cfg: dict, automation_dir: Path, config_path: Path, dry_run: bool) -> dict:
    if not path_text:
        return {"open": False, "output": [], "exit_code": 0}
    path = Path(path_text)
    if not path.exists():
        return {"open": True, "output": ["OPEN_ROLE_QUEUE", f"Missing queue guard: {path_text}"], "exit_code": 127}

    env = os.environ.copy()
    env["CODEX_FILE_WATCH_AUTOMATION_ID"] = cfg.get("automation_id", "")
    env["CODEX_FILE_WATCH_AUTOMATION_DIR"] = str(automation_dir)
    env["CODEX_FILE_WATCH_CONFIG_PATH"] = str(config_path)
    env["CODEX_FILE_WATCH_DRY_RUN"] = "1" if dry_run else "0"
    env["CODEX_FILE_WATCH_NO_STATE_WRITE"] = "1"
    proc = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(path)],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        env=env,
    )
    output = proc.stdout.splitlines()
    first = output[0] if output else ""
    return {"open": bool(re.match(r"^OPEN_[A-Z_]*QUEUE$", first)), "output": output, "exit_code": proc.returncode}


def scan_snapshot(cfg: dict, config_path: Path, automation_dir: Path, old_files: dict, now: str, dry_run: bool) -> dict:
    new_files: dict = {}
    changes: list[dict] = []
    missing_count = 0

    for path in cfg.get("watched_paths", []):
        rec = file_record(path, now)
        new_files[path] = rec
        if not rec["exists"]:
            missing_count += 1
        old = old_files.get(path) or {}
        if old.get("sha256") != rec.get("sha256") or bool(old.get("exists")) != bool(rec.get("exists")):
            changes.append(
                {
                    "path": path,
                    "old_sha256": old.get("sha256"),
                    "new_sha256": rec.get("sha256"),
                    "old_exists": bool(old.get("exists")),
                    "new_exists": bool(rec.get("exists")),
                    "new_size": rec.get("size"),
                    "new_mtime": rec.get("mtime"),
                }
            )

    queue = invoke_queue_guard(cfg.get("queue_guard_path"), cfg, automation_dir, config_path, dry_run)
    queue_ids: list[str] = []
    for line in queue["output"][1:]:
        m = re.match(r"\s*([a-f0-9]{16}|[A-Z]+-\d+)\s+", line)
        if m:
            queue_ids.append(m.group(1))

    return {
        "new_files": new_files,
        "changes": changes,
        "missing_count": missing_count,
        "queue_guard": queue,
        "queue_item_ids": queue_ids,
        "packet_signature": packet_signature(new_files, queue["output"]),
    }


def new_packet_id() -> str:
    now = datetime.now()
    return now.strftime("%Y%m%d%H%M%S") + f"{int(now.microsecond / 1000):03d}"


def change_packet(cfg: dict, changes: list[dict], queue_output: list[str], packet_id: str) -> str:
    lines = [
        cfg.get("prompt_on_change") or "File-watch change detected.",
        "",
        "<file_watch_change>",
        f"  <automation_id>{cfg.get('automation_id')}</automation_id>",
        f"  <packet_id>{packet_id}</packet_id>",
        f"  <checked_at>{utc_now()}</checked_at>",
        "  <acknowledgement_instructions>",
        f"    Include in your output ONE of: FILE_WATCH_ACK: {packet_id} ACTION_TAKEN or FILE_WATCH_ACK: {packet_id} NO_ACTION_BECAUSE <reason>",
        "  </acknowledgement_instructions>",
        "  <changed_files>",
    ]
    for change in changes:
        lines.extend(
            [
                "    <file>",
                f"      <path>{change['path']}</path>",
                f"      <old_sha256>{change['old_sha256']}</old_sha256>",
                f"      <new_sha256>{change['new_sha256']}</new_sha256>",
                f"      <old_exists>{change['old_exists']}</old_exists>",
                f"      <new_exists>{change['new_exists']}</new_exists>",
                f"      <new_size>{change['new_size']}</new_size>",
                f"      <new_mtime>{change['new_mtime']}</new_mtime>",
                "    </file>",
            ]
        )
    lines.append("  </changed_files>")
    if queue_output:
        lines.append("  <queue_guard>")
        for line in queue_output:
            lines.append(f"    <line>{line}</line>")
        lines.append("  </queue_guard>")
    lines.append("</file_watch_change>")
    return "\n".join(lines)


def save_pending_md(automation_dir: Path, automation_id: str, packet_id: str, packet_text: str) -> None:
    text = "\n".join(
        [
            "# Pending File-Watch Change Packet",
            "",
            f"- **automation_id**: {automation_id}",
            f"- **packet_id**: {packet_id}",
            "- **status**: pending",
            f"- **created_at**: {utc_now()}",
            "",
            "## Instructions",
            "",
            "Role must acknowledge by including in output:",
            "",
            "```",
            f"FILE_WATCH_ACK: {packet_id} ACTION_TAKEN",
            "```",
            "",
            "OR if no action needed:",
            "",
            "```",
            f"FILE_WATCH_ACK: {packet_id} NO_ACTION_BECAUSE <brief reason>",
            "```",
            "",
            "## Packet Content",
            "",
            "```",
            packet_text,
            "```",
            "",
        ]
    )
    write_text(automation_dir / "pending-change-packet.md", text)


def make_pending(cfg: dict, packet_id: str, now: str, snapshot: dict, packet_text: str, supersedes: str | None = None) -> dict:
    data = {
        "automation_id": cfg.get("automation_id"),
        "packet_id": packet_id,
        "first_detected_at": now,
        "detected_new_files": snapshot["new_files"],
        "queue_guard_output": snapshot["queue_guard"]["output"],
        "queue_item_ids": snapshot["queue_item_ids"],
        "packet_signature": snapshot["packet_signature"],
        "prompt_packet_text": packet_text,
        "status": "pending",
        "resume_count": 0,
        "last_resumed_at": None,
    }
    if supersedes:
        data["supersedes_packet_id"] = supersedes
        data["superseded_at"] = utc_now()
    return data


def acknowledged(automation_dir: Path, packet_id: str) -> bool:
    output = ""
    for name in ("last-resume-output.txt", "last-resume-error.txt"):
        path = automation_dir / name
        if not path.exists():
            continue
        try:
            output += "\n" + read_text(path)
        except Exception:
            continue
    if not output:
        return False
    return re.search(rf"(?i)FILE_WATCH_ACK:\s*{re.escape(packet_id)}\s+(ACTION_TAKEN|NO_ACTION_BECAUSE\s+\S+)", output) is not None


def start_resume(root: Path, automation_dir: Path, cfg: dict, packet_text: str, codex_exe: str, dry_run: bool) -> dict:
    if dry_run:
        return {"started": False, "already_running": False, "pid": None}

    marker_path = automation_dir / "resume-process.json"
    if marker_path.exists():
        marker = load_json(marker_path) or {}
        try:
            started = datetime.fromisoformat(str(marker.get("started_at", "")).replace("Z", "+00:00"))
            if (datetime.now(timezone.utc) - started).total_seconds() < 15 * 60:
                return {"started": False, "already_running": True, "pid": marker.get("pid")}
        except Exception:
            pass
        marker_path.unlink(missing_ok=True)

    input_path = automation_dir / "last-resume-input.txt"
    output_path = automation_dir / "last-resume-output.txt"
    error_path = automation_dir / "last-resume-error.txt"
    write_text(input_path, packet_text)

    marker = {
        "pid": None,
        "started_at": utc_now(),
        "thread_id": cfg.get("target_thread_id"),
        "input_path": str(input_path),
        "output_path": str(output_path),
        "error_path": str(error_path),
    }
    save_json(marker_path, marker)

    helper = Path(__file__).with_name("codex-file-watch-resume-once.ps1")
    proc = subprocess.Popen(
        [
            "powershell",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(helper),
            "-InputPath",
            str(input_path),
            "-ThreadId",
            str(cfg.get("target_thread_id")),
            "-OutputPath",
            str(output_path),
            "-ErrorPath",
            str(error_path),
            "-MarkerPath",
            str(marker_path),
            "-CodexExe",
            codex_exe,
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=0x08000000 if os.name == "nt" else 0,
    )
    marker["pid"] = proc.pid
    save_json(marker_path, marker)
    return {"started": True, "already_running": False, "pid": proc.pid}


def active_resume_marker(automation_dir: Path) -> dict | None:
    marker_path = automation_dir / "resume-process.json"
    if not marker_path.exists():
        return None
    marker = load_json(marker_path) or {}
    try:
        started = datetime.fromisoformat(str(marker.get("started_at", "")).replace("Z", "+00:00"))
        if (datetime.now(timezone.utc) - started).total_seconds() < 15 * 60:
            return marker
    except Exception:
        pass
    marker_path.unlink(missing_ok=True)
    return None


def retry_due(pending: dict | None, seconds: int = 5 * 60) -> bool:
    if not pending:
        return True
    last = pending.get("last_resumed_at")
    if not last:
        return True
    try:
        last_dt = datetime.fromisoformat(str(last).replace("Z", "+00:00"))
        return (datetime.now(timezone.utc) - last_dt).total_seconds() >= seconds
    except Exception:
        return True


def mark_resumed(automation_dir: Path, pending: dict, result: dict) -> None:
    if result.get("already_running"):
        return
    pending["resume_count"] = int(pending.get("resume_count") or 0) + 1
    pending["last_resumed_at"] = utc_now()
    save_json(automation_dir / "pending-change-packet.json", pending)


def write_state(path: Path, cfg: dict, now: str, files: dict) -> None:
    save_json(
        path,
        {
            "version": 1,
            "automation_id": cfg.get("automation_id"),
            "last_checked_at": now,
            "baseline_on_first_run": bool(cfg.get("baseline_on_first_run")),
            "files": files,
        },
    )


def apply_queue_seen(automation_dir: Path, queue_ids: list[str], state_file: str) -> None:
    if not queue_ids:
        return
    path = automation_dir / state_file
    state = load_json(path) or {}
    seen = state.get("seen_items") or {}
    for item in queue_ids:
        seen[item] = True
    state["checked_at"] = utc_now()
    state["seen_items"] = dict(sorted(seen.items()))
    save_json(path, state)


def write_packet_log(automation_dir: Path, pending: dict, status: str = "acknowledged") -> None:
    entry = {
        "packet_id": pending.get("packet_id"),
        "automation_id": pending.get("automation_id"),
        "first_detected_at": pending.get("first_detected_at"),
        "closed_at": utc_now(),
        "status": status,
        "resume_count": pending.get("resume_count"),
    }
    with (automation_dir / "change-packet-log.jsonl").open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, separators=(",", ":")) + "\n")


def queue_guard_is_clean_no_open(snapshot: dict) -> bool:
    output = snapshot.get("queue_guard", {}).get("output") or []
    first = output[0] if output else ""
    return snapshot.get("queue_guard", {}).get("exit_code") == 0 and first.startswith("NO_OPEN")


def write_status(root: Path, rows: list[dict]) -> None:
    lines = [
        "# Codex File-Watch Status",
        "",
        f"Last updated UTC: {utc_now()}",
        f"Local time: {local_now()}",
        "",
        "| Automation | Cadence | Last check local | Changed | Missing | Watched files |",
        "|---|---|---:|---:|---:|---|",
    ]
    for row in sorted(rows, key=lambda item: item["automation_id"]):
        files = "".join(f"<br><code>{p}</code>" for p in row["files"])
        lines.append(
            f"| <code>{row['automation_id']}</code> | <code>{row['rrule']}</code> | {row['last_check_local']} | {row['changed_count']} | {row['missing_count']} | {files} |"
        )
    lines.extend(["", r"Read the runner log at `C:\Users\scott\.codex\automations\file-watch-runner.log` for per-minute unchanged/changed events.", ""])
    write_text(root / "file-watch-status.md", "\n".join(lines))


def run(root: Path, codex_exe: str, dry_run: bool) -> int:
    if not root.exists():
        return 0

    lock_path = root / "file-watch-runner.lock"
    if lock_path.exists():
        try:
            lock_age = datetime.now(timezone.utc) - datetime.fromtimestamp(lock_path.stat().st_mtime, timezone.utc)
            if lock_age.total_seconds() < 10 * 60:
                log(root, "runner lock unavailable")
                return 0
        except Exception:
            pass
        lock_path.unlink(missing_ok=True)

    write_text(lock_path, f"{os.getpid()} {utc_now()}")
    rows: list[dict] = []
    try:
        for automation_dir in sorted([p for p in root.iterdir() if p.is_dir()]):
            config_path = automation_dir / "file-watch.toml"
            if not config_path.exists():
                continue
            cfg = parse_config(config_path)
            if cfg.get("status") != "ACTIVE":
                continue

            now = utc_now()
            state_path = automation_dir / cfg.get("watch_state_path", "watch_state.json")
            existing_state = load_json(state_path)
            old_files = (existing_state or {}).get("files") or {}
            pending = load_json(automation_dir / "pending-change-packet.json")
            pending_id = pending.get("packet_id") if pending else None
            has_ack = acknowledged(automation_dir, pending_id) if pending_id else False

            if has_ack and pending:
                log(root, f"{cfg['automation_id']}: pending packet {pending_id} acknowledged, applying baseline and queue marks")
                if not dry_run:
                    write_state(state_path, cfg, now, pending.get("detected_new_files") or {})
                    queue_state = "queue_guard_state.json" if cfg["automation_id"] == "reid-handoff-check" else "channel_queue_guard_state.json"
                    apply_queue_seen(automation_dir, pending.get("queue_item_ids") or [], queue_state)
                    write_packet_log(automation_dir, pending)
                    (automation_dir / "pending-change-packet.json").unlink(missing_ok=True)
                    (automation_dir / "pending-change-packet.md").unlink(missing_ok=True)
                    (automation_dir / "resume-process.json").unlink(missing_ok=True)
                log(root, f"{cfg['automation_id']}: acknowledged packet {pending_id} processed")
                rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": 0, "missing_count": 0, "files": cfg.get("watched_paths", [])})
                continue

            snapshot = scan_snapshot(cfg, config_path, automation_dir, old_files, now, dry_run)

            should_resume_clean_file_change = bool(cfg.get("resume_on_clean_file_change")) and len(snapshot["changes"]) > 0
            if queue_guard_is_clean_no_open(snapshot) and snapshot["missing_count"] == 0 and not should_resume_clean_file_change:
                if len(snapshot["changes"]) > 0:
                    message = "changed files but queue guard clean; baseline advanced without thread resume"
                elif pending:
                    message = f"pending packet {pending_id} cleared because queue guard is now clean"
                else:
                    message = "unchanged"
                log(root, f"{cfg['automation_id']}: {message}")
                if not dry_run:
                    write_state(state_path, cfg, now, snapshot["new_files"])
                    if pending:
                        write_packet_log(automation_dir, pending, "cleared_no_open_queue")
                    (automation_dir / "pending-change-packet.json").unlink(missing_ok=True)
                    (automation_dir / "pending-change-packet.md").unlink(missing_ok=True)
                    (automation_dir / "resume-process.json").unlink(missing_ok=True)
                rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": len(snapshot["changes"]), "missing_count": snapshot["missing_count"], "files": cfg.get("watched_paths", [])})
                continue

            if pending and not has_ack:
                active_marker = active_resume_marker(automation_dir)
                if active_marker:
                    log(root, f"{cfg['automation_id']}: resume already running pid={active_marker.get('pid')}, pending packet {pending_id} not superseded")
                    rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": len(snapshot["changes"]), "missing_count": snapshot["missing_count"], "files": cfg.get("watched_paths", [])})
                    continue

                if snapshot["packet_signature"] != pending_signature(pending):
                    packet_id = new_packet_id()
                    packet_text = change_packet(cfg, snapshot["changes"], snapshot["queue_guard"]["output"], packet_id)
                    pending_data = make_pending(cfg, packet_id, now, snapshot, packet_text, supersedes=pending_id)
                    if not dry_run:
                        save_json(automation_dir / "pending-change-packet.json", pending_data)
                        save_pending_md(automation_dir, cfg["automation_id"], packet_id, packet_text)
                        log(root, f"{cfg['automation_id']}: superseded pending packet {pending_id} with {packet_id} after newer file/queue state")
                        result = start_resume(root, automation_dir, cfg, packet_text, codex_exe, dry_run)
                        if result["already_running"]:
                            log(root, f"{cfg['automation_id']}: resume already running pid={result['pid']}, superseded packet remains pending")
                        else:
                            mark_resumed(automation_dir, pending_data, result)
                            log(root, f"{cfg['automation_id']}: superseded packet {packet_id} pid={result['pid']} started")
                    else:
                        log(root, f"{cfg['automation_id']}: dry-run would supersede pending packet {pending_id} with {packet_id}")
                else:
                    if not retry_due(pending):
                        log(root, f"{cfg['automation_id']}: pending packet {pending_id} waiting for ack; retry cooldown active")
                        rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": len(snapshot["changes"]), "missing_count": snapshot["missing_count"], "files": cfg.get("watched_paths", [])})
                        continue
                    log(root, f"{cfg['automation_id']}: re-sending pending packet {pending_id} (resume_count={int(pending.get('resume_count') or 0) + 1})")
                    if not dry_run:
                        result = start_resume(root, automation_dir, cfg, pending.get("prompt_packet_text") or "", codex_exe, dry_run)
                        if result["already_running"]:
                            log(root, f"{cfg['automation_id']}: resume already running pid={result['pid']}, packet remains pending")
                        else:
                            mark_resumed(automation_dir, pending, result)
                            log(root, f"{cfg['automation_id']}: re-sent pending packet pid={result['pid']} started")
                rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": len(snapshot["changes"]), "missing_count": snapshot["missing_count"], "files": cfg.get("watched_paths", [])})
                continue

            rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": len(snapshot["changes"]), "missing_count": snapshot["missing_count"], "files": cfg.get("watched_paths", [])})
            if not existing_state and cfg.get("baseline_on_first_run") and not cfg.get("resume_on_first_run") and not snapshot["queue_guard"]["open"]:
                log(root, f"{cfg['automation_id']}: baseline only, {len(snapshot['changes'])} files recorded")
                if not dry_run:
                    write_state(state_path, cfg, now, snapshot["new_files"])
                continue

            packet_id = new_packet_id()
            packet_text = change_packet(cfg, snapshot["changes"], snapshot["queue_guard"]["output"], packet_id)
            pending_data = make_pending(cfg, packet_id, now, snapshot, packet_text)
            if not dry_run:
                save_json(automation_dir / "pending-change-packet.json", pending_data)
                save_pending_md(automation_dir, cfg["automation_id"], packet_id, packet_text)
                result = start_resume(root, automation_dir, cfg, packet_text, codex_exe, dry_run)
                if result["already_running"]:
                    log(root, f"{cfg['automation_id']}: resume already running pid={result['pid']}, packet saved pending")
                else:
                    mark_resumed(automation_dir, pending_data, result)
                    log(root, f"{cfg['automation_id']}: pending changed={len(snapshot['changes'])} queue_open={snapshot['queue_guard']['open']} packet={packet_id} pid={result['pid']} started")
            else:
                log(root, f"{cfg['automation_id']}: dry-run changed={len(snapshot['changes'])} queue_open={snapshot['queue_guard']['open']} packet={packet_id}")
        write_status(root, rows)
        return 0
    finally:
        lock_path.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--automations-root", default=str(Path.home() / ".codex" / "automations"))
    parser.add_argument("--codex-exe", default="codex")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    return run(Path(args.automations_root), args.codex_exe, args.dry_run)


if __name__ == "__main__":
    sys.exit(main())
