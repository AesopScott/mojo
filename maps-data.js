window.MAPS_SITE = {
  phases: [
    {
      number: "0",
      file: "0.html",
      label: "Phase 0",
      title: "Phase Alignment",
      output: "Scaffold and structure",
      status: "available"
    },
    {
      number: "1",
      file: "1.html",
      label: "Phase 1",
      title: "Define",
      output: "Agent brief",
      status: "available"
    },
    {
      number: "2",
      file: "2.html",
      label: "Phase 2",
      title: "Design",
      output: "Agent design",
      status: "available"
    },
    {
      number: "2a",
      file: "",
      label: "Optional A2",
      title: "Experience Design",
      output: "Use only without a multi-agent M3 experience phase",
      status: "under-construction",
      statusLabel: "Under construction"
    },
    {
      number: "3",
      file: "3.html",
      label: "Phase 3",
      title: "Build",
      output: "Working agent",
      status: "available"
    },
    {
      number: "4",
      file: "4.html",
      label: "Phase 4",
      title: "Equip",
      output: "Capability map",
      status: "available"
    },
    {
      number: "5",
      file: "5.html",
      label: "Phase 5",
      title: "Evaluate",
      output: "Eval suite",
      status: "available"
    },
    {
      number: "6",
      file: "6.html",
      label: "Phase 6",
      title: "Deploy",
      output: "Release plan",
      status: "available"
    },
    {
      number: "7",
      file: "7.html",
      label: "Phase 7",
      title: "Observe",
      output: "Observation plan",
      status: "available"
    },
    {
      number: "8",
      file: "8.html",
      label: "Phase 8",
      title: "Improve",
      output: "Improvement backlog",
      status: "available"
    }
  ],
  resources: {
    skills: [
      {
        name: "/scaffold",
        url: "assets/maps/skills/scaffold/SKILL.md",
        download: true,
        note: "Creates the MAPS repository structure, phase docs, phase skills, templates, catalogs, project page, README, license, and gitignore."
      },
      {
        name: "phase-alignment",
        url: "assets/maps/skills/phase-alignment/SKILL.md",
        download: true,
        note: "Captures lifecycle names, boundaries, scaffolding decisions, and open questions."
      },
      {
        name: "/define-agent",
        url: "assets/maps/skills/define-agent/SKILL.md",
        download: true,
        note: "Creates agents/{agent-handle}/agent-brief.md: job, user, scope, success criteria, failure criteria, escalation points, risks, and assumptions."
      },
      {
        name: "/design-agent",
        url: "assets/maps/skills/design-agent/SKILL.md",
        download: true,
        note: "Runs Research and Recommend, then creates agents/{agent-handle}/agent-design.md and agents/{agent-handle}/agent-backlog.md."
      },
      {
        name: "/build-agent",
        url: "assets/maps/skills/build-agent/SKILL.md",
        download: true,
        note: "Base Phase 3 Build skill for turning an approved agent design into a working agent implementation."
      },
      {
        name: "/build-agent++",
        url: "assets/maps/skills/build-agent-plus-plus/SKILL.md",
        download: true,
        note: "MAPS Build skill that merges base /build-agent, incremental implementation, and test-driven development."
      },
      {
        name: "/equip-agent",
        url: "assets/maps/skills/equip-agent/SKILL.md",
        download: true,
        note: "Runs Research and Recommend, then creates the Phase 4 capability map for tools, permissions, memory, connectors, runtime settings, limits, and fallbacks."
      },
      {
        name: "/evaluate-agent",
        url: "assets/maps/skills/evaluate-agent/SKILL.md",
        download: true,
        note: "Base Phase 5 Evaluate skill for eval suites, execution modes, evidence, release gates, and Deploy/Observe handoff."
      },
      {
        name: "/evaluate-agent++",
        url: "assets/maps/skills/evaluate-agent-plus-plus/SKILL.md",
        download: true,
        note: "Wraps base Evaluate with LangSmith, Inspect AI, and Phoenix to create eval suites, trace-backed reports, release gates, and Observe handoff."
      },
      {
        name: "/deploy-agent",
        url: "assets/maps/skills/deploy-agent/SKILL.md",
        download: true,
        note: "Base Phase 6 Deploy skill for target runtime, package artifact, runtime metadata, deploy commands, secrets/config handoff, preflight, smoke test, release evidence, rollback, and deployment record."
      },
      {
        name: "/deploy-agent++",
        url: "assets/maps/skills/deploy-agent-plus-plus/SKILL.md",
        download: true,
        note: "Wraps /deploy-agent with GitHub Actions environments and Cloudflare deployment automation so GitHub can deploy Pages, Workers, and Cloudflare Agents projects."
      },
      {
        name: "/observe-agent",
        url: "assets/maps/skills/observe-agent/SKILL.md",
        download: true,
        note: "Base Phase 7 Observe skill for traces, logs, metrics, feedback, incidents, review cadence, alert triggers, and Phase 8 improvement handoff."
      },
      {
        name: "/observe-agent+smith",
        url: "assets/maps/skills/observe-agent-smith/SKILL.md",
        download: true,
        note: "Wraps base Observe with LangSmith traces, runs, datasets, feedback, annotations, experiments, and eval-to-observe continuity."
      },
      {
        name: "/observe-agent+fuse",
        url: "assets/maps/skills/observe-agent-fuse/SKILL.md",
        download: true,
        note: "Wraps base Observe with Langfuse traces, sessions, scores, prompt versions, metrics, feedback, and self-hostable/open-source observability."
      },
      {
        name: "/observe-agent+phoenix",
        url: "assets/maps/skills/observe-agent-phoenix/SKILL.md",
        download: true,
        note: "Wraps base Observe with Phoenix traces, OpenInference/OpenTelemetry instrumentation, datasets, experiments, and LLM/RAG eval analysis."
      },
      {
        name: "/improve-agent",
        url: "assets/maps/skills/improve-agent/SKILL.md",
        download: true,
        note: "Base Phase 8 Improve skill for evidence review, classification, routing, prioritization, splitting, proof, and next-iteration handoff."
      }
    ],
    repos: [
      {
        name: "AesopScott/maps",
        url: "https://github.com/AesopScott/maps",
        note: "Working MAPS repository."
      },
      {
        name: "VoltAgent/awesome-agent-skills",
        url: "https://github.com/VoltAgent/awesome-agent-skills",
        note: "Reference catalog for reusable agent skills."
      },
      {
        name: "hqhq1025/skill-optimizer",
        url: "https://github.com/hqhq1025/skill-optimizer",
        note: "Reference for skill lifecycle tooling."
      },
      {
        name: "addyosmani/agent-skills",
        url: "https://github.com/addyosmani/agent-skills",
        note: "Reference for incremental implementation, TDD, code review, and agent build discipline."
      },
      {
        name: "github/spec-kit",
        url: "https://github.com/github/spec-kit",
        note: "Spec-to-plan-to-task implementation reference."
      },
      {
        name: "openai/openai-agents-python",
        url: "https://github.com/openai/openai-agents-python",
        note: "Lightweight agent runtime reference for tools, handoffs, guardrails, sessions, tracing, and sandbox agents. Current research signal: 27,209 stars."
      },
      {
        name: "crewAIInc/crewAI",
        url: "https://github.com/crewAIInc/crewAI",
        note: "Agent scaffold and task configuration reference."
      },
      {
        name: "google/adk-python",
        url: "https://github.com/google/adk-python",
        note: "Code-first build, evaluate, and deploy reference for agent workflows."
      },
      {
        name: "davila7/claude-code-templates",
        url: "https://github.com/davila7/claude-code-templates",
        note: "Template catalog for agents, commands, hooks, MCP integrations, and development workflows."
      },
      {
        name: "microsoft/ai-agents-for-beginners",
        url: "https://github.com/microsoft/ai-agents-for-beginners",
        note: "Beginner-friendly curriculum for building agent systems."
      },
      {
        name: "modelcontextprotocol/modelcontextprotocol",
        url: "https://github.com/modelcontextprotocol/modelcontextprotocol",
        note: "Reference for connecting agents to tools, data sources, prompts, and workflows through MCP."
      },
      {
        name: "pydantic/pydantic-ai",
        url: "https://github.com/pydantic/pydantic-ai",
        note: "Reference for type-safe tools, dependency injection, and service access in agents."
      },
      {
        name: "langchain-ai/langsmith-sdk",
        url: "https://github.com/langchain-ai/langsmith-sdk",
        note: "Reference SDK for LangSmith tracing, datasets, experiments, and evaluations without requiring LangGraph. Current research signal: 930 stars."
      },
      {
        name: "UKGovernmentBEIS/inspect_ai",
        url: "https://github.com/UKGovernmentBEIS/inspect_ai",
        note: "Structured evaluation framework for datasets, solvers, scorers, tools, agents, and safety checks."
      },
      {
        name: "UKGovernmentBEIS/inspect_evals",
        url: "https://github.com/UKGovernmentBEIS/inspect_evals",
        note: "Community eval implementations for Inspect AI, including agent and safety benchmarks."
      },
      {
        name: "Arize-ai/phoenix",
        url: "https://github.com/Arize-ai/phoenix",
        note: "Open-source AI observability and evaluation reference for traces, datasets, experiments, and LLM/RAG evals. Current research signal: 10,175 stars."
      },
      {
        name: "cloudflare/agents",
        url: "https://github.com/cloudflare/agents",
        note: "Cloudflare Agents SDK reference for deploying stateful AI agents. Current research signal: 5,122 stars."
      },
      {
        name: "cloudflare/workers-sdk",
        url: "https://github.com/cloudflare/workers-sdk",
        note: "Wrangler and Cloudflare Workers/Pages deployment tooling reference. Current research signal: 4,163 stars."
      },
      {
        name: "modelcontextprotocol/mcpb",
        url: "https://github.com/modelcontextprotocol/mcpb",
        note: "MCP Bundle packaging and manifest reference for portable MCP server distribution. Current research signal: 1,967 stars."
      },
      {
        name: "GoogleCloudPlatform/agent-starter-pack",
        url: "https://github.com/GoogleCloudPlatform/agent-starter-pack",
        note: "Production-ready Google agent templates with CI/CD, evaluation, observability, Cloud Run, and Agent Engine patterns. Current research signal: 6,479 stars."
      },
      {
        name: "openai/openai-agents-js",
        url: "https://github.com/openai/openai-agents-js",
        note: "JavaScript/TypeScript agent runtime reference for packaging Node-based agent services. Current research signal: 3,234 stars."
      },
      {
        name: "temporalio/sdk-python",
        url: "https://github.com/temporalio/sdk-python",
        note: "Temporal Python SDK reference for durable workflow execution around production agents. Current research signal: 1,100 stars."
      },
      {
        name: "temporal-community/openai-agents-demos",
        url: "https://github.com/temporal-community/openai-agents-demos",
        note: "OpenAI Agents Python SDK demos integrated with Temporal durable execution. Current research signal: 45 stars."
      },
      {
        name: "openclaw/openclaw",
        url: "https://github.com/openclaw/openclaw",
        note: "OpenClaw gateway and runtime deployment reference. Current research signal: 379,079 stars."
      },
      {
        name: "datopian/autoclaw.sh",
        url: "https://github.com/datopian/autoclaw.sh",
        note: "Open deployment playbook for operating OpenClaw agents in production."
      },
      {
        name: "NousResearch/hermes-agent",
        url: "https://github.com/NousResearch/hermes-agent",
        note: "Hermes gateway, desktop, provider, channel, and deployment reference. Current research signal: 195,561 stars."
      },
      {
        name: "electron/forge",
        url: "https://github.com/electron/forge",
        note: "Electron packaging and publishing reference. Current research signal: 7,089 stars."
      },
      {
        name: "electron-userland/electron-builder",
        url: "https://github.com/electron-userland/electron-builder",
        note: "Electron packaging, GitHub Actions CI/CD, signing, publishing, and auto-update reference. Current research signal: 14,594 stars."
      },
      {
        name: "langfuse/langfuse",
        url: "https://github.com/langfuse/langfuse",
        note: "Open-source LLM observability, tracing, evals, metrics, prompt management, and feedback reference. Current research signal: 29,263 stars."
      },
      {
        name: "open-telemetry/opentelemetry-js",
        url: "https://github.com/open-telemetry/opentelemetry-js",
        note: "JavaScript OpenTelemetry instrumentation reference for traces, metrics, exporters, and runtime observability. Current research signal: 3,396 stars."
      },
      {
        name: "open-telemetry/opentelemetry-python",
        url: "https://github.com/open-telemetry/opentelemetry-python",
        note: "Python OpenTelemetry instrumentation reference for traces, metrics, logs, exporters, and service observability. Current research signal: 2,492 stars."
      },
      {
        name: "traceloop/openllmetry",
        url: "https://github.com/traceloop/openllmetry",
        note: "OpenTelemetry-based observability reference for GenAI and LLM applications. Current research signal: 7,201 stars."
      }
    ],
    tools: [
      {
        name: "Python",
        note: "Runs the scaffold generator."
      },
      {
        name: "GitHub CLI",
        note: "Creates and pushes repositories."
      },
      {
        name: "Git",
        note: "Records scaffold and phase changes."
      },
      {
        name: "Agent Skills",
        note: "Provides the SKILL.md packaging and workflow format used by /design-agent."
      },
      {
        name: "Web and repository research",
        note: "Finds comparable agents, reference architectures, implementation patterns, and design guidance."
      },
      {
        name: "Backlog planning",
        note: "Turns the approved design into prioritized, dependency-aware build slices and deferred improvement items before implementation starts."
      },
      {
        name: "Addy Osmani agent spec guidance",
        url: "https://addyosmani.com/blog/good-spec/",
        note: "Useful Design reference for objectives, context, constraints, acceptance criteria, and boundaries."
      },
      {
        name: "Scrum Guide product backlog",
        url: "https://scrumguides.org/scrum-guide.html#product-backlog",
        note: "Reference for treating the backlog as an ordered, evolving source of work."
      },
      {
        name: "Atlassian product backlog guide",
        url: "https://www.atlassian.com/agile/scrum/backlogs",
        note: "Reference for refining, prioritizing, and aligning backlog items before implementation."
      },
      {
        name: "GitHub sub-issues",
        url: "https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues",
        note: "Reference for breaking larger backlog items into smaller child issues with visible dependency structure."
      },
      {
        name: "Test runner",
        note: "Runs slice-level tests, regression checks, and build proof for /build-agent++."
      },
      {
        name: "Agent runtime",
        note: "Runs the working agent implementation created in Phase 3."
      },
      {
        name: "Browser/runtime verifier",
        note: "Confirms user-facing or runtime behavior when the build has visible output."
      },
      {
        name: "Optional code review",
        note: "Reviews Phase 3 changes before Equip, with an optional second pass from a different model or reviewer for higher-risk builds."
      },
      {
        name: "MCP servers",
        note: "Expose tools, data sources, prompts, and workflows to equipped agents."
      },
      {
        name: "Connectors",
        note: "Attach services such as GitHub, Gmail, Slack, Drive, databases, or internal systems."
      },
      {
        name: "Secrets and environment configuration",
        note: "Provides local dev env files, platform runtime secrets, CI/CD secrets, managed secret stores, scoped credentials, and deployment configuration."
      },
      {
        name: "Memory and retrieval stores",
        note: "Provides short-term state, long-term memory, vector retrieval, or structured knowledge sources."
      },
      {
        name: "LangSmith",
        url: "https://docs.langchain.com/langsmith/evaluation",
        note: "Provides datasets, traces, trajectory evals, regression history, and Phase 7 observability handoff."
      },
      {
        name: "Inspect AI",
        url: "https://inspect.aisi.org.uk/",
        note: "Provides structured eval tasks, solvers, scorers, tool-use checks, and safety or boundary tests."
      },
      {
        name: "Phoenix",
        url: "https://arize.com/docs/phoenix",
        note: "Provides open-source tracing, eval analysis, retrieval evals, and Observe-phase continuity."
      },
      {
        name: "GitHub Actions environments",
        url: "https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment",
        note: "Provides environment secrets, deployment protection, branch controls, and approval gates for GitHub-driven releases."
      },
      {
        name: "Cloudflare Wrangler",
        url: "https://developers.cloudflare.com/workers/wrangler/commands/",
        note: "Provides Cloudflare Pages and Workers deploy commands, config validation, and project operations."
      },
      {
        name: "Cloudflare rollback",
        url: "https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/",
        note: "Provides Worker rollback commands and dashboard rollback behavior for release recovery."
      },
      {
        name: "Runtime packaging",
        note: "Provides manifests, package metadata, entrypoints, install commands, release artifacts, and update metadata across target runtimes."
      },
      {
        name: "MCPB",
        url: "https://github.com/modelcontextprotocol/mcpb",
        note: "Provides a portable MCP server bundle format with a manifest.json describing capabilities and runtime requirements."
      },
      {
        name: "Temporal durable execution",
        url: "https://docs.temporal.io/ai-cookbook/openai-agents-sdk-python",
        note: "Provides durable workflow execution, retries, recovery, and long-running agent runtime patterns for OpenAI Agents SDK deployments."
      },
      {
        name: "LangSmith observability",
        url: "https://docs.langchain.com/langsmith/observability",
        note: "Provides production tracing, monitoring, debugging, feedback, annotations, and quality review."
      },
      {
        name: "Phoenix tracing",
        url: "https://arize.com/docs/phoenix/tracing/integrations-tracing",
        note: "Provides OpenInference and OpenTelemetry-compatible tracing integrations for LLM applications."
      },
      {
        name: "Langfuse",
        url: "https://langfuse.com/docs",
        note: "Provides open-source LLM traces, sessions, scores, datasets, metrics, prompt/version tracking, and feedback capture."
      },
      {
        name: "OpenTelemetry GenAI conventions",
        url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
        note: "Provides vendor-neutral semantic conventions for GenAI, agent, tool, token, and model-call telemetry."
      },
      {
        name: "OpenAI Agents SDK tracing",
        url: "https://openai.github.io/openai-agents-python/tracing/",
        note: "Provides tracing for agent runs, tool calls, handoffs, guardrails, custom spans, and trace processors."
      },
      {
        name: "Cloudflare Workers observability",
        url: "https://developers.cloudflare.com/workers/observability/",
        note: "Provides runtime logs, metrics, traces, analytics, errors, and tailing for Cloudflare-hosted agents."
      },
      {
        name: "Google SRE postmortem culture",
        url: "https://sre.google/sre-book/postmortem-culture/",
        note: "Provides incident-learning practices for evidence-backed improvement without blame."
      },
      {
        name: "Google SRE embracing risk",
        url: "https://sre.google/sre-book/embracing-risk/",
        note: "Provides reliability, cost, and risk tradeoff framing for prioritizing improvement work."
      },
      {
        name: "Atlassian postmortems",
        url: "https://www.atlassian.com/incident-management/postmortem",
        note: "Provides incident review structure for turning failures into action items and owners."
      }
    ],
    templates: [
      {
        name: "templates/maps-scaffold-template.md",
        url: "assets/maps/templates/maps-scaffold-template.md",
        download: true,
        note: "Defines the repeatable MAPS repository structure that /scaffold instantiates."
      },
      {
        name: "templates/phase-alignment-brief.md",
        url: "assets/maps/templates/phase-alignment-brief.md",
        download: true,
        note: "Captures Phase 0 structure decisions."
      },
      {
        name: "templates/agent-definition-template.md",
        url: "assets/maps/templates/agent-definition-template.md",
        download: true,
        note: "Captures the Phase 1 Define artifact."
      },
      {
        name: "templates/workflow-spec.md",
        url: "assets/maps/templates/workflow-spec.md",
        download: true,
        note: "Captures the Phase 2 Design artifact."
      },
      {
        name: "templates/agent-backlog.md",
        url: "assets/maps/templates/agent-backlog.md",
        download: true,
        note: "Captures prioritized build slices, dependencies, proof, runtime impact, status, and deferred improvements."
      },
      {
        name: "templates/agent-build-plan.md",
        url: "assets/maps/templates/agent-build-plan.md",
        download: true,
        note: "Captures the Phase 3 Build slices, proof, evidence, and handoff notes."
      },
      {
        name: "templates/build-log.md",
        url: "assets/maps/templates/build-log.md",
        download: true,
        note: "Records implementation evidence, checks, decisions, blockers, and next-phase notes."
      },
      {
        name: "templates/capability-map.md",
        url: "assets/maps/templates/capability-map.md",
        download: true,
        note: "Captures Phase 4 tools, permissions, memory, connectors, runtime settings, limits, and fallbacks."
      },
      {
        name: "templates/eval-suite.md",
        url: "assets/maps/templates/eval-suite.md",
        download: true,
        note: "Captures Phase 5 eval coverage, wrapper components, harness choices, and release gates."
      },
      {
        name: "templates/eval-report.md",
        url: "assets/maps/templates/eval-report.md",
        download: true,
        note: "Captures Phase 5 eval results, evidence links, failures, release decision, and Observe handoff."
      },
      {
        name: "templates/deploy-plan.md",
        url: "assets/maps/templates/deploy-plan.md",
        download: true,
        note: "Captures Phase 6 release path, runtime package, secrets/config handoff, preflight, smoke test, and rollback plan."
      },
      {
        name: "templates/deployment-record.md",
        url: "assets/maps/templates/deployment-record.md",
        download: true,
        note: "Captures Phase 6 deployment evidence, GitHub/Cloudflare run details, smoke results, rollback readiness, and Observe handoff."
      },
      {
        name: "templates/observation-plan.md",
        url: "assets/maps/templates/observation-plan.md",
        download: true,
        note: "Captures Phase 7 runtime evidence sources, signals, thresholds, owners, alert triggers, and improvement handoff rules."
      },
      {
        name: "templates/observation-log.md",
        url: "assets/maps/templates/observation-log.md",
        download: true,
        note: "Captures Phase 7 observed evidence, findings, review decisions, and Phase 8 improvement backlog handoff."
      },
      {
        name: "templates/improvement-backlog.md",
        url: "assets/maps/templates/improvement-backlog.md",
        download: true,
        note: "Captures Phase 8 improvement items from observations, eval failures, incidents, user feedback, dependencies, priorities, and next improvement slices."
      },
      {
        name: "templates/improvement-review.md",
        url: "assets/maps/templates/improvement-review.md",
        download: true,
        note: "Captures Phase 8 evidence review, classification, routing, prioritization, iteration decisions, and MAPS handoff."
      }
    ]
  },
  phaseResources: {
    "0": {
      skills: ["/scaffold", "phase-alignment"],
      repos: ["AesopScott/maps", "VoltAgent/awesome-agent-skills", "hqhq1025/skill-optimizer"],
      tools: ["Python", "GitHub CLI", "Git"],
      templates: ["templates/maps-scaffold-template.md", "templates/phase-alignment-brief.md"]
    },
    "1": {
      skills: ["/define-agent"],
      repos: ["AesopScott/maps"],
      tools: ["Git", "Agent Skills"],
      templates: ["templates/agent-definition-template.md"]
    },
    "2": {
      skills: ["/design-agent"],
      repos: ["AesopScott/maps"],
      tools: ["Git", "Agent Skills", "Web and repository research", "Backlog planning", "Addy Osmani agent spec guidance", "Scrum Guide product backlog", "Atlassian product backlog guide", "GitHub sub-issues"],
      templates: ["templates/workflow-spec.md", "templates/agent-backlog.md"]
    },
    "3": {
      skills: ["/build-agent++", "/build-agent"],
      repos: ["AesopScott/maps", "addyosmani/agent-skills", "github/spec-kit", "openai/openai-agents-python", "crewAIInc/crewAI", "google/adk-python", "VoltAgent/awesome-agent-skills", "davila7/claude-code-templates", "microsoft/ai-agents-for-beginners"],
      tools: ["Git", "Agent Skills", "Backlog planning", "GitHub sub-issues", "Test runner", "Agent runtime", "Browser/runtime verifier", "Optional code review"],
      templates: ["templates/agent-backlog.md", "templates/agent-build-plan.md", "templates/build-log.md"]
    },
    "4": {
      skills: ["/equip-agent"],
      repos: ["AesopScott/maps", "modelcontextprotocol/modelcontextprotocol", "openai/openai-agents-python", "pydantic/pydantic-ai"],
      tools: ["Git", "Agent Skills", "MCP servers", "Connectors", "Secrets and environment configuration", "Memory and retrieval stores"],
      templates: ["templates/capability-map.md"]
    },
    "5": {
      skills: ["/evaluate-agent", "/evaluate-agent++"],
      repos: ["AesopScott/maps", "langchain-ai/langsmith-sdk", "UKGovernmentBEIS/inspect_ai", "UKGovernmentBEIS/inspect_evals", "Arize-ai/phoenix"],
      tools: ["Git", "Agent Skills", "Test runner", "LangSmith", "Inspect AI", "Phoenix"],
      templates: ["templates/eval-suite.md", "templates/eval-report.md"]
    },
    "6": {
      skills: ["/deploy-agent", "/deploy-agent++"],
      repos: ["AesopScott/maps", "cloudflare/agents", "cloudflare/workers-sdk", "modelcontextprotocol/mcpb", "GoogleCloudPlatform/agent-starter-pack", "google/adk-python", "openai/openai-agents-python", "openai/openai-agents-js", "temporalio/sdk-python", "temporal-community/openai-agents-demos", "openclaw/openclaw", "datopian/autoclaw.sh", "NousResearch/hermes-agent", "electron/forge", "electron-userland/electron-builder"],
      tools: ["Git", "Agent Skills", "GitHub Actions environments", "Cloudflare Wrangler", "Cloudflare rollback", "Runtime packaging", "MCPB", "Temporal durable execution"],
      templates: ["templates/deploy-plan.md", "templates/deployment-record.md"]
    },
    "7": {
      skills: ["/observe-agent", "/observe-agent+smith", "/observe-agent+fuse", "/observe-agent+phoenix"],
      repos: ["AesopScott/maps", "langchain-ai/langsmith-sdk", "Arize-ai/phoenix", "langfuse/langfuse", "open-telemetry/opentelemetry-js", "open-telemetry/opentelemetry-python", "openai/openai-agents-python", "openai/openai-agents-js", "traceloop/openllmetry"],
      tools: ["Git", "Agent Skills", "LangSmith observability", "Phoenix tracing", "Langfuse", "OpenTelemetry GenAI conventions", "OpenAI Agents SDK tracing", "Cloudflare Workers observability"],
      templates: ["templates/observation-plan.md", "templates/observation-log.md", "templates/improvement-backlog.md"]
    },
    "8": {
      skills: ["/improve-agent"],
      repos: ["AesopScott/maps"],
      tools: ["Git", "Agent Skills", "Backlog planning", "Scrum Guide product backlog", "Atlassian product backlog guide", "GitHub sub-issues", "Google SRE postmortem culture", "Google SRE embracing risk", "Atlassian postmortems"],
      templates: ["templates/improvement-review.md", "templates/improvement-backlog.md"]
    }
  }
};
