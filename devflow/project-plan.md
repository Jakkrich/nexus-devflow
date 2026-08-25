# 🗺️ Project Plan (User-Owned Architectural Vision)

> **Document Type**: Project Plan (User-Owned)  
> **Purpose**: แหล่งความจริงหลัก (Single Source of Truth) สำหรับวิสัยทัศน์ผลิตภัณฑ์ สถาปัตยกรรมระบบ มาตรการความปลอดภัย กฎเกณฑ์การส่งมอบ และแผนงานพัฒนาต่อยอด ถูกนำไปประมวลผลเป็น `devflow/context/project-overview.md` ผ่านคำสั่ง `/overview`

---

## 1. Product Vision & Problem Statement

- **What this is**: **Nexus-DevFlow** คือระบบ **Agentic Workflow Layer & Pair Programming Operating System** ที่เชื่อมต่อระหว่างนักพัฒนา (Human Developer) และปัญญาประดิษฐ์ (AI Coding Agents เช่น Google Antigravity, Claude Code, OpenAI Codex, Cursor, GitHub Copilot) เพื่อยกระดับการพัฒนาซอฟต์แวร์สู่มาตรฐานระดับวิศวกรรมสากล
- **Target Audience**:
  - นักพัฒนาเดี่ยว (Solo Developers) ที่ต้องการความเร็วสูงแต่ยังคงมีระเบียบวินัยและหลักฐานการทดสอบที่ชัดเจน
  - ทีมพัฒนาและองค์กร (Engineering Teams & Tech Leads) ที่ต้องการมาตรฐานการส่งมอบโค้ดที่ตรวจสอบได้ (Traceable), ตรวจสอบย้อนหลังได้ (Auditable) และไม่มีปัญหาโค้ดตีกัน (Zero Merge Conflict)
- **Core Value Proposition**:
  - **The 3-Pillars Model**: จัดระเบียบบริบทเป็น 3 เสาหลักอย่างชัดเจน — *🔮 Future (Inbox `ideas.md`)* ➔ *⚡ Present (Living Context `devflow/context/`)* ➔ *📦 Past (Categorized History `devflow/history/`)*
  - **Single Living Spec Delivery Model**: งานทุกขนาดใช้วงจรเดียว `/feature` (หรือ `/fix`) ➔ `/implement` ➔ `/check` ➔ `/complete` โดยเพิ่มความลึกของสเปกและหลักฐานตามความซับซ้อนของงาน
  - **Hard Quality Gates**: ระบบปฏิเสธการปล่อยงานเมื่อไม่ผ่านเกณฑ์การทดสอบ หรือมีข้อบกพร่องความปลอดภัยค้างอยู่

---

## 2. Architecture & Tech Stack

- **Runtime & Language**: Node.js (>=18.17.0), TypeScript (Strict ESM-First `"type": "module"`)
- **Persistence & State**:
  - Markdown-First Architecture พร้อม Type-Safe Schema Validation (Zod)
  - Git-Backed History Archive (`devflow/history/features/`, `devflow/history/fixes/`, `devflow/history/rollbacks/`, `HISTORY.md`)
  - Local State Management & Backup Snapshots (`.nexus/`)
- **Key Modules & Subsystems**:
  - **Distribution CLI & Package**: `packages/create-nexus-devflow` (Scaffolding, Doctor, Status, Update, Gatekeeper)
  - **Interactive Web Dashboard**: Embedded Local Webview Dashboard (`/dashboard`) พร้อม Living Spec Visualizer และ Real-time Snapshot
  - **Gatekeeper Engine**: ระบบตรวจสอบคุณภาพโค้ดและ Finding Blockers (`nexus-devflow check-gate`)
  - **Model Context Protocol (MCP) Server**: JSON-RPC Hub สำหรับเชื่อมต่อ AI Agents แบบ Type-Safe
  - **Dynamic Context Slicer**: ระบบจัดสรรและตัดตอนบริบทแบบ Just-In-Time (JIT) เพื่อประหยัด Token
- **Integration Points & AI Adapters**:
  - Google Antigravity & OpenAI Codex (`.agents/skills/`)
  - Claude Code (`.claude/skills/`)
  - Model Context Protocol (`@modelcontextprotocol/sdk`)

---

## 3. Constraints, Defensive Guardrails & Non-Goals

- **5 เสาหลักมาตรการป้องกันความเสี่ยง (Hard Defensive Guardrails)**:
  1. *Hard Quality Gates & Git Hooks*: บล็อกการ Commit ทันทีหาก Spec ไม่ครบ หรือมี `P0/P1 Finding` ค้างอยู่ในสถานะ `open`
  2. *Model Context Protocol (MCP)*: บังคับใช้ Typed Function Calling เพื่อป้องกันความเสียหายจากการ Parse ข้อความ Markdown
  3. *Branch-Scoped Context Isolation*: แยกโฟลเดอร์ State ตาม Git Branch ใน `.nexus/branches/<name>/` ป้องกัน Merge Conflict เมื่อทำงานเป็นทีม
  4. *Dynamic Context Slicing*: ส่งเฉพาะบริบทที่จำเป็นต่อ Stage นั้นๆ เข้าสู่ AI ลด Token Bloat 60–70%
  5. *State Drift Reconciler*: ตรวจจับความไม่สอดคล้องระหว่าง Git Diffs กับ Spec Tasks และเสนอทางเลือก Auto-Sync ทันที
- **Non-Goals**:
  - ไม่ใช่ Proprietary IDE หรือ Closed Cloud SaaS — DevFlow เป็น Transparent Git-Native Layer ที่ฝังตัวในโปรเจกต์ใดก็ได้
  - ไม่ใช่ Auto-GPT ที่ปล่อยให้ AI เขียนโค้ดตามใจโดยไม่มี Human-in-the-Loop Review Gates
- **Delivery Rules**:
  - เคร่งครัดใน TDD Mandate: โค้ดที่เพิ่มหรือแก้ไขต้องมี Automated Unit Tests เสมอ
  - ห้ามข้ามขั้นตอน Verification: ต้องมีหลักฐานเชิงประจักษ์ (Empirical Proof) ใน `/check` ก่อนอนุมัติ `/complete`

---

## 4. Key Milestones & Evolution Roadmap

- **🚀 Milestone 1: Hard Quality Gates & Pre-commit Enforcement**
  - ติดตั้ง `check-gate` เข้าสู่ Git Pre-commit Hooks และ CI Pipeline
  - บล็อกการส่งมอบเมื่อมี Unchecked Tasks หรือ P0/P1 Blockers
- **⚡ Milestone 2: DevFlow MCP Server Hub & Type-Safe Schemas (`IDEA-004`)**
  - พัฒนา MCP Server ผ่าน JSON-RPC สำหรับ Antigravity, Claude, Codex, Cursor
  - ใช้ Zod Schema ควบคุมการอัปเดต Task, Findings, และ Stage State 100% Type-safe
- **🌿 Milestone 3: Branch-Scoped Context Isolation & Dynamic Router**
  - รองรับการเก็บ State แยกตาม Git Branch ป้องกัน Merge Conflict ในทีม
  - ระบบ Auto-Cleanup ลบ Branch State หลังจบ `/complete` และย้ายเข้าสู่ History
- **✂️ Milestone 4: JIT Context Slicing & Token Budgeting Engine**
  - ปรับระบบส่ง Context ให้ AI ตาม Stage แบบไดนามิก ประหยัด Token 70%
  - ควบคุมขนาด `project-overview.md` ไม่ให้เกินงบประมาณ Token
- **🔄 Milestone 5: Git Diff Reconciler & Self-Healing State**
  - ตรวจจับความคลาดเคลื่อนระหว่างการแก้โค้ดของมนุษย์กับ Living Spec
  - ระบบ Smart Reconciliation แจ้งเตือนและซิงค์สเปกอัตโนมัติ
- **🖥️ Milestone 6: IDE Native Extension & Visual Kanban Studio**
  - ส่วนขยายบน VS Code / Antigravity Webview สำหรับควบคุม DevFlow ครบวงจรใน IDE
- **🤖 Milestone 7: Multi-Agent Swarm Orchestration & Semantic Code RAG**
  - ระบบประสานงาน Subagents หลายตัว (Coder, QA, Auditor) ทำงานขนานกัน
  - Local Dependency Graph & Semantic Code Search เพื่อดึงบริบทที่แม่นยำสูงสุด
