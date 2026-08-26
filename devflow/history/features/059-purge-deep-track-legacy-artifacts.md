# [059-purge-deep-track-legacy-artifacts] Purge Legacy Deep-Track & Numbered Stage Artifacts

> **Template Type**: Single Living Spec (DevFlow 2.6.1)  
> **Archive Location**: `devflow/history/features/059-purge-deep-track-legacy-artifacts.md`  
> **Completed At**: 2026-08-26  

- **Feature ID**: `059-purge-deep-track-legacy-artifacts`
- **Category**: `features`
- **Target Branch**: `feature/059-purge-deep-track-legacy-artifacts`
- **Status**: `Completed & Archived`
- **Track**: `Unified Living Spec Model`
- **Discovery Ref**: `devflow/discoveries/DISC-20260826-002-purge-deep-track-legacy-artifacts/discovery.md`
- **ADR Ref**: `devflow/decisions/ADR-001-unify-dual-track-into-single-living-spec.md`

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
- **Problem**: ใน codebase, package engine (`packages/create-nexus-devflow/`), agent skills (`.agents/`, `.claude/`), automation scripts (`scripts/`), unit tests, และ reference mockup ยังมีโค้ด/ข้อความตกค้างของ Deep-Track และสเตจตัวเลขเดิม (`00-explore`, `10-define`, `20-spec`, `30-plan`, `40-execute`, `50-verify`, `60-report`, `70-deliver`) ทำให้เกิด fallback ผิดพลาด, AI สับสนเมื่อถูกถาม, และมี dead code สะสม
- **Goal**: ล้างโค้ดและข้อความตกค้างของ Deep-Track และสเตจตัวเลข 00-70 ออกจาก codebase อย่างสมบูรณ์ 100% ปรับ fallback ใน engine ให้รองรับเฉพาะ Single Living Spec / Multi-Run Context และผ่านการทดสอบคุณภาพทั้งหมด

### In-Scope & Out-of-Scope
- **In-Scope**:
  - **Package Engine Modernization**:
    - `packages/create-nexus-devflow/lib/status.ts`: ตัด fallback logic `currentWork.type === "stage"` (`/40-execute`, `/50-verify`) ให้ fallback สู่ `/implement` และ `/check`
    - `packages/create-nexus-devflow/lib/current-work.ts`: ตัดฟังก์ชัน `readDeepTrackWork` และการหา `20-spec.md` หรือ `current-run`
    - `packages/create-nexus-devflow/lib/history.ts`: ปรับ `preferred` files ให้ไม่มี `10-define.md` / `20-spec.md`
    - `packages/create-nexus-devflow/test/status.test.ts`, `history-directories.test.ts`, `discoveries.test.ts`: ปรับ unit tests ให้ทดสอบเฉพาะ Living Spec & Multi-Run Context
  - **Agent Skills Modernization**:
    - `.agents/skills/test/SKILL.md` และ `.claude/skills/test/SKILL.md`: ปรับข้อความ `40-execute`, `50-verify`, `30-plan` เป็น `implement`, `check`, `feature`
    - `.agents/skills/report-html/SKILL.md` และ `.claude/skills/report-html/SKILL.md`: ตัดการอ้างอิง `60-report.md` ในโหมด Deep-Track
    - `.agents/skills/idea/SKILL.md` และ `.claude/skills/idea/SKILL.md`: ปรับตัวอย่างคำสั่ง `/spec` / `/00-explore` เป็น `/feature` / `/discovery`
    - `.agents/skills/grill/SKILL.md` และ `brainstorm/SKILL.md`: ปรับคำแนะนำ `10-define` เป็น `/discovery` / `/feature`
  - **Automation Scripts & Test Fixtures**:
    - `scripts/summarize-run-status.mjs`: ปรับ stage icons และคำนวณสถานะตาม Single Living Spec
    - `scripts/update-skill-descriptions.mjs`: ตัดคำอธิบายสเตจ 10-70 ที่ปลดระวางแล้ว
    - `scripts/standardize-command-invocations.mjs`: ลบ regex แทนที่สเตจ 10-70
    - `scripts/render-html.mjs` & `scripts/lib/render-html/`: ปรับ CLI ให้รองรับ standalone HTML report โดยไม่อิง `--stage 60-report`
    - `scripts/test-summarize-run-status.mjs`, `scripts/test-validate-checklists.mjs`, `scripts/test-verify-impact-contract.mjs`, `scripts/test-migrate-stage-artifacts.mjs`, `scripts/test-render-report-stage.mjs`, `scripts/test-render-html-core.mjs`, `scripts/test-generate-report-html.mjs`, `scripts/test-stage-content-contract.mjs`, `scripts/test-skill-selection-policy.mjs`: ปรับปรุง fixtures ให้สะอาดสมบูรณ์
  - **Context & Reference Documents**:
    - `devflow/reference/mockup.html`: ปรับ UI Pipeline ให้เป็น Unified Living Spec Model (ไม่มี Deep-Track tab)
    - `devflow/context/coding-standards.md` & `ai-interaction.md`: ลบการอ้างอิง `00-explore`
    - `devflow/history/{features,fixes,rollbacks}/README.md`: ลบข้อความ `or xxx-name/ (for Deep-Track stage runs)`
    - `devflow/ideas.md`: ปรับ Pending Ideas ให้ไม่มีคำสั่ง `/00-explore` หรือ `/spec`
    - `devflow/decisions/README.md`: แทนที่ `00-explore` ด้วย `/discovery`
- **Out-of-Scope**:
  - ประวัติศาสตร์ใน `CHANGELOG.md` และไฟล์ Markdown ใน `devflow/history/features/*.md` เดิม (คงไว้เป็นบันทึกประวัติการส่งมอบในอดีต)

### Risk & Mitigation Matrix
| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| การตัด `readDeepTrackWork` อาจทำให้โปรเจกต์ legacy แตก | Low | ระบบ 2.5.0/2.6.x บังคับใช้ `current-feature.md` และ `devflow/context/{xxx-slug}/` แล้ว ไม่มีรัน active แบบ 8 สเตจอีกต่อไป |
| Unit tests ใน `packages/create-nexus-devflow` ล้มเหลว | Medium | ปรับ unit tests ใน `status.test.ts` และ `discoveries.test.ts` ให้ตรงกับพฤติกรรมปัจจุบัน |

### Success Criteria
1. ไม่มีคำว่า `40-execute`, `50-verify`, `60-report`, `70-deliver`, `10-define`, `20-spec`, `30-plan` ใน `.agents/skills/`, `.claude/skills/`, `devflow/context/`, และ runtime engine
2. Engine (`create-nexus-devflow`) คำนวณ `nextAction` และ `currentWork` ด้วย Single Living Spec และ Multi-Run Spec 100%
3. การตรวจสอบ Static Contracts (`npm run check:static` / `validate-framework`) ผ่านฉลุย 100%

---

## 📐 2. Technical Spec & Contracts

### 2.1 Engine Status & Current Work Contracts
- ใน `lib/status.ts`:
  ```typescript
  // ลบ block:
  // if (currentWork.type === "stage") { ... command: `/40-execute...` }
  // ให้ fallback ทั้งหมดไปที่ /implement และ /check
  ```
- ใน `lib/current-work.ts`:
  - ลบฟังก์ชัน `readDeepTrackWork` และ fallback ไปยัง `20-spec.md`
  - ตรวจสอบเฉพาะ `current-feature.md` และโฟลเดอร์ task-specific ใน `devflow/context/{xxx-slug}/spec.md`
- ใน `lib/history.ts`:
  ```typescript
  const preferred = ["current-feature.md", "spec.md", "discovery.md", "report.md"];
  ```

### 2.2 Skill Definitions & Invocations
- ปรับทุก skill ให้เรียกใช้ Canonical Commands ปัจจุบัน:
  - Discovery: `/discovery`
  - Living Spec: `/feature`, `/fix`
  - Execution: `/implement`
  - QA Gate: `/check`
  - Complete: `/complete`
  - Standalone Report: `/report-html`

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Agent Skills & Prompt Documentation Cleanup**
  - [x] 1.1 `[TDD-Green]` อัปเดต `.agents/skills/test/SKILL.md` และ `.claude/skills/test/SKILL.md` ลบการอ้างอิง `40-execute`, `50-verify`, `30-plan`
  - [x] 1.2 `[TDD-Green]` อัปเดต `.agents/skills/report-html/SKILL.md` และ `.claude/skills/report-html/SKILL.md` ลบการอ้างอิง `60-report.md` ใน Deep-Track
  - [x] 1.3 `[TDD-Green]` อัปเดต `.agents/skills/idea/SKILL.md` และ `.claude/skills/idea/SKILL.md` ปรับตัวอย่างคำสั่งเป็น `/feature` / `/discovery`
  - [x] 1.4 `[TDD-Green]` อัปเดต `.agents/skills/grill/SKILL.md` และ `brainstorm/SKILL.md` ลบ `10-define`
  - [x] 1.5 `[TDD-Green]` อัปเดต `devflow/context/coding-standards.md`, `ai-interaction.md`, `devflow/ideas.md`, และ `devflow/history/*/README.md`

- [x] **Task 2: Package Engine Modernization (`create-nexus-devflow`)**
  - [x] 2.1 `[TDD-Red]` ตรวจสอบและปรับปรุง Unit Tests ใน `packages/create-nexus-devflow/test/status.test.ts` และ `discoveries.test.ts`
  - [x] 2.2 `[TDD-Green]` ปรับปรุง `packages/create-nexus-devflow/lib/status.ts` ตัด fallback `currentWork.type === "stage"`
  - [x] 2.3 `[TDD-Green]` ปรับปรุง `packages/create-nexus-devflow/lib/current-work.ts` ตัด `readDeepTrackWork`
  - [x] 2.4 `[TDD-Green]` ปรับปรุง `packages/create-nexus-devflow/lib/history.ts` อัปเดต `preferred` files list
  - [x] 2.5 `[TDD-Refactor]` ตรวจสอบ typecheck และ lint ใน package

- [x] **Task 3: Automation Scripts & Reference Mockups Modernization**
  - [x] 3.1 `[TDD-Green]` อัปเดต `scripts/update-skill-descriptions.mjs` ตัดรายการสเตจ 10-70
  - [x] 3.2 `[TDD-Green]` อัปเดต `scripts/summarize-run-status.mjs` และ `scripts/standardize-command-invocations.mjs`
  - [x] 3.3 `[TDD-Green]` อัปเดต `scripts/render-html.mjs` และโมดูลเรนเดอร์ใน `scripts/lib/render-html/`
  - [x] 3.4 `[TDD-Green]` ปรับปรุง `devflow/reference/mockup.html` นำแถบ Deep-Track 8 stages ออก ให้ตรงกับ UI ปัจจุบัน

- [x] **Task 4: Full-Suite Verification & Zero-Drift Scan**
  - [x] 4.1 `[TDD-Green]` รัน `scripts/validate-framework.ts` และ Static Check สแกนทั้งระบบ
  - [x] 4.2 `[TDD-Green]` สแกน codebase ด้วย regex ตรวจสอบว่าไม่มี `40-execute` หรือสเตจตัวเลขหลงเหลือใน runtime/skills

---

## ⚡ 4. Implementation Log & Evidence

- **Step 1 (Task 1)**: Purged all legacy stage references (`40-execute`, `50-verify`, `60-report`, `70-deliver`, `10-define`, `20-spec`, `30-plan`, `00-explore`) across `.agents/skills/`, `.claude/skills/`, and `devflow/context/` core documentation files.
- **Step 2 (Task 2)**: Modernized `create-nexus-devflow` engine & test suite:
  - `lib/status.ts`: Removed `currentWork.type === "stage"` fallback returning `/40-execute` and `/50-verify`; now cleanly routes to `/implement` and `/check`.
  - `lib/current-work.ts`: Removed `readDeepTrackWork` function and references to `DEVFLOW_CURRENT_RUN_DIR`; updated `normalizeWorkType` to map `stage`/`spec` to `feature`.
  - `lib/history.ts`: Modernized `preferred` archive list to `["current-feature.md", "spec.md", "discovery.md", "report.md"]`.
  - `lib/discoveries.ts`: Cleaned fallback logic to read `discovery.md` directly.
  - `test/status.test.ts`, `test/history-directories.test.ts`, `test/discoveries.test.ts`: Updated unit test assertions to match Single Living Spec resolution (removed `60-report.md`, `002-deep-run`, `/70-deliver`).
- **Step 3 (Task 3)**: Cleaned automation scripts & test fixtures:
  - `scripts/update-skill-descriptions.mjs`: Purged descriptions for legacy 10-70 numbered stages.
  - `scripts/summarize-run-status.mjs`: Updated stage order and gate labels to modern Living Spec lifecycle (`feature`, `implement`, `check`, `complete`), completely removing `/60-Report` and `/40-Execute` fallbacks.
  - `scripts/standardize-command-invocations.mjs`: Modernized mainline stages array.
  - `scripts/render-html.mjs` & `scripts/lib/render-html/`: Updated CLI options to support `--stage report` and `--stage feature`, default to `report.md`/`report.html`.
  - `scripts/migrate-stage-artifacts.mjs`: Modernized stageMappings to `discovery.md`, `spec.md`, `findings.md`, `report.md`.
  - `scripts/goal-runner.mjs`: Replaced `/10-define` and `/20-spec` command routing with `/feature` and `/implement`.
  - `scripts/test-summarize-run-status.mjs`, `scripts/test-validate-checklists.mjs`, `scripts/test-verify-impact-contract.mjs`, `scripts/test-migrate-stage-artifacts.mjs`, `scripts/test-render-report-stage.mjs`, `scripts/test-render-html-core.mjs`, `scripts/test-generate-report-html.mjs`, `scripts/test-stage-content-contract.mjs`, `scripts/test-skill-selection-policy.mjs`: Fully purged legacy stage references.
  - `devflow/reference/mockup.html`: Replaced Dual-Track / 8-stage Deep-Track section with Unified Living Spec Model.
- **Step 4 (Task 4)**: Verified zero-drift status:
  - Global `grep_search` confirmed zero numbered stage names in `.agents/skills/`, `.claude/skills/`, `devflow/context/`, `scripts/`, and engine runtime code.

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :--- | :--- |
| **Zero Legacy Grep (Skills)** | `grep_search` in `.agents/` & `.claude/` | ✅ PASSED | 0 hits for legacy stage numbers |
| **Zero Legacy Grep (Scripts)** | `grep_search` in `scripts/` | ✅ PASSED | 0 hits for legacy stage numbers |
| **Engine Runtime Grep** | `grep_search` in `packages/create-nexus-devflow/` | ✅ PASSED | 0 hits for `readDeepTrackWork` or `/40-execute` |
| **Context & Decisions Grep** | `grep_search` in `devflow/` (active files) | ✅ PASSED | 0 hits for legacy stage numbers |
| **Unit Test Coverage** | `status.test.ts`, `discoveries.test.ts`, `history-directories.test.ts` | ✅ PASSED | Tests updated to Single Living Spec |
| **Next Action Verification** | `devflow/context/current-stage.md` | ✅ PASSED | Correctly points to `/complete 059-purge-deep-track-legacy-artifacts` |

---

## 📦 6. Release Digest & Retrospective

- **Release Summary**: ปลดระวางและกวาดล้างรหัสสเตจแบบเก่าของ Deep-Track (`00-explore`, `10-define`, `20-spec`, `30-plan`, `40-execute`, `50-verify`, `60-report`, `70-deliver`) ออกจากระบบอย่างเบ็ดเสร็จ 100% ครอบคลุม package engine (`create-nexus-devflow`), agent skills (`.agents/`, `.claude/`), automation scripts & test fixtures (`scripts/`), และ context documents/mockups ปรับระบบให้ทำงานบน Unified Living Spec Model & Multi-Run Context สมบูรณ์
- **Key Changes**:
  - `packages/create-nexus-devflow/lib/status.ts` & `current-work.ts`: ลบ `currentWork.type === "stage"`, `readDeepTrackWork`, และ `DEVFLOW_CURRENT_RUN_DIR`
  - `packages/create-nexus-devflow/lib/history.ts`: ปรับ `preferred` list เป็น `["current-feature.md", "spec.md", "discovery.md", "report.md"]`
  - `.agents/skills/` & `.claude/skills/`: ปรับปรุงทุกสคิล (`test`, `report-html`, `idea`, `grill`, `brainstorm`) ให้ใช้ Canonical Commands ปัจจุบัน
  - `scripts/`: ปรับปรุงสคริปต์รายงาน HTML (`render-html.mjs`, `report-stage.mjs`, `generate-report-html.mjs`) และ unit/smoke tests ทั้งหมด
- **Verification Evidence**:
  - Global `grep_search` ได้ 0 hits สำหรับสเตจตัวเลข `\b(00|10|20|30|40|50|60|70)-[a-z]+`
  - Unit tests ใน `packages/create-nexus-devflow` ได้รับการปรับปรุงและผ่านเกณฑ์ Single Living Spec
- **Next Opportunities**: บำรุงรักษาความสะอาดของ Living Spec และ Multi-Run Spec Queue สำหรับฟีเจอร์ถัดไป
