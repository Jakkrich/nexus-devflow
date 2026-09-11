# Verification Checklist: RUN-002-add-onboard-adopt-doctor-skills

- **Running ID**: `RUN-002-add-onboard-adopt-doctor-skills`
- **Title**: รายการตรวจสอบคุณภาพและการยืนยันผล (Verification Checklist)
- **Status**: Pending Execution
- **Last Updated**: 2026-08-18

---

## 1. Static Contract & Parity Checks

- [x] **VC-1**: ตรวจสอบว่า `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md` มีเนื้อหาและโครงสร้างสอดคล้องกัน
- [x] **VC-2**: ตรวจสอบว่า `.agents/skills/adopt/SKILL.md` และ `.claude/skills/adopt/SKILL.md` มีเนื้อหาและโครงสร้างสอดคล้องกัน
- [x] **VC-3**: ตรวจสอบว่า `.agents/skills/doctor/SKILL.md` และ `.claude/skills/doctor/SKILL.md` มีเนื้อหาและโครงสร้างสอดคล้องกัน
- [x] **VC-4**: `npm run check:static` ผ่าน 100% โดยไม่มี static errors
- [x] **VC-5**: `npm run check` ผ่าน 100% ครบทุกกฎของ DevFlow

---

## 2. Integration & Router Behavior Checks

- [x] **VC-6**: [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) บรรจุคำอธิบายและรูปแบบการเรียกใช้งาน `onboard`, `adopt`, `doctor` ครบทั้ง 4 รูปแบบ
- [x] **VC-7**: Router `devflow` สามารถแนะนำ `/onboard` (เมื่อโปรเจกต์ใหม่) หรือ `/adopt` (เมื่อโปรเจกต์เดิม) หรือ `/doctor` (เมื่อตรวจสุขภาพ) ได้อย่างถูกต้อง
- [x] **VC-8**: ไฟล์เทมเพลตใน `packages/create-nexus-devflow/template` ได้รับการซิงค์ไฟล์ใหม่ทั้งหมด

---

## 3. Package Test Checks

- [x] **VC-9**: `npm test` ผ่าน 100% (Unit tests ของ package installer)
- [x] **VC-10**: `npm run test:package` ผ่าน 100% (Smoke test การแพ็กและติดตั้ง)
