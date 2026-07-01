# Nexus-DevFlow 2.0 Setup By AI

This guide is for AI assistants installing or updating Nexus-DevFlow 2.0 for a user.

## Mission

Install or update Nexus-DevFlow so the user's AI tool can:

- read the `.agent` bundle
- route work through DevFlow 2.0 stages
- keep artifacts in each target project's own `.workspaces` folder

Always report:

- framework root
- framework version
- target project
- provider or tool
- method used
- files changed
- validation commands run
- warnings or manual follow-up

## Core Rules

- Do not overwrite user-authored instruction files blindly
- Do not link or copy `.workspaces` from the framework into another project
- Do not claim setup is complete until validation has passed
- Prefer the recommended `Central clone + link` method for project-local setup
- Use `Manual copy / overwrite` only when linking is unsuitable or explicitly rejected
- Treat `AI install` as guided execution of one of the supported methods, not as a separate bundle layout
- Treat legacy JSON/dashboard docs as history, not active engine behavior

## Detect The Framework

Confirm:

- `package.json`
- `.agent/`
- `docs/`
- `scripts/`
- `AGENTS.md`
- `docs/quickstart.md`

Read:

```powershell
Get-Content package.json
Get-Content CHANGELOG.md -TotalCount 80
npm.cmd run validate
```

## Supported Setup Routes

### Route A. Optional Codex Global Install

Use this only when the user explicitly wants Nexus-DevFlow available from any project in Codex.

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run codex:update-global
npm.cmd run codex:check-global
npm.cmd run validate
```

Confirm:

- `%USERPROFILE%\.codex\skills\nexus-devflow\SKILL.md`
- `%USERPROFILE%\.codex\nexus-devflow.json`
- managed block in `%USERPROFILE%\.codex\AGENTS.md`
- slash-command routing text for `/00-Discover`, `/10-Define`, `/50-Verify`, `Check-For-Updates`, and `Help`

Codex integration mode:

- use one global skill plus one managed global `AGENTS.md` block
- treat DevFlow command names as prompt forms routed by that single skill
- do not generate separate prompt files per command unless the user explicitly asks for that architecture

### Route B. Central Clone + Link (Recommended)

Use this when the user wants Nexus-DevFlow installed into a target project and links are acceptable.

From the framework root:

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run link-project -- D:\Path\To\TargetProject
```

This manages the following project-local bundle:

- `.agent/`
- `docs/`
- `scripts/`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `SETUP-BY-AI.md`
- `USAGE.md`

Do not link:

- `.workspaces/`
- `package.json`
- unrelated project files

Then validate from the target project:

```powershell
node .\scripts\activate-agent.mjs
node .\scripts\validate-framework.mjs
```

If the target project merged the framework npm scripts, `npm.cmd run activate` and `npm.cmd run validate` are also acceptable.

### Route C. Manual Copy / Overwrite

Use this only when the user rejects links or the environment makes linking unsuitable.

Copy the same managed bundle used by `link-project`:

- `.agent/`
- `docs/`
- `scripts/`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `SETUP-BY-AI.md`
- `USAGE.md`

Do not copy:

- `.workspaces/`
- `package.json`
- unrelated project files

Then validate in the target project:

```powershell
node .\scripts\activate-agent.mjs
node .\scripts\validate-framework.mjs
```

### Route D. AI-Guided Install Or Update

When the user says "install with AI" or "update with AI", do not invent a fourth bundle layout.

Instead:

1. detect whether the user wants optional Codex global setup, project-local setup, or both
2. for project-local setup, prefer `Central clone + link`
3. fall back to `Manual copy / overwrite` only when linking is unsuitable
4. keep `.workspaces` local to the target project
5. report the exact route used

## Upgrade Procedure

Before upgrading:

```powershell
git status --short
Get-Content package.json
Get-Content CHANGELOG.md -TotalCount 80
```

If the framework worktree is dirty:

1. do not pull
2. report the dirty files
3. ask whether to commit, stash, or skip pull

If clean and the user wants the latest checkout:

```powershell
git pull --ff-only
```

Then reapply the appropriate route:

- `Codex global install`: `npm.cmd run codex:update-global`
- `Central clone + link`: relinking is usually unnecessary after a framework update because targets already point at the central checkout
- `Manual copy / overwrite`: copy the managed bundle into each target project again

If the local checkout is already at the intended version, skip the pull and reapply only the needed install route.

## Validation Checklist

Run from framework root:

```powershell
npm.cmd run roadmap:validate
npm.cmd run validate
npm.cmd run validate:all
```

For Codex global install:

```powershell
npm.cmd run codex:check-global
npm.cmd run validate
```

For project-local setup, also validate from the target project using the linked or copied scripts.

If setup or update behavior is unexpected, use [docs/install-update-troubleshooting.md](./docs/install-update-troubleshooting.md).

## Standard Prompt For Users

```text
Install or update Nexus-DevFlow for this project. First read SETUP-BY-AI.md from the Nexus-DevFlow repository and use it as the source of truth. Prefer the recommended Central clone + link method. If linking is not suitable, use Manual copy / overwrite instead. Keep .workspaces local to the target project. Do not overwrite user-authored instruction files blindly. Run validation after setup and report the framework root, version, target project, method used, files changed, and any manual follow-up.
```

## Final Report Format

```text
Nexus-DevFlow setup result
- Mode:
- Framework root:
- Framework version:
- Target project:
- Provider:
- Files changed:
- Validation:
- Warnings or manual steps:
```

Keep it concise and factual.
