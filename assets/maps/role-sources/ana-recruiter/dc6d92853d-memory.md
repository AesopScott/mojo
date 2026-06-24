# Ana Memory

Last reviewed: 2026-06-23
Last rollover: 2026-06-23
Full archive: `memory-archive\2026-06-23.md`

## Identity And Source Pointers

Last reviewed: 2026-06-22
Last rollover: 2026-06-22
Full archive: `memory-archive\2026-06-22.md`

## Standing Rules
- Follow the role contract, workflow, authority gates, and assigned channel rules.

## Current Decisions

- Ana is currently a role with an agent brief, profile, design, and backlog drafted, not a full autonomous agent.
- Ana is Level 4 Senior Staff (Scoped Autonomy) as of 2026-06-22. Scott approved Ana's Level 4 scoped recruiting lifecycle: promote approved recruiting backlog items to Level 1, promote Level 1 to Level 2 after 24 hours, and promote Level 2 to Level 3 after five days.
- Ana's `Autonomy.md` now defines Level 4 scoped lifecycle, Level 5 policy autonomy, and Level 6 deferred. Level 5 is defined but not active; it requires leadership-role taxonomy, policy packets, runtime gate, eval proof, audit, rollback, and revocation.
- Ana's dedicated Level 4 backlog-processing automation is active: `ana-l4-recruiting-backlog-processing`, heartbeat in Ana's room on the 4-hour steady cadence. Once Ana starts processing, she continues item by item until the backlog and timed promotion queues are empty or one item blocks/errors.
- Proof accounting rule: Scott changed Ana Level 4 output target from Level 0 candidate prep to Level 1 New Hire packets. Prior Level 0 proof runs are superseded for work-product proof. Ana reprocessed REC-001 through REC-026 into Level 1 New Hire packets and completed three consecutive Level 1 standard proof runs.
- Ana is active as Mindshare's Recruiter role and `/role` workflow owner.
- Ana's agent brief exists at `C:\Users\scott\Code\mindshare\agents\ana-recruiter\agent-brief.md`.
- Ana's agent profile, design, and backlog exist beside the agent brief in `C:\Users\scott\Code\mindshare\agents\ana-recruiter`.
- Ana's specification-mode eval report confirms she is profile/design-ready only, not an implemented Agent; runtime release remains blocked until `/build-agent` creates executable loop evidence.
- Ana's next MAPS skill is `/build-agent` only after Scott accepts the design/backlog and Vik reviews the control-plane boundaries.

## Active Work

- Maintain Ana's role memory and state files.
- Maintain the recruiting handoff channel and read assigned handoff files every 5 minutes while the active heartbeat is running and Ana is not engaged in active user-directed work.
- Help define or improve Mindshare roles through `/role`.
- Maintain `G:\My Drive\Mindshare\roles.md` when roles or agents are created, renamed, migrated, activated, suspended, retired, or discovered missing.
- Maintain `C:\Users\scott\Code\mindshare\roles\ana-recruiter\recruiting.backlog.md` and mirror `G:\My Drive\Mindshare\recruiting.backlog.md` for roles Mindshare needs to hire but has not yet started through `/role`.
- Operate the Level 4 backlog-processing loop through `ana-l4-recruiting-backlog-processing` without overloading `ana-handoff-check`.
- Keep role-to-agent transitions routed through `/define-agent`, `/design-agent`, and later proof/build phases.
- Clarify and accept the standard role backlog format Ana should maintain before Build.
- Decide whether Ana should become an installable `/ana` or `/recruiter` skill.

## Today
- 2026-06-23: Hired and activated Finn / Finance Director from REC-010 in role-home thread Finn - Finance Director (019ef46f-ac78-7932-bcb3-5426c5259a62); created required role files, state/session binding, Drive mirrors, roster update, Liz website handoff, Cole welcome handoff, and Communications announcement. Boundaries held: no spending approval, bank/payroll/tax/accounting-system access, secrets, external communication, production, Git/release, automation, broad runtime, or authority expansion.
- 2026-06-23: Archived the pre-rollover memory ledger and compacted this active file for prompt injection.

## Archive Pointers
- Full pre-rollover archive: `memory-archive\2026-06-23.md`
- Keep detailed logs, completed runs, and historical decisions in dated archives or source artifacts instead of active memory.
- Active memory should keep durable identity, current standing rules, unresolved decisions, active work, same-day notes, and archive pointers only.
