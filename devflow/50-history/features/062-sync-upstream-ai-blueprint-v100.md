# 📐 [062-sync-upstream-ai-blueprint-v100] ซิงก์ AI Blueprint Upstream v1.0.0 / v1.0.1 (Activity Contract, Rollback Safeguards & Local Linking)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/062-sync-upstream-ai-blueprint-v100`  
> **Discovery Reference**: [`DISC-20260828-001-sync-upstream-ai-blueprint-v100`](../../discoveries/DISC-20260828-001-sync-upstream-ai-blueprint-v100/discovery.md)  
> **Created Date**: 2026-08-28  
> **Completed Date**: 2026-08-28  
> **Owner**: AI & Maintainer  

---

## 1. Specification & Scope

### Problem Statement
Upstream AI Blueprint ได้ปล่อยเวอร์ชัน `v1.0.0` และ `v1.0.1` โดยยกระดับมาตรฐานความเสถียรและความปลอดภัยของ Framework ในหลายส่วนสำคัญ:
1. **Dashboard Activity State Contract (`devflow/.state/run.json`)**: กำหนด Local State Schema บันทึกสถานะคำสั่งแบบเรียลไทม์ (`running`, `blocked`, `ready`, `completed`) พร้อม `boundary`, `progress`, `resumeCommand`, `feature`, และการตรวจจับ Stale Activity (> 1 ชั่วโมง) รวมถึงระบบ Auto-refresh บน Dashboard
2. **Rollback & Complete Safeguards**:
   - `/rollback` ต้องบันทึก Commit SHA และ Parent SHA แบบเต็ม 40 ตัวอักษร และหยุดการทำงานทันทีหาก Commit เป้าหมายเป็น Merge Commit
   - `/implement` ตรวจสอบทั้ง 2 SHAs, ตรวจสอบว่าเป็น Ancestor ของ `HEAD`, ตรวจสอบ Single Parent และความสะอาดของ Git Working Tree ก่อนทำ Reverse Diff
   - `/complete` จะไม่ลบหรือ Archive Finding ที่มีสถานะเป็น `fixed` จนกว่าจะผ่านการ Re-audit เพื่อความปลอดภัยสูงสุด
3. **Local Checkout Linking & CLI Package Root Resolution**:
   - เพิ่ม `scripts/link-local.ts` และคำสั่ง `npm run link:local` / `unlink:local` สำหรับ Build & Link CLI package แบบ Local Offline
   - ฟังก์ชัน `findPackageRoot()` ค้นหา `package.json` ป้องกัน Path ผิดพลาดเมื่อรันจาก Source Checkout
4. **Onboarding Markers & Windows Path Normalization**:
   - Marker `<!-- devflow:onboarding-required -->` ใน `AGENTS.md` และการตรวจจับใน `/status`
   - ปรับปรุง Path Separator ของ Config ให้อยู่ในรูป `/` สม่ำเสมอ และปรับปรุง Windows Smoke Test Quoting

### In-Scope
- สร้างโมดูล `packages/create-nexus-devflow/lib/run-state.ts` และชุดทดสอบ `test/run-state.test.ts`
- ผสาน Activity State เข้าสู่ `packages/create-nexus-devflow/lib/status.ts`, `dashboard.ts` และ `dashboard-page.ts`
- สร้าง `scripts/link-local.ts` และเพิ่ม `npm run link:local` / `unlink:local` ใน Root `package.json`
- อัปเดต `findPackageRoot()` ใน `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`
- เสริมความปลอดภัยในสคิล `.agents/skills/` และ `.claude/skills/` (`rollback`, `implement`, `complete`, `status`, `tests`, `onboard`, `overview`, `autopilot`, `continuous`, `ci`, `prototype`, `release`)
- ประกาศ Activity State Contract ใน `AGENTS.md`
- ปรับปรุง `scripts/smoke-package.ts` และ Path Normalization
- อัปเดต `CHANGELOG.md` และ `.nexus/nexus-devflow.json`
- รันชุดทดสอบความสมบูรณ์ (`npm run check`, `npm run check:static`, `npm test`, `npm run test:package`) ผ่าน 100%

### Out-of-Scope
- การเปลี่ยนแปลงโครงสร้างหลักของ Pure Task-Isolated Living Spec หรือ 3-Pillars Architecture
- การเปลี่ยนภาษาเริ่มต้นของ Artifact (คงไว้ที่ภาษาไทย `th`)
- การ Push หรือ Deploy ภายนอก

### Acceptance Criteria
- [x] **AC-1**: `packages/create-nexus-devflow/lib/run-state.ts` อ่าน, เขียน, และ parse Activity State (`run.json`) ได้อย่างถูกต้องตาม Schema Version 1 พร้อมตรวจจับ Stale Activity
- [x] **AC-2**: `status` และ `dashboard` แสดงผล Live Activity State, Mode, Progress, Boundary และ Resume Command ได้อย่างถูกต้อง
- [x] **AC-3**: มีสคริปต์ `scripts/link-local.ts` และคำสั่ง `npm run link:local` / `unlink:local` ใน `package.json` และ `findPackageRoot()` ใน CLI ค้นหา Root ได้ถูกต้องทั้ง published และ checkout layout
- [x] **AC-4**: สคิล `rollback` และ `implement` บังคับใช้ Full 40-char SHA และบล็อกการ Rollback Merge Commit อัตโนมัติอย่างรัดกุม
- [x] **AC-5**: สคิล `complete` คงสถานะ `fixed` finding ไว้ใน Ledger ไม่ลบหรือ Archive ก่อนผ่านการ Re-audit
- [x] **AC-6**: ชุดทดสอบทั้งหมด (`npm run check:static`, `npm test`, `npm run test:package`) ผ่าน 100%

---

## 2. Plan & Test Strategy

### Files to Modify / Create
- `packages/create-nexus-devflow/lib/run-state.ts` [NEW]
- `packages/create-nexus-devflow/test/run-state.test.ts` [NEW]
- `scripts/link-local.ts` [NEW]
- `packages/create-nexus-devflow/lib/status.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/dashboard.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/dashboard-page.ts` [MODIFY]
- `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/project-config.ts` [MODIFY]
- `package.json` [MODIFY]
- `scripts/smoke-package.ts` [MODIFY]
- `AGENTS.md` [MODIFY]
- `.agents/skills/rollback/SKILL.md`, `.claude/skills/rollback/SKILL.md` [MODIFY]
- `.agents/skills/implement/SKILL.md`, `.claude/skills/implement/SKILL.md` [MODIFY]
- `.agents/skills/complete/SKILL.md`, `.claude/skills/complete/SKILL.md` [MODIFY]
- `.agents/skills/status/SKILL.md`, `.claude/skills/status/SKILL.md` [MODIFY]
- `.agents/skills/` & `.claude/skills/` (first action activity logging) [MODIFY]
- `CHANGELOG.md` [MODIFY]
- `.nexus/nexus-devflow.json` [MODIFY]

### Test Decision: Required (TDD)
- **Rationale**: เพื่อรับประกันความถูกต้องของ Activity State Parser, Stale Calculation, Package Root Resolver, และความปลอดภัยของ Rollback/Complete logic
- **Planned Test Cases**:
  - Valid `run.json` parse returns typed activity summary
  - Stale `run.json` (> 1 hr) triggers `stale_run_state` warning
  - Missing `run.json` returns idle state cleanly
  - Malformed JSON / invalid schema returns malformed state with clear warning
  - Package root lookup functions properly

### Impact & Rollback Strategy
- **Impact**: ยกระดับระบบติดตามและ Audit โดยไม่มี Breaking Changes ต่อ Task-Isolated Spec เดิม
- **Rollback**: `git checkout main` หรือ `/rollback 062-sync-upstream-ai-blueprint-v100`

---

## 3. Implementation Checklist (TDD)

- [x] Task 1: [TDD-Red] สร้างชุดทดสอบ `packages/create-nexus-devflow/test/run-state.test.ts` สำหรับ Activity State Schema Version 1
- [x] Task 2: [TDD-Green] สร้าง `packages/create-nexus-devflow/lib/run-state.ts` ให้ผ่านยูนิตเทสต์ทุกกรณี
- [x] Task 3: [TDD-Refactor] ผสาน `run-state.ts` เข้ากับ `status.ts`, `dashboard.ts`, และ `dashboard-page.ts` พร้อมแสดง Live Activity ใน CLI / Webview
- [x] Task 4: สร้าง `scripts/link-local.ts`, เพิ่ม `npm run link:local` / `unlink:local` ใน `package.json` และอัปเดต `findPackageRoot()` ใน `bin/create-nexus-devflow.ts`
- [x] Task 5: อัปเกรดสคิลความปลอดภัย `rollback`, `implement`, `complete` และ `status` ทั้งใน `.agents/` และ `.claude/` (Full 40-char SHA, Merge commit check, Fixed finding persistence)
- [x] Task 6: เพิ่ม Activity First-Action Protocol ลงใน Skills และประกาศ Dashboard Activity Contract ใน `AGENTS.md`
- [x] Task 7: ปรับปรุง `scripts/smoke-package.ts` (Windows Quoting), Config Path Normalization (`/`), อัปเดต `.nexus/nexus-devflow.json`, `CHANGELOG.md` และรันชุดทดสอบเต็มรูปแบบ (`npm run check`, `npm run check:static`, `npm test`, `npm run test:package`)

---

## 4. Implementation Record

- **Activity State Contract & Engine**:
  - สร้าง `packages/create-nexus-devflow/test/run-state.test.ts` และ `packages/create-nexus-devflow/lib/run-state.ts`
  - รองรับการอ่านและ validate ไฟล์ `devflow/.state/run.json` (Schema Version 1) พร้อมตรวจจับ stale running (> 1 ชั่วโมง)
  - ผสาน Live Activity เข้าสู่ CLI `status.ts` และ Webview Studio
- **Local Linking & Root Resolution**:
  - พัฒนา `scripts/link-local.ts` รองรับการทำ npm pack, build, global install จาก local tarball
  - เพิ่ม script `"link:local"` และ `"unlink:local"` ใน `package.json`
  - พัฒนาฟังก์ชัน `findPackageRoot()` ค้นหา `package.json` ตาม directory hierarchy ป้องกัน runtime crash จาก source checkout
- **Workflow & Safeguards Parity**:
  - อัปเกรด `/rollback` ป้องกัน merge commit และบังคับใช้ Full 40-char commit SHA
  - อัปเกรด `/implement` ตรวจสอบ parent single SHA, ancestor check กับ `HEAD` ก่อน reverse patch
  - อัปเกรด `/complete` ล็อคไม่ให้ลบ/archive finding สถานะ `fixed` จนกว่าจะผ่านการตรวจปิดโดย `/audit`
  - อัปเกรด `/status` ตรวจสอบ Live Activity และ `<!-- devflow:onboarding-required -->` marker
  - เพิ่ม First-Action Protocol ให้ทุก tracked skills บันทึกสถานะลง `devflow/.state/run.json`
  - ซิงค์ `.agents/skills/` ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
- **Project Configuration & Release Hygiene**:
  - Normalization path เป็น `"devflow/config.json"`
  - เพิ่มบันทึก Changelog เวอร์ชัน `2.9.0` ใน `CHANGELOG.md`

---

## 5. Verification Evidence

- `npm test`: ผ่าน 100% (118/118 tests ใน `packages/create-nexus-devflow` + 4/4 overview tests)
- `npm run check:static`: ผ่าน 100% (29 core skills, manifest synchronization, adapters parity)
- `npm run check`: ผ่าน 100% (typecheck, static framework validation, routing evals, test suite, smoke package test)

---

## 6. Findings

*0 blocking P0/P1 findings.*
