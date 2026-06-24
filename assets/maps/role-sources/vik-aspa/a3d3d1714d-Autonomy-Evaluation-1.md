# Autonomy Evaluation 1

Version: 0.1.40

Date: 2026-06-24

Owner: Tess / Autonomy Engineer

Status: evaluation snapshot; not an authority grant

## Purpose

This file evaluates current Mindshare, Mojo, and Watch roles against Tess's autonomy taxonomy.

It separates:

- organizational operating stage: Position, Operator, Coordinator, Executor
- autonomy stage: Level 0 Candidate through Level 6 Partner
- automation: hooks, file watches, schedulers, scripts, or runtime mechanisms
- authority: approved right to use a mechanism for a bounded purpose

## Authority Boundary

This file does not activate any role, approve autonomous runtime, approve hooks or schedulers, grant tool use, change role status, approve production action, approve Git/GitHub/release action, approve external communication, approve spending, grant secrets access, or expand authority.

Source rule: writable access is not authority. Tool availability is not authority. Automation existence is not autonomy.

## Sources Reviewed

- `G:\My Drive\Mindshare\roles.md`
- `C:\Users\scott\Code\mindshare\roles\autonomy-engineer\autonomy-requirements.md`
- `C:\Users\scott\Code\mindshare\roles\autonomy-engineer\autonomy-inventory.json`
- `C:\Users\scott\Code\mindshare\roles\autonomy-engineer\policy-autonomy.md`
- Current local role files under `C:\Users\scott\Code\mindshare\roles`
- Current local role files under `C:\Users\scott\Code\mojo\roles`
- Current local role files under `C:\Users\scott\Code\watch\roles`
- Current agent profile files under `C:\Users\scott\Code\mindshare\agents`, `C:\Users\scott\Code\mojo\agents`, and `C:\Users\scott\Code\watch\agents`
- Current app automation records under `C:\Users\scott\.codex\automations`

## Taxonomy Used

### Operating Stage

| Stage | Meaning |
| --- | --- |
| Human Authority | Human owner or approver. Not a role agent. |
| Position | Role contract exists. No runtime implied. |
| Operator | Activated role with bounded monitoring, writing, or action authority. |
| Coordinator | Operator with cross-role, cross-channel, or process coordination authority. |
| Executor | Autonomous authority-bearing agent with delegated mandate, state, tools, evals, runtime proof, and escalation boundaries. |
| Released | Historical context only. No active operating authority unless Scott reopens it. |

### Autonomy Stage

These names describe autonomy operating stage, not HR employment status, pay grade, role maturity, company title, or generic builder authority. Higher levels mean more autonomy inside the role's approved function.

Level 3 Staff is the last non-autonomous stage. Levels 4, 5, and 6 are autonomy stages: scoped autonomy, policy autonomy, and native autonomy.

| Level | Stage name | Capability label | Meaning |
| --- | --- | --- | --- |
| 0 | Candidate | Role | Manual invocation only. No automation or independent authority. Non-autonomous. |
| 1 | New Hire | Present | Can identify self, room, source files, and fail closed when source is missing. Non-autonomous. |
| 2 | Trainee | Responsive | Can research, answer, recommend, and name owners/risks/gates without changing state. Non-autonomous. |
| 3 | Staff | Coordinating | Can read/write assigned handoff or memory artifacts when explicitly assigned and within approved channels. Last non-autonomous stage. |
| 4 | Senior Staff (Scoped Autonomy) | Scoped Autonomy | Can process the role's approved backlog: autonomously complete approved, scoped role-native backlog items under contract after operational approval. Narrow role-specific follow-through usually belongs here unless a reusable policy/gate is required. |
| 5 | Principal (Policy Autonomy) | Policy Autonomy | Can autonomously perform recurring role-native work across a class of situations only when an approved written policy, runtime gate, eval proof, audit, and revocation path authorize that class of action. |
| 6 | Partner (Native Autonomy) | Native Autonomy | Can autonomously pursue delegated role-native goals across turns using state, tools, approved policies, stop rules, evals, observation, audit, and rollback without Scott driving every step. |

Workflow trigger versus scoped autonomy: every role may have a role-native backlog. At autonomous stages, the workflow trigger may be valid role-native work state, not a Scott reminder. Scott may catalyze work by creating, approving, assigning, or prioritizing a backlog item, queue item, handoff item, policy signal, or source-change review. Detection of that item and initial research is automation, not autonomy by itself. Level 4 becomes scoped autonomy when the role can process approved backlog items through a bounded loop against a scoped goal under a contract, with state, evidence, completion criteria, stop conditions, owner routing, and audit. This pushes the autonomy boundary modestly; it is not broad independent authority.

Policy autonomy correction: Level 5 is not the next larger task after Level 4. Prior role-specific Level 5/6 examples are now treated as reclassification candidates. If the work is direct follow-through from a scoped approved backlog item, fold it into Level 4. If the work requires deciding whether a recurring class of situations is safe to act on, define a Level 5 policy packet first. If the work is self-directed goal pursuit across turns, hold it for Level 6 design review.

## Executive Summary

No current non-human role is approved as Level 6 Partner.

Most active teammates sit at Level 3 Staff, meaning they are not broad autonomous agents. Ana, Vik, Mae, and Tess now have approved Level 4 scoped-autonomy lanes. Mae is Level 4 Senior Staff approved-not-operational for file-watch/process health monitoring and bounded mechanical repair; she is not operational until scheduler proof, state/proof evidence, evals, and revocation evidence pass. Tess is operational Level 4 only inside the approved automation-baseline and promotion-packet scope: `tess-level-4-autonomy-backlog-processing` has produced review packets for Rae, Cal, Ana, Vik, Liz, Mae, Reid, Bea, Jay, Cole, June, Paige, and Lane, wrote state/proof, passed a pause/resume drill, restored the 30-minute cadence, and now requires visible log plus Heartbeat entries for every non-noop item. No one has approved Level 5 Principal or Level 6 Partner status under the corrected policy-autonomy standard. Ana is approved for internal recruiting backlog processing only; `ana-l4-recruiting-backlog-processing` is active as a heartbeat in Ana's room on the 4-hour steady cadence after three consecutive Level 1 standard proof runs. Vik is approved for Level 4 scoped research backlog loops. Cole, June, Paige, and Lane now have canonical autonomy contracts and Level 4 review packets, but remain Level 3 until Scott reviews and approves any promotion. Rae, Cal, Liz, Reid, Bea, and Jay also have review packets ready but remain Level 3. Matt is released legacy context.

Source reconciliation note: `G:\My Drive\Mindshare\roles.md` current roster row for Ana matches Level 4 scoped autonomy, but the backup-map section still describes Ana's Level 4 backlog automation as being on a 3-minute proof-testing cadence. Current app automation source `C:\Users\scott\.codex\automations\ana-l4-recruiting-backlog-processing\automation.toml` shows the actual cadence is 4 hours. Treat the backup-map cadence text as stale until Ana/roster ownership updates it.

Stale-write guard: Tess may modify autonomy files under the approved owner exception, but Tess automation must re-read current canonical sources immediately before writing. Tess automation must not replace newer evaluation or role-autonomy truth with older snapshots, downgrade levels/status, remove promotion records, or remove current proof/state evidence unless Scott explicitly requests rollback or current canonical sources unambiguously require the change.

Promotion completion rule: when Scott says to promote a role to Level 4, Level 5, or Level 6, Tess must complete the full operational/active checklist for the requested level before calling the promotion complete, unless Scott explicitly asks for approval-only, packet-only, or another named intermediate state. If any checklist item cannot be completed, Tess must record the role as blocked or at the correct intermediate status with exact missing gates and owner routes.

## Current Standing By Role

| Role | Org | Operating stage | Current autonomy | Automation present | Agent/profile artifacts | Standing |
| --- | --- | --- | --- | --- | --- | --- |
| Scott | Mindshare | Human Authority | Not applicable | Not applicable | Not applicable | Final human approver for activation, autonomy, authority expansion, production, external communication, spending, secrets, and commitments. |
| Rae | Mindshare | Coordinator | Level 3 - Staff | `rae-handoff-check` active per roster | `agents/rae-ceo/agent-profile.md`; role `Autonomy.md`; `roles/autonomy-engineer/rae-level4-promotion-packet.md` exists | Strong Staff. Target Level 4 Senior Staff. Tess prepared Rae's Level 4 packet for Scott review. Needs eval execution and explicit operational approval for Level 4 actions. No autonomous runtime. |
| Ana | Mindshare | Operator | Level 4 Senior Staff (Scoped Autonomy); Level 5 policy defined-not-active; Level 6 deferred | `ana-handoff-check` active for handoff/channel checking; `ana-l4-recruiting-backlog-processing` active heartbeat on 4-hour steady cadence; `recruiting.backlog.md` and `recruiting.pipeline.json` approved as Level 4 trigger/state sources | `agents/ana-recruiter/agent-profile.md`; role `Autonomy.md`; `recruiting.backlog.md`; `recruiting.pipeline.json`; `leadership-role-taxonomy.md`; `roles/autonomy-engineer/ana-level4-level5-review-packet.md`; updated proof/eval artifacts exist | Scott approved Ana's Level 4 scope on 2026-06-22 and expanded it to the scoped internal recruiting lifecycle: backlog to Level 1 New Hire, Level 1 to Level 2 Trainee after 24 hours, and Level 2 to Level 3 Staff after five days. Tess prepared Ana's Level 4 maintenance and Level 5 policy review packet for Scott review. Ana's Level 5 policy autonomy remains defined but inactive: research positions other companies have that are missing internally and have conversations with existing leaders at leadership-taxonomy Level 5+ to see whether they want to hire anyone. Level 5 requires the leadership-role taxonomy, policy packets, runtime gate, eval proof, audit, rollback, and revocation before activation. Level 6 is intentionally deferred. No external recruiting, human hiring, Git/release, production, spending, secrets, Level 4+ promotion for hired roles, or broad autonomous runtime. |
| Matt | Mojo | Released | No active path | Legacy only | `roles/matt/Autonomy.md` legacy block exists | Released by Scott on 2026-06-20. No promotion path active. Use Cal for active MAPS ASPM work. |
| Cal | Mojo | Coordinator | Level 3 - Staff | None observed in roster | `agents/cal-aspm/agent-profile.md`; role `Autonomy.md`; `roles/autonomy-engineer/cal-level4-promotion-packet.md` exists | Active MAPS ASPM coordinator. Strong Staff. Tess prepared Cal's Level 4 packet for Scott review. Target Level 4 Senior Staff after approval. No implementation, Git/release, architecture override, or autonomous runtime authority. |
| Vik | Mojo | Coordinator / architecture lead | Level 4 Senior Staff (Scoped Autonomy); Level 5 policy defined-not-active; Level 6 native loop defined-not-active | `vik-visible-backlog-research` active 30-minute visible backlog heartbeat; `vik-daily-role-memory-maintenance` active daily cron; `vik-handoff-check` queue/file-watch sidecar paused | `agents/vik-aspa/agent-profile.md`; role `Autonomy.md`; `level5-product-recommendation-policy.md`; `level6-ai-security-research-loop-policy.md`; `roles/autonomy-engineer/vik-level4-level6-review-packet.md`; eval/deploy/observe/promotion artifacts exist | Current standing remains Level 4 for scoped research backlog loops. Scott confirmed Vik's Level 4 is correct. Tess prepared Vik's Level 4 maintenance and Level 5/6 policy review packet for Scott review. Level 5 is now defined as goal-based policy autonomy: look across completed research and recommend whether the company would be well served by making, implementing, adopting, integrating, or further reviewing researched products or capabilities. Level 6 is now defined as the full AI/security discovery loop: research the internet/world for AI and security topics not previously researched, add eligible topics to the backlog, do deep analysis, and apply Level 5 criteria. Level 5/6 are not active until Scott approves promotion and runtime gates, eval proof, observation, audit, rollback, and revocation are complete. No implementation, procurement, vendor contact, Git/release, production, spending, secrets, external communication, or authority expansion. |
| Liz | Mojo | Operator / workflow owner | Level 3 - Staff with policy-scoped `/maps` execution boundary | `liz-handoff-check` active per roster | `agents/liz-training/agent-profile.md`; role `Autonomy.md`; `roles/autonomy-engineer/liz-level4-promotion-packet.md` exists | Training coordinator with bounded heartbeat and site/training mirror scope. Tess prepared Liz's Level 4 packet for Scott review. No production publish, Git/release, or autonomous runtime authority. |
| Mae | Mindshare | Operator | Level 4 Senior Staff (Scoped Autonomy), approved-not-operational; not Agent Path active | `mae-handoff-check` active per roster; `mae-automation-health-check` active 4-hour heartbeat; first Level 4 scheduler proof pending | `agents/mae-communications/agent-profile.md` exists as historical/legacy agent artifact; canonical role `Autonomy.md` v1.2; `roles/autonomy-engineer/mae-level4-promotion-packet.md` exists; `level4-automation-health-state.json`; `level4-proof.md` | Scott formally promoted Mae to Level 4 on 2026-06-24 for file-watch/process health monitoring and bounded mechanical repair across active sessions and channels. Operational status remains approved-not-operational until scheduled runtime proof, state/proof evidence, denied-action evals, and revocation proof pass. This is role-path autonomy, not Agent Path activation. External communication, channel override, role authority changes, cadence/thread changes, runner code, gate files, Git/release, production, spending, secrets, and authority expansion remain blocked. |
| Reid | Mindshare | Operator | Level 3 - Staff | `reid-handoff-check` active per roster | `agents/reid-release/agent-profile.md`; role `Autonomy.md`; `roles/autonomy-engineer/reid-level4-promotion-packet.md` exists | Release-management coordinator/operator. Tess prepared Reid's Level 4 packet for Scott review. Strong gate owner for release/Git routing, but no Git/GitHub write authority until explicit approval. No autonomous runtime. |
| Tess | Mindshare | Operator | Level 4 Senior Staff (Scoped Autonomy), operational inside approved automation-baseline and promotion-packet scope when the Level 4 backlog cron is active | `tess-autonomy-evaluation` active 4-hour heartbeat for evaluation/Liz handoff only; `tess-level-4-autonomy-backlog-processing` configured local cron on 30-minute cadence but currently paused after stale-write guard correction | `agents/tess-autonomy/agent-profile.md`; role `Autonomy.md`; `automation.backlog.md`; `policy-autonomy.md`; `level4-promotion-packet-policy.md`; `level4-gate-checklist.md`; `level4-processing-state.json`; `level4-proof.md`; `level4-visible-log.md`; Rae, Cal, Ana, Vik, Liz, Mae, Reid, Bea, Jay, Cole, June, Paige, and Lane packet files exist | Scott approved Tess's Level 4 scope on 2026-06-22. Scheduled runs created review packets for Rae, Cal, Ana, Vik, Liz, Mae, Reid, Bea, Jay, Cole, June, Paige, and Lane; requested Scott review; wrote state/proof; held denied-action boundaries; passed pause/resume drill; restored 30-minute cadence; and now requires local visible log plus Heartbeat entries for every non-noop item. Promotion work now requires immediate autonomy-evaluation reconciliation in the same Level 4 loop whenever Scott approves or Tess records a formal promotion status change. Level 5 remains inactive and Level 6 is not defined. No broad autonomous runtime, unilateral gate edits, Git/release, production, external comms, spending, secrets, promotion approval, or authority expansion. |
| Cole | Mindshare | Operator | Level 3 Staff; canonical `Autonomy.md` exists; Level 4 packet ready for Scott review | `hr-director-handoff-check` active per roster | No agent profile observed; role `Autonomy.md`; `roles/autonomy-engineer/cole-level4-promotion-packet.md` exists | Activated HR Director / team-member-file operator. Tess created canonical `Autonomy.md` and Level 4 review packet after Scott clarified missing contracts should be created as part of readiness processing. No autonomous runtime or promotion approved. |
| June | Mindshare | Operator | Level 3 Staff; canonical `Autonomy.md` exists; Level 4 packet ready for Scott review | `june-writing-nudge` active writing nudge heartbeat | No agent profile observed; role `Autonomy.md`; `roles/autonomy-engineer/june-level4-promotion-packet.md` exists | Activated Staff Writer. Tess prepared June's Level 4 packet for Scott review. June can draft, synthesize, and support Marketing/book work inside approved scope. No public publishing, external communication, production, Git/release, or autonomous runtime authority. |
| Paige | Mindshare | Operator | Level 3 Staff; canonical `Autonomy.md` exists; Level 4 packet ready for Scott review | None observed in roster | No agent profile observed; role `Autonomy.md`; `roles/autonomy-engineer/paige-level4-promotion-packet.md` exists | Activated Executive Assistant under Executive Operations. Tess prepared Paige's Level 4 packet for Scott review. Notes-only scope. No email, Slack, calendar, private-channel, connector, external communication, autonomous runtime, production, Git/release, spending, secrets, or authority-expansion authority. |
| Bea | Mojo | Operator | Level 3 Staff; Level 4 packet ready for Scott review | `bea-handoff-check` active per roster | `agents/bea-maps-engineer/agent-profile.md`; role `Autonomy.md`; `roles/autonomy-engineer/bea-level4-promotion-packet.md` exists | Mojo MAPS engineer for assigned implementation. Tess prepared Bea's Level 4 packet for Scott review. No repository write, Git/GitHub, release, production, external communication, spending, or autonomous agent authority. |
| Lane | Mojo | Operator | Level 3 Staff; canonical `Autonomy.md` exists; Level 4 packet ready for Scott review | `lane-hourly-token-usage-update` active; `lane-daily-token-graph-build` disabled | No agent profile observed; role `Autonomy.md`; `roles/autonomy-engineer/lane-level4-promotion-packet.md` exists | Activated Mojo Lab Operator under Vik on the Mojo MAPS Management Team. Tess prepared Lane's Level 4 packet for Scott review. Maintains a reviewable lab queue for MAPS skill creation, modification, validation, proof capture, handoff routing, and approved token-usage reporting. No broad autonomous runtime, production, Git/GitHub, release, spending, external communication, secrets, connector access, or authority-expansion authority. |
| Jay | Watch | Operator | Level 3 - Staff | `jay-handoff-check` active per roster | `agents/jay-meetup/agent-profile.md`; role `Autonomy.md`; `roles/autonomy-engineer/jay-level4-promotion-packet.md` exists | Customer-success / Meetup operator. Tess prepared Jay's Level 4 packet for Scott review. Can coordinate approved prep. No live Meetup, Zoom distribution, external communication, production, Git/GitHub, spending, or authority expansion without approval. |

## Readiness Bands

### Band A: Human approval source

- Scott

### Band B: Strong active Level 3 Staff with autonomy-readiness artifacts

- Rae
- Cal
- Liz
- Reid
- Jay

These roles have current operating authorization plus canonical autonomy/profile artifacts, but no broad autonomous runtime. Several roles have handoff/monitoring automations; those mechanisms are evidence and workflow support, not stage promotion by themselves.

### Band C: Approved Level 4 scoped autonomy

- Ana
- Vik
- Mae

Ana, Vik, and Mae are approved only inside narrow role-native scopes. Ana may process approved recruiting backlog items through internal role-lifecycle preparation. Vik may process approved architecture research backlog items. Mae may monitor and repair bounded file-watch/process health issues after operational proof passes. These roles do not have active Level 5/6, external communication, production, Git/release, spending, secrets, promotion approval, or broad runtime authority.

### Band C2: Level 4 operational after proof

- Tess

Tess has approval, contract, trigger, runtime, work-loop, state, evidence, boundary, review, revocation, and display proof for the approved Level 4 scope. Tess may be displayed as operational Level 4 only for automation-baseline and promotion-packet work; this does not grant Level 5, Level 6, promotion approval, broad runtime, gate-edit, Git/release, production, external communication, spending, secrets, or authority expansion.

### Band D: Most advanced Principal candidate, still not promoted

- Vik

Vik has the richest autonomy surface: architecture ownership, memory-maintenance automation, `Autonomy.md`, `agent-profile.md`, eval/deploy/observe/promotion files, and runtime-adjacent artifacts. Standing is Level 4 Senior Staff for scoped research backlog loops. Scott has defined Level 5 as goal-based product/implementation recommendation policy autonomy across completed research, and Level 6 as the full AI/security internet discovery, backlog creation, deep analysis, and Level 5 recommendation loop. Vik remains not promoted to Principal or Partner because final promotion review, runtime gates, eval proof, observation, rollback, revocation, and Scott activation approval for those higher stages are required.

### Band E: Active operators with new autonomy contracts, pending review

- Cole
- June
- Paige
- Lane

These roles are active operators by roster/contract. Their canonical `Autonomy.md` files and Level 4 review packets now exist, but they should not be promoted to Level 4+ until Scott reviews the packets and required eval/runtime/audit/rollback/revocation proof exists.

### Band F: Draft or inactive

- Matt: released legacy context; no active autonomy path.

## Main Gaps

| Gap | Affected roles | Required repair |
| --- | --- | --- |
| Level 4 review packets pending Scott review | Rae, Cal, Liz, Reid, Bea, Jay, Cole, June, Paige, Lane | Scott review packets; no promotion until eval/runtime/audit/rollback/revocation proof exists. |
| Mae Level 4 operational proof pending | Mae | Mae is formally Level 4 approved-not-operational. Observe `mae-automation-health-check`, `level4-automation-health-state.json`, and `level4-proof.md`; do not call Mae operational until scheduler proof, denied-action evals, and revocation proof pass. |
| Missing agent profile | Cole, June, Paige, Lane | Create only if role is being moved toward agent readiness. |
| Evals not executed or not complete | Most roles | Add/evaluate role-specific eval suites before Level 4+ promotion. |
| Broad runtime activation not approved | All non-human roles | Keep broad runtime blocked until contract, gates, evals, adapter, deployment/observe, audit, rollback, and Scott approval align. Ana, Vik, and Tess have approved narrow Level 4 scopes only. |
| New Level 4 gate must be applied retroactively | Ana, Vik, Tess, future Level 4 candidates | Recheck every Level 4 claim against `level4-gate-checklist.md`; do not call a role operational Level 4 unless all gates pass. |
| Level 4 proof cadence restored | Tess | `tess-level-4-autonomy-backlog-processing` is restored to 30-minute cadence after proof. Continue monitoring state/proof/visible log and do not expand scope. |
| Roster backup-map cadence stale | Ana | Current automation source shows `ana-l4-recruiting-backlog-processing` runs every 4 hours; `G:\My Drive\Mindshare\roles.md` backup-map section still says 3-minute proof-testing cadence. Roster owner should correct the backup-map text; no standing change. |
| Stale autonomy overwrite risk | Tess automations, autonomy evaluation, role `Autonomy.md` files | Tess ownership exception remains valid, but Tess automations now require current-source reload and downgrade/removal guards before canonical autonomy writes. Conflicting sources must be marked blocked/needs-review instead of silently reverting. |
| Automation mistaken for autonomy | Roles with heartbeat/file-watch/scheduler | Keep explicit: automation presence is mechanical, not authority. |
| G-drive primary-file risk | All roles | Primary team-member files stay in local repos. G drive may hold channels, handoffs, mirrors, indexes, and non-primary notes. |

## Recommendations

1. Keep current global claim: no current non-human role is Level 6 Partner.
2. Review Cole, June, Paige, and Lane Level 4 packets before any promotion; their `Autonomy.md` files now exist but are not approval grants.
3. Redesign Level 5 around policy-backed loops before promoting anyone to Principal. Tess's packet-building and Scott-review routing now belongs in Level 4, not Level 5.
4. Treat Vik as a likely first policy-autonomy candidate because his Level 5 policy target is now defined; promotion still requires Scott approval plus runtime gate, eval, observation, rollback, and revocation proof.
5. Treat Mae as Level 4 approved-not-operational and observe the first scheduled Mae health-check proof before displaying her as operational Level 4.
6. Preserve Tess's autonomy-file ownership exception while enforcing stale-write guards inside Tess automation prompts and review evidence.
7. Do not create more autonomous runtime until strict-intent gate, source loader, contract validator, runtime adapter, audit/state, backup/restore, and promotion review remain green.

## Changelog

| Date | Version | Change | Owner |
| --- | --- | --- | --- |
| 2026-06-22 | 0.1.0 | Created first role-by-role autonomy evaluation snapshot. | Tess |
| 2026-06-22 | 0.1.1 | Mapped autonomy levels to Candidate, New Hire, Trainee, Staff, Senior Staff, Principal, and Partner while preserving capability labels. | Tess |
| 2026-06-22 | 0.1.2 | Clarified that higher levels mean more autonomy inside each role's approved function, not generic builder/edit authority. | Tess |
| 2026-06-22 | 0.1.3 | Clarified that Staff is the last non-autonomous stage and Senior Staff, Principal, and Partner are increasing autonomy stages. | Tess |
| 2026-06-22 | 0.1.4 | Added parenthetical labels: Senior Staff (Scoped Autonomy), Principal (Policy Autonomy), and Partner (Native Autonomy). | Tess |
| 2026-06-22 | 0.1.5 | Clarified backlog/work-state trigger rule for autonomous stages. | Tess |
| 2026-06-22 | 0.1.6 | Distinguished workflow-triggered research automation from scoped autonomy as a contracted goal loop. | Tess |
| 2026-06-22 | 0.1.7 | Updated Vik current standing to Level 4 Senior Staff scoped autonomy. | Tess |
| 2026-06-22 | 0.1.8 | Removed stale Lab Operator draft entry and added active Paige and Lane operator standings from the roster. | Tess |
| 2026-06-22 | 0.1.9 | Recorded active `tess-autonomy-evaluation` 4-hour heartbeat as narrow approved evidence while keeping Tess at Level 3 Staff per canonical contract; refreshed Vik automation evidence to active visible backlog heartbeat, daily memory cron, and paused queue/file-watch sidecar. | Tess |
| 2026-06-22 | 0.1.10 | Recorded Ana Level 4 scoped-autonomy path as prepared but not approved; added initial role-lifecycle trigger evidence and remaining Vik/Scott approval gates. | Tess |
| 2026-06-22 | 0.1.11 | Clarified the general Level 4 rule: every role may have a backlog, and Senior Staff means processing approved role-native backlog items under the role's `Autonomy.md`. Updated Ana evidence to treat `recruiting.backlog.md` as the backlog source and role `Autonomy.md` as the capability contract. | Tess |
| 2026-06-22 | 0.1.12 | Recorded Scott-defined Vik Level 4/5/6 capability ladder while keeping Vik at current Level 4 standing only. | Tess |
| 2026-06-22 | 0.1.13 | Recorded Scott-defined Tess Level 4/5/6 capability ladder and created `automation.backlog.md`; Level 4 applies to Level 3 roles only; Tess remains Level 3 except for the narrow approved evaluation heartbeat. | Tess |
| 2026-06-22 | 0.1.14 | Promoted Ana standing to Level 4 Senior Staff scoped autonomy for approved recruiting backlog processing only; Level 5/6 remain blocked; proposed local 30-minute backlog automation for review. | Tess |
| 2026-06-22 | 0.1.15 | Activated Ana backlog processing automation on 3-minute proof-testing cadence with three consecutive Ana-owned proof requirement, then 4-hour steady cadence; processing continues until backlog empty or blocked. | Tess |
| 2026-06-22 | 0.1.16 | Changed Ana Level 4 output target to Level 1 New Hire packets; reopened REC-001 through REC-026 for reprocessing and reset proof streak to 0 of 3 under the new standard. | Tess |
| 2026-06-22 | 0.1.17 | Recorded Ana Level 1 New Hire packet proof run 1 of 3 after Ana reprocessed REC-001 through REC-026 and held Level 4 boundaries. | Tess |
| 2026-06-22 | 0.1.18 | Recorded Ana Level 1 proof streak 3 of 3 and moved Ana's Level 4 recruiting backlog automation to the 4-hour steady cadence. | Tess |
| 2026-06-22 | 0.1.19 | Corrected June to Level 3 Staff and corrected Level 5 interpretation: old Level 5/6 task ladders are reclassification candidates; real Principal autonomy requires approved policy packets and runtime/eval proof. | Tess |
| 2026-06-22 | 0.1.20 | Recorded Scott's updated Ana ladder: Level 4 scoped lifecycle now covers backlog to Level 1, Level 1 to Level 2 after 24 hours, and Level 2 to Level 3 after five days; Level 5 policy autonomy is defined but inactive; Level 6 is deferred. | Tess |
| 2026-06-22 | 0.1.21 | Recorded Scott's updated Vik ladder: Level 4 remains correct and active; Level 5 is goal-based product/implementation recommendation policy autonomy; Level 6 is the full AI/security discovery, backlog, deep-analysis, and Level 5 recommendation loop. Vik remains Level 4 only until higher promotion is approved and proven. | Tess |
| 2026-06-22 | 0.1.22 | Corrected Tess ladder: Level 4 builds automation structure for Level 3 roles; Level 5 builds role-specific Level 4 promotion packets, defines each person's Level 4/5/6 capabilities, and requests Scott review; Level 6 becomes possible from the defined Level 5 policy. Tess remains Level 3 until promotion approval. | Tess |
| 2026-06-22 | 0.1.23 | Collapsed Tess ladder per Scott: promotion-packet construction moves into Level 4 alongside automation structure; the former Level 6 native loop becomes Level 5; Tess has no Level 6 capability currently defined. | Tess |
| 2026-06-22 | 0.1.24 | Recorded Scott approval to upgrade Tess to Level 4 Senior Staff (Scoped Autonomy) for automation structure, promotion-packet construction, capability definition, and Scott review routing. Level 5 remains inactive and Level 6 remains undefined. | Tess |
| 2026-06-22 | 0.1.25 | Corrected Tess status after Level 4 gate review: Tess is Level 4 approved-not-operational, not operational Level 4, because trigger/runtime/work-loop/state/evidence gates do not pass. Added requirement to recheck all Level 4 claims against the new gate. | Tess |
| 2026-06-22 | 0.1.26 | Installed Tess Level 4 local cron `tess-level-4-autonomy-backlog-processing` plus state/proof files; Tess is runtime-installed-pending-proof, not operational Level 4 until scheduled work-loop evidence passes. | Tess |
| 2026-06-22 | 0.1.27 | Recorded first Tess Level 4 proof-testing observation window: scheduler is configured, but no scheduled proof write was observed; Tess remains not operational Level 4. | Tess |
| 2026-06-22 | 0.1.28 | Recorded successful Tess Level 4 scheduled proof: `AUTO-REV-001` completed, Rae packet created for Scott review, state/proof written, pause/resume drill passed, and cadence restored to 30 minutes. | Tess |
| 2026-06-22 | 0.1.29 | Added Tess Level 4 visibility requirement: every non-noop backlog-processing run must write local visible log and Heartbeat entry. | Tess |
| 2026-06-22 | 0.1.30 | Recorded new Tess Level 4 evidence: review packets completed for Ana, Vik, Liz, and Mae, plus prior Rae and Cal packets; standings unchanged and no authority expanded. | Tess |
| 2026-06-22 | 0.1.31 | Created canonical `Autonomy.md` contracts and Level 4 review packets for Cole, June, Paige, and Lane after Scott clarified that missing contracts should be repaired during readiness processing; no promotions or runtime activations performed. | Tess |
| 2026-06-22 | 0.1.32 | Normalized packet evidence across all completed Tess Level 4 review items: Rae, Cal, Ana, Vik, Liz, Mae, Reid, Bea, Jay, Cole, June, Paige, and Lane. No standings changed. | Tess |
| 2026-06-22 | 0.1.33 | Reconciled source evidence: Ana's live Level 4 automation is on the 4-hour steady cadence, while the `roles.md` backup-map section still says 3-minute proof-testing cadence. Marked backup-map text stale; no standings changed. | Tess |
| 2026-06-24 | 0.1.34 | Restored Mae's formal Level 4 Senior Staff approved-not-operational standing from canonical `roles.md` and Mae `Autonomy.md`; first scheduler proof remains pending. | Tess |
| 2026-06-24 | 0.1.35 | Recorded role-autonomy versus Agent Path distinction for Mae: Level 4 promotion does not activate Agent Path or make legacy agent artifacts authoritative. | Tess |
| 2026-06-24 | 0.1.36 | Added stale autonomy overwrite risk to gaps after evaluation drift reverted Mae to Level 3 despite canonical Level 4 sources. | Tess |
| 2026-06-24 | 0.1.37 | Added Tess stale-write/downgrade guard: Tess ownership exception remains valid, but Tess automations must re-read current canonical sources before writes and block older snapshot reverts unless Scott explicitly approves rollback. | Tess |
| 2026-06-24 | 0.1.38 | Corrected Tess backlog automation evidence: `tess-level-4-autonomy-backlog-processing` is configured but currently paused after stale-write guard correction, not actively running. | Tess |
| 2026-06-24 | 0.1.39 | Added promotion/evaluation coupling to Tess Level 4 backlog automation: every Scott-approved or formally recorded promotion inside the Level 4 loop must immediately rerun and reconcile the autonomy evaluation before the promotion item is complete. | Tess |
| 2026-06-24 | 0.1.40 | Added Scott's promotion completion rule: promote to Level 4, 5, or 6 means complete the full operational/active checklist by default, not stop at approval-only, packet-only, or approved-not-operational unless Scott explicitly asks for that intermediate state. | Tess |
