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


@dataclass(frozen=True)
class WriteResult:
    path: Path
    status: str


PHASES = [
    Phase("M0", "project-foundation", "Project Foundation", "foundation", "Project foundation", "Create project intent, notes, sources, evidence, assumptions, decisions, memory contract, and RAG readiness."),
    Phase("M1", "system-shape", "System Shape", "shape", "System shape", "Choose Unknown, Single-Agent APS, or Multi-Agent MAPS before roster and implementation work."),
    Phase("M2", "roster", "Roster", "multi-agent-roster", "Multi-agent roster", "Define humans, roles, Role+ operators, candidate agents, tools, services, owners, authority, memory, and proof needs."),
    Phase("M3", "contracts", "Contracts", "multi-agent-contracts", "Participant contracts", "Define inputs, outputs, authority, memory, tools, handoffs, escalation, stop conditions, retries, rollback, and acceptance evidence."),
    Phase("M4", "coordination", "Coordination", "multi-agent-coordination", "Coordination model", "Define lanes, routes, supervisor/router or peer patterns, queues, approvals, exception paths, retries, and evidence."),
    Phase("M5", "agent-buildout", "Agent Buildout", "multi-agent-buildout", "Child APS buildout plan", "Plan which participants become built agents, child APS sequence, dependency order, stubs, test gates, runtime adapters, and no-build decisions."),
    Phase("M6", "capabilities", "Capabilities", "multi-agent-capabilities", "Shared capability map", "Map shared tools, APIs, MCP servers, data, memory, credentials, permissions, limits, fallbacks, audit, and revocation."),
    Phase("M7", "orchestration", "Orchestration", "multi-agent-orchestration", "Runtime orchestration", "Define topology, routing, protocol, task/message/artifact schema, state, queues, schedules, observability, override, and rollback."),
    Phase("M8", "experience-design", "Experience Design", "design-experience", "Experience design", "Turn orchestration and agent behavior into user journeys, surfaces, IA, interaction states, accessibility, and trust controls."),
    Phase("M9", "evaluate", "Evaluate", "multi-agent-evaluate", "System evaluation", "Prove system-level behavior across contracts, coordination, orchestration, capabilities, journeys, approvals, guardrails, observability, and release gates."),
    Phase("M10", "deploy-observe", "Deploy Observe", "multi-agent-deploy-observe", "Deploy/observe plan", "Define runtime release, configuration, secrets, rollout, smoke checks, traces, alerts, incidents, rollback, and production review loops."),
    Phase("M11", "improve", "Improve", "multi-agent-improve", "System improvement backlog", "Classify evidence, incidents, traces, eval failures, user feedback, and operator findings into routed improvements."),
    Phase("A0", "phase-alignment", "Phase Alignment", "phase-alignment", "Phase alignment brief", "Agree on lifecycle structure, names, scope, scaffolding, and where future work belongs."),
    Phase("A1", "define", "Define", "define-agent", "Agent brief", "Clarify the agent job, users, authorization level, boundaries, success criteria, and risks."),
    Phase("A2", "design", "Design", "design-agent", "System design", "Shape roles, workflow, state, memory, controls, handoffs, and escalation."),
    Phase("A3", "build", "Build", "build-agent", "Working agent", "Implement the runnable agent loop, prompts, state, routing, and orchestration."),
    Phase("A4", "equip", "Equip", "equip-agent", "Capability map", "Map tools, data, permissions, context, memory, and integrations."),
    Phase("A5", "evaluate", "Evaluate", "evaluate-agent", "Eval suite", "Prove behavior with scenarios, rubrics, regressions, and safety checks."),
    Phase("A6", "deploy", "Deploy", "deploy-agent", "Release plan", "Release with runtime configuration, identities, approvals, rollback, and verification."),
    Phase("A7", "observe", "Observe", "observe-agent", "Observation plan", "Monitor traces, costs, quality, failures, drift, and outcomes."),
    Phase("A8", "improve", "Improve", "improve-agent", "Improvement backlog", "Turn evidence into prioritized changes to prompts, tools, memory, policies, design, and evals."),
]


TEMPLATES = {
    "maps-scaffold-template.md": "# MAPS Scaffold Template\n\nThis template defines the repeatable repository structure created by `/foundation`.\n\n## Purpose\n\nCreate a MAPS-ready repository with M0-M11 multi-agent phase docs, APS A0-A8 agent phase docs, phase skills, reusable templates, catalogs, and lightweight docs pages.\n\n## Repository Structure\n\n```text\nmaps/\n  README.md\n  LICENSE\n  .gitignore\n  docs/\n    phase0.html\n    phase1.html\n    styles.css\n    maps-manifest.js\n    maps-render.js\n    contributing.md\n  phases/\n    M0-project-foundation.md\n    M1-system-shape.md\n    M2-roster.md\n    M3-contracts.md\n    M4-coordination.md\n    M5-agent-buildout.md\n    M6-capabilities.md\n    M7-orchestration.md\n    M8-experience-design.md\n    M9-evaluate.md\n    M10-deploy-observe.md\n    M11-improve.md\n    A0-phase-alignment.md\n    A1-define.md\n    A2-design.md\n    A3-build.md\n    A4-equip.md\n    A5-evaluate.md\n    A6-deploy.md\n    A7-observe.md\n    A8-improve.md\n  skills/\n    foundation/\n      SKILL.md\n      agents/openai.yaml\n    shape/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-roster/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-contracts/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-coordination/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-buildout/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-capabilities/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-orchestration/\n      SKILL.md\n      agents/openai.yaml\n    design-experience/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-evaluate/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-deploy-observe/\n      SKILL.md\n      agents/openai.yaml\n    multi-agent-improve/\n      SKILL.md\n      agents/openai.yaml\n    phase-alignment/\n      SKILL.md\n      agents/openai.yaml\n    define-agent/\n      SKILL.md\n      agents/openai.yaml\n    design-agent/\n      SKILL.md\n      agents/openai.yaml\n    build-agent/\n      SKILL.md\n      agents/openai.yaml\n    equip-agent/\n      SKILL.md\n      agents/openai.yaml\n    evaluate-agent/\n      SKILL.md\n      agents/openai.yaml\n    deploy-agent/\n      SKILL.md\n      agents/openai.yaml\n    observe-agent/\n      SKILL.md\n      agents/openai.yaml\n    improve-agent/\n      SKILL.md\n      agents/openai.yaml\n  templates/\n    maps-scaffold-template.md\n    phase-alignment-brief.md\n    agent-definition-template.md\n    workflow-spec.md\n    tool-map.md\n    eval-scorecard.md\n    deployment-plan.md\n    observation-report.md\n    improvement-backlog.md\n  catalogs/\n    repos.md\n    skills.md\n    tools.md\n```\n\n## Required Guarantees\n\n- Every MAPS M phase has a phase doc.\n- Every APS A phase has a phase doc.\n- Every generated phase has a `SKILL.md`.\n- Existing scaffold or Foundation artifacts are preserved unless `--force` is explicitly used.\n- Templates are reusable input shells, not completed outputs.\n- Catalogs are present before resources are curated.\n- Docs pages expose the scaffold and current phase resources.\n\n## Instantiation\n\nUse `/foundation` to instantiate this template into a target directory.\n",
    "phase-alignment-brief.md": "# Phase Alignment Brief\n\n## Framework Name\n\n## Purpose\n\n## Audience\n\n## Phase Sequence\n\n```text\nphase alignment -> define -> design -> build -> equip -> evaluate -> deploy -> observe -> improve\n```\n\n## Phase Definitions\n\n| Phase | Purpose | Primary output |\n| --- | --- | --- |\n\n## Repository Or Project Structure\n\n## Naming Decisions\n\n## What Belongs Where\n\n## Open Questions\n\n## Done Criteria\n",
    "agent-definition-template.md": "# Agent Brief\n\n## Name\n\n## Agent Handle\n\n## Role Or Mandate\n\n## User Or Operator\n\n## Job To Be Done\n\n## Desired Outcome\n\n## Persona And Tone\n\n## Authorization Level\n\n## Allowed Without Approval\n\n## Approval Required For\n\n## Forbidden Actions\n\n## Tool Access Requested\n\n## In Scope\n\n## Out Of Scope\n\n## Success Criteria\n\n## Failure Criteria\n\n## Human Escalation Points\n\n## Risks And Assumptions\n",
    "workflow-spec.md": "# Workflow Spec\n\n## System Goal\n\n## Source Brief\n\n`agents/{agent-handle}/agent-brief.md`\n\n## Research Summary\n\n## Comparable Agents Or Patterns Reviewed\n\n| Source or pattern | What it suggests | Fit for this agent | Caveats |\n| --- | --- | --- | --- |\n\n## Recommendation Table\n\n| Design question | Recommendation | Reasoning | User override |\n| --- | --- | --- | --- |\n| Operating model |  |  |  |\n| Roles and responsibilities |  |  |  |\n| Workflow states |  |  |  |\n| Decision points |  |  |  |\n| Memory and context |  |  |  |\n| Tools and integrations |  |  |  |\n| Approval gates |  |  |  |\n| Escalation paths |  |  |  |\n| Failure handling |  |  |  |\n| Observability |  |  |  |\n| Test strategy |  |  |  |\n| Acceptance scenarios |  |  |  |\n| Eval shape |  |  |  |\n| Unit/integration/e2e balance |  |  |  |\n| Mock vs real tool policy |  |  |  |\n| Regression gates |  |  |  |\n\n## Agent Roles\n\n| Role | Responsibility | Inputs | Outputs | Escalates when |\n| --- | --- | --- | --- | --- |\n\n## Workflow\n\n1.\n\n## Decision Points\n\n## State And Memory\n\n## Tools And Integrations\n\n## Guardrails\n\n## Human Approval Gates\n\n## Handoffs\n\n## Failure Modes\n\n## Observability Needs\n\n## Test Strategy\n\n## Acceptance Scenarios\n\n| Scenario | Given | When | Then | Proof method |\n| --- | --- | --- | --- | --- |\n\n## Eval Shape\n\n## Unit Integration E2E Balance\n\n## Mock Vs Real Tool Policy\n\n## Failure Cases\n\n## Regression Gates\n\n## Proof Required Before Phase 3 Build\n\n## Open Questions\n",
    "tool-map.md": "# Tool Map\n\n| Capability | Tool or source | Permission | Used by | Failure behavior |\n| --- | --- | --- | --- | --- |\n\n## Context Sources\n\n## Memory Policy\n\n## Audit Requirements\n\n## Security Notes\n",
    "eval-scorecard.md": "# Eval Scorecard\n\n| Scenario | Expected behavior | Actual behavior | Score | Notes |\n| --- | --- | --- | --- | --- |\n\n## Pass Criteria\n\n## Failure Categories\n\n## Release Recommendation\n",
    "deployment-plan.md": "# Deployment Plan\n\n## Target Environment\n\n## Artifact\n\n## Configuration\n\n## Secrets And Identity\n\n## Release Gates\n\n## Rollback Plan\n\n## Post-Deploy Verification\n\n## Owners\n",
    "observation-report.md": "# Observation Report\n\n## Period Or Trace Set\n\n## Quality Signals\n\n## Cost And Latency\n\n## Tool Use\n\n## Failures And Escalations\n\n## Surprises\n\n## Candidate Improvements\n",
    "improvement-backlog.md": "# Improvement Backlog\n\n| Priority | Evidence | Root cause | Proposed change | Eval coverage | Owner |\n| --- | --- | --- | --- | --- | --- |\n\n## Next Experiment\n\n## Changes To Earlier MAPS Phases\n",
}


def append_missing_lines(path: Path, lines: list[str]) -> bool:
    existing = path.read_text(encoding="utf-8", errors="replace") if path.exists() else ""
    existing_lines = {line.strip() for line in existing.splitlines()}
    missing = [line for line in lines if line.strip() not in existing_lines]
    if not missing:
        return False
    needs_newline = bool(existing) and not existing.endswith("\n")
    with path.open("a", encoding="utf-8") as handle:
        if needs_newline:
            handle.write("\n")
        handle.write("\n".join(missing).rstrip() + "\n")
    return True


def write_file(path: Path, content: str, force: bool, append_lines: list[str] | None = None) -> WriteResult:
    if path.exists() and not force:
        if append_lines and append_missing_lines(path, append_lines):
            return WriteResult(path, "updated")
        return WriteResult(path, "preserved")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")
    return WriteResult(path, "created" if not force else "overwritten")


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
        M0 foundation -> M1 shape -> M2 roster -> M3 contracts -> M4 coordination -> M5 buildout -> M6 capabilities -> M7 orchestration -> M8 experience -> M9 evaluate -> M10 deploy/observe -> M11 improve

        APS child path: A0 alignment -> A1 define -> A2 design -> A3 build -> A4 equip -> A5 evaluate -> A6 deploy -> A7 observe -> A8 improve
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
    foundation/
      SKILL.md</code></pre>
              <h2>Phase 0 Resources</h2>
              <section class="resources">
                <article><h3>Skills</h3><ul data-maps-skills><li><strong>/foundation</strong></li></ul></article>
                <article><h3>Repos</h3><ul data-maps-repos><li>AesopScott/maps-plus-org</li></ul></article>
                <article><h3>Tools</h3><ul data-maps-tools><li>Python</li></ul></article>
                <article><h3>Templates</h3><ul data-maps-templates><li>templates/maps-scaffold-template.md</li><li>templates/phase-alignment-brief.md</li></ul></article>
                <article><h3>Catalogs</h3><ul data-maps-catalogs><li>catalogs/skills.md</li></ul></article>
              </section>
              <h2>Phase Sequence</h2>
              <ol>
                <li>M0 Project Foundation</li>
                <li>M1 System Shape</li>
                <li>M2 Roster</li>
                <li>M3 Contracts</li>
                <li>M4 Coordination</li>
                <li>M5 Agent Buildout</li>
                <li>M6 Capabilities</li>
                <li>M7 Orchestration</li>
                <li>M8 Experience Design</li>
                <li>M9 Evaluate</li>
                <li>M10 Deploy/Observe</li>
                <li>M11 Improve</li>
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
                <article><h3>Repos</h3><ul data-maps-repos><li>AesopScott/maps-plus-org</li></ul></article>
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
            {{ name: "foundation", files: ["SKILL.md", "scripts/create_maps_scaffold.py"] }},
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
            {{ label: "AesopScott/maps-plus-org", url: "https://github.com/AesopScott/maps-plus-org" }},
            {{ label: "VoltAgent/awesome-agent-skills", url: "https://github.com/VoltAgent/awesome-agent-skills" }},
            {{ label: "hqhq1025/skill-optimizer", url: "https://github.com/hqhq1025/skill-optimizer" }}
          ],
          tools: ["Python", "GitHub CLI", "Git", "Agent Skills"],
          phaseResources: {{
            "0": {{
              skills: ["foundation", "phase-alignment"],
              repos: ["AesopScott/maps-plus-org", "VoltAgent/awesome-agent-skills", "hqhq1025/skill-optimizer"],
              tools: ["Python", "GitHub CLI", "Git"],
              templates: ["maps-scaffold-template.md", "phase-alignment-brief.md"],
              catalogs: ["skills.md", "repos.md", "tools.md"]
            }},
            "1": {{
              skills: ["define-agent"],
              repos: ["AesopScott/maps-plus-org"],
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
          fill("[data-maps-skills]", skills, (li, item) => li.append(item.displayName || (item.name === "foundation" ? "/foundation" : item.name)));
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


def build(target: Path, name: str, force: bool) -> list[WriteResult]:
    results: list[WriteResult] = []
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
    append_defaults = {
        ".gitignore": [".DS_Store", "Thumbs.db", "*.tmp", "*.log"],
    }
    for filename, content in files.items():
        path = target / filename
        results.append(write_file(path, content, force, append_defaults.get(filename)))

    for phase in PHASES:
        phase_path = target / "phases" / f"{phase.number}-{phase.slug}.md"
        results.append(write_file(phase_path, phase_doc(phase), force))
        skill_root = target / "skills" / phase.skill
        results.append(write_file(skill_root / "SKILL.md", skill_md(phase), force))
        results.append(write_file(skill_root / "agents" / "openai.yaml", openai_yaml(phase), force))

    for filename, content in TEMPLATES.items():
        path = target / "templates" / filename
        results.append(write_file(path, content, force))
    return results


def foundation_artifacts(target: Path) -> list[Path]:
    candidates = [
        target / "project-foundation.md",
        target / ".maps" / "foundation-preferences.json",
    ]
    return [path for path in candidates if path.exists()]


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a MAPS repository scaffold.")
    parser.add_argument("target", help="Target directory for the scaffold.")
    parser.add_argument("--name", default="MAPS", help="Framework name to use in generated content.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing generated files.")
    args = parser.parse_args()

    target = Path(args.target).expanduser().resolve()
    foundation = foundation_artifacts(target)
    results = build(target, args.name, args.force)
    created = [result.path for result in results if result.status in {"created", "overwritten"}]
    updated = [result.path for result in results if result.status == "updated"]
    preserved = [result.path for result in results if result.status == "preserved"]
    print(f"MAPS scaffold ready: {target}")
    if foundation:
        print(f"Foundation artifacts detected and preserved: {len(foundation)}")
        for path in foundation:
            print(path.relative_to(target).as_posix())
    print(f"Files created or overwritten: {len(created)}")
    for path in created:
        print(path.relative_to(target).as_posix())
    if updated:
        print(f"Files appended without overwrite: {len(updated)}")
        for path in updated:
            print(path.relative_to(target).as_posix())
    if preserved:
        print(f"Existing files preserved: {len(preserved)}")
        for path in preserved:
            print(path.relative_to(target).as_posix())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
