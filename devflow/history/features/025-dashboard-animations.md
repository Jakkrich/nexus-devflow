# 📐 [025-dashboard-animations] เพิ่ม Animation และ Micro-interactions ให้กับ Nexus-DevFlow Live Dashboard (Living Spec)

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `main`  
> **Created Date**: 2026-08-21  
> **Completed Date**: 2026-08-21  
> **Owner**: DevFlow Maintainer  

---

## 1. Specification & Scope
- **Problem Statement**:
  หน้า Live Dashboard ของ `nexus-devflow ui` ปัจจุบันรัน polling ทุก 2 วินาที และเขียนทับ DOM ด้วย `textContent` ทันที ขาดการทำ State Diffing และไม่มี transition นุ่มนวล ทำให้การอัปเดตสถานะดูแข็งกระตุก ต้องการยกระดับ UX/UI ด้วย State Diffing และ Micro-animations ที่นุ่มนวล สบายตา และเคารพการตั้งค่าของผู้ใช้

- **In-Scope**:
  - อัปเดต `packages/create-nexus-devflow/lib/dashboard.ts`:
    - เพิ่ม **JS State Diffing Logic** (`prevData` vs `data`) ป้องกันการ re-trigger animation หากข้อมูลเดิมไม่เปลี่ยนในการ polling
    - เพิ่ม **Initial Load Flag** (`isFirstLoad`) ให้ Card Entrance Animation และ Progress Bar Run จาก 0% รันเพียงครั้งเดียว
    - **Live Dot (`#live-dot`)**: Pulse ring เบาๆ เฉพาะสถานะ Live และมี background-color transition เมื่อเปลี่ยนสถานะ
    - **Progress Bar (`#work-progress-bar`)**: Shimmer sweep เฉพาะตอน `active` และ Glow pulse 1 ครั้งเมื่อ % ความคืบหน้าเพิ่มขึ้นจริง
    - **Counts & Meta (`#findings-count`, `#warnings-count`, `#history-count`, `#work-meta`)**: Animated Count-Up/Down + Highlight Flash (เขียวเมื่อลดลง/เหลืองเมื่อเพิ่มขึ้น)
    - **Pills (`.pill`)**: Micro scale pop (`scale(1.06)`) + background/border transition เมื่อสเตจหรือสถานะเปลี่ยน
    - **List Items**: Staggered Fade-in + Slide-up (6px -> 0) สำหรับรายการใหม่ใน Findings, Warnings, Completion, History
    - **Next Action (`.next-action`, `#next-command`)**: Command flip/fade transition + border glow pulse เมื่อคำสั่งถัดไปเปลี่ยน
    - **Card Hover & Entrance**: Lift-up (`translateY(-2px)`) + shadow transition และ Entrance animation ครั้งแรก
    - **Reduced Motion**: เพิ่ม `@media (prefers-reduced-motion: reduce)` ครอบคลุมทุกการเคลื่อนไหว
  - อัปเดตและเพิ่ม Unit Tests ใน `packages/create-nexus-devflow/test/dashboard.test.ts`
  - ตรวจสอบความถูกต้องผ่าน `npx tsx scripts/check-devflow.ts`

- **Out-of-Scope**:
  - การแก้ไข API schema ของ `/api/status` หรือ `/api/history`
  - การแก้ไขระบบสถาปัตยกรรมหลักของ DevFlow

- **Acceptance Criteria**:
  - [x] AC-1: มี JS State Diffing logic ใน `refreshStatus()` ป้องกันการ trigger animation ซ้ำซ้อนโดยไม่จำเป็นในการ polling ทุก 2 วินาที
  - [x] AC-2: มี Micro-animations นุ่มนวลครบถ้วน (Live Dot, Progress Shimmer/Glow, Count Highlight, Pill Pop, List Item Staggered Fade-in, Card Lift & Next Action Flip)
  - [x] AC-3: รองรับ `@media (prefers-reduced-motion: reduce)` อย่างถูกต้องเพื่อปิด/ลด animation สำหรับผู้ใช้กลุ่มนี้
  - [x] AC-4: Unit Tests ทั้งหมดใน `packages/create-nexus-devflow/test/` ผ่านครบถ้วน 100%
  - [x] AC-5: `npx tsx scripts/check-devflow.ts` ผ่านการตรวจสอบ Verification Gate 100%

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `packages/create-nexus-devflow/lib/dashboard.ts`: ปรับปรุง HTML, CSS animations, `@media prefers-reduced-motion` และ JS Diffing state logic
  - `packages/create-nexus-devflow/test/dashboard.test.ts`: ปรับปรุง Unit tests ให้ครอบคลุมสคริปต์และดีไซน์ใหม่

- **Test Decision**: `Required (TDD)`
  - *Rationale*: โมดูล `dashboard.ts` เป็นหน้าจอหลักของผู้ใช้งาน ต้องมี Unit Test ครอบคลุมโครงสร้าง HTML ใหม่ และสคริปต์ฝั่ง Client
  - *Planned Cases*:
    - Test Dashboard HTTP server responds to `/` with HTML containing animation CSS & scripts
    - Test Dashboard HTTP server responds to `/api/status` & `/api/history`
    - Full verification gate smoke test via `check-devflow.ts`

- **Impact & Rollback Strategy**:
  - *Impact*: เฉพาะการแสดงผลในหน้าเบราว์เซอร์ Live Dashboard (`nexus-devflow ui`) ไม่กระทบต่อ CLI คำสั่งอื่น
  - *Rollback*: สามารถย้อนคืน commit ได้ผ่าน `git revert`

## 3. Implementation Checklist
- [x] Task 1: อัปเดต CSS Animation Keyframes, CSS Transitions, และ `@media (prefers-reduced-motion: reduce)` ใน `DASHBOARD_HTML` ใน `lib/dashboard.ts`
- [x] Task 2: เขียน JS State Diffing Logic (`prevData` vs `data`), Flag `isFirstLoad`, Count-Up, Highlight Flash, Pill scale pop, และ List Staggered Fade-in
- [x] Task 3: อัปเดต Unit Tests ใน `test/dashboard.test.ts` และรัน `npx tsx --test packages/create-nexus-devflow/test/*.test.ts`
- [x] Task 4: รัน Verification Gate `npx tsx scripts/check-devflow.ts` ยืนยันความสมบูรณ์ 100%

## 4. Implementation Record
- **[Task 1 & 2]**: อัปเดต `packages/create-nexus-devflow/lib/dashboard.ts` เพิ่ม JS State Diffing Logic (`prevData` vs `data`), Flag `isFirstLoad`, Count-Up animation (`requestAnimationFrame`), Highlight Flash (เขียว/เหลือง), Pill Micro Scale Pop (`scale(1.06)`), List Item Staggered Fade-in (`fadeSlideIn`), Live Dot Pulse (`is-live`), Progress Bar Shimmer & Glow, Next Action Command Flip, และ `@media (prefers-reduced-motion: reduce)`
- **[Task 3]**: อัปเดตและรัน Unit Tests `packages/create-nexus-devflow/test/*.test.ts` ผ่านครบ 28/28 tests
- **[Task 4]**: รัน Verification Gate `npx tsx scripts/check-devflow.ts` สำเร็จครบทุกด่าน

## 5. Verification Evidence
- **Typecheck & Linter**: Passed (0 errors, 0 warnings via `npm run typecheck`)
- **Automated Test Suites**: All 28/28 unit tests passed via `npx tsx --test packages/create-nexus-devflow/test/*.test.ts`
- **Scrutinize & Security Audit**: Clean (0 boundary issues, 0 secrets, safe input handling, `@media (prefers-reduced-motion: reduce)` compliant)
- **Framework Verification Gate**: Passed 100% via `npx tsx scripts/check-devflow.ts` (Static check, Skill routing, Unit tests, Smoke test)
- **Acceptance Criteria Verification**:
  - [x] AC-1: มี JS State Diffing logic ใน `refreshStatus()` ป้องกันการ trigger animation ซ้ำซ้อนโดยไม่จำเป็นในการ polling ทุก 2 วินาที
  - [x] AC-2: มี Micro-animations นุ่มนวลครบถ้วน (Live Dot, Progress Shimmer/Glow, Count Highlight, Pill Pop, List Item Staggered Fade-in, Card Lift & Next Action Flip)
  - [x] AC-3: รองรับ `@media (prefers-reduced-motion: reduce)` อย่างถูกต้องเพื่อปิด/ลด animation สำหรับผู้ใช้กลุ่มนี้
  - [x] AC-4: Unit Tests ทั้งหมดใน `packages/create-nexus-devflow/test/` ผ่านครบถ้วน 100% (28/28 tests)
  - [x] AC-5: `npx tsx scripts/check-devflow.ts` ผ่านการตรวจสอบ Verification Gate 100%
- **Manual Verification Guide**:
  - *Where to go*: Terminal / Browser (`nexus-devflow ui`)
  - *Action*: เปิดอ่านหน้า Live Dashboard และทดสอบดูการอัปเดตข้อมูล
  - *Expected Result*: อนิเมชันลื่นไหล สบายตา ไม่เกิด Layout Shift และเมื่อข้อมูลไม่เปลี่ยนในการ polling จะไม่มีการรันอนิเมชันซ้ำซ้อน

## 6. Release & Handoff
- **Release Digest**: ยกระดับ UX/UI บน Live Dashboard ด้วย JS State Diffing Logic (`prevData` vs `data`), Flag `isFirstLoad`, Count-Up Animation, Highlight Flash (เขียว/เหลือง), Pill Scale Pop (`scale(1.06)`), List Item Staggered Fade-in, Live Dot Pulse, Progress Bar Shimmer & Glow, Next Action Command Flip & Panel Glow, และเพิ่มการรองรับ `@media (prefers-reduced-motion: reduce)`
- **Git Branch**: `main`
- **Merge Status**: Direct commit / Merged into `main`
- **Archive Date**: 2026-08-21
