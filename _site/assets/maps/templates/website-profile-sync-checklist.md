# Website Profile Sync Checklist

Template version: 0.1.0.

## Purpose

Use this checklist when an agent has both `agents/{agent-handle}/agent-profile.md` and a visible website profile page.

The website profile page is a mirror only. Authority comes from Scott's approvals and project artifacts, especially `agent-profile.md`, not from the website page.

## Source Artifacts

- Agent handle: {{agent_handle}}
- Agent profile: `agents/{{agent_handle}}/agent-profile.md`
- Agent design: `agents/{{agent_handle}}/agent-design.md`
- Website profile page: `maps/org-chart/agents/{{agent_handle}}/index.html`
- Last checked:
- Checked by:

## Required Mirror Boundary

- [ ] Website page states that it is a mirror only.
- [ ] Website page does not claim to grant authority, activation, tool access, memory rights, production access, external communication, spending, or autonomous runtime.
- [ ] Website page links or names the canonical profile artifact.

## Profile Fields To Compare

- [ ] Agent name and handle match.
- [ ] Source role and source artifacts match.
- [ ] Profile status matches.
- [ ] Role-Agent category matches.
- [ ] Activation status matches.
- [ ] Authority level and approval gates match.
- [ ] Voice profile matches and is stated as non-authority expression only.
- [ ] Tool access summary matches.
- [ ] Memory rights summary matches.
- [ ] Stop conditions or escalation summary matches.
- [ ] Runtime enforcement status matches.
- [ ] Next MAPS skill matches.
- [ ] Website mirror sync status in the profile is current.

## Drift Findings

| Field | Profile value | Website value | Status | Fix owner |
| --- | --- | --- | --- | --- |
| | | | | |

## Result

Mirror status: in sync / sync needed / stale / blocked.

Release boundary:

- [ ] No production publish is authorized by this checklist.
- [ ] Any publish, deploy, runtime activation, external communication, spending, or authority expansion still requires the named approval gate.
