#!/usr/bin/env python3
"""Create a MAPS repository scaffold."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from textwrap import dedent


@dataclass(frozen=True)
class Phase:
    number: str
    slug: str
    title: str
    skill: str
    output: str
    purpose: str


PHASES = [
    Phase("00", "phase-alignment", "Phase Alignment", "phase-alignment", "Phase alignment brief", "Agree on lifecycle structure, names, scope, scaffolding, and where future work belongs."),
    Phase("01", "define", "Define", "define-agent", "Agent brief", "Clarify the agent job, users, authorization level, boundaries, success criteria, and risks."),
    Phase("02", "design", "Design", "design-agent", "System design", "Shape roles, workflow, state, memory, controls, handoffs, and escalation."),
    Phase("03", "build", "Build", "build-agent", "Working agent", "Implement the runnable agent loop, prompts, state, routing, and orchestration."),
    Phase("04", "equip", "Equip", "equip-agent", "Capability map", "Map tools, data, permissions, context, memory, and integrations."),
    Phase("05", "evaluate", "Evaluate", "evaluate-agent", "Eval suite", "Prove behavior with scenarios, rubrics, regressions, and safety checks."),
    Phase("06", "deploy", "Deploy", "deploy-agent", "Release plan", "Release with runtime configuration, identities, approvals, rollback, and verification."),
    Phase("07", "observe", "Observe", "observe-agent", "Observation plan", "Monitor traces, costs, quality, failures, drift, and outcomes."),
    Phase("08", "improve", "Improve", "improve-agent", "Improvement backlog", "Turn evidence into prioritized changes to prompts, tools, memory, policies, design, and evals."),
]


TEMPLATES = {
    "maps-scaffold-template.md": "# MAPS Scaffold Template\n\nThis template defines the repeatable repository structure created by `/scaffold`.\n\n## Purpose\n\nCreate a MAPS-ready repository with phase docs, phase skills, reusable templates, catalogs, and lightweight docs pages.\n\n## Repository Structure\n\n```text\nmaps/\n  README.md\n  LICENSE\n  .gitignore\n  docs/\n    phase0.html\n    phase1.html\n    styles.css\n    maps-manifest.js\n    maps-render.js\n    contributing.md\n  phases/\n    00-phase-alignment.md\n    01-define.md\n    02-design.md\n    03-build.md\n    04-equip.md\n    05-evaluate.md\n    06-deploy.md\n    07-observe.md\n    08-improve.md\n  skills/\n    phase-alignment/\n      SKILL.md\n      agents/openai.yaml\n    define-agent/\n      SKILL.md\n      agents/openai.yaml\n    design-agent/\n      SKILL.md\n      agents/openai.yaml\n    build-agent/\n      SKILL.md\n      agents/openai.yaml\n    equip-agent/\n      SKILL.md\n      agents/openai.yaml\n    evaluate-agent/\n      SKILL.md\n      agents/openai.yaml\n    deploy-agent/\n      SKILL.md\n      agents/openai.yaml\n    observe-agent/\n      SKILL.md\n      agents/openai.yaml\n    improve-agent/\n      SKILL.md\n      agents/openai.yaml\n  templates/\n    maps-scaffold-template.md\n    phase-alignment-brief.md\n    agent-definition-template.md\n    workflow-spec.md\n    tool-map.md\n    eval-scorecard.md\n    deployment-plan.md\n    observation-report.md\n    improvement-backlog.md\n  catalogs/\n    repos.md\n    skills.md\n    tools.md\n```\n\n## Required Guarantees\n\n- Every APS phase has a phase doc.\n- Every APS phase has a `SKILL.md`.\n- Every generated skill has valid frontmatter.\n- Templates are reusable input shells, not completed outputs.\n- Catalogs are present before resources are curated.\n- Docs pages expose the scaffold and current phase resources.\n\n## Instantiation\n\nUse `/scaffold` to instantiate this template into a target directory.\n",
    "phase-alignment-brief.md": "# Phase Alignment Brief\n\n## Framework Name\n\n## Purpose\n\n## Audience\n\n## Phase Sequence\n\n```text\nphase alignment -> define -> design -> build -> equip -> evaluate -> deploy -> observe -> improve\n```\n\n## Phase Definitions\n\n| Phase | Purpose | Primary output |\n| --- | --- | --- |\n\n## Repository Or Project Structure\n\n## Naming Decisions\n\n## What Belongs Where\n\n## Open Questions\n\n## Done Criteria\n",
    "agent-definition-template.md": "# Agent Brief\n\n## Name\n\n## Agent Handle\n\n## Role Or Mandate\n\n## User Or Operator\n\n## Job To Be Done\n\n## Desired Outcome\n\n## Persona And Tone\n\n## Authorization Level\n\n## Allowed Without Approval\n\n## Approval Required For\n\n## Forbidden Actions\n\n## Tool Access Requested\n\n## In Scope\n\n## Out Of Scope\n\n## Success Criteria\n\n## Failure Criteria\n\n## Human Escalation Points\n\n## Risks And Assumptions\n",
    "workflow-spec.md": "# Workflow Spec\n\n## System Goal\n\n## Source Brief\n\n`agents/{agent-handle}/agent-brief.md`\n\n## Research Summary\n\n## Comparable Agents Or Patterns Reviewed\n\n| Source or pattern | What it suggests | Fit for this agent | Caveats |\n| --- | --- | --- | --- |\n\n## Recommendation Table\n\n| Design question | Recommendation | Reasoning | User override |\n| --- | --- | --- | --- |\n| Operating model |  |  |  |\n| Roles and responsibilities |  |  |  |\n| Workflow states |  |  |  |\n| Decision points |  |  |  |\n| Memory and context |  |  |  |\n| Tools and integrations |  |  |  |\n| Approval gates |  |  |  |\n| Escalation paths |  |  |  |\n| Failure handling |  |  |  |\n| Observability |  |  |  |\n| Test strategy |  |  |  |\n| Acceptance scenarios |  |  |  |\n| Eval shape |  |  |  |\n| Unit/integration/e2e balance |  |  |  |\n| Mock vs real tool policy |  |  |  |\n| Regression gates |  |  |  |\n\n## Agent Roles\n\n| Role | Responsibility | Inputs | Outputs | Escalates when |\n| --- | --- | --- | --- | --- |\n\n## Workflow\n\n1.\n\n## Decision Points\n\n## State And Memory\n\n## Tools And Integrations\n\n## Guardrails\n\n## Human Approval Gates\n\n## Handoffs\n\n## Failure Modes\n\n## Observability Needs\n\n## Test Strategy\n\n## Acceptance Scenarios\n\n| Scenario | Given | When | Then | Proof method |\n| --- | --- | --- | --- | --- |\n\n## Eval Shape\n\n## Unit Integration E2E Balance\n\n## Mock Vs Real Tool Policy\n\n## Failure Cases\n\n## Regression Gates\n\n## Proof Required Before Phase 3 Build\n\n## Open Questions\n",
    "tool-map.md": "# Tool Map\n\n| Capability | Tool or source | Permission | Used by | Failure behavior |\n| --- | --- | --- | --- | --- |\n\n## Context Sources\n\n## Memory Policy\n\n## Audit Requirements\n\n## Security Notes\n",
    "eval-scorecard.md": "# Eval Scorecard\n\n| Scenario | Expected behavior | Actual behavior | Score | Notes |\n| --- | --- | --- | --- | --- |\n\n## Pass Criteria\n\n## Failure Categories\n\n## Release Recommendation\n",
    "deployment-plan.md": "# Deployment Plan\n\n## Target Environment\n\n## Artifact\n\n## Configuration\n\n## Secrets And Identity\n\n## Release Gates\n\n## Rollback Plan\n\n## Post-Deploy Verification\n\n## Owners\n",
    "observation-report.md": "# Observation Report\n\n## Period Or Trace Set\n\n## Quality Signals\n\n## Cost And Latency\n\n## Tool Use\n\n## Failures And Escalations\n\n## Surprises\n\n## Candidate Improvements\n",
    "improvement-backlog.md": "# Improvement Backlog\n\n| Priority | Evidence | Root cause | Proposed change | Eval coverage | Owner |\n| --- | --- | --- | --- | --- | --- |\n\n## Next Experiment\n\n## Changes To Earlier MAPS Phases\n",
}


def write_file(path: Path, content: str, force: bool) -> bool:
    if path.exists() and not force:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")
    return True


def skill_md(phase: Phase) -> str:
    return dedent(
        f"""\
        ---
        name: {phase.skill}
        description: Create the {phase.title} phase artifact for a MAPS repository or agent system. Use when working on {phase.purpose.lower()}
        ---

        # {phase.title}

        ## Overview

        Use this skill to produce or update the {phase.output.lower()}.

        ## Workflow

        1. Read the current project context.
        2. Identify the inputs for this phase.
        3. Produce the phase artifact.
        4. Record open questions and risks.
        5. Name the next MAPS phase.

        ## Output

        Return a concise {phase.output.lower()} with decisions, artifacts, and next actions.

        ## Done Criteria

        - The phase artifact exists.
        - Decisions are explicit.
        - Open questions are visible.
        - Future work has a clear destination.
        """
    )


def openai_yaml(phase: Phase) -> str:
    return dedent(
        f"""\
        interface:
          display_name: "{phase.title}"
          short_description: "Create the {phase.output.lower()}."
          default_prompt: "Use {phase.skill} to work through the MAPS {phase.title} phase."
        """
    )


def readme(name: str) -> str:
    rows = "\n".join(f"| {p.title} | {p.purpose} | {p.output} |" for p in PHASES)
    return dedent(
        f"""\
        # {name}: Multi-Agent Pipeline Skills

        {name} is a skill-based framework for building multi-agent systems.

        ```text
        phase alignment -> define -> design -> build -> equip -> evaluate -> deploy -> observe -> improve
        ```

        ## Phase Map

        | Phase | Purpose | Primary output |
        | --- | --- | --- |
        {rows}

        ## Repository Layout

        ```text
        maps/
          docs/
          phases/
          skills/
          templates/
          catalogs/
        ```
        """
    )


def docs_phase0(name: str) -> str:
    return dedent(
        f"""\
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>{name}: Phase Alignment</title>
            <link rel="stylesheet" href="./styles.css">
            <script src="./maps-manifest.js" defer></script>
            <script src="./maps-render.js" defer></script>
          </head>
          <body data-maps-phase="0">
            <main>
              <h1>{name}</h1>
              <p>Start with Phase 00: Phase Alignment. Agree on the scaffold before defining, designing, building, equipping, evaluating, deploying, observing, or improving agents.</p>
              <h2>Repository Structure</h2>
              <pre><code data-maps-tree>maps/
  docs/
    phase0.html
  skills/
    scaffold/
      SKILL.md</code></pre>
              <h2>Phase 0 Resources</h2>
              <section class="resources">
                <article><h3>Skills</h3><ul data-maps-skills><li><strong>/scaffold</strong></li></ul></article>
                <article><h3>Repos</h3><ul data-maps-repos><li>AesopScott/maps</li></ul></article>
                <article><h3>Tools</h3><ul data-maps-tools><li>Python</li></ul></article>
                <article><h3>Templates</h3><ul data-maps-templates><li>templates/maps-scaffold-template.md</li><li>templates/phase-alignment-brief.md</li></ul></article>
                <article><h3>Catalogs</h3><ul data-maps-catalogs><li>catalogs/skills.md</li></ul></article>
              </section>
              <h2>Phase Sequence</h2>
              <ol>
                <li>Phase Alignment</li>
                <li>Define</li>
                <li>Design</li>
                <li>Build</li>
                <li>Equip</li>
                <li>Evaluate</li>
                <li>Deploy</li>
                <li>Observe</li>
                <li>Improve</li>
              </ol>
            </main>
          </body>
        </html>
        """
    )


def docs_phase1(name: str) -> str:
    return dedent(
        f"""\
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>{name}: Define</title>
            <link rel="stylesheet" href="./styles.css">
            <script src="./maps-manifest.js" defer></script>
            <script src="./maps-render.js" defer></script>
          </head>
          <body data-maps-phase="1">
            <main>
              <h1>Define</h1>
              <p>Phase 1 turns an agent idea into an agent brief with the job, user, outcome, authorization level, boundaries, success criteria, failure criteria, escalation points, risks, and assumptions.</p>
              <h2>Agent Brief</h2>
              <pre><code># Agent Brief

## Name
## Agent Handle
## Role Or Mandate
## User Or Operator
## Job To Be Done
## Desired Outcome
## Persona And Tone
## Authorization Level
## Allowed Without Approval
## Approval Required For
## Forbidden Actions
## Tool Access Requested
## In Scope
## Out Of Scope
## Success Criteria
## Failure Criteria
## Human Escalation Points
## Risks And Assumptions</code></pre>
              <h2>Phase 1 Resources</h2>
              <section class="resources">
                <article><h3>Skills</h3><ul data-maps-skills><li><strong>/define-agent</strong></li></ul></article>
                <article><h3>Repos</h3><ul data-maps-repos><li>AesopScott/maps</li></ul></article>
                <article><h3>Tools</h3><ul data-maps-tools><li>Agent Skills</li></ul></article>
                <article><h3>Templates</h3><ul data-maps-templates><li>templates/agent-definition-template.md</li></ul></article>
                <article><h3>Catalogs</h3><ul data-maps-catalogs><li>catalogs/skills.md</li></ul></article>
                <article><h3>Phase output</h3><p><code>agents/{{agent-handle}}/agent-brief.md</code>, which Phase 2 Design uses to decide behavior, workflow, handoffs, controls, and tool needs.</p></article>
              </section>
            </main>
          </body>
        </html>
        """
    )


def docs_css() -> str:
    return dedent(
        """\
        html { font-family: system-ui, sans-serif; color: #18211f; background: #fbfbf8; }
        body { margin: 0; }
        main { max-width: 860px; margin: 0 auto; padding: 64px 24px; }
        h1 { font-size: clamp(42px, 8vw, 84px); line-height: 1; margin: 0 0 24px; }
        p { color: #58645f; font-size: 20px; }
        pre { overflow-x: auto; padding: 18px; border-radius: 8px; color: #e8f1ec; background: #17211f; }
        ol { display: grid; gap: 10px; padding: 0; list-style-position: inside; }
        li { padding: 14px 16px; border: 1px solid #d8dfdb; border-radius: 8px; background: white; }
        .resources { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        article { padding: 16px; border: 1px solid #d8dfdb; border-radius: 8px; background: white; }
        article ul { padding-left: 20px; }
        article li { padding: 0; border: 0; }
        @media (max-width: 720px) { .resources { grid-template-columns: 1fr; } }
        """
    )


def docs_manifest() -> str:
    phases = ",\n    ".join(f'"{p.number}-{p.slug}.md"' for p in PHASES)
    skills = ",\n    ".join(
        f'{{ name: "{p.skill}", displayName: "/{p.skill}", files: ["SKILL.md"] }}' for p in PHASES
    )
    return dedent(
        f"""\
        window.MAPS_MANIFEST = {{
          pages: [
            {{ file: "phase0.html", label: "Phase 0", title: "Phase Alignment" }},
            {{ file: "phase1.html", label: "Phase 1", title: "Define" }}
          ],
          phases: [
            {phases}
          ],
          skills: [
            {{ name: "scaffold", files: ["SKILL.md", "scripts/create_maps_scaffold.py"] }},
            {skills}
          ],
          templates: [
            "maps-scaffold-template.md",
            "phase-alignment-brief.md",
            "agent-definition-template.md",
            "workflow-spec.md",
            "tool-map.md",
            "eval-scorecard.md",
            "deployment-plan.md",
            "observation-report.md",
            "improvement-backlog.md"
          ],
          catalogs: ["repos.md", "skills.md", "tools.md"],
          repos: [
            {{ label: "AesopScott/maps", url: "https://github.com/AesopScott/maps" }},
            {{ label: "VoltAgent/awesome-agent-skills", url: "https://github.com/VoltAgent/awesome-agent-skills" }},
            {{ label: "hqhq1025/skill-optimizer", url: "https://github.com/hqhq1025/skill-optimizer" }}
          ],
          tools: ["Python", "GitHub CLI", "Git", "Agent Skills"],
          phaseResources: {{
            "0": {{
              skills: ["scaffold", "phase-alignment"],
              repos: ["AesopScott/maps", "VoltAgent/awesome-agent-skills", "hqhq1025/skill-optimizer"],
              tools: ["Python", "GitHub CLI", "Git"],
              templates: ["maps-scaffold-template.md", "phase-alignment-brief.md"],
              catalogs: ["skills.md", "repos.md", "tools.md"]
            }},
            "1": {{
              skills: ["define-agent"],
              repos: ["AesopScott/maps"],
              tools: ["Git", "Agent Skills"],
              templates: ["agent-definition-template.md"],
              catalogs: ["skills.md", "repos.md", "tools.md"]
            }}
          }}
        }};
        """
    )


def docs_render() -> str:
    return dedent(
        """\
        (function () {
          const manifest = window.MAPS_MANIFEST;
          if (!manifest) return;
          const line = (depth, text) => `${"  ".repeat(depth)}${text}`;
          const tree = document.querySelector("[data-maps-tree]");
          if (tree) {
            const lines = ["maps/", line(1, "docs/")];
            manifest.pages.forEach((page) => lines.push(line(2, page.file)));
            lines.push(line(2, "styles.css"), line(2, "maps-manifest.js"), line(2, "maps-render.js"), line(1, "phases/"));
            manifest.phases.forEach((phase) => lines.push(line(2, phase)));
            lines.push(line(1, "skills/"));
            manifest.skills.forEach((skill) => {
              lines.push(line(2, `${skill.name}/`));
              skill.files.forEach((file) => lines.push(line(3, file)));
            });
            lines.push(line(1, "templates/"));
            manifest.templates.forEach((template) => lines.push(line(2, template)));
            lines.push(line(1, "catalogs/"));
            manifest.catalogs.forEach((catalog) => lines.push(line(2, catalog)));
            tree.textContent = lines.join("\\n");
          }
          const fill = (selector, items, render) => {
            const target = document.querySelector(selector);
            if (!target) return;
            target.innerHTML = "";
            items.forEach((item) => {
              const li = document.createElement("li");
              render(li, item);
              target.appendChild(li);
            });
          };
          const phase = document.body.getAttribute("data-maps-phase") || "0";
          const phaseResources = manifest.phaseResources?.[phase] || {};
          const byName = (items, names, key = "name") => (names || []).map((name) => items.find((item) => item[key] === name)).filter(Boolean);
          const skills = byName(manifest.skills, phaseResources.skills);
          const repos = byName(manifest.repos, phaseResources.repos, "label");
          fill("[data-maps-skills]", skills, (li, item) => li.append(item.displayName || (item.name === "scaffold" ? "/scaffold" : item.name)));
          fill("[data-maps-repos]", repos, (li, item) => {
            const a = document.createElement("a");
            a.href = item.url;
            a.textContent = item.label;
            li.appendChild(a);
          });
          fill("[data-maps-tools]", phaseResources.tools || [], (li, item) => li.append(item));
          fill("[data-maps-templates]", phaseResources.templates || [], (li, item) => li.append(`templates/${item}`));
          fill("[data-maps-catalogs]", phaseResources.catalogs || [], (li, item) => li.append(`catalogs/${item}`));
        })();
        """
    )


def phase_doc(phase: Phase) -> str:
    return dedent(
        f"""\
        # {phase.title}

        ## Purpose

        {phase.purpose}

        ## Inputs

        -

        ## Activities

        -

        ## Outputs

        - {phase.output}

        ## Done Criteria

        -
        """
    )


def build(target: Path, name: str, force: bool) -> list[Path]:
    written: list[Path] = []
    files = {
        "README.md": readme(name),
        ".gitignore": ".DS_Store\nThumbs.db\n*.tmp\n*.log\n",
        "LICENSE": "MIT License\n\nCopyright (c) 2026\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, subject to the conditions of the MIT License.\n",
        "docs/phase0.html": docs_phase0(name),
        "docs/phase1.html": docs_phase1(name),
        "docs/styles.css": docs_css(),
        "docs/maps-manifest.js": docs_manifest(),
        "docs/maps-render.js": docs_render(),
        "docs/contributing.md": "# Contributing\n\nAdd phase docs, skills, templates, and catalog entries that strengthen a MAPS phase.\n",
        "catalogs/repos.md": "# Repository Catalog\n\n| Phase | Repo | Label | Notes |\n| --- | --- | --- | --- |\n",
        "catalogs/skills.md": "# Skills Catalog\n\n| Phase | Skill | Source | Label | Why it helps |\n| --- | --- | --- | --- | --- |\n",
        "catalogs/tools.md": "# Tools Catalog\n\n| Phase | Tool | Type | Label | Notes |\n| --- | --- | --- | --- | --- |\n",
    }
    for filename, content in files.items():
        path = target / filename
        if write_file(path, content, force):
            written.append(path)

    for phase in PHASES:
        phase_path = target / "phases" / f"{phase.number}-{phase.slug}.md"
        if write_file(phase_path, phase_doc(phase), force):
            written.append(phase_path)
        skill_root = target / "skills" / phase.skill
        if write_file(skill_root / "SKILL.md", skill_md(phase), force):
            written.append(skill_root / "SKILL.md")
        if write_file(skill_root / "agents" / "openai.yaml", openai_yaml(phase), force):
            written.append(skill_root / "agents" / "openai.yaml")

    for filename, content in TEMPLATES.items():
        path = target / "templates" / filename
        if write_file(path, content, force):
            written.append(path)
    return written


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a MAPS repository scaffold.")
    parser.add_argument("target", help="Target directory for the scaffold.")
    parser.add_argument("--name", default="MAPS", help="Framework name to use in generated content.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing generated files.")
    args = parser.parse_args()

    target = Path(args.target).expanduser().resolve()
    written = build(target, args.name, args.force)
    print(f"MAPS scaffold ready: {target}")
    print(f"Files written: {len(written)}")
    for path in written:
        print(path.relative_to(target).as_posix())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
