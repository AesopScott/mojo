---
name: multi-agent-evaluate
description: Create MAPS M9 System Evaluate for a multi-agent system. Use after M8 Experience Design to test the whole system across participant contracts, coordination, orchestration, shared capabilities, user journeys, approvals, guardrails, observability, and release gates.
---

# Multi-Agent Evaluate
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M9 System Evaluate for multi-agent system-level proof and release gates.

Use `/multi-agent-evaluate` at M9 after M8 Experience Design. M9 proves whether the system works as a system: participants honor contracts, coordination routes work, orchestration handles state and failure, users can understand and control the product, and release gates are explicit.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-evaluate --phase M9 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use OpenAI guardrails and handoff guidance, A2A task/message/artifact lifecycle ideas, NIST AI RMF controls, OpenTelemetry GenAI conventions, and WCAG expectations to shape test coverage.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> What system behavior would make you confident this multi-agent workflow is ready to release?

Then ask only the next missing question needed to define scenarios, proof, release gates, failure cases, human approvals, observability, and rollback evidence.

## Workflow

1. Read M0-M8 artifacts, all child APS eval outputs, contracts, orchestration notes, and experience design.
2. Define happy-path, handoff, exception, approval, refusal, memory, tool, latency, cost, accessibility, and recovery scenarios.
3. Map every scenario to the participant contracts, coordination routes, capabilities, orchestration state, and user-visible surfaces it exercises.
4. Define release gates: required pass/fail criteria, human approvals, evidence artifacts, unresolved risk tolerance, and rollback triggers.
5. Define eval data, fixtures, mocks, traces, logs, and inspection steps needed to reproduce each scenario.
6. Include adversarial and boundary tests for authority overreach, hidden tool use, invalid memory access, external communication, spending, production actions, and unsafe autonomy expansion.
7. Record defects and improvement candidates with routing to M2-M8 or child APS phases.
8. Produce `m/<project-handle>/system-evaluation.md` from `templates/multi-agent-evaluate.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete evaluation artifact, test matrix, release gates, or decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/multi-agent-deploy-observe` when system gates are ready, or the earlier MAPS/APS phase that must be corrected first.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/system-evaluation.md`
- Scenario matrix and eval coverage map
- Release gates and evidence requirements
- Defect and risk routing to M2-M8 or child APS phases
- M10 deploy/observe readiness notes

## Guardrails

- Do not evaluate only individual agents. M9 must prove system-level behavior across handoffs, shared state, approvals, tools, observability, and user experience.
- Do not mark release-ready without explicit gates and evidence.
- Do not hide unresolved risk in prose. Route it to an owner, phase, and proof requirement.
- Do not expand autonomy because tests pass. Authority expansion requires its own approved contract change.
