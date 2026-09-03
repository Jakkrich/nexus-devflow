---
name: overview
description: "[devflow] Distill user-owned planning docs into `devflow/context/project-overview.md` using a deterministic compiler. The overview is the living source of truth that agents read every session."
---

# overview - dynamic project overview compiler

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

## Position in workflow

```text
project-plan.md + build-plan.md + history + codebase signals
            -> scripts/overview.ts
            -> devflow/context/project-overview.md
            -> /feature / fix / check / complete
```

`/overview` updates the living context from planning documents and runtime signals.

## Input

- `devflow/project-plan.md` - Product vision, users, stack, constraints, roadmap
- `devflow/build-plan.md` - Ordered checkbox feature queue
- `devflow/history/HISTORY.md` - Shipped capability context
- `devflow/ideas.md` - Current idea pressure and backlog pulse
- `package.json` (if present) - Verified commands and language/tooling signals

If either primary plan file is missing or still placeholder-only, stop and ask for
actual planning content first.

## Step 1 - read and validate planning docs

1. Read `devflow/project-plan.md` and `devflow/build-plan.md`.
2. Validate shape:
   - `build-plan.md` must be a checkbox list in tracked order (`- [ ]`, `- [x]`).
   - plan items must be feature-sized and executable by `/feature`.
   - unresolved feature mismatch between plan and overview is reported in the final note.

### Stub plan hard-stop (existing contract)

- If `build-plan.md` is still a template stub but `project-plan.md` contains real features,
  **do not** generate a fake overview from `project-plan.md` alone.
- Offer normalization first, then ask for approval before writing.

## Step 2 - compile overview payload

Run:

```bash
npm run overview
```

The compiler writes:

- purpose + architecture summary (from `project-plan.md`)
- ordered queue (from `build-plan.md`)
- shipped features snapshot (from `devflow/history/HISTORY.md`)
- idea status and backlog pulse (from `devflow/ideas.md`)
- stack/tooling context (from project root signals)

The generated output follows `devflow/reference/project-overview-template.md`.

## Step 3 - output and report

After compilation:

- report what changed in structure and which sections are now `TODO`
- list conflicts or unresolved questions between the two plans
- apply the initial planning baseline handoff in Step 4 before suggesting `/feature`

## Step 4 - offer the initial planning baseline commit

During the initial pre-feature overview phase, offer to commit the approved
DevFlow setup and plans before Feature 1 starts. This keeps installation,
onboarding, planning, and the generated overview out of the first feature
commit. Never create this commit silently.

Treat this as the initial pre-feature state only when all of these are true:

- the project is a Git repository with an existing `HEAD` commit
- the current branch is the default branch, or it is a dedicated setup branch
  whose starting commit exactly matches the current default-branch tip
- the version of `devflow/context/project-overview.md` in `HEAD` does not
  already contain a generated overview baseline
- `devflow/context/` has no active task-isolated workspace directories (`devflow/context/{xxx-slug}/`)
- `devflow/history/features/`, `fixes/`, and `rollbacks/` contain no archived
  work beyond their shipped `README.md` placeholders
- `devflow/build-plan.md` contains no checked feature items
- the DevFlow workflow is meant to be committed, not kept local-only

If there is no `HEAD` yet, stop and send the user back to `/onboard`, which owns
the initial scaffold commit recovery. Overview never creates a root commit. If a
dedicated setup branch did not start at the current default tip, stop with that
exact mismatch. These are recoverable initial handoffs, not permission to offer
another baseline after one is committed.

Detect local-only mode with Git, not memory. Use `git check-ignore` on the
present workflow paths. If `.agents/`, `.claude/`, `devflow/`, or `CLAUDE.md`
are ignored as part of the onboarding local-only choice, skip the offer and
continue to the normal `/feature` guidance. `AGENTS.md` remaining public does not
make a local-only setup eligible.

Before asking, record the resolved default branch and its exact tip:

1. Read `git status`, the staged diff, the unstaged diff, and untracked paths.
2. Build a candidate containing only DevFlow installation, adapter,
   configuration, planning, context, and onboarding changes under `AGENTS.md`,
   `CLAUDE.md`, `.agents/`, `.claude/`, and `devflow/`. Include `.gitignore`
   only when every changed hunk is clearly an onboarding or DevFlow ignore
   entry.
3. Include the installer-owned `devflow/.state/manifest.json` and
   `devflow/.state/.gitignore` when present. Exclude transient state such as
   `run.json`, backups, and staging, plus secrets, logs, caches, dependencies,
   build output, and application source.
4. Stop if any staged change or dirty path falls outside the candidate, or if an
   allowed file contains an unrelated hunk. Do not mix app scaffolding or other
   user work into this commit. Tell the user exactly what must be committed,
   moved, or restored first, then leave the repository unchanged.
5. If the candidate is empty, skip the offer.
6. Show the exact candidate paths and their diff before asking:
   `Finalize the DevFlow baseline locally? (Recommended)`
   State that accepting creates one local commit. When running on a dedicated
   setup branch, it also fast-forwards the unchanged default branch to that
   commit, returns to the default branch, and deletes the setup branch. It never
   pushes.

If the user accepts, stage only the reviewed candidate, show the staged paths
and diff summary, verify no other path is staged, and commit with this exact
message:

```text
chore: establish DevFlow project baseline
```

For a dedicated setup branch, verify before committing that the default tip is
still the one shown in the prompt. After the commit, require a clean working
tree, switch to the default branch, run `git merge --ff-only <setup-branch>`, and
delete the setup branch locally. The single approval above covers only these
named local actions. If the default moved or any check fails, stop without
merging or deleting. Then confirm the final branch and working tree and recommend
`/feature`.

Then confirm the working tree state and recommend `/feature`. If the user
declines, leave the repository untouched and explain that these setup and
planning changes will remain uncommitted until they create the baseline later.
Do not offer this baseline on later overview reruns once `HEAD` already contains
a generated overview or feature work has begun.

## Rules

- `project-overview.md` is generated, not authored manually.
- **Keep the overview compact.** Never copy long plan passages. The generated overview must remain below 20,000 bytes. Measure it before the final handoff. If a draft is larger, compact narrative and repeated lists while preserving concrete contracts, build order, and constraints.
- **One reviewed baseline.** Offer the initial planning commit once, immediately before Feature 1, and only after showing its exact scope. Never create this commit silently or treat an overview rerun as permission to commit.
- Do not invent features, data models, or stack claims not sourced from inputs.
- Keep user-owned plans intact unless the user explicitly approved normalization.
- Re-run `/overview` whenever plan docs or shipped-history change materially.

## Formatting

- Use concise lists and tables for matrices.
- Follow `devflow/context/ai-interaction.md` language and tone conventions.

