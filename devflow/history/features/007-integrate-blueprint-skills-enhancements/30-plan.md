# Phase 30: Implementation Plan

- **Running ID**: `RUN-007-integrate-blueprint-skills-enhancements`
- **Title**: แผนการยกระดับระบบ Nexus-DevFlow ด้วยวินัยและกลไกสำคัญจาก Nexus-Blueprint ทั้ง 23 Skills
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture Team

---

## 1. การประเมินความซับซ้อนและยุทธศาสตร์ (Complexity Assessment & Strategy)

- **ระดับความซับซ้อน (Complexity)**: `Standard`
- **ยุทธศาสตร์ (Strategy)**:
  1. เสริม Stage Contracts ใน `.agents/skills/50-verify/SKILL.md`, `.agents/skills/60-report/SKILL.md`, และ `.agents/skills/70-release/SKILL.md` ด้วยกลไก Findings Ledger State Machine, Empirical Proof, Try Guide, และ Safety Gates
  2. อัปเดต `devflow/context/coding-standards.md` เพื่อบันทึกระเบียบปฏิบัติด้าน QA และ Findings Ledger อย่างเป็นทางการ
  3. ซิงค์ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
  4. ซิงค์ไปยัง `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
  5. ตรวจสอบความถูกต้องครบถ้วนผ่านชุดทดสอบทั้งหมด (`check:static`, `check`, `test`, `test:package`) 100%

---

## 2. ลำดับเฟสและรายการงานย่อย (Ordered Phases & Subtasks)

### Phase 1: ยกระดับ Stage Contracts & Standards
- **Subtask 1.1**: อัปเดต `.agents/skills/50-verify/SKILL.md` (เพิ่ม Findings Ledger State Machine, P0/P1 Blockers, Empirical Proof Contract, และ Try Guide generation)
  - **Files**: `.agents/skills/50-verify/SKILL.md`
  - **Test Decision**: `Manual Review & Contract Check`
- **Subtask 1.2**: อัปเดต `.agents/skills/60-report/SKILL.md` (เพิ่มการบันทึก Try Guide และการรายงานสถานะ Findings Ledger ในรายงานสรุป)
  - **Files**: `.agents/skills/60-report/SKILL.md`
  - **Test Decision**: `Manual Review`
- **Subtask 1.3**: อัปเดต `.agents/skills/70-release/SKILL.md` (เพิ่ม Step 0 Safety Pass, การแยกอนุมัติ Merge และ Push, และการย้าย Resolved Findings เข้าสู่ Archive)
  - **Files**: `.agents/skills/70-release/SKILL.md`
  - **Test Decision**: `Manual Review`
- **Subtask 1.4**: อัปเดต `devflow/context/coding-standards.md` ให้ระบุ Findings State Machine และ Empirical Verification Standard
  - **Files**: `devflow/context/coding-standards.md`
  - **Test Decision**: `Manual Review`

### Phase 2: ซิงค์ Tool Adapters & Package Template
- **Subtask 2.1**: ซิงค์ Adapters ไปยัง `.claude/skills/`
  - **Command**: `npm run sync:adapters`
  - **Test Decision**: `Command Only`
- **Subtask 2.2**: ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template/`
  - **Command**: `node packages/create-nexus-devflow/scripts/prepare-template.js`
  - **Test Decision**: `Command Only`

### Phase 3: การตรวจสอบและทดสอบคุณภาพ (Verification)
- **Subtask 3.1**: รันชุดตรวจสอบคุณภาพและ Unit Tests ทั้งหมด
  - **Commands**: `npm run check:static`, `npm run check`, `npm test`, `npm run test:package`
  - **Test Decision**: `Command Only` (All tests must pass 100%)

---

## 3. แผนการตรวจสอบและเกณฑ์การผ่าน (Verification Strategy)

| Layer | Command | Expected Outcome |
| :--- | :--- | :--- |
| **Static Framework** | `npm run check:static` | ผ่านการตรวจครบทั้ง 104 skills |
| **Workspace Integrity** | `npm run check` | ไฟล์และโฟลเดอร์หลักของ DevFlow ครบถ้วน |
| **Installer Unit Tests**| `npm test` | ผ่าน 3/3 tests ของ create-nexus-devflow |
| **Package Smoke Test** | `npm run test:package` | จำลองการ pack และติดตั้งสำเร็จใน Temp Directory |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
40-implement RUN-007-integrate-blueprint-skills-enhancements
```
