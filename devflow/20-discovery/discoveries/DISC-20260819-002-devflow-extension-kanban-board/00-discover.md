---
id: "DISC-20260819-002-devflow-extension-kanban-board"
title: "Discover: Nexus-DevFlow IDE Extension Interactive Kanban & Task Board"
doc_type: "discovery"
stage: "00-discover"
created: "2026-08-19"
updated: "2026-08-19"
owner: "User & Antigravity"
status: "draft"
artifact_language: "th"
decision: "Proceed"
selected_route: "Direct decision"
related_runs:
  - "RUN-013-devflow-ide-extension-kanban-board"
related_files:
  - "devflow/research/brainstorm-devflow-extension.md"
  - "devflow/runs/RUN-012-devflow-ide-extension-core-and-navigator/60-report.md"
  - "extensions/vscode/src/extension.ts"
---

# Discover: Nexus-DevFlow IDE Extension Interactive Kanban & Task Board

## 1. Objective

- สำรวจความเป็นไปได้ทางเทคนิค โครงสร้างสถาปัตยกรรม Webview และพฤติกรรมการ Sync ข้อมูลแบบ Two-Way (Markdown ⇄ Webview) สำหรับฟีเจอร์ **Interactive Kanban & Task Board** บน Nexus-DevFlow IDE Extension ก่อนส่งมอบเข้าสู่ `RUN-013`

## 2. Source Inputs

- User Request: การต่อยอดฟีเจอร์ Kanban Board ใน Extension
- Research Report: `devflow/research/brainstorm-devflow-extension.md` (แกนที่ 2: Markdown-Synced Kanban & Task Board)
- Existing Extension Codebase: `extensions/vscode/` (v0.1.1)

## 3. Project Context To Preserve

- **Markdown as Single Source of Truth:** การลากวางการ์ดหรือติ๊ก Checkbox ใน Kanban Webview ต้องอ่านและเขียนกลับไปยังไฟล์ `30-plan.md` และ `checklists/implementation-checklist.md` โดยตรง ไม่มีการเก็บ State ไว้ใน Database แยก
- **Lightweight & High Performance:** ใช้ Webview HTML/CSS/Vanilla JS หรือ Minimal React ที่โหลดเร็ว ไม่หน่วง IDE
- **VS Code Theme Alignment:** ใช้ CSS Variables ของ VS Code Theme (`var(--vscode-editor-background)`, `var(--vscode-button-background)`, ฯลฯ) เพื่อความกลมกลืนกับ Editor ทุกธีม

## 4. Request Summary

- พัฒนาหน้าต่าง **Kanban Board Webview Panel** ที่เชื่อมต่อกับ Active Run ใน Workspace แสดงคอลัมน์ `📋 Backlog`, `⏳ Todo`, `⚡ In Progress`, `🛡️ Verify`, และ `✅ Done` พร้อมรองรับ Drag-and-Drop และ Checkbox Toggle ที่อัปเดตไฟล์ Markdown แบบเรียลไทม์

## 5. Problem Or Opportunity

- **ปัญหาปัจจุบัน:** ผู้ใช้และ Agent เมื่อวางแผนใน `30-plan.md` และสร้าง Checklist ใน `implementation-checklist.md` ยังต้องเปิดดูไฟล์ Markdown ทีละบรรทัด ทำให้มองเห็นภาพรวมลำดับ Phase และสถานะของ Subtasks ได้ยาก
- **โอกาส:** การมี Visual Kanban Board จะช่วยให้ Developer เห็นความคืบหน้าของงานทั้งหมดได้ในมุมมองเดียว สามารถคลิกลากการ์ดเปลี่ยนสถานะ หรือคลิกเปิดดูไฟล์ที่เกี่ยวข้องกับ Subtask นั้นๆ ได้ทันที

## 6. Decision-Blocking Unknowns

- รูปแบบการ Parse และ Serializer ข้อความ Markdown Task ใน `30-plan.md` และ `implementation-checklist.md` เพื่อให้การ Rewrite ข้อมูลคง Format และ Comments ดั้งเดิมไว้ได้ 100%
- การส่ง Message ระหว่าง Webview กับ Extension Host (`postMessage` / `onDidReceiveMessage`)

## 7. Candidate Routes

| Route | Why It May Be Needed | Decision Question |
| :--- | :--- | :--- |
| `Brainstorm` | สำรวจไว้แล้วใน `brainstorm-devflow-extension.md` | - |
| `PRD` | ไม่จำเป็นเนื่องจากขอบเขตฟีเจอร์และ User Stories ชัดเจน | - |
| `Research` | ไม่จำเป็นเนื่องจากใช้ VS Code Webview API มาตรฐาน | - |
| `Debug` | ไม่จำเป็นเนื่องจากเป็นการพัฒนาฟีเจอร์ใหม่ | - |

## 8. Selected Route

- Route: Direct decision (พร้อมนำข้อมูลจากการสำรวจเข้าสู่การกำหนด Run)
- Return target: `/00-Discover DISC-20260819-002-devflow-extension-kanban-board`

## 9. Returned Findings

- สรุปความสามารถหลักของ Kanban Board Webview:
  1. **Multi-Column Board:** รองรับสถานะ `Backlog`, `Todo`, `In Progress`, `Verify`, `Done`
  2. **Two-Way Markdown Sync:** เมื่อเกิด Action ใน UI (Drag/Drop/Click) จะส่ง Message ไปให้ Extension Host เพื่อทำการ Parse/Update ไฟล์ Markdown บนดิสก์
  3. **Live File Watching:** หากไฟล์ Markdown ถูกแก้ไขจาก AI Agent หรือผู้ใช้จากภายนอก Webview จะดึงข้อมูลและ Re-render Board ทันที
  4. **Task Card Details:** แสดง Subtask ID, Title, Plan Phase, Files Expected to Change, และ Test Decision Badge

## 10. Candidate Delivery Slices

- **`RUN-013` (Interactive Kanban Board Webview):**
  - พัฒนา Markdown Task Parser & Serializer (`task-parser.ts`)
  - พัฒนา Webview Panel Provider (`kanban-panel.ts`) พร้อม UI Kanban Board สวยงาม
  - เชื่อมต่อ Two-way synchronization และ Live Watcher
  - เพิ่มคำสั่ง `DevFlow: Open Kanban Board` (`devflow.openKanban`)

## 11. Decision

- Status: `Proceed`
- Rationale: ฟีเจอร์นี้มอบคุณค่าสูงมากในการทำงานแบบ Visual Task Tracking ต่อเนื่องจาก `RUN-012` ได้อย่างราบรื่น

## 12. AI Actions Performed

- สร้างเอกสารการสำรวจ `00-discover.md` สำหรับฟีเจอร์ Kanban Board
- ออกแบบ Data Flow และ Interaction Model สำหรับ Two-way Markdown Sync

## 13. Human Review Required

- ยืนยันการตัดสินใจ `Proceed`
- อนุมัติการเข้าสู่ขั้นตอน `/10-Define` เพื่อจัดสรร Running ID `RUN-013`

## 14. Approval Status

- Approved

## 15. Next Allowed Command

- `/10-define DISC-20260819-002-devflow-extension-kanban-board`

## 16. Nexus Event

- -

## 17. Allocated Runs

- `RUN-013-devflow-ide-extension-kanban-board`

## 18. Change Log

- 2026-08-19: สร้างเอกสาร Initial discovery สำหรับฟีเจอร์ Kanban Board

## 19. Additional Notes

- -
