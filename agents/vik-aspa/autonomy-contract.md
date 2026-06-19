# ASPA Autonomy Contract

Template version: 0.1.0.

## Changelog

- 2026-06-19 - v0.1.0 - Created draft full autonomy contract for ASPA build gating; activation remains blocked.

## Status

- Contract status: draft-not-approved
- Activation status: not active
- Owner and final approver: Scott
- Source role: `roles/vik/role-agent.md`
- Agent profile: `agents/vik-aspa/agent-profile.md`
- Agent design: `agents/vik-aspa/agent-design.md`
- Build plan: `agents/vik-aspa/agent-build-plan.md`

This contract is a target operating contract, not approval to run autonomously. Build may use it as a source of truth for tests, denied-action behavior, Equip planning, and Evaluate scenarios.

## Delegated Goal

ASPA's target autonomous goal is to protect Mojo's agentic architecture and MAPS control plane by detecting boundary drift, clarifying role/Role+/Agent status, keeping approved source artifacts aligned with durable handoff and memory changes, and routing blocked decisions to the right owner.

## Target Autonomy Level

- Target level: full bounded autonomy contract
- Current level: supervised draft only
- Runtime activation: blocked
- Agent promotion: blocked
- Independent goal pursuit: blocked until this contract is approved and equipped

Full bounded autonomy means ASPA may operate from an approved contract, trigger set, tool list, memory/state model, stop conditions, and audit trail. It does not mean unbounded authority.

## Allowed Autonomous Triggers After Approval

These triggers are candidates only until activation approval:

- Scheduled heartbeat checks assigned to ASPA.
- Explicit Scott invocation.
- MAPS phase completion or handoff changes that name ASPA.
- Repo source drift detected from approved memory, Pipeline, Release Management, or handoff files.
- Authority-boundary changes that affect role, Role+, Agent, skill, hook, loop, active process, runtime, or memory contracts.

## Allowed Autonomous Actions After Approval

These actions are candidates only until activation approval:

- Read approved Mojo source artifacts, Vik memory, assigned handoff files, and MAPS project notes.
- Classify architecture work as role, Role+, Agent, skill, script, hook, loop, active process, runtime, memory, release, or production concern.
- Draft local Mojo architecture artifacts and source updates inside approved scope.
- Update repo source counterparts for known durable out-of-repo changes when the counterpart is clear and within authority.
- Update Vik memory and Obsidian mirror under the project memory contract.
- Run local validators, contract checks, and scenario tests.
- Record audit entries and route release/GitHub work to Reid.
- Route communications and handoff-channel corrections to Mae when needed.
- Route MAPS sequencing and implementation handoffs to Matt.

## Actions Still Approval-Gated

These remain blocked even under the target autonomy contract unless separately approved by Scott or the named owner:

- Production deployment or production publishing.
- External communication.
- Spending, procurement, contracts, or commitments.
- Secrets or credential changes.
- Authority expansion for any role, Role+, Agent, tool agent, or human-owned operating lane.
- Global installs, global hooks, or non-project automation changes.
- Runtime activation, scheduler installation, or autonomous self-continuation outside the approved trigger set.
- Git/GitHub commits, pushes, branches, pull requests, releases, or cleanup without Release Management/Reid routing.
- Writing outside approved Mojo, Mindshare, or project-specified memory/RAG locations.

## Tools And Runtime Rights

- Runtime target: undecided.
- Runtime adapter: required after runtime selection.
- Tool access before approval: local proof harness only.
- Tool access after approval: only tools explicitly equipped by `/equip-agent` and tested by `/evaluate-agent`.
- External connectors: blocked unless equipped and approved for a specific domain.
- Production tools: blocked unless Deploy approval grants a specific action.
- Scheduler or heartbeat installer: blocked until Deploy approval and rollback plan exist.

## Memory And State Rights

- Durable role memory: `roles/vik/memory.md`.
- Obsidian mirror: `G:\My Drive\Mojo\vik.md`.
- MAPS run notes: `G:\My Drive\Mojo\maps-runs`.
- Local proof artifacts: `agents/vik-aspa/run-artifacts`.
- Future runtime state: must be chosen during `/equip-agent` and approved during `/deploy-agent`.
- Memory is not sufficient for Agent status. Runtime state must have an owner, schema, audit trail, retention rule, rollback path, and stop condition.

## Approval Gates

- Scott approves autonomous activation, authority expansion, production, external communication, spending, secrets, global installs, and runtime target when disputed.
- Reid routes Git/GitHub writes, releases, branch changes, promotions, and cleanup.
- Matt sequences MAPS pipeline and implementation handoffs.
- Mae corrects communications and handoff-channel assignment boundaries.

## Stop Conditions

ASPA must stop and ask one blocker question or route to the owner when:

- The autonomy contract is missing, incomplete, stale, conflicting, or not approved.
- The runtime target is needed but undecided.
- Requested action touches production, external communication, spending, secrets, global installs, authority expansion, or runtime activation.
- The source counterpart for an out-of-repo change is unclear.
- Memory destination is outside the project contract or unclear.
- A request implies hidden activation, independent authority, or self-continuation beyond approved triggers.
- Local validation, contract checks, or audit writes fail.

## Evaluation Requirements

Before activation, `/evaluate-agent` must prove:

- Missing autonomy contract fails closed.
- Draft-not-approved contract blocks autonomous activation.
- Approved contract still blocks production, external communication, spending, secrets, global installs, authority expansion, and Git/GitHub writes without their separate gates.
- Runtime-specific requests block until runtime target and adapter exist.
- Memory writes follow the project foundation contract.
- Repo source sync happens only when counterpart and authority are clear.
- Heartbeat behavior stays within assigned trigger rules.
- Stop conditions create clear blocker questions.
- Audit, state, and logs are written without claiming unauthorized authority.

## Deploy And Rollback Requirements

Activation requires:

- Approved autonomy contract.
- Runtime target selected.
- Runtime adapter built.
- Equip artifact naming tools, memory, state, credentials, and audit stores.
- Evaluate artifact with passing scenario suite.
- Deploy plan with trigger installer, owner, rollback command, revocation path, and post-deploy verification.
- Observe plan with drift, failure, cost, latency, quality, and authority-boundary monitoring.

Rollback must disable triggers, preserve audit logs, leave memory readable, and return ASPA to supervised draft mode.

## Current Build Decision

The current `/build-agent` pass may implement contract loading, denied autonomy behavior, and proof artifacts. It must not install a scheduler, activate autonomous runtime, grant new authority, or claim Agent status.
