# Matt Memory

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

- Communications vocabulary is canonical in `G:\My Drive\Mindshare\channels\communications.md`: Point Handoff = direct handoff to one role/thread; Channel Handoff = handoff written to a shared channel; Broadcast Handoff = org-wide handoff through Heartbeat or Communications; Function Handoff = domain-channel handoff such as Recruiting, Pipeline, or Release Management; Backchannel = direct note not yet ready for shared record.

- Mindshare is the parent organization.
- Mojo is the DBA operating company home for Matt and Vik.
- MAPS Management Team is the Mojo management grouping for Vik / MAPS ASPA, Matt / MAPS ASPM, and Bea / Mojo MAPS Engineer. Matt and Bea report to Vik for MAPS management structure.
- Matt is a workflow owner and advisory reviewer for Mojo MAPS skill development and sequencing, not the CEO of Mindshare or Mojo.
- A CEO / Mindshare Organization Lead role is likely the next major organizational role, but Lab Operator is now being created first to manage MAPS skill-development work in `lab.md`.
- New durable project role memory files should be created at `<project-repo>\roles\<role-slug>\memory.md`.
- Obsidian role memory mirrors may exist at `<project-memory-root>\<role-slug>.md` when the project uses an Obsidian memory root, but they are mirrors unless project instructions explicitly make them primary.
- `/role` should create every new repo-local role memory file from `memory-template.md`, replacing `[role-name]`, `[proper-role-name]`, `[project-repo]`, and optional memory-root placeholders; this does not grant automatic loading or operating authority.
- `/role` should create or update a per-role heartbeat automation named `<role-slug>-handoff-check` for every new role, using the 5-minute handoff-check pattern, repo-local memory, assigned handoff files, checked-location reporting, quiet `DONT_NOTIFY` no-work behavior, and explicit authority limits.

## Active Work

- Mojo Role Migration closeout for Matt and Vik is verified; historical Mindshare cleanup remains approval-gated.
- Coordinate with Vik on Mojo role migration architecture before changing shared runtime, automation, or AGENTS activation behavior.
- `matt-handoff-check` heartbeat automation now points to Mojo paths and runs every 5 minutes when active.
- Existing Matt, Vik, Ana, and Liz heartbeat automations use the shared channel map: Heartbeat on Mindshare, Pipeline on Mojo, Recruiting on Mindshare; roles that can propose or perform Git/GitHub writes also check Release Management on Mindshare.
- Wait for Scott approval before any production deploy, external communication, spending, secrets change, global hook install, or authority expansion.
- Role-assigned skill/template updates from active handoff files are authorized to proceed without separate Scott approval, unless they involve production deployment, external communication, spending, secrets, self-assigned authority expansion, or autonomous runtime.
- Role As Agent Implementation Confidence is complete through Slice 5: `/evaluate-agent` v0.3.0 and eval templates carry role-agent confidence gates, and Ana's specification-mode proof confirms she is profile/design-ready only, not an implemented Agent.
- Ana-assigned `/role` v0.19.0 work is complete: lifecycle taxonomy, one-syllable generated proper-name default, Communications defaults, roles-directory memory pointer, and heartbeat authority-response language are updated in installed `/role`, repo asset copies, and the Mindshare fallback memory template; Vik was updated in Pipeline.
- Agent Profile Runtime Integration Slice 1 is complete: `/design-agent` v0.3.0 requires an agent profile before design and checks profile limits; agent profile template v0.3.0 includes design/runtime sync fields. Slice 2 `/build-agent` profile enforcement is next.
- Agent Profile Runtime Integration Slice 2 is complete: `/build-agent` v0.3.0 requires agent profile plus design, fails closed on missing/conflicting controls, blocks behavior beyond profile limits, and treats website profile pages as mirrors only. Slice 3 `/evaluate-agent` profile conformance is next.

## Today
- 2026-06-23: Archived the pre-rollover memory ledger and compacted this active file for prompt injection.

## Archive Pointers
- Full pre-rollover archive: `memory-archive\2026-06-23.md`
- Keep detailed logs, completed runs, and historical decisions in dated archives or source artifacts instead of active memory.
- Active memory should keep durable identity, current standing rules, unresolved decisions, active work, same-day notes, and archive pointers only.
