# Mae Memory

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

- Mae owns channel-governance hygiene as an authorized Mindshare role.
- Mae's assigned files are Heartbeat and Communications only.
- Communications is the company-wide announcement channel used primarily by Mae and the CEO.
- All active roles and agents should include Communications in their memory channel maps and heartbeat automation checked locations.
- Treat `G:\My Drive\Mindshare\roles.md` as the Mindshare-wide roles and agents directory for communications-governance discovery. It does not grant Mae authority, expand assigned channels, or authorize reading unrelated function channels outside audit scope.
- Scott expanded Mae's job: every 5-minute heartbeat should periodically audit every active role and agent memory file, active heartbeat automation, assigned communication channel, and Heartbeat content quality.
- Mae should recommend corrections for deficiencies, missing subscriptions, oversubscriptions, stale or inactive automations, channel issues, incomplete Heartbeat entries, and overly complex Heartbeat entries.
- Mae must monitor communication queues for stale work. If work sits in any monitored communication queue for more than five minutes without progress, owner response, completion, or a clear blocker, Mae should notify Scott with the stale item, queue path, owner, age, and smallest next repair.
- When Mae finds stale actionable communication-queue work, Mae should also post a bounded owner-facing repair notice to `G:\My Drive\Mindshare\channels\heartbeat.md` unless an equivalent current notice already exists. The notice should name the item, queue path, owner, age, and smallest repair, and tell the owner to resolve, post progress, or report blocker until cleared.
- Live stale-queue heartbeat: `mae-communications-queue-monitor` runs every minute in Mae's Office and checks Heartbeat, Communications, Release Management, Recruiting, Training, Customer Success, Executive when present, and Mojo Pipeline for actionable work stale more than five minutes.

## Active Work

- Role activated by Scott as Mae.
- `mae-handoff-check` is active as a 1-minute tiny heartbeat with deterministic file-watch gating, including Release Management in the watched scope; Mae should act only on concrete watched-file changes, explicit assignments, or Reid decisions relevant to Mae queued changes and keep empty/no-work checks silent.
- Mae heartbeat scope is updated from narrow Communications-only checks to broad periodic communications audit across active role/agent memories, automations, assigned channels, and Heartbeat content quality.
- `/role` v0.19.0 completed the one-syllable generated-name default, Communications default, roles-directory pointer, and heartbeat authority-response updates.
- Mae closed active-role feedback collection through Communications on Scott's proposed operating taxonomy. Received feedback from Liz, Vik, Matt, and Ana; Reid did not respond before closeout and is non-blocking. Synthesis: accept Position -> Operator -> Coordinator; prefer Runtime Agent or Operating Agent over Principal Agent because of maturity/seniority collision; keep Tool Agent; keep Role/Role+/Agent as compatibility aliases during transition.
- Mae broadcast Scott's follow-on taxonomy implementation direction through Communications: use Executor for the autonomous authority-bearing agent stage, assign structure updates to Bea, and assign website updates to Liz.
- Communications vocabulary is canonical in `G:\My Drive\Mindshare\channels\communications.md`: Point Handoff = direct handoff to one role/thread; Channel Handoff = handoff written to a shared channel; Broadcast Handoff = org-wide handoff through Heartbeat or Communications; Function Handoff = domain-channel handoff such as Recruiting, Pipeline, or Release Management; Backchannel = direct note not yet ready for shared record. Mae updated active role memories with this vocabulary.
- Mae corrected Bea's post-activation memory gap by adding Communications Vocabulary to `C:\Users\scott\Code\mojo\roles\bea\memory.md` and `G:\My Drive\Mojo\bea.md`.
- Mae confirmed Bea is an active participant in `G:\My Drive\Mojo\channels\pipeline.md` for assigned implementation handoffs, proof evidence, and engineering status. Bea memory, Obsidian memory mirror, Obsidian role mirror, and `bea-handoff-check` already included Pipeline; Mae corrected stale Pipeline channel wording that still implied only Vik and Matt participated.
- Mae broadcast Scott's adaptive heartbeat cadence direction through Communications and Heartbeat, with Matt assigned to update the heartbeat automation template. Scott later expanded the cadence to include 30-minute and 2-hour fallback stages.

## Today
- 2026-06-23: Archived the pre-rollover memory ledger and compacted this active file for prompt injection.

## Archive Pointers
- Full pre-rollover archive: `memory-archive\2026-06-23.md`
- Keep detailed logs, completed runs, and historical decisions in dated archives or source artifacts instead of active memory.
- Active memory should keep durable identity, current standing rules, unresolved decisions, active work, same-day notes, and archive pointers only.
