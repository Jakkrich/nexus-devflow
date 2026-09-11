# Phase 40: Implement - RUN-015: Fast-Track (Blueprint Mode) & Living Spec

## Summary of Implementation

ได้ดำเนินการสร้างและปรับปรุงสถาปัตยกรรม **Dual-Track Delivery Model** สำหรับ Nexus-DevFlow 2.0 พร้อมระบบ **Single Living Spec (`blueprint.md`)** และปรับนโยบาย **Standalone HTML Reporting** ตามที่เจ้านายได้สั่งการไว้อย่างสมบูรณ์:

### 1. Fast-Track Skills (`spec`, `implement`, `check`, `complete`)
- **`spec` (`/spec`, `/feature`, `/fix`)**: สร้าง Living Spec (`blueprint.md`) รวบขั้นตอน 00, 10, 20, 30 เป็นเอกสารสัญญาฉบับเดียว
- **`implement` (`/implement`)**: ดำเนินการเขียนโค้ดตาม Checklist งาน พร้อม TDD และบันทึกลง Section 4 ใน `blueprint.md`
- **`check` (`/check`)**: รัน QA multi-lane verification (Typecheck, Lint, Test, Manual proof) และบันทึกลง Section 5 ใน `blueprint.md`
- **`complete` (`/complete`)**: ดำเนินการ Safety Pass, สรุป Release Digest ลง Section 6 ใน `blueprint.md` และทำ Git Merge

### 2. Standalone HTML Reporting Policy
- ปรับปรุง `60-report` และ `/complete` ให้ออกเฉพาะเอกสาร Markdown (`60-report.md` / `blueprint.md`) **ห้าม auto-generate HTML ใน mainline เด็ดขาด**
- สร้าง Skill และ Command ใหม่: `/report:html` (หรือ `npm run report:html -- {RUNNING_ID}`) สำหรับสร้าง HTML dashboard แบบ standalone เมื่อผู้ใช้สั่งเท่านั้น
- อัปเกรด `scripts/lib/render-html/stage-adapters/report-stage.mjs` ให้รองรับทั้ง Fast-Track (`blueprint.md`) และ Deep-Track (`60-report.md`)

### 3. Router & Documentation
- อัปเดต `devflow` Router ทั้ง `.agents/` และ `.claude/` ให้นำทางแบบ Dual-Track และ State-Aware Inspection
- อัปเดต `AGENTS.md` และ `CLAUDE.md` อธิบายโครงสร้าง Fast-Track (4 ขั้นตอน) และ Deep-Track (8 ขั้นตอน)

### 4. Verification & Testing
- เพิ่ม Routing evals ใน `evals/routing/` (`spec.json`, `implement.json`, `check.json`, `complete.json`, `report-html.json`)
- ผ่าน `npm run typecheck`, `npm run check:static`, `npm test`, `npm run test:routing` (100.00% accuracy), `npm run test:package`, และ `npm run check` All Green 100%
