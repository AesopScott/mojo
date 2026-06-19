# Project Foundation

## Kickoff

M0 Project Foundation for Mojo, the DBA operating company under the Mindshare parent organization.

## Project

- Name: Mojo Mojo
- Owner: Scott Scott
- Repository: C:\Users\scott\Code\mojo C:\Users\scott\Code\mojo
- Date: 2026-06-19 2026-06-19
- Project type: Mojo operating company / MAPS training and agentic systems workspace Mojo operating company / MAPS training and agentic systems workspace
- Primary customer or operator: Scott Scott
- Desired outcome: Maintain Mojo MAPS training, role, memory, and agentic systems artifacts with clear authority gates. Maintain Mojo MAPS training, role, memory, and agentic systems artifacts with clear authority gates.

## M0 Preflight Decisions

| Decision | Answer | Confirmed by | Notes |
|---|---|---|---|
| RAG exists? | Yes, Obsidian by default |  | Confirm or revise. |
| Notes location | G:\My Drive\Mojo |  | Replace `Mojo` with the project name. |
| Notes access method | filesystem |  | Google Drive-backed Obsidian vault. |
| Additional notes locations |  |  |  |
| RAG provider/location/index | Obsidian at G:\My Drive\Mojo |  | No separate vector index by default. |
| RAG access method | filesystem |  |  |
| Additional RAG/index locations |  |  |  |
| Canonical store policy | Obsidian is canonical for project-authored notes, durable memory, and RAG. `.maps` is automation state. |  | Skill outputs should be organized by top-level MAPS skill folders. |
| Memory root | G:\My Drive\Mojo |  | Durable memory files live at project top level by default. |
| Memory access method | filesystem |  |  |
| Sources root | G:\My Drive\Mojo |  | Source material is not separately managed by default. |
| Sources access method | filesystem |  |  |
| Project identity and type |  |  |  |
| Project intent |  |  |  |
| Primary customer/operator |  |  |  |
| Update global living template? |  |  |  |

## Customer Story

- As a:
- I need:
- So I can:

## Current Workflow

- Current process:
- Pain points:
- Workarounds:
- Evidence:

## EventStorming Lite

| Domain event | Trigger or command | Actor | Policy or rule | System/data touched | Pain point | Question |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## Service Blueprint Lite

| Customer/operator action | Visible agent/system action | Backstage process | Supporting system/data | Evidence/source | Failure point |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Product Intent

- Project purpose:
- User value:
- Business or mission value:
- Why agents are appropriate:
- Why multiple agents may be needed:

## Scaffold

Create or confirm:

```text
.maps/
  foundation-preferences.json
  rag-updates.json
G:\My Drive\Mojo\
  foundation/
  shape/
  phase-alignment/
  scaffold/
  define-agent/
  design-agent/
  design-experience/
  design-experience-plus-plus/
  build-agent/
  equip-agent/
  evaluate-agent/
  deploy-agent/
  observe-agent/
  improve-agent/
  project-context.md
  glossary.md
  entity-map.md
```

## Remembered Foundation Preferences

- Preference source:
- Notes root: G:\My Drive\Mojo
- Notes access method: filesystem
- Additional notes locations:
- Sources root: G:\My Drive\Mojo
- Sources access method: filesystem
- Memory root: G:\My Drive\Mojo
- Memory access method: filesystem
- RAG provider: Obsidian
- RAG location: G:\My Drive\Mojo
- RAG index path:
- RAG access method: filesystem
- Additional RAG locations:
- Canonical store policy: Obsidian is canonical for project-authored notes, durable memory, and RAG. MAPS project state in `.maps` is automation state. Project-authored outputs should be organized as top-level folders by MAPS skill slug. Source material is not separately managed by default.
- Global default used?:
- Updated `.maps/foundation-preferences.json`?:

## Persistent Memory Contract

| Store | Type | Location | Purpose | Update trigger | Update method | Sync rule | Canonical? | Do not write |
|---|---|---|---|---|---|---|---|---|
| Obsidian project root | Markdown vault | G:\My Drive\Mojo | Canonical project-authored notes, durable memory, and RAG. | Stable project fact, decision, MAPS phase output, or retrieval-worthy update. | Create or edit Markdown in the appropriate top-level folder. | Treat `.maps` as automation metadata derived from or pointing back to Obsidian. | Yes | Secrets, unsupported claims, or noisy raw logs. |
| MAPS skill folders | Markdown folders | G:\My Drive\Mojo\<skill-slug> | One top-level folder per MAPS skill. | Completion of that MAPS skill phase. | Write the phase artifact and summary into the matching skill folder. | Future helpers should route by skill slug rather than `maps-runs`. | Yes for phase outputs | Mixed-project notes or unrelated scratch work. |
| Project context | Markdown memory | G:\My Drive\Mojo\project-context.md | Stable project facts and operating context. | Durable project context changes. | Append or revise concise Markdown entries. | Keep aligned with foundation and later phase outputs. | Yes | Temporary brainstorms. |
| Glossary | Markdown memory | G:\My Drive\Mojo\glossary.md | Shared terms and definitions. | New stable term or changed definition. | Add or update definitions. | Keep terms consistent across skill outputs. | Yes | Ambiguous terms without context. |
| Entity map | Markdown memory | G:\My Drive\Mojo\entity-map.md | People, projects, systems, and relationships. | New stakeholder, tool, project, or relationship. | Add concise entity entries and links. | Keep synced with child-project foundations. | Yes | Private personal data beyond project needs. |
| Source material | Ordinary Obsidian notes by default | G:\My Drive\Mojo | Raw evidence, docs, transcripts, screenshots, or links when they matter. | A source becomes important to project reasoning. | Capture it where it naturally belongs in Obsidian. Define a source workflow later if needed. | Cite or link source notes from phase outputs. | Yes when captured and cited | Unapproved private material or uncited dumps. |
| RAG | Obsidian | G:\My Drive\Mojo | Queryable project knowledge. | New or changed approved notes or memory. | Use Obsidian as retrieval corpus; future indexes should derive from it. | Derived indexes must point back to Obsidian notes. | Yes for current retrieval corpus | Separate stale indexes without provenance. |
| MAPS state | JSON state | .maps/foundation-preferences.json | Remembered scaffold and memory routing for future skill runs. | Foundation configuration changes. | Structured JSON update. | Reflect important choices in this document and global defaults when approved. | Yes for automation defaults | Long prose or source evidence. |
| RAG update manifest | JSON state | .maps/rag-updates.json | Append-only record of MAPS outputs needing retrieval awareness. | New or changed MAPS phase output. | Append a structured entry. | Future indexing automation may consume it. | No, derived from canonical stores | Long prose or raw evidence. |

## MAPS Skill Run Log

| Timestamp | Skill | Phase | Output | Memory updates | Notes |
|---|---|---|---|---|---|
| 2026-06-19T16:46:29+00:00 | /role | Role | C:\Users\scott\Code\mojo\roles\matt\role-agent.md | Transferred Matt role and durable memory from Mindshare to Mojo at G:\My Drive\Mojo\matt.md; mirrored role/workflow to G:\My Drive\Mojo\role\matt; automations and AGENTS activation remain approval-gated. |  |
| 2026-06-19T16:47:44+00:00 | /role | Role | C:\Users\scott\Code\mojo\roles\matt\role-agent.md | Confirmed Matt role and durable memory transfer into the Mojo memory root G:\My Drive\Mojo; project preferences now route future MAPS helper notes to Mojo; automations and AGENTS activation remain approval-gated. |  |
| 2026-06-19T16:54:33+00:00 | /role | Role | C:\Users\scott\Code\mojo\roles\matt\memory.md | Promoted repo-local role memory to the primary pattern at roles/<role-slug>/memory.md; migrated Matt active memory to C:\Users\scott\Code\mojo\roles\matt\memory.md; updated /role skill v0.14.0 and templates so future roles create repo-local memory.md with optional Obsidian mirrors. |  |
| 2026-06-19T17:11:52+00:00 | /role | Role | C:\Users\scott\.codex\skills\role\SKILL.md | Updated installed /role skill to v0.15.0 so every new role creates or updates a per-role heartbeat automation named <role-slug>-handoff-check with repo-local memory, assigned handoff files, checked-location reporting, quiet no-work behavior, and explicit authority boundaries. |  |
| 2026-06-19T17:54:09+00:00 | /role | Role | C:\Users\scott\.codex\skills\role\SKILL.md | Updated /role skill to v0.16.0 and current role heartbeat automations so Heartbeat and Recruiting use G:\My Drive\Mindshare\channels while Pipeline uses G:\My Drive\Mojo\channels. |  |
| 2026-06-19T18:01:21+00:00 | /role | Role | C:\Users\scott\.codex\skills\role\SKILL.md | Updated /role to v0.17.0: added templates/heartbeat-automation.md, updated memory-template.md and role-agent.md with required memory configuration, and made new role automations derive from the automation template using the split channel map. |  |
| 2026-06-19T18:08:40+00:00 | /design-agent | A2 | C:\Users\scott\.codex\skills\design-agent\SKILL.md | Completed Role As Agent Implementation Confidence Slice 1: updated /design-agent to v0.2.0 so role-to-agent design creates the design contract, runtime contract, build backlog, proof plan, and build gate only; full implementation remains /build-agent, with Equip and Evaluate evidence required for operational confidence. |  |
| 2026-06-19T18:18:12+00:00 | /build-agent | A3 | C:\Users\scott\.codex\skills\build-agent\SKILL.md | Completed Role As Agent Implementation Confidence Slice 2: updated /build-agent to v0.2.0 so role-to-agent builds must read the source role contract, agent profile, design artifact, and backlog before implementation; preserve authority, tools, memory, approvals, activation, forbidden actions, and Role / Role+ / Agent category boundaries; and avoid treating design artifacts as operating authorization. Slice 3 template alignment remains approval-gated. |  |
| 2026-06-19T18:19:56+00:00 | /role | Role | C:\Users\scott\Code\mojo\assets\maps\skills\role\SKILL.md | Updated /role to v0.18.0: Obsidian or notes-root role memory and role contract mirrors are now required and verified before role creation can be reported complete; added Role / Role+ / Agent boundary so heartbeat automation does not imply agent status; synced installed skill and repo assets. |  |
| 2026-06-19T18:29:03+00:00 | /define-agent | A1 | C:\Users\scott\.codex\skills\define-agent\templates\agent-profile-template.md | Completed Role As Agent Implementation Confidence Slice 3 profile template alignment: updated repo and installed agent-profile-template.md copies and /define-agent v0.2.0 so role-agent category, runtime contract, authority domains, memory/state boundaries, approval gates, stop conditions, and proof gates are first-class. |  |
| 2026-06-19T18:29:03+00:00 | /design-agent | A2 | C:\Users\scott\Code\mojo\assets\maps\templates\agent-design.md | Completed Role As Agent Implementation Confidence Slice 3 design/backlog template alignment: added assets/maps/templates/agent-design.md, updated workflow-spec.md and agent-backlog.md so role-agent category, authority, memory/state, stop conditions, runtime target, proof gates, and build gates are first-class; updated /design-agent to v0.3.0 to prefer the agent-design template. |  |
| 2026-06-19T18:43:51+00:00 | /role | Role | C:\Users\scott\.codex\skills\role\SKILL.md | Updated /role to v0.19.0 for Ana-assigned role creation taxonomy and naming work: candidate/draft lifecycle language, one-syllable alternating proper-name default, Communications channel defaults, Mindshare roles-directory memory pointer, heartbeat authority-response language, installed skill files, repo asset copies, and Mindshare fallback memory template. |  |
| 2026-06-19T18:52:58+00:00 | /design-agent | A2 | C:\Users\scott\.codex\skills\design-agent\SKILL.md | Completed Agent Profile Runtime Integration Slice 1: /design-agent v0.3.0 now requires agents/{agent-handle}/agent-profile.md before design, checks design intent against profile limits, restricts profile updates to non-authority-expanding sync fields, treats website profile pages as mirrors only, and agent profile template v0.3.0 adds design/runtime sync, runtime enforcement, profile conflict, and website mirror sync fields. |  |
| 2026-06-19T18:54:55+00:00 | /build-agent | A3 | C:\Users\scott\.codex\skills\build-agent\SKILL.md | Completed Agent Profile Runtime Integration Slice 2: /build-agent v0.3.0 now requires agents/{agent-handle}/agent-profile.md plus agents/{agent-handle}/agent-design.md, fails closed if either is missing or conflicting, treats the profile as the runtime control contract, blocks behavior beyond profile limits, and forbids using website profile pages as behavior input or authority evidence. |  |
| 2026-06-19T18:56:34+00:00 | /evaluate-agent | A5 | C:\Users\scott\.codex\skills\evaluate-agent\SKILL.md | Completed Agent Profile Runtime Integration Slice 3: /evaluate-agent v0.2.0 now requires profile-conformance evaluation for built agents and role-to-agent work, including activation, authority, tools, memory, approvals, stop conditions, voice, handoffs, runtime enforcement, profile-denied behavior refusal/escalation, and website mirror sync. |  |
| 2026-06-19T18:58:46+00:00 | /evaluate-agent | A5 | C:\Users\scott\Code\mojo\assets\maps\scripts\validate_agent_profile_contract.py | Completed Agent Profile Runtime Integration Slice 4: added website profile sync checklist and local validator. Validator checks website profile pages against canonical agents/{agent-handle}/agent-profile.md, requires mirror-boundary terms, flags stale profile fields, rejects forbidden website authority claims, and fails closed when canonical profile or page artifacts are missing. Ana proof run is blocked until C:\Users\scott\Code\mojo\agents\ana-recruiter\agent-profile.md is located or created. |  |
| 2026-06-19T19:00:54+00:00 | /evaluate-agent | A5 | C:\Users\scott\Code\mojo\maps\org-chart\agents\ana-recruiter\index.html | Completed Agent Profile Runtime Integration Slice 5 proof prep: Ana canonical profile exists in Mindshare, Mojo website mirror was corrected to name agent-profile.md and state mirror-only boundary, validator passes against the Mindshare profile and Mojo website page with warnings for blank profile fields. Full /design-agent proof is blocked on whether to run from Mindshare canonical profile or mirror Ana into Mojo first. |  |
| 2026-06-19T19:14:49+00:00 | /evaluate-agent | A5 | C:\Users\scott\Code\mojo\assets\maps\skills\evaluate-agent\SKILL.md | Completed Role As Agent Implementation Confidence Slice 4: /evaluate-agent v0.3.0 now separates Role/Role+/Agent category evidence, executable evidence, specification-mode evidence, and profile conformance; eval-suite and eval-report templates now carry role-agent implementation confidence gates. |  |
| 2026-06-19T20:08:40+00:00 | /role | Role | assets/maps/skills/role/SKILL.md | Updated /role to v0.20.0 with memory-template synchronization: when role-memory updates add or change reusable memory structure, routing, channel, autonomy, or operating requirements, the active memory-template.md must be checked and updated in the same pass. Updated Matt role contract, workflow, active memory, Obsidian mirrors, role memory templates, and live matt-handoff-check automation. |  |
| 2026-06-19T20:14:49+00:00 | /design-agent | A2 | assets/maps/skills/design-agent/SKILL.md | Updated /design-agent to v0.4.0 to restore required voice-profile selection from G:\My Drive\Mindshare\voice-taxonomy.md, keep voice separate from authority/activation/tools/memory/production/spending/secrets/external communication/autonomous runtime, and update agent-design.md with required Voice Profile fields. |  |
| 2026-06-19T20:23:36+00:00 | /build-agent | A3 | assets/maps/skills/build-agent/SKILL.md | Updated /build-agent to v0.4.0 with Build 10/10 proof requirements: runnable command evidence, missing profile/design fail-closed tests, stricter-profile conflict tests, profile-denied behavior tests, audit/state/log artifacts, runtime-adapter proof timing, and Equip/Evaluate handoffs; updated agent-backlog.md with a Build 10/10 Proof Matrix. |  |
| 2026-06-19T20:24:51+00:00 | /role | Role | C:\Users\scott\Code\mojo\roles\bea\role-agent.md | Created Bea / Mojo MAPS Engineer candidate role contract in Mojo with repo-local memory, workflow, loop spec, heartbeat draft, Obsidian mirrors, AGENTS.md invocation rule, Mindshare roles-directory entry, and handoff channel updates. |  |
| 2026-06-19T20:29:09+00:00 | /role | Role | C:\Users\scott\Code\mojo\roles\bea\role-agent.md | Activated Bea / Mojo MAPS Engineer as a bounded Role+ operator in the Bea - Maps Engineer channel; installed bea-handoff-check; updated Mojo role artifacts, Obsidian mirrors, AGENTS.md, Mindshare roles directory, Recruiting, Heartbeat, Pipeline, and Ana memory. |  |
| 2026-06-19T20:34:57+00:00 | /define-agent | A1 | C:\Users\scott\Code\mojo\agents\vik-aspa\agent-brief.md | Created ASPA agent brief and agent profile at agents/vik-aspa from roles/vik/role-agent.md; voice profile set to Strategist 55%, Reviewer 35%, Builder 5%, Operator 5%; profile keeps ASPA human-in-the-loop, not autonomous, with /design-agent as next skill. |  |
| 2026-06-19T20:41:46+00:00 | /role | Role | C:\Users\scott\Code\mojo\maps\org-chart\index.html | Updated Mojo MAPS Management Team structure: Vik is MAPS ASPA and team lead; Matt is MAPS ASPM and reports to Vik; Bea reports to Vik; mirrored role contracts/memories and Obsidian roster/context/channel files. |  |
| 2026-06-19T20:44:44+00:00 | /design-agent | A2 | C:\Users\scott\Code\mojo\agents\vik-aspa\agent-design.md | Created ASPA agent design and backlog at agents/vik-aspa; preserved profile authority boundaries; set profile design sync to in sync and runtime enforcement to design only; runtime target remains undecided, runtime adapter required after selection, and /build-agent is next skill. |  |
| 2026-06-19T20:45:29+00:00 | /role | Role | C:\Users\scott\Code\mojo\assets\maps\skills\role\SKILL.md | Completed operating taxonomy source update: Position -> Operator -> Coordinator -> Executor; Tool -> Tool Agent separate lineage; Role/Role+/Agent retained as compatibility aliases; synced installed /role and MAPS+Org counterparts; updated Mindshare roles directory and Bea memory. |  |
| 2026-06-19T20:49:49+00:00 | /build-agent | A3 | C:\Users\scott\Code\mojo\agents\vik-aspa\agent-build-plan.md | Built ASPA runtime-neutral local proof harness under agents/vik-aspa; added profile/design/backlog loader, CLI run command, fail-closed missing-contract tests, stricter-profile conflict test, profile-denied behavior tests, and audit/state/log artifacts; runtime target remains undecided and adapter proof is deferred to Equip/runtime selection; next skill is /equip-agent. |  |
| 2026-06-19T20:57:58+00:00 | /build-agent | A3 | C:\Users\scott\Code\mojo\assets\maps\skills\build-agent\SKILL.md | Updated /build-agent to v0.5.0 with an explicit Autonomy Contract Gate; synced installed skill; recorded MAPS-007 in maps/backlog.json; MAPS+Org has no build-agent counterpart; validation passed. |  |
| 2026-06-19T21:21:12+00:00 | /build-agent | A3 | C:\Users\scott\Code\mojo\agents\vik-aspa\autonomy-contract.md | Advanced ASPA toward full bounded autonomy with a draft autonomy contract; local build harness now requires the contract and blocks activation while draft-not-approved. |  |
| 2026-06-19T21:41:12+00:00 | /build-agent | A3 | C:\Users\scott\Code\mojo\assets\maps\skills\build-agent\SKILL.md | Updated /build-agent v0.6.0 with input-led autonomy contract interview, one-question-at-a-time rule, R&R gate, ASPA contract reset to input-interview-in-progress, and verified runtime/skill checks. |  |
## Evidence Index

| Evidence | Source | What it supports | Confidence |
|---|---|---|---|
|  |  |  |  |

## Source Inventory

| Source | Type | Location | Owner | RAG ready? | Notes |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Assumptions

| Assumption | Why it matters | How to test | Status |
|---|---|---|---|
|  |  |  |  |

## Decisions

| Decision | Rationale | Date | Owner |
|---|---|---|---|
|  |  |  |  |

## Open Questions

-

## RAG Readiness

- Source types to index: Obsidian Markdown notes, MAPS phase outputs, project-context.md, glossary.md, entity-map.md, and later source notes when defined.
- Required metadata: project name, skill slug, phase, owner, date, source/evidence links, canonical path.
- Privacy or access limits: do not write secrets, raw private data, or uncited dumps into shared retrieval notes.
- Citation requirements: phase outputs should link back to source notes or name the conversation/source that supports claims.
- Freshness rules: update memory when durable facts change; treat `.maps/rag-updates.json` as a reindex/awareness manifest.
- Exclusions: temporary scratch notes, noisy logs, unrelated project material, and separate stale indexes without provenance.

## Next Path

- Scope First:
- Single-Agent / APS:
- Multi-Agent / MAPS:
- Recommendation:

## M1 Handoff Questions

- What is still unknown about the workflow?
- Which actors or jobs are distinct enough to matter?
- Which decisions need review, approval, or escalation?
- Which source/data needs are unclear?
- Which roles need separate tools, permissions, or memory?
- What can run in parallel?
- What failure modes change the system shape?
