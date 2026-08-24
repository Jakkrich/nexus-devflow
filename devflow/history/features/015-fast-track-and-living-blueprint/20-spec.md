# Phase 20: Delivery Specification

- **Running ID**: `RUN-015-fast-track-and-living-blueprint`
- **Title**: ข้อกำหนดทางเทคนิคในการพัฒนาระบบ Fast-Track (Blueprint Mode), Single Living Spec (`blueprint.md`) และยกเลิก Auto HTML Report
- **Source Definition**: [10-define.md](10-define.md)
- **Source Discovery**: [devflow/research/brainstorm-devflow-stage-compression.md](../../research/brainstorm-devflow-stage-compression.md)
- **Architecture Decisions**: [devflow/research/decision-disable-auto-html-report.md](../../research/decision-disable-auto-html-report.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-20
- **Owner**: DevFlow Core Framework Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้เป็นสัญญาข้อกำหนดทางเทคนิค (Delivery Contract) สำหรับการพัฒนารอบ **`RUN-015`** เพื่อ:
1. ติดตั้ง **Fast-Track (Blueprint Mode - 4 ขั้นตอน: `/spec` ➔ `/implement` ➔ `/check` ➔ `/complete`)** ให้กับ Nexus-DevFlow ในทั้ง `.agents/skills/` และ `.claude/skills/`
2. กำหนดมาตรฐาน **Single Living Spec (`blueprint.md`)** เพียงไฟล์เดียวสำหรับ Fast-Track
3. **ยกเลิกการสร้าง `report.html` และ `60-report.html` แบบอัตโนมัติ** ในทุกขั้นตอนของ Mainline และสร้างคำสั่งแยก `/report:html`
4. ปรับปรุง **Router (`/devflow`)**, `AGENTS.md`, `CLAUDE.md`, Routing Evaluations, และ Installer Template Bundler ให้รองรับระบบ Dual-Track ครบวงจร

---

## 2. ข้อกำหนดฟังก์ชันการทำงานหลัก (Core Functional Requirements)

### REQ-1: พัฒนา Fast-Track Skills (4 ขั้นตอนใน `.agents/skills/` และ `.claude/skills/`)

#### R1.1: Skill `/spec` (Aliases: `/feature`, `/fix`)
- **Directory**: `.agents/skills/spec/SKILL.md` และ `.claude/skills/spec/SKILL.md`
- **Aliases**: รองรับการเรียกผ่าน `/spec`, `/feature`, `/fix`, `$spec`, `$feature`, `$fix`
- **Behavior & Contract**:
  1. ตรวจสอบสถานะใน `devflow/context/current-stage.md` และ `devflow/runs/`
  2. หากยังไม่มี Active Run ให้จอง Running ID ถัดไป เช่น `RUN-xxx-{slug}`
  3. ตั้งชื่อ Git Branch ตามประเภทของงาน: `feature/{slug}-RUN-xxx` หรือ `fix/{slug}-RUN-xxx`
  4. สร้างไฟล์ Living Spec เพียงไฟล์เดียว: `devflow/runs/RUN-xxx-{slug}/blueprint.md`
  5. รวบรวมกระบวนการ `00-discover + 10-define + 20-spec + 30-plan` บันทึก 3 หมวดแรก:
     - `## 1. Specification & Scope` (Problem, In-Scope, Out-of-Scope, Acceptance Criteria)
     - `## 2. Plan & Test Strategy` (Files to touch, Test Decisions, Impact & Rollback)
     - `## 3. Implementation Checklist` (Checklist ละเอียดที่พร้อมรัน)
  6. อัปเดต `devflow/context/current-stage.md` เป็นสถานะ `spec` (พร้อมสำหรับ `/implement`)

#### R1.2: Skill `/implement`
- **Directory**: `.agents/skills/implement/SKILL.md` และ `.claude/skills/implement/SKILL.md`
- **Behavior & Contract**:
  1. โหลดข้อมูลจาก `devflow/runs/RUN-xxx-{slug}/blueprint.md`
  2. ลงมือเขียนโค้ดตาม Checklist ในข้อ `## 3. Implementation Checklist` ทีละรายการ
  3. ทำงานควบคู่กับ Unit Tests (TDD) ตามที่ระบุใน Test Strategy
  4. อัปเดตเครื่องหมาย `[x]` ใน Checklist และบันทึกข้อสังเกต/Commits ใน `## 4. Implementation Record`
  5. อัปเดต `current-stage.md` เป็น `implement` (เมื่อเสร็จครบทุกข้อ แนะนำให้ไป `/check`)

#### R1.3: Skill `/check`
- **Directory**: `.agents/skills/check/SKILL.md` และ `.claude/skills/check/SKILL.md`
- **Behavior & Contract**:
  1. โหลดบริบทจาก `blueprint.md` ใน Active Run
  2. รัน Multi-lane Verification Matrix (Typecheck, Lint, Test Suites, Smoke/Manual checks)
  3. บันทึกผลการตรวจรับและหลักฐานใน `## 5. Verification Evidence` ใน `blueprint.md`
  4. อัปเดต `current-stage.md` เป็น `check` (เมื่อผ่านเกณฑ์ แนะนำให้ไป `/complete`)

#### R1.4: Skill `/complete`
- **Directory**: `.agents/skills/complete/SKILL.md` และ `.claude/skills/complete/SKILL.md`
- **Behavior & Contract**:
  1. ตรวจสอบว่า Checklist ครบถ้วน (`[x]`) และ Verification Evidence ผ่าน 100%
  2. บันทึก Release Digest และ Changelog ใน `## 6. Release & Handoff` ใน `blueprint.md`
  3. **กฎเหล็ก (Strict Rule):** ไม่มีการ Auto-generate `report.html` หรือ `60-report.html`
  4. ดำเนินการ Git Commit, Merge เข้า Base Branch (`main`/`master`) อย่างปลอดภัย
  5. ปิด Active Run ใน `devflow/context/current-stage.md` (ปรับเป็น `Idle`)

---

### REQ-2: ยกเลิกการ Auto-generate `report.html` และสร้าง Standalone Command

#### R2.1: ปรับปรุง Mainline เดิม (Deep-Track)
- แก้ไข `.agents/skills/60-report/SKILL.md` และ `.claude/skills/60-report/SKILL.md`
- แก้ไข `.agents/skills/70-release/SKILL.md` และ `.claude/skills/70-release/SKILL.md`
- **พฤติกรรมใหม่:** สร้างเฉพาะ `60-report.md` เท่านั้น ยกเลิกการสร้าง `60-report.html` อัตโนมัติ

#### R2.2: สร้าง Standalone Command `/report:html`
- **Directory**: `.agents/skills/report-html/SKILL.md` และ `.claude/skills/report-html/SKILL.md`
- **Script**: `scripts/report-html.ts` (หรือ executable runner)
- **พฤติกรรม**: อ่าน `blueprint.md` (ของ Fast-Track) หรือ `60-report.md` (ของ Deep-Track) แล้วแปลงเป็น Standalone Interactive HTML Report เฉพาะเมื่อผู้ใช้เรียกใช้คำสั่งนี้เท่านั้น

---

### REQ-3: ปรับปรุง Intent Router (`/devflow`), Help, และ Project Documentation

#### R3.1: อัปเดต Router (`devflow`)
- ปรับปรุง `.agents/skills/devflow/SKILL.md` และ `.claude/skills/devflow/SKILL.md`
- เพิ่ม Intent Classification & Routing Matrix:
  - `"Spec new feature / fast track"` ➔ `/spec` (หรือ `/feature`)
  - `"Fix bug / quick fix"` ➔ `/fix` (หรือ `/spec`)
  - `"Implement tasks"` ➔ `/implement`
  - `"Check code / QA review"` ➔ `/check`
  - `"Complete run & merge"` ➔ `/complete`
  - `"Generate HTML report"` ➔ `/report:html`
  - `"Deep epic / architectural discovery"` ➔ `00-discover` / `10-define`
- ปรับ State Inspection: ถ้า Active Run เป็น Fast-Track (`blueprint.md`) ให้อ่านและแนะนำ Stage ถัดไปในลูป 4 ขั้นตอน

#### R3.2: อัปเดต `AGENTS.md` และ `CLAUDE.md`
- บันทึกภาพรวมของสถาปัตยกรรม Dual-Track:
  - **Fast-Track (Blueprint Mode - 4 ขั้นตอน):** `/spec` ➔ `/implement` ➔ `/check` ➔ `/complete` (Single Living Spec `blueprint.md`)
  - **Deep-Track (Architect Mode - 8 ขั้นตอน):** `00` ถึง `70` (Modular Separate Files)
  - **Standalone Reporting:** `/report:html`

---

### REQ-4: Installer Package & Verification Matrix (`npm run check`)

#### R4.1: Template Bundler (`packages/create-nexus-devflow`)
- ปรับปรุง `scripts/prepare-template.ts` ให้รวม Skills ใหม่ (`spec`, `implement`, `check`, `complete`, `report-html`) เข้าไปใน bundle template
- ตรวจสอบว่า `packages/create-nexus-devflow` สามารถ build และ pack ติดตั้งได้อย่างสมบูรณ์

#### R4.2: Routing Evaluations & Tests
- เพิ่ม/ปรับปรุง Evaluation fixtures ใน `evals/routing/` สำหรับคำสั่งใหม่
- รัน `npm run check` ครบทุกขั้นตอน (TypeScript typecheck, static contracts, unit tests, routing evals, packed smoke test) ผ่าน 100%

---

## 3. ข้อจำกัดและกฎความปลอดภัย (Hard Constraints)

1. **Dual-Track Coexistence**: Mainline 8 ขั้นตอนเดิมต้องยังคงใช้งานได้ 100% ไม่ถูกทำลาย
2. **Strict Markdown-Only Default**: Flow ปกติทั้ง Fast-Track และ Deep-Track จะไม่มีการ auto-generate HTML ใดๆ ทั้งสิ้น
3. **Single Living Spec Integrity**: ใน Fast-Track ห้ามสร้างไฟล์ย่อย `10-define.md`, `20-spec.md` ในโฟลเดอร์ run นั้น ให้ใช้ `blueprint.md` เพียงไฟล์เดียว
4. **All Green Verification**: โค้ดและ skills ทั้งหมดต้องผ่าน `npm run check` 100%

---

## 4. เกณฑ์การตรวจรับและการทดสอบ (Acceptance Criteria & Verification Plan)

| ID | เกณฑ์การตรวจรับ (Acceptance Criteria) | วิธีการตรวจสอบ (Verification Method) |
| :--- | :--- | :--- |
| **AC-1** | มี Skills ครบ 4 ขั้นตอนของ Fast-Track (`spec`, `implement`, `check`, `complete`) ทั้งใน `.agents/` และ `.claude/` | ตรวจสอบไฟล์ใน `.agents/skills/` และ `.claude/skills/` |
| **AC-2** | คำสั่ง `/spec` สามารถสร้าง `blueprint.md` ที่มี Section 1-3 ครบถ้วน | ตรวจสอบเนื้อหาและ Template schema ของ `blueprint.md` |
| **AC-3** | คำสั่ง `60-report` และ `/complete` ไม่สร้าง `report.html` หรือ `60-report.html` อัตโนมัติ | ตรวจสอบ Logic ใน Skill definitions |
| **AC-4** | มีคำสั่ง `/report:html` สำหรับแปลง `blueprint.md` / `60-report.md` เป็น HTML แบบ Explicit | ทดสอบเรียกใช้งาน `/report:html` |
| **AC-5** | คำสั่ง `/devflow` สามารถตรวจสอบสถานะ Fast-Track และแนะนำคำสั่งถัดไปได้อย่างถูกต้อง | ตรวจสอบ Logic ใน `devflow/SKILL.md` และ Routing evals |
| **AC-6** | `AGENTS.md` และ `CLAUDE.md` ได้รับการอัปเดตสถาปัตยกรรม Dual-Track ครบถ้วน | ตรวจสอบ `AGENTS.md` |
| **AC-7** | รัน `npm run check` (Typecheck + Static + Routing Evals + Tests) ผ่าน 100% | รัน `npm run check` |

---

## 5. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนวางแผนและจัดเตรียม Checklists (Plan Stage):

```text
/30-plan RUN-015-fast-track-and-living-blueprint
```
