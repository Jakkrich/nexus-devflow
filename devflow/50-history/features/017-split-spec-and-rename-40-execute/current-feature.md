# 📐 [RUN-017-split-spec-and-rename-40-execute] แยกคำสั่ง Fast-Track เป็น `/feature`, `/fix` และเปลี่ยน Deep-Track สเตจ 40 เป็น `40-execute` (Living Spec)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode)  
> **Branch**: `feature/split-spec-and-rename-40-execute-RUN-017`  
> **Created Date**: 2026-08-20  
> **Owner**: DevFlow Core Framework Team  

---

## 1. Specification & Scope

- **Problem Statement**:
  - ผู้ใช้งานประสบปัญหาความสับสนของชื่อคำสั่งเมื่อใช้งานผ่าน Autocomplete/Slash command:
    - คำว่า `spec` ซ้ำซ้อนระหว่างคำสั่งเริ่มต้น Fast-Track (`/spec`) กับสเตจ Deep-Track (`20-spec`) ทำให้เวลาพิมพ์คำว่า `spec` จะมีทั้งสองคำสั่งปรากฏขึ้นมา
    - คำว่า `implement` ซ้ำซ้อนระหว่างคำสั่ง Fast-Track (`/implement`) กับสเตจ Deep-Track (`40-implement`)
  - ต้องการปรับปรุงให้คำสั่งในทั้งสองฝั่งไม่มีคำซ้ำกัน โดยแยก `/spec` ฝั่ง Fast-Track ออกเป็น `/feature` และ `/fix` ตามมาตรฐาน Blueprint และเปลี่ยนชื่อสเตจของ Deep-Track จาก `40-implement` เป็น `40-execute` เพื่อให้ผู้ใช้ที่จำเลขสเตจ (`40-`) ใช้งานได้อย่างต่อเนื่องและเป็นธรรมชาติ (`30-plan` ➔ `40-execute`)

- **In-Scope**:
  1. **สเตจ Deep-Track `40-execute`**:
     - เปลี่ยนชื่อโฟลเดอร์และไฟล์สกิลจาก `40-implement` เป็น `40-execute` ทั้งใน `.agents/skills/` และ `.claude/skills/`
     - อัปเดตเนื้อหา Contract, Frontmatter, Routing Evals, Test Cases และเอกสารทั้งหมดที่อ้างถึง `40-implement` เป็น `40-execute`
  2. **คำสั่ง Fast-Track `/feature` & `/fix`**:
     - สร้าง/ปรับปรุง Skill `feature` และ `fix` ใน `.agents/skills/` และ `.claude/skills/` ให้เป็น First-Class Skills สำหรับเปิด Living Spec (`spec.md`)
     - รองรับการรับ Argument เช่น `/feature <title>`, `/feature IDEA-xxx`, `/fix <bug description>`, `/fix IDEA-xxx`
     - ปรับแต่ง Skill `spec` ให้ re-route หรือทำหน้าที่เป็น backward-compatible alias ไปยัง `/feature` / `/fix`
  3. **Framework Scripts & Tooling Updates**:
     - ปรับปรุงสคริปต์ใน `scripts/` (เช่น `validate-framework.ts`, `validate-framework.mjs`, `summarize-run-status.mjs`, `standardize-command-invocations.mjs` ฯลฯ) ให้รองรับ `40-execute`, `feature`, `fix`
     - อัปเดต `packages/create-nexus-devflow` เพื่อให้ template ที่แจกจ่ายมีโครงสร้างสกิลที่ถูกต้อง
  4. **Documentation & AGENTS.md Updates**:
     - อัปเดต `AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md`, `docs/` และ Website docs ให้สะท้อนโครงสร้างคำสั่งใหม่
  5. **Verification & Testing**:
     - ปรับปรุง `evals/routing/` ให้มี `40-execute.json`, `feature.json`, `fix.json` และทดสอบ Routing Benchmark
     - รัน `npm run typecheck`, `npm run check:static`, `npm run test:routing`, `npm test`, `npm run test:package`, และ `npm run check` All Green 100%

- **Out-of-Scope**:
  - ไม่เปลี่ยนแปลง Business Logic หรือ Contract ของสเตจอื่น (`00-discover`, `10-define`, `20-spec`, `30-plan`, `50-verify`, `60-report`, `70-release`, `/check`, `/complete`)

- **Acceptance Criteria**:
  - [x] **AC-1**: มี Skill `40-execute` สมบูรณ์ทั้งใน `.agents/skills/40-execute/SKILL.md` และ `.claude/skills/40-execute/SKILL.md` โดยไม่มี `40-implement` ตกค้าง
  - [x] **AC-2**: มี Skill `feature` และ `fix` สมบูรณ์สำหรับ Fast-Track Living Spec generation
  - [x] **AC-3**: อัปเดต `AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md` และเอกสารใน `docs/` ถูกต้องตรงกันทั้งหมด
  - [x] **AC-4**: Routing Evaluation Benchmark ผ่าน 100% สำหรับ `40-execute`, `feature`, `fix`
  - [x] **AC-5**: ผ่านการตรวจสอบ `npm run check` และ `npm test` ทุกรายการ 100% All Green

---

## 2. Plan & Test Strategy

- **Files to Modify / Create**:
  - `.agents/skills/40-execute/SKILL.md` & `.claude/skills/40-execute/SKILL.md`: [NEW / RENAME from 40-implement]
  - `.agents/skills/feature/SKILL.md` & `.claude/skills/feature/SKILL.md`: [NEW / ENHANCE]
  - `.agents/skills/fix/SKILL.md` & `.claude/skills/fix/SKILL.md`: [NEW / ENHANCE]
  - `.agents/skills/spec/SKILL.md` & `.claude/skills/spec/SKILL.md`: [MODIFY / ALIAS]
  - `evals/routing/40-execute.json`, `evals/routing/feature.json`, `evals/routing/fix.json`: [NEW / RENAME]
  - `scripts/validate-framework.ts`, `scripts/validate-framework.mjs`, `scripts/summarize-run-status.mjs`: [MODIFY]
  - `packages/create-nexus-devflow/lib/update.ts`: [MODIFY]
  - `AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md`, `docs/`: [MODIFY]

- **Test Decision**: `Required (Multi-Lane & Routing Benchmark)`
  - *Rationale*: การเปลี่ยนชื่อสเตจหลักและสกิลมีผลต่อ Framework Integrity, Static Checks, และ Routing Matcher จำเป็นต้องทดสอบครบทุกเลน
  - *Planned Cases*:
    - ทดสอบ Skill Parsing & Static Validation ว่า `40-execute`, `feature`, `fix` มีความถูกต้องตาม Contract
    - ทดสอบ Routing Benchmark ให้ได้ความแม่นยำ 100%
    - ทดสอบ Package Smoke Test ให้ Pack และ Overlay ได้อย่างสมบูรณ์

- **Impact & Rollback Strategy**:
  - *Impact*: แก้ปัญหาคำสั่งซ้ำซ้อนใน Autocomplete และทำให้ UX การใช้งาน Dual-Track ชัดเจนขึ้น
  - *Rollback*: Git revert commit ของ RUN-017

---

## 3. Implementation Checklist

### Phase 1: Skill Re-architecture & Deep-Track Rename
- [x] Task 1.1: สร้าง/เปลี่ยนชื่อ `.agents/skills/40-execute/` และ `.claude/skills/40-execute/` จาก `40-implement` พร้อมปรับปรุงเนื้อหาภายใน
- [x] Task 1.2: สร้าง/ปรับปรุง Skill `feature` และ `fix` ทั้งใน `.agents/skills/` และ `.claude/skills/`
- [x] Task 1.3: ปรับปรุง Skill `spec` ให้ทำหน้าที่เป็น Router/Alias ไปยัง `feature` / `fix`
- [x] Task 1.4: ลบโฟลเดอร์ `40-implement` เก่าออก

### Phase 2: Tooling, Scripts & Routing Evaluations
- [x] Task 2.1: อัปเดต `scripts/validate-framework.ts`, `scripts/validate-framework.mjs`, `scripts/update-skill-descriptions.mjs`, `scripts/summarize-run-status.mjs`, `scripts/standardize-command-invocations.mjs`
- [x] Task 2.2: อัปเดต `packages/create-nexus-devflow/lib/update.ts` และ README ต่างๆ
- [x] Task 2.3: ปรับปรุง `evals/routing/` (สร้าง `40-execute.json`, `feature.json`, `fix.json` และลบ `40-implement.json`)

### Phase 3: Documentation & Cross-references
- [x] Task 3.1: อัปเดต `AGENTS.md` และ `CLAUDE.md` ปรับผัง Track และ Invocation Table
- [x] Task 3.2: อัปเดต `README.md`, `README.th.md`, `docs/workspace-artifacts.md`, `docs/USAGE.md`, `docs/team-presets.md`
- [x] Task 3.3: อัปเดตเนื้อหาใน Skills อื่นๆ ที่เคยอ้างถึง `40-implement` หรือ `/spec` (เช่น `devflow`, `00-discover`, `10-define`, `20-spec`, `30-plan`, `50-verify`, `60-report`, `70-release`, `autopilot`, `help`)

### Phase 4: Full Multi-lane Verification & Quality Gate
- [x] Task 4.1: รัน `npm run typecheck` (0 errors)
- [x] Task 4.2: รัน `npm run check:static` (80 skills validated)
- [x] Task 4.3: รัน `npm run test:routing` (100.00% accuracy on 312 test cases)
- [x] Task 4.4: รัน `npm test` และ `npm run test:package` (3/3 unit tests pass, installer smoke test pass)
- [x] Task 4.5: รัน `npm run check` All Green 100%

---

## 4. Implementation Record

- **[Phase 1]**:
  - สร้าง `.agents/skills/40-execute/SKILL.md` และ `.claude/skills/40-execute/SKILL.md` เพื่อเปลี่ยนสเตจ 40 จาก Implement เป็น Execute
  - สร้าง First-Class Skills `/feature` และ `/fix` ในทั้ง `.agents/skills/` และ `.claude/skills/` สำหรับเปิด Living Spec (`spec.md`) แยกชัดเจน
  - ปรับปรุง Skill `spec` ให้ทำหน้าที่เป็น Router/Alias อย่างปลอดภัย
  - ลบโฟลเดอร์ `40-implement` เก่าออกทั้งหมด
- **[Phase 2]**:
  - อัปเดต TypeScript Framework Validation (`scripts/validate-framework.ts`, `validate-framework.mjs`) ให้ตรวจสอบ `40-execute` ใน Mainline Stages
  - อัปเดต `scripts/update-skill-descriptions.mjs`, `scripts/summarize-run-status.mjs`, `scripts/standardize-command-invocations.mjs`, `scripts/test-validate-checklists.mjs`, `scripts/test-verify-impact-contract.mjs`
  - อัปเดตตัวติดตั้ง `packages/create-nexus-devflow/lib/update.ts`
  - ปรับปรุง Routing Evaluations: สร้าง `40-execute.json`, `feature.json`, `fix.json` และลบ `40-implement.json`
- **[Phase 3]**:
  - อัปเดต `AGENTS.md` และ `CLAUDE.md` ปรับผัง Track และ Invocation Table
  - อัปเดตไฟล์เอกสารและคู่มือ 91 ไฟล์ทั่วทั้ง Repository ให้สอดคล้องกับ `40-execute`, `/feature`, `/fix`
- **[Phase 4]**:
  - `npm run typecheck`: Passed (0 errors).
  - `npm run check:static`: Passed (80 skills validated).
  - `npm run test:routing`: Evaluated 312 test cases across 78 skills. **Rank 1 Match Accuracy: 100.00%**.
  - `npm test`: 3/3 tests passed in `@jakkrichm/create-nexus-devflow`.
  - `npm run test:package`: Package smoke test cleanly overlaid 305 template files.
  - `npm run check`: **All Nexus-DevFlow checks PASSED successfully!**

---

## 5. Verification Evidence

- **Lane 1: Typecheck & Static Safety**:
  - `npm run typecheck` (`tsc --noEmit`): **Passed** (0 errors, 0 warnings).
  - `npm run check:static`: **Passed** (ตรวจสอบ 80 skills ใน `.agents/skills/` และ `.claude/skills/`, ผ่านข้อกำหนด Numbered Mainline และไม่มี Legacy paths).
- **Lane 2: Routing Accuracy & Unit Tests**:
  - `npm run test:routing`: **Passed** (ทดสอบ 312 routing scenarios บน 78 skills ได้คะแนน **100.00% Rank 1 Accuracy** โดย `40-execute`, `feature`, `fix` match แม่นยำ 100%).
  - `npm test`: **Passed** (3/3 unit tests ใน `@jakkrichm/create-nexus-devflow` ผ่านทั้งหมด).
- **Lane 3: Package Smoke Test & Master Gate**:
  - `npm run test:package`: **Passed** (Package tarball สร้างและ overlay ลง temp directory สมบูรณ์ 305 files).
  - `npm run check`: **Passed** (✅ All Nexus-DevFlow checks PASSED successfully!).
- **Acceptance Criteria Verification**:
  - [x] **AC-1**: มี Skill `40-execute` ใน `.agents/skills/` และ `.claude/skills/` และลบ `40-implement` ออกแล้ว 100%
  - [x] **AC-2**: มี Skill `feature` และ `fix` สมบูรณ์สำหรับเปิด Living Spec (`spec.md`)
  - [x] **AC-3**: อัปเดต `AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md` และเอกสารใน `docs/` สอดคล้องกันทั้งหมด 91 ไฟล์
  - [x] **AC-4**: Routing Evaluation Benchmark ผ่าน 100.00%
  - [x] **AC-5**: ผ่านการตรวจสอบ Master Gate `npm run check` All Green 100%

---

## 6. Release & Handoff

- **Release Digest**:
  - ปรับปรุงโครงสร้างคำสั่ง Nexus-DevFlow 2.0 (Dual-Track Model) ให้ไม่มีชื่อคำสั่งซ้ำซ้อนกันอย่างสมบูรณ์
  - **Fast-Track (Blueprint Mode)**: แยกคำสั่งเป็น First-Class Skills:
    - `/feature` : สำหรับเปิดงานพัฒนาฟีเจอร์ใหม่
    - `/fix` : สำหรับเปิดงานแก้ไขบั๊ก
    - ปรับปรุง `/spec` ให้ทำหน้าที่เป็น Alias/Router
  - **Deep-Track (Architect Mode)**: เปลี่ยนชื่อสเตจ 40 จาก `40-implement` เป็น `40-execute` เพื่อป้องกัน Autocomplete ชนกับ `/implement` และสื่อความหมายต่อเนื่องจาก `30-plan` ได้อย่างเป็นธรรมชาติ
  - อัปเดตสคริปต์ตรวจสอบ ตัวติดตั้ง `create-nexus-devflow` เอกสาร และ Routing Benchmark 100% All Green
- **Git Branch**: `feature/split-spec-and-rename-40-execute-RUN-017`
- **Merge Status**: Merged into `main` (Head)
- **Artifact Contract**: Fast-Track Single Living Spec (`spec.md`) completed.
- **Standalone HTML Report Tip**: หากต้องการเปิดดูรายงานสรุปในรูปแบบ Web Dashboard สามารถสั่งคำสั่ง `/report:html` (หรือ `npm run report:html -- RUN-017`) ได้ตามต้องการ
