# Phase 10: Define Contract

- **Running ID**: `RUN-015-fast-track-and-living-blueprint`
- **Title**: เพิ่มระบบ Fast-Track (Blueprint Mode) 4 ขั้นตอน, Single Living Spec (`blueprint.md`) และยกเลิกการออก `report.html` อัตโนมัติใน DevFlow
- **Source Discovery**: [devflow/research/brainstorm-devflow-stage-compression.md](../../research/brainstorm-devflow-stage-compression.md)
- **Architecture Decisions**: [devflow/research/decision-disable-auto-html-report.md](../../research/decision-disable-auto-html-report.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-20
- **Owner**: DevFlow Core Framework Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

Nexus-DevFlow ในปัจจุบันมี Mainline แบบ 8 ขั้นตอน (`00-discover` ถึง `70-release`) ซึ่งให้ความละเอียดและ Traceability สูงมาก แต่มี **Overhead & Token Cost สูงเกินไป** สำหรับฟีเจอร์ทั่วไป, การแก้ไข Bug เล็กๆ, หรือการทำงานในชีวิตประจำวัน (ต้องสร้างไฟล์ Markdown 8-10 ไฟล์ต่อ 1 งาน)

เป้าหมายของ **`RUN-015`** คือการสร้าง **Dual-Track Workflow Engine** ให้กับ Nexus-DevFlow:
1. **🏎️ เพิ่ม Fast-Track (Blueprint Mode - 4 ขั้นตอน):** `/spec` ➔ `/implement` ➔ `/check` ➔ `/complete` ที่ขับเคลื่อนด้วย **Single Living Spec (`blueprint.md`)** เพียงไฟล์เดียว
2. **📄 Single Living Spec Standard:** พัฒนาโครงสร้าง `blueprint.md` ที่รวบรวม Specification, Plan, Checklist, Implementation Log, Verification Evidence, และ Release Handoff ไว้ในไฟล์เดียว
3. **🚫 ยกเลิก Auto-generate HTML Report:** ยกเลิกการสร้าง `report.html` หรือ `60-report.html` แบบอัตโนมัติในทุกขั้นตอน โดยแยกเป็นคำสั่งเฉพาะ `/report:html` ให้เรียกใช้เมื่อต้องการเท่านั้น
4. **🧭 ปรับปรุง Router (`/devflow`):** ให้รองรับการนำทางทั้ง Fast-Track และ Deep-Track ได้อย่างชาญฉลาด

---

## 2. ขอบเขตงานที่ต้องดำเนินการ (In-Scope)

### ส่วนที่ 1: พัฒนาและเพิ่ม Fast-Track Skills (`.agents/` และ `.claude/`)
1. **Skill `/spec`** (รวมถึง alias `/feature`, `/fix`):
   - รวบรวมกระบวนการ `00-discover + 10-define + 20-spec + 30-plan`
   - จัดการจองเลข `RUN-xxx`, ตั้งชื่อ Branch, วิเคราะห์ Scope, Acceptance Criteria, TDD Strategy, และสร้าง Implementation Checklist ใน `devflow/runs/RUN-xxx-{slug}/blueprint.md`
2. **Skill `/implement`**:
   - ดำเนินการตาม Task Checklist ใน `blueprint.md` ทีละข้อ พร้อมแนวทาง TDD
   - บันทึกความคืบหน้าและการเปลี่ยนแปลงใน `## 4. Implementation Record`
3. **Skill `/check`**:
   - รัน Senior QA Review, Multi-lane verification (Typecheck, Lint, Test suites)
   - บันทึกหลักฐานผลการตรวจสอบใน `## 5. Verification Evidence` ใน `blueprint.md`
4. **Skill `/complete`**:
   - Safety Pass ตรวจสอบความพร้อมรอบสุดท้าย
   - บันทึก Release Digest ใน `## 6. Release & Handoff` ใน `blueprint.md`
   - จัดการ Git Commit, Merge เข้า Base Branch และปิด Run อย่างปลอดภัย (ไม่มีการสร้าง HTML อัตโนมัติ)

### ส่วนที่ 2: ยกเลิกการ Auto-generate `report.html` และสร้าง Standalone Command
1. **ปรับปรุง Mainline เดิม (Deep-Track)**:
   - แก้ไข `60-report` และ `70-release` ใน `.agents/skills/` และ `.claude/skills/` ให้ไม่สร้าง `60-report.html` แบบอัตโนมัติ
2. **สร้าง Standalone Report Command**:
   - พัฒนา Skill / Command `/report:html` (และ CLI script ที่เกี่ยวข้อง) สำหรับแปลง `blueprint.md` หรือ `60-report.md` เป็น Standalone HTML Report เฉพาะเมื่อผู้ใช้เรียกใช้แบบ Explicit

### ส่วนที่ 3: ปรับปรุง Intent Router (`/devflow`), Help และ Routing Evals
1. **ปรับปรุง Router (`devflow`)**:
   - อัปเดต `.agents/skills/devflow/SKILL.md` และ `.claude/skills/devflow/SKILL.md` ให้นำทางผู้ใช้ไปยังทั้ง Fast-Track (`/spec`, `/implement`, `/check`, `/complete`) และ Deep-Track (`00-70`)
2. **อัปเดต Routing Evals & Verification**:
   - เพิ่ม Intent Classification tests สำหรับคำสั่งใหม่ใน `evals/routing/`
   - รัน `npm run check` (Typecheck, Static contracts, Package tests, Routing evals) ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่ลบหรือทำลาย Mainline 8 ขั้นตอนเดิม (`00-discover` ถึง `70-release`) สำหรับผู้ใช้หรือโปรเจกต์ที่ต้องการ Deep-Track
- ไม่สร้าง Breaking Change ต่อประวัติ Run เดิมใน `devflow/runs/RUN-001` ถึง `RUN-014`
- ไม่เปลี่ยนการสื่อสารหลักและภาษาของ Markdown Artifacts (ยังคงเป็นภาษาไทย `th` ตามมาตรฐาน)

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-015`** | `fast-track-and-living-blueprint` | ติดตั้งระบบ Fast-Track (4 ขั้นตอน), Single Living Spec `blueprint.md`, ยกเลิก Auto HTML Report, และปรับปรุง Router ให้สมบูรณ์พร้อมผ่าน `npm run check` 100% |

---

## 5. เกณฑ์ความสำเร็จและการตรวจรับ (Acceptance Criteria)

1. มี Skills ครบทั้ง 4 ขั้นตอนของ Fast-Track (`spec`, `implement`, `check`, `complete`) ใน `.agents/skills/` และ `.claude/skills/`
2. โครงสร้างโฟลเดอร์ Fast-Track ผลิตเฉพาะไฟล์ `devflow/runs/RUN-xxx-{slug}/blueprint.md` เพียงไฟล์เดียวตลอดทั้ง Run
3. ขั้นตอน `60-report` และ `/complete` ไม่มีพฤติกรรม Auto-generate `report.html` หรือ `60-report.html` อีกต่อไป
4. มีคำสั่งแยก `/report:html` สำหรับสร้าง HTML เมื่อผู้ใช้ต้องการ
5. คำสั่ง `/devflow` สามารถแนะนำสถานะและเส้นทาง Fast-Track ได้อย่างถูกต้อง
6. รันคำสั่ง `npm run check` ใน `nexus-devflow` ผ่านครบทุกขั้นตอน 100%

---

## 6. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนเขียนข้อกำหนดทางเทคนิค (Specification):

```text
/20-spec RUN-015-fast-track-and-living-blueprint
```
