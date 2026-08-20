---
name: fix
description: "[Devflow] Fast-Track Fix stage in DevFlow (Blueprint Mode) - define, spec, plan, and create the living current-feature.md contract in context for bug fixes."
argument-hint: "{bug description, issue ID, or IDEA-xxx}"
---

# Fast-Track: Fix (Blueprint Mode)

$ARGUMENTS

Fast-Track entry point combining Bug Triage, Root Cause Isolation, Specification, and Implementation Planning into one streamlined, review-gated step for **bug fixes and hotfixes**. Creates and maintains the **Single Living Spec (`devflow/context/current-feature.md`)** for the fix run.

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

### 1. Single Active Run Guardrail (One Thing at a Time)
1. Inspect `devflow/context/current-stage.md` and `devflow/context/current-feature.md`.
2. If `Active Running ID` is not `None` and `Current Stage` is not `Idle`, or if `current-feature.md` contains an active uncompleted spec:
   - **HALT and reject opening a new fix**.
   - Explain to the user that an active run is currently in progress:
     > ⚠️ *"มีงาน `{active_id}` กำลังดำเนินการอยู่ กรุณาปิดงานเดิมด้วย `/complete` หรือ `70-release` (หรือสั่ง `/rollback`) ก่อนเริ่มงานใหม่"*

### 2. Work Identity & Issue Intake
1. **Idea / Issue Inbox Intake**: If the argument is an identifier (e.g. `IDEA-001`):
   - Read `devflow/ideas.md` or issue notes and extract problem statement and root cause hints.
   - In `devflow/ideas.md`, update status to `[x] Claimed ({ID})` and move under `## 📦 Archived / Shipped Ideas`.
2. Inspect `devflow/history/HISTORY.md` and determine the next sequential ID without prefix (e.g. `022-{slug}`).
3. Identify Git branch naming:
   - `fix/{xxx-slug}`

### 3. Generate the Living Spec (`devflow/context/current-feature.md`)
Write `devflow/context/current-feature.md` using the structured template below in **Thai (`th`)**:

```markdown
# 📐 [{ID}] {Bug/Fix Title} (Living Spec)

> **Status**: In-Progress  
> **Track**: Fast-Track (Blueprint Mode - Fix)  
> **Category**: Fix  
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

### 4. Update Workspace Status
Update `devflow/context/current-stage.md`:
- `Active Discovery ID`: `None`
- `Active Running ID`: `{ID}`
- `Current Stage`: `fix (Fast-Track -> Ready for /implement)`
- `Living Spec`: `devflow/context/current-feature.md`
- `Last Updated`: `{YYYY-MM-DD}`

### 5. Output Summary & Next Step
Report to the user:
- Running ID and allocated branch
- Summary of Scope, Reproduction, and Acceptance Criteria
- Explicit next step: `/implement`
