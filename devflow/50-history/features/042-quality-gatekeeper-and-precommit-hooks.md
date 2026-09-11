# 📐 [042-quality-gatekeeper-and-precommit-hooks] Automated Quality Gatekeeper & Pre-commit Hook Integration

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Source**: `[IDEA-002]` & `devflow/build-plan.md: Feature 1`  
> **Branch**: `feature/042-quality-gatekeeper-and-precommit-hooks`  
> **Completed Date**: 2026-08-23  

---

## 1. Specification & Scope

- **Problem Statement**:
  ปัจจุบัน DevFlow มีการกำหนดกติกาการตรวจสอบคุณภาพ (Quality Gates) และการบันทึก Findings ในระดับ Prompt (Soft Enforcement) แต่หากนักพัฒนาหรือ AI Agent ละเลยการรันคำสั่ง `/check` หรือแอบ Commit โค้ดที่มี Uncompleted Tasks หรือมีข้อบกพร่องระดับ `P0/P1 Blocker` ค้างอยู่ โค้ดที่ไม่ผ่านเกณฑ์จะสามารถหลุดรอดเข้าไปใน Git Repository ได้ ระบบจึงต้องการ **Hard Enforcement Layer** ผ่าน CLI `nexus-devflow check-gate` และ Git Pre-commit Hooks รวมถึง CI/CD Workflow Template เพื่อสกัดกั้นโค้ดที่ไม่สมบูรณ์อย่างเด็ดขาด

- **In-Scope**:
  1. **Enhanced Gatekeeper Engine (`gatekeeper.ts`)**:
     - ตรวจสอบ Active Findings Blockers (`P0` และ `P1` ในสถานะ `open` หรือ `fixed`)
     - ตรวจสอบ Uncompleted Tasks (`- [ ]`) ใน Living Spec (`current-feature.md` หรือ `current-run/`)
     - รองรับโหมด `--strict` เพื่อตรวจสอบว่า Living Spec ผ่านการ Verify ด้วย `/check` แล้ว
     - เพิ่มตัวเลือก `--run-checks` สำหรับสั่งรัน verification commands (เช่น `npm test` หรือ typecheck) ร่วมด้วย
  2. **Cross-Platform Git Hooks Engine (`git-hooks.ts`)**:
     - ปรับปรุงการสร้าง Hook Script สำหรับ `pre-commit` และ `pre-push` ให้ทำงานได้อย่างราบรื่นทั้งบน Windows (Git Bash / PowerShell / cmd), macOS และ Linux
     - รองรับการติดตั้งแบบ idempotency และการถอนการติดตั้งที่ปลอดภัย (`nexus-devflow hook install` และ `uninstall`)
  3. **CLI Subcommand & Help Catalog (`create-nexus-devflow.ts`)**:
     - เพิ่มและปรับปรุงคำสั่ง `nexus-devflow check-gate` และ `nexus-devflow hook [install|uninstall]` ใน Command Catalog
     - รองรับ Flag `--strict`, `--json`, `--no-color`
  4. **GitHub Actions CI Workflow Template (`.github/workflows/devflow-gate.yml`)**:
     - จัดทำ CI Workflow Template ตัวอย่างที่รัน `npx nexus-devflow check-gate --strict` ใน Pull Requests
  5. **Automated Unit & Contract Tests**:
     - เพิ่มชุดทดสอบใน `test/gatekeeper.test.ts` และ `test/git-hooks.test.ts` ครอบคลุมทุกเงื่อนไขทั้ง Pass, Blocker Fail, Strict Mode, Hook Installation / Uninstallation

- **Out-of-Scope**:
  - ไม่รวมการเชื่อมต่อกับ Model Context Protocol (จัดอยู่ใน Feature 2: `IDEA-004`)
  - ไม่ดัดแปลงไฟล์ `.git` ในระดับลึกเกินกว่าไดเรกทอรี `.git/hooks/`

- **Acceptance Criteria (เกณฑ์การยอมรับ)**:
  - [x] **AC-01**: `nexus-devflow check-gate` บล็อก (Exit Code 1) ทันทีเมื่อมี P0/P1 Finding หรือ Unchecked Task ใน Living Spec
  - [x] **AC-02**: ในโหมด `--strict` ระบบจะบล็อกเมื่อ Living Spec ยังไม่ผ่านการ Verify (`needs_verification` หรือ `blocked`)
  - [x] **AC-03**: `nexus-devflow hook install --type pre-commit` ติดตั้ง Hook script ลงใน `.git/hooks/pre-commit` สำเร็จและมีสิทธิ์ Execute
  - [x] **AC-04**: `nexus-devflow hook uninstall` ลบเฉพาะ DevFlow Hook Script โดยไม่กระทบ Hook อื่นของผู้ใช้
  - [x] **AC-05**: ชุดทดสอบทั้งหมด 100% ผ่าน (`npm test` และ `npm run check` สำเร็จ 0 ข้อผิดพลาด)

---

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `packages/create-nexus-devflow/lib/gatekeeper.ts` (ปรับปรุง Gate Evaluation และ Reporting)
  - `packages/create-nexus-devflow/lib/git-hooks.ts` (ปรับปรุง Hook Script Template & Execution Handler)
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` (ตรวจสอบและขยาย Subcommands `check-gate` และ `hook`)
  - `.github/workflows/devflow-gate.yml` (CI Workflow template)
  - `packages/create-nexus-devflow/test/gatekeeper.test.ts` (เพิ่ม Unit Tests)
  - `packages/create-nexus-devflow/test/git-hooks.test.ts` (เพิ่ม Unit Tests)

- **Test Decision**:
  - Node.js Native Test Runner (`npm test` ภายใต้ `packages/create-nexus-devflow/`)
  - Static Contract Check (`npm run check:static`)
  - Package Smoke Test (`npm run check`)

---

## 3. Implementation Checklist (แผนงานทีละขั้นตอน)

- [x] **Task 1: Core Gatekeeper Hardening (`lib/gatekeeper.ts`)**
  - ปรับปรุง `evaluateGate` และ `formatGateReport` ให้รายงานผลละเอียด รองรับ JSON payload, Advisory Warnings และตรวจสอบครบทุกประเภท Blocker
  - *Done when*: `evaluateGate` คืนค่าผลการตรวจสอบที่แม่นยำ พร้อม Violations list และ Suggestions ชัดเจน

- [x] **Task 2: Robust Git Hooks Manager (`lib/git-hooks.ts`)**
  - พัฒนาฟังก์ชัน `installGitHook` และ `uninstallGitHooks` ให้รองรับการสร้าง Hook Script ข้ามแพลตฟอร์ม และรองรับ Git Worktrees
  - *Done when*: ติดตั้งและถอนการติดตั้ง Hook ใน Directory ทดสอบได้โดยไม่เกิด Error

- [x] **Task 3: CLI Subcommand Integration (`bin/create-nexus-devflow.ts` & `command-catalog.ts`)**
  - เชื่อมต่อ Subcommand `check-gate` และ `hook install/uninstall` เข้ากับ CLI help และ Argument parser
  - *Done when*: สั่งรัน `nexus-devflow check-gate` และ `nexus-devflow hook install` ผ่าน Terminal ได้อย่างถูกต้อง

- [x] **Task 4: GitHub Actions CI Template (`.github/workflows/devflow-gate.yml`)**
  - สร้าง CI Workflow ตัวอย่างสำหรับตรวจสอบ Pull Request ด้วย `check-gate --strict`
  - *Done when*: ไฟล์ Workflow ถูกรวมอยู่ใน Template Package อย่างถูกต้อง

- [x] **Task 5: Automated Tests & Multi-Lane Verification (`test/*.test.ts`)**
  - เขียน Unit Tests ครอบคลุม `gatekeeper.ts` และ `git-hooks.ts` ใน `test/`
  - *Done when*: `npm test` (62/62 tests) และ `npm run check` รันผ่าน 100% (Zero Errors)

---

## 4. Verification Evidence & Quality Gates (บันทึกจากการรัน `/check`)

- **Multi-Lane Verification Matrix**:
  - [x] Lane 1: Typecheck (`npm run typecheck` - 0 errors)
  - [x] Lane 2: Unit Tests (`npm test` - 62/62 test suites passed)
  - [x] Lane 3: Framework Smoke Test (`npm run check` - Clean tarball packaging & overlay smoke test passed)
  - [x] Lane 4: Empirical CLI Simulation (ทดสอบรัน `check-gate` และ `hook install/uninstall` ผ่าน Node runtime)
- **Findings Ledger**: ตรวจสอบ `devflow/context/findings.md` พบ 0 Active Blockers (สะอาด 100%)
