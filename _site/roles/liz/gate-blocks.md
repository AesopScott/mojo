# Gate Blocks

Status: no open gate blocks.

## Purpose

Track active gate blocks for this role.

When this role is blocked by the Codex tool gate, add one entry under `Open Blocks` with time, blocked action, target path or command, approval needed, and current owner.

When gate clears, move/remove the entry from `Open Blocks` and add a short note under `Cleared Blocks`.

## Open Blocks

None.

## Cleared Blocks

- 2026-06-22T03:41:00Z - Org chart portrait publish block cleared.
  - Blocked command: `git add -- maps/org-chart/index.html assets/maps/team/cal.webp assets/maps/team/tess.webp assets/maps/team/cole.webp`
  - Approved files: `maps/org-chart/index.html`, `assets/maps/team/cal.webp`, `assets/maps/team/tess.webp`, `assets/maps/team/cole.webp`
  - Approval evidence: Reid approved the exact four-file scope in `G:\My Drive\Mindshare\channels\release-management.md` under `### 2026-06-21 21:13 - Reid / Release Manager`.
  - Gate repair evidence: Scott corrected `git add` path detection and added relative path wildcards to Liz's action grant; staging then succeeded.
  - Cleared note: commit `260367e` succeeded and pushed to `origin/main`; GitHub Actions run `27927999015` succeeded; live page and three portrait assets returned HTTP 200.

- 2026-06-22T02:37:00Z - Org chart publish block cleared by Scott's explicit approval after Reid approval was already present.
  - Blocked command: `git add -- maps/org-chart/index.html`
  - Existing file touched: `C:\Users\scott\Code\mojo\maps\org-chart\index.html`
  - Scope: replace Matt with Cal, add Tess reporting to Vik, add Cole as HR Director, remove visible operator/coordinator/executor role-type labels while preserving color coding.
  - Release approval evidence: Reid approved the exact file/action in `G:\My Drive\Mindshare\channels\release-management.md` under `### 2026-06-21 20:14 - Reid / Release Manager`.
  - Gate issue: the earlier block reported `Detected target paths: none detected`; this still needs gate repair so Reid approval is honored without Scott repeating it.
  - Cleared note: Scott explicitly approved proceeding; staging, commit `5a1668c`, and push to `origin/main` succeeded.

- 2026-06-22T00:07:35Z - TRAIN-030 publish commit block cleared.
  - Blocked command: `git commit -m "docs: clean up maps overview and learn page"`
  - Approved staged files: `maps/Overview/index.html`, `maps/index.html`, `watch/index.html`
  - Approval evidence: Reid approved TRAIN-030 in `G:\My Drive\Mindshare\channels\release-management.md`.
  - Cleared note: Gate spelling/pattern issue was corrected; commit `978dec9` succeeded and pushed to `origin/main`.
