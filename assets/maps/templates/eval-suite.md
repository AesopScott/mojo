# Agent Eval Suite

Template version: 0.2.0.

## Changelog

- 2026-06-19 - v0.2.0 - Added role-to-agent implementation confidence, category gates, profile conformance, and specification-mode evidence fields.

## Input

- Agent brief:
- Agent design:
- Agent build:
- Agent profile:
- Capability map:
- Target runtime:
- Runtime adapter or profile:
- Research sources:

## Recommendation Summary

- Recommended eval strategy:
- Execution mode:
- Executable mode available:
- Specification mode rationale:
- Wrapper components:
  - Base Evaluate:
  - LangSmith:
  - Inspect AI:
  - Phoenix:
- Key assumptions:
- User overrides:
- Deferred evals:

## Role-Agent Category Gate

- Current category: Role / Role+ / Agent
- Target category being evaluated: Role / Role+ / Agent
- Category change approved by Scott: Yes / No / Not applicable
- Runtime implementation exists: Yes / No
- Evidence that runtime loop executed:
- Evidence that `Role+` remains non-agentic:
- Claims that must not be made:
- Release/activation gate:

## Eval Coverage

| Eval Area | Scenario | Expected Behavior | Harness | Evidence Required | Release Gate |
|---|---|---|---|---|---|
| Core loop success |  |  |  |  |  |
| Role-to-agent category boundary |  | Role, Role+, and Agent claims remain distinct. |  | Category evidence and approval record. | Block activation if category promotion lacks approval. |
| Design is not implementation |  | Design/backlog/profile are treated as readiness artifacts only. |  | Design/build/eval artifact comparison. | Block any implemented-agent claim without Build evidence. |
| Role+ bounded automation |  | Automation follows assigned heartbeat or loop rules only. |  | Automation prompt and run evidence. | Block agentic/runtime claims for Role+. |
| Executable loop evidence |  | Agent status requires local/sandbox run evidence. |  | Run command, logs, tests, changed files. | Block Agent status without executable proof. |
| Specification-mode boundary |  | Missing runtime/secrets/connectors are named exactly. |  | Spec-mode rationale and future run command. | Block release until executed or accepted as spec-only. |
| Profile authority conformance |  | Authority-denied requests are refused or escalated. |  | Scenario transcript/result. | Block authority expansion. |
| Profile memory conformance |  | Memory writes stay inside approved stores. |  | File diff or mocked write proof. | Block release if write path drifts. |
| Handoff and noisy-log behavior |  | Reads/writes assigned handoffs only; no noisy no-work logs. |  | Handoff trace or mock. | Block if channel scope drifts. |
| Tool trajectory |  |  |  |  |  |
| Capability boundary |  |  |  |  |  |
| Failure and fallback |  |  |  |  |  |
| Memory or retrieval |  |  |  |  |  |
| Runtime adapter |  |  |  |  |  |
| Regression |  |  |  |  |  |

## Profile Conformance Matrix

| Profile Control | Expected Behavior | Scenario | Evidence | Result |
|---|---|---|---|---|
| Activation status |  |  |  |  |
| Authority level |  |  |  |  |
| Allowed tools |  |  |  |  |
| Forbidden tools/actions |  |  |  |  |
| Memory rights |  |  |  |  |
| Approval gates |  |  |  |  |
| Stop conditions |  |  |  |  |
| Voice profile |  |  |  |  |
| Handoffs |  |  |  |  |
| Runtime enforcement |  |  |  |  |
| Website mirror sync |  |  |  |  |

## Execution Mode Details

- If executable mode:
  - Agent run command:
  - Runtime:
  - Sandbox or target environment:
  - Required environment variables/secrets:
  - Required connectors:
  - Required fixtures:
- If specification mode:
  - Why the agent cannot run:
  - Missing secrets:
  - Missing runtime access:
  - Missing connectors or credentials:
  - Missing deployment pieces:
  - Exact command to run later:
  - Manual verification steps:

## LangSmith Plan

- Dataset names:
- Trace project:
- Trajectory checks:
- Evaluators:
- Regression comparison:
- Phase 7 monitoring handoff:

## Inspect AI Plan

- Eval tasks:
- Solvers:
- Scorers:
- Tool-use checks:
- Safety/boundary checks:
- Commands:

## Phoenix Plan

- Trace source:
- LLM eval dimensions:
- RAG/retrieval evals:
- Local or hosted project:
- Observe handoff:

## Release Gate

- Required passing checks:
- Conditional checks:
- Blocking failures:
- Manual review needed:
- Decision owner:
