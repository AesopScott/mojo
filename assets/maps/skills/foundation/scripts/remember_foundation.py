#!/usr/bin/env python3
"""Read and write MAPS foundation preferences and project control pages."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_PREFS = {
    "version": 1,
    "notesRoot": "notes",
    "additionalNotesLocations": [],
    "sourcesRoot": "sources",
    "memoryRoot": "memory",
    "canonicalStorePolicy": "",
    "access": {
        "notes": "filesystem",
        "sources": "filesystem",
        "memory": "filesystem",
        "rag": "",
    },
    "rag": {
        "provider": "",
        "location": "",
        "indexPath": "",
        "notes": "",
        "additionalLocations": [],
    },
    "updatedAt": "",
}


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower())
    return slug.strip("-") or "project"


def project_slug(project: Path, prefs: dict[str, Any]) -> str:
    for key in ("projectSlug", "projectName", "name"):
        if prefs.get(key):
            return slugify(str(prefs[key]))
    return slugify(project.name)


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
    if updates.get("additionalNotesLocations"):
        prefs["additionalNotesLocations"] = updates["additionalNotesLocations"]
    if updates.get("canonicalStorePolicy"):
        prefs["canonicalStorePolicy"] = updates["canonicalStorePolicy"]
    access_updates = {key: value for key, value in updates.get("access", {}).items() if value}
    prefs["access"] = {**DEFAULT_PREFS["access"], **prefs.get("access", {}), **access_updates}
    rag_updates = {key: value for key, value in updates.get("rag", {}).items() if value}
    if updates.get("rag", {}).get("additionalLocations"):
        rag_updates["additionalLocations"] = updates["rag"]["additionalLocations"]
    prefs["rag"] = {**prefs.get("rag", {}), **rag_updates}
    prefs["updatedAt"] = datetime.now(timezone.utc).isoformat()
    return prefs


def write_json(path: Path, prefs: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(prefs, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def write_if_missing(path: Path, content: str) -> bool:
    if path.exists():
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def ensure_gitignore_entries(path: Path, entries: list[str]) -> list[str]:
    existing = path.read_text(encoding="utf-8") if path.exists() else ""
    lines = existing.splitlines()
    normalized = {line.strip() for line in lines}
    added: list[str] = []
    if existing and not existing.endswith("\n"):
        existing += "\n"
    for entry in entries:
        if entry not in normalized:
            existing += entry + "\n"
            added.append(entry)
    if added:
        path.write_text(existing, encoding="utf-8")
    return added


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def markdown_escape(value: str) -> str:
    return (value or "").replace("|", "\\|").replace("\n", " ").strip()


def split_values(value: str) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in re.split(r"[;\n]", value) if part.strip()]


def join_values(values: Any) -> str:
    if not values:
        return ""
    if isinstance(values, str):
        return values
    return "; ".join(str(value) for value in values if str(value).strip())


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
    access = {**DEFAULT_PREFS["access"], **prefs.get("access", {})}
    lines = [
        f"- Preference source: {source}",
        f"- Notes root: {prefs.get('notesRoot', '')}",
        f"- Notes access method: {access.get('notes', '')}",
        f"- Additional notes locations: {join_values(prefs.get('additionalNotesLocations', []))}",
        f"- Sources root: {prefs.get('sourcesRoot', '')}",
        f"- Sources access method: {access.get('sources', '')}",
        f"- Memory root: {prefs.get('memoryRoot', '')}",
        f"- Memory access method: {access.get('memory', '')}",
        f"- RAG provider: {rag.get('provider', '')}",
        f"- RAG location: {rag.get('location', '')}",
        f"- RAG index path: {rag.get('indexPath', '')}",
        f"- RAG access method: {access.get('rag', '')}",
        f"- Additional RAG locations: {join_values(rag.get('additionalLocations', []))}",
        f"- Canonical store policy: {prefs.get('canonicalStorePolicy', '')}",
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
    access = {**DEFAULT_PREFS["access"], **prefs.get("access", {})}
    rag_location = rag.get("location") or rag.get("indexPath") or ""
    rag_provider = rag.get("provider") or "Configured RAG"
    rows = [
        ["Project notes", f"Markdown notes via {access.get('notes', 'filesystem')}", notes, "Human-readable working notes, interviews, research, and decisions.", "New findings, decisions, assumptions, or research notes.", "Append or create dated notes in the appropriate notes folder.", "Summaries may be indexed into RAG if approved.", "Yes for human decisions.", "Secrets, raw private data, unsupported claims."],
        ["Additional notes", f"Secondary notes via {access.get('notes', 'filesystem')}", join_values(prefs.get("additionalNotesLocations", [])), "Optional secondary vaults, folders, services, or exports.", "When the canonical notes policy says to mirror or update them.", "Update only according to the canonical store policy.", "May be read-only, mirrored, or synced from canonical notes.", "Only if marked canonical.", "Secrets or unapproved private notes."],
        ["Skill run notes", f"Markdown notes via {access.get('notes', 'filesystem')}", f"{notes}/maps-runs/[project]-[skill]-helper-notes.md; role-[role-name].md for role entries", "One named helper note per MAPS skill, maintained by the shared memory helper.", "Every MAPS skill completion.", "Append the run summary to the helper note through maps_memory.py complete-run.", "Mirror to the configured RAG location when available.", "Yes for phase summaries.", "Raw secrets, large logs, or uncited source dumps."],
        ["Sources", f"Source library via {access.get('sources', 'filesystem')}", sources, "Original evidence, documents, transcripts, screenshots, and links.", "New approved source or changed source.", "Add source and update source inventory.", "RAG indexes approved sources.", "Yes for evidence.", "Unapproved, private, or uncited material."],
        ["Project memory", f"Markdown memory via {access.get('memory', 'filesystem')}", memory, "Durable project context, glossary, and entity map.", "Stable project facts, terms, entities, or durable context changes.", "Edit the relevant memory file with concise updates.", "Keep aligned with notes and source inventory.", "Yes for project context.", "Temporary scratch notes."],
        ["RAG index", f"{rag_provider} via {access.get('rag', '')}".strip(), rag_location, "Queryable project knowledge.", "New or changed approved sources or memory.", "Re-index changed inputs according to the configured provider.", "Mirrors approved sources and selected memory/notes.", "No, derived from canonical stores.", "Unapproved sources or secrets."],
        ["Additional RAG indexes", f"Secondary RAG via {access.get('rag', '')}".strip(), join_values(rag.get("additionalLocations", [])), "Optional secondary indexes, vector stores, service endpoints, or experiments.", "When approved source, notes, or memory changes should be mirrored.", "Update only according to the canonical store policy.", "Derived from canonical notes, sources, or memory.", "No, unless explicitly marked canonical.", "Unapproved sources, secrets, or raw private data."],
        ["RAG update manifest", "JSON state", ".maps/rag-updates.json", "Append-only list of skill notes and memory files that need RAG reindexing.", "Every helper-written skill note or RAG mirror.", "Append a needsReindex entry through maps_memory.py complete-run.", "Used by future indexing automation.", "No, derived from changed stores.", "Long prose or raw evidence."],
        ["MAPS state", "JSON state", ".maps/foundation-preferences.json", "Remembered scaffold and memory configuration for future skill runs.", "Every foundation configuration change.", "Structured JSON update.", "Reflect important choices in this document.", "Yes for automation defaults.", "Long prose or raw evidence."],
        ["Env/secrets template", "Text config template", ".env.example", "Documents required environment variables and secret names without storing secret values.", "New integration, provider, model, API, or deployment secret requirement.", "Add placeholder names and comments only.", "Real values live in ignored local env files or a platform secrets manager.", "Yes for secret names, not values.", "Secret values, tokens, passwords, private keys."],
    ]
    table = [
        "| Store | Type | Location | Purpose | Update trigger | Update method | Sync rule | Canonical? | Do not write |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    table.extend("| " + " | ".join(markdown_escape(cell) for cell in row) + " |" for row in rows)
    return "\n".join(table)


def git_and_secrets_section() -> str:
    return """| Item | Status | Notes |
|---|---|---|
| Git repository | not checked / already initialized / initialized by M0 / skipped / blocked |  |
| `.gitignore` env rules | not checked / present / added by M0 / blocked |  |
| `.env.example` | not checked / present / created by M0 / blocked | Placeholder keys only; no real secrets. |
| `.env.local` | not requested / present / created by M0 / skipped | Ignored local developer secrets file; create only with confirmation. |
| Secrets manager | none yet / local env / platform secrets / external vault |  |

Secret handling rules:

- Never write real secret values into tracked files.
- Keep `.env.example` tracked as the documented template.
- Keep `.env`, `.env.*`, and `*.local` ignored except `.env.example`.
- Record required secrets by name, purpose, owner, and configuration location."""


def incremental_foundation_audit_section() -> str:
    return """| Item | Exists? | Action Taken | Still Missing |
|---|---|---|---|
| `project-foundation.md` |  |  |  |
| `.maps/foundation-preferences.json` |  |  |  |
| `.maps/rag-updates.json` |  |  |  |
| Git repository |  |  |  |
| `.gitignore` env rules |  |  |  |
| `.env.example` |  |  |  |
| Notes scaffold |  |  |  |
| Sources scaffold |  |  |  |
| Memory scaffold |  |  |  |"""


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
    markdown = replace_section(markdown, "Git And Secrets Scaffold", git_and_secrets_section())
    markdown = replace_section(markdown, "Incremental Foundation Audit", incremental_foundation_audit_section())
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
        "additionalNotesLocations": split_values(args.additional_notes_locations),
        "sourcesRoot": args.sources_root,
        "memoryRoot": args.memory_root,
        "canonicalStorePolicy": args.canonical_store_policy,
        "access": {
            "notes": args.notes_access,
            "sources": args.sources_access,
            "memory": args.memory_access,
            "rag": args.rag_access,
        },
        "rag": {
            "provider": args.rag_provider,
            "location": args.rag_location,
            "indexPath": args.rag_index_path,
            "notes": args.rag_notes,
            "additionalLocations": split_values(args.additional_rag_locations),
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


def is_relative_to(path: Path, parent: Path) -> bool:
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False


def scaffold_paths(project: Path, foundation_file: str) -> tuple[list[Path], list[Path]]:
    prefs = load_json(preference_path(project)) or DEFAULT_PREFS
    notes = Path(prefs.get("notesRoot") or "notes")
    sources = Path(prefs.get("sourcesRoot") or "sources")
    memory = Path(prefs.get("memoryRoot") or "memory")
    rag_location = Path(prefs.get("rag", {}).get("location") or "__maps_no_rag__")

    def under_project(value: Path) -> Path:
        return value if value.is_absolute() else project / value

    notes_root = under_project(notes)
    sources_root = under_project(sources)
    memory_root = under_project(memory)
    rag_root = under_project(rag_location)
    foundation_helper_name = f"{project_slug(project, prefs)}-foundation-helper-notes.md"

    files = [
        foundation_path(project, foundation_file),
        preference_path(project),
        project / ".maps" / "rag-updates.json",
        notes_root / "maps-runs" / foundation_helper_name,
        notes_root / "maps-runs" / "foundation-helper-notes.md",
        notes_root / "maps-runs" / "foundation.md",
        sources_root / "links.md",
        memory_root / "project-context.md",
        memory_root / "glossary.md",
        memory_root / "entity-map.md",
    ]
    if prefs.get("rag", {}).get("location"):
        files.append(rag_root / "maps-runs" / foundation_helper_name)
        files.append(rag_root / "maps-runs" / "foundation-helper-notes.md")
        files.append(rag_root / "maps-runs" / "foundation.md")

    dirs = [
        notes_root / "maps-runs",
        notes_root / "daily",
        notes_root / "interviews",
        notes_root / "research",
        notes_root / "decisions",
        sources_root / "docs",
        sources_root / "transcripts",
        sources_root / "screenshots",
        memory_root,
        sources_root,
        notes_root,
        project / ".maps",
    ]
    if prefs.get("rag", {}).get("location"):
        dirs.extend([rag_root / "maps-runs", rag_root])
    return files, dirs


def git_status(project: Path) -> dict[str, Any]:
    git_dir = project / ".git"
    git_available = shutil.which("git") is not None
    return {
        "gitAvailable": git_available,
        "isRepository": git_dir.exists(),
        "gitDir": str(git_dir),
    }


def env_example_text() -> str:
    return """# Project environment template.
# Copy to .env.local or configure these values in your platform secrets manager.
# Do not put real secrets in this tracked example file.

# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=
# CLOUDFLARE_API_TOKEN=
# GITHUB_TOKEN=

"""


def incremental_status(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    files, dirs = scaffold_paths(project, args.foundation_file)
    checks = []
    for path in dirs:
        checks.append({"path": str(path), "type": "directory", "exists": path.exists()})
    for path in files:
        checks.append({"path": str(path), "type": "file", "exists": path.exists()})
    extra_files = [
        project / ".gitignore",
        project / ".env.example",
    ]
    if args.include_local_env:
        extra_files.append(project / ".env.local")
    for path in extra_files:
        checks.append({"path": str(path), "type": "file", "exists": path.exists()})
    status = {
        "project": str(project),
        "git": git_status(project),
        "checks": checks,
        "missing": [item for item in checks if not item["exists"]],
    }
    print(json.dumps(status, indent=2, sort_keys=True))
    return 0


def scaffold(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    files, dirs = scaffold_paths(project, args.foundation_file)
    actions: list[dict[str, str]] = []
    prefs = load_json(preference_path(project)) or DEFAULT_PREFS

    def configured_root(key: str, default: str) -> Path:
        value = Path(prefs.get(key) or default)
        return value if value.is_absolute() else project / value

    for path in dirs:
        if args.dry_run:
            action = "exists" if path.exists() else "would-create"
        elif path.exists():
            action = "exists"
        else:
            path.mkdir(parents=True, exist_ok=True)
            action = "created"
        actions.append({"path": str(path), "type": "directory", "action": action})

    seed_files = {
        preference_path(project): json.dumps({**DEFAULT_PREFS, "updatedAt": datetime.now(timezone.utc).isoformat()}, indent=2, sort_keys=True) + "\n",
        project / ".maps" / "rag-updates.json": json.dumps({"version": 1, "updates": []}, indent=2) + "\n",
        project / ".env.example": env_example_text(),
        project / ".gitignore": "",
        foundation_path(project, args.foundation_file): seed_template_text(),
        configured_root("sourcesRoot", "sources") / "links.md": "# Links\n\n",
        configured_root("memoryRoot", "memory") / "project-context.md": "# Project Context\n\n",
        configured_root("memoryRoot", "memory") / "glossary.md": "# Glossary\n\n",
        configured_root("memoryRoot", "memory") / "entity-map.md": "# Entity Map\n\n",
    }
    if args.include_local_env:
        seed_files[project / ".env.local"] = "# Local developer secrets. Do not commit.\n"

    for path, content in seed_files.items():
        if args.dry_run:
            action = "exists" if path.exists() else "would-create"
        else:
            action = "created" if write_if_missing(path, content) else "exists"
        actions.append({"path": str(path), "type": "file", "action": action})

    gitignore_entries = [".env", ".env.*", "!.env.example", "*.local", ".maps/tmp/"]
    gitignore_path = project / ".gitignore"
    if args.dry_run:
        added = [entry for entry in gitignore_entries if not gitignore_path.exists() or entry not in {line.strip() for line in gitignore_path.read_text(encoding="utf-8").splitlines()}]
        actions.append({"path": str(gitignore_path), "type": "gitignore", "action": "would-add:" + ",".join(added) if added else "exists"})
    else:
        added = ensure_gitignore_entries(gitignore_path, gitignore_entries)
        actions.append({"path": str(gitignore_path), "type": "gitignore", "action": "added:" + ",".join(added) if added else "exists"})

    git = git_status(project)
    if git["isRepository"]:
        actions.append({"path": str(project / ".git"), "type": "git", "action": "exists"})
    elif not args.init_git:
        actions.append({"path": str(project / ".git"), "type": "git", "action": "not-requested"})
    elif not git["gitAvailable"]:
        actions.append({"path": str(project / ".git"), "type": "git", "action": "git-not-available"})
    elif args.dry_run:
        actions.append({"path": str(project / ".git"), "type": "git", "action": "would-init"})
    else:
        subprocess.run(["git", "init"], cwd=project, check=True, capture_output=True, text=True)
        actions.append({"path": str(project / ".git"), "type": "git", "action": "initialized"})

    print(json.dumps({"project": str(project), "dryRun": args.dry_run, "actions": actions}, indent=2, sort_keys=True))
    return 0


def remove_empty_dir(path: Path, force: bool) -> str:
    if not path.exists():
        return "missing"
    if not path.is_dir():
        return "not-directory"
    if force:
        shutil.rmtree(path)
        return "removed-force"
    try:
        path.rmdir()
        return "removed-empty"
    except OSError:
        return "kept-nonempty"


def wipe(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    files, dirs = scaffold_paths(project, args.foundation_file)
    actions: list[dict[str, str]] = []

    for path in files:
        resolved = path.resolve()
        if not is_relative_to(resolved, project):
            actions.append({"path": str(path), "type": "file", "action": "skip-outside-project"})
            continue
        if not path.exists():
            actions.append({"path": str(path), "type": "file", "action": "missing"})
            continue
        if args.confirm:
            path.unlink()
            actions.append({"path": str(path), "type": "file", "action": "removed"})
        else:
            actions.append({"path": str(path), "type": "file", "action": "would-remove"})

    for path in dirs:
        resolved = path.resolve()
        if not is_relative_to(resolved, project):
            actions.append({"path": str(path), "type": "directory", "action": "skip-outside-project"})
            continue
        if args.confirm:
            action = remove_empty_dir(path, args.force)
            actions.append({"path": str(path), "type": "directory", "action": action})
        else:
            action = "would-remove-force" if args.force else "would-remove-if-empty"
            if not path.exists():
                action = "missing"
            actions.append({"path": str(path), "type": "directory", "action": action})

    print(json.dumps({"confirmed": args.confirm, "force": args.force, "project": str(project), "actions": actions}, indent=2, sort_keys=True))
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
    remember_parser.add_argument("--notes-access", default="", help="How to access notes: filesystem, MCP service, REST API, or none.")
    remember_parser.add_argument("--additional-notes-locations", default="", help="Semicolon-separated secondary notes locations, vaults, services, or exports.")
    remember_parser.add_argument("--sources-root", default="", help="Sources root path.")
    remember_parser.add_argument("--sources-access", default="", help="How to access sources: filesystem, MCP service, or REST API.")
    remember_parser.add_argument("--memory-root", default="", help="Memory root path.")
    remember_parser.add_argument("--memory-access", default="", help="How to access durable project memory: filesystem, MCP service, or REST API.")
    remember_parser.add_argument("--rag-access", default="", help="How to access RAG: filesystem, MCP service, REST API, or none.")
    remember_parser.add_argument("--rag-provider", default="", help="RAG provider or framework.")
    remember_parser.add_argument("--rag-location", default="", help="RAG config, index, or storage location.")
    remember_parser.add_argument("--rag-index-path", default="", help="RAG index path.")
    remember_parser.add_argument("--additional-rag-locations", default="", help="Semicolon-separated secondary RAG or index locations.")
    remember_parser.add_argument("--rag-notes", default="", help="Additional RAG notes.")
    remember_parser.add_argument("--canonical-store-policy", default="", help="Which notes, memory, source, or RAG locations are canonical vs mirrored or derived.")
    remember_parser.add_argument("--apply", action="store_true", help="Also update the project foundation file.")
    remember_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    remember_parser.set_defaults(func=remember)

    apply_parser = subparsers.add_parser("apply", help="Apply remembered preferences to project-foundation.md.")
    apply_parser.add_argument("--project", default=".", help="Project directory.")
    apply_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    apply_parser.set_defaults(func=apply)

    status_parser = subparsers.add_parser("status", help="Report missing incremental foundation scaffold items.")
    status_parser.add_argument("--project", default=".", help="Project directory.")
    status_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    status_parser.add_argument("--include-local-env", action="store_true", help="Also check for an ignored .env.local file.")
    status_parser.set_defaults(func=incremental_status)

    scaffold_parser = subparsers.add_parser("scaffold", help="Create only missing foundation scaffold items.")
    scaffold_parser.add_argument("--project", default=".", help="Project directory.")
    scaffold_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    scaffold_parser.add_argument("--init-git", action="store_true", help="Initialize git if .git is missing and git is available.")
    scaffold_parser.add_argument("--include-local-env", action="store_true", help="Create an empty ignored .env.local file when missing.")
    scaffold_parser.add_argument("--dry-run", action="store_true", help="Preview missing scaffold items without writing.")
    scaffold_parser.set_defaults(func=scaffold)

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

    wipe_parser = subparsers.add_parser("wipe", help="Preview or remove MAPS foundation artifacts from a project.")
    wipe_parser.add_argument("--project", default=".", help="Project directory.")
    wipe_parser.add_argument("--foundation-file", default="project-foundation.md", help="Project foundation markdown file.")
    wipe_parser.add_argument("--confirm", action="store_true", help="Actually remove the previewed files.")
    wipe_parser.add_argument("--force", action="store_true", help="Also remove non-empty scaffold directories inside the project.")
    wipe_parser.set_defaults(func=wipe)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
