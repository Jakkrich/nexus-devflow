---
id: "{running_id}-report"
title: "Report: {Work Title}"
doc_type: "stage"
stage: "60-report"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files: []
---

# Report: {Work Title}

## 1. Objective

- Produce the final human-friendly summary for the full running flow.

## 2. Source Inputs

- `00-discover.md`
- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-implement.md`
- `50-verify.md`
- `checklists/implementation-checklist.md` when present
- `checklists/verification-checklist.md` when present

## 3. Project Context To Preserve

- The agreed phase boundary and its relation to the broader initiative
- The final verification verdict and release recommendation
- Any unresolved risks or deferred items that should remain visible

## 4. Executive Summary

- [Short summary of the whole job]

## 5. Work Completed

- [What was completed]

## 6. Validation Outcome

- [What verification proved]

## 7. Checklist Summary

- [Overall checklist completion status]
- [Blocked or skipped items that matter]
- [Evidence highlights pulled from checklist tracking]

## 8. Manual Review And Gate Summary

- [Final approval state across stage artifacts before release]
- [Any checklist or stage that still shows pending review]
- [Next allowed command or explicit reason the run should stop before release]

## 9. Open Risks

- [Remaining concerns]

## 10. Next Actions

- [What happens next, if anything]

## 11. AI Actions Performed

- [List concrete actions taken, such as summarizing stage artifacts, extracting evidence, or recommending the next phase]

## 12. Human Review Required

- Confirm the summary matches the approved stage artifacts
- Confirm open risks and next actions are visible
- Confirm the manual review and gate summary matches the real approval state
- Confirm the phase is ready to close or hand off

## 13. Approval Status

- Pending

## 14. Outputs

Render `60-report.html` directly from `60-report.md` with the shared renderer:

```text
npm run report:html -- <workspace-path-or-running-id>
```

For renderer behavior and source-of-truth notes, use:

```text
docs/report-html-placeholder-mapping.md
```

The `60-report.html` output should include:

- executive summary
- work completed
- validation outcome
- checklist completion snapshot
- manual review and gate summary
- blocked or skipped items
- next actions
- any additional markdown sections that help explain the outcome

## 15. Next Allowed Command

- Mainline recommendation: `/70-Release {running_id}`
- Optional: use `Wiki` if knowledge should be preserved

## 16. Nexus Event

- `Wiki` when the completed run should become reusable knowledge
- `Help` when routing is still unclear because review signals disagree
- return to `/50-Verify` when unresolved evidence or approval state means the summary should not advance yet

## 17. Change Log

- {Date}: Initial report draft created

## 18. Additional Notes

- Add any extra headings below this section when useful.

