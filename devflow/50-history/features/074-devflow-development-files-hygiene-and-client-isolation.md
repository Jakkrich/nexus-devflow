# Feature: DevFlow Internal Development Files Hygiene, Git Ignore Hardening, and Client Repo Isolation

**From build-plan:** feature 29

> **Template Type**: Task-Isolated Living Spec
> **Active Location**: `devflow/context/074-devflow-development-files-hygiene-and-client-isolation/spec.md`
> **Archive Location**: `devflow/history/features/074-devflow-development-files-hygiene-and-client-isolation.md`

- **Feature ID**: `074-devflow-development-files-hygiene-and-client-isolation`
- **Category**: `features`
- **Target Branch**: `feature/074-devflow-development-files-hygiene-and-client-isolation`
- **Status**: `Completed`
- **Track**: `Unified Fast-Track`
- **Discovery Ref**: `devflow/discoveries/DISC-20260907-002-clean-devflow-internal-files-and-gitignore/discovery.md`
- **ADR Ref**: `ADR-1: Strict 3-Layer Isolation Boundary`, `ADR-2: Raw Requirement & Secret Quarantine Policy`, `ADR-3: Zero-Visibility Sanitize Protocol`

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
- **Problem**: ในการพัฒนาและใช้งาน Nexus-DevFlow มีโอกาสที่ไฟล์พัฒนาภายใน (เช่น `devflow/inbox/raw/`, `devflow/analysis/`, `devflow/scratch/`, ไฟล์ทดสอบ/evals, และแคช) จะหลุดเข้าไปใน Git commit ของ framework หรือหลุดเข้าไปใน Starter Template ของแพ็กเกจ npm (`@jakkrichm/create-nexus-devflow`) ซึ่งส่งผลให้โปรเจกต์ของลูกค้า (Client) มีไฟล์แปลกปลอม หรือเสี่ยงต่อการรั่วไหลของข้อมูลความลับ (Sensitive/PII data)
- **Goal**: วางระบบความสะอาดแบบ **3-Layer Defense-in-Depth** ครอบคลุม:
  1. *Repo Layer*: ปรับปรุง `.gitignore` ของ Nexus-DevFlow ให้ครอบคลุมทุกโฟลเดอร์พัฒนาชั่วคราวและไฟล์ดิบ
  2. *Packaging Layer*: ปรับปรุง `prepare-template.ts` ให้คัดกรองและสกัดเฉพาะไฟล์เทมเพลตที่สะอาดบริสุทธิ์ โดยตัดโฟลเดอร์วิเคราะห์และ scratch ออกทั้งหมด
  3. *Client Layer*: อัปเกรดคำแนะนำในสคิล `/onboard` และ `/adopt` สำหรับการจัดการ `.gitignore` ทั้งในโหมด Committed และโหมด Local-Only (Zero-Visibility)

### In-Scope & Out-of-Scope
- **In-Scope**:
  - อัปเดต `.gitignore` ของ root repository ให้ครอบคลุม `devflow/inbox/*/raw/*`, `devflow/inbox/raw/*`, `devflow/analysis/*`, `devflow/scratch/*`, `evals/results/`, `test-results/`, `__pycache__/`
  - ปรับปรุง `packages/create-nexus-devflow/scripts/prepare-template.ts` ให้ filter out `devflow/inbox/`, `devflow/analysis/`, `devflow/scratch/`, `devflow/tmp/`, `devflow/temp/`, `devflow/brainstorm/`, `devflow/reports/`, `prototypes/` ออกจาก Starter Template อย่างเด็ดขาด
  - สร้างชุดทดสอบ Unit Test `prepare-template.test.ts` เพื่อยืนยันความสะอาดของ Starter Template ก่อน Release
  - อัปเดตคำแนะนำและตัวอย่าง `.gitignore` ใน `.agents/skills/onboard/SKILL.md`, `.claude/skills/onboard/SKILL.md`, `.agents/skills/adopt/SKILL.md`, และ `.claude/skills/adopt/SKILL.md`
  - ตรวจสอบและทำความสะอาดไฟล์ดิบที่ไม่จำเป็นใน `devflow/inbox/` และ `devflow/analysis/`
- **Out-of-Scope**:
  - ไม่แก้ไขโครงสร้าง The 3-Pillars Model ของ DevFlow
  - ไม่แก้ไข Logic ภายในสคิลวิเคราะห์หลัก

### Risk & Mitigation Matrix
| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| Template Filter ตัดไฟล์ที่จำเป็นออกโดยไม่ได้ตั้งใจ | Medium | ใช้ Whitelist / Explicit Denylist และตรวจสอบผ่าน `npm run check:static` และ `prepare-template.test.ts` |
| ผู้ใช้ Onboard เลือก Local-Only แต่ไฟล์ถูก Track ใน Git ไปแล้ว | High | มีคำเตือนและคำแนะนำคำสั่ง `git rm --cached -r .agents .claude devflow CLAUDE.md .nexus` อย่างปลอดภัยโดยไม่ลบไฟล์จริงในเครื่อง |

### Success Criteria
1. Starter Template ใน `packages/create-nexus-devflow/template` สะอาด 100% ไม่มีโฟลเดอร์ `inbox`, `analysis`, `scratch`, `discoveries`, หรือ maintainer scripts ตกค้าง
2. `.gitignore` ป้องกันไม่ให้ไฟล์ดิบความลับ (`devflow/inbox/*/raw/*`) และไฟล์วิเคราะห์ถูก Commit เข้า Git
3. ชุดทดสอบ Unit Tests ทั้งหมดใน `packages/create-nexus-devflow/test/` และ `scripts/` ผ่าน 100%

---

## 📐 2. Technical Spec & Contracts

### Architecture & Component Design
1. **Layer 1: Hardened Git Ignore Patterns**:
   ```gitignore
   # DevFlow Transient Runtime Data, Research & Scratch Files
   devflow/runs/*
   !devflow/runs/.gitkeep
   devflow/discoveries/*
   !devflow/discoveries/.gitkeep
   devflow/reports/*
   !devflow/reports/.gitkeep
   devflow/research/*
   !devflow/research/.gitkeep
   devflow/scratch/*
   !devflow/scratch/.gitkeep
   devflow/decisions/*
   !devflow/decisions/.gitkeep
   !devflow/decisions/README.md
   devflow/inbox/*/raw/*
   devflow/inbox/raw/*
   devflow/analysis/*
   !devflow/analysis/.gitkeep
   devflow/tmp/*
   devflow/temp/*
   devflow/brainstorm/*
   devflow/brainstorms/*
   devflow/backups/*
   ```
2. **Layer 2: Strict Template Packaging Filter (`prepare-template.ts`)**:
   - เพิ่ม Denylist ตรวจจับ:
     - `devflow/inbox/`
     - `devflow/analysis/`
     - `devflow/scratch/`
     - `devflow/tmp/`
     - `devflow/temp/`
     - `devflow/brainstorm/`
     - `devflow/brainstorms/`
     - `devflow/backups/`
     - `devflow/reports/`
     - `prototypes/`

3. **Layer 3: Client Visibility Contracts in Onboard / Adopt Skills**:
   - โหมด **1. Commit DevFlow workflow files**:
     - สร้าง Starter `.gitignore` ที่ละเว้น `.state/`, `scratch/`, `reports/`, `inbox/raw/`, `.nexus/`
   - โหมด **2. Keep DevFlow workflow files local (Zero-Visibility)**:
     - ละเว้น `.agents/`, `.claude/`, `devflow/`, `CLAUDE.md`, `.nexus/`, `prototypes/`
     - Sanitize `AGENTS.md` ให้เป็น Clean Project Guide

### Acceptance Criteria (AC)
- [x] **AC-1**: `.gitignore` ของ repository มี ignore rules ครอบคลุม `devflow/inbox/*/raw/*`, `devflow/analysis/*`, และ `devflow/scratch/*`
- [x] **AC-2**: `prepare-template.ts` มี filter กรองไม่ให้โฟลเดอร์ `inbox`, `analysis`, `scratch`, `tmp`, `temp`, `brainstorm`, `reports`, `prototypes` หลุดเข้าไปใน `templateRoot`
- [x] **AC-3**: มี Unit Test `prepare-template.test.ts` ทดสอบว่าหลังรัน build template จะไม่มีไฟล์หรือโฟลเดอร์ต้องห้ามตกค้าง
- [x] **AC-4**: สคิล `onboard` และ `adopt` (ทั้ง `.agents/` และ `.claude/`) ได้รับการอัปเดตคำแนะนำ Visibility และ `.gitignore` ให้ตรงตามมาตรฐาน
- [x] **AC-5**: การทดสอบ `npm run check`, `npm test` และ `npm run test:package` ผ่าน 100%

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Hardened Git Ignore Patterns & Repo Clean-up**
  - [x] 1.1 `[TDD-Red]` เขียน Test Case ใน `packages/create-nexus-devflow/test/` เพื่อตรวจสอบ Pattern ของ `.gitignore`
  - [x] 1.2 `[TDD-Green]` อัปเดตไฟล์ `.gitignore` ที่ Root ของ repository ให้ครอบคลุมทุกบริบท
  - [x] 1.3 `[TDD-Refactor]` ตรวจสอบและจัดระเบียบหมวดหมู่ของ `.gitignore`

- [x] **Task 2: Template Packaging Filter & Automated Test Suite**
  - [x] 2.1 `[TDD-Red]` สร้างไฟล์ทดสอบ `packages/create-nexus-devflow/test/prepare-template.test.ts`
  - [x] 2.2 `[TDD-Green]` อัปเดต `packages/create-nexus-devflow/scripts/prepare-template.ts` ให้มี Denylist ครบถ้วน
  - [x] 2.3 `[TDD-Refactor]` รัน `npm run prepare:template` และยืนยันผลการทดสอบผ่านฉลุย

- [x] **Task 3: Client Visibility & Local-Only Workflow Protocol Alignment**
  - [x] 3.1 `[TDD-Green]` อัปเดต `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md`
  - [x] 3.2 `[TDD-Green]` อัปเดต `.agents/skills/adopt/SKILL.md` และ `.claude/skills/adopt/SKILL.md`
  - [x] 3.3 `[TDD-Refactor]` รัน Framework Verification Suite (`npm run check`, `npm test`, `npm run test:package`)

---

## ⚡ 4. Implementation Log & Evidence

- **Step 1 (Git Ignore Hardening)**:
  - เพิ่มการละเว้น `devflow/inbox/*/raw/*`, `devflow/inbox/raw/*`, `devflow/analysis/*`, `devflow/scratch/*`, `evals/results/` ใน `.gitignore`
  - ป้องกันไม่ให้เอกสารดิบความลับของลูกค้าหรือสเปกต้นฉบับหลุดเข้า Git
- **Step 2 (Template Packaging Filter & Unit Tests)**:
  - เพิ่มฟังก์ชัน `matchesPrefix` ใน `prepare-template.ts` เพื่อดักจับ directory และ subdirectories ทั้งหมด
  - กรองโฟลเดอร์พัฒนาและ transient ทั้งหมด: `inbox`, `analysis`, `scratch`, `tmp`, `temp`, `brainstorm`, `brainstorms`, `backups`, `reports`, `research`, `prototypes`, `evals`, `.nexus`
  - เพิ่ม Unit Test ใน `prepare-template.test.ts` และรันผ่าน 100%
- **Step 3 (Visibility & Protocol Guidance Alignment)**:
  - อัปเดต Step 6 ใน `onboard` และ Step 5 ใน `adopt` ทั้งสำหรับ `.agents/` และ `.claude/`
  - เสริมคำแนะนำ `.gitignore` ครอบคลุมทั้งโหมด Team Committed และ Local-Only (Zero-Visibility) พร้อมคำสั่ง `git rm --cached -r .agents .claude devflow CLAUDE.md .nexus prototypes`
- **Verification**:
  - `npm test`: ผ่าน 145/145 core tests + 4 overview + 11 sandbox + 5 run-state tests = รวม 165 tests
  - `npm run check`: ผ่าน 100%
  - `npm run check:static`: ผ่าน 100%
  - `npm run test:package`: Smoke test ผ่าน 100% (สร้าง 104 files สะอาดบริสุทธิ์)

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :--- | :--- |
| **Typecheck** | `npm run check` | 🟢 PASS | 0 errors across all TypeScript files & CLI packages |
| **Static Contract** | `npm run check:static` | 🟢 PASS | Framework static rules, 32 Core skills, and fast-track contracts validated |
| **Unit Tests** | `npm test` | 🟢 PASS | 165/165 tests passed (including `prepare-template.test.ts`) |
| **Package Smoke** | `npm run test:package` | 🟢 PASS | Starter template clean (104 files, zero transient leaks) |

---

## 📦 6. Release Digest & Retrospective

- **What Changed**: วางระบบ 3-Layer Defense-in-Depth สำหรับความสะอาดของไฟล์และการแยกแยะความเป็นส่วนตัว: (1) ปรับปรุง `.gitignore` ละเว้นไฟล์ดิบ `inbox/*/raw/*`, `analysis/`, `scratch/`, (2) ปรับปรุง `prepare-template.ts` กรองโฟลเดอร์พัฒนาภายในไม่ให้หลุดเข้า Starter Template ของ npm package พร้อมเพิ่ม `prepare-template.test.ts`, (3) อัปเดตสคิล `onboard` และ `adopt` สำหรับโหมด Team Committed และ Local-Only (Zero-Visibility)
- **Key Decisions**: กำหนดให้ `inbox/*/raw/*` ถูกกักกัน (quarantine) ใน `.gitignore` เสมอ เพื่อปกป้องเอกสารความลับของลูกค้า, ใช้ helper `matchesPrefix` ใน packaging script เพื่อกรอง directory แบบสมบูรณ์
- **Lessons Learned**: การกรองด้วย `startsWith("path/")` มีจุดอ่อนที่ไม่ตรวจจับตัว root folder `"path"` โดยตรง ทำให้เกิด directory ว่างเปล่า การใช้ helper `matchesPrefix` ที่ตรวจสอบทั้ง exact match และ subpath เป็นทางออกที่ปลอดภัยและแม่นยำที่สุด
- **Known Limitations**: หากโปรเจกต์ของ Client ถูก git track โฟลเดอร์ `.agents`/`devflow` ไปก่อนแล้ว จะต้องรันคำสั่ง `git rm --cached -r` เพื่อถอดออก ซึ่งได้เพิ่มคำแนะนำและคำสั่งนี้ในสคิล `onboard` และ `adopt` เรียบร้อยแล้ว
