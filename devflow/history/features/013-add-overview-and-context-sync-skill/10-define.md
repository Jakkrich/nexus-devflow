# Phase 10: Define Contract

- **Running ID**: `RUN-013-add-overview-and-context-sync-skill`
- **Title**: พัฒนา Skill `/overview` และกลไก Living Context Sync สำหรับ Nexus-DevFlow
- **Source Discovery**: [DISC-20260820-013-add-overview-and-context-sync-skill](../../discoveries/DISC-20260820-013-add-overview-and-context-sync-skill/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-20
- **Owner**: DevFlow Core Framework Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จาก Discovery `DISC-20260820-013` พบว่า DevFlow ขาดกลไกการอัปเดตไฟล์ Context หลัก (`project-overview.md`) หลังจากผ่านขั้นตอน Onboarding ไปแล้ว ทำให้เมื่อโปรเจกต์เติบโตขึ้น ข้อมูลสถาปัตยกรรมและ Data Model กลายเป็น Stale Context 

เป้าหมายของ **`RUN-013`** คือการสร้าง **`/overview` Skill** ให้เป็นเครื่องมือมาตรฐานสำหรับตรวจจับและซิงค์ข้อมูลจริงใน Codebase + ประวัติ Runs ที่ส่งมอบแล้ว เพื่อ Refresh `devflow/context/project-overview.md` และเชื่อมโยงเข้ากับวงจร `70-release`

---

## 2. ขอบเขตงานที่ต้องดำเนินการ (In-Scope)

1. **สร้าง Skill `/overview` Adapter**:
   - `.agents/skills/overview/SKILL.md` (สำหรับ Antigravity และ OpenAI Codex)
   - `.claude/skills/overview/SKILL.md` (สำหรับ Claude Code)
2. **กลไกการทำงานของ `/overview` (Sync & Synthesis)**:
   - สแกน Manifest (`package.json`, `requirements.txt`, ฯลฯ) และตรวจจับ Stack / Dependencies
   - สำรวจโครงสร้าง Directory และ Entry points หลัก
   - รวบรวม Data Models / Schemas จริงในโปรเจกต์
   - อ่าน `devflow/history/HISTORY.md` และสรุป Shipped Capabilities จาก Runs ที่สำเร็จแล้ว
   - สังเคราะห์และเขียนทับ `devflow/context/project-overview.md` ให้สดใหม่ตามมาตรฐาน
3. **การเชื่อมโยงระบบ (Integration & Registry)**:
   - อัปเดต `AGENTS.md` และ `CLAUDE.md` เพื่อเพิ่มคำสั่ง `overview` ในสารบัญ Companion Commands
   - อัปเดต `70-release/SKILL.md` เพื่อแนะนำให้รัน `/overview` ในขั้นตอนปิดงาน Release
   - อัปเดต Package Template ใน `packages/create-nexus-devflow/` ให้รวม skill ใหม่นี้ด้วย
4. **การทดสอบและตรวจสอบความถูกต้อง (Verification)**:
   - ทดสอบรัน `npm run check` และ static contract tests เพื่อให้มั่นใจว่า Skill ใหม่ผ่านเกณฑ์ 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แก้ไขรูปแบบ Stage Mainline 00-70 ที่มีอยู่เดิม
- ไม่ลบข้อมูลบันทึกความตั้งใจเดิมใน `project-overview.md` เว้นแต่โค้ดจริงจะเปลี่ยนแปลงไปแล้ว
- ไม่แก้ไข Logic ภายใน Package อื่นๆ นอกเหนือจาก DevFlow Tooling

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-013`** | `add-overview-and-context-sync-skill` | สร้าง Skill `/overview` ครบทั้ง 2 Adapter, เชื่อมโยงกับ `70-release` และ `AGENTS.md`, บันทึกลง Template Package พร้อมผ่านการตรวจสอบระบบ |

---

## 5. เกณฑ์ความสำเร็จและการตรวจรับ (Acceptance Criteria)

1. มีไฟล์ `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md` ที่มีคำอธิบายกระบวนการสแกนและซิงค์บริบทอย่างสมบูรณ์
2. เมื่อเรียกใช้คำสั่ง `/overview` ตัว AI สามารถสแกนโปรเจกต์และสร้าง/อัปเดต `devflow/context/project-overview.md` ได้อย่างถูกต้องครบถ้วน
3. `AGENTS.md`, `CLAUDE.md`, และ `70-release` มีการอ้างอิงคำสั่ง `overview` อย่างเป็นทางการ
4. รัน `npm run check` และชุดทดสอบทั้งหมดผ่าน 100%

---

## 6. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนเขียน Technical Specification:

```text
/20-spec RUN-013-add-overview-and-context-sync-skill
```
