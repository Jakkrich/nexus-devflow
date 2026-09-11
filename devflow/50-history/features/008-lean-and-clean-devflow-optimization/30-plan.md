# Phase 30: Implementation Plan

- **Running ID**: `RUN-008-lean-and-clean-devflow-optimization`
- **Title**: แผนการปรับปรุงโครงสร้าง Nexus-DevFlow ให้ Lean & Clean ยุบรวม Skills บริหารจัดการ History และเพิ่มความปลอดภัยในการ Rollback
- **Source Spec**: [20-spec.md](20-spec.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Architecture Team

---

## 1. การประเมินความซับซ้อนและยุทธศาสตร์ (Complexity Assessment & Strategy)

- **ระดับความซับซ้อน (Complexity)**: `High` (เนื่องจากมีการปรับปรุงโครงสร้างโฟลเดอร์ Skills, ย้าย Scripts, และปรับปรุง Contracts หลัก)
- **ยุทธศาสตร์ (Strategy)**:
  1. **Phase 1: ลบ Bloat (Graphify & Wiki)**: ลบไฟล์ script, ลบโฟลเดอร์ skill และตัดคำสั่งออกจาก `package.json`
  2. **Phase 2: ยุบรวม Skills ที่ซ้ำซ้อน**: รวบรวมเนื้อหาและทฤษฎีจาก Sub-skills เข้าสู่ Master Skills (`test`, `review`, `debug`, `security-review`, `deploy`, `simplify`, `preview`, `insight`, `brainstorm`, `prd`) จากนั้นลบโฟลเดอร์ Sub-skills ออก
  3. **Phase 3: ประวัติและ Safe Rollback**: สร้าง `devflow/history/HISTORY.md`, ปรับ `70-release` ให้บันทึก Release Entry พร้อม Git Checkpoint และปรับ `rollback` ให้มี Dependency Analysis
  4. **Phase 4: จัดระเบียบ Scripts**: ย้าย `scripts/test-*.mjs` ไปยัง `scripts/tests/` และปรับปรุง `package.json` กับ `scripts/validate-framework.mjs`
  5. **Phase 5: Fast-Track Guidelines**: บันทึกแนวปฏิบัติ Quick-fix ใน `devflow/context/coding-standards.md` และ `ai-interaction.md`
  6. **Phase 6: ซิงค์และยืนยันคุณภาพ**: ซิงค์ `.agents/` ไปยัง `.claude/` และ package template จากนั้นรันการทดสอบครบทุกเลเยอร์

---

## 2. ลำดับเฟสและรายการงานย่อย (Ordered Phases & Subtasks)

### Phase 1: การกำจัดส่วนเกิน (Clean-up & Bloat Removal)
- **Subtask 1.1**: ลบ `scripts/graphify.mjs`, ลบ script `graphify:*` ใน `package.json`
- **Subtask 1.2**: ลบ `.agents/skills/wiki/` และตัดการอ้างอิง `wiki` ใน `AGENTS.md`, `CLAUDE.md`

### Phase 2: การยุบรวม Skills (Consolidation & Deduplication)
- **Subtask 2.1**: ยุบรวม Testing skills (`test-driven-development` + `test-execution-and-coverage` ➔ `test/SKILL.md`)
- **Subtask 2.2**: ยุบรวม Review skills (`code-review-and-quality` + `pr-review-analysis` + `pr-review` + `9arm-skills` ➔ `review/SKILL.md`)
- **Subtask 2.3**: ยุบรวม Debug skills (`debugging-and-error-recovery` + `diagnosing-bugs` ➔ `debug/SKILL.md`)
- **Subtask 2.4**: ยุบรวม Security skills (`security-and-hardening` + `vulnerability-scanner` ➔ `security-review/SKILL.md`)
- **Subtask 2.5**: ยุบรวม Deploy skills (`deployment-procedures` + `shipping-and-launch` ➔ `deploy/SKILL.md`)
- **Subtask 2.6**: ยุบรวม Simplify, Preview, Insight, และ Ideation skills (`simplify`, `preview`, `insight`, `brainstorm`, `prd`)
- **Subtask 2.7**: ลบโฟลเดอร์ Sub-skills ย่อยที่ถูกยุบรวมแล้วออกจาก `.agents/skills/`

### Phase 3: ระบบประวัติ (History) และ Safe Rollback
- **Subtask 3.1**: สร้าง `devflow/history/HISTORY.md`
- **Subtask 3.2**: อัปเดต `70-release/SKILL.md` ให้บันทึก Release Record พร้อม Git Checkpoint
- **Subtask 3.3**: อัปเดต `rollback/SKILL.md` ให้มี Dependency Impact Analysis และ Re-verification Plan

### Phase 4: จัดระเบียบ Scripts และคำสั่งทดสอบ
- **Subtask 4.1**: ย้ายไฟล์ `scripts/test-*.mjs` ไปยัง `scripts/tests/`
- **Subtask 4.2**: ปรับปรุง path ใน `package.json` scripts
- **Subtask 4.3**: ปรับปรุง `scripts/validate-framework.mjs` และ `scripts/check-devflow.mjs`

### Phase 5: Fast-Track Guidelines & Context Update
- **Subtask 5.1**: เพิ่ม Fast-Track (Quick-Fix) rules ใน `devflow/context/coding-standards.md` และ `devflow/context/ai-interaction.md`
- **Subtask 5.2**: อัปเดตสารบัญใน `AGENTS.md` ให้ตรงกับชุด Skills หลังยุบรวม

### Phase 6: การซิงค์และตรวจสอบความสมบูรณ์
- **Subtask 6.1**: รัน `npm run sync:adapters` เพื่อซิงค์ `.agents/` ไปยัง `.claude/`
- **Subtask 6.2**: รัน `node packages/create-nexus-devflow/scripts/prepare-template.js`
- **Subtask 6.3**: รันชุดตรวจสอบทั้งหมด: `npm run check:static`, `npm run check`, `npm test`, `npm run test:package`

---

## 3. แผนการตรวจสอบและเกณฑ์การผ่าน (Verification Strategy)

| Layer | Command | Expected Outcome |
| :--- | :--- | :--- |
| **Static Framework** | `npm run check:static` | ผ่านการตรวจสอบ Skill naming, contract และ manifest |
| **Workspace Integrity** | `npm run check` | ไฟล์และโฟลเดอร์หลักของ DevFlow ครบถ้วน |
| **Installer Unit Tests**| `npm test` | ผ่านการทดสอบ installer package |
| **Package Smoke Test** | `npm run test:package` | จำลองการ pack และติดตั้งสำเร็จใน sandbox |

---

## 4. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
40-implement RUN-008-lean-and-clean-devflow-optimization
```
