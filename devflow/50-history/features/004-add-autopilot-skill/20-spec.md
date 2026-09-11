# Phase 20: Delivery Specification

- **Running ID**: `RUN-004-add-autopilot-skill`
- **Title**: ข้อกำหนดการพัฒนาระบบคำสั่ง `autopilot` ใน Nexus-DevFlow (Autonomous Bounded Execution Loop)
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาการส่งมอบ (Delivery Contract) สำหรับคำสั่ง **`autopilot`** ซึ่งเป็น Explicit Companion Execution Skill ที่ช่วยให้ AI สามารถรันขั้นตอนใน DevFlow 2.0 ต่อเนื่องเป็นวงจรปิด (Bounded Autonomous Loop) ตั้งแต่การวิเคราะห์ข้อกำหนด, แตกแผนงาน, เขียนโค้ด, ตรวจสอบ QA, จนถึงสร้างสรุปรายงาน โดยไม่ต้องรอการกดยืนยันในทุกๆ Subtask ย่อย พร้อมทั้งมีระบบความปลอดภัยและ Hard Stops ที่รัดกุม 100%

---

## 2. ข้อกำหนดฟังก์ชันหลัก (Core Functional Requirements)

### REQ-1: โครงสร้างไฟล์ Skill และ Adapter Parity
- **รายละเอียด**: สร้าง `.agents/skills/autopilot/SKILL.md` และ `.claude/skills/autopilot/SKILL.md` ให้มีเนื้อหาและพฤติกรรมตรงกันแบบ 1:1
- **เกณฑ์การตรวจสอบ**:
  - `name`: `autopilot`
  - มีคำอธิบาย (Description) ชัดเจนว่าเป็น Explicit Opt-in Bounded Loop
  - ซิงค์ตรงกันผ่าน `npm run sync:adapters`

### REQ-2: ขั้นตอนการทำงาน 7 สเต็ปของ Autopilot Loop
- **Step 1 - Preflight State & Safety Check**: ตรวจสอบสถานะ Workspace, Git Cleanliness, Project Context, Active Run/Feature
- **Step 2 - Spec Formulation or Resume**: ตรวจสอบและสร้าง/สานต่อ `20-spec.md`
- **Step 3 - Task Planning & Branch Setup**: สร้าง `30-plan.md` และ Checklists พร้อมสลับไปที่ Feature/Fix Branch
- **Step 4 - Incremental Implementation**: ทำงานทีละ Step ตามแผน พร้อมสร้าง **Checkpoint Commit** บน Branch หลังแต่ละ Step ผ่านการทดสอบ
- **Step 5 - QA Verification & Multi-lane Testing**: รันการทดสอบครบถ้วน (`check`, `check:static`, `test`, `test:package` หรือ test runner ของโปรเจกต์)
- **Step 6 - Targeted Finding Repair**: ตรวจจับและซ่อมแซม P0/P1 Findings ที่ตกค้างภายในสโคป พร้อมบันทึกใน `devflow/context/findings.md`
- **Step 7 - Final Delivery Review Packet**: จัดทำรายงานสรุปผล `60-report.md` และ Dashboard `60-report.html` พร้อมคำแนะนำการรัน `/try`

### REQ-3: กฎความปลอดภัยและการหยุดทำงานทันที (Strict Hard Stops)
- **ห้ามทำเด็ดขาด (Hard Stops)**:
  - ❌ ห้าม Commit บน `main`, Merge Branch, หรือ Delete Branch
  - ❌ ห้ามรัน `git push` ขึ้น Remote Repository
  - ❌ ห้าม Deploy หรือ Publish Package
  - ❌ ห้ามลบ Database, รัน Destructive Scripts หรือ Migration ที่ทำลายข้อมูล
  - ❌ ห้ามทำซ้ำเกิน 2 ครั้งเมื่อพบข้อผิดพลาดเดิม (Two-attempt hard stop)
  - ❌ หยุดส่งมอบรายงานก่อนเข้าสู่ `/70-release` เสมอ

### REQ-4: การผสานรวม Router และระบบ Multi-Agent
- **รายละเอียด**:
  - อัปเดต `AGENTS.md` และ `CLAUDE.md` บรรจุคำสั่ง `autopilot` ในตาราง Companion Commands และ Invocation Schemes
  - ปรับปรุง Router Skill `devflow/SKILL.md` ให้สามารถตรวจจับ intent และแนะนำ `autopilot` เมื่อผู้ใช้ต้องการรันแบบอัตโนมัติ

### REQ-5: การอัปเดตเอกสารและการซิงค์ Package Templates
- **รายละเอียด**:
  - อัปเดต `docs/USAGE.md`, `docs/workflow-surface-map.md`, `README.md`, และ `README.th.md`
  - รัน `prepare-template.js` เพื่อให้แพ็กเกจติดตั้ง `@jakkrichm/create-nexus-devflow` ได้รับไฟล์ใหม่และผ่านการ Sanitize อย่างถูกต้อง

### REQ-6: การตรวจสอบและทดสอบคุณภาพ (Verification Matrix)
- **รายละเอียด**:
  - ผ่าน `npm run check:static` (ตรวจครบ 104 skills)
  - ผ่าน `npm run check`
  - ผ่าน `npm test` (3/3 installer tests)
  - ผ่าน `npm run test:package` (Smoke test clean directory overlay)

---

## 3. สิ่งที่อยู่นอกขอบเขต (Explicit Out-of-Scope)

- ไม่ตัดขั้นตอน Mainline ปกติทิ้ง (ผู้ใช้ยังคงรันทีละ stage ได้ตามปกติ)
- ไม่รองรับการทำ Rollback แบบ Autopilot (Rollback ต้องผ่าน Human-Review Gate เสมอ)
- ไม่ให้ Autopilot ทำการ Merge เข้า `main` หรือ Deploy อัตโนมัติ

---

## 4. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-1** | Skill Definition | มี `.agents/skills/autopilot/SKILL.md` และ `.claude/skills/autopilot/SKILL.md` ที่สมบูรณ์และ Parity 100% |
| **AC-2** | Safety Hard Stops | ระบุ Hard Stops ครบถ้วน (ห้าม Merge, Push, Deploy, ลบข้อมูล) |
| **AC-3** | Router Integration | `AGENTS.md`, `CLAUDE.md`, และ `devflow/SKILL.md` รู้จักและนำทางคำสั่ง `autopilot` ได้ |
| **AC-4** | Documentation Sync | มีรายการ `autopilot` ในคู่มือทั้งภาษาไทยและภาษาอังกฤษ |
| **AC-5** | Test Suite Pass | `npm run check:static`, `npm run check`, `npm test`, `npm run test:package` ผ่าน 100% |

---

## 5. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/30-plan RUN-004-add-autopilot-skill
หรือ
30-plan RUN-004-add-autopilot-skill
```
