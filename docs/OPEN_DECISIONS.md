# Meyyol's Sports Day — Open Decisions and Recommendations

**Status:** This register contains unresolved Founder choices and operational/technical decisions as of 10 November 2026. It does not amend FD-01 through FD-25. F-12 is a separately approved consolidated baseline, not an FD identifier; recommendations below remain unapproved unless explicitly recorded in FOUNDER_DECISIONS.md.

## 1. Identifier reconciliation and decision history

OD identifiers are preserved and are not reused or silently renumbered. When an approved decision resolves an earlier open item, the earlier OD remains a historical discussion reference; the new canonical approval is recorded under its FD identifier. An earlier recommendation is not retroactively marked approved.

| Existing ID | Prior open item | Decision outcome through Phase 1.8 | Current status / canonical reference |
|---|---|---|---|
| OD-01 | Participant fields and public identity | Field boundaries and separate public-name control are approved. | Resolved by FD-16 for required fields and event-scoped show_participant_names with OFF default; Event Admin setting authority follows FD-02. Exact Scorekeeper field list remains OD-13. |
| OD-02 | CSV template and required columns | One common Meyyol template is approved. | Resolved by FD-17 for the common headers and participant_id exclusion. Encoding, delimiter, limits, and unexpected columns remain OD-14. |
| OD-03 | CSV duplicate policy | Name + number + sports house match fields, manual flagging, no automatic insertion, and partial non-duplicate progress are approved. | Resolved by FD-17 for trimming, case rules, text numbers, leading zeros, and all three optional-number cases. Transport/parser details remain OD-14. |
| OD-04 | Detailed scoring rules | School-wide medal/participation point configuration, no overrides, audit and historical-version preservation are approved. | Partially resolved by FD-24 for individual/team scoring, participation eligibility, and effective dates. Multiple-team, heats/finals, ties, and partial-team behavior remain OD-15. |
| OD-05 | Participant retention, deletion, and anonymization | 90-day active period, approved extension limit/approvals, 90-day restricted recovery, official-results archive including participant-name exception, and results retention floor are approved. | Partially resolved by FD-18 for event-end clock, approved extension timing, early deletion, 90-day recovery, permanent deletion, and the minimum two-year official-results archive. Other retained-record scope/legal exceptions remain OD-16; scoring/import/checkpoint and incident-extension details remain OD-17. |
| OD-06 | School-level role cardinality | One active membership may carry Event Admin and Scorekeeper roles in the same school. | Resolved by FD-19; FD-01 remains canonical for the one-active-membership limit. |
| OD-07 | Public withdrawal notice details | No later approval specifies the exact display scope or wording. | Still open; see section 2. |
| OD-08 | Superadmin operational safeguards | Separation and controlled exceptional access are approved in principle. F-12 now makes MFA mandatory before any Superadmin administrative function; that baseline is not reopened here. | Partially resolved by FD-23. Platform scope and any additional assurance beyond mandatory MFA remain OD-08; Emergency Recovery enforcement safeguards remain OD-18. |
| OD-09 | Pilot privacy and operational readiness | F-12 now supplies the approved baseline for incident severity/stages/escalation, monitoring and rate limiting, backups/recovery, and a mandatory pre-pilot Restore Drill. Pilot-specific privacy/legal review, region/processors, provider evidence, exact settings, and readiness records remain open; see OD-20, OD-21, OD-24, and OD-25. | Still open for pilot-specific matters; the F-12 baseline is approved. |
| OD-10 | Private event mode | Private mode is explicitly deferred; MVP supports Public and Unlisted only. | Resolved as an MVP scope boundary by FD-20. |
| OD-11 | Notification channels | MVP communication is manual and assignments are managed in-app; automated email, push, and in-app notifications are deferred. | Resolved for MVP by FD-21. |
| OD-12 | PDF/CSV exports | Exports are deferred; official published results remain viewable through the public portal. | Resolved for MVP by FD-22. CSV participant import remains in scope. |
| OD-13 | Participant field projections and name control; Phase 1.7 resolution | Per-event show_participant_names, OFF default, and ON/OFF visibility behavior approved. Event Admin authority over the setting follows FD-02. | Partially resolved by FD-16 applied with FD-02; exact Scorekeeper field allowlist remains open. |
| OD-14 | CSV technical contract; Phase 1.7 resolution | Approved headers and normalization/matching cases are in FD-17. | Partially resolved by FD-17; encoding, delimiter, limits, and unexpected-column handling remain open. |
| OD-15 | Scoring rules; Phase 1.7 resolution | Individual/team medal scoring, participation rules/statuses, and effective-date/version behavior approved. | Partially resolved by FD-24; multiple teams, heats/finals, ties, and partial team participation remain open. |
| OD-16 | Retention and deletion; Phase 1.7 resolution | Event-end clock, extension deadline/approval, early deletion, recovery, and terminal deletion approved. | Partially resolved by FD-18; separately retained record/legal/privacy details remain open. |
| OD-17 | Separate retention schedules; partially resolved | Audit Trail minimum two years, Security Logs 12 months, and routine Operational/Diagnostic Logs 90 days are approved and fixed; all remain separate from participant retention. Scoring snapshot/version history, import audit metadata, hash-checkpoint retention, and incident/investigation extensions retain open details. | Remains open under FD-18 and FD-25 for those details; approved log periods are not reopened. |
| OD-18 | Emergency Recovery; Phase 1.7 resolution | Request, approval, data scope, three-day period, extensions up to nine days, and audit obligations approved. | Partially resolved by FD-18, FD-23, and FD-25; operational enforcement and oversight remain open. |

### Phase 1.7 reconciliation of OD-13 through OD-18

| Discussion reference | Canonical FD ID(s) | Current status | Documentation location |
|---|---|---|---|
| OD-13 participant visibility | FD-16, applied with FD-02 | Per-event show_participant_names and false default approved; Event Admin setting authority follows FD-02; exact Scorekeeper field allowlist remains open. | FOUNDER_DECISIONS.md — FD-16; RBAC.md; PRD.md — AC-28/29; OPEN_DECISIONS.md — OD-13 |
| OD-14 CSV contract | FD-17 | Headers and duplicate normalization approved; encoding, delimiter, limits, and unexpected-column handling remain open. | FOUNDER_DECISIONS.md — FD-17; PRD.md — AC-30/32; OPEN_DECISIONS.md — OD-14 |
| OD-15 scoring | FD-24 | Individual/team contributions, participation eligibility, and effective-date behavior approved; listed competition edge cases remain open. | FOUNDER_DECISIONS.md — FD-24; PRD.md — AC-33/34/49–51; OPEN_DECISIONS.md — OD-15 |
| OD-16 participant retention | FD-18 | Active clock, extensions, early deletion, recovery, and terminal deletion approved; retained-record coverage/legal exceptions remain open. | FOUNDER_DECISIONS.md — FD-18; DATA_RETENTION.md; PRD.md — AC-40–44; OPEN_DECISIONS.md — OD-16 |
| OD-17 separate schedules | FD-18, FD-25 | Approved and fixed: Audit Trail minimum two years, Security Logs 12 months, and routine Operational/Diagnostic Logs 90 days, each separate from participant-data retention; incident/investigation records may be extended under a controlled process and every extension is audited. Scoring snapshots/version history and CSV import audit metadata remain separately identifiable; CSV audit metadata excludes original CSV content and unnecessary participant personal data in technical logs. Hash-chain checkpoint hashes are protected/restricted with no approved retention duration. Open: scoring snapshot/version-history duration; import audit metadata duration and handling; checkpoint-hash duration; details of controlled incident/investigation extensions; and any additional requirements not already approved. Do not reopen the approved log periods. | FD-18 and FD-25 approve the log periods and separate treatment; other retention values/details remain open. FOUNDER_DECISIONS.md — FD-18/25; DATA_RETENTION.md; DATABASE.md; OPEN_DECISIONS.md — OD-17 |
| OD-18 Emergency Recovery | FD-18, FD-23, FD-25 | Request, approval, scope, three-day access, up to nine days with extensions, and audit approved; operational safeguards remain open. | FOUNDER_DECISIONS.md — FD-18/23/25; DATA_RETENTION.md; PRD.md — AC-52/53; OPEN_DECISIONS.md — OD-18 |


## 2. Remaining open decisions

| ID | Decision required | Why it matters | Blocks |
|---|---|---|---|
| **OD-07 — Public withdrawal notice** | Confirm the smallest public scope and wording of the under-review notice, such as whether it identifies the competition or house. It must not expose the withdrawn value or private reason. | Defines portal response and privacy expectations. | Portal acceptance and pilot; result state can be modeled earlier. |
| **OD-08 — Superadmin operating safeguards** | Define platform-review data scope and any assurance/step-up controls beyond the mandatory F-12 MFA gate; define how exceptional school-data access is specifically authorized and controlled, monitored, and reviewed. Do not treat this OD as reopening mandatory MFA. | FD-23 prohibits ambient school access but does not define all platform operations or additional safeguards. F-12 fixes the base MFA requirement; platform-specific scope and extra assurance remain undefined. | Superadmin workflows and pilot. |
| **OD-09 — Pilot privacy and operational readiness** | Resolve pilot-specific privacy/legal review, participant/student notices and collection basis, hosting/data processors, data location/region, and other real-data operating evidence. F-12 has already approved incident severity classification and stages, immediate Critical/High escalation, security monitoring signals, rate-limiting and brute-force protection requirements, protected periodic backups, recovery requirements, and a pre-pilot Restore Drill. Exact settings and provider-specific evidence remain under OD-20, OD-21, and OD-24. No PDPA compliance claim is made. | The organization, schools, processors, and data locations for the pilot have not been selected or reviewed. The approved F-12 baseline does not itself supply pilot-specific legal/privacy or provider evidence. | Before real participant data or production pilot; not a blocker to unrelated architecture scaffolding. |
| **OD-13 — Scorekeeper participant field projection** | Specify the exact minimum participant fields visible to Scorekeepers by event/category. Event Admin manages show_participant_names for events in their own school under FD-02; the setting's event scope, false default, and independence from Public/Unlisted visibility are approved under FD-16. | Prevents overexposure while preserving event operations; the exact Scorekeeper field allowlist remains unspecified. | Scorekeeper participant query implementation; public-name setting behavior is approved. |
| **OD-14 — CSV technical details** | Specify accepted encoding, delimiter, size/row limits, and behavior for unexpected columns. FD-17 prohibits supplying participant_id; how an unexpected participant_id column is rejected or reported remains open. Do not change the approved headers or duplicate rules. | These transport/parser details were explicitly not approved. | Full CSV implementation and import tests. |
| **OD-15 — Scoring edge cases** | Decide how multiple teams from one house, heats/finals, tied medal outcomes, and partial team participation affect scoring. Do not change the approved individual/team contribution and participation eligibility rules in FD-24. | These event structures can produce ambiguous award counts. Effective-date and historical-version behavior are already approved and are not open. | Before supporting the affected competition formats; other scoring flows can use FD-24. |
| **OD-16 — Retention scope and exceptions** | Define which operational/personal data and backup copies are covered by permanent deletion, how separately retained records are identified, and how legal/privacy requirements or holds are handled. The 90-day active clock starts on the official Sports Day end date; early deletion and Restricted Recovery follow FD-18. | Prevents deletion of unrelated or protected records and ensures the approved clock is implementable. | Before lifecycle automation or real participant data. |
| **OD-17 — Separate retention schedules** | **Approved and fixed:** Audit Trail minimum two years; Security Logs 12 months; routine Operational/Diagnostic Logs 90 days. Keep all three separate from participant-data retention and from one another. Incident/investigation records may be retained longer under a controlled process; every extension must be audited. Scoring configuration snapshots/version history and CSV import audit metadata remain separate; import audit metadata must not include original CSV content or unnecessary participant personal data in technical logs. Hash-chain checkpoint hashes are protected/restricted; no duration is approved. **Still open:** scoring snapshot/version-history duration; import audit metadata duration, minimum content, access and disposal; checkpoint-hash duration; controlled incident/investigation extension authorization, evidence, review and disposal details; and any additional retention requirements not already approved. Do not reopen the approved 2-year, 12-month, or 90-day log periods. | FD-18/FD-25 approve the log periods and separate treatment; they do not set scoring snapshot, import metadata, checkpoint-hash, or incident-extension details. | Resolve open details before retention automation or pilot; retain the approved periods unchanged. Evidence: approve a category-by-category schedule and access/disposal procedure; verify raw CSV and unnecessary participant data are absent from technical logs; test that extensions are authorized and audited. |
| **OD-18 — Emergency Recovery safeguards** | Define approval evidence, identity/session enforcement, monitoring and oversight, expiry enforcement, revocation, and incident handling for the approved Emergency Recovery request and extension flow. Preserve the approved unchanged scope and maximum nine-day access in FD-18. | Product scope and audit requirements are approved; operational security controls are not. | Before implementing Emergency Recovery and before pilot. |

### OD-09 closure evidence (required before real participant data or production pilot)

**Approved F-12 baseline:** Incident severity/stages and immediate Critical/High escalation, monitoring signals, rate-limiting/brute-force protection, protected periodic backups and recovery, and a pre-pilot Restore Drill are approved requirements. OD-09 does not reopen these requirements or substitute a new control value.

**Documents to deliver and review:**

1. Prepare and review the Privacy Notice.
2. Prepare and review the Terms of Service.
3. Prepare and review the Data Retention Policy.
4. Prepare and review the Data Access & Disclosure Policy.
5. Prepare and review the Incident & Breach Handling Procedure.

**Evidence to gather and verify:**

6. Record appropriate legal/privacy review evidence and follow-up actions; do not claim legal approval or PDPA compliance without evidence.
7. Document data-processing purposes/flows and data-location/region considerations.
8. Document third-party processors and relevant vendor security/privacy/operational evidence.
9. Verify and record closure of applicable pilot privacy and operational checklist items.
10. Reference outstanding provider capability/configuration evidence under OD-24 and retain the verified evidence before pilot.
11. Identify responsible privacy/legal and operational contacts through OD-25 where applicable.

These documents and records provide OD-09 closure evidence; the provider selections and unassigned operational details remain governed by OD-24 and OD-25.

### F-12 unresolved operational and technical decisions

F-12 approves the required control outcomes in FOUNDER_DECISIONS.md. The items below select implementation settings, verify provider capabilities, or assign operational ownership; they are not new Founder Decision IDs or permission to weaken the approved controls.

| ID | Approved requirement (fixed) | Still undecided and why | Dependency and gate (implementation / pilot) | Evidence needed to close |
|---|---|---|---|---|
| **OD-19 — Identity and session settings** | MFA remains mandatory for all Superadmins and Event Admins before any administrative function in every environment. The approved session-revocation, global sign-out, timeout, re-authentication, account-review, and event-recording outcomes also remain fixed. | MFA methods/enrollment/recovery, timeout values, absolute session lifetime, sensitive-action list, and review cadence are technical/operational selections because the auth provider's supported workflows and session design have not yet been evaluated and selected; they are not permission to defer or weaken MFA. | Blocks final authentication/session configuration; pilot approval also requires verified MFA before any administrative access and tests of session revocation and re-authentication. | Record selected methods, enrollment/recovery, timeout/action/review settings; demonstrate access is denied without required MFA and test the approved session controls. |
| **OD-20 — Monitoring, abuse controls, and incident operations** | F-12 monitoring signals, required rate-limited surfaces, detection/recording, critical alerts without sensitive details, and immediate Critical/High escalation remain mandatory. The approved Audit Trail principles also remain fixed: cryptographic record-to-predecessor linking, periodic verification, separately protected checkpoint hashes, detection/recording of mutation attempts, and alerts on mismatch/failure. | Select thresholds/durations, suspicious-activity criteria, account/IP/school context, lockout/delay behavior, restriction-event logging, alert channels/routes, and on-call timing. Technical integrity settings also remain open: hash algorithm, verification/checkpoint frequency, protected checkpoint storage mechanism, and privileged database-administrator threat model. These settings depend on threat analysis and operational/provider design. | Blocks production monitoring, alerting, rate-limit configuration, and final Audit Trail integrity verification design; pilot requires demonstrated monitoring, alerts, limits, and incident escalation. | Approve a configuration and signal catalogue; test all F-12 signals, restriction logging, alert delivery, rate limits, periodic verification, checkpoint protection, and response routing. No numerical values are supplied here. |
| **OD-21 — Backup and disaster recovery targets** | Periodic database backups, protection for important Storage, encrypted/restricted backup access, a DR plan, pre-pilot and periodic Restore Drills, recovery checks, records, and measured RPO/RTO remain mandatory. | Frequency, retention, region, drill cadence, provider capabilities, and numerical RPO/RTO are not chosen because they depend on the selected service and verified recovery behavior. | Blocks backup/recovery configuration; pilot and real participant data require a successful pre-pilot Restore Drill and documented, provider-supported targets. | Record verified provider capabilities, selected schedule/region/retention/targets, a completed drill report, measured recovery, and corrective actions. |
| **OD-22 — Availability and maintenance operations** | Availability monitoring, outage investigation/post-checks, scheduled maintenance documentation/advance notice, and urgent maintenance for critical security issues remain required; no numerical uptime SLA is approved. | Monitoring thresholds, notice timing, service targets, outage ownership, and operational arrangements are unselected because no provider/service model or service-level target has been approved. | Blocks final availability/maintenance procedures and pilot operating model; does not block unrelated product scaffolding. | Document operating owner, monitoring/notice procedure, any approved service target, and a demonstrated outage/post-recovery check. Do not infer an uptime SLA. |
| **OD-23 — Deployment and vulnerability management** | Separate environments, required pre-production testing, deployment checks, versioned/tested migrations with recovery strategy, restricted Production access, dependency checks, critical-patch prioritization, rollback plans, and vulnerability tracking remain required. | Select CI/CD checks, dependency tooling/cadence, remediation deadlines, definition of high-risk change, migration recovery mechanics, authorized Production roster, and rollback triggers. These depend on the selected delivery and operating model. | Blocks the Production pipeline and vulnerability/maintenance configuration; pilot requires exercised deployment checks, migration recovery, access restriction, and rollback evidence. | Approve pipeline/checks, dependency schedule and owners, patch policy, risk criteria, Production roster, and tested rollback/recovery evidence. |
| **OD-24 — Provider security and cryptographic operations** | TLS, at-rest encryption for database/backups/Storage, protected temporary CSV handling, restricted key access, key revocation/rotation, and environment separation remain required; do not claim unverified provider capabilities. | Select/verify provider features, key-management procedures, infrastructure settings, and external checkpoint storage/backup arrangement. These depend on provider documentation and configuration review. | Blocks provider/environment selection and secure Production configuration; pilot requires verifiable evidence of each required protection. | Retain provider documentation and configuration evidence, key access/revocation/rotation procedures, and tests for transport, storage, temporary files, and protected checkpoints. |
| **OD-25 — Privacy and security governance operations** | Required privacy/legal documents and review, verified data-request handling, vendor assessment, restricted security-document access, role-based training, annual/event-triggered policy review, and named Security Owner/Backup responsibilities remain approved outcomes. | Names, accountable reviewers, request routing, vendor register/process, training evidence, document effective dates, and access-control mechanism are unassigned because operational owners and the pilot organization are not yet identified. Repository permissions have not been verified. | Blocks owner-dependent procedures and pilot approval; does not reopen the approved requirements. | Record named owners/reviewers, required policy artifacts and review evidence, tested request routing, vendor register, training completion, document version/effective date, access-review/revocation records, and repository-access verification. |

These OD-19–OD-25 values and assignments do not replace F-12 requirements. If a target cannot be met with the selected provider or operating model, the pilot remains blocked until the Founder approves a compliant alternative.

## 3. Implementation and pilot gates

| Gate | Decisions | Required before |
|---|---|---|
| Participant/public access design | OD-13 | Scorekeeper participant projection; public-name behavior and Event Admin setting authority follow FD-16/FD-02 |
| CSV import contract | OD-14 | Complete CSV import behavior and acceptance tests |
| Scoring | OD-15 | Scoring schema, calculations, and production leaderboard behavior |
| Retention/recovery | OD-16, OD-17, OD-18, OD-21 | Automated lifecycle/recovery and real participant data |
| Public withdrawal response | OD-07 | Public portal acceptance |
| Platform administration | OD-08 | Superadmin operational workflows |
| Authentication and session controls | OD-19 | Mandatory MFA before any administrative function; final technical settings and pilot verification |
| Monitoring and incident response | OD-20 | Production operations and pilot |
| Backup and disaster recovery | OD-21 | Real participant data and pilot |
| Availability and maintenance | OD-22 | Pilot operating model |
| Deployment and vulnerabilities | OD-23 | Production deployments and pilot |
| Provider encryption and key security | OD-24 | Real participant data and pilot |
| Privacy and security governance | OD-25 | Real participant data and pilot |
| Pilot readiness | OD-09, OD-19–OD-25 | Real-data pilot or production use |

Some scaffolding may proceed in Phase 2 while a gate is open, but do not implement an unapproved default for the affected behavior. AC-28 through AC-34, AC-40 through AC-53, and AC-54 through AC-82 identify the related dependencies in PRD.md. Items marked for pilot remain hard readiness gates even if code can be developed earlier.

## 4. Technical recommendations requiring review

These are not Founder approvals. Validate each against the selected Supabase/PostgreSQL/Next.js versions and actual requirements before implementation.

| ID | Recommendation | Reason and trade-off |
|---|---|---|
| TR-01 | Use school-aware composite foreign keys for tenant-owned parent/child relationships; store school_id directly on sensitive/high-volume rows where it makes ownership and policy checks clearer. | Reduces cross-school references and simplifies policy predicates, with some redundant columns. |
| TR-02 | Keep result revisions, publication history, and audit logs append-only for application roles, with current result state stored separately. | Preserves traceable history; privileged database owners still require operational safeguards. |
| TR-03 | Use immutable scoring configuration versions and preserve the applied version/outcome on published results. | Supports FD-24; unresolved event-format edge cases remain under OD-15. Version/effective-date behavior is approved. |
| TR-04 | Use a sanitized public projection rather than granting anonymous reads to participant or management tables. | Limits public fields; creates a projection and invalidation responsibility. |
| TR-05 | Keep private data request-scoped and uncached. Cache only sanitized public data by event/version, with tested immediate withdrawal behavior. | Reduces cross-user leakage; deployment/CDN invalidation must be verified. |
| TR-06 | Model competition entries separately from participants and results if the approved format needs individual/team/house entries. | Avoids embedding participant data in public results; adds entities and depends on OD-15. |
| TR-07 | Use narrow server authorization and RLS with least-privilege grants; do not use service-role access for routine user requests. | Preserves user identity at the database boundary. |
| TR-08 | Keep import batch summaries and row diagnostics separate from participant records and retain only what is needed. | Supports review while limiting duplicate student-data copies; retention duration is OD-17. |
| TR-09 | Choose data region, backup schedule, RPO/RTO, restore-test cadence, rate limits, and incident escalation before production. | Operationally necessary for pilot/production; not required for early domain scaffolding. |
| TR-10 | Verify the current Supabase SSR package/API and pin a reviewed version during implementation. | Supabase currently documents @supabase/ssr as beta; APIs may change. This repo has not added the package. |
| TR-11 | If a PostgreSQL view is used for public results, use a supported security-invoker design or restrict the view to a non-exposed schema and deny unintended grants. | Views execute with owner privileges by default and may bypass underlying-table RLS. |
| TR-12 | Give each multi-record privileged operation one validated database transaction boundary; do not assume multiple HTTP requests are atomic. | Keeps state, revision/publication, and audit records consistent. RPC is one possible approach, not an approved implementation choice. |

## 5. Privacy and compliance note

The architecture specifies requirements but does not claim PDPA compliance or legal sufficiency. Before the pilot, the responsible organization should review participant/student data collection, purpose, notices, access, retention, deletion, hosting region, vendors, backups, and incident response with appropriate privacy and legal stakeholders.

## 6. Related documents

- [Product requirements](PRD.md)
- [Architecture](ARCHITECTURE.md)
- [Conceptual database design](DATABASE.md)
- [Roles and authorization](RBAC.md)
- [Security requirements](SECURITY.md)
- [Data retention](DATA_RETENTION.md)
- [Approved Founder Decisions](FOUNDER_DECISIONS.md)
- [Testing strategy and pre-pilot security tests](TESTING.md)
- [Deployment and environment requirements](DEPLOYMENT.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
- [Documentation change history](CHANGELOG.md)

## 7. Historical snapshot of OD-01 through OD-12 before Phase 1.6

The following records the original open-item descriptions, recommendations, and blocker assessments from the prior version of this register. They are preserved for decision history only. The recommendations were not approved. The current status and canonical approvals are in sections 1 and 2 above.

| ID | Original open-item description | Original recommendation (not approved) | Prior blocker assessment |
|---|---|---|---|
| OD-01 | Participant fields and public identity; schema, CSV template, privacy exposure, and result display depended on what identifies a participant. | Start with only fields required to manage an event, such as display name, house, and optional school-managed identifier. Keep roster data private. Make participant-name publication an explicit, minimal choice after privacy review. | Yes for participant schema and pilot imports. |
| OD-02 | CSV template and required columns; imports needed stable headers, data types, and row-level validation. | Version a downloadable template. Confirm required fields after OD-01; publish accepted encoding, size/row limits, and error format. Preview normalized values before confirmation. | Yes for CSV implementation. |
| OD-03 | CSV duplicate policy; FD-12 required duplicate detection but did not specify reject, skip, merge, or update behavior. | Detect exact and likely duplicates, show them separately in preview, and require an explicit user choice. Do not silently merge. Use a stable school-managed identifier if approved; otherwise warn that name matching is ambiguous. | Yes for finalizing import behavior. |
| OD-04 | Detailed scoring rules; point values, medal mapping, event weighting, team results, and configuration effective timing were undefined. | Version immutable configuration snapshots and save the applied version and awarded outcome at publication. Apply a new configuration to later results only by default. Define a school-level rule set that supports the approved tie-break order. | Yes for scoring schema and leaderboard implementation. |
| OD-05 | Participant retention, deletion, and anonymization; student information needed a lifecycle affecting application behavior, backups, and audit history. | Agree retention by data type before pilot. Provide a school-admin initiated deletion/anonymization process that preserves required result/audit integrity while removing unnecessary identity. Do not hard-code an arbitrary period. | Not necessarily for early scaffolding; yes before real participant data or pilot. |
| OD-06 | School-level role cardinality; FD-01 limited membership count but did not say whether one membership could combine Event Admin and Scorekeeper roles. | Use one school-level role per membership for MVP, with Superadmin separate; confirm whether dual local roles are needed before freezing membership design. | Yes for final RBAC schema. |
| OD-07 | Public withdrawal notice details; FD-11 required a notice but not its display scope or wording. | Show a neutral notice at the smallest useful public scope, such as the affected competition, without showing the withdrawn value or private reason. Do not reveal participant identity unless separately approved. | Yes for portal acceptance and privacy review; result state could be modeled earlier. |
| OD-08 | Superadmin operational safeguards; platform application review was approved, but platform-data scope and elevated-account controls were undefined. | Require strong authentication, least-privilege platform grants, audit of platform actions, and no ambient school-data access. Use a documented, time-bound approval process for exceptional support access. | Yes before Superadmin workflows or production pilot. |
| OD-09 | Pilot privacy and operational readiness; region, notices, retention controls, incident handling, backups, and recovery objectives were unselected. | Complete a participant/student privacy review; document data flows and processors; confirm notices and collection basis with the responsible organization; decide region; set tested backup/restore and incident procedures. | Yes before real participant data; recovery targets before pilot. |
| OD-10 | Private event mode; some schools might later need authenticated or invite-only events beyond Public and Unlisted. | Defer. Treat Unlisted links as shareable and suitable only for information approved for public access. Add private mode only with a separately designed authorization model. | No for MVP; needed before confidential-event use. |
| OD-11 | Notifications; approval, assignment, invitation, and result updates might need email or in-app notifications. | Keep delivery out of core authorization/result transactions. For pilot, use a selected manual communication process if acceptable; decide automated channels after validating workflow needs. | No for core domain implementation; could block operational onboarding if automated invitations are required. |
| OD-12 | PDF and Excel exports; formats, scope, and private-data handling were undefined. | Defer until post-pilot demand is known. If later approved, apply authorization and field minimization; include spreadsheet formula-injection and file-retention requirements. | No for MVP. |



## 8. Historical snapshot of OD-13 through OD-18 before Phase 1.7

This snapshot preserves the prior Phase 1.6 open-item meanings and blocker assessments. It is historical only; use the current reconciliation and section 2 for the remaining status. Recommendations and proposed timing below were not approvals.

| ID | Prior open-item meaning | Prior blocker assessment |
|---|---|---|
| OD-13 | Exact minimum participant fields visible to Scorekeepers, public-name control scope/default, and which role could change the control were unspecified. | Blocked Scorekeeper participant projections and public-name display. |
| OD-14 | Exact standard template headers/version, encoding, size/row limits, normalization, blank optional-number matching, and per-row versus batch review behavior were unspecified. | Blocked complete CSV import behavior and acceptance tests. |
| OD-15 | Point placements, medals, participation rules, event formats, within-event ties, and scoring-version effective timing were unresolved. | Blocked scoring schema, calculations, and production leaderboard behavior. |
| OD-16 | Retention clock start, early-deletion handling, extension timing, post-recovery disposition, recovery scope, and result/participant identity relation were unresolved. | Blocked retention automation and real participant data. |
| OD-17 | Separate durations/access controls for audit/security logs, scoring configuration versions, import diagnostics, and legal holds were unresolved. | Blocked retention automation and pilot/production policy. |
| OD-18 | Emergency Recovery approval evidence, recovered data scope, allowed users, access period, extension rules, monitoring, and revocation safeguards were unspecified. | Blocked Emergency Recovery implementation and pilot. |
