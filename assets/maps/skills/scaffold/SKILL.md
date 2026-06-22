---
name: scaffold
description: Deprecated compatibility alias for older /scaffold requests. Use /foundation instead when creating or auditing MAPS project foundations, portable path settings, or full MAPS framework/org scaffolds.
---

# Scaffold

## Versioning

Current version: 1.0.0.

Follow semantic versioning for this compatibility alias:

- Patch: wording or routing clarifications.
- Minor: added compatibility behavior.
- Major: changed alias contract.

## Changelog

- 2026-06-20 - v1.0.0 - Deprecated `/scaffold` as an independent skill; Foundation now owns scaffold creation.

## Deprecation

Do not run an independent `/scaffold` workflow.

When the user invokes `/scaffold`, route the request to `/foundation` and explain that Foundation now owns:

- M0 project foundation
- portable path layer inquiry and recording
- notes/source/memory/RAG scaffold
- Git, remote, env, and secrets readiness
- optional full MAPS framework/org repo structure formerly created by `/scaffold`

Use the Foundation resource `scripts/create_maps_scaffold.py` only through a Foundation run after target directory, project/framework name, and overwrite policy are clear.

## Foundation Routing Rules

- Ask exactly one question at a time.
- Read `project-foundation.md` when it exists and use its persistent memory contract before routing.
- Route the request to `/foundation` and let Foundation handle durable artifacts, path settings, scaffolding, and memory updates.
- When Foundation creates or updates durable knowledge, Foundation should run `maps_memory.py` according to its own skill contract.
- Do not create a separate Scaffold run note or independent Scaffold artifact.

## Done Criteria

- The user is routed to `/foundation`.
- No separate Scaffold-specific plan or artifact is produced.

## Completion report

When a legacy `/scaffold` request is handled, report:

- Completion status: routed.
- Outcome: the request belongs to `/foundation`.
- Memory update: none from `/scaffold`; Foundation owns any `maps_memory.py` update.
- Next skill: `/foundation`.

## Output

Create no independent Scaffold output.

Expected output is a handoff to `/foundation`, which may then create or update:

- `project-foundation.md`
- portable path settings
- notes/source/memory/RAG scaffold
- optional full MAPS framework/org repo structure
