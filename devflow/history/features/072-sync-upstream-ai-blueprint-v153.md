# 072-sync-upstream-ai-blueprint-v153: Sync Upstream AI Blueprint v1.5.3 (Manifest-Aware Adapter Selection in Onboard & E2E Scenario Parity)

> **Category**: `features`  
> **Archive Date**: 2026-09-04  
> **Status**: `Completed & Shipped`  
> **Target Release**: Nexus-DevFlow v2.12.2  

- **Feature ID**: `072-sync-upstream-ai-blueprint-v153`
- **Track**: `Unified Fast-Track`
- **Requirement Ref**: `devflow/inbox/REQ-20260904-001-sync-upstream-ai-blueprint/parsed.md`
- **Impact Ref**: `devflow/analysis/REQ-20260904-001-sync-upstream-ai-blueprint/codebase-impact.md`

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
- **Problem**: 
  1. เมื่อผู้ใช้รัน `/onboard` บนโปรเจกต์ที่มีโฟลเดอร์ `.agents/` ตัว AI มักจะอนุมานเอาเองว่าผู้ใช้เลือกเครื่องมือทุกตัวที่แชร์โฟลเดอร์นี้ (Codex, Antigravity, GitHub Copilot, OpenCode) และถามผู้ใช้ซ้ำซ้อน ทั้งๆ ที่ตัวติดตั้งได้บันทึกรายการ `adapters` ที่ผู้ใช้เลือกไว้ใน Manifest แล้ว
  2. เมื่อมีไฟล์ Manifest อยู่จริง (`.nexus/nexus-devflow.json` หรือ `devflow/.state/manifest.json`) `/onboard` ไม่ได้อ่านข้อมูลดังกล่าว ทำให้เกิดพฤติกรรมถามผู้ใช้ซ้ำและไม่รักษาสถานะเดิมที่เลือกไว้
  3. ขาดชุดทดสอบ End-to-End (E2E) Scenario ตัวที่ 10 (`adapter-selection.ts`) สำหรับตรวจสอบความถูกต้องของการรักษา Adapter State ของ Onboard
- **Goal**:
  1. พอร์ตและปรับปรุง Step 1 (Preflight) และ Step 6 (Adapter Detection) ใน `/onboard` ทั้ง `.agents/` และ `.claude/` ให้อ่านและยึดถือรายการ `adapters` ใน Manifest เป็น Authoritative Source of Truth
  2. เพิ่มชุดทดสอบ E2E Scenario ตัวที่ 10 `scripts/e2e/scenarios/adapter-selection.ts`
  3. อัปเดต Static Framework Verification Contracts ใน `agent-bundle.manifest.json` และ `scripts/validate-framework.ts`
  4. อัปเดต `CHANGELOG.md` บันทึกการปล่อยอัปเดตเวอร์ชัน 2.12.2

---

## 📐 2. Technical Spec & Contracts

### Acceptance Criteria (AC)
- [x] **AC-1**: `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md` มี Step 1 ที่อ่าน Manifest และ Step 6 ที่ยึดถือ Manifest เป็น Authoritative Selection โดยไม่ถามซ้ำ
- [x] **AC-2**: `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md` มีเนื้อหาและสัญญาความกระชับสอดคล้องกัน 100% (< 400 ตัวอักษรต่อ Description)
- [x] **AC-3**: `scripts/e2e/scenarios/adapter-selection.ts` ถูกสร้างและทำงานร่วมกับ E2E Test Harness ได้สมบูรณ์
- [x] **AC-4**: `agent-bundle.manifest.json` และ `scripts/validate-framework.ts` บรรจุข้อความสัญญา Onboard และรัน `npm run check:static` ผ่าน 100%
- [x] **AC-5**: `npx tsx scripts/check-upstream-drift.ts` รายงานสถานะ Skills & Commits Parity ครบถ้วน

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Onboard Skill Enhancement (Manifest-Aware Adapter Reporting)**
  - [x] 1.1 `[TDD-Red]` ตรวจสอบและระบุจุดที่ Step 1 และ Step 6 ใน `.agents/skills/onboard/SKILL.md` ยังขาด Manifest Selection Contract
  - [x] 1.2 `[TDD-Green]` อัปเดต Step 1 (อ่าน manifest) และ Step 6 (authoritative selection) ใน `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md`
  - [x] 1.3 `[TDD-Refactor]` ตรวจสอบความสอดคล้องของคำอธิบายและ Context Budget ของทั้งสองไฟล์

- [x] **Task 2: E2E Scenario Suite Addition (Scenario 10: `adapter-selection.ts`)**
  - [x] 2.1 `[TDD-Red]` สร้างไฟล์ `scripts/e2e/scenarios/adapter-selection.ts` พร้อมกำหนด Assertions การรักษารายการ Adapter
  - [x] 2.2 `[TDD-Green]` ทดสอบรันและปรับแต่ง Logic ของ Scenario ให้รองรับ DevFlow paths
  - [x] 2.3 `[TDD-Refactor]` ตรวจสอบความสะอาดของโค้ดและการส่งออก `default export`

- [x] **Task 3: Framework Static Verification & Contract Sync**
  - [x] 3.1 `[TDD-Red]` เพิ่มสัญญาข้อความ `authoritative installer selection` และ `point to /doctor instead of guessing` ลงใน `agent-bundle.manifest.json` และ `scripts/validate-framework.ts`
  - [x] 3.2 `[TDD-Green]` รัน `npm run check:static` เพื่อยืนยันว่า Contract Validation ผ่านทั้งหมด
  - [x] 3.3 `[TDD-Refactor]` รัน `npm test`, `npm run typecheck`, และ `npx tsx scripts/check-upstream-drift.ts`

- [x] **Task 4: Documentation & History Finalization**
  - [x] 4.1 `[TDD-Green]` อัปเดต `CHANGELOG.md` ระบุการซิงก์ส่วนขยาย v1.5.3
  - [x] 4.2 `[TDD-Refactor]` ตรวจสอบความพร้อมสำหรับการส่งมอบ

---

## ⚡ 4. Implementation Log & Evidence

- **Step 1 (Onboard Manifest Integration)**: เพิ่มการอ่าน Manifest (`.nexus/nexus-devflow.json` / `devflow/.state/manifest.json`) ใน Preflight และกำหนดให้ Step 6 ยึดรายการ `adapters` เป็น Authoritative Selection ห้ามถามผู้ใช้ซ้ำเมื่อมี Manifest พร้อมอธิบายความเข้ากันได้หากไม่มี Manifest
- **Step 2 (E2E Scenario 10)**: สร้าง `scripts/e2e/scenarios/adapter-selection.ts` ทดสอบพฤติกรรม Onboard รักษา Manifest selection อย่างถูกต้อง
- **Step 3 (Static Contracts & Verification)**: เพิ่ม Verification Contracts ใน `agent-bundle.manifest.json` และ `scripts/validate-framework.ts` ผ่าน 100%

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :--- | :--- |
| **Static Check** | `npm run check:static` | ✅ PASSED | 32 Core Skills, manifest synchronized, 100% contract match |
| **Typecheck** | `npm run typecheck` | ✅ PASSED | TypeScript zero errors |
| **Unit & Integration Tests** | `npm test` | ✅ PASSED | 158/158 tests passed (138 package, 4 overview, 11 sandbox, 5 run-state) |
| **Package Smoke** | `npm run check` | ✅ PASSED | Overlay smoke test pass on temp dir with 110 template files |
| **Upstream Drift Radar** | `npx tsx scripts/check-upstream-drift.ts` | ✅ PASSED | 100% Upstream Skills & Commits Parity |
