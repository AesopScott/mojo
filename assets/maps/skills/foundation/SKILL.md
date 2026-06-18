---
name: foundation
description: Start M0 Project Foundation for a MAPS project. Use when kicking off a new agent or multi-agent project, creating the project intent, notes scaffold, source inventory, assumptions, decisions, evidence index, and RAG-readiness plan before system shape or APS phase work begins.
---

# Foundation

Use `/foundation` at M0 to create the project foundation before selecting a system shape, roster, or individual agent build path.

## Self-learning preferences

At the start of every run, check for remembered foundation choices before proposing a scaffold. Treat `project-foundation.md` as the living project control page that defines the persistent memory contract and records MAPS skill runs.

1. Read project-local preferences from `.maps/foundation-preferences.json` if it exists.
2. If no project-local file exists, read a global default from `$CODEX_HOME/maps/foundation-preferences.json` or `~/.codex/maps/foundation-preferences.json` if it exists.
3. Use the living global template at `$CODEX_HOME/maps/templates/project-foundation.md` or `~/.codex/maps/templates/project-foundation.md` when it exists; otherwise seed from `templates/project-foundation.md`.
4. If preferences exist, reuse the remembered notes, sources, memory, RAG locations, and memory contract as the default proposal.
5. If the user chooses different locations or memory rules, update `.maps/foundation-preferences.json` and `project-foundation.md` in the current project.
6. Update the living global template when the user wants those answers reused across future projects, or when the current foundation run establishes a new default pattern.

Use `scripts/remember_foundation.py` when available:

```bash
python scripts/remember_foundation.py show --project .
python scripts/remember_foundation.py remember --project . --notes-root notes --sources-root sources --memory-root memory --rag-provider "LlamaIndex" --rag-location "memory/rag"
python scripts/remember_foundation.py apply --project . --foundation-file project-foundation.md
python scripts/remember_foundation.py stamp-run --project . --skill /foundation --phase M0 --output project-foundation.md --memory-updates "Updated memory contract"
python scripts/remember_foundation.py promote-template --project . --foundation-file project-foundation.md
```

The preference file is project memory, not a generated artifact to ignore. Commit it when the project wants future agents to reuse the same foundation choices. The living global template is cross-project memory; it should carry the last accepted memory contract into the next project.

## Workflow

1. Name the project and the customer or operator outcome.
2. Load remembered foundation preferences and ask whether to reuse or revise them.
3. Create the working knowledge scaffold using remembered or newly selected locations:
   - `notes/daily/`
   - `notes/interviews/`
   - `notes/research/`
   - `notes/decisions/`
   - `sources/docs/`
   - `sources/transcripts/`
   - `sources/screenshots/`
   - `memory/project-context.md`
   - `memory/glossary.md`
   - `memory/entity-map.md`
4. Complete `templates/project-foundation.md`.
5. Run EventStorming Lite to expose domain events, triggers, actors, rules, systems, pain points, and open questions.
6. Run Service Blueprint Lite to separate customer/operator actions, visible system behavior, backstage work, supporting data, evidence, and failure points.
7. Log known evidence, assumptions, decisions, open questions, and source gaps.
8. Define what should become retrievable later: source types, metadata, privacy limits, citation needs, and freshness rules.
9. Define the Persistent Memory Contract in `project-foundation.md`: all memory stores, what each is for, how each is updated, when multiple stores must be synced, and which store is canonical.
10. Remember the final notes, sources, memory, RAG locations, and memory contract in `.maps/foundation-preferences.json`.
11. Append this run to the `MAPS Skill Run Log` in `project-foundation.md` with timestamp, skill, phase, output, and memory updates.
12. Promote the updated `project-foundation.md` to the living global template when those choices should seed the next project.
13. Prepare the M1 handoff:
   - If the system shape is unclear, recommend Scope First.
   - If one coherent agent can own the outcome, recommend Single-Agent / APS.
   - If separate roles, permissions, memory, review, or parallel work are justified, recommend Multi-Agent / MAPS.

## Output

Create or update these concrete outputs in the current project:

- `project-foundation.md`: completed M0 foundation artifact from `templates/project-foundation.md`.
- `.maps/foundation-preferences.json`: selected notes, sources, memory, and RAG locations for the next `/foundation` run.
- Notes scaffold: the selected notes root with `daily/`, `interviews/`, `research/`, and `decisions/`.
- Sources scaffold: the selected sources root with `docs/`, `transcripts/`, `screenshots/`, and `links.md`.
- Memory scaffold: the selected memory root with `project-context.md`, `glossary.md`, and `entity-map.md`.

The completed `project-foundation.md` must include:

- Project/customer intent
- Customer story
- Current workflow
- EventStorming Lite notes
- Service Blueprint Lite notes
- Evidence index
- Source inventory
- Assumptions
- Decisions
- Open questions
- RAG-readiness plan
- Persistent Memory Contract: how each memory store is configured, updated, synced, and treated as canonical or derived
- MAPS Skill Run Log with this run's timestamp
- M1 handoff recommendation: Scope First, Single-Agent / APS, or Multi-Agent / MAPS

If the user chooses custom locations, create/update those locations and record them in `.maps/foundation-preferences.json`.
