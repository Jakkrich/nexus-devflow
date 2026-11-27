# Brownfield Adoption Guide (Existing Codebase)

Use this guide when `/onboard` detects an existing codebase with shipped features, or when the user invokes `/onboard --adopt` (or legacy `/adopt`). Do not invent features or rewrite existing code conventions — observe what already exists.

## Step 1 - survey what already exists

Read the repo to establish the facts. Change nothing in this step. Establish:

- **Stack and tooling** - language(s), framework(s), and versions, from the real manifest (`package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Gemfile`, `Cargo.toml`, etc.). Note the package manager actually in use (lockfile).
- **Commands** - the real dev / build / test / lint scripts. These feed the Commands section of `AGENTS.md` and, per the testing opt-in switch, decide whether a testing gate even applies.
- **Conventions in practice** - directory layout, component/file naming, styling approach, state management, data-fetching pattern, error handling. Read what the code *does*, not what a default template prescribes.
- **Testing reality** - is a runner configured and are there tests, or none? Be honest; don't describe a gate the project hasn't adopted.
- **Verification and CI** - note any combined verification command, GitHub remote, `.github/workflows/`, or external CI. Preserve what already exists.
- **What the app already does** - the shipped features, inferred from routes, pages, entry points, and modules. This becomes the *checked* part of the build plan.

Keep notes; you'll turn them into the files in Step 3.

## Step 2 - interview for intent

The code reveals *what* and *how*, never *why* or *what next*. Ask the user a short set of questions (aim for three to five, not an interrogation) to fill the gaps:

- What is this project for, and who uses it? (the problem and the users)
- Is the stack and structure you found intentional, or are there parts they'd call legacy / want to change?
- What do you want to build next? (the unchecked items in the build plan)
- Anything the survey got wrong or missed?

If the user already gave intent up front, skip what they've answered. Don't ask what you can read from the code.

## Step 3 - generate the inputs

Write these, drawn from the survey (facts) and the interview (intent). Mark every inference you're unsure of with a clear `> TODO (confirm)` so the user can correct it rather than inherit a wrong guess.

- **`devflow/project-plan.md`** - the what & why, following the existing worksheet structure (problem, users, features, data, tech, monetization, UI/UX). The "features" and "tech" sections describe what *already exists*; the rest comes from the interview.
- **`devflow/build-plan.md`** - the ordered feature list as a checklist. **Mark shipped features `- [x]`** (the brownfield difference: the build plan reflects reality, so most of an existing app starts checked) and the roadmap items from the interview as `- [ ]`. This makes `/devflow` and `/feature` work immediately - the next unchecked item is genuinely what's next.
- **`devflow/context/coding-standards.md`** - rewrite the default to match the project's *actual* conventions from Step 1, not the shipped Next.js/Prisma defaults. Keep the Writing and Comments sections; replace the stack-specific ones with what the code really does. Its Testing section must reflect the real testing state (the opt-in switch is a `test` command in `AGENTS.md`).
- **`AGENTS.md` Commands section** - fill in the real dev / build / test / lint commands you found, and **remove `<!-- devflow:onboarding-required -->`** from `AGENTS.md` so status/doctor no longer flag incomplete onboarding. Include `Verify` when a real combined command exists.
- **`AI_HANDOFF.md`** - if present with starter placeholders (`<project-name>`, `<fill during /onboard>`), populate `§1 Current State`, `§3 Architecture & Entry Points`, `§4 Known Pitfalls`, and `§5 Tech Debt` from your Step 1 survey; never overwrite or delete existing team logs.

Do not write `project-overview.md`; that's `/overview`'s job, downstream of these.

## Step 4 - point to optional CI setup

Do not create or change Verify commands or GitHub workflows during adoption. Report any verification command or CI already present. When equivalent automatic pull-request checks are absent, mention the optional extension skill:

```text
Install optional CI extension with `npx nexus-devflow skill add ci` (or `@jakkrichm/create-nexus-devflow` for pre-release) when you want automatic GitHub checks.
```

Explain that CI is not required to finish adoption.

## Step 4b - bootstrap or validate project-local `verify` driver skill

Brownfield repositories usually already expose runnable commands, routes, or APIs. Inspect `.agents/skills/verify/SKILL.md` (and `verify-*/SKILL.md`):

- If present with `## Launch`, `## Doctor`, `## Drive`, `## Evidence`, and `## Cleanup` sections, verify its entrypoints match Step 1 and both `.agents/skills/verify/` and `.claude/skills/verify/` stay synced.
- If absent and a runnable surface exists, generate `.agents/skills/verify/SKILL.md` and `features/README.md` directly with exact H2 headings `## Launch`, `## Doctor`, `## Drive`, `## Evidence`, and `## Cleanup` and proof storage under `devflow/reports/{run-id}/`, sync `.agents/skills/verify/` and `.claude/skills/verify/` via `npx nexus-devflow skill sync` (or `npx @jakkrichm/create-nexus-devflow skill sync` / copying when both adapter trees exist), and execute one `Launch -> Doctor -> Drive -> Cleanup` smoke pass storing artifacts under `devflow/reports/onboard-verify/` so the generated driver is proven before handoff.

## Step 5 - ask about DevFlow visibility

Ask how the DevFlow workflow files should be handled in git, unless the user already gave a preference:

1. **Commit DevFlow workflow files (Recommended)**: Portable, best for teams and cross-machine work. Add the standard transient `.gitignore` block (`devflow/runs/*`, `devflow/discoveries/*`, `devflow/reports/*`, `devflow/research/*`, `devflow/scratch/*`, `devflow/decisions/*` except `README.md`, `devflow/inbox/*/raw/*`, `devflow/analysis/*`, `devflow/tmp/*`, `devflow/temp/*`, `devflow/brainstorm/*`, `devflow/brainstorms/*`, `devflow/backups/*`, `devflow/.state/`, `devflow/.vendor/`, `.nexus/`, `prototypes/*`).
2. **Keep DevFlow workflow files local (Zero-Visibility)**: Add `.agents/`, `.claude/`, `devflow/`, `CLAUDE.md`, `.nexus/`, `prototypes/` to `.gitignore`, keep `AGENTS.md` public-safe without DevFlow workflow internals and keep `AI_HANDOFF.md` tracked in Git for team handoffs, and check whether any local-only folders are already tracked (never run `git rm --cached` without explicit approval).

## Step 6 - review gate, then hand off

Stop and show the user what you generated, calling out:

- the **build-plan split** - what you marked shipped vs not, since that's the judgment most worth their eyes,
- every `> TODO (confirm)` you left,
- anything the survey and the interview disagreed on,
- verification command and GitHub checks status,
- DevFlow visibility choice, and a tracked-file warning if local-only mode was chosen after files were already tracked.

Have them review and adjust, then tell them to run `/overview` to distill the plans into `project-overview.md` and start the normal loop.

## Rules

- **Read-only until Step 3.** The survey changes nothing; only generation writes.
- **Reflect reality, don't prescribe.** `coding-standards.md` must match the code that exists.
- **Never invent intent.** Ask for the why and the roadmap; mark anything inferred with `> TODO (confirm)`.
- **Don't clobber owned work.** If the plans already have real content, confirm before touching them. Never run a scaffolder.
- **Be honest about testing.** If there's no runner, say testing is opt-in and not yet set up.
- Do not untrack DevFlow files with `git rm --cached` without explicit approval.
