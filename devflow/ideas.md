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

## 📦 Archived / Shipped Ideas

- [x] **[IDEA-024]** Automated Categorized History Ledger (`devflow/history/HISTORY.md`) — *Claimed in `021-categorized-history-and-clean-living-spec-architecture` (2026-08-21)*
- [x] **[IDEA-022]** Universal Document Parser via Python Helper (`convert-any-to-md`) — *Claimed in `027-convert-any-to-md` (2026-08-21)*
- [x] **[IDEA-021]** Single Active Run Lock & Concurrency Guardrail — *Claimed in `021-categorized-history-and-clean-living-spec-architecture` (2026-08-21)*
- [x] **[IDEA-020]** Upstream AI-Blueprint Sync Engine (`upstream-ai-blueprint.json` & scripts) — *Claimed in `014-typescript-migration-and-upstream-monitor-for-devflow` (2026-08-20)*
- [x] **[IDEA-019]** Safe Scaffolding Overlay Guard System (`.nexus/backups/`) — *Claimed in `029-update-backup-system` (2026-08-22)*
- [x] **[IDEA-018]** Multi-Stage Deep-Track Directory Structure (`devflow/context/current-run/`) — *Claimed in `021-categorized-history-and-clean-living-spec-architecture` (2026-08-21)*
- [x] **[IDEA-017]** Automated AI Adapter Detection & Sync (`adapters: auto`) — *Implemented in `packages/create-nexus-devflow/lib/project-metadata.ts` & `update.ts`*
- [x] **[IDEA-016]** Strict HTML Report Generation Control Policy (`/report:html`) — *Claimed in `015-fast-track-and-living-blueprint` (2026-08-20)*
- [x] **[IDEA-014]** Standalone `/status` Skill for AI Chat Context — *Claimed in `019-sync-upstream-status-cli-and-project-detection` (2026-08-20)*
- [x] **[IDEA-013]** Dynamic Project Overview Compiler (`/overview`) — *Claimed in `039-dynamic-overview-compiler` (2026-08-22)*
- [x] **[IDEA-012]** Sub-Feature Automatic Splitting Engine (4a, 4b, 4c) — *Claimed in `038-sub-feature-splitting-engine` (2026-08-22)*
- [x] **[IDEA-011]** Feature Briefing Skill จากแผนงาน (`/brief`) — *Claimed in `037-feature-briefing-skill` (2026-08-22)*
- [x] **[IDEA-010]** Cloud Deployment Readiness & Config Generator Skill (`/release`) — *Claimed in `036-cloud-deployment-readiness-skill` (2026-08-22)*
- [x] **[IDEA-009]** Guided Discovery Interview Skill (`/discovery`) — *Claimed in `035-guided-discovery-interview-skill` (2026-08-22)*
- [x] **[IDEA-008]** Dedicated Code & Security Audit Skill (`/audit` with Durable Ledger) — *Claimed in `034-code-and-security-audit-skill` (2026-08-22)*
- [x] **[IDEA-007]** Support Two User-Owned Planning Documents (`project-plan.md` & `build-plan.md`) — *Claimed in `033-user-owned-planning-docs` (2026-08-22)*
- [x] **[IDEA-002]** CI/CD Quality Gatekeeper & Git Pre-commit Hooks (`devflow check-gate`) — *Claimed in `032-ci-quality-gatekeeper-and-hooks` (2026-08-22)*
- [x] **[IDEA-001]** ขยาย Subcommands สำหรับ CLI (`idea`, `findings`, `doctor --fix`, `archive`) — *Claimed in `031-expand-cli-subcommands` (2026-08-22)*
- [x] **[IDEA-005]** ระบบ Internal State (`.nexus/`) สำหรับจัดการ Version Manifest, File Hashes & Safe Update Backups (`nexus-devflow update`) — *Implemented in `packages/create-nexus-devflow/lib/update.ts` & `.nexus/nexus-devflow.json`*
- [x] **[IDEA-006]** อัปเดตเอกสารคู่มือและ Reference ให้ครอบคลุม DevFlow v2.0.20 (The 3-Pillars Model, Categorized History & Clean Living Spec) — *Claimed in `022-update-documentation-and-guides-for-v2-0-20` (2026-08-21)*
