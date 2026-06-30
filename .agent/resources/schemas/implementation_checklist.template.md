---
id: "{running_id}-implementation-checklist"
title: "Implementation Checklist: {Work Title}"
doc_type: "checklist"
category: "implementation-tracking"
status: "draft"
artifact_language: "en"
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
- Keep soft-gate review signals visible while implementation is in progress.
- For loop-enabled stages, capture stage-local loop evidence for the implementation unit only.

## 2. Status Legend

- `pending`: planned but not started
- `in_progress`: actively being worked
- `blocked`: cannot proceed without external action or replanning
- `done`: completed with evidence
- `skipped`: intentionally not done with reason recorded

## 3. Implementation Checklist Items

- [ ] I1: [Scoped implementation unit] | phase: Phase 1 | owner: {Owner} | files: `file/a.ts`, `file/b.ts` | updated: {Date} | verification: [test or manual check] | loop: intent/observation/adjustment/stop pending | evidence: pending | review: pending | next: verify implementation evidence
- [/] I2: [Implementation currently in progress] | phase: Phase 2 | owner: [person/agent] | files: `file/c.ts` | updated: [YYYY-MM-DD HH:mm] | verification: [command] | loop: [latest observation] | evidence: [latest result] | review: in progress | next: continue scoped work
- [!] I3: [Blocked implementation unit] | phase: Phase 2 | owner: [person/agent] | files: `file/d.ts` | updated: [YYYY-MM-DD HH:mm] | verification: [pending check] | loop: [blocked observation] | evidence: [blocker note] | review: blocked | next: human review needed
- [-] I4: [Skipped implementation unit] | phase: Phase 3 | owner: [person/agent] | files: `file/e.ts` | updated: [YYYY-MM-DD HH:mm] | verification: [not run] | loop: [skip rationale] | evidence: [reason for skip] | review: skipped | next: record reason in implement stage

## 4. Detailed Unit Notes

### I1. [Scoped implementation unit]

- **Goal**: [what changes]
- **Files**:
  - `path/to/file`
- **Test Decision**: `[Required / Manual / Not Required]`
- **Verification**:
  - `command or manual check`
- **Loop Intent**: [what this implementation unit is trying to change]
- **Loop Context**: [local files, constraints, and evidence used]
- **Loop Observation**: [what changed or what was learned after the action]
- **Loop Adjustment**: [follow-up patch, route change, or none]
- **Loop Stop Condition**: [what makes this unit complete enough to hand off]
- **Result**:
  - pending
- **Manual Review Signal**:
  - Approval status: `Pending`
  - Review blocker: [none / describe blocker]
  - Next allowed command: [usually `/50-Verify {ID}` after evidence is complete]
- **Notes**:
  - [context]

## 5. Manual Review Snapshot

- **Current Approval Status**: `Pending`
- **Human Review Required**: [what the reviewer still needs to confirm]
- **Next Allowed Command**: [command to suggest after review]
- **Soft-Gate Warning**: [state whether implementation is still waiting on approval, blocked by evidence, or ready for verify]

## 6. Blockers And Deviations

- [!] [Deviation from plan or blocker with reason]

## 7. Additional Notes

- Add more sections when the implementation stream needs richer tracking.

