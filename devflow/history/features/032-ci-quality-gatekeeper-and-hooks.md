# 📐 [032-ci-quality-gatekeeper-and-hooks] CI/CD Quality Gatekeeper & Git Hooks (nexus-devflow check-gate & hook) (Living Spec)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/032-ci-quality-gatekeeper-and-hooks`  
> **Created Date**: 2026-08-22  
> **Completed Date**: 2026-08-22  
> **Owner**: AI & Maintainer (Intake from IDEA-002)  

---

## 1. Specification & Scope
- **Problem Statement**: ในการทำงานเป็นทีมหรือในระบบ CI/CD (GitHub Actions / GitLab CI) จำเป็นต้องมีกลไกตรวจสอบคุณภาพแบบอัตโนมัติ (Automated Gatekeeper) เพื่อบล็อกการ Merge Pull Request หรือบล็อกการ Commit/Push หากใน Workspace ยังมีข้อบกพร่องระดับวิกฤต (P0/P1 Blockers) หรือ Checklist ของฟีเจอร์ยังไม่ผ่านการ Verification เพื่อป้องกันข้อผิดพลาดหลุดเข้าสู่ Main Branch
- **In-Scope**:
  - **Subcommand `check-gate`**:
    - `nexus-devflow check-gate [--strict] [--allow-unverified] [--json]`: ตรวจสอบสถานะความพร้อมของการส่งมอบ โดยจะคืนค่า Exit code `0` เมื่อพร้อม หรือ `1` เมื่อถูกบล็อก
    - ตรวจจับเงื่อนไข:
      1. มี P0 หรือ P1 Finding ที่ยังอยู่ในสถานะ `open` หรือ `fixed` (ยังไม่ verify)
      2. มี Living Spec ที่ Tasks checklist ยังไม่เสร็จ (`uncompleted steps`)
      3. โหมด `--strict`: บล็อกหากอยู่ในสถานะ `needs_verification` (ต้องผ่าน `/check` ก่อน)
    - แสดงข้อความรายงานสรุป Gatekeeper Summary ชัดเจนใน Terminal พร้อมคำแนะนำแก้ไข
  - **Subcommand `hook`**:
    - `nexus-devflow hook install [pre-commit|pre-push]`: ติดตั้ง Git hook script ลงใน `.git/hooks/pre-commit` หรือ `.git/hooks/pre-push` อัตโนมัติ เพื่อรัน `nexus-devflow check-gate` ก่อนทำ git commit หรือ git push
    - `nexus-devflow hook uninstall`: ถอนการติดตั้ง DevFlow Git hooks
  - **Unit Tests & CLI Integration**:
    - เขียนชุดทดสอบสำหรับ `check-gate` และ `hook install`
    - อัปเดต CLI Help และ Types
- **Out-of-Scope**:
  - การแก้ไขการตั้งค่า Branch Protection / Ruleset บน GitHub Cloud Server โดยตรง
- **Acceptance Criteria**:
  - [x] AC-1: คำสั่ง `nexus-devflow check-gate` สามารถตรวจจับ P0/P1 Blockers และ Uncompleted tasks พร้อมคืนค่า Exit code `1` เมื่อมี Blocker และ `0` เมื่อผ่าน
  - [x] AC-2: คำสั่ง `nexus-devflow check-gate --strict` สามารถบล็อกหากสถานะอยู่ใน `needs_verification` ได้ถูกต้อง
  - [x] AC-3: คำสั่ง `nexus-devflow hook install` สามารถสร้าง executable git hook ใน `.git/hooks/` และ `hook uninstall` สามารถลบออกได้
  - [x] AC-4: ยูนิตเทสต์ทั้งหมดใน `packages/create-nexus-devflow` ผ่าน 100% และ `npm run check:static` ผ่าน 0 errors

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `packages/create-nexus-devflow/lib/gatekeeper.ts`: สร้างโมดูลวิเคราะห์ Quality Gatekeeper
  - `packages/create-nexus-devflow/lib/git-hooks.ts`: สร้างโมดูลจัดการ Git Pre-commit / Pre-push Hooks
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`: เพิ่ม Subcommands `check-gate` และ `hook`
  - `packages/create-nexus-devflow/test/gatekeeper.test.ts`: เขียนยูนิตเทสต์สำหรับ Gatekeeper
  - `packages/create-nexus-devflow/test/git-hooks.test.ts`: เขียนยูนิตเทสต์สำหรับ Hook Installer
- **Test Decision**: `Required (TDD)`
  - *Rationale*: Quality Gatekeeper เป็นโมดูลควบคุมความปลอดภัยของ Pipeline ต้องรับประกันว่าไม่มี false positive หรือ false negative
  - *Planned Cases*:
    - Gatekeeper returns exit code 1 on active P0/P1 blocker
    - Gatekeeper returns exit code 1 on incomplete checklist steps
    - Gatekeeper returns exit code 0 when workspace is clean or ready
    - Hook installer creates valid executable hook files and removes cleanly
- **Impact & Rollback Strategy**:
  - *Impact*: เพิ่ม Subcommands ใหม่โดยไม่กระทบฟังก์ชันเดิม
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: สร้างโมดูล `lib/gatekeeper.ts` วิเคราะห์กฎเกณฑ์และคืนค่าผลลัพธ์ Gatekeeper (`evaluateGate`, `formatGateReport`)
- [x] Task 2: สร้างโมดูล `lib/git-hooks.ts` จัดการติดตั้งและถอน Git Hooks (`installGitHook`, `uninstallGitHooks`)
- [x] Task 3: เชื่อมต่อ Subcommands `check-gate` และ `hook` เข้าสู่ `bin/create-nexus-devflow.ts`
- [x] Task 4: เขียน Unit Tests ครอบคลุม Gatekeeper และ Git Hooks ใน `test/gatekeeper.test.ts` และ `test/git-hooks.test.ts`
- [x] Task 5: รันการตรวจสอบความถูกต้องด้วย `npm run check:static` และ `npm run test:package`

## 4. Implementation Record
- **Gatekeeper Engine (`lib/gatekeeper.ts`)**:
  - พัฒนาฟังก์ชัน `evaluateGate` ประเมินความพร้อมของ Workspace ต่อ Quality Gates: ตรวจจับ P0/P1 active findings blockers, uncompleted living spec tasks, และ strict verification mode.
  - พัฒนาฟังก์ชัน `formatGateReport` แสดงผลลัพธ์ ANSI / Plain text อย่างสวยงาม ชัดเจน พร้อมแนะนำขั้นตอนถัดไป
- **Git Hooks Manager (`lib/git-hooks.ts`)**:
  - พัฒนาฟังก์ชัน `installGitHook` สร้าง shell script ใน `.git/hooks/pre-commit` หรือ `pre-push` ด้วย permissions `0o755`
  - พัฒนาฟังก์ชัน `uninstallGitHooks` ทำความสะอาดเฉพาะ Git hooks ของ DevFlow ได้อย่างปลอดภัย
- **CLI Subcommands (`bin/create-nexus-devflow.ts`)**:
  - เพิ่มการรองรับคำสั่ง `check-gate` (รองรับ `--strict`, `--json`) และ `hook` (`install`, `uninstall`)
  - คืนค่า Process Exit Code `0` หรือ `1` ตรงตามมาตรฐาน CI/CD
- **Unit Test Suites**:
  - สร้าง `test/gatekeeper.test.ts` (3 test suites)
  - สร้าง `test/git-hooks.test.ts` (1 comprehensive test suite)
  - อัปเดต `test/status.test.ts` เพิ่มการทดสอบ argument parsing ของคำสั่งใหม่
  - ผลการทดสอบ: **40/40 tests PASS (100%)**

## 5. Verification Evidence
- **Lane 1: Static Contract Validation (`npm run check:static`)**:
  - ผลการรัน: **PASSED (0 errors)**
  - ยืนยันโครงสร้าง Framework, Adapters (30 skills), Schemas, Manifests และ Workflows ตรงตามมาตรฐาน
- **Lane 2: Unit Test Suite (`npm test`)**:
  - ผลการรัน: **40/40 tests PASSED (100%)**
  - ครอบคลุม: Gatekeeper checks, strict mode, Git hooks install/uninstall, status parsing, ideas, findings, doctor, history
- **Lane 3: Package Smoke Test (`npm run test:package`)**:
  - ผลการรัน: **PASSED (100%)**
  - สร้าง tarball `jakkrichm-create-nexus-devflow-2.0.25.tgz` และทดสอบ overlay ใน Sandbox Temp Directory สำเร็จ
- **Lane 4: Live Subcommand CLI Proof**:
  - `check-gate` ➔ Exit Code `0` (Passed in standard mode)
  - `check-gate --strict` ➔ Exit Code `1` (Correctly blocked unverified in-progress spec)
  - `check-gate --json` ➔ Output valid JSON schema
  - `hook install pre-commit` ➔ Successfully wrote `.git/hooks/pre-commit`
  - `hook uninstall` ➔ Cleaned `.git/hooks/` safely

## 6. Release & Handoff
- **Summary of Delivered Changes**:
  - เพิ่ม Subcommands `check-gate` และ `hook` (install/uninstall) ใน CLI สำหรับระบบ CI/CD และ Local Git Hooks
  - เพิ่มโมดูล `lib/gatekeeper.ts` และ `lib/git-hooks.ts`
  - เพิ่มชุดทดสอบ `test/gatekeeper.test.ts`, `test/git-hooks.test.ts`
- **Delivered Files**:
  - `packages/create-nexus-devflow/lib/gatekeeper.ts`
  - `packages/create-nexus-devflow/lib/git-hooks.ts`
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`
  - `packages/create-nexus-devflow/test/gatekeeper.test.ts`
  - `packages/create-nexus-devflow/test/git-hooks.test.ts`
  - `packages/create-nexus-devflow/test/status.test.ts`
- **Suggested Git Commit**:
  ```bash
  git commit -m "feat(cli): add CI/CD quality gatekeeper check and git hooks management (032-ci-quality-gatekeeper-and-hooks)"
  ```
