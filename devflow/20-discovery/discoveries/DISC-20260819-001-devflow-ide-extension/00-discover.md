---
id: "DISC-20260819-001-devflow-ide-extension"
title: "Discover: Nexus-DevFlow IDE Extension"
doc_type: "discovery"
stage: "00-discover"
created: "2026-08-19"
updated: "2026-08-19"
owner: "User & Antigravity"
status: "draft"
artifact_language: "th"
decision: "Proceed"
selected_route: "Brainstorm"
related_runs: []
related_files:
  - "devflow/research/brainstorm-devflow-extension.md"
---

# Discover: Nexus-DevFlow IDE Extension

## 1. Objective

- สำรวจความเป็นไปได้ ขอบเขตฟีเจอร์ และแนวทางสถาปัตยกรรมในการพัฒนา IDE Extension (VS Code / Cursor / Windsurf) สำหรับสนับสนุนการใช้งาน Nexus-DevFlow 2.0 ก่อนส่งต่อเข้าสู่กระบวนการส่งมอบ (Delivery Run)

## 2. Source Inputs

- User Request: ความต้องการไอเดียฟีเจอร์ Extension เสริม DevFlow (เช่น Track running, รายงาน, Kanban, Dashboard, ตัวติดตั้งโปรเจกต์, เชื่อมต่อ MCP)
- Brainstorm Research Report: `devflow/research/brainstorm-devflow-extension.md`

## 3. Project Context To Preserve

- Nexus-DevFlow 2.0 Core Architecture (Markdown-First & Blueprint Model)
- ไฟล์สถานะหลัก: `devflow/context/current-stage.md`, `devflow/runs/`, `devflow/discoveries/`, `devflow/wiki/`
- Tool Adapters: `.agents/skills/`, `.claude/skills/`, `AGENTS.md`, `CLAUDE.md`

## 4. Request Summary

- ศึกษาและวางกรอบการสร้าง IDE Extension สำหรับ Nexus-DevFlow เพื่อช่วยอำนวยความสะดวกในการติดตาม Stage, จัดการ Task แบบ Kanban, พรีวิว Report, ติดตั้ง DevFlow ลงในโปรเจกต์ใหม่แบบ 1-Click, และเชื่อมต่อกับ MCP Servers

## 5. Problem Or Opportunity

- **ปัญหาปัจจุบัน:** ผู้ใช้และ AI Agent ต้องจัดการ DevFlow ผ่าน Terminal/CLI หรือ Text Editor ธรรมดา ซึ่งการอ่านสถานะ Stage การสลับ Run และการติ๊ก Checkbox Task ใน `30-plan.md` ยังขาด Visual Interactive Interface
- **โอกาส:** การมี IDE Extension จะช่วยสร้าง Visual Cockpit ในตัว Editor ทำให้ Developer เห็นภาพรวมขั้นตอนการทำงานชัดเจน (Visual Stage Navigator), บริหารจัดการ Task ได้สะดวกรวดเร็ว (Markdown-Synced Kanban), และเปิดดูรายงานแบบ Rich HTML/Mermaid ได้ทันที

## 6. Decision-Blocking Unknowns

- สถาปัตยกรรมระหว่าง Pure Native Extension (VS Code API อ่าน Markdown ตรง) กับ Core CLI Daemon Bridge (มี Local process/SQLite จัดการ State)
- การแบ่งขอบเขตพัฒนาเป็น Phase ย่อยเพื่อส่งมอบคุณค่าแบบ Incremental

## 7. Candidate Routes

| Route | Why It May Be Needed | Decision Question |
| :--- | :--- | :--- |
| `Brainstorm` | รวบรวมและเปรียบเทียบฟีเจอร์และสถาปัตยกรรม (ดำเนินการแล้ว) | ฟีเจอร์ใดควรอยู่ใน MVP และสถาปัตยกรรมใดเหมาะสมที่สุด? |
| `PRD` | ไม่จำเป็นในขั้นตอนนี้ เนื่องจากขอบเขตฟีเจอร์ชัดเจนจากผล Brainstorm | - |
| `Research` | อาจใช้ต่อในขั้นตอนเจาะลึก VS Code Webview & Language Server Protocol | - |
| `Debug` | ไม่จำเป็นเนื่องจากเป็นฟีเจอร์ใหม่ | - |

## 8. Selected Route

- Route: `Brainstorm` (ดำเนินการและสรุปผลแล้วใน `devflow/research/brainstorm-devflow-extension.md`)
- Return target: `/00-Discover DISC-20260819-001-devflow-ide-extension`

## 9. Returned Findings

- สรุป 8 แกนฟีเจอร์หลักสำหรับ Extension:
  1. Visual Stage Navigator & Timeline (Lifecycle Cockpit)
  2. Markdown-Synced Kanban & Task Board (Two-way sync)
  3. Live Dashboard & Interactive Report Viewer (HTML/Mermaid)
  4. 1-Click Project Setup, Onboarding Wizard & Health Doctor
  5. MCP Hub & Tool Manager
  6. Traceability & Context Lens (Spec ⇄ Code Bridge)
  7. Smart Context Menu & Selection Actions
  8. Wiki & Knowledge Graph Explorer
- แนะนำเริ่มพัฒนา Phase 1 (MVP) เน้นที่ Stage Navigator, Project Setup/Doctor, และ Markdown Checkbox Sync

## 10. Candidate Delivery Slices

- **Slice 1 (Core & Navigator):** Scaffold Extension Project + Visual Stage Navigator (Sidebar/Status bar) + Project Setup/Doctor UI
- **Slice 2 (Interactive Kanban):** Two-way Markdown Sync Kanban Board Webview
- **Slice 3 (Report & Traceability):** Live Report / Spec Previewer + CodeLens Annotations

## 11. Decision

- Status: `Proceed`
- Rationale: มีความคุ้มค่าสูง ชัดเจนในแง่ของ User Value และมีแผนงานทางเทคนิคที่สามารถแบ่งทำเป็น Phase ย่อยได้อย่างปลอดภัยโดยไม่กระทบ Core Markdown Contract ของ DevFlow

## 12. AI Actions Performed

- ดำเนินการวิเคราะห์ Brainstorm และจัดทำรายงาน `devflow/research/brainstorm-devflow-extension.md`
- สร้างเอกสาร Discovery artifact ตามมาตรฐาน DevFlow 2.0

## 13. Human Review Required

- ยืนยันการตัดสินใจ `Proceed` และอนุมัติการแบ่ง Slice เพื่อส่งต่อเข้าสู่ `/10-Define`
- ยืนยันว่าจะเริ่มทำ Slice 1 (Core Scaffold + Navigator + Setup Wizard) เป็น Run แรกหรือไม่

## 14. Approval Status

- Approved

## 15. Next Allowed Command

- `/10-Define DISC-20260819-001-devflow-ide-extension`

## 16. Nexus Event

- -

## 17. Allocated Runs

- `RUN-012-devflow-ide-extension-core-and-navigator`

## 18. Change Log

- 2026-08-19: สร้างเอกสาร Initial discovery draft และสรุปผล Brainstorm
- 2026-08-19: อนุมัติ Proceed และ Allocate `RUN-012-devflow-ide-extension-core-and-navigator`

## 19. Additional Notes

- -
