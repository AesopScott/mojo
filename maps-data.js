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
      status: "under-construction"
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
        note: "Creates the MAPS repository structure, phase docs, phase skills, templates, catalogs, project page, README, license, and gitignore."
      },
      {
        name: "phase-alignment",
        note: "Captures lifecycle names, boundaries, scaffolding decisions, and open questions."
      },
      {
        name: "/define-agent",
        note: "Creates agents/{agent-handle}/agent-brief.md: job, user, scope, success criteria, failure criteria, escalation points, risks, and assumptions."
      },
      {
        name: "/design-agent",
        note: "Runs Research and Recommend, then creates agents/{agent-handle}/agent-design.md."
      },
      {
        name: "Addy TDD skill",
        url: "https://github.com/addyosmani/agent-skills/blob/main/skills/test-driven-development/SKILL.md",
        note: "Addy Osmani agent skill for red-green-refactor, proof discipline, test pyramid thinking, and regression protection."
      },
      {
        name: "Obra TDD skill",
        url: "https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md",
        note: "Obra Superpowers skill for strict TDD: write the test, watch it fail, write minimal code, then refactor."
      },
      {
        name: "/tdd",
        url: "https://github.com/mfranzon/tdd",
        note: "Focused Claude Code TDD skill that breaks plans or feature descriptions into small testable increments."
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
        note: "Skill/workflow alternative for spec, plan, API/interface design, ADRs, and test-driven development."
      },
      {
        name: "GSA-TTS AI Agent Specification Template",
        url: "https://github.com/GSA-TTS/devCrew_s/blob/master/docs/templates/AI%20Agent%20Specification%20Template.md",
        note: "Design-template alternative for agent architecture, autonomy, reasoning, tools, memory, and oversight."
      },
      {
        name: "GitHub Spec Kit",
        url: "https://github.com/github/spec-kit",
        note: "Spec-to-plan process alternative for turning intent into specification, technical plan, and tasks."
      },
      {
        name: "swingerman/disciplined-agentic-engineering",
        url: "https://github.com/swingerman/disciplined-agentic-engineering",
        note: "Acceptance Test Driven Development reference for agentic engineering and proof gates."
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
        name: "Web and repository research",
        note: "Finds comparable agents, reference architectures, implementation patterns, and design guidance."
      },
      {
        name: "Addy Osmani agent spec guidance",
        url: "https://addyosmani.com/blog/good-spec/",
        note: "Useful Design reference for objectives, context, constraints, acceptance criteria, and boundaries."
      },
      {
        name: "VS Code Copilot TDD guide",
        url: "https://code.visualstudio.com/docs/copilot/guides/test-driven-development-guide",
        note: "Official AI-assisted TDD guide using custom agents, handoffs, and custom instructions."
      }
    ],
    catalogs: [
      {
        name: "catalogs/skills.md",
        note: "Records skills by MAPS phase."
      },
      {
        name: "catalogs/repos.md",
        note: "Records useful repositories by MAPS phase."
      },
      {
        name: "catalogs/tools.md",
        note: "Records tools and services by MAPS phase."
      }
    ],
    templates: [
      {
        name: "templates/maps-scaffold-template.md",
        note: "Defines the repeatable MAPS repository structure that /scaffold instantiates."
      },
      {
        name: "templates/phase-alignment-brief.md",
        note: "Captures Phase 0 structure decisions."
      },
      {
        name: "templates/agent-definition-template.md",
        note: "Captures the Phase 1 Define artifact."
      },
      {
        name: "templates/workflow-spec.md",
        note: "Captures the Phase 2 Design artifact."
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
      skills: ["/design-agent", "Addy TDD skill", "Obra TDD skill", "/tdd"],
      repos: ["AesopScott/maps", "addyosmani/agent-skills", "GSA-TTS AI Agent Specification Template", "GitHub Spec Kit", "swingerman/disciplined-agentic-engineering"],
      tools: ["Git", "Agent Skills", "Web and repository research", "Addy Osmani agent spec guidance", "VS Code Copilot TDD guide"],
      templates: ["templates/workflow-spec.md"],
      catalogs: ["catalogs/skills.md", "catalogs/repos.md", "catalogs/tools.md"]
    }
  }
};
