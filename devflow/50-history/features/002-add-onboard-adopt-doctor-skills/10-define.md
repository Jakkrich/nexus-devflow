# Phase 10: Define Contract

- **Running ID**: `RUN-002-add-onboard-adopt-doctor-skills`
- **Title**: เพิ่ม Setup & Diagnostics Companion Skills (`onboard`, `adopt`, `doctor`) ใน Nexus-DevFlow
- **Source Discovery**: Direct Human Initiative (Blueprint Adaptation & Gap Analysis)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการวิเคราะห์เปรียบเทียบระหว่าง Nexus Blueprint และ Nexus-DevFlow 2.0 พบว่าหลังจากผู้ใช้ติดตั้ง DevFlow ลงในโปรเจกต์ (ผ่าน `npx @jakkrichm/create-nexus-devflow` หรือการ overlay ไฟล์) ยังขาดขั้นตอน Setup Baseline และ Brownfield Codebase Ingestion อัตโนมัติ:

1. **สำหรับ Fresh Project**: ยังไม่มีขั้นตอน detect stack/scripts เพื่อ populate `AGENTS.md` และ `devflow/context/coding-standards.md` ให้เข้ากับ stack นั้นๆ ทันที
2. **สำหรับ Brownfield (Existing Project)**: ยังไม่มีขั้นตอน survey โค้ดเดิมเพื่อสรุปสถานะปัจจุบันลง `devflow/context/project-overview.md` และดึง convention จริงมาใช้
3. **สำหรับ Diagnostics**: ยังไม่มีคำสั่ง health check ตรวจสอบความพร้อมของ context, scripts, tool adapters และ workflow drift

เป้าหมายของ Run นี้คือการสร้างชุด Companion Skills: `onboard`, `adopt`, และ `doctor` พร้อมเชื่อมโยงเข้ากับระบบ Router (`devflow`), `AGENTS.md`, Installer Template, และชุดเอกสารอย่างสมบูรณ์

---

## 2. ขอบเขตงาน (In-Scope)

### Phase 1: ออกแบบและสร้าง Skill `onboard` (Fresh/Scaffolded Project Setup)
- สร้าง `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md`
- รองรับการตรวจจับ Runtime, Framework, Package Manager, Lockfile
- ปรับแต่ง `AGENTS.md` (ใส่คำสั่ง `dev`, `build`, `test`, `verify` จริง)
- ปรับแต่ง `devflow/context/coding-standards.md` ให้ตรงกับ Stack
- จัดการ `.gitignore` และตรวจสอบ Tool Adapters (`.agents/`, `.claude/`)
- เตรียม baseline context ใน `devflow/context/project-overview.md` และนำทางสู่ `/00-discover` หรือ `/10-define`

### Phase 2: ออกแบบและสร้าง Skill `adopt` (Brownfield/Existing Project Ingestion)
- สร้าง `.agents/skills/adopt/SKILL.md` และ `.claude/skills/adopt/SKILL.md`
- สำรวจโครงสร้าง Codebase จริงแบบ Read-only (Routes, Modules, Schemas, Test runner, Patterns)
- สัมภาษณ์ Intent สั้นๆ (Product Goal, Users, Tech Debt, Roadmap)
- สรุปและสร้าง `devflow/context/project-overview.md` จากโค้ดและ Intent
- ปรับแต่ง `devflow/context/coding-standards.md` และ `AGENTS.md` จากโค้ดจริง
- นำทางสู่ Discovery หรือ Run แรกสำหรับฟีเจอร์หรือการปรับปรุงถัดไป

### Phase 3: ออกแบบและสร้าง Skill `doctor` (DevFlow Health Check & Diagnostics)
- สร้าง `.agents/skills/doctor/SKILL.md` และ `.claude/skills/doctor/SKILL.md`
- ตรวจสอบความสมบูรณ์ของ Context Files (`project-overview.md`, `coding-standards.md`, `current-stage.md`, `findings.md`)
- ทดสอบคำสั่ง verification/test ใน `AGENTS.md`
- ตรวจสอบสถานะ Active Run และตรวจจับ Workflow Drift

### Phase 4: อัปเดต Router, AGENTS.md, Template และ Documentation
- อัปเดต [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) และ [CLAUDE.md](file:///d:/Projects/devtools/nexus-devflow/CLAUDE.md) ให้บรรจุคำสั่ง `onboard`, `adopt`, `doctor` ในตาราง Companion Commands และ Directives
- ปรับปรุง Router Skill [devflow](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md) ให้แนะนำ `onboard`/`adopt` เมื่อ Context ยังว่างเปล่า และแนะนำ `doctor` สำหรับตรวจสุขภาพระบบ
- ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template` และอัปเดต docs (`USAGE.md`, `workflow-surface-map.md`, `README.md`, `README.th.md`)

### Phase 5: Verification & Integrity Tests
- รันชุดตรวจ `npm run check`, `npm run check:static`, และ `npm test` ให้ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่เพิ่มตัวเลข Mainline (รักษา Mainline 00-70 ให้คงเดิม)
- ไม่แก้ไขพฤติกรรมของ Stage 00-70 ที่มีอยู่เดิม
- ไม่ลบหรือแก้ไข Core Run Artifacts ที่เคยมี

---

## 4. แผนผัง Run และความสัมพันธ์ (Delivery Run Map & Dependencies)

| Running ID | ขอบเขต (Scope) | Dependencies | สถานะ |
|---|---|---|---|
| `RUN-002-add-onboard-adopt-doctor-skills` | สร้าง Onboard, Adopt, Doctor Skills พร้อมผสาน Router, AGENTS.md, Template และ Docs | RUN-001 (เสร็จสิ้นแล้ว) | Active |

---

## 5. ข้อสมมติฐานและความเสี่ยง (Assumptions & Risks)

- **Assumption**: รูปแบบคำสั่งรองรับทั้ง Normal Name (`onboard`, `adopt`, `doctor`), Slash Commands (`/onboard`, `/adopt`, `/doctor`), และ Codex Prefix (`$onboard`, `$adopt`, `$doctor`)
- **Risk Mitigation**: ตรวจสอบความสอดคล้องระหว่าง `.agents/skills/` และ `.claude/skills/` ผ่าน `npm run check`

---

## 6. เกณฑ์การยอมรับ (Acceptance & Success Criteria)

1. มี Skills `onboard`, `adopt`, `doctor` ทั้งใน `.agents/skills/` และ `.claude/skills/` ครบถ้วนตามมาตรฐาน DevFlow 2.0
2. [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) มีรายการคำสั่งและ Directives สำหรับ `onboard`, `adopt`, `doctor`
3. Router `devflow` สามารถแนะนำ `onboard` / `adopt` / `doctor` ได้ตามสถานะ context ของโปรเจกต์
4. แพ็กเกจ `create-nexus-devflow` template ได้รับการซิงค์ไฟล์ใหม่อย่างถูกต้อง
5. ผ่านการตรวจสอบความถูกต้องด้วย `npm run check`, `npm run check:static`, และ `npm test` ทั้งหมด 100%

---

## 7. คำสั่งขั้นตอนถัดไป (Next Workflow Recommendation)

```text
/20-Spec RUN-002-add-onboard-adopt-doctor-skills
หรือ
20-spec RUN-002-add-onboard-adopt-doctor-skills
```
