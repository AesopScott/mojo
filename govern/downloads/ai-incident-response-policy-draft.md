# Draft AI Incident Response Policy

For: [Agency / Department Name]
Version: 0.1 draft
Effective date: [date]
Policy owner: [role / office]

## 1. Purpose

This policy defines how the agency reports, triages, contains, investigates, communicates, and resolves incidents involving AI systems.

The purpose is to reduce harm, preserve evidence, support accountability, and improve AI systems after problems occur.

## 2. Scope

This policy applies to AI systems used internally, by vendors, or by the public on behalf of the agency.

It applies to pilots, production systems, public-facing tools, and embedded AI features.

## 3. AI Incident Definition

An AI incident is an event where an AI system may have caused or contributed to:

- Harmful, unsafe, discriminatory, or biased output.
- Materially inaccurate output.
- Unauthorized disclosure or use of data.
- Security weakness or misuse.
- Public misinformation or misleading communication.
- Inappropriate automation or overreliance.
- Denial, delay, or unequal access to services.
- Vendor or model change creating unexpected behavior.
- Use outside approved scope.

## 4. Reporting

Staff must report suspected AI incidents promptly through:

- [reporting channel]
- [security/privacy incident channel]
- [GAIN incident record]

Reports should include:

- System name.
- GAIN use case ID.
- Date and time.
- Description.
- People or services affected.
- Prompt/input if available.
- Output if available.
- Screenshots or records.
- Immediate action taken.

## 5. Triage

The incident owner must classify severity:

Low:

- Limited internal issue.
- No sensitive data or public impact.

Moderate:

- Service quality issue, personal data concern, repeated inaccuracies, or affected users.

High:

- Legal rights, benefits, enforcement, safety, sensitive data, discrimination, public harm, or broad service disruption.

## 6. Containment

Possible containment steps:

- Pause the AI feature.
- Disable public access.
- Limit access to approved staff.
- Add human review before output release.
- Roll back a model or configuration change.
- Notify vendor.
- Preserve logs and evidence.
- Stop data flow to the system.

Containment decision:

Owner:

Time:

## 7. Investigation

The investigation should determine:

- What happened.
- What system, model, vendor, data, or workflow was involved.
- Who was affected.
- Whether the use was approved.
- Whether controls failed.
- Whether data was exposed.
- Whether public notice is needed.
- Whether the system can safely continue.

## 8. Communication

Notify the following as appropriate:

- Program owner.
- Technical owner.
- Privacy.
- Security.
- Legal.
- Communications.
- Procurement/vendor manager.
- Executive sponsor.
- Affected users or public.

Public communication should be plain-language, accurate, and coordinated with legal/privacy/security review.

## 9. Evidence Preservation

Preserve:

- Prompts.
- Inputs.
- Outputs.
- Logs.
- Screenshots.
- Model or vendor version.
- Configuration.
- Review notes.
- User reports.
- Vendor communications.
- Containment steps.

## 10. Resolution

Resolution must document:

- Root cause or best current explanation.
- Corrective action.
- Relaunch criteria.
- Monitoring after relaunch.
- Policy or control changes.
- Responsible owner.
- Completion date.

## 11. Post-Incident Review

Moderate and high-severity incidents require a post-incident review.

Review questions:

- What control should have caught this?
- Was risk tiering correct?
- Was human oversight adequate?
- Was vendor information sufficient?
- Does public notice need to change?
- Should the system remain approved?

Findings should be attached to the GAIN record.

