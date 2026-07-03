---
name: multi-agent-contracts
description: Create MAPS M3 Contracts for a multi-agent system. Use after M2 Roster to define participant contracts, inputs, outputs, authority, memory, tools, handoffs, escalation, stop conditions, acceptance evidence, and contract gaps before coordination design.
---

# Multi-Agent Contracts
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M3 Contracts for participant interfaces, authority, memory, handoffs, and stop conditions.

Use `/multi-agent-contracts` at M3 after M2 Roster names retained participants. M3 makes every participant interface explicit before workflow coordination.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-contracts --phase M3 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use OpenAI handoffs/guardrails for delegation boundaries, A2A for messages/tasks/artifacts, MCP for tool/data interfaces, and NIST AI RMF for risk ownership.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> Which roster participant should have its contract written first?

Then ask only the next missing question needed to define input, output, authority, tools, memory, handoff, escalation, and proof.

## Workflow

1. Read M0, M1, M2 `roster.md`, relevant role contracts, and existing agent profiles.
2. For each retained participant, define contract owner, purpose, allowed inputs, required outputs, authority, tools, memory, data access, and prohibited actions.
3. Define handoff triggers, accepted handoff payloads, rejection rules, clarification behavior, and return artifacts.
4. Define human approval points, escalation path, stop conditions, timeout behavior, retry limits, and rollback responsibilities.
5. Define acceptance evidence for M4 coordination and M5 buildout.
6. Mark contract gaps as blocker, backlog, or accepted risk.
7. Produce `m/<project-handle>/contracts.md` from `templates/multi-agent-contracts.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete contract artifact or decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/multi-agent-coordination` when participant contracts are sufficient, or `/multi-agent-roster` when the roster needs correction.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/contracts.md`
- Contract table for every retained participant
- Handoff payload and rejection rules
- Authority, memory, and tool boundaries
- Human approval, escalation, stop, retry, and rollback rules
- M4 coordination-readiness notes

## Guardrails

- Do not write a coordination workflow until participant contracts exist.
- Do not assume tool guardrails cover handoffs; define handoff-specific checks.
- Do not give a participant authority that its role/profile does not already support.
- Do not leave ambiguous owners for approvals, failures, or stop conditions.
