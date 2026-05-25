<div align="center">

<img src="./docs/logo-nexus-devflow.png" alt="Nexus-DevFlow Logo" width="180" />

# Nexus-DevFlow

Agent-ready PRP workflow framework for turning goals into scoped specs, implementation plans, code tasks, verification reports, and release artifacts.

</div>

## Overview

Nexus-DevFlow is a developer workflow framework built around a single `.agent` bundle and project-local `.workspaces` artifacts. It gives human developers and AI coding agents a predictable path for planning, implementing, validating, reviewing, and shipping work.

The framework is intentionally script-first:

- Use npm scripts and the PRP CLI to create and update structured artifacts.
- Keep generated task data in `.workspaces`.
- Keep reusable workflow logic, agents, schemas, and commands in `.agent`.
- Validate artifacts before moving between workflow phases.

## Requirements

- Node.js `>=18.17`
- npm
- git, for repository updates and normal development flow
- PowerShell on Windows, or an equivalent shell for npm commands

On Windows, prefer `npm.cmd` if PowerShell blocks the `npm` shim.

## Quickstart

From the framework root:

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run activate
npm.cmd run validate
npm.cmd run agent:status
```

Create and validate a first task:

```powershell
npm.cmd run agent -- init 001 "First Task" first-task "Describe the first task"
npm.cmd run agent -- validate 001
```

Generated task artifacts are written under:

```text
.workspaces/specs/
```

## Core Workflow

Use the numbered workflow commands as phase gates. The common path for feature work is:

```text
/30-Task "Add password reset"
/31-Plan 001
/32-Code 001
/33-Verify 001
/34-Human Approve 001
/50-Commit "task 001"
```

For unclear product work, start with discovery:

```text
/10-Brainstorm "self-service billing portal"
/12-PRD "self-service billing portal"
/30-Task "Build self-service billing portal"
```

For bugs, start with root cause analysis:

```text
/20-Debug "checkout fails after payment success"
/30-Task "Fix checkout success handling"
/31-Plan 002
/32-Code 002
/33-Verify 002
```

For high-level goals, use goal routing:

```text
/05-Goal "add password reset with email token and regression tests"
```

## Workflow Groups

| Group | Commands | Purpose |
| :--- | :--- | :--- |
| Goal routing | `/05-Goal` | Classify a high-level request and route it to the right workflow. |
| Setup and status | `/00-Init`, `/02-Status` | Prepare project context and inspect framework state. |
| Discovery | `/10-Brainstorm`, `/11-Research`, `/12-PRD` | Clarify intent, research constraints, and produce product/spec inputs. |
| Debugging | `/20-Debug` | Reproduce, trace, and document root cause before planning a fix. |
| Core execution | `/30-Task`, `/31-Plan`, `/32-Code`, `/33-Verify`, `/34-Human`, `/35-Followup` | Move a task from requirements to implementation and validation. |
| Quality | `/39-QA-Orchestrate`, `/40-Test`, `/41-Simplify`, `/42-Preview` | Run deeper QA, testing, simplification, and preview checks. |
| Release | `/50-Commit`, `/51-PR`, `/52-Deploy`, `/53-Changelog`, `/54-Insight`, `/58-Merge` | Package, review, release, and record lessons. |
| Review and triage | `/55-PR-Review`, `/56-PR-Followup`, `/57-Issue-Triage` | Review pull requests, handle comments, and triage issues. |
| Knowledge and specialists | `/59-Wiki`, `/60-Graphify`, `/90-Agent`, `/99-Help` | Build knowledge artifacts, generate graphs, and invoke specialist agents. |

## PRP CLI

Run the PRP CLI through npm:

```powershell
npm.cmd run agent -- --help
npm.cmd run agent -- status
npm.cmd run agent -- validate 001
```

Prefer CLI commands over manual JSON edits:

```powershell
npm.cmd run agent -- artifact:get 001 requirements
npm.cmd run agent -- artifact:set 001 requirements priority high
npm.cmd run agent -- artifact:append 001 requirements acceptance_criteria "User can complete the target flow"
npm.cmd run agent -- plan:add-phase 001 "Backend implementation" --type implementation
npm.cmd run agent -- plan:add-subtask 001 phase-1 "Create API endpoint" --service backend
npm.cmd run agent -- plan:set-subtask-status 001 subtask-1.1 completed
npm.cmd run agent -- validate 001
```

If an artifact becomes invalid, repair it through the CLI and validate again:

```powershell
npm.cmd run agent -- json:repair 001 requirements
npm.cmd run agent -- validate 001
```

## npm Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run activate` | Prepare the local `.agent` bundle and workspace defaults. |
| `npm run validate` | Validate framework files, bundle paths, roadmap artifacts, and generated indexes. |
| `npm run validate:all` | Run the broader validation suite. |
| `npm run agent:status` | Show PRP framework status. |
| `npm run agent -- <command>` | Run PRP CLI commands. |
| `npm run index` | Regenerate project index artifacts. |
| `npm run sync:check` | Check `.agent` bundle consistency. |
| `npm run security:scan` | Scan for basic security hygiene issues. |
| `npm run dashboard` | Serve the local dashboard. |
| `npm run codex:update-global` | Install or update the global Codex Nexus-DevFlow skill. |
| `npm run codex:check-global` | Validate the global Codex install. |

## Project Layout

```text
.
|-- .agent/                         # Framework bundle: agents, commands, schemas, scripts, skills
|-- .workspaces/                    # Generated task, research, report, wiki, and roadmap artifacts
|-- docs/                           # Reference documentation
|-- scripts/                        # Root automation and validation scripts
|-- AGENTS.md                       # Agent and project operating instructions
|-- SETUP.md                        # Human installation guide
|-- SETUP-BY-AI.md                  # AI-assisted installation guide
|-- USAGE.md                        # Full workflow command reference
|-- ROADMAP.md                      # Framework roadmap
`-- package.json                    # npm command surface
```

Keep `.workspaces` project-specific. Do not share generated workspace artifacts between unrelated projects.

## Artifact Rules

- Treat `.agent` as the reusable framework bundle.
- Treat `.workspaces` as generated project state.
- Use PRP CLI commands for JSON artifacts whenever possible.
- Validate after changing requirements, plans, task state, or framework scripts.
- Keep framework updates reviewable; avoid duplicating `.agent` into multiple manually maintained bundles.

## Codex Global Install

Install or update Nexus-DevFlow for Codex:

```powershell
cd D:\Projects\nexus-devflow
npm.cmd run codex:update-global
npm.cmd run codex:check-global
```

The installer manages:

```text
%USERPROFILE%\.codex\skills\nexus-devflow\SKILL.md
%USERPROFILE%\.codex\nexus-devflow.json
%USERPROFILE%\.codex\AGENTS.md
```

To pull the latest repository changes before updating the global install:

```powershell
npm.cmd run codex:update-global:pull
```

This command refuses to pull when the working tree is dirty.

## Validation

Run these before handing off framework changes:

```powershell
npm.cmd run validate
npm.cmd run validate:all
npm.cmd run sync:check
```

For task-specific validation:

```powershell
npm.cmd run agent -- validate 001
npm.cmd run agent -- plan:validate 001
```

## Documentation

| Document | Use |
| :--- | :--- |
| [SETUP.md](./SETUP.md) | Manual install and upgrade instructions. |
| [SETUP-BY-AI.md](./SETUP-BY-AI.md) | AI-assisted install and upgrade playbook. |
| [USAGE.md](./USAGE.md) | Full workflow guide and command reference. |
| [docs/quickstart.md](./docs/quickstart.md) | Minimal local startup flow. |
| [docs/agent-bundle.md](./docs/agent-bundle.md) | `.agent` bundle model and rules. |
| [docs/workspace-artifacts.md](./docs/workspace-artifacts.md) | Workspace artifact layout. |
| [docs/json-artifact-contract.md](./docs/json-artifact-contract.md) | JSON artifact structure and contracts. |
| [docs/script-first-json-workflow.md](./docs/script-first-json-workflow.md) | CLI-first artifact editing workflow. |
| [docs/prompt-addons.md](./docs/prompt-addons.md) | Prompt addon and specialist workflow notes. |
| [AGENTS.md](./AGENTS.md) | Agent roles and operating instructions. |
| [ROADMAP.md](./ROADMAP.md) | Planned framework direction. |

## Maintainer Notes

- Keep README focused on setup, command surface, and developer workflow.
- Put detailed command behavior in `USAGE.md`.
- Put installation details in `SETUP.md` and `SETUP-BY-AI.md`.
- Update `CHANGELOG.md` when behavior changes.
- Run validation after modifying `.agent`, `scripts`, artifact schemas, or command documentation.

## License

Nexus-DevFlow is released under the [MIT License](./LICENSE).

You may use, copy, modify, merge, publish, distribute, sublicense, and sell your own modified versions, as long as the license notice is included with substantial portions of the software.
