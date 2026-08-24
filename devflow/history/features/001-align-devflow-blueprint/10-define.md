# Phase 10: Define Contract

- **Running ID**: `RUN-001-align-devflow-blueprint`
- **Title**: ปรับปรุงสถาปัตยกรรม DevFlow 2.0 ให้สอดคล้องกับ Nexus-Blueprint (Universal Invocation & Codex Compatibility)
- **Source Discovery**: Direct Human Initiative (Phase 1-5 Proposal)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

Nexus-DevFlow 2.0 ในปัจจุบันถูกออกแบบเป็น Modular Skills ที่แยกเก็บรายละเอียดทั้งหมดไว้ใน `.agents/skills/<skill>/SKILL.md` ทำให้เครื่องมือที่ไม่มี Built-in Auto-Loader อย่าง **OpenAI Codex** ไม่สามารถโหลด Context หรือปฏิบัติตาม Stage Lifecycle ได้ และต้องใช้ Slash Command (`/00-discover`) เสมอ

การดำเนินงานครั้งนี้มีเป้าหมายเพื่อยกระดับ DevFlow 2.0 ให้มีความสมบูรณ์ในตัวเอง (Self-Contained) ตามแนวทางของ **Nexus-Blueprint** เพื่อให้:
1. รองรับการเรียกชื่อปกติแบบไม่มี slash เช่น `00-discover`, `10-define` รวมถึง Semantic Aliases (`discover`, `spec`, `implement` ฯลฯ)
2. รองรับ OpenAI Codex อย่างสมบูรณ์ผ่าน Explicit Directives และ `$skill` syntax
3. ปรับ [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) ให้มี Inline Summary ของทุก Stage และ Context Files
4. อัปเกรด `devflow` ให้เป็น State-Aware Router ตรวจจับ Active Run อัตโนมัติ

---

## 2. ขอบเขตงาน (In-Scope: Phase 1 - 5)

### Phase 1: ยกระดับ AGENTS.md สู่ Self-Contained Blueprint Pattern
- ปรับโครงสร้าง [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) ให้มีขนาดและเนื้อหาที่ครอบคลุม (Self-Contained)
- เพิ่ม **Tool Invocation & Agent Execution Rules** สำหรับ OpenAI Codex, Antigravity, Claude Code, Cursor
- เพิ่ม **Mandatory Tool Reading Directive** กำกับให้ Agent ที่ไม่มี background loader ต้องเปิดอ่าน `SKILL.md` ก่อนลงมือทำงาน
- เพิ่ม Inline Summaries ของทั้ง 8 Mainline Stages และ Companion Commands
- ระบุตำแหน่ง Context Files ที่สำคัญ (`devflow/context/project-overview.md`, `coding-standards.md`, `current-stage.md`, `findings.md`)

### Phase 2: รองรับ Universal Command & Naming Schemes
- ปรับระบบคำสั่งให้รองรับ 4 รูปแบบการเรียกใช้งาน:
  1. **Normal Name**: `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, `70-release`
  2. **Semantic Aliases**: `discover`, `define`, `spec`, `plan`, `implement`, `verify`, `report`, `release`, `status`
  3. **Codex Skill Prefix**: `$00-discover`, `$20-spec`, `$devflow`
  4. **Slash Command**: `/00-discover`, `/devflow`
- ปรับ metadata / aliases ใน `.agents/skills/*/SKILL.md` และ `.claude/skills/*/SKILL.md`

### Phase 3: อัปเกรด Flagship Guide & Intent Router (`devflow`)
- ปรับ `devflow` skill ([.agents/skills/devflow/SKILL.md](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md) และ `.claude`) ให้ตรวจสอบสถานะใน `devflow/context/current-stage.md` และ `devflow/runs/`
- ตรวจจับ Active Run ID, ขั้นตอนล่าสุดที่ทำค้างไว้, และแนะนำคำสั่งถัดไปแบบ State-based อัตโนมัติ

### Phase 4: ปรับปรุง Adapter Layer & Package Installer Template
- อัปเดตไฟล์เทมเพลตใน [packages/create-nexus-devflow/template](file:///d:/Projects/devtools/nexus-devflow/packages/create-nexus-devflow/template)
- ตรวจสอบ `prepare-template.js` และ `update.js` ให้แพ็กเกจติดตั้งคัดลอกไฟล์ `AGENTS.md` และ Skills ชุดใหม่อย่างครบถ้วน

### Phase 5: Verification, Tests & Documentation Synchronization
- อัปเดตเอกสารประกอบ: [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md), [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md)
- รันชุดทดสอบความถูกต้องของสัญญากรอบงาน (`npm run check`, `npm run check:static`, `npm test`)

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่เปลี่ยนโครงสร้าง Stage Lifecycle ลำดับตัวเลขหลัก (00 -> 10 -> 20 -> 30 -> 40 -> 50 -> 60 -> 70 ยังคงเป็นแกนหลัก)
- ไม่ลบหรือยกเลิกการรองรับ Slash Commands เดิม (`/00-discover` ยังคงใช้งานได้ตามปกติ)
- ไม่ดัดแปลงไฟล์ Schema ภายในของ HTML Report Generator (`60-report.html`)

---

## 4. แผนผัง Run และความสัมพันธ์ (Delivery Run Map & Dependencies)

| Running ID | ขอบเขต (Scope) | Dependencies | สถานะ |
|---|---|---|---|
| `RUN-001-align-devflow-blueprint` | ปรับปรุง AGENTS.md, Naming, Router, Installer, Docs (Phase 1-5) | ไม่มี | Active |

---

## 5. ข้อสมมติฐานและความเสี่ยง (Assumptions & Risks)

- **Assumption**: การเพิ่ม Inline Summary ใน `AGENTS.md` จะไม่กระทบต่อ Token Budget ของ Claude Code เนื่องจากขนาดไฟล์ยังคงอยู่ในช่วง ~6-8 KB
- **Risk Mitigation**: รักษาความสอดคล้องกันระหว่าง `.agents/skills` และ `.claude/skills` ผ่าน `npm run check`

---

## 6. เกณฑ์การยอมรับ (Acceptance & Success Criteria)

1. [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) มีโครงสร้างครบถ้วนแบบ Self-Contained พร้อมคำสั่งสำหรับ Codex และคำอธิบายทุก Stage
2. ผู้ใช้และ AI สามารถเรียกคำสั่งด้วยชื่อปกติ (`00-discover`, `20-spec`, `devflow` ฯลฯ) ได้โดยไม่ต้องใส่เครื่องหมาย `/`
3. Skill Router `devflow` สามารถสแกนสถานะ active run และแนะนำขั้นตอนถัดไปได้อย่างถูกต้อง
4. รัน `npm run check`, `npm run check:static`, และ `npm test` ผ่าน 100% ทั้งหมด
5. Template ของ `create-nexus-devflow` ซิงค์ข้อมูลล่าสุดพร้อมใช้งาน

---

## 7. คำสั่งขั้นตอนถัดไป (Next Workflow Recommendation)

```text
/20-Spec RUN-001-align-devflow-blueprint
หรือ
20-spec RUN-001-align-devflow-blueprint
```
