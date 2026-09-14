# Nexus-DevFlow Domain Glossary

> พจนานุกรมศัพท์โดเมนและนิยามสถาปัตยกรรมสำหรับ Nexus-DevFlow

---

### Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`)
- **Definition**: เอกสาร Markdown หลักหนึ่งฉบับต่อ runที่ใช้ขับเคลื่อนและบันทึกวงจรชีวิตของงานพัฒนาตั้งแต่ต้นจนจบ (Single Source of Truth during active delivery)
- **Constraints**: ร่างหลาย run ได้พร้อมกัน แต่แต่ละ run แยก spec, stage, findings และ branch; เลือกเป้าหมายก่อน implement
- **Structure**: ครอบคลุม 6 ส่วนหลัก: (1) Define & Boundaries, (2) Technical Spec & Contracts, (3) Execution Plan & TDD Tasks, (4) Implementation Log & Evidence, (5) Multi-Lane Verification Matrix, (6) Release Digest & Retrospective
- **Aliases / Related**: `devflow/context/{xxx-slug}/spec.md`, Living Spec, Feature Spec

### Unified Fast-Track
- **Definition**: รูปแบบการพัฒนาหลักแบบ Single-Track ของ Nexus-DevFlow ที่รวมความสามารถเชิงสถาปัตยกรรมระดับลึก (Deep) และความคล่องตัว (Fast) เข้าด้วยกันผ่าน 4 คำสั่งหลัก: `/feature` (หรือ `/fix`), `/implement`, `/check`, และ `/complete`
- **Constraints**: ขับเคลื่อนผ่านไฟล์ `devflow/context/{xxx-slug}/spec.md` และเมื่อเสร็จสิ้นจะถูก Archive เป็นไฟล์ Markdown เดี่ยวใน `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`
- **Aliases / Related**: Fast-Track, Unified Track

### Pre-Flight Discovery
- **Definition**: กระบวนการสำรวจไอเดีย, ทำการวิจัย (Research), กลั่นกรอง PRD, วิเคราะห์ Trade-offs และจัดทำ ADR ก่อนที่จะเริ่มเปิดรอบพัฒนาจริง
- **Constraints**: ไม่แก้ไขซอร์สโค้ดโปรเจกต์ และไม่ถือว่าเป็น Active Run จนกว่าจะถูกส่งต่อเข้าสู่ `/feature`
- **Aliases / Related**: `/discovery`, `/idea`, `/brainstorm`, `/grill`

### Multi-Lane Verification Matrix
- **Definition**: ตารางตรวจสอบคุณภาพแบบหลายมิติที่ครอบคลุม Typecheck, Linter, Automated Unit/Integration Tests, และ Manual Proof Evidence ในคำสั่ง `/check`
- **Constraints**: ต้องมีหลักฐานผ่านสำหรับทุก Lane ที่ใช้กับงาน ส่วนที่ไม่เกี่ยวข้องให้บันทึก N/A พร้อมเหตุผล และไม่มี P0/P1 Finding ที่ยังค้างอยู่ก่อนที่จะส่งต่อไปยัง `/complete`
- **Aliases / Related**: QA Matrix, Lane Verification

### Release Digest & Retrospective
- **Definition**: สรุปผลการเปลี่ยนแปลง, บทเรียนที่ได้รับ (Lessons Learned), และการตัดสินใจสำคัญที่บันทึกไว้ในตอนปิดรอบการพัฒนา
- **Constraints**: บันทึกอัตโนมัติใน Living Spec ก่อนที่จะทำการ Squash Merge และ Archive
- **Aliases / Related**: Delivery Digest, Retrospective Log
