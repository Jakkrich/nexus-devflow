# Implementation Checklist: RUN-014

## Phase 1: Upstream Monitor Migration & Cleanup
- [x] Task 1.1: เพิ่ม `.github/workflows/check-upstream.yml` ใน `nexus-devflow`
- [x] Task 1.2: เพิ่ม `scripts/upstream-monitor.ts`, `scripts/update-upstream-issue.ts`, `scripts/lib/upstream-monitor.ts`, `scripts/lib/validate-upstream-monitor.ts` ใน `nexus-devflow`
- [x] Task 1.3: เพิ่ม `.nexus/upstream-ai-blueprint.json` บันทึก Baseline Tracking
- [x] Task 1.4: เพิ่ม Maintainer Skill `sync-upstream` ใน `.agents/skills/` และ `.claude/skills/` ของ DevFlow
- [x] Task 1.5: ถอด `.github/workflows/check-upstream.yml` ออกจาก `nexus-blueprint`

## Phase 2: Installer Package TypeScript Conversion (`packages/create-nexus-devflow`)
- [x] Task 2.1: สร้าง `packages/create-nexus-devflow/tsconfig.json` (`outDir: "dist"`)
- [x] Task 2.2: ปรับปรุง `packages/create-nexus-devflow/package.json`
- [x] Task 2.3: แปลง `bin/create-nexus-devflow.ts`, `lib/update.ts`, `lib/starter-templates.ts`
- [x] Task 2.4: แปลง `scripts/prepare-template.ts` และ `scripts/clean-template.ts`
- [x] Task 2.5: แปลง `test/update.test.ts` และทดสอบ `npm test`

## Phase 3: Root Maintainer Tooling & Verification Matrix
- [x] Task 3.1: สร้าง Root `tsconfig.json` ใน `nexus-devflow`
- [x] Task 3.2: อัปเดต Root `package.json` devDependencies และ verification scripts
- [x] Task 3.3: แปลง Runner Scripts (`check-devflow.ts`, `validate-framework.ts`, `smoke-package.ts`)
- [x] Task 3.4: แปลงและปรับปรุง `scripts/evals/routing.ts` และ `routing.test.ts`

## Phase 4: Full Multi-lane Verification & Reporting
- [x] Task 4.1: รัน `npm install` และตรวจสอบ Dependencies
- [x] Task 4.2: รัน `npm run typecheck` (`tsc --noEmit`)
- [x] Task 4.3: รัน `npm run check:static`
- [x] Task 4.4: รัน `npm test` ใน `create-nexus-devflow`
- [x] Task 4.5: รัน `npm run test:routing`
- [x] Task 4.6: รัน `npm run test:package`
- [x] Task 4.7: รัน `npm run check`
- [x] Task 4.8: จัดทำเอกสาร `50-verify.md`, `60-report.md`, `60-report.html`
