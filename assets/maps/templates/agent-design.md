# Agent Design

Template version: 0.2.0.

## Changelog

- 2026-06-19 - v0.2.0 - Added required voice-profile design fields and the non-authority voice boundary.
- 2026-06-19 - v0.1.0 - Created role-to-agent design template with first-class role category, authority, memory, stop-condition, runtime, proof-gate, and build-gate fields.

## Input

- Agent brief:
- Source role contract:
- Source role memory:
- Agent profile:
- Research sources:
- Project foundation:

## Role-Agent Boundary

- Current category: Role / Role+ / Agent
- Target category after this design: Role / Role+ / Agent
- Category change approved by Scott: Yes / No / Not applicable
- `Role` meaning: no automation enabled.
- `Role+` meaning: automation-enabled but no independent authority, contract, goal outside automation rules, runtime state, or agentic status; a memory file alone does not make a role stateful or agentic.
- `Agent` meaning: implemented runtime with an explicitly approved runtime contract, authority, tools, memory, evaluation, deployment, observation, escalation, and stop conditions.
- Promotion guard: this design does not promote Role to Role+ or Role+ to Agent without explicit approval.

## Source Of Truth

- Role contract authority source:
- Agent brief runnable scope:
- Agent profile runtime control contract:
- Website/profile mirror status:
- Conflicts found:
- Conflict resolution or blocker question:

## Recommended Design

- Operating model:
- Roles and responsibilities:
- Workflow states:
- Intake behavior:
- Plan behavior:
- Act/recommend behavior:
- Record/report behavior:
- Stop/continue behavior:
- Human handoff behavior:

## Voice Profile

- Voice taxonomy source: `G:\My Drive\Mindshare\voice-taxonomy.md`
- Primary voice:
- Secondary voice blend:
- Voice blend ratio:
- Voice intensity: low / medium / high
- Formality:
- Emotional temperature:
- Challenge style:
- Sentence shape:
- Humor level:
- Forbidden voice habits:
- Example response:
- Voice boundary: voice is behavioral expression only and does not grant authority, activation, tool access, memory rights, production access, external communication, spending, secrets access, autonomous runtime, or authority expansion.

## Runtime Target And Adapter Requirement

- Primary runtime target:
- Secondary runtime targets:
- Runtime-neutral profile, runtime adapter, or no adapter:
- Skill/instruction format:
- Tool interface:
- Memory model:
- Approval and human-in-the-loop support:
- Sandbox or execution model:
- Packaging and import/export path:
- Unsupported MAPS features:
- Portability risks:

## Authority And Approval Boundaries

- Authority level:
- Authority domains:
- Allowed without approval:
- Requires approval:
- Forbidden actions:
- Production approval gate:
- External communication approval gate:
- Spending approval gate:
- Secrets or credential approval gate:
- Authority expansion approval gate:
- Autonomous activation approval gate:

## Memory And State Boundaries

- Durable state allowed:
- Durable state forbidden:
- Primary memory location:
- Mirror memory location:
- Memory write authority:
- Stale or harmful memory correction path:
- RAG/read-write rules:
- Handoff files assigned as inputs:

## Tools And Integrations

- Tools allowed in design:
- Tools requested for Equip:
- Tools explicitly stubbed:
- Tool failure behavior:
- Credentials or connector blockers:

## Stop Conditions And Escalation

- Stop conditions:
- Escalation points:
- Refusal conditions:
- Recovery path:
- Audit evidence required:

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
- Handoff read/write scenario:
- Tool-failure scenario:
- Stop-condition scenario:

## Build Backlog Summary

- Backlog source:
- Prioritization method:
- First build slice:
- Dependency risks:
- Safety risks:
- Deferred improvement items:

## Build Gate

- Required before `/build-agent`:
- Source role contract read:
- Agent profile read:
- Agent design accepted:
- Agent backlog ready:
- Runtime target decided:
- Proof required before Build starts:
- Explicit non-implementation statement:

## Non-Implementation Statement

This design is not implementation, operating authorization, autonomous activation, production readiness, external communication authority, spending authority, or authority expansion.

## Open Questions

- None yet.
