# Phase 10: Define Contract

- **Running ID**: `RUN-006-standardize-command-naming-and-provider-invocation`
- **Title**: ปรับชื่อเรียกคำสั่งและ Stage เป็นชื่อมาตรฐานทางการ ตัด Alias/ชื่อย่อ และอธิบายการเรียกตาม AI Provider
- **Source Discovery**: [DISC-20260818-003-standardize-command-naming-and-provider-invocation](../../discoveries/DISC-20260818-003-standardize-command-naming-and-provider-invocation/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการสำรวจใน [Phase 00 (DISC-20260818-003)](../../discoveries/DISC-20260818-003-standardize-command-naming-and-provider-invocation/00-discover.md) พบว่าการแสดงชื่อคำสั่งในรูปแบบที่มีหลาย Alias ปะปนกัน (เช่น `00-discover (discover, /00-discover)`) หรือการใส่ slash นำหน้าในตารางอ้างอิงหลัก ทำให้ผู้ใช้งานสับสนว่าควรใช้ชื่อใดเป็นทางการ

เพื่อสร้างมาตรฐานที่เรียบง่ายและเป็นเอกภาพ เป้าหมายของ Run นี้คือ:
1. **กำหนด Canonical Name เดี่ยว**: ใช้ชื่อทางการเพียงชื่อเดียวสำหรับทุก Stage และทุก Command (เช่น `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, `70-release`, `devflow`, `onboard`, `adopt`, `doctor`, `try`, `rollback`, `ci`, `brief`, `autopilot` ฯลฯ) โดยตัด alias ย่อ หรือ shorthand aliases ทั้งหมดออกจากการสื่อสารหลัก
2. **ชี้แจง Invocation Rule ตาม AI Provider**: อธิบายอย่างชัดเจนและกระชับในทุกเอกสารว่า รูปแบบการพิมพ์เรียกคำสั่งขึ้นอยู่กับเครื่องมือ/AI Provider ที่ใช้งาน:
   - **Canonical Name**: พิมพ์ชื่อตรงๆ เช่น `00-discover`, `devflow`
   - **Slash Prefix (`/`)**: สำหรับเครื่องมือที่รองรับ Slash Command (Claude Code, Google Antigravity, Gemini CLI) เช่น `/00-discover`
   - **Dollar Prefix (`$`)**: สำหรับเครื่องมืออย่าง OpenAI Codex CLI เช่น `$00-discover`
3. **ปรับปรุงเอกสารและโค้ดทั้งหมด (System-wide Consistency)**: อัปเดต `AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md`, ไฟล์ใน `.agents/skills/`, `.claude/skills/`, เทมเพลต และเอกสารประกอบ

---

## 2. ขอบเขตงาน (In-Scope)

### Phase 1: ปรับปรุง Core Documentation & Instructions
- **`AGENTS.md` & `CLAUDE.md`**:
  - ปรับปรุงหัวข้อ "Timeline Workflow" และ "Invocation Reference"
  - เปลี่ยนตารางคำสั่งให้ระบุเฉพาะ **Canonical Name** และคำอธิบายวิธีการเรียกใช้ตาม AI Provider (Normal, Slash, Dollar)
  - ลบคอลัมน์ Semantic Alias และ Shorthand ที่สร้างความสับสน
- **`README.md` & `README.th.md`**:
  - อัปเดตตารางและคำอธิบาย Workflow Timeline ให้แสดง Canonical Name (`00-discover`, `10-define`, ...) พร้อมข้อความแนะนำว่าการเรียกใช้งาน (พิมพ์ปกติ, `/`, หรือ `$`) ขึ้นอยู่กับ AI Provider ที่ใช้งาน

### Phase 2: ปรับปรุง Skill Adapters & Documentation Links
- ตรวจสอบและอัปเดตไฟล์ `SKILL.md` ใน `.agents/skills/` (เช่น ส่วน Usage, Process, Next Workflow Recommendation) ให้แสดงเฉพาะ Canonical Name เป็นหลัก
- รัน `npm run sync:adapters` เพื่อซิงค์การเปลี่ยนแปลงไปยัง `.claude/skills/`

### Phase 3: ซิงค์ Package Template & ตรวจสอบคุณภาพ
- ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template` ผ่าน `npm run prepare:template`
- รันชุดทดสอบความถูกต้อง (`check:static`, `check`, `test`, `test:package`) ให้ผ่าน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่ลบโฟลเดอร์ Skill ที่มีอยู่แล้ว (ยังคงรักษาความสามารถในการ Route ภายในระบบไว้)
- ไม่แก้ไข Logic ขั้นตอนการทำงานของ Stage ให้ผิดเพี้ยนไปจากมาตรฐาน DevFlow 2.0

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`RUN-006`** | `standardize-command-naming-and-provider-invocation` | กำหนด Canonical Name และอธิบาย Provider Invocation (Normal, `/`, `$`) ในทุกเอกสาร, Skill adapters, และ Template |

---

## 5. เกณฑ์การยอมรับ (Acceptance Criteria)

1. `AGENTS.md`, `CLAUDE.md`, `README.md`, และ `README.th.md` แสดงเฉพาะ Canonical Name สำหรับทุก Mainline Stage และ Companion Command
2. มีข้อความอธิบายชัดเจนว่า รูปแบบการเรียกใช้งานขึ้นอยู่กับ AI Provider (Normal, `/`, `$`) โดยไม่มี Alias หรือ Shorthand ที่สับสน
3. ทุกไฟล์ `SKILL.md` มีการอ้างอิงคำสั่งถัดไปและรูปแบบ Usage อย่างถูกต้องและสอดคล้องกัน
4. `.agents/skills/` และ `.claude/skills/` ซิงค์กัน 100%
5. ผ่านชุดทดสอบทั้งหมด (`npm run check`, `npm run check:static`, `npm test`, `npm run test:package`) 100%

---

## 6. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
20-spec RUN-006-standardize-command-naming-and-provider-invocation
```
