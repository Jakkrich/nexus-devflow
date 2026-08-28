---
name: autopilot
description: "[devflow] Optional explicit Blueprint mode for one bounded spec/build/check/audit pass. It can pick or resume the current feature, write the spec when needed, create or reuse the branch, implement small steps, run build/tests/checks, create checkpoint commits after passing steps, audit changed code, repair confirmed high-severity findings, and stop with a review packet. It never completes, merges, pushes, deploys, publishes, sends, or performs destructive actions without explicit approval. Use only when the user explicitly runs /autopilot, invokes $autopilot, or directly asks for Autopilot."
---

# autopilot - optional Blueprint loop

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

    /status  ->  [autopilot]  ->  review packet  ->  /complete
    (where       (spec, build,      (human review,    (log, commit,
     are we?)     check, audit)      fixes if needed)  merge with approval)

Autopilot is an explicit opt-in path. It uses the same Blueprint files and the
same quality gates, but it does not stop after every normal review point. A
single user request is permission to run one bounded loop until the feature is
ready for review, blocked, or unsafe to continue.

It does **not** replace the normal workflow. `/feature`, `/implement`, `/check`,
and `/complete` remain the conservative default.

Do not suggest Autopilot as the default next action. Use it only when the user
explicitly asks for it.

The explicit Autopilot request is permission to create checkpoint commits on the
feature or fix branch after passing implementation steps. It is not permission to
merge, push, deploy, publish, send, delete data, or run destructive actions.

## Input

Common forms:

- No argument: resume the current feature if one exists, otherwise target the next
  unchecked build-plan item.
- A number or name: target that build-plan feature, for example `/autopilot 3` or
  `$autopilot "directory listing"`.
- `fix "<issue>"`: write and build an ad-hoc fix spec.
- `resume`: continue the current feature on its existing branch.

If the requested target conflicts with a feature already in progress, stop and
ask which one should win. Do not overwrite task workspaces
silently.

Rollback is intentionally excluded from Autopilot. If the request is a rollback
or active spec is marked `Type: Rollback`, stop and direct the user to
the reviewed `/implement` path. Reversing completed work requires the explicit
dependency and conflict gates in `/rollback` and `/implement`.

## Step 1 - preflight like /status

Read the same state `/status` reads:

- `AGENTS.md`
- `devflow/project-plan.md`
- `devflow/build-plan.md`
- `devflow/context/project-overview.md`
- `devflow/context/{xxx-slug}/spec.md` (when present)
- `devflow/context/{xxx-slug}/findings.md` (when present)
- `devflow/context/coding-standards.md`
- `devflow/context/ai-interaction.md`
- git branch, status, and recent log

Then decide whether it is safe to run.

Stop before changing files when:

- The repo is not a git repo.
- The working tree is dirty and there is no current feature tying those changes
  to this run.
- Active task spec has real work and the user requested a different target.
- `project-overview.md` is missing or stale and the planning docs are not clear
  enough to regenerate it.
- The next feature is visual or replication-heavy and no design reference exists.
- The task needs product, data, auth, billing, or destructive decisions the docs
  do not answer.

If the only issue is that `project-overview.md` is stale and the plans are clear,
regenerate it using the `/overview` behavior and continue. Include that in the
final packet.

## Step 2 - choose or write the spec

If `devflow/context/{xxx-slug}/spec.md` already contains an active spec,
resume it. Read checked steps and continue from the first unchecked step.

If there is no active spec:

1. Use the `/feature` behavior for a planned feature, or `/fix` behavior for a
   requested fix.
2. Create workspace and write `devflow/context/{xxx-slug}/spec.md`.
3. Red-team the spec before building:
   - missing unhappy paths
   - oversized steps
   - undefined contracts
   - missing design reference
   - scope creep
   - vague done-whens
   - missing testing plan when `AGENTS.md` declares a test command
4. Apply the spec fixes.

Autopilot may continue past this spec gate because the user explicitly invoked
Autopilot. Still report what the critique changed in the final packet.

## Step 3 - branch

Create or check out the branch for the work:

- `feature/{xxx-slug}` for a planned feature
- `fix/{xxx-slug}` for an ad-hoc fix

If the branch already exists, check it out and verify it matches the spec.

## Step 4 - build in small steps with review gates

Work through the spec's steps in order:

1. Keep each change small and focused on the current step.
2. Run the declared `test` command when logic changed.
3. If the step has visual or browser-visible behavior, drive the browser when
   it is already installed or declared. Capture screenshots when they add useful
   evidence. Check for console errors and failed requests.
4. Self-review the diff for the step:
   - does it match the spec?
   - did it add scope?
   - is the error path handled?
   - did it follow `coding-standards.md`?
   - are tests present for new in-scope logic when the test gate is on?
5. Fix obvious issues and rerun the failed checks.
6. Mark the step checked in `devflow/context/{xxx-slug}/spec.md` only after the step passes.
7. Create a checkpoint commit on the feature or fix branch for the passing step.
   Include the code, tests, and the updated `spec.md` checkbox. Use a
   conventional message such as `feat: checkpoint mock snapshot route` or
   `fix: checkpoint stale service filter`. Keep the message about the step, not
   about Autopilot.

Do not batch the whole feature into one large diff. If a step gets too large,
split the step in `devflow/context/{xxx-slug}/spec.md` and continue with the first smaller step.

## Step 5 - acceptance check

After all implementation steps are checked, run the `/check` behavior for the
feature when any done-when is behavioral, visual, or integration-facing.

For pure library or CLI work, build plus tests and representative command output
may be enough. Be explicit about the evidence used.

## Step 6 - targeted quality audit and repair

After the acceptance check, apply the `/audit current` behavior to the active
feature, its diff, and the nearby code affected by the change. This is a targeted
feature audit, not a repository-wide cleanup pass. Findings are recorded in
`devflow/context/{xxx-slug}/findings.md` with durable IDs and statuses, as `/audit`
defines; the ledger reports status and never scopes what the audit examines.

For every finding:

1. Validate it against the actual code, spec, tests, `coding-standards.md`, and
   local project patterns. An audit finding is evidence to investigate, not an
   automatic instruction to edit.
2. Repair confirmed P0 and P1 findings when the fix stays inside the approved
   feature scope and does not require a product or architecture decision. Set
   the repaired finding to `fixed` in the ledger, never `closed`.
3. Report P2 and P3 findings in the final packet. Fix them only when the change
   is small, directly caused by the current feature, and clearly required by the
   project standards.
4. If a finding cannot be resolved safely in-scope, leave it `open` and describe
   it in the final packet. A finding that is wrong goes back to `/audit` to
   invalidate with recorded evidence; Autopilot never marks findings `invalid`
   or `accepted`.

Re-run the build, tests, and any affected checks after repairs. If a repair fails
twice, stop and report the blocker.

## Step 7 - compile the review packet

Stop and produce a concise review packet:

- target feature or fix
- branch name
- what was built
- changed files and why each changed
- build/test/check commands run, with pass or fail
- screenshots or output paths, when relevant
- how to try it manually, or a pointer to `/try` for the full walkthrough
- checkpoint commits created
- self-review findings
- targeted audit scope and findings
- audit repairs made and checks rerun
- P0/P1 findings still `open` or `fixed` in `devflow/context/{xxx-slug}/findings.md`,
  which block `/complete`
- unresolved risks or skipped checks
- exact next action

If everything is green, the next action is usually: review the diff, then run
`/try` if you want a manual walkthrough, then `/complete`.

If something failed, name the failing check and the next fix target.

## Hard Stops

Stop immediately and report instead of continuing when Autopilot would need to:

- commit on `main`, merge, delete a branch, push, deploy, publish, or send
  anything
- delete data, reset a database, run irreversible migrations, kill processes, or
  change system settings
- install dependencies or use network access without the current tool's approval
  flow
- make a product decision not covered by the docs
- continue after two failed fix attempts on the same issue
- hide, skip, or hand-wave a failing check

## Rules

- One Autopilot run handles one feature or one fix.
- Autopilot creates checkpoint commits on the feature or fix branch after passing
  steps.
- Autopilot audits the active feature and affected code, not the entire project.
- A P0 or P1 finding left `open` or `fixed` in `devflow/context/{xxx-slug}/findings.md`
  blocks readiness for `/complete`. The ledger is what makes this enforceable.
- Autopilot stops before `/complete`. It never merges.
- The Blueprint files remain the state machine. Keep
  `devflow/context/{xxx-slug}/spec.md` accurate as steps complete.
- Follow `coding-standards.md`, `ai-interaction.md`, and `AGENTS.md`.
- Prefer fewer, higher-quality changes over broad coverage.
- Report uncertainty plainly. A blocked run is useful if it tells the truth.

## Formatting

Format the output to match the project's conventions in
`devflow/context/ai-interaction.md`: concise, scannable markdown, with lists for
enumerations and tables for matrices rather than dense paragraphs.