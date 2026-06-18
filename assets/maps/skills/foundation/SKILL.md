---
name: foundation
description: Start M0 Project Foundation for a MAPS project. Use when kicking off a new agent or multi-agent project, creating the project intent, notes scaffold, source inventory, assumptions, decisions, evidence index, and RAG-readiness plan before system shape or APS phase work begins.
---

# Foundation

Use `/foundation` at M0 to create the project foundation before selecting a system shape, roster, or individual agent build path.

## Workflow

1. Name the project and the customer or operator outcome.
2. Create the working knowledge scaffold:
   - `notes/daily/`
   - `notes/interviews/`
   - `notes/research/`
   - `notes/decisions/`
   - `sources/docs/`
   - `sources/transcripts/`
   - `sources/screenshots/`
   - `memory/project-context.md`
   - `memory/glossary.md`
   - `memory/entity-map.md`
3. Complete `templates/project-foundation.md`.
4. Run EventStorming Lite to expose domain events, triggers, actors, rules, systems, pain points, and open questions.
5. Run Service Blueprint Lite to separate customer/operator actions, visible system behavior, backstage work, supporting data, evidence, and failure points.
6. Log known evidence, assumptions, decisions, open questions, and source gaps.
7. Define what should become retrievable later: source types, metadata, privacy limits, citation needs, and freshness rules.
8. Prepare the M1 handoff:
   - If the system shape is unclear, recommend Scope First.
   - If one coherent agent can own the outcome, recommend Single-Agent / APS.
   - If separate roles, permissions, memory, review, or parallel work are justified, recommend Multi-Agent / MAPS.

## Output

- Completed `project-foundation.md`
- Created notes, sources, and memory scaffold
- Initial source inventory
- Initial evidence index
- EventStorming Lite notes
- Service Blueprint Lite notes
- Initial RAG-readiness plan
- M1 handoff recommendation: Scope First, Single-Agent / APS, or Multi-Agent / MAPS
