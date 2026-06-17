# Agent Eval Suite

## Input

- Agent brief:
- Agent design:
- Agent build:
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

## Eval Coverage

| Eval Area | Scenario | Expected Behavior | Harness | Evidence Required | Release Gate |
|---|---|---|---|---|---|
| Core loop success |  |  |  |  |  |
| Tool trajectory |  |  |  |  |  |
| Capability boundary |  |  |  |  |  |
| Failure and fallback |  |  |  |  |  |
| Memory or retrieval |  |  |  |  |  |
| Runtime adapter |  |  |  |  |  |
| Regression |  |  |  |  |  |

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
