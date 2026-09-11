# Phase 20: Delivery Specification

- **Running ID**: `RUN-001-align-devflow-blueprint`
- **Title**: ข้อกำหนดการปรับปรุงสถาปัตยกรรม DevFlow 2.0 ให้สอดคล้องกับ Blueprint (Universal Invocation & Codex Compatibility)
- **Source Define**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และภาพรวมข้อกำหนด (Specification Overview)

ยกระดับความสามารถในการทำงานร่วมกับ AI Coding Agents ทุกค่าย (โดยเฉพาะ OpenAI Codex) และปรับรูปแบบการเรียกคำสั่งให้เป็นมิตรต่อผู้ใช้งานยิ่งขึ้น โดยแปลงจากระบบที่พึ่งพา Slash Command เพียงอย่างเดียว ไปสู่ระบบ **Universal Invocation** (รองรับทั้งชื่อปกติ `00-discover`, Semantic Aliases `discover`, Codex Syntax `$00-discover`, และ Slash `/00-discover`) พร้อมทั้งปรับปรุง [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) ให้มีข้อมูลครบถ้วนในตัวเอง (Self-Contained) ตามสถาปัตยกรรมที่พิสูจน์แล้วของ Nexus-Blueprint

---

## 2. ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements)

### REQ-1: ปรับปรุง AGENTS.md ให้เป็น Self-Contained Blueprint Pattern
- **REQ-1.1**: ต้องมีส่วนหัวและคำอธิบายบริบทโปรเจกต์ที่ชัดเจน พร้อมตารางเชื่อมโยงไฟล์ Source of Truth ใน `devflow/context/` (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `findings.md`, `current-stage.md`)
- **REQ-1.2**: ต้องมีหมวด **Tool Invocation & Agent Execution Rules** ที่ระบุพฤติกรรมการเรียกใช้งานสำหรับ:
  - OpenAI Codex (`$00-discover`, `$spec`, `00-discover`, plain prompt)
  - Google Antigravity & Claude Code (`/00-discover`, `/devflow`, plain prompt)
  - Generic / CLI Agents (Aider, Cursor, Windsurf)
- **REQ-1.3**: ต้องมี **Mandatory Tool Reading Directive** ระบุชัดเจนว่า Agent ที่ไม่มีระบบ background skill injection ในตัว จะต้องใช้ File Viewing Tool เปิดอ่าน `.agents/skills/<skill>/SKILL.md` เสมอเมื่อเริ่มทำงานในแต่ละ stage
- **REQ-1.4**: ต้องมี **Inline Stage Summaries** ครบทั้ง 8 Mainline Stages (`00-discover` ถึง `70-release`) อธิบาย Purpose, Key Input/Output Artifacts, และ Exit Gates อย่างกระชับใน `AGENTS.md`
- **REQ-1.5**: ต้องมี **Inline Companion Commands Summary** สรุปคำสั่งเสริม (`goal`, `brainstorm`, `research`, `debug`, `prd`, `issue-triage`, `security-review`, `wiki`, `check-for-updates`, `help`, `devflow`)

### REQ-2: รองรับ Universal Command & Naming Schemes
- **REQ-2.1**: รองรับการเรียก Mainline Stages และ Companion Commands ด้วยชื่อปกติ (Normal Names) โดยไม่ต้องมีเครื่องหมาย Slash:
  - `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, `70-release`
  - `devflow`, `help`, `debug`, `research`, `goal`, `brainstorm`, `prd`, `issue-triage`, `security-review`, `wiki`
- **REQ-2.2**: รองรับ Semantic Aliases ที่ตรงกับความคุ้นเคยของผู้ใช้และ LLM:
  - `discover` -> `00-discover`
  - `define` -> `10-define`
  - `spec` -> `20-spec`
  - `plan` -> `30-plan`
  - `implement` / `build` -> `40-implement`
  - `verify` / `test` / `check` -> `50-verify`
  - `report` -> `60-report`
  - `release` / `ship` -> `70-release`
  - `status` -> `devflow`
- **REQ-2.3**: รักษา Backward Compatibility โดยคำสั่ง Slash แบบเดิม (`/00-discover`, `/20-spec`, `/devflow`) ยังคงทำงานได้ 100%

### REQ-3: ยกระดับ Flagship Guide & Router (`devflow`)
- **REQ-3.1**: ปรับปรุงคำแนะนำและตรรกะใน [.agents/skills/devflow/SKILL.md](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md) และ `.claude/skills/devflow/SKILL.md`
- **REQ-3.2**: เพิ่มความสามารถ State-Aware Inspection: เมื่อถูกเรียกโดยไม่มี arguments ให้ตรวจสอบไฟล์ `devflow/context/current-stage.md` และสารบัญใน `devflow/runs/` เพื่อสรุปสถานะปัจจุบันและแนะนำ Next Command ที่แม่นยำ

### REQ-4: ซิงค์ Adapter Layer & Package Installer Template
- **REQ-4.1**: อัปเดตไฟล์เทมเพลตใน `packages/create-nexus-devflow/template` ให้ซิงค์กับ `AGENTS.md` และโฟลเดอร์ `.agents/skills/` ที่ปรับปรุงใหม่
- **REQ-4.2**: ตรวจสอบการทำงานของ `packages/create-nexus-devflow/lib/update.js` และ `scripts/prepare-template.js` ให้จัดการคัดลอกไฟล์ได้อย่างถูกต้อง

### REQ-5: ปรับปรุงคู่มือและเอกสารประกอบ (Documentation)
- **REQ-5.1**: ปรับปรุง [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md) และ [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md) ให้สะท้อน Universal Invocation และ Codex Directives
- **REQ-5.2**: อัปเดต [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md) และ [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md)

---

## 3. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | เงื่อนไขการยอมรับ (Acceptance Criteria) | วิธีการตรวจวัด (Verification Method) |
|---|---|---|
| **AC-1** | [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) มีขนาดครอบคลุม (~6-8 KB) บรรจุ Context Files, Tool Execution Rules, และ Inline Summaries ทุก Stage ครบถ้วน | ตรวจสอบเนื้อหาไฟล์และรัน `npm run check:static` |
| **AC-2** | OpenAI Codex สามารถเข้าใจและปฏิบัติตามคำสั่งผ่าน `$00-discover`, `00-discover`, หรือคำสั่งภาษาธรรมชาติได้ โดยอิงตาม directive ใน `AGENTS.md` | ทดสอบความสมบูรณ์ของ Directive และการอ้างอิงพาธ `.agents/skills/` |
| **AC-3** | คำสั่งทั้ง 4 รูปแบบ (Normal Name, Semantic Alias, Dollar, Slash) มีการระบุไว้อย่างชัดเจนใน `AGENTS.md`, `README.md`, และ `devflow` Router | Static Inspection |
| **AC-4** | Skill Router `devflow` สามารถสแกนสถานะ active run และแนะนำขั้นตอนถัดไปได้อย่างถูกต้อง | ทดสอบรันและตรวจสอบตรรกะใน `devflow/SKILL.md` |
| **AC-5** | เทมเพลตสำหรับ `create-nexus-devflow` ผ่านการอัปเดตและทดสอบสมบูรณ์ | รัน `npm test` และ `npm run test:package` |
| **AC-6** | โครงสร้างทั้งหมดผ่าน Quality Gate ของโปรเจกต์โดยไม่มีข้อผิดพลาด | รัน `npm run check` ผ่าน 100% |

---

## 4. ข้อจำกัดและข้อกำหนดเชิงเทคนิค (Hard Constraints)

1. **Mainline Linearity**: ลำดับขั้นตอนหลักยังคงเป็นตัวเลขแบบทางเดียว (00 -> 10 -> 20 -> 30 -> 40 -> 50 -> 60 -> 70) ไม่มีการกระโดดย้อนกลับ
2. **Dual Adapter Parity**: เนื้อหาและตรรกะใน `.agents/skills/` และ `.claude/skills/` ต้องมีความสอดคล้องกัน
3. **Markdown-First Storage**: ข้อมูลสถานะและผลลัพธ์ยังคงต้องบันทึกในรูปแบบไฟล์ Markdown ภายใต้ `devflow/` เสมอ

---

## 5. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope)

- ไม่มีการเปลี่ยนโครงสร้างโฟลเดอร์หลัก `devflow/runs/` หรือ `devflow/discoveries/`
- ไม่มีการลบฟีเจอร์ Multi-Agent Specialists หรือความสามารถในการ Generate HTML Report

---

## 6. แผนการตรวจสอบและทดสอบ (Verification Plan)

1. **Static Validation**: `npm run check:static`
2. **Framework Contract Check**: `npm run check`
3. **Installer Package Tests**: `npm test`
4. **Package Build & Smoke Test**: `npm run test:package`

---

## 7. คำสั่งขั้นตอนถัดไป (Next Workflow Recommendation)

```text
/30-plan RUN-001-align-devflow-blueprint
หรือ
30-plan RUN-001-align-devflow-blueprint
```
