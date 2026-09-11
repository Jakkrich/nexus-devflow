# Phase 30: Implementation Plan

- **Running ID**: `RUN-001-align-devflow-blueprint`
- **Title**: แผนการดำเนินงานปรับปรุงสถาปัตยกรรม DevFlow 2.0 ให้สอดคล้องกับ Blueprint (Universal Invocation & Codex Compatibility)
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Complexity**: Standard
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วงจรหลักฐานการวางแผน (Planning Loop Evidence)

- **Intent**: แปลงข้อกำหนดใน [20-spec.md](20-spec.md) ออกมาเป็นขั้นตอนการแก้ไฟล์โค้ดและเอกสารจริงอย่างเป็นระบบ
- **Context**: ศึกษาโครงสร้าง [nexus-blueprint/AGENTS.md](file:///d:/Projects/devtools/nexus-blueprint/AGENTS.md) เทียบกับ [nexus-devflow/AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md), การทำงานของ `packages/create-nexus-devflow`, และ Router Skill `devflow`
- **Observation**: พบว่าปัญหาหลักของ Codex คือขาด Directives ใน `AGENTS.md` และขาด Inline Summaries ทำให้ต้องพึ่งพาการเปิดไฟล์ `SKILL.md` เสมอ
- **Adjustment**: แบ่งงานเป็น 5 Phases ลำดับตาม Dependency ชัดเจน เพื่อให้มั่นใจว่าจะไม่กระทบต่อ Contract เดิมของ Claude Code และ Antigravity
- **Stop Condition**: งานทุก Task มีการระบุไฟล์ที่ต้องแก้, คำสั่งตรวจสอบ, และ Test Decision ชัดเจน
- **Handoff**: ส่งมอบให้ `/40-Implement` สามารถหยิบทำทีละ Task ได้ทันที

---

## 2. ลำดับขั้นตอนการดำเนินงาน (Phased Execution Plan)

### Phase 1: ยกระดับ AGENTS.md สู่ Blueprint Pattern (Self-Contained)

- **Task 1.1: อัปเดตโครงสร้างหลักของ AGENTS.md**
  - **ไฟล์**: [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md)
  - **การเปลี่ยนแปลง**: เพิ่มรายละเอียดความสมบูรณ์ในตัวเอง (Self-Contained), แนะนำ Context Files ใน `devflow/context/`, และระบุโครงสร้างโฟลเดอร์หลัก
  - **Test Decision**: `Not Required` (Configuration / Framework Entry Point)
  - **การตรวจสอบ**: ตรวจสอบโครงสร้าง markdown และรัน `npm run check:static`

- **Task 1.2: เพิ่ม Tool Invocation & Agent Execution Rules**
  - **ไฟล์**: [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md)
  - **การเปลี่ยนแปลง**: ระบุวิธีการเรียกใช้งานสำหรับ OpenAI Codex (`$00-discover`, `00-discover`), Antigravity / Claude Code (`/00-discover`, plain prompt), และ generic agents
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: Manual review against Blueprint directives

- **Task 1.3: เพิ่ม Mandatory Tool Reading Directive สำหรับ Non-Native Agents**
  - **ไฟล์**: [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md)
  - **การเปลี่ยนแปลง**: เพิ่มกฎบังคับให้ Agent ที่ไม่มี background loader ต้องเปิดอ่าน `.agents/skills/<skill>/SKILL.md` เสมอเมื่อเริ่มทำงานในแต่ละ stage
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: Manual verification

- **Task 1.4: เพิ่ม Inline Stage & Companion Summaries**
  - **ไฟล์**: [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md)
  - **การเปลี่ยนแปลง**: บรรจุสรุปย่อของ 8 Mainline Stages (00-discover ถึง 70-release) และ 10+ Companion Commands
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

---

### Phase 2: รองรับ Universal Command & Naming Schemes

- **Task 2.1: อัปเดตการอ้างอิงและ Aliases ใน CLAUDE.md และ AGENTS.md**
  - **ไฟล์**: [CLAUDE.md](file:///d:/Projects/devtools/nexus-devflow/CLAUDE.md), [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md)
  - **การเปลี่ยนแปลง**: บันทึกรูปแบบคำสั่งทั้ง 4 แบบ (Normal, Semantic Aliases, $, /)
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: Manual review

- **Task 2.2: อัปเดตคำอธิบายใน Core Stage Skills ให้รองรับ Normal Names**
  - **ไฟล์**: `.agents/skills/00-discover/SKILL.md` ถึง `70-release/SKILL.md` และ `.claude/skills/`
  - **การเปลี่ยนแปลง**: เพิ่ม argument-hint, usage syntax ที่รองรับทั้ง `00-discover` และ `/00-discover`
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check`

---

### Phase 3: อัปเกรด Router Skill (`devflow`)

- **Task 3.1: พัฒนา State-Aware Inspection ให้แก่ devflow Skill**
  - **ไฟล์**: [.agents/skills/devflow/SKILL.md](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md), [.claude/skills/devflow/SKILL.md](file:///d:/Projects/devtools/nexus-devflow/.claude/skills/devflow/SKILL.md)
  - **การเปลี่ยนแปลง**: เพิ่มขั้นตอนการตรวจเช็ก `devflow/context/current-stage.md` และโฟลเดอร์ `devflow/runs/` เพื่อสรุปสถานะและแนะนำคำสั่งถัดไปแบบอัตโนมัติ
  - **Test Decision**: `Manual/Command Only`
  - **การตรวจสอบ**: ทดสอบรันและตรวจสอบผลลัพธ์คำแนะนำ

---

### Phase 4: ปรับปรุง Adapter Layer & Package Installer Template

- **Task 4.1: ซิงค์เทมเพลตสำหรับ Package Installer**
  - **ไฟล์**: `packages/create-nexus-devflow/template/`
  - **การเปลี่ยนแปลง**: รัน `node packages/create-nexus-devflow/scripts/prepare-template.js` เพื่อซิงค์ไฟล์ล่าสุด
  - **Test Decision**: `Required` (Automated Test ผ่าน `npm test`)
  - **การตรวจสอบ**: `npm test` และ `npm run test:package`

---

### Phase 5: Verification, Tests & Documentation Synchronization

- **Task 5.1: ปรับปรุง README และเอกสารประกอบ**
  - **ไฟล์**: [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md), [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md)
  - **การเปลี่ยนแปลง**: ปรับตารางคำสั่งให้สะท้อน Universal Invocations และระบุความเข้ากันได้กับ OpenAI Codex อย่างชัดเจน
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

- **Task 5.2: รันชุดทดสอบความถูกต้องทั้งระบบ (Final Quality Gate)**
  - **คำสั่ง**: `npm run check`, `npm run check:static`, `npm test`, `npm run test:package`
  - **Test Decision**: `Required`
  - **การตรวจสอบ**: ทุกคำสั่งต้องผ่าน 100% (Green)

---

## 3. ตารางการตัดสินใจเรื่องแบบทดสอบ (Test Decision Table)

| Task ID | งาน | Test Decision | เหตุผล / รูปแบบการตรวจ |
|---|---|---|---|
| **T1.1-1.5** | ปรับปรุง AGENTS.md | `Not Required` | เอกสารกำกับพฤติกรรม ตรวจด้วย `npm run check:static` |
| **T2.1-2.2** | Naming & Invocation Schema | `Not Required` | Markdown skills contract ตรวจด้วย `npm run check` |
| **T3.1** | State-Aware Router (`devflow`) | `Manual/Command Only` | ตรวจสอบ flow logic ใน `SKILL.md` |
| **T4.1** | ซิงค์ Installer Template | `Required` | ทดสอบผ่าน Unit Test `npm test` ใน `packages/create-nexus-devflow` |
| **T5.1-5.2** | Final Quality Gate | `Required` | รันชุดทดสอบครบทุกระบบ (`check`, `static`, `test`, `test:package`) |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Workflow Recommendation)

```text
/40-implement RUN-001-align-devflow-blueprint
หรือ
40-implement RUN-001-align-devflow-blueprint
```
