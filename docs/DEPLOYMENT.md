# Meyyol's Sports Day — Deployment and Environment Requirements

**Status:** Phase 1.8 target deployment requirements, recorded 8 November 2026. No production deployment, provider selection, or F-12 operational control is asserted as implemented.

## 1. Environments and data

The hosting provider remains unselected; no production deployment decision has been approved. Select a provider only after technical evaluation against the approved security, data-location, recovery, and operational requirements in these documents.

- Keep Development and Production separate. Provide Staging where feasible; Staging does not replace Production isolation.
- Use distinct API keys, credentials, and Storage for each environment. Verify separation rather than relying on environment names alone.
- Never copy real participant data into Development or Staging. Use synthetic or de-identified data.
- Restrict Production access to specifically authorized people and review access periodically. Do not expose Production credentials to browsers, public repositories, user-accessible source, logs, or error messages.
- The Supabase Service Role Key is privileged and must never be used in a browser or frontend.

## 2. Build and release controls

- Define CI/CD checks that must pass before Production deployment. Include the automated tests and dependency-security checks required by TESTING.md.
- Review changes and deployment artifacts before release. Track application and dependency versions.
- Version-control database migrations; test them in Development and, where available, Staging; document a recovery strategy before Production application. This document includes no migration or SQL.
- Test high-risk changes outside Production and maintain a rollback plan. Record deployment version, approver, time, and recovery action.
- Do not deploy a change that leaves a known Critical or High security vulnerability unresolved for the pilot path.

CI/CD tooling, exact checks, migration recovery mechanics, vulnerability patch deadlines, rollback triggers, and Production access roster remain open under OD-23.

## 3. Secrets, transport, and storage

- Use a secure secret-management mechanism with restricted access and separate credentials per environment.
- Maintain procedures to revoke and rotate compromised credentials, and record/monitor critical credential events.
- Require HTTPS/TLS in transit and encryption at rest for database, backups, and Storage. Verify these capabilities and settings against the selected provider before pilot.
- Restrict encryption-key access, keep keys out of frontend code and repositories, and document revocation and rotation procedures.
- Protect temporary CSV files throughout processing and remove them when no longer required. Monitor and alert on failed deletion.
- Do not claim a provider control is available until verified. Algorithms, key schedules, provider configuration, and temporary-file handling details remain open under OD-24.

## 4. Backups and recovery

Maintain periodic database backups and protection for important Storage files. Backups must be encrypted and access-restricted; ordinary application users cannot modify or delete them. Document restoration procedures and a Disaster Recovery Plan.

Before pilot and periodically thereafter, perform a Restore Drill. Verify recovered database data and important Storage files, school/event/participant/result relationships, RLS/access controls, and absence of cross-school exposure. Record the drill date, environment, measured recovery, issues, corrective actions, and actual RPO/RTO results.

Backup frequency, retention, region, restore-drill cadence, and numerical RPO/RTO remain open under OD-21. Do not represent numerical targets as approved until selected and verified.

## 5. Monitoring, availability, and maintenance

- Monitor availability, critical security events, backup/restore outcomes, and service health. Route Critical alerts to responsible personnel without exposing sensitive details.
- Document scheduled maintenance and provide advance notice when service is disrupted. Allow urgent maintenance for critical security issues.
- Investigate outages and check login, event management, score entry, and result publication after service recovery.
- Monitor dependencies, prioritize critical security patches, test updates in Development or Staging before Production, and track vulnerabilities through resolution.

Availability thresholds, maintenance notice timing, service targets, alert routing, patch deadlines, and on-call arrangements remain open under OD-20, OD-22, and OD-23. F-12 does not approve a numerical uptime SLA.

## 6. Production readiness evidence

Before a Production pilot, retain evidence that environment separation, access restrictions, CI/CD gates, migration recovery, secret handling, TLS and at-rest protections, backups, restore drills, monitoring, incident escalation, and rollback procedures have been verified. Complete the test matrix in TESTING.md and obtain the approvals in PILOT_CHECKLIST.md.

## 7. Related documents

- [Architecture](ARCHITECTURE.md)
- [Security requirements](SECURITY.md)
- [Testing strategy](TESTING.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
- [Open decisions](OPEN_DECISIONS.md)
