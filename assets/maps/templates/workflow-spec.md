# Agent Workflow Spec

Template version: 0.2.0.

## Changelog

- 2026-06-19 - v0.2.0 - Added role-to-agent category, authority, memory, stop-condition, runtime, proof-gate, and build-gate fields for compatibility with `agent-design.md`.

## Input

- Agent brief:
- Source role contract:
- Source role memory:
- Agent profile:
- Research sources:

## Role-Agent Boundary

- Current category: Role / Role+ / Agent
- Target category after this design: Role / Role+ / Agent
- Category change approved by Scott: Yes / No / Not applicable
- `Role` means no automation enabled.
- `Role+` means automation-enabled but no independent authority, contract, goal outside automation rules, runtime state, or agentic status; a memory file alone does not make a role stateful or agentic.
- `Agent` means implemented runtime with an approved runtime contract, authority, tools, memory, evaluation, deployment, observation, escalation, and stop conditions.
- Promotion guard:

## Recommended Design

- Operating model:
- Roles and responsibilities:
- Workflow states:
- Memory and context:
- Tools and integrations:
- Approvals and escalation:
- Observability:

## Authority, Memory, And Stop Conditions

- Authority level:
- Authority domains:
- Allowed without approval:
- Requires approval:
- Forbidden actions:
- Memory and state boundaries:
- Handoff files assigned as inputs:
- Stop conditions:
- Escalation points:

## Runtime Target And Adapter Requirement

- Primary runtime target:
- Secondary runtime targets:
- Runtime profile or adapter required:
- Skill/instruction format:
- Tool interface:
- Memory model:
- Approval and human-in-the-loop support:
- Sandbox or execution model:
- Packaging and import/export path:
- Unsupported MAPS features:
- Portability risks:

## User Overrides

- Accepted recommendations:
- Changed recommendations:
- Rejected recommendations:

## Proof Plan

- Test strategy:
- Acceptance scenarios:
- Eval shape:
- Mock policy:
- Regression gates:
- Authority-boundary scenario:
- Memory-boundary scenario:
- Stop-condition scenario:

## Build Backlog Summary

- Backlog source:
- Prioritization method:
- First build slice:
- Dependency risks:
- Deferred improvement items:

## Build Gate

- Required before Phase 3:
- Source role contract read:
- Agent profile read:
- Agent design accepted:
- Agent backlog ready:
- Runtime target decided:
- Proof required before Build starts:
- Explicit non-implementation statement:
