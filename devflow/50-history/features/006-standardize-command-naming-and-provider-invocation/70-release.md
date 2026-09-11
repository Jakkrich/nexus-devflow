# Phase 70: Release & Delivery Package

- **Running ID**: `RUN-006-standardize-command-naming-and-provider-invocation`
- **Release Version**: `2.0.10`
- **Title**: ส่งมอบการปรับชื่อเรียกคำสั่งและ Stage เป็นชื่อมาตรฐานทางการ ตัด Alias/ชื่อย่อ และอธิบายการเรียกตาม AI Provider
- **Artifact Language**: th
- **Status**: Released
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. บทสรุปการส่งมอบ (Release Summary)

การส่งมอบในรอบ **`RUN-006`** (เวอร์ชัน **`2.0.10`**) ประกอบด้วยการปรับปรุงระบบการเรียกคำสั่งและ Stage ทั้งหมดใน Nexus-DevFlow ให้เป็นมาตรฐานเอกภาพ สะอาด และไม่ทำให้ผู้ใช้หรือ AI Agents สับสน:

1. **ใช้ Canonical Name เดี่ยวทุกที่**:
   - Mainline Stages: `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, `70-release`
   - Companion Commands: `devflow`, `onboard`, `adopt`, `doctor`, `try`, `rollback`, `ci`, `brief`, `autopilot`, `goal`, `brainstorm`, `research`, `debug`, `prd`, `issue-triage`, `security-review`, `wiki`, `check-for-updates`, `help`
   - ลบ Semantic Aliases และ Shorthands ที่ซ้ำซ้อนออกทั้งหมด
2. **ชี้แจงแนวทางการพิมพ์คำสั่งตาม AI Provider (Invocation Rule)**:
   - เพิ่ม Note Block และตารางอ้างอิงชัดเจนใน `AGENTS.md`, `CLAUDE.md`, `README.md`, และ `README.th.md`
   - ระบุว่าการเรียกใช้ (ชื่อปกติ, `/`, หรือ `$`) ขึ้นอยู่กับ AI Tool ที่ใช้งาน (เช่น Claude/Antigravity ใช้ `/`, Codex ใช้ `$`)
3. **ความสอดคล้องระดับ Ecosystem Parity**:
   - อัปเดตและซิงค์ `SKILL.md` ครบถ้วน 104 skills ใน `.agents/skills/` และ `.claude/skills/`
   - ซิงค์เทมเพลตสำหรับติดตั้งใน `packages/create-nexus-devflow/template/`

---

## 2. รายการการเปลี่ยนแปลง (Changelog Notes)

### Changed:
- **Standardized Canonical Command Naming**: กำหนด Canonical Name เดี่ยวสำหรับทุก Mainline Stage และ Companion Command พร้อมตัด Shorthand และ Semantic Aliases ออก
- **AI Provider Invocation Guideline**: เพิ่มกล่องข้อความและตารางคำแนะนำรูปแบบการเรียกคำสั่ง (Normal Name, Slash Prefix, Dollar Prefix) ตาม AI Provider
- **Skill Adapters Alignment**: ปรับปรุง Usage Block และ Next Stage ใน `SKILL.md` ทุกไฟล์ให้ตรงกัน
- **Version Bump**: ปรับเวอร์ชันเป็น `2.0.10`

---

## 3. หลักฐานการตรวจสอบ (Verification Evidence)

- Static Contracts: `npm run check:static` (PASS 104 Skills)
- Framework Integrity: `npm run check` (PASS)
- Installer Tests: `npm test` (PASS 3/3 Tests)
- Smoke Test: `npm run test:package` (PASS 377 Files Applied)

---

## 4. สถานะและขั้นตอนถัดไป (Next Steps)

- สิ้นสุดรอบการทำงาน Mainline สำหรับ `RUN-006`
- ผสานโค้ดเข้าสู่ Branch `main` และพร้อมสำหรับ Publish เวอร์ชันใหม่
