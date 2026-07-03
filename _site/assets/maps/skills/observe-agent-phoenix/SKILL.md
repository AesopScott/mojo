---
name: observe-agent-phoenix
description: Run MAPS Phase 7 Observe with Phoenix. Use when Codex needs to apply the base observe-agent workflow through Phoenix traces, OpenInference/OpenTelemetry instrumentation, datasets, experiments, LLM/RAG eval analysis, or open trace/eval workbench review.
---

# Observe Agent+Phoenix
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.1.0 - Established the initial MAPS wrapper skill version baseline and changelog tracking.

Use `/observe-agent+phoenix` after Phase 6 when the deployed agent should be observed through Phoenix.

This wrapper keeps `/observe-agent` as the base workflow and adds Phoenix-specific trace, OpenInference, OpenTelemetry, dataset, experiment, and eval-analysis habits.


## Project foundation updates

At the start of every project run, look for project-foundation.md. If it exists, read Persistent Memory Contract and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If .maps/foundation-preferences.json exists, use it as the structured preference source for automation.

When this wrapper creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends MAPS Skill Run Log, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

`ash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /observe-agent+phoenix --phase Wrapper --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
`

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to project-foundation.md, then update this skill's named note in <notesRoot>/maps-runs/.


- All `/observe-agent` inputs
- Phoenix project, trace links, OpenInference/OpenTelemetry exporter status, dataset or experiment links, and retrieval/eval context when available


## Required interview

Before acting, ask for any missing answers required to choose the target artifact, wrapper path, runtime, provider, evidence source, or approval boundary.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Ask the next most important missing question, wait for the answer, then continue.


1. Run the base `/observe-agent` workflow first.
2. Connect Phase 7 evidence to Phoenix:
   - traces and spans
   - OpenInference instrumentation
   - OpenTelemetry export path
   - datasets and experiments
   - LLM, tool, RAG, or retrieval eval analysis
   - prompt replay or trace replay when available
3. Recommend the Phoenix observation plan before asking broad questions.
4. Record missing Phoenix setup when tracing, exporters, instrumentation packages, datasets, experiments, or eval hooks are unavailable.
5. Use Phoenix evidence to identify production failures, retrieval problems, tool-call issues, latency/cost sources, and eval drift.
6. Convert confirmed findings into Phase 8 improvement backlog items.

## Phoenix Must Cover

- Trace links for representative production requests.
- Instrumentation route: OpenInference, OpenTelemetry, framework auto-instrumentation, or custom spans.
- Dataset/experiment links for replaying or comparing observed failures.
- Retrieval/RAG signals when relevant.
- Missing exporter or trace coverage gaps.
- Improvement items backed by Phoenix evidence.

## Best Fit

- Choose this wrapper when developers should compare open instrumentation and trace/eval analysis.
- Choose it when OpenTelemetry or OpenInference portability matters.
- Treat Phoenix as a strong engineering workbench, not necessarily the only product-ops dashboard.


## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: the next MAPS phase skill, wrapper, or follow-up skill that should run.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.

## Output

- `agents/{agent-handle}/observation-plan.md`
- `agents/{agent-handle}/observation-log.md`
- Phoenix evidence links and missing setup notes
- Phase 8 improvement backlog entries or handoff notes
