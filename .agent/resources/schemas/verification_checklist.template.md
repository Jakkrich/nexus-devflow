---
id: "{running_id}-verification-checklist"
title: "Verification Checklist: {Work Title}"
doc_type: "checklist"
category: "verification-tracking"
status: "draft"
artifact_language: "en"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
related_run: "{running_id}"
related_files:
  - ".workspaces/specs/{task-id}/30-plan.md"
  - ".workspaces/specs/{task-id}/40-implement.md"
  - ".workspaces/specs/{task-id}/50-verify.md"
tags:
  - nexus-devflow
  - checklist
  - verification
summary: "Verification checklist for {Work Title}."
metadata_version: 1
---

# Verification Checklist: {Work Title} #doc/checklist #status/draft

## 1. Purpose

- Track required validation, review, and release-gate checks in a human-readable way.
- For loop-enabled stages, capture verification evidence, adjustment route, verdict, and handoff for the verification stage only.

## 2. Verification Checklist Items

- [ ] V1: [Check item] | source: [plan/spec/verify] | owner: {Owner} | updated: {Date} | evidence: pending | loop: observation/adjustment/verdict/handoff pending | severity: none
- [/] V2: [Validation in progress] | source: [verify] | owner: [person/agent] | updated: [YYYY-MM-DD HH:mm] | evidence: [command or manual check] | loop: [latest verification observation] | severity: low
- [!] V3: [Blocked or failed gate] | source: [plan/spec/verify] | owner: [person/agent] | updated: [YYYY-MM-DD HH:mm] | evidence: [failure note] | severity: high
- [-] V4: [Skipped validation step] | source: [verify] | owner: [person/agent] | updated: [YYYY-MM-DD HH:mm] | evidence: [reason for skip] | severity: none

## 3. Required Commands And Manual Checks

- `command 1`
- `manual check 1`

## 4. Loop Evidence Notes

### V1. [Check item]

- **Evidence Checked**: [command output, review note, artifact, or manual evidence]
- **Observation**: [what the evidence shows]
- **Adjustment / Return Route**: [return to `/40-Implement`, update evidence, or none]
- **Stop Condition / Verdict**: [pass, fail, blocked, or ready for release]
- **Handoff**: [what `/60-Release` or the next stage needs to know]

## 5. Findings To Carry Into Verify

- [!] [Finding summary with severity]

## 6. Approval Gate

- **Ready For `/60-Release`**: `no`
- **Why**: [brief reason]
- **Return To `/40-Implement` Needed**: `yes/no`

## 7. Additional Notes

- Add more sections when the verification stream needs deeper detail.

