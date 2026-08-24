# Phase 30: Implementation Plan

- **Running ID**: `RUN-006-standardize-command-naming-and-provider-invocation`
- **Title**: แผนการปรับชื่อเรียกคำสั่งและ Stage เป็นชื่อมาตรฐานทางการ ตัด Alias/ชื่อย่อ และอธิบายการเรียกตาม AI Provider
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. การประเมินความซับซ้อนและยุทธศาสตร์ (Complexity Assessment & Strategy)

- **ระดับความซับซ้อน (Complexity)**: `Standard`
- **ยุทธศาสตร์ (Strategy)**:
  1. ปรับปรุงเอกสารหลัก (`AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md`) ให้แสดงเฉพาะ **Canonical Name** เดี่ยว และอธิบายหลักการเรียกใช้งานตาม AI Provider Prefix (Normal, `/`, `$`) ไว้อย่างชัดเจน
  2. ตรวจสอบและอัปเดตไฟล์ `SKILL.md` ใน `.agents/skills/` โดยเฉพาะ Mainline Stages และ Companion Commands ให้ใช้ Canonical Name ในส่วน Usage, Next Steps และความเชื่อมโยง
  3. ซิงค์ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
  4. ซิงค์ไปยัง `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
  5. ตรวจสอบความถูกต้องครบถ้วนผ่านชุดทดสอบทั้งหมด (`check:static`, `check`, `test`, `test:package`) 100%

---

## 2. ลำดับเฟสและรายการงานย่อย (Ordered Phases & Subtasks)

### Phase 1: ปรับปรุง Core Documentation & Instructions
- **Subtask 1.1**: ปรับปรุง `AGENTS.md` และ `CLAUDE.md` ให้ใช้ Canonical Name และมีตาราง Invocation Reference ที่ชัดเจน
  - **Files**: `AGENTS.md`, `CLAUDE.md`
  - **Test Decision**: `Manual Review & Contract Check`
- **Subtask 1.2**: ปรับปรุง `README.md` และ `README.th.md` ให้ใช้ Canonical Name และระบุ AI Provider Invocation Note
  - **Files**: `README.md`, `README.th.md`
  - **Test Decision**: `Manual Review`

### Phase 2: ปรับปรุง Skill Adapters & Documentation Links
- **Subtask 2.1**: ปรับปรุง Usage และคำแนะนำ Next Stage ใน `.agents/skills/*/SKILL.md` ให้เป็น Canonical Name
  - **Files**: `.agents/skills/`
  - **Test Decision**: `Command Only`
- **Subtask 2.2**: ซิงค์ Adapters ไปยัง `.claude/skills/`
  - **Command**: `npm run sync:adapters`
  - **Test Decision**: `Command Only`

### Phase 3: ซิงค์ Package Template และการตรวจสอบคุณภาพ
- **Subtask 3.1**: ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template/`
  - **Command**: `node packages/create-nexus-devflow/scripts/prepare-template.js`
  - **Test Decision**: `Command Only`
- **Subtask 3.2**: รันชุดตรวจสอบคุณภาพและ Unit Tests
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
40-implement RUN-006-standardize-command-naming-and-provider-invocation
```
