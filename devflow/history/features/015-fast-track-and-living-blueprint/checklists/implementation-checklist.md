# Implementation Checklist: RUN-015

## Phase 1: Fast-Track Skills Development (`spec`, `implement`, `check`, `complete`)
- [x] Task 1.1: สร้าง `.agents/skills/spec/SKILL.md` และ `.claude/skills/spec/SKILL.md` (สร้าง `blueprint.md`, aliases: `/spec`, `/feature`, `/fix`)
- [x] Task 1.2: สร้าง `.agents/skills/implement/SKILL.md` และ `.claude/skills/implement/SKILL.md` (เขียนโค้ดตาม Checklist + TDD และบันทึก Section 4)
- [x] Task 1.3: สร้าง `.agents/skills/check/SKILL.md` และ `.claude/skills/check/SKILL.md` (รัน QA Multi-lane Evidence และบันทึก Section 5)
- [x] Task 1.4: สร้าง `.agents/skills/complete/SKILL.md` และ `.claude/skills/complete/SKILL.md` (Safety Pass, สรุป Release Digest ลง Section 6, ทำ Git Merge โดยไม่มี Auto HTML)

## Phase 2: Disable Auto HTML Report & Standalone `/report:html` Command
- [x] Task 2.1: ปรับปรุง `.agents/skills/60-report/SKILL.md` และ `.claude/skills/60-report/SKILL.md` ให้สร้างเฉพาะ `60-report.md`
- [x] Task 2.2: ปรับปรุง `.agents/skills/70-release/SKILL.md` และ `.claude/skills/70-release/SKILL.md`
- [x] Task 2.3: สร้าง Skill `.agents/skills/report-html/SKILL.md` และ `.claude/skills/report-html/SKILL.md` (alias `/report:html`)
- [x] Task 2.4: เพิ่ม `scripts/report-html.ts` และ npm script `"report:html"` ใน Root `package.json`

## Phase 3: Router (`devflow`), Project Documents & Installer Bundler
- [x] Task 3.1: ปรับปรุง `.agents/skills/devflow/SKILL.md` และ `.claude/skills/devflow/SKILL.md` ให้นำทางทั้ง Fast-Track และ Deep-Track
- [x] Task 3.2: อัปเดต `AGENTS.md` และ `CLAUDE.md` อธิบาย Dual-Track Architecture
- [x] Task 3.3: อัปเดต `scripts/prepare-template.ts` ให้แพ็กรวม Skills ใหม่เข้า installer package

## Phase 4: Full Multi-lane Verification & Routing Evals
- [x] Task 4.1: เพิ่ม test dataset ใน `evals/routing/` สำหรับ `spec`, `implement`, `check`, `complete`, `report-html`
- [x] Task 4.2: รัน `npm run typecheck` (`tsc --noEmit`)
- [x] Task 4.3: รัน `npm run check:static`
- [x] Task 4.4: รัน `npm test` ใน `packages/create-nexus-devflow`
- [x] Task 4.5: รัน `npm run test:routing`
- [x] Task 4.6: รัน `npm run test:package`
- [x] Task 4.7: รัน `npm run check` (All green 100%)
