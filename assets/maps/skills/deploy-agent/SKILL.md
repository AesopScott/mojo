---
name: deploy-agent
description: Create the MAPS Deploy phase artifact for an agent or multi-agent system. Use when preparing release plans, runtime configuration, secrets, identities, approvals, rollout strategy, rollback plans, and post-deploy verification.
---

# Deploy Agent

## Overview

Use this skill to release an evaluated agent into a real environment with controls.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it to the memory stores defined by the foundation contract instead of inventing new locations. If the run changes memory configuration, notes/RAG locations, source inventory, or durable project context, update `project-foundation.md` and `.maps/foundation-preferences.json` through `/foundation` conventions.

At the end of the run, append a row to `MAPS Skill Run Log` in `project-foundation.md`. Prefer the foundation helper when available:

```bash
python "$CODEX_HOME/skills/foundation/scripts/remember_foundation.py" stamp-run --project . --skill /deploy-agent --phase A6 --output "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, append the timestamp, skill, phase, output path, memory updates, and short note manually.

## Workflow

1. Confirm eval evidence and release readiness.
2. Identify the deployment target and runtime requirements.
3. Define secrets, identity, permissions, and configuration.
4. Choose rollout, approval, and rollback strategy.
5. Specify post-deploy verification.
6. Name owners and operating contacts.
7. Produce a deployment plan.

## Output

Return:

- Target environment
- Artifact and configuration
- Secrets and identity
- Release gates
- Rollback plan
- Post-deploy verification
- Owners

Use `templates/deployment-plan.md` from the MAPS repo when working inside this repository.

## Done Criteria

- The release is controlled.
- Runtime access is intentional.
- Rollback is possible.
- Verification happens after deployment.
