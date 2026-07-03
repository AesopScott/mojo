# Vik Hook Spec

## Status

Draft. This is not installed as an automatic global hook yet.

## Hook Purpose

Load Vik's architectural guidance when a session or request changes Mojo/MAPS structure, roles, skills, memory, authority, or agent build paths.

## Candidate Trigger Events

- Session start in the `mindshare` repo.
- User message contains Vik, ASPA, architecture, role agent, authority, memory, RAG, MAPS skill, phase boundary, hook, loop, or agentic operating model.
- File change under `roles/`, `skills/`, `.maps/`, `templates/`, or `phases/`.
- Before commit when staged files include Mojo/MAPS structural artifacts.

## Command Shape

No command is implemented yet. A future hook should:

1. Detect whether the changed/requested work matches Vik triggers.
2. Emit a short context packet pointing to `roles/vik-aspa/role-agent.md`.
3. Never modify files directly.
4. Write memory only through the Mojo memory contract.
5. Log trigger and decision to Vik state.

## Permissions

- Read-only by default.
- No production access.
- No external communication.
- No global install without Scott approval.
- Memory writes only through configured Mojo stores.

## Failure Behavior

If the hook cannot determine scope, it should emit: "Vik review recommended: Mojo architecture boundary is unclear." It should not block work unless Scott later approves a blocking gate.

## Disable Path

Remove the hook entry from the Codex/Claude hook configuration and remove or comment the Vik activation block in `AGENTS.md`.
