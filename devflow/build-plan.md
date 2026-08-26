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
  - *Scope*: สร้างตัวตัดตอนบริบท (Context Slicer) สำหรับสคิล `/implement`, `/check`, `/discovery` เพื่อส่งเฉพาะข้อมูลที่จำเป็นและควบคุม Token Budget ลดการใช้ Token 60–70%

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

---

## ⚡ Phase 10: Nexus-DevFlow 2.5.0 (Unified Living Spec Model)

- [x] **10. Unify Deep-Track and Fast-Track into Single Living Spec Model** `[Size: L]`
  - *Dependencies*: ADR-001
  - *Scope*: รวมความสามารถเชิงสถาปัตยกรรมระดับลึกของ Deep-Track เข้าสู่ 4 ขั้นตอนหลักของ Fast-Track บนเอกสาร Single Living Spec (`current-feature.md`) จัดเก็บประวัติแบบ Single Archive (`.md`), ปลดระวาง stage skills 10-70 ที่ซ้ำซ้อน, และปรับปรุงเอกสาร & Schemas ทั้งหมด

---

## 🚀 Phase 11: Multi-Run Context Architecture & Spec Queue Engine

- [x] **11. Multi-Run Context Architecture & Spec Queue Engine (`IDEA-026`, `DISC-20260826-001`)** `[Size: M]`
  - *Dependencies*: Feature 10, Feature 3
  - *Scope*: แยกจัดเก็บ Task-Specific Context เป็นโฟลเดอร์ย่อยใน `devflow/context/{xxx-slug}/`, พัฒนา Context Resolver สำหรับสลับและเรียกใช้งาน `/implement <id>`, `/check <id>`, `/complete <id>` แบบระบุ Running ID หรือ Fuzzy Match, และอัปเกรด CLI/Dashboard/Skills ให้รองรับ Spec Queue หลายรันพร้อมกัน

---

## 🧹 Phase 12: Purge Legacy Deep-Track & Numbered Stage Artifacts

- [x] **12. Purge Legacy Deep-Track & Numbered Stage Artifacts (`DISC-20260826-002`)** `[Size: M]`
  - *Dependencies*: Feature 10, Feature 11
  - *Scope*: ล้างโค้ดตกค้างของ Deep-Track (สเตจ 00-70 เช่น `40-execute`, `50-verify`, `60-report`, `70-deliver`, `10-define`, `20-spec`, `30-plan`) ออกจาก package engine (`status.ts`, `current-work.ts`, `history.ts`), agent skills (`.agents/`, `.claude/`), automation scripts & tests ใน `scripts/`, และเอกสาร/mockup ให้เป็นปัจจุบันสมบูรณ์

---

## 🔄 Phase 13: Upstream AI Blueprint v0.14.0 Synchronization & Deterministic Config Engine

- [x] **13. Sync Upstream v0.14.0 (Deterministic Config & Continuous Mode)** `[Size: M]`
  - *Dependencies*: Feature 12, DISC-20260826-003
  - *Scope*: นำระบบ Deterministic Project Configuration (`devflow/config.json`) และสคิล Autonomous Multi-Feature Loop (`/continuous`) เข้าสู่ Nexus-DevFlow พร้อมอัปเกรด `project-config.ts`, `doctor`, `status`, `dashboard` และอัปเดต upstream baseline tracking สู่ v0.14.0

