# 📐 [064-sync-upstream-ai-blueprint-v120] ซิงก์ AI Blueprint Upstream v1.1.0 & v1.2.0 (Browser Tests + Playwright + MCP BrowserOS Neo, Independent Audit Review & Receipt Ledger)

> **Status**: Completed / Delivered  
> **Track**: Fast-Track (Living Spec Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/064-sync-upstream-ai-blueprint-v120`  
> **Discovery Reference**: [`DISC-20260901-001-sync-upstream-ai-blueprint`](../../discoveries/DISC-20260901-001-sync-upstream-ai-blueprint/discovery.md)  
> **Created Date**: 2026-09-01  
> **Delivered Date**: 2026-09-01  
> **Owner**: DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### Problem Statement
Upstream AI Blueprint ได้ปล่อยเวอร์ชัน `v1.1.0` และ `v1.2.0` เพื่อยกระดับความสามารถในการทดสอบเบราว์เซอร์และการตรวจทานความปลอดภัยของโค้ด:
1. **Browser Test Harness (`/browser-tests`)**: เพิ่ม Core Skill สำหรับตรวจจับและติดตั้ง Playwright (`@playwright/test`) เพื่อให้การทดสอบ E2E และ UI Automation เป็นมาตรฐานของโปรเจกต์
2. **Independent Audit Review Protocol (`audit independent current`)**: ระบบการตรวจทานโค้ดแบบอิสระจากภายนอก (Two-Agent Review / Multi-Model Verification) พร้อมสร้าง Review Receipt ใน `review.md`, คำนวณ SHA-256 Cryptographic Hash ของ Living Spec, บันทึก Base/Target Commit SHA (40 ตัวอักษร) และมี Quality Gate บล็อก `/complete` หาก Receipt ไม่ผ่านหรือหมดอายุ
3. **Hybrid Browser Testing with MCP BrowserOS Neo**: เพื่อเพิ่มประสิทธิภาพการทำงานของ AI Agent ในการตรวจสอบหน้าเว็บแบบ Interactive ทาง DevFlow ได้ผสานการรองรับ **MCP `browseros-neo`** (`http://127.0.0.1:9010/mcp`) ควบคู่กับชุดทดสอบ Playwright

### In-Scope
- สร้างโมดูล `packages/create-nexus-devflow/lib/review.ts` และชุดทดสอบ `test/review.test.ts` รองรับการ Parse, Hash, Freshness Check และ Task Context Resolution
- อัปเดต `packages/create-nexus-devflow/lib/project-config.ts` ให้รองรับ `"independentReview": "manual" | "when-sensitive" | "always"` ใน `qualityGates.regular` และ `qualityGates.continuous`
- ผสาน `review.ts` เข้าสู่ `lib/status.ts`, `lib/dashboard.ts`, และ `lib/dashboard-page.ts` พร้อมแสดงสถานะ Review ใน CLI และ Web Dashboard
- สร้าง Core Skill `browser-tests` ใน `.agents/skills/browser-tests/SKILL.md` และ `.claude/skills/browser-tests/SKILL.md` (รองรับ Playwright + MCP `browseros-neo`)
- สร้าง `.agents/skills/audit/reference/independent-review.md` และ `.claude/skills/audit/reference/independent-review.md`
- สร้างเทมเพลตเริ่มต้น `devflow/context/review.md`
- อัปเดต Workflow Skills: `audit`, `complete`, `check`, `feature`, `implement`, `tests`, `doctor`, `status`, `onboard`, `autopilot`, `continuous`, `try`
- อัปเดตเอกสารมาตรฐาน: `devflow/context/coding-standards.md`, `devflow/context/ai-interaction.md`, `AGENTS.md`, `README.md`, `CHANGELOG.md`, `devflow/config.json`
- อัปเดต `.nexus/nexus-devflow.json`, `agent-bundle.manifest.json`, `scripts/validate-framework.ts` (นับรวม Core Skill `browser-tests` เป็น 30 Core Skills) และ `scripts/smoke-package.ts`
- รัน Verification Matrix ทั้งหมด (`npm run check:static`, `npm test`, `npm run test:package`) ผ่าน 100%

### Out-of-Scope
- การเปลี่ยนแปลงโครงสร้างหลักของ 3-Pillars หรือ Pure Task-Isolated Living Spec Model
- การเปลี่ยนภาษาเริ่มต้นของ Artifacts (คงไว้ที่ภาษาไทย `th`)
- การ Push หรือ Deploy ขึ้น Remote โดยไม่ได้รับคำสั่งอนุมัติ

### Acceptance Criteria
- [x] **AC-1**: `packages/create-nexus-devflow/lib/review.ts` ทำงานได้อย่างสมบูรณ์: อ่าน `review.md`, ตรวจสอบ SHA-256 Spec Hash, Full 40-char Commit SHAs, คำนวณ Freshness (`current`, `stale`, `malformed`, `none`), รองรับ Task Context Resolution ใน `devflow/context/{xxx-slug}/review.md` และมี Unit Tests ผ่าน 100%
- [x] **AC-2**: `project-config.ts` ตรวจสอบและรองรับ Gate `"independentReview": "manual" | "when-sensitive" | "always"` ในทั้ง Regular และ Continuous Modes
- [x] **AC-3**: `status` และ `dashboard` แสดงผล Independent Review Status, Hash Freshness, Verdict, และแจ้งเตือน Review Warnings ได้อย่างถูกต้อง
- [x] **AC-4**: เพิ่ม Core Skill `browser-tests` (ทั้ง `.agents/` และ `.claude/`) สามารถตรวจสอบ/ติดตั้ง Playwright และรองรับ MCP `browseros-neo` (`http://127.0.0.1:9010/mcp`) สำหรับ Live Inspection & Screenshots
- [x] **AC-5**: สคิล `audit` รองรับคำสั่ง `audit independent current` เพื่อสร้าง Handoff Request สำหรับ Session ใหม่, และสคิล `complete` บล็อกการทำงานเมื่อ `independentReview` Gate ทำงานแล้วไม่มี Valid Receipt
- [x] **AC-6**: สคิล `check`, `implement`, `feature`, `tests`, `doctor` ผสานการตรวจสอบ Browser Tests และ Review State ครบถ้วน
- [x] **AC-7**: Framework Manifest (`.nexus/nexus-devflow.json`, `agent-bundle.manifest.json`, `scripts/validate-framework.ts`) ซิงค์ Core Skills ครบ 30 ตัว
- [x] **AC-8**: ชุดทดสอบทั้งหมด (`npm run check:static`, `npm test`, `npm run test:package`) ผ่าน 100%

---

## 2. Plan & Test Strategy

### Files to Modify / Create
- `packages/create-nexus-devflow/lib/review.ts` [NEW]
- `packages/create-nexus-devflow/test/review.test.ts` [NEW]
- `devflow/context/review.md` [NEW]
- `.agents/skills/browser-tests/SKILL.md` [NEW]
- `.claude/skills/browser-tests/SKILL.md` [NEW]
- `.agents/skills/audit/reference/independent-review.md` [NEW]
- `.claude/skills/audit/reference/independent-review.md` [NEW]
- `packages/create-nexus-devflow/lib/project-config.ts` [MODIFY]
- `packages/create-nexus-devflow/test/project-config.test.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/status.ts` [MODIFY]
- `packages/create-nexus-devflow/test/status.test.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/dashboard.ts` [MODIFY]
- `packages/create-nexus-devflow/lib/dashboard-page.ts` [MODIFY]
- `devflow/config.json` [MODIFY]
- `devflow/context/coding-standards.md` [MODIFY]
- `devflow/context/ai-interaction.md` [MODIFY]
- `AGENTS.md` [MODIFY]
- `README.md` [MODIFY]
- `CHANGELOG.md` [MODIFY]
- `.nexus/nexus-devflow.json` [MODIFY]
- `agent-bundle.manifest.json` [MODIFY]
- `scripts/validate-framework.ts` [MODIFY]
- `scripts/smoke-package.ts` [MODIFY]
- `.agents/skills/audit/SKILL.md`, `.claude/skills/audit/SKILL.md` [MODIFY]
- `.agents/skills/complete/SKILL.md`, `.claude/skills/complete/SKILL.md` [MODIFY]
- `.agents/skills/check/SKILL.md`, `.claude/skills/check/SKILL.md` [MODIFY]
- `.agents/skills/feature/SKILL.md`, `.claude/skills/feature/SKILL.md` [MODIFY]
- `.agents/skills/implement/SKILL.md`, `.claude/skills/implement/SKILL.md` [MODIFY]
- `.agents/skills/tests/SKILL.md`, `.claude/skills/tests/SKILL.md` [MODIFY]
- `.agents/skills/doctor/SKILL.md`, `.claude/skills/doctor/SKILL.md` [MODIFY]
- `.agents/skills/status/SKILL.md`, `.claude/skills/status/SKILL.md` [MODIFY]
- `.agents/skills/onboard/SKILL.md`, `.claude/skills/onboard/SKILL.md` [MODIFY]
- `.agents/skills/autopilot/SKILL.md`, `.claude/skills/autopilot/SKILL.md` [MODIFY]
- `.agents/skills/continuous/SKILL.md`, `.claude/skills/continuous/SKILL.md` [MODIFY]
- `.agents/skills/try/SKILL.md`, `.claude/skills/try/SKILL.md` [MODIFY]

### Test Decision: Required (TDD)
- **Rationale**: โมดูล `review.ts` เป็น Load-Bearing Module ที่ต้องคำนวณและตรวจสอบ Cryptographic Hash, Git Ancestor, Markdown Structure และ Freshness อย่างแม่นยำ 100%
- **Planned Test Cases**:
  - Empty / Reset `review.md` returns `none` state
  - Valid signed receipt returns `passed` or `changes-requested`
  - Stale detection when HEAD moves past target commit
  - Stale detection when Living Spec hash mismatches
  - Task context resolution finds `devflow/context/{xxx-slug}/review.md`
  - Malformed Markdown / Invalid SHA format returns `malformed` with warning code
  - Config schema validates `independentReview` mode enum

---

## 3. Implementation Checklist (TDD)

- [x] Task 1: [TDD-Red] สร้าง `packages/create-nexus-devflow/test/review.test.ts` ทดสอบพฤติกรรมของ `readIndependentReview`, `parseIndependentReview`, `determineFreshness`, และ Task-Isolated Context Resolution
- [x] Task 2: [TDD-Green] สร้าง `packages/create-nexus-devflow/lib/review.ts` ให้ผ่านยูนิตเทสต์ทั้งหมด โดยรองรับการอ่านและคำนวณ SHA-256 hash ของ `spec.md` และ `review.md`
- [x] Task 3: [TDD-Refactor] อัปเดต `packages/create-nexus-devflow/lib/project-config.ts` และ `test/project-config.test.ts` ให้รองรับ `"independentReview": "manual" | "when-sensitive" | "always"`
- [x] Task 4: [TDD-Refactor] ผสาน `review.ts` เข้าสู่ `packages/create-nexus-devflow/lib/status.ts`, `lib/dashboard.ts`, `lib/dashboard-page.ts` และอัปเดต `test/status.test.ts`
- [x] Task 5: สร้าง Core Skill `browser-tests` (`.agents/skills/browser-tests/SKILL.md` และ `.claude/skills/browser-tests/SKILL.md`) รองรับ Playwright และ MCP `browseros-neo` (`http://127.0.0.1:9010/mcp`)
- [x] Task 6: สร้างคู่มือ `audit/reference/independent-review.md` (ทั้ง `.agents/` และ `.claude/`) และเทมเพลต `devflow/context/review.md`
- [x] Task 7: อัปเกรด Workflow Skills ทั้งหมด (`audit`, `complete`, `check`, `feature`, `implement`, `tests`, `doctor`, `status`, `onboard`, `autopilot`, `continuous`, `try`) ให้ผสาน Independent Review และ Browser Testing
- [x] Task 8: อัปเดตเอกสารแกนกลาง (`devflow/context/coding-standards.md`, `devflow/context/ai-interaction.md`, `AGENTS.md`, `README.md`, `CHANGELOG.md`, `devflow/config.json`)
- [x] Task 9: อัปเดต Framework Manifests (`.nexus/nexus-devflow.json`, `agent-bundle.manifest.json`), `scripts/validate-framework.ts` (ปรับ Core Skills เป็น 30) และ `scripts/smoke-package.ts`
- [x] Task 10: รัน Technical Verification Matrix (`npm run check:static`, `npm test`, `npm run test:package`) ผ่าน 100%
- [x] Repair Q-001/T-001 (AC-3): ส่งต่อ verdict/freshness/check/warnings ไปยัง CLI, completion gate, Multi-Run summaries และ dashboard/API พร้อม focused regression tests
- [x] Repair Q-002 substep (AC-6 primary lifecycle): ผสาน independent-review policy/receipt และ browser-test handoff ใน `feature`, `implement`, `status` ทั้ง `.agents`/`.claude` พร้อม static/package contract validation
- [x] Repair Q-002 substep (AC-6 orchestration): ผสาน independent-review policy/receipt และ browser-test handoff ใน `onboard`, `autopilot`, `continuous` ทั้ง `.agents`/`.claude`; reviewer scope ครบและพร้อม re-review
- [x] Repair Q-003: Diff hygiene trailing blank lines cleanup

---

## 4. Empirical Evidence & Verification Results

### Static Validation (`npm run check:static`)
- 30 Core Skills validated across `.agents` and `.claude`
- All manifests (`.nexus/nexus-devflow.json`, `agent-bundle.manifest.json`) synchronized

### Unit Tests (`npm test`)
- 132/132 CLI Tests passed
- 4/4 Overview Tests passed
- 0 failed, 0 skipped

### Package Smoke Test (`npm run test:package`)
- Full build and template packaging completed
- Clean temp directory overlay test passed with 30 Core Skills per adapter

### Full Framework Check (`npm run check`)
- ✅ All Nexus-DevFlow checks PASSED successfully!

---

## 5. Findings & Resolutions

- **Q-001 [P1] closed**: Review state is incomplete and not rendered per task in Multi-Run status/dashboard
- **Q-002 [P1] closed**: Required workflow integration in AC-6 is incomplete (synchronized across all 6 skills in both adapters)
- **T-001 [P1] closed**: Critical status/dashboard review-gate behavior covered with 10/10 regression tests in `test/status.test.ts`
- **Q-003 [P3] closed**: Diff hygiene extra EOF blank lines cleaned up

---

## 6. Final Delivery Summary

- **Completed Date**: 2026-09-01
- **Target Branch**: `feature/064-sync-upstream-ai-blueprint-v120`
- **Full Verification Gate**: `npm run check` (TypeScript, Static Framework Validation, 132 Unit Tests, Package Smoke Test) passed 100%.
