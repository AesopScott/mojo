---
name: foundation
description: Start M0 Project Foundation for a MAPS project. Use when kicking off a new agent or multi-agent project, creating the project intent, notes scaffold, source inventory, assumptions, decisions, evidence index, and RAG-readiness plan before system shape or APS phase work begins.
---

# Foundation

Use `/foundation` at M0 to create the project foundation before selecting a system shape, roster, or individual agent build path. Use `/foundation --wipe` to remove the current project's foundation scaffold before starting over.

## Wipe mode

If the user invokes `/foundation --wipe`, do not create or rewrite foundation artifacts. Run the wipe preview first:

```bash
python scripts/remember_foundation.py wipe --project .
```

Show the user what would be removed. Only delete files when the user confirms, then run:

```bash
python scripts/remember_foundation.py wipe --project . --confirm
```

The wipe command removes MAPS foundation artifacts and known scaffold files inside the project: `project-foundation.md`, `.maps/foundation-preferences.json`, `.maps/rag-updates.json`, `notes/maps-runs/foundation.md`, `sources/links.md`, and the initial memory files. It removes empty scaffold directories. It does not remove non-empty notes, sources, memory, or RAG directories unless `--force` is explicitly used after user confirmation.

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
python scripts/remember_foundation.py remember --project . --notes-root notes --notes-access filesystem --additional-notes-locations "G:/My Drive/ObsidianMind" --sources-root sources --sources-access filesystem --memory-root memory --memory-access filesystem --rag-provider "LlamaIndex" --rag-access filesystem --rag-location "memory/rag" --additional-rag-locations "Qdrant: http://localhost:6333"
python scripts/remember_foundation.py apply --project . --foundation-file project-foundation.md
python scripts/remember_foundation.py stamp-run --project . --skill /foundation --phase M0 --output project-foundation.md --memory-updates "Updated memory contract"
python scripts/remember_foundation.py promote-template --project . --foundation-file project-foundation.md
python scripts/remember_foundation.py wipe --project .
```

Use `scripts/maps_memory.py` for the shared per-skill runtime memory behavior:

```bash
python scripts/maps_memory.py status --project .
python scripts/maps_memory.py complete-run --project . --skill /foundation --phase M0 --output project-foundation.md --summary-file project-foundation.md --memory-updates "Updated foundation contract and scaffold"
```

`remember_foundation.py` owns foundation configuration, template promotion, and the living memory contract. `maps_memory.py` is the shared helper that every MAPS skill calls after it creates its output. It appends the skill run to `project-foundation.md`, writes that skill's named note under `<notesRoot>/maps-runs/`, mirrors the named note into the configured RAG location when one exists, and records `.maps/rag-updates.json` so reindexing work is visible.

The preference file is project memory, not a generated artifact to ignore. Commit it when the project wants future agents to reuse the same foundation choices. The living global template is cross-project memory; it should carry the last accepted memory contract into the next project.

## Workflow

Before writing any files, run a required M0 preflight interview. Do not infer these answers from repository files unless the user explicitly asks you to inspect the repo and infer a draft. If the user provided some answers in the prompt, restate them and ask only for the missing decisions.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the required decisions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Start the interview with the user's actual memory system, not with abstract defaults. The first question should be:

> Do you have a RAG system for this project? If not, do you have another place where you store notes?

Then ask:

- What is that notes, memory, or RAG location?
- Do you have more than one notes location?
- Do you have more than one RAG or index location?
- Which notes location is canonical, and which locations are mirrors, exports, or secondary stores?
- Which RAG location is canonical, and which locations are derived indexes, mirrors, or experimental stores?
- Should I access it through the file system, an MCP service, or a REST API?
- If it is file-system based, what path should I use?
- If it is MCP based, what service/tool name should I use?
- If it is REST API based, what base URL or endpoint should I record, and where should credentials be configured?

Only after that memory/RAG discovery should you ask about project identity, project intent, operator, and scaffold folders. Do not ask "should I create fresh foundation defaults" as the first question.

Required preflight decisions:

- RAG availability: whether there is a RAG system now, another note store instead, or neither yet.
- Notes location and access method: file system path, MCP service, REST API endpoint, or none yet.
- Additional notes locations: any secondary vaults, folders, services, or exports, plus whether each should be updated or read-only.
- RAG configuration and access method: provider, location, index path, MCP service, REST API endpoint, or explicit "none yet".
- Additional RAG locations: any secondary indexes, vector stores, service endpoints, or experiments, plus whether each should be updated or read-only.
- Canonical store policy: which notes/memory/source/RAG location is the source of truth and which locations are mirrors or derived.
- Memory root and access method: where durable project memory should live and how to access it.
- Sources root and access method: where evidence, links, transcripts, screenshots, and docs should live and how to access them.
- Reuse policy: whether to reuse remembered/global foundation defaults after the user has confirmed the memory/RAG setup.
- Project identity: name, owner, and whether this is the MAPS framework itself, an APS/single-agent project, or a downstream product/org using MAPS.
- Project intent: the concrete product, organization, service, or agent system being founded.
- Primary customer/operator: who will use or operate the system.
- Global template policy: whether this project's answers should update the living global template for future projects.

If any required preflight decision is missing or ambiguous, ask the user before creating or updating `project-foundation.md`.

1. Complete the memory/RAG-first M0 preflight interview.
2. Load remembered foundation preferences and apply only the defaults the user confirmed after seeing the memory/RAG choices.
3. Name the project and the customer or operator outcome from confirmed answers.
4. Create the working knowledge scaffold using confirmed locations:
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
5. Complete `templates/project-foundation.md`.
6. Run EventStorming Lite to expose domain events, triggers, actors, rules, systems, pain points, and open questions.
7. Run Service Blueprint Lite to separate customer/operator actions, visible system behavior, backstage work, supporting data, evidence, and failure points.
8. Log known evidence, assumptions, decisions, open questions, and source gaps.
9. Define what should become retrievable later: source types, metadata, privacy limits, citation needs, and freshness rules.
10. Define the Persistent Memory Contract in `project-foundation.md`: all memory stores, what each is for, how each is updated, when multiple stores must be synced, and which store is canonical.
11. Remember the final notes, sources, memory, RAG locations, and memory contract in `.maps/foundation-preferences.json`.
12. Append this run to the `MAPS Skill Run Log` in `project-foundation.md` with timestamp, skill, phase, output, and memory updates.
13. Run the shared MAPS memory helper so `/foundation` gets its own named note in the configured notes and RAG locations.
14. Promote the updated `project-foundation.md` to the living global template only if the user confirmed that policy.
15. Prepare the M1 handoff:
   - If the system shape is unclear, recommend Scope First.
   - If one coherent agent can own the outcome, recommend Single-Agent / APS.
   - If separate roles, permissions, memory, review, or parallel work are justified, recommend Multi-Agent / MAPS.

## Output

Create or update these concrete outputs in the current project:

- `project-foundation.md`: completed M0 foundation artifact from `templates/project-foundation.md`.
- `.maps/foundation-preferences.json`: selected notes, sources, memory, and RAG locations for the next `/foundation` run.
- `.maps/rag-updates.json`: append-only reindex manifest updated by the shared memory helper.
- `<notesRoot>/maps-runs/foundation.md`: named `/foundation` run note for notes/RAG ingestion.
- `<rag.location>/maps-runs/foundation.md`: mirrored named `/foundation` run note when a RAG location is configured.
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
