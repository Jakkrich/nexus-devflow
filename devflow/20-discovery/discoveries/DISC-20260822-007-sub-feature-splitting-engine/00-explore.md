# 🧭 Discovery Document: [DISC-20260822-007] Sub-Feature Automatic Splitting Engine (`4a`, `4b`, `4c`)

> **Discovery ID**: `DISC-20260822-007`  
> **Source**: Intake from `[IDEA-012]` in `devflow/ideas.md`  
> **Date**: 2026-08-22  
> **Status**: `Proceed (Approved for Delivery)`  
> **Target Track**: Fast-Track (Blueprint Mode - `/feature`)  

---

## 1. Problem Statement & Motivation
เมื่อฟีเจอร์มีความซับซ้อนสูงหรือมีขนาดใหญ่ (`L` / `XL`) เช่น แตะต้องมากกว่า 6 ไฟล์, ครอบคลุมทั้ง Database, Backend APIs, Frontend UI และ Client State หรือมีขั้นตอนการทำงานมากกว่า 6 tasks การพัฒนาแบบรวดเดียวมักทำให้บริบทของ AI ล้น (Context Overflow) และเพิ่มโอกาสเกิดข้อผิดพลาดในการตรวจสอบ (Audit Regression)

DevFlow ต้องการ **Sub-Feature Automatic Splitting Engine** ที่ฝังอยู่ในคำสั่ง `/feature` และ `/brief` เพื่อประเมินขนาดงาน (Multi-Factor Sizing Heuristic) และเสนอแผนแบ่งย่อยออกเป็น Sub-features (`4a`, `4b`, `4c`) โดยอัตโนมัติ พร้อมรองรับรหัสประจำรอบแบบ Sub-feature ID (`xxx[a-z]-slug`)

---

## 2. Exploration Lenses & Architectural Decisions

### A. Multi-Factor Sizing Heuristic
ประเมินว่าฟีเจอร์มีขนาดใหญ่เกินไป (`L` หรือ `XL`) เมื่อเข้าเงื่อนไขอย่างใดอย่างหนึ่งดังนี้:
1. **Files Touched**: คาดการณ์ว่าจะต้องแก้ไขหรือสร้างไฟล์ใหม่ $\ge 6$ ไฟล์
2. **Architectural Layers**: ข้าม $\ge 3$ เลเยอร์ (เช่น DB Schema/Migration + Backend API + Frontend Component + State Management)
3. **Task Complexity**: มี Checklist Tasks $\ge 6$ งานย่อย หรือมีการต่อเชื่อมกับ 3rd Party External Services หลายจุด

### B. Sub-Feature ID & Git Branch Standard
- **Running ID Format**: `xxx[a-z]-slug` (เช่น `038a-auth-schema-and-api`, `038b-auth-ui-and-state`)
- **Git Branch Format**: `feature/xxx[a-z]-slug`
- **Build Plan Notation**: รองรับ `- [ ] 4a. Backend Schema...`, `- [ ] 4b. Frontend UI...`

### C. Interactive Split Gate UX
เมื่อผู้ใช้ป้อนคำสั่ง `/feature` กับฟีเจอร์ขนาดใหญ่:
1. ระบบตรวจจับและแสดง **Sub-Feature Split Recommendation** ในแชตทันที
2. นำเสนอโครงสร้างการแบ่งเป็น `4a`, `4b` พร้อมขนาดและลำดับ Dependencies
3. ถามยืนยันเพื่อเปิด Spec เริ่มทำ `4a` ทันที และบันทึก `4b` ต่อท้ายในคิวงาน

---

## 3. Decision & Next Step

### Final Decision: `Proceed` ✅
เริ่มกระบวนการจัดส่งผ่าน Fast-Track Autopilot ทันที
