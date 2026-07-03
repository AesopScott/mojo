# Agent Backlog

Template version: 0.3.0.

## Changelog

- 2026-06-19 - v0.3.0 - Added Build 10/10 proof matrix fields for runnable command evidence, fail-closed tests, profile conflict tests, denied-behavior tests, audit/state/log artifacts, runtime-adapter proof, and Equip/Evaluate handoffs.
- 2026-06-19 - v0.2.0 - Added role-to-agent category, authority, memory, stop-condition, runtime, and proof-gate fields.

## Input

- Source role contract:
- Agent profile:
- Agent brief:
- Agent design:
- Research sources:
- Runtime target:

## Role-Agent Boundary

- Current category: Role / Role+ / Agent
- Target category for this backlog: Role / Role+ / Agent
- Category change approved by Scott: Yes / No / Not applicable
- Category constraints to preserve:
- Promotion guard:

## Backlog Summary

- Prioritization method:
- First build slice:
- Highest dependency risk:
- Highest safety risk:
- Highest authority risk:
- Highest memory/state risk:
- Deferred improvement themes:

## Authority, Memory, And Stop Conditions

- Authority level:
- Authority domains:
- Allowed without approval:
- Requires approval:
- Forbidden actions:
- Memory write boundaries:
- Handoff read/write boundaries:
- Stop conditions:

## Build Backlog

| ID | Backlog Item | Type | Priority | Depends On | Proof Required | Authority/Category Constraint | Memory/State Constraint | Runtime/Adapter Impact | Stop Condition | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| B-001 |  | Epic / Slice / Task / Spike | P0 / P1 / P2 / Later |  |  |  |  |  |  | Ready / Blocked / Deferred |
| B-002 |  | Epic / Slice / Task / Spike | P0 / P1 / P2 / Later |  |  |  |  |  |  | Ready / Blocked / Deferred |
| B-003 |  | Epic / Slice / Task / Spike | P0 / P1 / P2 / Later |  |  |  |  |  |  | Ready / Blocked / Deferred |

## Dependency Map

- Must happen before Build:
- Must happen before Equip:
- Must happen before Evaluate:
- Must happen before Deploy:
- Can wait for Improve:

## First Slice Definition

- Slice:
- User-visible behavior:
- Smallest proof:
- Required files/tools:
- Authority/category constraints:
- Memory/state constraints:
- Runtime target or adapter:
- Approval gates:
- Acceptance criteria:
- Stop condition:

## Build 10/10 Proof Matrix

- Real role-to-agent proof build:
- Local run command:
- Local run evidence:
- Missing `agent-profile.md` fail-closed test:
- Missing `agent-design.md` fail-closed test:
- Profile/design conflict test:
- Stricter profile limit applied:
- Profile-denied tool behavior test:
- Profile-denied memory-write behavior test:
- Profile-denied external-communication behavior test:
- Profile-denied production-access behavior test:
- Profile-denied spending behavior test:
- Profile-denied autonomous-timer behavior test:
- Profile-denied secrets behavior test:
- Profile-denied authority-expansion behavior test:
- Audit artifact:
- State artifact:
- Log artifact:
- Runtime target selected:
- Runtime adapter required:
- Runtime adapter proof:
- Runtime-neutral adapter deferral:
- Equip handoff:
- Evaluate handoff:

## Deferred Improvement Backlog

| ID | Improvement | Trigger | Priority | Depends On | Evidence Needed |
|---|---|---|---|---|---|
| I-001 |  | Observation / Eval failure / User feedback / Tech debt | P0 / P1 / P2 / Later |  |  |
