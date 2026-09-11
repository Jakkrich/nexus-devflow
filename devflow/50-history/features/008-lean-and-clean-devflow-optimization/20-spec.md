# Phase 20: Delivery Specification

- **Running ID**: `RUN-008-lean-and-clean-devflow-optimization`
- **Title**: ข้อกำหนดการปรับปรุงโครงสร้าง Nexus-DevFlow ให้ Lean & Clean ยุบรวม Skills บริหารจัดการ History และเพิ่มความปลอดภัยในการ Rollback
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาการส่งมอบ (Delivery Contract) สำหรับการปรับปรุงสถาปัตยกรรมและโครงสร้างไฟล์ของ **Nexus-DevFlow 2.0** ให้มีความกระชับ สะอาด ประหยัด Context Window ของ AI และรองรับการบำรุงรักษาระยะยาวระดับ Enterprise โดยครอบคลุม 5 เสาหลัก:
1. การกำจัดส่วนเกิน (Graphify & Wiki)
2. การยุบรวมทักษะที่ซ้ำซ้อน (Skill Consolidation & Deduplication)
3. ระบบบันทึกประวัติการส่งมอบระยะยาว (Structured History Ledger & Archiving)
4. การถอยรหัสอย่างปลอดภัย (Safe & Atomic Rollback Strategy)
5. การจัดระเบียบโครงสร้าง Scripts และคำสั่งทดสอบ (Clean Scripts & Tests)

---

## 2. ข้อกำหนดฟังก์ชันหลัก (Core Functional Requirements)

### REQ-1: กำจัดส่วนเกินที่ไม่จำเป็น (Bloat Removal)
- **R1.1**: ลบไฟล์ `scripts/graphify.mjs` และคำสั่ง `graphify:*` ทั้งหมดออกจาก `package.json`
- **R1.2**: ลบโฟลเดอร์ `.agents/skills/wiki/`, `.claude/skills/wiki/` และการอ้างอิง `wiki` ใน `AGENTS.md` และ `CLAUDE.md`
- **R1.3**: ตรวจสอบให้แน่ใจว่าไม่มี broken link หรือ script ห้อยค้าง

### REQ-2: การยุบรวม Skills (Skill Consolidation)
ผสานเนื้อหา คำสั่ง กฎเกณฑ์ และแนวปฏิบัติจากทักษะย่อยเข้าสู่ Master Skills หลัก โดยไม่ให้สูญเสียทฤษฎีหรือความสามารถเดิม:
- **R2.1 (Testing)**: รวม `test-driven-development` + `test-execution-and-coverage` เข้ากับ `test/SKILL.md`
- **R2.2 (Review)**: รวม `code-review-and-quality` + `pr-review-analysis` + `pr-review` + `9arm-skills` เข้ากับ `review/SKILL.md`
- **R2.3 (Debug)**: รวม `debugging-and-error-recovery` + `diagnosing-bugs` เข้ากับ `debug/SKILL.md`
- **R2.4 (Security)**: รวม `security-and-hardening` + `vulnerability-scanner` เข้ากับ `security-review/SKILL.md`
- **R2.5 (Simplify)**: รวม `code-simplification` เข้ากับ `simplify/SKILL.md`
- **R2.6 (Deploy)**: รวม `deployment-procedures` + `shipping-and-launch` เข้ากับ `deploy/SKILL.md`
- **R2.7 (Preview)**: รวม `preview-local-check` เข้ากับ `preview/SKILL.md`
- **R2.8 (Insight)**: รวม `insight-capture` เข้ากับ `insight/SKILL.md`
- **R2.9 (Ideation)**: รวม `idea-refine` เข้ากับ `brainstorm/SKILL.md` และ `prd/SKILL.md`
- **R2.10**: ลบโฟลเดอร์ของ sub-skills ที่ถูกยุบรวมเรียบร้อยแล้วออกจาก `.agents/skills/` และ `.claude/skills/`

### REQ-3: ระบบประวัติ Master Ledger และการจัดเก็บ (History Ledger & Archiving)
- **R3.1**: สร้างไฟล์ `devflow/history/HISTORY.md` เป็น Master Ledger เก็บประวัติการส่งมอบทุก Run
- **R3.2**: ใน `70-release/SKILL.md` กำหนดให้ Step Release สิ้นสุดด้วยการเพิ่ม Record รายการ Run ที่ปิดงาน พร้อมระบุ Git Commit Hash, Tag, และวันที่ เข้าสู่ `devflow/history/HISTORY.md`
- **R3.3**: รองรับการ Archive ข้อมูล Run เก่าเพื่อรักษาความสะอาดของ `devflow/runs/`

### REQ-4: กลไก Safe & Atomic Rollback
- **R4.1**: ใน `rollback/SKILL.md` กำหนดให้ตรวจสอบ Git Checkpoint (Tag หรือ Commit Hash) ที่บันทึกไว้ใน History
- **R4.2**: บังคับให้ประเมิน **Dependency Impact Analysis** ว่ามี Run ภายหลังที่ขึ้นต่อฟีเจอร์นี้หรือไม่ ก่อนดำเนินการ revert
- **R4.3**: กำหนดให้สร้าง Rollback Re-verification Plan ตรวจสอบความถูกต้องของระบบหลังถอยโค้ด

### REQ-5: จัดระเบียบ Scripts & Tests
- **R5.1**: สร้างโฟลเดอร์ `scripts/tests/` และย้ายไฟล์ทดสอบ `test-*.mjs` ทั้งหมดเข้าไป
- **R5.2**: ปรับปรุงคำสั่งใน `package.json` scripts ให้ชี้ไปยังตำแหน่งใหม่ใน `scripts/tests/`
- **R5.3**: ปรับปรุง validator `scripts/validate-framework.mjs` ให้สอดคล้องกับโครงสร้างใหม่

### REQ-6: แนวทาง Fast-Track / Quick-Fix
- **R6.1**: เพิ่มคำแนะนำ Fast-Track สำหรับงาน Hotfix / Minor bug ใน `devflow/context/coding-standards.md` และ `ai-interaction.md`

### REQ-7: การซิงค์และตรวจสอบความถูกต้อง 100%
- **R7.1**: ซิงค์ `.agents/` ไปยัง `.claude/` และ `packages/create-nexus-devflow/template` ผ่าน `npm run sync:adapters` และ `npm run prepare:template`
- **R7.2**: ผ่านการทดสอบทั้งหมด 100%: `npm run check:static`, `npm run check`, `npm test`, `npm run test:package`

---

## 3. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-1** | Clean Bloat Removal | ไม่มีไฟล์ Graphify, Wiki หรือคำสั่งที่เกี่ยวข้องหลงเหลืออยู่ใน `package.json` และเอกสาร |
| **AC-2** | Consolidated Master Skills | Master Skills (`test`, `review`, `debug`, `security-review`, `deploy`, `simplify`, `preview`, `insight`, `brainstorm`) รวมเนื้อหาและคำแนะนำครบถ้วน 100% และลบ sub-folders ที่ซ้ำซ้อนออก |
| **AC-3** | Master History Ledger | มี `devflow/history/HISTORY.md` และ `70-release` มีขั้นตอนบันทึก Entry พร้อม Git Checkpoint |
| **AC-4** | Safe Rollback Rules | `rollback/SKILL.md` มีข้อกำหนด Dependency Impact Check และ Re-verification Plan ชัดเจน |
| **AC-5** | Clean Scripts Directory | ไฟล์ `test-*.mjs` ทั้งหมดอยู่ใน `scripts/tests/` และ `package.json` รันเทสต์ได้ถูกต้อง |
| **AC-6** | Fast-Track Guidelines | มีหัวข้อ Fast-Track ใน context guidelines สำหรับงานด่วน |
| **AC-7** | All Verification Passes | ผ่าน `npm run check:static`, `npm run check`, `npm test`, `npm run test:package` 100% |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
30-plan RUN-008-lean-and-clean-devflow-optimization
```
