---
name: feature
description: "[Devflow] Fast-Track Feature stage in DevFlow (Blueprint Mode) - define, spec, plan, and create the living spec.md contract for new features."
argument-hint: "{feature title, IDEA-xxx, or feature description}"
---

# Fast-Track: Feature (Blueprint Mode)

$ARGUMENTS

Fast-Track entry point combining Discovery, Definition, Specification, and Implementation Planning into one streamlined, review-gated step for **new features or enhancements**. Creates and maintains the **Single Living Spec (`spec.md`)** for the feature run. Supports intake from Idea Inbox (`IDEA-xxx`).

## Invocations & Aliases

- `/feature <title>` or `feature <title>`: Fast-Track feature specification
- `/feature IDEA-xxx`: Intake and promote a pending idea from `devflow/ideas.md`
- `$feature`: Codex CLI invocation

## Fast-Track Mainline Workflow

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

## Behavior & Contract

When invoked:

### 1. Work Identity & Idea Intake
1. Inspect `devflow/context/current-stage.md` and `devflow/runs/`.
2. **Idea Inbox Intake**: If the argument is an idea identifier (e.g. `IDEA-001`):
   - Read `devflow/ideas.md` and extract the idea's title, raw problem statement, AI Feasibility notes, and Quick Seed points.
   - Use these details as the primary input for Specification & Scope.
   - In `devflow/ideas.md`, update the item's status to `[x] Claimed ({RUNNING_ID})` and move it under `## 📦 Archived / Shipped Ideas`.
3. Determine or allocate the sequential Running ID (e.g. `RUN-018-{slug}`).
4. Identify Git branch naming:
   - `feature/{slug}-{RUNNING_ID}`
5. Create directory `devflow/runs/{RUNNING_ID}/`.

### 2. Generate the Single Living Spec (`spec.md`)
Write `devflow/runs/{RUNNING_ID}/spec.md` using the structured template below in **Thai (`th`)**:

```markdown
# 📐 [{RUNNING_ID}] {Feature Title} (Living Spec)

> **Status**: In-Progress  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
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

### 3. Update Workspace Status
Update `devflow/context/current-stage.md`:
- `Active Running ID`: `{RUNNING_ID}`
- `Current Stage`: `feature (Fast-Track -> Ready for /implement)`
- `Living Spec`: `devflow/runs/{RUNNING_ID}/spec.md`
- `Last Updated`: `{YYYY-MM-DD}`

### 4. Output Summary & Next Step
Report to the user:
- Running ID and allocated branch
- Summary of Scope and Acceptance Criteria
- Living Spec path: `devflow/runs/{RUNNING_ID}/spec.md`
- If promoted from `IDEA-xxx`, confirm status update in `devflow/ideas.md`
- **Next Command**: `/implement` (or `/implement {RUNNING_ID}`)
