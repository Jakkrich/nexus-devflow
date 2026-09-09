# Task Living Spec: 084-unscoped-nexus-devflow-cli-package

> **Task ID**: `084-unscoped-nexus-devflow-cli-package`  
> **Feature**: Unscoped CLI Packages & Shorthand Shims (`npx nexus-devflow` & `npm create nexus-devflow`)  
> **Type**: Feature (Phase 34)  
> **Track**: Fast-Track (TDD-Driven)  
> **Size**: S  
> **Status**: Ready for Implementation  
> **Target Branch**: `feature/084-unscoped-nexus-devflow-cli-package`

---

## 🎯 1. Problem Statement & Objectives

### ปัญหาเดิม:
- ปัจจุบันการติดตั้งและใช้งาน Nexus-DevFlow ผ่าน `npx` ต้องพิมพ์คำสั่งขนาดยาว:
  ```bash
  npx @jakkrichm/create-nexus-devflow
  ```
  ซึ่งมีความยาวถึง 34 ตัวอักษร พิมพ์ผิดพลาดได้ง่าย และจดจำยากสำหรับผู้ใช้งานใหม่
- ในชุมชนนักพัฒนา Node.js/JavaScript มีธรรมเนียมการเริ่มต้นโปรเจกต์สากล เช่น `npm create vite@latest`, `npm create next-app` หรือเรียกใช้ CLI สั้นๆ เช่น `npx prisma`, `npx astro`, `npx vitest`

### เป้าหมายของฟีเจอร์นี้:
1. **รองรับ `npx nexus-devflow` (Option 1)**: สั้น กระชับ เหลือเพียง 18 ตัวอักษร เพื่อให้เรียกใช้ CLI และ Subcommands ต่างๆ ได้ง่ายดาย เช่น:
   ```bash
   npx nexus-devflow
   npx nexus-devflow skill add --recommended
   npx nexus-devflow dashboard
   ```
2. **รองรับ `npm create nexus-devflow` (Option 2)**: ท่ามาตรฐานสำหรับ Scaffolding ทั่วไปในระบบนิเวศ Node.js (ซึ่ง npm จะแมปไปยังแพ็กเกจ `create-nexus-devflow` บน npm)
3. **รักษาความเข้ากันได้ 100% (Zero-Breaking)**: แพ็กเกจเดิม `@jakkrichm/create-nexus-devflow` ยังคงทำงานได้สมบูรณ์ โดย Shims ทั้งสองตัวจะเรียกต่อไปยังแกนหลักเดียวกัน

---

## 🏗️ 2. Architecture & Design Decisions

### A. Monorepo Wrapper Shim Pattern (Zero Duplication)
เราจะไม่คัดลอกโค้ดหลักหรือ Duplicate engine แต่จะสร้าง Thin Wrapper Packages 2 โฟลเดอร์ใน `packages/`:

1. **`packages/nexus-devflow/`**:
   - `package.json`:
     - `"name": "nexus-devflow"`
     - `"bin": { "nexus-devflow": "./bin/nexus-devflow.js", "devflow": "./bin/nexus-devflow.js" }`
     - `"dependencies": { "@jakkrichm/create-nexus-devflow": "^2.15.3" }`
   - `bin/nexus-devflow.js`:
     ```javascript
     #!/usr/bin/env node
     import "@jakkrichm/create-nexus-devflow/dist/bin/create-nexus-devflow.js";
     ```

2. **`packages/create-nexus-devflow/` (หรือ Shim `packages/create-nexus-devflow-shim/`)**:
   - เพื่อให้ `npm create nexus-devflow` ทำงาน npm จะมองหาแพ็กเกจชื่อ `create-nexus-devflow`
   - สร้าง Shim package ที่ export bin `create-nexus-devflow` ชี้ไปยัง engine เดียวกัน

### B. Automated Release Pipeline Synchronization
- อัปเดต `.github/workflows/publish.yml` ให้ตรวจสอบและ publish ทั้ง 3 แพ็กเกจพร้อมกันเมื่อมี Git tag `v*`
- อัปเดต `.agents/skills/publish-devflow/SKILL.md` และ `.claude/skills/publish-devflow/SKILL.md` ให้บันทึกการซิงก์เลขเวอร์ชันของ wrapper shims

### C. Documentation Alignment
- อัปเดตคู่มือเริ่มต้นใน `AGENTS.md`, `CLAUDE.md`, `README.md`, และ `packages/create-nexus-devflow/README.md`
- นำเสนอ `npm create nexus-devflow` และ `npx nexus-devflow` เป็นคำสั่งแนะนำหลัก ควบคู่กับ `@jakkrichm/create-nexus-devflow`

---

## 📋 3. TDD Implementation Checklist

- [x] **Task 1: Scaffold Wrapper Shim Packages**
  - [x] 1.1 `[TDD-Green]` สร้าง `packages/nexus-devflow/package.json`, `bin/nexus-devflow.js`, และ `README.md`
  - [x] 1.2 `[TDD-Green]` สร้าง `packages/create-nexus-devflow-shim/package.json`, `bin/create-nexus-devflow.js`, และ `README.md`
  - [x] 1.3 `[TDD-Green]` เพิ่ม Unit Test ทดสอบโครงสร้าง shim bins และ entry points ใน `packages/create-nexus-devflow/test/unscoped-shims.test.ts`

- [x] **Task 2: Sync Versioning & GitHub Actions Publish Workflow**
  - [x] 2.1 `[TDD-Green]` อัปเดต `.github/workflows/publish.yml` ให้รองรับการ publish ทั้ง 3 แพ็กเกจ
  - [x] 2.2 `[TDD-Green]` อัปเดต `.agents/skills/publish-devflow/SKILL.md` และ `.claude/skills/publish-devflow/SKILL.md`
  - [x] 2.3 `[TDD-Green]` อัปเดต `scripts/tag-release.ts` ให้ซิงก์เวอร์ชันใน wrapper packages

- [x] **Task 3: Documentation & Verification**
  - [x] 3.1 `[TDD-Green]` อัปเดตคำสั่งแนะนำใน `AGENTS.md`, `CLAUDE.md`, `README.md`
  - [x] 3.2 `[TDD-Green]` รัน `npm run check:static` และ `npm test` ยืนยันความสมบูรณ์ 100%

---

## ⚡ 4. Implementation Log & Evidence

- **Task 1 Evidence**:
  - สร้าง `packages/nexus-devflow/` ให้รองรับ `npx nexus-devflow` (Option 1) พร้อม binary shim ชี้ไปยัง `@jakkrichm/create-nexus-devflow`
  - สร้าง `packages/create-nexus-devflow-shim/` ให้รองรับ `npm create nexus-devflow` (Option 2)
  - เพิ่ม exports field ใน `packages/create-nexus-devflow/package.json`
  - เพิ่ม Unit Test `packages/create-nexus-devflow/test/unscoped-shims.test.ts` ทดสอบทั้ง configuration และ execution ของทั้ง 2 bins
- **Task 2 Evidence**:
  - อัปเดต `.github/workflows/publish.yml` ตรวจสอบ tag lockstep และ publish ทั้ง 3 แพ็กเกจไปยัง NPM อัตโนมัติ
  - อัปเดต `scripts/tag-release.ts` ให้ซิงก์เวอร์ชัน 3 จุดอัตโนมัติพร้อม git staging
  - ซิงก์คู่มือสคิล `publish-devflow` ทั้ง `.agents` และ `.claude`
- **Task 3 Evidence**:
  - อัปเดต `AGENTS.md` และ `packages/create-nexus-devflow/README.md`
  - เพิ่ม `brightGreen` ใน `packages/create-nexus-devflow/lib/ui.ts`
  - ผ่านการตรวจ `npm run check:static` 100%
  - ผ่านการตรวจ `npm test` ทั้ง 186 unit tests และ 4 integration suites
  - ผ่าน Package Smoke Test (`npm run check`) 100%

---

## 🧪 5. Verification Matrix & Empirical Proof

| Lane / Target | Command / Proof Target | Result | Empirical Proof / Notes |
| :--- | :--- | :---: | :--- |
| **Wrapper Execution (Option 1)** | `node packages/nexus-devflow/bin/nexus-devflow.js --version` | ✅ PASS | Returns `2.15.3`, help menu and status command work seamlessly |
| **Create Shim Execution (Option 2)** | `node packages/create-nexus-devflow-shim/bin/create-nexus-devflow.js --version` | ✅ PASS | Returns `2.15.3`, executes properly via Monorepo fallback and installed dependency |
| **Type Safety** | `npm run typecheck` (`tsc --noEmit`) | ✅ PASS | 0 type errors across entire repository |
| **Static Framework Contract** | `npm run check:static` | ✅ PASS | 32 Core skills synchronized, no legacy paths, all contracts valid |
| **Unit Test Suite** | `npm test` | ✅ PASS | 186 unit tests (all passing), 4 overview/sandbox/run-state suites passing |
| **Package Smoke Test** | `npm run test:package` / `npm run check` | ✅ PASS | Full pack, overlay in temp project, and verify 32 skills per adapter passed |

