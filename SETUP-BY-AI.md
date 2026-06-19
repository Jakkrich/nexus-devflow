# Nexus-DevFlow 2.0 Setup By AI

This guide is for AI assistants installing or upgrading Nexus-DevFlow 2.0 for a user.

## Mission

Install or upgrade Nexus-DevFlow so the user's AI tool can:

- read the `.agent` bundle
- route work through DevFlow 2.0 stages
- keep artifacts in each target project's own `.workspaces` folder

Always report:

- framework root
- framework version
- target project
- provider or tool
- install mode used
- files changed
- validation commands run
- warnings or manual follow-up

## Core Rules

- Do not overwrite user-authored instructions blindly
- Do not link or copy `.workspaces` from the framework into another project
- Do not claim setup is complete until validation has passed
- Prefer managed blocks with clear start/end markers in provider instruction files
- Treat legacy JSON/dashboard docs as history, not active engine behavior

## Detect The Framework

Confirm:

- `package.json`
- `.agent/`
- `scripts/`
- `AGENTS.md`
- `docs/quickstart.md`

Read:

```powershell
Get-Content package.json
Get-Content CHANGELOG.md -TotalCount 80
npm.cmd run validate
```

## Install Modes

### Mode A. Codex Global Install

Use when the user wants Nexus-DevFlow available from any project in Codex.

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run codex:update-global
npm.cmd run codex:check-global
```

Confirm:

- `%USERPROFILE%\.codex\skills\nexus-devflow\SKILL.md`
- `%USERPROFILE%\.codex\nexus-devflow.json`
- managed block in `%USERPROFILE%\.codex\AGENTS.md`

### Mode B. Provider Instruction Install

Use when another AI tool reads a project-level or user-level instruction file.

Add a managed Nexus-DevFlow block that:

- states framework root and version
- tells the tool to read `.agent/workflows/`
- enforces markdown-first artifacts
- points to `npm.cmd run validate`

### Mode C. Project-Local Link

Use when a project should call this framework directly.

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run link-project -- D:\Path\To\Project
```

Then validate from the target project:

```powershell
npm.cmd run activate
npm.cmd run validate
```

### Mode D. Project-Local Copy

Use only when links are not suitable.

Copy:

- `.agent/`
- `scripts/`

Then merge needed npm scripts and validate in the target project.

## Upgrade Procedure

Before upgrading:

```powershell
git status --short
Get-Content package.json
Get-Content CHANGELOG.md -TotalCount 80
```

If the tree is dirty:

1. do not pull
2. report dirty files
3. ask whether to commit, stash, discard, or skip pull

If clean and the user wants latest:

```powershell
git pull --ff-only
npm.cmd run validate
```

Then reapply the install mode used before.

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
```

For project-local install, also validate from the target project.

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
