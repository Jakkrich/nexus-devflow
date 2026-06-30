---
id: "{running_id}-release"
title: "Release: {Work Title}"
doc_type: "stage"
stage: "70-release"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files: []
---

# Release: {Work Title}

## 1. Objective

- Package the verified work for delivery, release, merge, or handoff with a clear approval gate.

## 2. Source Inputs

- `60-report.md`
- `50-verify.md`
- Supporting PR, deploy, changelog, or merge notes if they exist

## 3. Project Context To Preserve

- Approved verification outcome and aligned final report
- Known release risks and rollback notes
- Phase scope boundary for what is actually being released

## 4. Release Scope

- [What is being delivered]

## 5. Delivery Summary

- [Summarize the release package, branch, PR, deploy target, or handoff unit]

## 6. PR Or Deploy Notes

- [PR/deploy/merge information]

## 7. Operational Notes

- [Manual operator notes, sequencing cautions, or environment dependencies]

## 8. Known Risks

- [Risks that remain at release time]

## 9. Follow-Ups

- [Post-release follow-up items]

## 10. AI Actions Performed

- [List concrete actions taken, such as preparing handoff notes, assembling release inputs, or identifying blockers]

## 11. Human Review Required

- Confirm the release scope matches the verified phase output
- Confirm risks and follow-ups are acceptable
- Confirm release or handoff approval is explicit

## 12. Approval Status

- Pending

## 13. Next Allowed Command

- End of Timeline flow

## 14. Nexus Event

- `Commit`, `PR`, `Deploy`, `Merge`, or `Changelog` when the release package still needs a concrete execution lane
- return to `/60-Report` when release notes diverge from the approved summary
- return to `/50-Verify` when unresolved issues make release readiness uncertain

## 15. Change Log

- {Date}: Initial release draft created

## 16. Additional Notes

- Add any extra headings below this section when useful.

