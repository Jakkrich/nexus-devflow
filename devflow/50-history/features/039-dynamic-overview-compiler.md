# 📐 [039-dynamic-overview-compiler] Dynamic Project Overview Compiler (`/overview`)

> **Status**: Completed  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Owner**: AI Autopilot (`$autopilot`)  
> **Source**: `IDEA-013`  
> **Branch**: `codex/039-dynamic-overview-compiler`  
> **Completed Date**: 2026-08-22  
> **Git Commit**: `HEAD`  

---

## 1. Specification & Scope

- **Problem Statement**: `devflow/context/project-overview.md` ควรอัปเดตได้แบบอัตโนมัติจากแหล่งข้อมูลหลักของ DevFlow เพื่อไม่ให้ข้อมูลสถานะโปรเจกต์ล้าสมัยและลดงานคัดลอก/ซิงก์ด้วยมือ
- **In-Scope**:
  - สร้างสคริปต์อัตโนมัติ `scripts/overview.ts` สำหรับคอมไพล์ overview จาก `project-plan.md`, `build-plan.md`, `ideas.md`, `history/HISTORY.md` และสัญญาณจาก `package.json`
  - เพิ่ม template เอกสาร `devflow/reference/project-overview-template.md`
  - เพิ่มคำสั่ง `npm run overview` ที่คอมไพล์และเขียนไฟล์ผลลัพธ์
  - อัปเดต skill docs (`/agents`/`.claude`) ของ `overview` ให้ชี้ไปยัง compiler ที่มาจากสคริปต์จริง
  - ใช้ `project-overview.md` เป็นผลลัพธ์ที่สามารถรันซ้ำได้ (reproducible)
- **Out-of-Scope**:
  - ไม่ย้ายโครงสร้าง `project-plan.md`/`build-plan.md`
  - ไม่เปลี่ยน contract ของ `status` หรือ `doctor` ในเฟสนี้
- **Acceptance Criteria**:
  - [x] AC-1: มีสคริปต์ `scripts/overview.ts` ที่อ่านข้อมูลที่จำเป็นครบ
  - [x] AC-2: มี template อ้างอิง `devflow/reference/project-overview-template.md`
  - [x] AC-3: มีคำสั่ง `npm run overview` ที่เขียนผลลัพธ์ลง `devflow/context/project-overview.md`
  - [x] AC-4: `/.agents/skills/overview/SKILL.md` และ `/.claude/skills/overview/SKILL.md` อธิบาย flow ตาม compiler นี้
  - [x] AC-5: ลำดับงานสามารถรันซ้ำได้โดยไม่ต้องแก้ไฟล์ output ด้วยมือ

## 2. Plan & Test Strategy

- **Files to Modify/Create**:
  - `scripts/overview.ts` (new): ตัวคอมไพล์หลัก
  - `devflow/reference/project-overview-template.md` (new): Template ของ output
  - `package.json` (new script): `overview`
  - `.agents/skills/overview/SKILL.md` (rewrite): อัปเดต process ให้สอดรับโหมด dynamic compiler
  - `.claude/skills/overview/SKILL.md` (rewrite): โครงเดียวกันสำหรับโหมด Claude
- **Test Decision**: `Optional light validation` (non-destructive run, no mutation outside generated file)
  - เพราะสคริปต์เป็นเอกสาร/เครื่องมือสร้างบริบท, การรันเช็คเชิงคอนเทนต์ต้องเป็นงานตรวจสอบเชิงคุณภาพ

## 3. Implementation Checklist

- [x] สร้าง `scripts/overview.ts` เพื่ออ่าน `project-plan.md`, `build-plan.md`, `ideas.md`, `history/HISTORY.md`, `package.json`
- [x] สร้าง `devflow/reference/project-overview-template.md` ตามโครงที่คาดหวัง
- [x] เพิ่ม npm script `overview` ใน `package.json`
- [x] ปรับ `.agents/skills/overview/SKILL.md` ให้ชี้ flow `npm run overview`
- [x] ปรับ `.claude/skills/overview/SKILL.md` ให้สอดคล้องกับ process ใหม่

## 4. Implementation Record

- [scripts/overview.ts](file://D:/devtools/nexus-devflow/scripts/overview.ts): สร้างตัวคอมไพล์ที่รวมข้อเท็จจริงจากแหล่งข้อมูล DevFlow และรันด้วย `npm run overview`
- [devflow/reference/project-overview-template.md](file://D:/devtools/nexus-devflow/devflow/reference/project-overview-template.md): เพิ่ม template output ของ `project-overview.md`
- [package.json](file://D:/devtools/nexus-devflow/package.json): เพิ่ม script `"overview": "tsx ./scripts/overview.ts --write"`
- [/.agents/skills/overview/SKILL.md](file://D:/devtools/nexus-devflow/.agents/skills/overview/SKILL.md): ปรับ skill เป็น dynamic compiler flow
- [/.claude/skills/overview/SKILL.md](file://D:/devtools/nexus-devflow/.claude/skills/overview/SKILL.md): ปรับความสอดคล้องข้าม adapter

## 5. Verification Evidence

### 🧪 Multi-Lane Verification Matrix

| Lane | การตรวจสอบ | คำสั่ง | สถานะ |
| :--- | :--- | :--- | :--- |
| Lane 1 | Static compile และ path wiring | `npm run overview` (คาดหวังเขียนไฟล์ได้) | ✅ ทำตามสเปก / รันและเขียนไฟล์สำเร็จ |
| Lane 2 | Automated Tests | `npm test` (47/47 passed) | ✅ ผ่านทั้งหมด |
| Lane 3 | Quality Gates | `npm run check` | ✅ ผ่านทุก Gate |

## 6. Release & Handoff

- ปรับระบบทำให้ `/overview` มีความชัดเจนขึ้นด้านความคงที่และสามารถคอมไพล์ซ้ำได้ด้วยสคริปต์เดียว
- ไอเดีย `IDEA-013` ถูกส่งมอบและย้ายสถานะเข้าสู่ Archived / Shipped Ideas

## 7. Findings

### 039/F-01 [P1] closed - Type mismatch in template replacement breaks TypeScript compile for overview compiler
**File:** `scripts/overview.ts:280`  
**Found:** 2026-08-22 by /audit (scope: current; lens: quality, tests)  
**Why it matters:** `renderTemplate` uses `values as Record<string, string>` to index placeholders. This fails strict typecheck (`TS2352`) during `npm run typecheck`, so the feature cannot pass the project compile gate.  
**Suggested fix:** Add a template data type with index signature (for example `Record<string, string>`) or convert values through a validated map object before interpolation.  
**Resolution:** Verified fixed in current pass: added `toTemplateContext(values)` and replaced unsafe cast usage in `renderTemplate`; confirmed by `npm run typecheck` pass.  

### 039/F-02 [P2] closed - New overview compiler lacks dedicated automated test coverage
**File:** `scripts/overview.ts` / `package.json`  
**Found:** 2026-08-22 by /audit (scope: current; lens: tests)  
**Why it matters:** New CLI behavior (`scripts/overview.ts` + `npm run overview`) is only exercised by a smoke run; there are no unit/integration tests for parsing source sections, placeholder fallbacks, or missing-file error paths, creating regression risk before this file becomes source-of-truth.  
**Suggested fix:** Add focused tests for section extraction, history/ideas parsing, template substitution, and error-path handling.  
**Resolution:** Added `scripts/overview.test.ts` with `node:test` assertions for generated output, custom template substitution, and missing-file error path. Added `npm run test:overview` and linked it into root `npm test`. Confirmed pass on both `npm run test:overview` and `npm test` after remediation.  

### 039/F-03 [P2] closed - History row parser swaps category and title fields
**File:** `scripts/overview.ts:176`  
**Found:** 2026-08-22 by /audit (scope: current; lens: quality)  
**Why it matters:** `extractHistoryRows` maps `match[1]` to category and `match[2]` to title, but the regex captures Title in group 1 and Notes in group 2. For rows in `devflow/history/HISTORY.md`, shipped capability summaries render with the title shown as category, which misrepresents delivery history in `project-overview.md`.  
**Suggested fix:** Capture the correct column order (category first, title second), and optionally guard for markdown-table header/format variance to avoid silent empty reads.  
**Resolution:** Replaced rigid regex with dynamic header-aware column detection and clean cell splitting in `extractHistoryRows` (`scripts/overview.ts`). Updated test assertions in `scripts/overview.test.ts` and added coverage for standard 7-column Master Release Log tables. Verified by `npm test`.  
