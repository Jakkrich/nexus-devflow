# Phase 30: Implementation Plan

- **Running ID**: `RUN-002-add-onboard-adopt-doctor-skills`
- **Title**: แผนการดำเนินงานสร้าง Setup & Diagnostics Companion Skills (`onboard`, `adopt`, `doctor`) ใน Nexus-DevFlow
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Complexity**: Standard
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วงจรหลักฐานการวางแผน (Planning Loop Evidence)

- **Intent**: แปลงข้อกำหนดใน [20-spec.md](20-spec.md) ออกมาเป็นขั้นตอนการสร้าง Skills, อัปเดต Router, ซิงค์เทมเพลต และตรวจสอบความถูกต้องของระบบ
- **Context**: ศึกษาทฤษฎีและการทำงานของ `/onboard`, `/adopt`, `/doctor` ใน Nexus-Blueprint เพื่อนำมาปรับเข้ากับสถาปัตยกรรม Stage-Based ของ Nexus-DevFlow 2.0
- **Observation**: พบว่า DevFlow ขาด Entry Point สำหรับ Setup Baseline หลังติดตั้ง และขาดเครื่องมือ Diagnostics ตรวจจับสถานะความพร้อมของ Context files
- **Adjustment**: จัดแบ่งออกเป็น 5 Phases โดยให้ความสำคัญกับ Parity ระหว่าง `.agents/skills/` และ `.claude/skills/` และเชื่อมต่อเข้ากับ Router `devflow`
- **Stop Condition**: งานทุก Task มีรายละเอียดไฟล์, ตรรกะการทำงาน, และการกำหนด Test Decision ครบถ้วน
- **Handoff**: ส่งมอบให้ `/40-Implement` นำไปดำเนินการสร้างและแก้ไขไฟล์ตามลำดับอย่างเป็นขั้นตอน

---

## 2. ลำดับขั้นตอนการดำเนินงาน (Phased Execution Plan)

### Phase 1: สร้าง Skill `onboard` (Fresh/Scaffolded Project Setup)

- **Task 1.1: สร้าง `.agents/skills/onboard/SKILL.md`**
  - **ไฟล์**: `.agents/skills/onboard/SKILL.md`
  - **การเปลี่ยนแปลง**: สร้างคำแนะนำการ Setup โปรเจกต์ใหม่:
    - Step 0: ตรวจสอบความปลอดภัย (หากมีโค้ดเยอะอยู่แล้ว แนะนำให้ใช้ `/adopt` แทน)
    - Step 1: ตรวจจับ Stack, Framework, Package Manager, Lockfile
    - Step 2: อัปเดต Commands ใน `AGENTS.md` (dev, build, test, verify) และใส่ Project Name ใน `CLAUDE.md`
    - Step 3: ปรับแต่ง `devflow/context/coding-standards.md` ให้เข้ากับภาษา/เฟรมเวิร์กที่ตรวจพบ
    - Step 4: ตรวจสอบ `.gitignore` และตั้งค่าการจัดการไฟล์ DevFlow (Commit vs Local-Only) พร้อมตรวจเช็ค Tool Adapters
    - Step 5: บันทึกข้อมูลพื้นฐานใน `devflow/context/project-overview.md` และส่งต่อไปยัง `/00-discover`
  - **Test Decision**: `Not Required` (Framework Skill Definition)
  - **การตรวจสอบ**: `npm run check:static`

- **Task 1.2: สร้าง `.claude/skills/onboard/SKILL.md`**
  - **ไฟล์**: `.claude/skills/onboard/SKILL.md`
  - **การเปลี่ยนแปลง**: สร้างคู่มือเวอร์ชัน Claude Code ให้มีเนื้อหาและพฤติกรรม Parity กับ `.agents/skills/onboard/SKILL.md` 100%
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check`

---

### Phase 2: สร้าง Skill `adopt` (Brownfield/Existing Codebase Ingestion)

- **Task 2.1: สร้าง `.agents/skills/adopt/SKILL.md`**
  - **ไฟล์**: `.agents/skills/adopt/SKILL.md`
  - **การเปลี่ยนแปลง**: สร้างกระบวนการ Ingestion โปรเจกต์เดิม:
    - Step 0: ตรวจสอบว่าปลอดภัย ไม่เขียนทับ Context ที่ผู้ใช้กรอกไว้แล้วโดยไม่ได้รับอนุญาต
    - Step 1: Read-only Codebase Survey (สำรวจ Routes, Components, Modules, Database, Tests, Scripts)
    - Step 2: Intent Interview (3-4 คำถามสั้นๆ เพื่อถาม Purpose, Target Users, Known Tech Debt, Roadmap)
    - Step 3: สร้าง `devflow/context/project-overview.md` และ `coding-standards.md` จากโค้ดจริง
    - Step 4: อัปเดต `AGENTS.md` Commands ให้ตรงกับ Scripts จริง
    - Step 5: แนะนำเริ่ม Discovery หรือ Run แรกใน `/10-define`
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

- **Task 2.2: สร้าง `.claude/skills/adopt/SKILL.md`**
  - **ไฟล์**: `.claude/skills/adopt/SKILL.md`
  - **การเปลี่ยนแปลง**: Parity กับ `.agents/skills/adopt/SKILL.md` สำหรับ Claude Code
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check`

---

### Phase 3: สร้าง Skill `doctor` (DevFlow Health Check & Diagnostics)

- **Task 3.1: สร้าง `.agents/skills/doctor/SKILL.md`**
  - **ไฟล์**: `.agents/skills/doctor/SKILL.md`
  - **การเปลี่ยนแปลง**: สร้างระบบตรวจสุขภาพ DevFlow:
    - Step 1: ตรวจสอบความสมบูรณ์ของ Context Files (`project-overview.md`, `coding-standards.md`, `current-stage.md`, `findings.md`)
    - Step 2: ตรวจสอบความสอดคล้องของ Adapters (`.agents/`, `.claude/`)
    - Step 3: ทดสอบคำสั่ง verification/test ใน `AGENTS.md`
    - Step 4: ตรวจสอบ active runs ใน `devflow/runs/` และตรวจจับ Workflow Drift
    - Step 5: สรุปผลการวินิจฉัยและข้อแนะนำแก้ไขอย่างชัดเจน
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

- **Task 3.2: สร้าง `.claude/skills/doctor/SKILL.md`**
  - **ไฟล์**: `.claude/skills/doctor/SKILL.md`
  - **การเปลี่ยนแปลง**: Parity กับ `.agents/skills/doctor/SKILL.md` สำหรับ Claude Code
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check`

---

### Phase 4: อัปเดต Router `devflow`, `AGENTS.md`, `CLAUDE.md`, Template และ Docs

- **Task 4.1: อัปเดต AGENTS.md และ CLAUDE.md**
  - **ไฟล์**: [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md), [CLAUDE.md](file:///d:/Projects/devtools/nexus-devflow/CLAUDE.md)
  - **การเปลี่ยนแปลง**: เพิ่ม `onboard`, `adopt`, `doctor` ลงในตาราง Companion Commands และ Directives
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

- **Task 4.2: อัปเกรด Router Skill (`devflow`)**
  - **ไฟล์**: `.agents/skills/devflow/SKILL.md`, `.claude/skills/devflow/SKILL.md`
  - **การเปลี่ยนแปลง**: เพิ่ม logic ตรวจจับว่าถ้า context ยังว่างหรือเพิ่งติดตั้ง ให้แนะนำ `/onboard` หรือ `/adopt` เป็นอันดับแรก และเพิ่ม `/doctor` ในรายการวินิจฉัย
  - **Test Decision**: `Manual/Command Only`
  - **การตรวจสอบ**: Manual review against routing scenarios

- **Task 4.3: ซิงค์ Package Installer Template**
  - **ไฟล์**: `packages/create-nexus-devflow/template/`
  - **การเปลี่ยนแปลง**: รัน `node packages/create-nexus-devflow/scripts/prepare-template.js` เพื่อซิงค์ไฟล์ skills ใหม่
  - **Test Decision**: `Required`
  - **การตรวจสอบ**: `npm test` และ `npm run test:package`

- **Task 4.4: อัปเดตเอกสารคู่มือ**
  - **ไฟล์**: [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md), [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)
  - **การเปลี่ยนแปลง**: เพิ่มคำอธิบาย `/onboard`, `/adopt`, `/doctor` ในผังการใช้งานและตารางคำสั่ง
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

---

### Phase 5: Verification, Tests & Final Quality Gate

- **Task 5.1: รันชุดทดสอบความถูกต้องทั้งระบบ**
  - **คำสั่ง**: `npm run check`, `npm run check:static`, `npm test`, `npm run test:package`
  - **Test Decision**: `Required`
  - **การตรวจสอบ**: ทุกคำสั่งต้องผ่าน 100% (Green)

---

## 3. ตารางการตัดสินใจเรื่องแบบทดสอบ (Test Decision Table)

| Task ID | งาน | Test Decision | เหตุผล / รูปแบบการตรวจ |
|---|---|---|---|
| **T1.1-1.2** | Skill `onboard` | `Not Required` | Markdown skill contract ตรวจสอบด้วย `npm run check` |
| **T2.1-2.2** | Skill `adopt` | `Not Required` | Markdown skill contract ตรวจสอบด้วย `npm run check` |
| **T3.1-3.2** | Skill `doctor` | `Not Required` | Markdown skill contract ตรวจสอบด้วย `npm run check` |
| **T4.1-4.2** | อัปเดต AGENTS.md & Router `devflow` | `Manual/Command Only` | ตรวจสอบ Routing logic และ Directives |
| **T4.3** | ซิงค์ Installer Template | `Required` | ทดสอบผ่าน Unit Test `npm test` ใน installer |
| **T4.4** | เอกสารประกอบ | `Not Required` | เอกสาร markdown ตรวจสอบด้วย `npm run check:static` |
| **T5.1** | Final Quality Gate | `Required` | รันชุดทดสอบครบทุกระบบ (`check`, `static`, `test`, `test:package`) |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Workflow Recommendation)

```text
/40-implement RUN-002-add-onboard-adopt-doctor-skills
หรือ
40-implement RUN-002-add-onboard-adopt-doctor-skills
```
