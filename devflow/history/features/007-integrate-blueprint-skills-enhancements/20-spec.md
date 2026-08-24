# Phase 20: Delivery Specification

- **Running ID**: `RUN-007-integrate-blueprint-skills-enhancements`
- **Title**: ข้อกำหนดการยกระดับระบบ Nexus-DevFlow ด้วยวินัยและกลไกสำคัญจาก Nexus-Blueprint ทั้ง 23 Skills
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาการส่งมอบ (Delivery Contract) สำหรับการผสานจุดเด่น กลไกการควบคุมคุณภาพ (Quality Gates) และวินัยเชิงวิศวกรรมจาก Blueprint เข้าสู่ Nexus-DevFlow 2.0 โดยครอบคลุมระบบ Audit & Findings Ledger, Empirical Proof & Try Guide, Safety Pass & Release Approval Separation และ Data Model Rigor

---

## 2. ข้อกำหนดฟังก์ชันหลัก (Core Functional Requirements)

### REQ-1: Findings Ledger State Machine & Hard Gates (`50-verify` & `findings.md`)
- บังคับใช้ State Machine ของ `devflow/context/findings.md`:
  - `open` ➔ Confirmed defect ที่รอการแก้ไข (บล็อกการ Release สำหรับ P0/P1)
  - `fixed` ➔ Defect ที่ถูกแก้ไขแล้วในโค้ดแต่ยังไม่ผ่านการ Review ซ้ำ (ยังคงบล็อกการ Release สำหรับ P0/P1)
  - `closed` ➔ ได้รับการตรวจสอบซ้ำใน `50-verify` แล้วว่าหายไปจริงและไม่เกิดข้อผิดพลาดใหม่
  - `accepted` ➔ ผู้ใช้อนุมัติข้อยกเว้นพร้อมบันทึกเหตุผล
  - `invalid` ➔ ผลตรวจพิสูจน์แล้วว่าไม่ใช่ข้อผิดพลาดจริง
- ใน `50-verify/SKILL.md`:
  - ระบุขั้นตอนตรวจสอบ Findings Ledger อย่างชัดเจน
  - เปลี่ยนสถานะ Finding จาก `fixed` เป็น `closed` เมื่อผ่านการตรวจสอบซ้ำ

### REQ-2: มาตรฐานหลักฐานเชิงประจักษ์ (Empirical Proof Contract)
- ใน `50-verify/SKILL.md`:
  - กำหนดกฎเหล็ก: "ห้ามเคลมว่าผ่าน (Passed) โดยไม่มีหลักฐานรูปธรรม" (ต้องระบุ Command, Test Output, Route, Screenshot หรือ Log ที่เกิดขึ้นจริง)
  - กำหนดให้สร้าง Try Guide สำหรับ Manual QA ("Where to go", "What to click", "What to expect")

### REQ-3: การบันทึกรายงานและการจัดเก็บประวัติ (`60-report` & `70-release`)
- ใน `60-report/SKILL.md`:
  - รวม Try Guide และสรุปสถานะ Findings Ledger ลงใน `60-report.md` และ `60-report.html`
- ใน `70-release/SKILL.md`:
  - บรรจุ **Step 0 Safety Pass**: ตรวจสอบว่าไม่มี P0/P1 ค้างอยู่ในสถานะ `open` หรือ `fixed`
  - บังคับใช้ **2-Stage Approval**: การขออนุมัติ Merge เข้า `main` แยกต่างหากจากการขออนุมัติ `git push` ไปยังรีโมท
  - ย้าย Resolved Findings (`closed`, `accepted`, `invalid`) เข้าสู่ประวัติของ Release และรีเซ็ต `findings.md` ให้สะอาด

### REQ-4: ปรับปรุงคู่มือมาตรฐานวิศวกรรม (`coding-standards.md`)
- อัปเดต `devflow/context/coding-standards.md` ให้ระบุ Findings State Machine และ Empirical Proof Rules ไว้อย่างเป็นทางการ

### REQ-5: การซิงค์และตรวจสอบความสมบูรณ์ 100%
- ซิงค์ `.agents/skills/` ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
- ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template/` ผ่าน `npm run prepare:template`
- ผ่านการทดสอบทั้งหมด 100%: `npm run check:static`, `npm run check`, `npm test`, `npm run test:package`

---

## 3. สิ่งที่อยู่นอกขอบเขต (Explicit Out-of-Scope)

- ไม่เปลี่ยนโครงสร้าง Linear Mainline Stages 00-70
- ไม่ลบ Specialist Agents ที่มีอยู่เดิมใน DevFlow

---

## 4. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-1** | Findings Ledger Integrity | `50-verify/SKILL.md` และ `70-release/SKILL.md` บังคับใช้ State Machine (`open` ➔ `fixed` ➔ `closed`) และห้าม Release หากมี P0/P1 ค้าง |
| **AC-2** | Empirical Proof & Try Guide | `50-verify/SKILL.md` บังคับแสดงหลักฐานเชิงประจักษ์ และสร้าง Try Guide สำหรับ Manual QA |
| **AC-3** | Safety Pass & Approval Separation | `70-release/SKILL.md` แยกสิทธิ์การอนุมัติ Merge และ Push ออกจากกันอย่างเด็ดขาด |
| **AC-4** | Standards Update | `coding-standards.md` บันทึกระเบียบปฏิบัติ Ledger และ Empirical Proof ชัดเจน |
| **AC-5** | Adapters & Template Parity | `.agents/skills/` ซิงค์กับ `.claude/skills/` และ package template 100% |
| **AC-6** | All Checks Green | ผ่าน `npm run check:static`, `npm run check`, `npm test`, `npm run test:package` 100% |

---

## 5. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
30-plan RUN-007-integrate-blueprint-skills-enhancements
```
