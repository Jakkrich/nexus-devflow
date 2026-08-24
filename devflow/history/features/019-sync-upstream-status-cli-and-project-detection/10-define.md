# Phase 10: Define Contract

- **Running ID**: `RUN-019-sync-upstream-status-cli-and-project-detection`
- **Title**: นำฟีเจอร์ Status CLI และ Project Detection จาก AI Blueprint v0.9.1 มาปรับใช้ใน DevFlow
- **Source Discovery**: [DISC-20260820-016-sync-upstream-ai-blueprint-v091](../../discoveries/DISC-20260820-016-sync-upstream-ai-blueprint-v091/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-20
- **Owner**: DevFlow Core Framework Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการตรวจสอบ Upstream Update ([GitHub Issue #2](https://github.com/Jakkrich/nexus-devflow/issues/2)) จาก `aiblueprinthq/ai-blueprint` (ช่วง baseline `720815c` สู่ `c394e3b` รวม 6 commits) พบว่า Upstream ได้เพิ่มความสามารถสำคัญคือ **Project Root Detection, Metadata Reader, Findings Ledger Parser, Git Status Summary และ Status CLI**

เป้าหมายของ **`RUN-019`** คือการนำฟีเจอร์เหล่านี้มาปรับใช้และยกระดับให้เข้ากับสถาปัตยกรรม **Dual-Track ของ DevFlow 2.0** เพื่อให้ผู้ใช้และทีมงานสามารถรันคำสั่ง `nexus-devflow status` หรือ `create-nexus-devflow status` (พร้อมรองรับ `--json`) ผ่าน Terminal เพื่อตรวจสอบสถานะโปรเจกต์ ความคืบหน้าของ living spec, findings blocker, git drift และคำแนะนำ Next Action ได้ในทันที

---

## 2. ขอบเขตงานที่ต้องดำเนินการ (In-Scope)

### ส่วนที่ 1: พัฒนา Core Modules ใน `packages/create-nexus-devflow/lib/`
1. **`project-root.ts`**:
   - ค้นหาโฟลเดอร์ Root ของ DevFlow จาก Path ปัจจุบันขึ้นไปแบบ Recursive
   - ตรวจจับความถูกต้องผ่านโฟลเดอร์ `devflow/` หรือ `AGENTS.md` / `.agents/` หรือ Install Manifest
2. **`project-metadata.ts`**:
   - อ่านชื่อโปรเจกต์, Root Path, Version จาก Package/Manifest และตรวจจับ Adapters ที่ติดตั้ง (`codex`, `claude`)
3. **`git-status.ts`**:
   - ตรวจจับสถานะ Git Repo, Clean/Dirty, จำนวนไฟล์ที่แก้ไข, Commit ล่าสุด, และ Ahead/Behind จาก Remote
4. **`findings.ts`**:
   - ตรวจสอบ `devflow/context/findings.md` เพื่อจัดกลุ่ม Severity (`P0`-`P3`) สถานะ (`unverified`, `open`, `fixed`, `closed`, `accepted`, `invalid`) และดึง Blocker findings
5. **`current-work.ts` / Stage Progress Reader**:
   - รองรับการอ่านความคืบหน้าของทั้ง Fast-Track (`devflow/runs/RUN-xxx/spec.md`) และ Deep-Track (`devflow/runs/RUN-xxx/` หรือ `devflow/context/current-stage.md`)
6. **`status.ts`**:
   - ประกอบข้อมูลสถานะทั้งหมดเข้าด้วยกัน คำนวณ Health (`ok` | `warning`), Completion Readiness, แนะนำ Next Action และจัด Format แสดงผล (ANSI Color สำหรับ TTY และ Structured JSON สำหรับ `--json`)

### ส่วนที่ 2: CLI Binary & Interface ใน `packages/create-nexus-devflow/bin/`
1. **`create-nexus-devflow.ts` & `nexus-devflow.ts`**:
   - เพิ่มการรองรับ Subcommand `status` พร้อม Options `--json`, `--target`, `--help`, `--version`
   - ตั้งค่า `bin` ใน `package.json` ให้เรียกใช้งานผ่าน `nexus-devflow status` หรือ `create-nexus-devflow status`

### ส่วนที่ 3: Unit Tests Suite
1. เพิ่มชุดทดสอบใน `packages/create-nexus-devflow/test/`:
   - `test/project-root.test.ts`
   - `test/project-metadata.test.ts`
   - `test/git-status.test.ts`
   - `test/findings.test.ts`
   - `test/status.test.ts`
2. ทดสอบผ่าน `npm test` (`tsx --test`) ให้ผ่าน 100%

### ส่วนที่ 4: Verification & Upstream Baseline Sync
1. อัปเดต `.nexus/upstream-ai-blueprint.json` ให้ `lastReviewedCommit` เป็น `c394e3b5b0b6c1990282278147b517466708ff41`
2. รัน Multi-layer Verification Matrix ผ่าน `npm run check` ครบทุก Gate
3. อัปเดต `CHANGELOG.md`

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่แก้ไขรูปแบบการทำงานของ Mainline AI Skills ใน `.agents/skills/` ที่ผู้ใช้และ AI ใช้งานตามปกติ
- ไม่กระทบพฤติกรรมการ Scaffold หรือ Update ของ DevFlow ที่มีอยู่เดิม
- ไม่เพิ่ม Third-party runtime dependencies ใหม่ (ใช้ Built-in Node.js APIs เพื่อคง Zero-dependency runtime)

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-019`** | `sync-upstream-status-cli-and-project-detection` | ติดตั้ง Status CLI, Root & Metadata Detection, Findings & Git Parsers และอัปเดต Upstream Baseline ใน DevFlow พร้อม Unit Tests 100% |

---

## 5. เกณฑ์ความสำเร็จและการตรวจรับ (Acceptance Criteria)

1. สามารถรัน `nexus-devflow status` และ `create-nexus-devflow status` เพื่อดูสถานะโปรเจกต์แบบสวยงามบน Terminal ได้
2. สามารถรันคำสั่งพร้อม Flag `--json` เพื่อรับ Structured JSON output สำหรับ Automation ได้
3. ชุดทดสอบ Unit tests ใหม่ทั้งหมดใน `packages/create-nexus-devflow/test/` ทำงานผ่าน 100%
4. `.nexus/upstream-ai-blueprint.json` ได้รับการอัปเดต Baseline Commit เป็น `c394e3b`
5. รัน `npm run check` ผ่านครบทั้ง Typecheck, Static Contracts, Unit Tests, Routing Evals, และ Smoke Package Tests

---

## 6. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนวางแผนงานและจัดเตรียม Checklists (Plan Stage):

```text
/30-plan RUN-019-sync-upstream-status-cli-and-project-detection
```
