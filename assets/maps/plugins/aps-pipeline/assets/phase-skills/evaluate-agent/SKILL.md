---
name: evaluate-agent
description: Run MAPS Phase 5 Evaluate as the base runtime-neutral evaluation skill. Use when Codex needs to create an eval suite, decide executable versus specification mode, run or specify eval cases, capture evidence, produce eval-report.md, recommend a release gate, or hand off signals to Deploy and Observe without requiring LangSmith, Inspect AI, or Phoenix.
---

# Evaluate Agent

Use this skill after Phase 4 has produced `agents/{agent-handle}/capability-map.md` and before Phase 6 Deploy.

This is the base Phase 5 Evaluate skill. It is intentionally smaller than `/evaluate-agent++` so teams can run MAPS evaluation without adopting LangSmith, Inspect AI, or Phoenix.

## Input

- `agents/{agent-handle}/agent-brief.md`
- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/agent-build.md`
- `agents/{agent-handle}/capability-map.md`
- Working agent code, runtime profile, or runtime adapter
- Existing tests, logs, traces, incidents, or manual QA notes when available

## Workflow

1. Read the brief, design, build artifact, capability map, target runtime, and runnable agent surface.
2. Restate the agent's job, first working loop, tools, memory, permissions, approval gates, forbidden actions, operating limits, and fallback behavior.
3. Research comparable eval patterns, existing test coverage, runtime-specific failure modes, and tool-use risks before asking broad questions.
4. Recommend the eval plan:
   - task success evals
   - tool trajectory evals
   - permission and safety boundary evals
   - failure and fallback evals
   - memory/retrieval evals if relevant
   - runtime adapter or portability evals if relevant
   - regression and release-gate evals
5. Ask the user to accept the recommended eval plan or override only the parts that are wrong, risky, missing, too broad, or too expensive.
6. Produce or update `agents/{agent-handle}/eval-suite.md`.
7. Choose the execution mode:
   - Executable mode when the real built/equipped agent can run locally, in a sandbox, or in the target runtime.
   - Specification mode when the agent cannot run yet because secrets, runtime access, connectors, credentials, deployment pieces, or external dependencies are missing.
8. In Executable mode, run the highest-signal evals against the actual agent and record commands, inputs, outputs, failures, scores, and release evidence.
9. In Specification mode, create the eval suite and report shell, then record exact commands, missing requirements, fixtures, secrets, connector access, runtime setup, deployment steps, and manual checks needed to run later.
10. Produce or update `agents/{agent-handle}/eval-report.md`.
11. Recommend a release gate: pass, conditional pass, blocked, or needs more evaluation.
12. Prepare Phase 6 Deploy and Phase 7 Observe handoff notes.

## Execution Modes

### Executable mode

Use this mode when the agent can run locally, in a sandbox, or in the target runtime.

The skill should:

- Run eval cases against the actual built and equipped agent.
- Apply the Phase 4 capability map: tools, permissions, memory, runtime config, limits, and fallbacks.
- Capture commands, inputs, outputs, failures, scores, and release evidence.
- Record what passed, what failed, what was skipped, and why.

### Specification mode

Use this mode only when the agent cannot run yet because secrets, runtime access, connectors, credentials, deployment pieces, or external dependencies are missing.

The skill should:

- Create the eval suite and report shell.
- Record why executable mode is blocked.
- Record exact commands, missing secrets, connector access, fixtures, runtime setup, deployment steps, and manual checks needed to run later.
- Mark affected evals as planned or blocked, not passed.

## Evaluation Must Cover

- Core loop success: Can the equipped agent complete the intended job?
- Tool trajectory: Does it call the right tools in the right order with the right inputs?
- Capability boundaries: Does it respect approval gates, forbidden actions, scopes, budgets, and runtime limits?
- Failure behavior: Does it retry, degrade, ask, escalate, or stop when tools, connectors, memory, credentials, or runtime adapters fail?
- Regression risk: Can the same checks run again when prompts, models, tools, skills, or adapters change?
- Evidence: Are commands, results, failures, and decisions recorded clearly enough for Deploy and Observe?

## Output

- `agents/{agent-handle}/eval-suite.md`
- `agents/{agent-handle}/eval-report.md`
- Recommended eval plan with user overrides
- Execution mode decision and rationale
- Commands, fixtures, and evidence links where available
- Release gate recommendation: pass, conditional pass, blocked, or needs more evaluation
- Phase 6 Deploy handoff notes
- Phase 7 Observe handoff notes
