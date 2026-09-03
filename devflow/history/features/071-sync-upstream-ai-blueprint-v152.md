# 071-sync-upstream-ai-blueprint-v152: Sync Upstream AI Blueprint v1.5.2 (Unborn Repo Onboarding & Branch Baseline Finalization)

> **Category**: `features`  
> **Archive Date**: 2026-09-03  
> **Status**: `Completed & Shipped`  
> **Target Release**: Nexus-DevFlow v2.12.1  

- **Feature ID**: `071-sync-upstream-ai-blueprint-v152`
- **Track**: `Unified Fast-Track`
- **Requirement Ref**: `devflow/inbox/REQ-20260903-001-sync-upstream-ai-blueprint/parsed.md`
- **Impact Ref**: `devflow/analysis/REQ-20260903-001-sync-upstream-ai-blueprint/codebase-impact.md`

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
- **Problem**: 
  1. เมื่อผู้ใช้สร้างโฟลเดอร์โปรเจกต์ใหม่และรัน `git init` แต่ยังไม่ได้ทำ Initial Commit (Unborn `HEAD`) เมื่อรัน `/onboard` AI มักสับสนเรื่อง branch หรือเกิดข้อผิดพลาดทำให้ต้องออกจาก IDE ไปสั่ง git เอง
  2. เมื่อผู้ใช้วางแผน DevFlow บน Dedicated Setup Branch (เช่น `feature/devflow-plans`) คำสั่ง `/overview` เดิมรองรับเฉพาะ main branch โดยตรง ไม่รองรับการ Fast-forward merge กลับเข้าสู่ `main` และลบ setup branch แบบ Local-Only
- **Goal**:
  1. พอร์ตและปรับแต่ง Step 0 ใน `/onboard` ทั้ง `.agents/` และ `.claude/` ให้ตรวจจับ Unborn `HEAD` พร้อมเสนอสร้าง Root Scaffold Commit (`chore: scaffold application`) ให้พร้อมใช้งาน
  2. พอร์ตและปรับแต่ง Step ใน `/overview` ให้รองรับ Setup Branch Baseline Finalization ด้วย `git merge --ff-only` กลับเข้า `main` แบบปลอดภัย
  3. เพิ่มชุดทดสอบ E2E Scenario ตัวที่ 9 `scripts/e2e/scenarios/unborn-onboarding.ts`
  4. อัปเดต `devflow/context/ai-interaction.md` และ Static Framework Verification Contracts ใน `scripts/validate-framework.ts`

---

## 📐 2. Technical Spec & Contracts

### Acceptance Criteria (AC)
- [x] **AC-1**: `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md` มี Step 0 สำหรับ Unborn repo inspection
- [x] **AC-2**: `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md` มี Baseline Finalization รองรับ dedicated setup branch (`git merge --ff-only`)
- [x] **AC-3**: `devflow/context/ai-interaction.md` มีคำอธิบายการ Finalize baseline บน setup branch
- [x] **AC-4**: `scripts/e2e/scenarios/unborn-onboarding.ts` ถูกเพิ่มและทำงานได้อย่างถูกต้อง
- [x] **AC-5**: `scripts/validate-framework.ts` ตรวจสอบ Verification Contracts ผ่าน 100%

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Onboard Skill Enhancement (Unborn Git State)**
  - [x] 1.1 `[TDD-Red]` ตรวจสอบข้อความและ contract ใน `.agents/skills/onboard/SKILL.md`
  - [x] 1.2 `[TDD-Green]` อัปเดต Step 0 ใน `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md`
  - [x] 1.3 `[TDD-Refactor]` ตรวจสอบความกระชับของข้อความ (Character Budget)

- [x] **Task 2: Overview Skill Enhancement (Setup-Branch Fast-Forward)**
  - [x] 2.1 `[TDD-Red]` ตรวจสอบเงื่อนไข baseline prompt ใน `.agents/skills/overview/SKILL.md`
  - [x] 2.2 `[TDD-Green]` อัปเดต Baseline Commit Logic ใน `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md`
  - [x] 2.3 `[TDD-Refactor]` อัปเดต `devflow/context/ai-interaction.md` ให้สอดคล้องกัน

- [x] **Task 3: E2E Scenario & Framework Validation Contract**
  - [x] 3.1 `[TDD-Red]` เขียน scenario `scripts/e2e/scenarios/unborn-onboarding.ts`
  - [x] 3.2 `[TDD-Green]` อัปเดต `agent-bundle.manifest.json` และ `scripts/validate-framework.ts` ให้ตรวจจับ unborn/baseline contracts
  - [x] 3.3 `[TDD-Refactor]` รัน `npm run check:static`, `npm test` และ `npm run check`

---

## ⚡ 4. Implementation Log & Evidence

- **Step 1 (Onboard Step 0)**: เพิ่มการตรวจจับ Unborn repository (`git rev-parse --verify HEAD`), การกรองเฉพาะ application scaffold files เพื่อสร้าง Initial Commit (`chore: scaffold application`) ป้องกันการปะปน workflow files เข้า Root Commit
- **Step 2 (Overview Baseline Finalization)**: อัปเดตเงื่อนไขให้รองรับ dedicated setup branch พร้อมข้อความ Prompt `Finalize the DevFlow baseline locally? (Recommended)` และการผสานกลับ `main` แบบ `git merge --ff-only` รวมทั้งลบ setup branch อัตโนมัติ (Local-Only)
- **Step 3 (E2E Scenario & Validation)**: เพิ่ม `scripts/e2e/scenarios/unborn-onboarding.ts`, อัปเดต `agent-bundle.manifest.json` และยืนยันผลการทดสอบผ่าน 100%

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :--- | :--- |
| **Static Check** | `npm run check:static` | ✅ PASSED | 32 Core Skills, คำอธิบายกระชับ, manifest synchronized |
| **Typecheck** | `npm run typecheck` | ✅ PASSED | TypeScript zero errors |
| **Unit & Integration Tests** | `npm test` | ✅ PASSED | 138/138 package tests, 4 overview, 11 sandbox, 5 run-state tests |
| **Package Smoke** | `npm run check` | ✅ PASSED | Overlay smoke test pass on fresh temp dir with 106 template files |
| **Upstream Drift Radar** | `npx tsx scripts/check-upstream-drift.ts` | ✅ PASSED | 100% Skills Parity Achieved |
