---
name: observe-agent
description: Run MAPS Phase 7 Observe for a deployed or packaged agent. Use when Codex needs to create an observation plan, inspect runtime traces/logs/metrics/feedback, define alerts and incident triggers, compare production behavior to eval evidence, or produce observation-plan.md and observation-log.md before Phase 8 Improve.
---

# Observe Agent

Use this skill after Phase 6 has produced `agents/{agent-handle}/deployment-record.md` and before Phase 8 Improve.

This is the base Observe skill. It is runtime-neutral. Use it to instrument, monitor, review, and convert production evidence into improvement work.

## Input

- `agents/{agent-handle}/agent-brief.md`
- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/capability-map.md`
- `agents/{agent-handle}/eval-suite.md`
- `agents/{agent-handle}/eval-report.md`
- `agents/{agent-handle}/deployment-record.md`
- Production URL, runtime target, release gate, smoke test, rollback trigger, and known risks
- Available trace, log, metric, alert, feedback, incident, and support systems

## Workflow

1. Read the deployment record first. Confirm whether the agent is live, package-only, or specification-only.
2. Restate the production surface, runtime, release gate, rollback trigger, eval baselines, capability boundaries, and known risks.
3. Research observability references for the chosen runtime and instrumentation stack before recommending the observation plan.
4. Recommend the observation plan before asking broad questions:
   - traces and run history
   - logs and runtime errors
   - metrics, latency, cost, token use, rate limits, and queue health
   - tool calls, connector calls, retries, fallbacks, approvals, and escalations
   - quality signals, user feedback, annotation queues, and eval drift
   - safety and boundary signals
   - alert thresholds, incident triggers, owners, cadence, and rollback criteria
   - Phase 8 improvement handoff
5. Ask the user to accept the recommended observation plan or override only the parts that are wrong, unavailable, too expensive, or too noisy.
6. Produce or update `agents/{agent-handle}/observation-plan.md`.
7. If runtime evidence is available, inspect it and produce or update `agents/{agent-handle}/observation-log.md`.
8. If runtime evidence is missing, record exact instrumentation steps, missing access, missing secrets, missing dashboards, and manual checks needed to observe later.
9. Convert confirmed observations into Phase 8 improvement backlog items with evidence, priority, dependencies, proof required, and target phase.
10. Recommend an observation gate: continue, monitor closely, rollback, pause, or improve.

## Observation Must Cover

- Agent work: runs, traces, tool calls, connector calls, retries, approvals, fallbacks, final outputs, and escalation decisions.
- Operating health: latency, cost, token use, uptime, queue depth, timeouts, rate limits, failed jobs, and stuck runs.
- Quality: user feedback, recurring failures, bad tool choices, incomplete tasks, eval drift, and regression patterns.
- Safety and boundaries: denied tool calls, permission violations, approval gates, budget limits, unexpected data access, unsafe requests, and fallback behavior.
- Improvement evidence: traces, logs, metrics, incidents, eval misses, user feedback, support notes, and review decisions that can justify Phase 8 backlog items.

## Runtime Reference Guidance

- For LangSmith, use production traces, runs, feedback, annotations, datasets, experiments, and monitoring views.
- For Phoenix, use traces, datasets, experiments, LLM/RAG evals, OpenInference instrumentation, and OpenTelemetry-compatible exports.
- For Langfuse, use traces, sessions, scores, datasets, metrics, prompt/version tracking, and feedback capture.
- For OpenTelemetry, use GenAI semantic conventions where available so traces and metrics stay portable across vendors.
- For OpenAI Agents SDK, capture agent spans, tool calls, handoffs, guardrails, custom spans, and trace IDs.
- For Cloudflare runtimes, capture logs, metrics, traces, analytics, errors, tail output, and runtime-specific dashboards.

## Output

- `agents/{agent-handle}/observation-plan.md`
- `agents/{agent-handle}/observation-log.md`
- Observation gate decision: continue, monitor closely, rollback, pause, or improve
- Phase 8 improvement backlog entries or handoff notes
