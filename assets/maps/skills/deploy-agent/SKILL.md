---
name: deploy-agent
description: Create the MAPS Deploy phase artifact for an agent or multi-agent system. Use when preparing release plans, runtime configuration, secrets, identities, approvals, rollout strategy, rollback plans, and post-deploy verification.
---

# Deploy Agent

## Overview

Use this skill to release an evaluated agent into a real environment with controls.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /deploy-agent --phase A6 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before writing a deployment plan, ask for any missing answers. Do not assume production targets, secrets, rollout policy, or approval gates.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- What agent, role, or system is being released?
- What eval evidence or approval says it is ready?
- What target environment, runtime, region, account, or platform should receive it?
- What configuration, identities, bindings, secrets, and permissions are required?
- Who approves release, rollback, and access changes?
- What rollout strategy should be used: local demo, internal alpha, limited beta, staged rollout, or full production?
- What rollback or disable path is required?
- What post-deploy verification must pass?
- Who owns operations, incident response, and user communication?
- What should not be deployed yet?

If release readiness is unclear, ask whether to stop, create a pre-release checklist, or produce a draft plan only.

## Workflow

1. Confirm eval evidence and release readiness.
2. Identify the deployment target and runtime requirements.
3. Define secrets, identity, permissions, and configuration.
4. Choose rollout, approval, and rollback strategy.
5. Specify post-deploy verification.
6. Name owners and operating contacts.
7. Produce a deployment plan.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/observe-agent` after deployment, or `/evaluate-agent` again if release gates fail.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
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
