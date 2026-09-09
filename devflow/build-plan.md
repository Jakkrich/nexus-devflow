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

---

## ⚡ Phase 14: Pure Multi-Run Task-Isolated Architecture

- [x] **14. Pure Multi-Run Task-Isolated Architecture (`DISC-20260826-004`)** `[Size: M]`
  - *Dependencies*: Feature 11, Feature 12, Feature 13
  - *Scope*: ยกเลิกไฟล์ Single Living Spec ที่ Root (`current-feature.md`, `current-stage.md`, `findings.md`) อย่างสมบูรณ์ ปรับโครงสร้างสู่ Task-Isolated Subdirectories 100% (`devflow/context/{xxx-slug}/`), อัปเกรด Agent Directives, Core Context Resolver, Scaffolding Templates และ Workflow Skills ทั้งหมด

---

## 🔄 Phase 15: Upstream AI Blueprint v1.0.0 / v1.0.1 Synchronization

- [x] **15. Sync Upstream v1.0.0 (Activity Contract, Rollback & Complete Safeguards, Local Linking)** `[Size: M]`
  - *Dependencies*: Feature 14, DISC-20260828-001-sync-upstream-ai-blueprint-v100
  - *Scope*: ผสาน Activity State Contract (`devflow/.state/run.json`) และ Live Dashboard Activity, เสริม Rollback 40-char SHA & Merge Commit Protection, Complete Fixed Finding Persistence, คำสั่ง `npm run link:local` / `unlink:local` พร้อม `findPackageRoot()`, Onboarding Markers และ Windows Smoke/Path Fixes

---

## 🖥️ Phase 16: Multi-Task Dashboard & Live Kanban Studio UI

- [x] **16. Multi-Task Dashboard & Live Kanban Studio UI (`DISC-20260828-002`)** `[Size: M]`
  - *Dependencies*: Feature 14, Feature 15
  - *Scope*: ปรับปรุง Full Web Dashboard (`dashboard-page.ts`) และ Live Kanban Studio (`webview-studio.ts`) ให้อ่านและวนลูปแสดงผลรายการ Task ทั้งหมดใน `status.activeRuns` จาก `devflow/context/{xxx-slug}/` พร้อม Task Progress Bar, Branch Pill, Findings Indicator และปุ่ม Quick Actions แบบเจาะจง Target Run ID

---

## 🔌 Phase 17: Unified Third-Party Skills Installer & Updater

- [x] **17. Unified Third-Party Skills Installation & Update Command (`DISC-20260831-001`, `055-unified-third-party-skills-installer`)** `[Size: S]`
  - *Dependencies*: None
  - *Scope*: เพิ่มฟังก์ชัน `installRecommendedSkills` และ `updateRecommendedSkills` ใน `skill-manager.ts`, รองรับสวิตช์ `--recommended` ในคำสั่ง `nexus-devflow skill add` และ `nexus-devflow skill update`, พร้อมอัปเดตเอกสาร `README.md`, `README.th.md` และ Automated Tests

---

## 🔄 Phase 18: Upstream AI Blueprint v1.1.0 & v1.2.0 Synchronization

- [x] **18. Sync Upstream v1.1.0 & v1.2.0 (Browser Tests & Independent Review System) (`DISC-20260901-001`)** `[Size: M]`
  - *Dependencies*: None
  - *Scope*: ผสานสคิล `/browser-tests` สำหรับ Playwright/E2E testing, ระบบตรวจทานอิสระ Independent Audit Review (`audit independent current` พร้อม `review.ts` และ `review.md`), อัปเกรด Config Quality Gates (`independentReview`), อัปเดต CLI Engine/Dashboard และปรับปรุงคู่มือ Scaffolding

---

## 🛡️ Phase 19: BugHunter Master Skill & Upstream Knowledge Sync Engine

- [x] **19. BugHunter Master Skill & Upstream Knowledge Sync Engine (`DISC-20260901-002`, `065-bughunter-master-skill-and-sync-engine`)** `[Size: M]`
  - *Dependencies*: Feature 17, Feature 18
  - *Scope*: พัฒนา Master Orchestrator Skill `bughunter` พร้อมระบบ Sync ดึงคลังความรู้ 83 skills และ report patterns จาก `elementalsouls/Claude-BugHunter` เก็บใน `devflow/.vendor/bughunter/`, รองรับคำสั่ง `nexus-devflow skill add/update bughunter`, อัปเดต Manifest และผสานเข้ากับ Multi-Adapter (`.agents/`, `.claude/`)

---

## 🔄 Phase 20: Upstream AI Blueprint v1.3.0 – v1.4.1 Synchronization

- [x] **20. Sync Upstream v1.3.0 – v1.4.1 (Planning Baseline Commit & Context Overhead Reduction) (`DISC-20260902-002`, `067-sync-upstream-ai-blueprint-v130-v141`)** `[Size: M]`
  - *Dependencies*: Feature 18, DISC-20260902-002
  - *Scope*: ผสานสคิล Planning Baseline Commit ใน `/overview` (`chore: establish DevFlow project baseline`), กฎ Overview Compactness Budget (20KB) พร้อม Hard-stop ใน `/feature` และคำเตือนใน `/doctor`, ปรับ Workflow Defaults เป็น `stepReview: "feature"` และ `checkpointCommits: "disabled"` พร้อม Onboarding Presets (Efficient/Guided/Custom), ย่อ Skill Descriptions 31 สคิลให้ <= 400 chars, ปรับ Claude Code Startup Context ใน `CLAUDE.md`, และอัปเดต Framework Validation/Tests ผ่าน 100%

---

## 🛠️ Phase 21: Upstream Tooling Parity & Comprehensive Evals Suite

- [x] **21. Upstream Tooling Parity & Comprehensive Evals Suite (E2E Agent Harness, Complete Routing Fixtures, Sandbox Automation & Upstream Drift Monitor) (`DISC-20260902-001`, `068-sync-upstream-ai-blueprint-tooling-and-evals`)** `[Size: M]`
  - *Dependencies*: Feature 20, DISC-20260902-001
  - *Scope*: ขยายชุดทดสอบ Evals Routing ให้ครอบคลุมทุกสคิล (`browser-tests.json`, `continuous.json`, `bughunter.json`, `publish-devflow.json`), นำเข้าและปรับใช้ Live-Agent E2E Test Harness (`scripts/e2e/`), สคริปต์จำลองติดตั้ง Sandbox Scaffolding (`scripts/scaffold-sandbox.ts`), สคริปต์ตรวจจับ Upstream Drift (`scripts/check-upstream-drift.ts`), และเอกสารวิเคราะห์ Token Efficiency (`benchmarks/context-efficiency.md`)

---

## 🎨 Phase 22: Visual Dashboard & Diagram Integration

- [x] **22. Standalone HTML Report Diagram Integration (`DISC-20260902-003`, `069-report-html-diagram-integration`)** `[Size: S]`
  - *Dependencies*: Feature 17 (`055`), DISC-20260902-003
  - *Scope*: ปรับปรุง `md2html-report.mjs` รองรับการเรนเดอร์ native Mermaid block (`.mermaid`), เพิ่มการสแกนและ embed ไฟล์ไดอะแกรมจาก `devflow/context/{xxx-slug}/diagrams/` (`.svg` และ `.html`), อัปเดต `report-html` skill ให้ตรวจจับและ auto-install `archify` / `diagram-design` ผ่าน `nexus-devflow skill add` และเขียนชุดทดสอบครอบคลุม

---

## 🧹 Phase 23: Reference Artifacts Housekeeping

- [x] **23. Prune Studio Reference Artifacts (`069-prune-studio-reference-artifacts`)** `[Size: S]`
  - *Dependencies*: None
  - *Scope*: ลบไฟล์ Static HTML Snapshot ตกค้าง `devflow/reference/studio.html` และสคริปต์ `scripts/export-studio.ts` โดยยังคงรักษา Webview Studio Engine (`webview-studio.ts`), MCP tool (`devflow_get_studio_html`), CLI Command (`nexus-devflow studio`) และชุดทดสอบทั้งหมดให้ทำงานได้สมบูรณ์ 100%

---

## 📐 Phase 24: Role-Based Profiles & SA Command Suite Engine

- [x] **24. Role-Based Profiles & SA Analyze Command Engine (`DISC-20260903-001`, `070-role-based-profile-and-sa-analyze-engine`)** `[Size: M]`
  - *Dependencies*: None
  - *Scope*: เพิ่มตัวเลือก `--role [sa|dev|full]` ใน CLI Installer (`create-nexus-devflow`), ระบบจำแนกชุด Skill Profiles ใน `skill-manager.ts`, โฟลเดอร์ Template สำหรับ SA (`devflow/inbox/`, `devflow/analysis/`, `devflow/blueprints/`), พัฒนาสคิล `/analyze` สำหรับสกัดเอกสารหลายรูปแบบ (PDF, Word, Excel, รูปภาพ, ข้อความ) และวิเคราะห์ Codebase Impact พร้อมชุดทดสอบ Automated Tests

---

## 🔄 Phase 25: Upstream AI Blueprint v1.5.0 – v1.5.1 Synchronization

- [x] **25. Sync Upstream v1.5.0 & v1.5.1 (Hardened Run-State Engine & On-Demand Context Loading) (`DISC-20260903-001`, `070-sync-upstream-ai-blueprint-v150-v151`)** `[Size: M]`
  - *Dependencies*: Feature 20, Feature 21, DISC-20260903-001
  - *Scope*: พอร์ตและปรับแต่ง Hardened Dashboard Activity State Helper (`.agents/skills/doctor/scripts/run-state.mjs` และ `.claude/`), บังคับใช้ Zero-Manual Writes กับ `devflow/.state/run.json`, ปรับใช้ On-Demand Context Loading Protocol พร้อมแยก Reference Templates ย่อย (`reference/`), เพิ่ม Unit Tests `run-state-helper.test.ts`, อัปเดต `scripts/validate-framework.ts`, `AGENTS.md`, `CLAUDE.md` และยืนยันการผ่าน 100%

---

## 🔄 Phase 26: Upstream AI Blueprint v1.5.2 Synchronization

- [x] **26. Sync Upstream v1.5.2 (Unborn Repository Onboarding & Branch Baseline Finalization) (`REQ-20260903-001`, `071-sync-upstream-ai-blueprint-v152`)** `[Size: S]`
  - *Dependencies*: Feature 25, REQ-20260903-001
  - *Scope*: เพิ่มการตรวจจับและกู้คืน Unborn Git repository ใน `/onboard` ด้วย Scaffold Initial Commit (`chore: scaffold application`), รองรับการ Finalize DevFlow Baseline บน Dedicated Setup Branch ด้วย `git merge --ff-only` ใน `/overview`, เพิ่มชุดทดสอบ E2E Scenario `scripts/e2e/scenarios/unborn-onboarding.ts`, อัปเดต `devflow/context/ai-interaction.md` และอัปเดต Framework Static Contracts ผ่าน 100%

---

## 🔄 Phase 27: Upstream AI Blueprint v1.5.3 Synchronization

- [x] **27. Sync Upstream v1.5.3 (Manifest-Aware Adapter Selection in Onboard & E2E Scenario Parity) (`REQ-20260904-001`, `072-sync-upstream-ai-blueprint-v153`)** `[Size: S]`
  - *Dependencies*: Feature 26, REQ-20260904-001
  - *Scope*: ปรับปรุง `/onboard` (ทั้ง `.agents/` และ `.claude/`) ให้อ่านและยึดถือรายการ `adapters` จาก Manifest (`.nexus/nexus-devflow.json` / `devflow/.state/manifest.json`) เป็นความจริงหลัก (Authoritative Selection) โดยไม่ถามซ้ำและไม่อนุมานผิดพลาด, เพิ่มชุดทดสอบ E2E Scenario ตัวที่ 10 `scripts/e2e/scenarios/adapter-selection.ts`, อัปเดต `agent-bundle.manifest.json` และ `scripts/validate-framework.ts` ให้ครอบคลุม Verification Contracts ใหม่ 100%

---

## 🔄 Phase 28: Upstream AI Blueprint v1.5.4 – v1.6.0 Synchronization

- [x] **28. Sync Upstream v1.5.4 & v1.6.0 (Automatic Independent Review, Post-Implementation Walkthroughs & Hardened Dashboard Engine) (`DISC-20260907-001`, `073-sync-upstream-ai-blueprint-v154-v160`)** `[Size: M]`
  - *Dependencies*: Feature 27, DISC-20260907-001
  - *Scope*: นำเข้าระบบตรวจทานอิสระแบบอัตโนมัติ (`review.independentExecution: "automatic"` พร้อม Isolated Subagent Spawning, Receipts Metadata Schema), ปรับค่าเริ่มต้น Quality Gates เป็น `when-sensitive`, เพิ่ม Post-Implementation Code Walkthrough ใน `implement` / `autopilot`, ปรับปรุงความทนทานของสถานะโครงการและ Dashboard (Sortable Findings, Roadmap Focus, Strict Heading Contracts), อัปเดต Framework Validation และ Unit Tests ผ่าน 100%

---

## 🖥️ Phase 30: Modernize Web Dashboard with Dynamic Archify Visualizer & Recommended Skills

- [x] **30. Modernize Web Dashboard with Dynamic Archify Visualizer & Recommended Skills (`DISC-20260907-003`, `080-dashboard-workflow-visualizer`)** `[Size: M]`
  - *Dependencies*: Feature 28, DISC-20260907-003
  - *Scope*: เพิ่ม Dynamic Archify SVG Workflow Visualizer (Macro Lifecycle Pulse Map พร้อม CSS Trace Motion และ Micro Tracer-Bullet Tickets DAG), เพิ่มการ์ด Recommended Skills & Vendors (`matt-pocock`, `bughunter`, `archify`, `diagram-design`, `9arm-skills`) พร้อมตรวจจับสถานะติดตั้งจริงและแสดงป้ายติ๊กถูก ✔, ปรับลดความรกบนแดชบอร์ด (ลบ Swarm Tab, ยุบ Doctor สรุปคลีน), เพิ่มข้อมูลใน `DashboardSnapshot` และชุดทดสอบความถูกต้องผ่าน 100%
---

## 🧹 Phase 31: Vendor Purge, Unified Debug & Headless Ticket Ingestion

- [x] **31. Purge Matt Pocock Vendor, Unify Debug Skill & Headless Ticket Ingestion (`081-purge-vendor-and-unify-debug`)** `[Size: S]`
  - *Dependencies*: None
  - *Scope*: ตัดโฟลเดอร์ vendor `devflow/.vendor/matt-pocock/`, ลบ skill wrapper ของ `matt-pocock` และ `debug-mantra`, รวมสาระสำคัญของ mantra 4 ข้อเข้าสู่ `/debug` (ทั้ง `.agents` และ `.claude`), ลบโฟลเดอร์ตกค้าง `.scratch/` และ `docs/agents/`, อัปเดต `AGENTS.md` และเอกสารเพื่อรองรับการนำเข้า external spec และ tickets จาก `devflow/context/{slug}/issues/` หรือ `tickets/` ได้ทันที

---

## 🧹 Phase 32: Consolidate 9arm Skills into DevFlow Core & Purge Extension

- [x] **32. Consolidate 9arm Skills into DevFlow Core & Purge Extension (`DISC-20260908-001`, `082-consolidate-9arm-skills-and-purge`)** `[Size: S]`
  - *Dependencies*: None
  - *Scope*: รวมสาระสำคัญของ `scrutinize` (Outsider Stance, Call-path tracing, Challenge intent) เข้าสู่ `/audit`, ผสาน `post-mortem` เข้าสู่ `/debug` (Phase 4 Handoff) และ `/complete` (Fix Archive Template), เพิ่ม Executive / Stakeholder Summary ใน `/status` และ `/complete`, ลบโฟลเดอร์ extension `post-mortem`, `scrutinize`, `management-talk` ทั้งใน `.agents/` และ `.claude/`, ลบ entries 9arm-skills ออกจาก `.nexus/nexus-devflow.json`, อัปเดตเอกสารและยืนยัน static contracts ผ่าน 100%

---

## 🪓 Phase 33: Ponytail Hybrid Compound-Vendor Integration

- [x] **33. Ponytail Hybrid Compound-Vendor Integration (`DISC-20260909-001`)** `[Size: S]`
  - *Dependencies*: Feature 17 (`055`), Feature 19 (`065`), DISC-20260909-001
  - *Scope*: นำเข้า `DietrichGebert/ponytail` ในรูปแบบ Hybrid Compound-Vendor (`type: "compound-knowledge"`) โดยโคลน upstream ลง `devflow/.vendor/ponytail/`, สร้าง Master Wrapper Skill (`.agents/skills/ponytail/` และ `.claude/`) พร้อม 5W1H Playbook และ Auto-Bypass สำหรับงาน Frontend/UI, อัปเดต `skill-registry-engine.ts`, บันทึก `thirdPartySkills` ใน `.nexus/nexus-devflow.json` และเขียน Automated Tests ครอบคลุม

---

## 📦 Phase 34: Unscoped CLI Packages & Shorthand Shims (`npx nexus-devflow` & `npm create nexus-devflow`)

- [x] **34. Unscoped CLI Packages & Shorthand Shims (`nexus-devflow` & `create-nexus-devflow`) (`084-unscoped-nexus-devflow-cli-package`)** `[Size: S]`
  - *Dependencies*: Feature 1 (`check-gate`), Feature 17 (`055`)
  - *Scope*: สร้างและกำหนดค่า Wrapper Shims สำหรับ Unscoped NPM Packages: `nexus-devflow` (เพื่อรองรับ `npx nexus-devflow`) และ `create-nexus-devflow` (เพื่อรองรับ `npm create nexus-devflow`), อัปเดต Pipeline การ Publish ใน `.github/workflows/publish.yml` และ `publish-devflow` ให้ซิงก์เวอร์ชันและเผยแพร่คู่ขนานกับ `@jakkrichm/create-nexus-devflow`, อัปเดตเอกสาร `AGENTS.md`, `CLAUDE.md` และ README ให้แนะนำคำสั่งสั้นเป็นหลัก



---

## Phase 35: Superpowers Debugging & TDD Heuristics Integration

- [x] **35. Superpowers Debugging Heuristics & TDD Reference Guides (`DISC-20260909-003`, `085-superpowers-debugging-heuristics-integration`)** `[Size: S]`
  - *Dependencies*: Feature 31 (`081`), Feature 32 (`082`)
  - *Scope*: เพิ่ม JIT reference guides สำหรับ root-cause tracing, defense-in-depth, condition-based waiting, TDD anti-patterns และ two-stage review พร้อม 3-Strike Rule และ Iron Law; ซิงก์ `.agents/` กับ `.claude/` และตรวจ file contracts
