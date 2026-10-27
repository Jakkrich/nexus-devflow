# Feature: Code-Modernization Recommended Third-Party Skill & Master Orchestrator

**From build-plan:** feature 111
**Build attempt:** 1

> **Status**: Verified  
> **Track**: Fast-Track (Task-Isolated Living Spec Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/discoveries/DISC-20261027-001-code-modernization-vendor-skill/discovery.md`  
> **Branch**: `feature/111-code-modernization-recommended-skill`  
> **Started Date**: 2026-10-27  
> **Delivered Date**: 2026-10-27  
> **Owner**: DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement
ผู้ใช้ที่ต้องการทำ Code Modernization (ปรับปรุง Legacy Codebase, อัปเกรดเวอร์ชันเดิมแบบ Uplift เช่น Java 8->17, หรือเขียนใหม่ทีละโมดูลแบบ Transform) ต้องการนำขุมกำลังจาก Official Plugin **`code-modernization`** ของ Anthropic มาใช้งานใน Nexus-DevFlow
อย่างไรก็ตาม:
1. ปลั๊กอินดังกล่าวอยู่ในโฟลเดอร์ย่อย `plugins/code-modernization` ของ Monorepo (`anthropics/claude-plugins-official`) ทำให้คำสั่ง `git clone` ปกติไม่ได้โครงสร้างเฉพาะของสกิล
2. ปลั๊กอินพึ่งพา Python verification engine ในโฟลเดอร์ `scripts/` (รวม 10 สคริปต์ 280+ KB เช่น `proof_pack.py`, `compare.py`, `build_report.py`) และ AI specialist personas ในโฟลเดอร์ `agents/` ซึ่ง DevFlow ยังไม่ได้ดึงเข้ามาในขั้นตอน vendor ingestion
3. ปลั๊กอินมีถึง 13 คำสั่งย่อยและขั้นตอนที่ซับซ้อน ทำให้ผู้ใช้ต้องจำคำสั่งจำนวนมาก
ฟีเจอร์นี้จึงเพิ่ม `code-modernization` เข้าเป็น **Recommended Third-Party Skill** พร้อมระบบ **Master Front-Door Orchestrator Skill (`/code-modernization` หรือ `/modernize`)** ที่ทำหน้าที่เป็นด่านหน้านำทาง State Machine อัตโนมัติ ผู้ใช้ไม่ต้องจำคำสั่งย่อยเองทั้งหมด

### 1.2 In-Scope
1. **CLI Registry & Ingestion Updates (`packages/create-nexus-devflow`)**:
   - เพิ่ม `code-modernization` ใน `KNOWN_SKILL_ALIASES` และ `RECOMMENDED_THIRD_PARTY_SKILLS`
   - เพิ่มการรองรับ `subpath` ใน `KNOWN_SKILL_ALIASES` สำหรับดึงโฟลเดอร์ย่อยจาก Monorepo (`plugins/code-modernization`)
   - อัปเดต `skill-registry-engine.ts` ให้ copy โฟลเดอร์ `scripts/` และ `agents/` เข้าสู่ `devflow/.vendor/<slug>/`
2. **Master Front-Door Orchestrator Skill Synthesis**:
   - สร้าง `.agents/skills/code-modernization/SKILL.md` (และ `.claude/skills/code-modernization/SKILL.md`)
   - ระบบตรวจจับสถานะ (State Inspector) ตรวจ `devflow/.vendor/code-modernization/`, `analysis/<system>/status.json`, `INTENT.md`
   - ด่านหน้า Interactive Q&A นำทางทีละสเต็ป พร้อมรองรับ Human Decision Gates 6 จุดผ่าน `ask_question`
   - เชื่อมโยงการเรียก Python verification scripts ผ่าน Terminal
3. **Documentation & Tests**:
   - อัปเดต `README.md` และ `README.th.md` ในหมวด Recommended Third-Party Skills
   - อัปเดตชุดทดสอบ `packages/create-nexus-devflow/test/skill-manager.test.ts` เพื่อรับรอง preset และ alias ใหม่

### 1.3 Out-of-Scope
- ไม่ทำการ Rewrite โค้ด Python ภายใน `scripts/` ของ Anthropic ใหม่ (คงความสมบูรณ์แบบ Bit-for-bit ต้นฉบับจาก Anthropic)
- ไม่แก้ไข Core 33 Skills เดิมของ DevFlow

### 1.4 Acceptance Criteria
- [x] **AC-1**: `KNOWN_SKILL_ALIASES` และ `RECOMMENDED_THIRD_PARTY_SKILLS` ใน `skill-registry-engine.ts` มี `code-modernization` ชี้ไปที่ `https://github.com/anthropics/claude-plugins-official` พร้อม `subpath: "plugins/code-modernization"`
- [x] **AC-2**: `skill-registry-engine.ts` สามารถ ingest โฟลเดอร์ย่อยจาก Git repo และ copy โฟลเดอร์ `scripts/` กับ `agents/` ไปยัง `devflow/.vendor/code-modernization/` ได้อย่างถูกต้อง
- [x] **AC-3**: มี Master Orchestrator Skill ที่ `.agents/skills/code-modernization/SKILL.md` (และ `.claude/skills/code-modernization/SKILL.md`) ที่ทำหน้าที่เป็นด่านหน้านำทาง ตรวจสอบ vendor availability, รายงานสถานะปัจจุบัน และเสนอขั้นตอนถัดไปโดยผู้ใช้ไม่ต้องจำคำสั่งย่อย
- [x] **AC-4**: เอกสาร `README.md` และ `README.th.md` ระบุคำสั่งติดตั้ง `npx nexus-devflow skill add code-modernization` ชัดเจน
- [x] **AC-5**: รัน `npm test` และ `npm run check:static` ผ่าน 100% ไม่มีข้อผิดพลาด

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `packages/create-nexus-devflow/lib/skill-registry-engine.ts` [MODIFY]
- `packages/create-nexus-devflow/test/skill-manager.test.ts` [MODIFY]
- `.agents/skills/code-modernization/SKILL.md` [NEW]
- `.claude/skills/code-modernization/SKILL.md` [NEW]
- `README.md` [MODIFY]
- `README.th.md` [MODIFY]
- `packages/create-nexus-devflow/README.md` [MODIFY]
- `devflow/build-plan.md` [MODIFY]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `when-sensitive` (เป็น vendor skill ingestion capability)
- **UI Evidence / Browser Tests**: Not applicable (CLI & Skill Protocol)
- **Review Strategy**: One feature-level review packet at completion

### 2.3 Test Decision: Required (TDD)
- **Rationale**: มีการปรับปรุง logic ของ `skill-registry-engine.ts` ในการ resolve aliases และ copy vendor assets จึงต้องใช้ TDD เพื่อป้องกัน regression

---

## 3. Implementation Checklist (Strict TDD)

- [x] **Task 1: Registry Engine & Alias Enhancements (TDD)**
  - [x] 1.1 `[TDD-Red]`: เพิ่ม test case ใน `skill-manager.test.ts` ตรวจสอบ `code-modernization` ใน `RECOMMENDED_THIRD_PARTY_SKILLS` และ `KNOWN_SKILL_ALIASES` พร้อม `subpath`
  - [x] 1.2 `[TDD-Green]`: อัปเดต `KNOWN_SKILL_ALIASES` และ `RECOMMENDED_THIRD_PARTY_SKILLS` ใน `skill-registry-engine.ts`
  - [x] 1.3 `[TDD-Refactor]`: เพิ่ม logic ให้ `skill-registry-engine.ts` ดึง subpath และ copy `scripts/` กับ `agents/`

- [x] **Task 2: Master Front-Door Orchestrator Skill Synthesis**
  - [x] 2.1 สร้าง `.agents/skills/code-modernization/SKILL.md` รองรับ State Machine, Vendor Check, JIT Persona, Python Execution และ Human Gates
  - [x] 2.2 ซิงค์ไฟล์ไปยัง `.claude/skills/code-modernization/SKILL.md`

- [x] **Task 3: Documentation & Verification**
  - [x] 3.1 อัปเดตตาราง Recommended Third-Party Skills ใน `README.md` และ `README.th.md`
  - [x] 3.2 บันทึกรายการลงใน `devflow/build-plan.md` (Item 111)
  - [x] 3.3 รัน `npm test`, `npm run check:static` และ `npm run check` ตรวจสอบความถูกต้องทั้งโปรเจกต์

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `tsc --noEmit` & `npm run check` PASSED (0 errors)
- **Automated Test Matrix**: 15/15 tests in `skill-manager.test.ts` passed; 221 tests in full suite passed
- **Static Contract Verification**: `npm run check:static` PASSED with 39 skills in `.agents/skills`
- **Package Smoke Test**: Overlay test passed with 126 files created in temp directory
- **Findings Ledger**: Verified `findings.md` is 100% clean

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [x] **AC-1**: `KNOWN_SKILL_ALIASES` contains `code-modernization` with subpath and `RECOMMENDED_THIRD_PARTY_SKILLS` contains 5 skills
- [x] **AC-2**: Subpath extraction and copying of `scripts/` and `agents/` verified by automated unit test
- [x] **AC-3**: Master Front-Door skill `.agents/skills/code-modernization/SKILL.md` and `.claude/skills/code-modernization/SKILL.md` verified
- [x] **AC-4**: Documentation updated in `README.md`, `README.th.md`, and `packages/create-nexus-devflow/README.md`
- [x] **AC-5**: Test suites and static validation passing cleanly

### 🔗 Axis 3: AC-to-Test Traceability Matrix

| Acceptance Criterion | File Tier | Automated Test Case / Assertion | Verification Command | Status |
| :--- | :--- | :--- | :--- | :---: |
| **AC-1** | Tier 1 (Logic) | `RECOMMENDED_THIRD_PARTY_SKILLS includes code-modernization` | `npm test` | ✅ Passed |
| **AC-2** | Tier 1 (Logic) | `installThirdPartySkill supports monorepo subpath and copies scripts and agents` | `npm test` | ✅ Passed |
| **AC-3** | Tier 4 (Tooling) | Static file check `.agents/skills/code-modernization/SKILL.md` | `npm run check:static` | ✅ Passed |
| **AC-4** | Tier 4 (Docs) | Markdown structure verification | `npm run check:static` | ✅ Passed |
| **AC-5** | Tier 1 (Full Suite) | Full CLI test pass & framework check | `npm run check` | ✅ Passed |

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: 2026-10-27
- **Verification Verdict**: PASSED
- **Framework Tests**: 15/15 unit tests pass cleanly
- **Static Contract**: 39 skills verified, token budgets compliant
- **Package Smoke Test**: Passed cleanly
