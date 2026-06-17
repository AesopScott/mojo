---
name: evaluate-agent-plus-plus
description: Run MAPS Phase 5 Evaluate by wrapping the base Evaluate process with LangSmith, Inspect AI, and Phoenix. Use when Codex needs to create eval suites, trace-backed eval runs, safety/tool-use checks, regression evidence, eval reports, or Phase 7 observability handoff for an equipped agent.
---

# Evaluate Agent++

Use this skill after Phase 4 has produced `agents/{agent-handle}/capability-map.md` and before Phase 6 deployment.

This skill is one wrapper, not three competing tool choices. It combines:

- MAPS `/evaluate-agent`: base eval suite, execution mode, report, release gate, and handoff
- LangSmith for datasets, traces, trajectory review, regression history, and Phase 7 handoff
- Inspect AI for structured task, solver, scorer, tool-use, and safety evaluations
- Phoenix for open-source tracing, LLM/RAG eval analysis, and observability bridge

LangGraph is not required for this skill. Treat LangGraph as a later multi-agent orchestration implementation option, not a default single-agent Build dependency.

## References To Cite

- MAPS base `/evaluate-agent`: `assets/maps/skills/evaluate-agent/SKILL.md`
- LangSmith evaluation: `https://docs.langchain.com/langsmith/evaluation`
- LangSmith trajectory evals: `https://docs.langchain.com/langsmith/trajectory-evals`
- Inspect AI: `https://inspect.aisi.org.uk/`
- Phoenix: `https://arize.com/docs/phoenix`

## Input

- `agents/{agent-handle}/agent-brief.md`
- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/agent-build.md`
- `agents/{agent-handle}/capability-map.md`
- Working agent code, runtime profile, or runtime adapter
- Any existing tests, traces, logs, incidents, or manual QA notes

## Workflow

1. Read the brief, design, build artifact, capability map, target runtime, and runnable agent surface.
2. Restate the agent's job, first working loop, tools, memory, permissions, approval gates, forbidden actions, and fallback behavior.
3. Research comparable eval patterns, existing test coverage, runtime-specific failure modes, tool-use risks, and observability constraints.
4. Recommend the eval plan before asking broad questions:
   - task success evals
   - tool trajectory evals
   - permission and safety boundary evals
   - failure and fallback evals
   - memory/retrieval evals if relevant
   - runtime adapter or portability evals if relevant
   - regression and release-gate evals
5. Recommend which wrapper components to use:
   - `/evaluate-agent` for artifact structure, execution mode, eval report, and release gate
   - LangSmith for trace-backed datasets, experiments, trajectory review, and regression tracking
   - Inspect AI for structured eval tasks, solvers, scorers, tool-use checks, and safety/boundary tests
   - Phoenix for local or self-hosted tracing, LLM eval analysis, retrieval evals, and Observe handoff
6. Ask the user to accept the recommended eval plan or override only the parts that are wrong, risky, missing, too broad, or too expensive.
7. Produce or update the eval suite and eval report.
8. Choose the execution mode:
   - Executable mode when the real built/equipped agent can run locally, in a sandbox, or in the target runtime.
   - Specification mode when the agent cannot run yet because secrets, runtime access, connectors, credentials, or deployment pieces are missing.
9. In Executable mode, run the highest-signal evals against the actual agent and record traces, tool calls, outputs, failures, scores, and release evidence.
10. In Specification mode, create the eval suite and report shell, then record exact commands, missing requirements, fixtures, secrets, connector access, runtime setup, and manual checks needed to run later.
11. Do not score a description of the agent as if the agent ran. Distinguish executed evidence from planned checks.

## Execution Modes

### Executable mode

Use this mode when the agent can run locally, in a sandbox, or in the target runtime.

The skill should:

- Run eval cases against the actual built and equipped agent.
- Apply the Phase 4 capability map: tools, permissions, memory, runtime config, limits, and fallbacks.
- Wrap the run with the selected harnesses: LangSmith, Inspect AI, Phoenix, or the base MAPS harness.
- Capture traces, tool calls, outputs, failures, scores, and release evidence.

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
- Evidence: Are datasets, traces, commands, results, failures, and decisions recorded clearly enough for Deploy and Observe?

## Wrapper Guidance

- Prefer LangSmith when evaluation needs datasets, trace review, trajectory evaluation, experiment comparison, regression history, or production monitoring continuity.
- Prefer Inspect AI when evaluation needs formal tasks, solvers, scorers, model-graded checks, tool-use checks, benchmark-style runs, or safety/boundary exercises.
- Prefer Phoenix when the team wants open-source tracing/evals, local analysis, RAG evals, or an observability bridge that can continue into Phase 7.
- Use all three for important agents when trace-backed evidence, structured safety/task evals, and open observability all matter.
- Do not require LangGraph for LangSmith. LangSmith can trace and evaluate LangChain, OpenAI SDK, custom Python/TypeScript agents, and other instrumented applications.
- Do not move LangGraph into Phase 3 single-agent Build by default. Reserve LangGraph for multi-agent orchestration or stateful graph runtimes when the design requires it.

## Output

- `agents/{agent-handle}/eval-suite.md`
- `agents/{agent-handle}/eval-report.md`
- Recommended eval plan with user overrides
- Execution mode decision and rationale
- Harness recommendation for LangSmith, Inspect AI, and Phoenix
- Commands, datasets, traces, fixtures, and evidence links where available
- Release gate recommendation: pass, conditional pass, blocked, or needs more evaluation
- Phase 7 Observe handoff notes
