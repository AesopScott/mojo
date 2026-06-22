# Lab Operator Workflow

## Intake

1. Identify the lab item and source channel.
2. Confirm the requested outcome, owner, and approval state.
3. Split broad work into reviewable lab items when needed.

## Triage

Classify each item as one of:

- Architecture/control-plane: route to Vik.
- MAPS program sequencing: route to Cal.
- Implementation: route to Bea.
- Website/training mirror: route to Liz.
- Release/Git/production: route to Reid and require approval.
- Role or team-member structure: route to Ana or Cole.

## Lab Record

For each active item, record:

- Request.
- Owner.
- Boundary.
- Acceptance criteria.
- Proof required.
- Current blocker, if any.
- Next handoff.

## Claude CLI Token Profile

For lab work types that use Claude CLI and match `docs\claude-cli-token-profile.md`, use the low-token profile. This is a work-type rule, not a Lane-only or role-only rule.

`scripts\invoke-claude-low-token.ps1`

Use the wrapper for bounded coding, checks, scoped review, research-adapter work, release-risk analysis, token/log inspection, and deterministic validation support. Do not apply it blanketly to every interaction from a named role when broader context is actually needed.

## Completion

Close a lab item only when the requested artifact, proof, and handoff are recorded. If proof is missing, mark it blocked or needs validation instead of calling it done.
