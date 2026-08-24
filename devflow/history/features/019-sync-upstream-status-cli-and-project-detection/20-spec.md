# Phase 20: Delivery Specification

- **Running ID**: `RUN-019-sync-upstream-status-cli-and-project-detection`
- **Title**: ข้อกำหนดทางเทคนิคในการนำฟีเจอร์ Status CLI และ Project Detection จาก AI Blueprint v0.9.1 มาปรับใช้ใน DevFlow
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-20
- **Owner**: DevFlow Core Framework Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาทางเทคนิค (Delivery Contract) สำหรับการพัฒนารอบ **`RUN-019`** เพื่อ:
1. พัฒนาและติดตั้งโมดูล **Status Core Libraries** ใน `packages/create-nexus-devflow/lib/` (ได้แก่ `project-root.ts`, `project-metadata.ts`, `git-status.ts`, `findings.ts`, `current-work.ts`, และ `status.ts`)
2. พัฒนาคำสั่ง **Status CLI** บนแพ็กเกจ `@jakkrichm/create-nexus-devflow` ให้สามารถรัน `nexus-devflow status` และ `create-nexus-devflow status` ผ่าน Terminal ได้ทั้งแบบ ANSI Colored และ Machine-readable JSON (`--json`)
3. รองรับการอ่านและสรุปสถานะของสถาปัตยกรรม **Dual-Track (Fast-Track Living Spec & Deep-Track Stages)** ใน DevFlow 2.0
4. พัฒนาชุดทดสอบ **Unit Tests Suite** ครบทุกโมดูล และอัปเดต Upstream Baseline ใน `.nexus/upstream-ai-blueprint.json` เป็น `c394e3b`

---

## 2. ข้อกำหนดฟังก์ชันการทำงานหลัก (Core Functional Requirements)

### REQ-1: ระบบตรวจจับ Project Root & Metadata Reader
- **R1.1 `lib/project-root.ts` (`findProjectRoot`, `isDevFlowProjectRoot`)**:
  - ตรวจสอบจากโฟลเดอร์ปัจจุบันขึ้นไปหา Root Directory
  - ยืนยัน Root ผ่านการมีอยู่ของโฟลเดอร์ `devflow/` หรือ `devflow/.state/manifest.json` หรือ `AGENTS.md` / `.agents/`
  - ป้องกัน Symbolic link traps และคืนค่า `null` หากไม่พบ
- **R1.2 `lib/project-metadata.ts` (`readProjectMetadata`)**:
  - อ่านชื่อโปรเจกต์ (จาก Directory Name หรือ `package.json`)
  - อ่านเวอร์ชันของ DevFlow ที่ติดตั้งจาก `devflow/.state/manifest.json` หรือ Package metadata
  - ตรวจจับ Adapters ที่ติดตั้ง: `codex` (`.agents/skills`), `claude` (`.claude/skills`)

### REQ-2: ระบบตรวจสอบ Git Status & Divergence
- **R2.1 `lib/git-status.ts` (`readGitStatus`)**:
  - รัน `git status --porcelain=v1` เพื่อตรวจจับจำนวนไฟล์ที่เปลี่ยนแปลง (Changed / Untracked files)
  - อ่าน Branch ปัจจุบัน และ Last Commit Subject
  - ตรวจจับ Upstream Remote Tracking (`@{upstream}`) และคำนวณ Ahead / Behind commit counts
  - คืนค่า graceful fallback (`available: false`) กรณีไม่ได้อยู่ใน Git repository

### REQ-3: ระบบวิเคราะห์ Findings Ledger & Blockers
- **R3.1 `lib/findings.ts` (`readFindings`, `parseFindings`)**:
  - อ่านไฟล์ `devflow/context/findings.md`
  - วิเคราะห์ตาม Pattern Heading: `### <ID> [<Severity>] <Status> - <Title>`
  - รองรับ Severity: `P0`, `P1`, `P2`, `P3`
  - รองรับ Status: `unverified`, `open`, `fixed`, `closed`, `accepted`, `invalid`
  - กรองหา **Blockers**: รายการ `P0` หรือ `P1` ที่มีสถานะ `open` หรือ `fixed` (ขัดขวางการ Complete จนกว่าจะผ่านการ Re-audit)
  - แจ้งเตือน Warning หากพบ Heading ที่ผิดรูปแบบ (Malformed)

### REQ-4: ระบบอ่านสถานะงาน Dual-Track (Current Work & Stage Progress)
- **R4.1 `lib/current-work.ts` (`readCurrentWork`, `parseCurrentWork`)**:
  - ตรวจจับสถานะงานที่กำลังดำเนินการ (Active Run):
    - ตรวจหาจาก Living Spec (`devflow/runs/RUN-xxx/spec.md`)
    - หรือ Stage Artifacts ใน `devflow/runs/RUN-xxx/`
    - หรือ `devflow/context/current-stage.md`
  - วิเคราะห์ Checklists Steps (`- [ ]`, `- [x]`): คำนวณ Completed, Remaining, Total และดึง Next Step ที่ต้องทำ
  - ตรวจจับสถานะ Idle เมื่อไม่มีงานค้าง (`state: "idle"`)

### REQ-5: โมดูลประมวลผลสถานะส่วนกลาง & CLI Formatter
- **R5.1 `lib/status.ts` (`readProjectStatus`, `formatHumanStatus`)**:
  - รวบรวมข้อมูลจาก Metadata, Current Work, Findings, และ Git Status พร้อมกัน
  - ประเมินสุขภาพโปรเจกต์ (`health: "ok" | "warning"`)
  - ประเมินสถานะความพร้อมในการ Complete (`completion: "ready" | "needs_verification" | "blocked"`)
  - แนะนำ Next Action อัตโนมัติ เช่น:
    - ถ้าพบ Malformed ➔ แนะนำ `/doctor`
    - ถ้ามี Active Step ค้าง ➔ แนะนำ `/implement`
    - ถ้า Checklists ครบแต่ยังไม่ได้ Verify ➔ แนะนำ `/check`
    - ถ้ามี P0/P1 Blocker ➔ แนะนำ `/implement` หรือ `/fix <id>`
    - ถ้าไม่มีงานค้าง ➔ แนะนำ `/feature` หรือ `/00-discover`
  - จัด Format แสดงผล:
    - Human-readable Output: ตารางสวยงาม รองรับ ANSI Colors (Cyan, Green, Yellow, Red, Bold) และคำนึงถึง `NO_COLOR` / Non-TTY
    - JSON Output (`--json`): คืนค่า Structured `ProjectStatus` JSON Object สมบูรณ์

### REQ-6: CLI Binary & Entrypoint Integration
- **R6.1 `bin/create-nexus-devflow.ts` & `package.json`**:
  - เพิ่มการจัดการ Subcommand `status`
  - รองรับ Flags: `--json`, `--target <path>`, `--help`, `--version`
  - กำหนด `bin` ใน `package.json` สำหรับ `create-nexus-devflow`, `nexus-devflow`, และ `devflow`

### REQ-7: Unit Testing Suite & Upstream Sync
- **R7.1 Unit Tests ใน `packages/create-nexus-devflow/test/`**:
  - `test/project-root.test.ts`: ทดสอบการค้นหา Root และการป้องกัน Traversal/Symlink
  - `test/project-metadata.test.ts`: ทดสอบการอ่าน Manifest, Adapters, และ Package Version
  - `test/git-status.test.ts`: ทดสอบ Git Parsing ทั้งใน Git Repo และ Non-Git
  - `test/findings.test.ts`: ทดสอบการคำนวณ Blockers, P0-P3, และสถานะต่างๆ
  - `test/status.test.ts`: ทดสอบการประกอบสถานะ, Health, Human Output และ JSON Output
- **R7.2 Baseline Sync & Multi-layer Verification**:
  - อัปเดต `.nexus/upstream-ai-blueprint.json` เป็น Commit `c394e3b5b0b6c1990282278147b517466708ff41`
  - รัน `npm run check` ผ่านครบ 100%

---

## 3. ข้อจำกัดและกฎความปลอดภัย (Hard Constraints)

1. **Zero Runtime Dependency**: โมดูลทั้งหมดต้องใช้เฉพาะ Built-in Node.js APIs (`node:fs/promises`, `node:path`, `node:child_process`, `node:util`) ไม่เพิ่ม External Dependency ใน Runtime
2. **Backward Compatibility**: การทำงานเดิมของคำสั่ง Init, Update และ Script ใน DevFlow ต้องไม่ถูกทำลาย
3. **Cross-Platform Compatibility**: รองรับการทำงานทั้งบน Windows (PowerShell/CMD) และ Linux/macOS
4. **Strict Verification**: ต้องผ่าน `npm run check` ครบทุกขั้นตอนก่อน Release

---

## 4. เกณฑ์การตรวจรับและการทดสอบ (Acceptance Criteria & Verification Plan)

| ID | เกณฑ์การตรวจรับ (Acceptance Criteria) | วิธีการตรวจสอบ (Verification Method) |
| :--- | :--- | :--- |
| **AC-1** | โมดูล `project-root`, `project-metadata`, `git-status`, `findings`, และ `status` คอมไพล์ผ่าน `tsc` โดยไม่มี Type Error | `npm run build` ใน `packages/create-nexus-devflow` |
| **AC-2** | สามารถรัน `nexus-devflow status` ใน Workspace แล้วแสดงสถานะของโปรเจกต์ได้อย่างถูกต้อง | รัน `node packages/create-nexus-devflow/dist/bin/create-nexus-devflow.js status` |
| **AC-3** | สามารถรันคำสั่งพร้อม Flag `--json` และได้ JSON Schema ที่ถูกต้อง | รัน `node packages/create-nexus-devflow/dist/bin/create-nexus-devflow.js status --json` |
| **AC-4** | ชุดทดสอบ Unit tests ทั้งหมดใน `test/` รันผ่าน 100% | รัน `npm test` ใน `packages/create-nexus-devflow` |
| **AC-5** | ไฟล์ `.nexus/upstream-ai-blueprint.json` มี `lastReviewedCommit: "c394e3b5b0b6c1990282278147b517466708ff41"` | ตรวจสอบเนื้อหาไฟล์ |
| **AC-6** | รัน `npm run check` ที่ Root ของ DevFlow ผ่านครบทุก Verification Gate | รัน `npm run check` |

---

## 5. คำสั่งถัดไป (Next Workflow Recommendation)

เข้าสู่ขั้นตอนแตกย่อยแผนงานและ Checklists ใน Phase 30:

```text
/30-plan RUN-019-sync-upstream-status-cli-and-project-detection
```
