# Phase 20: Delivery Specification

- **Running ID**: `RUN-006-standardize-command-naming-and-provider-invocation`
- **Title**: ข้อกำหนดการปรับชื่อเรียกคำสั่งและ Stage เป็นชื่อมาตรฐานทางการ ตัด Alias/ชื่อย่อ และอธิบายการเรียกตาม AI Provider
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาการส่งมอบ (Delivery Contract) สำหรับการปรับปรุงระบบชื่อเรียกคำสั่งและ Stage ทั้งหมดใน Nexus-DevFlow 2.0 ให้เป็น **ชื่อมาตรฐานทางการ (Canonical Name)** เพียงชื่อเดียว ตัด Alias ย่อและ Shorthand ที่สร้างความสับสนออกทั้งหมด และอธิบายแนวทางการเรียกใช้ (Invocation Guideline) แก่ผู้ใช้งานและ AI Coding Agents อย่างชัดเจน โดยอิงตาม AI Provider / Tool ที่ใช้งาน

---

## 2. ข้อกำหนดฟังก์ชันหลัก (Core Functional Requirements)

### REQ-1: กำหนด Canonical Name และตัด Alias/ชื่อย่อ
- ทุก Mainline Stage ต้องถูกอ้างอิงด้วยชื่อมาตรฐานเพียงชื่อเดียว:
  - `00-discover`
  - `10-define`
  - `20-spec`
  - `30-plan`
  - `40-implement`
  - `50-verify`
  - `60-report`
  - `70-release`
- ทุก Companion Command ต้องถูกอ้างอิงด้วยชื่อทางการ:
  - `devflow`, `onboard`, `adopt`, `doctor`, `try`, `rollback`, `ci`, `brief`, `autopilot`, `goal`, `brainstorm`, `research`, `debug`, `prd`, `issue-triage`, `security-review`, `wiki`, `check-for-updates`, `help`
- ตัดการแสดง Semantic Alias หรือ Shorthand ที่สับสน เช่น `(discover, /00-discover)` หรือ `(define, /10-define)` ออกจากการสื่อสารหลัก

### REQ-2: AI Provider Invocation Guideline
- เพิ่มคำอธิบายที่เรียบง่ายและเป็นเอกภาพในทุกเอกสารหลัก (`AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md`):
  - **Canonical Name (ชื่อปกติ)**: เรียกใช้โดยตรง เช่น `00-discover`, `devflow` (รองรับทุกระบบและข้อความแจ้งสั่งการ)
  - **Slash Prefix (`/`)**: สำหรับเครื่องมือที่รองรับ Slash Command เช่น Claude Code, Google Antigravity, Gemini CLI (เช่น `/00-discover`, `/devflow`)
  - **Dollar Prefix (`$`)**: สำหรับ OpenAI Codex CLI หรือเครื่องมือตระกูล Skill Invocation (เช่น `$00-discover`, `$devflow`)

### REQ-3: ปรับปรุงตาราง Invocation Reference ใน AGENTS.md & CLAUDE.md
- ปรับโครงสร้างตารางคำสั่งใน `AGENTS.md` และ `CLAUDE.md` ให้มีคอลัมน์มาตรฐาน:
  | Stage / Category | Canonical Name | Slash Prefix (`/`) | Codex Format (`$`) | Purpose / Action |
- ลบคอลัมน์ Semantic Alias และ Shorthands ที่ซ้ำซ้อนออก

### REQ-4: ปรับปรุงตารางและเนื้อหาใน README.md & README.th.md
- ปรับหัวข้อ Timeline Workflow และ Command List ให้แสดง Canonical Name เป็นแกนหลัก
- เพิ่มกล่องคำแนะนำ (Note/Tip) สรุปเรื่องการเลือกใส่ Prefix ตาม AI Provider ที่ใช้งาน

### REQ-5: อัปเดต SKILL.md ใน .agents/skills/ และ .claude/skills/
- ปรับ Usage block ใน `SKILL.md` ของ Mainline Stages และ Companion Commands ให้แสดง Canonical Name เป็นหลัก
- อัปเดต Next Workflow Recommendation ในทุก Skill ให้อ้างอิงด้วย Canonical Name

### REQ-6: ซิงค์ Package Template & ตรวจสอบคุณภาพ
- ซิงค์ไฟล์ที่ปรับปรุงทั้งหมดเข้าสู่ `packages/create-nexus-devflow/template/` ผ่าน `npm run prepare:template`
- ผ่านการตรวจสอบความถูกต้องทั้งหมด 100%:
  - `npm run check:static`
  - `npm run check`
  - `npm test`
  - `npm run test:package`

---

## 3. สิ่งที่อยู่นอกขอบเขต (Explicit Out-of-Scope)

- ไม่ลบโฟลเดอร์ Skill ภายใน `.agents/skills/` ที่จำเป็นต่อการทำงานของระบบ Routing
- ไม่เปลี่ยน Core Logic หรือ Pipeline กฎเกณฑ์ของแต่ละ Stage (00 ถึง 70)

---

## 4. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-1** | Canonical Name Uniformity | เอกสาร `AGENTS.md`, `CLAUDE.md`, `README.md`, และ `README.th.md` แสดง Mainline Stages และ Companion Commands ด้วย Canonical Name เท่านั้น ไม่มี Alias ย่อปะปน |
| **AC-2** | Provider Invocation Clarity | มีส่วนอธิบาย Invocation Rule ตาม AI Provider (Normal, `/`, `$`) ไว้อย่างชัดเจน เข้าใจง่าย |
| **AC-3** | Skill Adapters Alignment | ไฟล์ `SKILL.md` ใน `.agents/skills/` และ `.claude/skills/` แสดงรูปแบบ Usage และ Next Workflow ตรงตาม Canonical Name |
| **AC-4** | Template Sync Parity | ไฟล์ใน `packages/create-nexus-devflow/template/` ซิงค์ตรงกับโปรเจกต์หลัก 100% |
| **AC-5** | Test Suite Pass | `npm run check:static`, `npm run check`, `npm test`, `npm run test:package` ผ่านทั้งหมด 100% |

---

## 5. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
30-plan RUN-006-standardize-command-naming-and-provider-invocation
```
