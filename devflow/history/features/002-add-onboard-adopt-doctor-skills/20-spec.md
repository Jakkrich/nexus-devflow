# Phase 20: Delivery Specification

- **Running ID**: `RUN-002-add-onboard-adopt-doctor-skills`
- **Title**: ข้อกำหนดการสร้าง Setup & Diagnostics Companion Skills (`onboard`, `adopt`, `doctor`) ใน Nexus-DevFlow
- **Source Define**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และภาพรวมข้อกำหนด (Specification Overview)

เพิ่มความสามารถในการเริ่มต้นใช้งาน (Onboarding & Adoption) และการตรวจเช็คสุขภาพระบบ (Diagnostics) ให้กับ Nexus-DevFlow 2.0 โดยถอดแบบความสำเร็จจาก Nexus Blueprint เพื่อให้ DevFlow สามารถ:
1. ปรับจูนคำสั่งและมาตรฐานของโปรเจกต์ใหม่ให้อัตโนมัติหลังติดตั้ง (`onboard`)
2. สแกนและดึงบริบทของ Codebase เดิมมาเป็น Source of Truth ให้กับ AI โดยไม่ต้องเขียนใหม่ทั้งหมด (`adopt`)
3. ตรวจสอบความถูกต้องสมบูรณ์ของโครงสร้าง DevFlow, Scripts, Context, และตรวจจับ Workflow Drift (`doctor`)
4. เชื่อมโยงคำสั่งทั้งหมดเข้ากับ Flagship Guide / Router (`devflow`), `AGENTS.md`, Template, และชุดเอกสาร

---

## 2. ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements)

### REQ-1: สร้าง Skill `onboard` สำหรับโปรเจกต์ใหม่ (Fresh/Scaffolded Project Setup)
- **REQ-1.1**: สร้าง `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md` โดยมี Metadata: `name: onboard`, รองรับ aliases `onboard`, `/onboard`, `$onboard`
- **REQ-1.2**: ตรวจสอบว่าโปรเจกต์เป็น Fresh Project (หากพบว่ามีโค้ดฟังก์ชันหลักอยู่แล้ว ให้แนะนำ `/adopt` แทน)
- **REQ-1.3**: ทำการสำรวจ (Survey) Stack, Runtime, Package Manager, Lockfile, และ Configuration Files (`package.json`, `tsconfig.json`, `vite.config.*`, `next.config.*`, ฯลฯ)
- **REQ-1.4**: ปรับปรุงส่วน Commands ใน [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) และใส่ Project Name จริงใน `CLAUDE.md`
- **REQ-1.5**: ปรับแต่ง `devflow/context/coding-standards.md` ให้สอดคล้องกับ Stack ที่ตรวจพบ
- **REQ-1.6**: ตรวจสอบ `.gitignore` และตั้งค่าการจัดการไฟล์ DevFlow (Commit vs Local-Only) พร้อมตรวจเช็ค Tool Adapters (`.agents/`, `.claude/`)
- **REQ-1.7**: เริ่มต้นข้อมูลพื้นฐานใน `devflow/context/project-overview.md` และแนะนำคำสั่งถัดไป (`/00-discover` หรือ `/10-define`)

### REQ-2: สร้าง Skill `adopt` สำหรับโปรเจกต์เดิม (Brownfield Codebase Ingestion)
- **REQ-2.1**: สร้าง `.agents/skills/adopt/SKILL.md` และ `.claude/skills/adopt/SKILL.md` โดยมี Metadata: `name: adopt`, รองรับ aliases `adopt`, `/adopt`, `$adopt`
- **REQ-2.2**: ทำการสำรวจ Codebase จริงแบบ Read-only (Routes, Modules, Controllers, Components, Database Schema, Test Suites, Existing Scripts)
- **REQ-2.3**: มีกระบวนการสัมภาษณ์ Intent สั้นๆ (3-4 คำถาม) สำหรับข้อมูลที่โค้ดไม่สามารถบอกได้ (Product Purpose, Target Users, Intentional Architecture vs Legacy, Upcoming Roadmap)
- **REQ-2.4**: สร้าง/อัปเดต Source of Truth ใน `devflow/context/project-overview.md` สรุปภาพรวมสถาปัตยกรรมและฟีเจอร์เดิมที่มีอยู่แล้ว
- **REQ-2.5**: สกัด Coding Patterns และ Conventions ที่ใช้จริงใน Codebase ลงใน `devflow/context/coding-standards.md` และอัปเดต Commands ใน `AGENTS.md`
- **REQ-2.6**: แนะนำการเริ่ม Discovery แรกหรือส่งต่อไปยัง `/10-define` สำหรับงานที่ต้องการพัฒนาต่อ

### REQ-3: สร้าง Skill `doctor` สำหรับตรวจสุขภาพระบบ (Health Check & Diagnostics)
- **REQ-3.1**: สร้าง `.agents/skills/doctor/SKILL.md` และ `.claude/skills/doctor/SKILL.md` โดยมี Metadata: `name: doctor`, รองรับ aliases `doctor`, `/doctor`, `$doctor`
- **REQ-3.2**: ตรวจสอบความสมบูรณ์ของไฟล์บริบทสำคัญ (`devflow/context/project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `findings.md`, `current-stage.md`) ว่ามีอยู่จริงและไม่เป็นค่าว่าง/placeholder
- **REQ-3.3**: ตรวจสอบความสอดคล้องของ Tool Adapters (`.agents/skills/` และ `.claude/skills/`)
- **REQ-3.4**: ตรวจสอบความถูกต้องของ Commands ใน `AGENTS.md` (ทดสอบคำสั่ง verify/test/build ว่าสามารถทำงานได้จริง)
- **REQ-3.5**: ตรวจสอบสถานะการทำงานใน `devflow/runs/` ตรวจจับ Unfinished Checklists, ข้อมูลค้างท่อ, และเตือน Workflow Drift

### REQ-4: ปรับปรุง Router (`devflow`), `AGENTS.md` และ `CLAUDE.md`
- **REQ-4.1**: อัปเดต `AGENTS.md` และ `CLAUDE.md` เพิ่ม `onboard`, `adopt`, `doctor` ในตาราง Companion Commands และ Directives
- **REQ-4.2**: ปรับปรุง Router Skill [devflow](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md) และ `.claude/skills/devflow/SKILL.md`:
  - หาก `project-overview.md` หรือ `coding-standards.md` ยังเป็นค่าเริ่มต้นหรือยังไม่เคย Setup ให้แนะนำ `/onboard` (โปรเจกต์ใหม่) หรือ `/adopt` (โปรเจกต์เดิม) เป็นคำสั่งแรก
  - เพิ่มการแนะนำ `/doctor` เมื่อผู้ใช้ต้องการตรวจสอบความสมบูรณ์ของระบบ

### REQ-5: ซิงค์ Package Installer Template และ Documentation
- **REQ-5.1**: ซิงค์ไฟล์ Skills ใหม่และ `AGENTS.md` ไปยัง `packages/create-nexus-devflow/template`
- **REQ-5.2**: อัปเดตเอกสาร [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md), [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)

---

## 3. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | เงื่อนไขการยอมรับ (Acceptance Criteria) | วิธีการตรวจวัด (Verification Method) |
|---|---|---|
| **AC-1** | ไฟล์ Skills `onboard`, `adopt`, `doctor` ถูกสร้างครบถ้วนในทั้ง `.agents/skills/` และ `.claude/skills/` โดยมีเนื้อหาถูกต้องตามมาตรฐาน DevFlow 2.0 | ตรวจสอบไฟล์และรัน `npm run check:static` |
| **AC-2** | [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) บรรจุคำอธิบายและรูปแบบการเรียกใช้งาน `onboard`, `adopt`, `doctor` ครบทั้ง 4 รูปแบบ (Normal Name, Alias, Dollar, Slash) | ตรวจสอบเนื้อหาใน AGENTS.md |
| **AC-3** | Router `devflow` สามารถแนะนำ `onboard`, `adopt`, หรือ `doctor` ได้อย่างถูกต้องตามสถานะของ Context | ตรวจสอบ logic ใน `devflow/SKILL.md` |
| **AC-4** | Template สำหรับ `create-nexus-devflow` ได้รับการซิงค์ไฟล์ใหม่ทั้งหมด | ตรวจสอบ `packages/create-nexus-devflow/template` และรัน `npm test` |
| **AC-5** | เอกสาร `USAGE.md`, `workflow-surface-map.md`, `README.md`, `README.th.md` ได้รับการอัปเดตอย่างสมบูรณ์ | ตรวจสอบเอกสาร |
| **AC-6** | รันชุดตรวจสอบความถูกต้องทั้งหมดผ่าน 100% | รัน `npm run check`, `npm run check:static`, `npm test`, `npm run test:package` |

---

## 4. ข้อจำกัดและข้อกำหนดเชิงเทคนิค (Hard Constraints)

1. **Mainline Preservation**: `onboard`, `adopt`, `doctor` เป็น Companion Commands ไม่นับเป็น Stage ตัวเลข (Mainline ยังคงเป็น 00-70)
2. **Dual Adapter Parity**: ไฟล์ใน `.agents/skills/` และ `.claude/skills/` ต้องมีเนื้อหาและคู่มือที่สอดคล้องกันแบบ 1:1
3. **Safety First**: `adopt` และ `doctor` ต้องทำงานแบบ Read-only ในขั้นตอนสำรวจ และจะไม่เขียนทับ Context ที่ผู้ใช้สร้างไว้แล้วโดยไม่ถามยืนยัน

---

## 5. แผนการตรวจสอบและทดสอบ (Verification Plan)

1. **Static Contract Check**: `npm run check:static`
2. **Framework Parity Check**: `npm run check`
3. **Installer Unit Tests**: `npm test`
4. **Package Build & Smoke Test**: `npm run test:package`

---

## 6. คำสั่งขั้นตอนถัดไป (Next Workflow Recommendation)

```text
/30-plan RUN-002-add-onboard-adopt-doctor-skills
หรือ
30-plan RUN-002-add-onboard-adopt-doctor-skills
```
