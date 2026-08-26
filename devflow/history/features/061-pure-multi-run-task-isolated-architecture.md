# [061-pure-multi-run-task-isolated-architecture] Pure Multi-Run Task-Isolated Architecture

> **Template Type**: Task-Isolated Living Spec (DevFlow 2.7.0)  
> **Active Location**: `devflow/context/061-pure-multi-run-task-isolated-architecture/spec.md`  
> **Archive Location**: `devflow/history/features/061-pure-multi-run-task-isolated-architecture.md`  

- **Feature ID**: `061-pure-multi-run-task-isolated-architecture`
- **Category**: `features`
- **Target Branch**: `feature/061-pure-multi-run-task-isolated-architecture`
- **Status**: `Completed & Archived`
- **Track**: `Unified Fast-Track`
- **Discovery Ref**: `devflow/discoveries/DISC-20260826-004-pure-multi-run-task-isolated-architecture/discovery.md`
- **ADR Ref**: None

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
- **Problem**: ในปัจจุบัน Nexus-DevFlow ยังมีไฟล์ `current-feature.md`, `current-stage.md`, `findings.md` ตกค้างอยู่ที่ Root ของ `devflow/context/` ประกอบกับคำสั่งและ Prompts ใน `AGENTS.md` และ Skills ยังระบุชื่อไฟล์กลางเหล่านี้ ทำให้ AI Agents (Claude, Antigravity, Copilot, Codex) เขียนทับไฟล์ตรงกลางเสมอ เกิดการบล็อกการทำงานแบบ Spec-Ahead และ Multi-Run อย่างสิ้นเชิง
- **Goal**: ปรับเปลี่ยนสู่ **Pure Multi-Run Task-Isolated Architecture** 100% โดยลบไฟล์ Single Spec ที่ Root ออกทั้งหมด, บังคับให้ทุก Task สร้างและทำงานใน Subdirectory `devflow/context/{xxx-slug}/`, และปรับปรุง Core Resolvers, Skills, Documentation และ Scaffolding Templates ให้สอดคล้องกันทั่วทั้งระบบ

### In-Scope & Out-of-Scope
- **In-Scope**:
  - **Task Directory Enforcement**: ทุกคำสั่ง (`feature`, `fix`, `rollback`, `implement`, `check`, `complete`) ต้องทำงานผ่าน `devflow/context/{xxx-slug}/` เสมอ
  - **Root Cleanup**: ลบ `devflow/context/current-feature.md`, `current-stage.md`, `findings.md` ออกจาก Root และคงไว้เฉพาะ 4 Global Shared Docs (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `glossary.md`)
  - **Skill Adapters Refactoring**: ปรับปรุงคำสั่งทุกตัวใน `.agents/skills/` และ `.claude/skills/` ให้มุ่งเป้าไปที่ Task Subdirectory เท่านั้น
  - **Core Resolver Hardening**: ปรับปรุง `packages/create-nexus-devflow/lib/branch-context.ts`, `current-work.ts`, `status.ts`, `doctor.ts`, `history.ts` ให้ตัด Legacy Single Fallback และรองรับ Smart Context Resolution ผ่าน Git Branch / Active Run Queue
  - **Scaffold & Templates Update**: อัปเดต template และ tests ใน `packages/create-nexus-devflow/` ให้สะท้อนโครงสร้างใหม่อย่างสมบูรณ์
  - **Documentation & Directives**: อัปเดต `AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md`, `ai-interaction.md`, และ reference guides
- **Out-of-Scope**:
  - การเปลี่ยนรูปแบบประวัติ Archive ใน `devflow/history/` (ยังคงเป็น Single File `.md` ใน `features/`, `fixes/`, `rollbacks/`)
  - การเปลี่ยนระบบ Sequential ID `xxx-slug`

### Risk & Mitigation Matrix
| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| Agent สับสนเมื่อไม่พบ `current-feature.md` ที่ Root | Medium | อัปเดต `AGENTS.md`, `CLAUDE.md`, และ `SKILL.md` ทุกไฟล์ให้ระบุโครงสร้าง `devflow/context/{xxx-slug}/spec.md` อย่างชัดเจน |
| User พิมพ์ `/implement` โดยไม่ใส่เลข ID | Low | ใช้ Smart Context Resolver: Auto-detect จาก Git Branch ปัจจุบัน หรือหยิบงานเดียวที่ active อยู่ใน workspace |
| CLI / Tests ล้มเหลวเนื่องจากการค้นหา `current-feature.md` เดิม | High | ปรับ Unit Tests ทั้งหมดใน `test/` ให้ทดสอบ Subdirectory Mode และยืนยันความถูกต้องด้วย `npm test` |

### Success Criteria
1. ไม่มีไฟล์ `current-feature.md`, `current-stage.md`, `findings.md` อยู่ที่ Root ของ `devflow/context/` อีกต่อไป
2. เมื่อรัน `/feature` หรือ `/fix` จะสร้างโฟลเดอร์ `devflow/context/{xxx-slug}/` พร้อมไฟล์ `spec.md`, `stage.md`, `findings.md` เสมอ
3. คำสั่ง `/implement`, `/check`, `/complete` สามารถทำงานกับ Task Subdirectory ได้อย่างสมบูรณ์ทั้งแบบระบุ ID และไม่ระบุ ID (Auto-detect)
4. เมื่อรัน `/complete` จะ Archive ไฟล์ไปยัง `devflow/history/features/{xxx-slug}.md` และลบโฟลเดอร์เฉพาะกิจออกอย่างหมดจด
5. เอกสารคำแนะนำและ Skill files ทั้งหมดใน `.agents/` และ `.claude/` สอดคล้องกัน 100%

---

## 📐 2. Technical Spec & Contracts

### Architecture & Component Design

```text
devflow/context/
├── project-overview.md     # 🌐 Global Shared: สถาปัตยกรรมหลัก
├── coding-standards.md     # 🌐 Global Shared: กฎการโค้ด & TDD
├── ai-interaction.md       # 🌐 Global Shared: กฎการทำงาน AI
├── glossary.md             # 🌐 Global Shared: ศัพท์เทคนิค & โดเมน
│
└── {xxx-slug}/             # ⚡ Task Workspace (Created on /feature, Deleted on /complete)
    ├── spec.md             # Living Spec + AC + TDD Checklist
    ├── stage.md            # Stage pointer & Branch reference
    └── findings.md         # Dedicated QA / Audit ledger
```

### Smart Context Resolution Flow (Core Contract)
```typescript
interface ActiveContextResolution {
  targetRunId: string;
  runDir: string;
  specPath: string;      // devflow/context/{xxx-slug}/spec.md
  stagePath: string;     // devflow/context/{xxx-slug}/stage.md
  findingsPath: string;  // devflow/context/{xxx-slug}/findings.md
  resolutionSource: 'git_branch' | 'explicit_id' | 'single_active' | 'interactive_menu';
}
```

### Acceptance Criteria (AC)
- [x] **AC-1**: Root Directory ของ `devflow/context/` มีเฉพาะ 4 Global Shared Markdown files
- [x] **AC-2**: Core Library (`branch-context.ts`, `current-work.ts`, `status.ts`, `doctor.ts`) ค้นหาและจัดการ Task Subdirectories ได้อย่างถูกต้องโดยไม่มีการ fallback ไปหา root stubs
- [x] **AC-3**: Agent Instruction Directives ใน `AGENTS.md` และ `CLAUDE.md` กำหนดให้ทุกคำสั่งสร้างและอ่านจาก `devflow/context/{xxx-slug}/` เสมอ
- [x] **AC-4**: Skills ทั้งหมดใน `.agents/skills/` และ `.claude/skills/` ได้รับการปรับปรุงสู่ Pure Multi-Run Contract
- [x] **AC-5**: Scaffolding Templates และ Unit Tests ทั้งหมดใน `packages/create-nexus-devflow` ผ่านการทดสอบ 100%

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Core Resolver & State Engine Refactoring (`packages/create-nexus-devflow/lib/`)**
  - [x] 1.1 `[TDD-Red]` เขียน Unit Test ใน `test/branch-context.test.ts` และ `test/current-work.test.ts` สำหรับ Pure Multi-Run Directory Resolution (ไม่มี root stubs fallback)
  - [x] 1.2 `[TDD-Green]` ปรับปรุง `branch-context.ts` และ `current-work.ts` ให้ตัด legacy fallback และตรวจจับเฉพาะ `devflow/context/{xxx-slug}/`
  - [x] 1.3 `[TDD-Green]` ปรับปรุง `status.ts`, `doctor.ts`, `history.ts`, `drift-reconciler.ts`, และ `gatekeeper.ts` ให้รองรับ Pure Multi-Run สมบูรณ์
  - [x] 1.4 `[TDD-Refactor]` Clean up types และ interfaces ที่เกี่ยวข้อง

- [x] **Task 2: Directives & Reference Documentation Update**
  - [x] 2.1 `[TDD-Green]` อัปเดต `AGENTS.md` และ `CLAUDE.md` ปรับบทบาทเป็น Pure Multi-Run Task-Isolated Living Spec Model
  - [x] 2.2 `[TDD-Green]` อัปเดต `devflow/context/ai-interaction.md` และ `devflow/reference/running-id-contract.md`
  - [x] 2.3 `[TDD-Green]` อัปเดต `devflow/reference/feature-spec-template.md`, `README.md`, และ `README.th.md`

- [x] **Task 3: Agent Skills Synchronous Refactoring (`.agents/skills/` & `.claude/skills/`)**
  - [x] 3.1 `[TDD-Green]` ปรับปรุง `feature`, `fix`, `rollback` Skills ให้เขียนลง `devflow/context/{xxx-slug}/spec.md` เสมอ
  - [x] 3.2 `[TDD-Green]` ปรับปรุง `implement`, `check`, `complete` Skills ให้รองรับ Multi-Run Resolution และ Cleanup directory เมื่อเสร็จสิ้น
  - [x] 3.3 `[TDD-Green]` ปรับปรุง `status`, `devflow`, `continuous`, `doctor`, `try`, `report-html`, `audit`, `autopilot`, `discovery` Skills

- [x] **Task 4: Scaffolding Templates, Root Cleanup & Verification**
  - [x] 4.1 `[TDD-Green]` ปรับปรุง Templates ใน `packages/create-nexus-devflow/template/` และ starter scripts ไม่ให้สร้างไฟล์ stub ที่ root
  - [x] 4.2 `[TDD-Green]` ลบ `devflow/context/current-feature.md`, `current-stage.md`, `findings.md` ออกจาก Root
  - [x] 4.3 `[TDD-Refactor]` รัน Test Suite ทั้งหมดและยืนยันความถูกต้องแบบ Multi-Lane Verification

---

## ⚡ 4. Implementation Log & Evidence

### Step 1: Core Engine Refactoring
- Refactored `branch-context.ts`, `current-work.ts`, `doctor.ts`, `workflow-state.ts`, `findings.ts`, `gatekeeper.ts`, `swarm-orchestrator.ts`, `mcp.ts` to fully isolate active task state in `devflow/context/{xxx-slug}/` subdirectories.
- Idle workspace state correctly returns empty path indicators and points to the next action without writing root stubs.

### Step 2: System Directives & References Synchronization
- Updated `AGENTS.md`, `CLAUDE.md`, `devflow/context/ai-interaction.md`, `devflow/reference/running-id-contract.md`, `devflow/reference/feature-spec-template.md`, and all root README documentation.
- The 4 global shared context files in `devflow/context/` are strictly enforced: `project-overview.md`, `coding-standards.md`, `ai-interaction.md`, and `glossary.md`.

### Step 3: Agent Skills Synchronization (.agents/ and .claude/)
- Synchronized all 29 skills across `.agents/skills/` and `.claude/skills/` to Pure Task-Isolated Living Spec conventions.
- Zero references to legacy root `current-feature.md` or `current-stage.md` remain.

### Step 4: Root Stubs Abolished & Full Verification
- Successfully deleted `devflow/context/current-feature.md`, `devflow/context/current-stage.md`, and `devflow/context/findings.md` from the root context directory.
- `npm test`: 109/109 unit tests passed.
- `npm run check:static`: passed static manifest verification.
- `npm run check`: full package verification and smoke test overlay passed with 0 errors.

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :--- | :--- |
| **Typecheck** | `tsc --noEmit` / TypeScript build | ✅ PASS | 0 errors |
| **Static Contract** | `npm run check:static` (validate-framework.ts) | ✅ PASS | All manifests & 29 Core Skills synchronized |
| **Unit Tests** | `npm test` across package test suites | ✅ PASS | 109/109 tests passed (0 fail) |
| **Package Smoke** | `npm run check` (tarball, overlay & install) | ✅ PASS | Smoke test passed with 94 installed files in temp directory |
| **Pure Multi-Run Proof** | `devflow/context/` directory inspection | ✅ PASS | Root contains only 4 global docs; active run isolated in `061-*/` |

---

## 📦 6. Release Digest & Retrospective

- **Summary of Deliverable**: ปรับเปลี่ยน Nexus-DevFlow สู่ Pure Task-Isolated Living Spec Model โดยสมบูรณ์ ลบไฟล์ตกค้างตรงกลางที่ root ของ `devflow/context/` ทั้งหมด และบังคับให้ทุกงานแยก context เป็นเอกเทศในโฟลเดอร์เฉพาะกิจ
- **Verification Proof**: ผ่านการทดสอบครบทุกด่าน (109 unit tests, static manifest contract, smoke overlay test, zero compiler errors)
- **Key Files Modified**:
  - Core Library: `branch-context.ts`, `current-work.ts`, `doctor.ts`, `findings.ts`, `gatekeeper.ts`, `swarm-orchestrator.ts`, `mcp.ts`
  - Agent Skills: `.agents/skills/*` และ `.claude/skills/*` (29 skills ทั้งหมด)
  - Directives & Reference: `AGENTS.md`, `CLAUDE.md`, `ai-interaction.md`, `running-id-contract.md`, `feature-spec-template.md`, `README.md`
- **Retrospective**: การแยกโฟลเดอร์ตาม Task แบบเบ็ดเสร็จตั้งแต่ต้นทาง ช่วยให้ AI Agent ทุกค่าย (Antigravity, Claude, Copilot, Codex) ปฏิบัติตาม Multi-Run isolation โดยอัตโนมัติ ไม่มีการเขียนทับหรือ fallback ไปหาไฟล์กลางอีกต่อไป
