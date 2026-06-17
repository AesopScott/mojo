# MAPS Tools Catalog

| Phase | Tool | Use |
|---|---|---|
| 0 | Python | Scaffold generation and local automation. |
| 0 | GitHub CLI | Repository setup and publishing. |
| 1 | Git | Save phase artifacts. |
| 2 | Web and repository research | Find comparable agents and build patterns. |
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
