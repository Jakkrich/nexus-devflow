---
id: "qa-report-{Task ID}"
title: "QA Verification Report: {Task ID} - {Task Title}"
doc_type: "report"
category: "qa"
status: "draft"
created: "{Date}"
updated: "{Date}"
owner: "{Agent Name / Human Name}"
source_workflow: "/33-Verify"
related_task: "{Task ID}"
related_files: []
tags:
  - nexus-devflow
  - report
  - qa
aliases:
  - "QA Report {Task ID}"
summary: "Verification report for {Task Title}."
metadata_version: 1
qa_result: "pending"
verification_commands: []
risk_level: "medium"
manual_verification_required: true
---

# QA Verification Report: {Task ID} - {Task Title} #doc/report #report/qa

## 1. Overview #section/summary

- **QA Status**: [PASSED / FAILED / PENDING REVIEW]
- **Date Verified**: [YYYY-MM-DD HH:MM]
- **Verified By**: [Agent Name / Human Name]

## 2. Testing Environment #section/context

- **Environment**: [Local / Staging / Production]
- **OS/Browser**: [e.g., Windows 11, Chrome Latest] (If applicable)
- **Commands Used**: [e.g., `npm run test`, `php -l`]

## 3. Verification Steps Executed #section/evidence

| # | Step | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| 1 | [Action] | [What should happen] | [What actually happened] | [PASS / FAIL] |
| 2 | [Action] | [What should happen] | [What actually happened] | [PASS / FAIL] |

## 4. Code Quality And Security Check #section/findings

- [ ] **Linting/Formatting**: Passed without errors.
- [ ] **Security**: No hardcoded secrets, inputs are sanitized/validated.
- [ ] **Best Practices**: Follows project guidelines and patterns.
- [ ] **Performance**: No obvious performance bottlenecks identified.

## 5. Issues Found #section/findings

### Issue 1 #finding/bug #priority/medium

- **Description**: [Description of the bug or incomplete feature]
- **Severity**: [Critical / High / Medium / Low]
- **Proposed Fix**: [Suggestion on how to resolve]

## 6. Manual Verification Required #section/followup

- [ ] **Task 1**: [Describe what the human must check manually]
- [ ] **Task 2**: [Describe any additional manual check]

## 7. Final Recommendation #section/decision

- [ ] **Ready for Merge**: Code meets all acceptance criteria and quality standards.
- [ ] **Needs Rework**: Addressed issues must be fixed before proceeding.

## 8. Sources #section/sources

- {Sources}
