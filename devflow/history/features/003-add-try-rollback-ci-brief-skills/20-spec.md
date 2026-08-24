# Phase 20: Delivery Specification

- **Running ID**: `RUN-003-add-try-rollback-ci-brief-skills`
- **Title**: ข้อกำหนดการส่งมอบ: เพิ่ม 4 High-Value Companion Skills (`try`, `rollback`, `ci`, `brief`) ใน Nexus-DevFlow
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Draft -> Ready for Planning
- **Created Date**: 2026-08-18
- **Owner**: DevFlow Core Team

---

## 1. บทสรุปข้อกำหนด (Specification Summary)

สเปกนี้กำหนดรายละเอียดฟังก์ชันและมาตรฐานสำหรับ 4 Companion Skills ชุดใหม่ที่พอร์ตและปรับปรุงจาก Nexus Blueprint ให้เข้ากับสถาปัตยกรรม DevFlow 2.0:
1. **`try`**: สร้างคู่มือทดสอบด้วยมือ (Manual QA Walkthrough) แบบ Step-by-Step ให้ผู้ใช้และ Tester
2. **`rollback`**: วางแผนย้อนกลับ/ถอนฟีเจอร์อย่างปลอดภัย (Safe Feature Reversal) โดยตรวจสอบ Dependency และ Later Commits
3. **`ci`**: ตั้งค่า GitHub Actions Pipeline (`.github/workflows/verify.yml`) อัตโนมัติจาก Verify Command จริงของโปรเจกต์
4. **`brief`**: สรุปขอบเขต ความเสี่ยง และ Dependency แบบ Read-only ก่อนเริ่มเขียน Spec (`/20-spec`)

---

## 2. ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements)

### REQ-1: Skill `try` (Manual QA Walkthrough Guide)
- **ตำแหน่งไฟล์**: `.agents/skills/try/SKILL.md` และ `.claude/skills/try/SKILL.md`
- **พฤติกรรม**:
  - เป็นคำสั่งแบบ **Read-only 100%** (ไม่แก้โค้ด ไม่ commit ไม่ push)
  - อ่านบริบทจาก Active Run (`devflow/context/current-stage.md`, `20-spec.md`, `40-implement.md`, `50-verify.md`) หรือระบุ Run ID / Path เจาะจง
  - สรุปแนวทางการทดสอบ 5 ส่วนมาตรฐาน:
    1. **Start**: คำสั่งสำหรับรันแอปพลิเคชัน (ดึงจาก `AGENTS.md`)
    2. **Open**: หน้าจอ / URL / Route / Endpoint / CLI ที่ต้องเปิด
    3. **Do**: สิ่งที่ต้องคลิก ป้อนข้อมูล หรือเลือก
    4. **Expect**: ผลลัพธ์ที่ถูกต้องและพฤติกรรมที่คาดหวัง
    5. **Watch For**: สิ่งผิดปกติที่ต้องระวัง (Error cases, layout bugs, console warnings)

### REQ-2: Skill `rollback` (Safe Feature Reversal Planner)
- **ตำแหน่งไฟล์**: `.agents/skills/rollback/SKILL.md` และ `.claude/skills/rollback/SKILL.md`
- **พฤติกรรม**:
  - ระบุ Run ID หรือฟีเจอร์ที่ต้องการย้อนกลับ (จาก `devflow/runs/{run-id}` และ Git history)
  - ตรวจสอบ Git Commit ที่สร้างฟีเจอร์นั้น และสแกน Commits หลังจากนั้นว่ามีการแตะไฟล์เดียวกันหรือไม่ (Dependency Risk Classification: No overlap, Overlap compatible, Dependency risk, Blocked)
  - แยกไฟล์ Product ออกจากไฟล์ Workflow (ไม่ลบประวัติหรือ schema ของ DevFlow)
  - สร้างแผน Reversal Plan อย่างปลอดภัยก่อนส่งต่อให้เข้าสู่กระบวนการ Implement/Verify/Release

### REQ-3: Skill `ci` (Automated GitHub Actions Setup)
- **ตำแหน่งไฟล์**: `.agents/skills/ci/SKILL.md` และ `.claude/skills/ci/SKILL.md`
- **พฤติกรรม**:
  - ตรวจจับ Stack, Package Manager และคำสั่ง Verify จาก `AGENTS.md` / `package.json`
  - สร้างไฟล์ `.github/workflows/verify.yml` ที่มีมาตรฐานความปลอดภัย:
    - Trigger บน `pull_request` และ `push` to default branch
    - กำหนด Permissions แบบ Least Privilege (`contents: read`)
    - รัน dependency install แบบ lockfile-safe
    - รันคำสั่ง Verify เดียวกันกับที่รันบน Local
  - ไม่บังคับเพิ่ม git hooks หรือ matrix ที่ซับซ้อนโดยไม่จำเป็น

### REQ-4: Skill `brief` (Scope & Dependency Pre-Check)
- **ตำแหน่งไฟล์**: `.agents/skills/brief/SKILL.md` และ `.claude/skills/brief/SKILL.md`
- **พฤติกรรม**:
  - เป็นคำสั่งแบบ **Read-only**
  - อ่านบริบทจาก `devflow/context/project-overview.md` และ Run ที่กำลังจะเริ่ม
  - สรุป What, Depends on, Unblocks, Touches, Estimated Size (S/M/L/XL), และ Open Questions
  - จบด้วยคำแนะนำ Next Action ที่ชัดเจน (เช่น `/20-spec {run-id}`)

### REQ-5: Router, Multi-Agent & Ecosystem Integration
- อัปเดต [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) และ [CLAUDE.md](file:///d:/Projects/devtools/nexus-devflow/CLAUDE.md) บรรจุทั้ง 4 คำสั่งในตาราง Companion Commands และ Invocation Schemes
- อัปเดต Router Skill [devflow](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md) ให้ตรวจจับและแนะนำทั้ง 4 คำสั่งตามบริบท
- ซิงค์ Adapters ผ่าน `npm run sync:adapters`

### REQ-6: Installer Package Template & Documentation Alignment
- อัปเดต `packages/create-nexus-devflow/scripts/prepare-template.js` และสร้าง Template ที่สะอาด
- อัปเดตเอกสารคู่มือการใช้งาน: [docs/USAGE.md](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md), [docs/workflow-surface-map.md](file:///d:/Projects/devtools/nexus-devflow/docs/workflow-surface-map.md), [README.md](file:///d:/Projects/devtools/nexus-devflow/README.md), [README.th.md](file:///d:/Projects/devtools/nexus-devflow/README.th.md)

---

## 3. เกณฑ์การยอมรับ (Verifiable Acceptance Criteria)

- **AC-1**: มีไฟล์ `SKILL.md` สมบูรณ์สำหรับ `try`, `rollback`, `ci`, `brief` ทั้งใน `.agents/skills/` และ `.claude/skills/` (Parity 100%)
- **AC-2**: ทุก Skill มีคำอธิบาย Frontmatter และคำแนะนำการใช้งานภาษาไทย (`artifact_language: "th"`)
- **AC-3**: `AGENTS.md` และ `CLAUDE.md` มีตาราง Companion Commands ที่ระบุชื่อย่อ, วิธีเรียกใช้งานสำหรับ Antigravity, Codex, Claude Code, และทั่วไป
- **AC-4**: Router `devflow` สามารถแนะนำ `try` หลังจบ Verify/Implement, แนะนำ `brief` ก่อนเข้า Spec, แนะนำ `ci` หลัง Onboard, และแนะนำ `rollback` เมื่อต้องการย้อนกลับ
- **AC-5**: รัน `npm run check:static` ผ่าน 100% (ตรวจสอบครบทุก Skills รวมเป็น 103 skills)
- **AC-6**: รัน `npm test` และ `npm run test:package` ผ่าน 100%

---

## 4. ข้อจำกัดและสิ่งที่ไม่เปลี่ยนแปลง (Constraints & Invariants)

- โครงสร้าง Mainline 8 Stages (`00` ➔ `70`) ต้องไม่ถูกเปลี่ยนหรือกระทบกระเทือน
- คำสั่ง `try` และ `brief` ต้องเป็น Read-only 100% เสมอ
- การสร้าง `.github/workflows/verify.yml` ผ่าน `ci` จะไม่ทำ Git push หรือเปลี่ยน Ruleset บน Remote โดยพลการ

---

## 5. คำสั่งขั้นตอนถัดไป (Next Stage Command)

```text
/30-plan RUN-003-add-try-rollback-ci-brief-skills
หรือ
30-plan RUN-003-add-try-rollback-ci-brief-skills
```
