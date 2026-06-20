---
name: multi-agent-improve
description: Create MAPS M11 Improve for a multi-agent system. Use after M10 Deploy/Observe to classify evidence, incidents, traces, eval failures, user feedback, and operator findings into routed improvements across M2-M10 and child APS phases.
---

# Multi-Agent Improve
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M11 Improve for evidence-backed multi-agent system iteration.

Use `/multi-agent-improve` at M11 after M10 Deploy/Observe. M11 turns evidence into a routed improvement backlog across MAPS system phases and child APS phases.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-improve --phase M11 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use postmortem practice, backlog refinement, NIST AI RMF continuous improvement, OpenTelemetry evidence, and eval failure analysis to classify and route improvement work.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> What evidence should drive this improvement pass?

Then ask only the next missing question needed to classify findings, prioritize risk, choose phase routing, assign owners, define proof, and decide whether the next iteration restarts at M2, M3, M4, M5, M6, M7, M8, M9, M10, or a child APS phase.

## Workflow

1. Read M0-M10 artifacts, production evidence, eval results, traces, incident notes, user feedback, operator findings, and child APS improvement outputs.
2. Classify each finding by source, severity, affected user/system behavior, phase owner, likely root cause, proof needed, and urgency.
3. Route each finding to the proper phase: M2 roster, M3 contracts, M4 coordination, M5 child APS buildout, M6 capabilities, M7 orchestration, M8 experience, M9 evaluation, M10 deploy/observe, or a child APS phase.
4. Split large findings into bounded improvements with owner, expected artifact, test/eval proof, release risk, and rollback or observation needs.
5. Decide what stays as a backlog item, what blocks release, what requires human approval, and what is explicitly rejected.
6. Update the improvement backlog and define the next MAPS iteration entry point.
7. Produce `m/<project-handle>/system-improvement.md` from `templates/multi-agent-improve.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete improvement artifact, routed backlog, or iteration decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: the earliest MAPS or APS phase needed for the next evidence-backed iteration.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/system-improvement.md`
- Evidence inventory and classification
- Routed improvement backlog
- Owner, proof, release-risk, and observation requirements
- Next MAPS/APS iteration entry point

## Guardrails

- Do not treat vague preference as evidence without labeling it as opinion or taste.
- Do not route every issue to Build. Many system failures belong in roster, contracts, coordination, capabilities, orchestration, experience, evaluation, or observation.
- Do not silently expand authority or autonomy as an improvement.
- Do not close an improvement without proof or an explicit reject/defer decision.
