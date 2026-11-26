# Build Plan

> **Document Type**: Build Plan (User-Owned)
> **Purpose**: รายการฟีเจอร์ตามลำดับการพัฒนาจริง (Ordered Feature Roadmap Checklist)
> **Workflow**: ทำงานจากบนลงล่างด้วย `/feature` -> `/implement` -> `/check` -> `/complete`; ห้ามข้ามงานที่เป็น dependency
> **Planning Baseline**: 2026-11-17 — แทนที่รายการ UI template เดิมด้วยคิวงานที่ตรงกับผลิตภัณฑ์ Nexus-DevFlow

---

## Phase 1: Foundation & Workflow Consolidation

- [x] 1. **Upstream AI Blueprint Synchronization & Zero-Regression Fusion** - ผสาน `explore`, proportional engineering, adapter switching และ CI pre-push hook โดยรักษาสถาปัตยกรรม DevFlow (Ref: DISC-20260929-001)
- [x] 111. **Code-Modernization Recommended Third-Party Skill & Master Orchestrator** - เพิ่ม code-modernization แบบ opt-in พร้อม sparse ingestion engine (Ref: DISC-20261027-001)
- [x] 112. **(Deprecated & Removed) In-IDE Interactive Choice & Predictive Follow-Up Gate** - ถอด modal บังคับเพื่อคืน workflow สนทนาปกติ (Ref: DISC-20261030-001, Task 113)
- [x] 114. **Upstream AI Blueprint Selective Sync (v1.11.0–v1.16.1)** - ผสาน upstream แบบเลือกเฉพาะส่วนและ harden Git/package workflow (Ref: DISC-20261117-001)
  - [x] 114a. **(Skateboard) Command Rename & Git/Pack Hardening** - ปรับชื่อ skill, ย้าย state helper, กัน `git status` buffer overflow และแพ็กเฉพาะ tracked template files
  - [x] 114b. **(Skateboard) Context Trimming & Link Validation** - แยก references ตามใช้จริงและเพิ่ม cross-skill link validator
  - [x] 114c. **(Tracer Bullet) Spec Check Gate & Evidence Menu** - เพิ่ม `--check`, `when-testable` proof และ step review menu
  - [x] 114d. **(Tracer Bullet) Parallel Worktree Recovery** - รองรับ task-isolated worktree และ recovery เมื่อ base branch เดินหน้า
- [x] 115. **Skill Audit, Consolidation & Anti-Bloat Architecture (Option B+)** - ลด Core Skills จาก 33 เหลือ 15 Core Skills, ถอดตัวซ้ำซ้อน และลด ceremony (Ref: DISC-20261117-002)
  - [x] 115a. **(Skateboard) Hygiene, Anti-Bloat & Contract Cleanup** - ลด help ceremony, ทำ activity tracking เป็น best-effort และล้าง hardcoded paths
  - [x] 115b. **(Skateboard) Retire Obsolete, Stub & Maintainer Skills** - ย้ายความสามารถเฉพาะทางออกเป็น opt-in และถอด skills ที่ซ้ำซ้อน
  - [x] 115c. **(Journey) Consolidate Core Skills & Adaptive Feature/Debug** - รวม command families และเพิ่ม adaptive clarification / 2-track debugging
  - [x] 115d. **(Tracer Bullet) Validators, Roles, Docs & Review Closure** - ให้ independent review ยืนยันและปิด P2 findings ที่แก้แล้ว (`T-001`, `Q-001`, `Q-002`), ตรวจ adapter/docs sync แล้วจึง archive และ merge

---

## Phase 2: Ecosystem Reliability (Active Focus)

- [ ] 116. **(Skateboard) Consolidation Release Baseline & Migration Contract** - ตัดสิน v2/v3 boundary, ทำ changelog และ migration guide สำหรับ retired commands, ตรวจ fresh install/update/uninstall และสร้าง release candidate ที่ย้อนกลับได้
- [ ] 117. **(Tracer Bullet) Cross-Platform Installer & Update Confidence Matrix** - เพิ่ม CI/smoke matrix สำหรับ Windows, macOS, Linux และ Node.js รุ่นที่รองรับ ครอบคลุม fresh install, existing-project overlay, update, adapter switch และ path edge cases
- [ ] 118. **(Journey) Bilingual Intent Routing Reliability** - ขยาย routing evals ภาษาไทย/อังกฤษด้วย positive, negative, legacy และ ambiguous prompts; รายงาน pass rate, false activation และ regression ownership แบบตรวจซ้ำได้
- [ ] 119. **(Skateboard) Planning & Overview Integrity Gate** - ตรวจ placeholder/stale/mismatched plans ก่อนสร้าง overview, ให้ข้อความแก้ไขที่ทำตามได้ และเพิ่ม regression tests สำหรับ source hash กับ generated-state boundaries
- [ ] 120. **(Tracer Bullet) Package Contract & Upgrade Resilience** - ทดสอบว่าการ update รักษา user-owned plans, custom config, protected skills และ task history พร้อมรายงาน drift ที่แก้ได้โดยไม่เขียนทับข้อมูลผู้ใช้
- [x] 130. **(Tracer Bullet) Multi-Chat Safe Isolation & Aggregated Status** - แยก per-run activity state (`devflow/.state/runs/{run-id}.json`), เพิ่ม `evaluateWorktreeGuard` และ cross-worktree `reserveNextRunningId`, รวมสถานะ + handoff summary ข้าม worktree ใน `status`, และสร้าง formal concurrency proof (`verify:concurrent-isolation`)

---

## Phase 3: Integration & Operator Experience

- [x] 121. **(Deprecated & Removed) Evidence-First Workflow Dashboard** - ถอดแผนยกระดับ Web Dashboard ตามแนวทาง Lite-first (ถูกแทนที่ด้วย Feature 128)
- [ ] 122. **(Tracer Bullet) IDE Sidecar Pilot** - เชื่อม editor หนึ่งตัวกับ status CLI/MCP API (JSON) เพื่อเปิด task, อ่าน spec และติดตาม stage โดยไม่ให้ sidecar แก้ source of truth โดยตรง
- [ ] 123. **(Journey) Multi-IDE Continuation & Handoff** - พิสูจน์การรับช่วงงานระหว่าง adapters ด้วย task เดียวกัน พร้อม compatibility tests และคู่มือ recovery เมื่อ context หรือ tool เปลี่ยน
- [x] 126. **(Tracer Bullet) Opt-in `browseros-neo` Team Skill (E2E Testing & Evidence)** - เพิ่ม custom `extras/skills/browseros-neo/` ต่อยอดจาก `browserclaw` สำหรับทดสอบและแก้ปัญหาแบบ E2E ผ่าน BrowserOS neo MCP, สร้าง test plan + evidence รายเคสใน `devflow/reports/{run-id}/` (ไม่ขึ้น Git) และผูก `name_session` ย้อนดูวิดีโอใน BrowserOS neo ตาม DevFlow ID (Ref: DISC-20261117-003)
- [x] 127. **(Tracer Bullet) Interactive Extras Skills Checkbox Setup** - ถอด Superpower Community Skills ออกจาก Step `[3/3]` ของ `install`/`update` และแทนที่ด้วย zero-dep checkbox เลือกติดตั้ง/อัปเดต `extras/skills/` จาก local bundle (Ref: DISC-20261118-001)
- [x] 128. **(Skateboard) Remove Web Dashboard, Studio UI & MCP Studio Tool (Option 2)** - ถอด `dashboard`/`ui`/`studio` CLI, HTTP server, `studio-view-renderer.ts` (~102 KB), `dashboard-*.ts`, `webview-studio.ts`, orphan modules (`command-catalog.ts`, `version-check.ts`, `workflow-state.ts`) และ MCP tool `devflow_get_studio_html` เพื่อลดขนาดแพ็กเกจ ~26% โดยคง Core Workflow, `status`, `run-state` และ `report:html` ไว้ครบ
- [ ] 131. **DevFlow v3 Autonomous Subagent & `pstack` Rework** - ปรับ workflow เป็น Coordinator + Isolated Subagents, ตัด human gates ระหว่างทางเหลือ Final Evidence Packet Gate (Option A), และ reuse `pstack` แบบไม่แก้ไขต้นทาง (Ref: DISC-20261126-001, ADR-001)
  - [x] 131a. **(Skateboard) v3 Config Policy, Contract & Autonomous Core Loop** - เพิ่ม `execution` (`engine`, `tier`, `autoCommitFeatureBranch`) และ `delivery.gate` ใน `project-config.ts`, อัปเดต `agent-bundle.manifest.json` / `validate-framework.ts`, และปลดล็อก human pauses ระหว่างทางบน feature branch
  - [x] 131b. **(Tracer Bullet) `devflow-mode`, `devflow-help`, Playbooks & `pstack` Adapter** - สร้าง `devflow-mode` (แทน `autopilot`), `devflow-help` (รวม/แทน guide, status และ doctor ของ `devflow`), Core `playbooks/` (`feature`, `bug-fix`, `refactor`, `discovery`, `autonomous-queue`), ตัวตรวจ `extends:` anchor, และ sync `.agents/` ↔ `.claude/`
  - [ ] 131c. **(Tracer Bullet) Evidence-First Verification & `verify` Bootstrap** - ให้ `/onboard` สร้าง/ตรวจ `.agents/skills/verify/`, ยกระดับ `/check` และ `/audit` เป็น Verifier Swarm + Prove-by-Run (`interrogate` / `verify-layers`) ที่บันทึกหลักฐานถาวรใน `devflow/reports/{run-id}/`
  - [ ] 131d. **(Journey) Multi-IDE E2E Proof, Installer Matrix & v3 Migration** - อัปเดต template/installer ของ `create-nexus-devflow`, routing evals ไทย/อังกฤษ, คู่มือ migration v2 → v3 และรัน full test/package suite

---

## Phase 4: Adoption & Release Hardening

- [ ] 124. **(Journey) Golden-Path Examples & Documentation Proof** - สร้างตัวอย่าง greenfield, brownfield และ bug-fix ที่รันได้จริง เชื่อมเอกสารกับ package smoke tests และตรวจ retired commands อัตโนมัติ
- [ ] 125. **Production Release Readiness** - ตรวจ security hygiene, package contents, semantic version, release notes, rollback steps และ full quality matrix ก่อน publish (การ publish/push ต้องได้รับอนุญาตแยกต่างหาก)

---

## Project Architecture & Delivery Rules

- ทำ 115d และ release baseline ให้เสร็จก่อนเริ่ม feature ใหม่
- ทุก item ต้องมี acceptance criteria, evidence matrix และ rollback/compatibility note ตามระดับความเสี่ยง
- Behavior changes ใช้ TDD; documentation-only changes ใช้ structural/link/contract checks
- Status CLI, MCP และ sidecar อ่าน state จาก Markdown/JSON contracts เดิม ไม่สร้างฐานข้อมูลชุดที่สอง
- ไม่เพิ่ม core skill, dependency หรือ hosted service โดยไม่มี current requirement และ trade-off record

---

## Later / Evidence Required

- รองรับ editor เพิ่มเติมหลัง sidecar pilot มี usage evidence
- Hosted collaboration, cloud sync, organization policy packs และ analytics ต้องผ่าน discovery แยกก่อนเข้าคิว
- Automated publish หรือ deployment ยังอยู่นอก scope จนกว่าจะมี permission และ release governance ชัดเจน
