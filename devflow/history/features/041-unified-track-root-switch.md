# 📐 [041-unified-track-root-switch] Unified Dual-Track Root Switch & Context Auto-Sync Engine

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `[IDEA-025]` & `[DISC-20260822-009]`  
> **Branch**: `feature/041-unified-track-root-switch`  
> **Completed Date**: 2026-08-22  

---

## 1. Specification & Scope

- **Problem Statement**: ปัจจุบัน `status.ts` และ `current-work.ts` อ่าน `current-feature.md` เป็นอันดับแรก ทำให้เมื่ออยู่ในโหมด Deep-Track (`current-run/`) ผลลัพธ์ Next Action ของ CLI และ Dashboard แสดงเป็น `/check` ขัดแย้งกับคำแนะนำ `/70-deliver` ของ AI อีกทั้งแท็บ Dual-Track บน Dashboard ต้องคลิกสลับด้วยตนเองและจำค่าใน `localStorage`
- **In-Scope**:
  1. **Root Authority**: ให้ `devflow/context/current-stage.md` เป็นศูนย์กลางระบุ `Track: fast | deep | idle`
  2. **Priority-Aware Reader & Auto-Sync**: ปรับ `readCurrentWork` ใน `current-work.ts` ให้อ่านตาม `Track` จาก `current-stage.md` เป็นหลัก และมีระบบ Auto-Detect Fallback เมื่อพบไฟล์งานค้าง
  3. **Dual-Track Next Action**: อัปเกรด `selectNextAction` และ `selectCompletion` ใน `status.ts` ให้รองรับทั้ง Fast-Track (`/implement`, `/check`, `/complete`) และ Deep-Track (`/10-define`...`/70-deliver`)
  4. **Dashboard Auto-Focus & Active Badge**: ปรับปรุง `dashboard-page.ts` ให้ออโต้โฟกัสแท็บตาม `workflow.track` และแสดงป้ายไฟกระพริบ `● ACTIVE` ที่แท็บที่กำลังทำงานอยู่ (Option 1)
  5. **Automated Testing**: เพิ่ม Test Cases ใน `test/` สำหรับการอ่าน Track, Auto-Sync Fallback, Next Action Parity และ Dashboard Active Tab Rendering
- **Out-of-Scope**:
  - ไม่เปลี่ยนโครงสร้างหลักของ `ProjectStatus schemaVersion: 1`
  - ไม่แตะต้องกลไก Git Merge หรือ Archive System
- **Acceptance Criteria**:
  - [x] AC-01: `readCurrentWork` อ่าน `current-stage.md` ก่อน และแยกแยะ Fast-Track vs Deep-Track ได้อย่างถูกต้อง
  - [x] AC-02: Auto-detect fallback สลับ Track ให้ทันทีเมื่อพบไฟล์งานจริงแม้ `current-stage.md` ระบุเป็น idle
  - [x] AC-03: `selectNextAction` ใน `status.ts` ส่งคืนคำสั่ง Deep-Track ที่ถูกต้องสอดคล้องกับ `current-stage.md`
  - [x] AC-04: หน้าจอ Dashboard Auto-Focus แท็บตาม Track ที่ Active จาก Context พร้อมป้ายไฟ `● ACTIVE`
  - [x] AC-05: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` exit 0)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/current-work.ts`: ปรับลำดับการอ่านให้ `current-stage.md` มาก่อน พร้อม Auto-Detect Fallback
  - `packages/create-nexus-devflow/lib/status.ts`: อัปเกรด `selectNextAction` และ `selectCompletion` ให้เป็น Dual-Track Aware
  - `packages/create-nexus-devflow/lib/workflow-state.ts`: ปรับปรุงการสกัด `currentStage` และ `track`
  - `packages/create-nexus-devflow/lib/dashboard-page.ts`: เพิ่ม CSS badge `● ACTIVE` และ JS logic สำหรับ Auto-Focus Tab
  - `packages/create-nexus-devflow/test/current-work.test.ts`: เพิ่ม unit tests สำหรับ Root Switch และ Auto-Detect
  - `packages/create-nexus-devflow/test/status.test.ts`: เพิ่ม unit tests สำหรับ Dual-Track Next Action
  - `packages/create-nexus-devflow/test/dashboard-snapshot.test.ts`: เพิ่ม snapshot assertions สำหรับ Next Action
- **Test Decision**: Full automated unit and integration verification (`npm test` + `npm run check`)

---

## 3. Implementation Checklist

- [x] 1. Core Reader: ปรับปรุง `current-work.ts` และ `workflow-state.ts` ให้ยึด `current-stage.md` เป็น Root Switch พร้อม Auto-Sync
- [x] 2. Core Status: อัปเกรด `status.ts` (`selectNextAction` & `selectCompletion`) ให้รองรับ Deep-Track Lifecycle ครบ 8 สเตจ
- [x] 3. Dashboard UI: เพิ่ม Auto-Focus แท็บ และป้ายไฟ `● ACTIVE` ใน `dashboard-page.ts`
- [x] 4. Automated Tests & QA: เพิ่มและอัปเดต Unit Tests ใน `test/` พร้อมตรวจสอบ `npm test` และ `npm run check`

---

## 4. Verification Evidence & Quality Gates

- **`npm test`**: 63/63 Unit and Integration tests passing (100% PASS)
- **`npm run check`**: Complete framework integrity & package smoke test passed
- **Findings Ledger**: 0 active blockers in `devflow/context/findings.md`
- **Dashboard & CLI Parity**: Dual-Track auto-sync proven with real runtime tests
