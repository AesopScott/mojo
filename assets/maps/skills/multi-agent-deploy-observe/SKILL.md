---
name: multi-agent-deploy-observe
description: Create MAPS M10 Deploy/Observe for a multi-agent system. Use after M9 System Evaluate to define runtime packaging, release approval, configuration, secrets, rollout, smoke checks, observability, alerting, incident triggers, rollback, and production review loops.
---

# Multi-Agent Deploy Observe
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M10 Deploy/Observe for multi-agent release and production evidence loops.

Use `/multi-agent-deploy-observe` at M10 after M9 System Evaluate. M10 turns a proven system into a controlled release with runtime configuration, approval gates, smoke checks, observability, incident triggers, rollback, and review cadence.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-deploy-observe --phase M10 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use OpenTelemetry GenAI conventions, OpenAI tracing guidance, runtime-specific deployment docs, A2A task-state ideas, and NIST govern/map/measure/manage controls to define release evidence and observation.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> What runtime or environment should this multi-agent system run in first?

Then ask only the next missing question needed to define release authority, configuration, secrets, rollout, smoke checks, monitoring, alerts, rollback, and review cadence.

## Workflow

1. Read M0-M9 artifacts, release gates, child APS deploy/observe outputs, runtime notes, and approval requirements.
2. Identify deployable units: orchestrator, routers, workers, child agents, tool servers, queues, schedulers, stores, dashboards, and user surfaces.
3. Define runtime configuration, environment variables, secrets, credentials, permissions, network boundaries, storage, retention, and revocation paths.
4. Define release approval: owner, approver, branch/release route, production-change boundary, communication plan, and hold conditions.
5. Define rollout: local proof, staging proof, canary or limited release, full release, smoke checks, rollback, and post-release verification.
6. Define observation signals: traces, spans, handoff events, task states, tool calls, cost, latency, failure rates, user controls, approval rates, escalations, and quality review samples.
7. Define incident triggers and operator actions for stuck tasks, unsafe tool attempts, memory violations, hidden failures, external communication errors, spending risk, autonomy drift, and user-impacting defects.
8. Produce `m/<project-handle>/deploy-observe.md` from `templates/multi-agent-deploy-observe.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete deploy/observe artifact, runtime plan, or release decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/multi-agent-improve` after release evidence exists, or M9 if release gates are not satisfied.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/deploy-observe.md`
- Runtime and deployable-unit map
- Configuration, secret, permission, and approval plan
- Rollout, smoke check, rollback, and release evidence
- Observation signals, incident triggers, and review cadence

## Guardrails

- Do not deploy, publish, push, or change production from the skill alone. Follow the project's release authority and approval contract.
- Do not treat observability as optional for multi-agent systems.
- Do not store secrets in artifacts or notes.
- Do not let release approval imply expanded runtime autonomy.
