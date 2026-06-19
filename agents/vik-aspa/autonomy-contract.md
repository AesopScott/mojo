# ASPA Autonomy Contract

Template version: 0.3.0.

## Changelog

- 2026-06-19 - v0.1.0 - Created draft full autonomy contract for ASPA build gating; activation remains blocked.
- 2026-06-19 - v0.2.0 - Added Scott's first input-led automation-purpose answer for pipeline development across multi-agent and single-agent work.
- 2026-06-19 - v0.3.0 - Reset the contract to an input-led worksheet after Scott rejected inferred automation authority and required one question at a time with R&R captured before build.

## Status

- Contract status: input-interview-in-progress
- Activation status: not active
- Approval status: not approved
- Owner and final approver: Scott
- Source role: `roles/vik/role-agent.md`
- Agent profile: `agents/vik-aspa/agent-profile.md`
- Agent design: `agents/vik-aspa/agent-design.md`
- Build plan: `agents/vik-aspa/agent-build-plan.md`

This worksheet is not an operating contract and does not authorize autonomous action. It exists to collect Scott's contract inputs one question at a time before Build, Equip, Evaluate, Deploy, Observe, or activation can treat autonomy as approved.

## Contract Map

The autonomy contract must be answered one question at a time:

1. Mission or delegated goal.
2. Scope: single-agent, multi-agent, or both.
3. R&R: roles and responsibilities.
4. Trigger, cadence, wakeup source, or explicit no-trigger rule.
5. Allowed outputs.
6. Allowed actions.
7. Disallowed actions.
8. Decision authority.
9. Tool authority.
10. Memory and state rights.
11. Approval gates.
12. Stop conditions.
13. Evaluation and proof requirements.
14. Audit, log, and reporting requirements.
15. Rollback or revocation path.
16. Notification and noise policy.
17. Named owner and final approver.

## Scott Contract Inputs

These answers are the source of truth for the future autonomy contract. Do not infer missing authority from architecture judgment, prior scaffolds, role memory, or heartbeat behavior.

| Field | Scott answer | Status |
| --- | --- | --- |
| Mission or delegated goal | Drive pipeline development. | input-recorded |
| Scope | Multi-agent and single-agent work. | input-recorded |
| R&R: roles and responsibilities | input-needed | blocker |
| Trigger, cadence, wakeup source, or no-trigger rule | input-needed | blocker |
| Allowed outputs | input-needed | blocker |
| Allowed actions | input-needed | blocker |
| Disallowed actions | input-needed | blocker |
| Decision authority | input-needed | blocker |
| Tool authority | input-needed | blocker |
| Memory and state rights | input-needed | blocker |
| Approval gates | input-needed | blocker |
| Stop conditions | input-needed | blocker |
| Evaluation and proof requirements | input-needed | blocker |
| Audit, log, and reporting requirements | input-needed | blocker |
| Rollback or revocation path | input-needed | blocker |
| Notification and noise policy | input-needed | blocker |
| Named owner and final approver | Scott is final approver. | partially recorded |

## Current Candidate Mission

ASPA should drive MAPS pipeline development for both multi-agent and single-agent work. No triggers, outputs, actions, tools, memory rights, decision authority, approval gates, or activation rights are approved yet.

## Current Build Decision

The current `/build-agent` pass may keep local contract loading and denied-autonomy proof artifacts. It must not install a scheduler, activate autonomous runtime, grant new authority, infer missing contract terms, or claim Agent status.

## Next Required Question

Who owns what in this automation: what should ASPA own, and what must remain with Scott, Matt, Bea, Reid, Mae, or another role?

## Non-Authorization

- No production deployment.
- No external communication.
- No spending, procurement, contracts, or commitments.
- No secrets or credential changes.
- No authority expansion for any role, Role+, Agent, tool agent, or human-owned operating lane.
- No global installs, global hooks, or non-project automation changes.
- No runtime activation, scheduler installation, or autonomous self-continuation.
- No Git/GitHub commits, pushes, branches, pull requests, releases, or cleanup without Release Management/Reid routing.
- No writing outside approved Mojo, Mindshare, or project-specified memory/RAG locations.
