# 📐 [067-sync-upstream-ai-blueprint-v130-v141] ซิงก์ AI Blueprint Upstream v1.3.0 – v1.4.1 (Planning Baseline Commit, Context Overhead Reduction, Overview Compactness Guard 20KB, และ Efficient Workflow Presets)

> **Status**: Completed / Delivered  
> **Track**: Fast-Track (Task-Isolated Living Spec Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 20` & `devflow/discoveries/DISC-20260902-002-sync-upstream-v130-v141/discovery.md`  
> **Branch**: `feature/067-sync-upstream-ai-blueprint-v130-v141`  
> **Started Date**: 2026-09-02  
> **Delivered Date**: 2026-09-02  
> **Owner**: DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement
Upstream AI Blueprint ได้ปล่อยเวอร์ชัน `v1.3.0`, `v1.4.0`, และ `v1.4.1` มุ่งเน้นการแก้ปัญหาคอขวดด้านประสิทธิภาพของ AI Session:
1. **Polluted Initial Feature Commits**: การเริ่มฟีเจอร์แรกของโปรเจกต์มักมีไฟล์ setup โครงการ, adapters, config และ planning documents ปะปนเข้าสู่ Feature Commit ทำให้ Git Log ขาดความชัดเจน
2. **Context & Token Bloat**:
   - การโหลดไฟล์กฎและเอกสารบริบท (`coding-standards.md`, `ai-interaction.md`) แบบถาวรใน `CLAUDE.md` ทุกรอบการสนทนา ทำให้สิ้นเปลือง Token Window โดยไม่จำเป็น
   - ข้อความคำอธิบายทักษะ (Skill Descriptions) ขนาดยาวเกินไป ทำให้สูญเสีย Token ใน System Prompt ของ AI ทุกตัว
   - เอกสารสรุปโครงการ (`project-overview.md`) หากไม่มีการควบคุมเพดานขนาด เมื่อโครงการเติบโตจะบวมจนเบียดบังพื้นที่สำหรับโค้ดดิ้ง
3. **Per-Step Interruption Friction**: ค่าเริ่มต้นเดิมของ `stepReview: "every"` บังคับให้ AI หยุดขอการอนุมัติในทุกๆ micro-step ย่อย ทำให้ผู้ใช้เกิดอาการล้า (Review Fatigue) และการพัฒนาติดขัด

### 1.2 In-Scope
1. **Planning Baseline Commit ใน `/overview` (`v1.3.0`)**:
   - เพิ่ม Step 4 ใน `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md` เสนอทำ Git commit:  
     `chore: establish DevFlow project baseline`
   - ตรวจสอบเงื่อนไขปลอดภัย: ต้องมี HEAD, อยู่บน Default branch, `project-overview.md` ยังไม่มี hash ใน HEAD, ไม่มี Active task directory (`devflow/context/{xxx-slug}/`), ไม่มีประวัติใน `devflow/history/features/`, ไม่มี checked items ใน `build-plan.md`, และไม่อยู่ในโหมด local-only
2. **Overview Compactness Guard (20,000 Bytes Limit) (`v1.4.1`)**:
   - บังคับให้ `project-overview.md` มีขนาดต่ำกว่า 20,000 bytes (~4,000–5,000 tokens)
   - อัปเดต `overview/SKILL.md` ให้สรุปย่อและตัดทอนเนื้อหาซ้ำซ้อน
   - อัปเดต `doctor/SKILL.md` ให้เตือนสถานะ `oversized` เมื่อ >= 20KB
   - อัปเดต `feature/SKILL.md` ให้หยุดทันที (Hard-Stop) เมื่อ >= 20KB และให้ Re-use Overview ที่โหลดอยู่ใน memory แล้วโดยไม่อ่านซ้ำผ่าน tool
3. **Context Overhead Reduction & Token Efficiency (`v1.4.0`)**:
   - ปรับคำแนะนำใน `CLAUDE.md` และ `AGENTS.md` ให้นำเข้าเฉพาะ `@AGENTS.md`, `project-overview.md`, และ Active Task Spec ส่วนกฎเกณฑ์อื่นโหลดแบบ Just-In-Time
   - ย่อคำอธิบายทักษะ (Skill Descriptions) ของ Core Skills ทั้งหมด (31 สคิล) ให้กระชับ สื่อความหมายชัดเจน และยาวไม่เกิน 400 ตัวอักษร
4. **Low-Overhead Review Cadence & Onboarding Presets (`v1.4.0`)**:
   - ปรับปรุง `devflow/config.json` และโมดูล `packages/create-nexus-devflow/lib/project-config.ts` ให้ใช้ค่าเริ่มต้น:  
     `workflow.stepReview: "feature"` และ `workflow.checkpointCommits: "disabled"`
   - เพิ่มคำถาม Implementation Style ใน `onboard/SKILL.md` (ตัวเลือก: **Efficient (Recommended)**, **Guided**, **Custom**)
5. **Framework Validation & Multi-Lane Tests**:
   - อัปเดต `scripts/validate-framework.ts` เพิ่มการตรวจเช็คเพดานความยาวของ Skill descriptions (<= 400 chars) และตรวจสอบสัญญาของ Baseline Commit และ 20KB Overview
   - อัปเดต Unit Tests ใน `packages/create-nexus-devflow/test/project-config.test.ts` และ `status.test.ts`
   - ตรวจสอบผ่าน 100% ทั้ง `npm run check:static`, `npm test`, และ `npm run test:package`

### 1.3 Out-of-Scope
- การเปลี่ยนแปลงสถาปัตยกรรม 3-Pillars หรือการยกเลิก Task-Isolated Living Spec Model
- การตัดทอนฟีเจอร์ด้านความปลอดภัย BugHunter (Feature 065)
- การบังคับเปลี่ยนภาษาของ Artifacts (ยังคงใช้ภาษาไทย `th` เป็นค่าเริ่มต้น)

### 1.4 Acceptance Criteria (เกณฑ์การยอมรับ)
- [x] **AC-1**: `overview/SKILL.md` (ทั้ง `.agents/` และ `.claude/`) มี Step 4 แนะนำการทำ Planning Baseline Commit ด้วยข้อความ `chore: establish DevFlow project baseline` พร้อมเงื่อนไขความปลอดภัยและ Candidate Check ครบถ้วน
- [x] **AC-2**: `overview/SKILL.md`, `doctor/SKILL.md`, และ `feature/SKILL.md` มีกฎควบคุมเพดานขนาด `project-overview.md` ไม่เกิน 20,000 bytes โดย `/doctor` เตือนเมื่อเกิน และ `/feature` สั่งหยุดพร้อมแนะนำให้รัน `/overview` ใหม่
- [x] **AC-3**: `/feature` มีคำสั่ง Directive สั่งให้ Reuse Overview ที่มีอยู่ใน context ของ session อยู่แล้ว แทนที่จะอ่านซ้ำผ่านเครื่องมือ
- [x] **AC-4**: `devflow/config.json` และ `packages/create-nexus-devflow/lib/project-config.ts` ใช้ค่าเริ่มต้น `stepReview: "feature"` และ `checkpointCommits: "disabled"`
- [x] **AC-5**: `onboard/SKILL.md` มีตัวเลือก Implementation Style Presets 3 แบบ (Efficient, Guided, Custom) ซึ่งเขียนลง Config ที่เกี่ยวข้องอย่างถูกต้อง
- [x] **AC-6**: ข้อความ Description ใน Frontmatter ของ Core Skills ทั้งหมด 31 สคิลใน `.agents/` และ `.claude/` มีความยาวไม่เกิน 400 ตัวอักษรต่อสคิล
- [x] **AC-7**: `scripts/validate-framework.ts` ตรวจสอบและบังคับใช้ Contract ของ Skill Descriptions, Baseline Commit, และ 20KB Overview Guard
- [x] **AC-8**: ชุดทดสอบ Unit Tests ทั้งหมด (`npm test`), Static Check (`npm run check:static`), และ Package Smoke Test (`npm run test:package`) ผ่าน 100%

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `devflow/config.json` [MODIFY]
- `packages/create-nexus-devflow/lib/project-config.ts` [MODIFY]
- `packages/create-nexus-devflow/test/project-config.test.ts` [MODIFY]
- `packages/create-nexus-devflow/test/status.test.ts` [MODIFY]
- `.agents/skills/overview/SKILL.md`, `.claude/skills/overview/SKILL.md` [MODIFY]
- `.agents/skills/doctor/SKILL.md`, `.claude/skills/doctor/SKILL.md` [MODIFY]
- `.agents/skills/feature/SKILL.md`, `.claude/skills/feature/SKILL.md` [MODIFY]
- `.agents/skills/onboard/SKILL.md`, `.claude/skills/onboard/SKILL.md` [MODIFY]
- `.agents/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` (31 core skills description optimization) [MODIFY]
- `scripts/validate-framework.ts` [MODIFY]
- `CLAUDE.md`, `AGENTS.md` [MODIFY]
- `devflow/context/ai-interaction.md`, `devflow/context/coding-standards.md` [MODIFY]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `manual` (การซิงก์ workflow & config ภายในระบบ ไม่แตะต้อง authentication, secrets, หรือ external payments จึงไม่ trigger `when-sensitive`)
- **UI Evidence / Browser Tests**: Not applicable (งานนี้เป็นการปรับปรุง Framework CLI, Config & Agent Skills ไม่มีหน้าเว็บ UI ใหม่)
- **Review Strategy**: One feature-level review packet at completion (สไตล์ Efficient ตามค่าเริ่มต้นใหม่)

### 2.3 Test Decision: Required (TDD)
- **Rationale**: การปรับค่า Defaults ของ `project-config.ts` และการเพิ่ม Guard ใน `validate-framework.ts` ต้องมี Unit Tests รองรับเพื่อป้องกันความคลาดเคลื่อนของ Schema และความลื่นไหลของ CLI

---

## 3. Implementation Checklist (Strict TDD)

- [x] **Task 1: Core Config & Default Presets**
  - [x] 1.1 `[TDD-Red]`: อัปเดต `test/project-config.test.ts` และ `test/status.test.ts` ให้ Assert ค่าเริ่มต้นใหม่ (`stepReview: "feature"`, `checkpointCommits: "disabled"`)
  - [x] 1.2 `[TDD-Green]`: แก้ไข `packages/create-nexus-devflow/lib/project-config.ts` และ `devflow/config.json` ให้ใช้ค่าเริ่มต้นใหม่
  - [x] 1.3 `[TDD-Refactor]`: รัน `npm test` ยืนยันว่าชุดทดสอบของ package ผ่านเรียบร้อย (134/134 unit tests pass)

- [x] **Task 2: Overview Planning Baseline Commit**
  - [x] 2.1 เพิ่ม Step 4 ลงใน `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md` สำหรับเสนอทำ `chore: establish DevFlow project baseline`
  - [x] 2.2 ปรับเงื่อนไขให้เข้ากับสถาปัตยกรรม DevFlow: ตรวจสอบ Task-Isolated Workspace (`devflow/context/{xxx-slug}/`), History และ Local-only mode
  - [x] 2.3 เพิ่มข้อกำหนดความปลอดภัยและการตรวจสอบ Staging ไม่ให้ปนเปื้อนโค้ดแอปพลิเคชัน

- [x] **Task 3: Overview 20KB Compactness Guard**
  - [x] 3.1 อัปเดต `overview/SKILL.md` เพิ่มกฎควบคุมขนาด `project-overview.md` ให้ต่ำกว่า 20,000 bytes
  - [x] 3.2 อัปเดต `doctor/SKILL.md` ให้รายงานขนาดไบต์ของ Overview และแจ้งเตือนสถานะ `oversized`
  - [x] 3.3 อัปเดต `feature/SKILL.md` เพิ่ม Hard-Stop เมื่อ Overview >= 20KB และระบุคำสั่งให้ Reuse Context เดิมที่มีอยู่แล้วโดยไม่อ่านซ้ำผ่าน Tool

- [x] **Task 4: Onboarding Presets & Context Optimization Directives**
  - [x] 4.1 อัปเดต `onboard/SKILL.md` ทั้งใน `.agents/` และ `.claude/` เพิ่ม Implementation Style prompt (Efficient, Guided, Custom)
  - [x] 4.2 อัปเดต `CLAUDE.md`, `AGENTS.md`, `devflow/context/ai-interaction.md`, และ `coding-standards.md` อธิบายแนวคิด JIT context loading และสไตล์การรีวิวแบบ Efficient

- [x] **Task 5: Skill Descriptions Optimization (31 Core Skills)**
  - [x] 5.1 ตรวจสอบและย่อ `description` ของสคิลทั้ง 31 สคิลใน `.agents/skills/` ให้ไม่เกิน 400 ตัวอักษร โดยคงคีย์เวิร์ดสำคัญและพรีฟิกซ์ `[devflow]` (รวม 7,123 chars <= 8,000 budget)
  - [x] 5.2 ซิงก์เนื้อหาของ `.agents/` เข้าสู่ `.claude/` ผ่าน `npm run sync:adapters` เรียบร้อย 100%

- [x] **Task 6: Framework Validation & Multi-Lane Verification**
  - [x] 6.1 อัปเดต `scripts/validate-framework.ts` เพิ่มการตรวจเช็คเพดานความยาวของ Skill descriptions (<= 400 chars) และ Assertion สัญญาของ Baseline Commit และ 20KB Overview
  - [x] 6.2 รัน `npm run check:static` ยืนยันความสมบูรณ์ของ Framework (Passed 100%)
  - [x] 6.3 รัน `npm test` (138/138 tests passed) และ `npm run test:package` (Passed 100%)

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `npm run check` completed with exit code 0.
- **Automated Test Matrix**: 134 package unit tests + 4 overview compiler tests passed (`npm test` 138/138 green).
- **Static Contract Verification**: `npm run check:static` passed with 0 issues across all 31 core skills, 7 extension skills, and 8 contract specifications.
- **Package Smoke Test**: `npm run test:package` passed successfully, verified 31 core skills in overlay extraction.
- **Findings Ledger**: ตรวจสอบ `findings.md` สะอาด 100% (0 Blockers, 0 Critical, 0 Warnings).

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [x] **AC-1**: Baseline Commit step พร้อมใน `overview/SKILL.md` (`chore: establish DevFlow project baseline`)
- [x] **AC-2**: 20KB Limit บังคับใช้ใน `overview`, `doctor`, `feature`
- [x] **AC-3**: Re-use overview directive มีอยู่ใน `feature/SKILL.md` (ทั้ง `.agents/` และ `.claude/`)
- [x] **AC-4**: Default config เป็น `stepReview: "feature"` และ `checkpointCommits: "disabled"`
- [x] **AC-5**: Onboard presets (Efficient/Guided/Custom) สมบูรณ์
- [x] **AC-6**: Skill descriptions 31 สคิล <= 400 chars (วัดได้ 7,123 chars ทั้งหมด)
- [x] **AC-7**: `validate-framework.ts` ตรวจสอบข้อกำหนดครบถ้วน
- [x] **AC-8**: All tests green 100%

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: 2026-09-02
- **Verification Verdict**: Passed (0 Blockers, 0 P0/P1 Findings)
- **Framework Tests**: 138/138 Passed
- **Static Contract**: 100% Validated
- **Package Smoke Test**: 100% Overlay Success
