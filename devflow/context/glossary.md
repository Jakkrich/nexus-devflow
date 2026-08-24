# Nexus-DevFlow Domain Glossary

> พจนานุกรมศัพท์โดเมนและนิยามสถาปัตยกรรมสำหรับ Nexus-DevFlow

---

### Single Living Spec (`current-feature.md`)
- **Definition**: เอกสาร Markdown กลางเพียงฉบับเดียวที่ใช้ขับเคลื่อนและบันทึกวงจรชีวิตของงานพัฒนาตั้งแต่ต้นจนจบ (Single Source of Truth during active delivery)
- **Constraints**: มีได้เพียง 1 งานที่ active ในช่วงเวลาหนึ่งตามหลักการ Single Active Run Guardrail
- **Structure**: ครอบคลุม 6 ส่วนหลัก: (1) Define & Boundaries, (2) Technical Spec & Contracts, (3) Execution Plan & TDD Tasks, (4) Implementation Log & Evidence, (5) Multi-Lane Verification Matrix, (6) Release Digest & Retrospective
- **Aliases / Related**: `current-feature.md`, Living Spec, Feature Spec

### Unified Fast-Track
- **Definition**: รูปแบบการพัฒนาหลักแบบ Single-Track ของ Nexus-DevFlow ที่รวมความสามารถเชิงสถาปัตยกรรมระดับลึก (Deep) และความคล่องตัว (Fast) เข้าด้วยกันผ่าน 4 คำสั่งหลัก: `/feature` (หรือ `/fix`), `/implement`, `/check`, และ `/complete`
- **Constraints**: ขับเคลื่อนผ่านไฟล์ `current-feature.md` และเมื่อเสร็จสิ้นจะถูก Archive เป็นไฟล์ Markdown เดี่ยวใน `devflow/history/`
- **Aliases / Related**: Fast-Track, Unified Track

### Pre-Flight Discovery
- **Definition**: กระบวนการสำรวจไอเดีย, ทำการวิจัย (Research), กลั่นกรอง PRD, วิเคราะห์ Trade-offs และจัดทำ ADR ก่อนที่จะเริ่มเปิดรอบพัฒนาจริง
- **Constraints**: ไม่แก้ไขซอร์สโค้ดโปรเจกต์ และไม่ถือว่าเป็น Active Run จนกว่าจะถูกส่งต่อเข้าสู่ `/feature`
- **Aliases / Related**: `/discovery`, `/idea`, `/brainstorm`, `/grill`

### Multi-Lane Verification Matrix
- **Definition**: ตารางตรวจสอบคุณภาพแบบหลายมิติที่ครอบคลุม Typecheck, Linter, Automated Unit/Integration Tests, และ Manual Proof Evidence ในคำสั่ง `/check`
- **Constraints**: ต้องมีผลลัพธ์ผ่าน (PASS) ครบทุก Lane และไม่มี P0/P1 Finding ที่ยังค้างอยู่ก่อนที่จะส่งต่อไปยัง `/complete`
- **Aliases / Related**: QA Matrix, Lane Verification

### Release Digest & Retrospective
- **Definition**: สรุปผลการเปลี่ยนแปลง, บทเรียนที่ได้รับ (Lessons Learned), และการตัดสินใจสำคัญที่บันทึกไว้ในตอนปิดรอบการพัฒนา
- **Constraints**: บันทึกอัตโนมัติใน Living Spec ก่อนที่จะทำการ Squash Merge และ Archive
- **Aliases / Related**: Delivery Digest, Retrospective Log
