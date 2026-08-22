---
name: feature
description: "[Devflow] Fast-Track Feature stage in DevFlow (Blueprint Mode) - turn a build-plan item, idea, or new requirement into the living current-feature.md contract."
argument-hint: "{feature title, number, IDEA-xxx, or empty for next item}"
---

# Fast-Track: Feature (Blueprint Mode)

$ARGUMENTS

Fast-Track entry point combining Discovery, Definition, Specification, and Implementation Planning into one streamlined, review-gated step for **new features or enhancements**. Creates and maintains the **Single Living Spec (`devflow/context/current-feature.md`)** for the feature run. Supports intake from Build Plan (`devflow/build-plan.md`) or Idea Inbox (`IDEA-xxx`).

## Invocations & Aliases

- `/feature`: Specs the next unchecked feature from `devflow/build-plan.md`
- `/feature <number | title>`: Specs a specific feature from the build plan or a new requirement
- `/feature IDEA-xxx`: Intake and promote a pending idea from `devflow/ideas.md`
- `$feature`: Codex CLI invocation

## Fast-Track Mainline Workflow

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

## Behavior & Contract

When invoked:

### 1. Single Active Run Guardrail (One Thing at a Time)
1. Inspect `devflow/context/current-stage.md` and `devflow/context/current-feature.md`.
2. If `Active Running ID` is not `None` and `Current Stage` is not `Idle`, or if `current-feature.md` contains an active uncompleted spec:
   - **HALT and reject opening a new feature**.
   - Explain to the user that an active run is currently in progress:
     > ⚠️ *"มีงาน `{active_id}` กำลังดำเนินการอยู่ กรุณาปิดงานเดิมด้วย `/complete` หรือ `70-deliver` (หรือสั่ง `/rollback`) ก่อนเริ่มงานใหม่"*

### 2. Work Identity & Source Resolution
1. **No Argument**:
   - Inspect `devflow/build-plan.md` (or `devflow/ideas.md`).
   - Pick the first unchecked feature (`- [ ]`) in sequence.
2. **Idea Inbox Intake**: If the argument is an idea identifier (e.g. `IDEA-001`):
   - Read `devflow/ideas.md` and extract the idea's title, raw problem statement, AI Feasibility notes, and Quick Seed points.
   - Use these details as the primary input for Specification & Scope.
   - In `devflow/ideas.md`, update the item's status to `[x] Claimed ({ID})` and move it under `## 📦 Archived / Shipped Ideas`.
3. **Number or Title**:
   - Match item in `devflow/build-plan.md` or treat as a new planned addition.
4. Inspect `devflow/history/HISTORY.md` and determine the next sequential ID without prefix (e.g. `022-{slug}`).
5. Identify Git branch naming:
   - `feature/{xxx-slug}`

### 3. Generate the Living Spec (`devflow/context/current-feature.md`)
Write `devflow/context/current-feature.md` using the structured template below in **Thai (`th`)**:

```markdown
# 📐 [{ID}] {Feature Title} (Living Spec)

> **Status**: In-Progress  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `{branch_name}`  
> **Created Date**: {YYYY-MM-DD}  
> **Owner**: {Contributor or Team}  

---

## 1. Specification & Scope
- **Problem Statement**: {ปัญหาหรือที่มาของฟีเจอร์นี้}
- **In-Scope**:
  - {ขอบเขตสิ่งที่ต้องทำสำหรับฟีเจอร์นี้}
- **Out-of-Scope**:
  - {สิ่งที่ไม่ทำในรอบนี้}
- **Acceptance Criteria**:
  - [ ] AC-1: {เงื่อนไขการตรวจรับข้อที่ 1}
  - [ ] AC-2: {เงื่อนไขการตรวจรับข้อที่ 2}

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `{path/to/file1}`: {หน้าที่ที่ต้องสร้าง/แก้ไข}
  - `{path/to/file2}`: {หน้าที่ที่ต้องสร้าง/แก้ไข}
- **Test Decision**: `Required (TDD)` | `Manual/Command Only` | `Not Required`
  - *Rationale*: {เหตุผลความจำเป็นในการเขียนเทสต์}
  - *Planned Cases*: {กรณีทดสอบหลักตาม AAA Pattern}
- **Impact & Rollback Strategy**:
  - *Impact*: {ผลกระทบต่อโมดูลอื่น}
  - *Rollback*: {วิธีย้อนคืนการทำงานกรณีเกิดปัญหา}

## 3. Implementation Checklist
- [ ] Task 1.1: {งานย่อยข้อที่ 1}
- [ ] Task 1.2: {งานย่อยข้อที่ 2}
- [ ] Task 1.3: {งานย่อยข้อที่ 3}

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
- `Current Stage`: `feature (Fast-Track -> Ready for /implement)`
- `Living Spec`: `devflow/context/current-feature.md`
- `Last Updated`: `{YYYY-MM-DD}`

### 5. Output Summary & Next Step
Report to the user:
- Running ID and allocated branch
- Summary of Scope and Acceptance Criteria
- Explicit next step: `/implement`
