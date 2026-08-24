# Phase 60: Delivery Digest Report

- **Running ID**: `RUN-006-standardize-command-naming-and-provider-invocation`
- **Title**: รายงานสรุปการส่งมอบ: ปรับชื่อเรียกคำสั่งและ Stage เป็นชื่อมาตรฐานทางการ ตัด Alias/ชื่อย่อ และอธิบายการเรียกตาม AI Provider
- **Source Spec**: [20-spec.md](20-spec.md)
- **Source Plan**: [30-plan.md](30-plan.md)
- **Source Verify**: [50-verify.md](50-verify.md)
- **Artifact Language**: th
- **Status**: Completed
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. สรุปภาพรวมการส่งมอบ (Executive Summary)

ใน Delivery Run นี้ (`RUN-006`) ได้ดำเนินการปรับปรุงระบบชื่อเรียกคำสั่งและ Stages ทั้งหมดใน Nexus-DevFlow 2.0 ให้เป็น **ชื่อมาตรฐานทางการ (Canonical Name)** เพียงชื่อเดียว และตัดชื่อย่อหรือ Alias ที่สร้างความสับสนออกทั้งหมด พร้อมทั้งจัดทำคำแนะนำ Invocation Guideline อย่างเรียบง่ายว่า รูปแบบการพิมพ์คำสั่งขึ้นอยู่กับ AI Provider / Tool ที่กำลังใช้งาน

---

## 2. สิ่งที่ได้รับการปรับปรุงและส่งมอบ (Key Deliverables)

1. **กำหนด Canonical Name เดี่ยวทุกที่**:
   - Mainline Stages: `00-discover`, `10-define`, `20-spec`, `30-plan`, `40-implement`, `50-verify`, `60-report`, `70-release`
   - Companion Commands: `devflow`, `onboard`, `adopt`, `doctor`, `try`, `rollback`, `ci`, `brief`, `autopilot`, `goal`, `brainstorm`, `research`, `debug`, `prd`, `issue-triage`, `security-review`, `wiki`, `check-for-updates`, `help`
   - ตัด Semantic Aliases / Shorthands เช่น `(discover, /00-discover)` ออกจากการแสดงผลทั้งหมด
2. **คำแนะนำ Provider Invocation Prefix**:
   - เพิ่ม Note Block ในทุกเอกสารหลัก (`AGENTS.md`, `CLAUDE.md`, `README.md`, `README.th.md`):
     - **ชื่อปกติ**: เช่น `00-discover`, `devflow`
     - **Slash Prefix (`/`)**: สำหรับ Claude Code, Google Antigravity, Gemini CLI เช่น `/00-discover`
     - **Dollar Prefix (`$`)**: สำหรับ OpenAI Codex CLI เช่น `$00-discover`
3. **ซิงค์ Skill Adapters & Template**:
   - อัปเดตไฟล์ `SKILL.md` ทั้ง 104 รายการใน `.agents/skills/` และ `.claude/skills/`
   - ซิงค์ Template เข้าสู่ `@jakkrichm/create-nexus-devflow` ครบ 100%
4. **ผ่านการตรวจสอบคุณภาพ 100%**:
   - `npm run check:static` (Passed)
   - `npm run check` (Passed)
   - `npm test` (Passed 3/3)
   - `npm run test:package` (Passed)

---

## 3. เอกสารและอาร์ติแฟกต์ใน Run นี้

- [`00-discover.md`](../../discoveries/DISC-20260818-003-standardize-command-naming-and-provider-invocation/00-discover.md)
- [`10-define.md`](10-define.md)
- [`20-spec.md`](20-spec.md)
- [`30-plan.md`](30-plan.md)
- [`40-implement.md`](40-implement.md)
- [`50-verify.md`](50-verify.md)
- [`60-report.md`](60-report.md)
- [`60-report.html`](60-report.html)

---

## 4. ขั้นตอนถัดไป (Next Stage)

งานใน Run นี้ได้รับการพัฒนาและตรวจสอบ QA ผ่านเรียบร้อยแล้ว พร้อมส่งมอบในขั้นตอน **`70-release`**:

```text
70-release RUN-006-standardize-command-naming-and-provider-invocation
```
