---
id: "{running_id}-report"
title: "Report: {Work Title}"
doc_type: "stage"
stage: "70-report"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files: []
---

# Report: {Work Title}

## 1. Purpose

- Produce the final human-friendly summary for the full running flow.

## 2. Inputs

- `00-discover.md`
- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-implement.md`
- `50-verify.md`
- `60-release.md`
- `checklists/master-checklist.md` when present
- `checklists/implementation-checklist.md` when present
- `checklists/verification-checklist.md` when present

## 3. Required Content

### Executive Summary

- [Short summary of the whole job]

### Work Completed

- [What was completed]

### Validation Outcome

- [What verification proved]

### Checklist Summary

- [Overall checklist completion status]
- [Blocked or skipped items that matter]
- [Evidence highlights pulled from checklist tracking]

### Open Risks

- [Remaining concerns]

### Next Actions

- [What happens next, if anything]

## 4. Decisions

- [Decision 1]

## 5. Outputs

- Final markdown summary
- Final HTML summary

### HTML Report Structure

Use the canonical HTML scaffold:

```text
.agent/resources/schemas/report.template.html
```

Use the placeholder source guide:

```text
docs/report-html-placeholder-mapping.md
```

The `70-report.html` output should include:

- executive summary
- work completed
- validation outcome
- checklist completion snapshot
- blocked or skipped items
- next actions

## 6. Next Step Guidance

- Mainline recommendation: end of flow
- Optional: use `Wiki` if knowledge should be preserved

## 7. Additional Notes

- Add any extra headings below this section when useful.

