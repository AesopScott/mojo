# Role Engagement Taxonomy

Use this taxonomy for every `/role` run. Engagement is separate from authority.

Authority answers: what is this role allowed to decide or do?
Engagement answers: how does this role participate?

## Engagement Types

| Engagement | Meaning | Typical Implementation |
| --- | --- | --- |
| Passive Reference | The role exists as documented expertise. It is read only when invoked or when another skill explicitly loads it. | Role note, context packet, AGENTS.md reference, or documentation page. |
| Advisory | The role gives recommendations, critique, risks, tradeoffs, and decision support. It does not own execution. | Skill, advisory prompt, role note, review memo, or decision brief. |
| Review Gate | The role reviews work before a phase, release, decision, or handoff advances. | Checklist, review protocol, hook, PR review, approval step, or scorecard. |
| Workflow Owner | The role owns a recurring process or phase. It guides sequence, asks required questions, tracks completion, and routes the next step. | Skill plus runbook, workflow.md, project board, queue, or phase owner protocol. |
| Operator | The role performs work directly inside a defined scope. It writes artifacts, runs tools, updates notes, or executes scripts. | Skill plus scripts/tools, MCP integration, command runner, or human-in-the-loop operating procedure. |
| Autonomous Loop | The role can run repeatedly from triggers, schedules, monitors, or hooks within bounded policy. | Hook, monitor, scheduled job, active process, agent runtime, loop.md, or durable workflow. |
| Escalation Authority | The role activates when ambiguity, risk, conflict, budget, policy, memory, or phase-boundary problems appear. | AGENTS.md trigger, incident protocol, escalation path, governance checklist, or role approval gate. |

## Engagement Questions

When the role name, user description, and role type are known, recommend:

- Primary engagement.
- Secondary engagements, if any.
- Trigger: user-invoked, phase boundary, artifact change, scheduled cadence, risk signal, policy breach, or incident.
- Cadence: one-shot, per phase, per artifact, daily, weekly, event-driven, continuous, or emergency-only.
- Participation depth: read, advise, review, coordinate, execute, monitor, escalate.
- Human involvement: none, human-in-the-loop, human approval, role approval, two-key approval, or human owner.
- Stop condition or deactivation rule.

## Engagement To Implementation Mapping

| Engagement | Use This When | Recommend |
| --- | --- | --- |
| Passive Reference | The role is mostly context, voice, standards, or durable expertise. | Role note, AGENTS.md reference, or memory entry. |
| Advisory | The role should influence decisions without owning execution. | Skill, advisory prompt, memo template, or critique checklist. |
| Review Gate | The role must approve, challenge, score, or block progress. | Checklist, hook, PR/review protocol, scorecard, or approval gate. |
| Workflow Owner | The role owns sequence, handoffs, completion, and routing. | Skill plus runbook, workflow.md, queue, or project management workflow. |
| Operator | The role performs bounded work with tools or artifacts. | Skill plus scripts/tools, MCP/tool integration, command spec, or human operating procedure. |
| Autonomous Loop | The role watches, plans, acts, updates memory, and repeats. | Loop spec, scheduled process, monitor, hook, agent runtime, durable workflow, or active process. |
| Escalation Authority | The role should activate on ambiguity, risk, conflict, policy, or incident conditions. | AGENTS.md trigger, escalation matrix, governance path, incident protocol, or approval gate. |

## Default Engagement Rules

- Do not infer engagement from role title. A CTO can be passive, advisory, review gate, workflow owner, operator, autonomous loop, or escalation authority.
- Advisory engagement does not imply execution authority.
- Workflow ownership does not imply tool execution unless authority permits it.
- Operator and autonomous-loop engagements require explicit authority, tool permissions, memory rules, observability, and stop conditions.
- Escalation authority requires trigger conditions, escalation path, and override limits.
- Multiple engagements are allowed, but the role contract must name the primary engagement.

## Required Engagement Output

Every role contract must include:

- Primary engagement.
- Secondary engagements.
- Engagement trigger.
- Cadence.
- Participation depth.
- Human involvement and approvals.
- Implementation mapping.
- Stop or deactivation condition.
