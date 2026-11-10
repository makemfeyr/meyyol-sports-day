# Meyyol's Sports Day — Approved Founder Decisions

**Status:** FD-01 through FD-25 remain the canonical Founder Decision identifiers. The Founder approved the consolidated F-12 Operational Security & Readiness baseline on 8 November 2026. The previously approved FD-18 retention scope was documented more explicitly on 10 November 2026; this creates no new decision or approval.\
**Authority:** FD-01 through FD-14 preserve the previously recorded approvals. FD-15 through FD-25 record the additional approvals from Phase 1.6. Phase 1.7 refines FD-16, FD-17, FD-18, FD-23, FD-24, and FD-25. F-12 is a cross-cutting approval reference, not a new FD identifier; it supplements relevant existing decisions without renumbering or replacing them. Recommendations in OPEN_DECISIONS.md are not approvals.

This register records product decisions only. Technical implications are guidance and do not approve a particular implementation. Canonical FD identifiers are stable; earlier OD identifiers are retained as historical discussion references in the reconciliation table below.

## 1. Identifier reconciliation

The existing OD identifiers are not renumbered. Where an open item has since been approved, its OD identifier remains a traceable source reference and its current status is shown here and in OPEN_DECISIONS.md.

| Existing identifier | Existing record / status before Phase 1.6 | Conflict or reconciliation | Canonical FD ID / current status |
|---|---|---|---|
| FD-01 | One active school membership per user; approved | Preserved. The additional approved role-combination rule clarifies that one membership can hold both local roles. | FD-01, supplemented by FD-19 |
| FD-04 | Public and Unlisted visibility; approved | Preserved. Private mode is explicitly deferred for MVP. | FD-04, supplemented by FD-20 |
| FD-05 | Platform authority separated from school membership; approved | Preserved. The added safeguard clarifies exceptional school-data access must be specifically authorized, controlled, and audited. | FD-05, supplemented by FD-23 |
| FD-12 | Participant entry and CSV import; approved; duplicate policy open | Preserved. The approved template and duplicate policy are captured as a supplement. | FD-12, supplemented by FD-17 |
| FD-13 | One school-wide scoring configuration; approved | Preserved. Editable point types and per-result configuration snapshots are added as explicit detail. | FD-13, supplemented by FD-24 |
| FD-01–FD-14 | Fourteen approved decisions in the prior register | No prior FD identifier is reused or renumbered. | FD-01–FD-14 remain canonical |
| OD-01 | Participant fields and public identity; open | Required/conditional fields and the event-scoped show_participant_names control with false default are approved. Event Admin control of the setting follows FD-02; the exact Scorekeeper field list remains open under OD-13. | FD-16, applied with FD-02 |
| OD-02 | CSV template and required columns; open | Common headers and participant_id exclusion are approved. Encoding, delimiter, file limits, and unexpected-column behavior remain under OD-14. | FD-17 |
| OD-03 | CSV duplicate policy; open | Approved normalization and optional-number matching cases resolve the policy. Transport/parser details remain under OD-14. | FD-17 |
| OD-04 | Detailed scoring rules; open | Individual/team medal scoring, participation eligibility, and version/effective-date behavior are approved. Multiple-team, heat/final, tie, and partial-team cases remain under OD-15. | FD-24 |
| OD-05 | Participant retention and deletion; open | Clock start, extension timing, early deletion, Restricted Recovery, terminal deletion, and the official-results participant-name exception are approved. Other separately retained-record coverage/legal exceptions and separate schedules remain under OD-16/OD-17. | FD-18 |
| OD-06 | School-level role cardinality; open | One active membership can carry both Event Admin and Scorekeeper roles within that school. | FD-19 |
| OD-07 | Public withdrawal notice detail; open | No conflict; this remains open. | None; remains OD-07 |
| OD-08 | Superadmin safeguards; open | Platform/school separation and Emergency Recovery oversight are approved. Broader platform scope/authentication remains OD-08; recovery enforcement remains OD-18. | FD-23 |
| OD-09 | Pilot privacy and operations; open | F-12 supplies the approved incident, monitoring, backup/recovery, and Restore Drill baseline; pilot-specific privacy/legal review, region/processors, provider evidence, and readiness records remain open. | None; remains OD-09 |
| OD-10 | Private event mode; open / deferred | Private mode is explicitly out of MVP. Preserve OD-10 as its discussion reference and record the approved scope boundary. | FD-20 |
| OD-11 | Notification channels; open | Manual communication and in-app assignment management are approved for MVP; automated notifications are deferred. | FD-21 |
| OD-12 | CSV/PDF exports; open | CSV/PDF export is deferred; published results remain viewable in the public portal. | FD-22 |
| OD-13 | Participant-name control and Scorekeeper participant fields; partially resolved in Phase 1.7 | Per-event show_participant_names=false default and ON/OFF behavior are approved in Phase 1.7. Event Admin authority over this own-school event setting follows FD-02. Exact Scorekeeper field allowlist remains open. | FD-16 applied with FD-02; OD-13 remains partial |
| OD-14 | CSV technical contract; partially resolved in Phase 1.7 | Headers, generated-ID exclusion, trimming, case normalization, text numbers, leading-zero preservation, and duplicate cases are approved. Encoding, delimiter, limits, and unexpected-column handling remain open. | FD-17; OD-14 remains partial |
| OD-15 | Scoring schedule and edge cases; partially resolved in Phase 1.7 | Individual/team medal awards, participation eligibility, and approved version/effective-date behavior are specified. Multiple teams, heats/finals, ties, and partial team participation remain open. | FD-24; OD-15 remains partial |
| OD-16 | Participant retention and deletion; partially resolved in Phase 1.7 | Event-end clock start, extension timing, no-approval early deletion, recovery period, and terminal deletion are approved. Scope of separately retained/legal records remains open. | FD-18; OD-16 remains partial |
| OD-17 | Separate retention schedules; partially resolved | Audit Trail (minimum two years), Security Logs (12 months), and routine Operational/Diagnostic Logs (90 days) have approved periods separate from participant retention. Scoring snapshot, import audit metadata, checkpoint-hash, and incident/investigation extension details remain open. | FD-18 and FD-25; OD-17 remains open for listed details |
| OD-18 | Emergency Recovery safeguards; partially resolved in Phase 1.7 | Request/reason, approval, limited scope, three-day access, two possible extensions, and audit requirements are approved. Detailed operational enforcement/oversight remains open. | FD-18, FD-23, and FD-25; OD-18 remains partial |

## 2. Previously approved decisions

### FD-01 — One active school membership

**Status:** APPROVED\
**Decision:** One user can have only one active school membership in the MVP.\
**Architectural implication:** Enforce one active school membership per user across all schools. Platform-admin status is separate. FD-19 clarifies that the single membership may carry both approved school roles.

### FD-02 — Event Admin authority

**Status:** APPROVED\
**Decision:** Event Admin has full management access within their own school.\
**Architectural implication:** All Event Admin operations require the user's active membership and are limited to that school.

### FD-03 — Result publication

**Status:** APPROVED\
**Decision:** Results may be published by an Event Admin or by a Scorekeeper who has explicit publishing permission.\
**Architectural implication:** Publication checks Event Admin authority or the applicable event assignment's can_publish_results permission. Score entry does not imply publication.

### FD-04 — Public Event Portal visibility

**Status:** APPROVED\
**Decision:** Public events are accessible publicly and eligible for public listing. Unlisted events are accessible through a direct link but excluded from public directory listings.\
**Architectural implication:** Both modes expose only published, approved public output. Unlisted is shareable, not confidential. FD-20 records that Private mode is deferred.

### FD-05 — Independent Superadmin and school authority

**Status:** APPROVED\
**Decision:** Superadmin may also become an Event Admin in the same school or another school, with separate authority boundaries. Superadmin authority is managed separately from school membership. Superadmin status never automatically grants access to all school data. A Superadmin who is an Event Admin may have one active school membership only in the MVP. Platform and school authority are evaluated independently.\
**Architectural implication:** Keep platform administration separate from school membership and never use Superadmin status as a school-data wildcard. FD-23 further requires any exceptional school-data access to be explicitly authorized, controlled, and audited.

### FD-06 — Multiple same-school event assignments

**Status:** APPROVED\
**Decision:** One Scorekeeper may be assigned to multiple events within the same school.\
**Architectural implication:** Resolve each event assignment independently; cross-school assignment is not implied.

### FD-07 — Independent Scorekeeper permissions

**Status:** APPROVED\
**Decision:** Scorekeeper permissions are independently configurable: can_enter_scores and can_publish_results. Neither permission implies the other.\
**Architectural implication:** Store and check each permission independently for each active assignment.

### FD-08 — Published-result correction authority

**Status:** APPROVED\
**Decision:** Only Event Admin may correct results that have already been published.\
**Architectural implication:** Scorekeeper publication permission does not grant correction authority.

### FD-09 — Published-result withdrawal authority

**Status:** APPROVED\
**Decision:** Only Event Admin may withdraw results that have already been published.\
**Architectural implication:** Withdrawal is separate from score entry and publication; the original result and history are retained.

### FD-10 — Mandatory correction reason and history

**Status:** APPROVED\
**Decision:** Every correction to a published result requires a mandatory reason entered by the Event Admin. Preserve the original and corrected values, reason, actor, timestamp, and result version.\
**Architectural implication:** Append a revision and audit record atomically with the current-state change.

### FD-11 — Withdrawal behavior and republishing

**Status:** APPROVED\
**Decision:** A withdrawn published result is immediately excluded from the official leaderboard, is not valid, and displays a public under-review notice. Require a withdrawal reason and preserve the original value and audit history. Only an Event Admin may withdraw. An Event Admin may republish only after review and confirmation.\
**Architectural implication:** Withdrawal changes current state without deleting history. Public output must not reveal the removed value or private reason by default.

### FD-12 — Participant entry and CSV import

**Status:** APPROVED\
**Decision:** Participant management supports manual entry and CSV import. CSV import includes a common template, validation, preview, duplicate detection, error reporting, and successful and failed import summaries.\
**Status clarification:** The prior approval left duplicate handling open. FD-17 now resolves the approved match fields and manual-review behavior; it does not approve automatic insertion of flagged duplicates.

### FD-13 — One standard scoring configuration per school

**Status:** APPROVED\
**Decision:** Each school has one standard house scoring configuration for the MVP. Different schools may use different systems. All events within a school use that configuration. Event-level overrides are excluded. Configuration changes are audited and must not silently change historical results.\
**Architectural implication:** Preserve the scoring version and applied outcome for historical results. FD-24 records the approved configurable point types and version-history requirements.

### FD-14 — Leaderboard tie-breaker order

**Status:** APPROVED\
**Decision:** Rank houses by total points descending, then gold count, silver count, and bronze count descending. If all four values tie, houses share rank. Use competition ranking, so a tie for first is followed by third place.\
**Architectural implication:** Equal four-value tuples share a rank; the next rank skips occupied positions.

## 3. Additional approved decisions

### FD-15 — First Event Admin onboarding

**Status:** APPROVED\
**Decision:** A Superadmin approves the school's registration application and designates or verifies the first user account as that school's Event Admin. Event Admin access is activated only after verification is complete.\
**Architectural implication:** Approval, designation/verification, membership activation, and actor/time audit records must be explicit. The exact identity-proofing procedure remains an operational detail, not a new Founder Decision.

### FD-16 — Participant fields and visibility

**Status:** APPROVED\
**Decision:** Participant ID is automatically generated. Participant Name and Sports House are required; Participant Number is optional. Year/Form and Gender are collected only when required for competition categories. The MVP does not collect date of birth or national ID. Event Admin manages participant records within their own school. Scorekeepers see only the minimum participant information needed for their assigned events. For each event, participant-name display is controlled by show_participant_names, which defaults to false. When false, Public Viewers must not see participant names; when true, names may be displayed for that event. This setting is independent of Public or Unlisted event visibility.\
**Architectural implication:** Gate every public name projection on that event's show_participant_names value. Under FD-02, Event Admin manages this setting for events in their own school. The exact Scorekeeper field allowlist remains open under OD-13.

### FD-17 — Common CSV template and duplicate handling

**Status:** APPROVED\
**Decision:** All schools use one standard CSV template with participant_name (required), participant_number (optional), sports_house (required), year_form (conditional), and gender (conditional). Participant ID is system-generated and must not be supplied in the CSV. Trim leading/trailing whitespace; compare participant names and sports houses case-insensitively; treat participant numbers as text and preserve leading zeros. Flag a potential duplicate when normalized name, number, and house match if both numbers exist; when both numbers are absent, flag on normalized name and house; when only one number exists, flag for manual review if normalized name and house match. Potential duplicates are never inserted automatically. The Event Admin decides whether flagged rows proceed or are cancelled. Valid non-duplicate rows may proceed without cancelling the entire import.\
**Architectural implication:** Validate and preview before insertion, hold flagged rows for Event Admin decision, and preserve participant numbers as text. CSV encoding, delimiter, size/row limits, and behavior for unexpected columns remain open under OD-14.

### FD-18 — Participant-data retention lifecycle and Emergency Recovery

**Status:** APPROVED\
**Decision:** Operational and personal participant data have 90 days of Active Retention beginning on the official end date of the school's Sports Day event. An Event Admin may request an extension before Active Retention expires, at most twice and for up to seven days per request; every extension requires Superadmin approval. Maximum Active Retention is 104 days if both requests are approved. An Event Admin may request early deletion without Superadmin approval. When processed, the system immediately revokes the Event Admin's access to the affected data and starts a 90-day Restricted Recovery period. The request, requester, timestamp, and system action are audited. At normal expiry, the data enters the same 90-day restricted period and Event Admin access is revoked. At the end of Restricted Recovery, covered data is permanently deleted, subject to separately retained records and legal/privacy requirements.\
Emergency Recovery requires an Event Admin request with reason and purpose, Superadmin approval, and Superadmin authorization/oversight. The requesting Event Admin receives restricted access only to the specifically approved and recovered data; Superadmin does not take over school data management. Initial access is at most three days and expires automatically. An Event Admin may request an extension before expiry; at most two extensions of up to three days each may be approved, for a maximum total access period of nine days. Approved data scope does not expand through an extension. Requests, approvals, revised expiry timestamps, and access actions are audited.\
The official competition-results archive must be retained for a minimum of two years so official results and reports remain complete. The archive preserves school, event and event date, event/category, participant name, sports house, placing, medal, points, and relevant correction and withdrawal history. Retaining a participant name as part of this official archive is an approved exception to the operational participant-data lifecycle. Participant number and other operational participant fields remain subject to that lifecycle and must not be retained in the archive unless separately justified and approved. This retention exception does not authorize public disclosure: each event's show_participant_names setting remains OFF by default, and Public/Unlisted visibility and published, allowlisted public projections remain governed by the existing decisions.

Keep log categories separate from participant-data retention: Audit Trail records are retained for a minimum of two years; Security Logs for 12 months; and routine Operational/Diagnostic Logs for 90 days. Incident and investigation records may be retained longer under a controlled process; every extension must be audited. Scoring configuration snapshots/version history and CSV import audit metadata have separate retention treatment. Import audit metadata must not contain original CSV content or unnecessary participant personal data in technical logs. The hash-chain checkpoint hashes are separately protected and restricted; no retention duration is approved for them. The participant-data lifecycle must not automatically delete separately retained official results or logs.\
**Architectural implication:** Separate participant lifecycle, the official-results archive, restricted recovery, emergency access, and each log category. Scoring snapshot/version-history duration, CSV import audit metadata duration/handling, hash-checkpoint retention, incident/investigation extension details, and detailed operational enforcement/oversight controls remain open under OD-17 and OD-18.

### FD-19 — Combined school roles

**Status:** APPROVED\
**Decision:** One user may hold both Event Admin and Scorekeeper roles within the same school while retaining only one active school membership in the MVP.\
**Architectural implication:** Represent one active membership with both role grants or an equivalent model; do not create duplicate active memberships to express the combination. Event Admin authority remains school-wide; Scorekeeper assignment permissions remain event-scoped for Scorekeeper-only users.

### FD-20 — Private events deferred

**Status:** APPROVED\
**Decision:** MVP supports Public and Unlisted event visibility only. Public events may appear in public listings. Unlisted events are accessible by direct link only and omitted from public listings. Private mode is deferred. Unlisted is not a strong access-control mechanism.\
**Architectural implication:** Do not treat an unlisted URL as authorization or expose information that requires confidentiality.

### FD-21 — Manual communication and in-app assignments

**Status:** APPROVED\
**Decision:** MVP uses manual communication plus in-app Scorekeeper assignment management. Event Admins assign Scorekeepers and manage assignment changes and cancellations in the application. Assignment changes and cancellations are audited. Event Admins communicate through WhatsApp, email, or existing channels. Automated email, push, and in-app notifications are deferred.\
**Architectural implication:** Assignment state is authoritative in the application; external communication does not grant access.

### FD-22 — Data exports deferred

**Status:** APPROVED\
**Decision:** CSV/PDF export is deferred beyond MVP. Published official results remain viewable through the public event portal. This decision does not defer CSV participant import.\
**Architectural implication:** Do not add export workflows to MVP acceptance scope.

### FD-23 — Superadmin safeguards

**Status:** APPROVED\
**Decision:** Superadmin has platform-level administrative authority and does not automatically receive access to all schools' operational data. School operational data access requires an appropriate school-level role or explicitly authorized and controlled access. Platform administration and school-level authorization remain separate. Privileged access and actions must be auditable. For Emergency Recovery, Superadmin approves and oversees access requested by an Event Admin, limited to the specifically approved data and time period; Superadmin does not take over school data management.\
**Architectural implication:** Any exceptional access path must have explicit authorization, narrow scope, control, and an audit trail. Platform-wide safeguards and detailed operational enforcement remain open under OD-08 and OD-18.

### FD-24 — Scoring configuration controls and version history

**Status:** APPROVED\
**Decision:** Event Admin can configure medal and participation points in the school's one standard scoring configuration. No event-level scoring override is allowed. Configuration changes are audited. New configuration versions apply according to their approved effective date; published results preserve the configuration/version and outcome used, and are not recalculated silently.\
For individual events, each medal-winning participant contributes the configured medal points to their sports house; multiple medal-winning participants from one house in one event each count. For team events, medal points are awarded to the winning house once per event result and are not multiplied by team members. Participation points apply only to participants who actually take part. Finished, DNF, and DSQ after starting are eligible; DNS, Absent, and Withdrawn before starting are not. Team event participation points are awarded once per event result, not once per team member. Participation points may be enabled/configured or set to zero in the school configuration.\
**Architectural implication:** Preserve the approved version/effective-date behavior and applied outcome. Multiple teams from one house, heats/finals, ties, and partial team participation remain unresolved under OD-15.

### FD-25 — Audit privileged actions

**Status:** APPROVED\
**Decision:** All privileged actions must be audited. This includes school application approval and first-admin designation, membership and role changes, Scorekeeper assignment changes and cancellations, scoring configuration changes, participant import finalization, result publication/correction/withdrawal/republishing, early-deletion requests and processing, retention extension requests and approvals, Emergency Recovery requests with reason/purpose, approvals, access, extension decisions, revised expiry timestamps, and access actions.\
**Architectural implication:** Audit actor, time, action, target and school/event scope where applicable, and required reason/purpose. CSV import audit metadata must not include original CSV content or unnecessary participant personal data in technical logs. Audit Trail, Security Log, and Operational/Diagnostic Log retention is separate from participant retention; their approved periods and remaining details are recorded under FD-18 and OD-17.

## 4. F-02 through F-12 Security Decision Crosswalk

This crosswalk links the prior security decision subjects to the canonical Founder Decisions and supporting documentation where the relationship can be established. A related FD is not asserted to be a one-to-one equivalent. Where this register does not establish a direct FD mapping, the subject is listed as supporting documentation only.

| Security decision subject | Related canonical FD references (not one-to-one mappings) | Supporting documentation | Mapping note |
|---|---|---|---|
| **F-02 — Membership & Role Assignment** | FD-01, FD-02, FD-05, FD-06, FD-07, FD-19 | RBAC §§2–6; DATABASE §3; PRD §4 | These FDs govern membership cardinality, school authority, assignment scope, independent permissions, and combined local roles. |
| **F-03 — Grants & RLS** | No direct canonical FD mapping established | DATABASE §6; SECURITY §3; ARCHITECTURE §6 | Technical enforcement requirements; supporting sections are not Founder Decision IDs. |
| **F-04 — Tenant Isolation** | Related scope: FD-01, FD-02, FD-05, FD-06, FD-07, FD-19 | ARCHITECTURE §6; DATABASE §§3, 5–6; RBAC §§1, 9 | The referenced FDs establish membership/role boundaries; tenant isolation is specified in the supporting architecture. |
| **F-05 — Public Projection & Cache Security** | Related scope: FD-04, FD-11, FD-16, FD-20 | ARCHITECTURE §§10–11; SECURITY §§4, 8; RBAC §7 | Visibility, withdrawal notice, name control, and public projection are related approvals; cache controls are in supporting documentation. |
| **F-06 — Transaction Integrity & Concurrency** | Related lifecycle scope: FD-03, FD-07–FD-11, FD-17, FD-18, FD-24, FD-25; no direct FD mapping for transaction/concurrency mechanics established | ARCHITECTURE §8; DATABASE §7; SECURITY §5; RBAC §9 | Existing decisions define protected transitions; transaction/concurrency requirements remain architecture guidance, not a one-to-one FD. |
| **F-07 — Retention & Participant Identity** | FD-16, FD-18 | DATA_RETENTION §§2–5; PRD AC-27, AC-40–45; DATABASE §8 | Participant fields and lifecycle requirements are directly recorded in these FDs. |
| **F-08 — Scoring Configuration Versioning** | FD-13, FD-14, FD-24 | PRD FR-10–12 and AC-33–35, AC-49–51; DATABASE §7; ARCHITECTURE §9 | School-wide scoring, tie-breaks, and versioning are distributed across these decisions. |
| **F-09 — Participant Data & CSV Import** | FD-12, FD-16, FD-17 | PRD FR-06–09 and AC-22–32; DATABASE §4; SECURITY §6 | Import, field minimization, and duplicate handling are related approved scopes. |
| **F-10 — Supabase Storage Security** | No direct canonical FD mapping established | DATABASE §6; RBAC §9 “Storage”; SECURITY §1; DEPLOYMENT §§1, 3–4; TESTING §3 “Storage and imports” | Storage authorization and protection are specified in technical documents; no FD equivalence is claimed. |
| **F-11 — Audit Trail Security & Integrity** | FD-25 covers privileged-action audit scope and separate retention; no FD mapping for hash-chain implementation mechanics established | DATABASE §§2, 9; SECURITY §§7, 11; TESTING §3 “Security monitoring”; INCIDENT_RESPONSE §§3–4 | The approved F-11 integrity principles are supported here. FD-25 is related audit scope, not a claim that it alone records the hash-chain requirements. |
| **F-12 — Operational Security & Readiness** | Separate approved consolidation reference; not an FD identifier | FOUNDER_DECISIONS §5; PRD AC-54–82; SECURITY §11; TESTING §3; DEPLOYMENT; INCIDENT_RESPONSE; PILOT_CHECKLIST | F-12 supplements FD-01–FD-25 and is not FD-26. |

## 5. F-12 — Operational Security & Readiness

**Status:** APPROVED by the Founder; consolidated baseline recorded 8 November 2026. The source approval did not specify a separate effective date.\
**Identifier:** F-12 is the supplied consolidation reference, not a new canonical Founder Decision ID. FD-01 through FD-25 remain unchanged and canonical. In particular, F-12 complements FD-23 (Superadmin separation and controlled access), FD-25 (privileged-action audit), and FD-18 (retention and recovery); it does not weaken or replace them.

The following requirements are approved. Technical methods, thresholds, provider capabilities, named operational owners, and exact schedules remain open where stated.

### 1. Identity and access security

- MFA is mandatory for all Superadmins and Event Admins before they can access any administrative function, in every environment and regardless of whether real participant data is present. MFA is recommended, but not mandatory, for Scorekeepers in the MVP. Public Viewers do not require MFA.
- Periodically review privileged Superadmin and Event Admin accounts; suspend or deactivate accounts that are no longer required.
- Revoke active sessions when an account is suspended or deactivated, privileged access is withdrawn, a password is reset, or account compromise is suspected. Users must be able to sign out of all active sessions/devices.
- Implement Idle Timeout and Absolute Session Lifetime; require re-authentication for highly sensitive actions; record security-relevant account and session events.
- MFA methods and enrollment process, account recovery procedures, timeout values, absolute session lifetime, sensitive-action list, and privileged-account review frequency remain technical/operational decisions. None of these open settings permits delaying or weakening mandatory MFA.

### 2. Security monitoring and protection

Detect and record in Security Logs: repeated failed logins; suspicious Superadmin/Event Admin activity; cross-tenant access attempts; attempts to modify or delete Audit Trail records; failure to delete temporary CSV files; backup or restore failures; and Audit Trail hash-chain integrity verification failures. Critical alerts must reach responsible operational personnel, avoid sensitive details, and trigger escalation and follow-up.

Rate-limit login attempts, APIs, sensitive Server Actions, CSV imports, and public page/link access. Temporary lockout or progressive delay may be used where appropriate. Limits may consider account, IP, and school context. Record security events that trigger restrictions. Exact thresholds, durations, alert routing, and response times are open technical/operational decisions.

### 3. Incident response

Use these approved severity levels:

- **CRITICAL:** cross-school data exposure, compromised Superadmin account, or Audit Trail manipulation.
- **HIGH:** compromised Event Admin account, backup/restore failure, or participant personal-data exposure.
- **MEDIUM:** suspicious access attempts, repeated import failures, or limited service disruption without evidence of data exposure.

Every incident follows Detection & Classification; Containment; Investigation & Evidence Preservation; System Recovery; and Documentation & Preventive Action. Critical and High incidents require immediate escalation to responsible operational personnel. Operational timing and on-call routing remain open.

### 4. Backup and disaster recovery

Maintain automated periodic database backups and protection for important Supabase Storage files. Backups must be encrypted and access-restricted; ordinary application users must not modify or delete them. Document restoration procedures and a Disaster Recovery Plan. Complete a Restore Drill before pilot and periodically after pilot starts. Verify database and important Storage-file recovery, school/event/participant/result relationship consistency, RLS/access controls after restore, and absence of cross-school exposure. Record outcomes, issues, and corrective actions.

Document RPO/RTO targets before pilot, base them on verified infrastructure capabilities, and measure actual recovery during drills. Numerical backup frequency, retention, region, RPO, and RTO values are not approved here.

### 5. Maintenance, availability, and vulnerabilities

Document scheduled maintenance, advance notice when service is disrupted, urgent maintenance for critical security issues, uptime/service-availability monitoring, outage investigation, and post-outage checks of login, event management, score entry, and result publication. No numerical uptime SLA is approved.

Monitor Next.js, React, Supabase SDK, and other dependencies; prioritize critical security patches; test updates in Development or Staging before Production; maintain rollback plans for high-risk changes; perform periodic dependency checks; include dependency security checks in CI/CD; and track vulnerabilities through resolution. Prefer existing tools such as GitHub Dependabot and dependency-audit tools over a custom scanner. Exact patch deadlines and tool configuration remain open.

### 6. Environment separation and deployment security

Separate Development and Production. Provide Staging where feasible; it does not replace Production isolation. Use separate API keys, credentials, and Storage per environment. Never copy real participant data into Development or Staging; use synthetic or de-identified data. Require defined CI/CD and automated checks before Production deployment, version-control and test migrations, maintain a migration recovery strategy, and restrict Production access to specifically authorized people.

### 7. Pre-pilot testing and formal approval

Before pilot, test cross-tenant isolation; grants and RLS allow/deny behavior; RBAC for every user type; Supabase Storage; published-only Public Portal access; unauthorized-access protection; and documentation of findings/corrective actions. All acceptance criteria must pass. Critical and High vulnerabilities must be resolved; Medium and Low findings require documented mitigation plans and assigned owners.

Pilot readiness requires Superadmin approval of platform-level readiness and each participating school's Event Admin confirmation of school operational readiness. Application completion or basic functionality alone does not authorize pilot activation.

### 8. Privacy, legal, requests, and vendors

Before pilot, provide and review a Privacy Notice, Terms of Service, Data Retention Policy, Data Access & Disclosure Policy, and Incident & Breach Handling Procedure, with appropriate legal and privacy review. This decision does not establish legal approval or claim PDPA compliance.

Provide an official channel for personal-data requests. Support requests for copies, correction, and deletion subject to retention rules and legal obligations; verify requester identity/authority; determine whether the school or Meyyol handles each request; and record requests, decisions, and actions.

Maintain a vendor register. Assess vendor security, privacy, operational suitability, data locations, purpose-limited access, outage/breach/discontinuation risks, and any new vendor or change involving participant data.

### 9. Secrets, encryption, and data classification

Never expose secret keys in frontend code, browsers, public repositories, user-accessible source, logs, or error messages. Use separate credentials per environment, secure secret-management mechanisms, restricted access, and procedures to revoke and rotate compromised credentials; record and monitor critical credential events. The Supabase Service Role Key must never be used in a browser or frontend because it has elevated privileges and can bypass RLS.

Require HTTPS/TLS in transit and encryption at rest for databases, backups, and Storage. Protect temporary CSV files throughout processing. Keep encryption keys out of frontend and repositories; restrict key access; document management, revocation, and rotation; and verify actual provider capabilities before pilot. Prefer existing provider controls over a custom cryptographic key-management system. Algorithms, key schedules, and provider capabilities remain open.

Classify data as follows:

- **PUBLIC:** published schedules and results approved for public access.
- **INTERNAL:** school/event management data and system configurations.
- **RESTRICTED:** participant personal data, credentials, Security Logs, and the Audit Trail.

Classify every data type. Data may become Public only through an authorized publication process. Restricted data must not appear in ordinary logs, error messages, or public reports. Storage, retention, transfer, disclosure, and deletion must follow classification.

### 10. Governance, training, and security ownership

Document security policies/procedures and accountable owners; review at least annually and after significant system/infrastructure changes or serious incidents; and track document versions, approval/effective dates, and reasons for changes. Store security documentation in an access-controlled location; permit access only to authorized personnel; review access permissions; record privileged-access changes; and revoke access when authorization is withdrawn. Repository access restrictions must be verified rather than assumed.

Provide role-specific guidance before system use: Superadmins on privileged-account security, MFA, incident handling, and data protection; Event Admins on user access, participant data, CSV security, results, and account security; Scorekeepers on secure accounts, assigned-event access, and participant confidentiality; and all registered users on phishing, password security, safe links, and suspicious-activity reporting. Short guides, checklists, and briefings are sufficient for the pilot; provide updates after significant security changes.

Appoint a Security Owner and Backup Security Contact. The Security Owner coordinates policies, risk monitoring, vendor reviews, and incident response; the technical team implements controls, vulnerability fixes, and recovery; Event Admins handle security operations and access management in their schools. Document responsibilities and review them when organizational arrangements change. One person may hold multiple duties if separation of duties and accountability are maintained. Named appointments remain an operational task.

## 6. Related documents

- [Product requirements and acceptance criteria](PRD.md)
- [Architecture](ARCHITECTURE.md)
- [Conceptual database design](DATABASE.md)
- [Roles and authorization](RBAC.md)
- [Security requirements](SECURITY.md)
- [Data retention](DATA_RETENTION.md)
- [Open decisions and recommendations](OPEN_DECISIONS.md)
- [Deployment and environment requirements](DEPLOYMENT.md)
- [Testing strategy and pre-pilot security tests](TESTING.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
- [Documentation change history](CHANGELOG.md)
