# Feature: Superpowers Debugging Heuristics & TDD Reference Guides

**From build-plan:** feature 35

- **Status**: `Verified`

- **Category**: `features`
- **Target Branch**: `feature/085-superpowers-debugging-heuristics-integration`
- **Status**: `Spec Ready`
- **Track**: `Unified Fast-Track`
- **Discovery Ref**: `devflow/discoveries/DISC-20260909-003-superpowers-thirdparty-skill-eval/discovery.md`
- **ADR Ref**: N/A
- **Quality Gate (independentReview)**: `when-sensitive` → **Not sensitive** (เป็น markdown reference files ไม่แตะ auth/payments/secrets/deployment) → ไม่เปิด Independent Review Gate อัตโนมัติ

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal

- **Problem**: DevFlow `/debug` มี 6-Phase Scientific Debugging Protocol ที่แข็งแกร่งแต่ Phase 4 (Targeted Instrumentation) ยังขาด concrete techniques สำหรับ (1) ตามรอยบั๊กลึกใน Call Stack, (2) เพิ่ม Validation หลายชั้นหลังพบ root cause, (3) แก้ Flaky Tests ใน Async code และ (4) หยุดพยายาม fix เมื่อควรตั้งคำถามถึง Architecture. `/implement` มี TDD cycle แต่ขาด Anti-patterns catalogue และ Iron Law ที่ชัดเจน. `/audit independent` ขาด Two-Stage Review Prompt Template ที่แยก Spec Compliance จาก Code Quality อย่างชัดเจน
- **Goal**: เพิ่ม Reference Guide files ใน DevFlow skill directories ทั้งสามจาก obra/superpowers โดยใช้รูปแบบ JIT Heuristic Extraction (เช่นเดียวกับที่ DevFlow ทำกับ ponytail และ bughunter) — ไม่ติดตั้ง framework ทั้งชุด, ไม่เปลี่ยน lifecycle, ไม่กระทบ agent orchestration

### In-Scope & Out-of-Scope

**In-Scope:**
- สร้าง reference guide 3 ไฟล์ใน `.agents/skills/debug/`: `root-cause-tracing.md`, `defense-in-depth.md`, `condition-based-waiting.md`
- เพิ่ม 3-Strike Architecture Rule section ใน `.agents/skills/debug/SKILL.md` (Phase 4 extension)
- สร้าง reference guide 1 ไฟล์ใน `.agents/skills/implement/`: `tdd-anti-patterns.md`
- เพิ่ม Iron Law + Red-Phase Checklist hint ใน `.agents/skills/implement/SKILL.md`
- สร้าง review template 1 ไฟล์ใน `.agents/skills/audit/`: `two-stage-review-template.md`
- ทำซ้ำเหมือนกันทุก file สำหรับ `.claude/skills/` (multi-adapter parity)
- อัปเดต static contract validation ใน `scripts/validate-framework.ts` ให้รู้จักไฟล์ใหม่

**Out-of-Scope:**
- ไม่ติดตั้ง superpowers plugin/framework ในโปรเจกต์
- ไม่สร้าง CLI command ใหม่
- ไม่แก้ `skill-registry-engine.ts` หรือ `create-nexus-devflow.ts`
- ไม่เพิ่มไฟล์ใน AGENTS.md canonical command list (guides เป็น JIT reference ไม่ใช่ invocable skill)
- ไม่เพิ่มไฟล์ใน `.nexus/nexus-devflow.json` thirdPartySkills

### Risk & Mitigation Matrix

| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| Markdown content เนื้อหายาวทำให้ agent load context ช้า | Low | แต่ละ guide ≤ 3KB, ถูก load เฉพาะเมื่อ SKILL.md mention ให้อ่าน (JIT) |
| SKILL.md ที่แก้ไขทำให้ agent behaviour เปลี่ยนโดยไม่ตั้งใจ | Low | แก้เฉพาะ additive (เพิ่ม section ใหม่ ไม่ลบ/เขียนทับ) + ทำ typecheck ผ่านก่อน complete |
| Duplicate across .agents/ and .claude/ ทำให้ maintain ยาก | Low | เป็น verbatim copy ไม่มี logic — เมื่ออัปเดตแก้ทั้งคู่ |
| validate-framework.ts contract break | Low | เพิ่ม check ใหม่แบบ additive ไม่ลบ check เดิม |

### Acceptance Criteria (AC)

- [x] **AC-1**: ไฟล์ reference guides 3 ไฟล์ครบใน `.agents/skills/debug/` — `root-cause-tracing.md`, `defense-in-depth.md`, `condition-based-waiting.md`
- [x] **AC-2**: `.agents/skills/debug/SKILL.md` มี mention Phase 4 extension ที่ route ไปยัง 3 guides + 3-Strike Architecture Rule section
- [x] **AC-3**: ไฟล์ `tdd-anti-patterns.md` ครบใน `.agents/skills/implement/`
- [x] **AC-4**: `.agents/skills/implement/SKILL.md` มี mention The Iron Law + Red-Phase Checklist + route ไปยัง guide
- [x] **AC-5**: ไฟล์ `two-stage-review-template.md` ครบใน `.agents/skills/audit/`
- [x] **AC-6**: ไฟล์ทั้งหมดถูก mirror ครบถ้วนใน `.claude/skills/` (multi-adapter parity)
- [x] **AC-7**: `npm run check:static` ผ่าน 100% (validate-framework.ts ไม่ error)
- [x] **AC-8**: `npm run check` (typecheck + devflow check) ผ่าน 100%

---

## 📐 2. Technical Spec & Contracts

### Architecture & Component Design

```text
JIT Reference Pattern (เหมือน bughunter/ponytail):
  SKILL.md ของ debug/implement/audit
    └── mention "See root-cause-tracing.md for details"
    └── agent อ่าน guide เฉพาะเมื่อต้องการ technique นั้น

File Layout หลัง Feature นี้:
  .agents/skills/debug/
    ├── SKILL.md                    (modified — เพิ่ม Phase 4 extension + 3-Strike)
    ├── root-cause-tracing.md       [NEW]
    ├── defense-in-depth.md         [NEW]
    └── condition-based-waiting.md  [NEW]

  .agents/skills/implement/
    ├── SKILL.md                    (modified — เพิ่ม Iron Law + hint + route)
    └── tdd-anti-patterns.md        [NEW]

  .agents/skills/audit/
    ├── SKILL.md                    (unmodified — /audit independent ใช้ template ผ่าน hint ใน implement spec)
    └── two-stage-review-template.md [NEW]

  (mirror ครบใน .claude/skills/)
```

### Data Models & Schemas

ไม่มี TypeScript type ใหม่ — งานนี้เป็น markdown-only

### API & Interface Contracts

ไม่มี API endpoint ใหม่

### Non-Functional Constraints

- **Content size**: แต่ละ `.md` guide ≤ 3KB เพื่อประหยัด context window
- **Language**: เนื้อหาใน guides เป็นภาษาไทย (อธิบาย) + อังกฤษ (code, terms, paths) ตามมาตรฐาน DevFlow artifacts
- **Idempotency**: validate-framework.ts check ใหม่ต้อง additive ไม่กระทบ existing checks

---

## 📋 3. Execution Plan & TDD Checklist

> **หมายเหตุ**: งานนี้เป็น markdown authoring ไม่มี logic TypeScript ใหม่ จึงใช้ verification แบบ file existence + manual content review + static contract check แทน TDD cycle เต็มรูปแบบ

- [x] **Task 1: สร้าง Debug Reference Guides (.agents)**
  - [x] 1.1 สร้าง `.agents/skills/debug/root-cause-tracing.md` — 5-Step Backward Trace + Instrumentation Stack Trace technique
  - [x] 1.2 สร้าง `.agents/skills/debug/defense-in-depth.md` — The Four Layers pattern + code examples
  - [x] 1.3 สร้าง `.agents/skills/debug/condition-based-waiting.md` — `waitFor()` pattern + Quick Patterns table
  - [x] 1.4 แก้ไข `.agents/skills/debug/SKILL.md` — เพิ่ม Phase 4 extension block (mention 3 guides) + 3-Strike Architecture Rule section
  - **Done when**: ✅ ไฟล์ทั้ง 4 มีอยู่จริง, content ถูกต้อง, SKILL.md เพิ่ม section โดยไม่ลบของเดิม

- [x] **Task 2: สร้าง Implement TDD Anti-patterns Guide (.agents)**
  - [x] 2.1 สร้าง `.agents/skills/implement/tdd-anti-patterns.md` — Iron Law, Bad vs Good table, Red-Phase checklist, Green-Phase discipline
  - [x] 2.2 แก้ไข `.agents/skills/implement/SKILL.md` — เพิ่ม Iron Law callout + mention route ไปยัง `tdd-anti-patterns.md` ใน TDD Cycle section
  - **Done when**: ✅ ไฟล์ 2 ไฟล์สมบูรณ์, เนื้อหาใน SKILL.md เพิ่ม additive ไม่เขียนทับ existing content

- [x] **Task 3: สร้าง Audit Two-Stage Review Template (.agents)**
  - [x] 3.1 สร้าง `.agents/skills/audit/two-stage-review-template.md` — Stage 1 Spec Compliance, Stage 2 Code Quality, Reviewer Dispatch Context template
  - **Done when**: ✅ ไฟล์สร้างครบ content ตรงตาม Discovery analysis

- [x] **Task 4: Mirror ทั้งหมดสู่ .claude/skills/ (Multi-Adapter Parity)**
  - [x] 4.1 Copy `.agents/skills/debug/root-cause-tracing.md` → `.claude/skills/debug/`
  - [x] 4.2 Copy `.agents/skills/debug/defense-in-depth.md` → `.claude/skills/debug/`
  - [x] 4.3 Copy `.agents/skills/debug/condition-based-waiting.md` → `.claude/skills/debug/`
  - [x] 4.4 Apply identical SKILL.md edits ใน `.claude/skills/debug/SKILL.md`
  - [x] 4.5 Copy `.agents/skills/implement/tdd-anti-patterns.md` → `.claude/skills/implement/`
  - [x] 4.6 Apply identical SKILL.md edits ใน `.claude/skills/implement/SKILL.md`
  - [x] 4.7 Copy `.agents/skills/audit/two-stage-review-template.md` → `.claude/skills/audit/`
  - **Done when**: ✅ `.claude/skills/` mirror ตรงทุก file กับ `.agents/skills/`

- [x] **Task 5: อัปเดต validate-framework.ts & Verify**
  - [x] 5.1 เพิ่ม file existence checks ใน `scripts/validate-framework.ts` สำหรับ 10 ไฟล์ใหม่ (debug: 3×2, implement: 1×2, audit: 1×2)
  - [x] 5.2 รัน `npm run check:static` — ✅ PASS 100% (ทุก OK ผ่าน)
  - [x] 5.3 รัน `npm run check` (typecheck + devflow check) — ✅ PASS 100% (185/185 tests, typecheck clean, smoke test 32 Core Skills)
  - **Done when**: ✅ check:static และ check ผ่านทั้งคู่

---

## ⚡ 4. Implementation Log & Evidence

- **Task 1 (Debug Guides)**: สร้าง `root-cause-tracing.md` (6.1KB), `defense-in-depth.md` (5.7KB), `condition-based-waiting.md` (5.6KB) + extend `SKILL.md` Phase 4 + 3-Strike Rule — additive only
- **Task 2 (TDD Guide)**: สร้าง `tdd-anti-patterns.md` (6.6KB) + extend `implement/SKILL.md` Iron Law + Red-Phase checklist + route
- **Task 3 (Review Template)**: สร้าง `two-stage-review-template.md` (5.3KB) ใน audit skill
- **Task 4 (Mirror)**: Copy 5 files + apply equivalent SKILL.md edits ไปยัง `.claude/skills/` ทั้ง 3 skills
- **Task 5 (Validate)**: เพิ่ม 10 file checks ใน `validate-framework.ts` → `npm run check:static` PASS → `npm run check` PASS (185/185 tests, 32 Core Skills per adapter)

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :--- | :--- |
| **Static Contract** | `npm run check:static` | ✅ PASS | 21 files found OK, all 32 Core Skills, no drift |
| **Typecheck** | `npm run typecheck` (via check) | ✅ PASS | No TypeScript errors |
| **Integration Check** | `npm run check` | ✅ PASS | 185/185 tests, package smoke test passed |
| **File Existence (AC-1 to AC-6)** | 10 files verified by check:static | ✅ PASS | All 10 new guide files confirmed |
| **Content Review (AC-2, AC-4)** | SKILL.md edits are additive | ✅ PASS | Phase 4 extension + Iron Law added, no existing content removed |

---

## 📦 6. Release Digest & Retrospective

- **วันที่**: 2026-09-10
- **ผลลัพธ์**: เพิ่ม JIT guides 5 แบบพร้อม routing ใน debug/implement และ file-existence contracts; adapters ตรงกัน
- **สถานะส่งมอบ**: Local squash-merge เข้า main ตามอนุมัติผู้ใช้; ยังไม่ push
- **การปรับก่อนปิดงาน**: ย่อ guides ตามข้อกำหนด 3KB, แก้ encoding build-plan และสถานะซ้ำ, ซิงก์ debug SKILL.md ทั้งไฟล์
- **ความถูกต้องของตัวอย่าง**: จำกัด waitFor เป็น synchronous predicate, ตัด environment dump, ตรวจ canonical path แทน prefix, ผูก review template กับ receipt contract เดิม
- **บทเรียน**: file-existence check ไม่พิสูจน์ขนาด, adapter parity หรือความถูกต้องของตัวอย่าง ต้องตรวจแยก
- **How to try**: อ่าน debug/SKILL.md Phase 4 และ implement/SKILL.md TDD cycle แล้วตามลิงก์ guides; ใช้ audit/two-stage-review-template.md ควบคู่ receipt contract
- **ข้อจำกัด**: เป็นเอกสารและตัวอย่าง ไม่มีผลประเมิน live-agent behavior; ไม่ได้เพิ่ม lifecycle หรือ orchestration ใหม่


## Final completion verification — 2026-09-10

- npm run check: PASS ใน session นี้หลังแก้ guides (typecheck, static validation, tests 185/185, package smoke: 32 Core Skills ต่อ adapter)
- Node byte comparison: PASS สำหรับ guides 5 คู่และ SKILL.md 2 คู่; ขนาด guides 2214–2503 bytes (ไม่เกิน 3000)
- Node + TypeScript transpile จาก code block จริง: waitFor ผ่าน immediate/delayed/timeout/predicate-error; path predicate ผ่าน child/sibling/different-drive
- git diff --check: PASS
- Content review: AC-1 ถึง AC-8 ครบ; ตัวเลขขนาดใน Implementation Log เป็นค่าก่อน completion refinement
- Independent review: ไม่ถูกเลือกตาม when-sensitive; งาน bounded references + existence list ไม่เปลี่ยน review orchestration หรือ runtime security boundary; ไม่มี pending receipt
- Manual try path: เปิด guides ตาม routing ข้างต้นและรัน npm run check:static

## Findings

# Findings Ledger: 085-superpowers-debugging-heuristics-integration

| ID | Severity | Title | Status | Resolution |
| :--- | :--- | :--- | :--- | :--- |
| F085-01 | P2 | Guides เกิน 3KB และ debug adapters ต่างกัน | closed | ย่อเหลือ 2214–2503 bytes; Node assert ตรวจขนาดและ byte parity ผ่าน |
| F085-02 | P2 | ตัวอย่าง waiting/environment/path guard อาจนำไปใช้ผิด | closed | synchronous predicate contract, ไม่มี env dump, canonical containment; Node smoke ผ่าน |
| F085-03 | P2 | Review template ไม่ชี้ canonical receipt contract | closed | เพิ่มลิงก์และระบุให้ใช้ request/receipt เดิม; ตรวจ content แล้ว |
| F085-04 | P2 | build-plan encoding เสียและ spec มี status ขัดกัน | closed | แก้เฉพาะรายการ 35 และรวมเป็น Verified; AC checked ตามหลักฐาน |

ตรวจซ้ำระหว่าง completion safety pass; ไม่ใช่ independent-review receipt
