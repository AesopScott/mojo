---
name: multi-agent-orchestration
description: Create MAPS M7 Orchestration for a multi-agent system. Use after M6 Capabilities to define runtime topology, routing, handoff protocol, state, queues, schedules, supervisor/society pattern, observability, human override, rollback, and M8 experience handoff.
---

# Multi-Agent Orchestration
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M7 Orchestration for runtime topology, routing, state, observability, human override, and M8 handoff.

Use `/multi-agent-orchestration` at M7 after M6 Capabilities. M7 designs how the multi-agent system runs as a coordinated runtime before product experience design.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-orchestration --phase M7 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use OpenAI orchestration/handoffs, A2A task/message/artifact concepts, LangChain multi-agent patterns, OpenTelemetry GenAI conventions, and NIST manage/measure controls.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> What runtime topology should coordinate the first useful workflow: supervisor, peer handoff, queue, event-driven, or unknown?

Then ask only the next missing question needed to define runtime topology, routing, state, observability, human override, rollback, and M8 handoff.

## Workflow

1. Read M0-M6 artifacts, child APS runtime artifacts, and deploy/observe constraints if they exist.
2. Choose runtime topology: supervisor/router, peer handoff, agents-as-tools, queue/work item, event-driven, scheduled, hybrid, or undecided.
3. Define handoff protocol, task lifecycle, message/artifact schema, shared state, per-agent state, memory writes, locks, idempotency, retries, and timeout behavior.
4. Define orchestration guardrails: human override, stop command, approval gate, escalation, rollback, and degradation mode.
5. Define observability requirements: traces, spans, model calls, tool calls, handoffs, costs, latency, failures, feedback, and audit events.
6. Define M8 experience handoff: what users see, control, approve, interrupt, inspect, retry, or recover.
7. Produce `m/<project-handle>/orchestration.md` from `templates/multi-agent-orchestration.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete orchestration artifact or decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/design-experience` for M8 when orchestration behavior is clear, or `/multi-agent-capabilities` when runtime capabilities are incomplete.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/orchestration.md`
- Runtime topology and routing decision
- Handoff protocol and task/message/artifact schema
- State, memory, retry, timeout, idempotency, and rollback rules
- Observability and audit requirements
- Human override and M8 experience handoff

## Guardrails

- Do not activate runtime or automation from M7 alone.
- Do not hide stop/override behavior.
- Do not design UI copy here; send product-facing behavior to M8.
- Do not leave observability until after deployment.
