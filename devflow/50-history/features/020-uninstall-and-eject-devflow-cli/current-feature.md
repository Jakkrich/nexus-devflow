# 📐 [RUN-020] คำสั่ง Uninstall / Eject สำหรับถอนการติดตั้งไฟล์ DevFlow ออกจากโปรเจกต์อย่างหมดจด (Clean Eject Living Spec)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Branch**: `main`  
> **Created Date**: 2026-08-20  
> **Owner**: DevFlow Core Engineering Team  

---

## 1. Specification & Scope

- **Problem Statement**:
  ผู้ใช้หรือทีมงานที่นำ Nexus-DevFlow ไปวางทับ (Overlay) บนโปรเจกต์แอปพลิเคชัน อาจมีความจำเป็นต้องส่งมอบงานให้ลูกค้าภายนอก, ทำ Open-Source เผยแพร่, หรือต้องการปลดระบบ Agentic Workflow ออกจาก Codebase โดยไม่ให้หลงเหลือร่องรอยหรือไฟล์คอนฟิกใดๆ ของ DevFlow (เช่น `devflow/`, `.agents/`, `.claude/`, `.nexus/`, `AGENTS.md`, `CLAUDE.md`) ให้ Codebase กลับคืนสู่สภาพแอปพลิเคชันปกติ 100%

- **In-Scope**:
  1. **Subcommands `uninstall` และ `eject`**:
     - เพิ่มคำสั่ง `uninstall` และ `eject` (alias) ใน CLI:
       - `npx @jakkrichm/create-nexus-devflow uninstall [target-dir] [options]`
       - `npx @jakkrichm/create-nexus-devflow eject [target-dir] [options]`
       - `nexus-devflow uninstall` / `nexus-devflow eject`
       - `devflow uninstall` / `devflow eject`
  2. **Flags & Safety Options**:
     - `--dry-run`: พรีวิวรายชื่อไฟล์และโฟลเดอร์ที่จะถูกลบโดยไม่ลบจริง
     - `-y`, `--yes`, `-f`, `--force`: ข้าม Interactive confirmation prompt
     - `--target, -t <path>`: ระบุไดเรกทอรีของโปรเจกต์ที่ต้องการถอนการติดตั้ง
     - `--json`: แสดงรายการไฟล์ที่ลบเป็น JSON output
     - `--keep-history`: เก็บประวัติ `devflow/history/` ไว้แต่ลบส่วนอื่นทั้งหมด
  3. **เป้าหมายไฟล์และโฟลเดอร์ที่ต้องลบ (DevFlow Footprint)**:
     - `devflow/` (รวมทั้ง `context/`, `discoveries/`, `runs/`, `history/`, `reference/`, `ideas.md` ฯลฯ)
     - `.agents/` (โฟลเดอร์ Skills ของ Antigravity/Codex)
     - `.claude/` (โฟลเดอร์ Skills ของ Claude Code)
     - `.nexus/` (โฟลเดอร์ Metadata Tracking)
     - `AGENTS.md` (ไฟล์ Instructions หน้าบ้าน)
     - `CLAUDE.md` (ไฟล์ Instructions ของ Claude Code)
  4. **Core Module (`lib/uninstall.ts`)**:
     - `prepareUninstall(options)`: ตรวจสอบและระบุรายการไฟล์/โฟลเดอร์ DevFlow ที่มีอยู่จริง
     - `applyUninstall(prepared)`: ลบไฟล์และโฟลเดอร์ทั้งหมด พร้อมคืนค่าสถิติจำนวนไฟล์ที่ถูกลบ
  5. **Unit Tests Suite (`test/uninstall.test.ts`)**:
     - ทดสอบลบใน Temp Mock Directory ครอบคลุมทั้ง Clean Uninstall, `--dry-run`, และ Argument Parsing

- **Out-of-Scope**:
  - การลบไฟล์ซอร์สโค้ดของแอปพลิเคชันผู้ใช้ (ระบบจะแตะเฉพาะ DevFlow footprint เท่านั้น)
  - การลบ Git Repository (`.git`) หรือแพ็กเกจใน `node_modules`

- **Acceptance Criteria**:
  - [x] **AC-1**: รัน `npx @jakkrichm/create-nexus-devflow uninstall --dry-run` แล้วแสดงรายการไฟล์ DevFlow ทั้งหมดที่จะถูกลบ โดยไม่มีการแตะต้องไฟล์จริงบน Disk
  - [x] **AC-2**: รัน `npx @jakkrichm/create-nexus-devflow uninstall -y` แล้วลบไฟล์ `devflow/`, `.agents/`, `.claude/`, `.nexus/`, `AGENTS.md`, `CLAUDE.md` จนหมดจด
  - [x] **AC-3**: รันคำสั่ง `status` หลังจาก `uninstall` แล้วระบบต้องตรวจไม่พบ DevFlow Root (`DevFlow project root could not be detected.`)
  - [x] **AC-4**: มีคำสั่ง alias `eject` ทำงานได้เทียบเท่า `uninstall` ทุกประการ
  - [x] **AC-5**: ผ่าน Unit Tests 100% และผ่าน Master Verification Gate (`npm run check`)

---

## 2. Plan & Test Strategy

- **Files to Modify / Create**:
  - `packages/create-nexus-devflow/lib/uninstall.ts` **[NEW]**: โมดูลสแกนและลบ DevFlow footprint
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` **[MODIFY]**: เพิ่มคำสั่ง `uninstall` และ `eject`, จัดการ flags และ prompts
  - `packages/create-nexus-devflow/test/uninstall.test.ts` **[NEW]**: ชุดทดสอบ Unit Tests สำหรับ uninstall engine
  - `CHANGELOG.md` **[MODIFY]**: บันทึกฟีเจอร์ใหม่
  - `README.md` และ `README.th.md` **[MODIFY]**: เพิ่มคู่มือคำสั่ง uninstall / eject
  - `website/src/content/docs/commands/companion-commands.md` **[MODIFY]**: เพิ่มคำสั่งในเว็บเอกสาร

- **Test Decision**: `Required (TDD)`
  - *Rationale*: คำสั่ง `uninstall` เป็นคำสั่งที่มีการลบไฟล์ (Destructive Action) จึงต้องมี Unit Tests ที่เข้มงวด ตรวจสอบว่าลบเฉพาะไฟล์ของ DevFlow จริง และไม่แตะต้องไฟล์ของผู้ใช้
  - *Planned Cases*:
    1. `prepareUninstall` ค้นพบไฟล์และโฟลเดอร์ DevFlow ครบถ้วน
    2. `applyUninstall` ลบไฟล์ออกจนหมดจด และไม่หลงเหลือโฟลเดอร์ว่าง
    3. `applyUninstall` ในโหมด `--dry-run` ไม่แก้ไข disk
    4. ตรวจสอบว่าไฟล์แอปพลิเคชันทั่วไป (เช่น `src/index.ts`, `package.json`) จะต้องไม่ถูกลบ

- **Impact & Rollback Strategy**:
  - *Impact*: เพิ่ม Subcommand ใหม่ ไม่กระทบต่อคำสั่งเดิม (`install`, `update`, `status`)
  - *Rollback*: สามารถย้อนคืนได้ทันทีเนื่องจากเป็นคำสั่งแยก

---

## 3. Implementation Checklist

- [x] **Task 1.1**: สร้าง `packages/create-nexus-devflow/lib/uninstall.ts` (ฟังก์ชัน `prepareUninstall` และ `applyUninstall`)
- [x] **Task 1.2**: อัปเดต `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` รองรับ subcommand `uninstall` และ `eject`
- [x] **Task 1.3**: สร้าง Unit Tests `packages/create-nexus-devflow/test/uninstall.test.ts`
- [x] **Task 1.4**: รัน `npm test` ใน `packages/create-nexus-devflow` ยืนยันเทสต์ผ่าน 100% (20/20 pass)
- [x] **Task 1.5**: รัน `npm run check` ที่ Root เพื่อยืนยัน Master Verification Gate
- [x] **Task 1.6**: อัปเดตคู่มือ `README.md`, `README.th.md`, `CHANGELOG.md` และเว็บเอกสาร

---

## 4. Implementation Record

- **[Task 1.1]**: สร้างโมดูล `packages/create-nexus-devflow/lib/uninstall.ts` รองรับการค้นหา DevFlow footprint (`AGENTS.md`, `CLAUDE.md`, `devflow`, `.agents`, `.claude`, `.nexus`), คำนวณจำนวนไฟล์/โฟลเดอร์ย่อย และลบไฟล์อย่างปลอดภัย (มีโหมด `--keep-history`)
- **[Task 1.2]**: ปรับแต่ง `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` ให้รองรับ subcommands `uninstall` และ `eject`, เพิ่ม argument parser สำหรับ `--keep-history`, `--dry-run`, `--json`, `-y`/`--force`, พร้อม Interactive confirmation prompt และความสามารถ JSON output
- **[Task 1.3]**: เขียนชุดทดสอบ `packages/create-nexus-devflow/test/uninstall.test.ts` จำนวน 5 Test Cases ทดสอบทั้ง Argument Parsing, File Detection, Dry-Run Verification, Clean Removal (พร้อมตรวจสอบว่าไฟล์ User `src/index.ts` และ `package.json` ไม่ถูกแตะต้อง), และ Keep History Mode
- **[Task 1.4]**: รัน `npm test` ใน `packages/create-nexus-devflow` ผ่านครบทั้ง 20 Unit Tests (100% Pass)
- **[Task 1.5]**: คอมไพล์ TypeScript `dist/` สำเร็จ และรัน Master Gate `npm run check`
- **[Task 1.6]**: เพิ่มเอกสารคู่มือการใช้งาน `uninstall` และ `eject` ใน `README.md`, `README.th.md`, `CHANGELOG.md`, และ `website/src/content/docs/commands/companion-commands.md`

---

## 5. Verification Evidence

- **Lane 1: Type & Syntax Safety**:
  - `tsc --noEmit` (Root Typecheck): **PASSED** (0 errors)
  - `tsc -p tsconfig.json` (Installer Package Build): **PASSED** (0 errors)
- **Lane 2: Automated Test Suites**:
  - Unit Tests (`packages/create-nexus-devflow`): **20/20 PASSED** (100% Pass Rate)
  - Skill Routing Evaluations: **312/312 PASSED** (100.00% Rank 1 Accuracy)
  - Package Smoke Test: **PASSED** (305 files overlay test in temp dir)
- **Lane 3: Acceptance Criteria Verification**:
  - [x] **AC-1**: `uninstall --dry-run` แสดง 6 DevFlow items (461 files, 264 directories) และไม่ลบไฟล์จริงบน Disk
  - [x] **AC-2**: `uninstall -y` ลบไฟล์ Footprint จนหมดจด
  - [x] **AC-3**: `status` หลัง uninstall รายงาน Root undetected ถูกต้อง
  - [x] **AC-4**: คำสั่ง alias `eject` ทำงานได้เทียบเท่า `uninstall` 100%
  - [x] **AC-5**: ผ่าน Verification Gate ทุกด่านโดยไม่มี Regressions
- **Manual Verification Guide**:
  - *Where to go*: Terminal CLI
  - *Action*: `node packages/create-nexus-devflow/dist/bin/create-nexus-devflow.js uninstall --dry-run`
  - *Expected Result*: แสดงรายงาน DevFlow Footprint ครบถ้วน พร้อมข้อความ `[Dry-run] No files were removed.`

---

## 6. Release & Handoff

- **Release Digest**:
  - เพิ่ม Subcommands `uninstall` และ `eject` ใน `@jakkrichm/create-nexus-devflow` (v2.0.17) สำหรับถอนการติดตั้งและลบ DevFlow Footprint ออกจากโปรเจกต์อย่างหมดจด (Clean Eject)
  - รองรับ Flags: `--dry-run`, `-y`/`--yes`/`-f`/`--force`, `--keep-history`, `--json`, `--target`
  - สร้างโมดูล `packages/create-nexus-devflow/lib/uninstall.ts` และชุดทดสอบ `packages/create-nexus-devflow/test/uninstall.test.ts` (ผ่าน 20/20 Unit Tests)
  - อัปเดตคู่มือและ Documentation ครอบคลุมทั้ง `README.md`, `README.th.md`, `CHANGELOG.md`, และ `website/`
- **Git Branch**: `main`
- **Artifact Contract**: Fast-Track Single Living Spec completed.
