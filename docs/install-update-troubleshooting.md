# Install And Update Troubleshooting

Use this guide when Nexus-DevFlow install, link, copy, check, or update behavior is not what you expected.

## Start By Identifying The Route

Nexus-DevFlow now has three project-facing setup routes plus one optional Codex-global route:

- `Central clone + link` for the recommended project-local setup
- `Manual copy / overwrite` when links are not suitable
- `Let AI install or update it` when you want the AI to execute one of the supported routes
- optional `Codex global install` when you want Codex to know Nexus-DevFlow from any project

Always confirm which route you are trying to repair before changing files.

## Framework-Root Commands

Run these commands from the framework root:

```powershell
cd D:\Projects\nexus-devflow
```

Useful checks:

- `npm.cmd run codex:check-global`
- `npm.cmd run codex:update-global`
- `npm.cmd run codex:update-global:pull`
- `npm.cmd run validate`
- `npm.cmd run validate:all`

## Link Mode Problems

Recommended install command:

```powershell
npm.cmd run link-project -- D:\Path\To\TargetProject
```

If the command fails because targets already exist:

1. inspect the target project and confirm those paths belong to the managed Nexus-DevFlow bundle
2. rerun with `--overwrite` only when you intend to replace those managed targets

If the command finishes but the target project still is not ready:

1. confirm the linked paths exist in the target project:
   - `.agent/`
   - `docs/`
   - `scripts/`
   - `AGENTS.md`
   - `README.md`
   - `SETUP.md`
   - `SETUP-BY-AI.md`
   - `USAGE.md`
2. confirm `.workspaces/` was not shared from the framework repo
3. from the target project, run:

```powershell
node .\scripts\activate-agent.mjs
node .\scripts\validate-framework.mjs
```

If you merged npm scripts into the target project's `package.json`, `npm.cmd run activate` and `npm.cmd run validate` are also acceptable.

## Manual Copy / Overwrite Problems

If you are using manual copy mode:

1. confirm you copied only the managed bundle
2. confirm `.workspaces/` in the target project was preserved
3. confirm `package.json` was not overwritten blindly
4. rerun:

```powershell
node .\scripts\activate-agent.mjs
node .\scripts\validate-framework.mjs
```

If updates are not showing up:

1. update the central framework checkout first
2. rerun framework validation there
3. copy the managed bundle into the target project again

## AI Install Or Update Problems

If the AI chose the wrong route:

1. tell it explicitly whether links are acceptable
2. ask it to read `SETUP-BY-AI.md` again
3. ask it to report which route it is using:
   - optional Codex global install
   - `Central clone + link`
   - `Manual copy / overwrite`

If the AI updated the wrong files, compare the target project against the managed bundle list in `SETUP.md`.

## Optional Codex Global Problems

Run:

```powershell
npm.cmd run codex:check-global
```

What this command checks:

- the global Nexus-DevFlow skill exists
- the global manifest exists
- the global `AGENTS.md` managed block exists
- the manifest points at this framework root
- the installed version matches the current local framework version
- the install is still in `single-global-skill` slash-command mode
- the skill and managed block still mention the DevFlow command surface
- framework validation still passes

If the check fails:

1. confirm you are in `D:\Projects\nexus-devflow`
2. read the error closely to see whether it is a missing install, a root mismatch, a version mismatch, or a validation failure
3. run `npm.cmd run codex:update-global`
4. run `npm.cmd run codex:check-global` again

If you want to pull latest framework changes before refreshing the global install:

```powershell
npm.cmd run codex:update-global:pull
```

Use the pull path only when the framework worktree is clean:

```powershell
git status --short
```

## Validation Fails After Install Or Update

Run from the framework root:

```powershell
npm.cmd run validate
npm.cmd run validate:all
```

If the problem is in a target project, also run the linked or copied validation commands from that target project.

## Practical Recovery Paths

- project-local setup is unclear: open [SETUP.md](../SETUP.md)
- AI setup drifted: rerun with [SETUP-BY-AI.md](../SETUP-BY-AI.md) as the explicit source of truth
- link mode stale after framework update: relink only if managed targets were removed or damaged; otherwise linked projects already point at the updated central checkout
- manual copy mode stale after framework update: recopy the managed bundle into the target project
- global install missing or stale: run `npm.cmd run codex:update-global`, then `npm.cmd run codex:check-global`
