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
      status: "under-construction"
    },
    {
      number: "8",
      file: "8.html",
      label: "Phase 8",
      title: "Improve",
      output: "Improvement backlog",
      status: "under-construction"
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
        note: "Runs Research and Recommend, then creates agents/{agent-handle}/agent-design.md."
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
        note: "Lightweight agent runtime reference for tools, handoffs, guardrails, sessions, tracing, and sandbox agents."
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
        note: "Reference SDK for LangSmith tracing, datasets, experiments, and evaluations without requiring LangGraph."
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
        note: "Open-source AI observability and evaluation reference for traces, datasets, experiments, and LLM/RAG evals."
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
        name: "GoogleCloudPlatform/agent-starter-pack",
        url: "https://github.com/GoogleCloudPlatform/agent-starter-pack",
        note: "Production-ready Google agent templates with CI/CD, evaluation, observability, Cloud Run, and Agent Engine patterns. Current research signal: 6,479 stars."
      },
      {
        name: "openai/openai-agents-js",
        url: "https://github.com/openai/openai-agents-js",
        note: "JavaScript/TypeScript agent runtime reference for packaging Node-based agent services. Current research signal: 3,231 stars."
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
        name: "Addy Osmani agent spec guidance",
        url: "https://addyosmani.com/blog/good-spec/",
        note: "Useful Design reference for objectives, context, constraints, acceptance criteria, and boundaries."
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
      tools: ["Git", "Agent Skills", "Web and repository research"],
      templates: ["templates/workflow-spec.md"]
    },
    "3": {
      skills: ["/build-agent++", "/build-agent"],
      repos: ["AesopScott/maps", "addyosmani/agent-skills", "github/spec-kit", "openai/openai-agents-python", "crewAIInc/crewAI", "google/adk-python", "VoltAgent/awesome-agent-skills", "davila7/claude-code-templates", "microsoft/ai-agents-for-beginners"],
      tools: ["Git", "Agent Skills", "Test runner", "Agent runtime", "Browser/runtime verifier", "Optional code review"],
      templates: ["templates/agent-build-plan.md", "templates/build-log.md"]
    },
    "4": {
      skills: ["/equip-agent"],
      repos: ["AesopScott/maps", "modelcontextprotocol/modelcontextprotocol", "openai/openai-agents-python", "pydantic/pydantic-ai"],
      tools: ["Git", "Agent Skills", "MCP servers", "Connectors", "Secrets and environment configuration", "Memory and retrieval stores"],
      templates: ["templates/capability-map.md"]
    },
    "5": {
      skills: ["/evaluate-agent++"],
      repos: ["AesopScott/maps", "langchain-ai/langsmith-sdk", "UKGovernmentBEIS/inspect_ai", "UKGovernmentBEIS/inspect_evals", "Arize-ai/phoenix"],
      tools: ["Git", "Agent Skills", "Test runner", "LangSmith", "Inspect AI", "Phoenix"],
      templates: ["templates/eval-suite.md", "templates/eval-report.md"]
    },
    "6": {
      skills: ["/deploy-agent", "/deploy-agent++"],
      repos: ["AesopScott/maps", "cloudflare/agents", "cloudflare/workers-sdk", "GoogleCloudPlatform/agent-starter-pack", "google/adk-python", "openai/openai-agents-python", "openai/openai-agents-js", "openclaw/openclaw", "datopian/autoclaw.sh", "NousResearch/hermes-agent", "electron/forge", "electron-userland/electron-builder"],
      tools: ["Git", "Agent Skills", "GitHub Actions environments", "Cloudflare Wrangler", "Cloudflare rollback", "Runtime packaging"],
      templates: ["templates/deploy-plan.md", "templates/deployment-record.md"]
    }
  }
};
