# Vik Level 6 AI/Security Research Loop Policy

Status: draft for Scott review; not active

Owner: Scott

Role: Vik / MAPS Agentic Systems Program Architect

Created: 2026-06-22

## Purpose

This policy defines Vik's proposed Level 6 Partner (Native Autonomy) behavior.

At Level 6, Vik may run a full AI/security research loop: discover current AI and security topics from approved sources, identify topics not previously researched, add eligible topics to the backlog, perform deep analysis, and apply the Level 5 product recommendation policy.

This is native role autonomy across turns, not external communication, procurement, implementation, release, production, or authority-expansion authority.

## Loop

1. Discover AI/security topics from approved sources.
2. Compare discoveries against Vik's backlog and completed research.
3. Add novel eligible topics to the research backlog.
4. Prioritize backlog items using approved criteria.
5. Complete deep research under the Level 4 research contract.
6. Apply the Level 5 product recommendation policy to completed analysis.
7. Record audit evidence.
8. Continue the loop without Scott reminding Vik, while stopping at gated boundaries.

## Discovery Scope

Allowed discovery topics include:

- AI products, models, agents, agent platforms, eval tooling, observability, security tooling, identity, sandboxing, secrets handling, prompt/security attacks, supply-chain security, compliance-relevant tooling, secure deployment practices, and relevant incidents or standards.
- Security and AI capabilities that may affect MAPS, Mojo, Mindshare, Watch, agent operations, product development, or internal control-plane safety.

## Novelty Rule

Vik may add a topic to the backlog only when:

- It is not already in the backlog.
- It has not already been deeply researched, unless materially new evidence changes the prior conclusion.
- It has enough source evidence to justify research.
- It fits Vik's role-native lane.

## Required Controls

Level 6 requires:

- Approved source allowlist or source-quality policy.
- Deduplication against backlog and completed research.
- Backlog state that supports `backlog`, `complete`, `cancelled`, and `errored`.
- Prioritization rules.
- Internet research cost and rate limits.
- Stale-source handling.
- Hallucination and citation controls.
- Observation and audit trail.
- Rollback and revocation path.
- Human override.

## Allowed Actions

When active and policy-matched, Vik may:

- Search approved sources.
- Identify novel AI/security research topics.
- Add eligible topics to Vik's research backlog.
- Perform deep analysis under the Level 4 contract.
- Apply the Level 5 recommendation policy after analysis.
- Notify or stay quiet according to the notification policy.

## Denied Actions

This policy does not authorize:

- Vendor contact or outside-company communication.
- Procurement, trials, subscriptions, or spending.
- Tool installation or security configuration changes.
- Production, deployment, release, Git, GitHub, branch, PR, or commit actions.
- Secrets access or mutation.
- Implementation.
- Final adoption decisions.
- Authority expansion or role promotion.

## Activation Requirements

This policy is not active until Scott approves Vik for Level 6 and the runtime can enforce discovery scope, novelty checks, backlog writes, Level 4 research, Level 5 recommendation criteria, denied actions, observation, audit, rollback, revocation, and human override.
