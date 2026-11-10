# Meyyol's Sports Day — Conceptual Database Design

**Status:** Phase 1.8 conceptual model only as of 8 November 2026. These are not implemented database objects or a final schema. No SQL or migration is included.

## 1. Design goals

- Make school ownership explicit and enforceable on every tenant-owned relationship.
- Enforce at most one active school membership per user while allowing both approved local roles on that membership.
- Keep Superadmin authority separate from school authority and require explicit controlled access for any exception.
- Represent same-school event assignments and independent Scorekeeper permissions.
- Store only approved participant fields and minimize Scorekeeper/public projections.
- Preserve result values, scoring versions, state transitions, and audit history.
- Separate participant retention from the official-results archive, scoring configuration, Audit Trail, Security Logs, and Operational/Diagnostic Logs.
- Make privileged multi-record operations atomic.
- Carry F-12 access, data-classification, monitoring, backup, and request-handling requirements into the eventual design without implying a selected schema or provider capability.

## 2. Conceptual entities

| Entity | Responsibility and key requirements |
|---|---|
| **profiles** | Minimal application profile keyed by Supabase Auth user ID. No credentials or unnecessary personal fields. |
| **schools** | Tenant root and lifecycle/approval state. Not operational until school approval and first Event Admin verification are complete. |
| **school_applications** | Applicant, required review data, approval/rejection, reviewer, timestamps, and the associated school. Minimize the application data exposed to Superadmins. |
| **school_memberships** | One active membership per user across all schools. One membership can carry Event Admin, Scorekeeper, or both roles for the same school. Do not represent combined roles as duplicate active membership rows. |
| **platform_admins** | Separate Superadmin grant and lifecycle. It has no school_id and grants no school-data access by itself. |
| **events** | School-owned events. MVP visibility is Public or Unlisted. Private is not supported. Visibility is distinct from publication/result state. Each event has show_participant_names, default false, independent of event visibility. |
| **sports_houses** | School-owned houses; cross-school references are invalid. |
| **event_categories** | Categories within an event. Year/Form and Gender are collected only when a category requires them. |
| **competitions** | Competition within an event/category. Exact individual/team formats and tie-handling are unresolved. |
| **event_assignments** | Same-school Scorekeeper access to an event with active/revoked state and independent can_enter_scores and can_publish_results flags. An assigned user must have an active membership and Scorekeeper role for that school. |
| **participants** | Generated Participant ID; required Participant Name and Sports House; optional Participant Number; conditional Year/Form and Gender. No date of birth or national ID in MVP. Event Admin manages the school's roster. |
| **event.show_participant_names** | Event-scoped public-name setting, default false. When false, Public Viewers do not see participant names; when true, names may be displayed for that event. It is independent of Public/Unlisted visibility. Event Admin manages it for their own school's events under FD-02. |
| **competition_entries** *(recommended)* | Represents a participant, house, or team entry in a competition so results need not embed roster fields. Final shape depends on unresolved competition formats. |
| **entry_participants** *(recommended)* | Relates participant records to a team entry if needed by the approved competition format. |
| **participant_import_batches** *(recommended)* | Tracks template version, uploader, validation/duplicate summary, accepted/rejected counts, and completion state. Do not retain uploaded files or row diagnostics longer than needed. |
| **scoring_configs** | School-wide immutable scoring versions. Event Admin-configurable medal and participation point rules; one applicable standard configuration per school; no event overrides. |
| **results** | Current result projection for a competition entry: status, current version, applied scoring-config version, and awarded outcome. The official-results archive preserves school, event/date, event/category, participant name, sports house, placing, medal, points, and relevant correction/withdrawal history for at least two years. Draft/unpublished/withdrawn values and private reasons are not public. Participant number and other operational participant fields are excluded from the archive unless separately justified and approved. |
| **result_revisions** | Immutable result snapshots with version, actor, timestamp, required correction reason, and before/after values. |
| **result_publications** | Append-only publish, withdraw, and republish events referencing result version, actor, timestamp, and required reason where applicable. |
| **audit_logs / Audit Trail** | Append-only history for privileged actions. Each record is cryptographically linked to the preceding record; periodic integrity verification and separately stored, access-restricted checkpoint hashes protect the chain. Ordinary application roles cannot update/delete it. Attempts are detected and recorded; any mismatch or verification failure triggers a security alert. Retain Audit Trail records for a minimum of two years, separately from participant retention and Security Logs. Checkpoint hashes have no approved retention duration. Algorithm, verification/checkpoint frequency, external checkpoint mechanism, alert routing, and privileged database-administrator threat model remain technical decisions. |
| **security_logs** | Conceptual restricted operational logs for authentication, suspicious privileged activity, cross-tenant attempts, audit-tampering attempts, temporary CSV deletion failures, backup/restore failures, and Audit Trail integrity failures. Retain for 12 months, separately from the Audit Trail, Operational/Diagnostic Logs, and participant retention. Incident/investigation records may be retained longer under a controlled process; every extension is audited. Avoid secrets and unnecessary participant details. |
| **retention_cases** *(conceptual)* | Tracks the event-end retention clock, approved extensions, ordinary early deletion, 90-day restricted recovery, permanent deletion, and Emergency Recovery request/scope/approval/access expiry. Approved Audit Trail, Security Log, and Operational/Diagnostic Log periods are fixed under FD-18. Scoring snapshot/version-history, import audit metadata, checkpoint-hash retention, incident/investigation extensions, and enforcement details remain open under OD-17/OD-18. |

## 3. Membership, role, and assignment constraints

Recommended invariants to validate in schema design:

- At most one active school membership per user across all schools.
- A single active membership may carry both Event Admin and Scorekeeper roles for that same school.
- Do not allow duplicate active membership rows to encode combined roles. The exact representation of the role set is a technical design choice.
- Keep platform_admins separate; never use Superadmin as an implicit school membership or RLS wildcard.
- A Scorekeeper assignment must reference an active membership and Scorekeeper role in the same school as the event.
- A user can have assignments to multiple events in that school. Each event assignment is checked independently.
- Each assignment stores separate score-entry and publish permissions. One flag cannot imply the other.
- An active assignment is not sufficient for all actions: correction, withdrawal, and republishing of a published result remain Event Admin-only.
- Active membership/assignment state is time-varying. A foreign key alone cannot prove that it remains active; validate current state in authorization and protect critical writes against revocation races.

The active-membership uniqueness rule may use an appropriate PostgreSQL unique constraint/index. Confirm status transitions and reactivation behavior before selecting it.

## 4. Participant fields and imports

Participant ID is system-generated. Participant Name and Sports House are required. Participant Number is optional. Year/Form and Gender are collected only when a competition category requires them. No date of birth or national ID fields belong in the MVP model.

Keep participant fields private by default. Scorekeeper query surfaces expose only the minimum needed for assigned events; the exact allowlist remains open under OD-13. Public names are gated by each event's show_participant_names value, default false, independent of Public/Unlisted visibility. Event Admin manages this setting for their own school's events under FD-02.

Use one standard template across schools with participant_name (required), participant_number (optional), sports_house (required), year_form (conditional), and gender (conditional). participant_id is generated and must not be supplied. Trim leading/trailing whitespace; compare names/houses case-insensitively; treat participant numbers as text and preserve leading zeros. When both numbers exist, match normalized name + number + house; when both are absent, match name + house; when only one exists, match name + house for manual review. Flagged rows are not automatically inserted and require Event Admin review; valid non-duplicates can proceed. Encoding, delimiter, file limits, and unexpected-column handling remain open under OD-14.

A staging/batch model is recommended so preview and row errors do not create participant records. Treat all imported content as untrusted. Retain only the batch summary and diagnostics needed to resolve errors; their retention schedule is not yet approved.

## 5. Tenant keys and referential integrity

Use a consistent opaque primary key. Tenant-owned parent records should expose a unique key containing (school_id, id) where children need to reference both values. Children should reference tenant-aware parents so a valid ID from one school cannot be attached to another school's row.

Recommended invariants:

- Membership user and school references are consistent with the single-active-membership rule.
- Events, houses, categories, competitions, assignments, participants, entries, scoring configurations, results, and audit scope identify the same school.
- Categories and competitions reference parents in the same school and event.
- Competition entries reference a competition and house from the same school; team members, if used, reference participants from that school.
- Results reference an entry and scoring configuration from the same school.
- Result revision numbers are unique within a result; app writes append a new version rather than replacing an earlier snapshot.
- Publication records reference the result version and lifecycle action.
- Published results, revisions, scoring versions, and audit records must not be cascade-deleted by participant deletion.
- Generated Participant ID uniqueness scope and format are not specified by the Founder decision; resolve the identifier design before schema finalization.
- Public route slug uniqueness depends on the final routing structure and remains a technical design choice.

Index foreign-key columns and the school, event, membership, assignment, status, and visibility fields used by RLS and public queries. Review query plans before pilot scale; do not add indexes without validating workload.

## 6. RLS, grants, views, and Storage

- Enable RLS on every table in an exposed schema. Explicitly manage Data API exposure and grants; defaults may vary by project and version.
- Grants decide whether a role may attempt an operation; RLS limits which rows it can access. Apply both. Revoke unintended grants instead of assuming policies remove them.
- Authenticated policies resolve current user identity and current membership/role/assignment from trusted database state.
- Use operation-specific policies. Update paths need a SELECT policy and must check both row visibility and resulting row values.
- Public access should be a narrow sanitized projection, never direct anonymous access to participant, application, assignment, import, or audit tables.
- PostgreSQL views run with owner privileges by default. If a view is used for public results, require a supported security-invoker configuration or place it in a restricted, non-exposed schema and deny unintended access. Test grants and underlying RLS together.
- Default to invoker-rights database functions. Any required definer function needs a separate review, narrow execute grants, ownership checks, and a pinned search path.
- Keep Storage buckets private and apply tenant/operation scoped policies. Do not expose CSV files or rosters by public URL.

See SECURITY.md for the threat boundaries and required test matrix. The actual grant, policy, view, and function definitions do not exist in this repository.

## 7. Results, scoring, and transaction boundaries

Maintain a current result projection for leaderboards and separate append-only revisions/publication history. A conceptual lifecycle is:

1. Create a draft and its first version.
2. Publish with actor, timestamp, result version, applied scoring version, and audit record.
3. Correct a published result only as Event Admin, with a mandatory reason and append-only before/after revision.
4. Withdraw only as Event Admin, with reason, preserved history, immediate exclusion from standings, and a minimal public review notice.
5. Republish only after Event Admin review and confirmation, recording a new publication action.

State, revision/publication history, and audit event must commit in one database transaction wherever they form one invariant. A series of independent API calls is not enough. The exact transaction mechanism is not approved; select and validate it before implementing write paths.

Each school has a single standard scoring configuration. Event Admin can configure medal and participation points, with no event-level override. Each configuration version is immutable after activation. Published results preserve the configuration version and awarded outcome used. Configuration changes do not recalculate historical results silently.

For individual events, each medal-winning participant contributes configured medal points, including multiple same-house medal winners in one event. For team events, medal points are awarded once per winning house per event result, not per team member. Participation points apply to participants who take part: Finished, DNF, and DSQ after starting qualify; DNS, Absent, and Withdrawn before starting do not. Team participation is awarded once per event result, and the school may configure participation points to zero. Preserve the approved scoring version and effective-date behavior. Multiple teams from one house, heats/finals, ties, and partial team participation remain open under OD-15.

## 8. Retention and data integrity

Use separate lifecycles for operational/participant data, the official results archive, scoring snapshots, Audit Trail, Security Logs, Operational/Diagnostic Logs, import audit metadata, and incident/investigation records.

- Participant and operational data have a 90-day Active Retention period beginning on the official end date of the school Sports Day event.
- An Event Admin may request up to two extensions before Active Retention expires, each up to seven days and each requiring Superadmin approval (maximum 104 days). An ordinary early-deletion request does not require Superadmin approval.
- When an early-deletion request is processed, Event Admin access to affected data is immediately revoked and 90-day Restricted Recovery begins. Normal expiry also starts 90-day Restricted Recovery and revokes Event Admin access. At its end, covered data is permanently deleted, subject to separately retained records and legal/privacy requirements.
- Emergency Recovery requires an Event Admin request with reason/purpose and Superadmin approval/oversight. The Event Admin receives restricted access only to approved data for up to three days, with automatic expiry. Up to two extensions of up to three days each may be requested before expiry and approved; maximum total access is nine days and scope does not expand.
- The official-results archive is retained for at least two years and preserves school, event/date, event/category, participant name, sports house, placing, medal, points, and relevant correction/withdrawal history. This participant-name exception does not authorize public disclosure; public output remains published-only, allowlisted, and governed by event-scoped show_participant_names (OFF by default) and the unchanged Public/Unlisted rules. Operational tables remain private.
- Participant number and other operational participant fields follow the existing 90-day Active Retention, approved extensions, 90-day Restricted Recovery, and permanent-deletion lifecycle; they are not retained in the official archive unless separately justified and approved.
- Audit Trail records are retained for at least two years, Security Logs for 12 months, and routine Operational/Diagnostic Logs for 90 days. Each category is distinct from the others and from participant retention. Incident/investigation records may be retained longer under a controlled process; every extension is audited.
- Scoring configuration snapshots/version history and CSV import audit metadata remain separately identifiable and separate from participant retention. Their durations and detailed handling remain open under OD-17. Import audit metadata must not contain original CSV content or unnecessary participant personal data in technical logs.
- Hash-chain checkpoint hashes are stored separately with restricted access; no retention duration is approved for them.

OD-16 remains open for exact coverage of separately retained records, backup treatment, and legal/privacy exceptions. OD-17 remains open for scoring-snapshot/version-history duration, import audit metadata, checkpoint-hash retention, incident/investigation extension details, and other unapproved categories; the approved Audit Trail, Security Log, and Operational/Diagnostic Log periods are fixed. OD-18 remains open for Emergency Recovery enforcement/oversight safeguards. Preserve result integrity without assuming that participant identity may be retained indefinitely beyond the approved official-archive participant-name exception. See DATA_RETENTION.md.

## 9. Audit requirements

Audit all privileged actions: school approval and first Event Admin verification; membership/role changes; assignment creation, permission changes, revocation and cancellation; import finalization; scoring changes; result publication, correction, withdrawal and republishing; early-deletion request/processing; retention extension requests/approvals; Emergency Recovery requests with reason/purpose, approvals, access, extensions, revised expiry, and access actions.

Record actor identity, timestamp, action, target, school/event scope where relevant, and required reason. Store only minimum before/after detail. Deny ordinary application roles update/delete privileges over audit history; detect and record attempts to modify or delete audit data. Cryptographically link each audit record to its predecessor, perform periodic integrity verification, and store checkpoint hashes separately with restricted access. A mismatch or failed verification produces a Security Log entry and security alert. Avoid secrets, tokens, complete CSV contents, or excessive student data. Platform owners and privileged database administrators remain a trust boundary. Hash algorithm, verification/checkpoint frequency, external checkpoint storage/backup, alert routing, and privileged database-administrator threat model are technical decisions; the mechanism is not selected or implemented by this document.

## 10. Migration and implementation gates

This document contains no executable SQL. Before migrations are proposed, resolve applicable OD-13 through OD-25 residuals, finalize the tenant-aware relationship design, validate transaction boundaries, prepare an explicit grants/RLS matrix, and define security integration tests. Apply changes in Development first, verify in Staging where feasible with representative roles/tenants, and use reviewed migrations. No schema has been created by this documentation update.

## 11. F-12 data protection requirements

The eventual schema and operational design must distinguish the PUBLIC, INTERNAL, and RESTRICTED classes defined in FOUNDER_DECISIONS.md. Every data type must be classified. Publication is an explicit authorized transition; participant records, credentials, Security Logs, and the Audit Trail remain Restricted. Ordinary application logs, errors, and public responses must not include Restricted content. Access, retention, transfer, disclosure, and deletion follow the classification and approved lifecycle.

Support a controlled personal-data request process for copy/access, correction, and deletion requests subject to retention rules and legal obligations. Verify requester identity/authority, determine whether the school or Meyyol is responsible, and record the request, decision, and action with minimum necessary details. The exact request/case schema is not selected here.

Protect periodic database backups and important Storage files with verified encryption and restricted access. Ordinary application users cannot modify or delete backups. Restore drills must verify database/Storage recovery, tenant relationships, RLS/access controls, and no cross-school exposure. Do not add backup, Security Log, or request-case schema until design is reviewed; frequency, region, retention, RPO/RTO, provider capabilities, and schedules remain open under OD-16, OD-17, OD-21, and OD-24.

## 12. MVP data-classification inventory

This inventory applies only to data types and domains already specified in the project documentation. PUBLIC, INTERNAL, and RESTRICTED are the approved F-12 classes. “Review” means the existing decisions do not support a confident final class; it is not a fourth classification. For each Review row, record a named closure owner and evidence needed under OD-25 before production. A source table remains protected even when an approved public projection exposes selected fields.

| Data Type/Domain | Classification | Exposure Rule | Authorized Access | Relevant Retention Policy |
|---|---|---|---|---|
| Minimal application profiles | REVIEW — classify identity/profile fields from the final documented profile contents; credentials are RESTRICTED | No public profile access; expose only fields required by an authorized flow. | User access and administrative access must follow the eventual reviewed profile policy; no broader access is established here. | No profile-specific duration established; resolve applicable coverage under OD-16/OD-17. |
| School applications and application-review data | REVIEW — management workflow is INTERNAL; any personal applicant information is RESTRICTED | Never public; minimize data exposed during platform review. | Applicant's own submission and Superadmin review within onboarding scope; no school-wide data access is implied. | No separate application-record schedule established; resolve under OD-16. |
| Platform-admin grants and lifecycle records | REVIEW — privileged access-control metadata; final class depends on stored identity fields | Never public; do not use as an RLS wildcard or school-data grant. | Specifically authorized platform administrators; no automatic school-operational access. | Account lifecycle records follow their applicable retention category; any additional identity/record coverage remains OD-16/OD-17. |
| Published event schedules and Public-event listing fields | PUBLIC | Public only after authorized publication; Public events may appear in a directory through the permitted projection. | Public Viewers for published projection; Event Admins manage their own school's records. | Event/operational coverage follows FD-18; exact record scope and exceptions remain OD-16. |
| Published official results and house leaderboards | PUBLIC | The official archive preserves school, event/date, event/category, participant name, sports house, placing, medal, points, and relevant correction/withdrawal history. Only valid published results appear in the public projection. Never expose withdrawn values or private reasons. Unlisted content is direct-link only and excluded from listings. | Public Viewers receive only the published, sanitized, allowlisted projection; authorized Event Admins and publish-enabled same-school Scorekeepers manage/publish within RBAC. | Official results archive and relevant history: minimum two years under FD-18. This archive retention does not itself authorize public disclosure. |
| Participant names in a public result projection | PUBLIC | Public only in the explicitly authorized projection and only when the event's show_participant_names setting is true; default is false. This does not expose the participant table or other fields. | Public Viewers see only the authorized published projection. | The participant name captured in the official results archive follows its minimum two-year rule as an exception to operational participant retention; the public projection remains separately gated. |
| School, event, house, category, competition, and operational configuration | INTERNAL | No direct anonymous/table access. Public fields require separate authorized publication. Unlisted links do not grant operational access. | Event Admin within own school; Scorekeeper only assigned-event data and specific permissions; Superadmin only defined platform scope or explicitly authorized exception. | Covered operational records follow FD-18's lifecycle; exact coverage and exceptions remain OD-16. |
| School scoring configurations and immutable versions/snapshots | INTERNAL | No direct public access; public results expose only permitted outcome data, not configuration-management records. | Event Admin within own school; no implied Superadmin school-data access. | Separate from participant retention; preserve versions needed to explain historical results. Duration, archival, access, and disposal remain OD-17. |
| School memberships and Scorekeeper assignments | REVIEW — management records are INTERNAL; any personal/credential fields are RESTRICTED | Never public. Enforce current membership, same-school relationship, assignment, and independent permission checks. | Authorized school administrators within their school; a Scorekeeper only for assigned events. Superadmin status alone gives no school-data access. | No separate membership/assignment schedule is specified; determine coverage under OD-16 before lifecycle automation. |
| Participant roster records and participant fields approved by FD-16 | RESTRICTED | Private by default; no direct public access. The archive exception covers only the participant name in the official results archive; it does not expose or retain the roster. | Event Admin for own school; Scorekeeper receives only the minimum fields for assigned events. | Participant number and other operational fields follow 90-day Active Retention, approved extensions, 90-day Restricted Recovery, then terminal deletion subject to retained records/legal requirements; coverage and exceptions remain OD-16. |
| Draft/unpublished/withdrawn result records and private reasons | REVIEW — operational result state is INTERNAL; any identifiable participant data remains RESTRICTED | Never expose drafts, withdrawn values, or private reasons. Public withdrawal output is only the approved minimal review notice. | Authorized school roles according to RBAC; Event Admin-only correction/withdrawal/republishing permissions remain in force. | The participant name and relevant correction/withdrawal history included in the official-results archive follow FD-18's two-year minimum. Draft/unpublished data and records outside that archive follow the operational lifecycle or remain under OD-16 as applicable. |
| Temporary CSV files, staging rows, and row-level import diagnostics | RESTRICTED | Private storage only; do not expose public URLs or log full files/rows. Delete temporary files when no longer needed and monitor failures. | Authorized Event Admin import workflow and specifically authorized technical operators only as needed. | Temporary file/diagnostic duration is separate and remains OD-17; participant rows follow FD-18 when covered. |
| Participant import-batch summaries and audit metadata | REVIEW — INTERNAL if limited to non-participant counts/status; RESTRICTED if participant rows or identifying details are included | Keep private and separately identifiable from source files and row diagnostics; retain only minimum necessary metadata. Technical logs must not contain original CSV content or unnecessary participant personal data; no public URLs. | Event Admin handling the own-school import; technical operators only when required for support. | Import audit metadata duration/handling and import diagnostics/temporary-file schedules remain separate OD-17 decisions. |
| Credentials, secret keys, and session tokens | RESTRICTED | Never expose in frontend, browser, public repository, ordinary logs, or errors. Service Role Key is never used in frontend/browser. | Specifically authorized identity/security/technical custodians through secure secret-management controls. | Revoke/rotate when compromised or no longer authorized; separate security-event retention remains OD-17. |
| Audit Trail, including result and privileged-action history | RESTRICTED | Append-only for ordinary application roles; no public access. Integrity chain/checkpoints receive restricted protection and failures alert. | Authorized audit/security operators and only role-scoped school audit access expressly allowed by RBAC. | Minimum two years, separate from participant retention and Security Logs. Access, holds, disposal, and any applicable controlled incident extension remain OD-17; checkpoint-hash duration is not approved. |
| Retention and personal-data request cases | RESTRICTED | No public access; expose only the verified requester's and designated handler's minimum required information. | Authorized school or Meyyol request handler determined by the approved routing process; Superadmin access only within defined platform authority. | Participant lifecycle and separately retained records follow FD-18; request-case schedule is not specified and remains for OD-16/OD-17 review. |
| Security Logs | RESTRICTED | No public or ordinary application exposure; exclude secrets and unnecessary participant data. | Authorized security/incident responders only. | 12 months, separately from participant retention. Incident/investigation records may be extended only under a controlled process; every extension is audited. Procedure details remain OD-17. |
| Ordinary Operational/Diagnostic Logs | REVIEW — INTERNAL only when verified to contain no Restricted data | Restricted participant/credential/audit/security content must not enter ordinary logs. Exclude original CSV content and unnecessary participant personal data. If payloads cannot be ruled out, treat them as RESTRICTED pending review. | Authorized operations/technical personnel; access is limited to the log's assigned class. | Routine logs: 90 days, separately from participant retention, Audit Trail, and Security Logs. |
| Private school and sports-house logo files | INTERNAL | Private Storage by default, tenant-scoped; no public URL. Public use requires explicit authorized publication. | Authorized Event Admins for their own school and narrowly scoped technical operators. | Exact Storage asset coverage and disposal remain subject to the existing retention review under OD-16. |
| Database/Storage backups and restore copies | REVIEW — mixed contents; treat as RESTRICTED until the inventory is verified | Encrypted and access-restricted; ordinary application users cannot modify or delete. Never expose publicly. | Specifically authorized backup/recovery operators. | Backup-copy coverage/deletion remains OD-16; frequency, retention, region, and recovery targets remain OD-21. |
| Security documentation | REVIEW — F-12 requires restricted access; the classification category for the documents themselves is not assigned by existing decisions | Store in an access-controlled location; permit only authorized personnel; review access, record privileged changes, and revoke withdrawn access. | Personnel authorized for the particular security document. | Version, approval/effective date, review triggers, and change reason are recorded; document access control remains OD-25. |

Before Production or real participant data, review the “Review” rows, confirm the complete documented MVP data inventory, and retain evidence of class assignment and access/retention rules. This table is a requirements inventory, not evidence that data stores, policies, or access controls are implemented.

## 13. Related documents

- [Architecture](ARCHITECTURE.md)
- [Product requirements](PRD.md)
- [Roles and authorization](RBAC.md)
- [Security requirements](SECURITY.md)
- [Data retention](DATA_RETENTION.md)
- [Testing strategy](TESTING.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Approved Founder Decisions](FOUNDER_DECISIONS.md)
- [Open decisions](OPEN_DECISIONS.md)
