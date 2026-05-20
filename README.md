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

The framework uses one active bundle, [`.agent`](./.agent), plus workspace conventions that tell AI agents how to plan, edit, validate, and report work consistently.

Its most important rule is simple:

> JSON artifacts are script-first. The AI should update task artifacts through the PRP tooling instead of rewriting full JSON files by hand.

---

## Why Teams Use It

| Capability | What You Get |
| :--- | :--- |
| **Goal-first routing** | `/05-Goal` classifies broad intent into DevFlow, PRD, Brainstorm, or Debug paths. |
| **Repeatable PRP lifecycle** | `/30-Task` → `/31-Plan` → `/32-Code` → `/33-Verify`, with artifacts at every step. |
| **Script-managed JSON** | The AI mutates task artifacts through PRP helpers instead of fragile manual edits. |
| **Specialist agents** | Planners, coders, reviewers, test engineers, security auditors, DevOps, docs, and coaches. |
| **Traceable workspaces** | Specs, PRDs, research, debug reports, QA reports, roadmap data, and lessons live under `.workspaces`. |
| **Validation gates** | Framework validation, plan validation, task validation, and dedicated runner tests. |

---

## Advanced Goal Flow

```mermaid
flowchart TD
    Goal["/05-Goal<br/>High-level intent"] --> Boss["Boss Agent<br/>route, budget, decompose"]
    Boss --> Route{"Select flow"}

    Route -->|feature / fix / refactor| DevFlow["DevFlow Task Execution"]
    Route -->|product idea| SpecFlow["PRD / Spec Flow"]
    Route -->|unclear idea| IdeaFlow["Brainstorm Flow"]
    Route -->|failure / regression| DebugFlow["RCA / Debug Flow"]

    DevFlow --> Split{"Large enough<br/>for workers?"}
    SpecFlow --> Split
    IdeaFlow --> Split
    DebugFlow --> Split

    Split -->|single scope| WorkerOne["Worker<br/>focused task"]
    Split -->|multi scope| WorkerGroup["Worker Group<br/>parallel or staged tasks"]

    WorkerOne --> Gate["Boss Validation Gate<br/>quality, tests, artifacts"]
    WorkerGroup --> Gate

    Gate -->|needs changes| Revise["Send back to worker"]
    Revise --> Gate
    Gate -->|accepted| Session["Session Log<br/>metrics, decisions, next flow"]
    Session --> Next["Recommended DevFlow<br/>/30-Task → /31-Plan → /32-Code → /33-Verify"]
```

Use `/05-Goal` when you want the AI to decide the right route, split work across specialist roles, track turn budgets, and produce a session log before moving into the normal DevFlow.

---

## Basic DevFlow

```mermaid
flowchart TD
    Task["/30-Task<br/>create task workspace"]
    Spec["spec.md<br/>requirements.json"]
    Plan["/31-Plan<br/>implementation plan"]
    Code["/32-Code<br/>implement subtasks"]
    Verify["/33-Verify<br/>QA and validation"]
    Human["/34-Human<br/>approve or feedback"]
    Ship["/50-Commit<br/>/51-PR"]

    Task --> Spec
    Spec --> Plan
    Plan --> Code
    Code --> Verify
    Verify -->|pass| Human
    Verify -->|fail| Code
    Human -->|approve| Ship
    Human -->|feedback| Plan
```

Use this flow when you already know the work is a concrete feature, bug fix, docs update, refactor, or test improvement.

---

## Recommended Flow Patterns

### Product / Spec Flow

```mermaid
flowchart TD
    Idea["Product idea"]
    Brainstorm["/10-Brainstorm<br/>options and tradeoffs"]
    PRD["/12-PRD<br/>requirements and scope"]
    Task["/30-Task<br/>task artifacts"]
    Plan["/31-Plan<br/>implementation plan"]
    Code["/32-Code<br/>build"]
    Verify["/33-Verify<br/>QA"]

    Idea --> Brainstorm
    Brainstorm --> PRD
    PRD --> Task
    Task --> Plan
    Plan --> Code
    Code --> Verify
```

### Debug / RCA Flow

```mermaid
flowchart TD
    Symptom["Bug or regression"]
    Debug["/20-Debug<br/>root cause analysis"]
    Task["/30-Task<br/>fix scope"]
    Plan["/31-Plan<br/>safe fix plan"]
    Code["/32-Code<br/>apply fix"]
    Verify["/33-Verify<br/>regression checks"]
    Insight["/54-Insight<br/>lesson learned"]

    Symptom --> Debug
    Debug --> Task
    Task --> Plan
    Plan --> Code
    Code --> Verify
    Verify --> Insight
```

### QA / Review Flow

```mermaid
flowchart TD
    Done["Implementation done"]
    Verify["/33-Verify<br/>baseline QA"]
    QA["/39-QA-Orchestrate<br/>multi-lane QA"]
    Review["/90-Agent code-reviewer<br/>risk review"]
    Fix["/32-Code<br/>fix findings"]
    Human["/34-Human<br/>approval"]
    Commit["/50-Commit<br/>ship-ready commit"]

    Done --> Verify
    Verify --> QA
    QA --> Review
    Review -->|findings| Fix
    Fix --> Verify
    Review -->|clean| Human
    Human --> Commit
```

---

## How You Use It

You normally do not need to run the internal commands yourself. In an AI-enabled IDE such as Antigravity, you ask for the workflow you want, and the AI uses the framework tools behind the scenes.

Start with plain intent:

```text
/05-Goal "add password reset with email token and regression tests"
```

Or use a specific phase when you already know where the work belongs:

```text
/30-Task "Add password reset"
/31-Plan 007
/32-Code 007
/33-Verify 007
```

The AI handles the behind-the-scenes artifact updates, validation commands, status changes, and session logs. For the complete workflow catalog and examples, use [USAGE.md](./USAGE.md).

---

## Example User Flows

### Small Feature

Ask:

```text
/05-Goal "add password reset with email token and regression tests"
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

Ask:

```text
/05-Goal "debug login redirect loop after session expires"
```

Recommended flow:

```text
/20-Debug "debug login redirect loop after session expires"
/30-Task "Fix login redirect loop after session expires"
/31-Plan 008
/32-Code 008
/33-Verify 008
```

The AI records the routing decision, task breakdown, metrics, and latest session under `.workspaces/specs/`.

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

Most users call these workflows in chat. The specialist agent then reads the target, applies its persona, and uses the repository tooling as needed.

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

## Validation Model

Validation is part of the workflow, not a separate ritual for the user to memorize. During `/32-Code` and `/33-Verify`, the AI should run the appropriate project checks, validate PRP artifacts, repair broken JSON contracts when needed, and summarize the result in the task workspace.

For maintainers who are changing the framework itself, the exact validation commands live in [USAGE.md](./USAGE.md) and the docs under [docs/](./docs).

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
- Root npm scripts are the internal command surface used by agents and maintainers.
- Regenerate project indexes after structural changes.
- Validate the framework before committing framework changes.

<div align="center">

**Nexus-DevFlow: make the work visible, make the steps repeatable, make the result verifiable.**

</div>
