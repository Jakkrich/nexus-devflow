---
name: doctor
description: "[devflow] Run a DevFlow health and context check covering setup, adapters, commands, visibility, plans, overview freshness, configuration, dashboard state, and workflow drift. May offer to reset malformed generated dashboard state after approval. Use for /doctor, setup problems, context overhead, or health checks."
---

# doctor - DevFlow health check

**Context reuse:** Reuse any required file already loaded in project instructions or the current session. Read it again only if absent, changed, or exact current bytes or line references are needed.

Where this sits in the workflow:

    any time  ->  [doctor]  ->  reads setup + plans + workflow state + git
                  (diagnostic)  prints health, warnings, and repair order

This skill answers one question: *is this DevFlow project ready to use?* It is
the diagnostic pass for setup drift, incomplete onboarding, missing files,
placeholder plans, stale generated context, DevFlow visibility, and confusing
workflow state. It never changes anything: no edits, no commits, no installs, no
builds, no branch changes. Its only repair is an approved reset of a malformed
generated `devflow/.state/run.json` file.

Use `/status` when the user mainly wants progress and the next build action. Use
`/doctor` when the user wants to know whether the workflow itself is healthy.

## Input

None. `/doctor` takes no argument.

## What it checks

Gather these, then summarize. Do not dump file contents.

1. **Required DevFlow files**
   - Confirm `AGENTS.md`, `devflow/project-plan.md`,
     `devflow/build-plan.md`, and `devflow/context/` exist.
   - Confirm `devflow/context/project-overview.md`,
     `devflow/context/coding-standards.md`,
     `devflow/context/ai-interaction.md`, and
     `devflow/context/glossary.md` exist.
   - Confirm `devflow/history/features/` and `devflow/history/fixes/` exist.
     When the rollback skill is installed, also check
     `devflow/history/rollbacks/`. A missing rollback folder on a legacy
     installation is a warning, not a blocker; `/complete` creates it on the
     first rollback.
   - Check `devflow/context/findings.md` and `devflow/context/{xxx-slug}/findings.md`.
     Missing on a legacy installation is a warning, not a blocker; `/audit` and `/complete` create it on first use.
     When present, confirm its entry headers still match
     `### <id> [<severity>] <status> - <title>` and warn on a malformed ledger.
     Report any P0 or P1 finding still `open` or `fixed` by ID, since it will
     block `/complete`. Never block on the ledger yourself.
   - Check `devflow/context/review.md` and `devflow/context/{xxx-slug}/review.md`. Missing is a
     warning, not a blocker; `/audit independent current` and `/complete` create
     it on first use. When present, validate the required request or receipt
     fields and report pending, changes-requested, malformed, or stale state.
   - If `.gitignore` marks DevFlow workflow files as local-only, still require
     the files to exist on disk. Ignored but present is healthy; ignored and
     missing means the local workflow needs to be restored.
   - Read `devflow/config.json` when present. Missing is healthy and means
     built-in defaults. When present, require a regular non-symbolic-link JSON
     file with `schemaVersion: 1`. Reject unknown keys and unsupported values.
     Report the effective workflow, git, verification, regular quality-gate,
     Continuous quality-gate, and Continuous Mode settings. Confirm each audit,
     independent-review, check, and try-guide gate uses its supported values and
     defaults to `manual`.
     An invalid config is a setup blocker for mutating workflow skills because
     they must not guess which policy to follow.
2. **Tool adapters**
   - Read `.nexus/nexus-devflow.json` when present and report its exact
     logical adapters: Codex, Claude Code, GitHub Copilot, Antigravity, and OpenCode.
   - Confirm at least one compatible skill tree exists. Codex, Antigravity, and
     GitHub Copilot use `.agents/skills/`. Claude Code uses `.claude/skills/`.
   - Confirm each installed adapter tree contains
     `doctor/scripts/run-state.mjs`. This managed helper validates and atomically
     writes dashboard activity. A missing helper needs a DevFlow update before
     tracked commands can record activity safely.
   - If both skill trees are present, say that is healthy when the selected
     tools require both. Compare their skill folder names and warn about missing
     skills on either side.
   - If OpenCode is selected, do not require `.opencode/skills/`. If it contains
     duplicate DevFlow skills alongside `.agents/skills/` or `.claude/skills/`,
     warn that OpenCode discovers all of those locations and the duplicate tree
     should be reviewed.
   - If git shows changes under `.agents/skills/` or `.claude/skills/`, check
     the matching adapter file too. Warn when workflow behavior was updated in
     one adapter but not the other.
   - If only one tool is used, mention the unused adapter can be deleted. Do not
     treat extra adapters as an error.
   - If `CLAUDE.md` exists and still starts with `# Project Name`, flag that
     `/onboard` probably has not finished.
3. **Commands and project setup**
   - Check whether root `README.md` is still the copied DevFlow workflow doc
     by looking for `# AI Coding Blueprint` or opening text that describes the
     workflow instead of the app. If so, warn that `/onboard` should
     replace it with a project README before publishing.
   - If `devflow/README.md` clearly contains copied workflow docs,
     report it as an obsolete installer artifact. Its absence is healthy. An
     unchanged managed copy can be removed by the updater; a modified copy needs
     user review.
   - Check whether `AGENTS.md` has a `## Commands` section with dev and build
     commands.
   - Report missing lint or test commands as informational unless the project has
     real lint or test scripts elsewhere that are not reflected in `AGENTS.md`.
   - If `package.json` exists, compare its scripts against `AGENTS.md` at a high
     level. Do not require every script to be documented.
   - If `AGENTS.md` declares a `Verify` command, confirm it resolves to real
     project commands in the expected order: typecheck, tests when configured,
     then build. Do not require checks the project does not have.
   - If `.github/workflows/verify.yml` exists, confirm it runs the exact documented
     `Verify` command for pull requests and pushes to the default branch, uses the
     detected runtime and package manager, and starts with read-only contents
     permission. Preserve other workflows and report overlap for review.
   - A missing `Verify` command or GitHub workflow is informational. It means the
     optional automatic-check setup was not selected, not that DevFlow is
     unhealthy.
4. **Visibility and context loading**
   - Confirm whether DevFlow files are public in git or listed in `.gitignore`
     as local-only.
   - When Claude Code is installed, report its startup-context shape. Confirm
     `CLAUDE.md` imports `AGENTS.md` and lets skills load planning context on demand.
5. **Project and build plans**
   - Read `devflow/project-plan.md` and `devflow/build-plan.md`.
   - Report total features in the build plan, how many are checked off (`- [x]`),
     and which feature is next.
   - Flag placeholder text (e.g. `[Your project name]`, `Feature 1 description`).
6. **Project overview freshness**
   - Read `devflow/context/project-overview.md` if it exists.
   - Report its byte size. At or above 20,000 bytes, call it oversized and say
     `/feature` should stop until `/overview` regenerates a compact
     consolidation.
   - If either planning file appears newer than the overview by filesystem time,
     call the overview possibly stale and suggest `/overview` before feature work.
7. **Current workflow state**
   - Inspect `devflow/.state/run.json` when it exists. Missing means no recorded
     activity and is healthy. Require a regular non-symbolic-link JSON file that
     matches dashboard schema version 1 from `AGENTS.md`.
   - If the path is a symbolic link or not a regular file, do not read, replace,
     or remove it. Report the exact path for manual review.
   - If the regular file is invalid JSON or does not match the schema, report it
     as malformed generated state. Explain that resetting it removes only the
     dashboard's last-command record, not project work, and that the next tracked
     DevFlow command recreates it.
   - Offer this exact repair question: `Reset the malformed dashboard state now?`
     On approval, use the installed dashboard activity helper's `reset` action.
     It confirms the exact path is a regular non-symbolic-link file and removes
     only `devflow/.state/run.json`. Verify the file is absent and report the
     dashboard state as reset. Never remove `devflow/.state/`, its manifest,
     backups, or any project file. Without approval, leave it unchanged and
     include the reset in `Repair order:`.
   - If a spec is active in `devflow/context/{xxx-slug}/`, report checked and unchecked implementation steps.
   - If no active task directory exists in `devflow/context/` but git has source or workflow
     changes, warn that work is happening without an active spec.
   - Flag active spec on `main`, all spec steps checked but no completion, or a
     branch that does not match `feature/{xxx-slug}`, `fix/{xxx-slug}`, or `rollback/{xxx-slug}`.
8. **Git**
   - Report current branch, clean vs dirty working tree, rough changed-file count,
     last commit subject, and whether the branch is ahead of upstream.
   - If the directory is not a git repo, report that as a setup issue and keep
     going.

## Output

Print a compact health report with these labels:

    Health: Pass | Needs attention | Blocked
    Setup: ...
    Verification: ...
    Adapters: ...
    Visibility: ...
    Plans: ...
    Workflow: ...
    Git: ...
    Watch: ...
    Repair order: ...

Use `Watch:` only when there are warnings. Use `Repair order:` for the exact next
steps, in order. Keep it short and practical.

Choose the repair order in this priority:

- Required DevFlow files missing -> overlay DevFlow again, or use `/adopt` for a brownfield app.
- No git repo -> initialize git before using the build loop.
- No tool adapter -> restore `.agents/skills/` or `.claude/skills/` for the
  selected tool. OpenCode can use either compatible tree.
- Installed adapter is missing `doctor/scripts/run-state.mjs` -> update
  DevFlow before relying on dashboard activity.
- Onboarding incomplete -> run `/onboard`.
- Root README is still the DevFlow workflow doc -> run `/onboard` to replace
  it with a project README before publishing.
- Plans are placeholders -> fill `devflow/project-plan.md` and
  `devflow/build-plan.md`.
- Overview missing or stale -> run `/overview`.
- Malformed regular `devflow/.state/run.json` -> offer to reset that exact
  generated file, then rerun `/doctor` or refresh the dashboard.
- Active spec has unchecked steps -> run `/status` or `/implement`, depending on
  whether the user wants orientation or action.
- A P0 or P1 finding is `open` -> repair it through `/implement` while a spec
  is active, or `/fix <finding id>` between work items. One that is `fixed` ->
  `/audit` to re-review and close it. Both come before suggesting `/complete`.
- Active spec is done but not closed -> run `/check`, then `/complete`.
- Everything is healthy -> say so, then suggest `/status` for progress or
  `/feature` for the next planned feature.

## Rules

- **Diagnostic by default.** This skill never edits project files, commits, runs
  installs, runs builds or tests, or switches branches. It may remove only a
  malformed regular `devflow/.state/run.json` through the installed helper
  after the user approves the exact reset described above.
- **Diagnose, then order repairs.** Do not just list problems. End with the
  smallest ordered sequence that gets the project back to a healthy state.
- **Do not over-police adapters.** Extra adapters are optional clutter, not a
  failure.
- **Be conservative with stack-specific checks.** If a command or ignore pattern
  is uncertain, mark it for review instead of inventing a hard failure.
- **Stay concise.** A doctor pass should feel like a checklist, not an audit.

## Formatting

Format the output to match the project's conventions in
`devflow/context/ai-interaction.md`: concise, scannable markdown, with lists for
enumerations and tables for matrices rather than dense paragraphs.