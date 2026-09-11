# 📐 [055-unified-third-party-skills-installer] Unified Third-Party Skills Installation & Update Command

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 17` & `DISC-20260831-001`  
> **Branch**: `feature/055-unified-third-party-skills-installer`  
> **Started Date**: 2026-08-31  
> **Completed Date**: 2026-08-31  

---

## 1. Specification & Scope

- **Problem Statement**:
  ปัจจุบัน Nexus-DevFlow มี **29 Core Skills** ที่ติดตั้งมาพร้อมกับระบบ และรองรับ **Recommended Third-Party Skills** จาก Community อีก 8 Skills ผ่าน 3 แหล่ง Repositories (`archify`, `diagram-design`, `9arm-skills`) แต่การติดตั้งหรือการอัปเดตเวอร์ชันล่าสุดทั้งหมดจำเป็นต้องพิมพ์คำสั่ง `skill add` / `skill update` แยกกัน 3 คำสั่งพร้อมจำ URL ที่ยาว ทำให้เกิดภาระ (Cognitive Load & Friction) ต่อผู้ใช้งานและทีมงานที่ต้องการติดตั้งหรืออัปเดต Skill ให้เป็นเวอร์ชันปัจจุบันอยู่เสมอ

- **In-Scope**:
  1. **Recommended Skills Preset & Update Engine (`packages/create-nexus-devflow/lib/skill-manager.ts`)**:
     - ประกาศ Constant `RECOMMENDED_THIRD_PARTY_SKILLS` บันทึกรายการ 3 Repositories มาตรฐาน (`archify`, `diagram-design`, `9arm-skills` with `all: true`)
     - พัฒนาฟังก์ชัน `installRecommendedSkills(projectRoot: string, options?: { force?: boolean })` สำหรับติดตั้ง Batch ในครั้งเดียว ซิงค์ทั้ง `.agents/skills/` และ `.claude/skills/` พร้อมบันทึกลงใน `.nexus/nexus-devflow.json`
     - พัฒนาฟังก์ชัน `updateRecommendedSkills(projectRoot: string)` สำหรับดึงเวอร์ชันล่าสุด (Latest Upstream Git) ของ Recommended Skills ทั้งหมดมาติดตั้งทับและอัปเดต Version/Metadata ใน Manifest
  2. **CLI Flag & Subcommand Parsing (`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`)**:
     - รองรับการติดตั้งแบบ One-Shot ผ่าน Flag `--recommended`:
       - `nexus-devflow skill add --recommended`
       - `nexus-devflow skill add-recommended`
       - `npx @jakkrichm/create-nexus-devflow skill add --recommended`
     - รองรับการอัปเดตเวอร์ชันล่าสุดผ่าน Flag `--recommended`:
       - `nexus-devflow skill update --recommended`
       - `nexus-devflow skill upgrade --recommended`
       - `npx @jakkrichm/create-nexus-devflow skill update --recommended`
     - แสดง Progress Spinner, สรุปเวอร์ชันก่อน-หลังอัปเดต, และแสดงสถานะการอัปเดตครบทั้ง 8 สกิลอย่างสวยงาม
  3. **Automated Multi-Lane Tests (`packages/create-nexus-devflow/test/skill-manager.test.ts`)**:
     - เพิ่ม Unit Tests ตรวจสอบการทำงานของ `installRecommendedSkills` และ `updateRecommendedSkills`
     - ทดสอบ CLI Argument Parsing สำหรับทั้งคำสั่ง `skill add --recommended` และ `skill update --recommended`
  4. **Documentation Refresh (`README.md`, `README.th.md`)**:
     - ปรับปรุงตาราง Recommended Third-Party Skills ให้แสดงคำสั่ง One-Shot Installation & One-Shot Update (`skill add --recommended` และ `skill update --recommended`)

- **Out-of-Scope**:
  - ไม่เปลี่ยนแปลง 29 Core Skills (Core Skills ยังคงฝังมากับ Framework เช่นเดิม)
  - ไม่บังคับติดตั้งอัตโนมัติหากผู้ใช้ไม่ได้ระบุ `--recommended` (Opt-in by user)

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: ฟังก์ชัน `installRecommendedSkills` สามารถติดตั้งครบทั้ง 3 แหล่ง (รวม 8 Skills: `archify`, `diagram-design`, `debug-mantra`, `post-mortem`, `qwen-agent`, `scrutinize`, `management-talk`, `qwenchance`) เข้าสู่ `.agents/skills/` และ `.claude/skills/` อย่างสมบูรณ์
  - [x] **AC-02**: คำสั่ง CLI `nexus-devflow skill add --recommended` สามารถรันได้โดยไม่ต้องส่ง URL เพิ่มเติม
  - [x] **AC-03**: คำสั่ง CLI `nexus-devflow skill update --recommended` ดึงเวอร์ชันล่าสุดของ Recommended Skills ทั้งหมดจาก Upstream Git มาอัปเดตไฟล์ใน `.agents/`, `.claude/` และบันทึกเวอร์ชันใหม่ลงใน `.nexus/nexus-devflow.json`
  - [x] **AC-04**: เมื่อรัน `nexus-devflow skill list` จะแสดงสถานะ `third-party`, version ปัจจุบัน และ `synced: true` ครบทุกตัว
  - [x] **AC-05**: การอัปเดตผ่าน `nexus-devflow skill update --all` ยังคงทำงานได้อย่างถูกต้องสำหรับทุกสกิล
  - [x] **AC-06**: ชุดทดสอบ Unit Tests ทั้งหมดใน `test/skill-manager.test.ts` และการตรวจสอบ `npm run check` ผ่าน 100%

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/skill-manager.ts` (แก้ไข: เพิ่ม `RECOMMENDED_THIRD_PARTY_SKILLS`, `installRecommendedSkills`, และ `updateRecommendedSkills`)
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` (แก้ไข: รองรับ `--recommended` สำหรับทั้ง `skill add` และ `skill update`)
  - `packages/create-nexus-devflow/test/skill-manager.test.ts` (แก้ไข: เพิ่ม Unit tests สำหรับ recommended preset install & update)
  - `README.md` & `README.th.md` (แก้ไข: อัปเดตตารางและคำแนะนำการติดตั้งและอัปเดต)
  - `devflow/build-plan.md` (แก้ไข: บันทึก Feature 17)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test` ภายใต้ `packages/create-nexus-devflow/`)
  - Verification with local mock repositories
  - Full Framework Integrity Check (`npm run check` & `npm run check:static`)

---

## 3. Implementation Checklist (Strict TDD)

- [x] **Task 1: Recommended Preset Catalog, Install & Update Engine (`skill-manager.ts`)**
  - [x] 1.1 `[TDD-Red]`: เขียน Unit Test ใน `test/skill-manager.test.ts` ตรวจสอบ `installRecommendedSkills` และ `updateRecommendedSkills` กับ Local Mock Repositories
  - [x] 1.2 `[TDD-Green]`: สร้าง `RECOMMENDED_THIRD_PARTY_SKILLS` constant, ฟังก์ชัน `installRecommendedSkills`, และ `updateRecommendedSkills` ใน `packages/create-nexus-devflow/lib/skill-manager.ts`
  - [x] 1.3 `[TDD-Refactor]`: ปรับปรุง Error Handling และ Clean Type Definitions

- [x] **Task 2: CLI Routing & Argument Parser for Add & Update (`create-nexus-devflow.ts`)**
  - [x] 2.1 `[TDD-Red]`: ตรวจสอบ Argument Parsing ให้รับสวิตช์ `--recommended` สำหรับทั้งคำสั่ง `skill add` และ `skill update`
  - [x] 2.2 `[TDD-Green]`: เชื่อมต่อ CLI Command `skill add --recommended` เข้ากับ `installRecommendedSkills` และ `skill update --recommended` เข้ากับ `updateRecommendedSkills` พร้อม Spinner UI
  - [x] 2.3 `[TDD-Refactor]`: จัดระเบียบ Help Text และ Console Feedback Output

- [x] **Task 3: Documentation Refresh & Multi-Lane Verification**
  - [x] 3.1 อัปเดตเอกสาร `README.md` และ `README.th.md` ด้วยคำสั่ง `skill add --recommended` และ `skill update --recommended`
  - [x] 3.2 รันชุดทดสอบ `npm test` ภายใต้ `packages/create-nexus-devflow` (124/124 unit tests passed 100%)
  - [x] 3.3 รันการตรวจสอบความสมบูรณ์ทั้งระบบ `npm run check` และ `npm run check:static` (All checks passed 100%)

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `npm run check` completed with code 0 across 207 package files.
- **Automated Test Matrix**: 124 unit tests + 4 overview tests passed via Node.js native test runner (`npm test`).
- **Static Contract Verification**: `npm run check:static` passed with 0 errors across all 29 core skills and 8 extension skills.
- **Security & Sanitization**: Safe path joins, non-colliding clone directories, and validation against core skill overwrites without `--force`.
- **Findings Ledger**: 0 Blocker (P0), 0 Critical (P1), 0 Warning (P2), 0 Minor (P3).

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [pass] **AC-01 (All 8 Skills Installed)**: `installRecommendedSkills` batch-installs from all 3 sources (`archify`, `diagram-design`, `9arm-skills`), syncs to `.agents/` and `.claude/`, and records in `.nexus/nexus-devflow.json`. (Verified by `skill-manager.test.ts`)
- [pass] **AC-02 (CLI Add Flag Execution)**: `nexus-devflow skill add --recommended` parses and executes without requiring URL arguments. (Verified by `status.test.ts` & `create-nexus-devflow.ts`)
- [pass] **AC-03 (CLI Update Flag Execution & Version Refresh)**: `nexus-devflow skill update --recommended` refreshes and updates versions from upstream repositories. (Verified by `skill-manager.test.ts` & `status.test.ts`)
- [pass] **AC-04 (Skill List Sync State)**: `skill list` displays all 8 skills with category `third-party` and `synced: true`. (Verified by `skill-manager.test.ts`)
- [pass] **AC-05 (Skill Update Compatibility)**: `skill update --all` and targeted skill update function seamlessly with recommended skills. (Verified by `skill-manager.test.ts`)
- [pass] **AC-06 (100% Test Suite Green)**: All unit, static, package, and overview tests passed with 0 errors.

---

## 5. Release Digest & Artifact Audit

- **Delivered Changes**:
  1. `packages/create-nexus-devflow/lib/skill-manager.ts`: เพิ่ม `RECOMMENDED_THIRD_PARTY_SKILLS`, `installRecommendedSkills`, และ `updateRecommendedSkills`
  2. `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`: เพิ่มการประมวลผล Flag `--recommended` สำหรับคำสั่ง `skill add` และ `skill update` พร้อม Progress Spinner UI และ Help Documentation
  3. `packages/create-nexus-devflow/test/skill-manager.test.ts` & `test/status.test.ts`: เพิ่มเคสทดสอบ TDD สำหรับ Recommended Preset Engine และ CLI Argument Parser
  4. `README.md` & `README.th.md`: อัปเดตตารางและ Callout คำแนะนำการติดตั้ง One-Shot `skill add --recommended` และการอัปเดต One-Shot `skill update --recommended`
- **Verification Summary**:
  - `npm test`: 124/124 Unit tests passed
  - `npm run check`: Full TypeScript build & packaging smoke tests passed
  - `npm run check:static`: Framework contract checks passed
- **Findings Audit**: 0 unresolved findings.

---

## 6. Findings Ledger Integration

- Ledger File: `devflow/context/055-unified-third-party-skills-installer/findings.md`
- Active Blockers: `0`
- Gatekeeper Status: `RELEASED`
