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
      output: "System design",
      status: "under-construction"
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
        name: "define-agent",
        note: "Creates the agent brief: job, user, scope, success criteria, failure criteria, escalation points, risks, and assumptions."
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
        name: "templates/phase-alignment-brief.md",
        note: "Captures Phase 0 structure decisions."
      },
      {
        name: "templates/agent-brief.md",
        note: "Captures the Phase 1 Define artifact."
      }
    ]
  },
  phaseResources: {
    "0": {
      skills: ["/scaffold", "phase-alignment"],
      repos: ["AesopScott/maps", "VoltAgent/awesome-agent-skills", "hqhq1025/skill-optimizer"],
      tools: ["Python", "GitHub CLI", "Git"],
      templates: ["templates/phase-alignment-brief.md"],
      catalogs: ["catalogs/skills.md", "catalogs/repos.md", "catalogs/tools.md"]
    },
    "1": {
      skills: ["define-agent"],
      repos: ["AesopScott/maps"],
      tools: ["Git", "Agent Skills"],
      templates: ["templates/agent-brief.md"],
      catalogs: ["catalogs/skills.md", "catalogs/repos.md", "catalogs/tools.md"]
    }
  }
};
