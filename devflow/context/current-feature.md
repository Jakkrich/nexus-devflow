# 056-modernize-documentation-and-user-guides: Modernize User Manuals, Guides & Reference Documentation to 2.5.0

- **Feature ID**: `056-modernize-documentation-and-user-guides`
- **Category**: `features`
- **Type**: `Feature`
- **Target Branch**: `2.5.0`
- **Status**: `Verified / Ready for /complete`
- **Track**: `Unified Fast-Track`
- **Discovery Reference**: [`devflow/discoveries/DISC-20260824-002-update-documentation.md`](../discoveries/DISC-20260824-002-update-documentation.md)

---

## 🎯 1. Define & Boundaries

### The problem
Existing documentation across the repository (`README.md`, `README.th.md`, `packages/create-nexus-devflow/README.md`) still refers to legacy Nexus-DevFlow 2.0 and the retired 8-stage Deep-Track pipeline (`10-define` through `70-deliver`). They do not explain the modern Nexus-DevFlow 2.5.0 Single Living Spec Model, Pre-Flight Discovery suite, Web Dashboard with 0ms SSR hydration, Multi-Agent Swarm, Code Graph RAG, JIT Context Slicing, or CLI management tools.

### The fix
1. **Modernize `README.md` (English)**: Complete rewrite covering the 3-Pillars architecture, the 4-stage Living Spec lifecycle (`/feature`, `/implement`, `/check`, `/complete`), Pre-Flight Discovery suite (`/idea`, `/grill`, `/brainstorm`, `/discovery`), Web Dashboard, Multi-Agent Swarm, Semantic Code Graph, and full CLI command catalog.
2. **Modernize `README.th.md` (Thai)**: Comprehensive, elegant, and crystal-clear Thai user manual explaining all 2.5.0 capabilities, real-world development workflows, and CLI usage.
3. **Update `packages/create-nexus-devflow/README.md` (NPM Registry)**: Clean and up-to-date installer guide for the NPM package ecosystem.
4. **Synchronize `devflow/context/project-overview.md`**: Living source of truth overview updated to reflect 2.5.0 architectural standards and tooling.

### Must not break
- Existing installation commands (`npx -y @jakkrichm/create-nexus-devflow@latest -y`) must remain exact.
- Framework validation checks (`npm run check:static`, `npm run check`) and markdown link contracts must pass 100%.
- Language switching policy between `README.md` (English) and `README.th.md` (Thai) must stay linked symmetrically.

---

## 📐 2. Technical Spec & Contracts

### Documentation Structure Contract:
1. **Hero & Badges**: NPM version, GitHub workflow badge, MIT license, Language Switcher (`English | ไทย`), and Quick Links.
2. **Core Philosophy**: The 3-Pillars Workspace Architecture (`devflow/ideas.md`, `devflow/context/`, `devflow/history/`).
3. **The 4-Stage Living Spec Lifecycle**:
   - `/feature` (or `/fix`) ➔ `/implement` ➔ `/check` ➔ `/complete`
   - Single Living Spec contract (6 structured sections).
4. **Pre-Flight Discovery & Architectural Alignment Suite**:
   - `/idea` (Idea inbox with AI feasibility scoring)
   - `/grill` (Socratic alignment, domain modeling, ADRs)
   - `/brainstorm` (Divergent/convergent ideation with trade-offs)
   - `/discovery` (Deep multi-turn inception exploration)
5. **Enterprise Web Dashboard & Studio**:
   - Live Dashboard (`npm run dashboard` with 0ms SSR Hydration & Git Cache)
   - 4-Role Multi-Agent Swarm Orchestrator (Architect, Coder, QA, Security)
   - Semantic Code Graph RAG & Blast Radius Visualizer
6. **CLI Command Reference**:
   - `check-gate`, `hook`, `mcp`, `slice`, `drift`, `reconcile`, `studio`, `swarm`, `graph`, `report:html`
7. **Quality & Engineering Standards**:
   - Strict TDD, Two-Stage Review Pattern, Multi-Lane Verification Matrix.

### Acceptance Criteria:
- [x] **AC-1**: `README.md` comprehensively documents Nexus-DevFlow 2.5.0, removing all references to legacy 8-stage Deep-Track, and adding Living Spec, Pre-Flight Discovery, Dashboard, Swarm, Code Graph, and CLI commands.
- [x] **AC-2**: `README.th.md` contains the full, beautifully formatted Thai edition of the 2.5.0 manual with identical parity to `README.md`.
- [x] **AC-3**: `packages/create-nexus-devflow/README.md` is updated for NPM package consumers with 2.5.0 commands and workflow.
- [x] **AC-4**: `devflow/context/project-overview.md` is synchronized with 2.5.0 capabilities.
- [x] **AC-5**: Framework verification passes 100% (`npm run typecheck`, `npm run check:static`, `npm test`, `npm run check`).

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Rewrite Main English Manual (`README.md`)**
  - [x] 1.1 Update Hero, badges, and 3-Pillars Workspace Architecture diagram.
  - [x] 1.2 Detail the Unified 4-Stage Single Living Spec Lifecycle (`/feature`, `/implement`, `/check`, `/complete`).
  - [x] 1.3 Detail Pre-Flight Discovery (`/idea`, `/grill`, `/brainstorm`, `/discovery`).
  - [x] 1.4 Detail Web Dashboard, Multi-Agent Swarm, Code Graph RAG, and CLI Catalog.
  - [x] 1.5 Verify all links, code blocks, and markdown structure.

- [x] **Task 2: Rewrite Main Thai Manual (`README.th.md`)**
  - [x] 2.1 Update Hero, badges, and สถาปัตยกรรม 3 เสาหลัก (Future / Present / Past).
  - [x] 2.2 Explain วงจร 4 ขั้นตอนของ Single Living Spec และการส่งมอบงาน.
  - [x] 2.3 Explain ชุดเครื่องมือ Pre-Flight Discovery (`/idea`, `/grill`, `/brainstorm`, `/discovery`).
  - [x] 2.4 Explain Web Dashboard, Multi-Agent Swarm 4 บทบาท, Code Graph, และคำสั่ง CLI ทั้งหมด.

- [x] **Task 3: Update NPM Package Guide & Project Overview**
  - [x] 3.1 Update `packages/create-nexus-devflow/README.md`.
  - [x] 3.2 Update `devflow/context/project-overview.md`.

- [x] **Task 4: Quality & Framework Verification**
  - [x] 4.1 Run `npm run check:static` to validate framework and markdown contracts.
  - [x] 4.2 Run `npm run typecheck` and `npm test`.
  - [x] 4.3 Run `npm run check` for full end-to-end release gate.

---

## ⚡ 4. Implementation Log & Evidence

- **Task 1 (`README.md`)**: Complete rewrite for Nexus-DevFlow 2.5.0. Removed legacy 8-stage Deep-Track references, added 3-Pillars ASCII architecture, Unified 4-stage Living Spec Lifecycle, Pre-Flight Discovery Suite, Dashboard architecture, Multi-Agent Swarm 4-roles, and CLI commands.
- **Task 2 (`README.th.md`)**: Full Thai edition rewritten with 100% feature parity. Clear, elegant explanations of the 3-Pillars, Living Spec Model, Web Dashboard, and engineering standards.
- **Task 3 (`packages/create-nexus-devflow/README.md` & `project-overview.md`)**: NPM package manual updated with 2.5.0 commands and workflow. Project overview synchronized.
- **Task 4 (Verification)**: Ran all test suites and framework checks (`check:static`, `typecheck`, `test`, `check`). 100% passed with zero errors.

---

## 🧪 5. Multi-Lane Verification Matrix

| Verification Lane | Command / Method | Result | Evidence / Notes |
| :--- | :--- | :---: | :--- |
| **1. Static Contract Gate** | `npm run check:static` | `PASS` | 28 skills, manifest, and markdown contracts verified. |
| **2. TypeScript Typecheck** | `npm run typecheck` | `PASS` | `tsc --noEmit` exited with code 0. |
| **3. Unit Test Suite** | `npm test` | `PASS` | 95/95 package tests + 4/4 overview tests passed (0 failures). |
| **4. AI Routing Evals** | `tsx scripts/evals/routing.ts` | `PASS` | 112/112 routing evals passed 100%. |
| **5. Package Smoke Test** | `tsx scripts/smoke-package.ts` | `PASS` | Clean tarball build, 89 overlay files tested in temp workspace. |
| **6. Full Release Gate** | `npm run check` | `PASS` | All 5 verification gates passed end-to-end. |

---

## 📦 6. Release Digest & Retrospective

_(Will be populated during `/complete`)_
