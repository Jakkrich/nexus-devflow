# Nexus-DevFlow Setup

This guide is for humans installing Nexus-DevFlow themselves.

If you want an AI assistant to install or upgrade it for you, copy the prompt in [Install With AI](#install-with-ai) and send it to your AI tool. The detailed AI playbook lives in [SETUP-BY-AI.md](./SETUP-BY-AI.md).

## Requirements

- Node.js 18.17 or newer
- npm
- git, if you want to update from the repository
- A local checkout of this repository

## 1. Clone Or Open The Framework

Recommended shared location on this machine:

```powershell
cd D:\Projects\nexus-devflow
```

If you use another path, replace `D:\Projects\nexus-devflow` in the commands below.

## 2. Validate The Framework

```powershell
npm run validate
```

This checks the framework bundle, required files, roadmap artifacts, and generated project indexes.

## 3. Install Globally For Codex

Codex has a built-in global install path in this repository:

```powershell
cd D:\Projects\nexus-devflow
npm run codex:update-global
npm run codex:check-global
```

The installer writes:

- `%USERPROFILE%\.codex\skills\nexus-devflow\SKILL.md`
- `%USERPROFILE%\.codex\nexus-devflow.json`
- a managed Nexus-DevFlow block in `%USERPROFILE%\.codex\AGENTS.md`

`codex:check-global` verifies the global skill, manifest, framework root, installed version, installer syntax, and framework validation.

## 4. Upgrade The Codex Global Install

Use this when the local checkout already has the version you want:

```powershell
cd D:\Projects\nexus-devflow
npm run codex:update-global
npm run codex:check-global
```

Use this when you want to pull the latest repository version first:

```powershell
cd D:\Projects\nexus-devflow
npm run codex:update-global:pull
```

`codex:update-global:pull` refuses to pull when the working tree is dirty. Review, commit, or stash local changes first.

## 5. Use Nexus-DevFlow In A Project

After the global install, ask Codex for Nexus-DevFlow or a numbered workflow from any project:

```text
/05-Goal "add password reset with email token and regression tests"
/30-Task "Add password reset"
/31-Plan 001
/32-Code 001
/33-Verify 001
```

Project artifacts should stay in the target project's own `.workspaces` folder. Do not share or link `.workspaces` between projects.

## 6. Optional Project-Local Link

If you want a target project to use this framework directly:

```powershell
cd D:\Projects\nexus-devflow
npm run link-project -- D:\Path\To\YourProject
```

Then copy or adapt the `scripts` block from Nexus-DevFlow's `package.json` into the target project's `package.json`.

Shared engine files:

- `.agent/`
- `scripts/`

Project-specific files:

- `.workspaces/`
- `package.json`
- `INITIAL.md`
- `ROADMAP.md`

## 7. Manual Project-Local Copy

If symlinks are not appropriate:

1. Copy `.agent/` into the target project root.
2. Copy `scripts/` into the target project root.
3. Merge the relevant npm scripts from this repository's `package.json`.
4. Run `npm run activate`.
5. Run `npm run validate`.

## Install With AI

Copy this single prompt into your AI assistant:

```text
Install or upgrade Nexus-DevFlow for this machine/project. First read SETUP-BY-AI.md from the Nexus-DevFlow repository and follow it as the source of truth. Detect the framework root, package version, target AI provider, and target project. Before upgrading, check git status, package.json version, CHANGELOG latest version, and any existing installed manifest/version for this provider. Do not overwrite user files blindly. Keep .workspaces project-specific. After install or upgrade, run the relevant validation commands, report the installed version, the framework root, files changed, and any provider-specific manual steps I must approve.
```

## Troubleshooting

- If `codex:check-global` reports a version mismatch, run `npm run codex:update-global` from the framework root and check again.
- If `codex:update-global:pull` refuses to pull, inspect `git status --short` and resolve local changes first.
- If validation says task JSON is malformed, run `npm run agent -- json:repair <ID> <artifact>` and then `npm run agent -- validate <ID>`.
- If `.agent` files are missing in a project-local install, restore or relink the framework bundle before running validation.
