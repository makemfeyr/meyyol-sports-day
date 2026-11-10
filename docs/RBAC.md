# Meyyol's Sports Day — Roles and Authorization

**Status:** Phase 1.8 approved target authorization model as of 8 November 2026. This document describes required behavior, not implemented controls.

## 1. Authorization principles

- Authenticate through Supabase Auth and authorize each protected operation on the server.
- Resolve school scope from current database membership, not a client-supplied tenant ID.
- Enforce tenant isolation in server logic and PostgreSQL RLS, with least-privilege table/function grants.
- Store platform Superadmin authority separately from school membership.
- Allow one active school membership per user; that membership may carry both Event Admin and Scorekeeper roles in that same school.
- Require Event Admin's active membership for school-wide management.
- Require an active same-school event assignment for Scorekeeper-only access.
- Evaluate can_enter_scores and can_publish_results independently for the requested event.
- Re-check current membership and assignment state so revocation denies subsequent operations.
- Return non-revealing denials for cross-school, unassigned, and nonexistent private resources.
- UI visibility, route obscurity, UUIDs, and Unlisted links are not authorization controls.
- Audit privileged actions, including platform access and emergency access.

## 2. Roles and boundaries

### Superadmin

Superadmin is a platform-level grant stored separately from school membership. It permits defined platform operations such as reviewing school applications and approving the first Event Admin. Mandatory MFA applies before any of these administrative functions in every environment. Superadmin does not automatically permit reading or changing school operational data.

A Superadmin who also acts as an Event Admin must have the separate active school membership and acts only within that school's authority. During Emergency Recovery, the Event Admin requests access with reason and purpose; Superadmin approval and oversight are mandatory. The Event Admin receives restricted access only to approved recovered data, for at most three days plus up to two pre-expiry extensions of three days each (maximum nine days); the scope cannot expand and access expires automatically. Superadmin does not take over school data management. Platform scope and additional assurance beyond mandatory MFA remain open under OD-08; Emergency Recovery enforcement safeguards remain open under OD-18.

### Event Admin

An Event Admin has full management authority within the user's own active school: school operations, events, houses, categories, competitions, participants, assignments, scoring configuration, result lifecycle operations, retention requests, and in-scope audit history. Event Admin access never crosses school boundaries.

The first Event Admin is designated or verified by a Superadmin after school application approval. Activation waits until verification is complete.

### Scorekeeper

A Scorekeeper-only user can access assigned events within the user's active school. Each event assignment has independent can_enter_scores and can_publish_results flags. A Scorekeeper sees only the minimum participant information needed for assigned events. The exact field allowlist remains open under OD-13.

A Scorekeeper cannot correct, withdraw, or republish an already published result, even when can_publish_results is true. If a user also has the Event Admin role in the same school, Event Admin rights apply within that school; the role combination does not create a second membership or cross-school access.

### Public Viewer

No account is required. Public Viewers see only published information allowed by the event-scoped show_participant_names setting. It defaults to false, so names are hidden unless the event setting is explicitly on. This setting is independent of Public/Unlisted visibility. Public Viewers may access Public events or direct links to Unlisted events. Unlisted links are shareable and not confidential. Public Viewers cannot read drafts, unpublished or withdrawn result values, audit history, participant rosters, private participant fields, application data, assignments, or import diagnostics.

## 3. Permission matrix

| Action | Superadmin alone | Event Admin | Scorekeeper-only user | Public Viewer |
|---|---|---|---|---|
| Review/approve school applications | Yes, platform scope | No | No | No |
| Designate/verify first Event Admin | Yes, after school approval | No | No | No |
| Read private school management data | No | Own active school only | No, except minimum fields in assigned events | No |
| Manage school, event, house, category, competition, and participants | No | Own active school | No | No |
| View participant fields for scoring | No | Own active school | Minimum required fields for assigned event(s) only | Only names explicitly allowed for public display |
| Manage school scoring configuration | No | Own active school | No | No |
| Change event show_participant_names | No special school-data authority | Own active school under FD-02 | No as Scorekeeper-only; Event Admin role applies if also held | No |
| Create/change/revoke/cancel assignments | No | Own active school | No | No |
| Read assigned event data | No | Own active school | Assigned event only | Published permitted data only |
| Enter/edit unpublished scores | No | Own active school | Only with can_enter_scores | No |
| Publish valid result | No | Own active school | Only with can_publish_results | No |
| Correct published result | No | Own active school, required reason/history | No | No |
| Withdraw published result | No | Own active school, required reason/history | No | No |
| Republish withdrawn result | No | Own active school after review/confirmation | No | No |
| Read school audit history | No | Own school, in-scope history | No | No |
| Read platform audit history | Defined platform scope only | No, unless separately authorized | No | No |
| Approve Emergency Recovery | Yes, approve and oversee; no school-data management | May request with reason/purpose | No | No |
| Read public/unlisted published information | No special access implied | Own school's permitted output | Assigned scope only | Public/Unlisted published output; names only when that event's show_participant_names is true |

An individual who holds more than one role exercises the union of those separately granted authorities. Platform and school permissions are never implicitly merged. Exceptional school-data access is not represented by the Superadmin column and requires an explicit approved mechanism.

## 4. Membership and onboarding controls

One user has at most one active school membership across all schools. Both approved local roles can be attached to that one membership for the same school. Platform Superadmin authority is held separately.

Onboarding sequence:

1. School application is submitted.
2. Superadmin reviews and approves the school.
3. Superadmin designates or verifies the first Event Admin user account.
4. School Event Admin access becomes active only after verification is complete.

Record the approval and first-admin designation/verification with actor and timestamp. Exact identity-proofing and rollback procedures remain implementation/operations details requiring review.

## 5. Scorekeeper assignment checks

Every Scorekeeper operation must check the active membership, Scorekeeper role, same-school relationship, active event assignment, and requested permission. A user may have multiple assignments within the same school. Cross-school assignments are not implied.

- can_enter_scores permits creation or editing of unpublished scores for that event.
- can_publish_results permits publication only for a valid prepared result in that event.
- Neither permission implies the other.
- Neither permission grants correction, withdrawal, or republishing authority over a published result.
- Revocation or membership deactivation denies the next protected request, even if a prior page remains open.
- For critical writes, check assignment/membership state within the transaction or protect against races with revocation.

## 6. Result lifecycle permissions

| Transition | Authorized actor | Required control |
|---|---|---|
| Draft score entry | Event Admin or assigned Scorekeeper with can_enter_scores | Validate same-school and event scope; no leaderboard effect |
| Initial publication | Event Admin or assigned Scorekeeper with can_publish_results | Validate result; record actor/time/version and applied scoring version |
| Published correction | Event Admin only | Mandatory reason; append before/after values, actor, timestamp, version |
| Published withdrawal | Event Admin only | Mandatory reason; append history and remove from standings atomically |
| Republish after withdrawal | Event Admin only | Review and explicit confirmation; record new publication event |

Withdrawal does not delete the original. The leaderboard excludes it immediately. Public output displays an under-review notice without the withdrawn value or private reason. The notice's exact public scope and wording remain open under OD-07.

## 7. Participant and public data access

Event Admins manage the participant roster within their own school. Scorekeeper-only users see the minimum participant details needed to perform their assigned event duties. Each event has show_participant_names, default false. When false, Public Viewers do not see names; when true, names may be displayed for that event, independently of Public/Unlisted mode.

The approved fields are: generated Participant ID; required Participant Name and Sports House; optional Participant Number; Year/Form and Gender only when required by a competition category. Date of birth and national ID are excluded from MVP.

Event Admin manages show_participant_names for events in their own school under FD-02. The setting is event-scoped and defaults false; do not infer public names from event visibility. The exact Scorekeeper field allowlist remains open under OD-13.

## 8. Audit obligations

Audit all privileged operations, including school approval, first Event Admin verification, role/membership changes, assignment creation/permission changes/revocation/cancellation, scoring changes, participant import finalization, result publication/correction/withdrawal/republishing, early-deletion requests and processing, retention extension requests/approvals, Emergency Recovery requests with reason/purpose, approvals, access, extensions, revised expiry timestamps, and access actions.

Each event records actor, timestamp, operation, target, relevant school/event scope, and required reason/purpose. An ordinary early-deletion request needs no Superadmin approval; when processed it immediately revokes Event Admin access to the affected data and starts 90-day Restricted Recovery. Normal expiry follows 90-day Active Retention from the official event end date, with up to two pre-expiry extensions of seven days each if Superadmin-approved. During Restricted Recovery, normal Event Admin access is revoked. Emergency Recovery is a narrow, temporary exception following the approved request/approval/scope rules above. Do not log whole roster files, credentials, tokens, or unnecessary participant fields. Audit Trail (minimum two years), Security Logs (12 months), and Operational/Diagnostic Logs (90 days) are separate from participant retention and one another; remaining schedule details are identified under OD-17.

## 9. Enforcement model

### Application layer

Protected Server Actions, Route Handlers, and server-side data access validate identity and capability on every operation. Domain operations accept only trusted, resolved identity/scope, validate payloads, and perform state changes through a single database transaction boundary where invariants span rows. Server and client components use the same authorization model.

### Database layer

Enable RLS on every Data API exposed table. Explicitly manage grants as well as policies. Policies resolve current membership, role, school, assignment, and operation permission. For update paths, define the necessary select access and validate both existing and resulting row scope. Never rely on UI checks, stale role claims, or an unlisted URL.

Do not expose anonymous reads from participant or management tables. If a sanitized view is used, account for PostgreSQL views running with owner privileges by default; use a supported security-invoker design or restrict access through a non-exposed schema and grants. Default database functions to invoker privileges. Avoid service-role access in routine user operations.

### Storage

Use private buckets by default. Scope object access to school and operation. CSV files, roster exports, and import diagnostics must not receive public URLs. Public assets require explicit review.

## 10. Required security and integration tests

Before pilot, tests must cover:

- School A Event Admin cannot read or mutate School B data by changing an ID.
- User cannot hold active memberships in two schools.
- A single membership with both roles grants both only within its school.
- Superadmin alone cannot read school data; a separate Event Admin membership permits only that school.
- First Event Admin cannot access school operations before approval and verification.
- Scorekeeper cannot access unassigned event data, including another school.
- Scorekeeper can be assigned to multiple same-school events, with no access to other events.
- can_enter_scores=true and can_publish_results=false allows entry but denies publication.
- can_publish_results=true and can_enter_scores=false does not grant score editing.
- Revoking one permission, assignment, role, or membership blocks subsequent actions.
- Scorekeeper cannot correct, withdraw, or republish a published result.
- Event Admin correction/withdrawal without a reason is rejected; history and audit remain atomic.
- Withdrawal removes standings value and public output returns a notice through previously cached paths.
- Public and Unlisted listing behavior is correct, and public names obey the separate control.
- Anonymous access to views, functions, base tables, Storage, logs, and imports exposes no private fields.
- CSV validation, preview, duplicate hold, partial non-duplicate acceptance, and Event Admin decision are enforced.
- Scoring configuration updates are audited and historical results preserve their applied version.
- Retention transitions revoke Event Admin access, enforce recovery restrictions, and require approved recovery.
- Concurrent writes/revocation cannot bypass result, assignment, or membership invariants.

The current repository contains no such product authorization or integration suite. A Supabase Auth health check is not a substitute.

## 11. F-12 account security and role operations

- All Superadmins and Event Admins must complete MFA before accessing any administrative function in every environment, regardless of whether real participant data is present. MFA is recommended, but not mandatory, for Scorekeepers; Public Viewers do not require MFA. Supported methods, enrollment, recovery flow, and precise enforcement remain open under OD-19; those settings do not defer or weaken the mandatory MFA gate.
- Privileged Superadmin and Event Admin accounts are periodically reviewed. Accounts no longer required are suspended/deactivated, and their active sessions are revoked. Revocation also follows privileged-access withdrawal, password reset, or suspected compromise. Review frequency and provider mechanism remain open under OD-19.
- Users can sign out all active sessions/devices. Idle Timeout, Absolute Session Lifetime, and re-authentication for highly sensitive actions are required; exact values and the action list remain open under OD-19.
- Record security-relevant account and session events without logging credentials, tokens, or unnecessary participant details. Security event monitoring and escalation are defined in SECURITY.md and INCIDENT_RESPONSE.md.
- Before access is granted, provide role-specific security guidance: Superadmins (privileged-account security, MFA, incidents, data protection); Event Admins (access management, participant data, CSV security, results, account security); Scorekeepers (secure accounts, assigned-event access, participant confidentiality); all registered users (phishing, password security, safe links, suspicious-activity reporting). Updates follow significant security changes.
- A named Security Owner and Backup Security Contact coordinate the responsibilities in F-12; they do not gain school-data authority by that appointment. School Event Admin authority and Superadmin separation remain unchanged. Named appointments remain open under OD-25.

## 12. Related documents

- [Product requirements and acceptance criteria](PRD.md)
- [Architecture](ARCHITECTURE.md)
- [Conceptual database design](DATABASE.md)
- [Security requirements](SECURITY.md)
- [Data retention](DATA_RETENTION.md)
- [Approved Founder Decisions](FOUNDER_DECISIONS.md)
- [Open decisions](OPEN_DECISIONS.md)
- [Security requirements](SECURITY.md)
- [Testing strategy and pre-pilot security tests](TESTING.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
