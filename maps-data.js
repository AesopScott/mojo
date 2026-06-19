window.MAPS_SITE = {
  phases: [
    {
      number: "m0",
      file: "m0.html",
      label: "M0",
      title: "Project Foundation",
      output: "Intent, notes scaffold, evidence, sources, and RAG readiness",
      status: "available"
    },
    {
      number: "m1",
      file: "m1.html",
      label: "M1",
      title: "System Shape",
      output: "S/M/U track decision before roster or APS entry",
      status: "available"
    },
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
      file: "m8.html",
      label: "M8 / Optional A2",
      title: "Experience Design",
      output: "After M7 orchestration, or before A3 build when there is no M layer",
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
      status: "available"
    },
    {
      number: "8",
      file: "8.html",
      label: "Phase 8",
      title: "Improve",
      output: "Improvement backlog",
      status: "available"
    },
    {
      number: "lab1",
      file: "lab-research-agent.html",
      label: "Lab 1",
      title: "Research Agent",
      output: "Class lab",
      status: "available",
      kind: "lab"
    },
    {
      number: "lab2",
      file: "lab-data-agent.html",
      label: "Lab 2",
      title: "Data Agent",
      output: "Class lab",
      status: "available",
      kind: "lab"
    },
    {
      number: "lab3",
      file: "lab-support-agent.html",
      label: "Lab 3",
      title: "Support Agent",
      output: "Class lab",
      status: "available",
      kind: "lab"
    }
  ],
  resources: {
    skills: [
      {
        name: "/foundation",
        url: "assets/maps/skills/foundation/SKILL.md",
        download: true,
        note: "Starts M0 Project Foundation with a one-question-at-a-time memory-first preflight, project intent, notes scaffold, Git and remote readiness, env/secrets scaffold, incremental foundation audits, EventStorming Lite, Service Blueprint Lite, source inventory, evidence index, assumptions, decisions, RAG-readiness, persistent memory contract, maps-run helper notes named [project]-[skill]-helper-notes, role-[role-name] notes, RAG mirrors, run log, remembered notes/RAG locations, and /foundation --wipe reset support."
      },
      {
        name: "/shape",
        url: "assets/maps/skills/shape/SKILL.md",
        download: true,
        note: "Runs M1 System Shape with the initial S/M/U question, then uses Research and Recommend plus pipeline owner guidance to choose Unknown / Scope First, Single-Agent / APS, or Multi-Agent / MAPS."
      },
      {
        name: "/role",
        url: "assets/maps/skills/role/SKILL.md",
        download: true,
        note: "Creates organization role agents with three minimum inputs, then uses mandatory external Research and Recommend to propose engagement type, advisory behavior, workflow ownership, authority taxonomy, special authority declarations, autonomy, memory, tools, boundaries, proof, and the implementation form."
      },
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
        name: "/design-experience",
        url: "assets/maps/skills/design-experience/SKILL.md",
        download: true,
        note: "Creates the M8 experience design artifact for journeys, surfaces, IA, interaction states, visual/tone standards, accessibility, and agent visibility."
      },
      {
        name: "/design-experience++",
        url: "assets/maps/skills/design-experience-plus-plus/SKILL.md",
        download: true,
        note: "Wraps M8 Experience Design with website/product UI references, shadcn/ui composition, Radix accessibility primitives, NN/g service-design reasoning, responsive layout, and frontend handoffs."
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
      },
      {
        name: "/maps",
        url: "https://github.com/AesopScott/maps",
        note: "Source repository for the MAPS program and plugin, including skills, templates, global install definitions, catalogs, and rule contracts."
      }
    ],
    repos: [
      {
        name: "AesopScott/maps",
        url: "https://github.com/AesopScott/maps",
        note: "Working MAPS repository."
      },
      {
        name: "NotebookLM",
        url: "https://notebooklm.google/",
        note: "M0 source-grounded research reference for collecting project sources, asking questions against them, and synthesizing evidence with citations."
      },
      {
        name: "Obsidian",
        url: "https://obsidian.md/",
        note: "M0 notes and memory reference for local-first Markdown vaults, linked notes, graph view, project memory, and durable context."
      },
      {
        name: "LlamaIndex",
        url: "https://developers.llamaindex.ai/python/framework/understanding/rag/",
        note: "M0 RAG-readiness reference for source loading, indexing, retrieval, and queryable project knowledge."
      },
      {
        name: "Atlassian Project Kickoff",
        url: "https://www.atlassian.com/team-playbook/plays/project-kickoff",
        note: "M0 kickoff reference for aligning purpose, roles, responsibilities, success markers, and next actions."
      },
      {
        name: "NN/g Service Blueprints",
        url: "https://www.nngroup.com/articles/service-blueprints-definition/",
        note: "M0 service-design reference for mapping people, touchpoints, processes, evidence, and customer/operator journeys."
      },
      {
        name: "Logseq",
        url: "https://logseq.com/",
        note: "M0 outliner and daily-notes reference for research capture, linked blocks, tasks, and privacy-first knowledge work."
      },
      {
        name: "Anytype",
        url: "https://anytype.io/",
        note: "M0 local-first object workspace reference for project entities, sources, decisions, tasks, and graph/database views."
      },
      {
        name: "AFFiNE",
        url: "https://affine.pro/",
        note: "M0 workspace reference combining docs, whiteboards, databases, and AI for notes plus service maps."
      },
      {
        name: "AppFlowy",
        url: "https://github.com/appflowy-io/appflowy",
        note: "M0 open-source workspace reference for project wikis, notes, tasks, and user-controlled data."
      },
      {
        name: "SiYuan",
        url: "https://github.com/siyuan-note/siyuan",
        note: "M0 privacy-first PKM reference for block-level references, Markdown WYSIWYG, and granular future retrieval."
      },
      {
        name: "Dovetail Research Repository",
        url: "https://dovetail.com/solutions/research-repository/",
        note: "M0 research repository reference for turning studies, transcripts, feedback, and customer evidence into reusable intelligence."
      },
      {
        name: "Productboard Feedback",
        url: "https://www.productboard.com/customer-feedback-tool/",
        note: "M0 product feedback reference for consolidating scattered customer signals and linking them to product decisions."
      },
      {
        name: "RAGFlow",
        url: "https://github.com/infiniflow/ragflow",
        note: "M0 document-heavy RAG reference for future knowledge-base implementation decisions."
      },
      {
        name: "Haystack",
        url: "https://github.com/deepset-ai/haystack",
        note: "M0 production RAG pipeline reference for retrieval systems that may follow the foundation scaffold."
      },
      {
        name: "Qdrant",
        url: "https://github.com/qdrant/qdrant",
        note: "M0 vector-store reference for later retrieval infrastructure choices."
      },
      {
        name: "Weaviate",
        url: "https://github.com/weaviate/weaviate",
        note: "M0 vector database reference for future semantic search and RAG infrastructure."
      },
      {
        name: "Chroma",
        url: "https://github.com/chroma-core/chroma",
        note: "M0 embedding database reference for local or app-level RAG prototypes."
      },
      {
        name: "EventStorming",
        url: "https://www.eventstorming.com/book/",
        note: "M1 Scope First reference for discovering domain events, commands, actors, policies, pain points, and hidden handoffs."
      },
      {
        name: "BPMN",
        url: "https://www.omg.org/bpmn/",
        note: "M1 workflow-shape reference for tasks, gateways, messages, swimlanes, approvals, and process boundaries."
      },
      {
        name: "Team Topologies",
        url: "https://teamtopologies.com/key-concepts",
        note: "M1 role-pressure reference for deciding when separation reduces cognitive load or creates coordination cost."
      },
      {
        name: "OpenAI Agent Orchestration",
        url: "https://openai.github.io/openai-agents-python/multi_agent/",
        note: "M1 agent orchestration reference for manager, handoff, and code-led versus LLM-led flow patterns."
      },
      {
        name: "OpenAI Swarm",
        url: "https://github.com/openai/swarm",
        note: "M1 educational handoff reference for lightweight agent coordination, routines, and agent-to-agent transfers."
      },
      {
        name: "OpenAI Cookbook Routines and Handoffs",
        url: "https://cookbook.openai.com/examples/orchestrating_agents",
        note: "M1 practical handoff reference for deciding when to keep one agent, split routines, or transfer control between agents."
      },
      {
        name: "LangGraph",
        url: "https://www.langchain.com/langgraph",
        note: "M1 graph-shaped agent workflow reference for single-agent, multi-agent, supervisor, and hierarchical control flows."
      },
      {
        name: "garrytan/gstack",
        url: "https://github.com/garrytan/gstack",
        note: "Highlighted /role reference for modeling software-development organizations as named SKILL.md specialists, slash-command workflows, and human-mediated role switching."
      },
      {
        name: "shadcn-ui/ui",
        url: "https://github.com/shadcn-ui/ui",
        note: "UI design system and copy-in component reference for polished, accessible React interfaces. Current research signal: 116,840 stars."
      },
      {
        name: "radix-ui/primitives",
        url: "https://github.com/radix-ui/primitives",
        note: "Low-level accessible primitives for custom product design systems. Current research signal: 18,986 stars."
      },
      {
        name: "tailwindlabs/headlessui",
        url: "https://github.com/tailwindlabs/headlessui",
        note: "Unstyled accessible UI primitives designed for Tailwind-based interfaces. Current research signal: 28,622 stars."
      },
      {
        name: "mui/material-ui",
        url: "https://github.com/mui/material-ui",
        note: "Comprehensive React component library implementing Material Design. Current research signal: 98,425 stars."
      },
      {
        name: "ant-design/ant-design",
        url: "https://github.com/ant-design/ant-design",
        note: "Enterprise-class UI design language and React component library. Current research signal: 98,374 stars."
      },
      {
        name: "chakra-ui/chakra-ui",
        url: "https://github.com/chakra-ui/chakra-ui",
        note: "Component system for fast SaaS and product UI development. Current research signal: 40,441 stars."
      },
      {
        name: "mantinedev/mantine",
        url: "https://github.com/mantinedev/mantine",
        note: "Full-featured React component library with broad UX coverage. Current research signal: 31,266 stars."
      },
      {
        name: "heroui-inc/heroui",
        url: "https://github.com/heroui-inc/heroui",
        note: "Modern React UI library formerly known as NextUI. Current research signal: 29,651 stars."
      },
      {
        name: "adobe/react-spectrum",
        url: "https://github.com/adobe/react-spectrum",
        note: "Accessible, adaptive UI libraries and tools from Adobe. Current research signal: 15,541 stars."
      },
      {
        name: "uswds/uswds",
        url: "https://github.com/uswds/uswds",
        note: "Accessible, mobile-friendly public-service design system reference. Current research signal: 7,114 stars."
      },
      {
        name: "alphagov/govuk-frontend",
        url: "https://github.com/alphagov/govuk-frontend",
        note: "Service UX and component guidance reference from GOV.UK. Current research signal: 1,414 stars."
      },
      {
        name: "microsoft/fluentui",
        url: "https://github.com/microsoft/fluentui",
        note: "Enterprise product UI component and interaction pattern reference. Current research signal: 20,059 stars."
      },
      {
        name: "primer/react",
        url: "https://github.com/primer/react",
        note: "GitHub Primer React implementation reference for product UI patterns, accessibility, and component behavior. Current research signal: 3,860 stars."
      },
      {
        name: "assistant-ui/assistant-ui",
        url: "https://github.com/assistant-ui/assistant-ui",
        note: "AI chat UI reference for streaming, thread surfaces, tool UI, and assistant interaction patterns. Current research signal: 10,666 stars."
      },
      {
        name: "CopilotKit/CopilotKit",
        url: "https://github.com/CopilotKit/CopilotKit",
        note: "Agentic frontend and generative UI reference for shared state, human-in-the-loop flows, and AG-UI patterns. Current research signal: 35,251 stars."
      },
      {
        name: "langchain-ai/agent-chat-ui",
        url: "https://github.com/langchain-ai/agent-chat-ui",
        note: "Reference chat UI for LangGraph agents, including deployment URL setup and agent conversation surfaces. Current research signal: 2,934 stars."
      },
      {
        name: "open-webui/open-webui",
        url: "https://github.com/open-webui/open-webui",
        note: "Full AI chat/product surface reference for model selection, threads, tools, settings, and local-first AI workflows. Current research signal: 142,022 stars."
      },
      {
        name: "lobehub/lobehub",
        url: "https://github.com/lobehub/lobehub",
        note: "Agent/operator UI reference for organizing AI agents, scheduling, reporting, and multi-agent operations. Current research signal: 78,779 stars."
      },
      {
        name: "mckaywrigley/chatbot-ui",
        url: "https://github.com/mckaywrigley/chatbot-ui",
        note: "AI chat application reference for model-agnostic conversation surfaces. Current research signal: 33,273 stars."
      },
      {
        name: "vercel/chatbot",
        url: "https://github.com/vercel/chatbot",
        note: "Full-featured Next.js AI chatbot reference from Vercel. Current research signal: 20,502 stars."
      },
      {
        name: "vercel/ai",
        url: "https://github.com/vercel/ai",
        note: "AI SDK and UI streaming reference for TypeScript AI applications and agents. Current research signal: 24,934 stars."
      },
      {
        name: "Chainlit/chainlit",
        url: "https://github.com/Chainlit/chainlit",
        note: "Conversational AI app framework reference for rapid agent/chat prototyping. Current research signal: 12,218 stars."
      },
      {
        name: "gradio-app/gradio",
        url: "https://github.com/gradio-app/gradio",
        note: "Rapid ML/AI app surface reference for demos, controls, and human review flows. Current research signal: 42,951 stars."
      },
      {
        name: "streamlit/streamlit",
        url: "https://github.com/streamlit/streamlit",
        note: "Rapid data and AI app surface reference for dashboards, review tools, and internal workflows. Current research signal: 44,992 stars."
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
        name: "MAPS skill contract validator",
        url: "assets/maps/scripts/validate_maps_skills.py",
        note: "Validates that MAPS skills preserve versioning, changelog entries, output contracts, completion reporting, one-question interviews, and memory-helper wiring before publish."
      },
      {
        name: "MAPS global install catalog",
        url: "assets/maps/catalogs/global-installs.md",
        note: "Defines global repos, plugins, hooks, vaults, context packets, and helper layers available to the MAPS program/plugin."
      },
      {
        name: "MAPS skill rule catalog",
        url: "assets/maps/catalogs/skill-rules.md",
        note: "Defines MAPS skill rules and the source files, helpers, templates, or validators that implement each rule."
      },
      {
        name: "Agent Skills",
        note: "Provides the SKILL.md packaging and workflow format used by /design-agent."
      },
      {
        name: "Experience design research",
        note: "Finds comparable product experiences, user journeys, front-end surfaces, design-system patterns, and agent UI interaction models."
      },
      {
        name: "Journey mapping",
        note: "Maps the user's path through surfaces, agent touchpoints, decision points, handoffs, approvals, empty states, errors, and recovery."
      },
      {
        name: "Information architecture",
        note: "Defines navigation, object hierarchy, content grouping, labels, wayfinding, and the relationship between product surfaces and agent work."
      },
      {
        name: "Interaction state modeling",
        note: "Captures loading, streaming, tool-use, approval, refusal, escalation, success, empty, error, and recovery states before Build."
      },
      {
        name: "Accessibility and inclusive design",
        note: "Checks keyboard behavior, semantic structure, focus, contrast, motion, readable copy, and assistive-technology expectations."
      },
      {
        name: "UI design system references",
        note: "Provides component, token, layout, accessibility, content, theming, and product-polish guidance from mature UI systems."
      },
      {
        name: "Agent interaction surface references",
        note: "Provides patterns for chat, copilot, generative UI, tool call display, streaming, approvals, review flows, handoff, and user control around agent activity."
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
        name: "templates/project-foundation.md",
        url: "assets/maps/templates/project-foundation.md",
        download: true,
        note: "Captures M0 Project Foundation: preflight decisions, intent, scaffold, EventStorming Lite, Service Blueprint Lite, evidence, sources, assumptions, decisions, persistent memory contract, per-skill notes, run log, open questions, and RAG readiness."
      },
      {
        name: "templates/system-shape.md",
        url: "assets/maps/templates/system-shape.md",
        download: true,
        note: "Captures M1 System Shape: research sources, recommendation rationale, pipeline owner guidance, S/M/U decision, BPMN Lite, role pressure, system shape, and next track recommendation."
      },
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
        name: "templates/experience-design.md",
        url: "assets/maps/templates/experience-design.md",
        download: true,
        note: "Captures the M8 product experience, journeys, surfaces, IA, visual/tone standards, accessibility, states, and APS handoffs."
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
    "m0": {
      skills: ["/foundation", "/role"],
      repos: ["AesopScott/maps", "garrytan/gstack", "NotebookLM", "Obsidian", "LlamaIndex", "Atlassian Project Kickoff", "NN/g Service Blueprints", "Logseq", "Anytype", "AFFiNE", "AppFlowy", "SiYuan", "Dovetail Research Repository", "Productboard Feedback", "RAGFlow", "Haystack", "Qdrant", "Weaviate", "Chroma"],
      tools: ["Markdown notes", "MAPS skill contract validator", "Shared MAPS memory helper", "Per-skill run notes", "Source inventory", "RAG readiness", "Service blueprinting", "EventStorming Lite"],
      templates: ["templates/project-foundation.md"]
    },
    "m1": {
      skills: ["/shape"],
      repos: ["AesopScott/maps", "EventStorming", "BPMN", "Team Topologies", "OpenAI Agent Orchestration", "OpenAI Swarm", "OpenAI Cookbook Routines and Handoffs", "LangGraph"],
      tools: ["BPMN Lite", "Role-pressure checks", "Service blueprinting", "Agent handoff mapping"],
      templates: ["templates/system-shape.md"]
    },
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
    "2a": {
      skills: ["/design-experience++", "/design-experience"],
      repos: ["AesopScott/maps", "shadcn-ui/ui", "radix-ui/primitives", "NN/g Service Blueprints", "tailwindlabs/headlessui", "mui/material-ui", "ant-design/ant-design", "chakra-ui/chakra-ui", "mantinedev/mantine", "heroui-inc/heroui", "adobe/react-spectrum", "uswds/uswds", "alphagov/govuk-frontend", "microsoft/fluentui", "primer/react", "assistant-ui/assistant-ui", "CopilotKit/CopilotKit", "langchain-ai/agent-chat-ui", "open-webui/open-webui", "lobehub/lobehub", "mckaywrigley/chatbot-ui", "vercel/chatbot", "vercel/ai", "Chainlit/chainlit", "gradio-app/gradio", "streamlit/streamlit"],
      tools: ["Git", "Agent Skills", "Experience design research", "Journey mapping", "Information architecture", "Interaction state modeling", "Accessibility and inclusive design", "UI design system references", "Agent interaction surface references", "Responsive website design", "Component pattern selection"],
      templates: ["templates/experience-design.md"]
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
