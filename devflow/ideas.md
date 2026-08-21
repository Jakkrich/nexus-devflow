# 💡 DevFlow Idea Inbox & Backlog

บันทึกไอเดียที่รอดำเนินการ พร้อมบทวิเคราะห์ความเป็นไปได้เบื้องต้นจาก AI (บันทึกด้วยคำสั่ง `/idea "<text>"`)

---

## 📌 Pending Ideas

### [IDEA-001] ขยาย Subcommands สำหรับ CLI (`idea`, `findings`, `doctor --fix`, `archive`)
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: เพิ่ม Subcommands ให้กับ CLI Engine เพื่อให้จัดการไอเดีย, ดู/แก้ Findings blockers, ทำ Auto-healing context, และจัดเก็บประวัติ (Archive) ผ่าน Terminal ได้โดยตรง
- **AI Feasibility & Tech**: **ง่ายถึงปานกลาง (High Feasibility)** — สามารถต่อยอดจากโมดูลที่มีอยู่แล้วใน `packages/create-nexus-devflow/lib/` (`findings.ts`, `status.ts`) และเพิ่มฟังก์ชันจัดการไฟล์ `devflow/ideas.md` กับ `devflow/history/`
- **Value & Potential**: **สูงมาก** — เพิ่มความคล่องตัวให้นักพัฒนาสามารถจัดการ Inbox, ตรวจ Blockers และสั่ง Auto-fix context ได้ทันทีโดยไม่ต้องเปิด Session คุยกับ AI
- **Quick Seed (กันลืม)**:
  1. `nexus-devflow idea add "<text>"` และ `nexus-devflow ideas list`
  2. `nexus-devflow findings --blockers` และ `nexus-devflow findings resolve <ID>`
  3. `nexus-devflow doctor --fix` ช่วยสร้าง Context Files และ Sync Adapters ที่หายไป
  4. `nexus-devflow archive` ย้าย Runs ที่ Release แล้วไป `devflow/history/archived-runs/`
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-001` หรือ `/00-discover IDEA-001`)

---

### [IDEA-002] CI/CD Quality Gatekeeper & Git Pre-commit Hooks (`devflow check-gate`)
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: สร้างระบบตรวจจับใน GitHub Actions PR และ Local Pre-commit เพื่อบล็อกการ Merge หรือ Commit หากยังมี P0/P1 Findings หรือ Checklist ยังไม่เสร็จ
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — ใช้ความสามารถของ `nexus-devflow status --json` ร่วมกับ `jq` หรือสร้าง subcommand `check-gate` ที่ return exit code `1` เมื่อ `completion.state == "blocked"`
- **Value & Potential**: **สูงมาก (Enterprise Governance)** — รับประกันว่าทีมงานจะไม่สามารถ Merge โค้ดที่มีข้อผิดพลาดร้ายแรงหรือข้ามขั้นตอน QA Gate เข้าสู่ Branch หลักได้
- **Quick Seed (กันลืม)**:
  1. เพิ่มคำสั่ง `nexus-devflow check-gate` ที่อ่าน JSON Status และคืนค่า Exit Code 0 หรือ 1
  2. สร้าง GitHub Actions Action / Reusable Workflow สำหรับตรวจ PR
  3. เตรียมสคริปต์ติดตั้ง Git Hook (เช่น `husky` หรือ `.git/hooks/pre-commit`)
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-002` หรือ `/00-discover IDEA-002`)

---

### [IDEA-003] Interactive Terminal UI (TUI) Dashboard (Ink / Clack)
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: สร้างแดชบอร์ดอินเตอร์แอคทีฟบน Terminal แบบ Rich UI สำหรับแสดงสถานะงาน Living Spec, รายการ Checklists, Findings และคำแนะนำ Next Action
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ใช้ไลบรารี CLI UI เช่น `@clack/prompts` หรือ `ink` (React for CLI) ในการเรนเดอร์ Interface แบบ Interactive
- **Value & Potential**: **สูง (Premium DX)** — สร้างความประทับใจระดับ Wow ให้กับผู้ใช้ สามารถใช้คีย์บอร์ดเลื่อนดู Task, ติ๊ก Checklist และกดคัดลอกคำสั่ง AI เข้า Clipboard ได้ทันที
- **Quick Seed (กันลืม)**:
  1. แถบ Navigation ด้านบน: `[Status] [Tasks] [Findings] [Next Action]`
  2. หน้า Tasks แสดง Checkbox ที่กดติ๊ก Spacebar ได้จริงเพื่ออัปเดตไฟล์ Markdown
  3. ปรับแต่ง Theme ให้เข้ากับ Dark Mode และแสดงผลผ่าน ANSI 256 Colors
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-003` หรือ `/00-discover IDEA-003`)

---

### [IDEA-004] DevFlow MCP Server (Model Context Protocol) & Multi-Agent API
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: ยกระดับ CLI ให้สามารถรันเป็น MCP Server (Model Context Protocol) เพื่อให้ AI Agents (Antigravity, Claude, Cursor, Codex) เรียกใช้ Tools ควบคุม DevFlow ได้โดยตรง
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ใช้ `@modelcontextprotocol/sdk` ของ Anthropic ในการเปิด JSON-RPC Server ผ่าน Stdio
- **Value & Potential**: **สูงสุด (Next-Gen AI Integration)** — AI ไม่ต้องใช้ Regex คอยสแกนหรือแก้ Markdown เอง แต่สามารถเรียก Tools เช่น `devflow_add_finding`, `devflow_update_task`, `devflow_get_status` ได้แบบ 100% Type-safe
- **Quick Seed (กันลืม)**:
  1. สร้าง Subcommand `nexus-devflow mcp` สำหรับรันเป็น MCP Server
  2. กำหนด MCP Tools: `get_status`, `add_idea`, `update_task`, `record_finding`
  3. เพิ่มไฟล์คอนฟิก `mcp_config.json` ให้ติดตั้งเข้า Antigravity/Claude ได้ในคลิกเดียว
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-004` หรือ `/00-discover IDEA-004`)

---

### [IDEA-005] ระบบ Internal State (`devflow/.state/`) สำหรับจัดการ Version Manifest, File Hashes & Safe Update Backups
- **บันทึกเมื่อ**: 2026-08-21
- **ไอเดียตั้งต้น**: เพิ่มการทำงานของ `.state/` แบบ blueprint โฟลเดอร์ภายในสำหรับบันทึก metadata, version, tool adapters, file checksums ใน manifest.json เพื่อรองรับคำสั่งอัปเดต พร้อมระบบ auto-backup ไฟล์ที่เกิด conflict ลงใน `devflow/.state/backups/` (ถูก `.gitignore`)
- **AI Feasibility & Tech**: **ง่ายถึงปานกลาง (High Feasibility)** — ใช้ Node.js built-in `crypto` (`createHash('sha256')`) ในการคำนวณ Checksum ของ workflow/skill/context files ร่วมกับ FS utilities ใน `packages/create-nexus-devflow` เพื่อรองรับคำสั่งอัปเดตเวอร์ชัน (`nexus-devflow update` / CLI updater) ตรวจจับ conflict และสร้าง backup อัตโนมัติ
- **Value & Potential**: **สูงมาก (Enterprise-grade Lifecycle & Maintainability)** — ป้องกันปัญหาไฟล์ workflow โดนเขียนทับโดยไม่ตั้งใจเมื่ออัปเกรดเวอร์ชันใหม่ รองรับการตรวจจับความเปลี่ยนแปลงของผู้ใช้ และช่วยให้การอัปเดต DevFlow ในโปรเจกต์ปลายทางเป็นไปอย่างปลอดภัย 100%
- **Quick Seed (กันลืม)**:
  1. สร้างโครงสร้าง `devflow/.state/manifest.json` เก็บ `version`, `installedAt`, `adapters` (antigravity, codex, claude), และ `fileHashes` (SHA-256)
  2. สร้าง `devflow/.state/.gitignore` เพื่อละเว้นโฟลเดอร์ `backups/` ไม่ให้ commit เข้า Git
  3. พัฒนาระบบ Update & Conflict Resolver ใน CLI: ตรวจสอบ hash ปัจจุบันเทียบกับ hash ใน manifest หากผู้ใช้แก้ไขไฟล์เดิม ให้ทำสำเนาลง `backups/<timestamp>-<filename>` ก่อนผสานหรือแจ้งเตือน
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-005` หรือ `/00-discover IDEA-005`)

---

## 📦 Archived / Shipped Ideas

- [x] **[IDEA-006]** อัปเดตเอกสารคู่มือและ Reference ให้ครอบคลุม DevFlow v2.0.20 (The 3-Pillars Model, Categorized History & Clean Living Spec) — *Claimed in `022-update-documentation-and-guides-for-v2-0-20` (2026-08-21)*


