# MAPS Skill Rules And Implementations

This catalog defines the rules that MAPS skills must follow and where each rule is implemented in the MAPS program or MAPS plugin.

The website may explain these rules, but this file is the source-level contract that should travel with the MAPS repo/plugin.

## Rule Table

| Rule | Required behavior | Implementation location | Validator support |
| --- | --- | --- | --- |
| One-question interview | Ask exactly one question at a time. Do not ask the developer to fill out a multi-question form. | Every MAPS `SKILL.md`; `AGENTS.md`. | `scripts/validate_maps_skills.py` checks for one-question interview language. |
| Output contract | Every skill must say what concrete artifact or decision it creates or updates. | Each `SKILL.md` `## Output` section; templates in `templates/`. | Validator checks for `## Output`. |
| Completion report | Every skill ends by stating completion status, outcome, key decisions, memory update, and next skill. | Each `SKILL.md` `## Completion report`; `AGENTS.md`. | Validator checks completion-report language. |
| Versioning | Every skill has an in-body semantic version and changelog. | Each `SKILL.md` `## Versioning` and `## Changelog`. | Validator checks version/changelog sections. |
| Memory contract | Skills must read `project-foundation.md` and `.maps/foundation-preferences.json` when present. | `/foundation`, shared memory helper, every phase skill. | Validator checks memory-helper wiring and foundation references. |
| Per-skill helper notes | Each skill writes one named helper note and appends a run log entry through the shared helper when available. | `skills/foundation/scripts/maps_memory.py`; every phase skill completion flow. | Validator checks memory helper references. |
| RAG/read-write policy | Skills must follow the project's notes, source, memory, and RAG read/write rules. | `project-foundation.md`; `.maps/foundation-preferences.json`; `/foundation`. | Foundation helper creates and maintains the contract. |
| Git and remote readiness | M0 checks local Git, remote repo status, env/secrets scaffold, and incremental missing setup. | `/foundation`; `skills/foundation/scripts/remember_foundation.py`; `templates/project-foundation.md`. | Foundation smoke tests and skill validation. |
| Global install disclosure | Global installs used by MAPS must be defined in `catalogs/global-installs.md`. | `catalogs/global-installs.md`; Global website page; M0 foundation notes when a project depends on one. | Manual review until a catalog validator exists. |
| Role authority and engagement | Role skills define authority boundaries, engagement type, learning loop, and implementation form. | `/role`; `skills/role/references/role-authority-taxonomy.md`; `skills/role/references/role-engagement-taxonomy.md`. | Role skill contract and manual review. |
| First-person role voice | Role agents must speak in first person as the role, with a defined voice, point of view, activation marker, and prohibited narrator language. They should not respond as Claude, Codex, ChatGPT, or an outside narrator unless naming a system boundary. | `/role`; `skills/role/templates/role-agent.md`; generated `roles/<role-slug>/role-agent.md` artifacts. | Validator checks the `/role` skill for first-person role voice language. |
| Agentic Systems Program Manager role | M0 may create or reference an Agentic Systems Program Manager role for MAPS phase-boundary, scope, memory/RAG, and next-skill guidance. M1 may use ASPM guidance as a reference only after M0 defines or references the role. Spell out the role name first; use ASPM sparingly after that. | `/foundation`, M0 page, `templates/project-foundation.md`, `/role`, `/shape`, and project role artifacts. | Validator checks M1 for ASPM guidance language. |

## Implementation Forms

MAPS rules may be implemented as:

- `SKILL.md` instructions for agent-facing workflow behavior.
- Markdown catalogs in `catalogs/` for program-level definitions.
- Markdown templates in `templates/` for project artifacts.
- Python helpers in `scripts/` or skill-local `scripts/`.
- `AGENTS.md` rules for repo-level behavior.
- Website pages that explain the source contracts to developers.

## Source Of Truth

Use these source locations before changing website prose:

| Concern | Source |
| --- | --- |
| Installed global capabilities | `catalogs/global-installs.md` |
| Skill operating rules | `catalogs/skill-rules.md` |
| Skill list and phase mapping | `catalogs/skills.md` |
| Repo references | `catalogs/repos.md` |
| Tools and service references | `catalogs/tools.md` |
| Project foundation contract | `templates/project-foundation.md` and `skills/foundation/templates/project-foundation.md` |
| Runtime memory helper | `skills/foundation/scripts/maps_memory.py` |
| Foundation preferences helper | `skills/foundation/scripts/remember_foundation.py` |
| Skill validator | `scripts/validate_maps_skills.py` |

## Change Rule

When a MAPS rule changes:

1. Update this catalog.
2. Update the affected `SKILL.md`, template, helper, or validator.
3. Update website training prose only after the source contract is updated.
4. Run `python scripts/validate_maps_skills.py`.
5. Commit and publish the MAPS repo before or alongside the training site.
