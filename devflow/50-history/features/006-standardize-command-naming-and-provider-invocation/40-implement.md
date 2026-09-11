# Phase 40: Implementation Evidence

- **Running ID**: `RUN-006-standardize-command-naming-and-provider-invocation`
- **Title**: บันทึกหลักฐานการปรับชื่อเรียกคำสั่งและ Stage เป็นชื่อมาตรฐานทางการ ตัด Alias/ชื่อย่อ และอธิบายการเรียกตาม AI Provider
- **Source Plan**: [30-plan.md](30-plan.md)
- **Artifact Language**: th
- **Status**: Completed
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. สรุปผลการพัฒนา (Implementation Summary)

ดำเนินการปรับปรุงชื่อเรียกคำสั่งและ Stage ทั้งหมดใน Nexus-DevFlow 2.0 ให้เป็น **Canonical Name** เดี่ยว ไม่มี Alias ย่อหรือ Shorthand ที่สร้างความสับสน และเพิ่มคำแนะนำเรื่อง Invocation Prefix ตาม AI Provider ไว้อย่างชัดเจนและเป็นเอกภาพทุกจุด:

1. **Core Instructions (`AGENTS.md`, `CLAUDE.md`)**:
   - ปรับหัวข้อ `Universal Invocation & Agent Directives` ให้เน้น Canonical Name และชี้แจงการเติม Prefix (`/` สำหรับ Claude/Antigravity, `$` สำหรับ Codex, หรือชื่อปกติ)
   - ปรับปรุงตาราง Invocation Reference ให้กระชับ สวยงาม และแยกคอลัมน์การเรียกใช้งานตาม AI Provider ชัดเจน
2. **User Guides (`README.md`, `README.th.md`)**:
   - ปรับตาราง Mainline Stages และ Companion Commands ให้ใช้ Canonical Name เดี่ยวทั้งหมด
   - เพิ่มกล่องคำแนะนำ (Note Block) สรุปเรื่องการเลือกใส่ Prefix ตาม AI Provider
3. **Skill Adapters (`.agents/skills/`, `.claude/skills/`)**:
   - ปรับปรุง Usage Block และ Next Workflow ใน `SKILL.md` ให้ใช้ Canonical Name
   - ซิงค์ไปยัง `.claude/skills/` ครบถ้วน 104 skills
4. **Package Template (`packages/create-nexus-devflow/template/`)**:
   - ซิงค์ Template ทั้งหมดเข้าสู่ตัวติดตั้ง package ให้ตรงกับโปรเจกต์หลัก 100%

---

## 2. รายการไฟล์ที่แก้ไขและเพิ่มขึ้น (File Changes)

- `AGENTS.md` - Standardize canonical command names & provider invocation table
- `README.md` - Standardize English docs & tables
- `README.th.md` - Standardize Thai docs & tables
- `scripts/standardize-command-invocations.mjs` - Automation script for updating skill usage & references
- `.agents/skills/*/SKILL.md` - Updated usage & next steps
- `.claude/skills/*/SKILL.md` - Synced via `npm run sync:adapters`
- `packages/create-nexus-devflow/template/` - Synced via `prepare-template.js`

---

## 3. Checkpoint Commits บน Branch

- `ecbecda`: `docs(RUN-006): checkpoint standardize command names and provider invocation in AGENTS and READMEs`
- `a694d3d`: `feat(RUN-006): checkpoint standardize command references in skill adapters`
- `92d60df`: `feat(RUN-006): checkpoint sync updated templates into create-nexus-devflow`

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
50-verify RUN-006-standardize-command-naming-and-provider-invocation
```
