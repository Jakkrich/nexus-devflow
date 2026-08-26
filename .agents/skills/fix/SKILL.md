---
name: fix
description: "[devflow] Document an ad-hoc bug fix or small change (one not in the build plan) into devflow/context/{xxx-slug}/spec.md so it runs through the same build loop. Supports Multi-Run: drafts dedicated fix context and allows selective /implement [id]. Writes a short fix spec and stops; then /implement builds it and /complete logs it to devflow/history/fixes/ and merges. Use when running /fix, reporting a bug, or fixing an ad-hoc issue."
argument-hint: "[{title or issue-description}]"
---

# fix - document an ad-hoc fix, then build it like anything else

Where this sits in the workflow:

    /fix  ->  /implement  ->  /complete  ->  back to your features
    (spec     (build it,      (log to devflow/history/fixes/
     the fix)  reviewed)       + merge)

A fix is a bug or small change that isn't a planned build-plan feature. It runs
through the same loop as a feature (build with review gates, iterate, then merge);
it creates a dedicated run folder at `devflow/context/{xxx-slug}/` (e.g. `059-fix-login-error`).

## Input

A description of the bug or change, for example `/fix "password reset email never
sends"`. If the user just reported the problem in chat, use that.

The input may also be a finding ID from `devflow/context/findings.md`, alone
or with a description, for example `/fix F-03`.

## Step 1 - write the fix spec

Pull context from `devflow/context/project-overview.md` and `devflow/context/coding-standards.md`,
calculate the next sequential running ID (e.g. `059-fix-slug`),
then write a short spec to `devflow/context/{xxx-slug}/spec.md` (and update `devflow/context/current-feature.md`). Keep it lighter than a feature spec:

- **Title** - the bug or change in a few words.
- **Type:** Fix  (so `/complete` logs it to `devflow/history/fixes/`, not `devflow/history/features/`).
- **Fixes:** `<finding id>` - only when the fix targets a ledger finding. The
  stamp makes the repair traceable: `/implement` marks that finding `fixed`
  when the repairing step lands, and `/audit` re-reviews it before it closes.
- **The problem** - what's wrong or what needs to change, and where.
- **The fix** - the approach, and anything it must not break.
- **Build steps** - usually one small step; split only if the diff would be too
  big to read. Each ends with an observable "done when".
- **Verify** - how to confirm it's fixed (what to click or test).

Then stop. Tell the user to review the fix spec, then run `/implement` to build it.

## Rules

- A fix is not a build-plan item; don't add it to `build-plan.md`.
- Keep it small. If it's really a new feature, use `/feature` and the build plan
  instead.
- Same conventions as everything else (`devflow/context/coding-standards.md`).

## Formatting

Format the output to match the project's conventions in
`devflow/context/ai-interaction.md`: concise, scannable markdown, with lists for
enumerations and tables for matrices rather than dense paragraphs.