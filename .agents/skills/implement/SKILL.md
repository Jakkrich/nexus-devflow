---
name: implement
description: "[devflow] Implement or start coding the active task-isolated spec on its branch in small steps, running tests after each step and presenting the configured review handoff. Use for /implement or requests to build or resume an approved spec."
argument-hint: "[{run-id, number, or name}] [--ticket <NN | path>]"
---

# implement - build the target spec, one reviewed step at a time

**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

    /feature, /fix, or /rollback  ->  [implement]  ->  /complete  ->  next
    (the spec)                         (build it,       (commit +
                                        reviewed)        merge + log)

`/feature`, `/fix`, or `/rollback` wrote the spec to
`devflow/context/{xxx-slug}/spec.md` and stopped.
This skill turns that spec into code, following the build loop in
`devflow/context/ai-interaction.md`, without vibe coding: small steps, a visible diff plus
a plain-English explanation for each, testing, and iteration until it works, all
behind your approval. It builds on a branch and offers an optional commit
checkpoint after each step; the work-level commit, merging, and logging are
`/complete`'s job.

## Multi-Run Target & Ticket-Driven Target Resolution

- **Given an ID or name** (e.g. `/implement 12`, `/implement 012`, `/implement kanban`) -> locates the matching run folder `devflow/context/{xxx-slug}/`, checks out `feature/{xxx-slug}`, and loads only that run's `spec.md`.
- **With no argument** (`/implement`) -> checks current git branch matching `feature/{xxx-slug}`, or auto-picks if only 1 spec is active in `devflow/context/`, or prompts the user if multiple specs are queued.
- **Ticket Input (`--ticket <NN | path>`)**: Targets a specific tracer-bullet ticket directly (e.g. `/implement 12 --ticket 01`, `/implement --ticket 02`, `/implement --ticket issues/01-auth.md`, or `/implement 01` when run-id is not ambiguous).

### Ticket Discovery Hierarchy

When `/implement` runs, it checks for tracer-bullet tickets in the following priority order:
1. `devflow/context/{xxx-slug}/tickets/<NN>-<slug>.md` (Recommended Task-Isolated Living Spec location)
2. `devflow/context/{xxx-slug}/issues/<NN>-<slug>.md`
3. `.scratch/{xxx-slug}/issues/` or `.scratch/<feature-slug>/issues/`
4. Section `## 🎫 Tracer-Bullet Tickets (from to-tickets)` inside `spec.md`

**Backward Compatibility**: If no tickets are found in any of the above locations, `/implement` executes using the standard Checklist under `## 📋 3. Execution Plan & TDD Checklist` in `spec.md`. Existing tasks and projects experience zero breaking changes.

### Frontier Dependency Resolution

When tickets are detected:
1. **Dependency Analysis**: Inspect `**Blocked by:**` across all discovered tickets in the set.
   - An unblocked ticket has `Blocked by: None` or all referenced blocker tickets are marked `done` (or have all checkboxes `- [x]`).
   - The set of currently unblocked, incomplete tickets forms the **Unblocked Frontier**.
2. **Auto-Frontier Selection**: If no `--ticket` flag is provided, automatically select the earliest unblocked ticket on the Frontier (sorted by ticket number `<NN>`).
3. **Blocker Guardrail**: If the user explicitly requests a ticket (e.g. `--ticket 03`) that has unfinished dependencies (blockers), warn the user immediately, display the pending blocker tickets, and offer to switch to the earliest unblocked blocker instead.

## Before you start

Read the target spec from `devflow/context/{xxx-slug}/spec.md`. If it has no real spec (missing or its
status is already complete), stop and tell the user to run `/feature` (for a
planned feature), `/fix` (for an ad-hoc bug or change), or `/rollback` (for a
completed feature reversal) first. Pull the
conventions from `devflow/context/coding-standards.md` and the data model from
`devflow/context/project-overview.md` so the code matches them.

If the spec's Design reference points at `prototypes/*.html`, those mockups are
the visual target - build components to match them, and treat `prototypes/theme.css`
as the token source (the spec's first step ports it into the app's global
stylesheet before the components are built).

### Quality-gate and browser preflight

Read `devflow/config.json` and the target spec's recorded decision for
`qualityGates.regular.independentReview`. `manual` does not activate an
automatic gate, `always` does, and `when-sensitive` follows the sensitivity
decision and evidence captured by `/feature` or `/fix`. Stop for a spec repair
instead of guessing when a conditional decision is missing.

Treat any product or living-spec edit in this build as invalidating an earlier
receipt. After the final Verify pass, an active gate routes to
`audit independent current`; only a fresh receipt with `passed` verdict and
`current` freshness may proceed toward `/complete`. This skill never approves
its own work or rewrites receipt evidence.

For a browser-facing step, run `npm run test:browser` when the script exists and
record the result in the step evidence. Use `browseros-neo` for the interactive
handoff when it is available and the done-when is visual or behavioral. When the
script or MCP is absent, report that exact limitation; do not silently install a
runner or claim browser evidence.

**Resuming?** If the spec already has some build steps checked off (`- [x]`), this
feature was started earlier and interrupted (often a cleared context). The spec and
its ticked steps are files, so pick up where it left off: read which steps are done,
check the git branch and `git status`/log to see what is committed and what is still
in the working tree, then continue from the **first unchecked step** instead of
starting over.

## Step 1 - branch

Create and check out a branch named from the spec: `feature/{xxx-slug}` for a feature,
`fix/{xxx-slug}` for a fix, or `rollback/{xxx-slug}` for a Type: Rollback spec. If the
project isn't a git repo yet, say so and ask the user to run `git init` first;
the loop needs branches. On resume, the branch already exists - check it out
instead of creating a new one.

### Type: Rollback safeguard

When implementing a rollback task, follow the exact safety procedure in `reference/rollback-implementation.md`.

## Step 2 - build one step, review, iterate, checkpoint (Strict TDD)

Work through the spec's build steps in order, one at a time. For each step:

1. **Strict TDD Cycle (for logic & behavior changes)**:
   - **🔴 RED**: Write the unit test first in the relevant test file. Execute the test command and show the failing assertion output.
   - **🟢 GREEN**: Implement only the minimal code in the source file necessary to make the test pass. Re-run test and show passing output.
   - **🔵 REFACTOR**: Refactor and format cleanly, verifying that 100% of tests remain green.
   - *Code Reversion Rule*: If production code is written without a prior test for behavior changes, revert it and write the test first.

   **⚖️ The Iron Law**: `NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST` — Apply to behavior changes according to the spec's test decision. If code came first, revert only your own work for that step and restart from the test, preserving the user's existing work.

   **Red-Phase Verification (confirm all three before GREEN):**
   - The test actually fails, rather than encountering a syntax error
   - The error message identifies missing behavior, rather than invalid configuration
   - The failure reflects the behavior under test, rather than a bug in the test itself

   **Green-Phase Discipline**: Write the minimum code needed to pass the test; add only the options/features it requires (YAGNI constraint).

   > 📖 For anti-patterns and Bad vs Good examples, read [`tdd-anti-patterns.md`](tdd-anti-patterns.md).

2. Implement just that step: the smallest change that satisfies its "done when."
3. Show the **diff**, not whole files.
4. **Explain it, and prove it.** Give a short summary: what the step delivered,
   one line per changed file on what it does and why, then confirm the step's
   "done when" is met with empirical evidence (test pass output, build output, or screenshot). This summary is the comprehension gate, so keep it concrete, not
   vague. Include a short **How to try it** note when the step has a manual
   path: the command, URL, click, endpoint, or output the user can check.
5. **Verify the step.** If `AGENTS.md` declares a `Verify` command, run that exact
   command as the automated gate. It is only an umbrella for checks the project
   actually has, so do not invent tests or other checks to satisfy it. If no
   `Verify` command exists, run the documented build command and the test command
   when the project declares one. A step that adds logic must ship a passing test
   in the same diff when the test gate is on, and the suite must be green before
   the step is approved (see the Testing gate in `coding-standards.md`). UI and
   integration-only steps ride on screenshot plus build evidence. Run a focused
   test separately when it gives faster feedback, then use `Verify` as the final
   automated gate. For UI or integration done-whens, prefer Playwright when it is
   already installed or declared in `AGENTS.md`; do not add it silently for an
   unrelated feature. Create focused test files next to the source they cover,
   per `coding-standards.md`. Never install a runner mid-step unless the current
   spec is explicitly the unit-testing setup itself (for example `/fix "add unit
   testing"`). If a step surfaces non-trivial logic the spec did not foresee, add
   a focused test then, or note why not. When a step's done-when is behavioral (a
   click, a download, or a flow across screens), run `/check` to prove it against
   the running app rather than eyeballing it.
5. **Iterate until it works.** If it fails or the user wants changes, revise the
   step (re-prompt or hand-edit the code), show the updated diff, and re-test.
   Repeat until it works and the user approves. Nothing is committed until the
   user is happy with the step.
6. **Mark it done, then prompt to move on.** Once the step is approved, check that
   step off (`- [x]`) in `devflow/context/{xxx-slug}/spec.md` so progress survives a context
   clear. If the step repaired a finding tracked in
   `devflow/context/{xxx-slug}/findings.md`, set that finding's status to `fixed` now too
   and note the repair in its **Resolution** line. Never set `closed`: a repair
   is re-reviewed by `/audit` before it clears, because a fix can introduce a
   worse defect than the one it removed. Then offer a short choice, noting that checkpoints are optional since
   `/complete` makes the real feature-level commit. Use the current tool's short
   user-input prompt when available; when you've just produced a long block to
   read (a deep explanation, a big
   walk-through), ask in plain text instead, so the prompt doesn't cover what the
   user is still reading:
   - **Continue** (default) - roll into the next step without committing.
   - **Commit checkpoint** - commit just this step on the branch with a
     conventional message (a cheap rollback point).
   - **Walk me through it** - give a deeper, line-level explanation of the new or
     changed code (why this approach, what each part does, any gotchas), then
     re-ask this checkpoint prompt. A loop-back, not a terminal choice.
   - **Stop here** - pause the loop so the user can review or come back later.

   On **Continue** or after **Commit checkpoint**, go to the next step. On **Walk
   me through it**, explain in depth and then re-ask this prompt in plain text (the
   explanation is long, so a modal would cover it). On **Stop here**, stop and say
   where things stand: the branch is intact; run `/implement` again to resume, or
   `/complete` to wrap up what's built so far.

### Ticket-Driven TDD Execution (when working from a Ticket)

When executing a tracer-bullet ticket (via `--ticket` or auto-frontier):
1. **Extract Scope**: Read *What to build* and *Acceptance criteria* checklist (`- [ ]`) from the active ticket file.
2. **Strict TDD Cycle per Criterion**:
   - **🔴 RED**: Write the unit/integration test for the criterion first at the agreed seam. Execute the test command and verify the expected failing assertion.
   - **🟢 GREEN**: Implement only the minimal code in the source file necessary to make the test pass. Re-run test and show passing output.
   - **🔵 REFACTOR**: Refactor and format cleanly, verifying that 100% of tests remain green.
3. **Verify Gate**: Run the project's Verify command (`npm run check` or documented test suite) to ensure whole-system health before concluding the ticket.
4. **Bidirectional State Sync**:
   - Mark each completed criterion `- [x]` in the ticket file.
   - Once all criteria in the ticket pass, update the ticket status to `**Status:** done` (or `Status: done`).
   - Mirror the completed work, status, and diff evidence into `devflow/context/{xxx-slug}/spec.md` (under `## 📋 3. Execution Plan & TDD Checklist` and `## ⚡ 4. Implementation Log & Evidence`) so the Living Spec remains the authoritative single source of truth for `/check`, `/audit`, and `/complete`.

Never batch the whole thing into one diff. If a step's diff is too big to read,
split it. The documented `Verify` command, or the fallback build and tests, must
pass before any commit.

After final Verify and required Check pass, set the active spec to `verified`
with every completed box checked. Then resolve independent review before the
final packet:

1. If `qualityGates.regular.independentReview` does not select review and no
   request already exists, proceed directly to the final review packet.
2. Otherwise show the exact product, test, and verified-spec candidate for the
   immutable review checkpoint. Obtain explicit commit approval when the exact
   checkpoint does not already exist, then create or use it. Configuration,
   including `review.independentExecution: "automatic"`, never grants commit
   permission, even when normal checkpoint commits are disabled.
3. Follow `/audit independent current` to prepare or reuse the request and record
   `Requested execution`. For requested `automatic`, start and wait for the
   generic isolated current-runtime child instructed from the project-local
   Audit skill, then validate the receipt. For requested `manual`, or when
   automatic capability is unavailable, preserve the request and stop with the
   manual fresh-session handoff. Treat an existing request without `Requested
   execution` as legacy manual-only: never add execution fields or run a
   subagent against it.
4. Continue to the final packet only with a current passing receipt whose
   requested execution, actual execution, and reviewer context form an allowed
   pairing. Never self-review or silently skip a selected gate.

## Step 3 - hand off to /complete

Before handing off, check `devflow/context/{xxx-slug}/findings.md`. A P0 or P1 finding
still `open` or `fixed` there means `/complete` will refuse the merge, so close
the loop now:

- Repair each `open` P0 or P1 as an extra reviewed step. First append it to the
  spec's build steps in `devflow/context/{xxx-slug}/spec.md` (`- [ ] Repair F-03 - <title>`) so
  the repair is on the record and survives a context clear, then run the same
  loop as Step 2: smallest change, diff, plain-English explanation, evidence.
  Check the step off and mark the finding `fixed` together.
- Then run `/audit` so the repairs are re-reviewed and can move to `closed`.
  A repair this skill made never closes itself.
- If the user decides a finding should not be fixed, only they can set
  `accepted` (reason recorded). A finding that looks wrong goes back to
  `/audit` to invalidate with recorded evidence; this skill never sets
  `accepted` or `invalid`.

When every step is built and `Verify`, or the fallback build and tests, passes
(committed as checkpoints or not), stop with a compact review packet:

- branch name
- what changed, grouped by file or area
- checks run, with the exact command or proof used
- how to try it manually, or a pointer to `/try`
- ledger state: any findings still `open` or `fixed`, by ID
- known risks, skipped checks, or follow-up notes
- next action, usually `/complete`

After the final packet, always offer these choices:

1. Walk me through the implementation.
2. Request changes.
3. Continue to the exact next workflow command.

The final walkthrough is available with either `workflow.stepReview` value and
regardless of `workflow.checkpointCommits`. It is a read-only code tour, not the
manual product-review path produced by `/try`, and it is not verification.

When the user chooses the walkthrough, begin with a short map of the completed
feature, then follow the spec's build steps. For each step, explain its purpose,
key files and symbols, important data or control flow, and non-obvious decisions.
Use file and line links when the client supports them. Do not narrate every line
or reload broad project context. End by offering a focused deep dive into one
named area. If the feature spans too many distinct areas for one useful pass,
name the sections first and let the user choose where to begin. Remain read-only
unless the user separately requests changes.

Never create an ordinary step, product, or work-level commit from this skill.
The sole exception is exactly one immutable independent-review checkpoint after
showing its exact candidate and receiving current explicit commit approval.
Configuration never supplies that approval. Never merge, push, deploy, publish,
or start unrelated work from this skill.

## Rules

- One small step per diff; the user reviews and approves each before any commit.
- Explain every change in plain English. Understanding the code is the point.
- Iterate on the branch until each step works; never commit code the user hasn't
  approved.
- Follow `devflow/context/coding-standards.md` (server vs client, scope user-owned queries
  by the authenticated user id, validate inputs, and so on).
- Build only what the spec says. If the spec is wrong or thin, stop and fix the
  spec first, do not improvise.
- Per-step commits are optional checkpoints. The work-level commit, the merge,
  and any push are `/complete`'s job.
- For Type: Rollback, reverse only the approved product diff and preserve all
  protected Blueprint paths.

## Formatting

Format the output to match the project's conventions in
`devflow/context/ai-interaction.md`: concise, scannable markdown, with lists for
enumerations and tables for matrices rather than dense paragraphs.
