# Implementation Checklist: RUN-001-align-devflow-blueprint

- [x] **Phase 1: ยกระดับ AGENTS.md สู่ Blueprint Pattern (Self-Contained)**
  - [x] Task 1.1: อัปเดตโครงสร้างหลักของ AGENTS.md ให้ครอบคลุมทุกบริบท
  - [x] Task 1.2: เพิ่ม Tool Invocation & Agent Execution Rules (Codex, Antigravity, Claude Code)
  - [x] Task 1.3: เพิ่ม Mandatory Tool Reading Directive สำหรับ Non-Native Agents
  - [x] Task 1.4: เพิ่ม Inline Stage & Companion Summaries (00 ถึง 70)
  - [x] Task 1.5: เพิ่ม Context Source of Truth Reference Table (`devflow/context/`)

- [x] **Phase 2: รองรับ Universal Command & Naming Schemes**
  - [x] Task 2.1: อัปเดตการอ้างอิงและ Aliases ใน CLAUDE.md และ AGENTS.md
  - [x] Task 2.2: อัปเดตคำอธิบายใน Core Stage Skills ให้รองรับ Normal Names

- [x] **Phase 3: อัปเกรด Router Skill (devflow)**
  - [x] Task 3.1: พัฒนา State-Aware Inspection ให้แก่ devflow Skill
  - [x] Task 3.2: เพิ่มคำแนะนำ Next Action ตามสถานะของ Run

- [x] **Phase 4: ปรับปรุง Adapter Layer & Package Installer Template**
  - [x] Task 4.1: ซิงค์เทมเพลตสำหรับ Package Installer (`packages/create-nexus-devflow/template`)
  - [x] Task 4.2: ตรวจสอบความถูกต้องของการเตรียมเทมเพลต

- [x] **Phase 5: Verification, Tests & Documentation Synchronization**
  - [x] Task 5.1: ปรับปรุง README.md, README.th.md, docs/USAGE.md
  - [x] Task 5.2: รันชุดทดสอบความถูกต้องทั้งระบบ (`npm run check`, `npm test`, `npm run test:package`)
