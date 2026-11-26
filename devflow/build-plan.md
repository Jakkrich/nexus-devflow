# Build Plan

> **Document Type**: Build Plan (User-Owned)
> **Purpose**: รายการฟีเจอร์ตามลำดับการพัฒนาจริง (Ordered Feature Roadmap Checklist)
> **Workflow**: ทำงานจากบนลงล่างด้วย `/feature` -> `/implement` -> `/check` -> `/complete`; ห้ามข้ามงานที่เป็น dependency
> **Planning Baseline**: 2026-11-26 — คิวงานสำหรับ v3.0.0 เสร็จสมบูรณ์และตัดรายการค้างที่ล้าสมัยหรือถูกผนวกรวมไปแล้วออก

---

## Phase 1: Foundation & Workflow Consolidation

- [x] 1. **Upstream AI Blueprint Synchronization & Zero-Regression Fusion** - ผสาน `explore`, proportional engineering, adapter switching และ CI pre-push hook โดยรักษาสถาปัตยกรรม DevFlow (Ref: DISC-20260929-001)
- [x] 111. **(Deprecated & Removed) Code-Modernization Recommended Third-Party Skill & Master Orchestrator** - ถอดระบบ `--recommended`, `compound-knowledge` wrapper synthesis และ `getCodeModernizationMasterSkill` ออกจาก Core CLI ในการเก็บกวาด v3.0 (Ref: DISC-20261027-001)
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

## Phase 2: Ecosystem Reliability

- [x] 116. **(Deprecated & Removed) Consolidation Release Baseline & Migration Contract** - ถอดออกเนื่องจากขอบเขต v2 → v3 migration และ installer matrix ถูกรวมเข้ากับ Feature 131d แล้ว และเกณฑ์เตรียม release ถูกรวมไว้ที่ Feature 125
- [x] 119. **(Skateboard) Planning & Overview Integrity Gate** - ตรวจ placeholder/stale/mismatched plans ก่อนสร้าง overview, ให้ข้อความแก้ไขที่ทำตามได้ และเพิ่ม regression tests สำหรับ source hash กับ generated-state boundaries
- [x] 130. **(Tracer Bullet) Multi-Chat Safe Isolation & Aggregated Status** - แยก per-run activity state (`devflow/.state/runs/{run-id}.json`), เพิ่ม `evaluateWorktreeGuard` และ cross-worktree `reserveNextRunningId`, รวมสถานะ + handoff summary ข้าม worktree ใน `status`, และสร้าง formal concurrency proof (`verify:concurrent-isolation`)

---

## Phase 3: Integration & Operator Experience

- [x] 121. **(Deprecated & Removed) Evidence-First Workflow Dashboard** - ถอดแผนยกระดับ Web Dashboard ตามแนวทาง Lite-first (ถูกแทนที่ด้วย Feature 128)
- [x] 126. **(Tracer Bullet) Opt-in `browseros-neo` Team Skill (E2E Testing & Evidence)** - เพิ่ม custom `extras/skills/browseros-neo/` ต่อยอดจาก `browserclaw` สำหรับทดสอบและแก้ปัญหาแบบ E2E ผ่าน BrowserOS neo MCP, สร้าง test plan + evidence รายเคสใน `devflow/reports/{run-id}/` (ไม่ขึ้น Git) และผูก `name_session` ย้อนดูวิดีโอใน BrowserOS neo ตาม DevFlow ID (Ref: DISC-20261117-003)
- [x] 127. **(Tracer Bullet) Interactive Extras Skills Checkbox Setup** - ถอด Superpower Community Skills ออกจาก Step `[3/3]` ของ `install`/`update` และแทนที่ด้วย zero-dep checkbox เลือกติดตั้ง/อัปเดต `extras/skills/` จาก local bundle (Ref: DISC-20261118-001)
- [x] 128. **(Skateboard) Remove Web Dashboard, Studio UI & MCP Studio Tool (Option 2)** - ถอด `dashboard`/`ui`/`studio` CLI, HTTP server, `studio-view-renderer.ts` (~102 KB), `dashboard-*.ts`, `webview-studio.ts`, orphan modules (`command-catalog.ts`, `version-check.ts`, `workflow-state.ts`) และ MCP tool `devflow_get_studio_html` เพื่อลดขนาดแพ็กเกจ ~26% โดยคง Core Workflow, `status`, `run-state` และ `report:html` ไว้ครบ
- [x] 131. **DevFlow v3 Autonomous Subagent & `pstack` Rework** - ปรับ workflow เป็น Coordinator + Isolated Subagents, ตัด human gates ระหว่างทางเหลือ Final Evidence Packet Gate (Option A), และ reuse `pstack` แบบไม่แก้ไขต้นทาง (Ref: DISC-20261126-001, ADR-001)
  - [x] 131a. **(Skateboard) v3 Config Policy, Contract & Autonomous Core Loop** - เพิ่ม `execution` (`engine`, `tier`, `autoCommitFeatureBranch`) และ `delivery.gate` ใน `project-config.ts`, อัปเดต `agent-bundle.manifest.json` / `validate-framework.ts`, และปลดล็อก human pauses ระหว่างทางบน feature branch
  - [x] 131b. **(Tracer Bullet) `devflow-mode`, `devflow-help`, Playbooks & `pstack` Adapter** - สร้าง `devflow-mode` (แทน `autopilot`), `devflow-help` (รวม/แทน guide, status และ doctor ของ `devflow`), Core `playbooks/` (`feature`, `bug-fix`, `refactor`, `discovery`, `autonomous-queue`), ตัวตรวจ `extends:` anchor, และ sync `.agents/` ↔ `.claude/`
  - [x] 131c. **(Tracer Bullet) Evidence-First Verification & `verify` Bootstrap** - ให้ `/onboard` สร้าง/ตรวจ `.agents/skills/verify/`, ยกระดับ `/check` และ `/audit` เป็น Verifier Swarm + Prove-by-Run (`interrogate` / `verify-layers`) ที่บันทึกหลักฐานถาวรใน `devflow/reports/{run-id}/`
  - [x] 131d. **(Journey) Multi-IDE E2E Proof, Installer Matrix & v3 Migration** - อัปเดต template/installer ของ `create-nexus-devflow`, routing evals ไทย/อังกฤษ, คู่มือ migration v2 → v3 และรัน full test/package suite
- [x] 132. **(Tracer Bullet) Seamless `pstack` Detection, Playbook Namespace Isolation & Coordinator Precedence** - ขยายการตรวจจับ path จริงของ `pstack` (plugin caches, `open-pstack`, `.agents/plugins/pstack`, in-session skills), แยก namespace ของ custom playbooks (`devflow/playbooks/` + กรอง `poteto-mode` ใน `.agents/playbooks/`), กำกับ H2 headings + adapter sync ของ `verify` ใน `/onboard`, และระบุหลัก Coordinator เดียวคู่กับ `session hook: off`

---

## Phase 4: Adoption & Release Hardening

- [x] 125. **Production Release Readiness** - ตรวจ security hygiene, package contents, semantic version, release notes, rollback steps และ full quality matrix ก่อน publish (การ publish/push ต้องได้รับอนุญาตแยกต่างหาก)

---

## Project Architecture & Delivery Rules

- ทุก item ต้องมี acceptance criteria, evidence matrix และ rollback/compatibility note ตามระดับความเสี่ยง
- Behavior changes ใช้ TDD; documentation-only changes ใช้ structural/link/contract checks
- Status CLI และ MCP อ่าน state จาก Markdown/JSON contracts เดิม ไม่สร้างฐานข้อมูลชุดที่สอง
- ไม่เพิ่ม core skill, dependency หรือ hosted service โดยไม่มี current requirement และ trade-off record

---

## Later / Evidence Required

- IDE sidecar หรือส่วนเสริมเฉพาะ editor ต้องมีหลักฐานความต้องการใช้งานจริงก่อนนำเข้าคิว (ปัจจุบันใช้ CLI/MCP JSON โดยตรงตามแนวทาง Lite-first)
- Hosted collaboration, cloud sync, organization policy packs และ analytics ต้องผ่าน discovery แยกก่อนเข้าคิว
- Automated publish หรือ deployment ยังอยู่นอก scope จนกว่าจะมี permission และ release governance ชัดเจน
