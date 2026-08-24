# Implementation Checklist: RUN-005-add-devflow-prefix-to-skill-descriptions

- [x] 1. สร้าง `scripts/update-skill-descriptions.mjs` พร้อม Mapping คำอธิบายคุณภาพสูง
- [x] 2. รันสคริปต์เพื่ออัปเดตไฟล์ `SKILL.md` ทั้งหมดใน `.agents/skills/`
- [x] 3. ซิงค์ Adapters ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
- [x] 4. รัน `node scripts/check-skill-descriptions.mjs` ตรวจสอบความถูกต้องครบทั้ง 104 Skills
- [x] 5. รัน `node packages/create-nexus-devflow/scripts/prepare-template.js` เพื่อซิงค์ Template แพ็กเกจติดตั้ง
- [x] 6. จัดทำบันทึกหลักฐาน [40-implement.md](../40-implement.md)
