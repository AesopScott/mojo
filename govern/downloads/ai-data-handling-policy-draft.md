# Draft AI Data Handling Policy

For: [Agency / Department Name]
Version: 0.1 draft
Effective date: [date]
Policy owner: [role / office]

## 1. Purpose

This policy defines what data may be used with AI tools and what review is required before data is entered, uploaded, connected, logged, retained, or shared.

The purpose is to protect privacy, security, confidentiality, records obligations, civil rights, and public trust.

## 2. Scope

This policy applies to all AI tools used by staff, contractors, vendors, or systems acting on behalf of the agency.

It applies to:

- Prompts and uploaded files.
- API calls and integrations.
- Retrieval-augmented generation.
- Logs and transcripts.
- Training, tuning, evaluation, and analytics data.
- Public-facing and internal AI systems.

## 3. Data Categories

Public data:

- Information already approved for public release.
- May be used in approved AI tools when output is reviewed.

Internal non-sensitive data:

- Internal working information not intended for public release but not confidential, regulated, or sensitive.
- May require manager or governance review.

Personal information:

- Data that identifies or can reasonably identify a person.
- Requires privacy review before AI use.

Sensitive or regulated data:

- Health, financial, education, criminal justice, benefits, employment, protected class, child, security, or legally restricted data.
- Must not be used in AI tools unless specifically approved.

Confidential, privileged, or investigative data:

- Requires legal and governance approval before any AI use.

Security-sensitive data:

- Passwords, API keys, tokens, secrets, architecture diagrams, vulnerability details, access controls, incident details, or infrastructure configuration.
- Must not be entered into unapproved AI tools.

## 4. Default Rule

Do not enter non-public, personal, confidential, regulated, privileged, or security-sensitive data into an AI tool unless the tool and use case have been approved for that data category.

## 5. Required Data Review

Before using data with an AI system, the team must document:

- Data source.
- Data owner.
- Data category.
- Purpose for using the data.
- Whether data leaves agency control.
- Storage location.
- Retention period.
- Logging behavior.
- Vendor access.
- Whether data is used for model training or improvement.
- Deletion process.

## 6. Data Minimization

AI systems should use the minimum data necessary.

Teams should:

- Remove unnecessary personal information.
- Use synthetic or redacted data when possible.
- Avoid uploading full records when a short excerpt is enough.
- Limit access to approved users.
- Avoid retaining prompts and outputs longer than needed.

## 7. Vendor and Model Training

Agency data must not be used to train, tune, or improve vendor models unless explicitly approved in writing.

Contracts should state:

- Whether vendor training is prohibited or permitted.
- Whether prompts and outputs are retained.
- How data is deleted.
- Who can access data.
- What subprocessors are involved.
- What happens at contract termination.

## 8. Logging and Records

AI prompts, outputs, review notes, and decisions may be public records or agency records.

Teams must follow records retention requirements for:

- Prompts.
- Outputs.
- Human review decisions.
- Public-facing responses.
- Audit logs.
- Incident evidence.

## 9. Security Controls

Approved AI systems should support:

- Access control.
- Authentication.
- Audit logging.
- Encryption in transit and at rest.
- Vendor security review.
- Incident notification.
- Data deletion.
- Least privilege.

## 10. Prohibited Data Uses

Staff may not:

- Paste passwords, keys, tokens, or secrets into AI tools.
- Upload confidential records to unapproved AI tools.
- Use personal data for testing without approval.
- Connect AI systems directly to sensitive databases without review.
- Allow vendor model training on agency data without approval.
- Use AI outputs containing personal information without required review.

## 11. Approval Record

The approved data handling decision must be recorded in GAIN or the agency governance record.

Record:

- Approved data categories.
- Restrictions.
- Required controls.
- Reviewer.
- Approval date.
- Review date.

