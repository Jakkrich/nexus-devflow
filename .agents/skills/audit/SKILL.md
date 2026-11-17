---
name: audit
description: "[devflow] Audit current changes, a path, or the full project for quality, security, performance, or test problems and record durable findings. Independent mode prepares or completes a fresh-reviewer checkpoint handoff in review.md."
argument-hint: "[{current|changed|full|path}] [{quality|security|performance|tests}] [independent]"
---

# audit - review code quality against the project standards

$ARGUMENTS

Where this sits in the workflow:

    /implement or /autopilot  ->  [audit]  ->  fixes or /complete
    (code exists)                 (review +    (repair quality issues
                                   ledger)      or close the feature)

`/check` proves behavior against the spec. `/devflow doctor` checks Blueprint setup and
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
point to `/devflow doctor` before writing the findings ledger.

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
- `scrutiny`: outsider end-to-end review questioning intent, checking simpler
  alternatives, tracing real call paths beyond diffs, and verifying edge-case claims

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

`/audit independent current` is a two-context workflow. The builder prepares a
request. With `review.independentExecution: "manual"`, the selected fresh
reviewer session runs the same command to complete it. With `automatic`, the
current adapter may start a fresh isolated reviewer subagent after preparing the
request. DevFlow verifies the exact target and later staleness. The adapter,
model, and fresh-context identity remain declared metadata.
An explicit invocation uses this execution setting even when the active
workflow's `independentReview` gate is `manual`; that gate value disables only
automatic selection by the workflow.

Read `reference/independent-review.md` before Phase A or Phase B. It holds the
full Phase A handoff preparation and Phase B review execution procedures,
including the checkpoint, snapshot, execution-pairing, and freshness contracts.

Never let the builder review its own work or skip a selected independent-review
gate. The builder never performs Phase B itself; it may continue only after a
manual reviewer session or automatic isolated reviewer produces a valid current
receipt.

After changes are requested, the builder repairs through `/implement`, obtains
approval for a new checkpoint, and prepares a new request. The next reviewer
pass reviews the complete new delta, not only the old findings.
A local-spec-only revision may reuse the same approved product HEAD after normal
spec and verification gates, with a new snapshot/request and full fresh review;
it never requires an empty commit.

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

- **Quality (incl. YAGNI & Proportionality):** duplicated logic, dead or unused code,
  unreachable paths, oversized modules, unnecessary wrappers/abstractions/config flags
  lacking a current requirement (YAGNI), risky missing abstractions, inconsistent patterns,
  and drift from the standards or spec.
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
- **Scrutiny (Outsider Stance & Intent Challenge):**
  - *Question Intent & Simpler Alternatives*: State what the change actually attempts in one sentence. Ask: is there a simpler, smaller, or more elegant way to achieve the same goal (reusing existing code, config vs code, solving at a different layer)?
  - *Full Call-Path Tracing*: Follow the call graph through real code paths (entry point → call sites → branches taken → state mutated → exit/side effect), including unchanged code on either side of the diff where bugs hide.
  - *Verify Claims & Edge Cases*: Does the traced path actually produce the claimed behavior? What inputs/states would break it (concurrency, retries, null/unicode/huge payloads, ordering)? What does it silently change?
  - *Assumed Decision Debt Check*: Scan `devflow/decisions/` for any ADR with `Status: Assumed`. Flag unratified assumptions as `Q-xxx` (P2) to ensure ratification before production handoff.
  - *No Rubber-Stamping*: "LGTM" is prohibited. State what was traced, what was verified, and what evidence supports the verdict.


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
   - `P2`: moderate debt, performance degradation, missing edge cases, or pure proportionality finding.
   - `P3`: minor improvement, code cleanup, cosmetic tweak.
   *(For a proportionality finding, state in Suggested fix what can be deleted. An otherwise pure proportionality finding is P2 or P3. Raise to P0/P1 only when the unnecessary machinery causes a concrete reachable defect or violates an established security or data-integrity boundary.)*
4. Set status: `open`, `fixed`, `closed`, `accepted`, or `invalid`.
5. Display concise findings summary and next actions.