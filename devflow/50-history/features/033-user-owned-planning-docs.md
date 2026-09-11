# 📐 [033-user-owned-planning-docs] Support Two User-Owned Planning Documents (`project-plan.md` & `build-plan.md`) (Living Spec)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/033-user-owned-planning-docs`  
> **Created Date**: 2026-08-22  
> **Completed Date**: 2026-08-22  
> **Owner**: AI & Maintainer (Intake from IDEA-007)  

---

## 1. Specification & Scope
- **Problem Statement**: ในโปรเจกต์ขนาดใหญ่หรือโครงการระยะยาว ผู้ใช้จำเป็นต้องมีเอกสารวางแผนที่ผู้ใช้เป็นเจ้าของ (User-Owned Planning Documents) เพื่อกำหนดวิสัยทัศน์ สถาปัตยกรรม (`project-plan.md`) และคิวลำดับการสร้างฟีเจอร์ (`build-plan.md`) ที่ชัดเจน เพื่อให้ AI Agents สามารถกลั่นกรอง (distill) ลงใน `devflow/context/project-overview.md` และใช้ทักษะ `/brief`, `/feature` ในการหยิบฟีเจอร์ถัดไปมาทำได้อย่างเป็นระเบียบ
- **In-Scope**:
  - **สร้างไฟล์เทมเพลตแผนงาน 2 ฉบับ**:
    - `devflow/project-plan.md`: เทมเพลตวิสัยทัศน์โครงการ สถาปัตยกรรม Stack กฎเกณฑ์ และ Constraints
    - `devflow/build-plan.md`: เทมเพลตคิวสร้างฟีเจอร์แบบ Checkbox list พร้อมระบุ Dependencies และขนาดงาน
  - **บูรณาการเข้าสู่ทักษะ AI (Skills)**:
    - ปรับปรุง `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md` ให้รองรับการอ่าน `project-plan.md` + `build-plan.md` ในโฟลเดอร์ `devflow/` เพื่อคอมไพล์ลงใน `devflow/context/project-overview.md`
    - ปรับปรุง `.agents/skills/brief/SKILL.md` และ `.claude/skills/brief/SKILL.md` ให้สามารถอ่านและสรุปคิวงานจาก `build-plan.md`
    - ปรับปรุง `.agents/skills/feature/SKILL.md` และ `.claude/skills/feature/SKILL.md` ให้หยิบงานจาก `build-plan.md` (หรือ `ideas.md`)
  - **การตรวจเช็กใน Doctor (`lib/doctor.ts`)**:
    - เพิ่มการตรวจสอบความสมบูรณ์ของ Planning Documents ในคำสั่ง `nexus-devflow doctor` และ auto-heal สร้างเทมเพลตตั้งต้นเมื่อรัน `--fix`
  - **Unit Tests**:
    - เขียนชุดทดสอบใน `test/doctor.test.ts` เพื่อรับรองการตรวจจับไฟล์แผนงาน
- **Out-of-Scope**:
  - การบังคับให้ทุกโปรเจกต์ต้องมีไฟล์แผนงาน (ยังคงรองรับโหมด Lightweight ที่ใช้เฉพาะ `ideas.md` ได้อย่างยืดหยุ่น)
- **Acceptance Criteria**:
  - [x] AC-1: มีไฟล์เทมเพลต `devflow/project-plan.md` และ `devflow/build-plan.md` พร้อมตัวอย่างโครงสร้างที่ชัดเจน
  - [x] AC-2: ทักษะ `/overview`, `/brief`, `/feature` ได้รับการอัปเดตให้รองรับ `devflow/project-plan.md` และ `devflow/build-plan.md`
  - [x] AC-3: คำสั่ง `nexus-devflow doctor` ตรวจสอบสถานะของ Planning Documents และสามารถ auto-heal (`--fix`) ได้
  - [x] AC-4: ชุดทดสอบทั้งหมดใน `packages/create-nexus-devflow` ผ่าน 100% และ `npm run check:static` ผ่าน 0 errors

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `devflow/project-plan.md`: เอกสารเทมเพลต Project Plan
  - `devflow/build-plan.md`: เอกสารเทมเพลต Build Plan
  - `packages/create-nexus-devflow/lib/doctor.ts`: เพิ่ม Health Check ตรวจสอบ Planning Documents
  - `.agents/skills/overview/SKILL.md`, `.claude/skills/overview/SKILL.md`: อัปเดตการ compile แผนงาน
  - `.agents/skills/brief/SKILL.md`, `.claude/skills/brief/SKILL.md`: อัปเดตการอ่านคิวฟีเจอร์
  - `.agents/skills/feature/SKILL.md`, `.claude/skills/feature/SKILL.md`: อัปเดตการเลือกฟีเจอร์จากแผนงาน
  - `packages/create-nexus-devflow/test/doctor.test.ts`: เพิ่ม Test case สำหรับ Planning Docs
- **Test Decision**: `Required (TDD)`
  - *Rationale*: รับประกันว่าสคิลและการตรวจสอบ Doctor สามารถทำงานร่วมกับทั้งโปรเจกต์ที่มีและไม่มีไฟล์แผนงานได้อย่างถูกต้อง
- **Impact & Rollback Strategy**:
  - *Impact*: เพิ่มความสามารถในการวางแผนระยะยาวโดยไม่กระทบโครงสร้าง Fast-Track เดิม
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: สร้างเทมเพลต `devflow/project-plan.md` และ `devflow/build-plan.md` พร้อมตัวอย่างโครงสร้างมาตรฐาน
- [x] Task 2: อัปเดต Skills (`overview`, `brief`, `feature`) ให้รองรับ `devflow/project-plan.md` และ `devflow/build-plan.md` ทั้งใน `.agents/` และ `.claude/`
- [x] Task 3: อัปเดต `packages/create-nexus-devflow/lib/doctor.ts` ให้มี Health Check และ auto-heal สำหรับ Planning Documents
- [x] Task 4: เขียนและอัปเดต Unit Tests ใน `test/doctor.test.ts`
- [x] Task 5: ตรวจสอบความถูกต้องด้วย `npm test`, `npm run check:static` และ `npm run test:package`

## 4. Implementation Record
- **User Planning Documents**:
  - สร้าง `devflow/project-plan.md` เป็น User-owned architecture, product vision, constraints และ milestone roadmap
  - สร้าง `devflow/build-plan.md` เป็น User-owned phased sequential feature queue พร้อม sizing และ dependencies
- **AI Skill Integration**:
  - อัปเดต `overview` ใน `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md` ให้อ่านและกลั่นกรองแผนงานลงใน `devflow/context/project-overview.md`
  - อัปเดต `brief` ใน `.agents/skills/brief/SKILL.md` และ `.claude/skills/brief/SKILL.md` ให้อ่านคิวงานถัดไปจาก `devflow/build-plan.md`
  - อัปเดต `feature` ใน `.agents/skills/feature/SKILL.md` และ `.claude/skills/feature/SKILL.md` ให้หยิบงาน unchecked จาก `devflow/build-plan.md` อัตโนมัติเมื่อไม่ระบุ argument
- **Doctor Health Check & Auto-heal**:
  - อัปเดต `packages/create-nexus-devflow/lib/doctor.ts` เพิ่ม Check 5: Planning Documents พร้อมรองรับ `--fix` เพื่อสร้างเทมเพลตเริ่มต้น
- **Unit Tests**:
  - อัปเดต `packages/create-nexus-devflow/test/doctor.test.ts` เพื่อทดสอบการตรวจและกู้คืนไฟล์ Planning Documents (ผลการทดสอบ: **40/40 tests PASS 100%**)

## 5. Verification Evidence
- **Lane 1: Static Contract Validation (`npm run check:static`)**:
  - ผลการรัน: **PASSED (0 errors)**
  - ยืนยันโครงสร้าง Framework, Adapters (30 skills), Schemas, Manifests และ Workflows ตรงตามมาตรฐาน
- **Lane 2: Unit Test Suite (`npm test`)**:
  - ผลการรัน: **40/40 tests PASSED (100%)**
  - ครอบคลุม: Doctor health checks, Planning documents auto-heal, Gatekeeper checks, Git hooks, status parsing, ideas, findings, history
- **Lane 3: Package Smoke Test (`npm run test:package`)**:
  - ผลการรัน: **PASSED (100%)**
  - รวมไฟล์เทมเพลต `project-plan.md` และ `build-plan.md` ลงใน template tarball และทดสอบ overlay ใน Sandbox Temp Directory สำเร็จ
- **Lane 4: Live CLI Verification**:
  - `nexus-devflow doctor` ➔ 13/13 Checks Passed (0 warnings, 0 failed, Planning Documents detected)
  - `nexus-devflow check-gate` ➔ Quality Gate Passed (Exit Code 0)

## 6. Release & Handoff
- **Summary of Delivered Changes**:
  - เพิ่มการรองรับเอกสารวางแผนที่ผู้ใช้เป็นเจ้าของ 2 ฉบับ (`devflow/project-plan.md` และ `devflow/build-plan.md`)
  - อัปเดตทักษะ `/overview`, `/brief`, `/feature` ทั้ง `.agents/` และ `.claude/`
  - เพิ่ม Check และ Auto-heal ใน `nexus-devflow doctor`
  - อัปเดตชุดทดสอบ `test/doctor.test.ts`
- **Delivered Files**:
  - `devflow/project-plan.md`
  - `devflow/build-plan.md`
  - `.agents/skills/overview/SKILL.md`
  - `.agents/skills/brief/SKILL.md`
  - `.agents/skills/feature/SKILL.md`
  - `.claude/skills/overview/SKILL.md`
  - `.claude/skills/brief/SKILL.md`
  - `.claude/skills/feature/SKILL.md`
  - `packages/create-nexus-devflow/lib/doctor.ts`
  - `packages/create-nexus-devflow/test/doctor.test.ts`
- **Suggested Git Commit**:
  ```bash
  git commit -m "feat(planning): support user-owned planning docs project-plan.md and build-plan.md (033-user-owned-planning-docs)"
  ```
