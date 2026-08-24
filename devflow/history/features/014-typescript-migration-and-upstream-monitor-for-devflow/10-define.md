# Phase 10: Define Contract

- **Running ID**: `RUN-014-typescript-migration-and-upstream-monitor-for-devflow`
- **Title**: ยกระดับสถาปัตยกรรม DevFlow สู่ TypeScript และย้ายระบบ Check AI Blueprint Upstream Monitor มาไว้ที่ DevFlow
- **Source Discovery**: [DISC-20260820-014-typescript-migration-and-upstream-monitor-for-devflow](../../discoveries/DISC-20260820-014-typescript-migration-and-upstream-monitor-for-devflow/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-20
- **Owner**: DevFlow Core Framework Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการพัฒนาและทดสอบระบบใน Nexus Blueprint พบว่าการอัปเกรดเป็น **TypeScript (`tsx` / `tsc`) ร่วมกับ Compilation Pipeline (`dist/`) และ Multi-layer Verification Matrix** ช่วยเพิ่มความเสถียรและความแม่นยำของคำสั่งได้อย่างมหาศาล

เป้าหมายของ **`RUN-014`** คือการนำสถาปัตยกรรมที่แข็งแกร่งนี้มาปรับใช้กับ **`nexus-devflow`** ทั้งหมด ควบคู่ไปกับการย้ายระบบ **Check AI Blueprint Upstream Monitor** จาก Blueprint มาไว้ที่ DevFlow เพื่อให้ DevFlow กลายเป็นศูนย์กลาง (Single Command Hub) ในการติดตามและวิเคราะห์ความเคลื่อนไหวจาก Upstream

---

## 2. ขอบเขตงานที่ต้องดำเนินการ (In-Scope)

### ส่วนที่ 1: ย้ายและติดตั้งระบบ Upstream Monitor มาที่ DevFlow
1. **GitHub Actions Workflow**:
   - เพิ่ม `.github/workflows/check-upstream.yml` ใน `nexus-devflow` ตั้ง Schedule ทำงานทุกวันเวลา 07:01 น. (เวลาไทย)
2. **Upstream Inspection & Issue Engine**:
   - ติดตั้ง `scripts/upstream-monitor.ts`, `scripts/update-upstream-issue.ts`, `scripts/lib/upstream-monitor.ts`, `scripts/lib/validate-upstream-monitor.ts`
   - เพิ่ม `.nexus/upstream-ai-blueprint.json` บันทึก Baseline Tracking ล่าสุด (`720815c3eb0f8285c89cf2c90178123b7f142639`)
   - เพิ่ม Maintainer Skill `.agents/skills/sync-upstream/` และ `.claude/skills/sync-upstream/` ให้กับ DevFlow
3. **ลบ Workflow เดิมออกจาก Nexus Blueprint**:
   - ถอด `.github/workflows/check-upstream.yml` ออกจาก `nexus-blueprint` เพื่อป้องกันการรันงานซ้ำซ้อน

### ส่วนที่ 2: แปลง Installer Package (`packages/create-nexus-devflow`) สู่ TypeScript
1. **Build Configuration**:
   - เพิ่ม `packages/create-nexus-devflow/tsconfig.json` กำหนด `outDir: "dist"`
   - ปรับ `package.json` ให้ binary ชี้ไปที่ `dist/bin/create-nexus-devflow.js`
2. **Source Code Conversion**:
   - แปลง `bin/create-nexus-devflow.ts`, `lib/update.ts`, `lib/starter-templates.ts`
   - แปลง Script ช่วยแพ็กเกจ `scripts/prepare-template.ts` และ `scripts/clean-template.ts` (กรอง maintainer skills ออกจาก bundle)
3. **Unit Tests**:
   - แปลง `test/update.test.ts` และทดสอบด้วย `tsx --test`

### ส่วนที่ 3: ยกระดับ Maintainer Tooling & Verification Matrix ใน DevFlow
1. **Root Configuration**:
   - เพิ่ม Root `tsconfig.json` รองรับ `tsc --noEmit` สำหรับ Typecheck
   - ปรับ `package.json` scripts: `check`, `check:static`, `typecheck`, `test`, `test:package`, `test:routing`
2. **Runner & Validation Scripts**:
   - พอร์ต Runner: `scripts/check-devflow.ts`, `scripts/validate-framework.ts`, `scripts/smoke-package.ts`
   - พอร์ตโมดูล TF-IDF Routing Evaluations `scripts/evals/routing.ts` เพื่อวัดผลความแม่นยำของ DevFlow Commands และ Stages ทั้งหมด
3. **Verification Gate**:
   - รัน `npm run check` เพื่อยืนยันว่า Typecheck, Static Contract, Unit tests, Routing evals, และ Packed smoke tests ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แก้ไขรูปแบบการทำงานของ Mainline Stages 00-70 ที่ผู้ใช้ทำงานอยู่
- ไม่ลบหรือแก้ไขโครงสร้างของ Documentation Website (`website/`) เว้นแต่การอัปเดต docs scripts ที่จำเป็น
- ไม่เปลี่ยนพฤติกรรมการสร้าง Stage Artifacts ภาษาไทย

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-014`** | `typescript-migration-and-upstream-monitor-for-devflow` | ย้าย Upstream Monitor มาที่ DevFlow, พอร์ต `create-nexus-devflow` และ Maintainer Tooling เป็น TypeScript เต็มรูปแบบ พร้อมผ่านการทดสอบ Verification Gate 100% |

---

## 5. เกณฑ์ความสำเร็จและการตรวจรับ (Acceptance Criteria)

1. แพ็กเกจ `@jakkrichm/create-nexus-devflow` สามารถ build ผ่าน `tsc -p tsconfig.json` ได้ไฟล์ binary ใน `dist/` และรัน `npm test` ผ่าน 100%
2. มีไฟล์ `.github/workflows/check-upstream.yml` พร้อมสคริปต์ตรวจจับ upstream monitor ใน `nexus-devflow` และถอด workflow ซ้ำซ้อนออกจาก `nexus-blueprint`
3. มีระบบ Typecheck (`npm run typecheck`) และ Static Verification (`npm run check:static`) ที่ทำงานผ่าน `tsc` และ `tsx`
4. รัน `npm run check` ใน `nexus-devflow` ผ่านครบทุกขั้นตอน
5. อัปเดต `CHANGELOG.md` และเอกสารที่เกี่ยวข้อง

---

## 6. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนเขียนข้อกำหนดทางเทคนิค (Specification):

```text
/20-spec RUN-014-typescript-migration-and-upstream-monitor-for-devflow
```
