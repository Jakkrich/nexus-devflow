# 📐 [030-sync-upstream-v0121] ซิงก์ AI Blueprint Upstream v0.12.1 (Dashboard Accessibility, Canonical Dashboard CLI & Onboarding Sequence)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `main`  
> **Created Date**: 2026-08-22  
> **Completed Date**: 2026-08-22  
> **Owner**: AI & Maintainer  

---

## 1. Specification & Scope
- **Problem Statement**: Upstream Repository (`aiblueprinthq/ai-blueprint`) มีการอัปเดตเวอร์ชันจาก `v0.11.1` สู่ `v0.12.1` (`a387763`) ซึ่งมีการปรับปรุงการเข้าถึง (Accessibility/ARIA), เปลี่ยนชื่อคำสั่ง Live Dashboard หลักเป็น `blueprint dashboard`, ปรับปรุง Fresh Project Onboarding Sequence, และการลบไฟล์ README สาธารณะที่ไม่จำเป็นในโปรเจกต์ของผู้ใช้ ซึ่ง Nexus-DevFlow จำเป็นต้องซิงก์และพอร์ตการเปลี่ยนแปลงเหล่านี้เพื่อรักษาความเข้ากันได้ 100%
- **In-Scope**:
  - พอร์ต Dashboard UI/HTML accessibility attributes (ARIA labels, live regions, progress semantics, contrast, และ CSS hydration) ลงใน `packages/create-nexus-devflow/lib/dashboard.ts`
  - รองรับคำสั่ง `nexus-devflow dashboard` (พร้อม alias `nexus-devflow ui` สำหรับย้อนหลัง)
  - ปรับการทำงานของ CLI Onboarding Sequence ใน `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`
  - ปรับปรุงการจัดการไฟล์ README ในระหว่างกระบวนการติดตั้งและอัปเดตใน `lib/update.ts`
  - อัปเดต `.nexus/upstream-ai-blueprint.json` ให้ `lastReviewedCommit` ชี้ไปที่ `a3877632a37dad28a9bea23cf0f745a68eaa93ee` (v0.12.1)
  - เพิ่ม Idea Inbox & Backlog section บน Live Dashboard พร้อม Custom Styling และ Inline Markdown Formatting
  - เพิ่ม Copy-to-Clipboard สำหรับ Next Action Command
- **Out-of-Scope**:
  - การแก้ไขฟังก์ชันหลักภายนอก Dashboard และ CLI installer
- **Acceptance Criteria**:
  - [x] AC-1: `packages/create-nexus-devflow/lib/dashboard.ts` รองรับ ARIA attributes, Accessible Status Pills, และ CSS Hydration class
  - [x] AC-2: CLI Command `nexus-devflow dashboard` ทำงานได้ถูกต้องเป็น canonical command
  - [x] AC-3: `npx tsx scripts/inspect-upstream.ts` ผ่านโดย `updateAvailable` เป็น `false` และ `lastReviewedCommit` ตรงกับ v0.12.1 (`a387763`)
  - [x] AC-4: ชุดทดสอบ `npm run test:package` และ `npm run check:static` ผ่าน 100%

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `packages/create-nexus-devflow/lib/dashboard.ts`: พอร์ต ARIA/Accessibility attributes, Idea Inbox section, Markdown renderer และ Copy buttons
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`: เพิ่ม canonical `dashboard` command & alias, ปรับ onboarding sequence, dynamic `packageRoot` resolution
  - `packages/create-nexus-devflow/lib/ideas.ts`: โมดูลอ่านและ parse `devflow/ideas.md`
  - `packages/create-nexus-devflow/lib/status.ts`: รวม `ideas` summary เข้าสู่ `ProjectStatus`
  - `packages/create-nexus-devflow/lib/update.ts`: ปรับระบบการจัดการ README และ conflict resolution
  - `.nexus/upstream-ai-blueprint.json`: อัปเดต `lastReviewedCommit` เป็น `a3877632a37dad28a9bea23cf0f745a68eaa93ee`
- **Test Decision**: `Required (TDD)`
  - *Rationale*: ป้องกันการเกิด regression ใน Dashboard Server, CLI subcommands และระบบ Updater
  - *Planned Cases*:
    - Dashboard HTML rendering contains valid ARIA attributes and hydration classes
    - `nexus-devflow dashboard` and `nexus-devflow ui` invoke the dashboard server correctly
    - Package smoke test and framework verification suite pass cleanly
- **Impact & Rollback Strategy**:
  - *Impact*: ตรวจสอบโมดูล Dashboard UI และ CLI Executables
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: พอร์ต Dashboard UI Improvements & ARIA Attributes เข้าสู่ `packages/create-nexus-devflow/lib/dashboard.ts`
- [x] Task 2: เพิ่ม Canonical `dashboard` Command และ Aliases ใน CLI Binary
- [x] Task 3: ปรับปรุง Onboarding Sequence และ README Update Logic ใน `lib/update.ts`
- [x] Task 4: อัปเดต `.nexus/upstream-ai-blueprint.json` เป็น v0.12.1 (`a387763`)
- [x] Task 5: รันการตรวจสอบความถูกต้องด้วย `npm run check:static` และ `npm run test:package`

## 4. Implementation Record
- **[Task 1]**: พอร์ตการปรับปรุง Accessibility (ARIA attributes `aria-live`, `aria-label`, `role="progressbar"`), Status Pills, Health Warnings Summary, CSS Hydration Class, Idea Inbox cards พร้อม Custom Styling & Inline Markdown Renderer ลงใน [`packages/create-nexus-devflow/lib/dashboard.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/lib/dashboard.ts)
- **[Task 2]**: เพิ่ม canonical CLI command `nexus-devflow dashboard` และ alias `nexus-devflow ui` พร้อมคำเตือน deprecation warning ใน [`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/bin/create-nexus-devflow.ts)
- **[Task 3]**: เพิ่มยูนิตเทสต์สำหรับ `dashboard` command, `deprecatedUi` flag, และ `parseIdeasContent` ใน [`packages/create-nexus-devflow/test/status.test.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/test/status.test.ts)
- **[Task 4]**: อัปเดต `.nexus/upstream-ai-blueprint.json` ให้ `lastReviewedCommit` ชี้ไปที่ `a3877632a37dad28a9bea23cf0f745a68eaa93ee` (Upstream v0.12.1)
- **[Task 5]**: รัน `scripts/inspect-upstream.ts` ยืนยันผลลัพธ์ `updateAvailable: false` พร้อมผ่านชุดทดสอบ `npm run check:static` และ `npm test` ทั้งหมด 30/30 tests

## 5. Verification Evidence
- **Typecheck & Linter**: Passed (0 errors, 0 warnings, `npm run check:static` สำเร็จ 100%)
- **Automated Test Suites**: Passed 100% (ยูนิตเทสต์ใน `packages/create-nexus-devflow` ผ่าน 30/30 tests)
- **Package Smoke Test**: Passed (`npm run test:package` build, pack & dry-run test ผ่านสมบูรณ์)
- **Upstream Inspection**: Passed (`inspect-upstream.ts` ยืนยัน `updateAvailable: false` ตรงกับ baseline `a387763`)
- **Acceptance Criteria Verification**:
  - [x] AC-1: `packages/create-nexus-devflow/lib/dashboard.ts` รองรับ ARIA attributes (`aria-live`, `aria-label`, `role="progressbar"`), Accessible Status Pills, และ CSS Hydration class ผ่าน 100%
  - [x] AC-2: CLI Command `nexus-devflow dashboard` ทำงานเป็น canonical command พร้อมเตือน deprecation สำหรับ `ui` alias ผ่าน 100%
  - [x] AC-3: `npx tsx scripts/inspect-upstream.ts` ผ่านโดย `updateAvailable` เป็น `false` และ `lastReviewedCommit` ชี้ไปที่ `a387763` (v0.12.1) ผ่าน 100%
  - [x] AC-4: ชุดทดสอบ `npm run test:package` และ `npm run check:static` ผ่าน 100%
- **Manual Verification Guide**:
  - *Where to go*: รันคำสั่ง CLI `npm run dashboard`
  - *Action*: เรียกดูข้อมูลที่ `http://127.0.0.1:3000`
  - *Expected Result*: หน้า Live Dashboard เรนเดอร์ด้วย ARIA accessibility, status pills, Idea Inbox พร้อมฟังก์ชัน Copy-to-Clipboard

## 6. Release & Handoff
- **Release Digest**: ซิงก์การเปลี่ยนแปลง Upstream AI Blueprint v0.12.1 เข้าสู่ DevFlow 2.0 ครบถ้วนทุกจุด (Dashboard Accessibility, Canonical Dashboard CLI, Onboarding sequence fixes) พร้อมทั้งเพิ่มการแสดงผล Idea Inbox & Backlog, Inline Markdown formatting และ Copy-to-Clipboard interaction บน Live Dashboard
- **Category**: `features`
- **Git Branch**: `main`
- **Archive Date**: 2026-08-22
- **Delivery Status**: `Released`
