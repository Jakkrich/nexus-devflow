# 📐 [052-strict-tdd-and-two-stage-review-guardrails] อัปเกรด Strict TDD Sub-tasks และ Two-Stage Review Pattern ใน Nexus-DevFlow

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feat/052-strict-tdd-and-two-stage-review`  
> **Created Date**: 2026-08-24  
> **Completed Date**: 2026-08-24  
> **Owner**: Maintainer & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement & Background
1. ในการทำงานร่วมกับ AI Coding Agents (เช่น Antigravity, Claude Code, Codex, Cursor) เอเจนต์มักมีแนวโน้มที่จะรีบเขียนโค้ด Production ทันทีโดยไม่มีเทสต์คุม หรือเขียนเทสต์ย้อนหลังหลังจากเขียนโค้ดเสร็จแล้ว ทำให้ขาดวินัยการตรวจสอบว่าเทสต์สามารถจับข้อผิดพลาด (Failure) ได้จริงหรือไม่
2. การตรวจสอบคุณภาพในขั้นตอนการ Verification (`50-verify`, `/check`) มักรวมการตรวจความถูกต้องตามสเปก (Spec Fidelity) และการตรวจคุณภาพโค้ด/ความปลอดภัย (Code Quality & Security) ไว้ด้วยกัน ทำให้บางครั้งฟีเจอร์ผ่านเกณฑ์ทางเทคนิค (Typecheck, Lint) แต่หลุดข้อกำหนดสำคัญของสเปก หรือในทางกลับกัน ทำงานได้ตามสเปกแต่ทิ้งหนี้ทางเทคนิคและช่องโหว่ความปลอดภัยไว้
3. สกิล `/debug` ขาดขั้นตอนที่เป็นระบบ (Systematic 4-Step Protocol) ส่งผลให้ AI บางครั้งใช้วิธีคาดเดาสุ่มแก้โค้ด

### 1.2 In-Scope
1. **Strict TDD (Red-Green-Refactor) Protocol & Sub-Tasks**:
   - อัปเกรดมาตรฐานใน `devflow/context/coding-standards.md` และ `devflow/context/ai-interaction.md` ให้ระบุวงจร Red-Green-Refactor อย่างชัดเจน
   - ปรับปรุง `.agents/skills/30-plan/SKILL.md` และ `.agents/skills/feature/SKILL.md` ให้รองรับการย่อย Task งานเขียนโค้ดเป็นหน่วยไมโคร 2-5 นาที พร้อมแท็กกำกับ TDD ชัดเจน เช่น `[TDD-Red]`, `[TDD-Green]`, `[TDD-Refactor]`
   - ปรับปรุง `.agents/skills/40-execute/SKILL.md` และ `.agents/skills/implement/SKILL.md` ให้บังคับรันเทสต์ให้เห็นว่าล้ม (Red) ก่อนเสมอ แล้วจึงเขียนโค้ดขั้นต่ำเพื่อให้ผ่าน (Green) และ Refactor โค้ด
2. **Two-Stage Review Pattern**:
   - ปรับปรุง `.agents/skills/50-verify/SKILL.md` และ `.agents/skills/check/SKILL.md` ให้แบ่งการตรวจออกเป็น 2 ชั้นเด็ดขาด:
     - **Stage 1 (Spec & Acceptance Criteria Gate)**: ตรวจสอบความถูกต้องครบถ้วนตาม `current-feature.md` หรือ `20-spec.md` (Spec Fidelity, Invariants, Edge Cases)
     - **Stage 2 (Code Quality, Security & Architecture Gate)**: ตรวจสอบ Typecheck, Lint, Test Coverage, Null-safety, Input Sanitization, และ Findings Ledger State Machine
   - ปรับปรุง `packages/create-nexus-devflow/lib/gatekeeper.ts` ให้สรุปและแสดงผลสถานะ Two-Stage Review ใน Gate Evaluation
3. **4-Step Systematic Debugging Protocol**:
   - ปรับปรุง `.agents/skills/debug/SKILL.md` ให้บังคับ 4 ขั้นตอน: 1. Minimal Reproduction -> 2. Hypothesis & Isolation -> 3. Root Cause Confirmation -> 4. Repair Handoff
4. **Tool Adapters & Template Synchronization**:
   - ซิงก์การเปลี่ยนแปลงจาก `.agents/skills/` ไปยัง `.claude/skills/` ด้วย `scripts/sync-adapters.js`
   - อัปเดตไฟล์เทมเพลตใน `packages/create-nexus-devflow` เพื่อให้โปรเจกต์ใหม่ได้รับมาตรฐานนี้อัตโนมัติ
   - เพิ่ม/ปรับปรุง Automated Unit Tests และรัน Validation Suite ทั้งหมด

### 1.3 Acceptance Criteria
- [x] **AC-1**: `coding-standards.md` และ `ai-interaction.md` มีข้อกำหนด Strict TDD (Red-Green-Refactor) และ Two-Stage Review Pattern ครบถ้วน
- [x] **AC-2**: Skills `30-plan`, `40-execute`, `50-verify`, `feature`, `implement`, `check`, และ `debug` ได้รับการอัปเกรดทั้งใน `.agents/` และ `.claude/`
- [x] **AC-3**: `gatekeeper.ts` รองรับการประเมิน Two-Stage Review และมี Unit Test ทดสอบความถูกต้อง
- [x] **AC-4**: เทมเพลตสำหรับติดตั้งใน `packages/create-nexus-devflow` ได้รับการซิงก์ตรงกัน
- [x] **AC-5**: รัน `npm run check` และ `npm test` ผ่าน 100% (ทุกเทสต์เขียวสมบูรณ์)

---

## 2. Plan & Test Strategy

### 2.1 Files to Modify / Create
- `devflow/context/coding-standards.md` (Update Strict TDD & Two-Stage Review guidelines)
- `devflow/context/ai-interaction.md` (Update Agent interaction guidelines for TDD & Reviews)
- `.agents/skills/30-plan/SKILL.md` (Update TDD Sub-task breakdown rules)
- `.agents/skills/40-execute/SKILL.md` (Update Red-Green-Refactor execution mandate)
- `.agents/skills/50-verify/SKILL.md` (Update Two-Stage Review matrix)
- `.agents/skills/feature/SKILL.md` (Update Fast-Track spec & TDD rules)
- `.agents/skills/implement/SKILL.md` (Update Fast-Track TDD execution rules)
- `.agents/skills/check/SKILL.md` (Update Fast-Track Two-Stage Review structure)
- `.agents/skills/debug/SKILL.md` (Update 4-Step Systematic Debugging protocol)
- `packages/create-nexus-devflow/lib/gatekeeper.ts` (Integrate Two-Stage Review reporting)
- `packages/create-nexus-devflow/test/gatekeeper.test.ts` (Add unit tests for Two-Stage Review evaluation)
- Sync `.claude/skills/` via `node scripts/sync-adapters.js`

### 2.2 Test Decision
- **Test Decision**: `Required (TDD & Regression Test Suite)`
- **Test Command**: `npm test` + `npm run check`

---

## 3. Implementation Checklist

- [x] **Step 1: Update Core Coding Standards & AI Interaction Rules**
  - เพิ่มกฎ Strict TDD (Red-Green-Refactor) ใน `devflow/context/coding-standards.md`
  - เพิ่มมาตรฐาน Two-Stage Review Pattern ใน `devflow/context/coding-standards.md`
  - เพิ่มแนวทางการสื่อสารและสลับโหมด TDD ใน `devflow/context/ai-interaction.md`
- [x] **Step 2: Upgrade Deep-Track & Companion Skills**
  - อัปเกรด `.agents/skills/30-plan/SKILL.md` (TDD Task Breakdown & Atomic 2-5m scoping)
  - อัปเกรด `.agents/skills/40-execute/SKILL.md` (Strict Red-Green-Refactor execution loop)
  - อัปเกรด `.agents/skills/50-verify/SKILL.md` (Two-Stage Review Pattern)
  - อัปเกรด `.agents/skills/debug/SKILL.md` (4-Step Systematic Debugging Protocol)
- [x] **Step 3: Upgrade Fast-Track Skills**
  - อัปเกรด `.agents/skills/feature/SKILL.md`
  - อัปเกรด `.agents/skills/implement/SKILL.md`
  - อัปเกรด `.agents/skills/check/SKILL.md`
- [x] **Step 4: Update Gatekeeper & Unit Tests**
  - อัปเดต `packages/create-nexus-devflow/lib/gatekeeper.ts`
  - อัปเดต `packages/create-nexus-devflow/test/gatekeeper.test.ts`
  - ซิงก์ adapters ไปยัง `.claude/skills/`
- [x] **Step 5: Verification & Package Smoke Test**
  - รัน `npm run check` และ `npm test` ให้ผ่าน 100%

---

## 4. Verification Evidence (Two-Stage Review)

### Stage 1: Spec Fidelity & Acceptance Gate
- [pass] **AC-1**: `coding-standards.md` และ `ai-interaction.md` มีข้อกำหนด Strict TDD (Red-Green-Refactor) และ Two-Stage Review Pattern ครบถ้วน
- [pass] **AC-2**: Skills `30-plan`, `40-execute`, `50-verify`, `feature`, `implement`, `check`, และ `debug` ได้รับการอัปเกรดทั้งใน `.agents/` และ `.claude/`
- [pass] **AC-3**: `gatekeeper.ts` รองรับการประเมิน Two-Stage Review และมี Unit Test ทดสอบความถูกต้อง
- [pass] **AC-4**: เทมเพลตสำหรับติดตั้งใน `packages/create-nexus-devflow` ได้รับการซิงก์ตรงกัน
- [pass] **AC-5**: รัน `npm run check` และ `npm test` ผ่าน 100% (ทุกเทสต์เขียวสมบูรณ์)

### Stage 2: Code Quality, Security & Architecture Gate
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`) -> PASSED (0 errors)
- **Unit Tests**: `npm test` (95/95 passed, 0 failures)
- **Comprehensive Framework Check**: `npm run check` -> PASSED (Static checks + Skill Routing Evals + 91 installer tests + Smoke package overlay in temp dir)
- **Findings Ledger**: 0 blockers (P0/P1) in `devflow/context/findings.md`
