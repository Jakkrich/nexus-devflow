# 📐 [024-sync-upstream-v0110] Adapt AI Blueprint v0.11.0 Updates (Living Spec)

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `main`  
> **Created Date**: 2026-08-21  
> **Completed Date**: 2026-08-21  
> **Owner**: DevFlow Maintainer  

---

## 1. Specification & Scope
- **Problem Statement**:
  ต้องการนำเข้าและปรับใช้ฟีเจอร์ใหม่จาก Upstream `aiblueprinthq/ai-blueprint` v0.11.0 (จาก Issue #2 และ Discovery `DISC-20260821-002`) ซึ่งมี 2 ฟีเจอร์หลักคือ:
  1. **GitHub Copilot Adapter Support** (`--copilot` และ `--all` default mode)
  2. **Live DevFlow Dashboard UI** (`nexus-devflow ui` / `devflow ui`)

- **In-Scope**:
  - อัปเดต `packages/create-nexus-devflow/lib/project-metadata.ts` และ `update.ts` ให้รองรับ `"copilot"` adapter และ `--all` mode
  - เพิ่ม `lib/dashboard.ts` และ `lib/history.ts` ใน `packages/create-nexus-devflow` เพื่อบริการ Live Dashboard สำหรับ DevFlow 2.0 3-Pillars Structure
  - อัปเดต CLI in `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` เพิ่มคำสั่ง `ui` และตัวเลือก `--no-open`
  - เพิ่มและอัปเดต Unit Tests ใน `packages/create-nexus-devflow/test/`
  - อัปเดต `AGENTS.md` และเอกสารอ้างอิงของ package
  - อัปเดต `.nexus/upstream-ai-blueprint.json` ชี้ `lastReviewedCommit` ไปที่ `478a8b9a04f05286fa092b192184e50388e59ba8`

- **Out-of-Scope**:
  - การแก้ไขสถาปัตยกรรมหลักของ DevFlow 2.0 3-Pillars
  - การแก้ไข Skill schema หรือคำสั่งย่อยภายนอก package

- **Acceptance Criteria**:
  - [x] AC-1: `create-nexus-devflow` CLI รองรับการระบุ `--copilot` และ `--all` (พร้อมรักษา deprecation alias `--both`)
  - [x] AC-2: `create-nexus-devflow` CLI มีคำสั่ง `ui` ที่สามารถเปิดใช้งาน Live Web Dashboard แสดงผลสถานะ DevFlow 2.0 และ History ได้
  - [x] AC-3: Unit Tests ทั้งหมดใน `packages/create-nexus-devflow/test/` ผ่านครบถ้วน 100%
  - [x] AC-4: `npx tsx scripts/check-devflow.ts` ผ่านการตรวจสอบทุกด่าน (Verification Gate Clean)
  - [x] AC-5: `.nexus/upstream-ai-blueprint.json` ได้รับการเลื่อน baseline เป็น `478a8b9a04f05286fa092b192184e50388e59ba8`

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `packages/create-nexus-devflow/lib/project-metadata.ts`: เพิ่ม Copilot adapter detection และประเภท `Adapter`
  - `packages/create-nexus-devflow/lib/update.ts`: เพิ่ม Copilot adapter root mapping และ `--all` mode
  - `packages/create-nexus-devflow/lib/dashboard.ts`: [NEW] โมดูล Live Dashboard Server สำหรับ DevFlow 2.0
  - `packages/create-nexus-devflow/lib/history.ts`: [NEW] โมดูลประมวลผลประวัติงาน History / Discoveries / Ideas
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`: เพิ่มคำสั่ง `ui`, ตัวเลือก `--copilot` / `--all` / `--no-open`
  - `packages/create-nexus-devflow/test/dashboard.test.ts`: [NEW] Unit Tests สำหรับ Live Dashboard
  - `packages/create-nexus-devflow/test/history.test.ts`: [NEW] Unit Tests สำหรับ History Module
  - `packages/create-nexus-devflow/test/project-metadata.test.ts`: เพิ่มเคสทดสอบ Copilot Adapter
  - `packages/create-nexus-devflow/test/update.test.ts`: เพิ่มเคสทดสอบ Copilot Adapter & All Mode
  - `.nexus/upstream-ai-blueprint.json`: อัปเดต `lastReviewedCommit`
  - `AGENTS.md`: เพิ่ม Copilot adapter reference

- **Test Decision**: `Required (TDD)`
  - *Rationale*: CLI installer และ Dashboard เป็น core interface ของ package ต้องมี unit test ครอบคลุมการ parse arguments, adapter resolution, dashboard endpoints และ history parsing
  - *Planned Cases*:
    - Testing Copilot adapter detection & update modes
    - Testing History parser for DevFlow history/discoveries
    - Testing Dashboard HTTP server responses and HTML rendering
    - Integration tests via `check-devflow.ts` smoke test

- **Impact & Rollback Strategy**:
  - *Impact*: ตรวจสอบ package build (`npm run build`) และ smoke tests เพื่อไม่ให้กระทบต่อผู้ใช้งานเดิม
  - *Rollback*: สามารถย้อนคืน commit ล่าสุดผ่าน `git revert` หรือรัน `/rollback`

## 3. Implementation Checklist
- [x] Task 1: อัปเดต `project-metadata.ts`, `update.ts`, และ `AGENTS.md` เพื่อเพิ่ม Copilot Adapter Support (`--copilot`, `--all`)
- [x] Task 2: เพิ่มโมดูล `history.ts` และ `dashboard.ts` สำหรับ Live DevFlow Dashboard UI
- [x] Task 3: อัปเดต CLI in `bin/create-nexus-devflow.ts` เพิ่มคำสั่ง `ui`, `--no-open` และ help text
- [x] Task 4: เพิ่มและอัปเดต Unit Tests (`dashboard.test.ts`, `history.test.ts`, `project-metadata.test.ts`, `update.test.ts`)
- [x] Task 5: อัปเดต `.nexus/upstream-ai-blueprint.json` baseline และรัน Verification Gate (`npx tsx scripts/check-devflow.ts`)

## 4. Implementation Record
- **[Task 1]**: อัปเดต `project-metadata.ts`, `update.ts`, และ `AGENTS.md` เพิ่มการรองรับ GitHub Copilot adapter (`--copilot`, `--all`)
- **[Task 2]**: สร้างโมดูล `lib/history.ts` และ `lib/dashboard.ts` ให้บริการ Live Dashboard Web Server แสดงผลสถานะและประวัติงานของ DevFlow 2.0
- **[Task 3]**: อัปเดต CLI `bin/create-nexus-devflow.ts` เพิ่มคำสั่ง `nexus-devflow ui`, ตัวเลือก `--no-open`, และปรับปรุง help screen
- **[Task 4]**: เพิ่ม Unit Tests `test/dashboard.test.ts`, `test/history.test.ts`, และอัปเดต `test/update.test.ts` (ผ่านการทดสอบครบ 28/28 tests)
- **[Task 5]**: อัปเดต `.nexus/upstream-ai-blueprint.json` ชี้ baseline ไปยัง `478a8b9a04f05286fa092b192184e50388e59ba8` (v0.11.0) และรัน Verification Gate (`check-devflow.ts`) ผ่าน 100%

## 5. Verification Evidence
- **Typecheck & Linter**: Passed (0 errors, 0 warnings via `npm run typecheck`)
- **Automated Test Suites**: All 28/28 unit tests passed via `npx tsx --test packages/create-nexus-devflow/test/*.test.ts`
- **Scrutinize & Security Audit**: Clean (0 boundary issues, 0 secrets, safe input handling)
- **Framework Verification Gate**: Passed 100% via `npx tsx scripts/check-devflow.ts` (Static check, Skill routing, Unit tests, Smoke test)
- **Acceptance Criteria Verification**:
  - [x] AC-1: `create-nexus-devflow` CLI รองรับ `--copilot` และ `--all` (พร้อมรักษา deprecation alias `--both`)
  - [x] AC-2: `create-nexus-devflow` CLI มีคำสั่ง `ui` ที่สามารถเปิดใช้งาน Live Web Dashboard แสดงผลสถานะ DevFlow 2.0 ได้
  - [x] AC-3: Unit Tests ทั้งหมดใน `packages/create-nexus-devflow/test/` ผ่านครบถ้วน 100% (28/28 tests)
  - [x] AC-4: `npx tsx scripts/check-devflow.ts` ผ่านการตรวจสอบทุกด่าน (Verification Gate Clean)
  - [x] AC-5: `.nexus/upstream-ai-blueprint.json` ได้รับการเลื่อน baseline เป็น `478a8b9a04f05286fa092b192184e50388e59ba8`
- **Manual Verification Guide**:
  - *Where to go*: Terminal / Command Prompt
  - *Action*: รันคำสั่ง `npx tsx packages/create-nexus-devflow/bin/create-nexus-devflow.ts ui --no-open`
  - *Expected Result*: แสดงผลข้อความ `Nexus-DevFlow Dashboard live at http://127.0.0.1:<port>` และเรียกดู `/api/status` ได้ข้อมูลสถาปัตยกรรม 3-Pillars ครบถ้วน

## 6. Release & Handoff
- **Release Digest**: นำเข้าและปรับใช้ความเปลี่ยนแปลงจาก Upstream AI Blueprint v0.11.0 โดยเพิ่มการรองรับ GitHub Copilot adapter (`--copilot`, `--all`), เพิ่ม Live DevFlow Dashboard UI (`nexus-devflow ui`) พร้อม Micro-animations สไตล์ 3-Pillars Model, อัปเดต Unit Tests (28/28 passed) และเลื่อน baseline เป็น `478a8b9a04f05286fa092b192184e50388e59ba8`
- **Git Branch**: `main`
- **Merge Status**: Direct commit / Merged into `main`
- **Archive Date**: 2026-08-21
