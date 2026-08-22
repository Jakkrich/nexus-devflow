---
name: feature
description: "[Devflow] Fast-Track Feature stage in DevFlow (Blueprint Mode) - turn a build-plan item, sub-feature (4a, 4b), idea, or requirement into the living current-feature.md contract with automatic sizing & splitting."
argument-hint: "{feature title, number, 4a, IDEA-xxx, or empty for next item}"
---

# Fast-Track: Feature (Blueprint Mode)

$ARGUMENTS

Fast-Track entry point combining Discovery, Definition, Specification, and Implementation Planning into one streamlined, review-gated step for **new features or enhancements**. Creates and maintains the **Single Living Spec (`devflow/context/current-feature.md`)** for the feature run. Supports intake from Build Plan (`devflow/build-plan.md`), Sub-features (`4a`, `4b`), or Idea Inbox (`IDEA-xxx`).

Includes built-in **Multi-Factor Sizing Heuristic & Interactive Split Gate** to prevent context overflow on oversized tasks (`L`/`XL`).

---

## Invocations & Aliases

- `/feature`: Specs the next unchecked feature from `devflow/build-plan.md`
- `/feature <number | title>`: Specs a specific feature from the build plan or a new requirement
- `/feature <number[a-z]>` (e.g. `/feature 4a`): Specs a specific sub-feature
- `/feature IDEA-xxx`: Intake and promote a pending idea from `devflow/ideas.md`
- `$feature`: Codex CLI invocation

---

## Fast-Track Mainline Workflow

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

---

## Behavior & Contract

When invoked:

### 1. Single Active Run Guardrail (One Thing at a Time)
1. Inspect `devflow/context/current-stage.md` and `devflow/context/current-feature.md`.
2. If `Active Running ID` is not `None` and `Current Stage` is not `Idle`, or if `current-feature.md` contains an active uncompleted spec:
   - **HALT and reject opening a new feature**.
   - Explain to the user that an active run is currently in progress:
     > ⚠️ *"มีงาน `{active_id}` กำลังดำเนินการอยู่ กรุณาปิดงานเดิมด้วย `/complete` หรือ `70-deliver` (หรือสั่ง `/rollback`) ก่อนเริ่มงานใหม่"*

---

### 2. Sizing Heuristic & Sub-Feature Splitting Engine

Before locking the spec, evaluate the target scope:

1. **Multi-Factor Sizing Heuristic**:
   - **Files Touched**: $\ge 6$ files predicted to be created or modified.
   - **Architectural Layers**: $\ge 3$ distinct layers (e.g. DB Schema/Migration + Backend API + Frontend UI + State Store).
   - **Task Complexity**: $\ge 6$ checklist tasks or heavy multi-service integrations.
2. **Interactive Split Gate**:
   - If the feature is assessed as `L` or `XL` and no explicit sub-feature notation (`4a`) was requested:
     - **Draft Sub-Feature Proposals**: Break into 2-3 focused sub-features (e.g. `4a: Backend Schema & Core APIs (Size: M)`, `4b: Frontend UI & Client State (Size: M)`).
     - **Prompt User in Thai**:
       > ⚠️ *"ฟีเจอร์นี้มีขนาดใหญ่ (`L`/`XL`) เพื่อรักษาคุณภาพและป้องกัน Context Overflow แนะนำให้แบ่งเป็น sub-features ดังนี้:*  
       > *- `4a: [ขอบเขตย่อยส่วนที่ 1]` (Size: M)*  
       > *- `4b: [ขอบเขตย่อยส่วนที่ 2]` (Size: M)*  
       > *คุณต้องการให้เปิด Spec เริ่มทำ `4a` ทันทีเลยไหมครับ?"*
     - If the user confirms or provides a sub-feature argument (e.g. `4a`), proceed with the sub-feature spec.

---

### 3. Work Identity & Source Resolution

1. **No Argument**:
   - Inspect `devflow/build-plan.md` (or `devflow/ideas.md`).
   - Pick the first unchecked feature (`- [ ]`) or sub-feature (`- [ ] 4a.`) in sequence.
2. **Sub-Feature Notation** (e.g. `4a`, `038b-slug`):
   - Allocate sub-feature running ID with alpha suffix: `xxx[a-z]-slug` (e.g. `038a-auth-schema-and-api`).
   - Set Git branch: `feature/xxx[a-z]-slug`.
3. **Idea Inbox Intake** (e.g. `IDEA-001`):
   - Read `devflow/ideas.md` and extract the idea's title, raw problem statement, AI Feasibility notes, and Quick Seed points.
   - In `devflow/ideas.md`, update the item's status to `[x] Claimed ({ID})` and move it under `## 📦 Archived / Shipped Ideas`.
4. **Number or Title**:
   - Match item in `devflow/build-plan.md` or treat as a new planned addition.
5. Determine next sequential ID:
   - For standard feature: `xxx-slug` (e.g. `038-payment-gateway`).
   - For sub-feature: `xxx[a-z]-slug` (e.g. `038a-payment-api`, `038b-payment-ui`).
6. Identify Git branch naming:
   - `feature/{ID}`

---

### 4. Generate the Living Spec (`devflow/context/current-feature.md`)

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

---

### 5. Update Workspace Status
Update `devflow/context/current-stage.md`:
- `Active Discovery ID`: `None`
- `Active Running ID`: `{ID}`
- `Current Stage`: `feature (Fast-Track -> Ready for /implement)`
- `Living Spec`: `devflow/context/current-feature.md`
- `Last Updated`: `{YYYY-MM-DD}`

---

### 6. Output Summary & Next Step
Report to the user in **Thai (`th`)**:
- Running ID and allocated branch (`feature/{ID}`)
- Summary of Scope, Acceptance Criteria, and Sizing evaluation
- Explicit next step: `/implement` (หรือ `$implement`)
