# Implementation Checklist: RUN-003-add-try-rollback-ci-brief-skills

- [x] 1. สร้าง `.agents/skills/try/SKILL.md` (Manual QA Walkthrough Guide - Read-only)
- [x] 2. สร้าง `.agents/skills/rollback/SKILL.md` (Safe Reversal Planner & Dependency Risk Scanner)
- [x] 3. สร้าง `.agents/skills/ci/SKILL.md` (Automated GitHub Actions Pipeline Generator)
- [x] 4. สร้าง `.agents/skills/brief/SKILL.md` (Scope, Dependency & Risk Pre-Check - Read-only)
- [x] 5. ซิงค์ Adapters ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
- [x] 6. อัปเดต `AGENTS.md` และ `CLAUDE.md` บรรจุ 4 คำสั่งในตาราง Companion Commands และ Invocation Schemes
- [x] 7. อัปเดต Router Skill `.agents/skills/devflow/SKILL.md` และ `.claude/skills/devflow/SKILL.md`
- [x] 8. อัปเดตคู่มือ [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md) และ [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md)
- [x] 9. อัปเดตคู่มือ [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md) และ [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)
- [x] 10. รัน `node packages/create-nexus-devflow/scripts/prepare-template.js` เพื่อซิงค์ Template แพ็กเกจติดตั้ง
- [x] 11. จัดทำบันทึกหลักฐาน [40-implement.md](../40-implement.md)
