# Meyyol's Sports Day — Architecture

**Status:** Phase 1.8 target architecture baseline as of 8 November 2026.\
**Implementation status:** The repository is still a Next.js starter. This document describes approved requirements and proposed architecture; it does not claim that product controls are implemented.

## 1. Repository baseline

The repository contains a Next.js App Router starter, a browser Supabase client, and a Supabase Auth health-check script. Package metadata lists Next.js 16.4.3, React 19.3.0, TypeScript, Tailwind CSS 4, and @supabase/supabase-js. The README and home page remain starter content.

The repository does not evidence authentication flows, server-side Supabase client/session handling, application authorization, domain modules, product database schema, RLS policies, storage policies, audit logging, or retention workflows. The health-check script is a connection smoke check, not an authorization or integration test suite. The Phase 1.7 baseline did not include separate deployment, security, testing, pilot, or incident-response guides; this Phase 1.8 documentation consolidation adds target guides but does not implement their controls. No environment values were inspected.

The repository's Next.js configuration enables Cache Components and partial prefetching. Its installed Next.js documentation states that dynamic data is uncached by default with Cache Components and the feature requires the Node.js runtime. Keep private/session-dependent reads dynamic unless a validated cache design proves keys and invalidation safe.

Supabase's current SSR documentation says @supabase/ssr is in beta; verify its installed version and current API before implementation. It is not currently listed in package metadata. No package was installed or modified for this documentation work.

## 2. Target system

The MVP is one Next.js modular monolith backed by Supabase. Next.js serves the school management application and public event portal. Supabase Auth supplies identity; PostgreSQL stores tenant data, RLS, and audit records; Storage may hold private school assets and temporary import data under scoped policies. GitHub is the source repository. No hosting provider has been selected and no production deployment decision has been approved. Evaluate candidate providers against the approved security, data-location, recovery, and operational requirements before selection.

| Area | Proposed target |
|---|---|
| Web application | Next.js App Router, server-first |
| UI and language | React and TypeScript |
| Identity | Supabase Auth with verified, cookie-backed server sessions |
| Database | Supabase PostgreSQL with explicit exposure, least-privilege grants, RLS, constraints, and transaction boundaries |
| Files | Supabase Storage with private-by-default, tenant-scoped policies |
| Validation | Server-side schema validation; Zod is a proposed direct dependency, not currently listed |
| Deployment | Node.js-compatible hosting; provider and operational configuration remain open |

## 3. Application boundaries

Keep one deployable application with domain modules for:

- **Identity and authorization:** profiles, one active school membership, combined school roles, separate platform administration, session loading, and permission checks.
- **School onboarding and operations:** application review, approval, first Event Admin verification, school settings, houses, and scoring.
- **Events and assignments:** event lifecycle, categories, competitions, and same-school Scorekeeper assignments.
- **Participants and CSV imports:** minimal participant fields, common template, staging, validation, preview, manual duplicate review, and import outcomes.
- **Scoring and results:** score entry, configuration versions, result history, publication, correction, withdrawal, republishing, and standings.
- **Public portal:** Public directory, Unlisted direct-link resolution, sanitized permitted results, separately controlled participant names, and review notices.
- **Audit and operations:** privileged-action events, retention/recovery operations, monitoring, and incident response.

Protected requests should resolve verified identity on the server, load current membership and assignment state, validate requested scope, run the domain operation, and rely on PostgreSQL constraints and RLS as a second boundary. Client state, route visibility, IDs, and unlisted links are never authorization.

## 4. Supabase sessions

Use separate browser and server clients configured for the framework's current SSR integration. Create authenticated server clients per request; do not reuse mutable session clients across users. Browser code receives only the project URL and publishable key. Secret/service-role credentials remain server-side and are not routine user-request credentials.

Session refresh is not authorization. A protected operation must validate the current user and resolve current membership, local role, assignment, and permission. Do not use client-supplied school/event IDs or stale role state as evidence. Do not use user-editable user_metadata for authorization. Platform authority and school membership must be resolved from trusted, current records.

The current Supabase SSR package is beta. Confirm version-specific APIs and cookie refresh conventions before implementation; do not pin architecture text to an unverified API shape.

## 5. Onboarding and authorization model

School application approval and first Event Admin activation are separate, audited steps. A Superadmin approves the registration, designates or verifies the initial account, and activates its Event Admin access only after verification is complete. The exact identity-proofing and exception procedure remains open.

One user can have only one active school membership across all schools. That single membership may carry both Event Admin and Scorekeeper roles within the same school. Model the role combination without duplicate active membership rows. Event Admin authority is school-wide within that membership's school. Scorekeeper authority is event-scoped and requires an active same-school assignment with the specific permission.

Superadmin is a separate platform grant. It does not create or imply school membership or school data access. School operational data requires the appropriate school role or an explicitly authorized, controlled access path. Any privileged access and action is audited. Emergency Recovery policy is in FD-18; enforcement and oversight safeguards remain open under OD-18. Platform scope and any assurance beyond the mandatory F-12 MFA gate remain open under OD-08.

## 6. Tenant isolation and database enforcement

Every tenant-owned record needs an unambiguous school owner. Enforce same-school relationships through tenant-aware foreign keys or equivalent constraints. Resolve school ownership from trusted database relationships, not from client assertions.

Apply server-side authorization and database enforcement together:

1. Resolve the verified user identity, active membership, role, event, assignment, and requested capability.
2. Enable RLS on every table exposed through the Data API and restrict each operation with current database state.
3. Explicitly grant only intended operations. RLS policies do not remove table grants. Do not depend on default table exposure or grants.
4. For updates, provide an appropriate SELECT policy as well as UPDATE policies, and constrain both the existing row and resulting row.
5. Keep privileged functions narrow, default to invoker rights, and restrict function execution. Any necessary definer function requires a separately reviewed security design.
6. Test anonymous, authenticated, platform-admin, Event Admin, and Scorekeeper paths, including cross-school IDs and revocation.

The exact table-by-table grant and policy matrix is a required implementation artifact, not yet designed or implemented.

## 7. Participant and import architecture

Participant ID is generated by the system. Required fields are Participant Name and Sports House; Participant Number is optional. Year/Form and Gender are collected only when a competition category requires them. Date of birth and national ID are excluded from the MVP.

Event Admins manage their own school's participant records and event settings under FD-02, including show_participant_names. Scorekeepers see only the minimum fields needed for their assigned events. Each event has show_participant_names with default false: false forbids public names; true permits names to be displayed for that event, independent of Public/Unlisted visibility. The exact Scorekeeper field allowlist remains open under OD-13.

All schools use one standard CSV template: participant_name (required), participant_number (optional), sports_house (required), year_form (conditional), and gender (conditional). Participant ID is generated and must not be supplied. Trim leading/trailing whitespace; compare names and houses case-insensitively; treat numbers as text and preserve leading zeros. If both numbers exist, normalized name + number + house match flags a possible duplicate; if neither exists, match normalized name + house; if only one exists, match normalized name + house for manual review. Never automatically insert flagged records. Event Admin reviews them; valid non-duplicates may proceed. Encoding, delimiter, file limits, and unexpected-column handling remain open under OD-14.

Prefer an import batch/staging boundary so preview and row-level errors can be shown without prematurely creating participants. Treat the input as untrusted, constrain file size and row count, and minimize retention of uploaded files and diagnostics. This is an architecture recommendation; final staging implementation and diagnostic retention need validation.

## 8. Result lifecycle and transaction boundaries

Draft results are private to authorized school roles and do not affect standings. An Event Admin or a Scorekeeper with explicit publication permission may publish. Only an Event Admin may correct, withdraw, or republish an already published result. Corrections and withdrawals require reasons. Preserve versions, actor, timestamp, reason, and state-transition history.

Each publication, correction, withdrawal, republishing operation, scoring-version activation, import finalization, participant early-deletion transition, retention approval, and Emergency Recovery grant/extension/expiry must commit its related state changes, access changes, history, and audit record atomically wherever the invariant spans multiple records. Multiple independent HTTP requests are not an atomic boundary. Before implementation, select and validate the transaction mechanism for each operation; a narrowly scoped database function/RPC or another single-transaction mechanism may be considered, but no particular mechanism is approved here.

Withdrawal must update current state, append history and audit, and remove the result from standings in the same transaction. Public output then returns a minimal review notice without the withdrawn value or private reason. Republish requires Event Admin review and confirmation; any changed result becomes a new revision.

## 9. Scoring and leaderboard

Each school has one standard scoring configuration for every event in that school. Event Admins may configure medal and participation points; event-specific overrides are excluded. Each version follows its approved effective date, and published results retain the version and applied outcome without silent recalculation. In individual events, each medal-winning participant contributes configured medal points; multiple medal winners from one house in the same event each count. In team events, medal points are awarded once per winning house per event result, not per team member. Participation points apply only to participants who take part: Finished, DNF, and DSQ after starting qualify; DNS, Absent, and Withdrawn before starting do not. Team participation points are awarded once per event result, and can be configured or set to zero.

Rank houses by total points, gold medals, silver medals, and bronze medals, all descending. Equal values across all four measures share rank, with competition ranking (1, 1, 3). Count only valid published results; exclude drafts and withdrawn results.

Multiple teams from one house, heats and finals, tied outcomes, and partial team participation remain unresolved under OD-15. Do not invent those rules for the affected competition formats.

## 10. Public portal and safe projections

Public and Unlisted events expose only published and separately permitted data. Public events may appear in a directory. Unlisted events are omitted from all listings and can be reached by direct link; their links are not authorization. Private mode is deferred.

Use a sanitized, narrowly scoped public projection or read endpoint. Do not expose participant, assignment, application, import, audit, or management base tables to anonymous users. Include participant names only when the event's show_participant_names setting is true; its default is false. This is independent of event visibility. A withdrawn result returns a review notice and never its withdrawn value or private reason.

A PostgreSQL view executes with its owner's privileges by default and may bypass underlying-table RLS. If using a view, require a supported security-invoker design such as security_invoker=true; otherwise put it in a non-exposed schema and deny unintended roles. In all cases explicitly manage underlying table grants and verify anonymous access with integration tests.

## 11. Caching and invalidation

Private school pages and user-specific data must not enter a shared cache unless a validated design isolates every relevant identity, school, and authorization scope. Default to request-time reads for private data and no shared CDN cache for authenticated responses.

Cache only sanitized permitted public output. Scope keys by event identity and published-data version. Public directory data includes only Public events. Direct-link reads for Unlisted events must not add them to listings.

After publication, correction, withdrawal, or republishing, update or invalidate the public projection. After withdrawal, stale published values are unacceptable. Use a current status check or deployment-supported immediate invalidation and verify behavior at the Next.js cache, CDN, and browser layers. Do not assume stale-while-revalidate satisfies the withdrawal requirement.

## 12. Data retention and recovery

Active Retention for operational and personal participant data is 90 days from the official end date of the school's Sports Day event. Up to two extension requests may be submitted before expiry, each adding up to seven days with Superadmin approval (maximum 104 days). An ordinary Event Admin early-deletion request needs no Superadmin approval; when processed, access to affected data is immediately revoked, a 90-day Restricted Recovery period starts, and the request, requester, timestamp, and system action are audited. Normal expiry also starts 90-day Restricted Recovery and revokes Event Admin access. At its end, covered data is permanently deleted, subject to separately retained records and legal/privacy requirements.

Emergency Recovery requires an Event Admin request with reason and purpose and Superadmin approval/oversight. The requesting Event Admin receives restricted access only to the specifically approved data; Superadmin does not take over school management. Initial access is at most three days and expires automatically. Up to two extensions of up to three days may be requested before expiry and approved by Superadmin (maximum nine days); scope does not expand. Requests, approvals, revised expiry timestamps, and access actions are audited. The official-results archive is retained at least two years. Participant retention must not automatically delete the archive, the Audit Trail (minimum two years), Security Logs (12 months), or routine Operational/Diagnostic Logs (90 days). Scoring snapshots have a separate retention schedule; incident/investigation extensions are controlled and audited.

OD-16 remains open for exact data/backup coverage and legal/privacy exceptions; the approved Audit Trail, Security Log, and Operational/Diagnostic Log periods are fixed under FD-18. OD-17 remains open for scoring-snapshot/version-history duration, import audit metadata, checkpoint-hash retention, and incident/investigation extension details; OD-18 remains open for Emergency Recovery enforcement and oversight safeguards. Do not activate deletion/recovery automation until these residuals and legal/privacy requirements are reviewed. See DATA_RETENTION.md.

## 13. Audit and operations

Append audit events for all privileged actions, including school application decisions and first-admin verification, membership and role changes, assignment creation/change/revocation/cancellation, participant import finalization, scoring configuration changes, publication/correction/withdrawal/republishing, early-deletion requests and processing, retention extension requests/approvals, Emergency Recovery requests with reason/purpose, approvals, access, extensions, revised expiry timestamps, and access actions. Record actor, timestamp, action, target, relevant school/event scope, and required reason with minimum necessary before/after data.

Restrict application-role update/delete access to audit history. Do not log secrets, session tokens, whole CSV files, or unnecessary participant data. Database owners and platform operators remain privileged; operational access, backup controls, log-retention implementation, and incident response need separate governance.

## 14. Security, testing, and deployment

Security requirements and required test cases are documented in SECURITY.md. Tests must cover RLS and grants with actual role/session contexts, tenant isolation, combined roles, Scorekeeper assignment boundaries, onboarding, publication lifecycle, public projections, cache invalidation, import duplicate behavior, scoring snapshots, and retention/recovery. No product authorization test suite is evidenced in the repository.

Keep Development and Production Supabase projects and host environments separate. Provide Staging where feasible; it does not replace Production isolation. Use separate credentials, API keys, and Storage per environment and store secrets in an approved secret manager. Use the Node.js runtime required by current Next.js Cache Components configuration. Provider and data-region choices, monitoring thresholds/routes, rate-limit parameters, backup/restore targets and cadence, and owner assignments remain open under OD-09 and OD-19 through OD-25; approved F-12 control outcomes remain requirements regardless of these selections. Do not use real participant data before the pilot gates in OPEN_DECISIONS.md and PILOT_CHECKLIST.md are met.

## 15. F-12 operational security architecture

F-12 is the approved operational-security baseline recorded separately from FD-01 through FD-25. The application architecture must support mandatory MFA for Superadmins and Event Admins; recommended MFA for Scorekeepers; session revocation and global sign-out; privileged re-authentication; security-event monitoring and alerts; rate limits; a documented incident lifecycle; protected database/Storage backups and restore drills; separated Development/Production environments and Staging where feasible; vulnerability and deployment controls; personal-data request handling; data classification; and role-based security training. AC-54 through AC-82 in PRD.md are the acceptance criteria.

Security Logs are operational detection records, distinct in purpose from the append-only Audit Trail. Both contain restricted information. Retain Audit Trail records for a minimum of two years, Security Logs for 12 months, and routine Operational/Diagnostic Logs for 90 days, each separately from participant retention. The Audit Trail integrity-verification signal must itself be monitored. Scoring snapshot/version-history, import audit metadata, checkpoint-hash retention, and incident/investigation extension details remain open under OD-17. Provider encryption, key operations, session settings, thresholds, RPO/RTO, availability targets, escalation routing, and owners remain open under OD-19 through OD-25.

No provider capability, production environment, security owner, legal approval, or operational control is asserted as present. Development and Production must be separate; Staging is used where feasible but does not replace Production isolation. Each environment has separate credentials, API keys, and Storage. Real participant data is prohibited in Development and Staging. See DEPLOYMENT.md, SECURITY.md, TESTING.md, INCIDENT_RESPONSE.md, and PILOT_CHECKLIST.md for target procedures and evidence gates.

## 16. Primary technical references

- [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
- [Next.js authentication with Cache Components](https://nextjs.org/docs/app/guides/authentication-with-cache-components)
- [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side)
- [Supabase choosing a server package](https://supabase.com/docs/guides/auth/choosing-a-server-package)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database views](https://supabase.com/docs/guides/database/views)
- [Supabase database functions](https://supabase.com/docs/guides/database/functions)
- [Supabase securing data and API keys](https://supabase.com/docs/guides/database/secure-data)
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)

## 17. Related documents

- [Product requirements](PRD.md)
- [Conceptual database design](DATABASE.md)
- [Roles and authorization](RBAC.md)
- [Security requirements](SECURITY.md)
- [Data retention](DATA_RETENTION.md)
- [Approved Founder Decisions](FOUNDER_DECISIONS.md)
- [Open decisions](OPEN_DECISIONS.md)
- [Deployment and environment requirements](DEPLOYMENT.md)
- [Testing strategy and pre-pilot security tests](TESTING.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
