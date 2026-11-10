# Meyyol's Sports Day — Testing Strategy and Pre-Pilot Security Tests

**Status:** Phase 1.8 target test plan, recorded 8 November 2026. The repository does not evidence an application authorization or product integration test suite; this document does not claim tests have been implemented or passed.

## 1. Purpose and release gate

Define the evidence required to verify the approved product and F-12 security requirements before a pilot uses real participant data. Run tests against isolated Development or Staging environments with synthetic or de-identified data. Staging is used where feasible and never substitutes for Production isolation.

All applicable acceptance criteria in PRD.md must pass before pilot. Resolve Critical and High security findings before pilot. Medium and Low findings require an assigned owner and documented mitigation. Record environment, build/version, test data class, steps, expected and actual results, findings, retest evidence, and sign-off. Do not include secrets or unnecessary participant data in test evidence.

## 2. Required functional and authorization coverage

Automate or otherwise produce reproducible evidence for:

- School application approval and first Event Admin designation/verification before activation.
- One active school membership per user, combined local roles on one membership, and separate Superadmin authority.
- Cross-school read/write denial through changed IDs, nested relationships, functions/views, and Storage paths.
- Event Admin school boundaries; Scorekeeper same-school assignment scope; multiple assignments; independent score-entry and publication permissions; revocation and concurrent-write behavior.
- Event Admin-only correction, withdrawal, and republishing; mandatory reasons; immutable version history; atomic result, audit, and leaderboard effects.
- Public/Unlisted listing and direct-link behavior; published-only public output; participant-name control; denial of drafts, withdrawn values, private reasons, rosters, imports, logs, and management rows.
- CSV validation, preview, duplicate holds, partial non-duplicate progress, server-side input/resource limits, Event Admin review, and temporary-file cleanup.
- School-wide scoring configuration, approved individual/team/participation rules, tie-break order, effective dates, and historical result snapshots.
- Retention clock, extension limits/approvals, early deletion without Superadmin approval, access revocation, Restricted Recovery, permanent deletion boundaries, separate retained records, and Emergency Recovery scope, approval, expiry, extensions, and audit.
- Cache isolation and withdrawal invalidation at application, host/CDN, and browser layers.

## 3. F-12 pre-pilot security test matrix

| Test area | Required verification | Evidence / acceptance |
|---|---|---|
| Tenant isolation | Attempt cross-school access through direct IDs, nested relations, API paths, and Storage. | Every unauthorized read/write is denied; no cross-school data is returned. |
| Grants and RLS | Exercise allow and deny cases under representative anonymous/authenticated role and session contexts, including direct table access, views, functions, and Storage. | Explicit grants and RLS produce the approved RBAC result; no bypass path is found. |
| RBAC and accounts | Exercise Superadmin, Event Admin, Scorekeeper, and Public Viewer privileges, MFA enforcement before any administrative access, role combinations, assignment flags, privileged-account review records, account deactivation, session revocation, global sign-out, and sensitive-action re-authentication. | AC-54–AC-57 pass; no role acquires an unapproved capability. |
| Public portal | Read listings and Unlisted direct links as anonymous user; inspect published/unpublished/withdrawn results and show_participant_names OFF/ON behavior. | Only published, permitted projections appear; Unlisted events stay out of listings; private values remain hidden. |
| Storage and imports | Test authorized and unauthorized object operations, malformed/oversized files, duplicate rows, temporary CSV cleanup, and public URL exposure. | Storage remains scoped; resource limits and cleanup work; no roster or diagnostic data leaks. |
| Security monitoring | Generate each approved signal: repeated failed login, suspicious privileged activity, cross-tenant attempt, Audit Trail mutation attempt, temporary CSV deletion failure, backup/restore failure, and Audit Trail integrity verification failure. | Events are recorded without sensitive payloads; critical alerts reach the configured responsible personnel and trigger follow-up. |
| Audit Trail integrity | Create a sequence of audit records; verify each record is cryptographically linked to its predecessor; exercise periodic verification and separately stored checkpoint hashes; attempt ordinary-role update/delete and checkpoint access; inject a mismatch/failure in a controlled test environment. | Ordinary application roles cannot alter/delete history; attempts are detected/recorded; checkpoints are access-restricted; mismatch or failed verification creates a Security Log record and alert. Algorithm, verification/checkpoint cadence, external checkpoint mechanism, alert routing, and privileged database-administrator threat model remain technical settings under OD-20/OD-24. |
| Rate limiting | Exercise login, APIs, sensitive Server Actions, CSV imports, and public page/link access at the configured limits. | Abuse is bounded and restriction-triggering events are recorded; thresholds and routing follow approved OD-20 settings. |
| Incident response | Tabletop at least one Critical and one High scenario; exercise all five response stages and escalation. | Owners can follow INCIDENT_RESPONSE.md; Critical/High are escalated immediately; records and preventive actions are captured. |
| Backups and restore | Verify scheduled backup configuration and success/failure evidence; confirm ordinary application users cannot modify/delete backups; restore the database and inventoried important Storage files in a controlled environment; verify relationships, RLS/access controls, and tenant isolation. | Restore Drill report records measured recovery, issues, corrective actions, selected cadence, and comparison with approved RPO/RTO. |
| Encryption and secrets | Verify TLS, provider at-rest encryption for database/backups/Storage, key access controls, and absence of secret exposure in frontend, repository, logs, errors, or test artifacts. | Evidence supports AC-77–AC-78 and approved OD-24 provider settings. |
| Environment separation | Verify distinct Development and Production credentials, API keys, and Storage; inspect data practices for nonproduction. | No real participant data is copied to Development or Staging; synthetic/de-identified data is used. |
| Deployment and dependencies | Exercise required CI/CD checks, migration versioning/recovery, dependency checks, Production access restrictions, and rollback for a high-risk change. | Production path is gated and recoverable; vulnerabilities are tracked through resolution. |
| Maintenance and availability | Inspect scheduled-maintenance notices and urgent-security-maintenance records; exercise availability monitoring, outage investigation, and post-recovery checks for login, event management, score entry, and result publication. | Notice is issued before planned disruption under the documented procedure; outage and post-check evidence is recorded without assuming an uptime target. |
| Classification and document access | Compare every documented MVP data type against DATABASE.md's inventory; review Review rows; test security-document access, permission review/change logging, and access revocation. | No data type is omitted; unresolved classes have an owner; security documentation is accessible only to authorized personnel and revocation is evidenced. |
| Privacy, governance, and training | Verify the required privacy/legal document set and review evidence; walk through a request; inspect vendor register; verify named Security Owner/Backup; check role-specific training records and current controlled-document metadata. | AC-74–AC-82 have evidence before pilot; no unverified legal/compliance claim is made. |
| Privacy request workflow | Walk through identity/authority verification, school-versus-Meyyol routing, copy/correction/deletion request, retention/legal constraints, decision, and action record. | Request is traceable without bypassing approved retention rules or exposing data to an unauthorized requester. |
| Pilot authorization | Confirm all AC pass, findings are handled, and both platform and participating-school approvals are recorded. | Superadmin platform readiness approval and each school's Event Admin operational confirmation are present. |

## 4. Finding handling

- Resolve Critical and High security vulnerabilities before pilot.
- For Medium and Low findings, document impact, mitigation, owner, and follow-up date before pilot approval.
- Retest fixes and link the evidence to the original finding.
- Stop the affected release or pilot gate if tenant isolation, authorization, published-only access, secret protection, backup restore, or another mandatory control fails.
- Keep operational logs, audit records, and test artifacts access-restricted and free of secrets and unnecessary participant data.

## 5. Related documents

- [Product requirements and acceptance criteria](PRD.md)
- [Security requirements](SECURITY.md)
- [Roles and authorization](RBAC.md)
- [Deployment and environment requirements](DEPLOYMENT.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
- [Open decisions](OPEN_DECISIONS.md)
- [F-12 approved baseline](FOUNDER_DECISIONS.md)
