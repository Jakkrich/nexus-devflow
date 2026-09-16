---
name: implement
description: "[devflow] Build and verify a task-isolated spec. Use for /implement or requests to implement an approved plan."
argument-hint: "[{run-id, number, or name}] [--ticket <NN | path>]"
---

# implement - build and verify the target spec

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
Build the selected spec through its acceptance criteria and required verification, then present the configured review handoff. Preserve authorization already given for this work. Read only relevant conventions and reuse loaded context.

## Review cadence and checkpoints

Read `workflow.stepReview` and `workflow.checkpointCommits` from `devflow/config.json` independently; defaults are `feature` and `disabled`.

- `stepReview: "feature"`: continue through all authorized steps without asking Continue after each step. Record evidence as work proceeds and present one final review packet.
- `stepReview: "every"`: after a working step, show its diff and evidence, then wait for approval before the next step. A walkthrough is available on request.
- `checkpointCommits: "disabled"`: omit ordinary checkpoint offers.
- `checkpointCommits: "enabled"`: offer an optional checkpoint at the configured review boundary (per-step for `every`, final packet for `feature`). Show the exact candidate and obtain commit authorization before committing. The setting itself is not authorization.

Independent-review checkpoints follow their separate contract below. Review cadence never authorizes commit, merge, push, or deployment.

## Multi-Run Target & Ticket-Driven Target Resolution

- **Given an ID or name** (e.g. `/implement 12`, `/implement 012`, `/implement kanban`) -> locates the matching run folder `devflow/context/{xxx-slug}/`, selects the branch matching the run type and configured prefix, and loads only that run's `spec.md`.
- **With no argument** (`/implement`) -> checks the current feature, fix, or rollback branch against the configured prefixes, or auto-picks if only 1 spec is active in `devflow/context/`, or prompts the user if multiple specs are queued.
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

For browser-facing changes, run focused browser tests during iteration when available. Run the required `npm run test:browser` gate once before handoff if the spec or project requires it. Use `browseros-neo` for visual or behavioral evidence when available and relevant. Record missing tooling accurately; install a runner only when setup is in the authorized scope.

**Resuming?** If the spec already has some build steps checked off (`- [x]`), this
feature was started earlier and interrupted (often a cleared context). The spec and
its ticked steps are files, so pick up where it left off: read which steps are done,
check the git branch and `git status`/log to see what is committed and what is still
in the working tree, then continue from the **first unchecked step** instead of
starting over.

## Step 1 - branch

Create or select the branch for the spec using `git.featureBranchPrefix`, `git.fixBranchPrefix`, or `git.rollbackBranchPrefix` from config (defaults: `feature/`, `fix/`, `rollback/`). Preserve unrelated working-tree changes before switching. If the
project isn't a git repo yet, say so and ask the user to run `git init` first;
the loop needs branches. On resume, the branch already exists - check it out
instead of creating a new one.

### Type: Rollback safeguard

When implementing a rollback task, follow the exact safety procedure in `reference/rollback-implementation.md`.

## Step 2 - implement and verify

Work in small reviewable diffs, keeping progress in the selected spec.

1. For logic or behavior changes with the test gate on, use Red-Green-Refactor: write a focused failing test, confirm the assertion fails for the missing behavior, implement the smallest change, then refactor with affected tests green. Preserve the user's existing work. Consult [TDD anti-patterns](tdd-anti-patterns.md) when test design needs it.
   - **Proportional Engineering**: Add an abstraction, dependency, service, configuration surface, compatibility layer, or security mechanism only when the approved spec or an established repository requirement needs it now. Prefer existing code, standard library, and native platform features.
2. Match the step's done-when and run focused checks. Documentation or formatting-only edits use structural checks and review; they do not require artificial unit tests. Capture relevant runtime or browser proof for behavioral criteria, following the selected Check policy.
3. Fix failures caused by the change and rerun affected checks without requesting authorization again. Broaden verification when dependencies, failures, or risk justify it.
4. Record the diff summary and evidence. Mark a step complete once its done-when passes and any configured per-step review has been approved. A repaired finding becomes `fixed` with resolution evidence; only a subsequent audit can close it. Apply the review cadence above before proceeding.

Run a proportionality check before final verification: every new abstraction, dependency, service, configuration surface, compatibility layer, and security mechanism must trace to the approved spec or an established repository requirement. Remove speculative machinery this work added without weakening real trust-boundary validation, data-loss prevention, accessibility, or configured verification.

At the final handoff, run the exact documented Verify command and all required gates. If there is no Verify command, use the project's declared build and test commands. Reuse a passing result for unchanged inputs within this pass; rerun affected gates after subsequent edits. Do not add tests or tools just to inflate the verification matrix.

### Ticket execution

When a ticket is selected, use its acceptance criteria as the steps above. Mark completed criteria in the ticket, mark it `done` after its criteria and required verification pass, and mirror status and evidence into the run's spec. A ticket handoff runs required gates once; criteria within the ticket use focused checks. A request to finish the whole run continues through the dependency frontier until the authorized scope is verified.

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

Ordinary checkpoint commits are available only through the configured review boundary and explicit candidate approval above. The immutable independent-review checkpoint also requires explicit candidate approval. Work-level completion commits belong to `/complete`. Configuration never supplies commit approval. Never merge, push, deploy, publish,
or start unrelated work from this skill.

## Rules

- Keep diffs small and apply the configured review cadence.
- Explain every change in plain English. Understanding the code is the point.
- Iterate on the branch until each step works; never commit code the user hasn't
  approved.
- Follow `devflow/context/coding-standards.md` (server vs client, scope user-owned queries
  by the authenticated user id, validate inputs, and so on).
- Keep the spec aligned with the authorized scope. Correct routine omissions with evidence; ask only when a material scope or design decision is unresolved.
- Configured checkpoint offers are optional. The work-level commit, the merge,
  and any push are `/complete`'s job.
- For Type: Rollback, reverse only the approved product diff and preserve all
  protected Blueprint paths.

## Formatting

Format the output to match the project's conventions in
`devflow/context/ai-interaction.md`: concise, scannable markdown, with lists for
enumerations and tables for matrices rather than dense paragraphs.
