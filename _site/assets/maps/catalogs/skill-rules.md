# MAPS Skill Rules And Implementations

This catalog defines the rules that MAPS skills must follow and where each rule is implemented in the MAPS program or MAPS plugin.

The website may explain these rules, but this file is the source-level contract that should travel with the MAPS repo/plugin.

## Rule Table

| Rule | Required behavior | Implementation location | Validator support |
| --- | --- | --- | --- |
| One-question interview | Ask exactly one question at a time. Do not ask the developer to fill out a multi-question form. | Every MAPS `SKILL.md`; `AGENTS.md`. | `scripts/validate_maps_skills.py` checks for one-question interview language. |
| Research, Respond, Plan, Don't Act | When a role or MAPS skill is asked a question, handed a possible task, or discussing backlog/policy/architecture work, first research current state, respond with findings, propose a plan with owner, scope, risk, and proof, then ask whether this role should act, another owner should act, or the item should stay in planning/backlog. Do not implement until Scott explicitly asks for action or an approved routed handoff already grants action. | `AGENTS.md`; `/role`; role templates; active role contracts. | Manual review plus future eval scenario. |
| Source-first Research and Recommend | If the source artifact is missing, ask only for that source first. Then research and recommend before asking for revisions. | `/define-agent`, `/design-agent`, `/role`, and future phase skills where artifacts can provide context. | Manual review plus one-question and output-contract validation. |
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
| Role lifecycle | Roles and agents use the lifecycle states unauthorized, authorized role, authorized agent, suspended, and retired. Lifecycle does not replace maturity or authority. | `/role`; role templates; org-chart role maturity page. | Manual review. |
| Agentic Systems Program Manager role | M0 may create or reference an Agentic Systems Program Manager role for MAPS phase-boundary, scope, memory/RAG, and next-skill guidance. M1 may use ASPM guidance as a reference only after M0 defines or references the role. Spell out the role name first; use ASPM sparingly after that. | `/foundation`, M0 page, `templates/project-foundation.md`, `/role`, `/shape`, and project role artifacts. | Validator checks M1 for ASPM guidance language. |
| Multi-agent phase bridge | When M1 selects Multi-Agent / MAPS, do not jump directly from shape to build. Run M2-M7 in order unless an equivalent artifact already exists: roster, contracts, coordination, buildout, capabilities, and orchestration. | `/multi-agent-roster`, `/multi-agent-contracts`, `/multi-agent-coordination`, `/multi-agent-buildout`, `/multi-agent-capabilities`, `/multi-agent-orchestration`, `templates/multi-agent-*.md`, and `catalogs/multi-agent-research-sources.md`. | Validator checks base skill contracts; manual review checks phase-specific output quality. |
| Child APS routing | M5 may route individual participants through APS A1-A8, but M5 itself is a system buildout plan, not permission to build every candidate agent. | `/multi-agent-buildout`, `/define-agent`, `/design-agent`, `/build-agent`, `/equip-agent`, `/evaluate-agent`, `/deploy-agent`, `/observe-agent`, `/improve-agent`. | Manual review plus future buildout evaluator. |
| Agent-to-agent versus agent-to-tool boundary | M6 and M7 must separate agent-to-agent communication from MCP/tool/resource capability access so orchestration does not hide permission or protocol risk. | `/multi-agent-capabilities`, `/multi-agent-orchestration`, `catalogs/multi-agent-research-sources.md`. | Manual review plus future capability/orchestration validator. |

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
| Multi-agent research references | `catalogs/multi-agent-research-sources.md` |
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
