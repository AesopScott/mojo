# MAPS Tools Catalog

| Phase | Tool | Use |
|---|---|---|
| 0 | Python | Scaffold generation and local automation. |
| 0 | GitHub CLI | Repository setup and publishing. |
| 1 | Git | Save phase artifacts. |
| 2 | Web and repository research | Find comparable agents and build patterns. |
| 2 | Backlog planning | Turn the design into prioritized, dependency-aware build slices and deferred improvement items before implementation starts. |
| 2 | Scrum Guide product backlog | Treat the backlog as an ordered, evolving source of product work. |
| 2 | Atlassian product backlog guide | Refine, prioritize, and align backlog items before implementation. |
| 2 | GitHub sub-issues | Break larger backlog items into smaller child issues with visible dependency structure. |
| 3 | Backlog planning | Pull the highest-priority unblocked backlog item into Build and split oversized items before coding. |
| 3 | GitHub sub-issues | Keep implementation slices small enough to prove independently. |
| 3 | Test runner | Prove each Build slice. |
| 3 | Agent runtime | Execute the working agent. |
| 3 | Browser/runtime verifier | Confirm user-facing or runtime behavior. |
| 3 | Optional code review | Review Phase 3 changes before Equip, with an optional second pass from a different model or reviewer for higher-risk builds. |
| 4 | MCP servers | Expose tools, data sources, prompts, and workflows to equipped agents. |
| 4 | Connectors | Attach GitHub, Gmail, Slack, Drive, databases, and internal systems. |
| 4 | Secrets and environment configuration | Provide local dev env files, platform runtime secrets, CI/CD secrets, managed secret stores, scoped credentials, and runtime variables. |
| 4 | Memory and retrieval stores | Provide short-term state, long-term memory, and retrieval sources. |
| 5 | LangSmith | Provide datasets, traces, trajectory evals, regression tracking, and Observe handoff. |
| 5 | Inspect AI | Provide structured eval tasks, solvers, scorers, tool-use checks, and safety or boundary tests. |
| 5 | Phoenix | Provide open-source tracing, LLM/RAG eval analysis, datasets, experiments, and Observe continuity. |
| 6 | GitHub Actions environments | Provide environment secrets, deployment protection, branch controls, and approval gates for GitHub-driven releases. |
| 6 | Cloudflare Wrangler | Provide Cloudflare Pages and Workers deploy commands, config validation, and project operations. |
| 6 | Cloudflare rollback | Provide Worker rollback commands and dashboard rollback behavior for release recovery. |
| 6 | Runtime packaging | Provide manifests, package metadata, entrypoints, install commands, release artifacts, and update metadata across target runtimes. |
| 6 | MCPB | Provide portable MCP server bundles with manifest metadata, capabilities, runtime requirements, and install packaging. |
| 6 | Temporal durable execution | Provide durable workflow execution, retries, state persistence, recovery, and activity-based tool calls for production agents. |
| 7 | LangSmith observability | Provide production traces, monitoring, debugging, feedback, annotations, and quality review. |
| 7 | Phoenix tracing | Provide OpenInference and OpenTelemetry-compatible tracing integrations for LLM applications. |
| 7 | Langfuse | Provide open-source LLM traces, sessions, scores, datasets, metrics, prompt/version tracking, and feedback capture. |
| 7 | OpenTelemetry GenAI conventions | Provide vendor-neutral semantic conventions for GenAI, agent, tool, token, and model-call telemetry. |
| 7 | OpenAI Agents SDK tracing | Provide traces for agent runs, tool calls, handoffs, guardrails, custom spans, and trace processors. |
| 7 | Cloudflare Workers observability | Provide runtime logs, metrics, traces, analytics, errors, and tailing for Cloudflare-hosted agents. |
| 8 | Backlog planning | Convert observation, eval, incident, and feedback evidence into prioritized improvement work. |
| 8 | Scrum Guide product backlog | Keep the improvement backlog ordered and evolving as new evidence appears. |
| 8 | Atlassian product backlog guide | Refine improvement items and make tradeoffs before another build cycle starts. |
| 8 | GitHub sub-issues | Split larger improvement projects into smaller implementation-ready items. |
