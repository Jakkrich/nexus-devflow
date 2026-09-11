# Phase 20: Delivery Specification

- **Running ID**: `021-categorized-history-and-clean-living-spec-architecture`
- **Title**: ข้อกำหนดทางเทคนิคสถาปัตยกรรม 3 เสาหลัก (3-Pillars Model), ตัด `devflow/runs/` ออก, Categorized History (`features/`, `fixes/`, `rollbacks/`), ตัด Prefix `RUN-`, บังคับกฎ Single Active Run, และรวมสถานะ Active ไว้ใน `devflow/context/`
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-21
- **Owner**: DevFlow Core Engineering Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาทางเทคนิค (Delivery Contract) สำหรับการพัฒนารอบ **`021`** ตามสถาปัตยกรรม **"The 3-Pillars Unified Model"** เพื่อ:
1. **จัดระเบียบโครงสร้าง DevFlow ให้เหลือเพียง 3 เสาหลัก (3 Pillars)**:
   - 🔮 **อนาคต (Future / Backlog)**: `devflow/ideas.md`
   - ⚡ **ปัจจุบัน (Present / Context)**: `devflow/context/` (เป็นศูนย์รวมสถานะงานที่กำลัง Active ทั้งหมด)
   - 📦 **อดีต (Past / History)**: `devflow/history/` (เก็บเฉพาะงานที่ปิดงานและส่งมอบเสร็จสิ้นแล้ว)
2. **ตัดโฟลเดอร์ `devflow/runs/` ออกอย่างถาวร (Eliminate `devflow/runs/`)**:
   - ไม่ต้องมีโฟลเดอร์ `devflow/runs/` ในระดับ Root อีกต่อไป เพื่อลดความซ้ำซ้อนและทำให้ Directory Tree สะอาด 100%
3. **กำหนดตำแหน่งงานปัจจุบันใน `devflow/context/` อย่างแน่นอน (Fixed Active Paths)**:
   - **🏎️ Fast-Track (Blueprint Mode)**: ไฟล์ Living Spec อยู่ที่ **`devflow/context/current-feature.md`**
   - **🏗️ Deep-Track (Architect Mode)**: โฟลเดอร์สเตจชั่วคราวอยู่ที่ **`devflow/context/current-run/`** (มีเฉพาะตอนกำลังดำเนินการ)
4. **ปรับโครงสร้าง Categorized History (`devflow/history/`)**:
   - แยกเป็น 3 หมวดหมู่หลัก: `features/`, `fixes/`, และ `rollbacks/` โดย AI คัดแยกอัตโนมัติตามประเภทของงาน พร้อมตาราง Master Ledger ใน `devflow/history/HISTORY.md`
5. **ยกเลิก Prefix `RUN-`**:
   - เปลี่ยนระบบหมายเลขลำดับเป็น **`xxx-slug`** (เช่น `001-setup-auth`, `021-categorized-history...`)
6. **ติดตั้ง Single Active Run Guardrail (One Thing at a Time)**:
   - ปฏิเสธการเปิดงานใหม่ทันทีหากยังมีงานเดิมค้างอยู่ใน `current-feature.md` หรือ `current-run/`
7. **ปรับปรุง Core Modules, CLI, Skills & Unit Tests**:
   - อัปเดต `current-work.ts`, `status.ts`, `findings.ts`, `uninstall.ts`, Mainline Skills ทั้งหมด และทดสอบผ่าน `npm test` 100%

---

## 2. ข้อกำหนดฟังก์ชันการทำงานหลัก (Core Functional Requirements)

### REQ-1: สถาปัตยกรรม 3 เสาหลักและการตัดโฟลเดอร์ `devflow/runs/`
- **R1.1 โครงสร้าง Workspace ใหม่**:
  ```text
  devflow/
  ├── ideas.md                 # [อนาคต] Idea Inbox & Backlog
  ├── context/                 # [ปัจจุบัน] Living Context & Active Work
  │   ├── project-overview.md
  │   ├── coding-standards.md
  │   ├── ai-interaction.md
  │   ├── findings.md
  │   ├── current-stage.md
  │   ├── current-feature.md   # [Active Fast-Track]
  │   └── current-run/         # [Active Deep-Track - มีเฉพาะตอนรัน]
  ├── history/                 # [อดีต] Master History Archive
  │   ├── features/
  │   ├── fixes/
  │   ├── rollbacks/
  │   └── HISTORY.md
  └── discoveries/             # Discovery records (DISC-xxx)
  ```
- **R1.2 การยกเลิก `devflow/runs/`**:
  - ย้ายหรือแปลงประวัติเดิมใน `devflow/runs/` เข้าสู่ `devflow/history/` ทั้งหมด
  - ลบโฟลเดอร์ `devflow/runs/` ออกจาก Template และ Package Scaffold

### REQ-2: สถาปัตยกรรม Active Work และการ Archive เข้า History
- **R2.1 Fast-Track Lifecycle (`/feature` / `/fix` ➔ `/complete`)**:
  - **ขณะเริ่มงาน**: เขียน Living Spec ลงใน `devflow/context/current-feature.md` โดยตรง
  - **ขณะพัฒนา**: ติ๊ก Checklists และบันทึก Evidence ใน `devflow/context/current-feature.md`
  - **เมื่อปิดงาน (`/complete`)**:
    - AI ตรวจสอบประเภทงาน (Feature ➔ `history/features/`, Fix ➔ `history/fixes/`, Rollback ➔ `history/rollbacks/`)
    - ย้ายไฟล์ `devflow/context/current-feature.md` ไป Archive เป็นไฟล์เดี่ยวที่ `devflow/history/{category}/{xxx-slug}.md`
    - รวบรวม Resolved Findings (`closed`/`accepted`) ไปต่อท้ายไฟล์ Archive
    - รีเซ็ต `devflow/context/current-feature.md` กลับเป็น Stub ว่าง:
      ```markdown
      # Current Feature

      _Nothing in progress. Run /feature, /fix, or /rollback to start._
      ```
    - อัปเดต `devflow/history/HISTORY.md`
- **R2.2 Deep-Track Lifecycle (`10-define` ➔ `70-release`)**:
  - **ขณะเริ่มงาน**: สร้างโฟลเดอร์ชั่วคราวที่ `devflow/context/current-run/` และเขียน `10-define.md` ... `60-report.md`
  - **เมื่อปิดงาน (`70-release`)**:
    - AI ย้ายโฟลเดอร์ `devflow/context/current-run/` ➔ ไปเป็น `devflow/history/{category}/{xxx-slug}/`
    - อัปเดต `devflow/history/HISTORY.md`
    - โฟลเดอร์ `devflow/context/current-run/` จะถูกย้ายออกไป ทำให้ใน `context/` กลับมาสะอาด

### REQ-3: โครงสร้าง Categorized History (The Core 3 Model)
- **R3.1 โฟลเดอร์หมวดหมู่ใน `devflow/history/`**:
  - `history/features/`: เก็บฟีเจอร์ใหม่, สถาปัตยกรรม, Refactor, Infra/Tooling
  - `history/fixes/`: เก็บบั๊กฟิกซ์, Hotfix, Security/Performance patches
  - `history/rollbacks/`: เก็บประวัติการย้อนคืนฟีเจอร์เดิม
  - แต่ละโฟลเดอร์มี `README.md` อธิบายวัตถุประสงค์
- **R3.2 ตาราง Master Ledger (`HISTORY.md`)**:
  - มีคอลัมน์: `Run ID`, `Type`, `Title`, `Completed Date`, `Archive Path`

### REQ-4: ระบบ Sequential Numbering รูปแบบใหม่ (`xxx-slug`)
- **R4.1 มาตรฐานหมายเลข**:
  - ใช้หมายเลข 3 หลักนำหน้า เช่น `001-setup-auth`, `021-categorized-history-and-clean-living-spec-architecture`
  - ตัด Prefix `RUN-` ออกทั้งหมด
- **R4.2 Git Branch Naming**:
  - `feature/{xxx-slug}` หรือ `fix/{xxx-slug}`

### REQ-5: Single Active Run Guardrail (One Thing at a Time)
- **R5.1 การบล็อกการเปิดงานซ้อน**:
  - เมื่อสั่ง `/feature`, `/fix`, `/spec`, หรือ `10-define`:
  - ตรวจสอบ `devflow/context/current-stage.md`, `current-feature.md`, และ `current-run/`
  - หากพบว่ามีงานเดิมค้างอยู่ (ยังไม่ผ่าน `/complete` หรือ `70-release`):
    - **ปฏิเสธทันที** พร้อมข้อความแจ้งเตือน:
      > ⚠️ *"มีงาน `{active-id}` กำลังดำเนินการอยู่ กรุณาปิดงานด้วย `/complete` หรือ `70-release` (หรือสั่ง `/rollback`) ก่อนเริ่มงานใหม่"*

### REQ-6: ปรับปรุง Core Modules & Status CLI ใน `packages/create-nexus-devflow/lib/`
- **R6.1 `lib/current-work.ts`**:
  - ตรวจจับ Active Living Spec จาก `devflow/context/current-feature.md` (ถ้าไม่ใช่ Stub)
  - หรือตรวจจับ Deep-Track จาก `devflow/context/current-run/`
  - หรือตรวจจับจาก `devflow/context/current-stage.md`
  - รองรับ ID Regex ทั้งแบบใหม่ `^\d{3}-` และแบบเดิม `^RUN-\d{3}-`
- **R6.2 `lib/status.ts`**:
  - อัปเดต CLI Formatter ให้อ่านสถานะจากโครงสร้าง 3 เสาหลัก
- **R6.3 `lib/uninstall.ts`**:
  - ปรับการทำความสะอาดให้ลบ `devflow/context/` และ `devflow/history/` ตามกฎ `--keep-history`

### REQ-7: ปรับปรุง Mainline Skills ใน `.agents/skills/` และ `.claude/skills/`
- อัปเดตทักษะทั้งหมด (`feature`, `fix`, `spec`, `implement`, `check`, `complete`, `10-define`, `70-release`, `report-html`) ให้ปฏิบัติตามโครงสร้าง 3 เสาหลัก
- ซิงก์ทักษะไปยัง `.claude/skills/` ด้วย `npm run sync:adapters`

### REQ-8: ชุดทดสอบ Unit Tests Suite
- ปรับปรุงและเพิ่ม Unit Tests ใน `packages/create-nexus-devflow/test/`:
  - `test/status.test.ts`: ทดสอบ Active/Idle กับ `context/current-feature.md` และ `context/current-run/`
  - `test/uninstall.test.ts`: ทดสอบการลบและ keep-history กับโครงสร้างใหม่
  - `test/findings.test.ts`: ทดสอบ findings parser
- ผ่าน `npm test` 100%

---

## 3. สัญญาโครงสร้างไฟล์ (Directory & File Schema Contract)

```text
devflow/
├── ideas.md                          # Future Backlog
├── context/                          # Present Active State
│   ├── project-overview.md
│   ├── coding-standards.md
│   ├── ai-interaction.md
│   ├── findings.md
│   ├── current-stage.md
│   ├── current-feature.md            # Active Fast-Track Living Spec (Stub when idle)
│   └── current-run/                  # Active Deep-Track Stages Folder (Only when active)
└── history/                          # Past Completed Archive
    ├── features/
    │   ├── 001-align-devflow-blueprint.md
    │   └── ...
    ├── fixes/
    ├── rollbacks/
    └── HISTORY.md
```

---

## 4. ข้อจำกัดและกฎความปลอดภัย (Hard Constraints)

1. **Zero Runtime Dependencies**: ใช้เฉพาะ Node.js Built-in APIs (`node:fs/promises`, `node:path`, `node:child_process`)
2. **Backward Compatibility**: รองรับการอ่านทั้ง ID `021-slug` และ `RUN-xxx-slug`
3. **Data Loss Prevention**: การย้ายไฟล์และรีเซ็ต Stub ต้องมีขั้นตอนที่ปลอดภัย ไม่ทำลายข้อมูล
4. **Strict Verification**: ต้องผ่าน `npm run check` 100%

---

## 5. แผนการทดสอบและการพิสูจน์เชิงประจักษ์ (Testing & Verification Strategy)

| ช่องทางการทดสอบ | คำสั่ง / วิธีการ | เกณฑ์ผ่าน |
| :--- | :--- | :--- |
| **Lane 1: Static & Type Safety** | `tsc --noEmit` & `npm run check:static` | 0 Type errors, โครงสร้างไฟล์ถูกต้อง |
| **Lane 2: Automated Unit Tests** | `npm test` | 20+ Tests ผ่าน 100% |
| **Lane 3: Skill Routing Accuracy** | `npm run test:routing` | 312/312 Evals ผ่าน (100% Rank 1) |
| **Lane 4: Package Smoke Test** | `npm run test:package` | Overlay และรัน status CLI ผ่าน |

---

## 6. คำสั่งถัดไปที่อนุญาต (Next Allowed Command)

- สเตจถัดไป: `30-plan 021-categorized-history-and-clean-living-spec-architecture` (หรือ `/30-plan 021`)
