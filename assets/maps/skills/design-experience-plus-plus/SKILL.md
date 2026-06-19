---
name: design-experience-plus-plus
description: Run enhanced MAPS M8 Experience Design for websites, SaaS products, dashboards, landing pages, and agent-facing product surfaces. Use when Codex needs to wrap /design-experience with website design references, component-system choices, accessibility primitives, UX/service-design reasoning, responsive layout, page hierarchy, and production-ready UI handoffs.
---

# Design Experience++

Use `/design-experience++` when the M8 or optional A2 output must drive an actual website, app surface, dashboard, or landing/product page rather than only a generic experience artifact.

## Inputs

- Everything required by `/design-experience`
- Target surface type: marketing site, product website, SaaS app, dashboard, form flow, chat surface, admin tool, or hybrid
- Brand, visual direction, content hierarchy, conversion goal, trust requirements, and platform constraints
- Existing component system or preferred implementation stack, if known

## Reference Stack

- `shadcn-ui/ui` for polished website and product UI composition patterns.
- `radix-ui/primitives` for accessible interaction primitives: dialogs, menus, popovers, tabs, tooltips, accordions, and focus behavior.
- `NN/g Service Blueprints` for keeping website structure grounded in user intent, service flow, trust, evidence, and backstage work.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /design-experience++ --phase M8/A2++ --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Workflow

1. Run the base `/design-experience` workflow first.
2. Classify the surface:
   - marketing or landing page
   - product website
   - SaaS/dashboard
   - agent chat or copilot surface
   - admin/operator tool
   - form or onboarding flow
3. Define the page/screen hierarchy: first viewport, primary action, secondary action, navigation, object model, trust/evidence, and next-step visibility.
4. Map the user/service flow using NN/g-style service blueprint thinking: user action, visible UI behavior, backstage system/agent work, supporting data, evidence, and failure point.
5. Select component patterns from shadcn/ui and Radix:
   - nav, tabs, cards, tables, forms, dialogs, popovers, menus, accordions, tooltips, toasts, command palettes, sheets, and drawers
   - only use components that match the workflow and density of the surface
6. Define responsive behavior across mobile, tablet, and desktop:
   - stable navigation
   - text fitting
   - no overlapping controls
   - preserved primary action
   - appropriate density per viewport
7. Define accessibility and interaction behavior:
   - keyboard paths
   - focus order and focus return
   - semantic labels
   - form errors
   - contrast
   - reduced motion
   - screen reader expectations
8. Specify visual direction without overdecorating:
   - layout rhythm
   - type scale
   - spacing
   - component density
   - imagery/assets
   - tone and microcopy
9. Write or update `experience-design.md` with website-specific sections and handoffs for Build, Evaluate, Deploy/Observe, and Improve.

## Output

- Base M8 `experience-design.md`
- Website/page hierarchy and surface inventory
- Component pattern shortlist
- Responsive layout requirements
- Accessibility and interaction requirements
- User/service blueprint notes
- Build handoff for frontend implementation
- M9 evaluation checks for layout, interaction, accessibility, trust, and conversion/goal completion

## Guardrails

- Do not make a landing page when the user needs an app, tool, game, or workflow surface.
- Do not choose decorative components before the user journey, hierarchy, and service flow are clear.
- Do not use inaccessible custom widgets when Radix or native controls solve the interaction.
- Do not let the page become a generic component gallery. Every component must serve a user action, status, decision, evidence need, or recovery path.
- Do not skip responsive and accessibility requirements; they are part of the M8 artifact, not a build-phase afterthought.
