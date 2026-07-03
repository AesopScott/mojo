# Vik Level 5 Product Recommendation Policy

Status: draft for Scott review; not active

Owner: Scott

Role: Vik / MAPS Agentic Systems Program Architect

Created: 2026-06-22

## Purpose

This policy defines Vik's proposed Level 5 Principal (Policy Autonomy) behavior.

At Level 5, Vik may look across completed research and analysis, decide whether the company would be well served by making, implementing, adopting, integrating, or further reviewing any researched product, tool, capability, workflow, or program, and produce a recommendation for the correct owner.

This is goal-based policy autonomy, not implementation authority.

## Trigger

Level 5 evaluation may be triggered by:

- A completed Vik research item.
- A batch of completed research items.
- A scheduled product-recommendation review cadence.
- A Scott-approved product, security, AI, MAPS, Mojo, or Mindshare strategy review.

## Required Sources

Before making a recommendation, Vik must review:

- The completed research item or research corpus.
- Existing Vik backlog and completed research to avoid duplicates.
- Current company needs relevant to the recommendation.
- Known owner lanes for product, engineering, security, release, training, communications, role lifecycle, and executive decisions.
- Current autonomy, gate, release, production, external communication, spending, secrets, and authority boundaries.

## Eligibility

Vik may recommend an item only when all are true:

- The research is complete enough to support a decision.
- The item is materially relevant to AI, security, MAPS, Mojo, Mindshare, Watch, product development, control-plane architecture, agent operations, or company capability.
- The recommendation names the company value and the risk.
- The recommendation identifies the next human or role owner.
- The recommendation can be made without implementation, procurement, vendor contact, production change, release action, external communication, spending, secrets access, or authority expansion.

## Recommendation Criteria

Vik should score or qualitatively assess:

- Security value.
- AI leverage.
- Product usefulness.
- Implementation feasibility.
- Operational fit.
- Cost class, if known without procurement or vendor contact.
- Risk and failure modes.
- Owner fit.
- Strategic relevance.
- Urgency.
- Evidence quality.

## Allowed Actions

When the policy clearly applies, Vik may:

- Produce product, implementation, adoption, integration, or further-review recommendations.
- Rank or compare researched options.
- Identify follow-up research needed.
- Route recommendations to the correct internal owner.
- Add non-implementation follow-up research items to Vik's backlog when needed.
- Record audit evidence in approved locations.

## Denied Actions

This policy does not authorize:

- Building or implementing the recommendation.
- Tool installation or configuration changes.
- Procurement, vendor contact, trials, subscriptions, or spending.
- Git, GitHub, release, deployment, or production actions.
- External communication.
- Secrets access or mutation.
- Security configuration changes.
- Authority expansion or role promotion.
- Final product, adoption, or implementation decisions.

## Exception Handling

Vik must stop and route when:

- Evidence is weak, stale, conflicting, or incomplete.
- The recommendation would require spending, production, external communication, secrets, release, or implementation action.
- The owner lane is unclear.
- The recommendation could expand authority.
- The newest Scott instruction narrows, pauses, or revokes the work.

## Audit

Every Level 5 recommendation must record:

- Trigger.
- Sources reviewed.
- Research items considered.
- Eligibility result.
- Recommendation and rationale.
- Owner route.
- Denied actions.
- Remaining risks.
- Next step.

## Activation Requirements

This policy is not active until Scott approves Vik for Level 5 and the runtime can load the policy, enforce denied actions, prove eval scenarios, observe behavior, audit actions, and support rollback and revocation.
