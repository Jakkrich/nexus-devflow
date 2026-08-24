# Verification Checklist: RUN-004-add-autopilot-skill

- [x] 1. ตรวจสอบว่ามีไฟล์ `SKILL.md` ของ `autopilot` ใน `.agents/skills/autopilot/SKILL.md`
- [x] 2. ตรวจสอบว่ามีไฟล์ `SKILL.md` ของ `autopilot` ใน `.claude/skills/autopilot/SKILL.md` (Parity 100%)
- [x] 3. ตรวจสอบว่า `autopilot` มีการระบุ Hard Stops ชัดเจน (ห้าม merge เข้า main, ห้าม push, ห้าม deploy, ห้ามทำลายข้อมูล)
- [x] 4. ตรวจสอบว่า `autopilot` มีการบันทึก Checkpoint commits เฉพาะเมื่อ unit ผ่านการทดสอบ
- [x] 5. ตรวจสอบว่า `AGENTS.md` และ `CLAUDE.md` มีตารางอ้างอิงคำสั่ง `autopilot` ครบถ้วน
- [x] 6. ตรวจสอบว่า Router `devflow` รู้จักและนำทางไปยัง `autopilot` ได้ถูกต้อง
- [x] 7. รัน `npm run check:static` ผ่าน 100% (ตรวจครบ 104 skills)
- [x] 8. รัน `npm run check` ผ่าน 100% (ไฟล์ระบบอยู่ครบถ้วน)
- [x] 9. รัน `npm test` และ `npm run test:package` ผ่าน 100%
