# AI_HANDOFF — `Jakkrich/nexus-devflow`

Project governance, live engineering handbook, and cross-provider agent handoff hub for **Nexus-DevFlow** (`main` & active development branches).
Released delivery history lives in [`devflow/history/HISTORY.md`](./devflow/history/HISTORY.md). Repository rules, active locks, architecture notes, known pitfalls, and recent cross-provider change logs live in §0–§6 below.

## 0. Start here

1. Read [`devflow/history/HISTORY.md`](./devflow/history/HISTORY.md) and `AI_HANDOFF.md` §1–§2 plus the top 3 entries of §6 before editing code.
2. Check §2 (`Active Lock`) so you do not overwrite files owned by another active provider/agent or branch.
3. Read §3–§5 only as needed for installer/template packaging, multi-run state isolation, validation budgets, and open tech debt.

## 1. Current State (update on every change)

| Field | Value |
|---|---|
| Repository / Owner | `Jakkrich/nexus-devflow` (active branch `feat/devflow-v3-pstack-rework`) |
| Last known commit | `8d20a47` (AI_HANDOFF cross-provider hub feature; v3.0.1 release metadata prepared next) |
| Runtime / Stack | TypeScript + Node.js `>=18.17` + ESM CLI (`@jakkrichm/create-nexus-devflow`, `nexus-devflow`) + Markdown adapter skills |
| Build command | `npm run sync:adapters && npm --prefix packages/create-nexus-devflow run prepack` |
| Test / Verify command | `npm run check && npm run check:static && npm run check:budgets && npm run test:routing && npm test && npm run check:release` |
| Deploy | npm publish (`packages/create-nexus-devflow`, `packages/nexus-devflow`) + GitHub Pages (`docs/`) |

### Repo Invariants & Wrap-up (never break)

- **Exactly 15 Core Skills:** `.agents/skills/` and `.claude/skills/` must stay byte-identical for all 15 Core Skills via `npm run sync:adapters`.
- **Budget ceilings:** Keep `AGENTS.md` `<= 8,000` bytes and stay within per-skill byte budgets (`npm run check:budgets`).
- **Sanitized template parity:** `packages/create-nexus-devflow/scripts/prepare-template.ts` must ship clean starter files (`AGENTS.md`, `AI_HANDOFF.md`, `devflow/project-plan.md`, `devflow/build-plan.md`, `devflow/history/HISTORY.md`) with zero repo-specific history leaked.
- **Never delete user `AI_HANDOFF.md`:** Installer `update` and `uninstall` must preserve an existing project `AI_HANDOFF.md` under all circumstances.
- **On finish:** Update or clear your row in §2 (`Active Lock`), prepend an entry at the top of §6 (keep latest ~10 entries), update `## 1. Current State`, and report changed files + exact test output.

---

## 2. Active Lock (lightweight conflict guard)

| Provider / Agent | Branch / Worktree | Since | Task | Files touched |
|---|---|---|---|---|
| — | — | — | no active tasks | — |

---

## 3. Architecture & Entry Points

- **CLI & Engines:** `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` dispatches to `lib/{update,uninstall,doctor,status,project-status-engine,active-context-engine,branch-context,gatekeeper-engine,check-pipeline,review,findings,overview-integrity,skill-manager}.ts`.
- **Adapters & Templates:** `.agents/skills/` is the canonical skill source; `scripts/sync-adapters.js` mirrors to `.claude/skills/`. `packages/create-nexus-devflow/scripts/prepare-template.ts` builds the npm overlay template in `packages/create-nexus-devflow/template/`.
- **Validation & Release Gate:** `scripts/check-devflow.ts`, `scripts/validate-framework.ts`, `scripts/check-skill-budgets.mjs`, `scripts/check-release-readiness.ts`, and `scripts/test/*.test.ts`.

---

## 4. Known Pitfalls

- **`loadTrackedRepoIndex` in `prepare-template.ts`:** `git ls-files -z` skips untracked files when copying template assets; stage new template files (`git add -N`) before running `prepack` / `check:release`.
- **Windows PowerShell & UTF-8 BOM:** External tools or PowerShell 5.1 may write UTF-8 BOM (`\uFEFF`); parsers in `project-config.ts`, `current-work.ts`, `findings.ts`, `review.ts`, and `branch-context.ts` must strip leading BOM.
- **2s Git Cache (`git-status.ts`):** `DEFAULT_GIT_CACHE_TTL_MS = 2000` caches `git.available` per path; tests running `git init` after reading status in the same folder should isolate directories or clear cache.
- **`skill-hygiene.test.ts` guards:** `overview/SKILL.md` must guard `npm run overview` behind `package.json`, and `skill add|update` instructions must use `npx nexus-devflow skill add|update`.

---

## 5. Tech Debt / Open Gaps

- [ ] Merge `feat/devflow-v3-pstack-rework` to `main`, tag `v3.0.1`, and push `origin main --tags` to publish `@jakkrichm/create-nexus-devflow@3.0.1` and `nexus-devflow@3.0.1` (skipping `3.0.0` because `@jakkrichm/create-nexus-devflow@3.0.0` already exists on npm).

---

## 6. Recent Handoffs / Change Log (newest at top)

### 2026-11-27 · Antigravity (Poteto) · Cross-provider AI_HANDOFF hub & v3.0.1 release preparation (`8d20a47`)
- **What:** Committed cross-provider `AI_HANDOFF.md` hub across `AGENTS.md`, `CLAUDE.md`, lifecycle skills, `prepare-template.ts`, `update.ts` (`USER_PRESERVED_SEED_FILES`), `doctor.ts` (`ai_handoff_hub`), `smoke-package.ts`, `check-release-readiness.ts`, and unit tests (`8d20a47`). Bumped all 4 lockstep manifests and MCP fallback version to `3.0.1` (skipping `3.0.0` to avoid npm collision) and added `[3.0.1]` notes in `CHANGELOG.md`.
- **Why:** Prepare clean `v3.0.1` Release State on `feat/devflow-v3-pstack-rework` pending explicit maintainer approval for `main` merge, `v3.0.1` tag, and push.
- **Verification:** Prior full suite + release gate (`check`, `check:static`, `check:budgets`, `test:routing` `129/129`, `npm test` `234+6+11+7+58`, `test:package`, `check:release`) passed; live CLI E2E (`/onboard` -> `/implement` -> `/complete` -> cold-start read) passed `13/13`; re-running full suite on `3.0.1` release prep.
- **Pending / Notes for next agent:** Awaiting maintainer approval to merge `feat/devflow-v3-pstack-rework` into `main`, create annotated tag `v3.0.1`, and `git push origin main --tags`.

### 2026-11-27 · Antigravity (Poteto) · Remove starter-kit/engine coupling and resolve QA Round 1–3 bugs (`1b33289`)
- **What:** Removed `pstack`/`chief-of-staff`/`execution.engine` coupling; fixed Multi-Run `runId`/`activeRuns` task/status resolution, `when-sensitive` completion gating, `malformed` spec gating (`--strict` & default), `review.ts` state/reports exclusions, UTF-8 BOM stripping, automatic `devflow/{.state,reports}/.gitignore`, JS `node --check` fallback, `run-state.mjs` label inheritance, and onboarding marker/template parity across skills and tests.
- **Why:** Complete v3.0.0 standalone architecture and bring all 3 isolated QA sandboxes to 9.0–9.2/10 readiness.
- **Verification:** `sync:adapters`, `prepack`, `check`, `check:static`, `check:budgets`, `test:routing`, `npm test` (231+ installer, 58 tooling), and `check:release` all exited `0`.
- **Pending / Notes for next agent:** Add cross-provider `AI_HANDOFF.md` hub feature into template, lifecycle docs, `update`/`uninstall`/`doctor`, and tests.
