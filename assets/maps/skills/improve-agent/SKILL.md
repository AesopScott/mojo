---
name: improve-agent
description: Run MAPS Phase 8 Improve. Use when Codex needs to review observation evidence, eval failures, regressions, incidents, support notes, user feedback, cost/latency/reliability signals, classify improvement work, route items to MAPS phases, prioritize and split backlog items, define proof, and produce improvement-review.md and improvement-backlog.md.
---

# Improve Agent

Use this skill after Phase 7 has produced `agents/{agent-handle}/observation-log.md` and before the next MAPS iteration starts.

This is the base Improve skill. Do not create a plus-plus wrapper unless a specific external capability is being merged into the process.

## Input

- `agents/{agent-handle}/observation-plan.md`
- `agents/{agent-handle}/observation-log.md`
- `agents/{agent-handle}/eval-report.md`
- `agents/{agent-handle}/deployment-record.md`
- Incident notes, support notes, user feedback, cost/latency/reliability signals, and existing backlog items

## Workflow

1. Review observation evidence.
2. Review eval failures and regressions.
3. Review incidents and support notes.
4. Review user feedback.
5. Review cost, latency, and reliability signals.
6. Classify each candidate improvement:
   - behavior
   - prompt/design
   - tool
   - permission
   - memory
   - runtime config
   - eval coverage
   - deployment
   - observability
   - cost
   - reliability
   - safety
   - UX
7. Route each item to the right MAPS phase.
8. Prioritize by impact, safety, frequency, cost, dependency, and effort.
9. Split large improvements into smaller backlog items.
10. Define proof required for each item.
11. Decide what enters the next iteration.
12. Decide what stays deferred.
13. Produce or update `agents/{agent-handle}/improvement-review.md`.
14. Produce or update `agents/{agent-handle}/improvement-backlog.md`.

## Rules

- Do not create improvement items without evidence.
- Do not send every item straight to Build. Route the work to the phase that owns the root cause.
- Split broad items until the next slice can be proved independently.
- Keep deferred work visible with a reason.
- Record the proof required before the item is allowed back into implementation.

## Output

- `agents/{agent-handle}/improvement-review.md`
- `agents/{agent-handle}/improvement-backlog.md`
- Iteration decision: next iteration, defer, monitor, rollback/pause, or no action
- MAPS handoff notes for the next phase
