# Project Foundation

## Kickoff

Project Intent + Scaffolding Structure, Kickoff.

## Project

- Name:
- Owner:
- Repository:
- Date:
- Project type: MAPS framework / APS project / downstream product or organization
- Primary customer or operator:
- Desired outcome:

## M0 Preflight Decisions

| Decision | Answer | Confirmed by | Notes |
|---|---|---|---|
| RAG exists? |  |  |  |
| Notes location |  |  |  |
| Notes access method | file system / MCP service / REST API / none yet |  |  |
| Additional notes locations |  |  |  |
| RAG provider/location/index |  |  |  |
| RAG access method | file system / MCP service / REST API / none yet |  |  |
| Additional RAG/index locations |  |  |  |
| Canonical store policy |  |  |  |
| Memory root |  |  |  |
| Memory access method | file system / MCP service / REST API |  |  |
| Sources root |  |  |  |
| Sources access method | file system / MCP service / REST API |  |  |
| Reuse remembered defaults? |  |  |  |
| Project identity and type |  |  |  |
| Project intent |  |  |  |
| Primary customer/operator |  |  |  |
| Git initialized or allowed? |  |  |  |
| Git remote exists or should be created? |  |  |  |
| Env/secrets scaffold needed? |  |  |  |
| Local env file approved? |  |  |  |
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
.gitignore
.env.example
optional: .env.local
notes/
  daily/
  interviews/
  research/
  decisions/
sources/
  docs/
  transcripts/
  screenshots/
  links.md
memory/
  project-context.md
  glossary.md
  entity-map.md
```

## Git And Secrets Scaffold

| Item | Status | Notes |
|---|---|---|
| Git repository | not checked / already initialized / initialized by M0 / skipped / blocked |  |
| Git remote | not checked / origin present / connected existing remote / created remote repo / intentionally local / blocked |  |
| `.gitignore` env rules | not checked / present / added by M0 / blocked |  |
| `.env.example` | not checked / present / created by M0 / blocked | Placeholder keys only; no real secrets. |
| `.env.local` | not requested / present / created by M0 / skipped | Ignored local developer secrets file; create only with confirmation. |
| Secrets manager | none yet / local env / platform secrets / external vault |  |

Secret handling rules:

- Never write real secret values into tracked files.
- Keep `.env.example` tracked as the documented template.
- Keep `.env`, `.env.*`, and `*.local` ignored except `.env.example`.
- Record required secrets by name, purpose, owner, and configuration location.

## Incremental Foundation Audit

| Item | Exists? | Action Taken | Still Missing |
|---|---|---|---|
| `project-foundation.md` |  |  |  |
| `.maps/foundation-preferences.json` |  |  |  |
| `.maps/rag-updates.json` |  |  |  |
| Git repository |  |  |  |
| Git remote |  |  |  |
| `.gitignore` env rules |  |  |  |
| `.env.example` |  |  |  |
| Notes scaffold |  |  |  |
| Sources scaffold |  |  |  |
| Memory scaffold |  |  |  |

## Remembered Foundation Preferences

- Preference source:
- Notes root:
- Notes access method:
- Additional notes locations:
- Sources root:
- Sources access method:
- Memory root:
- Memory access method:
- RAG provider:
- RAG location:
- RAG index path:
- RAG access method:
- Additional RAG locations:
- Canonical store policy:
- Global default used?:
- Updated `.maps/foundation-preferences.json`?:

## Persistent Memory Contract

| Store | Type | Location | Purpose | Update trigger | Update method | Sync rule | Canonical? | Do not write |
|---|---|---|---|---|---|---|---|---|
| Project notes | Markdown notes | notes/ | Human-readable working notes, interviews, research, and decisions. | New findings, decisions, assumptions, or research notes. | Append or create dated notes in the appropriate notes folder. | Summaries may be indexed into RAG if approved. | Yes for human decisions. | Secrets, raw private data, unsupported claims. |
| Skill run notes | Markdown notes | notes/maps-runs/[project]-[skill]-helper-notes.md; role-[role-name].md for role entries | One named helper note per MAPS skill, maintained by the shared memory helper. | Every MAPS skill completion. | Append the run summary to the helper note through `maps_memory.py complete-run`. | Mirror to the configured RAG location when available. | Yes for phase summaries. | Raw secrets, large logs, or uncited source dumps. |
| Sources | Source library | sources/ | Original evidence, documents, transcripts, screenshots, and links. | New approved source or changed source. | Add source and update source inventory. | RAG indexes approved sources. | Yes for evidence. | Unapproved, private, or uncited material. |
| Project memory | Markdown memory | memory/ | Durable project context, glossary, and entity map. | Stable project facts, terms, entities, or durable context changes. | Edit the relevant memory file with concise updates. | Keep aligned with notes and source inventory. | Yes for project context. | Temporary scratch notes. |
| RAG index | Retrieval index |  | Queryable project knowledge. | New or changed approved sources or memory. | Re-index changed inputs according to the configured provider. | Mirrors approved sources and selected memory/notes. | No, derived from canonical stores. | Unapproved sources or secrets. |
| RAG update manifest | JSON state | .maps/rag-updates.json | Append-only list of skill notes and memory files that need RAG reindexing. | Every helper-written skill note or RAG mirror. | Append a needsReindex entry through `maps_memory.py complete-run`. | Used by future indexing automation. | No, derived from changed stores. | Long prose or raw evidence. |
| MAPS state | JSON state | .maps/foundation-preferences.json | Remembered scaffold and memory configuration for future skill runs. | Every foundation configuration change. | Structured JSON update. | Reflect important choices in this document. | Yes for automation defaults. | Long prose or raw evidence. |
| Env/secrets template | Text config template | .env.example | Documents required environment variables and secret names without storing secret values. | New integration, provider, model, API, or deployment secret requirement. | Add placeholder names and comments only. | Real values live in ignored local env files or a platform secrets manager. | Yes for secret names, not values. | Secret values, tokens, passwords, private keys. |

## MAPS Skill Run Log

| Timestamp | Skill | Phase | Output | Memory updates | Notes |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

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

- Source types to index:
- Required metadata:
- Privacy or access limits:
- Citation requirements:
- Freshness rules:
- Exclusions:

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
