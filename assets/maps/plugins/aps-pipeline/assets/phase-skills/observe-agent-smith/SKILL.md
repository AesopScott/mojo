---
name: observe-agent-smith
description: Run MAPS Phase 7 Observe with LangSmith. Use when Codex needs to apply the base observe-agent workflow through LangSmith traces, runs, datasets, feedback, annotations, monitoring views, experiments, or eval-to-observe continuity.
---

# Observe Agent+Smith

Use `/observe-agent+smith` after Phase 6 when the deployed agent should be observed through LangSmith.

This wrapper keeps `/observe-agent` as the base workflow and adds LangSmith-specific instrumentation, evidence, and review habits.

## Input

- All `/observe-agent` inputs
- LangSmith project, workspace, trace links, API/key availability, dataset or experiment links when available
- Phase 5 LangSmith eval traces or datasets when available

## Workflow

1. Run the base `/observe-agent` workflow first.
2. Connect Phase 7 evidence to LangSmith:
   - project and environment
   - traces and runs
   - feedback and annotation queues
   - datasets and experiments
   - monitoring views
   - eval baseline links from Phase 5
3. Recommend the LangSmith observation plan before asking broad questions.
4. Record missing LangSmith setup when access, project config, tracing, sampling, feedback capture, or dataset links are unavailable.
5. Use LangSmith evidence to identify production failures, eval drift, bad tool trajectories, latency/cost spikes, and user feedback patterns.
6. Convert confirmed findings into Phase 8 improvement backlog items.

## LangSmith Must Cover

- Trace/run links for representative production requests.
- Dataset or experiment links that connect production findings back to Phase 5 evals.
- Feedback and annotation process for human review.
- Cost, latency, error, and quality signals visible in LangSmith or paired runtime metrics.
- Missing instrumentation or sampling gaps.
- Improvement items backed by LangSmith evidence.

## Best Fit

- Choose this wrapper when the class wants eval-to-observe continuity from Phase 5.
- Choose it when the project already uses LangSmith for datasets, experiments, tracing, or annotation.
- Do not present LangSmith as requiring LangGraph.

## Output

- `agents/{agent-handle}/observation-plan.md`
- `agents/{agent-handle}/observation-log.md`
- LangSmith evidence links and missing setup notes
- Phase 8 improvement backlog entries or handoff notes
