---
name: aps
description: Run the complete Agentic Pipeline Skills workflow in a new or existing project folder. Use when Codex or Claude Code should create an APS project, copy bundled phase skills/templates/tool catalogs, execute A0-A8 phases, track local progress in .aps/progress.json, continue the next phase, or report APS status.
---

# APS

Use this skill as the master controller for the single-agent Agentic Pipeline Skills workflow.

## Bundled assets

This plugin includes:

- Master skill: `skills/aps/SKILL.md`
- Phase skills: `skills/{phase-skill}/SKILL.md`
- Templates: `assets/templates/`
- Tool and repo catalogs: `assets/catalogs/`
- Progress helper: `skills/aps/scripts/init_aps_project.py`

## Start a new project

1. Choose a new project folder from the user's request. If the user gives no folder, create a conservative hyphen-case folder in the current workspace.
2. Run the helper from this skill folder:

```bash
python skills/aps/scripts/init_aps_project.py init <project-folder> --agent-handle <agent-handle>
```

3. Confirm these files exist:
   - `.aps/progress.json`
   - `.aps/skills/`
   - `.aps/templates/`
   - `.aps/catalogs/`
   - `agents/<agent-handle>/`

## Run phases

Run phases in order unless the user explicitly asks to jump:

| Phase | Skill | Primary output |
|---|---|---|
| A0 Phase Alignment | `phase-alignment` and `/scaffold` | `.aps/progress.json`, folders, phase names |
| A1 Define | `/define-agent` | `agents/<agent-handle>/agent-brief.md` |
| A2 Design | `/design-agent` | `agent-design.md`, `agent-backlog.md` |
| Optional A2 Experience Design | `/design-experience` | `experience-design.md` |
| A3 Build | `/build-agent++` or `/build-agent` | working slice, `build-log.md` |
| A4 Equip | `/equip-agent` | `capability-map.md` |
| A5 Evaluate | `/evaluate-agent++` or `/evaluate-agent` | `eval-suite.md`, `eval-report.md` |
| A6 Deploy | `/deploy-agent++` or `/deploy-agent` | `deploy-plan.md`, `deployment-record.md` |
| A7 Observe | `/observe-agent` or an observe variant | `observation-plan.md`, `observation-log.md` |
| A8 Improve | `/improve-agent` | `improvement-review.md`, `improvement-backlog.md` |

After each phase, update progress:

```bash
python skills/aps/scripts/init_aps_project.py advance <project-folder> --phase A1 --status complete --artifact agents/<agent-handle>/agent-brief.md --note "Brief approved."
```

Use `status` to inspect progress:

```bash
python skills/aps/scripts/init_aps_project.py status <project-folder>
```

## Progress rules

- Keep `.aps/progress.json` as the source of truth for local pipeline state.
- Mark at most one phase `in_progress` at a time.
- Store phase artifacts as relative paths.
- If the project has no visible UI or user-facing workflow, skip Optional A2 Experience Design and record why.
- If the agent is the product or has a visible surface, run Optional A2 Experience Design before A3 Build.
- Do not overwrite user-authored artifacts unless explicitly asked.

## Claude Code use

Claude Code can use the same skill folder and helper script. If plugin installation is not available, copy this plugin's `skills/`, `assets/templates/`, and `assets/catalogs/` into the target environment and invoke `skills/aps/SKILL.md` directly.
