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

When routing to support skills, follow `docs/skill-selection-policy.md`.

## Timeline Stages

`/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release`

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
| overnight maintenance loops and repo cleanup | `ob-loop-engineer` |

## Lifecycle Routing Rules

| User State | Recommended Route |
|---|---|
| vague request, still exploring | `/00-Discover` or `Brainstorm` |
| knows the problem, scope still fuzzy | `/10-Define` |
| needs requirements and acceptance criteria | `/20-Spec` |
| has a stable spec and needs execution plan | `/30-Plan` |
| needs implementation work | `/40-Implement` |
| needs testing, review, or validation evidence | `/50-Verify` |
| needs packaging, commit, PR, or release handling | `/70-Release` |
| needs the final summary or handoff narrative | `/60-Report` |

## Routing Heuristics

### Use a Timeline stage when:

- the request advances a task through its lifecycle
- the user needs an artifact in `.workspaces`
- the next step should change stage ownership

### Use a public companion command when:

- the request supports a stage rather than replacing it
- the user needs exploration, research, debugging, or help
- the output is advisory or investigative

### Use an internal clarification skill when:

- the current stage is blocked by ambiguity, not by missing execution effort
- a small amount of user interaction could change scope, acceptance criteria, or planning decisions
- the public surface should stay the same and the questioning method is only supporting the active stage

If `grill-with-docs` is available in the current environment, prefer it as an optional internal support skill for:

- `/10-Define` when scope or terminology is unstable
- `/20-Spec` when acceptance criteria or rules are ambiguous
- `/30-Plan` when architecture or verification choices are still reversible but unclear

Do not use deep questioning by default in every stage. Collect only the information that affects the current Timeline-stage decision.

### Use an internal clarification skill when:

- the current stage is blocked by ambiguity, not by missing execution effort
- a small amount of user interaction could change scope, acceptance criteria, or planning decisions
- the public surface should stay the same and the questioning method is only supporting the active stage

If `grill-with-docs` is available in the current environment, prefer it as an optional internal support skill for:

- `/10-Define` when scope or terminology is unstable
- `/20-Spec` when acceptance criteria or rules are ambiguous
- `/30-Plan` when architecture or verification choices are still reversible but unclear

Do not use deep questioning by default in every stage. Collect only the information that affects the current stage decision.

### Use a specialist agent when:

- the user explicitly asks for one
- a narrow expert lens is more useful than a workflow shell
- the active stage already exists and only specialist judgment is missing

### Use a support skill when:

- a mainline stage or public companion already owns the work
- the skill resolves a bounded uncertainty inside that owner
- the skill is more specific than the general companion surface
- the skill output can be captured in the owning stage artifact, `CONTEXT.md`, an ADR, or a focused doc

Support skill limits:

- choose one primary skill per pass
- add at most two secondary skills when each has a distinct purpose
- prefer the most specific skill when descriptions overlap
- route back to the owning stage when a skill finds a lifecycle-level contradiction

Key conflict defaults:

| Conflict | Route |
|---|---|
| `Brainstorm` vs `grilling` | `Brainstorm` for option generation; `grilling` for stress-testing a candidate idea |
| `grilling` vs `grill-with-docs` | `grill-with-docs` when a codebase or durable docs matter |
| `grill-with-docs` vs `domain-modeling` | `grill-with-docs` interviews; `domain-modeling` records confirmed glossary terms or ADRs |
| `to-prd` vs `PRD` | `PRD` owns the public surface; `to-prd` is an internal synthesis method |
| `to-issues` vs `/30-Plan` | `/30-Plan` owns work breakdown; `to-issues` packages slices when issue tracker output is needed |
| `implement` vs `/40-Implement` | `/40-Implement` owns implementation |
| `review` vs `/50-Verify` | `/50-Verify` owns verification; `review` is one lane |

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
- If clarification is needed, ask only for information that can change the active stage decision.
- If clarification is needed, ask only for information that can change the active stage decision.

## Output Pattern

When applying this skill, answer in one short line before proceeding:

`Applying DevFlow 2.0 routing: <chosen route> because <reason>.`
