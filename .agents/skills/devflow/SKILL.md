---
name: devflow
description: "[devflow] Unified status, health check (doctor), intent router, and legacy command guide for DevFlow workflows. Use for /devflow, /devflow doctor, /devflow --exec, or asking where the project stands."
argument-hint: "[status | doctor | --exec | \"<request>\"]"
---

# devflow - Unified Status, Doctor & Intent Router (Read-Only)

**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.

Where this sits in the workflow:

    any time  ->  [devflow]  ->  status + drift + next action (default)
                             ->  doctor health diagnostics (/devflow doctor)
                             ->  intent & legacy command routing ("<request>")

`/devflow` is purely read-only (its only repair is an approved `reset` of malformed generated `devflow/.state/run.json` in `doctor` mode). It never edits product code, commits, installs, runs tests/builds, or switches branches.

---

## Mode Selection

- **No argument or `status` (`/devflow`, `/devflow status`, `/devflow --exec`)**: Report project progress, active specs, findings, `review.md` gate, overview freshness, git/worktree drift, dashboard activity, and the single exact next action.
- **`doctor` (`/devflow doctor`)**: Read and execute `reference/doctor.md` for full DevFlow setup, adapter, `devflow/scripts/run-state.mjs`, `AGENTS.md`, config, and `project-overview.md` diagnostics. At or above 20,000 bytes, call it oversized. If `devflow/.state/run.json` is malformed, ask `Reset the malformed dashboard state now?` before running `reset`.
- **Natural-language request or legacy command (`/devflow "<request>"`)**: Classify intent using the Core Sitemap and Legacy Routing tables below.

---

## Status Mode (Default)

Gather without dumping full files:
1. **Onboarding & Config**: Read `devflow/config.json` (report `qualityGates.regular`, `qualityGates.continuous`, and `review.independentExecution`; if invalid, `Repair order:` -> `/devflow doctor`). If `AGENTS.md` still contains `<!-- devflow:onboarding-required -->`, recommend `/onboard`.
2. **Build Plan & Overview**: Summarize checked vs. total items in `devflow/build-plan.md` and next unchecked leaf. Check `devflow/context/project-overview.md` freshness via `/overview`'s normalized `devflow:source-hash` contract (or size `>= 20,000` bytes -> `/overview`).
3. **Active Runs (`devflow/context/{xxx-slug}/`)**: Report `spec.md` step progress, open/fixed P0/P1 findings in `findings.md`, and `qualityGates.regular.independentReview` (`when-sensitive` / `always` -> `review.md` state, verdict, freshness; missing/stale/pending routes to `audit independent current`, never `/complete`). Note whether spec requires browser proof, `npm run test:browser`, and active interactive browser MCP availability without executing browser tools.
4. **Pending Ideas & Discoveries**: Summarize `devflow/ideas.md` pending items and open `devflow/discoveries/` if present.
5. **Git, Worktrees & Activity**: Current branch, dirty files, last commit, linked worktree / advanced-main drift, and `devflow/.state/run.json` summary.

### Executive Mode (`/devflow --exec` or `leadership`)
Keep product names, ticket keys, and business impact; strip file paths and code minutiae (Slack TL;DR <80 words, Async Standup 1-2 lines, or Written Status).

### Output Shape & Next-Action Priority
Print concise labels (`Status`, `Plans`, `Current work`, `Findings`, `Git`, optional `Watch:`, `Next action:`). Pick one exact next action in order:
1. Invalid `devflow/config.json` or malformed `run.json` -> `/devflow doctor` (or `point to /devflow doctor instead of guessing`)
2. Missing/stale/oversized overview with no active run -> `/overview`
3. Active spec with unchecked steps -> `/implement [id]` (name step)
4. All steps checked: `/check [id]` if proof missing; `/implement [id]` for `open` P0/P1; `/audit` for `fixed` P0/P1; `/audit independent current` if gate unsatisfied; otherwise `/complete [id]`
5. No active run and unchecked build-plan items remain -> `/feature` (name next item)
6. All items checked -> milestone complete; `/feature "<new capability>"` to add scope.

---

## Core Skills Sitemap (15 Core Skills)

- **Setup & Hub**: `onboard` (fresh + brownfield), `overview`, `devflow` (status + doctor + router)
- **Pre-Flight**: `idea`, `explore` (read-only options), `discovery` (macro/micro + doc intake + ADR/glossary)
- **4-Stage Delivery**: `feature` (`--preview`, `--check`, adaptive clarification), `fix`, `implement`, `check` (`guide` for manual walkthrough), `complete`
- **Quality & Auto**: `audit` (`independent` + YAGNI), `debug` (2-track), `autopilot` (`--all` / `--merge` for continuous loop)
- **UI Mockup**: `prototype`

## Legacy Command Routing (A1 Compatibility)

| Legacy Command | Replacement | Action |
| :--- | :--- | :--- |
| `/adopt` | `/onboard` | Auto-detects brownfield codebase and surveys existing features |
| `/try` | `/check guide` | Generates the same read-only manual walkthrough |
| `/devflow-status` | `/devflow` | Default status & next-action report |
| `/devflow-doctor` | `/devflow doctor` | Full setup, config, and workflow diagnostics |
| `/continuous` | `/autopilot --all` | Serial multi-feature loop with local squash-merge |
| `/analyze`, `/grill` | `/discovery` or `/feature` | Multi-format intake & Socratic alignment (auto inside `/feature` when starting delivery) |
| `/brainstorm` | `/explore` | Read-only option comparison & trade-off matrix |
| `/brief` | `/feature --preview` | Read-only scope/dependency preview before writing `spec.md` |
| `/setup-tests`, `/browser-tests`, `/ci`, `/release`, `/rollback`, `/vendor`, `/convert-any-to-md`, `/bughunter`, `/code-modernization` | `npx nexus-devflow skill add <name>` | Opt-in extensions outside Core |
