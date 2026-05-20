<div align="center">

<img src="./docs/logo-nexus-devflow.png" alt="Nexus-DevFlow" width="150" />

# Nexus-DevFlow

### From loose intent to validated implementation, one DevFlow at a time.

**Agent-ready PRP workflow framework** for turning ideas into specs, plans, code changes, QA reports, roadmap artifacts, and reusable engineering knowledge.

[Usage](./USAGE.md) · [Quickstart](./docs/quickstart.md) · [Agents](./AGENTS.md) · [Roadmap](./ROADMAP.md) · [Workspace Artifacts](./docs/workspace-artifacts.md)

![Node](https://img.shields.io/badge/node-%3E%3D18.17-3fb950)
![Workflow](https://img.shields.io/badge/workflow-Task%20%E2%86%92%20Plan%20%E2%86%92%20Code%20%E2%86%92%20Verify-58a6ff)
![Agent Bundle](https://img.shields.io/badge/agent%20bundle-.agent-bc8cff)
![Status](https://img.shields.io/badge/status-active-d29922)

</div>

---

## What It Is

Nexus-DevFlow is a structured Context Engineering framework for AI-assisted software development. It gives agents and humans the same operating contract: create a task, write a spec, build an implementation plan, execute in small validated steps, and keep the resulting artifacts traceable.

The framework uses one active bundle, [`.agent`](./.agent), plus root-level npm scripts for activation, indexing, validation, dashboard support, Graphify integration, and PRP task operations.

Its most important rule is simple:

> JSON artifacts are script-first. Agents should use `npm run agent -- artifact:*`, `plan:*`, `validate`, and `repair` instead of rewriting full JSON files by hand.

---

## Why Teams Use It

| Capability | What You Get |
| :--- | :--- |
| **Goal-first routing** | `/05-Goal` classifies broad intent into DevFlow, PRD, Brainstorm, or Debug paths. |
| **Repeatable PRP lifecycle** | `/30-Task` → `/31-Plan` → `/32-Code` → `/33-Verify`, with artifacts at every step. |
| **Script-managed JSON** | Safer artifact mutation through CLI helpers instead of fragile manual edits. |
| **Specialist agents** | Planners, coders, reviewers, test engineers, security auditors, DevOps, docs, and coaches. |
| **Traceable workspaces** | Specs, PRDs, research, debug reports, QA reports, roadmap data, and lessons live under `.workspaces`. |
| **Validation gates** | Framework validation, plan validation, task validation, and dedicated runner tests. |

---

## The DevFlow

```mermaid
flowchart LR
    Goal["/05-Goal<br/>High-level intent"] --> Route{"Boss route"}
    Route -->|feature / fix / refactor| Task["/30-Task<br/>spec.md + requirements.json"]
    Route -->|product idea| PRD["/12-PRD<br/>product requirements"]
    Route -->|unclear idea| Brainstorm["/10-Brainstorm<br/>options + tradeoffs"]
    Route -->|failure / regression| Debug["/20-Debug<br/>RCA report"]

    PRD --> Task
    Brainstorm --> Task
    Debug --> Task

    Task --> Plan["/31-Plan<br/>implementation_plan.json"]
    Plan --> Code["/32-Code<br/>validated subtasks"]
    Code --> Verify["/33-Verify<br/>qa_report.md"]
    Verify --> Human["/34-Human<br/>approve / feedback"]
    Human --> Ship["/50-Commit<br/>/51-PR"]

    Verify -.issues found.-> Code
```

---

## Quick Start

Requirements:

- Node.js `>=18.17`
- Git

Prepare and validate the framework:

```powershell
npm.cmd run activate
npm.cmd run validate
```

Check current PRP task status:

```powershell
npm.cmd run agent:status
```

Run the PRP CLI:

```powershell
npm.cmd run agent -- --help
npm.cmd run agent -- init 001 "Example Task" example-task "Describe the task"
```

Try the goal runner:

```powershell
npm.cmd run goal -- goal "add a docs note explaining how to run the goal command" max-turns 10 dry-run
```

---

## Example Goal Sessions

### Small Feature

```powershell
npm.cmd run goal -- goal "add password reset with email token and regression tests" max-turns 20 dry-run
```

Expected route:

```text
DevFlow Task Execution
```

Recommended flow:

```text
/30-Task "Add password reset with email token and regression tests"
/31-Plan 007
/32-Code 007
/33-Verify 007
/34-Human Approve 007
```

### Debug / RCA

```powershell
npm.cmd run goal -- goal "debug login redirect loop after session expires" max-turns 15 dry-run
```

Recommended flow:

```text
/20-Debug "debug login redirect loop after session expires"
/30-Task "Fix login redirect loop after session expires"
/31-Plan 008
/32-Code 008
/33-Verify 008
```

Goal session logs are written to:

```text
.workspaces/specs/goal-sessions/session-{goal_id}.json
.workspaces/specs/goal_latest_session.json
.workspaces/specs/goal_execution_log.json
```

---

## Core Commands

| Command | Purpose |
| :--- | :--- |
| `npm.cmd run activate` | Prepare `.workspaces`, generate indexes, and record active `.agent` metadata. |
| `npm.cmd run validate` | Validate required files, JSON artifacts, roadmap references, and legacy cleanup. |
| `npm.cmd run goal -- goal "..." max-turns 20 dry-run` | Route a high-level goal and write a Boss-Worker session log. |
| `npm.cmd run agent -- <command>` | Run the PRP task CLI from `.agent/scripts/prp.mjs`. |
| `npm.cmd run agent -- artifact:*` | Read or update task JSON fields without rewriting full files. |
| `npm.cmd run agent -- plan:*` | Add phases, add subtasks, update subtask status, and validate plans. |
| `npm.cmd run graphify -- <args>` | Auto-install/repair Graphify, then run the Graphify CLI. |
| `npm.cmd run index` | Regenerate `.workspaces/project_index.json` and roadmap project index. |

---

## PRP Lifecycle

| Phase | Workflow | Main Artifacts |
| :--- | :--- | :--- |
| Create | `/30-Task` | `spec.md`, `requirements.json`, `task_metadata.json` |
| Plan | `/31-Plan` | `implementation_plan.json`, `context.json`, `plan.md` |
| Execute | `/32-Code` | source changes, `task_logs.json`, subtask statuses |
| Verify | `/33-Verify` | `qa_report.md`, validation result, final task status |
| Approve | `/34-Human` | approval, feedback, rejection, or follow-up direction |
| Ship | `/50-Commit`, `/51-PR` | commit message, PR summary, release-ready diff |

For the full command catalog, see [USAGE.md](./USAGE.md).

---

## Agent Roles

Specialist personas live in [`.agent/agents`](./.agent/agents).

| Area | Agents |
| :--- | :--- |
| Planning | `prp-core-planner`, `discuss-spec`, `prp-core-prd-architect`, `orchestrator`, `prp-core-boss` |
| Research | `codebase-explorer`, `codebase-analyst`, `web-researcher` |
| Implementation | `prp-core-coder`, `prp-core-worker`, `backend-specialist`, `frontend-specialist`, `database-architect` |
| Quality | `test-engineer`, `code-reviewer`, `security-auditor`, `performance-optimizer`, `silent-failure-hunter` |
| Git & Docs | `prp-core-git-committer`, `prp-core-git-pr-maker`, `docs-impact-agent` |
| Support | `coach-guideline`, `prp-core-codebase-assistant`, `devops-engineer` |

Invoke a specialist manually:

```text
/90-Agent code-reviewer .workspaces/specs/007
```

---

## Workspace Map

```text
Nexus-DevFlow/
  .agent/                    # Active Antigravity agent framework bundle
  .workspaces/               # Generated artifacts and task workspaces
    debug/                   # RCA and debug reports
    issues/                  # GitHub issue triage artifacts
    prds/                    # Product requirements documents
    reports/                 # QA, specialist, design, and review reports
    research/                # Research notes and brainstorm outputs
    specs/                   # PRP task workspaces and goal sessions
    roadmap/                 # Machine-readable roadmap artifacts
  docs/                      # Human-readable guides
  scripts/                   # Root automation scripts
```

| Folder | Related Workflows |
| :--- | :--- |
| `.workspaces/specs` | `/05-Goal`, `/30-Task` through `/35-Followup`, `/39-QA-Orchestrate`, `/54-Insight` |
| `.workspaces/research` | `/10-Brainstorm`, `/11-Research`, `/15-Spec-Research`, `/16-Competitor` |
| `.workspaces/prds` | `/12-PRD`, `/18-Spec-Orchestrate` |
| `.workspaces/debug` | `/20-Debug` |
| `.workspaces/reports` | `/14-Orchestrate`, `/40-Test`, `/41-Simplify`, `/55-PR-Review`, `/56-PR-Followup`, `/90-Agent` |
| `.workspaces/roadmap` | `/17-Roadmap` |

---

## Validation

Run these before committing framework changes:

```powershell
npm.cmd run validate
node .agent\scripts\test-prp.mjs
node .agent\scripts\test-goal-runner.mjs
```

Validate a task:

```powershell
npm.cmd run agent -- validate 007
npm.cmd run agent -- plan:validate 007
```

Repair a task artifact contract:

```powershell
npm.cmd run agent -- repair 007
npm.cmd run agent -- validate 007
```

---

## Documentation

| Guide | Covers |
| :--- | :--- |
| [Usage Guide](./USAGE.md) | Full workflow catalog, SOP paths, `/05-Goal`, and command examples. |
| [Quickstart](./docs/quickstart.md) | First setup and framework activation. |
| [Workspace Artifacts](./docs/workspace-artifacts.md) | Folder responsibilities and artifact cleanup rules. |
| [Agent Bundle](./docs/agent-bundle.md) | `.agent` bundle structure and activation model. |
| [JSON Artifact Contract](./docs/json-artifact-contract.md) | Required PRP JSON files and schema expectations. |
| [Script-First JSON Workflow](./docs/script-first-json-workflow.md) | Safe CLI commands for JSON mutation. |
| [Prompt Addons](./docs/prompt-addons.md) | Research, competitor, roadmap, QA, insight, and follow-up workflows. |
| [Roadmap](./ROADMAP.md) | Current roadmap summary. |
| [Agents](./AGENTS.md) | Persona list and specialist responsibilities. |

---

## Maintainer Notes

- `.agent` is the only active framework bundle.
- `.workspaces` is the canonical generated artifact directory.
- Root npm scripts are the supported command surface.
- Regenerate project indexes with `npm.cmd run index` after structural changes.
- Run `npm.cmd run validate` before committing framework changes.

<div align="center">

**Nexus-DevFlow: make the work visible, make the steps repeatable, make the result verifiable.**

</div>
