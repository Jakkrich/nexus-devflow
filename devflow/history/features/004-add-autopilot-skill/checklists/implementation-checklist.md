# Implementation Checklist: RUN-004-add-autopilot-skill

- [x] 1. สร้าง `.agents/skills/autopilot/SKILL.md` (7-step bounded loop, strict hard stops, checkpoint commit rules)
- [x] 2. ซิงค์ Adapters ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
- [x] 3. อัปเดต `AGENTS.md` และ `CLAUDE.md` บรรจุคำสั่ง `autopilot` ในตาราง Companion Commands และ Invocation Schemes
- [x] 4. อัปเดต Router Skill `.agents/skills/devflow/SKILL.md` และ `.claude/skills/devflow/SKILL.md`
- [x] 5. อัปเดตคู่มือ [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md) และ [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md)
- [x] 6. อัปเดตคู่มือ [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md) และ [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)
- [x] 7. รัน `node packages/create-nexus-devflow/scripts/prepare-template.js` เพื่อซิงค์ Template แพ็กเกจติดตั้ง
- [x] 8. จัดทำบันทึกหลักฐาน [40-implement.md](../40-implement.md)
