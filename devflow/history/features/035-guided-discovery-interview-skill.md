# 📐 [035-guided-discovery-interview-skill] Guided Project Discovery Interview Skill (`/discovery`) (Archived Spec)

> **Status**: Completed & Archived  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/035-guided-discovery-interview-skill`  
> **Completed Date**: 2026-08-22  
> **Git Commit**: `c629a13`  
> **Owner**: AI & Maintainer (Intake from IDEA-009 & DISC-20260822-004)  

---

## 1. Specification & Scope
- **Problem Statement**: ผู้ใช้งานที่เริ่มต้นโปรเจกต์ใหม่จากศูนย์ หรือต้องการวางแผนสถาปัตยกรรมและ Roadmap ระยะยาว ต้องการผู้ช่วยในการสัมภาษณ์เชิงรุกแบบหลายรอบ (Multi-turn Interactive Discovery) เพื่อตกผลึกแนวคิด ช่วยเลือกเทคโนโลยี กำหนดขอบเขต และแบ่ง Phase งานลงใน User-Owned Planning Documents (`devflow/project-plan.md` และ `devflow/build-plan.md`) ก่อนส่งต่อให้ `/overview`
- **In-Scope**:
  - **สร้างทักษะ `/discovery` ใน AI Tool Adapters**:
    - `.agents/skills/discovery/SKILL.md` (สำหรับ Antigravity, Codex, Copilot, Cursor)
    - `.claude/skills/discovery/SKILL.md` (สำหรับ Claude Code)
    - รองรับกระบวนการสัมภาษณ์ 4 เสาหลัก:
      1. Vision, Problem & User Persona
      2. Architecture, Tech Stack & Data Models
      3. Constraints & Non-Goals
      4. Phased Roadmap with Feature Sizing (`XS`..`XL`) & Dependencies
    - มี Confirmation Gate: นำเสนอร่างแผนงานให้ผู้ใช้ตรวจทานและยืนยันก่อนเขียนไฟล์ลงดิสก์จริง
    - เขียนผลลัพธ์ลง `devflow/project-plan.md` และ `devflow/build-plan.md` พร้อมแนะนำให้รัน `/overview` ต่อทันที
  - **อัปเดต Framework Validation**:
    - ตรวจสอบความถูกต้องของสคิลใน `scripts/validate-framework.ts`
  - **Unit Tests & Packaging**:
    - ทดสอบความสมบูรณ์ของ Framework (`npm run check:static`), Unit Tests (`npm test`), และ Package Smoke Test (`npm run test:package`)
- **Out-of-Scope**:
  - การเขียนโค้ด Application โดยตรงระหว่างรัน `/discovery` (หน้าที่ของ Discovery คือการวางแผนงานและสถาปัตยกรรมเท่านั้น)
- **Acceptance Criteria**:
  - [x] AC-1: มีไฟล์สคิล `/discovery` ที่สมบูรณ์ทั้งใน `.agents/skills/discovery/SKILL.md` และ `.claude/skills/discovery/SKILL.md`
  - [x] AC-2: สคิลมีคำแนะนำระเบียบวิธีสัมภาษณ์แบบ Adaptive Multi-Turn และมี Confirmation Gate ชัดเจน
  - [x] AC-3: ตรวจสอบความสมบูรณ์ของ Framework ผ่าน `npm run check:static` (0 errors)
  - [x] AC-4: ชุดทดสอบทั้งหมด 42/42 tests ผ่าน และ Package Smoke Test ผ่าน 100%

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `.agents/skills/discovery/SKILL.md`: สคิล `/discovery` สำหรับ Codex/Antigravity/Copilot
  - `.claude/skills/discovery/SKILL.md`: สคิล `/discovery` สำหรับ Claude Code
- **Test Decision**: `Required (Static & Packaging Tests)`
  - *Rationale*: สคิล `/discovery` เป็น AI-facing skill instructions ระดับสถาปัตยกรรม ต้องตรวจสอบ Static Contracts, Frontmatter Schema และ Package Overlay Smoke Tests
- **Impact & Rollback Strategy**:
  - *Impact*: เพิ่มความสามารถในการช่วยวางแผนโปรเจกต์ใหม่ ไม่กระทบระบบเดิม
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: สร้างและปรับแต่ง `.agents/skills/discovery/SKILL.md` สำหรับ Codex, Antigravity, Copilot, Cursor
- [x] Task 2: สร้างและปรับแต่ง `.claude/skills/discovery/SKILL.md` สำหรับ Claude Code
- [x] Task 3: ตรวจสอบ Framework Integrity ด้วย `npm run check:static`
- [x] Task 4: ตรวจสอบ Unit Tests ด้วย `npm test` และ Package Smoke Test ด้วย `npm run test:package`

## 4. Implementation Record
- **สร้างไฟล์ Skill Discovery**:
  - [`.agents/skills/discovery/SKILL.md`](file:///d:/devtools/nexus-devflow/.agents/skills/discovery/SKILL.md): สคิล Multi-turn Project Discovery Interview สำหรับ Codex, Antigravity, Copilot, Cursor
  - [`.claude/skills/discovery/SKILL.md`](file:///d:/devtools/nexus-devflow/.claude/skills/discovery/SKILL.md): สคิล Discovery สำหรับ Claude Code
- **โครงสร้างกระบวนการสัมภาษณ์ 4 เสาหลัก**:
  1. Product Vision, Problem Statement, User Persona & Success Metric
  2. Technical Architecture, Tech Stack, Data Layer, Auth & APIs
  3. Scope Boundaries, Constraints & Explicit Non-Goals
  4. Phased Sequential Roadmap, Feature Sizing (`XS`..`XL`) & Dependencies
- **Confirmation Gate & Handoff**:
  - นำเสนอร่างแผนงานในแชตและขออนุมัติก่อนเขียนลง `devflow/project-plan.md` และ `devflow/build-plan.md`
  - นำทางให้ผู้ใช้รัน `/overview` ต่อเพื่อกลั่นกรองแผนงานลง `devflow/context/project-overview.md`

## 5. Verification Evidence

### 🧪 Multi-Lane Verification Matrix

| Lane | การทดสอบ (Verification Lane) | คำสั่ง (Command) | ผลลัพธ์ (Result) | หลักฐาน (Evidence Summary) |
| :--- | :--- | :--- | :--- | :--- |
| **Lane 1** | **Static Contracts & Framework Integrity** | `npm run check:static` | **PASS (0 errors)** | ผ่าน 32 skills validation, manifests และ paths ทั้งหมดสมบูรณ์ |
| **Lane 2** | **Unit Test Suite** | `npm test` (packages/create-nexus-devflow) | **PASS (42/42 tests)** | ผ่านการทดสอบ 100% ครอบคลุมทุก engine และ CLI subcommands |
| **Lane 3** | **Package Smoke & Distribution Test** | `npm run test:package` | **PASS (Clean build & pack)** | Pack tarball สำเร็จ (`142 files`), ติดตั้ง overlay และทดสอบความถูกต้องสำเร็จ |
| **Lane 4** | **Quality Gatekeeper Check** | `nexus-devflow check-gate` | **PASS (Exit code 0)** | ผ่านเงื่อนไข Quality Gatekeeper พร้อมสำหรับการ Commit และ Merge |

## 6. Release & Handoff
- **Summary of Changes**:
  - เพิ่มสคิล `/discovery` เพื่อเป็นผู้ช่วยสัมภาษณ์และวางแผนระดับสถาปัตยกรรมและ Roadmap แบบหลายรอบ (Multi-turn)
  - รองรับการเขียน User-Owned Planning Documents ทั้ง `devflow/project-plan.md` และ `devflow/build-plan.md`
  - ซิงก์โฟลเดอร์สเตจ 00 เป็น `00-explore` ครบทั้ง `.agents/` และ `.claude/`
- **Next Actions**:
  - เมื่อเริ่มโปรเจกต์ใหม่ สามารถเรียก `/discovery` เพื่อวางแผน หรือเขียน `project-plan.md` / `build-plan.md` โดยตรง แล้วรัน `/overview` ต่อได้ทันที
