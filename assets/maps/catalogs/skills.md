# MAPS Skills Catalog

| Phase | Skill | Purpose |
|---|---|---|
| M0 | `/foundation` | Start Project Foundation with required preflight decisions, project intent, notes scaffold, source inventory, evidence index, assumptions, decisions, RAG-readiness, persistent memory contract, per-skill notes, RAG mirrors, run log, remembered notes/RAG locations, and /foundation --wipe reset support. |
| M1 | `/shape` | Scope the workflow and choose Unknown / Scope First, Single-Agent / APS, or Multi-Agent / MAPS before roster or implementation work. |
| M2 | `/multi-agent-roster` | Define the multi-agent participant roster: humans, roles, Role+ operators, candidate agents, tools, services, responsibilities, authority, memory scope, and proof needed before contracts. |
| M3 | `/multi-agent-contracts` | Define participant contracts: inputs, outputs, authority, memory, tools, handoffs, escalation, stop conditions, retries, rollback, and acceptance evidence. |
| M4 | `/multi-agent-coordination` | Define workflow coordination: lanes, handoff routes, supervisor/router or peer patterns, queues, approvals, exception paths, retries, and coordination evidence. |
| M5 | `/multi-agent-buildout` | Plan child APS buildout: which participants become built agents, APS phase sequence, dependency order, stubs, test gates, runtime-adapter decisions, and no-build decisions. |
| M6 | `/multi-agent-capabilities` | Map shared capabilities: tools, MCP servers, APIs, data sources, memory stores, credentials, permissions, limits, fallbacks, audit needs, and revocation paths. |
| M7 | `/multi-agent-orchestration` | Define runtime orchestration: topology, routing, handoff protocol, task/message/artifact schema, state, queues, schedules, observability, human override, rollback, and M8 handoff. |
| M8 / optional A2 | `/design-experience` | Create the product experience design, journeys, surfaces, IA, interaction states, accessibility requirements, and APS handoffs. |
| M8 / optional A2 | `/design-experience++` | Wrap Experience Design with website/product UI references, component patterns, responsive layout, accessibility primitives, and service-design reasoning. |
| M9 | `/multi-agent-evaluate` | Prove system-level behavior across participant contracts, coordination, orchestration, shared capabilities, user journeys, approvals, guardrails, observability, and release gates. |
| M10 | `/multi-agent-deploy-observe` | Define runtime packaging, release approval, configuration, secrets, rollout, smoke checks, observability, alerting, incident triggers, rollback, and production review loops. |
| M11 | `/multi-agent-improve` | Classify evidence, incidents, traces, eval failures, user feedback, and operator findings into routed improvements across M2-M10 and child APS phases. |
| 0 | `/foundation` | Create M0 foundation, portable path settings, and optional full MAPS framework/org structure. |
| 0 | `phase-alignment` | Align lifecycle names, boundaries, and catalogs. |
| 1 | `/define-agent` | Create the agent brief and agent profile from an existing role using source-first Research and Recommend. |
| 2 | `/design-agent` | Create the agent design through source-first Research and Recommend, select or map the voice profile, then turn it into a prioritized dependency-aware backlog. |
| 3 | `/build-agent` | Base Build skill. |
| 3 | `/build-agent++` | Build with incremental implementation and TDD. |
| 4 | `/equip-agent` | Create the capability map for tools, permissions, memory, connectors, runtime settings, limits, and fallbacks. |
| 5 | `/evaluate-agent` | Base Evaluate skill for eval suites, execution modes, evidence, release gates, and Deploy/Observe handoff. |
| 5 | `/evaluate-agent++` | Wrap base Evaluate with LangSmith, Inspect AI, and Phoenix. |
| 6 | `/deploy-agent` | Base Deploy skill for target runtime, package artifact, runtime metadata, deploy commands, secrets/config handoff, preflight, smoke test, release evidence, rollback, and deployment record. |
| 6 | `/deploy-agent++` | Wrap Deploy with GitHub Actions environments and Cloudflare deployment automation. |
| 7 | `/observe-agent` | Create the observation plan, review runtime evidence, record findings, define incident triggers, and hand off evidence-backed improvements. |
| 7 | `/observe-agent+smith` | Wrap Observe with LangSmith traces, runs, datasets, feedback, annotations, experiments, and eval-to-observe continuity. |
| 7 | `/observe-agent+fuse` | Wrap Observe with Langfuse traces, sessions, scores, prompt versions, metrics, feedback, and self-hostable/open-source observability. |
| 7 | `/observe-agent+phoenix` | Wrap Observe with Phoenix traces, OpenInference/OpenTelemetry instrumentation, datasets, experiments, and LLM/RAG eval analysis. |
| 8 | `/improve-agent` | Review evidence, classify and route improvements, prioritize and split backlog items, define proof, and hand off the next MAPS iteration. |
| MAPS | `/maps` | Source program/plugin in `AesopScott/maps-plus-org`, including skills, templates, catalogs, global installs, and rule contracts. |
