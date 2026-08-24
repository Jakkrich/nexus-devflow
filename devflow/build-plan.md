# 📋 Build Plan (User-Owned Feature Queue)

> **Document Type**: Build Plan (User-Owned)  
> **Purpose**: รายการคิวฟีเจอร์การพัฒนาปรับปรุงระบบตามลำดับ พร้อมการประเมินขนาด (Sizing) และความสัมพันธ์ (Dependencies) สำหรับ `/brief` และ `/feature`

---

## 🚀 Phase 1: Hard Quality Gates & Pre-commit Enforcement

- [x] **1. Automated Quality Gatekeeper & Pre-commit Hook Integration** `[Size: S]`
  - *Dependencies*: None
  - *Scope*: ผสาน `nexus-devflow check-gate` เข้าสู่ Git Pre-commit Hooks และ CI เพื่อบล็อกการ Commit/Merge เมื่อมี Unchecked Tasks, Test ล้มเหลว หรือมี P0/P1 Finding ค้างอยู่

---

## ⚡ Phase 2: DevFlow Model Context Protocol (MCP) Server Hub

- [x] **2. DevFlow MCP Server Hub & Type-Safe Schema Engine (`IDEA-004`)** `[Size: M]`
  - *Dependencies*: Feature 1
  - *Scope*: สร้าง Subcommand `nexus-devflow mcp` เปิด JSON-RPC Server พร้อมเครื่องมือ Typed Tools (`update_task`, `record_finding`, `get_stage_context`) ด้วย Zod Schema Validation

---

## 🌿 Phase 3: Branch-Scoped Context Isolation

- [x] **3. Branch-Scoped Context Isolation & Dynamic Router** `[Size: M]`
  - *Dependencies*: Feature 2
  - *Scope*: แยกจัดเก็บ State ตาม Git Branch ใน `.nexus/branches/<branch-name>/`, ระบบ Canonical Dynamic Router สำหรับ AI Agent และระบบ Auto-Cleanup หลัง `/complete`

---

## ✂️ Phase 4: JIT Context Slicing & Token Optimizer

- [x] **4. Just-In-Time (JIT) Dynamic Context Slicing Engine** `[Size: M]`
  - *Dependencies*: Feature 3
  - *Scope*: สร้างตัวตัดตอนบริบท (Context Slicer) สำหรับสคิล `/implement`, `/check`, `/00-explore` เพื่อส่งเฉพาะข้อมูลที่จำเป็นและควบคุม Token Budget ลดการใช้ Token 60–70%

---

## 🔄 Phase 5: State Drift Detection & Self-Healing

- [x] **5. Git Diff Drift Reconciler & Self-Healing State Engine** `[Size: M]`
  - *Dependencies*: Feature 4
  - *Scope*: ตรวจจับความไม่สอดคล้องระหว่าง `git diff` กับรายการไฟล์ใน Living Spec พร้อมระบบแจ้งเตือนและ Auto-Reconcile ซิงค์สถานะอัตโนมัติ

---

## 🖥️ Phase 6: IDE Native Extension & Visual Studio

- [x] **6. IDE Native Extension & Interactive Webview Studio** `[Size: L]`
  - *Dependencies*: Feature 5
  - *Scope*: พัฒนา Extension สำหรับ VS Code / Antigravity Webview เพื่อแสดง Live Kanban Board, ปุ่มกดรันคำสั่ง DevFlow และ Diff Inspector ในตัว IDE


---

## 🤖 Phase 7: Multi-Agent Swarm Orchestration & Code Graph RAG

- [x] **7. Multi-Agent Swarm Orchestrator & Semantic Code Graph RAG** `[Size: L]`
  - *Dependencies*: Feature 6
  - *Scope*: พัฒนาระบบกระจายงานแบบคู่ขนานให้ Subagents (Coder, QA Verifier, Security Auditor) และระบบ Indexing Local Codebase Graph เพื่อดึงบริบทที่แม่นยำสูงสุด

---

## 🔄 Phase 8: Upstream Synchronization & Multi-Adapter Expansion

- [x] **8. Sync Upstream v0.13.0 (Adopt Visibility, OpenCode & Multi-Adapter Selection)** `[Size: M]`
  - *Dependencies*: None
  - *Scope*: ผสานความสามารถ Adopt Workflow Visibility (Commit vs Local-only), การรองรับ OpenCode และ Multi-Adapter Checkbox Prompt ใน CLI พร้อมอัปเดต Doctor checks และซิงก์ Baseline SHA เป็น v0.13.0 (`0b65166`)

---

## 🧪 Phase 9: Strict TDD Sub-Tasks & Two-Stage Review Guardrails

- [x] **9. Strict TDD Sub-Tasks & Two-Stage Review Guardrails** `[Size: M]`
  - *Dependencies*: None
  - *Scope*: นำ Strict TDD (Red-Green-Refactor) Sub-Tasks และ Two-Stage Review Pattern (Stage 1: Spec Fidelity, Stage 2: Quality & Security Gate) ผสานเข้าสู่ Prompt Rules, Coding Standards, AI Interaction และ Stage Skills (`30-plan`, `40-execute`, `50-verify`, `feature`, `implement`, `check`, `debug`) พร้อมอัปเดต Template และ Unit Tests



