# Phase 30: Implementation Plan

- **Running ID**: `RUN-004-add-autopilot-skill`
- **Title**: แผนการพัฒนาระบบคำสั่ง `autopilot` ใน Nexus-DevFlow (Autonomous Bounded Execution Loop)
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. การประเมินความซับซ้อนและภาพรวม (Complexity Assessment & Strategy)

- **ระดับความซับซ้อน (Complexity)**: `Standard`
- **ยุทธศาสตร์การลงมือทำ (Strategy)**:
  - สร้าง `.agents/skills/autopilot/SKILL.md` โดยออกแบบวงจร 7 ขั้นตอน (Preflight ➔ Spec ➔ Plan & Branch ➔ Incremental Implementation + Checkpoints ➔ QA Verification ➔ Finding Repairs ➔ Review Packet) และระบุ Hard Stops ชัดเจน
  - ซิงค์ไปยัง `.claude/skills/autopilot/SKILL.md` ผ่าน `npm run sync:adapters` (ได้ครบ 104 skills)
  - ผสานรวมคำสั่งเข้ากับ `AGENTS.md`, `CLAUDE.md`, Router `devflow/SKILL.md`
  - อัปเดตคู่มือการใช้งานและเอกสารแผนผังคำสั่ง
  - ซิงค์เทมเพลตสำหรับติดตั้งใน `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
  - ตรวจสอบผ่านเกณฑ์ทดสอบทั้ง 4 ระดับ (`check:static`, `check`, `test`, `test:package`) 100%

---

## 2. ลำดับเฟสและรายการงานย่อย (Ordered Phases & Subtasks)

### Phase 1: สร้างและออกแบบ Skill `autopilot` ใน `.agents/skills/`
- **Subtask 1.1**: สร้าง `.agents/skills/autopilot/SKILL.md`
  - **Files**: `.agents/skills/autopilot/SKILL.md`
  - **Pattern**: YAML frontmatter + 7-Step Loop + Strict Hard Stops + Review Packet Schema
  - **Test Decision**: `Manual/Command Only` (ตรวจสอบโครงสร้าง Markdown & Schema)
  - **Verification**: `npm run check:static`

### Phase 2: ซิงค์ Adapters และผสานรวมระบบ Multi-Agent
- **Subtask 2.1**: ซิงค์ Adapters ไปยัง `.claude/skills/`
  - **Files**: `.claude/skills/autopilot/SKILL.md`
  - **Command**: `npm run sync:adapters`
  - **Test Decision**: `Command Only`
- **Subtask 2.2**: อัปเดต `AGENTS.md` และ `CLAUDE.md`
  - **Files**: [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md), [CLAUDE.md](file:///d:/Projects/devtools/nexus-devflow/CLAUDE.md)
  - **Test Decision**: `Not Required` (Docs/Configuration)
- **Subtask 2.3**: อัปเดต Router Skill `devflow/SKILL.md`
  - **Files**: `.agents/skills/devflow/SKILL.md` & `.claude/skills/devflow/SKILL.md`
  - **Test Decision**: `Command Only`
  - **Verification**: `npm run check:static`

### Phase 3: อัปเดตเอกสารคู่มือการใช้งาน
- **Subtask 3.1**: อัปเดต `docs/USAGE.md` และ `docs/workflow-surface-map.md`
  - **Files**: [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md)
  - **Test Decision**: `Not Required`
- **Subtask 3.2**: อัปเดต `README.md` และ `README.th.md`
  - **Files**: [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)
  - **Test Decision**: `Not Required`

### Phase 4: ซิงค์ Package Templates & การตรวจสอบความถูกต้อง
- **Subtask 4.1**: ซิงค์ Package Template
  - **Command**: `node packages/create-nexus-devflow/scripts/prepare-template.js`
  - **Test Decision**: `Command Only`
- **Subtask 4.2**: รันชุดตรวจสอบคุณภาพและ Unit Tests
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
/40-implement RUN-004-add-autopilot-skill
หรือ
40-implement RUN-004-add-autopilot-skill
```
