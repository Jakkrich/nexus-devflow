---
description: Install, upgrade, or verify Nexus-DevFlow setup for this machine or project using SETUP-BY-AI.md as the source of truth.
argument-hint: [optional: target project path, provider/tool, or update intent]
---

# Check For Updates

`Check-For-Updates` is a public companion command for Nexus-DevFlow install, upgrade, and setup verification work.

It is not a numbered mainline stage.

## Mission

Install or upgrade Nexus-DevFlow 2.0 for this machine or target project.

First read `SETUP-BY-AI.md` from the Nexus-DevFlow repository and use it as the operational source of truth.

Detect:

- framework root
- package version
- provider or tool
- target project
- whether the current setup is using `Codex global`, `Central clone + link`, or `Manual copy / overwrite`

Keep `.workspaces` project-local.

Do not overwrite user instruction files blindly.

After install or upgrade, run `roadmap:validate`, `validate`, and `validate:all` where relevant, then report files changed, installed version, framework root, chosen route, and any manual approval steps.

Repository reference:

```text
https://github.com/Jakkrich/nexus-devflow
```

## When To Use

Use this command when:

- the user wants to install Nexus-DevFlow into Codex or another AI tool
- the user wants to install Nexus-DevFlow into a target project
- the user wants to upgrade an existing Nexus-DevFlow install
- the user wants to check whether the current machine or project is on the expected framework version
- the user needs routing across optional Codex global setup, `Central clone + link`, or `Manual copy / overwrite`

## Operating Rules

- `SETUP-BY-AI.md` is the operational source of truth
- prefer the safest route that matches the user request and existing environment
- for project-local setup, prefer `Central clone + link`
- use `Manual copy / overwrite` only when linking is unsuitable or explicitly rejected
- treat `AI install` as guided execution of one of the supported routes, not as a separate bundle layout
- preserve user-authored instructions outside managed Nexus-DevFlow content
- do not link, copy, or share `.workspaces` from the framework repo into another project
- if the framework repo is dirty, do not pull automatically; report the dirty files and ask before proceeding with a pull-based update
- do not claim success until the relevant validation commands pass

## Execution Flow

1. Read `SETUP-BY-AI.md`.
2. Detect the framework root and confirm the framework files listed there exist.
3. Detect the installed or target version from `package.json`.
4. Detect the provider or tool context.
5. Detect the target project and keep its `.workspaces` local to that project.
6. Detect the current route already in use, if any:
   - optional `Codex global`
   - `Central clone + link`
   - `Manual copy / overwrite`
7. Choose the route:
   - optional `Codex global` only when explicitly requested
   - `Central clone + link` for project-local setup by default
   - `Manual copy / overwrite` only when linking is not suitable
8. If upgrading and the user wants latest, inspect git cleanliness before any pull-based update.
9. Apply the relevant install or upgrade commands.
10. Run validation:
   - `npm.cmd run roadmap:validate`
   - `npm.cmd run validate`
   - `npm.cmd run validate:all`
   - plus provider-specific checks such as `npm.cmd run codex:check-global` when applicable
11. Report the outcome in the final setup result format.

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

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: before using DevFlow on a new machine, before linking or copying into a target project, after pulling framework changes, or during provider setup maintenance
- Typical handoff targets: `Help`, `/00-Discover`, or the user's requested active task after setup is verified

## Sources

- `SETUP-BY-AI.md`
- `SETUP.md`
- `AGENTS.md`
- `package.json`
- `docs/install-update-troubleshooting.md`

## Next Workflow Recommendation

- Default: return to the user's requested work after setup is verified
- Common routes: `Help` for routing, `/00-Discover` for new work, or `/50-Verify` when setup validation exposes framework issues
