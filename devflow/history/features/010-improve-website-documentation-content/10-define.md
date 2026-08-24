# Phase 10: Define Contract

- **Running ID**: `RUN-010-improve-website-documentation-content`
- **Title**: ปรับปรุงเนื้อหาบนเว็บไซต์ Documentation ของ Nexus-DevFlow (อธิบาย 8-Stage Workflow เชิงลึกแบบไม่ใช้ตาราง, รวบรวม Companion Commands ครบทุกโฟลเดอร์, และเพิ่ม Role-Based Usage Guide)
- **Source Discovery**: [DISC-20260818-006-improve-website-docs-content](../../discoveries/DISC-20260818-006-improve-website-docs-content/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Documentation & DX Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

ต่อยอดและยกระดับเนื้อหาบนเว็บไซต์ Documentation (`website/src/content/docs/`) ของ **Nexus-DevFlow 2.0** ให้ครอบคลุม ชัดเจน และตอบโจทย์ผู้ใช้งานทุกระดับ โดย:
1. **อธิบาย 8-Stage Workflow หลักเชิงลึกโดยไม่ใช้ตาราง**: เปลี่ยนจากการสรุปย่อในตารางสั้นๆ มาเป็นการอธิบายเชิงลึกแบบการ์ด/ลำดับขั้น (Detailed Breakdown) ที่มีทั้ง Purpose, Inputs/Context, AI Execution Loop, Deliverable Artifacts, และ Review Gate Criteria
2. **รวบรวมและอธิบาย Companion Commands ครบทุกตัวตามโฟลเดอร์จริงใน `.agents/skills/` (70+ ตัว)**: จัดแบ่ง 8 หมวดหมู่เชิงสถาปัตยกรรม อธิบายหน้าที่ของแต่ละ Command อย่างละเอียด พร้อมตัวอย่างการใช้งาน
3. **เพิ่มหมวดหมู่ Role-Based Usage Guide ตั้งแต่ Junior ไปจนถึง Manager**: จัดทำแนวทางการใช้งาน DevFlow แยกตามบทบาทและระดับประสบการณ์ (Junior Developer, Senior Engineer, Tech Lead/Architect, และ Product/Engineering Manager) เพื่อให้ทุกคนในทีมสามารถนำ Framework ไปปรับใช้ได้อย่างมีประสิทธิภาพสูงสุด

---

## 2. ขอบเขตงาน (In-Scope)

### Slice 1: ปรับปรุงหน้า Workflow หลักและ Mainline Stages
- แก้ไข [`website/src/content/docs/workflow/core-workflow.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/workflow/core-workflow.md) และ [`website/src/content/docs/commands/mainline-stages.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/mainline-stages.md)
- อธิบายกระบวนการ 8 ขั้นตอน (`00-discover` ถึง `70-release`) แบบ Non-Table พร้อมระบุ:
  - วัตถุประสงค์ (Purpose & Intent)
  - ข้อมูลนำเข้าและบริบท (Inputs & Context)
  - พฤติกรรมการทำงานของ AI และมนุษย์ (AI Execution Loop & Human Action)
  - ไฟล์ผลลัพธ์ (Artifacts & Markdown-First Contracts)
  - เกณฑ์การผ่านด่านและการตรวจรับ (Review Gate Criteria)

### Slice 2: ปรับปรุงหน้า Companion Commands ครบทุกโฟลเดอร์ (70+ Skills)
- แก้ไข [`website/src/content/docs/commands/companion-commands.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/commands/companion-commands.md)
- รวบรวมและแจกแจงคำสั่งตาม 8 หมวดหมู่:
  1. Core Utilities & Navigation (`/devflow`, `/doctor`, `/try`, `/rollback`, `/ci`, `/help`, `/brief`, `/status`)
  2. Autonomous & Discovery (`/autopilot`, `/goal`, `/brainstorm`, `/prd`, `/roadmap-strategy`, `/competitor-analysis`)
  3. Investigation & Quality Control (`/debug`, `/issue-triage`, `/security-review`, `/review`, `/lint-and-validate`, `/test`)
  4. Architecture & Engineering Design (`/architecture`, `/codebase-design`, `/domain-modeling`, `/database-design`, `/api-and-interface-design`, `/type-design`, `/performance-optimization`, `/spec-driven-development`, `/documentation-and-adrs`, `/app-builder`, `/mcp-builder`)
  5. Frontend, UI & Full-Stack (`/frontend-ui-engineering`, `/ui-ux-pro-max`, `/tailwind-patterns`, `/nextjs-react-expert`, `/mobile-design`, `/prototype`)
  6. Backend, Systems & Platforms (`/nodejs-best-practices`, `/python-patterns`, `/bash-linux`, `/powershell-windows`, `/server-management`)
  7. Git & Delivery Lifecycle (`/commit`, `/pr`, `/merge`, `/deploy`, `/preview`, `/changelog`, `/followup`)
  8. AI Collaboration & Metaprogramming (`/agent`, `/parallel-agents`, `/behavioral-modes`, `/context-engineering`, `/insight`, `/skill-development`, `/simplify`, `/i18n-localization`, `/seo-fundamentals`, `/handoff`, `/package-json-generator`)

### Slice 3: จัดทำหน้า Role-Based Usage Guide
- สร้างหน้าใหม่ [`website/src/content/docs/start/roles-guide.md`](file:///d:/Projects/devtools/nexus-devflow/website/src/content/docs/start/roles-guide.md)
- ปรับปรุง [`website/astro.config.mjs`](file:///d:/Projects/devtools/nexus-devflow/website/astro.config.mjs) ให้มีเมนู Role-Based Guides ใน Sidebar
- ครอบคลุม 4 กลุ่มบทบาท:
  1. **Junior Developer**: การเริ่มต้นใช้งาน, การรับงานและป้องกันหลงทาง, การทำ TDD ใน Implement, การทดสอบผ่าน Try Guide
  2. **Mid / Senior Engineer**: การออกแบบ Spec/Plan, การคุม Modular Architecture, การทำ Multi-Lane QA, Multi-AI Adapters
  3. **Tech Lead / Software Architect**: การคุมคุณภาพโปรเจกต์ด้วย Findings Ledger, CI Alignment, Domain Boundaries, ADRs
  4. **Product Manager (PO/PM) & Engineering Manager**: การทำ Discovery/PRD, การซอย Scope (Define), การตรวจรับงานจาก Interactive HTML Reports (`60-report.html`), Release Governance

### Slice 4: ตรวจสอบความถูกต้องและการ Build ของเว็บไซต์
- ทดสอบ Build ด้วย `npm run docs:build` (หรือ `npm --prefix website run build`) เพื่อยืนยันว่าไม่มี Broken Link หรือ Syntax Error

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แก้ไข Core Engine หรือ CLI ใน `packages/create-nexus-devflow/`
- ไม่สร้างหมวดหมู่หรือโฟลเดอร์ Skill ปลอมที่ไม่มีอยู่จริงใน `.agents/skills/`

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-010`** | `improve-website-documentation-content` | ปรับปรุงเนื้อหาบนเว็บไซต์ Docs ครบทั้ง 3 ข้อกำหนด (Workflow ลึกแบบไม่ใช้ตาราง, Companion Commands 70+ ตัวครบทุกโฟลเดอร์, และ Role-Based Usage Guide) พร้อม Build ตรวจสอบความถูกต้อง |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. หน้า `core-workflow.md` และ `mainline-stages.md` มีคำอธิบายกระบวนการ 8 ขั้นตอนอย่างละเอียดในรูปแบบการ์ด/หัวข้อ (ไม่ใช้ตารางล้วน)
2. หน้า `companion-commands.md` มีรายการคำสั่งครบทุกโฟลเดอร์ที่มีใน `.agents/skills/` (รวม 8 หมวดหมู่) พร้อมคำอธิบายและตัวอย่าง
3. มีหน้า `start/roles-guide.md` ที่อธิบายการใช้งานตั้งแต่ Junior Developer จนถึง Engineering Manager / Product Manager และเชื่อมโยงใน Sidebar
4. เว็บไซต์สามารถ Build ผ่านได้ 100% โดยไม่มี Error

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
20-spec RUN-010-improve-website-documentation-content
```
