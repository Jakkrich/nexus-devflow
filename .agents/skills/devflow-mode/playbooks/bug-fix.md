# Bug Fix Playbook

**Every shipped fix traces to runtime reproduction. Never ship speculative belt-and-suspenders edits.**

1. Reproduce the failure directly on the real surface using the project `verify` driver skill (or `/debug` Track A/B commands); capture the failing output or error trace.
2. Binary-search the root cause from observed runtime state (`/debug` / git archaeology / targeted instrumentation), ruling out hypotheses until one mechanism survives.
3. Check the **Focused-fix exception**: skip broad `/discovery` only when interfaces, state semantics, schema, concurrency, and security invariants remain untouched and a cheap repro test exists.
4. Create `devflow/context/{xxx-slug}/spec.md` (`Type: Fix`) via `/fix`, write the failing regression test first (`[TDD-Red]`), then delegate the minimal fix to an isolated subagent (`fix/{xxx-slug}` or isolated worktree).
5. Verify on the exact original surface that the failure no longer reproduces (`[TDD-Green]`), plus run `verify-layers` and `audit` for security/data-integrity fixes.
6. Stop at **Option A Final Human Delivery Gate** (`option-a-evidence-packet`): show root cause, failing vs. passing repro output, diff summary, and proof artifacts in `devflow/reports/{run-id}/`.
