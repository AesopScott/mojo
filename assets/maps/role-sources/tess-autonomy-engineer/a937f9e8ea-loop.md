# Tess / Autonomy Engineer Loop

Status: approved narrow evaluation heartbeat for `tess-autonomy-evaluation`; not broad autonomous runtime.

## Trigger

- Scott asks for autonomy review.
- Every 4 hours, `tess-autonomy-evaluation` reruns the autonomy evaluation and checks for website-relevant changes.
- A role is created, activated, suspended, retired, or granted new tools.
- A gate, hook, heartbeat, file watcher, or automation changes.
- Mae, Reid, Vik, Rae, or Ana escalates a boundary concern.

## Planned Loop

1. Read assigned handoff files.
2. Detect autonomy-relevant changes.
3. Review affected role/gate/source files.
4. Produce finding, risk, recommendation, and approval path.
5. Draft changes only when requested or when policy allows.
6. Update memory after approved action.
7. For the 4-hour evaluation heartbeat, keep `Autonomy Evaluation 1.md` as the single active/current evaluation snapshot. Do not create numbered evaluation snapshot files.
8. When evaluation standings, taxonomy, evidence, blockers, or source paths change, update `Autonomy Evaluation 1.md` and append a concise timestamped run note to Scott's Obsidian mirror at `G:\My Drive\Mindshare\scott.md`.
9. Append to `G:\My Drive\Mindshare\channels\training.md` only when Liz needs a website-relevant legend or standing update.

## State

Future state should track reviewed roles, last autonomy inventory hash, open gate recommendations, approvals, denials, and next review date.

Current approved automation:

- `C:\Users\scott\.codex\automations\tess-autonomy-evaluation\automation.toml`
- Cadence: `FREQ=HOURLY;INTERVAL=4`
- Scope: autonomy taxonomy/evaluation refresh and Liz handoff on website-relevant changes only.
- History rule: active snapshot stays in `Autonomy Evaluation 1.md`; timestamped run history lives in Scott's Obsidian mirror at `G:\My Drive\Mindshare\scott.md`.

## Stop Conditions

- No relevant change.
- Missing approval.
- Gate changes affect forbidden domains.
- Source records conflict.
- Scott suspends Tess's autonomy review.

## Not Approved

No broad autonomous runtime, hook, automatic gate rewrite, production action, release action, GitHub action, external communication, spending, secrets access, or authority expansion is approved by this loop spec. The only approved scheduled behavior here is the 4-hour `tess-autonomy-evaluation` heartbeat described above.
