# Phase 10: Define Contract

- **Running ID**: `RUN-005-add-devflow-prefix-to-skill-descriptions`
- **Title**: เพิ่ม Prefix `[Devflow]` ใน Description ของทุก Skill และทบทวนคำอธิบายให้ถูกต้องสมบูรณ์
- **Source Discovery**: [DISC-20260818-002-add-devflow-prefix-to-skill-descriptions](../../discoveries/DISC-20260818-002-add-devflow-prefix-to-skill-descriptions/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการสำรวจใน [Phase 00 (DISC-20260818-002)](../../discoveries/DISC-20260818-002-add-devflow-prefix-to-skill-descriptions/00-discover.md) พบว่าการปรับปรุงคำอธิบาย (Description) ของทุก Skill ให้มี Prefix **`[Devflow]`** และมีเนื้อหาที่บอกขอบเขตการทำงาน พร้อม Intent ในการเรียกใช้งานอย่างชัดเจน จะช่วยยกระดับความสามารถในการค้นหาและเลือกใช้ Skill ของ AI Coding Assistants (Google Antigravity, Claude Code, Codex ฯลฯ) ให้แม่นยำยิ่งขึ้น โดยมีเป้าหมายหลักดังนี้:

1. **เพิ่ม Prefix มาตรฐาน `[Devflow]`**: ใส่ `[Devflow]` ในฟิลด์ `description` ของ YAML frontmatter ของทุก Skill ครบทั้ง 104 Skills
2. **ขยายและทบทวนคำอธิบายที่สั้นเกินไป**: ทบทวนและเขียนคำอธิบายใหม่ให้แก่ Skills ที่มีคำอธิบายสั้นหรือยังไม่ครอบคลุม (เช่น `debug`, `test`, `prd`, `simplify`, `preview`, `goal`, `followup`, `changelog`, `deploy`, `pr`, `merge`, `insight`, `agent`)
3. **รักษาความสอดคล้องข้ามระบบ (Ecosystem Parity)**: ซิงค์ไปยัง `.claude/skills/` และเทมเพลตสำหรับติดตั้ง `packages/create-nexus-devflow/template/`

---

## 2. ขอบเขตงาน (In-Scope)

### Phase 1: สร้าง Script สำหรับตรวจสอบและอัปเดต Description อัตโนมัติอย่างปลอดภัย
- สร้าง `scripts/update-skill-descriptions.mjs` ที่สามารถ:
  - อ่านไฟล์ `SKILL.md` ของทุก Skill ใน `.agents/skills/`
  - ตรวจสอบและใส่ Prefix `[Devflow]` อย่างถูกต้อง
  - กำหนด Mapping คำอธิบายคุณภาพสูงสำหรับ Skills ที่มีคำอธิบายสั้นหรือยังไม่ชัดเจน
  - บันทึกไฟล์กลับโดยรักษารูปแบบ YAML frontmatter และเนื้อหา Markdown เดิมไว้ 100%

### Phase 2: รันการอัปเดตและซิงค์ Tool Adapters
- รัน `node scripts/update-skill-descriptions.mjs` เพื่ออัปเดตทุก Skill ใน `.agents/skills/`
- ซิงค์ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters` (ได้ครบ 104 skills)

### Phase 3: ซิงค์ Package Template และการตรวจสอบคุณภาพ
- ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
- ตรวจสอบผ่านชุดทดสอบทั้งหมด (`check:static`, `check`, `test`, `test:package`) 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่เปลี่ยนชื่อ `name:` ของ Skill (คงชื่อเดิมไว้ทั้งหมดเพื่อไม่ให้กระทบการเรียกใช้งาน)
- ไม่แก้ไขเนื้อหา Logic หลักภายใน Markdown Body ของ Skill (ปรับปรุงเฉพาะส่วน YAML frontmatter `description`)

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-005`** | `add-devflow-prefix-to-skill-descriptions` | อัปเดต Prefix `[Devflow]` และทบทวน Description ของทุก Skill (104 Skills) ทั้งใน `.agents/skills/`, `.claude/skills/`, และเทมเพลต |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. ทุกไฟล์ `SKILL.md` ใน `.agents/skills/` (104 Skills) มี `description` ที่ขึ้นต้นด้วย `[Devflow]`
2. ทุกไฟล์ `SKILL.md` ใน `.claude/skills/` (104 Skills) มี `description` ตรงกันแบบ 1:1
3. ไม่มี Skill ใดที่มีคำอธิบายสั้นเกินไปหรือไม่ชัดเจน
4. ผ่านชุดทดสอบทั้งหมด (`check:static`, `check`, `test`, `test:package`) 100%

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/20-spec RUN-005-add-devflow-prefix-to-skill-descriptions
หรือ
20-spec RUN-005-add-devflow-prefix-to-skill-descriptions
```
