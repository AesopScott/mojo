# Communications Director Loop Spec

## Status

Draft only. Not activated.

## Purpose

Provide a bounded future heartbeat loop for communications-governance checks.

## Trigger

Future approved 5-minute heartbeat for `communications-director-handoff-check`, attached to the Communications Director's own role thread.

## Cadence

Every 5 minutes only when the heartbeat fires and the role is not engaged in active user-directed work.

## State

Primary state lives in:

- `C:\Users\scott\Code\mindshare\roles\communications-director\memory.md`

Secondary mirror when appropriate:

- `G:\My Drive\Mindshare\communications-director.md`

Function channel:

- `G:\My Drive\Mindshare\channels\communications.md`

## Assigned Files For Heartbeat

- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mindshare\channels\communications.md`

Do not read Pipeline, Recruiting, or other function channels by default.

## Loop Steps

1. Read active role memory.
2. Read Heartbeat and Communications channels.
3. Compare new Communications items to known state.
4. If a communications-governance issue exists, classify owner and correction.
5. Act only within approved authority, or ask Scott one blocker question.
6. Update role memory for durable state changes.
7. Use DONT_NOTIFY when there is no Communications Director action.

## Stop Conditions

- No communications-governance work exists.
- A correction needs Scott approval.
- A role owner must respond.
- The issue belongs entirely to another function.
- The heartbeat would require reading unassigned channels.

## Escalation Conditions

- Wrong-channel assignment affects another role's active automation.
- A role is responding outside authority.
- A channel map changes.
- A new function channel is needed.
- A role's monitoring creates noise or user confusion.

## Observability

The role should record meaningful changes only. No noisy no-work log entries.

## Version And Changelog

Version: 0.1.0

| Date | Version | Change |
| --- | --- | --- |
| 2026-06-19 | 0.1.0 | Created draft loop spec for Communications Director candidate role. |
