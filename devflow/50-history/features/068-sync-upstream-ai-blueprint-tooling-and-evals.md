# 📐 [068-sync-upstream-ai-blueprint-tooling-and-evals] ซิงก์ส่วนขยาย Tooling & Evals Parity จาก Upstream AI Blueprint (E2E Agent Harness, Complete Evals Suite, Sandbox Automation, และ Upstream Drift Monitor)

> **Status**: Completed / Delivered  
> **Track**: Fast-Track (Task-Isolated Living Spec Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 21` & `devflow/discoveries/DISC-20260902-001-sync-upstream-ai-blueprint/discovery.md`  
> **Branch**: `feature/068-sync-upstream-ai-blueprint-tooling-and-evals`  
> **Started Date**: 2026-09-02  
> **Delivered Date**: 2026-09-02  
> **Owner**: DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement
หลังจากที่ Nexus-DevFlow ได้ซิงก์ Core Lifecycle และมาตรฐาน Context ของ AI Blueprint (v1.1.0 – v1.4.1) ครบถ้วนใน Feature 064 และ 067 ยังคงมีช่องว่างด้านเครื่องมือทดสอบ (Tooling & Quality Infrastructure) ที่สำคัญ:
1. **Missing Intent Routing Evals**: ชุดทดสอบ Intent Routing (`evals/routing/`) ยังขาดสคิลสำคัญ เช่น `browser-tests`, `continuous`, `bughunter`, และ `publish-devflow` ทำให้ขาดการการันตีว่า AI จะหยิบสคิลมาใช้ได้อย่างแม่นยำ 100%
2. **Lack of Live-Agent E2E Verification**: การทดสอบที่ผ่านมาทำเฉพาะ Unit Tests (`npm test`) และ Static Contract แต่ยังไม่มี Harness ที่รันเพื่อทดสอบพฤติกรรมและความปลอดภัยของโมเดล AI จริงในสภาพแวดล้อมจำลอง (Agent Boundary Scenarios)
3. **Manual Sandbox Scaffolding**: ขาดสคริปต์อัตโนมัติในการจำลองติดตั้ง Overlay บนโปรเจกต์ประเภทต่างๆ (Next.js, Vite, React, Node) เพื่อยืนยันความสมบูรณ์ของ npm package
4. **Untracked Upstream Drift**: ขาดเครื่องมือตรวจจับและแจ้งเตือนการเปลี่ยนแปลงของ Upstream AI Blueprint อัตโนมัติ ทำให้ต้องคอยเช็คด้วยตนเอง

### 1.2 In-Scope
1. **Complete Evals Intent Routing Suite (`evals/routing/`)**:
   - เพิ่ม `evals/routing/browser-tests.json` (ทดสอบ intent สำหรับ Playwright / Browser testing)
   - เพิ่ม `evals/routing/continuous.json` (ทดสอบ intent สำหรับ autonomous multi-feature loop)
   - เพิ่ม `evals/routing/bughunter.json` (ทดสอบ intent สำหรับ security bug hunting & vulnerability triage)
   - เพิ่ม `evals/routing/publish-devflow.json` (ทดสอบ intent สำหรับ package publication)
   - เพิ่ม `evals/routing/tests.json` (alias สำหรับ `setup-tests`)
   - ปรับปรุง `evals/routing.ts` ให้รันและรายงานผลครอบคลุมทุกสคิลอย่างแม่นยำ
2. **Live-Agent E2E Test Harness Adaptation (`scripts/e2e/`)**:
   - พอร์ตและปรับปรุง `scripts/e2e/harness.ts` และ `scripts/e2e/run.ts` ให้รองรับ DevFlow CLI และสถาปัตยกรรม 3-Pillars & Task-Isolated Workspace (`devflow/context/{xxx-slug}/`)
   - พอร์ต Scenarios หลัก 8 ชุด:
     - `scenarios/audit-lenses.ts` (ตรวจสอบ audit lenses & findings ledger)
     - `scenarios/autopilot-boundary.ts` (ตรวจสอบ autopilot boundary)
     - `scenarios/check-boundary.ts` (ตรวจสอบ check read-only boundary)
     - `scenarios/debug-boundary.ts` (ตรวจสอบ debug read-only boundary)
     - `scenarios/discovery-optional.ts` (ตรวจสอบ discovery workflow)
     - `scenarios/feature-gate.ts` (ตรวจสอบ feature approval gate & task isolation)
     - `scenarios/ledger-gate.ts` (ตรวจสอบการบล็อก merge เมื่อมี P0/P1)
     - `scenarios/rollback-plan.ts` (ตรวจสอบ rollback safe planning)
3. **Automated Sandbox Scaffolding & Cleanup (`scripts/scaffold-sandbox.ts`, `clear-sandbox.ts`)**:
   - นำเข้า `scripts/scaffold-sandbox.ts` และ `scripts/clear-sandbox.ts` พร้อมชุดทดสอบ `test.ts`
   - ปรับให้รองรับ `@jakkrichm/create-nexus-devflow` ในการจำลองติดตั้ง Overlay บน Clean App
4. **Upstream Drift Monitoring Utility (`scripts/check-upstream-drift.ts`)**:
   - สร้างสคริปต์ `scripts/check-upstream-drift.ts` (เชื่อมต่อคำสั่ง `npm run check:upstream`) ตรวจสอบความเปลี่ยนแปลงระหว่าง Repository นี้กับ Upstream AI Blueprint
5. **Context Efficiency Benchmark Documentation (`benchmarks/context-efficiency.md`)**:
   - สร้างเอกสาร `benchmarks/context-efficiency.md` สรุปผลการทดสอบการประหยัด Token และการควบคุม Context Window ของ DevFlow
6. **Package Scripts & Framework Validation**:
   - เพิ่มคำสั่งใน `package.json`: `"test:e2e"`, `"test:evals"`, `"check:upstream"`, `"sandbox:scaffold"`, `"sandbox:clear"`
   - อัปเดต `scripts/validate-framework.ts` ให้ตรวจนับและ Assert ความสมบูรณ์ของ Evals Routing และ E2E Scripts

### 1.3 Out-of-Scope
- ไม่แก้ไข Core Workflow Skills ที่เสร็จสมบูรณ์แล้วใน Feature 067
- ไม่บังคับรัน `test:e2e` ใน CI ปกติ (เนื่องจากต้องใช้โมเดล AI จริงและ token budget จึงให้รันแบบ Opt-in ด้วย `E2E_ACCEPT_RISK=1`)

### 1.4 Acceptance Criteria (เกณฑ์การยอมรับ)
- [x] **AC-1**: มีไฟล์ Evals Routing Fixtures ครบถ้วนใน `evals/routing/` (`browser-tests.json`, `continuous.json`, `bughunter.json`, `publish-devflow.json`, `tests.json`) และรันผ่าน 100%
- [x] **AC-2**: มีระบบ Live-Agent E2E Harness ใน `scripts/e2e/harness.ts` และ `scripts/e2e/run.ts` พร้อม Scenarios ทั้ง 8 ชุดที่รองรับสถาปัตยกรรม DevFlow
- [x] **AC-3**: มีสคริปต์ `scripts/scaffold-sandbox.ts`, `scripts/clear-sandbox.ts` พร้อม unit tests ทดสอบการสร้างและล้าง sandbox (11/11 tests green)
- [x] **AC-4**: `check-upstream-drift.ts` ตรวจสอบสถานะ Upstream ได้ถูกต้อง
- [x] **AC-5**: `benchmarks/context-efficiency.md` พร้อม
- [x] **AC-6**: `package.json` มี scripts: `test:evals`, `test:sandbox`, `test:e2e`, `check:upstream`, `sandbox:scaffold`, `sandbox:clear`
- [x] **AC-7**: `scripts/validate-framework.ts` ผ่านการตรวจสอบความถูกต้องของสัญญาทั้งหมด (0 errors)
- [x] **AC-8**: การทดสอบทั้งหมด (`npm test`, `npm run check:static`, `npm run test:package`) ผ่าน 100%

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `evals/routing/browser-tests.json` [NEW]
- `evals/routing/continuous.json` [NEW]
- `evals/routing/bughunter.json` [NEW]
- `evals/routing/publish-devflow.json` [NEW]
- `evals/routing/tests.json` [NEW]
- `scripts/e2e/harness.ts` [NEW]
- `scripts/e2e/run.ts` [NEW]
- `scripts/e2e/scenarios/audit-lenses.ts` [NEW]
- `scripts/e2e/scenarios/autopilot-boundary.ts` [NEW]
- `scripts/e2e/scenarios/check-boundary.ts` [NEW]
- `scripts/e2e/scenarios/debug-boundary.ts` [NEW]
- `scripts/e2e/scenarios/discovery-optional.ts` [NEW]
- `scripts/e2e/scenarios/feature-gate.ts` [NEW]
- `scripts/e2e/scenarios/ledger-gate.ts` [NEW]
- `scripts/e2e/scenarios/rollback-plan.ts` [NEW]
- `scripts/scaffold-sandbox.ts` [NEW]
- `scripts/scaffold-sandbox.test.ts` [NEW]
- `scripts/clear-sandbox.ts` [NEW]
- `scripts/clear-sandbox.test.ts` [NEW]
- `scripts/check-upstream-drift.ts` [NEW]
- `benchmarks/context-efficiency.md` [NEW]
- `package.json` [MODIFY]
- `scripts/validate-framework.ts` [MODIFY]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `manual` (งานนี้เป็นการเพิ่ม Developer Tooling & Test Automation ภายใน ไม่แตะต้อง authentication, secrets, หรือ external payments)
- **UI Evidence / Browser Tests**: Not applicable (ไม่มี UI components ของเว็บแอปพลิเคชัน)
- **Review Strategy**: One feature-level review packet at completion

### 2.3 Test Decision: Required (TDD)
- **Rationale**: การเพิ่มสคริปต์และ Evals Fixtures ต้องมี Unit Tests ตรวจสอบ (`scaffold-sandbox.test.ts`, `clear-sandbox.test.ts`, `evals/routing.ts`)

---

## 3. Implementation Checklist (Strict TDD)

- [x] **Task 1: Complete Evals Routing Suite**
  - [x] 1.1 `[TDD-Red]`: รัน `npm run test:evals` และตรวจสอบความครอบคลุมของ fixtures ใน `evals/routing/`
  - [x] 1.2 `[TDD-Green]`: สร้าง `browser-tests.json`, `continuous.json`, `bughunter.json`, `publish-devflow.json`, `tests.json` ใน `evals/routing/` (38 fixtures ครบ 38 skills)
  - [x] 1.3 `[TDD-Refactor]`: รัน `evals/routing.ts` ยืนยันว่าชุดทดสอบ routing 152 test cases ผ่าน 100%

- [x] **Task 2: Upstream Drift Monitor Utility**
  - [x] 2.1 สร้าง `scripts/check-upstream-drift.ts` เชื่อมต่อ git remote/local ตรวจสอบ log/tag ความแตกต่างกับ AI Blueprint
  - [x] 2.2 เพิ่ม script `"check:upstream"` ใน `package.json` และทดสอบรันผลสำเร็จ (แสดงตารางสถานะ Upstream v1.4.1 vs Local v2.10.3)

- [x] **Task 3: Sandbox Automation & Cleanup Scripts**
  - [x] 3.1 นำเข้าและปรับปรุง `scripts/scaffold-sandbox.ts` และ `scripts/clear-sandbox.ts` ให้รองรับ `@jakkrichm/create-nexus-devflow`
  - [x] 3.2 สร้าง `scripts/scaffold-sandbox.test.ts` และ `scripts/clear-sandbox.test.ts`
  - [x] 3.3 รันและยืนยันการผ่านของ Unit Tests (11/11 tests green)

- [x] **Task 4: Live-Agent E2E Test Harness & Scenarios**
  - [x] 4.1 พอร์ต `scripts/e2e/harness.ts` และ `scripts/e2e/run.ts` ปรับใช้กับ DevFlow 3-Pillars & Task-Isolated Workspace
  - [x] 4.2 สร้าง Scenarios ทั้ง 8 ชุดใน `scripts/e2e/scenarios/` (`audit-lenses`, `autopilot-boundary`, `check-boundary`, `debug-boundary`, `discovery-optional`, `feature-gate`, `ledger-gate`, `rollback-plan`)
  - [x] 4.3 เพิ่ม script `"test:e2e"` ใน `package.json`

- [x] **Task 5: Context Efficiency Benchmark Documentation**
  - [x] 5.1 สร้างเอกสาร `benchmarks/context-efficiency.md` อธิบายผลการประหยัด Token (36%-55% savings) และ Architecture Budget Guard

- [x] **Task 6: Framework Validation & Multi-Lane Verification**
  - [x] 6.1 ตรวจสอบความถูกต้องของสคริปต์และ Evals ใน `scripts/validate-framework.ts`
  - [x] 6.2 รัน `npm run check` (Typecheck + DevFlow Check ผ่าน 100%)
  - [x] 6.3 รัน `npm test` (149/149 unit tests passed) และ `npm run test:package` (Smoke test overlay passed)

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `npm run check` completed with exit code 0.
- **Automated Test Matrix**: 134 package tests + 4 overview tests + 11 sandbox tests passed (`npm test` 149/149 green).
- **Routing Evals Matrix**: `npm run test:evals` evaluated 152 test cases across 38 skills with 100.00% Rank 1 match accuracy.
- **Static Contract Verification**: `npm run check:static` passed with 0 issues across all 31 core skills, 7 extension skills, and 8 contract specifications.
- **Package Smoke Test**: `npm run test:package` passed successfully, verified 31 core skills in overlay extraction.
- **Upstream Drift Monitor**: `npm run check:upstream` executed and verified 100% Upstream Skills Parity.
- **Findings Ledger**: ตรวจสอบ `findings.md` สะอาด 100% (0 Blockers, 0 Critical, 0 Warnings).

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [x] **AC-1**: Complete Evals Fixtures ครบ 38 ไฟล์ และรันผ่าน 100%
- [x] **AC-2**: E2E Live-Agent Harness และ 8 Scenarios พร้อมใช้งานใน `scripts/e2e/`
- [x] **AC-3**: Sandbox scripts พร้อม tests ผ่าน 100% (11/11 tests green)
- [x] **AC-4**: `check-upstream-drift.ts` ตรวจสอบสถานะ Upstream ได้ถูกต้อง
- [x] **AC-5**: `benchmarks/context-efficiency.md` พร้อม
- [x] **AC-6**: `package.json` scripts ครบถ้วน (`test:evals`, `test:sandbox`, `test:e2e`, `check:upstream`, `sandbox:scaffold`, `sandbox:clear`)
- [x] **AC-7**: `validate-framework.ts` ผ่าน 100%
- [x] **AC-8**: Multi-lane tests green 100%

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: 2026-09-02
- **Verification Verdict**: Passed (0 Blockers, 0 P0/P1 Findings)
- **Framework Tests**: 149/149 Passed
- **Static Contract**: 100% Validated
- **Package Smoke Test**: 100% Overlay Success
