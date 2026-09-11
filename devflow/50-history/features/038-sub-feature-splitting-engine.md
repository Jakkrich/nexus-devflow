# 📐 [038-sub-feature-splitting-engine] Sub-Feature Automatic Splitting Engine & Sizing Heuristic (Archived Spec)

> **Status**: Completed & Archived  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/038-sub-feature-splitting-engine`  
> **Completed Date**: 2026-08-22  
> **Owner**: AI Autopilot & Maintainer (Intake from IDEA-012 & DISC-20260822-007)  

---

## 1. Specification & Scope
- **Problem Statement**: การทำฟีเจอร์ขนาดใหญ่ (`L`/`XL`) ในรันเดียวทำให้ AI เกิด Context Overflow และยากต่อการทำ Code Review / QA ให้รอบคอบ DevFlow จึงต้องการระบบ **Sub-Feature Automatic Splitting Engine** ที่ฝังอยู่ใน `/feature` และ `/brief` เพื่อประเมินขนาดงาน (Multi-Factor Sizing Heuristic) แตกเป็น Sub-features (`4a`, `4b`) ผ่าน Interactive Split Gate และรองรับรหัสประจำรอบแบบ Sub-feature ID (`xxx[a-z]-slug`)
- **In-Scope**:
  - **1. Sub-Feature ID & Branch Contract**:
    - อัปเดต `devflow/reference/running-id-contract.md` เพื่อรับรองมาตรฐาน `xxx[a-z]-slug` และกิ่ง `feature/xxx[a-z]-slug`
  - **2. Feature & Brief Skill Enhancement**:
    - อัปเดต `.agents/skills/feature/SKILL.md` และ `.claude/skills/feature/SKILL.md` ด้วย Multi-Factor Sizing Heuristics และ Interactive Split Gate
    - อัปเดต `.agents/skills/brief/SKILL.md` และ `.claude/skills/brief/SKILL.md` ให้สอดรับกับการวิเคราะห์ Sub-features
  - **3. CLI & History Engine Updates**:
    - ตรวจสอบและอัปเดต Regex Parser ใน `packages/create-nexus-devflow` (`lib/history.ts`, `lib/status.ts`, ฯลฯ) ให้รองรับ Running ID ที่มีตัวอักษรต่อท้าย (`^\d{3}[a-z]?-[a-z0-9-]+$`)
  - **4. Verification & Validation**:
    - ตรวจสอบผ่าน `npm run check:static`, `npm test` (43/43) และ `npm run test:package`
- **Out-of-Scope**:
  - การลบฟีเจอร์เดิมในประวัติ (ทุกฟีเจอร์เดิมยังคงใช้งานได้ตามปกติ)
- **Acceptance Criteria**:
  - [x] AC-1: `running-id-contract.md` ระบุมาตรฐาน `xxx[a-z]-slug` อย่างเป็นทางการ
  - [x] AC-2: สคิล `feature` และ `brief` มี Sizing Heuristics และ Interactive Split Gate พร้อมคำแนะนำการแตกงาน `4a`, `4b`
  - [x] AC-3: `packages/create-nexus-devflow` รองรับการ Parse รหัส Sub-feature ID (`xxx[a-z]-slug`) อย่างสมบูรณ์
  - [x] AC-4: ผ่านการตรวจสอบ Framework Integrity, Unit Tests และ Package Smoke Test 100%

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `devflow/reference/running-id-contract.md`: มาตรฐาน Sub-feature ID
  - `.agents/skills/feature/SKILL.md` & `.claude/skills/feature/SKILL.md`: Sizing & Interactive Split Gate
  - `.agents/skills/brief/SKILL.md` & `.claude/skills/brief/SKILL.md`: Sub-feature Alignment
  - `packages/create-nexus-devflow/test/history.test.ts`: Unit tests สำหรับ Sub-feature IDs
- **Test Decision**: `Required (TDD / Unit Tests & Static Validation)`
  - *Rationale*: การเพิ่มรูปแบบ ID ใหม่ (`xxx[a-z]-slug`) ส่งผลต่อการ parse ประวัติและสถานะ จึงต้องมี unit tests ครอบคลุม
- **Impact & Rollback Strategy**:
  - *Impact*: เพิ่มความยืดหยุ่นในการจัดการงานขนาดใหญ่โดยไม่กระทบฟีเจอร์เดิม
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: อัปเดต `devflow/reference/running-id-contract.md` สำหรับมาตรฐาน Sub-feature ID
- [x] Task 2: อัปเดต Regex และ Logic ใน `packages/create-nexus-devflow/src/lib/history.ts` และ `status.ts`
- [x] Task 3: เพิ่ม Unit Tests ใน `packages/create-nexus-devflow/test/` สำหรับ Sub-feature ID (`xxx[a-z]-slug`)
- [x] Task 4: พัฒนาและอัปเกรด `.agents/skills/feature/SKILL.md` และ `.claude/skills/feature/SKILL.md`
- [x] Task 5: ตรวจสอบความสอดคล้องของ `.agents/skills/brief/SKILL.md` และ `.claude/skills/brief/SKILL.md`
- [x] Task 6: อัปเดต `devflow/ideas.md` ย้าย `[IDEA-012]` เข้าคลัง Archive
- [x] Task 7: ตรวจสอบความถูกต้องด้วย `npm run check:static`, `npm test` และ `npm run test:package`

## 4. Implementation Record
- **อัปเดต Running ID & Workspace Contract**:
  - [`devflow/reference/running-id-contract.md`](file:///d:/devtools/nexus-devflow/devflow/reference/running-id-contract.md): บันทึกมาตรฐาน Sub-Feature ID (`xxx[a-z]-slug`), Git Branch (`feature/xxx[a-z]-slug`), และ Multi-Factor Sizing Heuristic
- **อัปเกรด AI Tool Adapters**:
  - [`.agents/skills/feature/SKILL.md`](file:///d:/devtools/nexus-devflow/.agents/skills/feature/SKILL.md) & [`.claude/skills/feature/SKILL.md`](file:///d:/devtools/nexus-devflow/.claude/skills/feature/SKILL.md): ฝัง Sizing Heuristics และ Interactive Split Gate สำหรับงานขนาดใหญ่ (`L`/`XL`) พร้อมรองรับคำสั่ง `/feature 4a`
- **Unit Testing สำหรับ Sub-feature IDs**:
  - [`packages/create-nexus-devflow/test/history.test.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/test/history.test.ts): เพิ่มชุดทดสอบตรวจสอบการ Parse `038a` และ `038b` พร้อมการเรียงลำดับ (Sorting Order)

## 5. Verification Evidence

### 🧪 Multi-Lane Verification Matrix

| Lane | การทดสอบ (Verification Lane) | คำสั่ง (Command) | ผลลัพธ์ (Result) | หลักฐาน (Evidence Summary) |
| :--- | :--- | :--- | :--- | :--- |
| **Lane 1** | **Static Contracts & Framework Integrity** | `npm run check:static` | **PASS (0 errors)** | ผ่าน 33 skills validation, manifests และ paths ทั้งหมดสมบูรณ์ |
| **Lane 2** | **Unit Test Suite** | `npm test` (packages/create-nexus-devflow) | **PASS (43/43 tests)** | ผ่านการทดสอบ 100% รวมเทสต์ใหม่สำหรับ Sub-feature IDs |
| **Lane 3** | **Package Smoke & Distribution Test** | `npm run test:package` | **PASS (Clean build & pack)** | Pack tarball สำเร็จ (`144 files`), ติดตั้ง overlay และทดสอบความถูกต้องสำเร็จ |
| **Lane 4** | **Quality Gatekeeper Check** | `nexus-devflow check-gate` | **PASS (Exit code 0)** | ผ่านเงื่อนไข Quality Gatekeeper พร้อมสำหรับการ Commit และ Merge |

## 6. Release & Handoff
- **Summary of Changes**:
  - เพิ่มระบบ Multi-Factor Sizing Heuristic และ Interactive Split Gate ในคำสั่ง `/feature` และ `/brief`
  - รองรับ Sub-Feature ID มาตรฐาน `xxx[a-z]-slug` และการแตกงาน `4a`, `4b` ในคิวงาน
- **Next Actions**:
  - ฟีเจอร์ถัดไปใน `ideas.md` คือ `[IDEA-013] Dynamic Project Overview Compiler (/overview)`
