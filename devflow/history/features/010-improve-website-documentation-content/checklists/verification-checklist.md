# Verification Checklist

- **Running ID**: `RUN-010-improve-website-documentation-content`
- **Title**: Verification & QA Checklist
- **Status**: Completed (PASS)

---

## 1. Documentation Content Verification
- [x] หน้า `core-workflow.md` และ `mainline-stages.md` มีเนื้อหา 8 Stages ละเอียดครบ 5 องค์ประกอบ โดยไม่ใช้ตารางสรุปสั้น
- [x] หน้า `companion-commands.md` แสดงรายการคำสั่งครบทุกตัวตามโฟลเดอร์ใน `.agents/skills/` (8 หมวดหมู่ 62 คำสั่ง)
- [x] หน้า `start/roles-guide.md` มีเนื้อหาครอบคลุม 4 กลุ่มบทบาท (Junior, Senior, Lead/Architect, Manager) และแสดงใน Sidebar ของเว็บไซต์

## 2. Build & Quality Verification
- [x] `npm run docs:build` คอมไพล์ได้ 100% สำเร็จ (17 หน้า HTML พร้อม Pagefind Index)
- [x] `npm run check:static` ผ่าน 100% (70 skills passed)
- [x] `npm test` ผ่าน 100% (3/3 tests passed)
