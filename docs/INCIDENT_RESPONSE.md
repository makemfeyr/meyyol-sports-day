# Meyyol's Sports Day — Incident Response

**Status:** Phase 1.8 approved response requirements and target runbook, recorded 8 November 2026. Named responders, on-call routing, and response time targets remain open; this is not an implemented incident service.

## 1. Purpose and operating principles

Provide a consistent response to security, privacy, availability, and data-integrity incidents. Protect people and evidence, contain harm, restore safe service, and record follow-up. Do not put secrets, tokens, or unnecessary participant data into incident notes or ordinary logs. Restrict incident records and preserve access history.

Appoint a Security Owner and Backup Security Contact. The Security Owner coordinates policy, risk, vendor, and incident response; the technical team implements containment, fixes, and recovery; school Event Admins handle security operations and access within their schools. Named appointments and escalation routing remain open under OD-25.

## 2. Severity classification

| Severity | Approved examples | Escalation |
|---|---|---|
| **CRITICAL** | Cross-school data exposure; compromised Superadmin account; Audit Trail manipulation. | Escalate immediately to responsible operational personnel. |
| **HIGH** | Compromised Event Admin account; backup/restore failure; participant personal-data exposure. | Escalate immediately to responsible operational personnel. |
| **MEDIUM** | Suspicious access attempts; repeated import failures; limited service disruption without evidence of data exposure. | Record, investigate, and assign follow-up under the operating procedure. |

If impact or scope is uncertain, handle the event at the higher plausible severity while investigating. Do not delay Critical or High escalation while seeking complete certainty.

## 3. Required response stages

Every incident follows these five stages. Critical and High incidents require immediate escalation. Exact elapsed-time targets and on-call routing remain open under OD-20.

### 1. Detection and classification

Receive reports or alerts, record the time and source, identify affected services/data/schools, and assign severity. Determine whether the event involves confidentiality, integrity, availability, credentials, or personal data. Capture only the minimum facts needed.

### 2. Containment

Use the least disruptive effective action to limit exposure or damage. Depending on the incident, suspend compromised accounts and revoke sessions, disable affected credentials, restrict a route/storage object, pause an import/deployment, or take an affected service offline. Preserve Superadmin/school separation and record the actor, action, scope, and time.

### 3. Investigation and evidence preservation

Preserve relevant Security Logs, Audit Trail records, separately protected checkpoint hashes, alert payloads, deployment versions, and provider events with restricted access. Record integrity-verification results and chain-of-custody actions where applicable. Do not edit or delete Audit Trail history to conceal an event. Avoid collecting additional participant data unless needed for the investigation. Treat a chain mismatch or failed verification as a suspected integrity incident; if Audit Trail manipulation is confirmed, classify it as Critical and escalate immediately.

### 4. System recovery

Remove the cause, rotate or revoke affected secrets, restore verified data when required, and validate authorization, RLS, Storage, tenant isolation, and public projections before restoring service. For backup/restore failures, follow the documented Disaster Recovery Plan and record actual recovery against approved RPO/RTO. Do not reopen a path while a Critical/High control failure remains.

### 5. Documentation and preventive action

Record a summary, severity, impact, timeline, decisions, evidence references, containment/recovery actions, notifications considered, root cause when known, and corrective/preventive actions with owners. Review relevant policies, vendor risks, tests, and training after significant incidents. Track actions to closure. Audit Trail records have a minimum two-year retention, Security Logs 12 months, and routine Operational/Diagnostic Logs 90 days, each separate from participant retention. Incident/investigation records may be retained longer under a controlled process; every extension must be audited. Authorization, evidence, review, and disposal details for extensions remain open under OD-17.

## 4. Monitoring signals and escalation

Security monitoring must detect and record:

- Repeated failed logins.
- Suspicious Superadmin or Event Admin activity.
- Cross-tenant access attempts.
- Attempts to modify or delete Audit Trail records.
- Audit Trail hash-chain mismatch or periodic verification failure. Record the event and trigger a security alert.
- Failure to delete temporary CSV files.
- Backup or restore failures.

Critical alerts must reach responsible operational personnel, avoid sensitive details, and trigger escalation and follow-up. Rate-limit login attempts, APIs, sensitive Server Actions, CSV imports, and public page/link access. Hash algorithm, verification/checkpoint cadence, protected checkpoint storage, alert routing, and privileged database-administrator threat model remain technical decisions; do not infer or claim an implementation. Exact thresholds, alert destinations, timings, and response ownership remain open under OD-20/OD-24.

## 5. Privacy, vendors, and external communication

Follow the reviewed Incident & Breach Handling Procedure and applicable legal/privacy advice for any notification decision. This document does not determine statutory deadlines, assert legal approval, or claim PDPA compliance. Coordinate with the relevant school or Meyyol owner for personal-data requests or incidents and record the decision/action. Assess incidents involving third parties against the vendor register and provider escalation process.

## 6. Readiness and review

Before pilot, test one Critical and one High scenario through all five stages. Confirm responsible contacts, alert routing, backup/restore contacts, and evidence handling. Review this runbook at least annually and after significant system/infrastructure changes or serious incidents. Record version, effective date, and reason for changes under the documentation governance policy.

## 7. Related documents

- [Security requirements](SECURITY.md)
- [Testing strategy](TESTING.md)
- [Deployment and environment requirements](DEPLOYMENT.md)
- [Data retention](DATA_RETENTION.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
- [Open decisions](OPEN_DECISIONS.md)
