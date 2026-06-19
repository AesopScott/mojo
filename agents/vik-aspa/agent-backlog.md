# ASPA Agent Backlog

Template version: 0.4.0.

## Changelog

- 2026-06-19 - v0.1.0 - Created ASPA build backlog from `agents/vik-aspa/agent-design.md`.
- 2026-06-19 - v0.4.0 - Added autonomy contract gate and draft-contract build proof.

## Input

- Source role contract: `roles/vik/role-agent.md`
- Agent profile: `agents/vik-aspa/agent-profile.md`
- Agent brief: `agents/vik-aspa/agent-brief.md`
- Agent design: `agents/vik-aspa/agent-design.md`
- Autonomy contract: `agents/vik-aspa/autonomy-contract.md`
- Research sources: OpenAI Agents, NIST AI RMF, Team Topologies, IBM agentic architecture
- Runtime target: undecided

## Role-Agent Boundary

- Current category: Role+
- Target category for this backlog: Agent candidate only until build/evaluate/deploy proof exists
- Category change approved by Scott: draft build path approved; Agent promotion not approved
- Category constraints to preserve: no autonomous runtime, production, external communication, spending, secrets, global install, or authority expansion without approval
- Promotion guard: backlog does not promote ASPA to Agent

## Backlog Summary

- Prioritization method: fail closed first, runtime target second, adapter third, executable behavior fourth, eval/equip proof fifth
- First build slice: runtime-target decision and runtime-neutral harness boundary
- Highest dependency risk: runtime target undecided
- Highest safety risk: accidental autonomous activation
- Highest authority risk: Principal title mistaken for authority
- Highest memory/state risk: treating memory file as runtime state
- Deferred improvement themes: public/admin profile surface, installable `/vik` or `/aspa` skill, richer observability, long-term state store

## Authority, Memory, And Stop Conditions

- Authority level: A6 Execute With Approval for scoped Mojo architecture work; A0 for production, external communication, spending, authority expansion, autonomous runtime, secrets, and global installation
- Authority domains: architecture review, artifact drafting, memory under contract, role-agent boundary recommendations, handoff routing
- Allowed without approval: read approved artifacts, recommend, draft accepted local artifacts, run local validations, update MAPS memory through helper
- Requires approval: autonomous runtime, production, external communication, spending, secrets, global installs/hooks, authority expansion, gated Git/GitHub writes, writes outside approved locations
- Forbidden actions: false Agent promotion, silent authority expansion, production/external/spending/secrets/global/autonomous action without approval
- Memory write boundaries: `roles/vik/memory.md`, `G:\My Drive\Mojo\vik.md`, and MAPS run notes under project foundation contract
- Handoff read/write boundaries: assigned handoff files only; channel changes routed to Mae/Reid/Matt as applicable
- Stop conditions: authority conflict, missing runtime target for runtime-specific work, memory destination unclear, production/external/spending/secrets/global/autonomous request

## Build Backlog

| ID | Backlog Item | Type | Priority | Depends On | Proof Required | Authority/Category Constraint | Memory/State Constraint | Runtime/Adapter Impact | Stop Condition | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| B-001 | Runtime target decision and adapter boundary | Spike | P0 | Accepted design | Runtime-neutral deferral recorded; runtime-specific requests block | No Agent promotion | No autonomous runtime state | Determines adapter path | Stop if runtime-specific build requested without target | Complete |
| B-002 | Profile/design loader with fail-closed checks | Slice | P0 | B-001 or runtime-neutral deferral | Missing profile/design tests fail closed | Profile stricter than design | No unauthorized writes | Adapter must load same contract | Stop on missing required artifact | Complete |
| B-003 | Authority and forbidden-action gate | Slice | P0 | B-002 | Denied production/external/spending/secrets/autonomy/authority tests pass | A0 domains remain blocked | Log denials only | Runtime-independent | Stop on attempted blocked action | Complete |
| B-004 | Memory and handoff boundary handler | Slice | P1 | B-002 | Allowed architecture review and forbidden memory-write tests pass | No memory-as-state promotion | Writes proof artifacts only | Adapter must preserve path rules | Stop on unclear destination | Complete |
| B-005 | Architecture workflow loop skeleton | Slice | P1 | B-003, B-004 | Intake/classify/recommend/record/handoff flow runs locally | Human-in-loop only | Audit log required | Runtime target required for executable loop | Stop at approval gate | Blocked |
| B-006 | Audit, state, and log artifacts | Task | P1 | B-005 | Artifacts created and read by eval | No autonomous state claim | State not authority | Adapter-specific storage later | Stop if state implies autonomy | Blocked |
| B-007 | Autonomy contract gate | Slice | P0 | B-003 | Draft autonomy contract exists; missing/draft-not-approved contract blocks activation | No autonomous activation | Contract is source, not runtime state | Adapter-specific autonomy later | Stop if contract missing, stale, or unapproved | Complete |
| B-008 | Equip handoff | Task | P1 | B-001, B-007 | Tool/state/adapter/autonomy needs listed | No credentials granted | No secrets in notes | Feeds `/equip-agent` | Stop if credentials needed | Deferred |
| B-009 | Evaluate handoff and spec suite | Task | P1 | B-003, B-004, B-007 | Eval scenarios cover profile conformance, denied behavior, and autonomy contract state | No release claim | Eval evidence only | Runtime tests after adapter | Stop if no proof artifact | Deferred |

## Dependency Map

- Must happen before Build: accepted design, accepted backlog, profile read, runtime-target handling rule.
- Must happen before Equip: runtime target or adapter options, tool/interface needs, state/log needs.
- Must happen before Evaluate: executable loop or specification-mode harness, expected refusal/escalation cases.
- Must happen before Deploy: build, equip, evaluate, approval, rollback plan.
- Can wait for Improve: public profile surface, richer dashboard, packaged `/vik` or `/aspa` skill, long-term storage polish.

## First Slice Definition

- Slice: runtime target decision and adapter boundary
- User-visible behavior: none; architecture proof only
- Smallest proof: build packet records selected runtime or runtime-neutral deferral and refuses runtime-specific implementation without target
- Required files/tools: `agents/vik-aspa/agent-profile.md`, `agents/vik-aspa/agent-design.md`, `agents/vik-aspa/agent-backlog.md`
- Authority/category constraints: no Agent promotion, no autonomous activation
- Memory/state constraints: no runtime state yet
- Runtime target or adapter: undecided; adapter required after runtime selection
- Approval gates: Scott approval for runtime target if not obvious
- Acceptance criteria: Build cannot proceed into runtime-specific implementation while target is undecided
- Stop condition: runtime-specific implementation requested before target selection

## Build 10/10 Proof Matrix

- Real role-to-agent proof build: required before Agent status
- Local run command: `python agents\vik-aspa\run_aspa.py --request "Review role-agent boundary for Bea"`
- Local run evidence: passed, returned allowed architecture review
- Missing `agent-profile.md` fail-closed test: passed
- Missing `agent-design.md` fail-closed test: passed
- Profile/design conflict test: passed
- Stricter profile limit applied: passed
- Profile-denied tool behavior test: passed
- Profile-denied memory-write behavior test: passed
- Profile-denied external-communication behavior test: passed
- Profile-denied production-access behavior test: passed
- Profile-denied spending behavior test: passed
- Profile-denied autonomous-timer behavior test: passed
- Profile-denied secrets behavior test: passed
- Profile-denied authority-expansion behavior test: passed
- Autonomy contract artifact: `agents/vik-aspa/autonomy-contract.md`; draft-not-approved
- Missing autonomy contract fail-closed test: passed
- Draft autonomy contract activation blocker: passed through autonomous-timer denial
- Full autonomy contract activation: blocked pending Scott approval, Equip, Evaluate, Deploy, Observe, and rollback proof
- Audit artifact: `agents/vik-aspa/run-artifacts/audit.jsonl`
- State artifact: `agents/vik-aspa/run-artifacts/state.json`; proof artifact only, not autonomous runtime state
- Log artifact: `agents/vik-aspa/run-artifacts/run.log`
- Runtime target selected: required before runtime-specific implementation
- Runtime adapter required: yes, after target selection
- Runtime adapter proof: required before Agent status
- Runtime-neutral adapter deferral: recorded; adapter proof deferred until runtime selection
- Equip handoff: required next
- Evaluate handoff: required after Equip or enough equipped test surface exists

## Deferred Improvement Backlog

| ID | Improvement | Trigger | Priority | Depends On | Evidence Needed |
|---|---|---|---|---|---|
| I-001 | Public/admin ASPA profile mirror | Website/profile decision | P2 | Build/eval confidence | Mirror-only validator pass |
| I-002 | Installable `/vik` or `/aspa` skill | Repeated successful local use | P2 | Eval proof | Skill contract and no authority drift |
| I-003 | Trace dashboard | Runtime observation need | P2 | Runtime selected | Trace/log schema |
| I-004 | Long-term state store | Runtime needs persistent state | P2 | Deploy design | State contract and rollback path |
| I-005 | Cross-runtime adapter package | Runtime portability need | P1 | Runtime selected | Adapter tests pass |
