# Implementation Checklist: RUN-007-integrate-blueprint-skills-enhancements

## Phase 1: ยกระดับ Stage Contracts & Standards
- [x] **Task 1.1**: อัปเดต `.agents/skills/50-verify/SKILL.md` (Findings Ledger State Machine, Empirical Proof, Try Guide)
- [x] **Task 1.2**: อัปเดต `.agents/skills/60-report/SKILL.md` (Try Guide Inclusion & Findings Ledger Digest)
- [x] **Task 1.3**: อัปเดต `.agents/skills/70-release/SKILL.md` (Step 0 Safety Pass, Approval Separation, Findings Archival)
- [x] **Task 1.4**: อัปเดต `devflow/context/coding-standards.md` (Findings Ledger & Empirical Proof Standards)

## Phase 2: ซิงค์ Tool Adapters & Package Template
- [x] **Task 2.1**: ซิงค์ Adapters ไปยัง `.claude/skills/` (`npm run sync:adapters`)
- [x] **Task 2.2**: ซิงค์ Package Template (`node packages/create-nexus-devflow/scripts/prepare-template.js`)

## Phase 3: การตรวจสอบและทดสอบคุณภาพ (Verification)
- [x] **Task 3.1**: รัน `npm run check:static`
- [x] **Task 3.2**: รัน `npm run check`
- [x] **Task 3.3**: รัน `npm test`
- [x] **Task 3.4**: รัน `npm run test:package`
