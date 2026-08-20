---
name: fix
description: "[Devflow] Fast-Track Fix stage in DevFlow (Blueprint Mode) - define, spec, plan, and create the living spec.md contract for bug fixes."
argument-hint: "{bug description, issue ID, or IDEA-xxx}"
---

# Fast-Track: Fix (Blueprint Mode)

$ARGUMENTS

Fast-Track entry point combining Bug Triage, Root Cause Isolation, Specification, and Implementation Planning into one streamlined, review-gated step for **bug fixes and hotfixes**. Creates and maintains the **Single Living Spec (`spec.md`)** for the fix run.

## Invocations & Aliases

- `/fix <bug-description>` or `fix <bug-description>`: Fast-Track ad-hoc bugfix workflow
- `/fix IDEA-xxx`: Intake and fix a reported issue or idea from `devflow/ideas.md`
- `$fix`: Codex CLI invocation

## Fast-Track Mainline Workflow

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

## Behavior & Contract

When invoked:

### 1. Work Identity & Issue Intake
1. Inspect `devflow/context/current-stage.md` and `devflow/runs/`.
2. **Idea / Issue Inbox Intake**: If the argument is an identifier (e.g. `IDEA-001`):
   - Read `devflow/ideas.md` or issue notes and extract problem statement and root cause hints.
   - In `devflow/ideas.md`, update status to `[x] Claimed ({RUNNING_ID})` and move under `## 📦 Archived / Shipped Ideas`.
3. Determine or allocate the sequential Running ID (e.g. `RUN-018-{slug}`).
4. Identify Git branch naming:
   - `fix/{slug}-{RUNNING_ID}`
5. Create directory `devflow/runs/{RUNNING_ID}/`.

### 2. Generate the Single Living Spec (`spec.md`)
Write `devflow/runs/{RUNNING_ID}/spec.md` using the structured template below in **Thai (`th`)**:

```markdown
# 📐 [{RUNNING_ID}] {Bug/Fix Title} (Living Spec)

> **Status**: In-Progress  
> **Track**: Fast-Track (Blueprint Mode - Fix)  
> **Branch**: `{branch_name}`  
> **Created Date**: {YYYY-MM-DD}  
> **Owner**: {Contributor or Team}  

---

## 1. Specification & Scope
- **Problem Statement & Reproduction**: {อาการบั๊กที่พบ ขั้นตอนที่ทำให้เกิดปัญหา หรือ Error Log}
- **Root Cause Analysis**: {สาเหตุที่แท้จริงของบั๊ก}
- **In-Scope**:
  - {ขอบเขตการแก้ไขบั๊กและการป้องกัน regression}
- **Out-of-Scope**:
  - {สิ่งที่ไม่แตะต้องหรืออยู่นอกเหนือการแก้จุดนี้}
- **Acceptance Criteria**:
  - [ ] AC-1: {เงื่อนไขการแก้ปัญหาสำเร็จและพฤติกรรมที่ถูกต้อง}
  - [ ] AC-2: {มี Regression Test ป้องกันไม่ให้เกิดซ้ำ}

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `{path/to/file1}`: {หน้าที่ที่ต้องแก้ไข}
  - `{path/to/test_file}`: {เทสต์เคสจำลองและป้องกันบั๊ก}
- **Test Decision**: `Required (TDD / Regression Test)`
  - *Rationale*: {การแก้บั๊กต้องมี Regression Test ยืนยันเสมอ}
  - *Planned Cases*: {เคสทดสอบจำลองบั๊ก (Red) และทดสอบหลังแก้ (Green)}
- **Impact & Rollback Strategy**:
  - *Impact*: {ผลกระทบต่อโมดูลข้างเคียง}
  - *Rollback*: {วิธีย้อนคืนการทำงานกรณีเกิดปัญหา}

## 3. Implementation Checklist
- [ ] Task 1.1: {เขียน Regression Test เพื่อ reproduce บั๊ก}
- [ ] Task 1.2: {แก้ไขโค้ดที่จุดเกิดเหตุ}
- [ ] Task 1.3: {รันชุดทดสอบเพื่อยืนยันว่าบั๊กหายและไม่กระทบจุดอื่น}

## 4. Implementation Record
- *(จะถูกบันทึกเมื่อรัน /implement)*

## 5. Verification Evidence
- *(จะถูกบันทึกเมื่อรัน /check)*

## 6. Release & Handoff
- *(จะถูกบันทึกเมื่อรัน /complete)*
```

### 3. Update Workspace Status
Update `devflow/context/current-stage.md`:
- `Active Running ID`: `{RUNNING_ID}`
- `Current Stage`: `fix (Fast-Track -> Ready for /implement)`
- `Living Spec`: `devflow/runs/{RUNNING_ID}/spec.md`
- `Last Updated`: `{YYYY-MM-DD}`

### 4. Output Summary & Next Step
Report to the user:
- Running ID and allocated branch
- Summary of Scope, Reproduction, and Acceptance Criteria
- Living Spec path: `devflow/runs/{RUNNING_ID}/spec.md`
- **Next Command**: `/implement` (or `/implement {RUNNING_ID}`)
