---
id: "057-refresh-current-documentation"
title: "Refresh Current Documentation and Skill Inventory Contract"
doc_type: "spec"
category: "planning"
status: "in-progress"
created: "2026-08-25"
updated: "2026-08-25"
owner: "Codex"
source_workflow: "/feature"
related_task: "DISC-20260825-001"
related_files:
  - "agent-bundle.manifest.json"
  - "packages/create-nexus-devflow/scripts/prepare-template.ts"
  - "scripts/validate-framework.ts"
  - "scripts/smoke-package.ts"
  - "README.md"
  - "README.th.md"
  - "packages/create-nexus-devflow/README.md"
  - "docs/USAGE.md"
  - "docs/workflow-surface-map.md"
  - "docs/skill-selection-policy.md"
tags:
  - nexus-devflow
  - documentation
  - skill-inventory
aliases:
  - "refresh-current-documentation"
summary: "ซิงก์คู่มือกับ Nexus-DevFlow 2.5.0 ปัจจุบัน และสร้าง canonical Core Skill inventory ที่ป้องกัน local skills หลุดเข้า package template"
metadata_version: 1
stage: "current-feature"
source_discovery: "DISC-20260825-001"
source_idea: null
---

# 057-refresh-current-documentation: Refresh Current Documentation and Skill Inventory Contract #doc/spec

> **Template Type**: Single Living Spec (DevFlow 2.5.0)
> **Active Location**: `devflow/context/current-feature.md`
> **Archive Location**: `devflow/history/features/057-refresh-current-documentation.md`

- **Feature ID**: `057-refresh-current-documentation`
- **Category**: `features`
- **Target Branch**: `feature/057-refresh-current-documentation`
- **Status**: `Implemented / Ready for /check`
- **Track**: `Unified Fast-Track`
- **Discovery Ref**: `devflow/discoveries/DISC-20260825-001-refresh-current-documentation/discovery.md`
- **Size**: `M` — coherent documentation/inventory contract, reviewable as one feature

---

## 🎯 1. Define & Boundaries #section/scope

### Problem Statement & Goal

- **Problem**: คู่มือหลักได้รับการปรับเป็น 2.5.0 ในรอบ 056 แล้ว แต่ repository มี governance docs, metadata contract, Living Spec examples และแนวทาง `/check`/`debug`/deep-module review ใหม่ที่ยังไม่ถูกเชื่อมเข้ากับ entry-point guides ครบ นอกจากนี้ working tree มี 45 skill directories ขณะที่ Git track และ public docs ระบุ 28 Core Skills; `prepare-template.ts` คัดลอก adapter directory ทั้งชุด จึงอาจบรรจุ local/untracked skills ลง package โดยไม่ตั้งใจ.
- **Goal**: กำหนด Core Skill inventory จาก source เดียว, ทำให้ package template แจกเฉพาะ bundled skills ที่อนุมัติ, และซิงก์คู่มือ EN/TH กับ product behavior ปัจจุบันโดยรักษา historical records และ user-owned changes.

### In-Scope

- เพิ่ม canonical ordered list ของ **28 bundled Core Skills** ใน `agent-bundle.manifest.json`.
- สร้าง deep module ขนาดเล็กสำหรับอ่าน/ตรวจ inventory และตัดสินว่า skill path ใดเป็น bundled หรือ local.
- ปรับ `prepare-template.ts` ให้ copy เฉพาะ skills ที่อยู่ใน canonical inventory จากทั้ง `.agents` และ `.claude`.
- ปรับ static validation ให้ตรวจ manifest schema, duplicate/invalid names, core skill presence, adapter parity และแสดง local extras แยกจาก Core count.
- ปรับ package smoke proof ให้ยืนยัน installed template มี Core Skills ครบและไม่มี local skill หลุดเข้าไป.
- ซิงก์ `README.md`, `README.th.md`, package README, `docs/USAGE.md`, `docs/workflow-surface-map.md` และ `docs/skill-selection-policy.md`.
- เชื่อม entry-point guides ไปยัง governance rules, metadata contract, manual review spec และ Living Spec examples ในตำแหน่งที่เหมาะสม.
- อัปเดตคำอธิบาย `/check`, `/debug` และ deep-module standards เฉพาะ behavior ที่มีอยู่ใน working tree และได้รับการยืนยันด้วย diff.
- ตรวจ active guidance สำหรับ legacy Deep-Track references และติดป้าย historical/deprecated หรือลบเฉพาะจุดที่ทำให้เข้าใจว่าเป็น workflow ปัจจุบัน.

### Out-of-Scope

- ไม่ promote local/untracked skills 17 รายการเป็น public Core Skills.
- ไม่เปลี่ยนชื่อ, behavior หรือ public API ของ skills นอกเหนือจากการอธิบาย behavior ที่มีอยู่แล้ว.
- ไม่ rewrite `devflow/history/`, `CHANGELOG.md`, ADR หรือ research records เพื่อซ่อนวิวัฒนาการในอดีต.
- ไม่เปลี่ยน package version, lifecycle, CLI commands หรือ deployment behavior.
- ไม่แก้ไฟล์ user-owned ที่ค้างอยู่โดยนอกเหนือจากจุดเชื่อมเอกสารตาม spec และไม่ discard/revert การเปลี่ยนแปลงเดิม.
- ไม่สร้าง HTML report อัตโนมัติ.

### Risk & Mitigation Matrix

| Risk | Severity | Mitigation |
| :--- | :---: | :--- |
| Local skills หลุดเข้า npm template | High | ใช้ manifest allowlist ใน `prepare-template` และพิสูจน์จาก installed smoke workspace |
| Canonical list drift ระหว่างสอง adapters | High | Validator ตรวจ presence และ parity ของทุก core skill ใน `.agents`/`.claude` |
| Hardcoded count drift ในหลายเอกสาร | Medium | Validator derive count จาก manifest และตรวจข้อความ public docs ที่กำหนด |
| EN/TH content parity แตกต่างกัน | Medium | ตรวจ headings, command rows และ policy statements แบบคู่ขนาน |
| แก้ historical docs มากเกินไป | Medium | จำกัด semantic cleanup ที่ active guidance; history/ADR/research เป็น immutable evidence |
| ชนกับ working-tree changes เดิม | High | ใช้ diff เป็น baseline, patch เฉพาะส่วนที่อยู่ใน spec และตรวจ `git diff` รายไฟล์ก่อนจบแต่ละ task |
| เพิ่ม abstraction ใหญ่เกินปัญหา | Low | จำกัด deep module ให้มี API เล็กสำหรับ parse/validate/classify inventory เท่านั้น |

### Success Criteria

1. Canonical manifest ระบุ 28 Core Skills และเป็น source เดียวสำหรับ validation/package filtering.
2. Package template มี Core Skills ครบทั้งสอง adapters และไม่มี local skill ที่ไม่อยู่ใน manifest.
3. คู่มือ public/focused docs อธิบาย Core vs Local Skills, `/check`, `/debug`, governance และ metadata contract ตรงกันทั้ง EN/TH.
4. Active guidance ไม่มีข้อความที่ทำให้ Deep-Track ดูเป็น lifecycle ปัจจุบัน.
5. Verification ทุก lane ผ่านโดยไม่สูญเสีย working-tree changes ของผู้ใช้.

---

## 📐 2. Technical Spec & Contracts #section/contracts

### Architecture & Component Design

```text
agent-bundle.manifest.json
        │ core_skills[] (canonical ordered allowlist)
        ▼
core-skill-inventory deep module
        ├── validate-framework.ts  ── checks core presence/parity + doc count
        ├── prepare-template.ts    ── copies only allowlisted adapter skills
        └── smoke-package.ts       ── proves installed bundle contents
                                      │
                                      ▼
                            README / USAGE / surface map
```

หลัก deep-module: public interface ต้องเล็ก, การ parse/validation/classification อยู่ภายใน module เดียว และ callers ไม่ควรรู้ schema details มากเกินจำเป็น.

### Data Models & Schemas

```typescript
interface AgentBundleManifest {
  source_bundle: string;
  description: string;
  core_skills: string[];
  required_paths: string[];
  forbidden_legacy_paths: string[];
  commands: Record<string, string>;
}

interface CoreSkillInventory {
  readonly names: readonly string[];
  readonly nameSet: ReadonlySet<string>;
  readonly count: number;
}
```

Load-bearing invariants:

- `core_skills` ต้องไม่ว่าง, ไม่ซ้ำ และทุกชื่อเป็น `kebab-case`.
- ทุกชื่อใน `core_skills` ต้องมี `<adapter>/skills/<name>/SKILL.md` ใน `.agents` และ `.claude`.
- Directory ที่มีอยู่แต่ไม่อยู่ใน `core_skills` ถือเป็น `local`, ไม่ใช่ validation failure และไม่ถูก copy เข้า package template.
- ลำดับใน manifest เป็น canonical documentation order; consumers ห้าม sort ใหม่โดยไม่จำเป็น.

### API & Interface Contracts

- **Loader**: `loadCoreSkillInventory(manifestPath: string): CoreSkillInventory`
  - คืน inventory ที่ validated แล้ว.
  - โยน actionable error เมื่อ JSON/schema/name contract ไม่ถูกต้อง.
- **Classifier**: `isBundledSkillPath(relativePath: string, inventory: CoreSkillInventory): boolean`
  - รองรับ path separators ของ Windows/POSIX.
  - คืน `true` เฉพาะ path ใต้ `.agents/skills/<core-name>` หรือ `.claude/skills/<core-name>`.
- **Template filter behavior**:
  - non-skill entries ใช้ policy เดิม.
  - core skill entriesถูก copy.
  - local skill entriesถูก exclude โดย deterministic allowlist.
- **Documentation count contract**: ข้อความ `28 Core Skills` ใน public docs ต้องเท่ากับ `inventory.count`; ไม่ derive จากจำนวน directory ใน working tree.

### Non-Functional Constraints

- **Security**: ไม่ resolve path จาก manifest ออกนอก adapter roots; reject invalid skill names เช่น `../x`.
- **Performance**: อ่าน manifest ครั้งเดียวต่อ script execution; ไม่เพิ่ม subprocess ต่อ skill.
- **Cross-platform**: normalize `\` และ `/` ก่อน classify path.
- **Compatibility**: รักษา schema fields เดิมทั้งหมด และเพิ่ม `core_skills` แบบ explicit.
- **Documentation**: relative links ต้อง valid; EN/TH command names และ Core count ต้องเท่ากัน.

### Acceptance Criteria (AC)

- [ ] **AC-1 — Canonical inventory**: `agent-bundle.manifest.json` มี ordered `core_skills` จำนวน 28 รายการ ตรงกับ skills ที่ Git track และไม่มี duplicate/invalid name.
- [ ] **AC-2 — Adapter integrity**: Static validation ยืนยันว่า Core Skills ทั้ง 28 มี `SKILL.md` ครบใน `.agents` และ `.claude`; local extras ถูก report แยกและไม่เพิ่ม Core count.
- [ ] **AC-3 — Package isolation**: `prepare-template` และ package smoke proof ยืนยันว่า template/installed workspace มีเฉพาะ Core Skills ที่ allowlist ในทั้งสอง adapters แม้ source workspace มี local skills.
- [ ] **AC-4 — Public documentation parity**: `README.md`, `README.th.md` และ package README อธิบาย 28 bundled Core Skills เทียบกับ optional local skills และให้ข้อมูล workflow/commands ตรงกัน.
- [ ] **AC-5 — Focused documentation parity**: `docs/USAGE.md`, `docs/workflow-surface-map.md` และ `docs/skill-selection-policy.md` สะท้อน inventory, Dual-Axis `/check`, scientific `/debug`, deep-module review และลิงก์ governance/metadata/examples ที่เกี่ยวข้อง.
- [ ] **AC-6 — Historical integrity**: Active guidance ไม่เสนอ `10-define` ถึง `70-deliver` เป็น lifecycle ปัจจุบัน ขณะที่ history, ADR, research และ changelog ยังคงเนื้อหาเชิงประวัติศาสตร์ไว้.
- [ ] **AC-7 — Regression safety**: `npm run typecheck`, `npm test`, `npm run test:routing`, `npm run validate:docs`, `npm run check:static` และ `npm run test:package` ผ่านทั้งหมด.
- [ ] **AC-8 — User-change preservation**: Diff สุดท้ายรักษาการเปลี่ยนแปลงเดิมใน `check`, `debug`, coding standards และ local skill directories โดยไม่มีการลบหรือ overwrite นอก scope.

---

## 📋 3. Execution Plan & TDD Checklist #section/tasks

- [x] **Task 1: ล็อก canonical Core Skill inventory ด้วย deep module**
  - [x] 1.1 `[TDD-Red]` เพิ่ม focused tests สำหรับ manifest ที่ valid, missing `core_skills`, duplicate และ unsafe/non-kebab names แล้วรันให้เห็น expected failure.
  - [x] 1.2 `[TDD-Green]` เพิ่ม inventory module และ `core_skills` 28 รายการใน manifest ให้ focused tests ผ่าน.
  - [x] 1.3 `[TDD-Refactor]` ทำ interface ให้เล็ก, error messages actionable และ normalize Windows/POSIX paths โดย tests ยังเขียว.

- [x] **Task 2: ป้องกัน local skills หลุดเข้า package template**
  - [x] 2.1 `[TDD-Red]` เพิ่ม test fixture ที่มี core skill และ local extra แล้วพิสูจน์ว่า behavior เดิม copy local extra ผิด contract.
  - [x] 2.2 `[TDD-Green]` เชื่อม `prepare-template.ts` กับ canonical inventory เพื่อ copy เฉพาะ allowlisted skills ในสอง adapters.
  - [x] 2.3 `[TDD-Refactor]` รวม path classification ไว้ใน deep module และรักษา filter rules เดิมสำหรับ history/discovery/research.

- [x] **Task 3: เพิ่ม static และ package drift guards**
  - [x] 3.1 `[TDD-Red]` เพิ่ม assertions สำหรับ missing core skill, adapter mismatch, wrong documented count และ local-skill leakage.
  - [x] 3.2 `[TDD-Green]` ปรับ `validate-framework.ts` และ `smoke-package.ts` ให้ assertions ผ่านและรายงาน Core/Local count แยกกัน.
  - [x] 3.3 `[TDD-Refactor]` ลด logic ซ้ำและยืนยันว่า validator ไม่ fail เพียงเพราะผู้ใช้มี local extensions.

- [x] **Task 4: ซิงก์ public entry-point guides แบบ EN/TH parity**
  - [x] 4.1 บันทึก baseline sections/command rows ของ `README.md`, `README.th.md` และ package README.
  - [x] 4.2 อธิบาย Bundled Core Skills เทียบกับ Local/Personal Skills และเพิ่ม navigation ไป focused docs.
  - [x] 4.3 อัปเดต `/check`, `/debug`, deep-module review และ governance/metadata guidance แบบคู่ขนาน EN/TH.
  - [x] 4.4 ตรวจ relative links, heading anchors, command spelling และ section parity.

- [x] **Task 5: ซิงก์ focused documentation และ active legacy guidance**
  - [x] 5.1 ปรับ `docs/USAGE.md` และ `docs/workflow-surface-map.md` ให้ inventory/taxonomy มาจาก contract เดียวกัน.
  - [x] 5.2 ปรับ `docs/skill-selection-policy.md` ให้ routing ของ `/check`, `/debug` และ architecture review ตรงกับ skill behavior.
  - [x] 5.3 เพิ่ม cross-links ไป `docs/governance-rules.md`, `docs/markdown-metadata-contract.md`, `docs/manual-review-workflow-spec.md` และ `docs/examples/living-spec/` โดยไม่ทำ README ให้บวม.
  - [x] 5.4 ตรวจ active docs สำหรับ legacy stages; แก้เฉพาะ current guidance และเก็บ archival evidence.

- [x] **Task 6: Verification และ diff safety review**
  - [x] 6.1 รัน focused inventory/template tests และบันทึก Red/Green/Refactor evidence.
  - [x] 6.2 รัน `npm run typecheck`, `npm test`, `npm run test:routing`, `npm run validate:docs` และ `npm run check:static`.
  - [x] 6.3 รัน `npm run test:package` และตรวจ installed skill set ทั้ง `.agents`/`.claude` เทียบ manifest.
  - [x] 6.4 ตรวจ `git diff` แยก baseline user changes ออกจาก feature changes และยืนยันว่าไม่มีไฟล์เดิมถูกทิ้ง.

---

## ⚡ 4. Implementation Log & Evidence #section/evidence

*(อัปเดตระหว่าง `/implement`; ยังไม่มี production/documentation change จากขั้น `/feature`)*

- **Spec baseline**: Working tree มี user changes ใน `.agents/skills/check`, `.agents/skills/debug`, mirrored `.claude` files, `devflow/context/coding-standards.md` และ local skill directories 17 รายการต่อ adapter.
- **Branch**: `feature/057-refresh-current-documentation`.
- **Task 1 — RED**: เพิ่ม `core-skill-inventory.test.ts`; `npm exec -- tsx --test test/core-skill-inventory.test.ts` ล้มด้วย `ERR_MODULE_NOT_FOUND` ตามคาด เพราะ module ยังไม่มี.
- **Task 1 — GREEN**: เพิ่ม `core-skill-inventory.ts` และ `agent-bundle.manifest.json#core_skills`; focused test ผ่าน `2/2`.
- **Task 1 — REFACTOR**: ล็อก public interface เป็น `loadCoreSkillInventory` และ `isBundledSkillPath`, normalize path separators และ reject duplicate/unsafe names; `npm run typecheck` ผ่าน.
- **Task 2 — RED**: เพิ่ม template-entry policy test; focused test ล้มด้วย missing export `shouldIncludeTemplatePath` ตามคาด.
- **Task 2 — GREEN**: เชื่อม `prepare-template.ts` กับ manifest inventory; focused tests ผ่าน `3/3` และ package build ผ่าน.
- **Task 2 — REFACTOR**: รวม adapter path parsing ไว้ใน helper เดียว; `npm run typecheck` และ `git diff --check` ผ่าน.
- **Task 2 — Integration Proof**: `npm run prepare-template` สร้าง `.agents/skills` และ `.claude/skills` อย่างละ `28`; `template/**/skills/tdd` ไม่มีอยู่ทั้งสอง adapters.
- **Task 3 — RED**: เพิ่ม filesystem-backed tests สำหรับ missing core, adapter mismatch, local extras และ wrong/missing documented count; test ล้มจาก missing inspection exports ตามคาด.
- **Task 3 — GREEN**: เพิ่ม `inspectAdapterSkillInventory` และ `findCoreSkillCountDrift`; focused tests ผ่าน `5/5`, `npm run typecheck` ผ่าน.
- **Task 3 — Static Guard**: `npm run check:static` รายงาน Core `28`, local extensions `17` ต่อ adapter และ documentation count synchronized; command ผ่าน.
- **Task 3 — REFACTOR**: แก้ count regex หลังจับ section labels `6/4/18 Skills` เป็น false positives โดย require `Core Skills` หรือ `Workflow Skills`; focused/static checks กลับมาเขียว.
- **Task 3 — Package Proof**: การรันใน sandbox ครั้งแรกติด `EPERM` ที่ npm cache; rerun ด้วยสิทธิ์ที่อนุมัติแล้วผ่าน และ installed workspace มี `28 Core Skills per adapter` โดยไม่มี local leakage.
- **Task 4 — Public Guides**: อัปเดต `README.md`, `README.th.md` และ package README ให้แยก 28 Bundled Core Skills จาก Local/Personal Skills พร้อมอธิบาย Dual-Axis `/check`, scientific `/debug` และ Deep Modules.
- **Task 4 — Navigation**: เพิ่มลิงก์ไป usage, workflow map, skill selection, governance, metadata contract, manual review และ Living Spec examples; targets ภายใน repository มีอยู่จริงทั้งหมด.
- **Task 4 — Parity Proof**: Command table rows เท่ากัน `28/28` และ governance sections เท่ากัน `1/1` ระหว่าง EN/TH; `npm run validate:docs`, `npm run check:static` และ `git diff --check` ผ่าน.
- **Task 5 — Focused Docs**: อัปเดต `docs/USAGE.md`, `docs/workflow-surface-map.md` และ `docs/skill-selection-policy.md` ให้ใช้ canonical bundled inventory, Dual-Axis `/check`, six-phase `/debug`, Deep Modules และ cross-links ชุดเดียวกัน.
- **Task 5 — Source-of-Truth Alignment**: ปรับ `devflow/project-plan.md` จาก Dual-Track เป็น Single Living Spec และแก้ dashboard terminology ให้ตรงกับ product ปัจจุบัน.
- **Task 5 — Active Guidance Cleanup**: ลบ legacy stage routing จาก discovery skill ทั้งสอง adapters, `ai-interaction.md` และ `coding-standards.md`; เก็บ checked build-plan, history, ADR, research และ changelog เป็น historical evidence.
- **Task 5 — Proof**: Discovery skill SHA-256 mirror ตรงกัน; targeted active legacy scan คืนผลว่าง; `npm run test:routing` ผ่าน `112/112`, `validate:docs`, `check:static` และ `git diff --check` ผ่าน.
- **Task 6 — Full Test Suite**: `npm test` exit `0`; package test suite ผ่านและ overview tests ผ่าน `4/4`.
- **Task 6 — Verification Gates**: `npm run typecheck`, `npm run check`, `npm run test:routing` (`112/112`), `npm run validate:docs`, `npm run check:static` และ `git diff --check` ผ่าน.
- **Task 6 — Final Package Smoke**: Build/pack/install ลง temporary workspace ผ่าน; overlay สร้าง `89` files และยืนยัน `28 Core Skills per adapter` โดยไม่มี local extensions.
- **Task 6 — Independent Spec Review**: ไม่พบ confirmed finding; implementation ครบตาม scope, AC และ Out-of-Scope ของ Living Spec.
- **Task 6 — Independent Standards Review**: พบ Medium finding เรื่อง hard-coded `sync-upstream` exclusion; ลบข้อยกเว้นซ้ำซ้อนและเพิ่ม regression assertion ให้ canonical inventory เป็นผู้ตัดสินเพียงจุดเดียว จากนั้น focused tests, typecheck และ static contract ผ่านซ้ำ.
- **Task 6 — Diff Safety**: staged diff มีเฉพาะ 23 feature/baseline files; local skill directories 17 รายการต่อ adapter ยังเป็น untracked และไม่รวมใน commit. Baseline changes ของ `check`, `debug` และ coding standards ถูกเก็บและรวมโดยตั้งใจตาม spec.

---

## 🧪 5. Multi-Lane Verification Matrix #section/verification

### Stage 1: Spec Fidelity & Acceptance Criteria Gate

| AC | Verification target | Result | Proof |
| :--- | :--- | :---: | :--- |
| AC-1 | Manifest inventory schema/count/names | ⏳ PENDING | |
| AC-2 | `.agents`/`.claude` core presence and local classification | ⏳ PENDING | |
| AC-3 | Prepared template + installed package contents | ⏳ PENDING | |
| AC-4 | README EN/TH/package parity | ⏳ PENDING | |
| AC-5 | Focused docs and behavior descriptions | ⏳ PENDING | |
| AC-6 | Active legacy-reference audit | ⏳ PENDING | |
| AC-7 | Full command matrix | ⏳ PENDING | |
| AC-8 | User-owned diff preservation | ⏳ PENDING | |

### Stage 2: Technical Quality, Security & Architecture Gate

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :---: | :--- |
| **Focused TDD** | Inventory/template contract tests | ✅ PASS | 5/5 focused tests |
| **Typecheck** | `npm run typecheck` | ✅ PASS | Exit 0 |
| **Unit Tests** | `npm test` | ✅ PASS | Exit 0; overview 4/4 |
| **Routing Evals** | `npm run test:routing` | ✅ PASS | 112/112, 100% Rank 1 |
| **Documentation Contract** | `npm run validate:docs` | ✅ PASS | No contract drift |
| **Static Contract** | `npm run check:static` | ✅ PASS | Core 28; local 17 excluded per adapter |
| **Package Smoke** | `npm run test:package` | ✅ PASS | 89 files installed; 28 Core Skills per adapter |
| **Security & Architecture** | Path traversal, deep-module seam, 12 Fowler smells | ✅ PASS | Independent review completed; Medium canonical-inventory exception fixed and regression-covered |
| **Findings Ledger** | 0 open/fixed P0-P1 | ✅ PASS | No findings recorded |

---

## 📦 6. Release Digest & Retrospective #section/summary

*(สรุประหว่าง `/complete` หลัง implementation และ verification ผ่าน)*

- **What Changed**: Pending
- **Key Decisions**: 28 tracked skills remain the bundled Core surface; local skills are extensions unless explicitly promoted.
- **Lessons Learned**: Pending
- **Known Limitations**: Pending

---

## Spec Red-Team Notes #section/findings

การวิจารณ์ draft ทำให้ปรับสเปกดังนี้:

1. **ปิด packaging gap**: เพิ่ม package-template isolation เป็น acceptance criterion ไม่จำกัดงานแค่แก้ข้อความใน README เพราะ local skills สามารถหลุดเข้า tarball ได้จริง.
2. **ป้องกัน scope creep**: ตัดการ promote 17 local skills, การ bump version และการ rewrite historical records ออกจาก scope อย่างชัดเจน.
3. **ล็อก source of truth**: เปลี่ยนจากการนับ directory เป็น manifest allowlist เพื่อให้ working-tree extensions ไม่เปลี่ยน product count.
4. **เพิ่ม unhappy paths**: ครอบคลุม duplicate, unsafe name, missing core, adapter mismatch, wrong doc count และ local leakage.
5. **แยก reviewable steps**: แบ่ง inventory module, template filtering, validation, public docs และ focused docs ออกจากกัน เพื่อให้แต่ละ diff ตรวจได้ในหนึ่ง sitting.
6. **รักษางานเดิม**: ระบุ baseline user changes และ AC-8 เพื่อป้องกันการ overwrite งานที่มีอยู่ก่อน feature.
