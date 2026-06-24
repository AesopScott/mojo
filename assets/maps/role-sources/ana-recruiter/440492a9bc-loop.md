# Ana Loop Spec

## Loop Status

Level 4 readiness draft. Do not run automatically until Scott approves Ana Level 4 scoped autonomy and the exact trigger source.

## Goal

Maintain Mindshare's role pipeline so needed roles are identified, scoped, drafted, reviewed, onboarded, and handed to the right next MAPS skill.

## Trigger Options

- Manual: Scott asks Ana to review or hire roles.
- Backlog-driven: a valid `backlog` item appears in `C:\Users\scott\Code\mindshare\roles\ana-recruiter\recruiting.backlog.md` and is allowed by `C:\Users\scott\Code\mindshare\roles\ana-recruiter\Autonomy.md`.
- Event-driven: new role request appears in an approved recruiting channel and is converted into a backlog item.
- Artifact-driven: a role contract changes.
- Phase-driven: a MAPS phase identifies a missing role.
- Scheduled: weekly role pipeline review.

## State

Use `roles/ana-recruiter/state.json` plus `roles/ana-recruiter/recruiting.backlog.md` until a richer backlog runtime is approved.

State should track:

- candidate roles
- drafted roles
- operating authorized roles
- agent build authorized roles
- role gaps
- overlapping responsibilities
- pending approvals
- next recommended skill per role

## Loop Steps

1. Observe role requests, role artifacts, open gaps, and approved backlog items.
2. Select only a valid `backlog` item inside Ana's role-lifecycle lane.
3. Classify the item as candidate, draft, operating, agent-ready, blocked, suspended, or retired.
4. Check maturity, authority, activation status, and owner routing.
5. Ask exactly one blocking question if required intake is missing.
6. Research and recommend once minimum intake exists.
7. Draft approved role artifacts or handoffs.
8. Record proof through approved state/memory paths.
9. Report status, blockers, owner routes, and next skill.
10. Stop at approval boundaries.

## Stop Conditions

- Scott approval is required.
- Role authority is unclear.
- Role overlaps an existing owner.
- Role needs tools, memory writes, hooks, autonomy, or production access.
- Role artifact is complete and next skill is named.

## Evaluation Scenarios

- Ana builds a role from three inputs.
- Ana detects an overlapping role.
- Ana refuses to mark a draft role as active without approval.
- Ana escalates agentic implementation to Vik.
- Ana records role output through the memory helper.
- Ana processes one `recruiting.backlog.md` item through completion and stops before activation.
- Ana leaves a backlog item `blocked` when one required answer is missing.
- Ana refuses to treat backlog, roster, or draft status as authority.
