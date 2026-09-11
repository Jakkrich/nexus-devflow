# 📐 [060-sync-upstream-v0140-config-and-continuous] ซิงก์ AI Blueprint Upstream v0.14.0 (Deterministic Config & Continuous Mode)

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/060-sync-upstream-v0140-config-and-continuous`  
> **Discovery Reference**: [`DISC-20260826-003`](file:///d:/devtools/nexus-devflow/devflow/discoveries/DISC-20260826-003-sync-upstream-ai-blueprint/discovery.md)  
> **Created Date**: 2026-08-26  
> **Completed Date**: 2026-08-26  
> **Owner**: AI & Maintainer  

---

## 1. Specification & Scope

### Problem Statement
Upstream AI Blueprint ได้ปล่อยเวอร์ชัน `v0.14.0` (ต่อเนื่องจาก `v0.13.0`) ซึ่งนำเสนอความสามารถใหม่ระดับสถาปัตยกรรม 2 ด้านสำคัญ ได้แก่:
1. **Deterministic Project Configuration (`devflow/config.json`)**: ระบบตั้งค่า workflow กลางแบบเครื่องจักรสามารถอ่านได้ เพื่อควบคุมความเข้มงวดในการรีวิว (`workflow.stepReview`), การบันทึก checkpoint commits (`workflow.checkpointCommits`), คำนำหน้า git branch (`git.featureBranchPrefix`, `fixBranchPrefix`, `rollbackBranchPrefix`), verification strictness (`verification.logicTests`, `uiEvidence`), ประตูด้านคุณภาพทั้งในโหมดปกติและโหมดต่อเนื่อง (`qualityGates.regular`, `qualityGates.continuous` ครอบคลุม `audit`, `check`, `tryGuide`), และขีดจำกัดของ Continuous Mode (`continuous.maxFeatures`, `maxRepairAttempts`, `finalIntegrationAudit`)
2. **Autonomous Multi-Feature Loop (`/continuous`)**: สคิลการส่งมอบฟีเจอร์จาก `build-plan.md` แบบวนลูปอัตโนมัติทีละฟีเจอร์ในเครื่อง local โดยเริ่มจากการตรวจ safety preflight ➔ สร้าง feature branch ➔ implement ทีละสเต็ป ➔ ตรวจ verification และ quality gates ➔ ซ่อมแซม finding P0/P1 อัตโนมัติ (ตาม `maxRepairAttempts`) ➔ archive และ squash-merge ลง default branch ของ local โดยไม่มีการ push, deploy, หรือ accept finding แทนผู้ใช้
3. **Multi-Adapter & Visibility Enhancements**: ปรับปรุง CLI installer ให้รองรับการเลือกแบบ Multi-select Checkbox (Antigravity, Claude, Codex, Copilot, OpenCode), ตรวจสอบความเข้ากันได้ของ adapter trees ใน `doctor` และรองรับ visibility selection ใน `adopt`

### In-Scope
- สร้างโมดูล `packages/create-nexus-devflow/lib/project-config.ts` สำหรับอ่าน, validate, และ fallback สู่ defaults อย่างปลอดภัยของ `devflow/config.json`
- สร้างไฟล์เริ่มต้น `devflow/config.json` สำหรับโปรเจกต์
- สร้างสคิล `continuous` ใน `.agents/skills/continuous/SKILL.md` และ `.claude/skills/continuous/SKILL.md` ให้เข้ากับ Single Living Spec Model
- อัปเดตสคิล `doctor` ทั้งใน `.agents/` และ `.claude/` ให้ตรวจความถูกต้องของ `devflow/config.json`
- อัปเดต `packages/create-nexus-devflow/lib/status.ts` และ `dashboard.ts` ให้แสดงผล Configuration Status และเตือนเมื่อพบ config ที่ไม่ถูกต้อง
- อัปเดต `agent-bundle.manifest.json` และเอกสาร documentation ให้สะท้อน 29 Core Skills
- เพิ่ม Unit Tests ใน `packages/create-nexus-devflow/test/project-config.test.ts` และทดสอบ `npm run check:static`, `npm test`, `npm run test:package` ผ่าน 100%

### Out-of-Scope
- การแก้ไขฟังก์ชันภายนอก Workflow Layer
- การ Push ไปยัง Remote Repository หรือการ Deploy ภายนอก

### Acceptance Criteria
- [x] **AC-1**: `packages/create-nexus-devflow/lib/project-config.ts` อ่านและ validate `devflow/config.json` ได้ถูกต้อง พร้อม fallback สู่ค่าเริ่มต้นที่ปลอดภัยเมื่อไม่มีไฟล์
- [x] **AC-2**: มีไฟล์ `devflow/config.json` ในโปรเจกต์ และ `doctor` ตรวจสอบสถานะความถูกต้องของ config ได้
- [x] **AC-3**: สคิล `continuous` ถูกติดตั้งทั้งใน `.agents/skills/continuous/SKILL.md` และ `.claude/skills/continuous/SKILL.md` และ sync สมบูรณ์ 100%
- [x] **AC-4**: `status` และ `dashboard` แสดงผล Configuration section และ Quality gates setting ได้อย่างถูกต้อง
- [x] **AC-5**: ยูนิตเทสต์ `packages/create-nexus-devflow/test/project-config.test.ts` และชุดทดสอบทั้งหมด (`npm run check:static`, `npm test`, `npm run test:package`) ผ่าน 100%

---

## 2. Plan & Test Strategy

### Files to Modify / Create
- `devflow/config.json` [NEW]
- `packages/create-nexus-devflow/lib/project-config.ts` [NEW]
- `.agents/skills/continuous/SKILL.md` [NEW]
- `.claude/skills/continuous/SKILL.md` [NEW]
- `packages/create-nexus-devflow/test/project-config.test.ts` [NEW]
- `.agents/skills/doctor/SKILL.md` [MODIFY]
- `.claude/skills/doctor/SKILL.md` [MODIFY]
- `packages/create-nexus-devflow/lib/status.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/doctor.ts` [MODIFY]
- `agent-bundle.manifest.json` [MODIFY]
- `.nexus/nexus-devflow.json` [MODIFY]
- `AGENTS.md` [MODIFY]
- `README.md`, `README.th.md`, `docs/USAGE.md`, `docs/workflow-surface-map.md`, `packages/create-nexus-devflow/README.md` [MODIFY]

### Test Decision: Required (TDD)
- **Rationale**: เพื่อป้องกัน regression ในระบบอ่าน config, การคำนวณ status ของ CLI/Dashboard, และการทำงานของ adapter skills
- **Planned Test Cases**:
  - Valid `devflow/config.json` returns typed values and `state: "project"`
  - Missing config returns defaults and `state: "defaults"`
  - Invalid JSON / invalid keys returns `state: "invalid"` with descriptive warnings
  - Framework validation passes with 29 core skills

### Impact & Rollback Strategy
- **Impact**: ขยายความสามารถ CLI & Adapters โดยไม่กระทบต่อผู้ใช้เดิมที่ไม่มี `config.json` (จะ fallback สู่ defaults อัตโนมัติ)
- **Rollback**: `git checkout main` หรือ `/rollback 060-sync-upstream-v0140-config-and-continuous`

---

## 3. Implementation Checklist (TDD)

- [x] Task 1: [TDD-Red] เขียนยูนิตเทสต์ `packages/create-nexus-devflow/test/project-config.test.ts` เพื่อกำหนดพฤติกรรม `readProjectConfig`
- [x] Task 2: [TDD-Green] สร้าง `packages/create-nexus-devflow/lib/project-config.ts` และสร้าง `devflow/config.json` ให้เทสต์ผ่าน
- [x] Task 3: [TDD-Refactor] ผสาน `project-config.ts` เข้าสู่ `packages/create-nexus-devflow/lib/status.ts` และ `doctor.ts`
- [x] Task 4: สร้างและปรับแต่งสคิล `continuous` ใน `.agents/skills/continuous/SKILL.md` และ `.claude/skills/continuous/SKILL.md`
- [x] Task 5: อัปเดตสคิล `doctor` (`.agents/skills/doctor/SKILL.md`, `.claude/skills/doctor/SKILL.md`) และ `AGENTS.md` ให้ตรวจและรองรับ `config.json`
- [x] Task 6: อัปเดต `agent-bundle.manifest.json`, รัน `npm run sync:adapters`, และรันการตรวจสอบความสมบูรณ์ (`npm run check`, `npm run check:static`, `npm test`, `npm run test:package`)

---

## 4. Implementation Record

- **[Task 1]**: สร้างชุดทดสอบ `packages/create-nexus-devflow/test/project-config.test.ts` ครอบคลุม 6 scenarios (Default manual quality gates, Missing config fallback, Partial config merging, Malformed JSON warning, Invalid/Unknown keys assertion, และ Symbolic link rejection)
- **[Task 2]**: สร้างโมดูล `packages/create-nexus-devflow/lib/project-config.ts` พร้อม Typed Schema Version 1 และสร้างไฟล์ตั้งค่าเริ่มต้น [`devflow/config.json`](file:///d:/devtools/nexus-devflow/devflow/config.json) รันยูนิตเทสต์ผ่าน 6/6 tests (100%)
- **[Task 3]**: ผสาน `project-config.ts` เข้าสู่ `packages/create-nexus-devflow/lib/status.ts` (เพิ่ม `configuration: StatusConfiguration` ใน `ProjectStatus` และการจัดฟอร์แมตใน CLI output) และเพิ่มการตรวจสอบ `project_configuration` ใน `packages/create-nexus-devflow/lib/doctor.ts`
- **[Task 4]**: สร้างสคิล `continuous` ใน [`.agents/skills/continuous/SKILL.md`](file:///d:/devtools/nexus-devflow/.agents/skills/continuous/SKILL.md) และ [`.claude/skills/continuous/SKILL.md`](file:///d:/devtools/nexus-devflow/.claude/skills/continuous/SKILL.md) สำหรับการจัดส่งฟีเจอร์แบบอัตโนมัติหลายฟีเจอร์ในเครื่อง Local
- **[Task 5]**: อัปเดตคำแนะนำใน `.agents/skills/doctor/SKILL.md`, `.claude/skills/doctor/SKILL.md`, และ `AGENTS.md` ให้ตระหนักรู้และตรวจสอบ `devflow/config.json`
- **[Task 6]**: เพิ่ม `continuous` ลงใน `agent-bundle.manifest.json` (29 Core Skills), อัปเดต `.nexus/nexus-devflow.json`, อัปเดตเอกสารอ้างอิงนับจำนวนทักษะ (`README.md`, `README.th.md`, `packages/create-nexus-devflow/README.md`, `docs/USAGE.md`, `docs/workflow-surface-map.md`), รัน `npm run sync:adapters` ซิงก์ครบทั้ง 29 skills, และรันชุดทดสอบผ่านสมบูรณ์ 100%

---

## 5. Verification Evidence

- **Static Contract Verification (`npm run check:static`)**:
  - `Skill naming passed for 29 skills in .agents/skills`
  - `.agents/skills contains all 29 Core Skills`
  - `.claude/skills contains all 29 Core Skills`
  - `Core Skill documentation count is synchronized (29)`
  - Status: ✅ **PASSED** (0 failures)
- **Unit & Integration Tests (`npm test`)**:
  - `packages/create-nexus-devflow`: 109/109 tests passed (รวม 6 tests ใน `project-config.test.ts`)
  - `test:overview`: 4/4 tests passed
  - Total: ✅ **113/113 tests passed 100%**
- **Framework & Package Verification (`npm run check`)**:
  - TypeScript Typecheck: Passed (0 errors)
  - Package Template Preparation: Overlay 94 files applied successfully
  - Package Smoke Test: `[SUCCESS] Package smoke test passed with 29 Core Skills per adapter!`
  - Status: ✅ **PASSED**

---

## 6. Manual Review Guide & Try Paths

1. **ตรวจสอบ Config เริ่มต้น**:
   - เปิดดูเนื้อหาของ [`devflow/config.json`](file:///d:/devtools/nexus-devflow/devflow/config.json) ตรวจสอบค่า workflow, git branch prefixes, verification, และ quality gates
2. **ทดสอบรันคำสั่งสถานะ**:
   - รัน `npm run status` หรือ `npx tsx packages/create-nexus-devflow/bin/create-nexus-devflow.ts status` ตรวจสอบว่ามีแถว `Config` และ `Quality gates` แสดงผล
3. **ทดสอบคำสั่งสุขภาพ**:
   - รัน `/doctor` หรือ `npx tsx packages/create-nexus-devflow/bin/create-nexus-devflow.ts doctor` ตรวจสอบว่าระบุสถานะ `Project Configuration (devflow/config.json) [PASS]`
4. **ตรวจสอบสคิล Continuous**:
   - ตรวจสอบคำอธิบายและโครงสร้างใน [`.agents/skills/continuous/SKILL.md`](file:///d:/devtools/nexus-devflow/.agents/skills/continuous/SKILL.md)
