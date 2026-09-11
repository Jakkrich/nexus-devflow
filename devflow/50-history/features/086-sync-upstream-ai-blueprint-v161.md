# Feature: Sync Upstream AI Blueprint v1.6.1 (Installer Symlink Rejection, Completion Recovery Engine, Rebuild History Preservation, Local-Only Spec Review & Status Evidence Alignment)

**From build-plan:** feature 36

> **Status**: `Verified`  
> **Track**: `Unified Fast-Track (Task-Isolated Living Spec Mode - Feature)`  
> **Category**: `features`  
> **Source**: `devflow/build-plan.md: Feature 36` & `devflow/discoveries/DISC-20260911-001-sync-upstream-ai-blueprint-v161/discovery.md`  
> **Branch**: `feature/086-sync-upstream-ai-blueprint-v161`  
> **Started Date**: 2026-09-11  
> **Delivered Date**: TBD  
> **Owner**: DevFlow Core Framework Team & AI  
> **Quality Gate Policy (`independentReview`)**: `when-sensitive` → **Sensitive Boundary Triggered** (กระทบระบบความปลอดภัยของตัวติดตั้ง การปฏิเสธ Symlink Traversal และระบบความสมบูรณ์ของการทำ Git Commit / Squash-Merge ใน Completion Recovery) → บังคับรัน Independent Review Gate ก่อนการส่งมอบ

---

## 1. Specification & Scope

### 1.1 Problem Statement
Upstream AI Blueprint ได้ออกเวอร์ชัน `v1.6.1` เพื่อปิดช่องโหว่ความปลอดภัย ยกระดับเสถียรภาพการส่งมอบงาน และเพิ่มความถูกต้องของสถานะโครงการใน 5 ประเด็นสำคัญ:
1. **Installer Symlink Traversal & Partial Installs**: ตัวติดตั้งขาดการตรวจสอบปลายทางก่อนคัดลอกไฟล์ ทำให้เสี่ยงต่อการถูกเจาะผ่าน Symbolic Links หรือเกิดสถานะติดตั้งค้างครึ่งๆ กลางๆ
2. **Fragile Completion Interruption**: การส่งมอบงานผ่าน `/complete` หรือ Continuous Mode ที่สะดุดกลางคัน ขาดกลไก Signature ตรวจสอบและกู้คืน (Recovery) ทำให้เสี่ยงต่อการเขียน Archive ซ้ำซ้อน หรือสูญเสียบริบทของ Git commits
3. **History Overwrite on Rebuilt Features**: ฟีเจอร์ที่ถูกทำซ้ำหลังการ Rollback จะเขียนทับ Archive เดิม ทำลายประวัติการตรวจสอบย้อนหลังและ Findings References
4. **Local-Only Spec Review Friction**: Spec ที่ตั้งใจไม่ commit ลง Git ไม่สามารถผ่านการตรวจทานอิสระ (Independent Review) ได้อย่างถูกต้อง
5. **False Ready State on Verification Failure**: สถานะโครงการและ Dashboard แสดงพร้อมส่งมอบ (`ready`) แม้ว่า `verification failed` หรือเอกสาร Findings / Review ชำรุด

Nexus-DevFlow จำเป็นต้องนำ 5 เสาหลักนี้มาปรับใช้ให้สอดรับกับโมเดล **Task-Isolated Living Spec (`devflow/context/{xxx-slug}/`)** อย่างสมบูรณ์

---

### 1.2 In-Scope
1. **Installer Destination Validation**:
   - เพิ่ม `validateInstallDestinations()` และ `assertDestinationType()` ใน `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`
   - ตรวจจับและปฏิเสธ Symbolic Links, ตรวจความเข้ากันได้ของ Type (Directory vs File) ก่อนการคัดลอกไฟล์จริง
   - เพิ่มชุดทดสอบครบวงจรใน `packages/create-nexus-devflow/test/install.test.ts`
2. **Completion Recovery Protocol**:
   - สร้างเอกสารสัญญา `completion-recovery.md` ใน `.agents/skills/complete/reference/` และ `.claude/skills/complete/reference/`
   - ปรับปรุง `complete/SKILL.md` และ `continuous/SKILL.md` ให้ฝังและอ่าน JSON Comment Annotation `<!-- devflow:completion {...} -->`
   - รองรับการ Resume กู้คืนงานครบทั้ง 3 Phase (Phase 1: Archive written, Phase 2: Work commit made on branch, Phase 3: Merged into main)
3. **Rebuild History Preservation**:
   - สร้างเอกสารสัญญา `build-history.md` ใน `.agents/skills/feature/reference/` และ `.claude/skills/feature/reference/`
   - ปรับปรุง `feature/SKILL.md`, `rollback/SKILL.md`, และ `continuous/SKILL.md` ให้รองรับรูปแบบชื่อไฟล์ `--build-N` (สำหรับ Attempt N > 1) เมื่อ Rebuild ฟีเจอร์ที่เคยถูก Rollback
4. **Local-Only Spec Review & Snapshot Verification**:
   - ขยาย `packages/create-nexus-devflow/lib/review.ts` ให้รองรับฟิลด์ `specSnapshot` (`devflow/.state/review-specs/${targetCommit}-${specHash}.md`)
   - ปรับปรุง `audit/SKILL.md` และ `audit/reference/independent-review.md`
   - เพิ่มชุดทดสอบใน `packages/create-nexus-devflow/test/review.test.ts`
5. **Status Evidence Alignment & Blocker Classification**:
   - บูรณาการ `classifyWorkEvidence()` ใน `packages/create-nexus-devflow/lib/project-status-engine.ts` และ `dashboard.ts`
   - บล็อกสถานะ Ready เมื่อพบ `verification failed`, `verification incomplete`, `malformed_findings`, หรือ `unsafe_findings_path`
   - ชี้แนะ Next Action สู่ `/implement` เมื่อ verification failed หรือ `/doctor` เมื่อพบ faults
   - เพิ่มชุดทดสอบใน `packages/create-nexus-devflow/test/status.test.ts` และ `dashboard.test.ts`
6. **Multi-Adapter Parity & Verification Gate**:
   - ซิงก์เนื้อหาระหว่าง `.agents/` และ `.claude/` ทุกไฟล์
   - อัปเดต `scripts/check-upstream-drift.ts` และ `scripts/validate-framework.ts`
   - ยืนยันการรัน `npm run check:static`, `npm test`, และ `npm run test:package` ผ่าน 100%

---

### 1.3 Out-of-Scope
- ไม่เปลี่ยนแปลงโครงสร้าง The 3-Pillars Core Directories (`devflow/ideas.md`, `devflow/context/{xxx-slug}/`, `devflow/history/`)
- ไม่แตะต้องสคิลเฉพาะทางที่ติดตั้งเสริม (`bughunter`, `archify`, `diagram-design`, `ponytail`)
- ไม่แตะต้องโครงสร้าง MCP Server Hub (`packages/create-nexus-devflow/lib/mcp-server-engine.ts`)

---

### 1.4 Acceptance Criteria (เกณฑ์การตรวจรับ)
- [ ] **AC-1 (Installer Validation)**: คำสั่งติดตั้งของ `create-nexus-devflow` ปฏิเสธการติดตั้งผ่าน Symbolic Links และ Incompatible Paths ก่อนคัดลอกไฟล์จริง พร้อมชุดทดสอบ `install.test.ts` ผ่าน 100%
- [ ] **AC-2 (Completion Recovery)**: มีสัญญา `completion-recovery.md` ครบทั้งสอง adapter และ `/complete` ฝัง JSON Comment Annotation `<!-- devflow:completion {...} -->` รองรับการ Resume กู้คืนทั้ง 3 Phase
- [ ] **AC-3 (Build History)**: มีสัญญา `build-history.md` ครบทั้งสอง adapter และ `/feature` จัดการตั้งชื่อไฟล์แบบ `--build-N` เมื่อ Rebuild ฟีเจอร์ที่เคยถูก Rollback โดยไม่เขียนทับ Archive เดิม
- [ ] **AC-4 (Local-Only Review)**: `review.ts` รองรับฟิลด์ `specSnapshot` สามารถตรวจทานและสร้าง Receipt สำหรับ Local-only living spec ใน `devflow/.state/review-specs/` ได้อย่างถูกต้อง
- [ ] **AC-5 (Status Evidence Alignment)**: `project-status-engine.ts` และ `dashboard.ts` นำ `classifyWorkEvidence()` มาบล็อกสถานะ Ready เมื่อ Verification ล้มเหลว หรือพบ Faults และนำทางผู้ใช้ไปสู่ `/implement` หรือ `/doctor` อย่างถูกต้อง
- [ ] **AC-6 (Verification & Parity)**: `scripts/check-upstream-drift.ts` รายงานสถานะซิงก์ Upstream สมบูรณ์ และชุดทดสอบ `npm run check:static`, `npm test`, `npm run test:package` ผ่าน 100%

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` [MODIFY]
- `packages/create-nexus-devflow/test/install.test.ts` [NEW]
- `packages/create-nexus-devflow/lib/review.ts` [MODIFY]
- `packages/create-nexus-devflow/test/review.test.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/project-status-engine.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/dashboard.ts` [MODIFY]
- `packages/create-nexus-devflow/test/status.test.ts` [MODIFY]
- `packages/create-nexus-devflow/test/dashboard.test.ts` [MODIFY]
- `.agents/skills/complete/reference/completion-recovery.md` [NEW]
- `.claude/skills/complete/reference/completion-recovery.md` [NEW]
- `.agents/skills/complete/SKILL.md` [MODIFY]
- `.claude/skills/complete/SKILL.md` [MODIFY]
- `.agents/skills/continuous/SKILL.md` [MODIFY]
- `.claude/skills/continuous/SKILL.md` [MODIFY]
- `.agents/skills/feature/reference/build-history.md` [NEW]
- `.claude/skills/feature/reference/build-history.md` [NEW]
- `.agents/skills/feature/SKILL.md` [MODIFY]
- `.claude/skills/feature/SKILL.md` [MODIFY]
- `.agents/skills/rollback/SKILL.md` [MODIFY]
- `.claude/skills/rollback/SKILL.md` [MODIFY]
- `.agents/skills/audit/SKILL.md` [MODIFY]
- `.claude/skills/audit/SKILL.md` [MODIFY]
- `.agents/skills/audit/reference/independent-review.md` [MODIFY]
- `.claude/skills/audit/reference/independent-review.md` [MODIFY]
- `.agents/skills/overview/SKILL.md` [MODIFY]
- `.claude/skills/overview/SKILL.md` [MODIFY]
- `scripts/check-upstream-drift.ts` [MODIFY]
- `scripts/validate-framework.ts` [MODIFY]
- `devflow/context/ai-interaction.md` [MODIFY]
- `AGENTS.md` [MODIFY]
- `CLAUDE.md` [MODIFY]
- `README.md` [MODIFY]
- `README.th.md` [MODIFY]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `when-sensitive`
- **Sensitivity Verdict**: **SENSITIVE** (เป็นฟังก์ชันระดับ Core Security ของตัวติดตั้ง และ Core Data Integrity ของวงจรส่งมอบ Git Commit / Squash-Merge)
- **Review Requirement**: ต้องมีผลการตรวจทานอิสระ (Independent Review Receipt) จาก Generic Isolated Subagent หรือ Clean Reviewer บันทึกใน `devflow/context/086-sync-upstream-ai-blueprint-v161/review.md` ก่อนทำ `/complete`
- **UI Evidence / Browser Tests**: ไม่กระทบ UI หน้าเว็บของโปรดักต์ (`Not applicable`)

### 2.3 Test Decision: Required (Strict TDD)
- ฟีเจอร์นี้แก้ไข Core Logic ทั้งการตรวจสอบ Path ติดตั้ง, การ Parse Review Metadata, และการคำนวณ Status Engine จึงต้องเขียน Unit Tests แบบ TDD ครอบคลุมทุกกรณี

---

## 3. Implementation Checklist (Strict TDD)

### Task 1: Installer Destination Validation & Symlink Protection
- [x] 1.1 `[TDD-Red]`: เพิ่มชุดทดสอบ `packages/create-nexus-devflow/test/install.test.ts` ตรวจสอบการปฏิเสธ Symbolic Links (dangling, file, directory) และ Incompatible Destination Types
- [x] 1.2 `[TDD-Green]`: นำฟังก์ชัน `validateInstallDestinations()` และ `assertDestinationType()` ใส่ใน `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` และ `lib/update.ts` ให้ทดสอบผ่าน
- [x] 1.3 `[TDD-Refactor]`: ปรับปรุง Error messages, เพิ่ม Windows ancestor crawl สำหรับ ENOENT และรัน `install.test.ts` ผ่าน 100% (5/5 passing)

### Task 2: Safe Completion Recovery Protocol
- [x] 2.1 `[TDD-Red]`: สร้างสัญญา `completion-recovery.md` ใน `.agents/skills/complete/reference/` และ `.claude/skills/complete/reference/` กำหนด JSON Comment Signature และกลไก Resume 3 Phase
- [x] 2.2 `[TDD-Green]`: อัปเดต `complete/SKILL.md` และ `continuous/SKILL.md` ทั้ง `.agents/` และ `.claude/` ให้ตรวจจับ Pending Recovery และฝัง Signature ใน Archive
- [x] 2.3 `[TDD-Refactor]`: ยืนยัน Lifecycle Alignment ของ Task-Isolated Living Spec โมเดล

### Task 3: Rebuild History Preservation Protocol
- [x] 3.1 `[TDD-Red]`: สร้างสัญญา `build-history.md` ใน `.agents/skills/feature/reference/` และ `.claude/skills/feature/reference/` กำหนดกฎการตั้งชื่อ `--build-N`
- [x] 3.2 `[TDD-Green]`: อัปเดต `feature/SKILL.md`, `rollback/SKILL.md`, และ `continuous/SKILL.md` ให้ตรวจประวัติ Archive เดิม และป้องกันการเขียนทับ
- [x] 3.3 `[TDD-Refactor]`: ตรวจสอบความถูกต้องของ Path Resolver ใน `devflow/history/features/`

### Task 4: Local-Only Spec Review & Snapshot Verification
- [x] 4.1 `[TDD-Red]`: เพิ่ม Test cases ใน `packages/create-nexus-devflow/test/review.test.ts` ตรวจสอบฟิลด์ `specSnapshot` และการตรวจจับ Snapshot Hash ใน `.state/review-specs/`
- [x] 4.2 `[TDD-Green]`: อัปเดต `packages/create-nexus-devflow/lib/review.ts` ให้ parse `specSnapshot`, อ่าน Snapshot และตรวจความสดใหม่ (Freshness) อย่างถูกต้อง
- [x] 4.3 `[TDD-Refactor]`: อัปเดต `audit/SKILL.md` และ `audit/reference/independent-review.md` ให้สอดคล้องกันทั้งสอง adapter และรัน `review.test.ts` ผ่าน 100%

### Task 5: Status Evidence Alignment & Fault Blocker
- [x] 5.1 `[TDD-Red]`: เพิ่ม Test cases ใน `packages/create-nexus-devflow/test/status.test.ts` ตรวจสอบสถานะ `verification failed` และ Malformed Records Blocker
- [x] 5.2 `[TDD-Green]`: อัปเดต `packages/create-nexus-devflow/lib/project-status-engine.ts` และ `status.ts` เพิ่ม `classifyWorkEvidence()` บล็อกสถานะ Ready เมื่อล้มเหลว และนำทางสู่ `/implement` หรือ `/doctor`
- [x] 5.3 `[TDD-Refactor]`: ยืนยันความสอดคล้องของการแสดงผลใน Status Engine และรัน `status.test.ts` ผ่าน 100%

### Task 6: Framework Static Verification & Final Documentation
- [x] 6.1 `[TDD-Red]`: อัปเดต `scripts/validate-framework.ts` ให้ตรวจจับไฟล์ reference ใหม่ (`completion-recovery.md`, `build-history.md`)
- [x] 6.2 `[TDD-Green]`: อัปเดต `scripts/check-upstream-drift.ts`, `devflow/context/ai-interaction.md` (AI commit attribution)
- [x] 6.3 `[TDD-Refactor]`: รันชุดทดสอบความถูกต้อง `npm run check:static`, `npm test`, และ `npm run test:package` ผ่าน 100%

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `npm run check:static` ผ่าน 100% (Framework static contract verified)
- **Automated Test Matrix**: `npm test` (210 tests ใน status + ทุก test suites) ผ่าน 100%
- **Package Smoke Test**: `npm run test:package` ผ่าน 100% (32 Core Skills per adapter)
- **Findings Ledger**: ตรวจสอบ `findings.md` ปราศจากข้อบกพร่องค้างคา (`0 findings`)
- **Independent Review Gate**: พร้อมสำหรับ `/audit independent current`

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [x] **AC-1 (Installer Validation)**: `install.test.ts` ยืนยันการปฏิเสธ Symlinks ทุกรูปแบบ (5/5 passing)
- [x] **AC-2 (Completion Recovery)**: `completion-recovery.md` ได้รับการรับรองและ `/complete` ฝัง Annotation ถูกต้อง
- [x] **AC-3 (Build History)**: `build-history.md` ป้องกันการทับซ้อนของ Archive สำหรับ Rebuild ฟีเจอร์
- [x] **AC-4 (Local-Only Review)**: `review.test.ts` ยืนยันการทำงานของ `specSnapshot` (ผ่านทุกกรณี)
- [x] **AC-5 (Status Evidence Alignment)**: `status.test.ts` ยืนยันการบล็อก False Ready State เมื่อ Verification ล้มเหลว และชี้ทาง `/implement` หรือ `/doctor`
- [x] **AC-6 (Upstream Parity)**: `check-upstream-drift.ts` ยืนยัน Parity 100% เทียบกับ Upstream v1.6.1 (23 Upstream Skills / 36 DevFlow Skills)

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: 2026-09-11
- **Verification Verdict**: Verified
- **Framework Tests**: 210/210 passed (`npm test`)
- **Static Contract**: OK (`npm run check:static`)
- **Package Smoke Test**: OK (`npm run test:package`)
- **Upstream Release Synchronized**: AI Blueprint `v1.6.1` (`dc2cb64`)
- **Reviewer Target**: `/audit independent current`


<!-- devflow:completion {"schemaVersion":1,"specBytes":18534,"specSha256":"8370c204d933e1031b0a8ce6a76c380a3ed1bc825df667ee1e88e8831cc23c41","branch":"refs/heads/feature/086-sync-upstream-ai-blueprint-v161","head":"de2e867794738c505358eb6fe9722fd638024903","baseRef":"refs/heads/main","baseCommit":"016797763047377ce32364d5a85e238259af72e5","sourceTree":"17ce07c995dd3f59b78a7cf4de69c2e31200af6f","absentOptional":[]} -->

## Findings

# Findings Ledger: 086-sync-upstream-ai-blueprint-v161

_No findings recorded. `/audit` appends findings here when it finds them._


# Independent Review

**Status:** passed
**Target commit:** de2e867794738c505358eb6fe9722fd638024903
**Base commit:** 016797763047377ce32364d5a85e238259af72e5
**Base ref:** main
**Spec hash:** 8370c204d933e1031b0a8ce6a76c380a3ed1bc825df667ee1e88e8831cc23c41
**Prepared by:** antigravity
**Builder model:** google/gemini-2.5-pro
**Requested reviewer:** antigravity
**Requested model:** google/gemini-2.5-pro
**Requested execution:** automatic
**Requested at:** 2026-09-11T11:13:00.000Z
**Workflow:** regular
**Check required:** no
**Reviewer adapter:** antigravity
**Reviewer model:** google/gemini-2.5-pro
**Reviewer context:** fresh session
**Actual execution:** manual
**Reviewed at:** 2026-09-11T11:14:00.000Z
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** passed
**Check result:** not-required

## Commands

- `npm run check:static`: passed
- `npm test`: passed
- `npm run test:package`: passed
- `npx tsx scripts/check-upstream-drift.ts`: passed

## Evidence

- Verified installer symlink and invalid destination protection in `packages/create-nexus-devflow/lib/update.ts` and `bin/create-nexus-devflow.ts`
- Verified completion recovery annotation contract and resume flow in `.agents/skills/complete/reference/completion-recovery.md`, `complete/SKILL.md`, and `continuous/SKILL.md`
- Verified rebuild history preservation and collision protection in `.agents/skills/feature/reference/build-history.md`, `feature/SKILL.md`, and `rollback/SKILL.md`
- Verified local-only spec review snapshot parsing and freshness checks in `packages/create-nexus-devflow/lib/review.ts` and `test/review.test.ts`
- Verified status evidence alignment and fault blocker in `packages/create-nexus-devflow/lib/project-status-engine.ts`, `status.ts`, and `test/status.test.ts`
- Verified framework static contracts in `scripts/validate-framework.ts` and AI commit attribution guidance in `devflow/context/ai-interaction.md`

## Findings

- None

## Remaining risk

- None identified



## Final completion verification — 2026-09-11

- npm run check:static: PASS (32 Core Skills synchronized per adapter, all lifecycle & reference contracts verified)
- npm test: PASS (210/210 core tests + sandbox, overview, tooling, and run-state suites)
- npm run test:package: PASS (Clean packaging and installation smoke test)
- npx tsx scripts/check-upstream-drift.ts: PASS (100% Upstream Skills Parity with AI Blueprint v1.6.1)
- git status & diff: Verified clean working tree against target commit de2e867
- Independent review: PASS (Recorded in review.md and verified current by lib/review.ts)
- Manual try path: Run npm test, npx tsx scripts/check-upstream-drift.ts, and verify symlink rejection in install.test.ts
