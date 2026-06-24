---
name: intelligent-routing
description: Automatic agent and stage routing for DevFlow 2.0. Use when deciding which active workflow, skill, or specialist should own the next step.
version: 2.0.0
---

# Intelligent Routing For DevFlow 2.0

## Purpose

Analyze a user request and route it to the correct DevFlow 2.0 surface without requiring the user to name the exact workflow, skill, or agent.

## Canonical Routing Order

Always route in this order:

1. Mainline stage if the request is lifecycle work
2. Public companion command if the request is support work
3. Specialist agent if the user needs focused expert judgment
4. Internal companion or skill only when the public surface should stay thin

Do not route new work into retired JSON-first commands, dashboard-first flows, or removed aliases.

## Mainline Stages

`/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Release -> /70-Report`

## Public Companion Commands

- `Goal`
- `Brainstorm`
- `Research`
- `Debug`
- `PRD`
- `Issue-Triage`
- `Wiki`
- `Check-For-Updates`
- `Help`

## Specialist Agent Routing

Use these agent mappings when expert judgment is the best next step:

| Request Type | Route To |
|---|---|
| requirements clarification | `requirements-engineer` |
| product framing | `prp-core-prd-architect` |
| planning breakdown | `prp-core-planner` |
| codebase exploration | `codebase-explorer` |
| backend implementation or API review | `backend-specialist` |
| frontend implementation or UI review | `frontend-specialist` |
| schema and query design | `database-architect` |
| implementation execution | `prp-core-coder` |
| tests and coverage | `test-engineer` |
| code review and risk review | `code-reviewer` |
| security review | `security-auditor` |
| performance review | `performance-engineer` |
| root-cause debugging | `prp-core-debugger` |
| release packaging and commit scope | `prp-core-git-committer`, `prp-core-git-pr-maker` |
| broad orchestration across domains | `orchestrator` |

## Lifecycle Routing Rules

| User State | Recommended Route |
|---|---|
| vague request, still exploring | `/00-Discover` or `Brainstorm` |
| knows the problem, scope still fuzzy | `/10-Define` |
| needs requirements and acceptance criteria | `/20-Spec` |
| has a stable spec and needs execution plan | `/30-Plan` |
| needs implementation work | `/40-Implement` |
| needs testing, review, or validation evidence | `/50-Verify` |
| needs packaging, commit, PR, or release handling | `/60-Release` |
| needs the final summary or handoff narrative | `/70-Report` |

## Routing Heuristics

### Use a mainline stage when:

- the request advances a task through its lifecycle
- the user needs an artifact in `.workspaces`
- the next step should change stage ownership

### Use a public companion command when:

- the request supports a stage rather than replacing it
- the user needs exploration, research, debugging, or help
- the output is advisory or investigative

### Use a specialist agent when:

- the user explicitly asks for one
- a narrow expert lens is more useful than a workflow shell
- the active stage already exists and only specialist judgment is missing

## Examples

| User Request | Route |
|---|---|
| "I have an idea but not the shape yet" | `Brainstorm` then `/10-Define` |
| "Turn this stable goal into requirements" | `/20-Spec` |
| "Fix this broken auth flow" | `Debug` or `Agent prp-core-debugger ...`, then `/40-Implement` or `/50-Verify` |
| "Review this implementation for risks" | `/50-Verify` or `Agent code-reviewer ...` |
| "Install or upgrade Nexus-DevFlow on this machine" | `Check-For-Updates` |
| "Help me figure out which command to use" | `Help` |

## Guardrails

- Do not recommend removed numeric aliases such as old task/code/verify commands.
- Do not mention legacy external control files as part of the routing model.
- Do not invent agent names that are not present in the current repo.
- If the request spans multiple domains and the owner is unclear, route to `orchestrator`.

## Output Pattern

When applying this skill, answer in one short line before proceeding:

`Applying DevFlow 2.0 routing: <chosen route> because <reason>.`
