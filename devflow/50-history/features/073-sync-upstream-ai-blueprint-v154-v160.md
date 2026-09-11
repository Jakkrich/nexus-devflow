# 📐 [073-sync-upstream-ai-blueprint-v154-v160] Sync Upstream AI Blueprint (v1.5.4 – v1.6.0)

> **Status**: Completed  
> **Track**: Fast-Track (Task-Isolated Living Spec Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 28` & `devflow/discoveries/DISC-20260907-001-sync-upstream-ai-blueprint-v154-v160/discovery.md`  
> **Branch**: `feature/073-sync-upstream-ai-blueprint-v154-v160`  
> **Started Date**: 2026-09-07  
> **Delivered Date**: 2026-09-07  
> **Owner**: DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement
Upstream AI Blueprint ได้ปล่อยเวอร์ชัน `v1.5.4` และ `v1.6.0` ซึ่งนำเสนอนวัตกรรมและการปรับปรุงความทนทานสำคัญ 4 ด้าน:
1. **Automatic Independent Review (`v1.6.0` - `0497634`)**: ระบบตรวจทานอิสระผ่าน Isolated Child Subagent อัตโนมัติ พร้อมการบันทึก Metadata `Requested execution`, `Actual execution`, `Reviewer context` (`fresh subagent` vs `fresh session`) และการปรับค่าคอนฟิก `review.independentExecution`
2. **Post-Implementation Walkthroughs (`v1.5.4` - `54d6972`)**: การนำเสนอ Read-only Architecture & Code Tour ให้แก่ผู้ใช้เมื่อการ Implement เสร็จสมบูรณ์
3. **Hardened Status & Spec Heading Contracts (`v1.5.4` / `v1.6.0` - `65ee2b1`, `0916d72`)**: ป้องกัน False Attention Badges ใน Dashboard ด้วยการบังคับใช้ Contract หัวข้อที่แม่นยำ (`# Feature: <title>`, `# Fix: <title>`, `# Rollback: Feature <id> - <title>`)
4. **Dashboard Roadmap Focus & Sortable Findings (`v1.6.0` - `c414ce1`, `4d4ccc1`)**: ปรับปรุงหน้าต่างแสดงผล Dashboard ให้รองรับการ Sort/Filter Findings และเน้นเฉพาะ Active Roadmap

Nexus-DevFlow จำเป็นต้องนำเข้าและปรับใช้ (Port & Adapt) ความสามารถเหล่านี้เข้าสู่ **The 3-Pillars Architecture & Task-Isolated Living Spec Model** เพื่อคงความเข้ากันได้แบบ Super-set และยกระดับประสิทธิภาพความปลอดภัยสูงสุด

### 1.2 In-Scope
1. **Project Configuration & Review Policy (`config.json` & `project-config.ts`)**:
   - เพิ่ม `review.independentExecution` (`"automatic"` | `"manual"`, default: `"automatic"`)
   - ปรับค่าเริ่มต้นของ `qualityGates.regular.independentReview` และ `qualityGates.continuous.independentReview` เป็น `"when-sensitive"`
2. **Review Engine Metadata Expansion (`review.ts`)**:
   - รองรับการ Parse และ Verify ฟิลด์ `Requested execution`, `Actual execution`, `Reviewer context` (`fresh session` | `fresh subagent`)
   - รองรับ Backward Compatibility สำหรับ Legacy Requests/Receipts และ Multi-run context path resolution
3. **Automatic Independent Review & Post-Implementation Walkthroughs in Skills**:
   - อัปเดตสคิล `audit` (`SKILL.md` และ `reference/independent-review.md`) รองรับการ Spawn Generic Isolated Subagent
   - อัปเดต `implement`, `autopilot`, `continuous`, `complete`, `doctor`, `onboard`, `status`, `ci` สอดคล้องกันทั้งใน `.agents/` และ `.claude/`
   - เพิ่มตัวเลือก Code Walkthrough หลังจบงานใน `implement`, `autopilot` และ `devflow/context/ai-interaction.md`
4. **Status & Dashboard Hardening**:
   - เพิ่ม Strict Heading Parsing ใน `current-work.ts` และ `status.ts`
   - ปรับปรุง Sortable Findings Table และ Focused Active Roadmap ใน `dashboard.ts` และ `dashboard-page.ts`
5. **Contract Validation & Comprehensive Test Suites**:
   - อัปเดต `scripts/validate-framework.ts` ให้ Assert การมีอยู่ของ Contracts ใหม่
   - เพิ่ม Unit Tests ใน `project-config.test.ts`, `review.test.ts`, `status.test.ts`, `dashboard.test.ts`
   - ยืนยันการรัน `npm run check`, `npm run check:static`, `npm test`, `npm run test:package` ผ่าน 100%

### 1.3 Out-of-Scope
- ไม่แตะต้องโครงสร้าง 3-Pillars (`devflow/ideas.md`, `devflow/context/{xxx-slug}/`, `devflow/history/`)
- ไม่กระทบสคิลเฉพาะตัวของ DevFlow (`bughunter`, `archify`, `diagram-design`, `report-html`, `convert-any-to-md`, `analyze`)

### 1.4 Acceptance Criteria (เกณฑ์การยอมรับ)
- [x] **AC-1**: `devflow/config.json` และ `project-config.ts` รองรับ `review.independentExecution` (`"automatic"` | `"manual"`) และ Quality Gates ค่าเริ่มต้นเป็น `"when-sensitive"` อย่างถูกต้อง
- [x] **AC-2**: `review.ts` สามารถ Parse และเขียน Request/Receipt พร้อมฟิลด์ `Requested execution`, `Actual execution`, และ `Reviewer context` (`fresh session` หรือ `fresh subagent`) และรองรับ Legacy compatibility
- [x] **AC-3**: สคิล `audit` (ทั้ง `.agents/` และ `.claude/`) ระบุข้อกำหนดการ Spawn isolated child subagent เมื่อได้รับมอบหมายในโหมด `automatic` และ `implement` มีขั้นตอนเสนอ Read-only Walkthrough ให้ผู้ใช้
- [x] **AC-4**: `current-work.ts` และ `status.ts` บังคับใช้ Strict Heading Contracts และป้องกัน False Dashboard Attention State
- [x] **AC-5**: `scripts/validate-framework.ts` ตรวจสอบผ่านครบถ้วน และชุดทดสอบ `npm test`, `npm run test:package`, `npm run check` ผ่าน 100%

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `devflow/config.json` [MODIFY]
- `packages/create-nexus-devflow/lib/project-config.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/review.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/current-work.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/status.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/history.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/run-state.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/dashboard.ts` [MODIFY]
- `.agents/skills/audit/SKILL.md` [MODIFY]
- `.agents/skills/audit/reference/independent-review.md` [MODIFY]
- `.agents/skills/implement/SKILL.md` [MODIFY]
- `.agents/skills/autopilot/SKILL.md` [MODIFY]
- `.agents/skills/continuous/SKILL.md` [MODIFY]
- `.agents/skills/complete/SKILL.md` [MODIFY]
- `.agents/skills/doctor/SKILL.md` [MODIFY]
- `.agents/skills/onboard/SKILL.md` [MODIFY]
- `.agents/skills/status/SKILL.md` [MODIFY]
- `.agents/skills/ci/SKILL.md` [MODIFY]
- `.agents/skills/feature/SKILL.md` [MODIFY]
- `.agents/skills/fix/SKILL.md` [MODIFY]
- `.agents/skills/rollback/SKILL.md` [MODIFY]
- `.claude/skills/*` (ไฟล์คู่ขนานทั้งหมด) [MODIFY]
- `AGENTS.md` & `CLAUDE.md` [MODIFY]
- `devflow/context/ai-interaction.md` [MODIFY]
- `scripts/validate-framework.ts` [MODIFY]
- `packages/create-nexus-devflow/test/project-config.test.ts` [MODIFY]
- `packages/create-nexus-devflow/test/review.test.ts` [MODIFY]
- `packages/create-nexus-devflow/test/status.test.ts` [MODIFY]
- `packages/create-nexus-devflow/test/dashboard.test.ts` [MODIFY]
- `packages/create-nexus-devflow/test/current-work.test.ts` [MODIFY]
- `packages/create-nexus-devflow/test/history.test.ts` [MODIFY]
- `packages/create-nexus-devflow/test/run-state.test.ts` [MODIFY]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `when-sensitive`
- **UI Evidence / Browser Tests**: Not applicable (Framework Core & CLI Logic)
- **Review Strategy**: One feature-level review packet at completion

### 2.3 Test Decision: Required (TDD)
- **Rationale**: การปรับ Schema ของ Config, Review, Status และ Dashboard เป็นรากฐานสำคัญของระบบ จึงต้องมี Unit Tests และ Verification Contract ครอบคลุม 100%

---

## 3. Implementation Checklist (Strict TDD)

- [x] **Task 1: Project Config & Independent Review Schema Alignment**
  - [x] 1.1 `[TDD-Red]`: เพิ่มเคสทดสอบใน `test/project-config.test.ts` และ `test/review.test.ts` สำหรับ `review.independentExecution`, Quality Gate Defaults (`when-sensitive`), และ Receipt Fields (`Requested execution`, `Actual execution`, `Reviewer context: fresh subagent`)
  - [x] 1.2 `[TDD-Green]`: อัปเดต `lib/project-config.ts` และ `lib/review.ts` ให้รองรับ Schema ใหม่ และผ่านการทดสอบ
  - [x] 1.3 `[TDD-Refactor]`: ปรับแต่งโค้ด ตรวจสอบ Type Safety และ Edge cases สำหรับ Legacy Compatibility

- [x] **Task 2: Automatic Independent Review & Post-Implementation Walkthroughs in Skills**
  - [x] 2.1 `[TDD-Red]`: กำหนด Contract Assertions ใน `scripts/validate-framework.ts` สำหรับข้อกำหนด Subagent Spawning, Walkthrough Prompts และ Strict Heading
  - [x] 2.2 `[TDD-Green]`: อัปเดตสคิล `audit`, `implement`, `autopilot`, `continuous`, `complete`, `doctor`, `onboard`, `status`, `ci`, `feature`, `fix`, `rollback` ทั้งใน `.agents/` และ `.claude/` พร้อม `devflow/context/ai-interaction.md`, `AGENTS.md`, `CLAUDE.md`
  - [x] 2.3 `[TDD-Refactor]`: ตรวจสอบความสอดคล้องของภาษาไทยและภาษาอังกฤษในทุกสคิล

- [x] **Task 3: Dashboard & Status Reporting Hardening**
  - [x] 3.1 `[TDD-Red]`: เพิ่ม Unit Tests ใน `test/current-work.test.ts`, `test/history.test.ts`, `test/status.test.ts`, และ `test/dashboard.test.ts`
  - [x] 3.2 `[TDD-Green]`: อัปเดต `lib/current-work.ts`, `lib/status.ts`, `lib/history.ts`, `lib/run-state.ts`, และ `lib/dashboard.ts`
  - [x] 3.3 `[TDD-Refactor]`: ยืนยันว่าไม่มี False Attention State และตาราง Findings สามารถ Sort ได้อย่างถูกต้อง

- [x] **Task 4: Framework Verification & Full Package Verification**
  - [x] 4.1 `[TDD-Red]`: รัน `npm run check:static` และ `npm test` เพื่อหาจุดล้มเหลว
  - [x] 4.2 `[TDD-Green]`: ซ่อมแซมจุดที่ไม่ผ่านจนครบ 100%
  - [x] 4.3 `[TDD-Refactor]`: รัน `npm run check`, `npm test`, `npm run test:package` ผ่านสมบูรณ์

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `npm run check` (TypeScript typecheck & lint) -> PASSED
- **Automated Test Matrix**: `npm test` (143/143 tests passing) -> PASSED
- **Static Contract Verification**: `npm run check:static` (`scripts/validate-framework.ts` 39 skills, 32 core skills) -> PASSED
- **Package Smoke Test**: `npm run test:package` (112 overlay files created, 32 skills verified) -> PASSED
- **Findings Ledger**: ตรวจสอบ `findings.md` สะอาด 0 blockers -> PASSED

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [x] **AC-1**: `project-config.ts` มี `review.independentExecution` และ defaults เป็น `when-sensitive`
- [x] **AC-2**: `review.ts` จัดการ `Requested execution` / `Actual execution` / `Reviewer context` ได้สมบูรณ์
- [x] **AC-3**: สคิลทั้งหมดระบุ Subagent execution & Code walkthrough ชัดเจน
- [x] **AC-4**: `status.ts` และ `current-work.ts` รองรับ Strict Heading Contracts
- [x] **AC-5**: ทุก Automated Test Suites และ Static Check ผ่าน 100%

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: 2026-09-07
- **Verification Verdict**: Passed
- **Framework Tests**: 143 passed, 0 failed
- **Static Contract**: 39 skills in sync, 32 core skills, 0 drift
- **Package Smoke Test**: 100% clean overlay test passed
