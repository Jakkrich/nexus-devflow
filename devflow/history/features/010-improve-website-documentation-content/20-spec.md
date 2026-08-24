# Phase 20: Delivery Specification

- **Running ID**: `RUN-010-improve-website-documentation-content`
- **Title**: ข้อกำหนดการปรับปรุงเนื้อหาบนเว็บไซต์ Documentation (Workflow เชิงลึกแบบไม่ใช้ตาราง, Companion Commands 70+ ตัวครบทุกโฟลเดอร์, และ Role-Based Usage Guide)
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Documentation & DX Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาการส่งมอบ (Delivery Contract) สำหรับการปรับปรุงและเพิ่มเติมเนื้อหาบนเว็บไซต์ Documentation (`website/src/content/docs/`) ของ **Nexus-DevFlow 2.0** เพื่อให้ข้อมูลมีความละเอียด เข้าใจง่าย ชัดเจน และตอบโจทย์ผู้ใช้งานทุกระดับ ตั้งแต่ Junior Developer จนถึง Engineering Manager / Product Manager โดยครอบคลุม 3 ส่วนหลัก:

1. **การอธิบาย 8-Stage Workflow หลักเชิงลึกในรูปแบบ Non-Table**: แทนที่ตารางสรุปแบบเดิมด้วย Detailed Stage Cards / Breakdown ที่อธิบาย Intent, Context, กิจกรรมของ AI & Human, Deliverable Artifacts, และ Review Gate Criteria อย่างเป็นขั้นตอน
2. **สารบัญและคำอธิบาย Companion Commands ครบถ้วนตามโฟลเดอร์ใน `.agents/skills/` (70+ ตัว)**: จัดแบ่ง 8 หมวดหมู่ พร้อมอธิบายหน้าที่ วิธีการเรียกใช้งาน (`/command`, `$command`, หรือ CLI) และตัวอย่างสถานการณ์จริง
3. **คู่มือการใช้งานตามบทบาท (Role-Based Usage Guides)**: จัดทำหน้าคู่มือเฉพาะทางสำหรับ Junior Developer, Mid/Senior Engineer, Tech Lead/Architect, และ Product/Engineering Manager พร้อมเชื่อมต่อใน Sidebar

---

## 2. ข้อกำหนดฟังก์ชันหลัก (Core Functional Requirements)

### REQ-1: การอธิบาย 8-Stage Workflow เชิงลึกแบบไม่ใช้ตาราง (Non-Table Deep-Dive)
- **R1.1**: ปรับปรุงหน้า [`website/src/content/docs/workflow/core-workflow.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/workflow/core-workflow.md) และ [`website/src/content/docs/commands/mainline-stages.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/mainline-stages.md)
- **R1.2**: แต่ละ Stage (ตั้งแต่ `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, จนถึง `70-release`) ต้องอธิบายด้วยโครงสร้างเนื้อหาแบบการ์ด/บล็อกที่ประกอบด้วย:
  1. **🎯 วัตถุประสงค์และเจตนา (Purpose & Intent)**: เหตุผลที่ต้องมี Stage นี้ และทำไมจึงห้ามข้าม
  2. **📥 ข้อมูลนำเข้าและบริบท (Inputs & Context)**: เอกสารหรือสถานะที่ต้องมีก่อนเริ่ม
  3. **⚙️ กระบวนการทำงาน (Execution Loop)**: กิจกรรมที่ AI ทำ และจุดที่มนุษย์ต้องมีส่วนร่วม
  4. **📄 ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**: รายชื่อไฟล์และที่อยู่ของไฟล์ Markdown-First
  5. **🚪 เกณฑ์การผ่านด่าน (Review Gate Criteria)**: เงื่อนไขที่จะอนุญาตให้ก้าวสู่ Stage ถัดไป

### REQ-2: การรวบรวมและอธิบาย Companion Commands ครบทุกโฟลเดอร์ (70+ Skills Catalog)
- **R2.1**: ปรับปรุงหน้า [`website/src/content/docs/commands/companion-commands.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/companion-commands.md)
- **R2.2**: จัดหมวดหมู่ Companion Commands และ Skills ทั้งหมดที่มีอยู่ใน `.agents/skills/` ออกเป็น 8 หมวดหมู่อย่างเป็นระเบียบ:
  1. **Core Utilities & Navigation**: `devflow`, `doctor`, `try`, `rollback`, `ci`, `help`, `brief`, `status`
  2. **Autonomous & Discovery**: `autopilot`, `goal`, `brainstorm`, `prd`, `roadmap-strategy`, `competitor-analysis`
  3. **Investigation & Quality Assurance**: `debug`, `issue-triage`, `security-review`, `review`, `lint-and-validate`, `test`
  4. **Architecture & Engineering Design**: `architecture`, `codebase-design`, `domain-modeling`, `database-design`, `api-and-interface-design`, `type-design`, `performance-optimization`, `spec-driven-development`, `documentation-and-adrs`, `app-builder`, `mcp-builder`
  5. **Frontend, UI & Full-Stack**: `frontend-ui-engineering`, `ui-ux-pro-max`, `tailwind-patterns`, `nextjs-react-expert`, `mobile-design`, `prototype`
  6. **Backend, Systems & Platforms**: `nodejs-best-practices`, `python-patterns`, `bash-linux`, `powershell-windows`, `server-management`
  7. **Git & Delivery Lifecycle**: `commit`, `pr`, `merge`, `deploy`, `preview`, `changelog`, `followup`
  8. **AI Collaboration & Metaprogramming**: `agent`, `parallel-agents`, `behavioral-modes`, `context-engineering`, `insight`, `skill-development`, `simplify`, `i18n-localization`, `seo-fundamentals`, `handoff`, `package-json-generator`
- **R2.3**: แต่ละคำสั่งต้องระบุ Syntax การเรียกใช้ (Slash `/`, Codex `$`, หรือ Canonical), หน้าที่หลัก, และ Use Case ตัวอย่าง

### REQ-3: คู่มือการใช้งานตามบทบาท (Role-Based Usage Guides)
- **R3.1**: สร้างไฟล์เนื้อหาใหม่ [`website/src/content/docs/start/roles-guide.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/start/roles-guide.md)
- **R3.2**: เพิ่มเมนู `Role-Based Guides` ใน Sidebar ของ [`website/astro.config.mjs`](file:///d:/Projects/devtools/nexus-devflow/website/astro.config.mjs) ภายใต้หมวด `Start`
- **R3.3**: ครอบคลุมคำแนะนำและ Best Practices สำหรับ 4 กลุ่มบทบาท:
  1. **🔰 Junior Developer Path**:
     - เริ่มต้นวันใหม่ด้วย `/devflow` เพื่อดูสถานะว่าอยู่ที่ Stage ไหน
     - การรับ Task และปล่อยให้ AI ร่าง `40-implement` ควบคู่กับการเขียน Unit Test (TDD)
     - การอ่านและปฏิบัติตามคู่มือ `/try` เพื่อ Manual Test ในเครื่อง
     - การใช้ Review Gates เป็นตาข่ายนิรภัยป้องกันความผิดพลาด
  2. **⚡ Mid / Senior Software Engineer Path**:
     - การร่วมวาง Architectural Design (`/architecture`, `/api-and-interface-design`, `/domain-modeling`)
     - การตรวจร่าง `20-spec` และ `30-plan` เพื่อคุม Module Boundaries
     - การรัน Multi-Lane Verification (`/50-verify`) และการปิดช่องโหว่ความปลอดภัย (`/security-review`)
     - การใช้ Multi-AI Engine Adapters สลับระหว่าง Antigravity, Claude Code และ Codex
  3. **🛡️ Tech Lead & Software Architect Path**:
     - การตั้งค่า Baseline โปรเจกต์ด้วย `/onboard` หรือ `/adopt`
     - การควบคุม Findings Ledger ใน `findings.md` และการห้าม Merge หากมี P0/P1 ค้าง
     - การตั้งค่า Automated Verification CI (`/ci`)
     - การติดตาม Health ของทั้งระบบผ่าน `/doctor` เพื่อป้องกัน Workflow Drift
  4. **📊 Product Manager (PO/PM) & Engineering Manager Path**:
     - การสำรวจไอเดียและสร้างข้อกำหนดเชิงธุรกิจด้วย `/00-discover`, `/brainstorm`, และ `/prd`
     - การแบ่งก้อนงานเป็น Delivery Slices ใน `/10-define`
     - การตรวจรับงานอย่างมั่นใจผ่าน Interactive HTML Delivery Reports (`60-report.html`)
     - การบริหาร Release Lifecycle และ Roadmap (`/70-release`, `/roadmap-strategy`, `/changelog`)

### REQ-4: การตรวจสอบคุณภาพและการ Build เว็บไซต์ (Verification & Build)
- **R4.1**: รันคำสั่งบิลด์เว็บไซต์ `npm run docs:build` ผ่าน 100% โดยไม่มีข้อผิดพลาด
- **R4.2**: รัน `npm run check:static` และ `npm test` เพื่อให้แน่ใจว่าไม่มีการละเมิดสัญญาของ Monorepo

---

## 3. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-1** | 8-Stage Workflow Deep-Dive | หน้า `core-workflow.md` และ `mainline-stages.md` ได้รับการปรับปรุงเป็นโครงสร้างแบบการ์ด/ลำดับขั้นที่อธิบายครบ 5 องค์ประกอบ (Purpose, Inputs, Execution Loop, Deliverables, Review Gate Criteria) โดยไม่ใช้ตารางสรุปสั้น |
| **AC-2** | Full Companion Commands Catalog | หน้า `companion-commands.md` แสดงรายการคำสั่งครบทุกตัวที่มีใน `.agents/skills/` (ทั้ง 8 หมวดหมู่ 70+ ตัว) พร้อมคำอธิบายและตัวอย่าง |
| **AC-3** | Role-Based Usage Guide | มีไฟล์ `start/roles-guide.md` ที่อธิบายครอบคลุมทั้ง 4 กลุ่มบทบาท และแสดงใน Sidebar ของ `astro.config.mjs` อย่างถูกต้อง |
| **AC-4** | Build & Verification Pass | คำสั่ง `npm run docs:build`, `npm run check:static`, และ `npm test` ทำงานผ่าน 100% โดยไม่มี error |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
30-plan RUN-010-improve-website-documentation-content
```
