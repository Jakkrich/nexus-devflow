# Build Plan

> **Document Type**: Build Plan (User-Owned)
> **Purpose**: รายการฟีเจอร์ตามลำดับการพัฒนาจริง (Ordered Feature Roadmap Checklist)
> **Workflow**: ใช้เครื่องหมาย Checkbox `- [ ]` เรียงลำดับ 1, 2, 3... เพื่อให้ `/feature` ดึงไปทำทีละงาน

---

## 🚀 Phase 1: Core Foundation & Data Layer

- [x] 1. **Upstream AI Blueprint Synchronization & Zero-Regression Fusion** - ผสานฟีเจอร์เด่นจาก Upstream (explore skill, proportional engineering, update adapter switcher, CI pre-push hook) ตัด dark mode ออก และปกป้องสถาปัตยกรรมของ DevFlow (Ref: DISC-20260929-001)
- [x] 111. **Code-Modernization Recommended Third-Party Skill & Master Orchestrator** - เพิ่ม code-modernization เข้าเป็น Recommended Third-Party Skill พร้อม Master Front-Door Orchestrator Skill (/code-modernization) และ Subdirectory Sparse Ingestion Engine (Ref: DISC-20261027-001)
- [x] 112. **(Deprecated & Removed) In-IDE Interactive Choice & Predictive Follow-Up Gate** - ถอดระบบ In-App Modal บังคับออกตามคำสั่งผู้ใช้เพื่อคืนความคล่องตัวในการสนทนา (Ref: DISC-20261030-001, Task 113)
- [x] 114. **Upstream AI Blueprint Selective Sync (v1.11.0–v1.16.1) & Skill Rename** - ผสานความสามารถกลุ่มที่ 1 และ 2 จาก Upstream พร้อมเปลี่ยนชื่อ `/status` และ `/doctor` เป็น `/devflow-status` และ `/devflow-doctor` แบบ Zero-Regression (Ref: DISC-20261117-001)
  - [x] 114a. **(Skateboard) Rename `/status` & `/doctor` to `/devflow-status` & `/devflow-doctor` + Git/Pack Hardening** - เปลี่ยนชื่อสกิลทั้ง 2 adapter, ย้าย `run-state.mjs`, กัน crash จาก `git status` buffer และแพ็คเฉพาะ tracked template files
  - [x] 114b. **(Skateboard) Context Trimming, On-Demand References & Cross-Skill Link Validator** - เพิ่ม link validator ใน `validate-framework.ts`, แยก `devflow/workflow.md`, trim `ai-interaction.md`, แยก `independent-review.md` / `completion-screen.md` / `completion-archive.md` / `try-it-now.md`
  - [x] 114c. **(Tracer Bullet) Spec Check Gate (`--check`), `when-testable` Proof & Implement Step Menu** - เพิ่ม `/feature --check` (`specCheck`), `when-testable` try-it-now proof และเมนูต่อ step เมื่อ `stepReview: "every"`
  - [x] 114d. **(Tracer Bullet) Parallel Worktree Workflows & Recovery** - รองรับ 1 work item ต่อ 1 worktree/clone, pre-created worktree branch start และ recovery เมื่อ `main` เดินหน้า
- [ ] 115. **Skill Audit, Consolidation & Anti-Bloat Architecture (Option B+)** - ผ่าตัดลดความซ้ำซ้อนของ Core Skills จาก 33 เหลือ 14 Daily Core (+ 5 Tier-2 Ops), ถอดตัว obsolete/stub, เพิ่ม Adaptive Clarification ใน `/feature` และลด ceremony (Ref: DISC-20261117-002)
  - [x] 115a. **(Skateboard) Hygiene, Anti-Bloat & Contract Cleanup** - ปรับ `--help` เป็น Markdown สรุปสั้นในแชท, คลาย `run-state.mjs` เป็น best-effort, ล้าง hardcoded `d:/...` paths, `/design`, `defuddle`, `npm run overview`, และคลาย hardcode `browseros-neo` ใน `agent-bundle.manifest.json`
  - [ ] 115b. **(Skateboard) Retire Obsolete, Stub & Maintainer Skills** - ลบ `try`, `report-html`, `ponytail`, ย้าย `publish-devflow` ออกจาก `.agents/skills/`, และถอด `bughunter`, `convert-any-to-md`, `code-modernization` ออกจาก `core_skills` ไปเป็น opt-in preset
  - [ ] 115c. **(Journey) Consolidate Core Skills & Upgrade Adaptive `/feature` + `/debug`** - ยุบรวม 6 กลุ่ม (`onboard+adopt`, `explore+brainstorm`, `discovery+analyze+grill`, `devflow+devflow-status+devflow-doctor`, `autopilot+continuous`, `setup-tests+browser-tests` และถอด `test`), เพิ่ม Adaptive Clarification & `--preview` ใน `/feature`, และปรับ `/debug` เป็น 2-Track
  - [ ] 115d. **(Tracer Bullet) Validators, Role Profiles, Adapter Sync & Docs** - อัปเดต `agent-bundle.manifest.json`, `skill-registry-engine.ts`, `validate-framework.ts`, `routing.ts`, docs (`README*`, `workflow-pages.ts`), sync `.claude/skills/`, และผ่านทุก quality gate


- [ ] 2. **Base Layout & Main UI Shell** - วางโครงสร้างหน้าจอหลัก, Navigation Shell และ Design Tokens
- [ ] 3. **Primary Feature Flow** - พัฒนาฟังก์ชันการทำงานหลัก พร้อม Input Form และ Validation

---

## ⚡ Phase 2: Interactivity & Core Capabilities

- [ ] 4. **Live Preview / Action Pipeline** - เชื่อมต่อ Input เข้าสู่ระบบประมวลผลและการแสดงผลแบบ Real-time
- [ ] 5. **Export / Output Engine** - พัฒนาระบบส่งออกข้อมูล เช่น Image Generation, PDF Download หรือ API Response
- [ ] 6. **Local Persistence & Settings** - บันทึกการตั้งค่าและประวัติการใช้งานลงใน Local Storage หรือ Database
  - [ ] 6a. **Settings Panel** - UI สำหรับปรับแต่งค่าและการจัดเก็บ State
  - [ ] 6b. **History & Recall** - แสดงรายการประวัติย้อนหลังและปุ่มเรียกข้อมูลกลับมาใช้

---

## 🚢 Phase 3: Polish, Quality & Production Hardening

- [ ] 7. **Edge Cases & Input Polish** - จัดการ Loading States, Error Boundaries และ Responsive Layout
- [ ] 8. **Deployment Readiness & Production Verification** - ตั้งค่า Environment Config, ตรวจสอบ Production Build และ Health Check

---

## 🛠️ Architecture & Deployment Notes (Optional)

- **Key Technical Decisions**:
  - [บันทึกการตัดสินใจทางเทคนิคที่สำคัญ]
- **Environment & Hosting Constraints**:
  - [ข้อกำหนดด้านสภาพแวดล้อมและการ Deploy]

---

## 🔮 Later / Post-MVP Backlog (Not in v1)

- [ ] **Cloud Sync & User Accounts** - ระบบสมัครสมาชิกและซิงค์ข้อมูลบน Cloud
