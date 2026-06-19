#!/usr/bin/env python3
"""Shared MAPS memory helper for project skill runs."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

import remember_foundation


SKILL_ROUTES: dict[str, dict[str, str]] = {
    "/foundation": {"phase": "M0", "slug": "foundation", "title": "M0 Project Foundation"},
    "/shape": {"phase": "M1", "slug": "shape", "title": "M1 System Shape"},
    "/phase-alignment": {"phase": "M00", "slug": "phase-alignment", "title": "Phase Alignment"},
    "/scaffold": {"phase": "Scaffold", "slug": "scaffold", "title": "MAPS Scaffold"},
    "/define-agent": {"phase": "A1", "slug": "define-agent", "title": "A1 Define Agent"},
    "/design-agent": {"phase": "A2", "slug": "design-agent", "title": "A2 Design Agent"},
    "/design-experience": {"phase": "M8/A2", "slug": "design-experience", "title": "Experience Design"},
    "/design-experience++": {"phase": "M8/A2++", "slug": "design-experience-plus-plus", "title": "Experience Design Plus Plus"},
    "/build-agent": {"phase": "A3", "slug": "build-agent", "title": "A3 Build Agent"},
    "/equip-agent": {"phase": "A4", "slug": "equip-agent", "title": "A4 Equip Agent"},
    "/evaluate-agent": {"phase": "A5", "slug": "evaluate-agent", "title": "A5 Evaluate Agent"},
    "/deploy-agent": {"phase": "A6", "slug": "deploy-agent", "title": "A6 Deploy Agent"},
    "/observe-agent": {"phase": "A7", "slug": "observe-agent", "title": "A7 Observe Agent"},
    "/improve-agent": {"phase": "A8", "slug": "improve-agent", "title": "A8 Improve Agent"},
}


def project_path(path: Path, value: str) -> Path:
    result = Path(value)
    if not result.is_absolute():
        result = path / result
    return result


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower())
    return slug.strip("-") or "project"


def project_slug(project: Path, prefs: dict[str, Any]) -> str:
    for key in ("projectSlug", "projectName", "name"):
        if prefs.get(key):
            return slugify(str(prefs[key]))
    return slugify(project.name)


def resolve_placeholders(value: str, project: Path, prefs: dict[str, Any]) -> str:
    if not value:
        return value
    slug = project_slug(project, prefs)
    replacements = {
        "[project]": slug,
        "{project}": slug,
        "${project}": slug,
    }
    for placeholder, replacement in replacements.items():
        value = value.replace(placeholder, replacement)
    return value


def configured_path(project: Path, prefs: dict[str, Any], value: str) -> Path:
    return project_path(project, resolve_placeholders(value, project, prefs))


def load_preferences(project: Path) -> tuple[dict[str, Any], str]:
    project_prefs = remember_foundation.load_json(remember_foundation.preference_path(project))
    if project_prefs:
        return project_prefs, "project"
    global_prefs = remember_foundation.load_json(remember_foundation.preference_path(project, global_default=True))
    if global_prefs:
        return global_prefs, "global"
    return dict(remember_foundation.DEFAULT_PREFS), "default"


def route_for(skill: str) -> dict[str, str]:
    if skill in SKILL_ROUTES:
        return SKILL_ROUTES[skill]
    slug = skill.strip().lower().replace("/", "").replace(" ", "-") or "maps-skill"
    return {"phase": "", "slug": slug, "title": skill or "MAPS Skill"}


def role_slug_from_output(output: str) -> str:
    if not output:
        return ""
    parts = Path(output).parts
    lowered = [part.lower() for part in parts]
    if "roles" in lowered:
        index = lowered.index("roles")
        if index + 1 < len(parts):
            return slugify(parts[index + 1])
    if "role" in lowered:
        index = lowered.index("role")
        if index + 1 < len(parts):
            return slugify(parts[index + 1])
    stem = Path(output).stem
    if stem and stem not in {"role-agent", "workflow", "loop"}:
        return slugify(stem)
    return ""


def should_prefix_project(project: Path, notes_root: Path, prefs: dict[str, Any]) -> bool:
    try:
        notes_root.resolve().relative_to(project.resolve())
        return False
    except ValueError:
        pass
    slug = project_slug(project, prefs)
    return slugify(notes_root.name) != slug


def note_slug(project: Path, prefs: dict[str, Any], skill: str, route: dict[str, str], output: str) -> str:
    if skill == "/role":
        role_slug = role_slug_from_output(output)
        return f"role-{role_slug}" if role_slug else "role-unknown"
    notes_root = configured_path(project, prefs, prefs.get("notesRoot", "notes"))
    if should_prefix_project(project, notes_root, prefs):
        return f"{project_slug(project, prefs)}-{route['slug']}-helper-notes"
    return f"{route['slug']}-helper-notes"


def read_body(args: argparse.Namespace, project: Path) -> str:
    parts: list[str] = []
    seen_files: set[Path] = set()
    if args.summary:
        parts.append(args.summary.strip())
    if args.summary_file:
        summary_path = project_path(project, args.summary_file)
        seen_files.add(summary_path.resolve())
        if summary_path.exists():
            body = summary_path.read_text(encoding="utf-8").strip()
            if len(body) > args.max_summary_chars:
                body = body[: args.max_summary_chars].rstrip() + "\n\n[Truncated for MAPS memory note.]"
            parts.append(body)
    if args.output:
        output_path = project_path(project, args.output)
        if output_path.exists() and output_path.resolve() not in seen_files and output_path.suffix.lower() in {".md", ".txt"}:
            body = output_path.read_text(encoding="utf-8").strip()
            if len(body) > args.max_summary_chars:
                body = body[: args.max_summary_chars].rstrip() + "\n\n[Truncated for MAPS memory note.]"
            parts.append(body)
    if parts:
        return "\n\n".join(parts)
    return "No summary was provided. Review the output artifact for details."


def append_skill_note(path: Path, title: str, skill: str, phase: str, output: str, memory_updates: str, notes: str, body: str, timestamp: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        existing = path.read_text(encoding="utf-8").rstrip()
    else:
        existing = f"# {title}\n\nThis note is maintained by the MAPS shared memory helper for `{skill}`.\n"
    entry = (
        f"\n\n## Run {timestamp}\n\n"
        f"- Skill: `{skill}`\n"
        f"- Phase: `{phase}`\n"
        f"- Output: `{output}`\n"
        f"- Memory updates: {memory_updates or 'None recorded.'}\n"
        f"- Notes: {notes or 'None recorded.'}\n\n"
        f"### Summary\n\n{body.strip()}\n"
    )
    path.write_text(existing + entry, encoding="utf-8")


def append_rag_manifest(project: Path, timestamp: str, skill: str, phase: str, note_path: Path, rag_note_path: Path | None, prefs: dict[str, Any]) -> Path:
    manifest = project / ".maps" / "rag-updates.json"
    existing = remember_foundation.load_json(manifest) or {"version": 1, "updates": []}
    rag = prefs.get("rag", {})
    existing.setdefault("updates", []).append(
        {
            "timestamp": timestamp,
            "skill": skill,
            "phase": phase,
            "notePath": str(note_path),
            "ragNotePath": str(rag_note_path) if rag_note_path else "",
            "ragProvider": rag.get("provider", ""),
            "ragLocation": rag.get("location", ""),
            "ragIndexPath": rag.get("indexPath", ""),
            "needsReindex": True,
        }
    )
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(json.dumps(existing, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return manifest


def update_foundation_run_log(project: Path, foundation_file: str, skill: str, phase: str, output: str, memory_updates: str, notes: str, timestamp: str) -> Path:
    path = remember_foundation.foundation_path(project, foundation_file)
    if path.exists():
        markdown = path.read_text(encoding="utf-8")
    else:
        markdown = remember_foundation.seed_template_text()
    markdown = remember_foundation.append_run_log(
        markdown,
        skill=skill,
        phase=phase,
        output=output,
        memory_updates=memory_updates,
        notes=notes,
        timestamp=timestamp,
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(markdown, encoding="utf-8")
    return path


def complete_run(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    route = route_for(args.skill)
    phase = args.phase or route["phase"]
    timestamp = args.timestamp or remember_foundation.utc_now()
    prefs, source = load_preferences(project)
    notes_root = configured_path(project, prefs, prefs.get("notesRoot", "notes"))
    run_note_slug = note_slug(project, prefs, args.skill, route, args.output)
    note_path = notes_root / "maps-runs" / f"{run_note_slug}.md"
    body = read_body(args, project)
    memory_updates = args.memory_updates or f"Updated {note_path}"
    append_skill_note(
        note_path,
        title=route["title"],
        skill=args.skill,
        phase=phase,
        output=args.output,
        memory_updates=memory_updates,
        notes=args.notes,
        body=body,
        timestamp=timestamp,
    )

    rag = prefs.get("rag", {})
    rag_note_path: Path | None = None
    rag_location = rag.get("location", "")
    if rag_location:
        rag_root = configured_path(project, prefs, rag_location)
        rag_note_path = rag_root / "maps-runs" / f"{run_note_slug}.md"
        if rag_note_path.resolve() != note_path.resolve():
            append_skill_note(
                rag_note_path,
                title=f"{route['title']} RAG Note",
                skill=args.skill,
                phase=phase,
                output=args.output,
                memory_updates=memory_updates,
                notes=args.notes,
                body=body,
                timestamp=timestamp,
            )

    manifest = append_rag_manifest(project, timestamp, args.skill, phase, note_path, rag_note_path, prefs)
    foundation = update_foundation_run_log(
        project,
        foundation_file=args.foundation_file,
        skill=args.skill,
        phase=phase,
        output=args.output,
        memory_updates=memory_updates,
        notes=args.notes,
        timestamp=timestamp,
    )
    result = {
        "foundationFile": str(foundation),
        "preferenceSource": source,
        "skillNote": str(note_path),
        "ragNote": str(rag_note_path) if rag_note_path else "",
        "ragManifest": str(manifest),
        "skill": args.skill,
        "phase": phase,
        "timestamp": timestamp,
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


def status(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    prefs, source = load_preferences(project)
    routes = {
        skill: str(configured_path(project, prefs, prefs.get("notesRoot", "notes")) / "maps-runs" / f"{note_slug(project, prefs, skill, route, '')}.md")
        for skill, route in SKILL_ROUTES.items()
    }
    print(json.dumps({"preferenceSource": source, "preferences": prefs, "skillNotes": routes}, indent=2, sort_keys=True))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Shared MAPS memory helper.")
    subparsers = parser.add_subparsers(required=True)

    status_parser = subparsers.add_parser("status", help="Show MAPS memory routing.")
    status_parser.add_argument("--project", default=".", help="Project directory.")
    status_parser.set_defaults(func=status)

    complete_parser = subparsers.add_parser("complete-run", help="Write a per-skill note and stamp project-foundation.md.")
    complete_parser.add_argument("--project", default=".", help="Project directory.")
    complete_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    complete_parser.add_argument("--skill", required=True, help="Skill name, such as /shape.")
    complete_parser.add_argument("--phase", default="", help="MAPS/APS phase. Defaults from the skill route.")
    complete_parser.add_argument("--output", default="", help="Primary output artifact path.")
    complete_parser.add_argument("--summary", default="", help="Short summary to append to the per-skill note.")
    complete_parser.add_argument("--summary-file", default="", help="Markdown or text file to append to the per-skill note.")
    complete_parser.add_argument("--memory-updates", default="", help="Memory stores updated.")
    complete_parser.add_argument("--notes", default="", help="Short run note.")
    complete_parser.add_argument("--timestamp", default="", help="ISO timestamp. Defaults to now.")
    complete_parser.add_argument("--max-summary-chars", type=int, default=6000, help="Maximum copied characters from summary/output files.")
    complete_parser.set_defaults(func=complete_run)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
