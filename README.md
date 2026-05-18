# PRPs-Framework

PRPs-Framework is an agent-ready Context Engineering framework for structured AI-assisted software development.

It gives teams a repeatable workflow for turning ideas into specs, plans, implementation logs, QA reports, and roadmap artifacts. The framework now uses a single active agent bundle, `.agent`, and root-level npm scripts for activation, indexing, validation, and PRP task operations.

## What This Provides

- Agent personas for planning, research, coding, testing, review, security, performance, Git, DevOps, and coaching
- Slash-command style workflow prompts under `.agent`
- JSON schemas and templates for task artifacts
- Static dashboard assets
- Canonical workspace artifacts under `.workspaces`
- Root npm scripts that replace the legacy Python IDE switcher

## Current Architecture

```text
PRPs-Framework/
.agent/                    # Antigravity IDE agent framework bundle
.workspaces/               # Canonical generated artifacts and task workspaces
  project_index.json
  roadmap/
    project_index.json
    roadmap_discovery.json
    roadmap.json
docs/                      # Human-readable guides
scripts/                   # Root npm automation
package.json               # Root command surface
ROADMAP.md                 # Human-readable roadmap
AGENTS.md                  # Agent persona overview
INITIAL.md                 # Project context index
SETUP.md                   # Setup guide
```

## Requirements

- Node.js >= 18.17
- Python 3 for helper scripts inside `.agent/scripts`
- Git

## Quick Start

```powershell
npm run activate
npm run validate
```

Check PRP task status:

```powershell
npm run agent:status
```

Run the PRP CLI directly:

```powershell
npm run agent -- --help
npm run agent -- init 001 "Example Task" example-task "Describe the task"
```

## Important Commands

| Command | Purpose |
| :--- | :--- |
| `npm run activate` | Prepare `.workspaces`, generate project indexes, and record active `.agent` metadata |
| `npm run index` | Regenerate `.workspaces/project_index.json` and roadmap project index |
| `npm run validate` | Validate required files, JSON artifacts, roadmap references, and legacy cleanup |
| `npm run sync:check` | Verify `.agent` is the single active framework bundle |
| `npm run agent -- <command>` | Run the PRP task CLI from `.agent/scripts/prp.mjs` |

## Core Workflow

The framework works in a JSON-driven cycle:

| Step | Command | Output |
| :--- | :--- | :--- |
| Create | `/30-Task` | `spec.md`, `requirements.json` |
| Plan | `/31-Plan` | `implementation_plan.json`, `context.json` |
| Execute | `/32-Code` | source changes, `task_logs.json` |
| Verify | `/33-Verify` | `qa_report.md`, final status |

## Roadmap Artifacts

Machine-readable roadmap artifacts live in:

```text
.workspaces/roadmap/
project_index.json
roadmap_discovery.json
roadmap.json
```

Human-readable roadmap summary:

```text
ROADMAP.md
```

## Documentation

- [Quickstart](docs/quickstart.md)
- [Workspace Artifacts](docs/workspace-artifacts.md)
- [Agent Bundle and npm Activation](docs/agent-bundle.md)
- [JSON Artifact Contract](docs/json-artifact-contract.md)
- [Roadmap](ROADMAP.md)
- [Agents](AGENTS.md)

## Notes for Maintainers

- `.agent` is the only active framework bundle.
- `.workspaces` is the canonical generated artifact directory.
- Root npm scripts are the supported command surface.
- Regenerate project indexes with `npm run index` after structural changes.
- Run `npm run validate` before committing framework changes.


