# Phase 70: Release - RUN-015: Fast-Track (Blueprint Mode) & Living Spec

## Release Summary

- **Delivered Scope**: Dual-Track Architecture (Fast-Track 4 Steps & Deep-Track 8 Steps), Single Living Spec (`blueprint.md`), Standalone HTML Report Policy (`/report:html`), และ Updated Framework Tooling
- **Status**: Released & Integrated
- **Date**: 2026-08-20

## Changelog & Highlights

### Added
- Fast-Track Skills: `spec` (`/spec`, `/feature`, `/fix`), `implement` (`/implement`), `check` (`/check`), `complete` (`/complete`) ใน `.agents/skills/` และ `.claude/skills/`
- Standalone HTML Report Skill: `report-html` (`/report:html`)
- Routing Evaluation Fixtures: `evals/routing/spec.json`, `implement.json`, `check.json`, `complete.json`, `report-html.json`

### Changed
- ปรับปรุง `60-report` และ `70-release` ยกเลิกการ auto-generate `60-report.html` หรือ `report.html` ใน Mainline
- อัปเกรด `scripts/lib/render-html/stage-adapters/report-stage.mjs` รองรับการเรนเดอร์ทั้ง `blueprint.md` และ `60-report.md`
- อัปเดต `AGENTS.md`, `CLAUDE.md`, และ `devflow` Router ให้นำทางครอบคลุมทั้ง 2 แทร็ก

## Verification Evidence
- `npm run check` All Green 100%
- Rank 1 Match Accuracy: 100.00% across 300 test cases
