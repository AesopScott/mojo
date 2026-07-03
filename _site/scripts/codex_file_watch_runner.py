#!/usr/bin/env python3
"""Deterministic Codex file-watch runner.

This runner intentionally avoids durable pending packets. The role queue and
watched files are the source of truth; each run snapshots current state, wakes
the role when work is visible, writes the new baseline, and moves on.
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


def parse_utc(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


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
        return {"open": True, "output": ["OPEN_ROLE_QUEUE Missing queue guard"], "exit_code": 127}

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
    return {"open": bool(re.match(r"^(OPEN|BACKLOG)_[A-Z_]*QUEUE$", first)), "output": output, "exit_code": proc.returncode}


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
        if (
            old.get("sha256") != rec.get("sha256")
            or old.get("size") != rec.get("size")
            or bool(old.get("exists")) != bool(rec.get("exists"))
        ):
            changes.append(
                {
                    "path": path,
                    "old_sha256": old.get("sha256"),
                    "new_sha256": rec.get("sha256"),
                    "old_exists": bool(old.get("exists")),
                    "new_exists": bool(rec.get("exists")),
                    "old_size": old.get("size"),
                    "new_size": rec.get("size"),
                    "old_mtime": old.get("mtime"),
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
        "== EVIDENCE RULE (systemic) ==",
        "Compact change packet is change inventory only, not full evidence source. The role must read its queue and the source files needed to decide current work.",
        "If Release Management is named, changed, or queue_guard open, read G:\\My Drive\\Mindshare\\channels\\release-management.md in full and search for current approval, conditional approval, block, Requested response, Next owner relevant to that role. Do not silently no-op while relevant open approval/block/request exists. Close only on later closeout for same item.",
        "",
        "<file_watch_change>",
        f"  <automation_id>{cfg.get('automation_id')}</automation_id>",
        f"  <event_id>{packet_id}</event_id>",
        f"  <checked_at>{utc_now()}</checked_at>",
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
                f"      <old_size>{change['old_size']}</old_size>",
                f"      <new_size>{change['new_size']}</new_size>",
                f"      <old_mtime>{change['old_mtime']}</old_mtime>",
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


def update_history(existing_state: dict | None, changes: list[dict] | None, now: str) -> list[dict]:
    history = list((existing_state or {}).get("last_history") or [])
    for change in changes or []:
        history.append(
            {
                "checked_at": now,
                "path": change.get("path"),
                "old_sha256": change.get("old_sha256"),
                "new_sha256": change.get("new_sha256"),
                "old_exists": change.get("old_exists"),
                "new_exists": change.get("new_exists"),
                "old_size": change.get("old_size"),
                "new_size": change.get("new_size"),
                "old_mtime": change.get("old_mtime"),
                "new_mtime": change.get("new_mtime"),
            }
        )
    return history[-50:]


def write_state(path: Path, cfg: dict, now: str, files: dict, existing_state: dict | None = None, changes: list[dict] | None = None) -> None:
    save_json(
        path,
        {
            "version": 1,
            "automation_id": cfg.get("automation_id"),
            "last_checked_at": now,
            "baseline_on_first_run": bool(cfg.get("baseline_on_first_run")),
            "files": files,
            "last_history": update_history(existing_state, changes, now),
        },
    )


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


def cadence_due(cfg: dict, existing_state: dict | None, now: str) -> bool:
    rrule = cfg.get("rrule") or ""
    match = re.search(r"FREQ=MINUTELY;INTERVAL=(\d+)", rrule)
    if not match:
        return True

    last = parse_utc((existing_state or {}).get("last_checked_at"))
    if last is None:
        return True

    current = parse_utc(now)
    if current is None:
        return True

    interval_seconds = max(1, int(match.group(1))) * 60
    return (current - last).total_seconds() >= interval_seconds


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

            stale_pending = load_json(automation_dir / "pending-change-packet.json")
            if stale_pending and not dry_run:
                write_packet_log(automation_dir, stale_pending, "cleared_pending_disabled")
                (automation_dir / "pending-change-packet.json").unlink(missing_ok=True)
                (automation_dir / "pending-change-packet.md").unlink(missing_ok=True)
                (automation_dir / "resume-process.json").unlink(missing_ok=True)
                log(root, f"{cfg['automation_id']}: cleared stale pending packet {stale_pending.get('packet_id')} because pending packets are disabled")

            if not cadence_due(cfg, existing_state, now):
                log(root, f"{cfg['automation_id']}: cadence wait")
                rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": 0, "missing_count": 0, "files": cfg.get("watched_paths", [])})
                continue

            snapshot = scan_snapshot(cfg, config_path, automation_dir, old_files, now, dry_run)
            changed_count = len(snapshot["changes"])
            queue_open = bool(snapshot["queue_guard"]["open"])

            if (
                changed_count == 0
                and snapshot["missing_count"] == 0
                and not queue_open
            ):
                log(root, f"{cfg['automation_id']}: unchanged")
                if not dry_run:
                    write_state(state_path, cfg, now, snapshot["new_files"], existing_state, [])
                rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": 0, "missing_count": 0, "files": cfg.get("watched_paths", [])})
                continue

            if not existing_state and cfg.get("baseline_on_first_run") and not cfg.get("resume_on_first_run") and not snapshot["queue_guard"]["open"]:
                log(root, f"{cfg['automation_id']}: baseline only, {changed_count} files recorded")
                if not dry_run:
                    write_state(state_path, cfg, now, snapshot["new_files"], existing_state, snapshot["changes"])
                rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": changed_count, "missing_count": snapshot["missing_count"], "files": cfg.get("watched_paths", [])})
                continue

            packet_id = new_packet_id()
            packet_text = change_packet(cfg, snapshot["changes"], snapshot["queue_guard"]["output"], packet_id)
            if not dry_run:
                result = start_resume(root, automation_dir, cfg, packet_text, codex_exe, dry_run)
                if result["already_running"]:
                    log(root, f"{cfg['automation_id']}: work visible changed={changed_count} queue_open={queue_open} event={packet_id}; resume already running pid={result['pid']}; no pending stored")
                else:
                    log(root, f"{cfg['automation_id']}: work visible changed={changed_count} queue_open={queue_open} event={packet_id} pid={result['pid']} started; no pending stored")
                write_state(state_path, cfg, now, snapshot["new_files"], existing_state, snapshot["changes"])
            else:
                log(root, f"{cfg['automation_id']}: dry-run changed={changed_count} queue_open={queue_open} event={packet_id}; no pending stored")
            rows.append({"automation_id": cfg["automation_id"], "rrule": cfg.get("rrule", ""), "last_check_local": local_now(), "changed_count": changed_count, "missing_count": snapshot["missing_count"], "files": cfg.get("watched_paths", [])})
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
