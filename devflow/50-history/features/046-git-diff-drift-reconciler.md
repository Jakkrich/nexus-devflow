# 📐 [046-git-diff-drift-reconciler] Git Diff Drift Reconciler & Self-Healing State Engine

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature 5` & `DISC-20260823-002: Defense 5`  
> **Branch**: `feature/046-git-diff-drift-reconciler`  
> **Completed Date**: 2026-08-23  

---

## 1. Specification & Scope

- **Problem Statement**:
  ในระหว่างการพัฒนาโค้ด นักพัฒนาหรือ AI Agent มักจะทำการสร้าง/แก้ไข/ลบไฟล์จริง (`git status` / `git diff`) โดยอาจลืมอัปเดตรายการไฟล์ในสเปก (`devflow/context/current-feature.md: 2. Plan & Test Strategy -> Files to Modify/Create`) หรืออาจแก้ไขไฟล์นอกเหนือ Scope ที่กำหนดไว้ (Scope Creep) นอกจากนี้ หากเกิดความคลาดเคลื่อนของ State (เช่นไฟล์ `current-stage.md` ชี้ไปที่ stage ผิด หรือ ID ไม่ตรงกับชื่อ Branch) ปัจจุบันระบบยังไม่มีกลไกตรวจจับและรักษาตัวเอง (Self-Healing Reconciler) ส่งผลให้เอกสารกับโค้ดจริงไม่ตรงกัน (Spec Drift)

- **In-Scope**:
  1. **Git Drift Reconciler Engine (`packages/create-nexus-devflow/lib/drift-reconciler.ts`)**:
     - พัฒนา `detectGitDrift`: ตรวจสอบและเปรียบเทียบไฟล์ที่มีการเปลี่ยนแปลงจริงจาก Git Status/Diff กับรายการไฟล์ใน Living Spec
     - จำแนกประเภทความคลาดเคลื่อน:
       - **Undocumented Files**: ไฟล์ที่มีการเปลี่ยนแปลงจริงใน Git แต่ไม่ได้ระบุใน Plan
       - **Phantom Files**: ไฟล์ที่ระบุใน Plan แต่ไม่มีการสร้าง/แก้ไขจริงใน Git
       - **Stage Drift**: ความไม่สอดคล้องระหว่าง Git Branch ปัจจุบันกับ Running ID ใน `current-stage.md`
     - พัฒนา `reconcileState`: กลไก Self-Healing ที่ช่วยซิงค์รายการไฟล์จริงเข้าสู่ `current-feature.md` และปรับปรุง `current-stage.md` ให้สอดคล้องกันอัตโนมัติ
     - กรองและละเว้น Transient Files (เช่น `.gitignore`, `devflow/history/`, `devflow/context/current-stage.md`, `node_modules/`)
  2. **Gatekeeper Integration (`packages/create-nexus-devflow/lib/gatekeeper.ts`)**:
     - ผสานการตรวจสอบ Drift เข้าสู่ Gatekeeper เพื่อแจ้งเตือน Advisory Warning หรือบล็อกใน `--strict` mode
  3. **MCP Tools Integration (`packages/create-nexus-devflow/lib/mcp.ts`)**:
     - เพิ่ม Tool `devflow_detect_drift` และ `devflow_reconcile_state` ใน DevFlow MCP Server
  4. **CLI Subcommand Integration (`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`)**:
     - เพิ่มคำสั่ง `nexus-devflow drift [--json]` และ `nexus-devflow reconcile [--fix] [--json]`
  5. **Automated Unit & Multi-Lane Tests (`packages/create-nexus-devflow/test/drift-reconciler.test.ts`)**:
     - เขียนชุดทดสอบครอบคลุม Drift Detection, Undocumented/Phantom File Classification, Auto-Reconcile และ Fallback

- **Out-of-Scope**:
  - ไม่รวมการ Revert โค้ดของ User อัตโนมัติ (การ Reconcile เป็นเพียงการ Sync เอกสารและแจ้งเตือนเท่านั้น ไม่ทำลายโค้ดจริง)

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: `detectGitDrift` ตรวจพบ Undocumented Files ที่ถูกแก้ไขใน Git แต่ไม่ได้ระบุใน Spec ได้อย่างแม่นยำ
  - [x] **AC-02**: `detectGitDrift` ตรวจพบ Phantom Files ที่ระบุใน Spec แต่ไม่มีการแตะต้องจริงใน Git
  - [x] **AC-03**: `reconcileState` สามารถ Auto-Heal ซิงค์รายการไฟล์ที่เปลี่ยนแปลงจริงเข้าสู่ `current-feature.md` โดยไม่ทำลายข้อมูลเดิม
  - [x] **AC-04**: `nexus-devflow drift` และ `nexus-devflow reconcile` ใช้งานได้ผ่าน CLI พร้อมตัวเลือก `--json`
  - [x] **AC-05**: MCP Tools `devflow_detect_drift` และ `devflow_reconcile_state` ตอบสนองต่อ AI Agents ได้อย่างสมบูรณ์
  - [x] **AC-06**: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` สำเร็จ 0 ข้อผิดพลาด)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/drift-reconciler.ts` (ใหม่: Core Drift Detector, AST Plan Matcher & Self-Healing Sync Engine)
  - `packages/create-nexus-devflow/lib/gatekeeper.ts` (แก้ไข: ผสาน Drift Warning ใน Gatekeeper Report)
  - `packages/create-nexus-devflow/lib/mcp.ts` (แก้ไข: เพิ่ม `devflow_detect_drift` และ `devflow_reconcile_state` Tools)
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` (แก้ไข: เพิ่ม `drift` และ `reconcile` Subcommands)
  - `packages/create-nexus-devflow/test/drift-reconciler.test.ts` (ใหม่: Automated Tests สำหรับ Drift Reconciler)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test` ภายใต้ `packages/create-nexus-devflow/`)
  - Simulated Git Diff Drift Scenarios (สร้างไฟล์ทดสอบที่ไม่ได้ระบุใน Spec และทดสอบการ Reconcile)
  - Full Framework Integrity Check (`npm run check`)

---

## 3. Implementation Checklist (แผนงานทีละขั้นตอน)

- [x] **Task 1: Core Drift Detector Engine (`lib/drift-reconciler.ts`)**
  - พัฒนาฟังก์ชัน `detectGitDrift` และ `parseSpecFilesList` เพื่อเปรียบเทียบ Git Changed Files กับ Spec
  - *Done when*: สามารถจัดกลุ่ม Undocumented Files, Phantom Files, และ Matched Files ได้อย่างถูกต้อง

- [x] **Task 2: Self-Healing State Reconciler (`lib/drift-reconciler.ts`)**
  - พัฒนาฟังก์ชัน `reconcileState` ให้เขียนอัปเดตส่วน `Files to Modify/Create` ใน Living Spec และรักษา `current-stage.md`
  - *Done when*: สามารถอัปเดตไฟล์สเปกได้โดยไม่ทำลายโครงสร้าง Markdown เดิม

- [x] **Task 3: Gatekeeper & MCP Tools Integration (`lib/gatekeeper.ts` & `lib/mcp.ts`)**
  - ผสาน Drift Check เข้าสู่ Gatekeeper Report และเพิ่ม Tools `devflow_detect_drift`, `devflow_reconcile_state` ใน MCP Server
  - *Done when*: MCP Server และ Gatekeeper สามารถรายงานและแก้ไข State Drift ได้

- [x] **Task 4: CLI Subcommands Integration (`bin/create-nexus-devflow.ts`)**
  - เพิ่มคำสั่ง `nexus-devflow drift` และ `nexus-devflow reconcile` เข้าสู่ CLI
  - *Done when*: ผู้ใช้สามารถรันคำสั่งตรวจสอบและซิงค์ Drift ผ่าน Terminal ได้

- [x] **Task 5: Automated Tests & Multi-Lane Verification (`test/drift-reconciler.test.ts`)**
  - เขียน Unit Tests ครอบคลุมทุกฟังก์ชันและการจำลองสถานการณ์ Drift
  - *Done when*: `npm test` และ `npm run check` รันผ่าน 100% (Zero Errors)

---

## 4. Verification Evidence & Quality Gates (บันทึกจากการรัน `/check`)

- **Multi-Lane Verification Matrix**:
  - [x] Lane 1: Typecheck (`npm run typecheck` - 0 errors)
  - [x] Lane 2: Unit Tests (`npm test` - 80/80 test suites passed)
  - [x] Lane 3: Framework Smoke Test (`npm run check` - Clean tarball packaging & overlay smoke test passed)
  - [x] Lane 4: Self-Healing Reconciliation Proof (ทดสอบ `reconcileState` ซิงค์ไฟล์และรักษา Stage สมบูรณ์ 100%)
- **Findings Ledger**: ตรวจสอบ `devflow/context/findings.md` พบ 0 Active Blockers (สะอาด 100%)
