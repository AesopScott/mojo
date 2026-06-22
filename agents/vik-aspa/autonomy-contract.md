# ASPA Autonomy Contract

Template version: 0.7.0.

## Changelog

- 2026-06-19 - v0.1.0 - Created draft full autonomy contract for ASPA build gating; activation remains blocked.
- 2026-06-19 - v0.2.0 - Added Scott's first input-led automation-purpose answer for pipeline development across multi-agent and single-agent work.
- 2026-06-19 - v0.3.0 - Reset the contract to an input-led worksheet after Scott rejected inferred automation authority and required one question at a time with R&R captured before build.
- 2026-06-19 - v0.4.0 - Paused ASPA Agent promotion after guardrail failures; no further autonomy-contract interview or promotion work should continue until guardrails and eval proof are strengthened.
- 2026-06-21 - v0.5.0 - Made `roles/vik/Autonomy.md` the canonical human-authored autonomy contract and reduced this file to a Build compatibility pointer; activation remains blocked.
- 2026-06-21 - v0.6.0 - Recorded that Scott completed and approved the autonomy contract interview in `roles/vik/Autonomy.md`; this shim now points Build/Evaluate to the canonical answers and keeps activation blocked.
- 2026-06-22 - v0.7.0 - Recorded canonical Level 4 Senior Staff scoped autonomy approval while keeping Level 5, Level 6, Agent promotion, and autonomous runtime activation blocked.

## Status

- Canonical autonomy source: `roles/vik/Autonomy.md`
- Contract status: interview answers complete in canonical source
- Activation status: approved for Level 4 scoped autonomy only
- Autonomous runtime activation status: not active
- Approval status: approved for valid backlog-triggered research/architecture loops only
- Promotion work status: Level 4 active; Level 5, Level 6, Agent promotion, and deployed runtime still blocked
- Owner and final approver: Scott
- Source role: `roles/vik/role-agent.md`
- Agent profile: `agents/vik-aspa/agent-profile.md`
- Agent design: `agents/vik-aspa/agent-design.md`
- Build plan: `agents/vik-aspa/agent-build-plan.md`

This file is a compatibility shim for MAPS Build artifacts that expect an `agents/{agent-handle}/autonomy-contract.md` file. It is not the canonical autonomy contract and does not itself authorize autonomous action.

Build, Equip, Evaluate, Deploy, Observe, and runtime adapters must read `roles/vik/Autonomy.md` as the canonical autonomy source.

## Scott Contract Answers

The approved answers live in `roles/vik/Autonomy.md` under `Approved Contract Answers`. This table is a compatibility index only. Missing or conflicting authority must not be inferred from role seniority, prior conversation, heartbeat behavior, architectural preference, tool access, file access, or gate access.

| Field | Scott answer | Status |
| --- | --- | --- |
| Mission or delegated goal | See canonical contract. | approved-canonical |
| Scope | See canonical contract. | approved-canonical |
| R&R: roles and responsibilities | See canonical contract. | approved-canonical |
| Trigger, cadence, wakeup source, or no-trigger rule | See canonical contract. | approved-canonical |
| Allowed outputs | See canonical contract. | approved-canonical |
| Allowed actions | See canonical contract. | approved-canonical |
| Disallowed actions | See canonical contract. | approved-canonical |
| Decision authority | See canonical contract. | approved-canonical |
| Tool authority | See canonical contract. | approved-canonical |
| Memory and state rights | See canonical contract. | approved-canonical |
| Approval gates | See canonical contract. | approved-canonical |
| Stop conditions | See canonical contract. | approved-canonical |
| Evaluation and proof requirements | See canonical contract. | approved-canonical |
| Audit, log, and reporting requirements | See canonical contract. | approved-canonical |
| Rollback or revocation path | See canonical contract. | approved-canonical |
| Notification and noise policy | See canonical contract. | approved-canonical |
| Named owner and final approver | Scott is final approver. | approved-canonical |

## Build Compatibility Rule

Any MAPS phase or runtime code that reads this file must immediately follow the canonical pointer to `roles/vik/Autonomy.md`.

If `roles/vik/Autonomy.md` is missing, unreadable, or inconsistent with this shim, autonomy-related Build, Equip, Evaluate, Deploy, Observe, or runtime work must fail closed and ask Scott for direction.

## Next Required Question

None for the current autonomy contract interview. Future contract changes must be asked one question at a time, researched first, and approved before they are recorded.

The next promotion step is Principal/Level 5 policy packet preparation, full eval proof, strict-intent packet, rollback/revocation drill, and deployment/observation decision. This next step requires separate approval and does not authorize Level 5, Level 6, Agent promotion, or autonomous runtime activation.

## Non-Authorization

- No production deployment.
- No outside-company communication.
- No spending, procurement, contracts, or commitments.
- No secrets or credential changes.
- No authority expansion for any role, Role+, Agent, tool agent, or human-owned operating lane.
- No global installs, global hooks, or non-project automation changes.
- No runtime activation, scheduler installation, or autonomous self-continuation beyond the canonical Level 4 scoped research/architecture loop.
- No Git/GitHub commits, pushes, branches, pull requests, releases, or cleanup without Release Management/Reid routing.
- No writing outside approved Mojo, Mindshare, or project-specified memory/RAG locations.
