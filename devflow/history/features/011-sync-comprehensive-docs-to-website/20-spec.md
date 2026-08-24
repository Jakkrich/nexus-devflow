# Phase 20: Delivery Specification

- **Running ID**: `RUN-011-sync-comprehensive-docs-to-website`
- **Title**: ข้อกำหนดการปรับปรุงและสังเคราะห์เนื้อหาบนเว็บไซต์คู่มือ Nexus-DevFlow จากคลังเอกสารทางการในโฟลเดอร์ `docs/`
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Documentation & DX Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้เป็นสัญญาการส่งมอบ (Delivery Contract) สำหรับรอบการพัฒนา **`RUN-011`** เพื่อปรับปรุง ยกระดับ และสังเคราะห์เนื้อหาบนเว็บไซต์ Documentation (`website/src/content/docs/`) ของ **Nexus-DevFlow 2.0** โดยอ้างอิงข้อมูลเชิงลึกและเป็นทางการจากคลังเอกสารในโฟลเดอร์ `docs/` (`USAGE.md`, `workspace-artifacts.md`, `example-runs.md`, `markdown-metadata-contract.md`, `manual-review-workflow-spec.md`, `workflow-surface-map.md`, `team-presets.md`, `governance-rules.md`):

1. **อธิบาย 8-Stage Workflow เชิงลึกแบบ Non-Table พร้อม Interactive HTML Diagrams**:
   - อธิบาย Intent, Context, Execution Loop, Deliverable Artifacts, และ Review Gate Criteria อย่างละเอียด
   - นำเสนอผังกระบวนการแบบการ์ด HTML และ Mermaid Diagrams ที่สวยงาม สอดคล้องกับ Technical Light Design System
2. **รวบรวมและจัดหมวดหมู่ Companion Commands ครบถ้วนตามโฟลเดอร์จริงใน `.agents/skills/` (70+ Skills)**:
   - จัดหมวดหมู่ 8 ด้านวิศวกรรม พร้อมไวยากรณ์ Universal Invocation (`/command`, `$command`, หรือ Plain) และตัวอย่าง Use Case
3. **จัดทำ Role-Based Usage Guides สำหรับ 4 กลุ่มบทบาท**:
   - Junior Developer, Mid/Senior Software Engineer, Tech Lead/Software Architect, และ Product/Engineering Manager
4. **ความสมบูรณ์ในการ Build และไร้ข้อผิดพลาด (Verification Pass)**:
   - เว็บไซต์ต้อง Build ผ่าน 100% ปราศจาก Broken Link, TypeScript Error, หรือ Syntax Warning

---

## 2. ข้อกำหนดฟังก์ชันหลัก (Core Functional Requirements)

### REQ-1: การอธิบาย 8-Stage Workflow เชิงลึกแบบ Non-Table (8-Stage Deep-Dive)
- **R1.1**: ปรับปรุงหน้า [`website/src/content/docs/workflow/core-workflow.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/workflow/core-workflow.md) และ [`website/src/content/docs/commands/mainline-stages.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/mainline-stages.md)
- **R1.2**: ทุก Stage ตั้งแต่ `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, จนถึง `70-release` ต้องมีโครงสร้างเนื้อหาครบ 5 ส่วน:
  1. **🎯 วัตถุประสงค์ (Purpose & Intent)**: เหตุผลและคุณค่าของ Stage นั้นๆ
  2. **📥 ข้อมูลนำเข้าและบริบท (Inputs & Context)**: สิ่งที่ต้องมีก่อนเริ่ม
  3. **⚙️ วงจรการทำงาน (Execution Loop)**: การทำงานของ AI และจุดตัดสินใจของมนุษย์
  4. **📄 ผลลัพธ์ที่สร้างขึ้น (Deliverable Artifacts)**: พาธไฟล์ Markdown-First และ Standalone HTML
  5. **🚪 เกณฑ์การผ่านด่าน (Review Gate Criteria)**: เงื่อนไขการตรวจรับก่อนก้าวสู่ Stage ถัดไป
- **R1.3**: นำเสนอผังขั้นตอนการทำงาน (Pipeline Flow) ด้วย Interactive HTML Cards

### REQ-2: สารบัญและคำอธิบาย Companion Commands ครบทุกโฟลเดอร์ (70+ Skills Catalog)
- **R2.1**: ปรับปรุงหน้า [`website/src/content/docs/commands/companion-commands.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/companion-commands.md)
- **R2.2**: รวบรวมคำสั่งและทักษะทั้งหมดใน `.agents/skills/` จัดเป็น 8 หมวดหมู่:
  1. **Core Utilities & Navigation**: `devflow`, `doctor`, `try`, `rollback`, `ci`, `help`, `brief`, `status`
  2. **Autonomous & Discovery**: `autopilot`, `goal`, `brainstorm`, `prd`, `roadmap-strategy`, `competitor-analysis`
  3. **Investigation & Quality Control**: `debug`, `issue-triage`, `security-review`, `review`, `lint-and-validate`, `test`
  4. **Architecture & Engineering Design**: `architecture`, `codebase-design`, `domain-modeling`, `database-design`, `api-and-interface-design`, `type-design`, `performance-optimization`, `spec-driven-development`, `documentation-and-adrs`, `app-builder`, `mcp-builder`
  5. **Frontend, UI & Full-Stack**: `frontend-ui-engineering`, `ui-ux-pro-max`, `tailwind-patterns`, `nextjs-react-expert`, `mobile-design`, `prototype`
  6. **Backend, Systems & Platforms**: `nodejs-best-practices`, `python-patterns`, `bash-linux`, `powershell-windows`, `server-management`
  7. **Git & Delivery Lifecycle**: `commit`, `pr`, `merge`, `deploy`, `preview`, `changelog`, `followup`
  8. **AI Collaboration & Metaprogramming**: `agent`, `parallel-agents`, `behavioral-modes`, `context-engineering`, `insight`, `skill-development`, `simplify`, `i18n-localization`, `seo-fundamentals`, `handoff`, `package-json-generator`
- **R2.3**: ระบุ Syntax การเรียกใช้งานของทุก Tool (`/` สำหรับ Claude/Antigravity, `$` สำหรับ Codex) และตัวอย่างสถานการณ์ใช้งาน

### REQ-3: คู่มือการใช้งานตามบทบาท (Role-Based Usage Guides)
- **R3.1**: จัดทำหน้า [`website/src/content/docs/start/roles-guide.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/start/roles-guide.md)
- **R3.2**: เชื่อมโยงเข้าสู่ Sidebar ของ Starlight ใน [`website/astro.config.mjs`](file:///d:/Projects/devtools/nexus-devflow/website/astro.config.mjs) ภายใต้หมวด `Start`
- **R3.3**: อธิบาย Best Practices และ Workflow แนะนำสำหรับ 4 บทบาท:
  1. **🔰 Junior Developer Path**: เริ่มต้นวันด้วย `/devflow`, TDD ใน Implement, ทดสอบตาม `/try`, Review Gates นิรภัย
  2. **⚡ Mid / Senior Software Engineer Path**: Architecture & Domain Modeling, Spec/Plan discipline, Multi-Lane QA, Multi-AI Adapters
  3. **🛡️ Tech Lead & Software Architect Path**: Baseline Setup (`/onboard`/`/adopt`), Findings Ledger management, CI Automation, Doctor Health Checks
  4. **📊 Product Manager (PO/PM) & Engineering Manager Path**: Discovery/PRD/Brainstorm, Scope Slicing ใน Define, การตรวจรับงานจาก `60-report.html`, Release & Roadmap Governance

### REQ-4: การตรวจสอบคุณภาพและการ Build เว็บไซต์ (Verification & Build)
- **R4.1**: รันคำสั่งบิลด์เว็บไซต์ `npm run docs:build` (หรือ `astro build` ใน `website/`) ผ่าน 100% โดยไม่มี error

---

## 3. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-1** | 8-Stage Workflow Deep-Dive | หน้า `core-workflow.md` และ `mainline-stages.md` มีคำอธิบาย 8 Stages เชิงลึกแบบ Non-Table ครบทั้ง 5 มิติ พร้อม Interactive HTML Diagrams |
| **AC-2** | Full Companion Commands Catalog | หน้า `companion-commands.md` รวบรวมคำสั่งครบทุกโฟลเดอร์ใน `.agents/skills/` (ครบทั้ง 8 หมวดหมู่ 70+ ตัว) พร้อม Universal Invocation และตัวอย่าง Use Case |
| **AC-3** | Role-Based Usage Guide | มีไฟล์ `start/roles-guide.md` แสดงในเมนู Sidebar และอธิบายครบทั้ง 4 กลุ่มบทบาท (Junior, Senior, Tech Lead, PM/EM) |
| **AC-4** | Build & Verification Pass | คำสั่ง `npm run docs:build` ผ่าน 100% ปราศจาก Broken Links หรือ Error ใดๆ |

---

## 4. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แก้ไข Core Package Engine ใน `packages/create-nexus-devflow/`
- ไม่สร้างรายการคำสั่งหรือทักษะจำลองที่ไม่มีอยู่จริงใน `.agents/skills/`

---

## 5. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/30-plan RUN-011-sync-comprehensive-docs-to-website
```
