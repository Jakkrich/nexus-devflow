# 📐 [029-update-backup-system] ระบบ Backup และ Safety Rollback ก่อนสั่ง Update ใน CLI (Living Spec)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `main`  
> **Created Date**: 2026-08-22  
> **Owner**: Jakkrich  

---

## 1. Specification & Scope
- **Problem Statement**: ปัจจุบันเมื่อสั่ง Update ใน `create-nexus-devflow` ระบบจะเขียนทับและลบไฟล์เดิมทันทีโดยไม่มีการทำ Backup ไว้ใน `.nexus/backups/` หากกระบวนการ Update ล้มเหลวระหว่างทาง หรือผู้ใช้ต้องการตรวจสอบไฟล์เดิม จะไม่สามารถย้อนคืนได้
- **In-Scope**:
  - เพิ่มระบบสำรองไฟล์เดิม (Replaced & Removed files) และ Manifest เดิมลงใน `.nexus/backups/{identifier}` ก่อนการ Update
  - บันทึก metadata การ Backup ไว้ในไฟล์ `backup.json` (จากเวอร์ชันไหน ไปเวอร์ชันไหน มีไฟล์ใดบ้างถูกเปลี่ยน/ลบ)
  - สร้างกลไก Rollback อัตโนมัติในกรณีที่การ Update ล้มเหลวระหว่างคัดลอกไฟล์
  - สร้าง/อัปเดตไฟล์ `.nexus/.gitignore` ให้ระบุ ignore `backups/` และ `staging/`
  - เพิ่ม Unit Tests สำหรับระบบ Backup & Rollback ใน `packages/create-nexus-devflow/test/update.test.ts`
- **Out-of-Scope**:
  - การสร้างคำสั่ง CLI สั่ง `nexus-devflow restore-backup` แยกต่างหาก (เก็บไว้พัฒนาในอนาคต)
- **Acceptance Criteria**:
  - [x] AC-1: เมื่อสั่ง `applyPreparedUpdate` และมีการเปลี่ยน/ลบไฟล์ ระบบจะสร้างไดเรกทอรี `.nexus/backups/{timestamp}-{prevVersion}-to-{nextVersion}-{hash}` พร้อมบันทึกไฟล์เดิม `nexus-devflow.json` และ `backup.json` (ผ่านการทดสอบใน unit test `applyPreparedUpdate creates backup directory and backup.json when updating modified files`)
  - [x] AC-2: หากไม่มีไฟล์เดิมถูกเปลี่ยนเลย (0 updated, 0 removed) จะไม่สร้างโฟลเดอร์ Backup โดยไม่จำเป็น (ผ่านการทดสอบ `assert.equal(result.backupDir, null)` ใน fresh install)
  - [x] AC-3: หากเกิดข้อผิดพลาดในการเขียนไฟล์ขณะ Update ระบบจะทำ Atomic Rollback กู้คืนไฟล์เดิมจาก Backup โฟลเดอร์กลับสู่สภาพเดิม (ครอบคลุมผ่าน `try/catch/rollback` ใน `applyPreparedUpdate`)
  - [x] AC-4: มี `.nexus/.gitignore` เพื่อละเว้นโฟลเดอร์ `backups/` และ `staging/` จาก Git (ผ่านการทดสอบ `assert.match(ignoreContent, /backups\//)` และ `staging/`)
  - [x] AC-5: ผ่านการทดสอบ Unit Tests ทั้งหมดใน `packages/create-nexus-devflow` (`npm test` 29/29 tests passed) และ `npm run check` (All checks PASSED)

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `packages/create-nexus-devflow/lib/update.ts`: เพิ่ม Backup Directory Identifier, backup file copying, backup.json writer, ignore writer และ rollback logic
  - `packages/create-nexus-devflow/test/update.test.ts`: เพิ่มชุดทดสอบระบบ Backup และการจัดการ Rollback
- **Test Decision**: `Required (TDD)`
  - *Rationale*: ระบบ Backup และ Update มีความสำคัญต่อความปลอดภัยของโปรเจกต์ผู้ใช้ จำเป็นต้องมี Unit Test ครอบคลุมการสร้างโฟลเดอร์ Backup และ Rollback
  - *Planned Cases*:
    1. Verify backup directory structure & `backup.json` creation when updating modified managed files
    2. Verify no backup dir created if no files replaced or removed
    3. Verify automatic rollback when file copying fails mid-update
- **Impact & Rollback Strategy**:
  - *Impact*: เฉพาะกระบวนการ `update` ใน `create-nexus-devflow` CLI เท่านั้น
  - *Rollback*: สั่ง `git checkout` หรือลบโค้ดส่วน Backup ออกหากมีปัญหา

## 3. Implementation Checklist
- [x] Task 1: เพิ่ม helper functions (`formatTimestamp`, `sanitizeSegment`, `writeControlIgnore`) และอัปเดต `applyPreparedUpdate` ใน `lib/update.ts` ให้สร้าง Backup และเก็บ Manifest เดิม
- [x] Task 2: เพิ่มระบบ Rollback อัตโนมัติหากการคัดลอกไฟล์ล้มเหลว
- [x] Task 3: เพิ่ม Unit Tests ใน `test/update.test.ts` ทดสอบ Backup generation & Rollback
- [x] Task 4: รัน `npm test` และ `npm run check` ตรวจสอบความถูกต้องและผ่านการทดสอบทั้งหมด

## 4. Implementation Record
- **[Task 1 & 2]**: เพิ่มระบบ Backup ก่อนการ Update ใน [`packages/create-nexus-devflow/lib/update.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/lib/update.ts)
  - คัดลอกไฟล์เดิมที่ถูกเปลี่ยน/ลบลงโฟลเดอร์ `.nexus/backups/{identifier}`
  - สร้างไฟล์ metadata `backup.json` และเก็บสำเนา Manifest เดิม
  - สร้างระบบ Atomic Rollback หากขั้นตอนการคัดลอกไฟล์หรือลบไฟล์ล้มเหลวระหว่างทาง
  - เขียนและอัปเดตไฟล์ `.nexus/.gitignore` ให้ละเว้น `backups/` และ `staging/`
- **[Task 3]**: เพิ่ม Unit Tests สำหรับระบบ Backup & Rollback ใน [`packages/create-nexus-devflow/test/update.test.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/test/update.test.ts)
- **[Task 4]**: ผ่านการทดสอบ `npm test` (29/29 tests passed) และ `npm run check` (All checks PASSED) เรียบร้อยแล้ว

## 5. Verification Evidence
- **Lane 1: Typecheck & Static Code Quality**: `npm run check:static` Passed (0 type errors, 0 lint/contract warnings)
- **Lane 2: Automated Test Suites**: `npm test` Passed 100% (29/29 tests passed, 0 failed, 0 skipped)
- **Lane 3: Scrutinize & Edge Cases Review**: Clean
  - Boundary Conditions: ตรวจสอบกรณี 0 files replaced/removed จะไม่สร้างโฟลเดอร์ Backup โดยไม่จำเป็น
  - Null/Undefined Safety: กำหนด fallback กรณี `previousManifest` เป็น `null` (ตั้งชื่อเป็น `legacy`)
  - Atomic Rollback: หากเกิด error ระหว่าง atomic copy หรือ unlink ระบบจะรัน rollback คืนค่าไฟล์เดิมจาก `backupDir`
- **Lane 4: Security & Hygiene Audit**: Clean (ไม่มี hardcoded credentials/secrets, `.nexus/.gitignore` กันการ commit `backups/` และ `staging/` ขึ้น Git)
- **Lane 5: Manual Scenario Proof**:
  - *Where to test*: ใน unit test `applyPreparedUpdate creates backup directory and backup.json when updating modified files`
  - *Action*: ติดตั้ง v1 -> ทำการอัปเดตเปรียบเทียบเป็น v2
  - *Expected & Verified Result*: เกิดโฟลเดอร์ `.nexus/backups/{timestamp}-1.0.0-to-2.0.0-{hash}/` พร้อมไฟล์ `backup.json` ที่ระบุ `replaced: ["AGENTS.md", "LICENSE"]` และไฟล์สำรอง `files/AGENTS.md` บันทึกเนื้อหา `# V1 AGENTS\n` ไว้อย่างถูกต้อง

## 6. Release & Handoff
- **Release Digest**: สำเร็จการพัฒนาเพิ่มระบบ Backup และ Safety Rollback ก่อนการ Update ใน CLI (`packages/create-nexus-devflow/lib/update.ts`) พร้อมไฟล์ metadata `backup.json` และ `.nexus/.gitignore`
- **Git Branch**: `main`
- **Merge Status**: Merged into `main` (Commit `c6f7a4c`)
- **Archive Date**: 2026-08-22
