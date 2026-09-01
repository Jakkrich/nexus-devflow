# Independent review record

`devflow/context/{xxx-slug}/review.md` holds one active request or latest receipt for the
current work item. It is generated workflow state that is committed with the
work, archived by `/complete`, and then reset.

## Reset stub

```markdown
# Independent Review

> **Generated file.** Holds the active independent-review request or latest
> receipt for the current work item. `/audit independent current` prepares a
> handoff against an approved checkpoint, a fresh reviewer session completes it,
> and `/complete` refuses stale, pending, or changes-requested review state.

_No independent review requested. Run `/audit independent current` to prepare one._
```

## Pending request

Use full commit SHAs, the exact permitted base ref used to calculate the merge base,
a lowercase SHA-256 hash of the exact
`devflow/context/{xxx-slug}/spec.md` bytes, an ISO-8601 timestamp, and one of
`antigravity`, `claude`, `codex`, `copilot`, or `opencode` for each adapter field.
Model fields use the full identifier exposed by runtime or session metadata,
not a generic family label. When unavailable, record
`unknown (runtime did not expose exact model)` instead of guessing. When the
review runtime cannot select a specific model before the session starts, use
`runtime default (exact model not known until reviewer starts)` for Requested
model and record the exact runtime model in the completed receipt.

```markdown
# Independent Review

**Status:** pending
**Target commit:** <full 40-character checkpoint SHA>
**Base commit:** <full 40-character merge-base SHA>
**Base ref:** <local branch or remote-tracking ref used for the merge base>
**Spec hash:** <64-character SHA-256>
**Prepared by:** <adapter>
**Builder model:** <exact model reported by the builder runtime>
**Requested reviewer:** <adapter>
**Requested model:** <exact model or user-selected runtime default>
**Requested at:** <ISO-8601 timestamp>
**Workflow:** <regular or continuous>
**Check required:** <yes or no>

## Handoff

Review the active spec and the complete `<base>..<target>` delta in a fresh
session without the builder conversation. Run all Audit lenses from scratch.
Run Check when required above. Do not edit product code, accept findings, or
reuse the existing findings as the review scope.
```

For an independently enforceable receipt, `Base ref` must be a locally recorded
remote default branch, local `main`, or local `master`. It cannot be the current
work branch, and `Base commit` cannot equal `Target commit`. If none of those
base refs reliably covers the active work, stop instead of creating a receipt
whose review range cannot be re-derived.

## Completed receipt

Keep the request fields unchanged and replace `pending` with `passed` or
`changes-requested`. Add these fields and sections:

```markdown
**Reviewer adapter:** <adapter>
**Reviewer model:** <exact model reported by the reviewer runtime>
**Reviewer context:** fresh session
**Reviewed at:** <ISO-8601 timestamp>
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** <passed or changes-requested>
**Check result:** <passed, failed, unavailable, or not-required>

## Commands

- `<command>`: <pass, fail, or unavailable>

## Evidence

- <safe concise evidence reference>

## Findings

- <finding IDs, or `None`>

## Remaining risk

- <risk or unavailable signal, or `None identified`>
```

Every unavailable verification command must appear under Remaining risk, even
when Check was not required and the receipt may still pass.

All four completed-receipt sections must contain at least one entry. Use
`- None`, `- None identified`, or `- No commands run` when that is the truthful
result. When Check is required, `Check result` must be `passed` before the
receipt can pass. Use `not-required` only when Check was not required.

Use `passed` only when all four lenses covered the complete target delta, every
required check passed, and no P0 or P1 finding is `open` or `fixed`.
P2 and P3 findings may remain with their normal ledger status. Use
`changes-requested` for a blocking finding, failed required check, incomplete
scope, adapter mismatch, or missing fresh-session declaration.

## Freshness

A receipt is current only when all of these hold:

- `HEAD` exactly equals `Target commit`.
- `Base ref` still resolves and its merge base with `Target commit` exactly
  equals `Base commit`, and it remains a locally recorded remote default branch,
  local `main`, or local `master`.
- The exact task spec bytes still match `Spec hash`.
- No tracked, staged, unstaged, or untracked path differs from the target except
  `devflow/context/{xxx-slug}/review.md` and `devflow/context/{xxx-slug}/findings.md`.
- The completed reviewer adapter matches `Requested reviewer`.
- The completed reviewer model exactly matches `Requested model`, unless the
  request explicitly selected the runtime-default sentinel above. In that case,
  `Reviewer model` must still contain the exact model exposed after the reviewer
  session starts, never the sentinel itself.

Any other code, test, configuration, spec, or acceptance-criteria change makes
the receipt stale. A stale receipt never proves the new state. Prepare a new
request against a new approved checkpoint and review the whole delta again.
