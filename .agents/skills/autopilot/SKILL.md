---
name: autopilot
description: "[devflow] Run one explicit bounded DevFlow spec and implementation pass through configured quality gates, then stop before completion or external actions. Use only when the user directly invokes /autopilot, $autopilot, or asks for Autopilot."
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

It combines `/feature` or `/fix` with `/implement` and continues through the
spec-review stop retained by the normal workflow. That human spec approval is
the main control Autopilot intentionally removes. It does not remove the final
review packet or the option to walk through the completed code.

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

### Quality-gate and browser preflight

Read `qualityGates.regular.independentReview` from `devflow/config.json`.
`manual` is opt-in, `always` activates the gate, and `when-sensitive` activates
when the task touches authentication, authorization, secrets, payments,
personal data, destructive operations, dependencies, deployment, or another
security boundary. Reuse the target spec's recorded sensitivity decision; if it
is missing, record the evidence-backed decision before implementation.

Any product or living-spec edit invalidates an earlier receipt. After the final
Verify and targeted audit repairs, an active gate requires the
`audit independent current` handoff in a fresh reviewer context. Autopilot must
stop rather than self-approve when it cannot obtain a receipt with `passed`
verdict and `current` freshness; it never continues toward `/complete` on a
pending, malformed, changes-requested, stale, or missing receipt.

For browser-visible behavior, run `npm run test:browser` when `test:browser` is
declared and capture interactive evidence with `browseros-neo` when available.
If either path is unavailable, record the limitation in the review packet and do
not install a runner or claim browser proof implicitly.

## Step 2 - spec or fix definition

If starting a planned feature:

1. Read `devflow/context/project-overview.md` and `devflow/build-plan.md`.
2. Follow `/feature`'s sizing logic. If the feature is too large for one spec,
   split it in `devflow/build-plan.md` into `Na`, `Nb`, `Nc` and target only
   the first sub-feature.
3. Write the spec to `devflow/context/{xxx-slug}/spec.md` and set its status to
   `specified`. Fill all required sections, including the small build steps and
   acceptance criteria.

If starting an ad-hoc fix:

1. Pull the bug description or failure context.
2. Follow `/fix`'s definition rules and write `devflow/context/{xxx-slug}/spec.md`.
3. Set `Type: Fix` and write a short, focused task list.

If resuming an existing feature, verify `devflow/context/{xxx-slug}/spec.md` is
usable and resume from the first unchecked step.

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

Do not pause for user approval after each passing step, regardless of the
configured `workflow.stepReview` value. The review happens at the final packet
unless a hard stop is hit.

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

Apply `qualityGates.regular.independentReview` before a same-session audit:

- `manual` does not activate the gate.
- `when-sensitive` requires it only when the work touches authentication,
  authorization, secrets, payments, personal data, destructive actions, dependencies,
  deployment, or another sensitive boundary.
- `always` requires it for every work item.

The selected review runs after all implementation steps, final Verify, required
Check, and the verified spec, before the final review packet and `/complete`.
`review.independentExecution` chooses the manual fresh-session handoff or an
automatic isolated reviewer; it does not change when the gate is selected.

When selected, do not review the builder's work in this session. Ensure all work
is in an approved clean checkpoint, then follow Phase A of
`/audit independent current`. With automatic execution, spawn and wait for the
isolated reviewer, then validate its normal receipt. With manual execution, stop
with the handoff. Autopilot may use its existing configured checkpoint authority
when checkpoint commits are enabled; otherwise show the exact review-checkpoint
candidate and ask before committing. On resume, continue only when a fresh
reviewer wrote a current `passed` receipt. Repair `changes-requested` P0/P1
findings within the normal scope and attempt limit, then obtain a new checkpoint
and prepare a new review. A passing independent receipt satisfies the configured
Audit gate.

The request records `Requested execution`; the receipt records `Actual
execution`. Require the execution and reviewer-context pairing defined by the
project-local review contract, including actual manual plus `fresh session` when
an automatic request explicitly falls back.
On resume, a pending request without `Requested execution` is legacy manual-only.
Never add execution fields or run a subagent against it.

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

Always offer a read-only walkthrough of the completed code after the packet.
Follow the spec's build steps, explain the key files, symbols, flow, and
non-obvious decisions, then offer a focused deep dive. Keep `/try` distinct as
the manual product-review path.

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
