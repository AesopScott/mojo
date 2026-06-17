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
| 2 Design | `2.html` | Agent design and build backlog | Available | Add runtime target, adapter requirement planning, dependency mapping, priority order, and first build slice. |
| 3 Build | `3.html` | Working agent | Available | Build from the highest-priority unblocked backlog item; split oversized work before coding. |
| 4 Equip | `4.html` | Capability map | Available | Wire tools, runtime permissions, memory, connectors, secret storage, fallback behavior, and operating limits. |
| 5 Evaluate | `5.html` | Eval suite and eval report | Available | Prove agent behavior in the target runtime with base `/evaluate-agent`, `/evaluate-agent++`, LangSmith, Inspect AI, Phoenix, and adapter-specific failure checks. |
| 6 Deploy | `6.html` | Release plan and deployment record | Available | Package and publish to the selected runtime or distribution channel. |
| 7 Observe | `7.html` | Observation plan and observation log | Available | Track runtime logs, traces, cost, latency, quality signals, incidents, feedback, and evidence-backed improvement handoff. |
| 8 Improve | `8.html` | Improvement review and improvement backlog | Available | Feed observations, eval failures, incidents, user feedback, and operating signals into prioritized improvement backlog items with dependencies. |

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

Phase 2 should also produce `agents/{agent-handle}/agent-backlog.md`. The backlog should break the approved design into smaller build items, record dependencies, assign priority, identify the first build slice, and defer polish or evidence-driven follow-up work to Phase 8.

Backlog planning references:

- Scrum Guide product backlog: ordered, evolving source of work.
- Atlassian product backlog guide: refinement, priority, and implementation readiness.
- GitHub sub-issues: split larger work into smaller child issues with visible structure.

## Phase 3 Build Additions

Build should create or assemble the runtime adapter/profile only when it is required for the first working agent.

Build should start from `agent-backlog.md`, choose the highest-priority unblocked item, and split the item again if it is too large to prove independently.

Build should record:

- Adapter/profile selected:
- Files created or transformed:
- Runtime-specific instructions:
- Tool bindings:
- Memory setup:
- Permission gates:
- Verification command or manual check:
- Optional code review decision:
- Optional different-model review decision:
- Known incompatibilities:
- Handoff notes for Equip, Evaluate, and Deploy:

Build should update backlog status as work completes, blocks, splits, or gets deferred.

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

## Phase 7 Observe Additions

Observe should use `/observe-agent` as the base Phase 7 skill for production feedback loops after the agent is deployed or running in a target environment.

Phase 7 should also provide three comparable wrapper skills:

- `/observe-agent+smith`: base Observe plus LangSmith traces, runs, datasets, feedback, annotations, experiments, and eval-to-observe continuity.
- `/observe-agent+fuse`: base Observe plus Langfuse traces, sessions, scores, prompt versions, metrics, feedback, and self-hostable/open-source observability.
- `/observe-agent+phoenix`: base Observe plus Phoenix traces, OpenInference/OpenTelemetry instrumentation, datasets, experiments, and LLM/RAG eval analysis.

The page should let students compare all three instead of telling them one answer is always best.

Phase 7 should answer:

- Does the agent produce enough runtime evidence for us to understand behavior, quality, cost, failures, safety, and what should improve next?

Phase 7 should record:

- Observation plan:
- Observation log:
- Production URL:
- Trace source:
- Log source:
- Metric source:
- Feedback source:
- Review cadence:
- Alert destination:
- Incident triggers:
- Rollback or pause triggers:
- Improvement handoff:

Observe should track:

- Agent work: runs, traces, tool calls, connector calls, retries, approvals, fallbacks, final outputs, and escalation decisions.
- Operating health: latency, cost, token use, uptime, queue depth, timeouts, rate limits, failed jobs, and stuck runs.
- Quality: user feedback, recurring failures, bad tool choices, incomplete tasks, eval drift, and regression patterns.
- Safety and boundaries: denied tool calls, permission violations, approval gates, budget limits, unexpected data access, unsafe requests, and fallback behavior.
- Improvement evidence: traces, logs, metrics, incidents, eval misses, user feedback, support notes, and review decisions that justify Phase 8 backlog items.

Phase 7 references should include LangSmith observability, Phoenix tracing, Langfuse, OpenTelemetry GenAI semantic conventions, OpenAI Agents SDK tracing, Cloudflare Workers observability, and OpenTelemetry-based GenAI instrumentation references.

LangSmith should be treated as an Evaluate and Observe reference without requiring LangGraph. LangGraph should be reserved for multi-agent orchestration implementation or graph-state runtimes when the design requires it.

## Phase 5 Evaluate Additions

Evaluate should use `/evaluate-agent` as the base Phase 5 skill and `/evaluate-agent++` as one wrapper over the base Evaluate process, LangSmith, Inspect AI, and Phoenix.

Phase 5 should record:

- Eval suite:
- Eval report:
- Execution mode: executable mode or specification mode:
- LangSmith datasets, traces, trajectory checks, experiments, and regression history:
- Inspect AI tasks, solvers, scorers, tool-use checks, and safety/boundary tests:
- Phoenix traces, LLM/RAG eval analysis, datasets, experiments, and Observe handoff:
- Core loop success:
- Tool trajectory behavior:
- Capability boundary behavior:
- Failure and fallback behavior:
- Regression and release gate:
- Observe handoff:

Executable mode means the real built/equipped agent can run locally, in a sandbox, or in the target runtime, and `/evaluate-agent++` runs eval cases against that actual agent while recording traces, tool calls, outputs, failures, scores, and release evidence.

Specification mode means the agent cannot run yet because secrets, runtime access, connectors, credentials, or deployment pieces are missing. In that case, `/evaluate-agent++` still creates the eval suite and report shell, but must record exact commands, missing requirements, fixtures, and manual checks needed to run later.

Phase 5 must not score a description of the agent as if the agent ran. Eval reports must distinguish executed evidence from planned checks.

LangGraph should stay out of the default single-agent Build and Equip phases and be reserved for multi-agent orchestration implementation or graph-state runtimes when the design requires it.

## Phase 6 Deploy Additions

Deploy should use `/deploy-agent` as the base Phase 6 skill for runtime-neutral release discipline.

Base `/deploy-agent` should cover:

- Target runtime:
- Package artifact:
- Runtime manifest/package metadata:
- Deploy commands:
- Secrets/config handoff:
- Preflight checks:
- Smoke test:
- Release evidence:
- Rollback plan:
- Deployment record:

`/deploy-agent++` should be a separate wrapper for GitHub Actions environments and Cloudflare deployment automation. Use it when GitHub should deploy a Cloudflare Pages, Workers, or Cloudflare Agents project instead of Scott running manual Wrangler commands locally.

Phase 6 should record:

- Deploy plan:
- Deployment record:
- Deployment mode: executable deploy, package-only deploy, or specification deploy:
- Runtime target and environment:
- Package artifact and manifest/package metadata:
- GitHub workflow and environment when applicable:
- Cloudflare project/service and Wrangler config when applicable:
- Runtime secrets versus CI/CD deployment secrets:
- Preflight checks:
- Smoke test:
- Release evidence:
- Rollback command or dashboard rollback path:
- Observe handoff:

Executable deploy means the agent can deploy now, the release path is run, the production target is smoke tested, and live release evidence is recorded.

Package-only deploy means the deployable artifact can be built, but release is intentionally held. The deployment record must capture artifact details, exact release commands, missing approvals, and deferred release steps.

Specification deploy means the target runtime is not ready because accounts, secrets, credentials, approvals, runtime access, or deployment pieces are missing. The skill must record exact commands, missing requirements, fixtures, and manual checks needed to deploy later.

Phase 6 must not claim deployment happened when only packaging or specification happened.

Phase 6 references should include Cloudflare Agents SDK, cloudflare/agents, cloudflare/workers-sdk, GitHub Actions environments, Cloudflare rollback docs, MCPB package/manifest references, Google ADK, Google Agent Starter Pack, OpenAI Agents Python and JS, Temporal + OpenAI Agents SDK durable execution, OpenClaw, AutoClaw, Hermes Agent, Electron Forge, and electron-builder.

## Phase 8 Improve Additions

Improve should convert observations, eval failures, incidents, user feedback, and technical debt into an improvement backlog before another build cycle starts.

Improve should use `/improve-agent` as the base Phase 8 skill. Do not create a plus-plus wrapper until a specific external capability is selected and merged into the process.

Phase 8 should record:

- Improvement review:
- Improvement source and evidence:
- Priority:
- Dependencies:
- Target phase for the fix or enhancement:
- Smallest independently provable improvement slice:
- Regression or safety proof required:
- Deferred items:

Use `templates/improvement-backlog.md` for Phase 8. If an improvement is too broad, split it into smaller backlog items before sending it back into Design or Build.

Use `templates/improvement-review.md` to capture the evidence review, classification, routing, priority method, iteration decision, and handoff.

## Immediate Backlog

- Add runtime target and adapter requirement content to Phase 2.
- Add backlog-driven build planning content to Phase 2.
- Add runtime adapter/profile build content to Phase 3.
- Add backlog-driven build execution content to Phase 3.
- Add Phase 8 improvement backlog content when `8.html` is built.
- Update `templates/workflow-spec.md` with runtime target fields.
- Add `templates/agent-backlog.md` for Design-to-Build planning.
- Add `templates/improvement-backlog.md` for evidence-driven improvement planning.
- Update `templates/agent-build-plan.md` with runtime adapter build fields.
- Update `/build-agent++` so adapter/profile work is explicit.
- Consider future downloadable runtime adapter templates:
  - `templates/runtime-adapter-openclaw.md`
  - `templates/runtime-adapter-manus.md`
  - `templates/runtime-adapter-hermes.md`
  - `templates/runtime-profile-codex.md`
  - `templates/runtime-profile-claude-code.md`
  - `templates/runtime-portability-checklist.md`
- Keep Phase 7 focused on production evidence, not dashboard decoration.
- Keep LangGraph positioned as a multi-agent orchestration implementation reference, not a default single-agent Build dependency.
- Keep Phase 4 focused on capability provisioning: tools, permissions, memory, connectors, runtime config, limits, and fallbacks.
- Phase 4 runtime config should recommend where API keys live: local `.env` only for development, platform runtime secrets for deployed agents, CI/CD encrypted secrets for deploy pipelines, managed secret managers for audited/rotated operations, and connector/OAuth token stores for delegated access.
- Phase 4 must visibly cover scope by environment, blast-radius limits, and rotation/leak response for secrets.
