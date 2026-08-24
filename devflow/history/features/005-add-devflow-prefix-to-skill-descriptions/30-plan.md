# Phase 30: Implementation Plan

- **Running ID**: `RUN-005-add-devflow-prefix-to-skill-descriptions`
- **Title**: แผนการเพิ่ม Prefix `[Devflow]` ใน Description ของทุก Skill และทบทวนคำอธิบายให้ถูกต้องสมบูรณ์
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. การประเมินความซับซ้อนและยุทธศาสตร์ (Complexity Assessment & Strategy)

- **ระดับความซับซ้อน (Complexity)**: `Standard`
- **ยุทธศาสตร์ (Strategy)**:
  - พัฒนาสคริปต์อัตโนมัติ `scripts/update-skill-descriptions.mjs` ที่มี Mapping คำอธิบายที่ได้รับการปรับปรุงใหม่อย่างละเอียด
  - ทำการอัปเดตไฟล์ `SKILL.md` ทั้งหมดใน `.agents/skills/` (104 Skills)
  - ซิงค์ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
  - ซิงค์ไปยัง `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
  - รันการตรวจสอบความถูกต้อง 4 ด่าน (`check:static`, `check`, `test`, `test:package`) 100%

---

## 2. ลำดับเฟสและรายการงานย่อย (Ordered Phases & Subtasks)

### Phase 1: สร้าง Script สำหรับประมวลผลคำอธิบายทุก Skill
- **Subtask 1.1**: สร้าง `scripts/update-skill-descriptions.mjs` พร้อม Mapping คำอธิบายที่ผ่านการทบทวน
  - **Files**: `scripts/update-skill-descriptions.mjs`
  - **Test Decision**: `Command Only`
  - **Verification**: `node scripts/update-skill-descriptions.mjs`

### Phase 2: รันการอัปเดตและซิงค์ Adapters
- **Subtask 2.1**: รันการอัปเดต `.agents/skills/*/SKILL.md`
  - **Command**: `node scripts/update-skill-descriptions.mjs`
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
| **Prefix Validation** | `node scripts/check-skill-descriptions.mjs` | 104 skills มี Prefix `[Devflow]` ครบ 100% |
| **Static Framework** | `npm run check:static` | ผ่านการตรวจครบทั้ง 104 skills |
| **Workspace Integrity** | `npm run check` | ไฟล์และโฟลเดอร์หลักของ DevFlow ครบถ้วน |
| **Installer Unit Tests**| `npm test` | ผ่าน 3/3 tests ของ create-nexus-devflow |
| **Package Smoke Test** | `npm run test:package` | จำลองการ pack และติดตั้งสำเร็จใน Temp Directory |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/40-implement RUN-005-add-devflow-prefix-to-skill-descriptions
```
