# Tess Memory

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
- Promotion contract rule: when Scott says to promote a role to Level 4, Tess builds or updates that role's canonical `Autonomy.md` for review. Each `Autonomy.md` must define role-specific Level 4, Level 5, and Level 6 capabilities, blocked actions, triggers, proof, stop conditions, and owner routes. The file is reviewed and locked before promotion is treated as active.
- Scott-approved Tess Level 4 scope: automatically build every Level 3 role's automation baseline, add Level 4/5/6 capability review items with Scott to `roles/autonomy-engineer/automation.backlog.md`, build role-specific Level 4 promotion packets, define each person's Level 4/5/6 capabilities, and request Scott review. Tess has `tess-level-4-autonomy-backlog-processing` as a dedicated Level 4 local cron trigger/runtime, plus `level4-processing-state.json` and `level4-proof.md` for state/evidence. The scheduled loop completed `AUTO-REV-001`, created `roles/autonomy-engineer/rae-level4-promotion-packet.md`, recorded proof, passed pause/resume proof, and returned to 30-minute cadence. Tess may not approve promotion packets, promote anyone, activate broad runtime, edit gates unilaterally, change Git/release/production, contact external parties, spend money, access secrets, or expand authority. Tess Level 5 is defined as the native autonomy-development loop for promotion readiness but is not active. Tess Level 6 is not currently defined.

## Active Work

- Build the first autonomy inventory for current Mindshare, Mojo, and Watch roles.
- Review role contracts for autonomy level, heartbeat/file-watch scope, tool access, write authority, stop conditions, approval gates, and escalation paths.
- Propose a standard autonomy configuration checklist.
- Run Tess autonomy evaluation every 4 hours through `tess-autonomy-evaluation` and update Liz through `G:\My Drive\Mindshare\channels\training.md` only when website-relevant autonomy legend or per-person standing changes occur.
- Evaluation history rule: keep `Autonomy Evaluation 1.md` as the only active/current evaluation snapshot. Do not create `Autonomy Evaluation 2.md`, `3.md`, etc. Record timestamped evaluation-change history in Scott's Obsidian mirror at `G:\My Drive\Mindshare\scott.md`, because Tess writes in first person and should not put Scott-facing operating history in Tess's mirror.

## Today
- 2026-06-23: Archived the pre-rollover memory ledger and compacted this active file for prompt injection.

## Archive Pointers
- Full pre-rollover archive: `memory-archive\2026-06-23.md`
- Keep detailed logs, completed runs, and historical decisions in dated archives or source artifacts instead of active memory.
- Active memory should keep durable identity, current standing rules, unresolved decisions, active work, same-day notes, and archive pointers only.
