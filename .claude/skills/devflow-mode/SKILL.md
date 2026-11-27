---
name: devflow-mode
description: "[devflow] Autonomous Coordinator mode, playbook router (feature, bug-fix, refactor, discovery), isolated subagent orchestration, and continuous build-plan queue (--all / --max / --merge). Use for /devflow-mode (legacy aliases: /autopilot, /continuous)."
argument-hint: "[<task | build-plan-id | resume | fix \"...\">] [--all] [--max <N>] [--merge]"
---

# devflow-mode - Autonomous Coordinator & Playbook Runner

**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.

**Activity tracking (best-effort):** When `devflow/.state/` and `run-state.mjs` exist, publish `running` via `node .agents/skills/devflow-help/scripts/run-state.mjs` (or `.claude/...`); never block execution if unavailable.

`devflow-mode` turns the main chat into the **Lead Coordinator**. It replaces the legacy `/autopilot` and `/continuous` entry points, runs reversible feature-branch work autonomously without intermediate human pauses, and stops at the **Option A Final Human Delivery Gate** (`delivery.gate: "option-a-evidence-packet"`) with verified proof.

---

## Non-Negotiables

1. **Single-Writer 3-Pillars Ownership**: Only the Coordinator writes `devflow/build-plan.md`, `devflow/context/{xxx-slug}/{spec.md,stage.md,findings.md}`, `devflow/history/`, and `devflow/.state/`. Subagents never mutate shared DevFlow ledger files concurrently.
2. **Never Block on Reversible Work**: When `execution.autoApproveSpec` and `execution.autoCommitFeatureBranch` are `true`, proceed through spec drafting, TDD implementation, local feature-branch checkpoints, and verification loops without pausing. Pause only for genuine product/UX ambiguity, missing design references, or irreversible boundaries (`main`/`master` commits, `Type: Rollback`, `git merge` into `main`, `git push`, `deploy`, data deletion).
3. **Worktree Isolation for Writers**: Every file-writing builder or repair subagent operates in its own isolated git worktree (`Workspace: "share"`, `isolation: "worktree"`, or `git worktree add`). Never share a working tree across concurrent writers.
4. **Independent Verification & Prove-It-Works**: Builders never approve their own work. Claims require observed execution (`verify-layers`, real-app `verify` driver skill or `/check`, and `audit independent current` outputs).
5. **Cross-IDE Runtime Portability**: Read `reference/platform-adapters.md` before dispatching subagents.

---

## Step 1 - Resolve Config & Tier

Read `devflow/config.json` (fallback to built-in defaults if absent; stop and route to `/devflow-help doctor` if invalid):
- **`execution.tier`** (`"auto" | "docs" | "standard" | "high-risk"`, default `"auto"`):
  - `docs`: documentation/markdown-only -> static checks + link validation.
  - `standard`: 1-3 modules -> spec -> isolated Builder (TDD) -> `verify-layers` + `verify`/`/check` -> Evidence Packet.
  - `high-risk`: auth, security, schema, concurrency, core runtime, or multi-shape design -> add `/discovery` or `/prototype`, `audit independent current`, and up to `continuous.maxRepairAttempts` fresh repair loops.
- **`qualityGates.regular.independentReview` & `qualityGates.continuous.independentReview`**:
  - Evaluate `manual`, `when-sensitive`, or `always` from `devflow/config.json`. Active gates route through `audit independent current` (and never self-approve).
  - For browser-facing work, run `npm run test:browser` when declared and capture interactive browser evidence when available; record missing runners honestly rather than fabricating browser proof.

---

## Step 2 - Match & Load a Playbook

Pick one playbook from `playbooks/` and copy its numbered steps into your task checklist (mark any skipped step with `skip: <reason>`):

| Task Shape | Playbook | When to Use |
| :--- | :--- | :--- |
| Planned or new capability | `playbooks/feature.md` | Default for new features and `build-plan.md` items |
| Defect, regression, failing test | `playbooks/bug-fix.md` | Confirmed bug needing runtime repro and root-cause isolation |
| Structural cleanup / debt | `playbooks/refactor.md` | Behavior-preserving code deepening or dead-code deletion |
| Architecture / pre-flight exploration | `playbooks/discovery.md` | Broad trade-offs, ADRs, glossary alignment (read-only/docs) |
| Continuous build-plan queue | `playbooks/autonomous-queue.md` | Invoked with `--all`, `--max <N>`, `--merge` (or legacy `/autopilot --all`, `/continuous`) |

If `devflow/playbooks/*.md`, `.agents/playbooks/*.md`, or `~/.agents/playbooks/*.md` extends any bundled playbook with `extends:`, run `node .agents/skills/devflow-mode/scripts/check-playbooks.mjs` first (prefer `devflow/playbooks/` for project extensions, or prefix `devflow:` / `namespace: devflow` inside shared `.agents/playbooks/`), report any broken anchor, and apply valid `**After**` / `**Before**` / `**Replace**` / `**In**` adjustments.

---

## Step 3 - Final Delivery Gate (`option-a-evidence-packet`)

Unless running `playbooks/autonomous-queue.md` with `--all` or `--merge` (which squash-merges locally onto `main` while still forbidding remote pushes), stop on `feature/{xxx-slug}` and present the **Evidence Packet**:
- Branch name and `execution.tier` used
- Summary of changes grouped by file/area
- Exact verification commands run, exit codes, and proof artifact paths under `devflow/reports/{run-id}/`
- Independent verifier verdict and `findings.md` status
- Exact next action (`/complete` or explicit Merge / Open PR / Push choice)
