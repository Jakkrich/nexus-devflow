# 📐 [034-code-and-security-audit-skill] Dedicated Code, Security & Quality Audit Skill (`/audit`) (Living Spec)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `feature/034-code-and-security-audit-skill`  
> **Created Date**: 2026-08-22  
> **Completed Date**: 2026-08-22  
> **Owner**: AI & Maintainer (Intake from IDEA-008 & DISC-20260822-003)  

---

## 1. Specification & Scope
- **Problem Statement**: ในการทำงานร่วมกับ AI Coding Agents จำเป็นต้องมีกลไกตรวจสอบคุณภาพโค้ด ความปลอดภัย และประสิทธิภาพเชิงลึกอย่างเป็นระบบ (Dedicated Multi-Lens Audit) ก่อนที่จะส่งมอบงานเข้าสู่ Main Branch เพื่อค้นหาข้อบกพร่องและบันทึกลงใน Findings Ledger (`devflow/context/findings.md`) ซึ่งจะเชื่อมโยงกับระบบ Quality Gatekeeper ต่อไป
- **In-Scope**:
  - **สร้างทักษะ `/audit` ใน AI Tool Adapters**:
    - `.agents/skills/audit/SKILL.md` (สำหรับ Antigravity, Codex, Copilot, Cursor)
    - `.claude/skills/audit/SKILL.md` (สำหรับ Claude Code)
    - รองรับ 3 Scopes: Branch/Active Diff (ค่าเริ่มต้น), Targeted Path, Full Project
    - รองรับ 4 Lenses: Quality (Code smells/complexity), Security (Secrets/injections/auth), Performance (N+1/leaks), Tests (Coverage/flakiness)
  - **พัฒนาฟังก์ชันจัดการ Findings ใน `lib/findings.ts`**:
    - ฟังก์ชัน `addFinding`: สร้าง Finding รายการใหม่ บันทึกลงใน `devflow/context/findings.md` พร้อมคำนวณ Durable ID อัตโนมัติ (เช่น `FIND-xxx` หรือ `SEC-xxx`)
  - **CLI Integration**:
    - เพิ่ม Subcommand `nexus-devflow findings add` ใน `bin/create-nexus-devflow.ts`
  - **Unit Tests**:
    - เขียนชุดทดสอบสำหรับ `addFinding` และการทำงานของ Findings ใน `test/findings.test.ts`
- **Out-of-Scope**:
  - การแก้ไขไฟล์ Source Code อัตโนมัติระหว่างรัน `/audit` (Audit เป็นคำสั่งตรวจสอบและบันทึกรายงานเท่านั้น การซ่อมแซมเป็นหน้าที่ของ `/fix` หรือ `/implement`)
- **Acceptance Criteria**:
  - [x] AC-1: มีไฟล์สคิล `/audit` ที่สมบูรณ์ทั้งใน `.agents/skills/audit/SKILL.md` และ `.claude/skills/audit/SKILL.md`
  - [x] AC-2: ฟังก์ชัน `addFinding` ใน `lib/findings.ts` สามารถบันทึกรายการ Finding ใหม่พร้อมกำหนด ID และ Severity ได้ถูกต้อง
  - [x] AC-3: คำสั่ง CLI `nexus-devflow findings add` สามารถใช้งานได้จากเทอร์มินัล
  - [x] AC-4: ชุดทดสอบทั้งหมดใน `packages/create-nexus-devflow` ผ่าน 100% และ `npm run check:static` ผ่าน 0 errors

## 2. Plan & Test Strategy
- **Files to Modify / Create**:
  - `.agents/skills/audit/SKILL.md`: สคิล `/audit` สำหรับ Codex/Antigravity/Copilot
  - `.claude/skills/audit/SKILL.md`: สคิล `/audit` สำหรับ Claude Code
  - `packages/create-nexus-devflow/lib/findings.ts`: เพิ่มฟังก์ชัน `addFinding`
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`: เพิ่ม CLI subcommand `findings add`
  - `packages/create-nexus-devflow/test/findings.test.ts`: เพิ่ม Unit tests สำหรับ `addFinding`
- **Test Decision**: `Required (TDD)`
  - *Rationale*: Findings Ledger เป็นกลไกหลักในการควบคุม Release Gatekeeper ของโปรเจกต์ ต้องรับประกันว่าการเพิ่มและจัดการ Findings มีความถูกต้องแม่นยำ
  - *Planned Cases*:
    - `addFinding` creates `findings.md` if missing and appends new finding with calculated ID
    - `addFinding` preserves existing findings and respects severity/status parameters
- **Impact & Rollback Strategy**:
  - *Impact*: เพิ่มทักษะการตรวจสอบความปลอดภัยและคุณภาพ ไม่กระทบโครงสร้างเดิม
  - *Rollback*: `git checkout main` หรือสลับกลับด้วย `/rollback`

## 3. Implementation Checklist
- [x] Task 1: สร้างและปรับแต่ง `.agents/skills/audit/SKILL.md` และ `.claude/skills/audit/SKILL.md`
- [x] Task 2: พัฒนาฟังก์ชัน `addFinding` ใน `packages/create-nexus-devflow/lib/findings.ts`
- [x] Task 3: เชื่อมต่อคำสั่ง `nexus-devflow findings add` เข้าสู่ `bin/create-nexus-devflow.ts`
- [x] Task 4: เขียนและอัปเดต Unit Tests ใน `test/findings.test.ts` และ `test/status.test.ts`
- [x] Task 5: ตรวจสอบความถูกต้องด้วย `npm test`, `npm run check:static` และ `npm run test:package`

## 4. Implementation Record
- **สร้างไฟล์ Skill Audit**:
  - [`.agents/skills/audit/SKILL.md`](file:///d:/devtools/nexus-devflow/.agents/skills/audit/SKILL.md): สคิล Multi-Lens Code, Security, Performance และ Test Audit พร้อมข้อกำหนดเชื่อมต่อ Findings Ledger สำหรับ Codex, Antigravity, Copilot, Cursor
  - [`.claude/skills/audit/SKILL.md`](file:///d:/devtools/nexus-devflow/.claude/skills/audit/SKILL.md): สคิล Audit สำหรับ Claude Code
- **เพิ่มฟังก์ชันใน Library**:
  - [`packages/create-nexus-devflow/lib/findings.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/lib/findings.ts): พัฒนาฟังก์ชัน `addFinding` รองรับการคำนวณ ID อัตโนมัติ (`FIND-001`, `FIND-002`, ...), กำหนด Severity (P0..P3), Status, Location, Impact, Remediation
- **ขยายคำสั่ง CLI**:
  - [`packages/create-nexus-devflow/bin/create-nexus-devflow.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/bin/create-nexus-devflow.ts): เพิ่ม subcommand `nexus-devflow findings add "<title>" [--severity P0|P1|P2|P3] [--location <path>] [--id <id>]`
- **Unit Tests**:
  - [`packages/create-nexus-devflow/test/findings.test.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/test/findings.test.ts): เพิ่มชุดทดสอบครอบคลุมการสร้าง Finding ใหม่, Auto-sequence ID, Custom options
  - [`packages/create-nexus-devflow/test/status.test.ts`](file:///d:/devtools/nexus-devflow/packages/create-nexus-devflow/test/status.test.ts): เพิ่มการทดสอบ CLI argument parser สำหรับ `findings add`

## 5. Verification Evidence

### 🧪 Multi-Lane Verification Matrix

| Lane | การทดสอบ (Verification Lane) | คำสั่ง (Command) | ผลลัพธ์ (Result) | หลักฐาน (Evidence Summary) |
| :--- | :--- | :--- | :--- | :--- |
| **Lane 1** | **Static Contracts & Framework Integrity** | `npm run check:static` | **PASS (0 errors)** | ผ่าน 31 skills validation, manifests และ paths ทั้งหมดสมบูรณ์ |
| **Lane 2** | **Unit Test Suite** | `npm test` (packages/create-nexus-devflow) | **PASS (42/42 tests)** | ผ่านการทดสอบ 100% รวม `addFinding`, `parseFindings`, `resolveFinding`, `gatekeeper`, `git-hooks` |
| **Lane 3** | **Package Smoke & Distribution Test** | `npm run test:package` | **PASS (Clean build & pack)** | Pack tarball สำเร็จ (`140 files`), ติดตั้ง overlay และทดสอบความถูกต้องสำเร็จ |
| **Lane 4** | **CLI Live Execution** | `nexus-devflow findings add` & `resolve` | **PASS** | บันทึก Finding สำเร็จ (`FIND-001 [P2] open`), แก้ไขสถานะ (`closed`) และ Gatekeeper ทำงานถูกต้อง |

## 6. Release & Handoff
- **Release Status**: Shipped & Delivered
- **Completed Date**: 2026-08-22
- **Delivery Digest**:
  - สร้างคำสั่งและสคิล `/audit` ใน `.agents/skills/audit/SKILL.md` และ `.claude/skills/audit/SKILL.md`
  - พัฒนาฟังก์ชัน `addFinding` ใน `packages/create-nexus-devflow/lib/findings.ts`
  - เพิ่ม Subcommand `nexus-devflow findings add` ใน CLI
  - ผ่านการทดสอบ 42/42 tests และ static checks 100%
- **Git Commit Message**:
  `feat(audit): add dedicated code and security audit skill with findings ledger integration (034-code-and-security-audit-skill)`
