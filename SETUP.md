# Nexus-DevFlow 2.0 Setup

This guide is for humans installing or updating Nexus-DevFlow 2.0.

If you want an AI assistant to do the work for you, use [SETUP-BY-AI.md](./SETUP-BY-AI.md).

## Requirements

- Node.js 18.17 or newer
- npm
- git
- one central local checkout of this repository

Framework example:

```powershell
cd D:\Projects\nexus-devflow
```

## 1. Validate The Central Framework Checkout

Run these commands from the framework root before installing or updating anything:

```powershell
npm.cmd run roadmap:validate
npm.cmd run validate
npm.cmd run validate:all
```

## 2. Optional: Install Globally For Codex

This is separate from installing Nexus-DevFlow into a target project.
Use it when you want Codex itself to know the Nexus-DevFlow workflow from any project.

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run codex:update-global
npm.cmd run codex:check-global
npm.cmd run validate
```

This installs:

- `%USERPROFILE%\.codex\skills\nexus-devflow\SKILL.md`
- `%USERPROFILE%\.codex\nexus-devflow.json`
- the managed Nexus-DevFlow block in `%USERPROFILE%\.codex\AGENTS.md`

In this Codex integration mode, DevFlow commands such as `/00-Discover`, `/10-Define`, `/50-Verify`, `Check-For-Updates`, and `Help` are prompt forms routed through that single global skill.
They are not installed as separate generated command files.

## 3. Install Into A Project

Choose one of these three methods:

| If you want... | Use this method |
| --- | --- |
| one central framework shared across many projects | `Central clone + link` |
| no links or junctions in the target project | `Manual copy / overwrite` |
| AI to perform the setup for you | `Let AI install or update it` |

### Method 1. Central Clone + Link (Recommended)

Use this when Nexus-DevFlow should stay in one central checkout and be reused by multiple projects.

From the framework root:

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run link-project -- D:\Path\To\TargetProject
```

This links the managed Nexus-DevFlow bundle into the target project:

- `.agent/`
- `docs/`
- `scripts/`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `SETUP-BY-AI.md`
- `USAGE.md`

This command intentionally does not link:

- `.workspaces/`
- `package.json`
- maintainer files such as `ROADMAP.md` and `CHANGELOG.md`

After linking:

1. merge the Nexus-DevFlow scripts you want from the framework `package.json` into the target project's `package.json`
2. from the target project, run `node .\scripts\activate-agent.mjs`
3. from the target project, run `node .\scripts\validate-framework.mjs`
4. if you merged npm scripts, you can then use `npm.cmd run activate` and `npm.cmd run validate`

Important rule:

- keep `.workspaces` local to the target project

### Method 2. Manual Copy / Overwrite

Use this only when links or junctions are not suitable.

The managed bundle for manual copy is the same set used by `link-project`:

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
- unrelated user-owned project files

Suggested procedure:

1. update and validate the central framework checkout
2. remove or replace the previously managed Nexus-DevFlow bundle in the target project
3. copy the managed bundle into the target project
4. merge the required npm scripts into the target project's `package.json`
5. run `node .\scripts\activate-agent.mjs` from the target project
6. run `node .\scripts\validate-framework.mjs` from the target project

### Method 3. Let AI Install Or Update It

Use this when you want an AI assistant to choose the correct path and perform it for you.

Give the AI this prompt:

```text
Install or update Nexus-DevFlow for this project. First read SETUP-BY-AI.md from the Nexus-DevFlow repository and use it as the source of truth. Prefer the recommended Central clone + link method. If linking is not suitable, use Manual copy / overwrite instead. Keep .workspaces local to the target project. Do not overwrite user-authored instruction files blindly. Run validation after setup and report the framework root, version, target project, method used, files changed, and any manual follow-up.

git-repo: https://github.com/Jakkrich/nexus-devflow
```

## 4. How To Update Each Method

| Current method | How to update |
| --- | --- |
| `Central clone + link` | update the central framework checkout, run validation once there, and linked projects will use the latest bundle immediately |
| `Manual copy / overwrite` | update the central framework checkout, validate it, then copy the managed bundle into each target project again |
| `Let AI install or update it` | ask the AI to detect the current method and reapply the matching update path |
| `Codex global install` | run `npm.cmd run codex:update-global`, then `npm.cmd run codex:check-global` |

If you want the latest repository state before a global Codex refresh:

```powershell
npm.cmd run codex:update-global:pull
```

Use the pull path only when the framework worktree is clean.

## 5. Troubleshooting

- if `link-project` reports existing managed files, rerun with `--overwrite` only when you intend to replace those managed targets
- if global install, check, or update behavior is unexpected, use [docs/install-update-troubleshooting.md](./docs/install-update-troubleshooting.md)
- if `.agent` files are missing after a project-local install, relink or recopy the managed bundle
- if old notes mention JSON task contracts or dashboard runtime, treat them as legacy 1.x history
