# 📐 [050-sync-upstream-adopt-visibility-and-opencode] ซิงก์ AI Blueprint Upstream v0.13.0 (Adopt Visibility, OpenCode Adapter & Multi-Adapter CLI)

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `main`  
> **Created Date**: 2026-08-24  
> **Completed Date**: 2026-08-24  
> **Owner**: AI & Maintainer  

---

## 1. Specification & Scope
- **Problem Statement**: Upstream Repository (`aiblueprinthq/ai-blueprint`) มีการอัปเดตเวอร์ชันจาก `v0.12.1` (`a387763`) สู่ `v0.13.0` (`0b65166`) รวม 5 commits ซึ่งประกอบด้วย:
  1. การเพิ่มขั้นตอน Workflow Visibility ในสคิล `/adopt` ให้ผู้ใช้เลือกว่าจะ Commit workflow files หรือเก็บเป็น Local-only (`.gitignore`) พร้อมระบบเตือน/ถอดไฟล์ที่ถูก track ไปแล้วด้วย `git rm --cached` อย่างปลอดภัย
  2. การรองรับ **OpenCode** เป็นหนึ่งใน AI tool adapters หลักที่แชร์ skill tree ร่วมกับ `.agents/` หรือ `.claude/` โดยไม่สร้างโฟลเดอร์ซ้ำซ้อน
  3. การปรับปรุง CLI Installer & Updater (`create-nexus-devflow`) ให้รองรับ Multi-Adapter Selection ผ่าน Interactive Checkbox Prompt และแฟล็ก `--opencode`, `--all`
  4. การอัปเดตสคิล `doctor` และ `onboard` ให้เข้าใจ ignore rules, adapter sharing และ visibility modes
  5. การอัปเดต baseline tracking ใน `.nexus/upstream-ai-blueprint.json` ให้ตรงกับ Upstream v0.13.0
- **In-Scope**:
  - **Skills Integration**:
    - อัปเดต `adopt` (`.agents/skills/adopt/SKILL.md` และ `.claude/skills/adopt/SKILL.md`) เพิ่มขั้นตอน Step 5 (Ask about DevFlow visibility) และปรับปรุง rules/notes
    - อัปเดต `doctor` (`.agents/skills/doctor/SKILL.md` และ `.claude/skills/doctor/SKILL.md`) เพิ่มการตรวจเช็ค ignore rules และ local-only state
    - อัปเดต `onboard` (`.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md`) และ `AGENTS.md` ให้ระบุการรองรับ OpenCode และหลักการแชร์ Adapter Tree
  - **CLI Package Updates (`packages/create-nexus-devflow`)**:
    - เพิ่ม `opencode` ใน `ProjectAdapter` type, `adapterChoices`, และ `ADAPTER_PATHS` ใน `project-metadata.ts` และ `create-nexus-devflow.ts`
    - ปรับปรุง `update.ts` ให้รองรับการอัปเดต manifest และ managed files สำหรับ OpenCode และ multi-adapter combinations
    - เพิ่ม CLI flags (`--opencode`, `--all`) และ interactive multi-select prompt ใน `create-nexus-devflow.ts`
    - เพิ่มและปรับปรุง Unit Tests ใน `packages/create-nexus-devflow/test/` ครอบคลุม OpenCode และ Adapter Detection
  - **Upstream Tracking**:
    - อัปเดต `.nexus/upstream-ai-blueprint.json` ให้ `lastReviewedCommit` ชี้ไปที่ `0b651667c4d55d985b9cc91e6c155c9f9b47b73f` (v0.13.0)
- **Out-of-Scope**:
  - การแก้ไขโครงสร้าง Core 3-Pillars ของ DevFlow 2.0
  - การเปลี่ยนแปลงพฤติกรรมของคำสั่ง CLI ภายนอกส่วน Adapter และ Adopt visibility
- **Acceptance Criteria**:
  - [x] AC-1: สคิล `adopt` ทั้งใน `.agents/` และ `.claude/` มีขั้นตอนถาม DevFlow visibility (Commit vs Local-only) และคำแนะนำ `.gitignore` ที่ถูกต้อง
  - [x] AC-2: สคิล `doctor`, `onboard`, และ `AGENTS.md` มีเนื้อหารองรับ OpenCode และการตรวจสอบ ignore rules
  - [x] AC-3: แพ็กเกจ `create-nexus-devflow` รองรับ adapter `opencode`, รองรับ CLI flags และการตรวจจับ adapters ใน `project-metadata.ts` และ `update.ts`
  - [x] AC-4: ยูนิตเทสต์ใน `packages/create-nexus-devflow` ผ่าน 100% รวมเทสต์สำหรับ OpenCode และ Multi-adapter
  - [x] AC-5: `npx tsx scripts/inspect-upstream.ts` ยืนยันผลลัพธ์ `updateAvailable: false` และ `lastReviewedCommit` ตรงกับ v0.13.0 (`0b65166`)
  - [x] AC-6: ชุดทดสอบทั้งหมด (`npm run check`, `npm run check:static`, `npm test`, `npm run test:package`) ผ่าน 100%

---

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `.agents/skills/adopt/SKILL.md`, `.claude/skills/adopt/SKILL.md`
  - `.agents/skills/doctor/SKILL.md`, `.claude/skills/doctor/SKILL.md`
  - `.agents/skills/onboard/SKILL.md`, `.claude/skills/onboard/SKILL.md`
  - `AGENTS.md`
  - `packages/create-nexus-devflow/lib/project-metadata.ts`
  - `packages/create-nexus-devflow/lib/update.ts`
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`
  - `packages/create-nexus-devflow/test/project-metadata.test.ts`
  - `packages/create-nexus-devflow/test/update.test.ts`
  - `.nexus/upstream-ai-blueprint.json`
- **Test Decision**: `Required (TDD)`
  - *Rationale*: รับประกันว่า CLI installer, updater และ metadata detection ทำงานถูกต้อง ไม่เกิด regression ในการติดตั้งและอัปเดต adapters
  - *Planned Cases*:
    - OpenCode adapter detection and shared skill tree handling
    - Multi-adapter selection and manifest serialization
    - Unit tests for project metadata with OpenCode
    - Inspect upstream script verification
- **Impact & Rollback Strategy**:
  - *Impact*: Adapter configuration, Skills documentation, และ CLI package
  - *Rollback*: `git checkout main` หรือกู้คืนด้วย `/rollback`

---

## 3. Implementation Checklist
- [x] Task 1: อัปเดตสคิล `adopt`, `doctor`, `onboard`, และ `AGENTS.md` สำหรับ DevFlow Visibility & OpenCode Support
- [x] Task 2: ปรับปรุง `packages/create-nexus-devflow/lib/project-metadata.ts` ให้รองรับ `opencode` adapter
- [x] Task 3: ปรับปรุง `packages/create-nexus-devflow/lib/update.ts` และ `bin/create-nexus-devflow.ts` สำหรับ OpenCode และ Multi-Adapter Selection
- [x] Task 4: เพิ่ม Unit Tests ใน `packages/create-nexus-devflow/test/` สำหรับ OpenCode และ Adapter Resolution
- [x] Task 5: อัปเดต `.nexus/upstream-ai-blueprint.json` เป็น v0.13.0 (`0b65166`) และรันการตรวจสอบ Verification Suite ทั้งหมด

---

## 4. Implementation Record
- **[Task 1]**:
  - อัปเดตสคิล `adopt` ทั้งใน [`.agents/skills/adopt/SKILL.md`](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/adopt/SKILL.md) และ [`.claude/skills/adopt/SKILL.md`](file:///d:/Projects/devtools/nexus-devflow/.claude/skills/adopt/SKILL.md) เพิ่ม Step 5 (Ask about DevFlow visibility), การจัดการ `.gitignore`, และระบบเตือน `git rm --cached` อย่างปลอดภัย
  - อัปเดตสคิล `doctor` ใน [`.agents/skills/doctor/SKILL.md`](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/doctor/SKILL.md) และ [`.claude/skills/doctor/SKILL.md`](file:///d:/Projects/devtools/nexus-devflow/.claude/skills/doctor/SKILL.md) ให้ตรวจสอบ tool adapters รวม OpenCode และการตรวจสอบ local-only visibility mode
  - อัปเดต `onboard` ในทั้งสอง adapter directories และ [`AGENTS.md`](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) เพื่อระบุ OpenCode และการแชร์ adapter trees
  - รัน `npm run sync:adapters` ซิงก์ทักษะครบถ้วน 35 skills ทั้งสอง adapter trees
- **[Task 2]**:
  - เพิ่ม `opencode` เข้าสู่ `type ProjectAdapter`, `ADAPTER_PATHS` และ `detectAdapters` ใน [`packages/create-nexus-devflow/lib/project-metadata.ts`](file:///d:/Projects/devtools/nexus-devflow/packages/create-nexus-devflow/lib/project-metadata.ts)
- **[Task 3]**:
  - อัปเดต `MANAGED_ROOTS` และ `adapterListFromMode` ใน [`packages/create-nexus-devflow/lib/update.ts`](file:///d:/Projects/devtools/nexus-devflow/packages/create-nexus-devflow/lib/update.ts) ให้รองรับ `opencode`
  - เพิ่ม `opencode` ใน `adapterChoices`, CLI flags (`--codex`, `--claude`, `--copilot`, `--antigravity`, `--opencode`, `--all`, `--both`) และข้อความช่วยเหลือใน [`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`](file:///d:/Projects/devtools/nexus-devflow/packages/create-nexus-devflow/bin/create-nexus-devflow.ts)
- **[Task 4]**:
  - เพิ่ม unit test ใน [`packages/create-nexus-devflow/test/project-metadata.test.ts`](file:///d:/Projects/devtools/nexus-devflow/packages/create-nexus-devflow/test/project-metadata.test.ts) และ [`packages/create-nexus-devflow/test/update.test.ts`](file:///d:/Projects/devtools/nexus-devflow/packages/create-nexus-devflow/test/update.test.ts)
  - รัน `npm test` ยืนยันยูนิตเทสต์ทั้งหมดผ่าน 89/89 tests 100%
- **[Task 5]**:
  - อัปเดต `.nexus/upstream-ai-blueprint.json` ให้ `lastReviewedCommit` เป็น `0b651667c4d55d985b9cc91e6c155c9f9b47b73f` (Upstream v0.13.0)
  - รัน `npm run check:static` และ `npm run typecheck` ผ่าน 100% (0 errors)

---

## 5. Verification Evidence

### 1. Static Contract & Integrity Check
- **Command**: `npm run check:static`
- **Result**: Passed (35 skills in `.agents/skills`, manifest consistency, version sync 2.1.0, clean legacy-free state).

### 2. TypeScript Compilation (Typecheck)
- **Command**: `npm run typecheck` (`tsc --noEmit`)
- **Result**: Passed (0 errors across workspace).

### 3. Unit Tests Suite
- **Command**: `npm test` (`tsx --test test/*.test.ts`)
- **Result**: **89/89 tests passed (100%)** in 32.9s.
  - Subtest 54: `detectAdapters detects opencode adapter from manifest` -> `ok`
  - Subtest 78: `adapterListFromMode resolves adapter aliases correctly` -> `ok`

### 4. Upstream Sync Verification
- **Command**: `npx tsx scripts/inspect-upstream.ts`
- **Result**:
  - `updateAvailable`: `false`
  - `commitCount`: `0`
  - Upstream HEAD SHA: `0b651667c4d55d985b9cc91e6c155c9f9b47b73f` (v0.13.0)
  - Local Tracking SHA: `0b651667c4d55d985b9cc91e6c155c9f9b47b73f`

### 5. Package Build & Smoke Overlay Test
- **Command**: `npm run test:package`
- **Result**:
  - Build & template preparation: complete
  - Package tarball creation: `jakkrichm-create-nexus-devflow-2.1.0.tgz` (199 files, 324.7 kB)
  - Smoke test overlay into temp folder: Applied 97 files, detected active adapters (`antigravity`, `claude`, `codex`, `copilot`, `opencode`) -> `[SUCCESS] Package smoke test passed!`.

### 6. Full Nexus-DevFlow Verification Gate
- **Command**: `npm run check`
- **Result**: All integrity checks, static validations, routing evals, unit tests, and smoke test passed cleanly.

---

## 6. Release & Handoff
- All Acceptance Criteria (`AC-1` through `AC-6`) have been verified and marked completed.
- Released and archived to `devflow/history/features/050-sync-upstream-adopt-visibility-and-opencode.md`.
