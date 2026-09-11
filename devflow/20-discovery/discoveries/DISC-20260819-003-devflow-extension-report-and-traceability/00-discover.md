---
id: "DISC-20260819-003-devflow-extension-report-and-traceability"
title: "Discover: Nexus-DevFlow IDE Extension Live Report Previewer & CodeLens Traceability"
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
  - "RUN-014-devflow-ide-extension-report-traceability"
related_files:
  - "devflow/research/brainstorm-devflow-extension.md"
  - "devflow/runs/RUN-013-devflow-ide-extension-kanban-board/60-report.md"
  - "extensions/vscode/src/extension.ts"
---

# Discover: Nexus-DevFlow IDE Extension Live Report Previewer & CodeLens Traceability

## 1. Objective

- สำรวจความเป็นไปได้ทางเทคนิคและออกแบบสถาปัตยกรรมสำหรับ **Phase 3** ของ Nexus-DevFlow IDE Extension ประกอบด้วย **Embedded HTML/Markdown Report Previewer** และ **CodeLens Spec ⇄ Code Traceability Provider** ก่อนส่งมอบเข้าสู่ `RUN-014`

## 2. Source Inputs

- User Request: การสำรวจสำหรับ `RUN-014`
- Research Report: `devflow/research/brainstorm-devflow-extension.md` (แกนที่ 3: Report Previewer & CodeLens Traceability)
- Existing Extension Codebase: `extensions/vscode/` (v0.2.0)

## 3. Project Context To Preserve

- **Seamless IDE Experience:** ไม่ต้องสลับออกจาก VS Code ไปยังเว็บเบราว์เซอร์ภายนอกเพื่อดูสรุปผลรายงาน
- **Non-Intrusive CodeLens:** แสดง CodeLens เฉพาะเมื่อมี Annotation Tag (เช่น `@devflow`, `@spec`, `@run`) โดยไม่ทำให้ Editor ช้าหรือรกสายตา
- **VS Code Theme & Security:** ใช้ Webview CSP และ Style Variables ตามมาตรฐาน

## 4. Request Summary

- พัฒนา 2 ฟีเจอร์หลักใน Phase 3:
  1. **Embedded Live Report Previewer (`report-panel.ts`):** เปิดดูไฟล์ `60-report.html` หรือแปลง `60-report.md` มาแสดงผลใน Webview Panel พร้อมรองรับการ Render Mermaid Diagram และ Dark/Light Mode อัตโนมัติ
  2. **CodeLens Traceability Provider (`codelens-provider.ts`):** แสดงป้าย CodeLens เหนือโค้ดที่ผูกกับ Spec/Run (เช่น `// @devflow RUN-013:AC-2`) คลิกแล้วเปิดไฟล์ Spec ไปยังบรรทัดที่เกี่ยวข้องทันที

## 5. Problem Or Opportunity

- **ปัญหาปัจจุบัน:**
  - เมื่อจบ Stage `60-report` ผู้ใช้ต้องเปิดไฟล์ `.html` ในเบราว์เซอร์ภายนอก หรืออ่าน Markdown ดิบ
  - เมื่ออ่านโค้ดในโปรเจกต์ ยากที่จะรู้ว่าฟังก์ชันหรือโมดูลนี้ถูกสร้างขึ้นมาจาก Running ID หรือ Spec ข้อใด
- **โอกาส:**
  - การมี Report Previewer ในตัวทำให้เห็นภาพรวมสวยงามได้ทันทีหลังเสร็จงาน
  - CodeLens Traceability ช่วยเชื่อมต่อความสัมพันธ์ระหว่าง Specification ➔ Plan ➔ Source Code ทำให้การบำรุงรักษาในระยะยาวง่ายขึ้นมหาศาล

## 6. Decision-Blocking Unknowns

- วิธีการ Match CodeLens Tag Pattern อย่างมีประสิทธิภาพในภาษาต่างๆ (`.ts`, `.js`, `.py`, `.go`, `.java`)
- การโหลด Script Mermaid.js ใน Webview ภายใต้ข้อกำหนด Content Security Policy (CSP)

## 7. Candidate Routes

| Route | Why It May Be Needed | Decision Question |
| :--- | :--- | :--- |
| `Brainstorm` | สำรวจไว้แล้วใน `brainstorm-devflow-extension.md` | - |
| `PRD` | ไม่จำเป็นเนื่องจาก User Stories และ Data Flow ชัดเจน | - |
| `Research` | ไม่จำเป็นเนื่องจากใช้ VS Code CodeLens & Webview API มาตรฐาน | - |

## 8. Selected Route

- Route: Direct decision (พร้อมนำเข้าสู่การกำหนดและล็อคสโคป `RUN-014`)
- Return target: `/00-Discover DISC-20260819-003-devflow-extension-report-and-traceability`

## 9. Returned Findings

- สรุปความสามารถหลักของ Phase 3 (`RUN-014`):
  1. **Report Webview Panel:** โหลดและ Render `60-report.html` ของ Active Run หรือเปิดดู Stage Reports ใดๆ พร้อมปุ่ม Export/Copy
  2. **Mermaid Rendering:** รองรับการแปลง Diagram ใน Markdown ให้เป็น SVG Visual สวยงาม
  3. **CodeLens Provider:** รองรับ Syntax:
     - `// @devflow RUN-xxx` หรือ `/* @devflow RUN-xxx */`
     - `# @devflow RUN-xxx` (Python/Shell)
     - แสดง CodeLens: `📌 DevFlow: Defined in [RUN-xxx]` (คลิกเปิดโฟลเดอร์หรือไฟล์ Spec ของ Run นั้น)
  4. **Commands:**
     - `DevFlow: Preview Stage Report` (`devflow.previewReport`)
     - `DevFlow: Go to Spec` (`devflow.goToSpec`)

## 10. Candidate Delivery Slices

- **`RUN-014` (Live Report Previewer & CodeLens Traceability):**
  - พัฒนา `src/views/report-panel.ts`
  - พัฒนา `src/providers/codelens-provider.ts`
  - ลงทะเบียนคำสั่งและ Unit Tests
  - แพ็กเกจ VSIX `v0.3.0`

## 11. Decision

- Status: `Proceed`
- Rationale: เป็นส่วนขยายสำคัญที่จะช่วยปิดวงจรจาก Discovery ➔ Spec ➔ Code ➔ Report ให้เห็นภาพสมบูรณ์แบบที่สุด

## 12. AI Actions Performed

- สร้างเอกสารการสำรวจ `00-discover.md` สำหรับ Phase 3
- ออกแบบ CodeLens regex matching pattern และ Report Previewer architecture

## 13. Human Review Required

- ยืนยันการตัดสินใจ `Proceed`
- อนุมัติการเข้าสู่ขั้นตอน `/10-Define` เพื่อจัดสรร Running ID `RUN-014`

## 14. Approval Status

- Approved

## 15. Next Allowed Command

- `/10-define DISC-20260819-003-devflow-extension-report-and-traceability`

## 16. Nexus Event

- -

## 17. Allocated Runs

- `RUN-014-devflow-ide-extension-report-traceability`

## 18. Change Log

- 2026-08-19: สร้างเอกสาร Initial discovery สำหรับ Phase 3 Report Previewer & CodeLens

## 19. Additional Notes

- -
