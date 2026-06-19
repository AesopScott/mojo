---
name: phase-alignment
description: Create the MAPS Phase 00 Alignment artifact. Use when agreeing on lifecycle phase names, phase order, scope, scaffolding, repo structure, curriculum structure, naming decisions, templates, catalogs, and where future work belongs before defining or building agents.
---

# Phase Alignment

## Overview

Use this skill before the Define phase to agree on the lifecycle structure itself. This is the phase for scaffolding, naming, boundaries, and shared understanding.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /phase-alignment --phase M00 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Workflow

1. Identify the teaching or project goal.
2. Name the intended audience and use case.
3. Draft or revise the phase sequence.
4. Define what each phase means and what output it produces.
5. Decide repository, curriculum, skill, template, and catalog structure.
6. Record naming decisions and unresolved questions.
7. Produce a phase alignment brief.

## Output

Return:

- Framework name
- Purpose
- Audience
- Phase sequence
- Phase definitions
- Structure decisions
- Naming decisions
- Open questions

Use `templates/phase-alignment-brief.md` from the MAPS repo when working inside this repository.

## Done Criteria

- The lifecycle has agreed phase names and order.
- Each phase has a clear purpose and output.
- The scaffold is explicit.
- Future work has a destination.
- Open questions are visible.
