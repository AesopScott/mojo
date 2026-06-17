#!/usr/bin/env python3
"""Initialize and track an APS project."""

from __future__ import annotations

import argparse
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path


PHASES = [
    ("A0", "Phase Alignment", ["phase-alignment", "scaffold"]),
    ("A1", "Define", ["define-agent"]),
    ("A2", "Design", ["design-agent"]),
    ("A2X", "Optional Experience Design", ["design-experience"]),
    ("A3", "Build", ["build-agent-plus-plus", "build-agent"]),
    ("A4", "Equip", ["equip-agent"]),
    ("A5", "Evaluate", ["evaluate-agent-plus-plus", "evaluate-agent"]),
    ("A6", "Deploy", ["deploy-agent-plus-plus", "deploy-agent"]),
    ("A7", "Observe", ["observe-agent", "observe-agent-smith", "observe-agent-fuse", "observe-agent-phoenix"]),
    ("A8", "Improve", ["improve-agent"]),
]


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def plugin_root() -> Path:
    return Path(__file__).resolve().parents[3]


def progress_path(project: Path) -> Path:
    return project / ".aps" / "progress.json"


def copy_tree(src: Path, dest: Path) -> None:
    if not src.exists():
        return
    if dest.exists():
        shutil.copytree(src, dest, dirs_exist_ok=True)
    else:
        shutil.copytree(src, dest)


def init_project(args: argparse.Namespace) -> None:
    project = Path(args.project).resolve()
    aps_dir = project / ".aps"
    agent_dir = project / "agents" / args.agent_handle
    root = plugin_root()

    project.mkdir(parents=True, exist_ok=True)
    aps_dir.mkdir(parents=True, exist_ok=True)
    agent_dir.mkdir(parents=True, exist_ok=True)

    copy_tree(root / "skills", aps_dir / "skills")
    copy_tree(root / "assets" / "templates", aps_dir / "templates")
    copy_tree(root / "assets" / "catalogs", aps_dir / "catalogs")

    path = progress_path(project)
    if path.exists() and not args.force:
        raise SystemExit(f"Progress already exists: {path}. Use --force to reinitialize.")

    progress = {
        "schema": "aps-progress/v1",
        "project": project.name,
        "agentHandle": args.agent_handle,
        "createdAt": utc_now(),
        "updatedAt": utc_now(),
        "currentPhase": "A0",
        "phases": [
            {
                "id": phase_id,
                "name": name,
                "skills": skills,
                "status": "pending",
                "artifacts": [],
                "notes": [],
                "updatedAt": None,
            }
            for phase_id, name, skills in PHASES
        ],
    }
    progress["phases"][0]["status"] = "in_progress"
    progress["phases"][0]["updatedAt"] = utc_now()

    path.write_text(json.dumps(progress, indent=2) + "\n", encoding="utf-8")
    print(path)


def load_progress(project: Path) -> dict:
    path = progress_path(project)
    if not path.exists():
        raise SystemExit(f"No APS progress file found at {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def save_progress(project: Path, progress: dict) -> None:
    progress["updatedAt"] = utc_now()
    progress_path(project).write_text(json.dumps(progress, indent=2) + "\n", encoding="utf-8")


def advance(args: argparse.Namespace) -> None:
    project = Path(args.project).resolve()
    progress = load_progress(project)
    phase = next((item for item in progress["phases"] if item["id"] == args.phase), None)
    if not phase:
        raise SystemExit(f"Unknown phase: {args.phase}")

    if args.status == "in_progress":
        for item in progress["phases"]:
            if item["status"] == "in_progress" and item["id"] != args.phase:
                item["status"] = "pending"

    phase["status"] = args.status
    phase["updatedAt"] = utc_now()
    if args.artifact and args.artifact not in phase["artifacts"]:
        phase["artifacts"].append(args.artifact)
    if args.note:
        phase["notes"].append({"at": utc_now(), "text": args.note})

    if args.status == "complete":
        ids = [item["id"] for item in progress["phases"]]
        index = ids.index(args.phase)
        next_phase = next((item for item in progress["phases"][index + 1 :] if item["status"] == "pending"), None)
        progress["currentPhase"] = next_phase["id"] if next_phase else args.phase
    else:
        progress["currentPhase"] = args.phase

    save_progress(project, progress)
    print(progress_path(project))


def show_status(args: argparse.Namespace) -> None:
    progress = load_progress(Path(args.project).resolve())
    print(f"{progress['project']} ({progress['agentHandle']}) current: {progress['currentPhase']}")
    for phase in progress["phases"]:
        print(f"{phase['id']}: {phase['status']} - {phase['name']}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Initialize and track an APS project.")
    sub = parser.add_subparsers(dest="command", required=True)

    init = sub.add_parser("init")
    init.add_argument("project")
    init.add_argument("--agent-handle", required=True)
    init.add_argument("--force", action="store_true")
    init.set_defaults(func=init_project)

    adv = sub.add_parser("advance")
    adv.add_argument("project")
    adv.add_argument("--phase", required=True)
    adv.add_argument("--status", choices=["pending", "in_progress", "complete", "blocked", "skipped"], required=True)
    adv.add_argument("--artifact")
    adv.add_argument("--note")
    adv.set_defaults(func=advance)

    status = sub.add_parser("status")
    status.add_argument("project")
    status.set_defaults(func=show_status)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
