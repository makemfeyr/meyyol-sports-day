# Meyyol's Sports Day — Pilot Readiness Checklist

**Status:** Phase 1.8 readiness checklist template, recorded 8 November 2026. No item is marked complete by this document. Do not use real participant data or activate a pilot until required evidence and approvals are recorded.

## 1. Product and security verification

- [ ] All applicable PRD acceptance criteria AC-01 through AC-82 pass with recorded evidence.
- [ ] Cross-tenant isolation, grants/RLS, role authorization, Storage policies, public projections, and cache invalidation tests pass.
- [ ] MFA is enforced for all Superadmins and Event Admins before any administrative function in every environment, regardless of real-data use; Scorekeeper recommendation is documented; session revocation, global sign-out, timeouts, and sensitive-action re-authentication are tested.
- [ ] Critical and High security vulnerabilities are resolved. Medium and Low findings have documented mitigations and assigned owners.
- [ ] F-12 monitoring signals, critical alert delivery, rate limits, and incident escalation are exercised.
- [ ] Audit Trail records are cryptographically linked and periodic integrity verification is exercised; checkpoint hashes are separately protected; ordinary-role mutation attempts are detected/recorded; mismatch/failure triggers a security alert. Technical algorithm/cadence choices are documented under existing open decisions.
- [ ] Critical and High incident scenarios are tabletop-tested through all five response stages.
- [ ] A pre-pilot Restore Drill recovers the database and important Storage files; relationship consistency, RLS/access controls, and cross-school isolation are verified; outcomes and corrective actions are recorded.
- [ ] The official-results archive preserves only the approved school/event/date/category, participant name, sports house, placing, medal, points, and relevant correction/withdrawal history for at least two years. Participant number and other operational participant fields follow the existing lifecycle unless separately justified and approved. This archive exception does not change event-scoped show_participant_names (OFF by default), public visibility, or public projection rules.
- [ ] Audit Trail retention is at least two years, Security Logs are retained 12 months, and routine Operational/Diagnostic Logs 90 days; all are distinct from participant retention and one another. Incident/investigation extensions use a controlled process and are audited. Scoring snapshots, import audit metadata, source files/diagnostics, and checkpoint hashes follow their separately documented OD-17 treatment; technical logs contain no original CSV content or unnecessary participant personal data.
- [ ] RPO/RTO targets are documented from verified provider capabilities and actual restore performance is recorded.
- [ ] Environment separation, distinct credentials/keys/Storage, secret handling, TLS, at-rest encryption, key controls, CI/CD checks, migration recovery, Production access restrictions, dependency checks, and rollback are verified.

## 2. Privacy, governance, and support

- [ ] Privacy Notice, Terms of Service, Data Retention Policy, Data Access & Disclosure Policy, and Incident & Breach Handling Procedure are provided and reviewed with appropriate legal/privacy stakeholders.
- [ ] No PDPA compliance or legal approval claim is made without the responsible review and evidence.
- [ ] Personal-data request channel is available; identity/authority verification, school-versus-Meyyol responsibility, decision/action recording, and retention/legal constraints are documented.
- [ ] Vendor register is maintained and vendors are assessed for security, privacy, operational suitability, data location, purpose-limited access, outage/breach/discontinuation risk, and participant-data changes.
- [ ] Security policies/procedures have accountable owners, version, approval/effective dates, reason for change, and a controlled storage location accessible only to authorized personnel.
- [ ] Security-document permissions are reviewed; privileged-access changes are recorded; access is revoked when authorization is withdrawn.
- [ ] Repository visibility and access restrictions for security documentation are verified from actual settings/evidence; do not assume the README links establish or satisfy access control.
- [ ] The DATABASE.md data-classification inventory covers every documented MVP data type and its exposure, access, and retention rules; unresolved classifications are assigned to an owner for review.
- [ ] Security Owner and Backup Security Contact are named, available, and have documented responsibilities.
- [ ] Role-specific security guidance is delivered to Superadmins, Event Admins, Scorekeepers, and all registered users before system use.
- [ ] School notices, support contacts, incident reporting route, maintenance communication, and pilot operating procedures are ready.
- [ ] All OD-09 closure evidence is recorded: the five required documents and review, legal/privacy evidence, data-processing and location/region considerations, processor/vendor evidence, applicable pilot checklist items, OD-24 provider evidence, and responsible OD-25 privacy/legal and operational contacts.

## 3. Product-specific operational gates

- [ ] OD-07 public withdrawal notice scope and wording is resolved before public portal acceptance.
- [ ] OD-08 Superadmin operating safeguards are resolved before Superadmin pilot operations.
- [ ] OD-09 pilot privacy and operating choices are resolved, and its closure-evidence list is complete without reopening approved F-12 incident, monitoring, rate-limit, backup/recovery, or Restore Drill requirements.
- [ ] OD-13 Scorekeeper participant field allowlist is resolved before implementing that projection.
- [ ] OD-16 retained-record, backup-copy, and exception coverage is resolved before lifecycle automation or real participant data.
- [ ] OD-17 open details (scoring snapshot/version duration; import audit metadata duration/handling; checkpoint-hash duration; incident/investigation extension procedure; any additional categories) and disposal authority are resolved before retention automation or pilot. The approved Audit Trail two-year minimum, Security Logs 12-month period, and Operational/Diagnostic Logs 90-day period remain unchanged.
- [ ] OD-18 Emergency Recovery operational safeguards are resolved before implementing Emergency Recovery or pilot.
- [ ] OD-19 through OD-25 settings, capabilities, and owners are resolved and verified for the selected operating model.
- [ ] OD-14 and OD-15 are resolved for any CSV import or competition mode that depends on their open behavior.

## 4. Required approvals

- [ ] Superadmin approves platform-level readiness and records approver, date, build/version, evidence references, and conditions.
- [ ] Each participating school's Event Admin confirms that school's operational readiness and records approver, date, evidence references, and conditions.
- [ ] All approval conditions and accepted mitigations have accountable owners and follow-up dates.
- [ ] Pilot scope, participating schools, support coverage, data handling, and stop/rollback authority are documented.

## 5. Pilot decision record

| Field | Record |
|---|---|
| Application/build version | To be completed |
| Environment and provider | To be completed |
| Participating schools | To be completed |
| Open/accepted findings and conditions | To be completed |
| Superadmin platform approver and date | To be completed |
| School Event Admin approvals and dates | To be completed |
| Pilot start authorization | To be completed |

## 6. Related documents

- [Product requirements and acceptance criteria](PRD.md)
- [Testing strategy](TESTING.md)
- [Security requirements](SECURITY.md)
- [Deployment and environment requirements](DEPLOYMENT.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Open decisions](OPEN_DECISIONS.md)
- [F-12 approved baseline](FOUNDER_DECISIONS.md)
