# 📐 [051-unified-discovery-and-socratic-alignment-grill] รวม Unified Discovery Engine (/discovery), Companion Skill (/grill) และ Architecture Decision Records (ADRs)

> **Status**: Released  
> **Track**: Fast-Track (Blueprint Mode - Feature)  
> **Category**: Feature  
> **Branch**: `main`  
> **Created Date**: 2026-08-24  
> **Completed Date**: 2026-08-24  
> **Owner**: AI & Maintainer  

---

## 1. Specification & Scope
- **Problem Statement**:
  1. การเริ่มงานพัฒนาฟีเจอร์หรือการสำรวจสถาปัตยกรรมยังขาดกระบวนการ Socratic Alignment เพื่อเคลียร์ความคลุมเครือ, ตั้งชื่อ Domain Glossary และบันทึก Architecture Decision Records (ADRs) อย่างเป็นระเบียบ
  2. เดิมระบบมี 2 สกิลที่ซ้ำซ้อนกันคือ `discovery` (สำหรับการวางแผนโปรเจกต์) และ `00-explore` (สำหรับการสำรวจสเตจ 00 ใน Deep-Track) ทำให้ผู้ใช้และ AI เกิดความสับสน
- **In-Scope**:
  - **Socratic Alignment Companion Skill (`/grill` / `/align`)**:
    - สร้าง `.agents/skills/grill/SKILL.md` และ `.claude/skills/grill/SKILL.md`
    - สร้างโครงสร้าง `devflow/decisions/` และบันทึก ADRs รูปแบบ `ADR-xxx-{slug}.md`
    - บันทึกคำศัพท์โดเมนลงใน `devflow/context/glossary.md`
  - **Unified `/discovery` Dual-Mode Engine & 00-explore Removal**:
    - รวมความสามารถของ `00-explore` เข้าสู่ `/discovery` รองรับทั้ง Macro Project Planning และ Micro Feature Exploration (5 เลนส์: Brainstorm, Research, PRD, Bug Triage, Grill)
    - ลบโฟลเดอร์ `.agents/skills/00-explore/` และ `.claude/skills/00-explore/`
    - ปรับ Deep-Track Lifecycle เป็น `discovery ➔ 10-define ➔ 20-spec ➔ 30-plan ➔ 40-execute ➔ 50-verify ➔ 60-report ➔ 70-deliver`
    - รองรับการ Handoff ไปยัง Fast-Track (`/feature DISC-xxx` / `/fix DISC-xxx`) หรือ Deep-Track (`10-define DISC-xxx`)
    - อัปเดต CLI Engine, Core Manifests, Maintainer Scripts, Test Suites, และคู่มือเอกสารทั้งหมด
- **Acceptance Criteria**:
  - [x] AC-1: มีสกิล `/grill` และระบบ `devflow/decisions/` พร้อมรองรับ ADRs และ Glossary
  - [x] AC-2: สกิล `/discovery` รองรับ Dual-Mode และลบ `00-explore` ออกจาก adapter trees อย่างสมบูรณ์
  - [x] AC-3: CLI libraries และ Maintainer scripts ทำงานร่วมกับ `discovery` ได้ 100% พร้อม fallback รองรับ `00-explore.md` ย้อนหลัง
  - [x] AC-4: ยูนิตเทสต์ทั้งหมด (`npm test` 94 tests) และ Master Verification Gate (`npm run check`, `npm run check:static`) ผ่าน 100%
  - [x] AC-5: อัปเดตคู่มือเอกสารทุกฉบับใน repo ให้ตรงกับมาตรฐานใหม่

---

## 2. Plan & Test Strategy
- **Files Modified / Created**:
  - `.agents/skills/grill/SKILL.md`, `.claude/skills/grill/SKILL.md`
  - `.agents/skills/discovery/SKILL.md`, `.claude/skills/discovery/SKILL.md`
  - `.agents/skills/00-explore/`, `.claude/skills/00-explore/` (Deleted)
  - `.agents/skills/10-define/SKILL.md`, `brainstorm/SKILL.md`, `devflow/SKILL.md`, `feature/SKILL.md` (and `.claude/` mirrors)
  - `.nexus/nexus-devflow.json`
  - `packages/create-nexus-devflow/lib/` (`workflow-state.ts`, `discoveries.ts`, `command-catalog.ts`, `update.ts`, `ideas.ts`, `dashboard.ts`)
  - `packages/create-nexus-devflow/bin/create-nexus-devflow.ts`, `scripts/prepare-template.ts`
  - `packages/create-nexus-devflow/test/` (`workflow-state.test.ts`, `discoveries.test.ts`, `command-catalog.test.ts`)
  - `scripts/` (`validate-framework.ts`, `validate-framework.mjs`, `summarize-run-status.mjs`, `standardize-command-invocations.mjs`, `update-skill-descriptions.mjs`, `lib/upstream-monitor.ts`, `goal-runner.mjs`)
  - Documentation: `AGENTS.md`, `README.md`, `README.th.md`, `docs/` (`USAGE.md`, `quickstart.md`, `skill-selection-policy.md`, `workflow-surface-map.md`, `workspace-artifacts.md`, `team-presets.md`, `example-runs.md`, `manual-review-workflow-spec.md`), `CHANGELOG.md`
- **Test Decision**: `Required (TDD & Comprehensive Verification Gate)`

---

## 3. Implementation Progress
- [x] Step 1: สร้าง Companion Skill `/grill` และระบบจัดเก็บ `devflow/decisions/`
- [x] Step 2: รวมความสามารถของ `00-explore` เข้ากับ `/discovery` และลบ `00-explore/`
- [x] Step 3: อัปเดต CLI Engine และระบบ Fallback
- [x] Step 4: อัปเดต Manifests, Scripts, Evals, และ Tests
- [x] Step 5: ปรับปรุงคู่มือ เอกสารทั้งหมด และบันทึก Global Memory Decision #22 และ #23

---

## 4. Verification Evidence
- `npm test`: 94/94 tests passed cleanly (90 package tests + 4 overview generator tests)
- `npm run check:static`: Framework static validation passed for all 35 skills
- `npm run check`: Master Verification Gate passed 100% (Typecheck, Evals, Unit Tests, Packaging Smoke Test)

---

## 5. Retrospective & Lessons Learned
- การยุบรวมสกิลที่มีหน้าที่ซ้ำกัน เช่น `00-explore` กับ `discovery` ทำให้ระบบมีความ Lean และใช้งานง่ายขึ้นอย่างเห็นได้ชัด
- การออกแบบให้ `/discovery` เชื่อมต่อเข้าได้ทั้ง **Fast-Track** และ **Deep-Track** ช่วยปลดล็อคความยืดหยุ่น ทำให้ผู้ใช้สามารถสำรวจไอเดียก่อน แล้วตัดสินใจเลือก track ที่เหมาะสมกับขนาดของงานได้ทันที
