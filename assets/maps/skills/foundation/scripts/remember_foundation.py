#!/usr/bin/env python3
"""Read and write MAPS foundation preferences for a project."""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_PREFS = {
    "version": 1,
    "notesRoot": "notes",
    "sourcesRoot": "sources",
    "memoryRoot": "memory",
    "rag": {
        "provider": "",
        "location": "",
        "indexPath": "",
        "notes": "",
    },
    "updatedAt": "",
}


def codex_home() -> Path:
    return Path(os.environ.get("CODEX_HOME") or Path.home() / ".codex")


def preference_path(project: Path, global_default: bool = False) -> Path:
    if global_default:
        return codex_home() / "maps" / "foundation-preferences.json"
    return project / ".maps" / "foundation-preferences.json"


def load_json(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def merge_preferences(existing: dict[str, Any] | None, updates: dict[str, Any]) -> dict[str, Any]:
    prefs = dict(DEFAULT_PREFS)
    if existing:
        prefs.update(existing)
        prefs["rag"] = {**DEFAULT_PREFS["rag"], **existing.get("rag", {})}
    for key in ("notesRoot", "sourcesRoot", "memoryRoot"):
        if updates.get(key):
            prefs[key] = updates[key]
    rag_updates = {key: value for key, value in updates.get("rag", {}).items() if value}
    prefs["rag"] = {**prefs.get("rag", {}), **rag_updates}
    prefs["updatedAt"] = datetime.now(timezone.utc).isoformat()
    return prefs


def write_json(path: Path, prefs: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(prefs, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def show(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    project_prefs = load_json(preference_path(project))
    global_prefs = load_json(preference_path(project, global_default=True))
    result = {
        "projectPreferencePath": str(preference_path(project)),
        "globalPreferencePath": str(preference_path(project, global_default=True)),
        "activeSource": "project" if project_prefs else "global" if global_prefs else "default",
        "preferences": project_prefs or global_prefs or DEFAULT_PREFS,
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def remember(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    path = preference_path(project, global_default=args.global_default)
    existing = load_json(path)
    updates = {
        "notesRoot": args.notes_root,
        "sourcesRoot": args.sources_root,
        "memoryRoot": args.memory_root,
        "rag": {
            "provider": args.rag_provider,
            "location": args.rag_location,
            "indexPath": args.rag_index_path,
            "notes": args.rag_notes,
        },
    }
    prefs = merge_preferences(existing, updates)
    write_json(path, prefs)
    print(json.dumps({"written": str(path), "preferences": prefs}, indent=2, sort_keys=True))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Read or write MAPS foundation preferences.")
    subparsers = parser.add_subparsers(required=True)

    show_parser = subparsers.add_parser("show", help="Show active project or global preferences.")
    show_parser.add_argument("--project", default=".", help="Project directory.")
    show_parser.set_defaults(func=show)

    remember_parser = subparsers.add_parser("remember", help="Remember foundation locations.")
    remember_parser.add_argument("--project", default=".", help="Project directory.")
    remember_parser.add_argument("--global-default", action="store_true", help="Write the global default instead of project preferences.")
    remember_parser.add_argument("--notes-root", default="", help="Notes root path.")
    remember_parser.add_argument("--sources-root", default="", help="Sources root path.")
    remember_parser.add_argument("--memory-root", default="", help="Memory root path.")
    remember_parser.add_argument("--rag-provider", default="", help="RAG provider or framework.")
    remember_parser.add_argument("--rag-location", default="", help="RAG config, index, or storage location.")
    remember_parser.add_argument("--rag-index-path", default="", help="RAG index path.")
    remember_parser.add_argument("--rag-notes", default="", help="Additional RAG notes.")
    remember_parser.set_defaults(func=remember)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
