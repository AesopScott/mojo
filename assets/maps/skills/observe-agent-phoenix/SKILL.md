---
name: observe-agent-phoenix
description: Run MAPS Phase 7 Observe with Phoenix. Use when Codex needs to apply the base observe-agent workflow through Phoenix traces, OpenInference/OpenTelemetry instrumentation, datasets, experiments, LLM/RAG eval analysis, or open trace/eval workbench review.
---

# Observe Agent+Phoenix

Use `/observe-agent+phoenix` after Phase 6 when the deployed agent should be observed through Phoenix.

This wrapper keeps `/observe-agent` as the base workflow and adds Phoenix-specific trace, OpenInference, OpenTelemetry, dataset, experiment, and eval-analysis habits.

## Input

- All `/observe-agent` inputs
- Phoenix project, trace links, OpenInference/OpenTelemetry exporter status, dataset or experiment links, and retrieval/eval context when available

## Workflow

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

- Choose this wrapper when students should compare open instrumentation and trace/eval analysis.
- Choose it when OpenTelemetry or OpenInference portability matters.
- Treat Phoenix as a strong engineering workbench, not necessarily the only product-ops dashboard.

## Output

- `agents/{agent-handle}/observation-plan.md`
- `agents/{agent-handle}/observation-log.md`
- Phoenix evidence links and missing setup notes
- Phase 8 improvement backlog entries or handoff notes
