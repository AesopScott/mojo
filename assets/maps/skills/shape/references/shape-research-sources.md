# Shape Research Sources

Use this source map for every `/shape` run. M1 track recommendations should be evidence-backed, not based on a user's ability to self-classify the system.

## Research Rule

Use at least two source categories for every S/M/U recommendation:

- One workflow or service-shape source.
- One role-pressure, team-design, or agent-orchestration source.

Use project foundation context to localize the decision, but use external or bundled references to explain why a track is appropriate.

## Workflow And Service Shape

- BPMN: use for tasks, gateways, swimlanes, handoffs, approvals, and exception paths.
  - https://www.omg.org/bpmn/
- NN/g Service Blueprints: use for frontstage/backstage work, evidence, handoffs, and failure points.
  - https://www.nngroup.com/articles/service-blueprints-definition/
- Atlassian Project Kickoff: use for purpose, roles, responsibilities, success markers, and unknowns.
  - https://www.atlassian.com/team-playbook/plays/project-kickoff
- EventStorming: use for domain events, commands, actors, policies, and hidden workflow boundaries.
  - https://www.eventstorming.com/book/

## Role Pressure And Team Design

- Team Topologies: use for cognitive load, team boundaries, stream-aligned/platform/enabling/complicated-subsystem patterns, and when separation creates or reduces coordination cost.
  - https://teamtopologies.com/key-concepts
  - https://www.atlassian.com/devops/frameworks/team-topologies
- Atlassian Roles and Responsibilities: use for responsibility clarity, ownership gaps, and handoff pressure.
  - https://www.atlassian.com/team-playbook/plays/roles-and-responsibilities

## Agent Orchestration Shape

- OpenAI Agents SDK multi-agent orchestration: use for manager, handoff, and code-led versus LLM-led flow patterns.
  - https://openai.github.io/openai-agents-python/multi_agent/
- OpenAI Cookbook routines and handoffs: use for practical single-agent routines, handoffs, and when to transfer control.
  - https://cookbook.openai.com/examples/orchestrating_agents
- LangGraph: use for stateful graph workflows, supervisor patterns, persistence, and human-in-the-loop control flow.
  - https://langchain-ai.github.io/langgraph/

## Pipeline Owner Guidance Source

If a project contains a pipeline owner, MAPS program manager, or similar role artifact, use it as advisory guidance for:

- phase boundaries
- track confidence
- role-pressure interpretation
- memory/RAG implications
- whether to run `/role` before deeper MAPS work
- next-skill routing

If no pipeline owner artifact exists, include a short "Pipeline owner guidance" inference based on the role concept: protect scope, avoid premature decomposition, require evidence for MAPS coordination cost, and make the next skill explicit.

## Track Recommendation Heuristics

Recommend Unknown / Scope First when:

- the workflow cannot be named as start, steps, decisions, handoffs, and done criteria
- actors or operators are unclear
- data, notes, memory, or RAG boundaries are still unknown
- approvals, compliance, or trust boundaries are not defined
- risk would make a premature APS/MAPS decision expensive

Recommend Single-Agent / APS when:

- one coherent agent can own the outcome
- the work is mostly sequential
- one memory/tool context is enough
- handoffs add more coordination cost than value
- proof can be expressed as a single behavior/eval surface

Recommend Multi-Agent / MAPS when:

- separate roles have meaningfully different expertise, tools, permissions, memory, timing, or accountability
- review, critique, approval, or escalation is part of the system behavior
- parallel work or durable handoffs create value
- role separation reduces cognitive load more than it adds coordination cost
- the system needs contracts between agents, not just subroutines inside one agent

## Required Output

Every `/shape` recommendation must include:

- sources consulted
- track recommendation
- confidence
- rationale
- contrary signals
- what would change the decision
- Pipeline owner guidance note
- next skill to run
