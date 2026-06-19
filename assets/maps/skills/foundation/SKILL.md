---
name: foundation
description: Start M0 Project Foundation for a MAPS project. Use when kicking off a new agent or multi-agent project, creating the project intent, notes scaffold, Git and remote readiness, env/secrets scaffold, source inventory, assumptions, decisions, evidence index, and RAG-readiness plan before system shape or APS phase work begins.
---

# Foundation
## Versioning

Current version: 0.3.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.3.0 - Added Git remote detection, connect-existing-remote support, and GitHub remote creation guidance.
- 2026-06-19 - v0.2.0 - Added incremental scaffold audits, Git initialization, and env/secrets template setup.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

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

The wipe command removes MAPS foundation artifacts and known scaffold files inside the project: `project-foundation.md`, `.maps/foundation-preferences.json`, `.maps/rag-updates.json`, legacy `notes/maps-runs/foundation.md`, transition `notes/maps-runs/foundation-helper-notes.md`, current `notes/maps-runs/[project]-foundation-helper-notes.md`, `sources/links.md`, and the initial memory files. It removes empty scaffold directories. It does not remove non-empty notes, sources, memory, or RAG directories unless `--force` is explicitly used after user confirmation.

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
python scripts/remember_foundation.py status --project .
python scripts/remember_foundation.py scaffold --project . --init-git
python scripts/remember_foundation.py scaffold --project . --remote-url https://github.com/OWNER/REPO.git
python scripts/remember_foundation.py scaffold --project . --github-repo OWNER/REPO --github-visibility private
```

Use `scripts/maps_memory.py` for the shared per-skill runtime memory behavior:

```bash
python scripts/maps_memory.py status --project .
python scripts/maps_memory.py complete-run --project . --skill /foundation --phase M0 --output project-foundation.md --summary-file project-foundation.md --memory-updates "Updated foundation contract and scaffold"
```

`remember_foundation.py` owns foundation configuration, template promotion, and the living memory contract. `maps_memory.py` is the shared helper that every MAPS skill calls after it creates its output. It appends the skill run to `project-foundation.md`, writes that skill's named note under `<notesRoot>/maps-runs/`, mirrors the named note into the configured RAG location when one exists, and records `.maps/rag-updates.json` so reindexing work is visible.

Helper-maintained run notes use explicit helper-note names. When notes are written under a `maps-runs` folder, include the project prefix: `[project]-[skill]-helper-notes.md`, such as `mindshare-shape-helper-notes.md` or `mindshare-foundation-helper-notes.md`. Only omit the project prefix when a custom helper note location is inside a project-specific folder and not under `maps-runs`. Role run notes are named by role: `role-[role-name].md`. The primary output artifact may still be a separate file such as `system-shape.md`; that is the deliverable, while `mindshare-shape-helper-notes.md` is the helper-maintained run summary note.

When preferences contain `[project]`, `{project}`, or `${project}`, the helper resolves the placeholder to the current project slug before writing notes or RAG mirrors.

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
- Git readiness: whether a Git repo already exists, whether M0 may initialize one if missing, whether Git is available, whether an `origin` remote exists, and whether M0 should connect or create the remote if it does not.
- Env/secrets readiness: whether to create `.env.example`, whether a local ignored `.env.local` is wanted, and where real secrets should live.
- Global template policy: whether this project's answers should update the living global template for future projects.

If any required preflight decision is missing or ambiguous, ask the user before creating or updating `project-foundation.md`.

## Incremental foundation runs

If `project-foundation.md` or `.maps/foundation-preferences.json` already exists, do not restart M0 from scratch unless the user asks for `/foundation --wipe`. Treat the run as an incremental foundation audit:

1. Run `python scripts/remember_foundation.py status --project .` to identify missing foundation pieces.
2. Report only the incremental changes that have not been implemented.
3. Ask one question at a time for missing decisions that cannot be inferred safely.
4. Run `python scripts/remember_foundation.py scaffold --project .` to create only missing non-destructive scaffold files.
5. Add `--init-git` only when `.git` is missing, Git is available, and the project permissions allow writing.
6. If the local repo has no remote, ask one question: "No Git remote is configured for this project. Should I create a new remote repo, connect an existing remote URL, or leave it local for now?"
7. Add `--remote-url` only when the developer supplies an existing remote URL.
8. Add `--github-repo OWNER/REPO --github-visibility private|public` only when the developer confirms a new GitHub repo should be created and `gh` is available/authenticated.
9. Add `--include-local-env` only when the developer confirms they want an ignored local env file created.
10. Never overwrite existing env, secrets, Git, remotes, notes, source, memory, or foundation files during an incremental run.
11. Append the incremental update to the MAPS Skill Run Log and memory helper note.

1. Complete the memory/RAG-first M0 preflight interview.
2. Load remembered foundation preferences and apply only the defaults the user confirmed after seeing the memory/RAG choices.
3. Name the project and the customer or operator outcome from confirmed answers.
4. Audit the existing foundation state if any M0 artifacts already exist, then create only missing scaffold items.
5. Check Git readiness:
   - If `.git/` exists, record that Git is already initialized.
   - If `.git/` is missing and Git is available, initialize Git only when filesystem permissions allow it and the user has not forbidden it.
   - If Git cannot be initialized, record the blocker and continue with the rest of M0.
6. Check remote readiness:
   - If `origin` or another Git remote exists, record the remote URL.
   - If no remote exists, ask whether to create a new remote repo, connect an existing remote URL, or leave the project local for now.
   - If connecting an existing remote, add it only after the user supplies the URL.
   - If creating a GitHub remote, use `gh repo create OWNER/REPO --private|--public --source . --remote origin` only when `gh` is available, authenticated, and the user confirms the owner, repo name, and visibility.
   - Never create, rename, overwrite, or replace a remote silently.
7. Create the first env/secrets scaffold:
   - Always create `.env.example` when missing, with placeholder keys only.
   - Ensure `.gitignore` ignores real secret files such as `.env`, `.env.*`, and `*.local`, while keeping `.env.example` trackable.
   - Create `.env.local` only when the developer confirms they want an ignored local secrets file.
   - Never write real secret values into project files.
8. Create the working knowledge scaffold using confirmed locations:
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
9. Complete `templates/project-foundation.md`.
10. Run EventStorming Lite to expose domain events, triggers, actors, rules, systems, pain points, and open questions.
11. Run Service Blueprint Lite to separate customer/operator actions, visible system behavior, backstage work, supporting data, evidence, and failure points.
12. Log known evidence, assumptions, decisions, open questions, and source gaps.
13. Define what should become retrievable later: source types, metadata, privacy limits, citation needs, and freshness rules.
14. Define the Persistent Memory Contract in `project-foundation.md`: all memory stores, what each is for, how each is updated, when multiple stores must be synced, and which store is canonical.
15. Remember the final notes, sources, memory, RAG locations, and memory contract in `.maps/foundation-preferences.json`.
16. Append this run to the `MAPS Skill Run Log` in `project-foundation.md` with timestamp, skill, phase, output, and memory updates.
17. Run the shared MAPS memory helper so `/foundation` gets its own named note in the configured notes and RAG locations.
18. Promote the updated `project-foundation.md` to the living global template only if the user confirmed that policy.
19. Prepare the M1 handoff:
   - If the system shape is unclear, recommend Scope First.
   - If one coherent agent can own the outcome, recommend Single-Agent / APS.
   - If separate roles, permissions, memory, review, or parallel work are justified, recommend Multi-Agent / MAPS.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Git, remote, and env/secrets status: whether Git was already initialized, initialized now, blocked, or skipped; whether a remote existed, was connected, was created, or was intentionally left local; and which env/secrets scaffold files were created or already existed.
- Incremental status: which missing foundation pieces were created and which still need decisions.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/shape` for M1 System Shape, unless M0 says the project needs more foundation work first.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Create or update these concrete outputs in the current project:

- `project-foundation.md`: completed M0 foundation artifact from `templates/project-foundation.md`.
- `.maps/foundation-preferences.json`: selected notes, sources, memory, and RAG locations for the next `/foundation` run.
- `.maps/rag-updates.json`: append-only reindex manifest updated by the shared memory helper.
- `.git/`: initialized repository only when missing, allowed, and Git is available.
- Git remote: existing `origin`, connected existing remote URL, created GitHub remote, intentionally local, or blocked.
- `.gitignore`: includes env/secrets ignore rules while preserving `.env.example`.
- `.env.example`: first env/secrets template with placeholders only.
- `.env.local`: optional ignored local env file only when explicitly confirmed.
- `<notesRoot>/maps-runs/[project]-foundation-helper-notes.md`: named `/foundation` helper note for notes/RAG ingestion.
- `<rag.location>/maps-runs/[project]-foundation-helper-notes.md`: mirrored named `/foundation` helper note when a RAG location is configured.
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
- Git readiness, repository status, and remote status
- Env/secrets scaffold and secret-handling rules
- Assumptions
- Decisions
- Open questions
- RAG-readiness plan
- Persistent Memory Contract: how each memory store is configured, updated, synced, and treated as canonical or derived
- MAPS Skill Run Log with this run's timestamp
- M1 handoff recommendation: Scope First, Single-Agent / APS, or Multi-Agent / MAPS

If the user chooses custom locations, create/update those locations and record them in `.maps/foundation-preferences.json`.
