---
id: "{running_id}-verify"
title: "Verify: {Work Title}"
doc_type: "stage"
stage: "50-verify"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files: []
---

# Verify: {Work Title}

## 1. Objective

- Validate that implementation matches the spec and is safe to release.

## 2. Source Inputs

- `40-implement.md`
- `20-spec.md`
- `checklists/verification-checklist.md`
- `50-verify-impact.md` when impact analysis is needed
- Supporting debug, preview, or review notes if they exist

## 3. Project Context To Preserve

- Approved acceptance criteria
- Global rules and phase constraints
- Release blockers and unresolved defects until they are explicitly closed

## 4. Verification Scope

- [State which behaviors, risks, and acceptance criteria were checked]

## 5. Checks Run

- [Check 1]

## 6. Results

- [Result summary]

## 7. Issues Found

- [Issue 1]

## 8. Approval Notes

- [Merge/rework recommendation]

## 9. Checklist Alignment

- [Confirm checklist statuses, evidence links, and any blocked items]

## 10. Impact Report Status

- [State whether `50-verify-impact.md` was created. If not, explain why it was not needed.]

## 11. Regression Risks

- [List any remaining risks or areas that still need attention]

## 12. AI Actions Performed

- [List concrete actions taken, such as running checks, comparing against spec, or logging findings]

## 13. Human Review Required

- Confirm the verification evidence is sufficient
- Confirm issues and blockers are correctly classified
- Confirm the release recommendation matches the findings

## 14. Approval Status

- Pending

## 15. Next Allowed Command

- `/60-Report {running_id}`
- If defects block progress: return to `/40-Implement {running_id}`

## 16. Nexus Event

- `Debug` when failures need deeper investigation before rework
- `PR-Review` when a structured review lens is useful before report or release decisions
- `Wiki` when verified findings should become durable project knowledge

## 17. Change Log

- {Date}: Initial verify draft created

## 18. Additional Notes

- Add any extra headings below this section when useful.

