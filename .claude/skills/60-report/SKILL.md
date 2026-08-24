---
name: 60-report
description: "[devflow][D] Report stage in DevFlow 2.0 - produce standardized markdown summary report with retrospective lessons learned."
argument-hint: "{running-id or workspace path}"
---

# Phase 60: Report

$ARGUMENTS

Produce the final human-friendly summary of the full running flow in Markdown (`60-report.md`) with retrospective lessons learned, findings summary, and release digest.

## Usage

```text
60-report {running-id or workspace path}
```

## Markdown-First Contract

Write the primary stage artifact to:

```text
devflow/context/current-run/60-report.md
```

> [!IMPORTANT]
> **No Auto-Generated HTML**: ห้ามสร้างไฟล์ `60-report.html` แบบอัตโนมัติในขั้นตอนนี้! ระบบจะสร้างเฉพาะ `60-report.md` เท่านั้น หากต้องการดู HTML Report ให้เรียกคำสั่งแยก: `/report:html`

## Process

### 1. Gather Full Run Context & Verification Evidence
Read all relevant stage artifacts:
- `10-define.md`
- `20-spec.md`
- `30-plan.md`
- `40-execute.md`
- `50-verify.md`

### 2. Retrospective Lessons Learned & Gotchas (Insight Extraction)
Extract durable insights from the completed run:
- **Reusable Patterns**: Design choices or implementations that future runs should mirror.
- **Gotchas & Pitfalls**: Unforeseen issues or quirks encountered during execution.
- **Unresolved Follow-ups**: Route any residual out-of-scope ideas to `devflow/ideas.md`.

### 3. Produce Standardized Report (`60-report.md`)
Structure the report in **Thai (`th`)**:
1. **Executive Summary**: ปัญหาและแนวทางแก้ไข
2. **Delivery Scope**: รายการฟีเจอร์และคอมโพเนนต์ที่ส่งมอบ
3. **Verification Evidence Snapshot**: ผลการทดสอบทุก Lane
4. **Retrospective & Lessons Learned**: บทเรียนและข้อควรระวัง
5. **Manual Try Guide**: ขั้นตอนสำหรับมนุษย์ทดสอบระบบ

## Next Workflow Recommendation

- **Primary**: `70-deliver {ID}`
- **Optional Standalone HTML**: `/report:html`