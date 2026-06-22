---
id: "{running_id}-verification-checklist"
title: "Verification Checklist: {Work Title}"
doc_type: "checklist"
category: "verification-tracking"
status: "draft"
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

## 2. Verification Checklist Table

| ID | Check | Source | Status | Owner | Updated | Evidence | Finding Severity | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| V1 | [Check item] | [plan/spec/verify] | [pending / in_progress / blocked / done / skipped] | [person/agent] | [YYYY-MM-DD HH:mm] | [command, screenshot, or note] | [none / low / medium / high / critical] | [important context] |

## 3. Required Commands And Manual Checks

- `command 1`
- `manual check 1`

## 4. Findings To Carry Into Verify

- [Finding summary with severity]

## 5. Approval Gate

- **Ready For `/60-Release`**: `no`
- **Why**: [brief reason]
- **Return To `/40-Implement` Needed**: `yes/no`

## 6. Additional Notes

- Add more sections when the verification stream needs deeper detail.
