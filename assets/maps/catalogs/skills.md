# MAPS Skills Catalog

| Phase | Skill | Purpose |
|---|---|---|
| 0 | `/scaffold` | Create the MAPS structure. |
| 0 | `phase-alignment` | Align lifecycle names, boundaries, and catalogs. |
| 1 | `/define-agent` | Create the agent brief. |
| 2 | `/design-agent` | Create the agent design through Research and Recommend, then turn it into a prioritized dependency-aware backlog. |
| M8 / optional A2 | `/design-experience` | Create the product experience design, journeys, surfaces, IA, interaction states, accessibility requirements, and APS handoffs. |
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
| APS | `/aps` | Source skillset in `AesopScott/maps`; this will evolve into the full `/maps` skill. |
