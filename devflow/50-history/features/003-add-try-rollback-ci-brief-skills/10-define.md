# Phase 10: Define Contract

- **Running ID**: `RUN-003-add-try-rollback-ci-brief-skills`
- **Title**: เพิ่ม High-Value Companion Skills จาก Blueprint (`try`, `rollback`, `ci`, `brief`) เข้าสู่ Nexus-DevFlow
- **Source Discovery**: Direct Human Initiative (Blueprint Adaptation & Gap Analysis)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการวิเคราะห์สถาปัตยกรรมเปรียบเทียบระหว่าง Nexus Blueprint และ Nexus-DevFlow 2.0 พบว่ายังมีกระบวนการสำคัญ 4 ด้านที่ DevFlow สามารถยกระดับความสามารถได้อย่างก้าวกระโดด:

1. **Manual QA & User Review Guide (`/try`)**: ในปัจจุบัน DevFlow มีการตรวจ QA อัตโนมัติใน `/50-verify` แต่ยังขาดเครื่องมือสรุปคู่มือการทดสอบด้วยมือ (Manual QA Guide) ให้มนุษย์/Tester รู้ว่า *"ต้องเปิด URL ไหน คลิกอะไร กรอกข้อมูลอะไร และคาดหวังผลลัพธ์แบบใด"*
2. **Safe Feature Reversal & Rollback Planner (`/rollback`)**: เมื่อส่งมอบงานผ่าน `/70-release` ไปแล้ว หากจำเป็นต้องถอนฟีเจอร์หรือแก้ไขเร่งด่วน ยังขาดคำสั่งวางแผนถอนโค้ดอย่างปลอดภัยโดยตรวจจับ Dependency และผลกระทบต่อ Run อื่นๆ
3. **Automated CI Setup (`/ci`)**: ขาดเครื่องมือช่วยตรวจจับ Verify Command ของโปรเจกต์ และสร้าง `.github/workflows/verify.yml` ให้โดยอัตโนมัติ
4. **Pre-Spec Scope & Dependency Briefing (`/brief`)**: ขาดเครื่องมือสรุปสโคป ความเสี่ยง และ Dependency แบบ Read-only ก่อนลงมือเขียนสเปกใน `/20-spec`

เป้าหมายของ Run นี้คือการสร้างและผสาน 4 Companion Skills: `try`, `rollback`, `ci`, และ `brief` เข้าสู่ Ecosystem ของ DevFlow 2.0 อย่างสมบูรณ์

---

## 2. ขอบเขตงาน (In-Scope)

### Phase 1: ออกแบบและสร้าง Skill `try` (Manual QA Guide)
- สร้าง `.agents/skills/try/SKILL.md` และ `.claude/skills/try/SKILL.md`
- อ่านบริบทจาก `20-spec.md`, `40-implement.md`, `50-verify.md` หรือ `current-stage.md`
- สร้างคู่มือทดสอบแบบ Step-by-Step (Where to go, What to click/input, What to expect)
- มีคำแนะนำการทดสอบทั้ง Happy Path และ Edge Cases / Error Cases
- นำทางให้ผู้ใช้ตรวจงานจริงก่อนจบ `/50-verify` หรือ `/60-report`

### Phase 2: ออกแบบและสร้าง Skill `rollback` (Safe Reversal Planner)
- สร้าง `.agents/skills/rollback/SKILL.md` และ `.claude/skills/rollback/SKILL.md`
- สแกนประวัติการส่งมอบจาก `devflow/runs/{run-id}` และ Git history
- ตรวจสอบ Later Dependencies (ว่ามีฟีเจอร์หลังๆ ผูกกับโค้ดชุดนี้หรือไม่)
- สร้างแผนการย้อนกลับอย่างปลอดภัย (Reversal Plan) ก่อนแตะต้องโค้ดจริง
- บันทึกประวัติการ Rollback อย่างเป็นระบบ

### Phase 3: ออกแบบและสร้าง Skill `ci` (Automated GitHub Actions Pipeline)
- สร้าง `.agents/skills/ci/SKILL.md` และ `.claude/skills/ci/SKILL.md`
- ตรวจสอบคำสั่ง Verify ใน `AGENTS.md` และ `package.json`
- สร้างไฟล์ `.github/workflows/verify.yml` ที่ได้มาตรฐานความปลอดภัย (Least Privilege `contents: read`)
- รองรับการรันอัตโนมัติบน Pull Requests และ Push to Main

### Phase 4: ออกแบบและสร้าง Skill `brief` (Scope & Risk Pre-Check)
- สร้าง `.agents/skills/brief/SKILL.md` และ `.claude/skills/brief/SKILL.md`
- วิเคราะห์ขนาดของงาน (S/M/L/XL), Dependencies, และความเสี่ยงแบบ Read-only
- ช่วยให้ผู้ใช้และ AI เห็นภาพรวมก่อนเขียน `20-spec.md`

### Phase 5: ผสานรวมระบบ, Template และเอกสาร (Integration & Documentation)
- อัปเดต [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) และ [CLAUDE.md](file:///d:/Projects/devtools/nexus-devflow/CLAUDE.md) เพิ่ม 4 คำสั่งในตาราง Companion Commands
- ปรับปรุง Router Skill [devflow](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md) ให้รู้จักและแนะนำ 4 คำสั่งนี้
- ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
- อัปเดตคู่มือ [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md), [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)

### Phase 6: Verification & Quality Gate
- รัน `npm run check:static`, `npm run check`, `npm test`, และ `npm run test:package` ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่เปลี่ยนลำดับหมายเลขของ Mainline Stages (00 -> 10 -> 20 -> 30 -> 40 -> 50 -> 60 -> 70 ยังคงเดิม)
- ไม่ทำการ Push หรือ Deploy ไปยัง Remote Server โดยไม่ได้รับคำสั่ง
- ไม่สร้าง Git hook อัตโนมัติที่รบกวนการทำงานปกติ

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-003`** | `add-try-rollback-ci-brief-skills` | เพิ่ม 4 High-Value Companion Skills (`try`, `rollback`, `ci`, `brief`) พร้อมผสานรวม Router, Adapters, Template, และเอกสารทั้งหมด |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. มี Skills ครบทั้ง 4 ตัวใน `.agents/skills/` และ `.claude/skills/`
2. `AGENTS.md`, `CLAUDE.md`, และ `devflow` Router อัปเดตครอบคลุมทุกคำสั่ง
3. ทุก Skill มีเอกสารคำแนะนำชัดเจน ภาษาเริ่มต้นเป็นภาษาไทย (`artifact_language: "th"`)
4. ผ่านชุดทดสอบทั้งหมด (`check:static`, `check`, `test`, `test:package`) 100%

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/20-spec RUN-003-add-try-rollback-ci-brief-skills
หรือ
20-spec RUN-003-add-try-rollback-ci-brief-skills
```
