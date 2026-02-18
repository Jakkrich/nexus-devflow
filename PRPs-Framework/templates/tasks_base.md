# TASKS BACKLOG

Template สำหรับกำหนด tasks ที่ต้องการให้ AI ช่วยพัฒนา

## Context (โดยรวม)

- โปรเจกต์นี้คืออะไร / Domain อะไร
- Tech stack หลัก
- ระบบหรือโมดูลสำคัญ

---

## Task 1: [ชื่อ task สั้น ๆ]

- Type: BUG | FEATURE | CHANGE | REFACTOR | OTHER
- Priority: P1 | P2 | P3
- Description: [อธิบายสิ่งที่อยากให้ทำแบบภาษาคน]
- Constraints: [ข้อจำกัดสำคัญ ถ้าไม่มีให้เว้นได้]
- Related: [ลิงก์ไป PRP/ไฟล์ที่เกี่ยวข้อง ถ้ามี]

---

## Task 2: [ชื่อ task สั้น ๆ]

- Type: BUG | FEATURE | CHANGE | REFACTOR | OTHER
- Priority: P1 | P2 | P3
- Description: [อธิบายสิ่งที่อยากให้ทำแบบภาษาคน]
- Constraints: [ข้อจำกัดสำคัญ ถ้าไม่มีให้เว้นได้]
- Related: [ลิงก์ไป PRP/ไฟล์ที่เกี่ยวข้อง ถ้ามี]

---

## วิธีใช้งาน

1. คัดลอกไฟล์นี้ไปสร้าง `TASKS.md` ใน root ของโปรเจกต์
2. เขียน tasks ลงใน `TASKS.md` ตาม template ด้านบน
3. แนะนำให้สร้าง ISSUE spec จาก task ด้วยมือใน `PRPs-Framework/issues/` (หรือใช้ `/create-issue`) แล้วค่อยสร้าง PRP ด้วย `/generate-prp`
4. PRP จะถูกสร้างใน `PRPs-Framework/PRPs/` พร้อม Plan/Subtasks (T1, T2, T3...) และพร้อมสำหรับขั้นตอนต่อไป

## หมายเหตุ

- แต่ละ Task ควรมี description ที่ชัดเจน
- Type และ Priority ช่วยให้ AI จัดลำดับความสำคัญได้
- Related PRPs ช่วยให้ AI เข้าใจ context ที่เกี่ยวข้อง
