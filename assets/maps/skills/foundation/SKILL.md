---
name: foundation
description: Start M0 Project Foundation for a MAPS project. Use when kicking off a new agent or multi-agent project, creating the project intent, notes scaffold, source inventory, assumptions, decisions, evidence index, and RAG-readiness plan before system shape or APS phase work begins.
---

# Foundation

Use `/foundation` at M0 to create the project foundation before selecting a system shape, roster, or individual agent build path.

## Self-learning preferences

At the start of every run, check for remembered foundation choices before proposing a scaffold.

1. Read project-local preferences from `.maps/foundation-preferences.json` if it exists.
2. If no project-local file exists, read a global default from `$CODEX_HOME/maps/foundation-preferences.json` or `~/.codex/maps/foundation-preferences.json` if it exists.
3. If preferences exist, reuse the remembered notes, sources, memory, and RAG locations as the default proposal.
4. If the user chooses different locations, update `.maps/foundation-preferences.json` in the current project.
5. Only update the global default when the user explicitly says this choice should be reused across projects.

Use `scripts/remember_foundation.py` when available:

```bash
python scripts/remember_foundation.py show --project .
python scripts/remember_foundation.py remember --project . --notes-root notes --sources-root sources --memory-root memory --rag-provider "LlamaIndex" --rag-location "memory/rag"
```

The preference file is project memory, not a generated artifact to ignore. Commit it when the project wants future agents to reuse the same foundation choices.

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
9. Remember the final notes, sources, memory, and RAG locations in `.maps/foundation-preferences.json`.
10. Prepare the M1 handoff:
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
- M1 handoff recommendation: Scope First, Single-Agent / APS, or Multi-Agent / MAPS

If the user chooses custom locations, create/update those locations and record them in `.maps/foundation-preferences.json`.
