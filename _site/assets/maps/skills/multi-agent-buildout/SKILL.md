---
name: multi-agent-buildout
description: Create MAPS M5 Agent Buildout for a multi-agent system. Use after M4 Coordination to plan which agents, roles, tools, adapters, and child APS builds are needed, in what order, with tests, proof gates, runtime-neutral decisions, and no-build decisions before capability integration.
---

# Multi-Agent Buildout
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M5 Agent Buildout for child APS planning, dependency order, proof gates, and build/no-build decisions.

Use `/multi-agent-buildout` at M5 after M4 Coordination. M5 does not implement every agent by itself; it plans and gates the child APS work needed for the multi-agent system.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-buildout --phase M5 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use OpenAI Agents guidance for agent definitions/state/human review, NIST AI RMF for build risk gates, and M4 coordination artifacts for dependency order.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> Which participant needs to become a built agent first for the coordinated workflow to work?

Then ask only the next missing question needed to decide child APS sequence, build scope, runtime needs, tests, and no-build boundaries.

## Workflow

1. Read M0-M4 artifacts and existing APS artifacts.
2. Identify each participant's implementation state: human/manual, role-only, Role+, built agent, external service, tool, or not needed.
3. For each candidate agent, decide whether to run APS A1 Define, A2 Design, A3 Build, A4 Equip, A5 Evaluate, A6 Deploy, A7 Observe, and A8 Improve.
4. Define build order, dependencies, adapter decisions pending, test-first proof, runtime-neutral limits, and no-build decisions.
5. Define integration stubs for participants not built yet.
6. Define M6 capability prerequisites and M7 orchestration prerequisites.
7. Produce `m/<project-handle>/buildout-plan.md` from `templates/multi-agent-buildout.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete buildout artifact or decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/multi-agent-capabilities` when buildout dependencies are clear, or the first required APS skill for the first child agent.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/buildout-plan.md`
- Participant implementation-state matrix
- Child APS sequence and dependency map
- Runtime adapter decision log
- Test/proof gates and no-build decisions
- M6 capability-readiness notes

## Guardrails

- Do not treat M5 as permission to build every candidate agent.
- Do not skip APS phases for child agents unless an accepted artifact already exists.
- Do not choose runtime adapters silently.
- Do not proceed to M6 until capability prerequisites and stubs are visible.
