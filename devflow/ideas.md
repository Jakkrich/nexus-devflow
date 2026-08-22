# 💡 DevFlow Idea Inbox & Backlog

บันทึกไอเดียที่รอดำเนินการ พร้อมบทวิเคราะห์ความเป็นไปได้เบื้องต้นจาก AI (บันทึกด้วยคำสั่ง `/idea "<text>"`)

---

## 📌 Pending Ideas

### [IDEA-003] Interactive Terminal UI (TUI) Dashboard (Ink / Clack)
- **บันทึกเมื่อ**: 2026-08-20
- **ไอเดียตั้งต้น**: สร้างแดชบอร์ดอินเตอร์แอคทีฟบน Terminal แบบ Rich UI สำหรับแสดงสถานะงาน Living Spec, รายการ Checklists, Findings และคำแนะนำ Next Action
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ใช้ไลบรารี CLI UI เช่น `@clack/prompts` หรือ `ink` (React for CLI) ในการเรนเดอร์ Interface แบบ Interactive
- **Value & Potential**: **สูง (Premium DX)** — สร้างความประทับใจระดับ Wow ให้กับผู้ใช้ สามารถใช้คีย์บอร์ดเลื่อนดู Task, ติ๊ก Checklist และกดคัดลอกคำสั่ง AI เข้า Clipboard ได้ทันที
- **Quick Seed (กันลืม)**:
  1. แถบ Navigation ด้านบน: `[Status] [Tasks] [Findings] [Next Action]`
  2. หน้า Tasks แสดง Checkbox ที่กดติ๊ก Spacebar ได้จริงเพื่ออัปเดตไฟล์ Markdown
  3. ปรับแต่ง Theme ให้เข้ากับ Dark Mode และแสดงผลผ่าน ANSI 256 Colors
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-003` หรือ `/00-explore IDEA-003`)

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
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-004` หรือ `/00-explore IDEA-004`)





---



### [IDEA-012] Sub-Feature Automatic Splitting Engine (4a, 4b, 4c)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบแบ่งฟีเจอร์ขนาดใหญ่ออกเป็นฟีเจอร์ย่อย (Sub-features) อัตโนมัติเมื่อขนาดงานเกินขีดจำกัด
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — เพิ่มตรรกะใน `/brief` และ `/feature` เพื่อตรวจเช็กขนาดงานและแตกเป็น `007a`, `007b` ให้อัตโนมัติ
- **Value & Potential**: **สูง** — ป้องกันไม่ให้ AI ทำงานในขอบเขตที่กว้างเกินไปในรันเดียว
- **Quick Seed (กันลืม)**:
  1. กำหนดเกณฑ์ประเมินขนาดงาน (เช่น เกิน 5 ไฟล์ หรือ 100+ บรรทัด)
  2. สับแบ่งเป็น sub-task เรียงตามลำดับความขึ้นตรงกัน (Dependencies)
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-012` หรือ `/00-explore IDEA-012`)

---

### [IDEA-013] Dynamic Project Overview Compiler (`/overview`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: พัฒนาคำสั่ง `/overview` ให้ทำหน้าที่รวบรวมและซิงก์ข้อมูลจากไอเดีย, เอกสารอ้างอิง, และบริบทโครงการ มาอัปเดตใส่ `devflow/context/project-overview.md` อัตโนมัติ
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — สร้างสคริปต์ซิงก์ข้อมูลภาพรวมโครงการ
- **Value & Potential**: **ปานกลาง** — ช่วยรักษาความสดใหม่ของ `project-overview.md` เมื่อมีการเปลี่ยนแปลงสถาปัตยกรรม
- **Quick Seed (กันลืม)**:
  1. สแกนไฟล์บริบทและบันทึกสรุปความเปลี่ยนแปลง
  2. รักษาสครงสร้าง Single Source of Truth
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-013` หรือ `/00-explore IDEA-013`)

---

### [IDEA-014] Standalone `/status` Skill for AI Chat Context
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: สร้าง Skill `/status` ในรูปแบบ Markdown สำหรับ AI Agent ในแชตโดยเฉพาะ เพื่ออ่านสรุปความก้าวหน้า ตรวจสอบ Drift และแนะนำ Next Action
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — พัฒนา `.agents/skills/status/SKILL.md` และ `.claude/skills/status/SKILL.md`
- **Value & Potential**: **ปานกลาง** — เพิ่มความสะดวกให้ผู้ใช้สั่งดูสถานะผ่านแชตโดยไม่ต้องสลับไปเทอร์มินัล
- **Quick Seed (กันลืม)**:
  1. อ่าน `current-feature.md` และ `current-stage.md`
  2. แสดงผลสรุปความก้าวหน้าสั้นๆ พร้อมคำแนะนำ
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-014` หรือ `/00-explore IDEA-014`)

---

### [IDEA-015] Configurable Artifact Language (`artifactLanguage: th | en`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: รองรับการสลับภาษาเริ่มต้นของเอกสารและบทสนทนาระหว่าง ภาษาไทย (`th`) และ ภาษาอังกฤษ (`en`) ผ่านคอนฟิก `nexus-devflow.json`
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — อ่านค่า `artifactLanguage` จาก `nexus-devflow.json` แล้วปรับ Directive ใน Skills
- **Value & Potential**: **สูง** — รองรับการใช้งานของทีมงานระดับสากลหรือทีมที่ต้องการเอกสารเป็นภาษาอังกฤษ
- **Quick Seed (กันลืม)**:
  1. เพิ่มฟิลด์ `artifactLanguage` ใน schema
  2. สลับเทมเพลตภาษาตามคอนฟิก
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-015` หรือ `/00-explore IDEA-015`)

---

### [IDEA-016] Strict HTML Report Generation Control Policy
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: นโยบายและคำสั่งควบคุมการสร้าง HTML Report เพื่อป้องกันไม่ให้สร้างไฟล์ `.html` ขยะใน Repo โดยให้สร้างเฉพาะเมื่อเรียก `/report:html`
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — เพิ่ม Directive ในการตรวจเช็กคำสั่งสร้างรายงาน
- **Value & Potential**: **ปานกลาง** — รักษาความสะอาดของ Git repository
- **Quick Seed (กันลืม)**:
  1. กำหนดกฎห้ามสร้าง HTML ในสเตจปกติ
  2. เรียกสร้างด้วยสคริปต์ standalone แยกต่างหาก
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-016` หรือ `/00-explore IDEA-016`)

---

### [IDEA-017] Automated AI Adapter Detection & Sync (`adapters: auto`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบตรวจจับ AI Client (Antigravity, Claude, Codex, Copilot) อัตโนมัติและคอยซิงก์โฟลเดอร์ `.agents/` หรือ `.claude/` ให้อัตโนมัติเมื่อสั่ง `update`
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ตรวจจับการมีอยู่ของไฟล์คอนฟิก AI ในโฟลเดอร์ผู้ใช้
- **Value & Potential**: **สูง** — ทำให้ผู้ใช้ไม่ต้องระบุ `--adapter` เองทุกครั้งที่อัปเดต
- **Quick Seed (กันลืม)**:
  1. สแกนไฟล์ `.agents/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`
  2. เลือก Adapter ให้อัตโนมัติเมื่อรัน CLI update
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-017` หรือ `/00-explore IDEA-017`)

---

### [IDEA-018] Multi-Stage Deep-Track Directory Structure (`devflow/context/current-run/`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: รองรับการแยกไฟล์บริบทรายสเตจสำหรับงานสถาปัตยกรรมใหญ่ เพื่อบันทึกประวัติการตัดสินใจแต่ละสเตจอย่างเป็นระบบ
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — เพิ่มระบบจัดการโฟลเดอร์ `current-run/`
- **Value & Potential**: **สูง** — เหมาะสำหรับงานที่มีความซับซ้อนสูงและต้องการบันทึก Traceability
- **Quick Seed (กันลืม)**:
  1. แยกโฟลเดอร์ `10-define.md`, `20-spec.md`...
  2. อัปเดตสเตจทีละขั้นตอนในรันใหญ่
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-018` หรือ `/00-explore IDEA-018`)

---

### [IDEA-019] Safe Scaffolding Overlay Guard System
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบป้องกันการเขียนทับเมื่อมีการใช้ Framework Scaffolder ร่วมกับ DevFlow
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — ปรับปรุง CLI `init` ให้สามารถติดตั้งทับโปรเจกต์ที่มีอยู่แล้วได้อย่างปลอดภัย
- **Value & Potential**: **สูง** — ลดความผิดพลาดเมื่อนำ DevFlow ไปใช้งานกับ Brownfield Project
- **Quick Seed (กันลืม)**:
  1. ตรวจสอบไฟล์ที่มีอยู่ก่อนลงทับ
  2. สร้างไฟล์สำรองอัตโนมัติหากมี conflict
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-019` หรือ `/00-explore IDEA-019`)

---

### [IDEA-020] Upstream AI-Blueprint Sync Engine (`upstream-ai-blueprint.json`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบติดตามและเปรียบเทียบ Commit ของ AI-Blueprint ต้นฉบับเพื่อนำฟีเจอร์ใหม่ๆ มาปรับใช้ใน DevFlow
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — พัฒนาสคริปต์เปรียบเทียบ Diff และอัปเดต `upstream-ai-blueprint.json`
- **Value & Potential**: **สูงมาก** — ช่วยให้ DevFlow ทันสมัยตามมาตรฐานสากลเสมอ
- **Quick Seed (กันลืม)**:
  1. อ่าน `lastReviewedCommit` จาก `upstream-ai-blueprint.json`
  2. เปรียบเทียบ Diff ของ Blueprint และแจ้งเตือนจุดที่สามารถพอร์ตเข้ามาได้
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-020` หรือ `/00-explore IDEA-020`)

---

### [IDEA-021] Single Active Run Lock & Concurrency Guardrail
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบล็อกไม่ให้เริ่มรันใหม่หากยังมีงานเก่าค้างอยู่ เพื่อป้องกันบริบทสับสน
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — ตรวจเช็กสถานะใน `current-feature.md` และ `current-stage.md`
- **Value & Potential**: **สูง** — ป้องกันความผิดพลาดของ AI ในการสลับงานไปมา
- **Quick Seed (กันลืม)**:
  1. เช็กสถานะก่อนสร้างรันใหม่
  2. แจ้งเตือนผู้ใช้ให้ทำ `/complete` รันเดิมก่อน
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-021` หรือ `/00-explore IDEA-021`)

---

### [IDEA-022] Universal Document Parser via Python Helper Integration
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: เพิ่มสคริปต์ Python ในการแปลงเอกสาร PDF, DOCX, XLSX เป็น Markdown ที่สมบูรณ์แบบ
- **AI Feasibility & Tech**: **ปานกลาง (Medium Feasibility)** — รวมไลบรารี `pdfplumber`, `docx`, `openpyxl`
- **Value & Potential**: **สูง** — ขยายความสามารถในการอ่านบริบทธุรกิจจากเอกสารต่างๆ
- **Quick Seed (กันลืม)**:
  1. พัฒนา `convert_any_to_md.py`
  2. รองรับตารางและข้อความแบบหลายคอลัมน์
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-022` หรือ `/00-explore IDEA-022`)

---

### [IDEA-023] Lightweight Zero-Dependency Pure Markdown Mode
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: สร้างคำสั่งหรือสคริปต์สำหรับ Export DevFlow ออกเป็น Pure Markdown สำหรับโปรเจกต์ที่ไม่มี Node.js
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — สร้างไฟล์เทมเพลตบริสุทธิ์แบบไม่ต้องใช้ CLI
- **Value & Potential**: **ปานกลาง** — รองรับสภาพแวดล้อมการทำงานแบบปิโตรเลียม/งานเครื่องมือพื้นฐานที่ไม่มี Node.js
- **Quick Seed (กันลืม)**:
  1. สกัดเฉพาะสคิลและเอกสาร Markdown
  2. รองรับการทำงานแบบก๊อปปี้โฟลเดอร์วางใช้งาน
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-023` หรือ `/00-explore IDEA-023`)

---

### [IDEA-024] Automated Categorized History Ledger (`devflow/history/HISTORY.md`)
- **บันทึกเมื่อ**: 2026-08-22
- **ไอเดียตั้งต้น**: ระบบบันทึกประวัติการส่งมอบงานทั้งหมดลงในตารางสรุป `HISTORY.md` แยกตามประเภทงาน (Feature, Fix, Rollback)
- **AI Feasibility & Tech**: **ง่าย (High Feasibility)** — อัปเดตคำสั่ง `/complete` ให้บันทึกบรรทัดใหม่ลงใน `HISTORY.md` อัตโนมัติ
- **Value & Potential**: **สูง** — ช่วยให้ติดตามประวัติการเปลี่ยนแปลงทั้งหมดของระบบได้อย่างรวดเร็ว
- **Quick Seed (กันลืม)**:
  1. บันทึก ID, วันที่, ชื่อฟีเจอร์, และ Git Commit Hash
  2. สรุปเป็นตารางย่อใน `devflow/history/HISTORY.md`
- **สถานะ**: `Pending` (หยิบไปทำได้ด้วย `/feature IDEA-024` หรือ `/00-explore IDEA-024`)

---

---

## 📦 Archived / Shipped Ideas

- [x] **[IDEA-011]** Feature Briefing Skill จากแผนงาน (`/brief`) — *Claimed in `037-feature-briefing-skill` (2026-08-22)*
- [x] **[IDEA-010]** Cloud Deployment Readiness & Config Generator Skill (`/release`) — *Claimed in `036-cloud-deployment-readiness-skill` (2026-08-22)*
- [x] **[IDEA-009]** Guided Discovery Interview Skill (`/discovery`) — *Claimed in `035-guided-discovery-interview-skill` (2026-08-22)*
- [x] **[IDEA-008]** Dedicated Code & Security Audit Skill (`/audit` with Durable Ledger) — *Claimed in `034-code-and-security-audit-skill` (2026-08-22)*
- [x] **[IDEA-007]** Support Two User-Owned Planning Documents (`project-plan.md` & `build-plan.md`) — *Claimed in `033-user-owned-planning-docs` (2026-08-22)*
- [x] **[IDEA-002]** CI/CD Quality Gatekeeper & Git Pre-commit Hooks (`devflow check-gate`) — *Claimed in `032-ci-quality-gatekeeper-and-hooks` (2026-08-22)*
- [x] **[IDEA-001]** ขยาย Subcommands สำหรับ CLI (`idea`, `findings`, `doctor --fix`, `archive`) — *Claimed in `031-expand-cli-subcommands` (2026-08-22)*
- [x] **[IDEA-005]** ระบบ Internal State (`.nexus/`) สำหรับจัดการ Version Manifest, File Hashes & Safe Update Backups (`nexus-devflow update`) — *Implemented in `packages/create-nexus-devflow/lib/update.ts` & `.nexus/nexus-devflow.json`*
- [x] **[IDEA-006]** อัปเดตเอกสารคู่มือและ Reference ให้ครอบคลุม DevFlow v2.0.20 (The 3-Pillars Model, Categorized History & Clean Living Spec) — *Claimed in `022-update-documentation-and-guides-for-v2-0-20` (2026-08-21)*
