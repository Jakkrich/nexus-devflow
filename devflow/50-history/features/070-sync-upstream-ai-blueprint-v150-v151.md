# 📐 [070-sync-upstream-ai-blueprint-v150-v151] ซิงก์ส่วนขยาย Upstream AI Blueprint (v1.5.0 – v1.5.1) — Hardened Run-State Engine & On-Demand Context Loading Protocol

> **Status**: Completed / Shipped  
> **Track**: Fast-Track (Task-Isolated Living Spec Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 23` & `devflow/discoveries/DISC-20260903-001-sync-upstream-ai-blueprint-v150-v151/discovery.md`  
> **Branch**: `feature/070-sync-upstream-ai-blueprint-v150-v151`  
> **Started Date**: 2026-09-03  
> **Delivered Date**: 2026-09-03  
> **Owner**: DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement
หลังจากที่ Nexus-DevFlow ได้ซิงก์ Core Lifecycle, Context Overhead Reduction (v1.3.0 – v1.4.1), และ Tooling Parity ใน Feature 067 และ 068 มีการอัปเกรดสำคัญจาก Upstream AI Blueprint ในเวอร์ชัน v1.5.0 และ v1.5.1 ดังนี้:
1. **Unprotected Dashboard Activity Writes**: ปัจจุบัน Agent ยังได้รับอนุญาตให้เขียนไฟล์ `devflow/.state/run.json` ด้วยมือโดยตรง ซึ่งเสี่ยงต่อการเกิด Malformed JSON, ฟิลด์ตกหล่น, ข้อความยาวเกินขนาด, หรือ Race Conditions ที่ทำให้ Dashboard พัง
2. **Skill Prompt Overhead**: การบรรจุ Spec Template และ Rollback Implementation Guide ขนาดยาวไว้ในไฟล์ `SKILL.md` โดยตรง ทำให้ทุกครั้งที่ AI โหลดคำสั่ง ต้องเสีย Token โดยไม่จำเป็น แม้ยังไม่ได้เขียน Spec หรือ Rollback จริง
3. **Missing Tooling Parity & Contract Tests**: ขาด CLI helper script `run-state.mjs` พร้อมชุดทดสอบอัตโนมัติ `run-state-helper.test.ts` และการตรวจสอบความถูกต้องของสัญญาสคิลใน `scripts/validate-framework.ts`

### 1.2 In-Scope
1. **Hardened Dashboard Activity Helper Script (`run-state.mjs`)**:
   - พอร์ตและปรับแต่ง `.agents/skills/doctor/scripts/run-state.mjs` และ `.claude/skills/doctor/scripts/run-state.mjs`
   - รองรับการทำงานกับ `devflow/.state/run.json`
   - รองรับ Actions ทั้ง 4: `start`, `update`, `finish`, `reset` พร้อม Schema validation, atomic file replacement, และ field length truncation
   - รองรับคำสั่งสคิลทั้งหมดของ Nexus-DevFlow (รวมสคิลหลักและ extensions รวม 38 สคิล)
2. **On-Demand Context Loading & Reference Extraction**:
   - เพิ่ม Directive มาตรฐาน `**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.` ในทุกๆ Core Skills
   - แยก Spec Template ออกจาก `feature/SKILL.md` ไปไว้ที่ `.agents/skills/feature/reference/feature-spec-template.md` และ `.claude/skills/feature/reference/feature-spec-template.md`
   - แยก Rollback Implementation Guide ออกจาก `implement/SKILL.md` ไปไว้ที่ `.agents/skills/implement/reference/rollback-implementation.md` และ `.claude/skills/implement/reference/rollback-implementation.md`
3. **Doctor & Status Diagnostics Hardening**:
   - ปรับปรุง `doctor/SKILL.md` และ `status/SKILL.md` ให้แนะนำและตรวจสอบการใช้ `run-state.mjs`
   - รองรับการตรวจจับและเสนอคำสั่ง `reset` กิจกรรมที่ค้างหรือไม่ถูกต้อง
4. **Framework Validation & Contract Tests**:
   - สร้างชุดทดสอบ `scripts/run-state-helper.test.ts` ทดสอบ CLI Helper ครบทุกคำสั่งและ Edge Cases (start, update, finish, reset, invalid args, max lengths)
   - อัปเดต `scripts/validate-framework.ts` ให้ Assert การมีอยู่ของ `run-state.mjs` และความถูกต้องของ Reference directories
   - อัปเดต `AGENTS.md` และ `CLAUDE.md` บันทึกกฎการใช้ `run-state.mjs` และ JIT Context Loading

### 1.3 Out-of-Scope
- ไม่เปลี่ยนแปลงโครงสร้าง 3-Pillars Workspace (`devflow/context/`, `devflow/history/`, `devflow/ideas.md`)
- ไม่กระทบพฤติกรรมของสคิลเฉพาะตัวของ DevFlow (`bughunter`, `archify`, `report-html`, `diagram-design`)
- คงการสื่อสารและ Artifacts ภาษาไทย (`th`) ไว้ตามเดิม

### 1.4 Acceptance Criteria (เกณฑ์การยอมรับ)
- [x] **AC-1**: มีไฟล์ `.agents/skills/doctor/scripts/run-state.mjs` และ `.claude/skills/doctor/scripts/run-state.mjs` ที่ทำงานได้ถูกต้องกับ `devflow/.state/run.json`
- [x] **AC-2**: รันคำสั่ง `node .agents/skills/doctor/scripts/run-state.mjs start|update|finish|reset` ได้ผลลัพธ์ Atomic Write และ Schema Validation ถูกต้อง 100%
- [x] **AC-3**: มี Reference Templates ใน `.agents/skills/feature/reference/feature-spec-template.md` และ `implement/reference/rollback-implementation.md` (รวมถึง `.claude/`)
- [x] **AC-4**: เอกสาร `AGENTS.md` และ `CLAUDE.md` มีกฎการเรียกใช้ `run-state.mjs` และ On-demand context loading ชัดเจน
- [x] **AC-5**: สร้างและรันชุดทดสอบ `scripts/run-state-helper.test.ts` ผ่าน 100%
- [x] **AC-6**: `scripts/validate-framework.ts` มีการตรวจสอบ `run-state.mjs` และ contract ครบถ้วน (0 errors)
- [x] **AC-7**: การทดสอบทั้งหมด (`npm test`, `npm run check:static`, `npm run test:package`) ผ่าน 100%

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `.agents/skills/doctor/scripts/run-state.mjs` [NEW]
- `.claude/skills/doctor/scripts/run-state.mjs` [NEW]
- `.agents/skills/feature/reference/feature-spec-template.md` [NEW]
- `.claude/skills/feature/reference/feature-spec-template.md` [NEW]
- `.agents/skills/implement/reference/rollback-implementation.md` [NEW]
- `.claude/skills/implement/reference/rollback-implementation.md` [NEW]
- `scripts/run-state-helper.test.ts` [NEW]
- `.agents/skills/doctor/SKILL.md` [MODIFY]
- `.claude/skills/doctor/SKILL.md` [MODIFY]
- `.agents/skills/status/SKILL.md` [MODIFY]
- `.claude/skills/status/SKILL.md` [MODIFY]
- `.agents/skills/feature/SKILL.md` [MODIFY]
- `.claude/skills/feature/SKILL.md` [MODIFY]
- `.agents/skills/implement/SKILL.md` [MODIFY]
- `.claude/skills/implement/SKILL.md` [MODIFY]
- `AGENTS.md` [MODIFY]
- `CLAUDE.md` [MODIFY]
- `agent-bundle.manifest.json` [MODIFY]
- `packages/create-nexus-devflow/scripts/prepare-template.ts` [MODIFY]
- `scripts/validate-framework.ts` [MODIFY]
- `package.json` [MODIFY]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `manual` (งานปรับปรุง Developer Tooling และ Script Helper ภายใน ไม่แตะต้อง authentication, secrets, หรือ external payments)
- **UI Evidence / Browser Tests**: Not applicable (ไม่มี Web UI frontend)
- **Review Strategy**: One feature-level review packet at completion

### 2.3 Test Decision: Required (TDD)
- **Rationale**: การสร้าง CLI Script `run-state.mjs` จำเป็นต้องมีชุดทดสอบครอบคลุมทุก Action, Edge cases และ Error handling (`run-state-helper.test.ts`)

---

## 3. Implementation Checklist (Strict TDD)

- [x] **Task 1: Hardened Run-State CLI Helper Script**
  - [x] 1.1 `[TDD-Red]`: สร้างโครงร่าง `scripts/run-state-helper.test.ts` สำหรับทดสอบคำสั่ง start, update, finish, reset
  - [x] 1.2 `[TDD-Green]`: สร้าง `.agents/skills/doctor/scripts/run-state.mjs` และ `.claude/skills/doctor/scripts/run-state.mjs` ให้รองรับโครงสร้าง `devflow/.state/run.json`
  - [x] 1.3 `[TDD-Refactor]`: รัน `npm test` เพื่อยืนยันว่า `run-state-helper.test.ts` ผ่านการทดสอบทั้งหมด (5/5 tests green)

- [x] **Task 2: Reference Extraction & On-Demand Context Optimization**
  - [x] 2.1 สกัด Template ออกเป็น `.agents/skills/feature/reference/feature-spec-template.md` และ `.claude/skills/feature/reference/feature-spec-template.md`
  - [x] 2.2 สกัด Rollback Guide ออกเป็น `.agents/skills/implement/reference/rollback-implementation.md` และ `.claude/skills/implement/reference/rollback-implementation.md`
  - [x] 2.3 ปรับปรุง `feature/SKILL.md` และ `implement/SKILL.md` ให้มี Context reuse directive และชี้นำไปยังโฟลเดอร์ `reference/`

- [x] **Task 3: Doctor, Status, AGENTS.md & CLAUDE.md Alignment**
  - [x] 3.1 อัปเดต `AGENTS.md` และ `CLAUDE.md` ให้ระบุคำสั่งและกฎการใช้ `node .agents/skills/doctor/scripts/run-state.mjs`
  - [x] 3.2 ปรับปรุง `doctor/SKILL.md` และ `status/SKILL.md` ให้ตรวจจับ Malformed activity และเสนอคำสั่ง Reset
  - [x] 3.3 เพิ่ม Context reuse directive ให้กับ Core Skills อื่นๆ

- [x] **Task 4: Framework Validation & Multi-Lane Verification**
  - [x] 4.1 อัปเดต `scripts/validate-framework.ts` และ `agent-bundle.manifest.json` ให้ตรวจ Assert ความถูกต้องของ `run-state.mjs` และ References
  - [x] 4.2 รัน `npm run check` (Typecheck + DevFlow Check ผ่าน 100%)
  - [x] 4.3 รัน `npm test` (154/154 unit tests green) และ `npm run test:package` (Smoke test overlay passed)
  - [x] 4.4 รัน `npm run check:upstream` ยืนยันสถานะความสอดคล้องกับ Upstream (100% Upstream Skills Parity)

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `npm run check` passed with 0 TypeScript and DevFlow integrity errors.
- **Automated Test Matrix**: 134 package tests + 4 overview tests + 11 sandbox tests + 5 run-state helper tests passed (`npm test` 154/154 green).
- **Routing Evals Matrix**: `npm run test:evals` evaluated 152 test cases across 38 skills with 100.00% Rank 1 match accuracy.
- **Static Contract Verification**: `npm run check:static` passed with 0 issues across all 31 core skills, 7 extensions, and 8 contract specifications.
- **Package Smoke Test**: `npm run test:package` passed successfully, verified 31 core skills and clean template overlay extraction.
- **Upstream Drift Monitor**: `npm run check:upstream` verified 100% Upstream Skills Parity.
- **Findings Ledger**: ตรวจสอบ `findings.md` สะอาด 100% (0 Blockers, 0 Critical, 0 Warnings).

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [x] **AC-1**: มีไฟล์ `run-state.mjs` ในทั้ง `.agents/` และ `.claude/`
- [x] **AC-2**: รันคำสั่ง `run-state.mjs` start/update/finish/reset ได้ถูกต้อง 100%
- [x] **AC-3**: มี Reference Templates ใน `feature/reference/` และ `implement/reference/`
- [x] **AC-4**: `AGENTS.md` และ `CLAUDE.md` ระบุกฎการใช้ `run-state.mjs`
- [x] **AC-5**: `run-state-helper.test.ts` ผ่าน 100%
- [x] **AC-6**: `validate-framework.ts` ผ่าน 100%
- [x] **AC-7**: Multi-lane tests green 100%

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: 2026-09-03
- **Verification Verdict**: Passed (0 Blockers, 0 P0/P1 Findings)
- **Framework Tests**: 154/154 Passed
- **Static Contract**: 100% Validated
- **Package Smoke Test**: 100% Overlay Success
