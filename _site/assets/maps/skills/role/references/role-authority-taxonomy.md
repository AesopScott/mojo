# Role Authority Taxonomy

Use this taxonomy for every `/role` run. Authority must be declared explicitly; do not infer broad permission from the role title.

## Authority Levels

Choose the highest allowed level for the role, then restrict it by domain, approval gate, and special declarations.

| Level | Name | Meaning |
| --- | --- | --- |
| A0 | None | No role authority. Persona, voice, or context only. |
| A1 | Observe | Can read allowed context and summarize state. Cannot recommend action. |
| A2 | Advise | Can provide perspective, critique, risks, and options. |
| A3 | Recommend | Can recommend decisions or next actions with rationale and evidence. |
| A4 | Draft | Can draft artifacts, plans, messages, specs, tickets, or code for review. |
| A5 | Coordinate | Can organize work, maintain checklists, route handoffs, and request inputs. |
| A6 | Execute With Approval | Can prepare and execute actions only after explicit human or authorized-role approval. |
| A7 | Execute Within Policy | Can execute pre-approved actions inside named rules, limits, and rollback paths. |
| A8 | Approve | Can approve specified decisions or artifacts inside a named domain. |
| A9 | Veto | Can block specified decisions, releases, actions, or escalations inside a named domain. |
| A10 | Autonomous Within Bounds | Can plan, act, observe, update memory, and continue inside explicit boundaries and stop conditions. |
| A11 | Emergency Only | Can exceed normal authority only under declared incident or safety conditions. |
| A12 | Owner | Owns the outcome, operating loop, review rhythm, and improvement backlog for a domain. |

## Authority Domains

Declare authority separately for each relevant domain:

- Advice and critique.
- Artifact creation.
- Workflow ownership.
- Tool use.
- Memory and RAG writes.
- Source, evidence, and data handling.
- External communication.
- Spending, procurement, or commitments.
- Policy, governance, compliance, or risk.
- People, roles, staffing, or performance.
- Deployment, production, infrastructure, or runtime operations.
- Escalation, approval, veto, or incident response.

## Special Declaration Options

Use one or more special declarations when a role needs a precise authority shape:

- `read-only`: may read allowed context but cannot write artifacts, memory, systems, or messages.
- `recommend-only`: may recommend but cannot draft, execute, approve, or veto.
- `draft-only`: may draft but cannot send, merge, publish, deploy, approve, or commit.
- `human-approval-required`: every execution action requires explicit human approval.
- `role-approval-required`: execution requires approval from a named role.
- `two-key-approval`: execution requires two distinct approvers.
- `policy-bound`: may act only inside a named policy, runbook, or checklist.
- `budget-bound`: may act only below a named spending, time, token, or resource limit.
- `time-bound`: authority expires at a named date, milestone, or review.
- `scope-bound`: authority applies only to a named product, repo, workflow, customer, or domain.
- `memory-read`: may read persistent memory, notes, RAG, or source stores.
- `memory-write`: may write to persistent memory, notes, RAG, or source stores.
- `memory-propose`: may propose memory changes but cannot write them.
- `external-communication`: may communicate outside the project or organization through named channels.
- `no-external-communication`: cannot contact customers, vendors, public channels, or third parties.
- `tool-use`: may use named tools, APIs, scripts, MCP servers, or connectors.
- `no-tool-use`: cannot call tools or external systems.
- `production-access`: may touch runtime, deploy, secrets, data, or infrastructure inside declared limits.
- `no-production-access`: cannot touch production systems, secrets, deploys, or live data.
- `veto-right`: may block a named class of decisions or actions.
- `escalation-right`: may escalate to a named human, role, queue, incident process, or governance path.
- `emergency-break-glass`: may exceed normal authority only under declared emergency conditions, with logging and post-review.
- `self-improvement-propose`: may propose changes to its own responsibilities, skills, tools, or authority.
- `self-improvement-write`: may update its own role artifact only after the declared approval condition is satisfied.
- `revocable`: authority can be suspended or removed by a named human, role, policy, or incident condition.

## Default Safety Rules

- A role title does not grant authority.
- Advisory roles default to A2 Advise or A3 Recommend.
- Workflow-owner roles default to A5 Coordinate unless execution authority is explicitly declared.
- Skill-backed roles default to A4 Draft or A6 Execute With Approval.
- Loop-backed and agentic roles default to A6 Execute With Approval unless a policy-bound A7 or A10 scope is explicitly declared.
- Memory/RAG writes require an explicit `memory-write` declaration.
- External communication requires an explicit `external-communication` declaration.
- Production access requires an explicit `production-access` declaration.
- Spending or commitments require a declared budget, approval rule, and rollback/escalation path.
- Veto, approval, owner, autonomous, and emergency powers require evidence, scope, and revocation rules.

## Required Authority Output

Every role contract must include:

- Highest authority level.
- Authority by domain.
- Special declarations.
- Approval gates.
- Evidence required to use or expand authority.
- Forbidden actions.
- Escalation path.
- Revocation or rollback path.
- Review cadence for authority changes.
