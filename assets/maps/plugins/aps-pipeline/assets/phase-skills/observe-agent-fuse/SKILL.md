---
name: observe-agent-fuse
description: Run MAPS Phase 7 Observe with Langfuse. Use when Codex needs to apply the base observe-agent workflow through Langfuse traces, sessions, scores, datasets, prompt versions, metrics, feedback, or self-hostable/open-source LLM observability.
---

# Observe Agent+Fuse

Use `/observe-agent+fuse` after Phase 6 when the deployed agent should be observed through Langfuse.

This wrapper keeps `/observe-agent` as the base workflow and adds Langfuse-specific tracing, feedback, prompt/version, score, and self-hosting considerations.

## Input

- All `/observe-agent` inputs
- Langfuse project, environment, trace/session links, API/key availability, prompt/version links, score definitions, dataset links, and deployment mode when available

## Workflow

1. Run the base `/observe-agent` workflow first.
2. Connect Phase 7 evidence to Langfuse:
   - traces and sessions
   - scores and feedback
   - prompt versions
   - datasets and experiments
   - cost, latency, and usage metrics
   - cloud or self-hosted deployment notes
3. Recommend the Langfuse observation plan before asking broad questions.
4. Record missing Langfuse setup when access, tracing, score definitions, prompt tracking, feedback capture, or retention choices are unavailable.
5. Use Langfuse evidence to identify production failures, prompt regressions, user feedback patterns, cost/latency issues, and improvement candidates.
6. Convert confirmed findings into Phase 8 improvement backlog items.

## Langfuse Must Cover

- Trace/session links for representative production requests.
- Score definitions and feedback capture.
- Prompt/version links when prompts are part of the agent behavior.
- Dataset or experiment links when production observations should become eval cases.
- Cloud versus self-hosted operating choice, including retention and ownership notes.
- Improvement items backed by Langfuse evidence.

## Best Fit

- Choose this wrapper when students should compare a self-hostable/open-source observability option.
- Choose it when prompt management, feedback, scoring, and data-control concerns matter.
- Do not assume Langfuse replaces LangSmith; make the tradeoff visible.

## Output

- `agents/{agent-handle}/observation-plan.md`
- `agents/{agent-handle}/observation-log.md`
- Langfuse evidence links and missing setup notes
- Phase 8 improvement backlog entries or handoff notes
