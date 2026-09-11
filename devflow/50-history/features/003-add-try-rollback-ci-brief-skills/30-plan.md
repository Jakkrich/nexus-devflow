# Phase 30: Implementation Plan

- **Running ID**: `RUN-003-add-try-rollback-ci-brief-skills`
- **Title**: แผนการดำเนินงานเพิ่ม 4 High-Value Companion Skills (`try`, `rollback`, `ci`, `brief`) ใน Nexus-DevFlow
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Complexity**: Standard
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วงจรหลักฐานการวางแผน (Planning Loop Evidence)

- **Intent**: แปลงข้อกำหนดใน [20-spec.md](20-spec.md) ออกมาเป็นขั้นตอนการสร้าง Skills ทั้ง 4 ตัว, อัปเดต Router, ซิงค์ Adapters และตรวจสอบความถูกต้องของระบบ
- **Context**: ศึกษาทฤษฎีและการทำงานของ `/try`, `/rollback`, `/ci`, `/brief` ใน Nexus Blueprint เพื่อนำมาปรับให้เข้ากับวงจร Stage-Based (`00` ➔ `70`) ของ DevFlow 2.0
- **Observation**: พบว่า DevFlow ยังขาดคู่มือ Manual QA Guide สำหรับผู้ใช้ (`/try`), ขาดระบบวางแผนถอนโค้ดปลอดภัย (`/rollback`), ขาดตัวติดตั้ง CI อัตโนมัติ (`/ci`), และขาดคำสั่งสรุปความพร้อมของสโคปก่อนเขียนสเปก (`/brief`)
- **Adjustment**: แบ่งเป็น 6 Phases ตามลำดับการพัฒนา เพื่อให้แต่ละคำสั่งมี Parity 100% ระหว่าง `.agents/skills/` และ `.claude/skills/`
- **Stop Condition**: งานทุก Task มีรายละเอียดไฟล์, ตรรกะการทำงาน, และการกำหนด Test Decision ชัดเจน
- **Handoff**: ส่งมอบให้ `/40-Implement` ดำเนินการสร้างและแก้ไขไฟล์ตามลำดับ

---

## 2. ลำดับขั้นตอนการดำเนินงาน (Phased Execution Plan)

### Phase 1: สร้าง Skill `try` (Manual QA Walkthrough Guide)

- **Task 1.1: สร้าง `.agents/skills/try/SKILL.md`**
  - **ไฟล์**: `.agents/skills/try/SKILL.md`
  - **การเปลี่ยนแปลง**: สร้างคำแนะนำการทำ Manual Walkthrough:
    - Step 0: ตรวจสอบความพร้อมและค้นหา Active Run หรือล่าสุดใน `devflow/runs/`
    - Step 1: ดึงคำสั่งรันระบบจาก `AGENTS.md` (Web, API, CLI, Library)
    - Step 2: สร้างคู่มือ 5 ส่วนมาตรฐาน (`Start`, `Open`, `Do`, `Expect`, `Watch For`)
    - Step 3: สรุป Best Signal สิ่งแรกที่ควรลอง และ Gaps ข้อจำกัดที่อาจต้องระวัง
    - กำหนดชัดเจนว่าเป็น **Read-only 100%**
  - **Test Decision**: `Not Required` (Framework Skill Definition)
  - **การตรวจสอบ**: `npm run check:static`

---

### Phase 2: สร้าง Skill `rollback` (Safe Feature Reversal Planner)

- **Task 2.1: สร้าง `.agents/skills/rollback/SKILL.md`**
  - **ไฟล์**: `.agents/skills/rollback/SKILL.md`
  - **การเปลี่ยนแปลง**: สร้างกระบวนการวางแผนถอนฟีเจอร์อย่างปลอดภัย:
    - Step 0: Preflight ตรวจสอบ Git status, working tree, clean branch
    - Step 1: สแกนและระบุ Run หรือ Commit เป้าหมายจาก `devflow/runs/` หรือ Git log
    - Step 2: แยก Product Changes ออกจาก DevFlow Workspace / History files
    - Step 3: ตรวจสอบความเสี่ยงของ Later Commits (No overlap, Overlap compatible, Dependency risk, Blocked)
    - Step 4: สร้างแผน Reversal Plan อย่างชัดเจนก่อนส่งต่อไปให้ `/40-implement` หรือสร้าง Fix run
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

---

### Phase 3: สร้าง Skill `ci` (Automated GitHub Actions Pipeline)

- **Task 3.1: สร้าง `.agents/skills/ci/SKILL.md`**
  - **ไฟล์**: `.agents/skills/ci/SKILL.md`
  - **การเปลี่ยนแปลง**: สร้างคำแนะนำการติดตั้ง GitHub Actions:
    - Step 1: ตรวจสอบ Stack, Package Manager และคำสั่ง Verify จาก `AGENTS.md`
    - Step 2: รวบรวม Verify Command จริง (Typecheck + Test + Build)
    - Step 3: สร้างหรือปรับแต่ง `.github/workflows/verify.yml` พร้อม Best Practices (Permissions: `contents: read`)
    - Step 4: ทดสอบรัน Verify command ในเครื่องก่อน
    - Step 5: สรุปรายงานสถานะ CI Setup
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

---

### Phase 4: สร้าง Skill `brief` (Scope & Risk Pre-Check)

- **Task 4.1: สร้าง `.agents/skills/brief/SKILL.md`**
  - **ไฟล์**: `.agents/skills/brief/SKILL.md`
  - **การเปลี่ยนแปลง**: สร้างเครื่องมือสรุปภาพรวมก่อนเขียนสเปก:
    - Step 1: อ่านเป้าหมายจาก `devflow/context/project-overview.md` หรือ Run ที่กำลังจะเริ่ม
    - Step 2: สรุป What, Depends on, Unblocks, Touches, Estimated Size (S/M/L/XL), และ Open Questions
    - Step 3: แนะนำ Next Action ที่ชัดเจน (เช่น `/20-spec {run-id}`)
    - กำหนดชัดเจนว่าเป็น **Read-only 100%**
  - **Test Decision**: `Not Required`
  - **การตรวจสอบ**: `npm run check:static`

---

### Phase 5: ผสานรวมระบบ, Multi-Agent Adapters, Template และ Documentation

- **Task 5.1: ซิงค์ Adapters ไปยัง `.claude/skills/`**
  - รัน `npm run sync:adapters` เพื่อคัดลอก `.agents/skills/{try,rollback,ci,brief}` ไปยัง `.claude/skills/` อัตโนมัติ
- **Task 5.2: อัปเดต `AGENTS.md` และ `CLAUDE.md`**
  - เพิ่มคำสั่ง `try`, `rollback`, `ci`, `brief` ในตาราง Companion Commands และตาราง Invocation Reference
- **Task 5.3: อัปเดต Router Skill `devflow`**
  - ปรับปรุง `.agents/skills/devflow/SKILL.md` และ `.claude/skills/devflow/SKILL.md` ให้รู้จักและแนะนำทั้ง 4 คำสั่งตามบริบท
- **Task 5.4: อัปเดต Installer Template & Documentation**
  - อัปเดต `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
  - อัปเดตคู่มือ [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md), [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)
- **Test Decision**: `Not Required` (Docs & Config Synchronization)

---

### Phase 6: Verification & Final Quality Gate

- **Task 6.1: รันชุดตรวจ Static & Framework Integrity**
  - `npm run check:static` (ต้องตรวจผ่านครบทั้ง 103 skills)
  - `npm run check`
- **Task 6.2: รัน Installer Unit Tests & Smoke Package**
  - `npm test` (3/3 tests green)
  - `npm run test:package` (Smoke test package green)
- **Test Decision**: `Manual/Command Only` (Full suite regression testing)

---

## 3. สรุปความเสี่ยงและมาตรการป้องกัน (Risks & Mitigations)

| ความเสี่ยง (Risk) | ผลกระทบ | มาตรการป้องกัน (Mitigation) |
| :--- | :--- | :--- |
| Parity ของ Skills ไม่ตรงกันระหว่าง `.agents` กับ `.claude` | Medium | ใช้สคริปต์ `npm run sync:adapters` ซิงค์อัตโนมัติ 100% |
| คำสั่ง `try` หรือ `brief` มีการแอบแก้ไขไฟล์โดยไม่ตั้งใจ | High | กำหนด Strict Directive ชัดเจนใน `SKILL.md` ว่าต้องเป็น Read-only เสมอ |
| จำนวน Skills เพิ่มขึ้นทำให้ Static Check ไม่ผ่าน | Low | ตรวจสอบ naming convention และ frontmatter schema ทุกไฟล์ |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/40-implement RUN-003-add-try-rollback-ci-brief-skills
หรือ
40-implement RUN-003-add-try-rollback-ci-brief-skills
```
