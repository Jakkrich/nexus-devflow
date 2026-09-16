# Feature: ซิงก์ส่วนขยาย Upstream AI Blueprint (v1.7.0 – v1.9.0)

**From build-plan:** 37. Sync Upstream v1.7.0 – v1.9.0 (Explore Skill, Proportional Engineering, Pre-Push Hook, Check Guide Consolidation & Dynamic Adapter Selection)  
**Build attempt:** 1  
**Discovery Ref:** [`devflow/discoveries/DISC-20260916-001-sync-upstream-ai-blueprint-v170-v190/discovery.md`](../../discoveries/DISC-20260916-001-sync-upstream-ai-blueprint-v170-v190/discovery.md)  
**Status:** Verified  
**Track:** Fast-Track (Task-Isolated Living Spec Mode - Feature)  
**Category:** Feature  
**Branch:** `feature/088-sync-upstream-ai-blueprint-v170-v190`  
**Started Date:** 2026-09-16  
**Delivered Date:** 2026-09-16  
**Owner:** DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement
จากการติดตาม Upstream AI Blueprint Repository (`D:/Projects/devtools/ai-blueprint`) พบว่ามีการปล่อย Release สำคัญ 3 เวอร์ชันติดต่อกัน (v1.7.0, v1.8.0, v1.9.0 รวม 23 commits) ซึ่งนำเสนอการปรับปรุงหลัก:
1. **New Skill `explore` (`/explore`, `$explore`)**: ทักษะสำหรับการสนทนาวิเคราะห์และเปรียบเทียบแนวคิดทางสถาปัตยกรรมแบบ Read-Only Grounded in Codebase โดยไม่มีการเขียนไฟล์หรือ Spec
2. **Consolidation of Manual Guides into `check` (`/check guide`)**: ยุบรวม `try` เข้าเป็นโหมดคู่มือทดสอบของ `check` แยกตาม Reference (`reference/verify.md` และ `reference/guide.md`)
3. **Consolidation of Unit & Browser Tests into `tests`**: ยุบรวมการตั้งค่าทดสอบเข้าเป็น `tests/reference/unit.md` และ `tests/reference/browser.md`
4. **Proportional Engineering Enforcement**: กฎระเบียบป้องกัน Over-engineering ตลอดทุกวงจรชีวิต พร้อมระบบตรวจจับใน `/doctor`
5. **Opt-in Pre-Push Git Hook**: ตัวเลือกติดตั้ง Local Git Hook ใน `/ci`
6. **Installer & Updater Hardening**: รองรับ Dynamic Adapter reconfiguration ใน `update`, Windows forward-slash normalization ใน History, และ Idempotent local linking

### 1.2 In-Scope
1. **Explore Skill**:
   - เพิ่ม `.agents/skills/explore/SKILL.md` และ `.claude/skills/explore/SKILL.md`
   - ลงทะเบียน `explore` ใน `core-skill-inventory.ts`, `agent-bundle.manifest.json`, และ `skill-registry-engine.ts`
2. **Check & Tests Consolidation**:
   - ปรับปรุง `.agents/skills/check/` และ `.claude/skills/check/` ให้รองรับ `/check` (Verification) และ `/check guide` (Manual Walkthrough)
   - ปรับปรุง `.agents/skills/setup-tests/` หรือ `tests` ให้รองรับ `reference/unit.md` และ `reference/browser.md` พร้อมคงการเชื่อมต่อกับ MCP `browseros-neo`
   - จัดการ Retired Path ของ `try` และ `browser-tests` ใน `update.ts`
3. **Proportional Engineering**:
   - บรรจุข้อกำหนด Proportional Engineering ใน `AGENTS.md` และ `CLAUDE.md`
   - อัปเดต `feature`, `implement`, `audit`, `continuous`, `autopilot`
   - เพิ่มการตรวจสอบใน `doctor` (`lib/doctor.ts` และ `skills/doctor/SKILL.md`)
4. **Opt-in Pre-Push Hook**:
   - อัปเดต `.agents/skills/ci/SKILL.md` และ `.claude/skills/ci/SKILL.md` ให้เสนอการติดตั้ง `.githooks/pre-push`
5. **CLI & Library Hardening**:
   - อัปเดต `packages/create-nexus-devflow/lib/update.ts` รองรับการเปลี่ยน Adapters แบบ interactive และ flags
   - อัปเดต `packages/create-nexus-devflow/lib/history.ts` ให้ normalize path บน Windows เป็น Forward Slash (`/`)
   - อัปเดต `scripts/link-local.ts` ให้ idempotent
6. **Evals Suite**:
   - เพิ่ม `evals/routing/explore.json` และอัปเดต `check.json`, `tests.json`, `brief.json`, `discovery.json`
7. **English-Only Standardization for Core Skills**:
   - ปรับปรุงเนื้อหาและคำอธิบายใน Skill files ทั้งหมด (.agents/skills และ .claude/skills) ให้เป็นภาษาอังกฤษล้วน 100% ตามข้อกำหนด

### 1.3 Out-of-Scope
- ไม่ลบหรือลดทอนขีดความสามารถเฉพาะของ DevFlow (เช่น SA `analyze`, `archify`, `bughunter`, `grill`, `convert-any-to-md`, `report-html`, `vendor`)
- ไม่เปลี่ยนแปลงโครงสร้าง Pure Task-Isolated Living Spec Workspace (`devflow/context/{xxx-slug}/`)

### 1.4 Acceptance Criteria
- [x] **AC-1**: มี Skill `explore` ทั้งใน `.agents/skills/explore/SKILL.md` และ `.claude/skills/explore/SKILL.md` สามารถตอบสนองการค้นคว้าแบบ Read-Only ได้อย่างสมบูรณ์
- [x] **AC-2**: `check` skill รองรับทั้ง `/check` (Behavioral Verification) และ `/check guide` (Manual Walkthrough) โดยแยก Reference ชัดเจน
- [x] **AC-3**: `AGENTS.md` มีส่วน Proportional Engineering Guidance และ `/doctor` ตรวจจับได้อย่างถูกต้อง
- [x] **AC-4**: `/ci` มีขั้นตอนแนะนำการติดตั้ง Local Pre-Push Git Hook
- [x] **AC-5**: `update` command รองรับการเปลี่ยน Adapters (`--codex`, `--claude` ฯลฯ) และ History Archive ใช้ Forward Slash เสมอ
- [x] **AC-6**: ผ่านชุดทดสอบทั้งหมด (`npm run check:static`, `npm test`, `npm run test:evals`) 100%

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `.agents/skills/explore/SKILL.md` [NEW]
- `.claude/skills/explore/SKILL.md` [NEW]
- `.agents/skills/check/SKILL.md` [MODIFY]
- `.agents/skills/check/reference/guide.md` [NEW]
- `.agents/skills/check/reference/verify.md` [NEW]
- `.claude/skills/check/SKILL.md` [MODIFY]
- `.claude/skills/check/reference/guide.md` [NEW]
- `.claude/skills/check/reference/verify.md` [NEW]
- `.agents/skills/ci/SKILL.md` [MODIFY]
- `.claude/skills/ci/SKILL.md` [MODIFY]
- `.agents/skills/doctor/SKILL.md` [MODIFY]
- `.claude/skills/doctor/SKILL.md` [MODIFY]
- `.agents/skills/feature/SKILL.md` [MODIFY]
- `.claude/skills/feature/SKILL.md` [MODIFY]
- `.agents/skills/implement/SKILL.md` [MODIFY]
- `.claude/skills/implement/SKILL.md` [MODIFY]
- `.agents/skills/audit/SKILL.md` [MODIFY]
- `.claude/skills/audit/SKILL.md` [MODIFY]
- `AGENTS.md` [MODIFY]
- `CLAUDE.md` [MODIFY]
- `agent-bundle.manifest.json` [MODIFY]
- `packages/create-nexus-devflow/lib/core-skill-inventory.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/doctor.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/history.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/update.ts` [MODIFY]
- `scripts/link-local.ts` [MODIFY]
- `scripts/check-upstream-drift.ts` [MODIFY]
- `evals/routing/explore.json` [NEW]
- `evals/routing/check.json` [MODIFY]
- `evals/routing/brief.json` [MODIFY]
- `evals/routing/discovery.json` [MODIFY]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `when-sensitive` (Feature นี้แตะต้อง Core Skills และ Library Engine จึงเปิดใช้งาน Quality Gate)
- **UI Evidence / Browser Tests**: Not applicable (Core Engine & Tooling)
- **Review Strategy**: One feature-level review packet at completion

### 2.3 Test Decision: Required (TDD)
- **Rationale**: การปรับปรุง Core Skills, Library Updater, และ Manifest ส่งผลต่อความถูกต้องในการติดตั้งและการทำงานของ Agent จึงต้องมี TDD ครอบคลุม

---

## 3. Implementation Checklist (Strict TDD)

- [x] **Task 1: Core Skills Upstream Sync (Explore, Check Guide, CI Hook, Doctor & Proportional Rules)**
  - [x] 1.1 `[TDD-Red]`: เขียน Unit Test สำหรับ `explore` skill definition และ contract verification
  - [x] 1.2 `[TDD-Green]`: สร้าง `.agents/skills/explore/SKILL.md` และ `.claude/skills/explore/SKILL.md` พร้อมปรับปรุง `check`, `ci`, `doctor`, `feature`, `implement`, `audit`, `continuous`, `autopilot`
  - [x] 1.3 `[TDD-Refactor]`: ตรวจสอบคำอธิบาย Frontmatter และความถูกต้องของภาษาอังกฤษล้วน 100%

- [x] **Task 2: Project Guidelines & Architecture Alignment (AGENTS.md & CLAUDE.md)**
  - [x] 2.1 `[TDD-Red]`: เขียนการตรวจเช็ค Proportional Engineering ใน `doctor.test.ts`
  - [x] 2.2 `[TDD-Green]`: อัปเดต `AGENTS.md` และ `CLAUDE.md` บรรจุข้อกำหนด Proportional Engineering
  - [x] 2.3 `[TDD-Refactor]`: ตรวจสอบ Cross-tool adapter references

- [x] **Task 3: Installer & Engine Upgrades (`packages/create-nexus-devflow`)**
  - [x] 3.1 `[TDD-Red]`: อัปเดต unit tests สำหรับ `update.test.ts`, `doctor.test.ts`, `history.test.ts`, `core-skill-inventory.test.ts`
  - [x] 3.2 `[TDD-Green]`: อัปเดต `agent-bundle.manifest.json`, `update.ts`, `doctor.ts`, `history.ts`, `core-skill-inventory.ts`, `scripts/link-local.ts`, `scripts/check-upstream-drift.ts`
  - [x] 3.3 `[TDD-Refactor]`: ยืนยันการ compile และ type check ผ่าน 100%

- [x] **Task 4: Routing Evals Suite & Verification Matrix**
  - [x] 4.1 `[TDD-Red]`: เพิ่ม `evals/routing/explore.json` และอัปเดต routing fixtures
  - [x] 4.2 `[TDD-Green]`: รัน `npm run test:evals` และ `npm test`
  - [x] 4.3 `[TDD-Refactor]`: รัน `npm run check:static` และ `npm run overview -- --write`

- [x] **Task 5: Final Review, History & Documentation**
  - [x] 5.1 `[TDD-Red]`: ตรวจสอบ `findings.md` ว่าไม่มี blocker ใดๆ
  - [x] 5.2 `[TDD-Green]`: บันทึก Release Log ลง `CHANGELOG.md`
  - [x] 5.3 `[TDD-Refactor]`: เตรียมพร้อมสำหรับการส่งมอบ

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `tsc -p tsconfig.json` compile สำเร็จ 100% ไร้ข้อผิดพลาด
- **Automated Test Matrix**: `npm test` ผ่าน 273 tests ครบทุกชุด (212 unit/integration + 4 overview + 11 sandbox + 5 run-state + 41 tooling)
- **Static Contract Verification**: `npm run check:static` ตรวจสอบ 33 Core Skills ข้าม 2 Adapters, สัญญาเอกสาร และโครงสร้างผ่าน 100%
- **Package Smoke Test**: `npm run test:package` build, pack, และทดสอบ overlay sandbox ผ่าน 100% (139 files created)
- **Findings Ledger**: ตรวจสอบ `findings.md` สะอาด 100% ไม่มี P0/P1/P2 คงค้าง

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [x] **AC-1**: Skill `explore` ใช้งานได้ทั้งสอง Adapters (`.agents/skills/explore/SKILL.md` และ `.claude/skills/explore/SKILL.md`)
- [x] **AC-2**: `check` รองรับทั้ง behavioral verification และ guide mode (`reference/guide.md` และ `reference/verify.md`)
- [x] **AC-3**: `AGENTS.md` บรรจุ Proportional Engineering และผ่านการตรวจของ `/doctor`
- [x] **AC-4**: `/ci` รองรับการติดตั้ง Pre-Push Git Hook
- [x] **AC-5**: `update` command รองรับการสลับ Adapters และ Windows path normalization
- [x] **AC-6**: Test Suite ทั้งหมดผ่าน 100%

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: 2026-09-16
- **Verification Verdict**: Verified (All 6 ACs Met & 100% Gates Passed)
- **Framework Tests**: 273 passed / 0 failed
- **Static Contract**: 100% Validated (33 Core Skills)
- **Package Smoke Test**: 100% Passed
