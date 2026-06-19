# Role Agent Patterns

Use this reference to decide what kind of role is being created.

## Role Mode Ladder

| Mode | Best when | Output |
| --- | --- | --- |
| Persona-only | The role is a voice, style, or perspective with no durable responsibility. | Prompt/persona card |
| Advisory | The role gives judgment, critique, options, risks, and recommendations. | Advisory role contract |
| Workflow | The role owns a repeatable process, queue, handoff, review, or cadence. | Workflow role contract and runbook |
| Skill-backed | The role can be invoked as a reusable procedure across projects. | Draft or final `SKILL.md` |
| Loop-backed | The role must run repeatedly, observe state, update memory, and continue. | Agent loop spec |
| Agentic | The role has goals, state, tools, policies, memory, evals, and escalation. | Role-agent contract plus build plan |

## What Makes A Role An Agent

A role behaves like an agent when it has enough of these properties:

- Goal: it can pursue an outcome, not just answer a prompt.
- State: it remembers active work, decisions, preferences, context, or commitments.
- Tools: it can read, write, search, call APIs, create artifacts, or coordinate systems.
- Policy: it knows what it may do, must ask about, and must never do.
- Loop: it can plan, act, observe, update memory, and continue until a stop condition.
- Judgment: it handles ambiguity, tradeoffs, risks, and incomplete information.
- Handoff: it can pass work to humans or other roles with useful context.
- Evidence: it can cite sources, show work, and produce reviewable outputs.
- Evaluation: it has scenarios, rubrics, checks, or scorecards that prove usefulness.

A script performs a fixed transformation. A workflow follows a defined process. A skill packages repeatable method for an agent to use. A role agent combines mandate, context, tools, memory, policy, judgment, and a loop.

## Advisory Roles

Use advisory roles for board members, mentors, strategic critics, domain experts, legal reviewers, architecture reviewers, and executive voices that should influence decisions without owning execution.

Advisory roles should define:

- Decision rights: recommend only, challenge, approve, veto, or escalate.
- Perspective: what the role optimizes for.
- Evidence standard: what must be cited or checked.
- Challenge behavior: when the role should disagree.
- Output shape: memo, options table, critique, risk register, decision brief, or scorecard.

## Workflow Roles

Use workflow roles for support agents, data intake agents, research coordinators, QA reviewers, launch coordinators, onboarding coordinators, incident managers, and operations managers.

Workflow roles should define:

- Trigger and intake.
- Stages.
- Queue or work item shape.
- Inputs and required evidence.
- Outputs and done criteria.
- Handoffs.
- Approvals.
- Exception paths.
- Metrics.

## Skill-Backed Roles

Use a skill-backed role when the role is mostly a repeatable expert procedure that should be installable and reusable.

Good candidates:

- "Run customer interview synthesis."
- "Draft launch readiness review."
- "Score an agent eval report."
- "Prepare investor update."
- "Review support incident."

Skill-backed roles should define:

- Trigger description.
- Required inputs.
- Procedure.
- Templates or scripts.
- Output contract.
- Validation.

## Loop-Backed Roles

Use loop-backed roles when the role watches work over time or must keep moving without a single prompt completing the job.

Loop-backed roles should define:

- Start trigger.
- Recurrence or event trigger.
- State file or memory store.
- Planning step.
- Tool-use step.
- Observation step.
- Memory update step.
- Stop condition.
- Escalation condition.
- Audit log.

## Common Root-Organization Roles

Executive:

- CEO / Strategy: direction, priorities, tradeoffs, narrative, accountability.
- COO / Operations: cadence, execution health, handoffs, resource constraints.
- CFO / Finance: budgets, unit economics, risk, runway, financial controls.
- CTO / Technical: architecture, platform, engineering quality, build risk.
- CPO / Product: customer problem, product bets, roadmap, adoption, evidence.

Functional:

- Research Lead: market, user, and evidence synthesis.
- Data Steward: data quality, lineage, schemas, metrics, privacy.
- Support Lead: customer issues, triage, resolution quality, escalation.
- Sales Lead: pipeline, qualification, objections, revenue workflow.
- Marketing Lead: positioning, channels, content, brand consistency.
- People Lead: hiring, feedback, role clarity, team health.

Governance:

- Legal/Risk Advisor: compliance, contracts, policy, sensitive decisions.
- Security Reviewer: access, threat model, secrets, incident readiness.
- QA/Eval Reviewer: scenarios, tests, failure modes, release evidence.

## Role Quality Bar

A strong role has:

- A clear mandate.
- A small set of owned outcomes.
- Explicit non-responsibilities.
- A narrow authority boundary.
- Named inputs and outputs.
- Memory rules.
- Tool permissions.
- Escalation rules.
- Proof scenarios.
- A next build recommendation.
