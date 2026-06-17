# APS Phase Map

Use this reference when the master `/aps` skill needs the phase sequence, artifacts, or bundled resource locations.

| Phase | Name | Skill | Artifacts |
|---|---|---|---|
| A0 | Phase Alignment | `phase-alignment`, `/scaffold` | project folders, phase alignment brief, `.aps/progress.json` |
| A1 | Define | `/define-agent` | `agent-brief.md` |
| A2 | Design | `/design-agent` | `agent-design.md`, `agent-backlog.md` |
| A2X | Optional Experience Design | `/design-experience` | `experience-design.md` |
| A3 | Build | `/build-agent++`, `/build-agent` | working slice, `build-log.md` |
| A4 | Equip | `/equip-agent` | `capability-map.md` |
| A5 | Evaluate | `/evaluate-agent++`, `/evaluate-agent` | `eval-suite.md`, `eval-report.md` |
| A6 | Deploy | `/deploy-agent++`, `/deploy-agent` | `deploy-plan.md`, `deployment-record.md` |
| A7 | Observe | `/observe-agent`, observe variants | `observation-plan.md`, `observation-log.md` |
| A8 | Improve | `/improve-agent` | `improvement-review.md`, `improvement-backlog.md` |

Bundled templates live in `assets/templates/`.
Bundled tool and repo catalogs live in `assets/catalogs/`.
Bundled phase skills live in `skills/` and are also mirrored in `assets/phase-skills/` for copying into project folders.
