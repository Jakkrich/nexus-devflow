# Phase 20: Delivery Specification

- **Running ID**: `RUN-013-add-overview-and-context-sync-skill`
- **Title**: ข้อกำหนดทางเทคนิคในการสร้าง Skill `/overview` และระบบ Living Context Sync
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-20
- **Owner**: DevFlow Core Framework Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้เป็นสัญญาข้อกำหนดทางเทคนิค (Delivery Contract) สำหรับการพัฒนารอบ **`RUN-013`** เพื่อสร้างและติดตั้ง **`/overview` Skill** เข้าสู่ระบบ Nexus-DevFlow ทั้งฝั่ง Agent Adapters, Template Package, และเอกสารกำกับมาตรฐาน เพื่อให้โปรเจกต์มีวงจรการซิงค์และรักษาความสดใหม่ของไฟล์ `devflow/context/project-overview.md` ตลอดวงจรชีวิตการพัฒนา

---

## 2. ข้อกำหนดฟังก์ชันการทำงานหลัก (Core Functional Requirements)

### REQ-1: สร้าง Skill Overview สำหรับทั้งสองค่าย Agent (Multi-AI Adapters)
- **R1.1 Adapter `.agents/skills/overview/SKILL.md` (สำหรับ Antigravity & Codex)**:
  - Frontmatter มี `name: overview` และ description ระบุ `[Devflow]` นำหน้า
  - ระบุขั้นตอนการทำงาน (Process Steps) แบบชัดเจน 4 ขั้นตอน:
    1. **Step 1 - Scan Reality (Codebase Survey)**: สำรวจไฟล์ Manifest (`package.json`, `pyproject.toml`, ฯลฯ), Dependencies, สถาปัตยกรรม Folder, และ Models/Schemas
    2. **Step 2 - Scan History (Delivery Survey)**: อ่าน `devflow/history/HISTORY.md` และสรุปฟีเจอร์ที่ Released ไปแล้วจากโฟลเดอร์ `devflow/runs/`
    3. **Step 3 - Synthesize Project Overview**: สังเคราะห์ข้อมูลลงใน `devflow/context/project-overview.md` โดยคงโครงสร้างหัวข้อมาตรฐาน (Project Name, Purpose, Tech Stack, Key Modules, Concrete Data Models, Shipped Capabilities, Verified Commands)
    4. **Step 4 - Review & Report**: สรุปสิ่งที่มีการเปลี่ยนแปลง และแจ้งเตือนหากมีส่วนที่ต้องยืนยัน
  - กฎการทำงาน: ห้ามสร้างข้อมูลเท็จ (No fictional data), สะท้อนความจริงจากโค้ด (Reflect reality), รักษาบันทึกที่มีอยู่แล้ว
- **R1.2 Adapter `.claude/skills/overview/SKILL.md` (สำหรับ Claude Code)**:
  - มีโครงสร้างและเนื้อหาสอดคล้องกับฝั่ง `.agents/` 100%

### REQ-2: การเชื่อมโยงคำสั่งและการลงทะเบียน (Command Registry & Lifecycle Hook)
- **R2.1 `AGENTS.md` และ `CLAUDE.md`**:
  - เพิ่ม `overview` เข้าในตาราง **Public Companion Commands** และ **Invocation Reference**
  - กำหนดให้ Canonical Name คือ `overview`, คำสั่งคือ `/overview` (Claude/Antigravity) และ `$overview` (Codex)
- **R2.2 สเตจ `70-release` (`.agents/skills/70-release/SKILL.md` & `.claude/skills/70-release/SKILL.md`)**:
  - เพิ่มคำแนะนำในหัวข้อ Next Workflow / Related Commands ให้สามารถเรียกใช้ `/overview` เพื่อ Sync Context หลังการ Release สำเร็จ

### REQ-3: การอัปเดต Template และ Scripts ใน Framework
- **R3.1 `packages/create-nexus-devflow/`**:
  - ตรวจสอบให้แน่ใจว่า script เตรียม Template (`scripts/prepare-template.js` หรือ copy script) นำ `overview` skill เข้าไปอยู่ใน package build ด้วย
- **R3.2 Manifest & Checks**:
  - อัปเดต `agent-bundle.manifest.json` ให้มีรายการ skill `overview`
  - ตรวจสอบ script ตรวจสอบความถูกต้อง (`scripts/check-devflow.mjs`, `scripts/validate-framework.mjs`) เพื่อให้แน่ใจว่าผ่านทุกการทดสอบ

---

## 3. ข้อจำกัดและกฎความปลอดภัย (Hard Constraints)

1. **Deterministic & Safe**: การรัน `/overview` ต้องไม่ลบหรือทำลาย Custom Notes หรือ Business Logic สำคัญที่ผู้ใช้เขียนไว้ใน `project-overview.md`
2. **Offline & Self-Contained**: การสแกนข้อมูลใช้ Tool File Reading ภายใน Workspace เท่านั้น ไม่ต้องพึ่งพา External Network Services
3. **Multi-Agent Parity**: เนื้อหาและคำสั่งใน `.agents/` และ `.claude/` ต้องตรงกันทุกประการ

---

## 4. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แก้ไขขั้นตอนของ Mainline Stages 00-70 ที่มีอยู่เดิม
- ไม่เปลี่ยนแปลงโครงสร้างของ `project-overview.md` จนผิดไปจาก Schema มาตรฐาน

---

## 5. เกณฑ์การตรวจรับและการทดสอบ (Acceptance Criteria & Verification Plan)

| ID | เกณฑ์การตรวจรับ (Acceptance Criteria) | วิธีการตรวจสอบ (Verification Method) |
| :--- | :--- | :--- |
| **AC-1** | มีไฟล์ `.agents/skills/overview/SKILL.md` และ `.claude/skills/overview/SKILL.md` ครบถ้วน | ตรวจสอบไฟล์ใน Disk และทดสอบอ่านเนื้อหา |
| **AC-2** | คำสั่ง `overview` ถูกระบุใน `AGENTS.md`, `CLAUDE.md`, และ `70-release` | ตรวจสอบเนื้อหาในไฟล์ที่เกี่ยวข้อง |
| **AC-3** | `agent-bundle.manifest.json` และ Package Template มี `overview` ครบ | รัน `npm run check:static` และ `npm test` |
| **AC-4** | ทดสอบรันคำสั่งตรวจสอบภาพรวมโครงการ | รัน `npm run check` ผลลัพธ์ต้องผ่าน (PASS) ทั้งหมด |

---

## 6. คำสั่งถัดไป (Next Workflow Recommendation)

เมื่อตรวจรับข้อกำหนดทางเทคนิคนี้เรียบร้อยแล้ว ให้เข้าสู่ขั้นตอนวางแผนงาน (Plan Stage):

```text
/30-plan RUN-013-add-overview-and-context-sync-skill
```
