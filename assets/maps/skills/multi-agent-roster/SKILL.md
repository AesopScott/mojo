---
name: multi-agent-roster
description: Create MAPS M2 Roster for a multi-agent system. Use after M1 System Shape selects Multi-Agent / MAPS to define participants, human owners, roles, candidate agents, tools/services, responsibilities, authority category, memory scope, and the evidence needed before contracts.
---

# Multi-Agent Roster
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M2 Roster for multi-agent participant selection and responsibility boundaries.

Use `/multi-agent-roster` at M2 after M1 chooses Multi-Agent / MAPS. M2 decides who or what belongs in the system before contracts, coordination, capabilities, or orchestration are designed.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-roster --phase M2 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use role-pressure, A2A discovery/capability ideas, OpenAI handoff guidance, and NIST governance controls to decide which participants deserve first-class status.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> What outcome requires more than one participant instead of one agent?

Then ask only the next missing question needed to identify participants, owners, responsibilities, authority, memory, tools, risk, and proof.

## Workflow

1. Read M0 `project-foundation.md`, M1 `system-shape.md`, and any roles or agent briefs already present.
2. List candidate participants: humans, roles, Role+ operators, candidate agents, tools, services, data sources, approval owners, and external systems.
3. Classify each candidate as Human, Role, Role+, Agent Candidate, Tool, Service, Data Source, or External Party.
4. Decide whether each candidate is required, optional, postponed, merged into another participant, or rejected.
5. For each retained participant, define responsibility, authority boundary, memory scope, tool/data needs, handoff partners, and proof needed before M3.
6. Identify missing role artifacts that should go through `/role`.
7. Identify candidate agents that should later go through APS A1-A8 inside M5 Buildout.
8. Produce `m/<project-handle>/roster.md` from `templates/multi-agent-roster.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete roster artifact or decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/multi-agent-contracts` when retained participants are clear, or `/role` when required role contracts are missing.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/roster.md`
- Participant inventory and classification
- Responsibility map
- Authority and memory boundaries
- Required role/agent/tool evidence
- M3 contract-readiness notes

## Guardrails

- Do not create an agent because a name exists. Require responsibility, authority, tools, memory, proof, and runtime need.
- Do not let tools or services masquerade as agents.
- Do not assign authority from title alone.
- Do not enter M3 until roster ownership and excluded candidates are explicit.
