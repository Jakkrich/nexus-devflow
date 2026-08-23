# 📐 [044-branch-scoped-context-isolation] Branch-Scoped Context Isolation & Dynamic Router

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 3` & `DISC-20260823-002: Defense 4`  
> **Branch**: `feature/044-branch-scoped-context-isolation`  
> **Completed Date**: 2026-08-23  

---

## 1. Specification & Scope

- **Problem Statement**:
  เมื่อพัฒนาโปรเจกต์แบบ Multi-Developer หรือการทำงานคู่ขนานหลาย Branch เช่น `feature/044-auth` และ `feature/045-payment` ไฟล์ Living Spec เดิม (`devflow/context/current-feature.md`) เป็น Global File เดี่ยว ซึ่งจะถูกเขียนทับหรือเกิด Git Merge Conflict ทันทีเมื่อ Merge กลับเข้าสู่ Main Branch เพื่อแก้ไขปัญหานี้ ระบบต้องการ **Branch-Scoped Context Isolation Engine** ที่แยกจัดเก็บ Living State ตาม Git Branch ใน `devflow/context/<sanitized-branch>/` (และ `.nexus/branches/<sanitized-branch>/`) พร้อมระบบ **Dynamic Context Router** ที่สลับชี้บริบทตาม Git Branch ปัจจุบันอัตโนมัติ และระบบ **Auto-Cleanup** ลบ State กิ่งงานที่เสร็จแล้ว

- **In-Scope**:
  1. **Branch Context Engine (`packages/create-nexus-devflow/lib/branch-context.ts`)**:
     - พัฒนา `sanitizeBranchName`: แปลงชื่อ Branch ให้เป็นชื่อโฟลเดอร์ที่ปลอดภัยข้ามแพลตฟอร์ม (Windows, macOS, Linux)
     - พัฒนา `resolveActiveContextPaths`: ค้นหาและคืนค่า Path ของ `current-feature.md` และ `current-stage.md` ตาม Active Branch โดยอัตโนมัติ โดยรองรับทั้ง `devflow/context/<branch>/` และ `.nexus/branches/<branch>/` พร้อม Backward Compatibility Fallback
     - พัฒนา `initBranchContext`: สร้าง Branch-Scoped Context จาก template หรือ baseline
     - พัฒนา `cleanupBranchContext`: ลบโฟลเดอร์ State ของ Branch ที่เสร็จแล้วเพื่อรักษาความสะอาด
  2. **Core Integration with Status, Gatekeeper, and Workflow State**:
     - อัปเดต `status.ts` ให้อ่านข้อมูล Living Spec ผ่าน `resolveActiveContextPaths`
     - อัปเดต `current-work.ts` และ `workflow-state.ts` ให้ตรวจจับสเปกตาม Branch Context
     - อัปเดต `gatekeeper.ts` ให้ตรวจสอบเกณฑ์คุณภาพตาม Branch ปัจจุบัน
  3. **MCP Server Integration (`packages/create-nexus-devflow/lib/mcp.ts`)**:
     - อัปเดต `devflow_get_status` และ `devflow_get_context` ใน MCP Server ให้เรียกผ่าน Dynamic Context Router
  4. **Automated Unit & Multi-Lane Tests (`packages/create-nexus-devflow/test/branch-context.test.ts`)**:
     - เขียนชุดทดสอบครอบคลุม Branch Sanitization, Isolation Path Resolution, Multi-branch Simulation, Auto-Cleanup และ Fallback

- **Out-of-Scope**:
  - ไม่รวมการเชื่อมต่อ Remote Database Storage (จัดเก็บแบบ Local File-based)

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: `sanitizeBranchName` แปลงชื่อ Branch ที่มีอักขระพิเศษ (slash, hash, colon, spaces) ให้เป็นชื่อโฟลเดอร์ที่ปลอดภัย 100%
  - [x] **AC-02**: `resolveActiveContextPaths` ตรวจพบและคืนค่า Path ของ Living Spec ตาม Git Branch ปัจจุบัน และมี Fallback ไปที่ `devflow/context/` เมื่อไม่มี Branch Isolation
  - [x] **AC-03**: สอง Branch ที่แตกต่างกันสามารถมี `current-feature.md` แยกกันคนละชุดโดยไม่ชนกัน (Zero Collision)
  - [x] **AC-04**: `cleanupBranchContext` ลบโฟลเดอร์ Branch Context เมื่อปิดรอบงานได้อย่างหมดจด
  - [x] **AC-05**: `readProjectStatus`, `gatekeeper`, และ `mcp` อ่านบริบทผ่าน Dynamic Context Router ได้อย่างถูกต้อง
  - [x] **AC-06**: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` สำเร็จ 0 ข้อผิดพลาด)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/branch-context.ts` (ใหม่: Branch Sanitizer, Path Resolver & Lifecycle Manager)
  - `packages/create-nexus-devflow/lib/status.ts` (แก้ไข: ใช้วิธี Resolve Context Path ผ่าน Branch Router)
  - `packages/create-nexus-devflow/lib/current-work.ts` (แก้ไข: ใช้วิธี Resolve Context Path ผ่าน Branch Router)
  - `packages/create-nexus-devflow/lib/gatekeeper.ts` (แก้ไข: ใช้วิธี Resolve Context Path ผ่าน Branch Router)
  - `packages/create-nexus-devflow/lib/mcp.ts` (แก้ไข: ใช้วิธี Resolve Context Path ผ่าน Branch Router)
  - `packages/create-nexus-devflow/test/branch-context.test.ts` (ใหม่: Automated Tests สำหรับ Branch Context)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test` ภายใต้ `packages/create-nexus-devflow/`)
  - Multi-Branch Simulation Test (สร้างโฟลเดอร์จำลอง 2 Branch พร้อมทดสอบความแยกขาดของ State)
  - Full Framework Integrity Check (`npm run check`)

---

## 3. Implementation Checklist (แผนงานทีละขั้นตอน)

- [x] **Task 1: Core Branch Context Engine (`lib/branch-context.ts`)**
  - พัฒนาฟังก์ชัน `sanitizeBranchName`, `resolveActiveContextPaths`, `initBranchContext`, และ `cleanupBranchContext`
  - *Done when*: ฟังก์ชันจัดการชื่อ Branch และ Resolve Path ได้อย่างถูกต้องแม่นยำ พร้อม Fallback

- [x] **Task 2: Status & Workflow State Integration (`lib/status.ts` & `lib/workflow-state.ts`)**
  - ผสาน `resolveActiveContextPaths` เข้าสู่ `readProjectStatus` และ `readWorkflowState`
  - *Done when*: `readProjectStatus` อ่าน Living Spec จาก Branch Context เมื่อมีอยู่

- [x] **Task 3: Gatekeeper & MCP Server Integration (`lib/gatekeeper.ts` & `lib/mcp.ts`)**
  - ผสาน Dynamic Router เข้าสู่การประเมิน Gatekeeper และ MCP Server Tool Dispatcher
  - *Done when*: `check-gate` และ `devflow_get_status` อ่าน Context ของ Branch ปัจจุบันได้อย่างถูกต้อง

- [x] **Task 4: Complete Lifecycle Hook for Auto-Cleanup**
  - ตรวจสอบให้มั่นใจว่าเมื่อสั่ง `/complete` หรือคำสั่งปิดรอบงาน โฟลเดอร์ Branch Context จะถูก Cleanup อย่างปลอดภัย
  - *Done when*: โฟลเดอร์ `.nexus/branches/<sanitized-branch>` ถูกลบออกหลังเสร็จสิ้นฟีเจอร์

- [x] **Task 5: Automated Tests & Multi-Lane Verification (`test/branch-context.test.ts`)**
  - เขียน Unit Tests ครอบคลุมทุกฟังก์ชันและการจำลองสถานการณ์ Multi-branch Concurrency
  - *Done when*: `npm test` และ `npm run check` รันผ่าน 100% (Zero Errors)

---

## 4. Verification Evidence & Quality Gates (บันทึกจากการรัน `/check`)

- **Multi-Lane Verification Matrix**:
  - [x] Lane 1: Typecheck (`npm run typecheck` - 0 errors)
  - [x] Lane 2: Unit Tests (`npm test` - 72/72 test suites passed)
  - [x] Lane 3: Framework Smoke Test (`npm run check` - Clean tarball packaging & overlay smoke test passed)
  - [x] Lane 4: Multi-Branch Isolation Simulation (พิสูจน์แล้วว่า Branch A และ Branch B มี State แยกขาดจากกัน 100%)
- **Findings Ledger**: ตรวจสอบ `devflow/context/findings.md` พบ 0 Active Blockers (สะอาด 100%)
