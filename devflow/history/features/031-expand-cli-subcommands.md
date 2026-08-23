# 📐 [031-expand-cli-subcommands] ขยาย Subcommands สำหรับ CLI (idea, findings, doctor --fix, archive)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `main`  
> **Created Date**: 2026-08-22  
> **Completed Date**: 2026-08-22  
> **Owner**: AI & Maintainer (Intake from IDEA-001)  

---

## 1. Specification & Scope
- **Problem Statement**: ปัจจุบัน CLI Engine (`packages/create-nexus-devflow`) รองรับคำสั่งพื้นฐาน เช่น `install`, `update`, `uninstall`/`eject`, `status` และ `dashboard` แต่นักพัฒนายังไม่สามารถจัดการ Idea Inbox, ตรวจสอบ/แก้ไข Findings blockers, รัน Health Check พร้อม Auto-healing context (`doctor --fix`), หรือสำรวจประวัติการส่งมอบงาน (`archive`) ผ่าน CLI โดยตรงได้ ทำให้ต้องเปิดแก้ไขไฟล์ Markdown หรือเปิด Session กับ AI ทุกครั้ง
- **In-Scope**:
  - **Subcommand `idea` / `ideas`**:
    - `nexus-devflow idea add "<text>" [--title "<title>"]`: เพิ่มไอเดียใหม่เข้าสู่ `devflow/ideas.md` ในหมวด Pending อัตโนมัติพร้อมกำหนด ID ล่าสุด (`IDEA-xxx`)
    - `nexus-devflow ideas [list] [--json]`: แสดงรายการไอเดียทั้งหมดพร้อมสถิติ Pending และ Shipped
  - **Subcommand `findings`**:
    - `nexus-devflow findings [list] [--blockers] [--json]`: สรุปรายการ Findings และกรองเฉพาะ P0/P1 Blockers
    - `nexus-devflow findings resolve <ID> [--status <closed|accepted|invalid>]`: อัปเดตสถานะ Finding ใน `devflow/context/findings.md`
  - **Subcommand `doctor`**:
    - `nexus-devflow doctor [--fix] [--json]`: ตรวจสอบสุขภาพของ DevFlow Workspace (ความสมบูรณ์ของ Adapters, Context files, Manifest, และ Git state) และซ่อมแซมไฟล์ที่ขาดหายไปอัตโนมัติเมื่อใส่แฟล็ก `--fix`
  - **Subcommand `archive`**:
    - `nexus-devflow archive [list|stats] [--json]`: แสดงรายการประวัติการส่งมอบงานย้อนหลังทั้งหมดใน `devflow/history/` พร้อมสรุปสถิติแยกตามหมวด (Features, Fixes, Rollbacks)
  - เพิ่ม Unit Tests และอัปเดต CLI Help/Docs ให้ครอบคลุมทุกคำสั่งใหม่
- **Out-of-Scope**:
  - การเชื่อมต่อกับ Remote Cloud Issue Trackers (เช่น Jira, Linear, GitHub Issues)
- **Acceptance Criteria**:
  - [x] AC-1: คำสั่ง `nexus-devflow idea add "<text>"` สามารถเพิ่มไอเดียใหม่ลงใน `devflow/ideas.md` ได้อย่างถูกต้อง และ `ideas list` แสดงผลทั้งแบบ Text และ JSON ผ่าน 100%
  - [x] AC-2: คำสั่ง `nexus-devflow findings` สามารถแสดงรายการ Findings, กรอง `--blockers`, และสั่ง `resolve <ID>` เพื่ออัปเดตสถานะใน `findings.md` ได้ ผ่าน 100%
  - [x] AC-3: คำสั่ง `nexus-devflow doctor` ตรวจสอบความสมบูรณ์ของโครงสร้างโปรเจกต์ และแฟล็ก `--fix` สามารถกู้คืน/สร้างไฟล์ context ที่ขาดหายไปได้ ผ่าน 100%
  - [x] AC-4: คำสั่ง `nexus-devflow archive` สรุปรายการประวัติและแสดงสถิติจาก `devflow/history/` ได้ครบถ้วน ผ่าน 100%
  - [x] AC-5: ยูนิตเทสต์ทั้งหมดใน `packages/create-nexus-devflow` ผ่าน 100% และ `npm run check:static` ผ่าน 0 errors

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `packages/create-nexus-devflow/lib/ideas.ts`: เพิ่มฟังก์ชัน `addIdea` และ `formatIdeasHuman`
  - `packages/create-nexus-devflow/lib/findings.ts`: เพิ่มฟังก์ชัน `resolveFinding` และ `formatFindingsHuman`
  - `packages/create-nexus-devflow/lib/doctor.ts`: สร้างโมดูลวิเคราะห์สุขภาพ Workspace และฟังก์ชัน Auto-heal `--fix`
  - `packages/create-nexus-devflow/lib/history.ts`: เพิ่มฟังก์ชัน `formatHistoryHuman`
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`: เพิ่ม Argument Parser และ Handler สำหรับ `idea`, `ideas`, `findings`, `doctor`, `archive`
  - `packages/create-nexus-devflow/test/*.test.ts`: เพิ่มชุดทดสอบครอบคลุมทุก Subcommand ใหม่
- **Test Decision**: `Required (TDD)`
  - *Rationale*: ป้องกันผลกระทบต่อไฟล์สำคัญใน `devflow/` และรับประกันความถูกต้องของการ parse/modify Markdown
  - *Planned Cases*:
    - `addIdea` คำนวณ ID ถัดไปและจัดรูปแบบ Markdown ได้อย่างถูกต้อง
    - `resolveFinding` อัปเดตสถานะหัวข้อ `### <ID>` ใน `findings.md` โดยไม่กระทบข้อความอื่น
    - `doctor` ตรวจพบไฟล์ที่ขาดหายและ `--fix` สามารถสร้างไฟล์ทดแทนได้ครบถ้วน
    - `archive` คืนค่ารายการและคำนวณสถิติประวัติได้ถูกต้อง
- **Impact & Rollback Strategy**:
  - *Impact*: เพิ่มความสามารถในแพ็กเกจ CLI โดยคงความเข้ากันได้ย้อนหลังกับคำสั่งเดิม
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: พัฒนาโมดูลจัดการ Idea (`addIdea`, `formatIdeasHuman`) ใน `lib/ideas.ts` พร้อมเพิ่ม Subcommand ใน CLI
- [x] Task 2: พัฒนาโมดูลจัดการ Findings (`resolveFinding`, `formatFindingsHuman`) ใน `lib/findings.ts` พร้อม Subcommand ใน CLI
- [x] Task 3: สร้างโมดูล `lib/doctor.ts` รองรับการตรวจสุขภาพและการ Auto-heal (`--fix`) พร้อม Subcommand ใน CLI
- [x] Task 4: สร้างโมดูล `lib/history.ts` สรุปรายการและสถิติประวัติใน `devflow/history/` พร้อม Subcommand ใน CLI
- [x] Task 5: อัปเดต CLI Help (`printHelp`), Type definitions และเขียน Unit Tests ครอบคลุมทุก Subcommand
- [x] Task 6: รันการตรวจสอบความถูกต้องด้วย `npm run check:static` และ `npm run test:package`

## 4. Implementation Record
- **[Task 1]**: พัฒนา `addIdea` และ `formatIdeasHuman` ใน [`packages/create-nexus-devflow/lib/ideas.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/lib/ideas.ts) รองรับการคำนวณ ID ถัดไปอัตโนมัติ แทรกเข้าหัวข้อ `## 📌 Pending Ideas` และจัดรูปแบบสี ANSI
- **[Task 2]**: พัฒนา `resolveFinding` และ `formatFindingsHuman` ใน [`packages/create-nexus-devflow/lib/findings.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/lib/findings.ts) สามารถแก้ไขสถานะ Finding ใน `findings.md` และกรอง P0/P1 blockers
- **[Task 3]**: สร้างโมดูล [`packages/create-nexus-devflow/lib/doctor.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/lib/doctor.ts) ตรวจสอบความสมบูรณ์ 7 ด้าน และฟังก์ชัน Auto-heal `--fix` กู้คืนโครงสร้าง Context/History อัตโนมัติ
- **[Task 4]**: เพิ่ม `formatHistoryHuman` ใน [`packages/create-nexus-devflow/lib/history.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/lib/history.ts) สรุปสถิติและรายการส่งมอบงานแยกประเภท
- **[Task 5]**: อัปเดต `bin/create-nexus-devflow.ts` ให้รองรับ Subcommands: `idea`, `ideas`, `findings`, `doctor`, `archive` พร้อมทั้งเพิ่ม Unit Tests ใน `test/ideas.test.ts`, `test/findings.test.ts`, `test/doctor.test.ts`, `test/status.test.ts` (ผ่านทั้งหมด 36/36 tests)
- **[Task 6]**: ผ่านการทดสอบ `npm test`, `npm run check:static` และ `npm run test:package` สำเร็จ 100%

## 5. Verification Evidence
- **Typecheck & Linter**: Passed (0 errors, 0 warnings, `npm run check:static` สำเร็จ 100%)
- **Automated Test Suites**: Passed 100% (36/36 unit tests pass)
- **Package Smoke Test**: Passed (`npm run test:package` build, pack & dry-run test ผ่านสมบูรณ์)
- **Acceptance Criteria Verification**:
  - [x] AC-1: คำสั่ง `nexus-devflow idea add "<text>"` สามารถเพิ่มไอเดียใหม่ลงใน `devflow/ideas.md` ได้อย่างถูกต้อง และ `ideas list` แสดงผลทั้งแบบ Text และ JSON ผ่าน 100%
  - [x] AC-2: คำสั่ง `nexus-devflow findings` สามารถแสดงรายการ Findings, กรอง `--blockers`, และสั่ง `resolve <ID>` เพื่ออัปเดตสถานะใน `findings.md` ได้ ผ่าน 100%
  - [x] AC-3: คำสั่ง `nexus-devflow doctor` ตรวจสอบความสมบูรณ์ของโครงสร้างโปรเจกต์ และแฟล็ก `--fix` สามารถกู้คืน/สร้างไฟล์ context ที่ขาดหายไปได้ ผ่าน 100%
  - [x] AC-4: คำสั่ง `nexus-devflow archive` สรุปรายการประวัติและแสดงสถิติจาก `devflow/history/` ได้ครบถ้วน ผ่าน 100%
  - [x] AC-5: ยูนิตเทสต์ทั้งหมดใน `packages/create-nexus-devflow` ผ่าน 100% และ `npm run check:static` ผ่าน 0 errors
- **Manual Verification Guide**:
  - *Where to go*: รัน CLI Subcommands จาก Terminal
  - *Action*:
    - `npx tsx packages/create-nexus-devflow/bin/create-nexus-devflow.ts doctor`
    - `npx tsx packages/create-nexus-devflow/bin/create-nexus-devflow.ts ideas`
    - `npx tsx packages/create-nexus-devflow/bin/create-nexus-devflow.ts findings`
    - `npx tsx packages/create-nexus-devflow/bin/create-nexus-devflow.ts archive stats`
  - *Expected Result*: คำสั่งทั้งหมดประมวลผลและคืนค่าตามสเปกพร้อมสีและฟอร์แมตที่อ่านง่าย

## 6. Release & Handoff
- **Release Digest**: ขยาย Subcommands สำหรับ CLI Engine ได้แก่ `idea`/`ideas` (จัดการ Idea Inbox), `findings` (ตรวจเช็กและแก้ไข Blockers), `doctor` (ตรวจสุขภาพ Workspace พร้อม `--fix` Auto-heal), และ `archive` (สรุปประวัติการส่งมอบงานย้อนหลังและสถิติ)
- **Git Branch**: `main`
- **Archive Date**: 2026-08-22
- **Delivery Status**: `Released`
