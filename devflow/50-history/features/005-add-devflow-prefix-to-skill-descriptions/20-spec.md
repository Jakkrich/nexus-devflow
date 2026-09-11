# Phase 20: Delivery Specification

- **Running ID**: `RUN-005-add-devflow-prefix-to-skill-descriptions`
- **Title**: ข้อกำหนดการเพิ่ม Prefix `[Devflow]` ใน Description ของทุก Skill และทบทวนคำอธิบายให้ถูกต้องสมบูรณ์
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาการส่งมอบ (Delivery Contract) สำหรับการอัปเดตฟิลด์ `description` ใน YAML frontmatter ของทุก Skill (104 Skills) ในระบบ Nexus-DevFlow 2.0 ให้ขึ้นต้นด้วย Prefix มาตรฐาน **`[Devflow]`** พร้อมทั้งทบทวนและเขียนคำอธิบายใหม่สำหรับ Skills ที่มีคำอธิบายสั้นหรือยังไม่ครอบคลุม เพื่อเพิ่มประสิทธิภาพการค้นหาและเรียกใช้งานของ AI Coding Agents

---

## 2. ข้อกำหนดฟังก์ชันหลัก (Core Functional Requirements)

### REQ-1: มาตรฐาน Prefix `[Devflow]`
- ทุกไฟล์ `SKILL.md` ใน `.agents/skills/` (104 Skills) และ `.claude/skills/` ต้องมีฟิลด์ `description:` ที่ขึ้นต้นด้วย `[Devflow]` เสมอ
- หาก Description เดิมมีคำว่า `"[Devflow] ..."` หรือ `"[DevFlow] ..."` ให้จัดระเบียบเป็น `"[Devflow] ..."` รูปแบบเดียวกันทั้งหมด

### REQ-2: ทบทวนและปรับปรุงคำอธิบายที่สั้นเกินไป (Review & Expand Descriptions)
- ปรับปรุง Skills ที่เดิมมีคำอธิบายสั้นเพียงไม่กี่คำ ให้ระบุ Action, Purpose, และ Trigger Intent ชัดเจน เช่น:
  - `debug` ➔ `"[Devflow] Root cause investigation and diagnostic loop before or during implementation without editing code. Use when encountering broken behavior, test failures, or bugs."`
  - `test` ➔ `"[Devflow] Test execution, missing test generation, and coverage analysis across unit, integration, and smoke test suites."`
  - `prd` ➔ `"[Devflow] Product Requirements Document drafting, user story mapping, and feature scoping before delivery commitment."`
  - `simplify` ➔ `"[Devflow] Code simplification and refactoring for clarity and maintainability without altering runtime behavior."`
  - `preview` ➔ `"[Devflow] Local preview server management, smoke-check, and temporary runtime inspection before formal verification."`
  - `goal` ➔ `"[Devflow] High-level goal routing and open-ended request intake before entering the 00-discover stage."`
  - `followup` ➔ `"[Devflow] Followup task tracking, post-verification iteration, and routing unresolved items to subsequent runs."`
  - `changelog` ➔ `"[Devflow] Update CHANGELOG.md automatically from specs, git commits, and stage report history."`
  - `deploy` ➔ `"[Devflow] Production deployment pre-flight checks, smoke validation, and deployment execution."`
  - `pr` ➔ `"[Devflow] Pull Request creation with automated change summaries, verification evidence, and linked stage artifacts."`
  - `merge` ➔ `"[Devflow] Safe PR branch merge into base branch, cleanup, and release readiness check."`
  - `insight` ➔ `"[Devflow] Extract reusable lessons, patterns, file insights, and post-mortem learning from completed work."`
  - `agent` ➔ `"[Devflow] Invoke specialist persona or role-based agent on a target file, folder, stage artifact, or concern."`

### REQ-3: Automated Scripting & Preservation
- สร้างสคริปต์ `scripts/update-skill-descriptions.mjs` เพื่อประมวลผลการอัปเดตอย่างแม่นยำ
- ต้องรักษา YAML frontmatter fields อื่นๆ (`name`, `argument-hint`, etc.) และเนื้อหา Markdown Body เดิมไว้ครบถ้วน 100%

### REQ-4: Ecosystem Parity & Sync
- ซิงค์ไปยัง `.claude/skills/` ผ่าน `npm run sync:adapters`
- ซิงค์ไปยัง `packages/create-nexus-devflow/template/` ผ่าน `prepare-template.js`

### REQ-5: Verification Matrix
- ผ่าน `npm run check:static` (ตรวจ 104 skills)
- ผ่าน `npm run check`
- ผ่าน `npm test`
- ผ่าน `npm run test:package`

---

## 3. สิ่งที่อยู่นอกขอบเขต (Explicit Out-of-Scope)

- ไม่เปลี่ยนชื่อ `name:` ของ Skill
- ไม่แก้ไขไฟล์ Markdown Body ด้านล่าง YAML frontmatter

---

## 4. เกณฑ์การยอมรับ (Acceptance Criteria)

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-1** | Prefix Enforcement | 100% ของไฟล์ `SKILL.md` ทั้งใน `.agents/skills/` และ `.claude/skills/` มี `description` ขึ้นต้นด้วย `[Devflow]` |
| **AC-2** | Description Quality | ไม่มี Skill ใดที่มีคำอธิบายสั้นเพียง 1-3 คำที่ไร้ประโยชน์ต่อ Agent |
| **AC-3** | Parity Sync | `.agents/skills/` และ `.claude/skills/` มีเนื้อหาตรงกัน 1:1 |
| **AC-4** | Test Suite Pass | `npm run check:static`, `npm run check`, `npm test`, `npm run test:package` ผ่าน 100% |

---

## 5. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/30-plan RUN-005-add-devflow-prefix-to-skill-descriptions
```
