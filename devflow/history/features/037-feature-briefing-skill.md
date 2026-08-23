# 📐 [037-feature-briefing-skill] Feature Briefing & Deep Scope Assessment Skill (`/brief`) (Archived Spec)

> **Status**: Completed & Archived  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/037-feature-briefing-skill`  
> **Completed Date**: 2026-08-22  
> **Owner**: AI Autopilot & Maintainer (Intake from IDEA-011 & DISC-20260822-006)  

---

## 1. Specification & Scope
- **Problem Statement**: ก่อนที่นักพัฒนาจะเริ่มเขียน Spec และพัฒนาฟีเจอร์ใหม่ การทำความเข้าใจขอบเขตงาน, ประเมินไฟล์ที่จะได้รับผลกระทบ, ตรวจสอบ Dependencies, และตัดสินใจว่าควรแบ่งย่อยฟีเจอร์ขนาดใหญ่หรือไม่ เป็นขั้นตอนสำคัญเพื่อป้องกันขอบเขตงานบานปลาย (Scope Creep) DevFlow จึงต้องการทักษะ **`/brief`** ที่ทำหน้าที่เป็น **Deep Static Analysis & Scope Assessment Explainer** แบบ **Read-only 100%**
- **In-Scope**:
  - **ปรับปรุงและยกระดับสคิล `/brief` ใน AI Tool Adapters**:
    - `.agents/skills/brief/SKILL.md` (สำหรับ Antigravity, Codex, Copilot, Cursor)
    - `.claude/skills/brief/SKILL.md` (สำหรับ Claude Code)
    - รองรับการสแกน `devflow/build-plan.md` (Next unchecked item), `devflow/ideas.md`, หรือระบุเจาะจง (`brief 2`, `brief IDEA-003`, `brief "ชื่อ"`)
    - รองรับ Deep Static Analysis: สแกนโค้ดเบสจริงเพื่อคาดการณ์ Files & Modules Touched
    - รองรับ Sub-feature Split Proposal: หากขนาดงานเป็น `L` หรือ `XL` ให้เสนอแนวทางแตกเป็น `4a`, `4b` พร้อมขนาดและลำดับงาน
    - แสดงผลในรูปแบบ Briefing Card: What, Dependencies, Unlocks, Touched Files, Estimated Size, Split Recommendation, Risks & Open Questions
    - คงกฎเหล็ก **Strict Read-Only 100%** (ไม่แก้โค้ด ไม่สร้างไฟล์ ไม่แก้สถานะระหว่างการรัน brief)
  - **อัปเดต Manifests และการตรวจสอบความถูกต้อง**:
    - ตรวจสอบความถูกต้องของสคิลใน `scripts/validate-framework.ts`
    - ตรวจสอบผ่าน `npm run check:static`, `npm test` (42/42) และ `npm run test:package`
- **Out-of-Scope**:
  - การเขียนโค้ด Application หรือสร้างโฟลเดอร์ระหว่างการรัน `/brief` (หน้าที่ของ Brief คือการวิเคราะห์แบบ Read-only เท่านั้น)
- **Acceptance Criteria**:
  - [x] AC-1: มีไฟล์สคิล `/brief` ที่สมบูรณ์ทั้งใน `.agents/skills/brief/SKILL.md` และ `.claude/skills/brief/SKILL.md`
  - [x] AC-2: สคิลรองรับการวิเคราะห์จาก `build-plan.md`, `ideas.md` และการระบุเจาะจง พร้อม Deep Static Codebase Analysis
  - [x] AC-3: สคิลมีกลไกแนะนำการแตก Sub-features (`L`/`XL`) อย่างเป็นระบบ
  - [x] AC-4: ผ่านการตรวจสอบ Framework Integrity (`npm run check:static`), Unit Tests 42/42 tests และ Package Smoke Test 100%

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `.agents/skills/brief/SKILL.md`: สคิล `/brief` สำหรับ Codex/Antigravity/Copilot
  - `.claude/skills/brief/SKILL.md`: สคิล `/brief` สำหรับ Claude Code
- **Test Decision**: `Required (Static & Packaging Tests)`
  - *Rationale*: สคิล `/brief` เป็น AI-facing skill instructions ระดับสถาปัตยกรรม ต้องตรวจสอบ Static Contracts, Frontmatter Schema และ Package Overlay Smoke Tests
- **Impact & Rollback Strategy**:
  - *Impact*: ยกระดับความสามารถในการวิเคราะห์ขอบเขตงานก่อนเริ่มทำ Spec
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: พัฒนาและปรับปรุง `.agents/skills/brief/SKILL.md` สำหรับ Codex, Antigravity, Copilot, Cursor
- [x] Task 2: พัฒนาและปรับปรุง `.claude/skills/brief/SKILL.md` สำหรับ Claude Code
- [x] Task 3: อัปเดต `devflow/ideas.md` ย้าย `[IDEA-011]` เข้าคลัง Archive
- [x] Task 4: ตรวจสอบความถูกต้องด้วย `npm run check:static`
- [x] Task 5: ตรวจสอบ Unit Tests ด้วย `npm test` และ Package Smoke Test ด้วย `npm run test:package`

## 4. Implementation Record
- **สร้างและอัปเดตสคิล `/brief`**:
  - [`.agents/skills/brief/SKILL.md`](file:///d:/devtools/nexus-devflow/.agents/skills/brief/SKILL.md): สคิล Briefing สำหรับ Codex/Antigravity/Copilot/Cursor
  - [`.claude/skills/brief/SKILL.md`](file:///d:/devtools/nexus-devflow/.claude/skills/brief/SKILL.md): สคิล Briefing สำหรับ Claude Code
- **โครงสร้างโปรโตคอล 3 ขั้นตอน (3-Step Protocol)**:
  1. Read Context & Target Resolution (สแกน `build-plan.md` ➔ `ideas.md` ➔ Specific number/name/ID)
  2. Analyze Scope, Dependencies & Sizing (Deep Static Codebase Analysis, Files Touched, Sub-feature split proposal for `L`/`XL`)
  3. Output Structured Briefing Card (What, Dependencies, Unlocks, Files Touched, Estimated Size, Split Proposal, Risks, Next Action)
- **Strict Read-Only Guarantee**:
  - ห้ามแก้ไฟล์, ห้ามเขียน spec, ห้ามสร้าง branch ระหว่างรัน `/brief`

## 5. Verification Evidence

### 🧪 Multi-Lane Verification Matrix

| Lane | การทดสอบ (Verification Lane) | คำสั่ง (Command) | ผลลัพธ์ (Result) | หลักฐาน (Evidence Summary) |
| :--- | :--- | :--- | :--- | :--- |
| **Lane 1** | **Static Contracts & Framework Integrity** | `npm run check:static` | **PASS (0 errors)** | ผ่าน 33 skills validation, manifests และ paths ทั้งหมดสมบูรณ์ |
| **Lane 2** | **Unit Test Suite** | `npm test` (packages/create-nexus-devflow) | **PASS (42/42 tests)** | ผ่านการทดสอบ 100% ครอบคลุมทุก engine และ CLI subcommands |
| **Lane 3** | **Package Smoke & Distribution Test** | `npm run test:package` | **PASS (Clean build & pack)** | Pack tarball สำเร็จ (`144 files`), ติดตั้ง overlay และทดสอบความถูกต้องสำเร็จ |
| **Lane 4** | **Quality Gatekeeper Check** | `nexus-devflow check-gate` | **PASS (Exit code 0)** | ผ่านเงื่อนไข Quality Gatekeeper พร้อมสำหรับการ Commit และ Merge |

## 6. Release & Handoff
- **Summary of Changes**:
  - ยกระดับคำสั่ง `/brief` ให้รองรับ Deep Static Analysis และ Sub-feature Split Proposal (`L`/`XL`)
  - รองรับการดึงข้อมูลจาก `devflow/build-plan.md`, `devflow/ideas.md` และการระบุเจาะจง
- **Next Actions**:
  - ผู้ใช้สามารถเรียก `/brief` ก่อนเริ่มทำฟีเจอร์ใดๆ เพื่อวิเคราะห์ขอบเขตและผลกระทบต่อโค้ดเบสได้อย่างแม่นยำ
