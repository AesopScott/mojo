#!/usr/bin/env python3
"""Read and write MAPS foundation preferences and project control pages."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
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


def living_template_path() -> Path:
    return codex_home() / "maps" / "templates" / "project-foundation.md"


def bundled_template_path() -> Path:
    candidates = [
        Path(__file__).resolve().parents[1] / "templates" / "project-foundation.md",
        Path(__file__).resolve().parents[3] / "templates" / "project-foundation.md",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[0]


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


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def markdown_escape(value: str) -> str:
    return (value or "").replace("|", "\\|").replace("\n", " ").strip()


def foundation_path(project: Path, foundation_file: str) -> Path:
    path = Path(foundation_file)
    if not path.is_absolute():
        path = project / path
    return path


def seed_template_text() -> str:
    living = living_template_path()
    if living.exists():
        return living.read_text(encoding="utf-8")
    bundled = bundled_template_path()
    if bundled.exists():
        return bundled.read_text(encoding="utf-8")
    return "# Project Foundation\n"


def replace_section(markdown: str, heading: str, body: str) -> str:
    section = f"## {heading}\n\n{body.strip()}\n"
    pattern = re.compile(rf"(?ms)^## {re.escape(heading)}\s*\n.*?(?=^## |\Z)")
    if pattern.search(markdown):
        return pattern.sub(section, markdown).rstrip() + "\n"
    return markdown.rstrip() + "\n\n" + section


def remembered_preferences_section(prefs: dict[str, Any], source: str) -> str:
    rag = prefs.get("rag", {})
    lines = [
        f"- Preference source: {source}",
        f"- Notes root: {prefs.get('notesRoot', '')}",
        f"- Sources root: {prefs.get('sourcesRoot', '')}",
        f"- Memory root: {prefs.get('memoryRoot', '')}",
        f"- RAG provider: {rag.get('provider', '')}",
        f"- RAG location: {rag.get('location', '')}",
        f"- RAG index path: {rag.get('indexPath', '')}",
        f"- Last confirmed: {prefs.get('updatedAt', '')}",
        "- Global default used?: " + ("yes" if source == "global" else "no"),
        "- Updated `.maps/foundation-preferences.json`?: yes",
    ]
    return "\n".join(lines)


def memory_contract_section(prefs: dict[str, Any]) -> str:
    notes = prefs.get("notesRoot", "notes")
    sources = prefs.get("sourcesRoot", "sources")
    memory = prefs.get("memoryRoot", "memory")
    rag = prefs.get("rag", {})
    rag_location = rag.get("location") or rag.get("indexPath") or ""
    rag_provider = rag.get("provider") or "Configured RAG"
    rows = [
        ["Project notes", "Markdown notes", notes, "Human-readable working notes, interviews, research, and decisions.", "New findings, decisions, assumptions, or research notes.", "Append or create dated notes in the appropriate notes folder.", "Summaries may be indexed into RAG if approved.", "Yes for human decisions.", "Secrets, raw private data, unsupported claims."],
        ["Sources", "Source library", sources, "Original evidence, documents, transcripts, screenshots, and links.", "New approved source or changed source.", "Add source and update source inventory.", "RAG indexes approved sources.", "Yes for evidence.", "Unapproved, private, or uncited material."],
        ["Project memory", "Markdown memory", memory, "Durable project context, glossary, and entity map.", "Stable project facts, terms, entities, or durable context changes.", "Edit the relevant memory file with concise updates.", "Keep aligned with notes and source inventory.", "Yes for project context.", "Temporary scratch notes."],
        ["RAG index", rag_provider, rag_location, "Queryable project knowledge.", "New or changed approved sources or memory.", "Re-index changed inputs according to the configured provider.", "Mirrors approved sources and selected memory/notes.", "No, derived from canonical stores.", "Unapproved sources or secrets."],
        ["MAPS state", "JSON state", ".maps/foundation-preferences.json", "Remembered scaffold and memory configuration for future skill runs.", "Every foundation configuration change.", "Structured JSON update.", "Reflect important choices in this document.", "Yes for automation defaults.", "Long prose or raw evidence."],
    ]
    table = [
        "| Store | Type | Location | Purpose | Update trigger | Update method | Sync rule | Canonical? | Do not write |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    table.extend("| " + " | ".join(markdown_escape(cell) for cell in row) + " |" for row in rows)
    return "\n".join(table)


def ensure_run_log(markdown: str) -> str:
    body = "| Timestamp | Skill | Phase | Output | Memory updates | Notes |\n|---|---|---|---|---|---|"
    if "## MAPS Skill Run Log" not in markdown:
        return replace_section(markdown, "MAPS Skill Run Log", body)
    return markdown


def append_run_log(markdown: str, skill: str, phase: str, output: str, memory_updates: str, notes: str, timestamp: str) -> str:
    markdown = ensure_run_log(markdown)
    row = f"| {markdown_escape(timestamp)} | {markdown_escape(skill)} | {markdown_escape(phase)} | {markdown_escape(output)} | {markdown_escape(memory_updates)} | {markdown_escape(notes)} |"
    pattern = re.compile(r"(?ms)^## MAPS Skill Run Log\s*\n(.*?)(?=^## |\Z)")
    match = pattern.search(markdown)
    if not match:
        return markdown.rstrip() + "\n\n" + row + "\n"
    section = match.group(0).rstrip()
    if row in section:
        return markdown
    updated = section + "\n" + row + "\n"
    return markdown[:match.start()] + updated + markdown[match.end():]


def apply_to_foundation_file(path: Path, prefs: dict[str, Any], source: str) -> None:
    if path.exists():
        markdown = path.read_text(encoding="utf-8")
    else:
        markdown = seed_template_text()
    markdown = replace_section(markdown, "Remembered Foundation Preferences", remembered_preferences_section(prefs, source))
    markdown = replace_section(markdown, "Persistent Memory Contract", memory_contract_section(prefs))
    markdown = ensure_run_log(markdown)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(markdown, encoding="utf-8")


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
    if not args.global_default and args.apply:
        apply_to_foundation_file(foundation_path(project, args.foundation_file), prefs, "project")
    print(json.dumps({"written": str(path), "preferences": prefs}, indent=2, sort_keys=True))
    return 0


def apply(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    project_prefs = load_json(preference_path(project))
    global_prefs = load_json(preference_path(project, global_default=True))
    prefs = project_prefs or global_prefs or DEFAULT_PREFS
    source = "project" if project_prefs else "global" if global_prefs else "default"
    path = foundation_path(project, args.foundation_file)
    apply_to_foundation_file(path, prefs, source)
    print(json.dumps({"updated": str(path), "preferenceSource": source}, indent=2, sort_keys=True))
    return 0


def stamp_run(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    path = foundation_path(project, args.foundation_file)
    if path.exists():
        markdown = path.read_text(encoding="utf-8")
    else:
        markdown = seed_template_text()
    markdown = append_run_log(
        markdown,
        skill=args.skill,
        phase=args.phase,
        output=args.output,
        memory_updates=args.memory_updates,
        notes=args.notes,
        timestamp=args.timestamp or utc_now(),
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(markdown, encoding="utf-8")
    print(json.dumps({"updated": str(path), "skill": args.skill, "phase": args.phase}, indent=2, sort_keys=True))
    return 0


def promote_template(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    source = foundation_path(project, args.foundation_file)
    if not source.exists():
        raise FileNotFoundError(f"Foundation file not found: {source}")
    target = living_template_path()
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
    print(json.dumps({"promoted": str(source), "livingTemplate": str(target)}, indent=2, sort_keys=True))
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
    remember_parser.add_argument("--apply", action="store_true", help="Also update the project foundation file.")
    remember_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    remember_parser.set_defaults(func=remember)

    apply_parser = subparsers.add_parser("apply", help="Apply remembered preferences to project-foundation.md.")
    apply_parser.add_argument("--project", default=".", help="Project directory.")
    apply_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    apply_parser.set_defaults(func=apply)

    stamp_parser = subparsers.add_parser("stamp-run", help="Append a MAPS skill run to project-foundation.md.")
    stamp_parser.add_argument("--project", default=".", help="Project directory.")
    stamp_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    stamp_parser.add_argument("--skill", required=True, help="Skill name.")
    stamp_parser.add_argument("--phase", default="", help="MAPS/APS phase.")
    stamp_parser.add_argument("--output", default="", help="Output artifact path.")
    stamp_parser.add_argument("--memory-updates", default="", help="Memory stores updated.")
    stamp_parser.add_argument("--notes", default="", help="Short run note.")
    stamp_parser.add_argument("--timestamp", default="", help="ISO timestamp. Defaults to now.")
    stamp_parser.set_defaults(func=stamp_run)

    promote_parser = subparsers.add_parser("promote-template", help="Promote project-foundation.md to the global living template.")
    promote_parser.add_argument("--project", default=".", help="Project directory.")
    promote_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    promote_parser.set_defaults(func=promote_template)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
