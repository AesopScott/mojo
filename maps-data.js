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
      status: "under-construction"
    },
    {
      number: "5",
      file: "5.html",
      label: "Phase 5",
      title: "Evaluate",
      output: "Eval suite",
      status: "under-construction"
    },
    {
      number: "6",
      file: "6.html",
      label: "Phase 6",
      title: "Deploy",
      output: "Release plan",
      status: "under-construction"
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
        name: "langchain-ai/langgraph",
        url: "https://github.com/langchain-ai/langgraph",
        note: "Durable stateful workflow reference for long-running agents."
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
      }
    ],
    catalogs: [
      {
        name: "catalogs/skills.md",
        url: "assets/maps/catalogs/skills.md",
        download: true,
        note: "Records skills by MAPS phase."
      },
      {
        name: "catalogs/repos.md",
        url: "assets/maps/catalogs/repos.md",
        download: true,
        note: "Records useful repositories by MAPS phase."
      },
      {
        name: "catalogs/tools.md",
        url: "assets/maps/catalogs/tools.md",
        download: true,
        note: "Records tools and services by MAPS phase."
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
      }
    ]
  },
  phaseResources: {
    "0": {
      skills: ["/scaffold", "phase-alignment"],
      repos: ["AesopScott/maps", "VoltAgent/awesome-agent-skills", "hqhq1025/skill-optimizer"],
      tools: ["Python", "GitHub CLI", "Git"],
      templates: ["templates/maps-scaffold-template.md", "templates/phase-alignment-brief.md"],
      catalogs: ["catalogs/skills.md", "catalogs/repos.md", "catalogs/tools.md"]
    },
    "1": {
      skills: ["/define-agent"],
      repos: ["AesopScott/maps"],
      tools: ["Git", "Agent Skills"],
      templates: ["templates/agent-definition-template.md"],
      catalogs: ["catalogs/skills.md", "catalogs/repos.md", "catalogs/tools.md"]
    },
    "2": {
      skills: ["/design-agent"],
      repos: ["AesopScott/maps"],
      tools: ["Git", "Agent Skills", "Web and repository research"],
      templates: ["templates/workflow-spec.md"],
      catalogs: ["catalogs/skills.md", "catalogs/repos.md", "catalogs/tools.md"]
    },
    "3": {
      skills: ["/build-agent++", "/build-agent"],
      repos: ["AesopScott/maps", "addyosmani/agent-skills", "github/spec-kit", "openai/openai-agents-python", "langchain-ai/langgraph", "crewAIInc/crewAI", "google/adk-python", "VoltAgent/awesome-agent-skills", "davila7/claude-code-templates", "microsoft/ai-agents-for-beginners"],
      tools: ["Git", "Agent Skills", "Test runner", "Agent runtime", "Browser/runtime verifier"],
      templates: ["templates/agent-build-plan.md", "templates/build-log.md"],
      catalogs: ["catalogs/skills.md", "catalogs/repos.md", "catalogs/tools.md"]
    }
  }
};
