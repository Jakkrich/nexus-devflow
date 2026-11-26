# Feature: Seamless `pstack` Detection, Playbook Namespace Isolation & Coordinator Precedence

**From build-plan:** feature 132
**Build attempt:** 1
**Status:** verified

> **Status**: verified  
> **Track**: Fast-Track (Task-Isolated Living Spec Mode - Feature)  
> **Category**: Feature (Tracer Bullet)  
> **Source**: `devflow/build-plan.md: Feature 132`  
> **ADR**: `devflow/decisions/ADR-001-devflow-v3-pstack-architecture.md`  
> **Branch**: `feat/devflow-v3-pstack-rework`  
> **Started Date**: 2026-11-27  
> **Delivered Date**: TBD  
> **Owner**: DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement
จากการตรวจสอบการทำงานร่วมกันระหว่าง DevFlow v3 กับปลั๊กอิน `pstack` พบช่องโหว่ 4 จุดที่ทำให้ `execution.engine: "auto"` ตรวจไม่เจอหรือเกิดการชนกันได้ในเครื่องผู้ใช้จริง:
1. `detectPstackSkillPath` ใน `doctor.ts` และ `platform-adapters.md` ยังตรวจจับเฉพาะ path แบบเก่า ไม่ครอบคลุม on-project `.agents/plugins/pstack`, `open-pstack` staging (`~/.local/share/open-pstack/pstack`, `$XDG_DATA_HOME`, `%LOCALAPPDATA%`), plugin cache ที่มีเวอร์ชันของ Claude Code / Codex / Copilot และ in-session `<skills>` catalog
2. `devflow-mode/scripts/check-playbooks.mjs` อ่าน `.agents/playbooks/` และ `~/.agents/playbooks/` ที่ใช้ร่วมกับ `poteto-mode` โดยตรง ทำให้ custom playbook ที่ขยาย `pstack` (เช่น `shipping`, `babysit`, หรือ `pstack:feature`) พังเมื่อรันตัวตรวจของ DevFlow
3. `/onboard` เมื่อเรียกใช้ `pstack:create-verification-skill` ยังไม่ได้บังคับ H2 headings ทั้ง 5 หัวข้อ (`## Launch`, `## Doctor`, `## Drive`, `## Evidence`, `## Cleanup`) และยังไม่ได้บังคับ sync `.agents/skills/verify/` <-> `.claude/skills/verify/` ให้ครบทั้งสอง adapter
4. ยังไม่มีคำแนะนำชัดเจนเรื่อง single-Coordinator precedence และ `session hook: off` / `PSTACK_SESSION_HOOK=off` เพื่อกัน `pstack` `SessionStart` hook แย่งเป็น Coordinator จาก `/devflow-mode`

### 1.2 In-Scope
1. ขยาย `detectPstackSkillPath` ใน `packages/create-nexus-devflow/lib/doctor.ts` (รองรับ `homeDir`/`env` injection สำหรับเทสต์, non-symlink verification และ bounded numeric semver cache scan) พร้อมอัปเดต `platform-adapters.md` และ `devflow-help`
2. เพิ่มการรองรับ `devflow/playbooks/*.md` เป็น namespace เฉพาะของ DevFlow (พร้อมกันไม่ให้หลุดเข้า `prepare-template.ts`) และกรอง playbooks ของ `poteto-mode`/`pstack` ใน `.agents/playbooks/` และ `~/.agents/playbooks/` ภายใน `devflow-mode/scripts/check-playbooks.mjs`
3. กำกับใน `.agents/skills/onboard/SKILL.md` และ `reference/brownfield.md` ให้บังคับ 5 H2 headings, บันทึกหลักฐานใน `devflow/reports/{run-id}/` และ sync `.agents/skills/verify/` <-> `.claude/skills/verify/` หลังเรียก `create-verification-skill`
4. ระบุหลัก Coordinator เดียว (DevFlow `/devflow-mode` + 3-Pillars เป็น Lead Coordinator และ `pstack` เป็น leaf skills) พร้อมคำแนะนำ `session hook: off` / `PSTACK_SESSION_HOOK=off` ใน `platform-adapters.md`, `devflow-help`, `AGENTS.md`, `devflow/workflow.md`, และข้อความ `doctor.ts`

### 1.3 Out-of-Scope
- ห้ามแก้ไขไฟล์ใดๆ ภายใน `.agents/plugins/pstack/`
- ห้ามทำ `git commit`, `git merge`, หรือ `git push` โดยพลการ (หยุดที่ Option A Final Delivery Gate)

### 1.4 Acceptance Criteria
- [x] **AC-1 (Real-World `pstack` Detection)**: `doctor.ts` ตรวจพบ `poteto-mode/SKILL.md` จาก `.agents/plugins/pstack`, `open-pstack` staging, Claude/Codex/Copilot versioned plugin caches (เลือก stable semver สูงสุดและปฏิเสธ symlink ทุกชั้น) พร้อมคงพฤติกรรม `pstackProbePaths` เดิมทุกประการ และ `platform-adapters.md` อธิบาย in-session `<skills>` + path ทั้งหมดตรงกัน
- [x] **AC-2 (Playbook Namespace Isolation)**: `check-playbooks.mjs` ตรวจ `devflow/playbooks/*.md` แบบเข้มงวด, ข้าม `pstack`/`poteto-mode` extensions ใน `.agents/playbooks/` และ `~/.agents/playbooks/` (รวมที่อยู่ใน plugin caches) โดยไม่เกิด false error, และยังคงปฏิเสธ `extends: nonexistent` หรือ anchor ที่พังใน DevFlow playbooks; `prepare-template.ts` ไม่คัดลอก `devflow/playbooks/` เข้า template
- [x] **AC-3 (`onboard` `verify` H2 & Sync Guardrail)**: `onboard/SKILL.md` และ `brownfield.md` บังคับ 5 H2 headings (`## Launch`, `## Doctor`, `## Drive`, `## Evidence`, `## Cleanup`), proof path `devflow/reports/{run-id}/`, และการ sync `.agents/skills/verify/` <-> `.claude/skills/verify/`
- [x] **AC-4 (Coordinator Precedence & `session hook: off`)**: `platform-adapters.md`, `devflow-help`, `AGENTS.md` (`<= 8,000 bytes`), `devflow/workflow.md`, และ `doctor.ts` มีแนวทาง Coordinator เดียว + `session hook: off` / `PSTACK_SESSION_HOOK=off` ชัดเจน
- [x] **AC-5 (Full Gates & Independent Review)**: `verify-layers`, `npm test`, `npm run check`, `npm run check:release`, `npm run validate:docs`, live CLI `doctor` (`17 passed, 0 warnings, 0 failed`), และการตรวจจาก Independent Reviewer ผ่าน 100% พร้อมปิด `P2`/`P3` ทั้งหมด

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `devflow/build-plan.md`, `devflow/context/project-overview.md`, `devflow/context/132-pstack-integration-hardening/*` `[MODIFY/NEW]`
- `packages/create-nexus-devflow/lib/doctor.ts` & `packages/create-nexus-devflow/test/doctor.test.ts` `[MODIFY]`
- `packages/create-nexus-devflow/scripts/prepare-template.ts` & `packages/create-nexus-devflow/test/prepare-template.test.ts` `[MODIFY]`
- `.agents/skills/devflow-mode/scripts/check-playbooks.mjs` & `check-playbooks.d.mts` & `scripts/test/check-playbooks.test.ts` `[MODIFY]`
- `.agents/skills/devflow-mode/SKILL.md` & `.agents/skills/devflow-mode/reference/platform-adapters.md` `[MODIFY]`
- `.agents/skills/onboard/SKILL.md` & `.agents/skills/onboard/reference/brownfield.md` `[MODIFY]`
- `.agents/skills/devflow-help/SKILL.md` & `.agents/skills/devflow-help/reference/doctor.md` `[MODIFY]`
- `AGENTS.md`, `devflow/workflow.md`, `scripts/test/skill-hygiene.test.ts`, `.claude/skills/*` (via `npm run sync:adapters`) `[MODIFY]`

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `when-sensitive` -> **Active** (แก้ไข `prepare-template.ts`, `doctor.ts`, `AGENTS.md`, และ Core Skills ที่ส่งมอบในแพ็กเกจ npm)
- **UI Evidence / Browser Tests**: Not applicable (CLI, file-system detection, playbook validator, และ skill contracts)
- **Review Strategy**: Strict TDD + live CLI proof under `devflow/reports/132-pstack-integration-hardening/` + Independent Reviewer Subagent

### 2.3 Test Decision: Required (TDD)
- **Rationale**: แก้ไขตรรกะตรวจจับ path ข้ามแพลตฟอร์ม, symlink safety, semver sorting, และ playbook namespace parsing ซึ่งต้องมี regression tests ยืนยันก่อนและหลังแก้

---

## 3. Implementation Checklist (Strict TDD)

- [x] **Task 1: `[TDD-Red]` เขียน failing regression tests สำหรับทั้ง 4 จุด**
  - [x] 1.1 เพิ่ม tests ใน `packages/create-nexus-devflow/test/doctor.test.ts` (on-project, `open-pstack`, Claude/Codex/Copilot versioned caches, stable vs prerelease semver, symlink refusal)
  - [x] 1.2 เพิ่ม tests ใน `scripts/test/check-playbooks.test.ts` (`devflow/playbooks/` strict, `.agents/playbooks/` filtering for `pstack`/`poteto-mode` stems, anchors & cached playbooks)
  - [x] 1.3 เพิ่ม contract tests ใน `scripts/test/skill-hygiene.test.ts` และ `prepare-template.test.ts` และยืนยันสถานะ Red ก่อนแก้โค้ด

- [x] **Task 2: `[TDD-Green]` พัฒนา `doctor.ts`, `check-playbooks.mjs`, `prepare-template.ts` และอัปเดต Skills/Docs**
  - [x] 2.1 อัปเดต `packages/create-nexus-devflow/lib/doctor.ts` และ `packages/create-nexus-devflow/scripts/prepare-template.ts`
  - [x] 2.2 อัปเดต `.agents/skills/devflow-mode/scripts/check-playbooks.mjs` และ `check-playbooks.d.mts`
  - [x] 2.3 อัปเดต `platform-adapters.md`, `devflow-mode/SKILL.md`, `onboard/SKILL.md`, `onboard/reference/brownfield.md`, `devflow-help/SKILL.md`, `devflow-help/reference/doctor.md`, `AGENTS.md`, `devflow/workflow.md` และรัน `npm run sync:adapters`

- [x] **Task 3: `[TDD-Refactor]` & Verification Gates + Independent Review**
  - [x] 3.1 รัน `verify-layers`, `npm test`, `npm run check`, `npm run check:release`, `npm run validate:docs`, และเก็บ live CLI proof (`doctor.txt`, `check-playbooks.txt`, `check-gate.json`) ใน `devflow/reports/132-pstack-integration-hardening/`
  - [x] 3.2 ส่ง Independent Reviewer Subagent (`5441ae4a-ab02-4607-ba63-7094a4103954`) ตรวจ diff (`PASS`) และแก้ไขปิด findings `S-001`, `Q-001`, `Q-002`, `T-001` ทั้งหมด
  - [x] 3.3 อัปเดต `AI_HANDOFF.md` และ `.context/cos-board.md` และหยุดที่ Option A Final Human Delivery Gate

---

## 4. Verification Evidence Matrix

### Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: `npm run typecheck` (`tsc --noEmit`) & `packages/create-nexus-devflow` build — **PASSED**
- **Automated Test Matrix**: `npm test` & `verify-layers` — **PASSED**
- **Static Contract Verification**: `npm run check:static` + `npm run validate:docs` — **PASSED**
- **Package Smoke Test**: `npm run check` (`smoke-package.ts`) & `npm run check:release` — **PASSED**
- **Findings Ledger**: `devflow/context/132-pstack-integration-hardening/findings.md` — 0 open blockers (`S-001`, `Q-001`, `Q-002`, `T-001` all `closed`)

### Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [x] **AC-1**: Verified by `doctor.test.ts` (`case-a`..`case-g`) and live `doctor` detecting `.agents/plugins/pstack/skills/poteto-mode/SKILL.md`
- [x] **AC-2**: Verified by `check-playbooks.test.ts` (5 tests) and `prepare-template.test.ts` (`devflow/playbooks/` exclusion)
- [x] **AC-3**: Verified by `skill-hygiene.test.ts` across `onboard/SKILL.md` and `onboard/reference/brownfield.md` (and `.claude/` mirror)
- [x] **AC-4**: Verified across `platform-adapters.md`, `devflow-help`, `AGENTS.md` (`6,893 <= 8,000 bytes`), `devflow/workflow.md`, and `doctor.txt`
- [x] **AC-5**: Verified by `verify-layers`, `npm test`, `npm run check`, `npm run check:release`, `npm run validate:docs`, live CLI proofs, and Independent Reviewer (`PASS`)

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: 2026-11-27 (Option A Final Delivery Gate)
- **Verification Verdict**: `PASS` (Independent Reviewer `research` subagent `5441ae4a-ab02-4607-ba63-7094a4103954`, plus follow-up fix & full re-verification for `S-001`, `Q-001`, `Q-002`, `T-001`)
- **Proof Artifacts**: `devflow/reports/132-pstack-integration-hardening/{verify-layers.json,doctor.txt,check-playbooks.txt,check-gate.json}`
