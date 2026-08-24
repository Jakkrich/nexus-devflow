# Verification Checklist: RUN-003-add-try-rollback-ci-brief-skills

- [x] 1. ตรวจสอบว่ามีไฟล์ `SKILL.md` ครบทั้ง 4 ตัวใน `.agents/skills/` (`try`, `rollback`, `ci`, `brief`)
- [x] 2. ตรวจสอบว่ามีไฟล์ `SKILL.md` ครบทั้ง 4 ตัวใน `.claude/skills/` (Parity 100%)
- [x] 3. ตรวจสอบว่า `try` และ `brief` กำหนด Directive ชัดเจนว่าเป็น **Read-only**
- [x] 4. ตรวจสอบว่า `rollback` มีกฎการจำแนก Dependency Risk และไม่ลบประวัติ DevFlow
- [x] 5. ตรวจสอบว่า `ci` สร้าง `.github/workflows/verify.yml` ตามมาตรฐานความปลอดภัย Least Privilege
- [x] 6. ตรวจสอบว่า `AGENTS.md` และ `CLAUDE.md` มีตารางอ้างอิงคำสั่งครบถ้วน
- [x] 7. ตรวจสอบว่า Router `devflow` รู้จักและสามารถนำทางไปยังทั้ง 4 คำสั่งได้ถูกต้อง
- [x] 8. รัน `npm run check:static` ผ่าน 100% (ตรวจครบ 103 skills)
- [x] 9. รัน `npm run check` ผ่าน 100% (ไฟล์ระบบอยู่ครบถ้วน)
- [x] 10. รัน `npm test` และ `npm run test:package` ผ่าน 100%
