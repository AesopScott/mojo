# ASPA Agent Build Plan

## Input

- Agent design: `agents/vik-aspa/agent-design.md`
- Agent backlog: `agents/vik-aspa/agent-backlog.md`
- Autonomy contract: `agents/vik-aspa/autonomy-contract.md`
- Build gate: runtime-neutral harness only; no runtime-specific adapter until target selected
- Target runtime: undecided
- Runtime profile or adapter requirement: runtime-neutral now; adapter required after runtime selection

## Backlog Item

- Backlog ID: B-001 through B-004 and B-007 through B-009, plus proof artifacts from B-006
- Priority: P0/P1
- Depends on: accepted A2 design and profile contract
- Ready/blocked: runtime-neutral harness ready; runtime-specific adapter blocked on runtime target
- Split needed: yes, runtime adapter remains separate future slice
- Deferred follow-ups: Equip target/runtime/tools; Evaluate full scenario suite

## Runtime Adapter Build

- Adapter/profile selected: none
- Files created or transformed: runtime-neutral Python harness under `agents/vik-aspa/runtime`
- Runtime-specific instructions: none
- Tool bindings: none; denied or stubbed
- Memory setup: proof artifacts only under `agents/vik-aspa/run-artifacts`
- Permission gates: profile/design/autonomy-contract guard blocks denied tools, memory writes, external communication, production, spending, autonomous timers, secrets, authority expansion, and runtime-specific build requests
- Autonomy gate: canonical contract approves Level 4 scoped research/architecture loops only; Level 5, Level 6, Agent promotion, autonomous runtime, and deployed operation remain blocked until approval and Equip/Evaluate/Deploy/Observe proof
- Verification command or manual check: `python -m unittest agents.vik-aspa.tests.test_aspa_runtime`
- Known incompatibilities: no runtime adapter proof until target runtime selected

## Build Slices

| Slice | Behavior | Proof | Status | Evidence |
|---|---|---|---|---|
| 1 | Runtime-neutral profile/design/backlog loader | Missing contract tests | Complete | 16 unit tests pass |
| 2 | Guardrail classifier | Denied behavior tests | Complete | production/tool/memory/external/spending/autonomy/secrets/authority tests pass |
| 3 | Local CLI run | Allowed and blocked local commands | Complete | `python agents\vik-aspa\run_aspa.py --request "Review role-agent boundary for Bea"` |
| 4 | Audit/state/log artifacts | Artifact files created | Complete | `agents/vik-aspa/run-artifacts/state.json`, `audit.jsonl`, `run.log` |
| 5 | Autonomy contract gate | Missing contract and higher activation blocked | Complete | `agents/vik-aspa/autonomy-contract.md`; 16 unit tests pass |
| 6 | Level 4 scoped-loop classifier | Valid backlog/work-state item allowed; builder drift blocked | Complete | scoped research loop and production drift tests pass |
| 7 | Runtime adapter | Adapter proof | Deferred | Runtime target undecided |

## Implementation Notes

- Build uses Python standard library only.
- Runtime behavior is checked against source role, agent profile, design, and backlog on every run.
- Design/profile conflict behavior applies stricter profile limits.
- CLI returns `0` for allowed architecture review and `2` for blocked approval-gated behavior.
- Missing contract files return contract failure.
- Missing autonomy contract returns contract failure.
- Canonical Level 4 autonomy contract is loadable as source truth and allows only scoped research/architecture loops.
- Higher activation remains blocked.

## Checks

- Unit: `python -m unittest agents.vik-aspa.tests.test_aspa_runtime` -> 16 tests passed.
- Integration: CLI reads five control artifacts and writes audit/state/log artifacts.
- Scenario eval: allowed architecture review, production block, runtime-specific block, tool block, memory block.
- Runtime/manual: runtime-neutral local CLI only.

## Optional Code Review

- Standard review recommended: yes before promotion.
- Standard review result: deferred.
- Different-model review recommended: yes before Agent promotion.
- Different-model review result: deferred.
- Findings fixed: none.
- Unresolved risks: runtime target undecided; adapter not proven.
- Review skipped or deferred rationale: first build slice only, local proof harness.

## Handoff

- Ready for Phase 4 Equip: yes, to choose runtime target, adapter interface, state/log storage, and tool bindings.
- Risks for Phase 5 Evaluate: need full scenario suite and runtime-specific adapter tests after target selection.
