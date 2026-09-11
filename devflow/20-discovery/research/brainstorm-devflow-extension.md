# 🧠 Brainstorm: Nexus-DevFlow IDE Extension Capabilities & Architecture

## Context
Nexus-DevFlow 2.0 เป็น Workflow Framework สำหรับ AI Coding Agents ที่เน้น **Markdown-First** (`devflow/discoveries/*`, `devflow/runs/*`, `devflow/wiki/*`)
การทำ IDE Extension (เช่น VS Code / Cursor / Windsurf Extension) จะช่วยยกระดับ Developer Experience (DX) จากการอ่าน/พิมพ์คำสั่งใน Terminal หรือ Chat อย่างเดียว ให้กลายเป็น **Visual Cockpit & Interactive Workspace** โดยที่ยังรักษาหลักการ Markdown เป็น Single Source of Truth

---

## 🧭 รวมไอเดียฟีเจอร์สำหรับ DevFlow Extension (8 แกนหลัก)

### 1. Visual Stage Navigator & Timeline Cockpit (Lifecycle Controller)
* **Status Bar & Activity Bar Icon:** แสดง Stage ปัจจุบันของ Run ที่กำลัง Active (เช่น `⚡ DevFlow: [RUN-20260819-01] 40-Implement (Task 2/5)`)
* **Interactive Stepper / Breadcrumbs:** กราฟิกเส้นทาง `/00-Discover` ➔ `/10-Define` ➔ `/20-Spec` ➔ `/30-Plan` ➔ `/40-Implement` ➔ `/50-Verify` ➔ `/60-Report` ➔ `/70-Release`
* **Quick Stage Transition & Prompt Dispatcher:** คลิกปุ่มเพื่อคัดลอกคำสั่ง/ส่ง Prompt ไปยัง AI Chat หรือ Terminal ทันที พร้อม prefilled parameters เช่น Discovery ID / Running ID
* **Run Switcher:** สลับ Active Run ได้ง่ายผ่าน Dropdown ใน Sidebar

---

### 2. Markdown-Synced Kanban & Task Board (Plan & Implement Tracker)
* **Two-Way Sync Kanban:** ดึงข้อมูลจาก `30-plan.md` และ `40-implement.md` มาแสดงเป็น Kanban Board (`Backlog` | `Todo` | `In Progress` | `Verify` | `Done`)
* **Drag-and-Drop / Checkbox Toggle:** เมื่อลากการ์ดหรือติ๊กถูกใน Extension UI ระบบจะอัปเดต Checkbox `[ ]` ➔ `[x]` ในไฟล์ Markdown อัตโนมัติแบบเรียลไทม์
* **Discovery Backlog Board:** จัดการ Discovery items จาก `devflow/discoveries/` ก่อนแปลงเป็น Run จริง

---

### 3. Live Dashboard & Interactive Report Viewer
* **HTML/Mermaid Report Previewer:** เปิดดู `60-report.html` หรือ Preview Markdown artifacts (`20-spec.md`, `50-verify.md`) ในตัวพร้อม Render Mermaid Diagram สวยงาม
* **QA & Verification Matrix:** แสดงผลตาราง Test Results, Coverage, Lint/Type check status จาก `50-verify.md` ในรูปแบบ Dashboard Gauge/Status pill
* **Diff & Evidence Inspector:** แสดงรายการไฟล์ที่ถูกแก้ใน Run นั้นๆ พร้อมคลิกเปิด Side-by-Side Diff ทันที

---

### 4. 1-Click Project Setup, Onboarding Wizard & Health Doctor
* **Setup Wizard GUI:** หน้าต่าง Setup สำหรับโปรเจกต์ใหม่:
  * เลือกว่าจะติดตั้ง Adapter ตัวไหน (Antigravity/Codex `.agents/` หรือ Claude Code `.claude/` หรือทั้งคู่)
  * Scaffold โครงสร้างโฟลเดอร์ `devflow/`, `AGENTS.md`, `CLAUDE.md` อัตโนมัติ
* **DevFlow Doctor (Diagnostic Panel):**
  * ตรวจสอบความถูกต้องของโฟลเดอร์ (Contract check: `npm run check:static`)
  * ตรวจสอบว่ามี Run ไหนค้าง (Stale runs) หรือ Spec ขาดหัวข้อสำคัญหรือไม่
  * แจ้งเตือนเมื่อมี Update เวอร์ชั่นใหม่ของ `@jakkrichm/create-nexus-devflow`

---

### 5. MCP Hub & Tool Manager
* **MCP Server Monitor:** แผงควบคุมตรวจเช็กสถานะ MCP Servers ในเครื่อง (เช่น Postman, Playwright, Chrome DevTools, Database MCP)
* **MCP Config GUI:** จัดการไฟล์ `mcp_config.json` หรือ IDE MCP settings แบบมี UI ไม่ต้องแก้ JSON ดิบ
* **Tool Tester / Sandbox:** ทดลองเรียก MCP Tool และดูผลลัพธ์ JSON ได้โดยตรงจาก Sidebar ก่อนส่งให้ Agent ใช้งาน

---

### 6. Traceability & Context Lens (Spec ⇄ Code Bridge)
* **CodeLens Annotation:** เหนือหัวฟังก์ชันหรือไฟล์ แสดงข้อความ เช่น:
  * `📌 DevFlow: Defined in Spec [RUN-20260819-01]` (คลิกแล้วกระโดดไปเปิด `20-spec.md`)
* **Spec Anchor / Linker:** ปักหมุดโค้ดที่สัมพันธ์กับ Acceptance Criteria ใน Spec
* **Live File Watcher:** แสดง Badge บอกว่าไฟล์ไหนกำลังถูก Agent แก้ไขใน Task ปัจจุบัน

---

### 7. Smart Context Menu & Selection Actions
* **Right-Click Action Shortcuts:**
  * เลือกโค้ดแล้วคลิกขวา:
    * `DevFlow: Debug this function` (ส่งเข้า `/debug` workflow)
    * `DevFlow: Refactor with Stage 40` (เพิ่มเข้า `30-plan.md`)
    * `DevFlow: Extract Insight to Wiki` (บันทึก Gotchas เข้า `devflow/wiki/`)
  * คลิกขวาที่โฟลเดอร์: `DevFlow: Start Discovery here`

---

### 8. Knowledge Base & Wiki Graph Visualizer
* **Wiki Explorer:** เมนูเปิดดูบทเรียนและ Best Practices ใน `devflow/wiki/`
* **Knowledge Graph:** แสดงความสัมพันธ์แบบ Visual Mindmap/Graph ระหว่าง Features, Specs, Discoveries, และ Wiki Lessons
* **Semantic/Keyword Search:** ค้นหาคำตัดสินใจเก่าๆ (ADRs), Gotchas, หรือ Spec ย้อนหลังได้ทันที

---

## ⚖️ เปรียบเทียบแนวทางการพัฒนา (Architectural Approaches)

### Option A: Pure VS Code Native (Custom TreeViews + Webviews)
* **แนวคิด:** เขียน Extension ด้วย VS Code API 100% อ่านไฟล์ `.md` และ `.json` ใน Workspace โดยตรง
* ✅ **ข้อดี:** เบามาก, เปิดเร็ว, ไม่ต้องมี Background process อื่น, ติดตั้งผ่าน VS Code Marketplace จบในตัว
* ❌ **ข้อด้อย:** การแชร์ Logic กับ CLI หรือเครื่องมืออื่นอาจต้องเขียนซ้ำ

### Option B: Core Extension + Local Daemon/CLI Bridge (Recommended)
* **แนวคิด:** Extension ทำหน้าที่เป็น UI Layer เชื่อมต่อกับ Core CLI (`@jakkrichm/nexus-devflow-core`) ผ่าน RPC/IPC หรือ Local SQLite DB
* ✅ **ข้อดี:** Logic เดียวกันทั้งใน Terminal, IDE, และ MCP Server, จัดการ State ซับซ้อนและ Live File Watching ได้เสถียรมาก
* ❌ **ข้อด้อย:** ต้องจัดการ Lifecycle ของ Node.js process / CLI bindings

### Option C: Webview-Centric SPA (Dashboard Shell)
* **แนวคิด:** สร้าง Full React/Vite SPA ฝังลงใน VS Code Webview Panel เดียว
* ✅ **ข้อดี:** สวยงามจัดเต็ม ทำ Kanban แบบ interactive ได้ลื่นไหล
* ❌ **ข้อด้อย:** หนักกว่า Native TreeView และอาจรู้สึกไม่กลมกลืนกับ Native VS Code Sidebar หากไม่ได้ใช้ VS Code Theme Tokens

---

## 💡 คำแนะนำในการจัดลำดับพัฒนา (Phased Roadmap Recommendation)

| Phase | ฟีเจอร์หลัก | ผลลัพธ์ที่ได้ |
|---|---|---|
| **Phase 1 (MVP / Quick Win)** | 1. Visual Stage Navigator (Sidebar + Status bar)<br>2. 1-Click Project Setup & Doctor<br>3. Task List Checkbox Sync (`30-plan.md`) | ผู้ใช้ติดตั้งง่าย มีตัวช่วยดู Stage และสลับ Task ได้ทันที |
| **Phase 2 (Visual Experience)** | 1. Kanban Board Webview (Interactive Drag & Drop)<br>2. Report Viewer & Mermaid Renderer<br>3. Right-Click Context Actions | ได้ Dashboard + Kanban สวยงาม ยกระดับการวางแผน |
| **Phase 3 (Deep Integration)** | 1. Spec ⇄ Code Lens Traceability<br>2. MCP Server Hub & Monitor<br>3. Wiki Knowledge Graph | เชื่อมโยง Agent, Tool, และ Codebase เข้าด้วยกันอย่างสมบูรณ์ |
