---
name: devflow-help
description: "[devflow] State-aware interactive guide, ready-to-send prompt builder, unified status (--exec), doctor health check, and legacy command router for DevFlow workflows. Use for /devflow-help, /devflow, /devflow doctor, or /devflow --exec."
argument-hint: "[status | doctor | --exec | \"<question or request>\"]"
---

# devflow-help - Interactive Guide, Status & Doctor (Read-Only)

**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.

`devflow-help` replaces the legacy `/devflow` skill. It is strictly **read-only** (its only repair is an approved `reset` of malformed generated `devflow/.state/run.json` in `doctor` mode) and never starts mutating work or spends subagent tokens when the user only asked for guidance. Give the user an accurate diagnosis and one ready-to-send prompt when appropriate.

---

## Mode Selection

- **Question / "how do I..." / skill-picking request (`/devflow-help "<question>"`)**: Follow **Interactive Guide & Prompt Builder** below.
- **No argument or `status` (`/devflow-help`, `/devflow-help status`, `/devflow`, `/devflow --exec`)**: Follow **Status Mode** below.
- **`doctor` (`/devflow-help doctor`, `/devflow doctor`)**: Read and execute `reference/doctor.md` for full DevFlow setup, adapter, verify driver, `devflow-help/scripts/run-state.mjs`, `AGENTS.md`, config, and `project-overview.md` diagnostics. At or above 20,000 bytes, call it oversized. If `devflow/.state/run.json` is malformed, ask `Reset the malformed run state now?` before running `reset`.

---

## Interactive Guide & Prompt Builder (State-Aware)

Inspect current workspace state silently before answering:
1. Check `AGENTS.md` for `<!-- devflow:onboarding-required -->` (not onboarded -> recommend `/onboard` first).
2. Check `devflow/config.json` (`execution.tier`, `execution.autoApproveSpec`, `execution.autoCommitFeatureBranch`, `delivery.gate`).
3. Check whether a project-local `.agents/skills/verify/SKILL.md` driver exists (if absent, note that real-app proof is limited until `/onboard` sets one up).
4. Check `devflow/context/{xxx-slug}/` and `devflow/build-plan.md` for active specs, open P0/P1 blockers, or the next unchecked feature.

Answer concisely by category (**Get set up**, **Start a task with `/devflow-mode`**, **Pick a skill or playbook**, **Fix a stuck run**, or **Customize playbooks via `devflow/playbooks/` or `.agents/playbooks/`**), link the relevant `SKILL.md` or playbook, and hand the user **one concrete copy-paste prompt** tailored to their current workspace state.

### Routing by Task Nature (`devflow-mode` vs `feature`)
- **Default -> `/devflow-mode`** (`/devflow-mode <id | "task">` or `/devflow-mode --all`): Recommend for build-ready `build-plan.md` items, bug fixes, refactors, or continuous queues that fit a single reviewable unit. Never output an ambiguous `"/devflow-mode or /feature"` pair — pick one command and give a 1-line reason.
- **Spec Workbench -> `/feature`** (`/feature <id>` or `/feature <id> --preview`): Recommend instead of `/devflow-mode` **only** when task nature matches one of 4 signals:
  1. **Oversized / Needs Slicing**: Next `build-plan.md` item spans multiple subsystems/journeys and needs splitting into `Na`, `Nb`, `Nc` sub-features first (`/feature <id> --preview` for read-only sizing, or `/feature <id>` to split & spec).
  2. **Spec-Ahead / Multi-Run Grooming**: User wants to draft `spec.md` across multiple items ahead of time or lock cross-module contracts/schemas before coding.
  3. **Taste-Heavy UI/UX or Fuzzy Rules Without Reference**: UI feature with no `prototypes/` or visual reference yet, or nuanced business rules where misinterpretation would waste subagent/swarm tokens (lock `spec.md` first, or `/prototype` for mockups).
  4. **Guided / Micro-Slice / Pairing**: Config sets `execution.autoApproveSpec: false` or `workflow.stepReview: "every"`, or a tiny 1–2 file tweak / unfamiliar module where the user wants inline step-by-step control (`/feature <id>` -> `/implement`).

---

## Status Mode (`status` / `--exec`)

Gather without dumping full files:
1. **Onboarding & Config**: Read `devflow/config.json` (report `qualityGates.regular`, `qualityGates.continuous`, `review.independentExecution`, `execution` [`tier`, `autoApproveSpec`, `autoCommitFeatureBranch`], and `delivery.gate`; if invalid, `Repair order:` -> `/devflow-help doctor` instead of guessing). If `AGENTS.md` still contains `<!-- devflow:onboarding-required -->`, recommend `/onboard`.
2. **Build Plan & Overview**: Summarize checked vs. total items in `devflow/build-plan.md` and next unchecked leaf. Check `devflow/context/project-overview.md` freshness via `/overview`'s normalized `devflow:source-hash` contract (or size `>= 20,000` bytes -> `/overview`).
3. **Active Runs (`devflow/context/{xxx-slug}/`)**: Report `spec.md` step progress, open/fixed P0/P1 findings in `findings.md`, and `qualityGates.regular.independentReview` (`when-sensitive` / `always` -> `review.md` state, verdict, freshness; missing/stale/pending routes to `audit independent current`, never `/complete`). Note whether spec requires browser proof, `npm run test:browser`, and active interactive browser MCP availability without executing browser tools.
4. **Pending Ideas & Discoveries**: Summarize `devflow/ideas.md` pending items and open `devflow/discoveries/` if present.
5. **Git, Worktrees & Activity**: Current branch, dirty files, last commit, linked worktree / advanced-main drift, plus aggregated `devflow/.state/runs/*.json` (fallback `devflow/.state/run.json`) and per-worktree `## Handoff Summary`.

### Executive Mode (`--exec` or `leadership`)
Keep product names, ticket keys, and business impact; strip file paths and code minutiae (Slack TL;DR <80 words, Async Standup 1-2 lines, or Written Status).

### Output Shape & Next-Action Priority
Print concise labels (`Status`, `Plans`, `Current work`, `Findings`, `Git`, optional `Watch:`, `Next action:`). Pick one exact next action in order:
1. Invalid `devflow/config.json` or malformed `run.json` -> `/devflow-help doctor`
2. Missing/stale/oversized overview with no active run -> `/overview`
3. Active spec with unchecked steps -> `/implement [id]` when `stage.md` names `/implement`, `execution.autoApproveSpec` is `false`, or `workflow.stepReview` is `"every"`; otherwise `/devflow-mode [id]`
4. All steps checked: `/check [id]` if proof missing; `/implement [id]` for `open` P0/P1; `/audit` for `fixed` P0/P1; `/audit independent current` if gate unsatisfied; otherwise `/complete [id]`
5. No active run and unchecked build-plan items remain -> `/devflow-mode` (default), or `/feature <id>` (or `--preview`) only when the next item matches a Spec Workbench task-nature signal above (oversized/needs split, spec-ahead, taste-heavy UI without reference, or guided config)
6. All items checked -> milestone complete.

---

## Core Skills Sitemap (15 Core Skills) & Playbooks

- **Orchestration & Help**: `devflow-mode` (Coordinator + 5 Playbooks: `feature`, `bug-fix`, `refactor`, `discovery`, `autonomous-queue`), `devflow-help` (guide + prompt builder + status + doctor)
- **Setup & Context**: `onboard` (fresh + brownfield), `overview`
- **Pre-Flight**: `idea`, `explore` (read-only options), `discovery` (macro/micro + doc intake + ADR/glossary)
- **Delivery & Verification**: `feature` (`--preview`, `--check`), `fix`, `implement`, `check` (`guide` for manual walkthrough), `complete`, `audit` (`independent` + YAGNI), `debug` (2-track), `prototype`

## Legacy Command Routing

| Legacy Command | Replacement | Action |
| :--- | :--- | :--- |
| `/devflow`, `/devflow-status` | `/devflow-help` | Status, next action & interactive prompt guide |
| `/devflow doctor`, `/devflow-doctor` | `/devflow-help doctor` | Full setup, verify driver, playbook, and config diagnostics |
| `/autopilot`, `/continuous` | `/devflow-mode` (`--all`) | Autonomous Coordinator mode & continuous build-plan queue |
| `/adopt` | `/onboard` | Auto-detects brownfield codebase and surveys existing features |
| `/try` | `/check guide` | Generates read-only manual walkthrough |
| `/analyze`, `/grill` | `/discovery` or `/feature` | Multi-format intake & Socratic alignment |
| `/brainstorm` | `/explore` | Read-only option comparison & trade-off matrix |
| `/brief` | `/feature --preview` | Read-only scope/dependency preview before writing `spec.md` |
| `/setup-tests`, `/browser-tests`, `/ci`, `/release`, `/rollback`, `/vendor`, `/convert-any-to-md`, `/browseros-neo`, `/verify-harness` | `npx nexus-devflow skill add <name>` *(or `@jakkrichm/create-nexus-devflow`)* | Opt-in extensions outside Core |
