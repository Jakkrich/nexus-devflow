# Implementation Checklist: RUN-008-lean-and-clean-devflow-optimization

- [x] Task 1.1: Remove Graphify script (`scripts/graphify.mjs`) & package scripts
- [x] Task 1.2: Remove Wiki skill (`.agents/skills/wiki/`, `.claude/skills/wiki/`) and references in `AGENTS.md`
- [x] Task 2.1: Consolidate Testing skills into `test/SKILL.md` (TDD, Test Execution, Coverage)
- [x] Task 2.2: Consolidate Review skills into `review/SKILL.md` (PR review, quality standards, 9arm scrutinize)
- [x] Task 2.3: Consolidate Debug skills into `debug/SKILL.md` (Hypothesis testing, non-destructive diagnosis)
- [x] Task 2.4: Consolidate Security skills into `security-review/SKILL.md` (Hardening, OWASP 2025, Vulnerability scanner)
- [x] Task 2.5: Consolidate Deploy skills into `deploy/SKILL.md` (Deployment procedures, shipping & launch)
- [x] Task 2.6: Consolidate Simplify, Preview, Insight, Ideation into `simplify`, `preview`, `insight`, `brainstorm`, `prd`
- [x] Task 2.7: Clean up redundant sub-skill folders in `.agents/skills/`
- [x] Task 3.1: Create `devflow/history/HISTORY.md` master ledger
- [x] Task 3.2: Update `70-release/SKILL.md` to append entry to `HISTORY.md` with Git commit hash/tag
- [x] Task 3.3: Update `rollback/SKILL.md` with Dependency Impact Analysis and Re-verification plan
- [x] Task 4.1: Update scripts and `package.json` scripts
- [x] Task 4.2: Update `scripts/validate-framework.mjs` and `scripts/check-devflow.mjs`
- [x] Task 5.1: Add Fast-Track (Quick-Fix) guidelines to `coding-standards.md` & `ai-interaction.md`
- [x] Task 5.2: Update `AGENTS.md` and `agent-bundle.manifest.json`
- [x] Task 6.1: Run `npm run sync:adapters` to sync `.agents/` to `.claude/`
- [x] Task 6.2: Run template prep and verification tests (`check:static`, `check`, `test`, `test:package`)
