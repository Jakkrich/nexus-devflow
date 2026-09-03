# 📐 [070-role-based-profile-and-sa-analyze-engine] Role-Based Profiles & SA Analyze Command Engine

> **Template Type**: Task-Isolated Living Spec (Archived)  
> **Archive Location**: `devflow/history/features/070-role-based-profile-and-sa-analyze-engine.md`  
> **Source**: `devflow/build-plan.md: Phase 23` & `DISC-20260903-001`  
> **Started Date**: 2026-09-03  
> **Completed Date**: 2026-09-03  

- **Feature ID**: `070-role-based-profile-and-sa-analyze-engine`
- **Category**: `features`
- **Target Branch**: `feature/070-role-based-profile-and-sa-analyze-engine`
- **Status**: `Completed`
- **Track**: `Unified Living Spec Model`
- **Discovery Ref**: `devflow/discoveries/DISC-20260903-001-role-based-sa-flow-profile-and-command-suite/discovery.md`

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
- **Problem**: ปัจจุบัน Nexus-DevFlow ติดตั้งชุด Skills และโฟลเดอร์สำหรับ Developer เป็นหลัก (`dev` role) ยังไม่มีการแยกชุด Role Profiles สำหรับ **System Analyst (SA)** ซึ่งต้องการโฟลเดอร์สำหรับเก็บเอกสารความต้องการดิบ (`inbox/`), การวิเคราะห์ผลกระทบ (`analysis/`), และพิมพ์เขียวระบบ (`blueprints/`) รวมถึงขาดสคิล `/analyze` สำหรับสกัดเอกสารความต้องการหลากหลายรูปแบบ (PDF, Word, Excel, รูปภาพ, ข้อความ) และวิเคราะห์ Codebase Impact พร้อมออก Socratic Gap Checklist
- **Goal**:
  1. เพิ่มตัวเลือก `--role <sa|dev|full>` (Default: `dev`) ใน CLI Installer (`packages/create-nexus-devflow`)
  2. จัดแบ่งชุด Core Skills ตาม Role ใน `lib/skill-manager.ts` (`CORE_DEV_SKILLS`, `CORE_SA_SKILLS`, `CORE_FULL_SKILLS`)
  3. เพิ่มโฟลเดอร์ Template สำหรับ SA เมื่อเลือก role `sa` หรือ `full`
  4. พัฒนาสคิล `/analyze` (`.agents/skills/analyze/SKILL.md` และ `.claude/skills/analyze/SKILL.md`)
  5. สร้างชุดทดสอบ Automated Unit Tests ตรวจสอบ Role Filtering และ CLI Options ให้ผ่าน 100%

### In-Scope & Out-of-Scope
- **In-Scope**:
  - CLI Flags & Options: `--role <sa|dev|full>` ใน `create-nexus-devflow`
  - Config Schema: รองรับ `workflow.role` ใน `devflow/config.json`
  - Skill Filtering: `lib/skill-manager.ts` รองรับการกรอง Skill ตาม Role
  - SA Template Scaffolding: โฟลเดอร์ `devflow/inbox/`, `devflow/analysis/`, `devflow/blueprints/`
  - SA Flagship Skill: `/analyze` (Ingestion + Impact Analysis + Gap Checklist)
  - Unit Tests: `test/role-profile.test.ts` และอัปเดตชุดทดสอบที่เกี่ยวข้อง
- **Out-of-Scope**:
  - สคิล `/design`, `/handoff`, `/accept` (จะพัฒนาใน Phase 2 และ Phase 3 ตาม Discovery Roadmap)

### Success Criteria
1. รัน `npx @jakkrichm/create-nexus-devflow --role sa` แล้วติดตั้งเฉพาะชุด Skill ของ SA และโฟลเดอร์ `inbox/`, `analysis/`, `blueprints/`
2. รัน `npx @jakkrichm/create-nexus-devflow --role dev` (หรือไม่มี flag) ติดตั้งชุด Dev Skills ตามเดิม 100% Backward Compatible
3. รัน `npx @jakkrichm/create-nexus-devflow --role full` ติดตั้งชุด Skill ครบทั้งหมด
4. สคิล `/analyze` มีคำแนะนำและ schema ชัดเจน รองรับทั้ง `.agents/` และ `.claude/`
5. `npm test`, `npm run check:static`, และ `npm run check` ผ่าน 100%

---

## 📐 2. Technical Spec & Contracts

### Affected Files & Scope
- **Modified Core Files**:
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`
  - `packages/create-nexus-devflow/lib/skill-manager.ts`
  - `packages/create-nexus-devflow/lib/project-config.ts`
  - `packages/create-nexus-devflow/lib/update.ts`
  - `packages/create-nexus-devflow/lib/doctor.ts`
  - `devflow/build-plan.md`
  - `agent-bundle.manifest.json`
  - `docs/USAGE.md`
  - `docs/workflow-surface-map.md`
  - `README.md`
  - `README.th.md`
- **New Skill Files**:
  - `.agents/skills/analyze/SKILL.md`
  - `.claude/skills/analyze/SKILL.md`
- **New Test Files**:
  - `packages/create-nexus-devflow/test/role-profile.test.ts`

### Acceptance Criteria (AC)
- [x] **AC-01**: CLI รองรับ `--role <sa|dev|full>` และ fallback เป็น `dev` หากไม่ระบุ
- [x] **AC-02**: `skill-manager.ts` จัดกลุ่ม `DEV_ROLE_SKILLS`, `SA_ROLE_SKILLS`, `FULL_ROLE_SKILLS` และติดตั้งเฉพาะสคิลที่ตรงกับ Role
- [x] **AC-03**: การ Scaffolding เมื่อเลือก role `sa` หรือ `full` จะสร้างโฟลเดอร์ `devflow/inbox/`, `devflow/analysis/`, `devflow/blueprints/` ให้ถูกต้อง
- [x] **AC-04**: สคิล `/analyze` พร้อมใช้งานในทั้ง `.agents/` และ `.claude/` พร้อมคำแนะนำ Flow Ingest + Impact + Socratic Gap Checklist
- [x] **AC-05**: Automated Tests ทั้งหมดผ่าน 100% 0 error

---

## 📋 3. Execution Plan & Checklist

- [x] **Task 1: Core Engine - Role Profiles & Config Engine (TDD: Red-Green)**
  - [x] 1.1 เขียน Unit Test `test/role-profile.test.ts` ทดสอบการจำแนก Role และ Skill Filtering
  - [x] 1.2 เพิ่มการรองรับ `workflow.role` ใน `lib/project-config.ts` และ `lib/doctor.ts`
  - [x] 1.3 อัปเดต `lib/skill-manager.ts` จัดหมวดหมู่ `DEV_ROLE_SKILLS`, `SA_ROLE_SKILLS`, `FULL_ROLE_SKILLS`
  - [x] 1.4 อัปเดต `bin/create-nexus-devflow.ts` รองรับ `--role` flag และ role-based scaffolding

- [x] **Task 2: SA Flagship Skill - `/analyze` Implementation**
  - [x] 2.1 สร้าง `.agents/skills/analyze/SKILL.md`
  - [x] 2.2 สร้าง `.claude/skills/analyze/SKILL.md`
  - [x] 2.3 เพิ่ม `/analyze` ใน Core Skill Inventory และ Manifest

- [x] **Task 3: Automated Tests & Verification**
  - [x] 3.1 รัน `npm --prefix packages/create-nexus-devflow test` (153/153 passed)
  - [x] 3.2 รัน `npm test` (153/153 passed)
  - [x] 3.3 รัน `npm run check:static` (0 issues, 32 Core Skills synchronized)
  - [x] 3.4 รัน `npm run check` (All checks passed, Package Smoke Test passed with 32 Core Skills per adapter)

---

## 🔍 4. Empirical Proof & Verification

| Verification Lane | Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | `npm test` | ✅ PASSED | 153/153 tests passed (incl. `role-profile.test.ts`) |
| **Static Framework** | `npm run check:static` | ✅ PASSED | 32 Core Skills synchronized across manifest, `.agents/`, `.claude/`, and docs |
| **Package Smoke Test**| `npm run test:package` | ✅ PASSED | Tarball packed & unpacked into temp project, 32 Core Skills validated |
| **Full Verify** | `npm run check` | ✅ PASSED | Static check + Routing evals (100.00%) + Unit tests + Smoke test passed |

---

## 🛡️ Findings
*(Zero blocking findings)*
