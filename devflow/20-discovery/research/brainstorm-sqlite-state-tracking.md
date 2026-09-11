# 🧠 Brainstorm: SQLite Database for DevFlow State & UI Dashboard

### Context
Nexus-DevFlow 2.0 ปัจจุบันใช้สถาปัตยกรรม **Markdown-First** (`devflow/runs/{id}-{slug}/*.md`) ในการจัดเก็บ state, specifications, plans, implementation logs และ verification results 

เมื่อระบบเติบโตขึ้น มีคำถามว่า **"การนำ SQLite มาใช้เก็บ state และประวัติการทำงาน แทน Markdown บางส่วน จะดีขึ้นหรือไม่?"** และจะสามารถนำมาต่อยอดเป็น **UI Dashboard** เพื่อติดตามสถานะการทำงาน (Run timeline, Stage progress, Metrics) ได้อย่างไร

---

### Option A: Companion Index / Read Model (Markdown SOT + SQLite Cache/Event Store) ⭐ (Recommended)
**แนวคิด:** คงไฟล์ Markdown ไว้เป็น **Source of Truth (SOT)** เพื่อให้ Git-friendly และ Agent-friendly ตามเดิม แต่เพิ่ม **SQLite (`.nexus/devflow.db` หรือ `devflow/.cache.db`)** ทำหน้าที่เป็น Index / Projection / Event Log สำหรับ Query และ UI Dashboard โดยอัตโนมัติ

- **Markdown:** จัดเก็บ Spec, Plan, Design Decisions, Verification Report (Version-controlled ใน Git, ดู Diff ใน PR ได้, LLM อ่านได้ทุก Tool)
- **SQLite:** จัดเก็บ State machine, Run metadata, Stage timestamps, Task checklist status, Telemetry/Logs สำหรับ UI

✅ **Pros:**
- **Zero Drift กับ LLM Tools:** AI Agents ทุกค่าย (Codex, Antigravity, Claude Code, Cursor) ยังคงอ่าน/เขียนไฟล์ Text/Markdown ได้ทันทีโดยไม่ต้องพึ่ง SQLite driver/MCP
- **Git Friendly:** ไม่มีปัญหา Binary merge conflict บน Git (ใส่ `.nexus/*.db` ใน `.gitignore`)
- **Fast Dashboard UI:** หน้าเว็บ/Desktop UI สามารถรัน SQL query (aggregations, filters, charts) ได้ด้วยความเร็ว < 5ms
- **Self-Healing:** สามารถ Re-index ข้อมูลทั้งหมดจาก Markdown เข้า SQLite ใหม่ได้ตลอดเวลา (`devflow index` หรือ Auto-sync on file change)

❌ **Cons:**
- ต้องมี Sync mechanism (File watcher หรือ CLI Hook) เพื่ออัปเดต SQLite เมื่อไฟล์ Markdown มีการเปลี่ยนแปลง
- มีความซ้ำซ้อนของข้อมูลบางส่วน (Data redundancy ระหว่าง MD Frontmatter และ SQLite Table)

📊 **Effort:** Medium

---

### Option B: Pure SQLite State Management (แทนที่ State MD ทั้งหมดด้วย SQLite)
**แนวคิด:** ย้าย State, Task status, Checklist, Execution logs ทั้งหมดไปเก็บใน SQLite Tables (`runs`, `stages`, `tasks`, `verifications`) โดยไฟล์ Markdown จะเหลือเฉพาะเอกสารความรู้หรือ Spec ขนาดใหญ่เท่านั้น

✅ **Pros:**
- **Strict Schema & ACID Transactions:** มี Type safety, Foreign Keys, และ Data validation ป้องกัน Agent เขียน State ผิด Format
- **High Performance & Granularity:** สามารถบันทึก Event ละเอียดระดับวินาที (เช่น agent thoughts, token usage, tool calls) โดยไม่ทำให้โฟลเดอร์เต็มไปด้วยไฟล์ `.md`
- **Native UI Support:** UI สามารถเชื่อมต่อผ่าน SQLite / SQLite WASM / REST/GraphQL API ได้โดยตรง

❌ **Cons:**
- **ทำลาย Git PR Review:** การเปลี่ยนแปลง State จะอยู่ใน Binary DB ทำให้ดู diff บน GitHub PR ไม่ได้
- **Agent Dependency Lock-in:** Agent จำเป็นต้องมี SQLite CLI / MCP Server / Custom Tool เพื่ออ่านและเขียน State (หาก Agent ตัวไหนไม่มี tool จะไม่สามารถทำงานตาม stage ได้)
- **Multi-Branching / Merge Pain:** หากสลับ Git branch หรือ merge conflict เกิดขึ้นกับไฟล์ `.db` จะแก้ยากมาก

📊 **Effort:** High

---

### Option C: Virtual / In-Memory SQLite via Local File Watcher (Markdown + SQLite WASM in UI)
**แนวคิด:** ไม่มีการบันทึกไฟล์ SQLite ลงใน Project เลย แต่เมื่อเปิดหน้า UI Dashboard ให้ Dashboard Server (หรือ Browser ผ่าน SQLite WASM / DuckDB WASM) ทำการ Parse Markdown Frontmatter & Files ทั้งหมดเข้ามาใน In-Memory SQLite เพื่อ Render UI

✅ **Pros:**
- **Pure Zero-Config:** ไม่มีไฟล์ Database ให้ต้องดูแล หรือกลัว Database corrupt
- **100% Markdown-First Purity:** คง Core philosophy ของ DevFlow ไว้ทั้งหมด
- **Real-time Reactive:** UI ใช้ File Watcher (Chokidar) ตรวจจับการแก้ไฟล์ MD แล้วอัปเดต In-Memory DB ทันที

❌ **Cons:**
- ไม่เหมาะกับประวัติการทำงานที่มีข้อมูล Log ละเอียดระดับ Micro-events (เพราะถ้าจะเก็บต้องเขียนลง MD ซึ่งไฟล์จะบวม)
- หากมีจำนวน Run หลายพัน runs การ Parse ไฟล์ Text ทุกครั้งที่เปิด UI อาจใช้เวลาบูตช้าลงเล็กน้อย (1-2 วินาที)

📊 **Effort:** Low - Medium

---

## 💡 Comparison Matrix

| เกณฑ์การเปรียบเทียบ | Markdown เดิม | Option A: Companion SQLite | Option B: Pure SQLite | Option C: In-Memory / WASM |
| :--- | :--- | :--- | :--- | :--- |
| **Git Diff & PR Review** | ⭐⭐⭐⭐⭐ ดีเยี่ยม | ⭐⭐⭐⭐⭐ ดีเยี่ยม (DB gitignored) | ⭐ แย่ (Binary conflict) | ⭐⭐⭐⭐⭐ ดีเยี่ยม |
| **Agent Portability (All LLMs)** | ⭐⭐⭐⭐⭐ อ่านตรงได้เลย | ⭐⭐⭐⭐⭐ อ่านตรงได้เลย | ⭐⭐ ต้องใช้ MCP / CLI | ⭐⭐⭐⭐⭐ อ่านตรงได้เลย |
| **UI Dashboard Query Speed** | ⭐⭐ ต้อง parse ไฟล์ | ⭐⭐⭐⭐⭐ เร็วมาก (SQL) | ⭐⭐⭐⭐⭐ เร็วมาก (SQL) | ⭐⭐⭐⭐ เร็วมาก |
| **Micro-event / Metric Logs** | ⭐ ไฟล์บวม รก workspace | ⭐⭐⭐⭐⭐ เก็บใน DB สบาย | ⭐⭐⭐⭐⭐ เก็บใน DB สบาย | ⭐⭐ เก็บได้เฉพาะใน MD |
| **Schema Integrity & Validation** | ⭐⭐ ขึ้นกับ Prompt/Lint | ⭐⭐⭐⭐ มี Validator คอย Sync | ⭐⭐⭐⭐⭐ DB Constraints | ⭐⭐⭐ Validator ตอน Parse |
| **Setup & Maintenance Overhead** | ⭐⭐⭐⭐⭐ ต่ำสุด | ⭐⭐⭐ ปานกลาง (Auto-sync) | ⭐ ซับซ้อนสูง | ⭐⭐⭐⭐ ต่ำ |

---

## 💡 Recommendation & UI Extension Path

**แนะนำ Option A (Companion Index / Event Store)** เป็นแนวทางที่ดีที่สุด เพราะ:
1. **ไม่ทำลายจุดแข็งของ DevFlow:** DevFlow ออกแบบมาให้ทำงานร่วมกับ AI Coding Agents ทุกตัวผ่านไฟล์ Markdown และ Git Workflow
2. **แก้ Pain Point เรื่อง UI & Query:** สามารถต่อยอดหน้า **DevFlow Web/Desktop UI Dashboard** ได้อย่างมีประสิทธิภาพ:
   - **Kanban Board:** ดึงสถานะ Run จาก `/10-Define` ถึง `/70-Release` ได้ทันที
   - **Run Timeline & Gantt:** ดูระยะเวลาที่ใช้ในแต่ละ Stage
   - **Real-time Agent Telemetry:** บันทึก Step การ Implement, Test results, Error history ลง SQLite ได้โดยไม่ทำให้ไฟล์ Markdown ของผู้ใช้รก
   - **Search & Filter:** ค้นหาประวัติ Run ตาม Tags, สรุปผลลัพธ์, หรือ Error ที่เคยเจอ

### ส่วนของ Markdown ที่ควรคงไว้ vs ส่วนที่ควรย้าย/เก็บเสริมใน SQLite:
- **คงไว้ใน Markdown (Human & Agent readable):**
  - Problem Statement & Scope (`10-define.md`)
  - Architectural Specs & Contracts (`20-spec.md`)
  - High-level Executable Tasks (`30-plan.md`)
  - Verification & Senior QA Evidence (`50-verify.md`)
  - Human Summary Report (`60-report.md`)
- **เก็บเสริม/Index ใน SQLite (Machine & UI consumption):**
  - State Transitions (Timestamp เริ่ม-จบ ของแต่ละ Stage)
  - Sub-task Checklist progress (0/5 completed)
  - Test run executions (passed/failed counts, execution time)
  - Agent run logs / Tool call events (telemetry)
  - Token consumption & Estimated cost (ถ้ามี)

---

## Next Suggested Actions

1. **Phase 1 (Schema Design):** ออกแบบ SQLite Schema สำหรับ Run State & Event Logs (เช่น ตาราง `runs`, `stage_transitions`, `tasks`, `verification_runs`)
2. **Phase 2 (Sync Engine / Parser):** พัฒนา CLI Command `devflow sync` หรือ Background Watcher ที่คอยสกัด Markdown Frontmatter เข้า SQLite
3. **Phase 3 (Dashboard UI Prototype):** พัฒนา Local Web UI (เช่น Vite + React / Tailwind หรือ Lightweight Next.js) ที่อ่านข้อมูลจาก SQLite มาแสดงผลเป็น Run Timeline และ Kanban Board
