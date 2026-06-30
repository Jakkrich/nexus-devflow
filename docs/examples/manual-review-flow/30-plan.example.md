---
id: "{running_id}-plan"
title: "Implementation Plan: {Work Title}"
doc_type: "plan"
stage: "30-plan"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files:
  - ".workspaces/specs/{running_id}-{phase-slug}/20-spec.md"
---

# Implementation Plan: {Work Title}

## 1. Objective

- Break the approved spec into executable work without changing the agreed phase boundary.

## 2. Source Inputs

- `20-spec.md`
- Relevant context, research, and earlier phase artifacts
- Codebase exploration notes and implementation mirrors when available

## 3. Project Context To Preserve

- Approved scope boundary
- Global rules and role constraints
- Explicit exclusions and unresolved questions that must stay visible

## 4. Planning Summary

- [Summarize the implementation approach]

## 5. Implementation Strategy

- [Describe the high-level delivery approach and sequencing]

## 6. Workstreams Or Phases

### Workstream 1

- [Describe the first implementation stream]

### Workstream 2

- [Describe the second implementation stream]

## 7. Subtasks

| Subtask | Goal | Files Or Components | Dependency | Verification |
| :--- | :--- | :--- | :--- | :--- |
| [Subtask ID] | [What changes] | [Target files or systems] | [Prerequisite] | [How it will be checked] |

## 8. Files Or Components Expected To Change

- `path/to/file.ext`: [Why it changes]

## 9. Verification Strategy

- [Describe the combined verification approach for this phase]

## 10. Test Decision Per Subtask

| Subtask | Decision | Reason | Planned Cases | Evidence Command |
| :--- | :--- | :--- | :--- | :--- |
| [Subtask ID] | [Required / Manual / Not Required] | [Reason] | [Key cases] | [Command or manual evidence] |

## 11. Risks And Mitigations

| Risk | Mitigation |
| :--- | :--- |
| [Risk] | [Mitigation] |

## 12. Dependencies And Sequencing

- [List sequencing rules or blockers]

## 13. Checklist Initialization

- Checklist directory: `.workspaces/specs/{running_id}-{phase-slug}/checklists/`
- Required files:
  - `implementation-checklist.md`
  - `verification-checklist.md`

## 14. AI Actions Performed

- [List concrete actions taken, such as identifying files, grouping subtasks, or assigning test decisions]

## 15. Human Review Required

- Confirm the plan still fits the approved phase scope
- Confirm sequencing and dependencies are realistic
- Confirm verification and test decisions are sufficient

## 16. Approval Status

- Pending

## 17. Next Allowed Command

- `/40-Implement {running_id}`

## 18. Change Log

- {Date}: Initial plan draft created

## 19. Additional Notes

- Add extra headings below this section when useful.
