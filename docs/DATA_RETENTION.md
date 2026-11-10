# Meyyol's Sports Day — Data Retention and Recovery

**Status:** Approved retention and Emergency Recovery policy as of 6 November 2026, with F-12 privacy-request and backup requirements added 8 November 2026 and approved retention periods reconciled on 10 November 2026. Scoring snapshot/version-history and import audit metadata details, hash-checkpoint retention, incident/investigation extensions, and some legal/operational controls remain open. This is a policy specification, not an implemented deletion schedule.

## 1. Purpose

Separate operational and personal participant data from the official competition-results archive, scoring configuration history, Audit Trail, Security Logs, and Operational/Diagnostic Logs. Apply each approved retention period without allowing participant-data deletion to erase separately retained results or logs.

This document does not claim legal or PDPA compliance.

## 2. Active Retention

Operational and personal participant data have an Active Retention period of 90 days. The period begins on the official end date of the school's Sports Day event.

An Event Admin may request an extension before Active Retention expires. A maximum of two requests may be approved, each adding up to seven days. Every extension requires Superadmin approval. If both maximum extensions are approved, Active Retention is at most 104 days total.

Each request, requester, approval/decision, time, and revised expiry must be audited. An extension does not change the separate retention schedules for the official-results archive, scoring versions, Audit Trail, Security Logs, Operational/Diagnostic Logs, or other separately retained records.

## 3. Early deletion and Restricted Recovery

An Event Admin may request early deletion of affected operational and personal participant data. Superadmin approval is not required for an ordinary early-deletion request.

When the request is processed:

- The system immediately revokes Event Admin access to the affected data.
- A 90-day Restricted Recovery period begins immediately.
- The request, requester, timestamp, affected scope, and system action are recorded in the audit trail.

At normal Active Retention expiry, covered data also enters a 90-day Restricted Recovery period and Event Admin access is revoked.

At the end of Restricted Recovery, covered data is permanently deleted, subject to separately retained records and legal/privacy requirements. Exact classification of covered records, backup copies, legal holds, and exceptions remains open under OD-16. The participant-data lifecycle must not automatically delete the official results archive or any separately retained log category. The participant name preserved in the official results archive is the approved exception; participant number and other operational participant fields remain subject to this lifecycle unless separately justified and approved.

## 4. Emergency Recovery

During Restricted Recovery, Emergency Recovery follows this approved flow:

1. The Event Admin submits a request with a reason and purpose.
2. A Superadmin must approve, authorize, and oversee the recovery.
3. The requesting Event Admin receives restricted access only to the specifically approved and recovered data.
4. Superadmin does not take over the school's data management.
5. Initial access lasts no more than three days and expires automatically at the approved timestamp.

Before the current access period expires, the Event Admin may request an extension. Up to two extensions of no more than three days each may be approved. The maximum total access period is nine days. The approved data scope remains unchanged; an extension does not authorize additional data.

Record all requests, reasons/purposes, approvals, access actions, extension decisions, and revised expiry timestamps in the audit trail. OD-18 remains open for detailed identity/session enforcement, approval evidence, monitoring, and expiry/revocation safeguards. OD-08 remains open for broader Superadmin platform controls.

## 5. Separate retention schedules

| Record category | Approved retention/treatment | Remaining decision |
|---|---|---|
| Official competition-results archive and correction/withdrawal history | Retain for a minimum of two years so official results and reports remain complete. Preserve school, event and event date, event/category, participant name, sports house, placing, medal, points, and relevant correction/withdrawal history. Do not automatically delete under participant retention. | OD-16: exact archive/backup implementation, legal/privacy requirements, holds, and separately justified additions. |
| Audit Trail | Retain for a minimum of two years, separately from participant-data retention. | OD-17: access, legal holds, disposal authorization, and any applicable controlled incident extension. |
| Security Logs | Retain for 12 months, separately from participant-data retention. Incident/investigation records may be retained longer through a controlled process; every extension is audited. | OD-17: controlled extension procedure, authorization/evidence, review, and disposal details. Do not reopen the approved 12-month base period. |
| Operational/Diagnostic Logs | Retain routine operational/diagnostic logs for 90 days, separately from participant-data retention and the Audit Trail and Security Logs. Do not include original CSV content or unnecessary participant personal data in technical logs. | OD-17: access, disposal implementation, and handling of any separately justified incident/investigation material. Do not reopen the approved 90-day base period. |
| Scoring configuration snapshots/version history | Keep separate from participant-data retention and preserve versions needed to explain historical results. | OD-17: exact duration, archival, access, and disposal. |
| CSV import audit metadata | Keep the import audit metadata separately identifiable from uploaded files and row diagnostics. Do not retain original CSV content or unnecessary participant personal data in technical logs. | OD-17: duration, minimum metadata, access, and disposal. |
| CSV upload files, staging, and row-level diagnostics | Minimize duplicate participant data; protect access and remove temporary material when no longer required. | OD-17: cleanup/retention duration and access. Keep separate from import audit metadata. |
| Incident and investigation records | May be retained longer than the applicable base schedule under a controlled process; every extension must be audited. | OD-17: extension authorization, reasons/evidence, review, and disposal procedure. No additional duration is approved. |
| Hash-chain checkpoint hashes | Store separately with restricted access to protect Audit Trail integrity. | OD-17: no retention duration is approved; do not infer one from the Audit Trail minimum. |

The participant-name exception applies only to the official competition-results archive. Participant number and other operational participant information follow the existing Active Retention, approved extensions, Restricted Recovery, and permanent-deletion lifecycle unless separately justified and approved. Archive retention does not itself authorize public disclosure: show_participant_names remains event-scoped and OFF by default, and Public/Unlisted access remains limited to published, allowlisted public projections. Operational participant tables remain private.

## 6. Required operational controls

Before lifecycle automation or real participant data:

- Define exactly which operational and personal data are covered and identify separately retained records.
- Define treatment of backups, legal/privacy requirements, and any holds.
- Enforce the official Sports Day end date as the normal Active Retention start.
- Enforce extension requests before expiry, the two-request limit, seven-day maximum per request, and Superadmin approval.
- Process ordinary early-deletion requests without Superadmin approval, immediately revoke Event Admin access, start Restricted Recovery, and audit the action.
- Revoke normal Event Admin access during Restricted Recovery.
- Require an Event Admin reason/purpose and Superadmin approval/oversight for Emergency Recovery; limit it to approved scope and enforce expiry after at most three days.
- Permit at most two pre-expiry Emergency Recovery extensions of up to three days each, without scope expansion.
- Permanently delete covered data at the end of Restricted Recovery while preserving separately retained records and applying legal/privacy requirements.
- Keep the official-results archive, Audit Trail, Security Logs, Operational/Diagnostic Logs, scoring snapshots, import audit metadata, temporary CSV material, incident/investigation records, and checkpoint hashes distinct from the participant-data lifecycle and from one another as specified above.
- Preserve only the participant name and approved result fields in the official results archive; do not retain participant number or other operational participant fields there without separate justification and approval.
- Retain Audit Trail records for at least two years, Security Logs for 12 months, and routine Operational/Diagnostic Logs for 90 days. Do not alter these approved base periods through OD-17.
- Keep CSV import audit metadata free of original CSV content and unnecessary participant personal data in technical logs; retain it separately from the source files and row diagnostics.
- Use a controlled, audited process for any longer retention of incident/investigation records; audit every extension.
- Test lifecycle, access revocation, audit, emergency expiry, extensions, and deletion behavior before pilot.

F-12 also requires an official personal-data request channel for copy/access, correction, and deletion requests, subject to approved retention rules and legal obligations. Verify requester identity/authority, determine whether the school or Meyyol handles the request, and record the request, decision, and action. This process must not silently override the approved lifecycle or legal holds; detailed request routing remains open under OD-25.

Periodic database backups and important Supabase Storage files must be protected, encrypted, and access-restricted; ordinary application users must not modify or delete them. Before pilot and periodically afterward, run Restore Drills and verify database/Storage recovery, relationship consistency, RLS/access controls, and absence of cross-school exposure. Record outcomes and corrective action. Backup frequency, retention, region, RPO/RTO, and provider capability verification remain open under OD-21/OD-24. Backup-copy deletion coverage remains part of OD-16.

Classify every covered data type as Public, Internal, or Restricted under F-12. Participant identity, credentials, Security Logs, and Audit Trail are Restricted; ordinary logs/errors and public reports must not expose Restricted information. Classification does not change the approved retention periods above.

## 7. Acceptance criteria references

- AC-40 through AC-45 in PRD.md cover Active Retention, deletion/recovery, and separate schedules.
- AC-42 covers early-deletion audit details; AC-52 and AC-53 cover Emergency Recovery audit requirements. FD-25 defines the broader privileged-action audit scope.
- F-12 adds AC-63/64 for protected backup recovery, AC-75 for personal-data request handling, and AC-79 for classification controls; these do not change the approved retention durations.
- FD-18, FD-23, and FD-25 are the authoritative approved decisions.
- OD-16, OD-17, and OD-18 retain the remaining coverage, schedules, and operational safeguards.

## 8. Related documents

- [Product requirements](PRD.md)
- [Architecture](ARCHITECTURE.md)
- [Conceptual database design](DATABASE.md)
- [Roles and authorization](RBAC.md)
- [Security requirements](SECURITY.md)
- [Approved Founder Decisions](FOUNDER_DECISIONS.md)
- [Open decisions](OPEN_DECISIONS.md)
- [Incident response](INCIDENT_RESPONSE.md)
- [Pilot readiness checklist](PILOT_CHECKLIST.md)
