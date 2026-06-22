# Claude CLI Token Profile

Purpose: reduce avoidable Claude CLI token load by using minimal context for specific work types, regardless of which role is doing the work.

Use this profile when the work is:

- bounded coding or file checks
- scoped code review
- deterministic validation support
- research-adapter work from a queue item
- release or command-risk analysis
- token, log, or session inspection

Do not treat this as a blanket rule for a person or role. Use normal Claude context only when the work genuinely requires broader role memory, skills, MCP/plugin context, long-form collaboration, or interactive exploration.

Default wrapper:

`scripts\invoke-claude-low-token.ps1`

Default behavior:

- safe mode enabled
- low effort
- slash commands disabled unless a named skill is required
- read-only tools by default
- `-AllowEdits` only for approved scoped implementation
- Git, GitHub, web fetch, and web search disallowed unless explicitly approved
- deterministic parsing, tests, token math, and status checks run outside Claude when possible
- no heartbeat envelope, XML wrapper, queue metadata, channel transcript, unrelated role memory, or long transcript sent into Claude
- one bounded Claude call per job when possible

Use `-Bare` only when API-key auth is configured. Otherwise safe mode is the default because it works with local Claude Code login while suppressing customizations, hooks, plugins, MCP, and auto memory.

If a Claude session starts accumulating repeated cache-read usage, stop the loop, preserve evidence, and route the issue to the owner instead of continuing to poll or repair inside the same session.
