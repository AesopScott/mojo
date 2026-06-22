---
name: ob
description: Write durable Obsidian architecture and configuration notes from the current session. Use when the user invokes /ob or asks to update Obsidian with session decisions, architecture changes, configuration changes, path settings, runtime rules, skill behavior, automation behavior, or other project memory that belongs under the current project's architecture or configuration folders.
---

# Ob

## Overview

Use `/ob` to turn session-visible decisions and implementation context into durable Obsidian notes. This skill writes architecture and configuration updates to the current project's Obsidian root, not MAPS run notes.

## Source Resolution

Before writing, resolve the active project memory contract:

1. Read `.maps/foundation-preferences.json` in the current repo when present.
2. Use `notesRoot` as the project Obsidian root.
3. If `notesRoot` is missing, read `project-foundation.md` and use its Persistent Memory Contract.
4. If neither source gives a notes root, ask one question for the project Obsidian root before writing.

Default target folders under the project Obsidian root:

- Architecture: `<notesRoot>/architecture/`
- Configuration: `<notesRoot>/configuration/`

If the project already uses a more specific config architecture path, such as `<notesRoot>/maps-config/architecture/` and `<notesRoot>/maps-config/configuration/`, prefer the existing project convention.

## Classification

Classify each durable item from the session before writing:

- Architecture: system shape, role boundaries, control-plane decisions, runtime design, data flow, authority model, memory model, repo/package structure, integration architecture, deployment architecture, and cross-system ownership.
- Configuration: concrete settings, paths, config keys, file locations, installed skill behavior, automation settings, environment shape, channel paths, naming conventions, flags, defaults, and operational knobs.
- Both: path abstraction, runtime gates, automation file-watch behavior, skill routing rules, role/session injection rules, and other items where a design decision has concrete settings.
- Neither: transient chat, raw logs, test noise, implementation minutiae without durable meaning, personal frustration, or anything already captured accurately elsewhere.

## Workflow

1. Review the visible session context, current file diffs when useful, and explicit user corrections.
2. Identify only durable architecture/configuration changes.
3. Group related changes into one concise note unless separate files would be clearer.
4. Write to the appropriate Obsidian folder:
   - architecture-only notes go to the architecture folder.
   - configuration-only notes go to the configuration folder.
   - both-category notes go to the most specific existing folder convention, or write one note in architecture with a `Configuration` section and optionally a short pointer note in configuration.
5. Use clear filenames in kebab case, such as `portable-path-layer.md` or `role-room-context-injection.md`.
6. Update a project index or `project-context.md` only when the change affects durable project-level state.
7. Report the exact files written or updated.

## Note Shape

Use this structure unless the project has a stronger local convention:

```markdown
# Title

Date: YYYY-MM-DD
Category: architecture / configuration / architecture+configuration

## Summary

- Durable point.

## Decisions

- Decision and reason.

## Configuration

- Setting, path, default, or convention.

## Source Pointers

- Repo file, Obsidian file, or session source reference.

## Open Questions

- Follow-up when needed.
```

## Boundaries

- Do not write raw session transcripts.
- Do not write secrets, credentials, private keys, tokens, or hidden chain-of-thought.
- Do not record unsupported claims as durable facts.
- Do not create MAPS run notes unless the user explicitly asks for a MAPS run record.
- Do not commit, push, release, deploy, or change production state.
- If a user corrects the category, move the note and update pointers immediately.
