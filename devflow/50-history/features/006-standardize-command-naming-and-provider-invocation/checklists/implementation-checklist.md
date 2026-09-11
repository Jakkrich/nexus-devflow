# Implementation Checklist - RUN-006

## Phase 1: Core Documentation & Instructions
- [x] Subtask 1.1: ปรับปรุง `AGENTS.md` และ `CLAUDE.md` ให้แสดงเฉพาะ Canonical Name และตาราง Provider Invocation Reference
- [x] Subtask 1.2: ปรับปรุง `README.md` และ `README.th.md` ให้ใช้ Canonical Name และกล่องคำแนะนำ Provider Invocation

## Phase 2: Skill Adapters & Documentation Links
- [x] Subtask 2.1: ปรับปรุง Usage และ Next Stage ใน `.agents/skills/*/SKILL.md` ให้เป็น Canonical Name
- [x] Subtask 2.2: ซิงค์ Adapters ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`

## Phase 3: Package Template & Quality Verification
- [x] Subtask 3.1: ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template/`
- [x] Subtask 3.2: รันชุดตรวจสอบคุณภาพและ Unit Tests ทั้งหมด (`check:static`, `check`, `test`, `test:package`)
