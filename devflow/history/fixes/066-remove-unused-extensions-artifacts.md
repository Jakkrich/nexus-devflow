# 📐 [066-remove-unused-extensions-artifacts] Remove Unused Extensions Artifacts & Refactor Studio Tests

> **Status**: Released  
> **Track**: Fast-Track (Fix)  
> **Category**: Fix / Refactor  
> **Source**: `DISC-20260902-001` (Option B)  
> **Branch**: `fix/066-remove-unused-extensions-artifacts`  
> **Completed Date**: 2026-09-02  

---

## 1. Problem & Scope

- **The Problem**:
  - โฟลเดอร์ `extensions/` บนเครื่องไม่ได้ถูก track บน Git และเป็น artifact ตกค้าง แต่กลับทำให้คอมไพเลอร์ overview สแกนเจอและนำไปแสดงเป็นโฟลเดอร์หลักใน `devflow/context/project-overview.md`
  - โมดูล `packages/create-nexus-devflow/lib/ide-extension.ts` สร้าง manifest ของ VS Code extension ที่ไม่ได้มีการเรียกใช้งานจริงในระบบ
- **The Fix (Option B)**:
  - ลบโฟลเดอร์ `extensions/` ที่ตกค้างบน filesystem
  - ลบโมดูล `packages/create-nexus-devflow/lib/ide-extension.ts`
  - รีแฟกเตอร์ไฟล์เทส `packages/create-nexus-devflow/test/ide-extension.test.ts` ให้เป็น `packages/create-nexus-devflow/test/webview-studio.test.ts` โดยตัดเคส manifest ออก และคงเคสของ Webview Studio ไว้ 100%
  - อัปเดต `devflow/context/project-overview.md` ด้วยคำสั่ง `npm run overview -- --write`
  - ยืนยันว่าคำสั่ง CLI `nexus-devflow studio` และ MCP tool `devflow_get_studio_html` ยังคงทำงานได้สมบูรณ์

---

## 2. Implementation Checklist

- [x] **Task 1: Remove untracked `extensions/` folder from filesystem**
  - Delete `extensions/` recursively.
  - *Done when*: Directory `extensions/` no longer exists on disk.

- [x] **Task 2: Delete unused `lib/ide-extension.ts`**
  - Remove `packages/create-nexus-devflow/lib/ide-extension.ts`.
  - *Done when*: File is deleted from repository.

- [x] **Task 3: Refactor test suite to `test/webview-studio.test.ts`**
  - Rename `packages/create-nexus-devflow/test/ide-extension.test.ts` -> `packages/create-nexus-devflow/test/webview-studio.test.ts`.
  - Remove unused import `generateIdeExtensionManifest` and its test case.
  - Ensure all remaining Webview Studio & MCP tests pass cleanly.
  - *Done when*: `npm test` passes with 0 failures.

- [x] **Task 4: Recompile `project-overview.md`**
  - Run `npm run overview -- --write`.
  - *Done when*: Section 8 in `devflow/context/project-overview.md` no longer contains `extensions`.

- [x] **Task 5: Multi-Lane Verification & Quality Gate**
  - Run `npm run check` and `npm run check:static`.
  - *Done when*: All framework integrity checks pass with 0 errors.

---

## 3. Verification Evidence

- **Type Safety**: `npm run typecheck` (`tsc --noEmit` — 0 errors)
- **Unit Tests**: `npm test` (134/134 package tests passed + 4/4 overview tests passed)
- **Static Contract**: `npm run check:static` (31 Core Skills synchronized across `.agents/` and `.claude/`)
- **Framework & Package Smoke**: `npm run check` (Clean tarball generation and temporary workspace smoke overlay passed)
- **Findings Ledger**: 0 active findings (Clean)
