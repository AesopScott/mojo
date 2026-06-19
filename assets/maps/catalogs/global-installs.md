# MAPS Global Install Catalog

This catalog defines global repositories, plugins, hooks, vaults, runtime helpers, and session-level capabilities that belong to the MAPS program or MAPS plugin, not to a single project scaffold.

Global installs are part of the MAPS operating environment. They must be documented here before a MAPS skill relies on them.

## Entry Format

| Field | Meaning |
| --- | --- |
| Name | Human name of the global install. |
| Type | Plugin, repo, hook, vault, global skill set, MCP server, runtime helper, or context packet. |
| Scope | All sessions, configured sessions, configured projects, or current machine only. |
| Activation | What causes it to load or run. |
| Storage | Where its durable state, config, or installed files live. |
| MAPS use | How MAPS skills or the MAPS plugin may use it. |
| Boundaries | What MAPS must not assume, read, write, or mutate. |
| Implementation | Markdown contract, installed repo, plugin manifest, hook config, helper script, or external service. |

## Current Global Installs

| Name | Type | Scope | Activation | Storage | MAPS use | Boundaries | Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Obsidianify | Global memory/context packet | Configured projects | Loaded when a project has an Obsidianify packet and the user asks what Obsidian graph memory is loaded or injected. | `.obsidian-memory/STATUS.json` and `.obsidian-memory/CODEX_SESSION_CONTEXT.md` inside the configured project. | MAPS may answer from the packet when explicitly asked about loaded Obsidian graph memory. | Do not inspect unrelated files or Graphify unless the user asks. Do not treat the packet as the MAPS persistent memory contract. | Project packet plus repo/global instructions. |
| Caveman | Global communication and hook layer | Configured sessions | Invoked directly or loaded through global hooks when configured. | `C:\Users\scott\.agents\skills` plus global hook/session configuration. | MAPS may use Caveman communication modes or helper skills when the current session exposes them. | Do not make Caveman a MAPS phase dependency unless the project explicitly requires it. Do not assume all developers have it installed. | Global skills and hook configuration. |
| Graphify | Global knowledge graph and codebase context repo | Configured projects | Invoked when a project needs a generated knowledge graph, graph query, path explanation, or architecture map. | Repo source: `https://github.com/safishamsi/graphify`; project outputs commonly live in `graphify-out/` when generated. | MAPS may use Graphify to understand project structure, relationships, and architecture evidence when the project has opted into graph context. | Do not treat Graphify output as canonical project memory unless M0 records it that way. Do not inspect or regenerate Graphify output for unrelated projects. | Installed repo/package plus generated project graph artifacts. |

## MAPS Rules

- Global installs are not phase skills.
- A MAPS project may depend on a global install only when M0 records that dependency.
- A MAPS skill may reference a global install only when the install is available in the current session or explicitly required by the project.
- Global installs should not be copied into every project by default.
- If a global install changes session behavior, document activation and boundaries here before relying on it in a MAPS workflow.
- If a global install writes durable memory, M0 must define whether that store is canonical, mirrored, derived, or read-only.

## Adding A Global Install

Add a row to `Current Global Installs`, then update the website's Global page and any relevant MAPS skill rule references.

For a new global install, define:

- Install name and source.
- Whether it is a repo, plugin, hook, MCP server, vault, context packet, or helper script.
- Where it is installed.
- How it activates.
- Whether it is required, optional, or project-specific.
- What MAPS may read.
- What MAPS may write.
- What MAPS must never assume or mutate.
