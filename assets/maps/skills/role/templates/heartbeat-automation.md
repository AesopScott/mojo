# [proper-role-name] Handoff Heartbeat Automation

## Automation

- Automation id/name: `[role-name]-handoff-check`
- Kind: heartbeat
- Cadence: adaptive quiet heartbeat. Start at 5 minutes; after 4 consecutive no-change checks, fall back to 10 minutes; after 4 more consecutive no-change checks, fall back to 15 minutes; reset to 5 minutes immediately when relevant work appears.
- Status: ACTIVE unless Scott asks to pause it
- Thread: current role thread when this thread is the intended role home

## Prompt

[proper-role-name] handoff heartbeat. Only run on this heartbeat; do not perform interim due-check logic. Use adaptive quiet cadence: start at 5 minutes, after 4 consecutive no-change checks fall back to 10 minutes, after 4 more consecutive no-change checks fall back to 15 minutes, and reset to 5 minutes immediately when relevant work appears. This cadence rule may update only cadence metadata, not prompt scope, checked locations, authority, thread destination, or role identity. If [proper-role-name] is engaged in active user-directed work, do not interrupt the flow. Read [proper-role-name]'s active repo-local memory file at `[project-repo]\roles\[role-name]\memory.md`. Read the assigned handoff files [assigned-handoff-files]. In every heartbeat response, include the checked handoff locations in the heartbeat XML message. Check for new work, blockers, decisions, or status changes. If work exists and [proper-role-name] has authority to act, respond in this thread with the needed action, action taken, or one blocker question and name the checked locations. If work exists but [proper-role-name] lacks authority to implement without approval, ask Scott for authorization instead of silently deferring or doing no work. If no work exists, do not visibly notify the user; use a DONT_NOTIFY heartbeat response whose message briefly names the checked locations and says no user action is needed. Record durable role-memory changes in `[project-repo]\roles\[role-name]\memory.md`, mirror role-memory changes to `[project-memory-root]\[role-name].md` when appropriate, and record handoff/channel changes in the relevant handoff file. Do not create noisy no-work log entries, and do not treat this heartbeat as approval for production actions, external communication, spending, authority expansion, automation changes beyond cadence-only adaptive quiet updates, or autonomous runtime beyond this check.

## Assigned Handoff Files

Always include:

- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mindshare\channels\communications.md`

Use when relevant:

- `G:\My Drive\Mojo\channels\pipeline.md` for pipeline, MAPS sequencing, build routing, verification, or closeout.
- `G:\My Drive\Mindshare\channels\recruiting.md` for recruiting, Ana, role intake, role onboarding, or hiring workflows.

## Memory Configuration

- Primary role memory: `[project-repo]\roles\[role-name]\memory.md`
- Obsidian or notes mirror: `[project-memory-root]\[role-name].md` when a project memory root exists
- Mirror status: required for `/role` completion when a project memory root exists; secondary unless project instructions explicitly make it primary.
- Durable write order: update primary repo-local memory first; mirror to Obsidian/notes when the project has a memory root and the change belongs in durable notes memory.
- Automation status: this heartbeat makes the role `Role+`, not an `Agent`, unless a separate implemented runtime exists with state, tools, policy, evals, and stop conditions.
- Do not use historical Mindshare role memory as active memory unless Scott explicitly asks for a historical parent update.
- Mindshare-wide roles directory: `G:\My Drive\Mindshare\roles.md` is for discovery only; it does not grant authority or expand assigned channels.

## Heartbeat Response Contract

Use the heartbeat XML response format.

If work exists:

```xml
<heartbeat>
  <automation_id>[role-name]-handoff-check</automation_id>
  <decision>NOTIFY</decision>
  <message>Checked [checked-handoff-locations]; [action taken, needed action, or one blocker question].</message>
</heartbeat>
```

If no work exists:

```xml
<heartbeat>
  <automation_id>[role-name]-handoff-check</automation_id>
  <decision>DONT_NOTIFY</decision>
  <message>Checked [checked-handoff-locations]; no user action is needed.</message>
</heartbeat>
```

## Authority Boundary

This heartbeat does not approve production actions, external communication, spending, authority expansion, automation changes beyond this heartbeat, or autonomous runtime beyond the bounded handoff check.

Cadence-only adaptive quiet updates are allowed by this template. They must not change prompt scope, checked locations, authority, thread destination, or role identity.
