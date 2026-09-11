# Feature: 088-decade-numbered-folder-architecture

> **Document Type**: Completed Delivery Archive  
> **Running ID**: `088`  
> **Slug**: `088-decade-numbered-folder-architecture`  
> **Title**: Decade-Numbered Folder Architecture, Legacy Path Resolver & Structure Migration Engine  
> **Branch**: `feature/088-decade-numbered-folder-architecture`  
> **Completed At**: 2026-09-11  
> **Status**: `Released`

---

## 🎯 1. Problem Statement & Scope

### Problem:
โครงสร้างโฟลเดอร์ใน `devflow/` เดิมมีโฟลเดอร์กระจัดกระจายอยู่ที่ Root มากกว่า 12 โฟลเดอร์ (รวมถึง `runs/` ที่เป็น legacy v1.x) ทำให้ผู้ใช้งานและ AI Agent สับสนลำดับขั้นตอนการทำงาน (Workflow Lifecycle) อีกทั้งไม่มีตัวเลขกำกับลำดับสายตาใน IDE 

### Target Solution:
1. ปรับสถาปัตยกรรมโฟลเดอร์เป็น **Decade-Numbered Stages Structure**:
   - `00-context/` : Global Living Source of Truth (`project-overview.md`, `standards`, `glossary`)
   - `10-ideation/` : Input & Reference Ingestion (`ideas.md`, `inbox/`, `reference/`)
   - `20-discovery/` : Exploration & Architecture (`analysis/`, `discoveries/`, `decisions/`, `research/`) พร้อมรองรับ `21-prototype/`, `22-diagrams/`
   - `30-planning/` : Master Plans (`project-plan.md`, `build-plan.md`)
   - `40-tasks/` : Active Living Spec Workspaces (`{xxx-slug}/`)
   - `50-history/` : Shipped & Delivered Archives (`features/`, `fixes/`, `rollbacks/`, `HISTORY.md`)
   - `60-docs/` : System Playbooks & Manuals (`playbooks/`)
2. **Zero-Breaking Backward Compatibility Engine**: สร้าง Dynamic Path Resolver ใน Core CLI & Tooling (`resolveWorkspacePaths`) ที่ค้นหาโฟลเดอร์ใหม่ก่อน และ Fallback กลับไปหา Path เดิม (`devflow/context/`, `devflow/history/`) อัตโนมัติ ทำให้ Client รุ่นเก่าทำงานได้ 100%
3. **CLI Migration Subcommand (`nexus-devflow migrate-structure`)**: คำสั่งอัตโนมัติสำหรับสแกนโปรเจกต์ Client เดิม ย้ายโฟลเดอร์เข้าโครงสร้างใหม่อย่างปลอดภัย ลบ `devflow/runs/` ที่ว่างเปล่า และอัปเดต Manifest/Config
4. **Auto-Migration During Update**: ทำงานอัตโนมัติเมื่อรัน `nexus-devflow update` หากตรวจพบโครงสร้างแบบเก่า ปรับโครงสร้างให้อัตโนมัติและไม่ทำซ้ำหากย้ายแล้ว
5. **Documentation & Guides Synchronization**: อัปเดตคู่มือ `AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md` และสร้างคู่มือ Migration

---

## ✅ 2. Acceptance Criteria

- [x] **AC-1**: มีโมดูล `workspace-paths.ts` ใน `packages/create-nexus-devflow` ที่สามารถ resolve path แบบ dynamic ทั้ง Decade-Numbered (`00-`, `10-`, `20-`, `30-`, `40-`, `50-`, `60-`) และ Legacy Flat (`context`, `history`, `discoveries`) อย่างถูกต้อง
- [x] **AC-2**: ปรับปรุง CLI `update.ts`, `manifest`, และ Tooling commands ให้เรียกใช้ Path Resolver และรองรับการทำงานกับโครงสร้างทั้งสองแบบโดยไม่มี Breaking Changes
- [x] **AC-3**: มีคำสั่ง CLI `nexus-devflow migrate-structure` ที่สามารถสแกนโปรเจกต์เดิม, ย้ายไฟล์เข้าโครงสร้าง Decade-Numbered, ลบ `devflow/runs/`, และอัปเดต `.nexus/nexus-devflow.json` ได้อย่างปลอดภัย
- [x] **AC-4**: อัปเดตเอกสาร `AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md` ให้สะท้อนสถาปัตยกรรม Decade-Numbered Stages ชัดเจน
- [x] **AC-5**: รัน Automated Unit Tests, Static Contracts (`npm run check:static`), และ E2E Framework Checks ผ่าน 100%

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Step 1: Path Resolver Engine & Workspace Manifest Abstraction [TDD]**
  - [x] 🔴 Red: เขียน Unit Test `packages/create-nexus-devflow/test/workspace-paths.test.ts` ทดสอบการ resolve path ทั้งแบบ Decade-Numbered และ Legacy Fallback
  - [x] 🟢 Green: สร้างโมดูล `packages/create-nexus-devflow/lib/workspace-paths.ts` และเชื่อมโยง Manifest Schema ใน `packages/create-nexus-devflow/lib/update.ts`
  - [x] 🔵 Refactor: ปรับแต่งให้สะอาดและ Type-safe

- [x] **Step 2: Migration Command Implementation (`migrate-structure`) [TDD]**
  - [x] 🔴 Red: เขียน Unit Test `packages/create-nexus-devflow/test/migrate-structure.test.ts` จำลองโครงสร้างโปรเจกต์เดิม แล้วทดสอบคำสั่ง migration
  - [x] 🟢 Green: สร้างคำสั่ง `packages/create-nexus-devflow/lib/tooling/commands/migrate-structure.ts` และลงทะเบียนใน CLI Subcommands
  - [x] 🔵 Refactor: จัดการ Clean-up `devflow/runs/` และอัปเดต `.nexus/nexus-devflow.json`

- [x] **Step 3: Tooling & Script Alignment**
  - [x] ปรับปรุง `scripts/overview.ts`, `scripts/validate-framework.ts`, และ `packages/create-nexus-devflow/lib/tooling/` ให้ใช้ `resolveWorkspacePaths`
  - [x] ทดสอบรันคำสั่ง tooling เดิมทั้งหมด

- [x] **Step 4: Documentation & Guide Synchronization**
  - [x] อัปเดต `AGENTS.md` และ `CLAUDE.md` ให้แสดง Decade-Numbered Stages พร้อมคงแนวคิด 3-Pillars
  - [x] อัปเดต `README.md` และ `README.th.md`
  - [x] สร้างคู่มือการ Migration สำหรับผู้ใช้ใน `devflow/60-docs/migration-guide-decade-numbered.md`

- [x] **Step 5: Whole-System Verification & Regression Check**
  - [x] รัน `npm run check:static` (PASS 100%)
  - [x] รัน `npm test` (PASS 262 tests)
  - [x] รัน `npm run check` (PASS 100% Package Smoke & Integrity)

---

## ⚡ 4. Implementation Log & Evidence

### Verification Results:
- `workspace-paths.test.ts`: 3/3 tests passed (Legacy flat resolution, decade-numbered resolution, manifest priority)
- `migrate-structure.test.ts`: 1/1 test passed (full lifecycle migration, file movement, legacy runs cleanup, manifest update)
- `scripts/overview.test.ts`: 4/4 tests passed
- Full suite `npm test`: 262 tests passed, 0 failures across `create-nexus-devflow`, `test:overview`, `test:sandbox`, `test:run-state`, `test:tooling`
- `npm run check:static`: 100% Static validation passed (all 32 core skills, lifecycle contracts, manifest sync)
- `npm run check`: 100% Passed (Typecheck + Full Package smoke tests with clean template)
