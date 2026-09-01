---
name: audit
description: "[devflow] Read-only code audit for a Blueprint project, except for the findings ledger it maintains at devflow/context/{xxx-slug}/findings.md and the optional independent-review request or receipt at devflow/context/{xxx-slug}/review.md. Reviews the active feature, changed files, a selected path, or the full project through all concerns or a focused quality, security, performance, or tests lens. Independent mode hands an immutable checkpoint to a selected fresh reviewer session and records a freshness-bound receipt. Use when the user runs /audit, invokes $audit, asks for an independent review, code or quality audit, security review, performance review, test quality review, dead-code or duplication check, vibe-coded project cleanup, or standards review."
argument-hint: "[{current|changed|full|path}] [{quality|security|performance|tests}] [independent]"
---

# audit - review code quality against the project standards

$ARGUMENTS

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

    /implement or /autopilot  ->  [audit]  ->  fixes or /complete
    (code exists)                 (review +    (repair quality issues
                                   ledger)      or close the feature)

`/check` proves behavior against the spec. `/doctor` checks Blueprint setup and
workflow health. This skill checks the code itself through either a broad review
or one focused lens: quality, security, performance, or tests.

It reviews code without changing it: it never edits source files, installs
dependencies, commits, merges, pushes, or starts product work. A normal audit's
one write is the findings ledger at `devflow/context/{xxx-slug}/findings.md` (Step 4),
the durable record of findings and their status. Independent mode may also
write `devflow/context/{xxx-slug}/review.md` using the exact record contract in
`reference/independent-review.md`.

The quality-gate config controls when another workflow invokes this skill
automatically. An explicit `/audit` or `$audit` request always selects the audit
regardless of whether the applicable gate is `manual`, conditional, or `always`.
A selected `independentReview` gate invokes independent mode instead of letting
the builder satisfy its own review. When both audit and independent review are
selected, one passing independent review satisfies the audit gate.
A missing config means built-in defaults. If it exists but is invalid, stop and
point to `/doctor` before writing the findings ledger.

## Input

Treat scope and lens as separate controls. Arguments may appear in either order,
such as `/audit security current` or `/audit src/auth tests`.

Optional scope:

- no scope argument: use `current` when an active feature exists, otherwise use
  `changed` when local changes exist, otherwise use `full`
- `current`: audit the active `devflow/context/{xxx-slug}/spec.md`, every committed feature-branch
  change from its merge base through `HEAD`, staged and unstaged changes,
  untracked source files, and nearby code affected by the feature
- `changed`: audit staged, unstaged, and untracked source files plus nearby code
- `full`: audit all project-owned source, tests, and configuration while excluding
  dependencies, generated files, build output, coverage output, caches, vendored
  code, and minified assets unless the user explicitly includes them
- path or directory: audit that area and the tests or callers needed to understand it

Optional lens:

- no lens: review all four lenses
- `quality`: maintainability, duplication, dead code, consistency, complexity,
  and standards drift
- `security`: authorization, input trust, injection, data exposure, secret
  handling, and unsafe configuration
- `performance`: query, network, rendering, memory, payload, concurrency, and
  unbounded-work risks
- `tests`: missing coverage for important logic, weak assertions, skipped or
  focused tests, poor isolation, brittle mocks, and likely flakiness

`full` is always the full-project scope, not a lens. `/audit full` therefore runs
all lenses across the full project. When only a lens is supplied, select scope
with the normal no-scope rules. A focused pass may name one or more lenses. If
the request names multiple lenses, review their union and report them separately.

If the requested scope is unclear, pick the smallest useful scope and state it.
If the lens is unclear, use all lenses and state that choice.

Optional review mode:

- `independent`: prepare or complete an independent review of `current` across
  all four lenses. It cannot be combined with `changed`, `full`, a path scope,
  or a focused lens because a completion receipt must cover the whole active
  work item.

## Independent mode

`/audit independent current` is a two-session workflow. The builder session
prepares a request. The selected fresh reviewer session runs the same command
to complete it. DevFlow verifies the exact target and later staleness. The
adapter, model, and fresh-session identity remain declared metadata.

Read `reference/independent-review.md` before either phase.

### Phase A - prepare the handoff

Use this phase when `devflow/context/{xxx-slug}/review.md` has no current `pending`
request for `HEAD` and the current spec hash.

1. Require an active spec with every build step checked and status `verified`, a
   non-default work branch, a reliable merge base, and a clean working tree.
   Independent mode accepts only a locally recorded remote default branch,
   local `main`, or local `master` as its enforceable base ref. Stop when none
   reliably covers the active work.
   The current full `HEAD` must be the approved review checkpoint, including the
   verified spec. Never create that commit inside Audit. If work is dirty, stop
   and ask the user to approve a review checkpoint through `/implement`, even
   when normal checkpoint commits are disabled.
2. Read installed adapters from `.nexus/nexus-devflow.json` or manifest when valid.
   Detect `.agents/skills` as `antigravity`/`codex`/`copilot` and `.claude/skills`
   as `claude`.
3. Ask which detected adapter and available model should review. Recommend an
   equal-or-stronger coding model, a different model family when practical, and
   high reasoning for sensitive work. Offer a fresh session in the current
   adapter as the fallback.
4. Record the full target SHA, full merge-base SHA, the exact local base ref
   used to calculate it, exact spec SHA-256, current adapter and model,
   requested reviewer adapter and model, workflow, and
   whether the configured Check gate is required. Write the pending template
   into `devflow/context/{xxx-slug}/review.md`.
5. Set dashboard activity to `ready` and give the exact handoff command for the
   selected adapter. Claude Code uses `/audit independent current`; Google Antigravity uses
   `/audit independent current`; Codex uses `$audit independent current`. Tell
   the user to open a fresh session with only the handoff, not the builder chat.

Stop after the handoff. The builder never continues into Phase B in the same
session.

### Phase B - perform the review

Use this phase when a current pending request exists in `devflow/context/{xxx-slug}/review.md`.

1. Confirm the current adapter matches `Requested reviewer`, the current model
   matches `Requested model` unless the runtime-default sentinel was selected,
   `HEAD` matches `Target commit`, the recorded base ref still produces the
   recorded merge base, the exact spec hash matches, and no path differs from
   the target except `devflow/context/{xxx-slug}/review.md` and
   `devflow/context/{xxx-slug}/findings.md`. Stop on any mismatch or stale state.
2. Proceed only from the fresh reviewer handoff. Record `fresh session` as a
   declaration. If the reviewer has the builder conversation, stop and request a fresh session.
3. Run Steps 1 through 3 across `current` with quality, security, performance,
   and tests together. Review the code fresh against the recorded
   `Base commit` and `Target commit`; exclude the request and findings files
   from the code scope. Existing findings are context, never the review
   checklist.
4. Run `/check` from the reviewer session when the request says Check is
   required. Follow Check's server and evidence boundaries. A required check
   that cannot run prevents a passing receipt.
5. Update the findings ledger through Step 4, then replace the pending request
   with a completed receipt in `devflow/context/{xxx-slug}/review.md`. Use `passed` only when the whole target was
   reviewed, required checks passed, and no P0 or P1 finding is `open` or
   `fixed`.
6. Report the receipt target, reviewer adapter and model, commands, evidence,
   findings, remaining risk, and whether the receipt passed. Never repair code
   from the reviewer session.

After changes are requested, the builder repairs through `/implement`, obtains
approval for a new checkpoint, and prepares a new request. The next reviewer
pass reviews the complete new delta, not only the old findings.

## Step 1 - gather context

Read:

- `AGENTS.md`
- `devflow/config.json`
- `devflow/context/project-overview.md`
- `devflow/context/coding-standards.md`
- `devflow/context/{xxx-slug}/spec.md` (when a task is active)
- `devflow/context/{xxx-slug}/findings.md` (or existing ledger), for existing IDs and statuses
- `devflow/context/{xxx-slug}/review.md`, for independent request and receipt state
- `devflow/context/ai-interaction.md`
- `devflow/build-plan.md`, when feature order matters
- git branch and working tree status
- relevant source files, tests, and configs for the chosen scope

For `current`, resolve the comparison base without network access:

1. Use a base branch declared by the active spec or project instructions.
2. Otherwise use the locally recorded remote default branch when available.
3. Otherwise use an existing local `main`, then `master`.
4. Find the merge base and inspect the committed delta through `HEAD`, then add
   staged, unstaged, and untracked work.
5. If no reliable base exists, say so and use the active spec plus local changes.
   Never claim that committed feature work was fully covered in that case.

Do not fetch or pull to discover the base. For `full`, state the excluded paths
before reviewing so generated or third-party code does not consume the audit.

Prefer `rg` and targeted file reads. Do not dump large files into the response.

## Step 2 - run available signals

Use existing commands only. Do not install tools.

Run or inspect only the signals relevant to the selected lens and scope:

- lint and typecheck commands when declared and relevant
- test command for the tests lens or when it directly validates a suspected risk
- build command when the selected lens needs compilation or bundle evidence
- existing security command for the security lens, when declared and locally runnable
- existing performance command for the performance lens, when declared and locally runnable
- targeted lightweight searches for the chosen lens, such as unused exports and
  copied logic for quality, unsafe trust boundaries for security, repeated or
  unbounded work for performance, and skipped or weak tests for tests

Do not run broad checks unrelated to a focused lens. If a useful command is
missing, report that as a gap. Do not invent a pass or claim that a focused
review covered the other lenses.

## Step 3 - review the code

For all lenses, ground findings in reachable code and project-specific
expectations. Apply only the selected lens or lenses:

- **Quality:** duplicated logic, dead or unused code, unreachable paths,
  oversized modules, abstractions that do not pay for themselves, risky missing
  abstractions, inconsistent patterns, and drift from the standards or spec.
- **Security:** missing authentication or authorization, client-controlled
  ownership, injection, unsafe parsing or deserialization, sensitive-data
  exposure, secret handling, insecure defaults, and trust-boundary mistakes.
  Inspect existing dependency or scanner output when available, but never imply
  that local manifest inspection is a current vulnerability scan.
- **Performance:** N+1 queries, repeated network or database work, unnecessary
  rendering, blocking work on hot paths, unbounded loops or collections, memory
  growth, oversized payloads, missing pagination, and unsafe concurrency. Mark
  hypotheses as unverified when runtime or profiling evidence is missing.
- **Tests:** important logic without coverage when a test command exists, weak
  assertions, tests that only mirror implementation, excessive mocking, shared
  state, time or order dependence, skipped or focused tests, placeholder tests,
  swallowed failures, and missing browser or integration evidence where behavior
  crosses a real boundary. Never invent a coverage percentage.

Do not nitpick harmless style differences unless they signal drift from the local
patterns. Prefer a short list of real findings over a broad list of guesses.

Do not broaden a focused pass because another category might be interesting.
If a critical security or data-loss issue surfaces during a quality, performance,
or test review, report that one blocker plainly under Security and continue with
the chosen lens.

## Step 4 - record and report findings

Maintain the durable record in `devflow/context/{xxx-slug}/findings.md` (or `devflow/context/findings.md`):

1. Read existing IDs to avoid collisions.
2. Use sequential IDs with the lens prefix: `Q-001`, `S-001`, `P-001`, `T-001`.
3. Set severity honestly:
   - `P0`: critical blocking bug, data corruption, severe vulnerability, complete outage.
   - `P1`: serious defect, missing critical test, unhandled core error.
   - `P2`: moderate debt, performance degradation, missing edge cases.
   - `P3`: minor improvement, code cleanup, cosmetic tweak.
4. Set status: `open`, `fixed`, `closed`, `accepted`, or `invalid`.
5. Display concise findings summary and next actions.