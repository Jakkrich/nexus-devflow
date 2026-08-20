---
name: 60-report
description: "[Devflow] Report stage in DevFlow 2.0 - produce standardized markdown summary report for the completed run."
argument-hint: "{running-id or workspace path}"
---

# Phase 60: Report

$ARGUMENTS

Produce the final human-friendly summary of the full running flow in Markdown (`60-report.md`) so the outcome is easy to communicate every time.

## Usage

```text
60-report {running-id or workspace path}
```

## Markdown-First Contract

Write the primary stage artifact to:

```text
devflow/runs/{ID}-{slug}/60-report.md
```

using:

```text
.agent/resources/schemas/report.template.md
```

Before writing `60-report.md`, read `artifact_language` from `report.template.md` and produce the markdown artifact in that language.

> [!IMPORTANT]
> **No Auto-Generated HTML**: ยกเลิกการสร้างไฟล์ `60-report.html` แบบอัตโนมัติในขั้นตอนนี้! ระบบจะสร้างเฉพาะ `60-report.md` เท่านั้น หากผู้ใช้หรือทีมต้องการสร้าง HTML Report สวยงาม ให้เรียกคำสั่งแยกต่างหาก: `/report:html` หรือ `npm run report:html`

## Required Section Content

Before completing any generated artifact:

- preserve every heading required by the selected template
- write concrete information under every heading
- when no information exists or the section does not apply, write exactly `-`
- never leave a heading immediately followed by another heading with no body content
- remove template placeholders from the final artifact
- do not invent facts merely to avoid using `-`
- re-read the saved artifact and verify every heading satisfies this rule

## Process

### Loop Contract

Run reporting as an outcome-evidence loop, not as a dump of prior artifacts.

- **Intent**: produce a final markdown summary that lets a reader understand the outcome, evidence, decisions, risks, and next actions without replaying the whole run.
- **Context**: read all relevant stage artifacts, checklist files, verify impact notes, release notes, validation output, and supporting artifacts that materially explain the result.
- **Action**: summarize the problem, direction, completed work, validation outcome, checklist progress, final decision, open risks, and next actions.
- **Observation**: use concrete evidence such as checklist completion, blocked or skipped items, validation results, release state, impact notes, and unresolved follow-ups.
- **Adjustment**: if evidence is missing, return to the owning stage; if the report must support continuation, use `handoff`; if the run produced reusable lessons, use `insight-capture` or `Wiki`.
- **Stop Condition**: stop when `60-report.md` exists, summarizes the outcome accurately, includes checklist and evidence snapshots, and names any remaining follow-up work.
- **Handoff**: `60-report.md` must close the mainline run or tell the next reader exactly where follow-up work should continue.

### 1. Gather Full Run Context

Read all relevant stage artifacts:

- the shared `00-discover.md` referenced by `source_discovery` when it materially explains the delivery decision
- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-execute.md`
- `50-verify.md`
- `checklists/implementation-checklist.md` when present
- `checklists/verification-checklist.md` when present

Include supporting artifacts only when they add real context.

### 2. Summarize The Run

Explain:

- what problem was addressed
- what direction was chosen
- what was implemented
- how it was verified (พร้อมบันทึกสถานะ Findings Ledger ใน `devflow/context/findings.md`)
- how checklist progress moved across the run
- **Manual Try Guide**: สรุปขั้นตอนการทดสอบสำหรับมนุษย์ ("Where to go", "What to click", "What to expect")
- what approval or review state remained at each important gate
- what the release recommendation is
- what follow-up items still exist

### 3. Produce Standardized Outputs

Write:

- a readable Markdown report (`60-report.md`) for contributors

Keep checklist summaries and follow-up status inside `60-report.md`.

Both outputs should summarize checklist state when checklist artifacts exist, including:

- completion progress
- blocked or skipped items
- notable evidence snapshots
- approval status, review blockers, and next allowed command when they still matter
- remaining follow-up work

## Output

Report:

- what the run accomplished
- checklist completion status and remaining items
- important remaining follow-ups
- where `60-report.md` was written
- standalone HTML command tip: `/report:html` (if HTML view is desired)

## Relationship To DevFlow 2.0

- Classification: Mainline workflow
- Previous state: `50-verify`
- Next state: `70-release` when the summary is aligned and release can proceed
- Common companion commands: `/report:html` for standalone HTML dashboard, `Wiki` for durable knowledge capture, `Help` for routing or explanation

## Next Workflow Recommendation

- **Primary**: `70-release {ID}` after `60-report.md` reflects the verified state clearly.
- **Optional Standalone HTML**: `/report:html` (or `npm run report:html -- {ID}`) if an interactive HTML report is desired for stakeholder presentation.
- **Alternative**: `Wiki` when the completed run should be promoted into durable reusable knowledge before release packaging continues.
