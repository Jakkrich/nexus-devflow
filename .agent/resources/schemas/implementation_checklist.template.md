---
id: "{running_id}-implementation-checklist"
title: "Implementation Checklist: {Work Title}"
doc_type: "checklist"
category: "implementation-tracking"
status: "draft"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
related_run: "{running_id}"
related_files:
  - ".workspaces/specs/{task-id}/30-plan.md"
  - ".workspaces/specs/{task-id}/40-implement.md"
tags:
  - nexus-devflow
  - checklist
  - implementation
summary: "Focused implementation checklist for {Work Title}."
metadata_version: 1
---

# Implementation Checklist: {Work Title} #doc/checklist #status/draft

## 1. Purpose

- Track implementation units in execution order.

## 2. Status Legend

- `pending`: planned but not started
- `in_progress`: actively being worked
- `blocked`: cannot proceed without external action or replanning
- `done`: completed with evidence
- `skipped`: intentionally not done with reason recorded

## 3. Implementation Checklist Table

| ID | Unit | Plan Phase | Status | Owner | Files | Updated | Verification | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| I1 | [Scoped implementation unit] | [Phase 1] | [pending / in_progress / blocked / done / skipped] | [person/agent] | [`file/a.ts`, `file/b.ts`] | [YYYY-MM-DD HH:mm] | [test or manual check] | [command output or note] |

## 4. Detailed Unit Notes

### I1. [Scoped implementation unit]

- **Goal**: [what changes]
- **Files**:
  - `path/to/file`
- **Test Decision**: `[Required / Manual / Not Required]`
- **Verification**:
  - `command or manual check`
- **Result**:
  - pending
- **Notes**:
  - [context]

## 5. Blockers And Deviations

- [Deviation from plan or blocker with reason]

## 6. Additional Notes

- Add more sections when the implementation stream needs richer tracking.
