---
name: rollback
description: "[Devflow] Plan safe feature or run reversal with dependency and commit risk analysis."
---

# rollback - Safe Feature Reversal & Rollback Planner

Where this sits in the workflow:

```text
completed run + git history  ->  [rollback]  ->  /40-implement (or fix run)  ->  /50-verify  ->  /70-release
(run archive + commits)          (risk review    (reverse product diff)          (prove)      (log & finalize)
                                  + plan)
```

This skill **plans a rollback**. It does not silently alter product code, reset branches destructively, force-push, or mutate repository history. It identifies the completed run and its exact git commit, analyzes what changed afterward, drafts a guarded rollback specification, and stops for human review before execution.

## Input

A completed run by Running ID, name, or run path, plus an optional reason. Examples:

```text
/rollback RUN-002-add-onboard-adopt-doctor-skills
/rollback "auth login" because OAuth provider changed
/rollback devflow/runs/RUN-001-align-devflow-blueprint
```

With no target, list recent completed runs from `devflow/runs/` and `devflow/context/current-stage.md` and ask the user to choose. Never silently guess the target. If the reason is missing, ask for one before finalizing the rollback plan.

## Step 0 - Preflight Check

Read `AGENTS.md`, `devflow/context/current-stage.md`, `devflow/context/project-overview.md`, completed run archives under `devflow/runs/`, and git state.

Stop before planning when:

- The directory is not a git repository.
- There is uncommitted active work in the working tree (unless the user asks to inspect it).
- The target run cannot be identified unambiguously in `devflow/runs/` or Git history.

Do not discard, force-reset, switch branches, or destroy untracked files automatically.

## Step 1 - Resolve Target Run & Commits

Match the requested ID or name against `devflow/runs/` and git commit history:

```bash
git log --grep="RUN-002" --oneline
```

Identify:

- Exact commit SHA(s) introducing the feature.
- Parent commit before the feature was introduced.
- Associated stage artifacts (`20-spec.md`, `40-implement.md`, `70-release.md`).

## Step 2 - Separate Product Changes From DevFlow History

Inspect the files touched by the target commit(s).

**Protected Workflow Paths (Never Revert Automatically):**
- `.agents/**`
- `.claude/**`
- `devflow/**` (preserve run records, schemas, and historical reports)
- `AGENTS.md` / `CLAUDE.md` (unless explicitly intended to update commands)
- `.nexus/**`

The rollback must preserve DevFlow's durable history while isolating the **Product Code Diff** (application code, UI components, backend APIs, configuration).

## Step 3 - Review Later-Commit Risk (Dependency Risk Analysis)

Inspect every commit after the target commit through `HEAD` that touches any of the product files.

Classify the risk into one of 4 standard categories:

| Risk Level | Meaning | Action |
| :--- | :--- | :--- |
| **No Overlap** | No subsequent commits touched these product files. | Clean reversal is safe and straightforward. |
| **Overlap, Compatible** | Later edits touched the same files, but the target code can be cleanly extracted without breaking newer behavior. | Plan selective reverse-patching. |
| **Dependency Risk** | Subsequent features or bugfixes directly depend on types, APIs, tables, or exports introduced by the target. | Explicitly warn that dependent features will be affected; plan compatibility shims. |
| **Blocked** | Reversing the target would cause data loss, break database schema, or require a cascading rollback of multiple runs. | Stop and present the blocker to the user for explicit architectural guidance. |

## Step 4 - Produce The Guarded Rollback Plan

Draft the rollback plan containing:

1. **Target Run & Rationale**: Running ID, original commit SHA, author, and reason for reversal.
2. **Product Files to Revert**: Exact list of application files to modify/delete/restore.
3. **Protected Paths**: Explicit declaration of preserved history files.
4. **Risk Classification**: Dependency analysis findings and required compatibility repairs.
5. **Step-by-Step Reversal Steps**:
   - Step 1: Apply reverse product diff.
   - Step 2: Apply compatibility fixes for downstream dependencies.
   - Step 3: Run project verify command (`npm test`, `npm run check`).
6. **Acceptance & Verification Criteria**: How to prove the removed behavior is truly gone without breaking existing unaffected features.

## Step 5 - Stop For Human Confirmation

Present the rollback plan to the user:

- Summarize affected files and dependency risks.
- If approved, route to `/40-implement` (or allocate a dedicated Fix/Rollback Run) to safely execute the reversal steps behind review gates.

## Rules

- **Preserve History**: Never delete run folders under `devflow/runs/`. Historical reports must remain intact.
- **No Destructive Git Commands**: Never execute `git reset --hard HEAD~N` or `git push --force`. All reversals must be applied as forward commits.
- **One Target Per Rollback**: Avoid bundling multiple unrelated rollbacks into one pass.
- **Explicit Human Gate**: Always wait for user approval before applying any reverse diffs to code.
