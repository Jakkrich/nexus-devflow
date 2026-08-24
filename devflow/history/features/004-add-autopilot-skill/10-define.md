# Phase 10: Define Contract

- **Running ID**: `RUN-004-add-autopilot-skill`
- **Title**: เพิ่มระบบคำสั่ง `autopilot` ใน Nexus-DevFlow (Autonomous Bounded Execution Loop)
- **Source Discovery**: [DISC-20260818-001-autopilot-workflow-for-devflow](../../discoveries/DISC-20260818-001-autopilot-workflow-for-devflow/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการสำรวจใน [Phase 00 (DISC-20260818-001)](../../discoveries/DISC-20260818-001-autopilot-workflow-for-devflow/00-discover.md) พบว่า DevFlow 2.0 มีความพร้อมอย่างสมบูรณ์สำหรับการเพิ่มคำสั่ง **`autopilot`** เพื่อช่วยให้ผู้ใช้สามารถสั่ง AI ให้ดำเนินงานแบบ **Bounded Autonomous Loop** สำหรับฟีเจอร์หรือบั๊กฟิกซ์ 1 รัน โดยมีเป้าหมายหลักดังนี้:

1. **ลดภาระการกดยืนยันระหว่างทาง**: สำหรับงานที่มีสโคปชัดเจน ให้ AI ดำเนินการต่อจาก Spec ➔ Plan ➔ Implement ➔ Verify ➔ Report ได้อย่างลื่นไหล
2. **รักษา Safety Boundaries & Hard Stops 100%**: กำหนดกติกาความปลอดภัยที่เข้มงวด (ห้าม Merge เข้า Main, ห้าม Push, ห้าม Deploy, ห้ามทำลายข้อมูล)
3. **ระบบ Checkpoint Commits**: บันทึก Git Commit บน Working Branch ทุกครั้งที่ผ่านแต่ละ Unit
4. **ส่งมอบ Review Packet Dashboard**: จบด้วยรายงานสรุปผลพร้อมรันคู่มือ `/try` เพื่อให้มนุษย์ตัดสินใจก่อนทำ Release

---

## 2. ขอบเขตงาน (In-Scope)

### Phase 1: ออกแบบและสร้าง Skill `autopilot` สำหรับ DevFlow 2.0
- สร้าง `.agents/skills/autopilot/SKILL.md` และ `.claude/skills/autopilot/SKILL.md`
- ออกแบบวงจร 7 ขั้นตอนของ Autopilot:
  - Step 1: Preflight & Safety Checks
  - Step 2: Spec Formulation / Resume (`20-spec.md`)
  - Step 3: Branch Preparation & Task Planning (`30-plan.md`)
  - Step 4: Step-by-Step Implementation พร้อม Checkpoint Commits (`40-implement.md`)
  - Step 5: QA Verification & Multi-lane Testing (`50-verify.md`)
  - Step 6: Targeted Audit & P0/P1 Finding Repairs (`findings.md`)
  - Step 7: Delivery Report Packaging (`60-report.md`, `60-report.html`)
- บันทึก Hard Stops และขอบเขตกฎความปลอดภัยอย่างเข้มงวด

### Phase 2: ผสานรวมระบบ, Router และ Multi-Agent Adapters
- อัปเดต [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) และ [CLAUDE.md](file:///d:/Projects/devtools/nexus-devflow/CLAUDE.md) เพิ่ม `autopilot` ในตาราง Companion Commands
- ปรับปรุง Router Skill [devflow](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md) ให้รู้จักคำสั่ง `autopilot`
- ซิงค์ Adapters ผ่าน `npm run sync:adapters` (ได้ครบ 104 skills)

### Phase 3: ซิงค์ Package Template และอัปเดตคู่มือ
- ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
- อัปเดตคู่มือ [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md), [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)

### Phase 4: Verification & Quality Gate
- รัน `npm run check:static`, `npm run check`, `npm test`, และ `npm run test:package` ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แทนที่ Mainline Workflow ปกติ (ผู้ใช้ยังคงสามารถรันแยกทีละ stage ได้ตามปกติ)
- ไม่อนุญาตให้ Autopilot ทำการ Push, Merge, หรือ Deploy โดยเด็ดขาด
- ไม่รองรับการ Rollback แบบ Autopilot (การย้อนกลับต้องผ่าน Human-Review Gate เสมอ)

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-004`** | `add-autopilot-skill` | สร้างและติดตั้ง Companion Skill `autopilot` พร้อมผสานรวม Router, Adapters, Template, และเอกสารทั้งหมด |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. มีไฟล์ `SKILL.md` สมบูรณ์สำหรับ `autopilot` ทั้งใน `.agents/skills/` และ `.claude/skills/` (Parity 100%)
2. `AGENTS.md`, `CLAUDE.md`, และ `devflow` Router อัปเดตครอบคลุมคำสั่ง `autopilot`
3. Skill มีการระบุ Hard Stops ชัดเจน ไม่ทำลายข้อมูล และไม่ทำ Git push/merge
4. ผ่านชุดทดสอบทั้งหมด (`check:static`, `check`, `test`, `test:package`) 100%

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/20-spec RUN-004-add-autopilot-skill
หรือ
20-spec RUN-004-add-autopilot-skill
```
