---
name: fix
description: "[devflow] Draft a task-isolated spec for a bug or small change. Use when invoking /fix or requesting a fix plan."
argument-hint: "[{title or issue-description}]"
---

# fix - document an ad-hoc fix, then build it like anything else

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

    /fix  ->  /implement  ->  /complete  ->  back to your features
    (spec     (build it,      (log to devflow/history/fixes/
     the fix)  reviewed)       + merge)

A fix is a bug or small change that isn't a planned build-plan feature. It runs
through the same loop as a feature (build with review gates, iterate, then merge);
it creates a dedicated run folder at `devflow/context/{xxx-slug}/` (e.g. `059-fix-login-error`).

## Input

A description of the bug or change, for example `/fix "password reset email never
sends"`. Use the reported problem as input when the user asks for a fix plan. A request to diagnose a problem belongs to `/debug`; a request to fix and verify it retains its full delivery scope.

The input may also be a finding ID from `devflow/context/{xxx-slug}/findings.md` (or previous findings), alone
or with a description, for example `/fix F-03`.

## Step 1 - write the fix spec

Pull context from `devflow/context/project-overview.md` and `devflow/context/coding-standards.md`,
calculate the next sequential running ID (e.g. `059-fix-slug`),
then write a short spec to `devflow/context/{xxx-slug}/spec.md`. Also initialize `stage.md` and `findings.md` in that folder. Its first heading must be exactly
`# Fix: <title>`, and it must retain the `**Type:** Fix` contract below. Keep it lighter than a feature spec:

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

For an explicit `/fix` or a planning-only request, present the spec as the completed deliverable and identify `/implement` as the next command. For an existing request to implement and verify the fix, preserve that authorization: use this spec as the internal handoff and continue through `/implement` without an extra approval pause. Ask only for unresolved material scope, design, or permission decisions.

## Rules

- A fix is not a build-plan item; don't add it to `build-plan.md`.
- Keep it small. If it's really a new feature, use `/feature` and the build plan
  instead.
- Same conventions as everything else (`devflow/context/coding-standards.md`).

## Formatting

Format the output to match the project's conventions in
`devflow/context/ai-interaction.md`: concise, scannable markdown, with lists for
enumerations and tables for matrices rather than dense paragraphs.