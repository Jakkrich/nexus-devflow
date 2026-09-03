---
name: status
description: "[devflow] Show where the project stands: build-plan progress, the current feature's checked and unchecked steps, git state, drift warnings, and the exact next action. Read-only. Use when the user runs /status, asks where things stand, what's next, what's in progress, or is picking work back up after a break or a context clear."
---

# status - where the project stands right now

**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.

Where this sits in the workflow:

    any time  ->  [status]  ->  reads build-plan + current-feature + git
                  (read-only)   prints a short "you are here"

`/status` is orientation: where the project stands right now, what's done,
what's in flight, whether there's drift between plans and reality, and what
single action makes the most sense next. It is purely read-only: it reads files
and git, prints a summary, and exits.

Use `/doctor` instead when the user wants a full setup-and-health check.

## Input

None. `/status` takes no argument.

## What it gathers

Read these, distill them into a few lines, then stop. Do not dump file contents.

1. **Build plan progress** - `devflow/build-plan.md`. How many features total, how
   many are checked off (`- [x]`), what's the next unchecked item.
2. **Current work** - `devflow/context/{xxx-slug}/spec.md` (Pure Multi-Run support). If active, how
   many build steps total, how many are checked off, what is the description of the
   first unchecked step where `/implement` resumes. If multiple tasks are queued, list the active spec queue.
3. **Findings** - `devflow/context/{xxx-slug}/findings.md`. Count findings by status and
   report open and fixed counts next to build-plan progress. Call out any P0 or
   P1 still `open` or `fixed` by ID, since those block `/complete`.
4. **Overview freshness** - if `devflow/context/project-overview.md` is missing,
   or if `project-plan.md` or `build-plan.md` appears newer than it by filesystem
   time, mention that `/overview` should run before new feature work.
5. **Git** - current branch, whether the working tree is clean or has uncommitted
   changes, roughly how many files changed, last commit subject, and whether the
   branch is ahead of its remote. If the directory is not a git repo, say so and
   skip this part rather than failing.
6. **Progress drift** - flag active task on `main`, a spec in progress but no
   matching `feature/{xxx-slug}`, `fix/{xxx-slug}`, or `rollback/{xxx-slug}` branch, all spec steps checked but
   not completed, or disagreement between `build-plan.md` and active specs.
7. **Dashboard activity** - read `devflow/.state/run.json` when it exists.
   Report the command, mode, status, progress, boundary, and safe resume command.
   A missing file simply means no activity has been recorded. Invalid activity
   state is a warning, not a blocker for the underlying workflow; point to
   `/doctor` to inspect and offer the approved generated-state reset.
8. **Onboarding check** - Before recommending `/overview`, check whether `AGENTS.md`
   still contains the `<!-- devflow:onboarding-required -->` marker or standard template commands.
   When it does, onboarding is incomplete and `/onboard` is the next action.
9. **Independent review and browser evidence** - read
   `qualityGates.regular.independentReview` from `devflow/config.json` and the
   recorded sensitivity decision for `when-sensitive`. For every active run,
   report the `review.md` state, verdict, freshness, check result, warnings, and
   whether the effective gate is satisfied. An active gate with a missing,
   pending, malformed, changes-requested, or stale receipt routes to
   `audit independent current`, never `/complete`. Also report whether the spec
   requires browser proof, whether `npm run test:browser` is declared and has
   recorded evidence, and whether an interactive `browseros-neo` handoff is
   available or explicitly unavailable. This remains read-only: do not execute
   either browser path from `/status`.

## Output

A short, scannable summary, not a wall of text. Aim for something like:

    Status: Building feature 061 - Pure Multi-Run Architecture
    Plans: Overview current. Build plan 13 of 14 complete.
    Current work: Step 2 of 4 done. Next step: Update Directives & Documentation.
    Findings: 0 blockers in 061-pure-multi-run-task-isolated-architecture/findings.md.
    Git: branch feature/061-pure-multi-run-task-isolated-architecture, 3 uncommitted files.

    Next action: run /implement 061 for Task 2.

End with a single suggested next action, chosen in this order:

- The project configuration is invalid -> `/doctor`.
- Dashboard activity is malformed -> `/doctor`.
- The overview is missing or stale and no feature is in progress -> `/overview`.
- A spec is in progress with unchecked steps -> `/implement [id]` and name the step.
- A spec is in progress and all implementation steps are checked -> `/check [id]` if
  proof is not recorded, `/try` if the user wants a manual review path,
  `/implement [id]` when a P0 or P1 finding is still `open` (the repair is an extra
  reviewed step), `/audit` when one is `fixed` and awaiting re-review (both
  block `/complete`), otherwise `/complete [id]`.
- No active tasks in `devflow/context/` and unchecked build-plan items remain ->
  `/feature` and name the next build-plan item.
- All build-plan items are checked -> say the current milestone is complete;
  suggest hardening, release, or docs when appropriate, or
  `/feature "new capability"` to propose an addition to the living build plan.
  Do not suggest creating a second build plan.

If something is off, include a `Watch:` line before the next action. Catching
drift is half the value of the command.

## Rules

- **Read-only, always.** This skill never writes a file, never commits, never runs
  installs, never runs builds or tests, and never switches branches. If the user
  wants to act on what it reports, they run the relevant skill next.
- **Prefer exact next actions.** Do not end with vague advice like "continue the
  workflow". Name the command and, when useful, the file or step.
- **Distill, don't dump.** Report the state in a few lines. Do not paste file
  contents back unless the user asks for them.
- **Be honest about gaps.** If a file is missing or the repo is not initialized,
  say that plainly instead of guessing.

## Formatting

Format the output to match the project's conventions in
`devflow/context/ai-interaction.md`: concise, scannable markdown, with lists for
enumerations and tables for matrices rather than dense paragraphs.
