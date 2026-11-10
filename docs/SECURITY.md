# Meyyol's Sports Day — Security Requirements

**Status:** Phase 1.8 target security requirements as of 8 November 2026. No product authorization controls, database policies, or security test suite are evidenced as implemented in the current repository.

## 1. Security objectives and trust boundaries

Protect participant/student data, school operational data, result integrity, and platform administration in a multi-tenant system. Treat these as separate trust boundaries:

- **Browser:** untrusted input and presentation. May hold only public configuration and a publishable Supabase key.
- **Next.js server:** validates session, scope, input, and domain rules. Server-side checks do not replace database enforcement.
- **Supabase Auth:** establishes identity; authentication alone does not establish school, role, or event permission.
- **PostgreSQL/Data API:** applies explicit grants, RLS, constraints, and transaction boundaries.
- **Storage:** holds private objects only when needed; policies scope every object to school and operation.
- **Public portal/cache/CDN:** anonymous surface limited to published, explicitly permitted output.
- **Superadmin operations:** platform scope; no ambient school-data access. Any exceptional school access is separately authorized and audited.

Threats include cross-school IDOR/BOLA, stale or forged role state, Scorekeeper privilege escalation, anonymous access to private rows through views or grants, stale withdrawn results, import abuse, excessive participant disclosure, and retention/recovery bypass.

## 2. Identity and authorization

- Verify the current Supabase session on the server for every protected operation.
- Resolve active school membership and role from current database state. A request-supplied school ID, event ID, role, or old client state is not authority.
- One user has at most one active school membership. That membership can carry both Event Admin and Scorekeeper roles in the same school.
- Event Admin authority applies to that one school. Scorekeeper-only access requires a same-school active assignment and the exact permission needed.
- Check can_enter_scores and can_publish_results independently. Neither implies the other; neither grants correction/withdrawal/republishing rights.
- Superadmin status is stored separately and does not grant access to school operational data. School access requires its own school role or a specifically approved, controlled exception.
- Re-check status at write time so role, membership, or assignment revocation blocks subsequent actions.
- Do not use user-editable authentication metadata for authorization. Do not rely on stale JWT role claims where an immediate revocation is required.
- The first Event Admin becomes active only after school application approval and Superadmin designation/verification.

## 3. RLS, grants, and database functions

Supabase authorization requires both PostgreSQL grants and RLS policies. Enable RLS on every table exposed through the Data API, then explicitly grant only necessary operations. Revoke unintended grants; a policy does not revoke table privileges. Do not depend on whether a new table is automatically exposed.

Policies must reflect current school membership, role, school ownership, assignment, and permission, not merely the authenticated database role. Separate operations and role scopes. Update paths require the right row visibility and resulting-row checks; include any required SELECT policy. Constraints and tenant-aware foreign keys should also prevent cross-school relationships.

Default database functions to invoker privileges. A SECURITY DEFINER function bypasses caller privileges and can bypass RLS; do not use it as a shortcut. If a definer function is unavoidable, isolate it, validate actor/scope in its body, pin its search_path, and restrict execution grants. Review the default PUBLIC execute grant for newly created functions.

Required implementation artifacts before data exposure:

1. Table-by-table Data API exposure decision.
2. Table/operation/role grant matrix.
3. RLS policy matrix for anon, authenticated, Event Admin, Scorekeeper, and platform operations.
4. Reviewed function/view privileges.
5. Automated tests executing with representative session/role contexts.

## 4. Public output and participant minimization

Anonymous access is limited to a sanitized public result projection. Do not grant public access to participant, school-management, application, membership, assignment, import, audit, scoring-configuration, or private-storage tables.

Public and Unlisted events both expose published information only. Public events may appear in listings; Unlisted events are omitted from listings and are reachable by direct link. An Unlisted URL is shareable and is not confidentiality protection.

Participant ID is generated. Name and Sports House are required; Participant Number is optional; Year/Form and Gender are collected only when a competition category requires them. Date of birth and national ID are excluded. Scorekeepers receive the minimum data needed for their assigned events. Public participant-name visibility is separate from event visibility.

Gate public participant-name output on the event-scoped show_participant_names setting, default false. When false, never include names; when true, names may be shown for that event regardless of Public/Unlisted visibility. Event Admin manages this setting for their own school's events under FD-02. Public output must not expose drafts, unpublished or withdrawn values, private correction/withdrawal reasons, roster files, import diagnostics, or audit history. The exact Scorekeeper field allowlist remains open under OD-13.

A PostgreSQL view runs with its owner's privileges by default. A view over protected tables can therefore expose rows even when underlying RLS would deny them. If using a public view, use a supported security-invoker configuration such as security_invoker=true, or restrict it to a non-exposed schema with explicit grants. Test anonymous access to the view and base tables. Prefer a narrow endpoint/projection with an explicit field allowlist.

## 5. Result integrity and atomic operations

Publication, correction, withdrawal, republishing, scoring-version activation, import finalization, assignment changes, participant early-deletion transitions, retention approvals, Emergency Recovery grants/extensions/expiry, and audit insertion must preserve invariants in a single database transaction where multiple records are involved.

For result operations:

- Only Event Admin or explicitly publish-enabled Scorekeeper can initially publish.
- Only Event Admin can correct, withdraw, or republish an already published result.
- Corrections and withdrawals require a non-empty reason.
- Preserve immutable result versions, actor, timestamp, reason, applied scoring version/outcome, and publication history.
- Withdrawal removes the result from standings in the same transaction and changes public output to a review notice without the withdrawn value.
- A multi-request application sequence must not be treated as atomic.
- Select and test the transaction mechanism before implementation; no particular RPC/function design is approved.

Restrict application-role update/delete rights on result revision, publication, and audit history. Database owners and privileged operators remain trusted actors and require operational monitoring and backup controls.

## 6. CSV import controls

Treat CSV files and all cell values as untrusted input.

- Use the single standard Meyyol template for every school with participant_name (required), participant_number (optional), sports_house (required), year_form (conditional), and gender (conditional). participant_id is generated and must not be supplied.
- Validate headers, encoding, row count, size, required/conditional fields, and all values on the server.
- Preview normalized/validated results before insertion.
- Trim leading/trailing whitespace. Compare participant names and sports houses case-insensitively; treat participant numbers as text and preserve leading zeros. If both records have a number, flag a duplicate when normalized name, number, and house match. If both lack a number, compare normalized name and house. If only one has a number, matching normalized name and house is a potential duplicate requiring manual review. Never automatically insert flagged rows.
- Let valid non-duplicate records proceed without cancelling the entire import.
- Require Event Admin choice before flagged rows proceed or are cancelled.
- Avoid exposing another school's duplicate-match data.
- Store only minimal batch summaries and diagnostics. Do not log complete CSV files or participant rows.
- Apply rate limits and resource limits to uploads and parsing.

Encoding, delimiter, file/row limits, and behavior for unexpected columns remain open under OD-14. FD-17 prohibits supplying participant_id; how an unexpected participant_id column is rejected or reported remains open. The approved row-level duplicate review and ability for valid non-duplicate rows to proceed are defined in FD-17.

## 7. Audit, retention, and recovery

Audit privileged actions: application approval and first-admin designation; role/membership and assignment changes; scoring configuration changes; import finalization; result publication/correction/withdrawal/republishing; early-deletion requests and processing; retention extension requests/approvals; Emergency Recovery requests with reason/purpose, approvals, access, extensions, revised expiry timestamps, and access actions. Include actor, timestamp, action, target, school/event scope, and required reason/purpose. Minimize sensitive detail.

Active Retention for operational/personal participant data is 90 days from the official Sports Day end date. Up to two extensions may be requested before expiry, each up to seven days with Superadmin approval (maximum 104 days). An ordinary early-deletion request needs no Superadmin approval; when processed, immediately revoke Event Admin access to affected data and start a 90-day Restricted Recovery period. Normal expiry also starts that period and revokes Event Admin access. At its end, permanently delete covered data subject to separately retained records and legal/privacy requirements. Emergency Recovery follows FD-18: Event Admin request with reason/purpose, Superadmin approval/oversight, restricted access to approved data for at most three days, up to two pre-expiry three-day extensions (maximum nine days), no scope expansion, and automatic expiry.

The Audit Trail must be append-only for ordinary application roles. Each record is cryptographically linked to the preceding record; integrity is periodically verified; checkpoint hashes are stored separately with restricted access; and any mismatch or verification failure triggers a Security Log record and security alert. Attempts to modify or delete audit data are detected and recorded. Hash algorithm, verification/checkpoint frequency, external checkpoint storage, alert routing, and the privileged database-administrator threat model remain technical decisions; no verification is claimed as implemented.

The official competition-results archive is retained for at least two years and includes the participant name and approved result fields as specified in FD-18. Participant number and other operational participant fields remain under the participant lifecycle unless separately justified and approved. Archive retention does not authorize public disclosure; show_participant_names remains event-scoped and OFF by default, and public output remains published-only and allowlisted.

Keep log categories separate from participant retention and from one another: Audit Trail records for a minimum of two years, Security Logs for 12 months, and routine Operational/Diagnostic Logs for 90 days. Incident/investigation records may be retained longer under a controlled process; every extension must be audited. Scoring configuration snapshots/version history and CSV import audit metadata remain separately identifiable, with durations and handling details open under OD-17. Do not include original CSV content or unnecessary participant personal data in technical logs. Hash-chain checkpoint hashes remain separately protected/restricted; no retention duration is approved for them.

OD-16 remains open for coverage of retained records, backups, and legal/privacy exceptions; OD-17 remains open for scoring snapshot/version-history, import audit metadata, checkpoint-hash, and incident/investigation extension details. The approved log periods are fixed under FD-18. OD-18 remains open for Emergency Recovery enforcement and oversight safeguards. Review backup and restore behavior so lifecycle claims do not omit retained backup copies.

## 8. Caching and abuse prevention

- Do not place authenticated school data in shared caches.
- Cache only sanitized, permitted public output, keyed by event and published-data version.
- Keep Unlisted records out of public listings even when their direct links are fetched.
- Immediately invalidate or bypass status-sensitive public caches after withdrawal. Verify Next.js, hosting/CDN, and browser behavior.
- Rate-limit authentication, public reads, and CSV work; cap payload/row sizes and avoid unbounded parsing.
- Monitor repeated cross-tenant probes, authorization denials, import failures, lifecycle errors, and cache invalidation failures.

## 9. Required security and integration tests

Before pilot, automate tests for:

- Cross-school reads/writes through changed IDs and nested relationships.
- One active membership constraint and combined roles within one school.
- Superadmin with no school membership; Superadmin with a separate school role; exceptional access approval and audit.
- First-admin activation before/after school approval and verification.
- Scorekeeper assignment scope across multiple events and schools.
- Independent entry/publish flags, revocation races, and Event Admin-only result corrections/withdrawals/republishing.
- Mandatory reason enforcement and atomicity of state, history, audit, and leaderboard changes.
- RLS behavior under anon/authenticated JWTs; direct table grants; views; RPC/function execution; Storage.
- Public/Unlisted listing and direct-link output, show_participant_names OFF/ON behavior, and denial of draft/private fields.
- Withdrawal cache invalidation at application, CDN, and browser layers.
- CSV malformed data, size limits, duplicate holds, non-duplicate partial progress, and Event Admin review.
- Scoring-version snapshot integrity after configuration changes.
- Retention clock at event end, early deletion without Superadmin approval, Event Admin revocation, extension approval, 90-day permanent deletion boundary, Emergency Recovery request/scope/three-day expiry/extensions up to nine days, audit, and separation of results/logs.
- Concurrent changes, such as assignment revocation during a write.

The repository currently has no product authorization or integration test suite. The existing Supabase Auth health-check script tests connectivity only.

## 10. External implementation guidance

Verify current versioned guidance before implementation:

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database views](https://supabase.com/docs/guides/database/views)
- [Supabase database functions and privileges](https://supabase.com/docs/guides/database/functions)
- [Supabase choosing a server package](https://supabase.com/docs/guides/auth/choosing-a-server-package)
- [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Changelog](https://supabase.com/changelog?types=breaking-change)

## 11. F-12 operational controls

F-12 in FOUNDER_DECISIONS.md is the approved cross-cutting operational-security baseline; it is not a new FD ID. Implement and verify its requirements alongside this document:

- **Identity and sessions:** mandatory MFA for all Superadmins and Event Admins before any administrative function in every environment, regardless of real-data use; recommended for Scorekeepers, none required for Public Viewers. Periodically review privileged accounts; deactivate unneeded accounts; revoke sessions on suspension/deactivation, privileged-access withdrawal, password reset, or suspected compromise; allow global sign-out; enforce idle and absolute lifetime limits and re-authentication for sensitive actions. Methods, enrollment/recovery, values and cadence remain OD-19 and do not defer mandatory MFA.
- **Monitoring and abuse:** record each F-12 signal (repeated login failures, suspicious privileged activity, cross-tenant probes, Audit Trail mutation attempts, temporary CSV deletion failures, backup/restore failures, and hash-chain verification failures). Critical alerts must reach responsible personnel without sensitive details and lead to escalation/follow-up. Rate-limit login, APIs, sensitive Server Actions, CSV imports, and public pages/links; values and alert routes remain OD-20.
- **Incidents:** use Critical/High/Medium classifications and the five approved response stages, with immediate escalation of Critical and High events. See INCIDENT_RESPONSE.md; timing/on-call details remain open.
- **Backups and recovery:** protect periodic database backups and important Storage files; encrypt and restrict access; deny ordinary application users modification/deletion. Maintain a DR plan and perform pre-pilot and periodic restore drills verifying database/Storage, relationships, RLS/access, and tenant isolation. Record results and corrective actions. Schedule, region, RPO/RTO remain OD-21.
- **Maintenance/deployment:** document maintenance notices and urgent critical security maintenance; monitor availability and run post-outage checks; monitor dependencies, prioritize critical patches, test changes outside Production, maintain rollback for high-risk changes, and run dependency security checks in CI/CD. Environment separation, deployment checks, and vulnerability deadlines follow DEPLOYMENT.md and OD-22/OD-23.
- **Privacy/vendors:** provide and review the F-12 privacy/legal document set before pilot; support a verified personal-data request channel; route responsibility between school/Meyyol and record requests, decisions, and actions; maintain a vendor register and conduct the approved risk review. No legal sufficiency or PDPA compliance is asserted. Owner and provider-specific details remain OD-24/OD-25.
- **Secrets/encryption/classification:** never expose secrets to frontend, browsers, public repositories, user-accessible source, logs, or errors; never use Supabase Service Role Key in a browser/frontend. Use secure secret management, separate credentials per environment, restricted access, and procedures to revoke/rotate compromised credentials; record and monitor critical credential events. Require TLS in transit and at-rest encryption for database, backups, and Storage; protect temporary CSV and keys; verify provider controls and key operations. Classify every data type as Public, Internal, or Restricted; only authorized publication makes data Public; keep Restricted data out of ordinary logs/errors/public reports. See the data-classification inventory in DATABASE.md §12. Provider capability and key schedules remain OD-24.
- **Governance/training:** maintain owned, versioned security procedures; review at least annually and after significant changes or serious incidents; store security documentation in an access-controlled location; authorize only approved personnel; review access permissions; record privileged-access changes; and revoke access when authorization is withdrawn. Provide role-specific training before system use and updates after significant security changes; appoint Security Owner and Backup Security Contact. Repository access must be verified, not assumed. Details remain OD-25.
- **Readiness:** complete the F-12 test matrix; resolve all Critical/High vulnerabilities and document Medium/Low mitigations with owners; obtain platform Superadmin and each pilot school's Event Admin sign-off. See TESTING.md and PILOT_CHECKLIST.md.

F-12 requirements are targets; their inclusion here is not evidence that controls are implemented. Exact technical and operational values remain recorded in OPEN_DECISIONS.md.

## 12. Related documents

- [Product requirements](PRD.md)
- [Architecture](ARCHITECTURE.md)
- [Conceptual database design](DATABASE.md)
- [Roles and authorization](RBAC.md)
- [Data retention](DATA_RETENTION.md)
- [Approved Founder Decisions](FOUNDER_DECISIONS.md)
- [Open decisions](OPEN_DECISIONS.md)
- [Deployment and environment requirements](DEPLOYMENT.md)
- [Testing strategy and pre-pilot security tests](TESTING.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
