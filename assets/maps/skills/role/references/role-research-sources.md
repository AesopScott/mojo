# Role Research Sources

Use this source map for every `/role` run. External research is mandatory unless the user explicitly asks for an offline draft.

## Research Rule

Use at least three external sources for every role recommendation:

- One role-domain source for the human role or function.
- One operating-model or workflow source.
- One agent, governance, security, or control source when the role will use tools, memory, RAG, approvals, automation, hooks, loops, or autonomy.

If web access is unavailable, report that the recommendation is provisional and name the sources that should be checked before finalizing the role contract.

## Executive And Leadership Roles

Use for CEO, CTO, COO, CFO, CPO, Chief of Staff, AI Operations Lead, and executive advisors.

- CTO Craft: use for CTO and technical leadership responsibility patterns.
  - https://www.ctocraft.com/
- Amazing CTO: use for startup CTO role scope, technology strategy, scaling, architecture, and leadership.
  - https://www.amazingcto.com/what-does-cto-do-role-responsibilities/
- Monster CTO job template: use only as a baseline responsibility checklist, not as the final role design.
  - https://hiring.monster.com/resources/job-descriptions/executive/cto/
- First Round Review: use for startup leadership, operating cadence, and founder/executive role design.
  - https://review.firstround.com/
- a16z: use for startup operating models, AI company building, and executive decision patterns.
  - https://a16z.com/

## Product, Customer, And Growth Roles

Use for CPO, product lead, growth lead, customer research lead, product advisor, and product operations roles.

- Silicon Valley Product Group product management: use for product responsibility, discovery, value, viability, and empowered product teams.
  - https://www.svpg.com/product-management-start-here/
  - https://www.svpg.com/product-manager-job-description/
- Lenny's Newsletter: use for product/growth operating patterns, customer discovery, PM practices, and startup examples.
  - https://www.lennysnewsletter.com/
- Reforge: use for growth, product strategy, lifecycle, and go-to-market operating models.
  - https://www.reforge.com/

## Operating Model, Team Design, And Workflow Roles

Use for COO, operations lead, support lead, delivery lead, platform lead, team lead, program manager, and workflow-owner roles.

- Team Topologies: use for stream-aligned, platform, complicated-subsystem, and enabling team models.
  - https://teamtopologies.com/
  - https://www.atlassian.com/devops/frameworks/team-topologies
- Atlassian Project Kickoff: use for project purpose, roles, responsibilities, success markers, and kickoff structure.
  - https://www.atlassian.com/team-playbook/plays/project-kickoff
- Atlassian Roles and Responsibilities: use for clarifying responsibilities, gaps, and ownership.
  - https://www.atlassian.com/team-playbook/plays/roles-and-responsibilities
- Google SRE book: use for operations, reliability, monitoring, incident response, alerting, and postmortem roles.
  - https://sre.google/sre-book/table-of-contents/
  - https://sre.google/sre-book/monitoring-distributed-systems/

## Governance, Risk, Security, And Compliance Roles

Use for risk advisor, security reviewer, AI governance lead, compliance lead, privacy lead, legal/risk reviewer, and autonomous-agent control roles.

- NIST AI Risk Management Framework: use for AI governance, risk mapping, measurement, management, and accountability.
  - https://www.nist.gov/itl/ai-risk-management-framework
  - https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
- OWASP Top 10 for LLM Applications: use for LLM security risks and controls.
  - https://owasp.org/www-project-top-10-for-large-language-model-applications/
- OWASP Top 10 for Agentic Applications: use for autonomous and semi-autonomous agent risk patterns.
  - https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/

## Agentic Role And Multi-Agent Design Sources

Use for skill-backed, loop-backed, tool-using, autonomous, and human-in-the-loop roles.

- OpenAI Agents SDK docs: use for agent definitions, tools, state, orchestration, handoffs, guardrails, human review, and observability.
  - https://developers.openai.com/api/docs/guides/agents
  - https://openai.github.io/openai-agents-python/agents/
  - https://openai.github.io/openai-agents-python/handoffs/
- LangGraph: use for stateful graph-based workflows, persistence, human-in-the-loop, and multi-agent control flow.
  - https://langchain-ai.github.io/langgraph/
- CrewAI: use for crew/role/task-oriented multi-agent examples and role decomposition.
  - https://docs.crewai.com/
- Microsoft AutoGen: use for multi-agent conversations, role-based collaboration, and human-in-the-loop patterns.
  - https://microsoft.github.io/autogen/
- VoltAgent awesome-agent-skills: use for agent skill examples and packaging patterns.
  - https://github.com/VoltAgent/awesome-agent-skills

## How To Weight Sources

Use this weighting when making recommendations:

- 50 percent external role and operating-model research.
- 25 percent project foundation, organization context, and user description.
- 15 percent agentic design, governance, safety, memory, and tool-control references.
- 10 percent bundled role-pattern ladder and MAPS conventions.

If external sources conflict with the user's intent, explain the conflict and recommend a project-specific override instead of forcing a generic job description.

## Source Use In Output

Every completed role contract must include:

- Sources consulted.
- What each source contributed.
- Which recommendation came from external research.
- Which recommendation came from project context.
- Which recommendation is an assumption needing validation.
- Recommended implementation form: skill, script, hook, active process, scheduled loop, workflow/runbook, MCP/tool integration, dashboard/report, or human operating procedure.
- Why that implementation form fits the role's trigger, authority, state, permissions, and failure behavior.
