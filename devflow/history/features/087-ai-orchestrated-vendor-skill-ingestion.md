# Feature: 087-ai-orchestrated-vendor-skill-ingestion

> **Document Type**: Completed Delivery Archive  
> **Running ID**: `087`  
> **Slug**: `087-ai-orchestrated-vendor-skill-ingestion`  
> **Title**: AI-Orchestrated Project-Local Vendor Skill Ingestion (`/vendor`)  
> **Branch**: `feature/087-ai-orchestrated-vendor-skill-ingestion`  
> **Completed At**: 2026-09-11  
> **Status**: `Released`

---

## 📌 1. Overview & Problem Context

- **Problem**: ผู้ใช้ต้องการนำเข้า 3rd-party vendor repositories (เช่น `virgiliojr94/book-to-skill`) เข้ามาใช้งานเฉพาะในโปรเจกต์ของตนเอง (`devflow/.vendor/<slug>/`) และต้องการให้ AI Agent เป็นผู้สังเคราะห์ Custom Wrapper Skill (`.agents/skills/<slug>/SKILL.md`) ครอบคลังนั้นเพื่อให้เรียกใช้งานได้อย่างชาญฉลาด แต่คำสั่ง CLI แบบเดิมไม่สามารถวิเคราะห์โค้ดและสร้าง custom wrapper ได้ อีกทั้งเมื่อมีการอัปเดต DevFlow (`npx nexus-devflow update`) สกิลที่ custom เข้ามาอาจเสี่ยงต่อการถูกลบทิ้งหากไม่มีกลไก Update Immunity
- **Solution**:
  1. สร้างคำสั่ง **`/vendor`** (พร้อม aliases: `skill-add`, `add-skill`, `equip`, `ingest`) ใน `.agents/skills/vendor/` และ `.claude/skills/vendor/`
  2. โคลน Git repo ลงในระดับ Local Workspace: `devflow/.vendor/<slug>/` (ไม่แตะ Global, ไม่บวมเข้า Git เพราะมี `.gitignore`)
  3. AI Agent ทำการสำรวจเอกสารและโค้ดใน `.vendor/<slug>/` แล้วสร้าง Custom Wrapper `SKILL.md` ที่ระบุ trigger rules, CLI commands, และ JIT context paths ชี้ไปยัง vendor
  4. ป้องกันไม่ให้ DevFlow Update ลบไฟล์ custom skill ใน `update.ts` โดยยกเว้นไฟล์ที่มีกำกับว่าเป็น custom/vendor หรือไม่อยู่ใน core templates
  5. ปรับปรุง `skill-registry-engine.ts` และ CLI เพื่อให้รองรับ `npx nexus-devflow skill update all` โดยคงรักษา custom `SKILL.md` ไว้

---

## ✅ 2. Acceptance Criteria (AC)

- [x] **AC-1**: มีคำสั่ง `/vendor` (และ aliases `skill-add`, `equip`, `ingest`) ทั้งใน `.agents/skills/vendor/SKILL.md` และ `.claude/skills/vendor/SKILL.md`
- [x] **AC-2**: สัญญาของคำสั่ง `/vendor` รองรับการโคลนคลัง Git ลงที่ `devflow/.vendor/<slug>/` และสั่งให้ AI สังเคราะห์ Custom Wrapper `SKILL.md` ลงใน `.agents/skills/<slug>/` และ `.claude/skills/<slug>/`
- [x] **AC-3**: `update.ts` มีกลไก Update Immunity — เมื่อรัน `prepareUpdate()` และ `applyPreparedUpdate()` ไฟล์ Custom Skill และโฟลเดอร์ `devflow/.vendor/` จะต้องไม่ถูกจัดเป็น `orphanedFiles` และห้ามถูกลบเด็ดขาด
- [x] **AC-4**: `skill-registry-engine.ts` และ CLI รองรับ `skill update all` (และ `skill update --all`) เพื่ออัปเดต vendor repos โดยไม่ overwrite ทับ custom wrapper `SKILL.md`
- [x] **AC-5**: Automated Unit Tests ใน `test/vendor-skill-protection.test.ts` ผ่าน 100% พร้อม `npm run check:static` และ `npm test` ผ่านทั้งหมด

---

## 📋 3. Execution Plan & TDD Checklist

### Task 1: Update Immunity & CLI Engine Protection (`[TDD]`)
- [x] 1.1 `[TDD-Red]` เขียน Unit Test ใน `packages/create-nexus-devflow/test/vendor-skill-protection.test.ts` ตรวจสอบว่า custom skills ใน `.agents/skills/` และ `devflow/.vendor/` จะไม่ถูกลบเมื่อรัน `prepareUpdate()` แม้จะไม่มีใน template
- [x] 1.2 `[TDD-Green]` ปรับปรุง `packages/create-nexus-devflow/lib/update.ts` และ `packages/create-nexus-devflow/lib/skill-registry-engine.ts` รองรับ Update Immunity และ `skill update all`
- [x] 1.3 `[TDD-Refactor]` ตรวจสอบ edge cases และ argument parsing ใน `create-nexus-devflow.ts`

### Task 2: Core `/vendor` Skill Definition & Aliases
- [x] 2.1 `[TDD-Green]` สร้าง `.agents/skills/vendor/SKILL.md` ตามมาตรฐาน 5W1H พร้อมคำแนะนำ 4-Phase Ingestion Flow
- [x] 2.2 `[TDD-Green]` สร้าง `.claude/skills/vendor/SKILL.md` พร้อม aliases: `skill-add`, `add-skill`, `equip`, `ingest`
- [x] 2.3 `[TDD-Green]` ลงทะเบียนใน `agent-bundle.manifest.json` และเอกสาร `AGENTS.md`

### Task 3: Verification & Integration Run
- [x] 3.1 `[TDD-Green]` รัน `npm run check:static` เพื่อยืนยันความเข้ากันได้ของ adapter contracts
- [x] 3.2 `[TDD-Green]` รัน `npm test` ยืนยันว่าทุกชุดการทดสอบผ่าน 100%

---

## 🔍 4. Verification Matrix

| Category | Command / Check | Expected Result | Pass/Fail |
|---|---|---|---|
| Unit Test | `npx tsx --test packages/create-nexus-devflow/test/vendor-skill-protection.test.ts` | Tests pass 100% (2/2 passed) | **PASS** |
| Full Test Suite | `npm test` | All package tests pass (212/212 passed) | **PASS** |
| Static Contracts | `npm run check:static` | Adapters & schemas in sync | **PASS** |
| Framework Verification | `npm run check` | Types, lint, and packaging clean | **PASS** |

---

## 📝 5. Diff Evidence & Release Digest

### Changed Files
- `devflow/.vendor/` (Ignored in Git, vendor storage directory)
- `.agents/skills/vendor/SKILL.md`: New vendor ingestion skill definition with 4-Phase flow & aliases
- `.claude/skills/vendor/SKILL.md`: Claude mirror skill definition
- `packages/create-nexus-devflow/lib/update.ts`: Added Update Immunity for custom vendor skills, preserving `thirdPartySkills` & `customVendorSkills` across DevFlow updates
- `packages/create-nexus-devflow/lib/skill-registry-engine.ts`: Supported `"all"` alongside `"--all"` in `updateThirdPartySkills`
- `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`: Enhanced CLI spinner and arguments for `skill update all`
- `packages/create-nexus-devflow/test/vendor-skill-protection.test.ts`: Automated tests for update immunity & update all
- `packages/create-nexus-devflow/test/status.test.ts`: Fixed mock types for `CurrentWorkSummary` and `FindingsWarningCode`
- `devflow/build-plan.md`: Added Phase 37
- `AGENTS.md`: Registered `vendor` in canonical command names list
