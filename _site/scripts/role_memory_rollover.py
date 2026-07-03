#!/usr/bin/env python3
"""Archive and compact repo-local role memory files.

The active `memory.md` file is prompt-loadable working memory. Dated archives
hold the full ledger. This script is intentionally conservative: it archives
before rewriting, keeps source pointers and current sections, and records a
per-role state file so a daily heartbeat can call it repeatedly without doing
more than one rollover per local day.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from pathlib import Path


DEFAULT_ROOTS = [
    Path(r"C:\Users\scott\Code\mojo"),
    Path(r"C:\Users\scott\Code\mindshare"),
    Path(r"C:\Users\scott\Code\watch"),
]

KEEP_SECTION_ALIASES = {
    "identity": [
        "purpose",
        "role identity",
        "current identity",
        "identity",
        "role purpose",
        "current role contract",
        "roster and memory pointers",
    ],
    "standing": [
        "status",
        "activation",
        "current authority",
        "authority boundaries",
        "handoff check goal",
        "handoff check automation",
        "heartbeat automation",
        "assigned handoff files",
        "operating preferences learned",
        "operating preferences",
        "operating notes",
        "worktree discipline",
        "professional maturity and authorization",
    ],
    "decisions": ["current decisions"],
    "active": ["active work", "current work", "current queue", "current release status"],
    "loading": ["loading proposal", "privacy and retention"],
}

MAX_LINES = {
    "identity": 16,
    "standing": 14,
    "decisions": 10,
    "active": 10,
    "loading": 8,
}


def today_string() -> str:
    return dt.datetime.now().astimezone().date().isoformat()


def split_sections(text: str) -> tuple[list[str], dict[str, list[str]]]:
    lines = text.splitlines()
    preface: list[str] = []
    sections: dict[str, list[str]] = {}
    current: str | None = None
    current_lines: list[str] = []
    for line in lines:
        match = re.match(r"^##\s+(.+?)\s*$", line)
        if match:
            if current is None:
                preface = current_lines
            else:
                sections[current.lower()] = current_lines
            current = match.group(1).strip()
            current_lines = []
            continue
        current_lines.append(line)
    if current is None:
        preface = current_lines
    else:
        sections[current.lower()] = current_lines
    return preface, sections


def clean_lines(lines: list[str], limit: int) -> list[str]:
    cleaned: list[str] = []
    blanks = 0
    for raw in lines:
        line = raw.rstrip()
        if not line:
            blanks += 1
            if blanks > 1:
                continue
        else:
            blanks = 0
        if line.startswith("|") and len(cleaned) > 2:
            break
        cleaned.append(line)
        if len([item for item in cleaned if item.strip()]) >= limit:
            break
    while cleaned and not cleaned[-1].strip():
        cleaned.pop()
    return cleaned


def collect(sections: dict[str, list[str]], group: str) -> list[str]:
    out: list[str] = []
    names = KEEP_SECTION_ALIASES[group]
    for name in names:
        lines = sections.get(name)
        if lines:
            if out:
                out.append("")
            out.extend(clean_lines(lines, MAX_LINES[group]))
    return out


def compact_text(original: str, memory_path: Path, archive_rel: str, run_date: str) -> str:
    preface, sections = split_sections(original)
    title = next((line.strip() for line in preface if line.strip().startswith("# ")), "# Role Memory")
    body: list[str] = [
        title,
        "",
        f"Last reviewed: {run_date}",
        f"Last rollover: {run_date}",
        f"Full archive: `{archive_rel}`",
        "",
        "## Identity And Source Pointers",
    ]
    identity = clean_lines([line for line in preface if not line.strip().startswith("# ")], 12)
    identity.extend(collect(sections, "identity"))
    body.extend(identity or ["- See role contract and archive pointer below."])
    body.extend(["", "## Standing Rules"])
    body.extend(collect(sections, "standing") or ["- Follow the role contract, workflow, authority gates, and assigned channel rules."])
    body.extend(["", "## Current Decisions"])
    body.extend(collect(sections, "decisions") or ["- No current decisions recorded in active memory."])
    body.extend(["", "## Active Work"])
    body.extend(collect(sections, "active") or ["- No active work recorded in active memory."])
    body.extend(
        [
            "",
            "## Today",
            f"- {run_date}: Archived the pre-rollover memory ledger and compacted this active file for prompt injection.",
            "",
            "## Archive Pointers",
            f"- Full pre-rollover archive: `{archive_rel}`",
            "- Keep detailed logs, completed runs, and historical decisions in dated archives or source artifacts instead of active memory.",
            "- Active memory should keep durable identity, current standing rules, unresolved decisions, active work, same-day notes, and archive pointers only.",
            "",
        ]
    )
    return "\n".join(body)


def role_memory_files(roots: list[Path]) -> list[Path]:
    files: list[Path] = []
    for root in roots:
        roles = root / "roles"
        if not roles.exists():
            continue
        files.extend(sorted(roles.glob("*/memory.md")))
    return files


def process_file(path: Path, run_date: str, force: bool, dry_run: bool) -> dict[str, object]:
    state_path = path.with_name("memory-state.json")
    archive_dir = path.parent / "memory-archive"
    archive_path = archive_dir / f"{run_date}.md"
    state = {}
    if state_path.exists():
        try:
            state = json.loads(state_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            state = {}
    if state.get("last_rollover_date") == run_date and not force:
        return {"path": str(path), "status": "skipped", "reason": "already rolled over today"}
    original = path.read_text(encoding="utf-8")
    archive_rel = str(archive_path.relative_to(path.parent)).replace("/", "\\")
    compacted = compact_text(original, path, archive_rel, run_date)
    if dry_run:
        return {
            "path": str(path),
            "status": "dry-run",
            "archive": str(archive_path),
            "old_words": len(original.split()),
            "new_words": len(compacted.split()),
        }
    archive_dir.mkdir(parents=True, exist_ok=True)
    if not archive_path.exists():
        archive_path.write_text(original, encoding="utf-8", newline="\n")
    path.write_text(compacted, encoding="utf-8", newline="\n")
    state = {
        "last_rollover_date": run_date,
        "last_rollover_at": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "last_archive": str(archive_path),
        "active_memory": str(path),
        "old_words": len(original.split()),
        "new_words": len(compacted.split()),
    }
    state_path.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8", newline="\n")
    return {"path": str(path), "status": "updated", **state}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", action="append", dest="roots", help="Repository root. May be repeated.")
    parser.add_argument("--date", default=today_string(), help="Local rollover date in YYYY-MM-DD.")
    parser.add_argument("--force", action="store_true", help="Rerun even if state says this date already rolled over.")
    parser.add_argument("--dry-run", action="store_true", help="Report planned changes without writing.")
    args = parser.parse_args()
    roots = [Path(item) for item in args.roots] if args.roots else DEFAULT_ROOTS
    results = [process_file(path, args.date, args.force, args.dry_run) for path in role_memory_files(roots)]
    print(json.dumps(results, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
