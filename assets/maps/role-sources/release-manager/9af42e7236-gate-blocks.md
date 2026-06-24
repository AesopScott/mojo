# Gate Blocks

Status: no open gate blocks.

## Purpose

Track active gate blocks for this role.

When this role is blocked by the Codex tool gate, add one entry under `Open Blocks` with time, blocked action, target path or command, approval needed, and current owner.

When gate clears, move/remove the entry from `Open Blocks` and add a short note under `Cleared Blocks`.

## Open Blocks

None.

## Cleared Blocks

- 2026-06-22T13:40Z - Scott approved Reid as owner of all Git/release actions and directed a standing owner exception for Git add, commit, release, and related actions. Cleared by adding `owner-reid-git-release-001` to `C:\Users\scott\.codex\tool-gate\gate-exceptions.md`; Reid will continue to review scope, preserve user work, run validation, and report proof before publishing.
