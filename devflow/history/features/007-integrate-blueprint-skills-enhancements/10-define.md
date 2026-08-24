# Phase 10: Define Contract

- **Running ID**: `RUN-007-integrate-blueprint-skills-enhancements`
- **Title**: ยกระดับระบบ Nexus-DevFlow ด้วยวินัยและกลไกสำคัญจาก Nexus-Blueprint ทั้ง 23 Skills
- **Source Discovery**: [DISC-20260818-004-analyze-blueprint-skills-for-devflow](../../discoveries/DISC-20260818-004-analyze-blueprint-skills-for-devflow/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการสำรวจและวิเคราะห์ใน [Phase 00 (DISC-20260818-004)](../../discoveries/DISC-20260818-004-analyze-blueprint-skills-for-devflow/00-discover.md) พบว่า `nexus-blueprint` มีวินัยเชิงวิศวกรรม (Engineering Disciplines) และกลไกเชิงระบบที่เข้มงวดและมีประสิทธิภาพสูงมาก ซึ่งสามารถนำมาผสานเข้ากับ Mainline Stages (00-70) และ Companion Commands ของ `nexus-devflow` เพื่อเพิ่มความน่าเชื่อถือ ความปลอดภัย และคุณภาพของการส่งมอบงานในระดับสูงสุด

เป้าหมายของ Run นี้คือ:
1. **ผสานระบบ Findings Ledger & Quality Gates ให้แข็งแกร่ง (Indestructible Findings State Machine)**:
   - บังคับใช้สถานะของ Finding ใน `devflow/context/findings.md` อย่างเป็นทางการ: `open` ➔ `fixed` ➔ `closed` (โดย `fixed` จะต้องผ่านการ Review ใน `50-verify` เท่านั้นจึงจะเปลี่ยนเป็น `closed`)
   - กฎเหล็ก: P0 และ P1 ที่ยังเป็น `open` หรือ `fixed` จะบล็อกการเข้าสู่ `70-release` โดยอัตโนมัติ
2. **มาตรฐานหลักฐานเชิงประจักษ์ (Empirical Proof Contract) และ Try Guide**:
   - บังคับใช้ใน `50-verify` ว่าห้ามอ้างว่างานผ่านโดยไม่มีหลักฐานรูปธรรม (Log, Test Output, Route, Screenshot)
   - รวมรูปแบบ Try Guide ("Where to go", "What to click", "What to expect") ไว้ใน `50-verify.md` และ `60-report`
3. **Safety Pass & 2-Stage Release Approvals**:
   - ปรับปรุงขั้นตอน `70-release` ให้แยกสิทธิ์อนุมัติการ Merge ออกจากสิทธิ์อนุมัติการ Push อย่างชัดเจน
   - ย้าย Finding ที่ Resolved ไปจัดเก็บในรายงาน Release และรีเซ็ต Ledger อย่างสะอาด
4. **ความสมบูรณ์ของ Single Source of Truth ใน Project Overview**:
   - บรรจุแนวทางการแปลง Data Model และ Entity Relations ที่ชัดเจนลงในคู่มือและโครงสร้างมาตรฐานของ DevFlow
5. **รักษา Adapter Parity 100%**:
   - ซิงค์การปรับปรุงทั้งหมดระหว่าง `.agents/skills/` และ `.claude/skills/` ให้ตรงกัน 100%

---

## 2. ขอบเขตงาน (In-Scope)

### Phase 1: ปรับปรุง Mainline Stage Contracts & Guidelines
- **Stage `50-verify` (`.agents/skills/50-verify/SKILL.md`)**:
  - เสริมการตรวจสอบ `findings.md` state machine (ตรวจสอบ P0/P1 blockers และตรวจซ้ำ `fixed` ➔ `closed`)
  - เสริม Empirical Proof Contract และส่วน Try Guide
- **Stage `60-report` (`.agents/skills/60-report/SKILL.md`)**:
  - บันทึก Try Guide และ Resolved Findings ลงในรายงานสรุป
- **Stage `70-release` (`.agents/skills/70-release/SKILL.md`)**:
  - เสริม Step 0 Safety Pass, แยกการขออนุมัติ Merge และ Push, และการย้าย Resolved Findings เข้าสู่ Release Archive
- **Context & Standards (`devflow/context/` & `docs/`)**:
  - อัปเดต `coding-standards.md`, `project-overview.md` guidelines, และ `ai-interaction.md` ให้สอดคล้องกัน

### Phase 2: ซิงค์ Tool Adapters & Templates
- ซิงค์ `.agents/skills/` ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
- ซิงค์ไฟล์ทั้งหมดไปยัง `packages/create-nexus-devflow/template` ผ่าน `npm run prepare:template`

### Phase 3: การตรวจสอบและทดสอบคุณภาพ (Verification)
- รันชุดตรวจสอบความถูกต้อง (`npm run check:static`, `npm run check`, `npm test`, `npm run test:package`) ให้ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่เปลี่ยนหมายเลขหรือโครงสร้างหลักของ Mainline Stages 00-70 (รักษาความเป็น Linear Mainline ไว้)
- ไม่ลบ Specialist Skills ที่มีอยู่เดิมใน DevFlow

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-007`** | `integrate-blueprint-skills-enhancements` | ยกระดับ Stage Contracts (50-verify, 60-report, 70-release), Findings Ledger State Machine, Empirical Proof, และ Safety Gates พร้อมรักษา Adapter Parity 100% |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. `50-verify`, `60-report`, และ `70-release` มีกลไก Findings Ledger Gate (P0/P1 block release, `fixed` ➔ `closed` review) และ Empirical Proof ชัดเจน
2. `70-release` มีการแยกความยินยอม (Explicit Approval) ระหว่าง Merge กับ Push
3. `.agents/skills/` และ `.claude/skills/` ซิงค์ตรงกัน 100%
4. Package Template และเอกสารทั้งหมดได้รับการอัปเดตสอดคล้องกัน
5. ผ่านการทดสอบทั้งหมด (`npm run check`, `npm run check:static`, `npm test`, `npm run test:package`) 100%

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
20-spec RUN-007-integrate-blueprint-skills-enhancements
```
