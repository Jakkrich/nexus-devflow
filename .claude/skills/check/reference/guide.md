# Check guide - manual review guide

**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.

Where this sits in the workflow:

    /implement or /complete  ->  [check guide / try]  ->  human review
    (work exists)                (manual walkthrough)     (where to go, what to click)

`/check` proves behavior from the agent side. `/check guide` (and its alias `/try`) gives the user a practical
manual walkthrough: start this command, open this route, click these controls,
expect this result, and watch for these failure signs.

It is always read-only. Do not edit files, write activity state, update spec
status, run checks or the app, install dependencies, commit, merge, push, or
produce verification receipts. Reading files and git status is allowed. A guide
never counts as acceptance evidence or proof that any check passed.

The quality-gate config controls when another workflow generates this guide
automatically. An explicit `/check guide`, `$check guide`, or `/try` request always runs.
A generated guide never counts as evidence that the user performed the walkthrough.

## Input

Optional scope:

- no argument: use the active task spec in `devflow/context/{xxx-slug}/spec.md`
- `latest`: use the most recent archive under `devflow/history/features/`,
  `devflow/history/fixes/`, or `devflow/history/rollbacks/`
- a step name or number: focus the guide on that current task step
- a path, route, or command: include it as the main thing to try

If there is no active feature and no useful archive, ask what change the user
wants to try instead of guessing.

## Step 1 - find the work to explain

Read:

- `AGENTS.md`
- `devflow/config.json`
- `devflow/context/{xxx-slug}/spec.md` (or latest archive)
- latest files under `devflow/history/features/`, `devflow/history/fixes/`, and `devflow/history/rollbacks/`, if the current feature is reset
- Git branch and working tree status

Look up `devflow/context/project-overview.md` or `devflow/build-plan.md` passages
only when the spec is missing a route, command, data-state, or credential detail.

For `latest`, use the most recent archive even when an active spec exists.
Otherwise prefer the active spec. If the active spec is missing, use
the most recent archived feature, fix, or rollback by filename or modification time and
say that is what you used.

## Steps 2–4 - prepare and write the manual guide

Read and follow `check/reference/try-it-now.md` for extracting the routes/commands
(or removed-behavior path on rollback), identifying how to run the app, writing the
5-section manual guide, and reporting confidence and gaps.

## Rules

- Read-only only. Do not edit, commit, merge, push, install, or delete.
- Do not run the app or verification commands in guide mode. If the user asks
  you to try it for them, leave guide mode and explicitly route to `/check`
  verification, following its activity and authorization rules.
- Do not pretend a path is known when the spec does not say it. Give the best
  likely path and label uncertainty.
- Keep the guide short enough to follow while the app is open.
- Match the project's commands from `AGENTS.md`.

## Dual Compatibility with `/try`

In Nexus-DevFlow, `/try` and `/check guide` serve the same user purpose and can be used interchangeably.

## Formatting

Format the output to match the project's conventions in
`devflow/context/ai-interaction.md`: concise, scannable markdown, with numbered
steps for the manual path and short bullets for warnings.
