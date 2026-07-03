---
name: multi-agent-coordination
description: Create MAPS M4 Coordination for a multi-agent system. Use after M3 Contracts to define workflow lanes, handoff routes, supervisor/router pattern, peer handoffs, queues, approvals, exception paths, retries, and coordination evidence before agent buildout.
---

# Multi-Agent Coordination
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M4 Coordination for workflow routing, handoffs, approvals, retries, and exception paths.

Use `/multi-agent-coordination` at M4 after M3 Contracts. M4 defines how work moves between participants before any agent is built.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-coordination --phase M4 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use BPMN for workflow lanes and gateways, OpenAI handoffs for delegation, A2A for task/message/artifact structure, and LangChain multi-agent patterns for supervisor vs handoff tradeoffs.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> Which workflow should the multi-agent system coordinate first?

Then ask only the next missing question needed to model tasks, decisions, messages, handoffs, approvals, exceptions, and recovery.

## Workflow

1. Read M0-M3 artifacts and contract gaps.
2. Select the first useful workflow slice.
3. Model lanes for humans, agents, roles, tools, services, and external parties.
4. Define start events, tasks, gateways, handoffs, messages, artifacts, approvals, and end states.
5. Choose coordination pattern: supervisor/router, peer handoff, agents-as-tools, queue/work item, event-driven, or hybrid.
6. Define routing criteria, confidence thresholds, clarification behavior, conflict resolution, retries, timeouts, and escalation.
7. Define coordination evidence needed before M5 buildout.
8. Produce `m/<project-handle>/coordination.md` from `templates/multi-agent-coordination.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete coordination artifact or decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/multi-agent-buildout` when the first workflow slice is coordinated, or `/multi-agent-contracts` when contract gaps block routing.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/coordination.md`
- Workflow lanes, tasks, gateways, handoffs, messages, artifacts, approvals, and end states
- Coordination pattern decision
- Routing, retry, timeout, clarification, escalation, and conflict rules
- M5 buildout-readiness notes

## Guardrails

- Do not build agents in M4.
- Do not choose a complex orchestration pattern when a simple queue or supervisor route is enough.
- Do not hide human approvals or failure paths.
- Do not move product-facing experience design into M4; send that to M8.
