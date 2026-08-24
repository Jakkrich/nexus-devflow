# Implementation Checklist: RUN-002-add-onboard-adopt-doctor-skills

- **Running ID**: `RUN-002-add-onboard-adopt-doctor-skills`
- **Title**: แผนการดำเนินงานสร้าง Setup & Diagnostics Companion Skills (`onboard`, `adopt`, `doctor`)
- **Status**: Ready for Implementation
- **Last Updated**: 2026-08-18

---

## Phase 1: สร้าง Skill `onboard` (Fresh Project Setup)

- [x] **Task 1.1**: สร้าง `.agents/skills/onboard/SKILL.md` พร้อมขั้นตอนการสำรวจและจูนสภาพแวดล้อมโปรเจกต์ใหม่
- [x] **Task 1.2**: สร้าง `.claude/skills/onboard/SKILL.md` ให้มี Parity 100% กับ `.agents`

---

## Phase 2: สร้าง Skill `adopt` (Brownfield Ingestion)

- [x] **Task 2.1**: สร้าง `.agents/skills/adopt/SKILL.md` พร้อมระบบ Read-only Survey และ Intent Interview
- [x] **Task 2.2**: สร้าง `.claude/skills/adopt/SKILL.md` ให้มี Parity 100% กับ `.agents`

---

## Phase 3: สร้าง Skill `doctor` (Health Check & Diagnostics)

- [x] **Task 3.1**: สร้าง `.agents/skills/doctor/SKILL.md` พร้อมการตรวจ Context, Scripts, Adapters, และ Drift
- [x] **Task 3.2**: สร้าง `.claude/skills/doctor/SKILL.md` ให้มี Parity 100% กับ `.agents`

---

## Phase 4: อัปเดต Router `devflow`, `AGENTS.md`, `CLAUDE.md`, Template & Docs

- [x] **Task 4.1**: เพิ่ม `onboard`, `adopt`, `doctor` ลงใน [AGENTS.md](file:///d:/Projects/devtools/nexus-devflow/AGENTS.md) และ [CLAUDE.md](file:///d:/Projects/devtools/nexus-devflow/CLAUDE.md)
- [x] **Task 4.2**: ปรับปรุง Router Skill [devflow](file:///d:/Projects/devtools/nexus-devflow/.agents/skills/devflow/SKILL.md) และ `.claude/skills/devflow/SKILL.md`
- [x] **Task 4.3**: ซิงค์เทมเพลตไปยัง `packages/create-nexus-devflow/template` ผ่าน `prepare-template.js`
- [x] **Task 4.4**: อัปเดตเอกสาร `docs/USAGE.md`, `docs/workflow-surface-map.md`, `README.md`, `README.th.md`

---

## Phase 5: Verification & Final Quality Gate

- [x] **Task 5.1**: รัน `npm run check`
- [x] **Task 5.2**: รัน `npm run check:static`
- [x] **Task 5.3**: รัน `npm test` และ `npm run test:package`
