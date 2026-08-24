# Build Plan

> **Document Type**: Build Plan (User-Owned)
> **Purpose**: รายการฟีเจอร์ตามลำดับการพัฒนาจริง (Ordered Feature Roadmap Checklist)
> **Workflow**: ใช้เครื่องหมาย Checkbox `- [ ]` เรียงลำดับ 1, 2, 3... เพื่อให้ `/feature` ดึงไปทำทีละงาน

---

## 🚀 Phase 1: Core Foundation & Data Layer

- [ ] 1. **Core Schema & Data Models** - สร้าง Data Models, Schemas (Zod) และ Database Migrations เบื้องต้น
- [ ] 2. **Base Layout & Main UI Shell** - วางโครงสร้างหน้าจอหลัก, Navigation Shell และ Design Tokens
- [ ] 3. **Primary Feature Flow** - พัฒนาฟังก์ชันการทำงานหลัก พร้อม Input Form และ Validation

---

## ⚡ Phase 2: Interactivity & Core Capabilities

- [ ] 4. **Live Preview / Action Pipeline** - เชื่อมต่อ Input เข้าสู่ระบบประมวลผลและการแสดงผลแบบ Real-time
- [ ] 5. **Export / Output Engine** - พัฒนาระบบส่งออกข้อมูล เช่น Image Generation, PDF Download หรือ API Response
- [ ] 6. **Local Persistence & Settings** - บันทึกการตั้งค่าและประวัติการใช้งานลงใน Local Storage หรือ Database
  - [ ] 6a. **Settings Panel** - UI สำหรับปรับแต่งค่าและการจัดเก็บ State
  - [ ] 6b. **History & Recall** - แสดงรายการประวัติย้อนหลังและปุ่มเรียกข้อมูลกลับมาใช้

---

## 🚢 Phase 3: Polish, Quality & Production Hardening

- [ ] 7. **Edge Cases & Input Polish** - จัดการ Loading States, Error Boundaries และ Responsive Layout
- [ ] 8. **Deployment Readiness & Production Verification** - ตั้งค่า Environment Config, ตรวจสอบ Production Build และ Health Check

---

## 🛠️ Architecture & Deployment Notes (Optional)
<!-- 
บันทึกการตัดสินใจทางสถาปัตยกรรมที่ตกลงกันไว้ล่วงหน้า เพื่อป้องกันการสับสนระหว่างการ Implement
-->

- **Key Technical Decisions**:
  - [เช่น ใช้ Full Puppeteer พร้อม Bundled Chromium แทน Serverless Chromium เพื่อความเสถียรของ Font]
  - [เช่น จัดเก็บ User Session ผ่าน JWT ใน HttpOnly Cookies]
- **Environment & Hosting Constraints**:
  - [เช่น ต้องการ Memory ขั้นต่ำ 1GB บน Render หรือ Docker Container]
  - [เช่น กำหนด Concurrency Limits ไม่เกิน 2 worker processes ต่อ instance]

---

## 🔮 Later / Post-MVP Backlog (Not in v1)
<!-- 
ฟีเจอร์ที่วางแผนไว้สำหรับอนาคต (หลังจาก v1 ส่งมอบเรียบร้อยแล้ว)
-->

- [ ] **Cloud Sync & User Accounts** - ระบบสมัครสมาชิกและซิงค์ข้อมูลบน Cloud (Clerk / Supabase)
- [ ] **Batch Processing** - อัปโหลดไฟล์ CSV และประมวลผลพร้อมกันทีละหลายรายการ
- [ ] **Paid Subscription & Billing** - เชื่อมต่อ Stripe และจัดการ Tier จำกัดการใช้งาน

---

<!--
💡 คำแนะนำในการเขียน Build Plan ที่ดี:
1. แต่ละข้อต้องเป็น "Feature-Sized Outcome" ที่มองเห็นผลลัพธ์ได้ (ไม่ใช่แค่ task ย่อยๆ เช่น "เขียน function x")
2. ห้ามใส่ Scaffolding Chores (เช่น "สร้างโปรเจกต์ Next.js", "ติดตั้ง Tailwind") เพราะทำก่อนหน้าแล้ว
3. ฟีเจอร์ที่มีความซับซ้อน สามารถแตกเป็น Sub-items ย่อยได้ เช่น 6a, 6b
4. อย่าจัดกลุ่มฟีเจอร์หลายๆ อย่างรวมในข้อเดียว (เช่น "Auth + Database + Dashboard + Deploy")
-->
