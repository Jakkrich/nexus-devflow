---
id: "{running_id}-master-checklist"
title: "Master Checklist: {Work Title}"
doc_type: "checklist"
category: "execution-tracking"
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
  - execution
  - tracking
aliases:
  - "Checklist {Task ID}"
summary: "Live execution checklist for {Work Title}."
metadata_version: 1
---

# Master Checklist: {Work Title} #doc/checklist #status/draft

> **Purpose**: Give humans and AI one live view of the run across planning, implementation, verification, and release readiness.
> **Rule**: Update this file throughout the run. Do not treat it as a one-time planning export.

## 1. Checklist Status

- **Running ID**: `{Task ID}`
- **Work Title**: `{Work Title}`
- **Current Mainline Stage**: `/30-Plan`
- **Overall Status**: `pending`
- **Last Updated By**: `{Owner}`
- **Last Updated At**: `{Date}`

## 2. How To Use This Checklist

- Create checklist items from approved plan phases and subtasks.
- Update item status as work moves through `/40-Implement`, `/50-Verify`, and `/60-Release`.
- Link each completed item to concrete evidence instead of relying on memory.
- Record blockers explicitly. Do not silently skip stalled work.

## 3. Master Checklist Table

| ID | Item | Stage | Status | Owner | Depends On | Updated | Evidence | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| T1 | [Short actionable item] | [/30-Plan or /40-Implement or /50-Verify or /60-Release] | [pending / in_progress / blocked / done / skipped] | [person/agent] | [T0 or none] | [YYYY-MM-DD HH:mm] | [file, command, screenshot, or note] | [important context] |

## 4. Detailed Item Notes

### T1. [Short actionable item]

- **Status**: `pending`
- **Stage**: `/40-Implement`
- **Owner**: `{Owner}`
- **Files**:
  - `path/to/file`
- **Verification**:
  - `command or manual check`
- **Evidence**:
  - pending
- **Blockers**:
  - none
- **Notes**:
  - [context]

## 5. Stage Summary

| Stage | Summary | Status |
| :--- | :--- | :--- |
| `/30-Plan` | [Checklist created from approved plan] | [pending / in_progress / done] |
| `/40-Implement` | [Implementation progress summary] | [pending / in_progress / blocked / done] |
| `/50-Verify` | [Verification progress summary] | [pending / in_progress / blocked / done] |
| `/60-Release` | [Release gate summary if needed] | [pending / in_progress / blocked / done] |

## 6. Open Blockers

- [Blocker with owner and next action]

## 7. Evidence Index

- `30-plan.md`: [what this contributes]
- `40-implement.md`: [what this contributes]
- `50-verify.md`: [what this contributes]
- `60-release.md`: [what this contributes]

## 8. Additional Notes

- Add custom sections below when a run needs more detailed operational tracking.

