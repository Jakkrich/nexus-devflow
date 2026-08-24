# Phase 20: Delivery Specification

- **Running ID**: `RUN-014-typescript-migration-and-upstream-monitor-for-devflow`
- **Title**: ข้อกำหนดทางเทคนิคในการยกระดับสถาปัตยกรรม DevFlow สู่ TypeScript และย้ายระบบ Upstream Monitor
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-20
- **Owner**: DevFlow Core Framework Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้เป็นสัญญาข้อกำหนดทางเทคนิค (Delivery Contract) สำหรับการพัฒนารอบ **`RUN-014`** เพื่อ:
1. ย้ายระบบ **Check AI Blueprint Upstream Monitor** จาก `nexus-blueprint` มาประจำการที่ **`nexus-devflow`** เป็นศูนย์กลางการเฝ้าระวังความเคลื่อนไหวจาก Upstream
2. แปลงแพ็กเกจ Installer **`@jakkrichm/create-nexus-devflow`** ให้ทำงานบน **TypeScript (`dist/` compilation pipeline)**
3. ปรับปรุง Maintainer Tooling, Unit Testing Harness (`tsx`), และ Verification Matrix (`npm run check`) ของ DevFlow ให้มี Type Safety สมบูรณ์ 100%

---

## 2. ข้อกำหนดฟังก์ชันการทำงานหลัก (Core Functional Requirements)

### REQ-1: ระบบ Upstream Monitor ประจำการที่ Nexus-DevFlow
- **R1.1 GitHub Actions Workflow (`.github/workflows/check-upstream.yml`)**:
  - กำหนด Cron Schedule ทุกวันเวลา `07:01 น.` (เวลาไทย / UTC 00:01) และรองรับ `workflow_dispatch`
  - ตรวจสอบความเปลี่ยนแปลงของ AI Blueprint Upstream เทียบกับ Baseline ใน `.nexus/upstream-ai-blueprint.json`
  - หากพบ Commit ใหม่ จะสร้างหรืออัปเดต GitHub Issue เพื่อแจ้งเตือน Maintainer
- **R1.2 Upstream Engine Modules**:
  - สร้าง `scripts/upstream-monitor.ts`, `scripts/update-upstream-issue.ts`
  - สร้าง `scripts/lib/upstream-monitor.ts`, `scripts/lib/validate-upstream-monitor.ts`
  - สร้าง `.nexus/upstream-ai-blueprint.json` บันทึก `lastReviewedCommit: "720815c3eb0f8285c89cf2c90178123b7f142639"`
- **R1.3 Maintainer Skill `sync-upstream`**:
  - เพิ่ม `.agents/skills/sync-upstream/` และ `.claude/skills/sync-upstream/` ให้กับ DevFlow
  - กรอง skill `sync-upstream` ไม่ให้ถูก copy ลง template สำหรับ end-user ในแพ็กเกจ installer
- **R1.4 ถอด Workflow เก่าออกจาก Nexus Blueprint**:
  - ลบ `.github/workflows/check-upstream.yml` ออกจาก `nexus-blueprint` เพื่อป้องกันการทำงานซ้ำซ้อน

### REQ-2: แปลง Installer Package (`packages/create-nexus-devflow`) เป็น TypeScript
- **R2.1 โครงสร้าง Build (`tsconfig.json`)**:
  - สร้าง `packages/create-nexus-devflow/tsconfig.json` ตั้ง `outDir: "dist"`, `declaration: true`, `sourceMap: true`
  - ปรับ `package.json` ให้ `"bin"` ชี้ไปที่ `dist/bin/create-nexus-devflow.js`
- **R2.2 Source Code Conversion**:
  - `bin/create-nexus-devflow.ts`: CLI entry point รองรับ `--codex`, `--antigravity`, `--claude`, `--both`
  - `lib/update.ts`: Core Update Engine พร้อม Type definitions (`Manifest`, `UpdatePlan`, `FileState`, atomic file write, directory cleanup)
  - `lib/starter-templates.ts`: ข้อมูล Starter Templates สำหรับโครงการใหม่
  - `scripts/prepare-template.ts`: Prepack script สำหรับ copy files เข้า `template/` พร้อม exclude `sync-upstream`
  - `scripts/clean-template.ts`: Postpack script ล้างโฟลเดอร์ `template/`
- **R2.3 Unit Testing (`test/update.test.ts`)**:
  - พอร์ตเทสเป็น TypeScript รันผ่าน `tsx --test test/update.test.ts`
  - ทดสอบครบทั้ง fresh install, update, conflict detection, และ path spaces

### REQ-3: ยกระดับ Root Maintainer Tooling & Verification Matrix
- **R3.1 Root Configuration**:
  - สร้าง Root `tsconfig.json` สำหรับ `tsc --noEmit`
  - อัปเดต Root `package.json` devDependencies (`@types/node`, `tsx`, `typescript`)
  - อัปเดต npm scripts: `check`, `check:static`, `typecheck`, `test`, `test:package`, `test:routing`
- **R3.2 Validation & Smoke Testing**:
  - `scripts/check-devflow.ts`: Verification Master Runner
  - `scripts/validate-framework.ts`: Static contract validator
  - `scripts/smoke-package.ts`: Packed tarball installer smoke test
  - `scripts/evals/routing.ts`: TF-IDF Routing Evaluations วัดความแม่นยำของ DevFlow Commands (>90% rank-1 accuracy)

---

## 3. ข้อจำกัดและกฎความปลอดภัย (Hard Constraints)

1. **Nexus Identity & Divergence**: คงชื่อแพ็กเกจ `@jakkrichm/create-nexus-devflow`, ภาษาไทยใน Stage Artifacts, และการรองรับทั้ง Claude Code, Codex, และ Antigravity
2. **Zero Runtime Breakage**: ไม่แก้ไข Syntax ของ Mainline 00-70 ที่ผู้ใช้ใช้อยู่
3. **Strict Verification**: โค้ดทั้งหมดต้องผ่าน `npm run check` (Typecheck + Static + Unit + Smoke tests) 100%

---

## 4. เกณฑ์การตรวจรับและการทดสอบ (Acceptance Criteria & Verification Plan)

| ID | เกณฑ์การตรวจรับ (Acceptance Criteria) | วิธีการตรวจสอบ (Verification Method) |
| :--- | :--- | :--- |
| **AC-1** | `packages/create-nexus-devflow` คอมไพล์ได้ `dist/bin/create-nexus-devflow.js` และรัน `npm test` ผ่าน | รัน `npm test` ในแพ็กเกจ |
| **AC-2** | ระบบ Check Upstream Monitor พร้อมทำงานที่ `nexus-devflow` และลบออกจาก `nexus-blueprint` เรียบร้อย | ตรวจสอบ `.github/workflows/check-upstream.yml` ทั้งสองโปรเจกต์ |
| **AC-3** | `npm run typecheck` (`tsc --noEmit`) ผ่าน 100% ไม่มี type error | รัน `npm run typecheck` ที่ Root |
| **AC-4** | `npm run check:static` และ `npm run test:routing` ผ่าน 100% | รันคำสั่งตรวจ Static contract และ Routing |
| **AC-5** | `npm run test:package` ผ่านการ pack `.tgz` และติดตั้งใน mock workspaces ทุกโหมด | รัน `npm run test:package` |
| **AC-6** | `npm run check` ผ่านทุก Gate สมบูรณ์แบบ | รัน `npm run check` |

---

## 5. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนวางแผนและจัดเตรียม Checklists (Plan Stage):

```text
/30-plan RUN-014-typescript-migration-and-upstream-monitor-for-devflow
```
