# MAPS Build Tracker

This file tracks the MAPS work that needs to be designed, built, packaged, and published for Mojo.

## Current Direction

MAPS should define an agent once, then package it for one or more runtimes through runtime profiles or adapters.

- Runtime-neutral artifacts stay in MAPS: brief, design, build plan, proof, evals, deployment notes.
- Runtime-specific artifacts live in adapter/profile work: skill format, tool bindings, memory conventions, sandbox assumptions, packaging, install steps, and verification commands.
- Codex and Claude Code likely need lightweight runtime install profiles.
- OpenClaw, Manus, Hermes, LangGraph, OpenAI Agents SDK, CrewAI, and Google ADK may need fuller adapters depending on how much transformation is required.
- `references.html` is the program-wide MAPS reference catalog. Phase pages keep local Resources sections, but the top navigation References link should point to the catalog page.

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

## Single-Agent Experience Design Placement

Standalone agent projects still need experience design when there is no multi-agent application layer doing that work. Use optional `A1.5 Experience Design` between `A1 Define` and `A2 Design` when the agent has a visible surface, care text, UI, workflow, or user-facing configuration that needs product judgment before the agent design is locked.

Use `M3 Experience Design` when the project is part of a multi-agent system. Use `A1.5 Experience Design` when the agent is the product, or when the agent will ship inside a single-agent interface without a separate multi-agent experience phase.

`A1.5 Experience Design` should answer:

- What UI, front end, chat surface, workflow, or configuration surface is this agent part of?
- What should the experience feel like to the user?
- What user journey, information architecture, interaction model, and visual/tone standard are needed?
- What loading, empty, error, refusal, approval, escalation, and success states should exist?
- How does the agent's activity, uncertainty, tool use, memory use, and handoff behavior appear to the user?
- What care text, guidance, labels, warnings, or confirmations does the user need before the agent acts?

This step feeds `A2 Design` and `A3 Build`. It does not replace the agent design phase; it gives that phase the product and interface constraints it needs.

## Multi-Agent Phase List

The M layer is the multi-agent application pipeline. APS builds one agent or one capability; the M layer decides what product is being built, what it should feel like, why it needs multiple agents, which agents exist, how they coordinate, and how the full system is proven.

| M Phase | Name | Primary Output | Core Question | Feeds APS |
|---|---|---|---|---|
| M0 | Product Intent | Product intent brief | What are we building, who is it for, why should it exist, and what should it feel like to use? | Creates the product-level context and taste standard before any agent brief is written. |
| M1 | System Shape | Application/system map | What connects to what: surfaces, workflows, data flows, boundaries, integrations, and system objects? | Defines the application shape that UI and agents must plug into. |
| M2 | Roster | Agent roster and role map | Which agents are needed, why does each one exist, and where does human ownership remain? | Creates candidate Phase 1 Define inputs for each agent. |
| M3 | Experience Design | Product experience and UI design | What should the user experience, front end, interaction model, information architecture, and visual standard be now that the system shape and roster are known? | Adds product, UI, and workflow constraints to each agent's Phase 2 Design. |
| M4 | Contracts | Interface and responsibility contracts | What does each agent receive, produce, own, refuse, and hand off? | Adds constraints and handoff requirements to Phase 1 Define and Phase 2 Design. |
| M5 | Coordination Design | Coordination model | How do agents route work, sequence tasks, share context, resolve conflicts, escalate, and stop? | Adds workflow, state, routing, and orchestration requirements to Phase 2 Design. |
| M6 | Agent Buildout | Built and evaluated agent roster | Which individual agents must be defined, designed, built, equipped, and evaluated before system orchestration can be trusted? | Runs APS for each required agent or capability. |
| M7 | Shared Capabilities | Shared capability map | Which tools, memory, connectors, permissions, runtime settings, budgets, and approval gates are shared or isolated? | Shapes Phase 4 Equip for each agent and for shared infrastructure. |
| M8 | Orchestration Build | Working orchestration layer | What runtime, graph, queue, state machine, supervisor, or handoff mechanism coordinates the agents? | Triggers Phase 3 Build for orchestration code and any agent changes required by the coordinator. |
| M9 | System Evaluate | End-to-end system eval suite and report | Does the product and agent team complete full workflows safely, reliably, and observably under realistic failure conditions? | Extends Phase 5 Evaluate from individual agents to product-level and cross-agent scenarios. |
| M10 | System Deploy/Observe | Multi-agent release and observation record | How is the whole system released, watched, paused, rolled back, and understood in production? | Extends Phase 6 Deploy and Phase 7 Observe across agents, orchestrator, shared services, and runtime adapters. |
| M11 | System Improve | System improvement backlog | What should change in product intent, UX, agents, contracts, coordination, shared capabilities, or runtime based on evidence? | Routes work back into the right M phase or APS phase. |

### Multi-Agent Phase Details

M0 Product Intent should record what is being built, who it is for, the product promise, the user job, the emotional/taste standard, the application personality, the trust boundary, what the product should never become, success criteria, failure criteria, and why a multi-agent system is justified instead of a simpler workflow.

M1 System Shape should record the application surfaces, workflows, data flows, business rules, system boundaries, non-goals, primary objects, integrations, operating environments, human touchpoints, and the first useful system slice. This comes before Experience Design because the UI needs to know what it is plugging into.

M2 Roster should record every proposed agent, role, owner, authority level, responsibilities, excluded responsibilities, required inputs, expected outputs, escalation points, and whether the role should be automated, human-supervised, or human-owned.

M3 Experience Design should record the product experience, user journeys, front-end surfaces, interaction model, information architecture, design system expectations, visual/tone standards, accessibility needs, state/error/loading behavior, and how agent activity appears to users. It comes after Roster so the experience can account for the agents users will encounter, supervise, or rely on.

M4 Contracts should record agent-to-agent interfaces, handoff formats, shared vocabulary, data contracts, ownership boundaries, refusal behavior, escalation behavior, completion criteria, and what happens when another agent provides bad, late, incomplete, or conflicting information.

M5 Coordination Design should record the coordination pattern: supervisor, router, planner-executor, graph, queue, swarm, sequential pipeline, debate/review pair, human-in-the-loop checkpoint, or hybrid. It should also record ordering rules, concurrency rules, state ownership, retries, conflict resolution, termination conditions, and fallback behavior.

M6 Agent Buildout should run the Agentic Pipeline for each required agent or capability: Define, Design, Build, Equip, and Evaluate. This is where the individual agents that need to be evaluated are actually built before they are wired into the full multi-agent system.

M7 Shared Capabilities should record shared tools, per-agent tools, shared memory, per-agent memory, MCP servers, connectors, credentials, approval gates, rate limits, budgets, sandbox/runtime permissions, observability hooks, and environment-specific configuration.

M8 Orchestration Build should build only the coordination layer required for the first working system slice. LangGraph, Temporal, OpenAI Agents SDK handoffs, CrewAI flows, Google ADK workflows, queues, state machines, or custom supervisors belong here when the system design requires them.

M9 System Evaluate should prove product-level and cross-agent workflows, not just individual agent quality. It should include user journey success, handoff failures, tool contention, shared-state mistakes, conflicting agent outputs, routing errors, escalation behavior, timeout/retry paths, cost spikes, permission boundaries, and regression scenarios.

M10 System Deploy/Observe should package, release, smoke test, observe, and operate the orchestrator, participating agents, shared services, configuration, secrets, manifests, queues, schedules, dashboards, rollback plan, traces, alerts, costs, latency, failures, escalations, user feedback, and system-level incidents.

M11 System Improve should classify evidence-backed improvements as product intent work, UX/system-shape work, agent work, contract work, coordination work, shared capability work, eval work, deployment work, observability work, or product/process work before sending the item back into M or APS.

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
