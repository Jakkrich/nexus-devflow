# Nexus-DevFlow 2.0 Setup

This guide is for humans installing Nexus-DevFlow 2.0.

If you want an AI assistant to do it for you, use [SETUP-BY-AI.md](./SETUP-BY-AI.md).

## Requirements

- Node.js 18.17 or newer
- npm
- git
- a local checkout of this repository

## 1. Open The Framework

Example path:

```powershell
cd D:\Projects\nexus-devflow
```

## 2. Validate The Framework

```powershell
npm.cmd run roadmap:validate
npm.cmd run validate
npm.cmd run validate:all
```

## 3. Install Globally For Codex

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run codex:update-global
npm.cmd run codex:check-global
npm.cmd run validate
```

This installs:

- `%USERPROFILE%\.codex\skills\nexus-devflow\SKILL.md`
- `%USERPROFILE%\.codex\nexus-devflow.json`
- managed Nexus-DevFlow block in `%USERPROFILE%\.codex\AGENTS.md`

## 4. Upgrade Global Codex Install

If your local checkout is already at the version you want:

```powershell
npm.cmd run codex:update-global
npm.cmd run codex:check-global
npm.cmd run validate
```

If you want to pull latest first:

```powershell
npm.cmd run codex:update-global:pull
npm.cmd run codex:check-global
npm.cmd run validate
```

If any install, check, or update step fails, use [docs/install-update-troubleshooting.md](./docs/install-update-troubleshooting.md).

## 5. Use In A Project

After global install, call DevFlow 2.0 from any project:

```text
/00-Discover "Add password reset"
/10-Define
/20-Spec
/30-Plan
/40-Implement
/50-Verify
/60-Release
/70-Report
```

Companion commands such as `Goal`, `Brainstorm`, `Research`, `Debug`, `PRD`, `Issue-Triage`, `Wiki`, and `Help` can be used around the mainline.

## 6. Optional Project-Local Link

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run link-project -- D:\Path\To\YourProject
```

Then merge the needed `scripts` block into the target project's `package.json`.

Project-specific data must stay in the target project's own `.workspaces/`.

## 7. Project-Local Copy

Use this only when links are not suitable:

1. Copy `.agent/`
2. Copy `scripts/`
3. Merge needed npm scripts
4. Run `npm.cmd run activate`
5. Run `npm.cmd run validate`

## 8. Install With AI

Send this prompt to your AI assistant:

```text
Install or upgrade Nexus-DevFlow 2.0 for this machine or project. First read SETUP-BY-AI.md from the Nexus-DevFlow repository and use it as the source of truth. Detect the framework root, package version, provider/tool, and target project. Keep .workspaces project-local. Do not overwrite user instruction files blindly. After install or upgrade, run roadmap:validate, validate, and validate:all where relevant, then report files changed, installed version, framework root, and any manual approval steps.

git-repo: https://github.com/Jakkrich/nexus-devflow
```

## Troubleshooting

- After install or upgrade, always run `npm.cmd run codex:check-global` and `npm.cmd run validate`
- If install, check, or update behavior is unexpected, use [docs/install-update-troubleshooting.md](./docs/install-update-troubleshooting.md)
- If old notes mention task JSON or dashboard runtime, treat them as legacy 1.x history
- If `.agent` files are missing after a project-local install, relink or recopy the framework bundle
