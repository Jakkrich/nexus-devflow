---
name: prompt-addons
description: Routes external prompt families into Nexus-DevFlow workflows, specialist agents, or thin skill aliases. Use when deciding whether a prompt-inspired command belongs in an existing DevFlow phase, should remain an agent skill, or should not become a slash workflow.
---

# Prompt Addons

Use this skill when a workflow needs adapted prompt-family behavior outside the core task lifecycle: ideation, competitor research, insight extraction, follow-up planning, roadmap work, GitHub PR review, issue triage, or specialized validation.

## Core Rule

Adapt prompt patterns, do not copy raw prompt output contracts blindly.

PRPs remains a manual IDE workflow:

1. The user chooses each workflow step.
2. Agents recommend or run explicit commands.
3. JSON artifacts are changed with PRP CLI scripts whenever possible.
4. Autonomous Claude-only orchestration is converted into `/90-Agent` recommendations or user-approved next steps.

## Prompt Family Routing

| Family | Use for | PRPs location |
| :--- | :--- | :--- |
| Spec | Requirement gathering, spec research, spec critique | `/12-PRD`, `/15-Spec-Research`, `/18-Spec-Orchestrate`, `/30-Task`, `/31-Plan`, `requirements-engineer` |
| Complexity | Scope and risk classification | `/31-Plan`, `prp-core-planner` |
| Roadmap | Product discovery and feature prioritization | `/17-Roadmap` and `.workspaces/roadmap` |
| Ideation | Code, docs, performance, security, UI/UX improvement ideas | `/10-Brainstorm`, `/11-Research`, `/13-UI-UX`, `/41-Simplify` |
| Competitor | Alternatives, user pain points, market gaps | `/16-Competitor`, `/11-Research`, `/12-PRD`, `/17-Roadmap` |
| Insight | Lessons, patterns, gotchas after implementation | `/54-Insight`, `/33-Verify`, `/34-Human`, `/53-Changelog` |
| Coder | One-subtask implementation and recovery | `/32-Code`, `/20-Debug` |
| QA | Review, fix routing, validation strategy | `/39-QA-Orchestrate`, `/33-Verify`, `/40-Test` |
| Follow-up | Add functionality to completed specs | `/35-Followup`, `/34-Human`, `/31-Plan`, `/32-Code` |
| GitHub | PR review, PR fixing, issue triage, comment follow-up | `/51-PR`, `/55-PR-Review`, `/56-PR-Followup`, `/57-Issue-Triage` |
| MCP tools | API, database, browser, Electron validation | `/33-Verify`, `/40-Test` |

## Borderline Command Rule

Do not promote every source prompt into a top-level slash workflow. Classify it first:

1. If the user intent changes the lifecycle phase, route to the existing workflow.
2. If the prompt is a repeatable method used inside many phases, keep it as a skill.
3. If the prompt only renames an existing capability, keep a thin alias in documentation and route to the existing workflow plus skill.
4. If the prompt depends on unsupported tool/runtime assumptions, convert it into validation guidance inside `/33-Verify`, `/40-Test`, or the nearest available skill.

## Borderline Routing

| Source prompt or command idea | DevFlow step | Keep as | Rule |
| :--- | :--- | :--- | :--- |
| `validation_fixer` | `/33-Verify` fail path, then `/32-Code` retry if code must change | Thin skill alias to `json-artifact-handling` and `lint-and-validate` | Repair artifacts with PRP CLI first; fix code only after validation identifies a real implementation failure. |
| `ideation_documentation` | `/10-Brainstorm`, `/11-Research`, `/54-Insight`, or `/53-Changelog` depending on timing | Skill-backed agent action using `documentation-and-adrs` and `documentation-maintainer` | Do not create a standalone `/Documentation-Ideation` workflow. |
| `ideation_performance` | `/33-Verify`, `/39-QA-Orchestrate`, or `/41-Simplify` | Skill-backed review using `performance-optimization` and `performance-engineer` | Require measurement before recommending optimization work. |
| `ideation_security` | `/33-Verify`, `/39-QA-Orchestrate`, `/20-Debug` for incident symptoms | Skill-backed review using `security-and-hardening` and `security-auditor` | Treat findings as review output or task input, not automatic implementation. |
| `mcp_tools/*` validation prompts | `/33-Verify` and `/40-Test` | Tool-specific validation skill guidance | Convert unavailable tools to the current IDE/browser/API/database verification options. |
| Autonomous orchestration aliases | `/14-Orchestrate`, `/18-Spec-Orchestrate`, `/39-QA-Orchestrate`, or `/90-Agent` | Thin alias only | Preserve user-controlled DevFlow phase gates. |

## Follow-Up Planning

When the user asks to extend completed work:

1. Read the existing task artifacts.
2. Preserve existing phases, subtasks, and statuses.
3. Add new phases or subtasks after the current plan.
4. Use:

```powershell
npm run agent -- plan:add-phase {ID} "Follow-up: {Name}" --type followup
npm run agent -- plan:add-subtask {ID} {PHASE_ID} "{Title}" --description "{Description}"
npm run agent -- plan:validate {ID}
npm run agent -- validate {ID}
```

Never replace a completed plan just to add follow-up work.

## Insight Extraction

After implementation or QA, extract only reusable knowledge:

- file purposes and important changes
- patterns discovered
- gotchas and triggers
- approach outcome
- future recommendations

Prefer concise notes in `task_logs.json`, `qa_report.md`, `.workspaces/lessons.md`, or changelog drafts depending on the workflow. Do not create a new memory system unless the user asks for one.

## Competitor Research

When using competitor analysis:

1. Identify direct and indirect competitors.
2. Research real user feedback and pain points.
3. Cite sources in the final answer or artifact.
4. Separate facts from inference.
5. Convert findings into roadmap or PRD opportunities.

## GitHub Review And Follow-Up

Use GitHub prompt patterns to:

- classify review comments by correctness, security, quality, structure, and codebase fit
- validate whether a finding is actionable
- separate new-code issues from pre-existing issues
- fill PR templates from actual diff and task artifacts
- convert PR comments into focused subtasks

Workflow routing:

- Use `/51-PR` to create a PR and fill its template.
- Use `/55-PR-Review` to review a PR or local diff.
- Use `/56-PR-Followup` to classify and resolve PR comments.
- Use `/57-Issue-Triage` to analyze GitHub issues before creating a PRP task.

Keep final review output findings-first with file and line references when reviewing code.

## Validation Tool Conversion

If a source prompt references Puppeteer, Electron, database, or API validation tools, convert it to the tools available in the current IDE/session. If a tool is unavailable, explain the limitation and provide the closest command or manual verification step.
