# AI_HANDOFF — `nexus-devflow`

Project governance and handoff hub for **Nexus-DevFlow maintainers**. Active task board and Chief of Staff status live in [`.context/cos-board.md`](./.context/cos-board.md).

## 0. Start here

1. Read [`.context/cos-board.md`](./.context/cos-board.md) and `AI_HANDOFF.md` §1–§2 plus the top 3 entries of §5.
2. Check §2 (`Active Lock`) and `.context/cos-board.md` so you do not overwrite files owned by another active agent.
3. Read §3–§4 as needed for architecture, pitfalls, and open tech debt.

## 1. Current State (update on every change)

| Field | Value |
|---|---|
| Repository / Owner | `Jakkrich/nexus-devflow` (branch `main`, version `3.0.0`) |
| Last known commit | `v3.0.0` release merge from `feat/devflow-v3-pstack-rework` (`2bc54c9`) |
| Runtime / Stack | Node.js `>=18.17`, TypeScript `^5.7.2` (ESM), zero-runtime-dep installer CLI (`packages/create-nexus-devflow` + wrapper `packages/nexus-devflow`), Playwright (optional browser tests) |
| Build command | `npm --prefix packages/create-nexus-devflow run build` (`npm run build:docs`, `npm run overview`) |
| Test / Verify command | `npm run check && npm test && npm run check:release` |
| Deploy | Maintainer release via `/publish-devflow` (`npm run release:tag` + GitHub Actions NPM publish on tag; requires explicit user authorization) |

### Repo Invariants (never break)

- **Maintainer vs End-User Template Boundary:** Never leak `agent-starter-kit` files (`.agents/tools/`, `.agents/docs/`, `.agents/assets/`, `.agents/rules/`, `.agents/plugins/`, `.agents/.cache/`, `.agents/.backup/`, `.agents/starter-kit.json`, `.agents/.gitignore`, `.agents/skills/{chief-of-staff,make-bot-ui,verify-project}`, `AI_HANDOFF.md`, `GEMINI.md`, `.context/`) or `<!-- BEGIN AGENT-STARTER-KIT -->` marker blocks into `packages/create-nexus-devflow/template/` or published npm tarballs.
- **4-Way SemVer Lockstep:** `package.json`, `packages/create-nexus-devflow/package.json`, `packages/nexus-devflow/package.json` (plus its `@jakkrichm/create-nexus-devflow` dependency), and `.nexus/nexus-devflow.json` must always share the exact same version.
- **15 Core Skills & Adapter Sync:** `agent-bundle.manifest.json` `core_skills` (15 Core Skills) must stay synchronized across `.agents/skills` and `.claude/skills` (`npm run sync:adapters`) and match documented skill counts in `README.md`, `README.th.md`, `packages/create-nexus-devflow/README.md`, and `scripts/data/workflow-pages.ts`.
- **Budgets & Forbidden Legacy Paths:** `AGENTS.md` must remain `<= 8,000 bytes`; skills `<= 32 KB` / support `.md` `<= 24 KB`; never create `.cursor/` or `.windsurf/`; never edit `devflow/.state/run.json` directly (use `run-state.mjs`).
- **Default Artifact Language & Git Gates:** Stage artifacts and user communication default to Thai (`th`); commit, merge, push, and publish always require explicit user authorization.
- **Verification Gate:** Run `.agents/skills/verify-project/SKILL.md` (`npm run check`, `npm test`, `npm run check:release`) before reporting any task complete.

## 2. Active Lock (avoid agent conflicts)

| Agent | Since | Task | Files touched |
|---|---|---|---|
| — | — | no active tasks | — |

## 3. Architecture & Known Pitfalls

- **Entry points & load order:**
  - Root `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` carry `<!-- BEGIN AGENT-STARTER-KIT -->` blocks for repo maintainers; `AGENTS.md` is the canonical DevFlow rule file imported by `CLAUDE.md`.
  - Maintainer scripts live in `scripts/` (`check-devflow.ts`, `validate-framework.ts`, `check-release-readiness.ts`, `check-skill-budgets.mjs`, `evals/routing.ts`, `smoke-package.ts`, `overview.ts`, `sync-adapters.js`).
  - Published packages live in `packages/create-nexus-devflow/` (`bin/`, `lib/`, `scripts/prepare-template.ts`, `test/`) and `packages/nexus-devflow/` (unscoped wrapper).
  - Opt-in user/team skills live in `extras/skills/` (8 skills bundled into `packages/create-nexus-devflow/extras/` during pack).
  - Formal TLA+ / concurrency isolation specs & checks live in `formal/`.
- **State / Persistence:**
  - End-user DevFlow state uses Markdown/JSON contracts under `devflow/` and `.nexus/nexus-devflow.json`.
  - Maintainer starter-kit state uses `AI_HANDOFF.md`, `.context/cos-board.md`, `.agents/starter-kit.json`, and gitignored `.agents/plugins/pstack/` + `.agents/.cache/`.
- **Known pitfalls:**
  - `packages/create-nexus-devflow/scripts/prepare-template.ts` is the sole filter/sanitizer for `template/`; do not tighten `shouldIncludeTemplatePath()` in `lib/core-skill-inventory.ts` (its unit test expects non-skill `.agents/*` entries to pass that helper).
  - `scripts/check-skill-budgets.mjs` and `scripts/evals/routing.ts` must support YAML folded `description: >-` blocks and `disable-model-invocation: true`, and `parseSkillFrontmatter` in `routing.ts` must return only `{ name, description }`.
  - Always run `npm run sync:adapters` after changing `.agents/skills/` so `.claude/skills/` stays mirrored and `doctor` reports `0 warnings`.
  - Avoid writing destructive shell strings or mock secret assignments in root Markdown files scanned by `scan-security-hygiene`.

## 4. Tech Debt / Open Gaps

- [x] Resolved in Feature `132`: `doctor.ts` `detectPstackSkillPath` now detects `.agents/plugins/pstack`, `open-pstack` staging, and Claude/Codex/Copilot versioned plugin caches with full ancestor symlink checks.

## 5. Change Log (newest at top)

### 2026-11-27 · Antigravity · Release `v3.0.0` (Merge `feat/devflow-v3-pstack-rework` -> `main` & Tag)
- **What:**
  - Verified full `verify-project` matrix on `feat/devflow-v3-pstack-rework` (`2bc54c9`), reconciled `.context/cos-board.md` (moved `feature-132` to Archive), merged into `main`, created annotated tag `v3.0.0`, and pushed `main` + `v3.0.0` to `origin`.
- **Why:** User approved Option A (`Merge & Release v3.0.0` and tag new version).
- **Verification:** `npm run typecheck`, `npm run check:static`, `npm run validate:docs` (1037 files), `scan-security-hygiene` (0 violations), `doctor` (17 passed, 0 warnings, 0 failed), `npm run check`, `npm test`, `npm run check:release` (286 create files, 4 wrapper files, 15 Core Skills/adapter, 8 extras, exit 0).
- **Pending / Notes for next agent:** GitHub Actions CI/CD will build and publish `3.0.0` on tag `v3.0.0`.

### 2026-11-27 · Antigravity · Option 3 Role Split (`/devflow-mode` vs `/feature`) & Task-Nature Routing
- **What:**
  - Updated `.agents/skills/feature/SKILL.md` (and mirrored `.claude/skills/feature/SKILL.md`) so direct `/feature` invocation operates as the **Spec & Slicing Workbench** and stops at `devflow/context/{xxx-slug}/spec.md` (unless implementation was requested in the same prompt), while `/devflow-mode` continues to use `execution.autoApproveSpec` for autonomous delivery.
  - Updated `.agents/skills/devflow-help/SKILL.md` (and mirrored `.claude/skills/devflow-help/SKILL.md`) to remove ambiguous dual next-action strings, default to `/devflow-mode`, and route to `/feature` / `/feature <id> --preview` only on 4 concrete task-nature signals (Oversized / Needs Slicing, Spec-Ahead / Multi-Run Grooming, Taste-Heavy UI/UX or Fuzzy Rules Without Reference, Guided / Micro-Slice / Pairing).
  - Updated `devflow/workflow.md`, `devflow/context/ai-interaction.md`, and `packages/create-nexus-devflow/lib/project-status-engine.ts` (`selectNextAction` idle routing defaults to `/devflow-mode`, switching to `/feature` when `execution.autoApproveSpec === false` or `workflow.stepReview === "every"`).
  - Added regression tests in `packages/create-nexus-devflow/test/status.test.ts` and `scripts/test/skill-hygiene.test.ts`, and synced adapters via `npm run sync:adapters`.
- **Why:** Eliminate overlap between `/feature` and `/devflow-mode` under v3 `autoApproveSpec: true` and give `devflow-help` deterministic task-nature routing.
- **Verification:** `npm run check` (`validate-framework` OK, `routing` 129/129, 17 eval/link tests, 226 package tests, `smoke-package` passed), `npm test` (311 passed: 226 + 6 + 11 + 7 + 61), `npm run verify:completion-gate` (622080 cases, exit 0), `npm run validate:docs` (1037 files, 0 violations), `npm run check:release` (286 create files, 4 wrapper files, clean), `doctor` (17 passed, 0 warnings, 0 failed).
- **Pending / Notes for next agent:** Uncommitted working tree ready for user review before any git commit.

### 2026-11-27 · Antigravity · Feature `132-pstack-integration-hardening` (4 `pstack` integration fixes)
- **What:**
  - Expanded `detectPstackSkillPath` in `packages/create-nexus-devflow/lib/doctor.ts` (`DoctorOptions.homeDir`/`env`, `resolveSafeCandidate`, `scanPstackCacheDir`, `compareVersionDirDesc`) to cover on-project `.agents/plugins/pstack/`, `open-pstack` staging, and versioned Claude/Codex/Copilot plugin caches while refusing symlinks on every path segment.
  - Updated `.agents/skills/devflow-mode/scripts/check-playbooks.mjs` (and `.d.mts`, mirrored to `.claude/`) to strictly validate `devflow/playbooks/*.md` (excluded from user templates in `prepare-template.ts`) while skipping `pstack`/`poteto-mode` extensions in shared `.agents/playbooks/` and `~/.agents/playbooks/`.
  - Updated `.agents/skills/devflow-mode/reference/platform-adapters.md`, `devflow-mode/SKILL.md`, `onboard/SKILL.md`, `onboard/reference/brownfield.md`, `devflow-help/SKILL.md`, `devflow-help/reference/doctor.md`, `AGENTS.md` (`6,893 <= 8,000` bytes), and `devflow/workflow.md` for in-session `<skills>` resolution, `verify` H2/sync guardrails, and `session hook: off` Coordinator precedence.
  - Added regression tests in `doctor.test.ts`, `check-playbooks.test.ts`, `prepare-template.test.ts`, and `skill-hygiene.test.ts`, synced `.claude/skills/`, refreshed `project-overview.md` (`13,311` bytes), and closed all independent review findings (`S-001`, `Q-001`, `Q-002`, `T-001`) in `devflow/context/132-pstack-integration-hardening/findings.md`.
- **Why:** Close the 4 real-world `devflow` + `pstack` integration gaps discovered during `/devflow-help` audit.
- **Verification:** `npm test` 309/309, `npm run check` 129/129 routing + 17/17 eval/link + `smoke-package`, `npm run check:release` 286/4 files, `npm run validate:docs` 1,037 files, `doctor` 17 passed / 0 warnings / 0 failed, Independent Review `passed`; proof stored under `devflow/reports/132-pstack-integration-hardening/`.
- **Pending / Notes for next agent:** Archived to `devflow/history/features/132-pstack-integration-hardening.md` and committed on `feat/devflow-v3-pstack-rework`; awaiting operator choice at Step 3 Delivery Gate (Option 1 Squash-Merge vs Option 2 MR/PR).

### 2026-11-27 · Antigravity · On-project `agent-starter-kit` maintainer install & template boundary isolation
- **What:**
  - Installed `poteto-starter` (`d80b762`) and synced `pstack-claude` (`0.9.158`, `1ab6b82`) strictly on-project under `.agents/`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `AI_HANDOFF.md`, and `.context/cos-board.md`.
  - Updated `.gitignore` to track `.agents/rules/` for maintainers while ignoring `.agents/plugins/`, `.agents/.cache/`, and `.agents/.backup/`.
  - Updated `packages/create-nexus-devflow/scripts/prepare-template.ts` (`stripAgentStarterKitBlock`, `shouldCopyTemplateEntry`, `sanitizeStarterFiles`) and `scripts/check-release-readiness.ts` (`FORBIDDEN_TARBALL_PATTERNS`, `templateEntrypointsSanitized`) to guarantee zero starter-kit leakage into end-user templates or npm tarballs.
  - Updated `scripts/check-skill-budgets.mjs`, `scripts/check-skill-budgets.d.mts`, and `scripts/evals/routing.ts` to support YAML folded `description: >-` scalars, `disable-model-invocation: true`, and `DESCRIPTION_CHAR_OVERRIDES['chief-of-staff']`.
  - Customized `.agents/skills/verify-project/SKILL.md`, synced adapters via `npm run sync:adapters`, and added regression tests in `packages/create-nexus-devflow/test/prepare-template.test.ts`, `scripts/test/check-skill-budgets.test.ts`, `scripts/test/routing-evals.test.ts`, and `scripts/test/check-release-readiness.test.ts`.
- **Why:** Enable `chief-of-staff` + `pstack` maintainer workflow on-project for Nexus-DevFlow developers without polluting the `create-nexus-devflow` user template.
- **Verification:** See `.context/cos-board.md` Archive (`bootstrap-repo`).
- **Pending / Notes for next agent:** Ready for user review before any git commit.
