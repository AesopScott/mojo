# MAPS Build Tracker

This file tracks the MAPS work that needs to be designed, built, packaged, and published for Mojo.

## Current Direction

MAPS should define an agent once, then package it for one or more runtimes through runtime profiles or adapters.

- Runtime-neutral artifacts stay in MAPS: brief, design, build plan, proof, evals, deployment notes.
- Runtime-specific artifacts live in adapter/profile work: skill format, tool bindings, memory conventions, sandbox assumptions, packaging, install steps, and verification commands.
- Codex and Claude Code likely need lightweight runtime install profiles.
- OpenClaw, Manus, Hermes, LangGraph, OpenAI Agents SDK, CrewAI, and Google ADK may need fuller adapters depending on how much transformation is required.

## Phase Tracker

| Phase | Page | Primary Output | Status | Needs To Build |
|---|---|---|---|---|
| 0 Phase Alignment | `0.html` | Scaffold and structure | Available | Keep MAPS/M and APS boundaries clear. |
| 1 Define | `1.html` | Agent brief | Available | Keep authority, user, outcome, success, failure, and escalation fields aligned with later phases. |
| 2 Design | `2.html` | Agent design | Available | Add runtime target and adapter requirement planning. |
| 3 Build | `3.html` | Working agent | Available | Build adapter/profile when needed for the first working runtime. |
| 4 Equip | `4.html` | Capability map | Available | Wire tools, runtime permissions, memory, connectors, secret storage, fallback behavior, and operating limits. |
| 5 Evaluate | `5.html` | Eval suite | Planned | Prove agent behavior in the target runtime, including adapter-specific failure modes. |
| 6 Deploy | `6.html` | Release plan | Planned | Package and publish to the selected runtime or distribution channel. |
| 7 Observe | `7.html` | Observation plan | Planned | Track runtime logs, traces, cost, latency, quality signals, incidents, and feedback. Include LangSmith as a likely observability/evals reference. |
| 8 Improve | `8.html` | Improvement backlog | Planned | Feed observations, eval failures, and user feedback into the next iteration. |

## Runtime Adapter Model

Use these terms consistently:

- Runtime profile: lightweight instructions for installing or using MAPS assets in a runtime that already supports the MAPS-style `SKILL.md` pattern.
- Runtime adapter: a fuller transformation layer when the target runtime needs different files, APIs, packaging, tool bindings, memory setup, or deployment steps.
- Runtime target: the platform where the first working agent must run.
- Portability risk: a feature of the agent design that may not transfer cleanly across runtimes.

## Phase 2 Design Additions

Design should answer:

- Primary runtime target:
- Secondary runtime targets:
- Runtime profile or adapter required:
- Skill/instruction format:
- Tool interface:
- Memory model:
- Approval and human-in-the-loop support:
- Sandbox or execution model:
- Packaging and import/export path:
- Unsupported MAPS features:
- Portability risks:

Phase 2 should not build the adapter. It should produce the adapter requirement and portability notes.

## Phase 3 Build Additions

Build should create or assemble the runtime adapter/profile only when it is required for the first working agent.

Build should record:

- Adapter/profile selected:
- Files created or transformed:
- Runtime-specific instructions:
- Tool bindings:
- Memory setup:
- Permission gates:
- Verification command or manual check:
- Known incompatibilities:
- Handoff notes for Equip, Evaluate, and Deploy:

## Candidate Runtime Profiles And Adapters

| Runtime | Likely MAPS Treatment | Notes |
|---|---|---|
| Codex | Runtime profile | Likely needs install/use guidance, tool discovery notes, and repo instruction conventions. |
| Claude Code | Runtime profile | Likely needs skill/plugin path guidance, command wrappers, and `CLAUDE.md` conventions. |
| OpenClaw | Runtime adapter or profile | Supports `SKILL.md`-style skills; confirm gating, allowlists, environment injection, and marketplace packaging. |
| Manus | Runtime adapter | Supports open Agent Skills and sandbox execution; confirm import/export, API task model, and connector packaging. |
| Hermes | Runtime adapter | Confirm skill format, tool registry, memory provider, plugin layout, and deployment model. |
| LangGraph | Runtime adapter | Convert MAPS workflow into graph/state/checkpoint concepts. |
| OpenAI Agents SDK | Runtime adapter | Convert MAPS design into agents, tools, handoffs, guardrails, sessions, and traces. |
| CrewAI | Runtime adapter | Convert MAPS roles/tasks into crew, flow, agents.yaml, tasks.yaml, and tools. |
| Google ADK | Runtime adapter | Convert MAPS design into agents, workflow nodes, routing, state, retries, and HITL points. |

## Observe Phase References

Phase 7 should cover production observation and feedback loops after the agent is deployed or running in a target environment.

Candidate references and tools:

- LangSmith: tracing, monitoring, evaluation, cost/latency tracking, production failure debugging, and trace-backed improvement loops.
- Langfuse: open-source observability, tracing, evaluations, and production monitoring across several agent frameworks.
- Arize/Phoenix: tracing, evaluation, dataset analysis, and production ML/LLM observability.
- OpenTelemetry: vendor-neutral trace/log/metric instrumentation where runtime adapters support it.

LangSmith should be treated as an Observe-phase reference even when LangGraph is only used in Phase 3 for single-agent durability. The pairing is natural, but LangSmith can also observe non-LangGraph agents through SDKs and framework integrations.

## Immediate Backlog

- Add runtime target and adapter requirement content to Phase 2.
- Add runtime adapter/profile build content to Phase 3.
- Update `templates/workflow-spec.md` with runtime target fields.
- Update `templates/agent-build-plan.md` with runtime adapter build fields.
- Update `/build-agent++` so adapter/profile work is explicit.
- Consider future downloadable runtime adapter templates:
  - `templates/runtime-adapter-openclaw.md`
  - `templates/runtime-adapter-manus.md`
  - `templates/runtime-adapter-hermes.md`
  - `templates/runtime-profile-codex.md`
  - `templates/runtime-profile-claude-code.md`
  - `templates/runtime-portability-checklist.md`
- Add LangSmith and other observability options to Phase 7 Observe when that page is built.
- Keep Phase 4 focused on capability provisioning: tools, permissions, memory, connectors, runtime config, limits, and fallbacks.
- Phase 4 runtime config should recommend where API keys live: local `.env` only for development, platform runtime secrets for deployed agents, CI/CD encrypted secrets for deploy pipelines, managed secret managers for audited/rotated operations, and connector/OAuth token stores for delegated access.
- Phase 4 must visibly cover scope by environment, blast-radius limits, and rotation/leak response for secrets.
