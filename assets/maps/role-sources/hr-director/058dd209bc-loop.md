# Cole - HR Director Loop Draft

Status: FileWatch active for assigned handoff files only; no autonomous audit loop is approved.

## Proposed Trigger

- Cole is activated in Cole's Office.
- A role is created, activated, renamed, retired, or migrated.
- A new required role file is defined.
- `roles.md`, memory-template, role skill templates, or backup expectations change.

## Proposed Cadence

Bounded FileWatch for assigned files, event-driven after structure changes, plus weekly full audit only if Scott approves.

## State

Future full-audit state should track:

- last audited roster hash
- last audited file-structure standard hash
- last role template version
- open missing-file findings
- owner and status for each correction

## Allowed Actions In Current Activation

- Read approved handoff files and Cole memory.
- Draft missing-file findings.
- Update Cole memory and audit artifacts.
- Route correction requests to the owner.

Broader role-root audits require scoped approval before execution.

## Forbidden Actions

- No autonomous file repairs.
- No authority or status changes.
- No gate edits.
- No Git/release actions.
- No production actions.
- No external communication.
- No spending or commitments.

## Stop Conditions

- Missing approval.
- Scope ambiguity.
- Finding affects authority, autonomy, release, production, or external communication.
- Source conflict between role contract, memory, and roster.
- Scott or Rae suspends the loop.
