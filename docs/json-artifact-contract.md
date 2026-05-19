# JSON Artifact Contract

This document defines the Phase 1 design contract for upgrading Nexus-DevFlow with prompt-inspired structured artifact handling while preserving the PRPs manual, IDE-driven workflow.

## Goal

PRPs should keep the user-controlled phase flow:

```text
/30-Task -> /31-Plan -> /32-Code -> /33-Verify -> /34-Human
```

The change is how agents create and update JSON. Agents should think, inspect, and decide, but scripts should own JSON structure, normalization, repair, and validation.

## Script-First JSON Rule

Agents must prefer PRP CLI commands over hand-writing full JSON files.

1. Use scripts to create, update, append, merge, repair, and validate JSON artifacts.
2. Do not rewrite an entire JSON file manually unless a script cannot express the change.
3. After any JSON mutation, run validation for the task.
4. If validation fails, run repair before continuing.
5. Keep all schema keys present; use `null`, `[]`, or `""` when information is not known yet.
6. Treat raw JSON editing as an emergency fallback and validate immediately afterward.

Current command surface:

```powershell
npm run agent -- init {ID} "{Title}" {slug} ["Description"]
npm run agent -- update {ID} --status planning
npm run agent -- update {ID} --subtask {SUBTASK_ID} --substatus completed
npm run agent -- log {ID} "message" --phase planning
npm run agent -- event {ID} "message" --event task.info --phase planning
npm run agent -- artifact:get {ID} {artifact}
npm run agent -- artifact:set {ID} {artifact} {field_path} {value}
npm run agent -- artifact:append {ID} {artifact} {field_path} {value}
npm run agent -- artifact:merge {ID} {artifact} {field_path} {json_value}
npm run agent -- json:repair {ID} {artifact}
npm run agent -- plan:add-phase {ID} "{Name}" --type implementation
npm run agent -- plan:add-subtask {ID} {PHASE_ID} "{Title}" --service backend
npm run agent -- plan:set-subtask-status {ID} {SUBTASK_ID} completed
npm run agent -- plan:validate {ID}
npm run agent -- validate {ID}
npm run agent -- repair {ID}
```

Planned command surface for later phases:

```powershell
Workflow prompts and agents will be updated to use the script-first commands by default.
```

## Prompt Mapping

External prompt libraries can be used as source material, not copied verbatim. Prompts must be adapted from Claude-style automation to PRPs manual IDE steps.

| Source prompt | PRPs destination | Adaptation |
| :--- | :--- | :--- |
| `spec_gatherer.md` | `/30-Task`, `discuss-spec` | Ask targeted questions, then use artifact commands to populate `requirements.json`. |
| `spec_quick.md` | `/30-Task` simple mode | Create small specs with minimal questions and script-created JSON. |
| `spec_writer.md` | `/30-Task`, `/31-Plan` | Write `spec.md`; JSON artifacts are created or updated via CLI. |
| `spec_critic.md` | `/31-Plan`, `/90-Agent discuss-spec` | Review spec completeness before planning. |
| `spec_researcher.md` | `/15-Spec-Research`, `/11-Research`, `/12-PRD`, `/30-Task` | Validate integrations, libraries, APIs, and dependencies before planning. |
| `spec_orchestrator_agentic.md` | `/18-Spec-Orchestrate`, `/12-PRD`, `/30-Task`, `/31-Plan` | Convert autonomous spec orchestration into user-approved PRPs phases. |
| `complexity_assessor.md` | `/31-Plan` | Fill `complexity_assessment.json` and choose simple, standard, or complex planning path. |
| `planner.md` | `/31-Plan`, `prp-core-planner` | Keep deep codebase investigation and dependency ordering; replace full JSON output with plan helper commands. |
| `coder.md` | `/32-Code`, `prp-core-coder` | Work one subtask at a time and update status through script commands. |
| `coder_recovery.md` | `/32-Code`, `/20-Debug` | Recover from failed subtasks, stale context, or validation failures. |
| `qa_reviewer.md` | `/33-Verify`, `code-reviewer`, `test-engineer` | Five-axis review, validation suite, QA report. |
| `qa_fixer.md` | `/33-Verify` fail path, `/32-Code` retry | Convert QA findings into focused fix subtasks. |
| `qa_orchestrator_agentic.md` | `/39-QA-Orchestrate`, `/33-Verify`, `/40-Test`, `/90-Agent` | Convert autonomous QA orchestration into explicit review, test, and fix steps. |
| `validation_fixer.md` | JSON repair workflow, validation agent/skill | Read validation errors, apply minimal fix, validate again. |
| `roadmap_discovery.md` | `/17-Roadmap` | Improve project discovery and roadmap input quality. |
| `roadmap_features.md` | `/17-Roadmap` | Improve prioritized roadmap generation. |
| `competitor_analysis.md` | `/16-Competitor`, `/11-Research`, `/12-PRD`, `/17-Roadmap` | Research competitors, user pain points, market gaps, and differentiator opportunities. |
| `followup_planner.md` | `/35-Followup`, `/34-Human`, `/31-Plan`, `/32-Code` | Add new phases/subtasks to completed work without replacing existing plan state. |
| `insight_extractor.md` | `/54-Insight`, `/33-Verify`, `/34-Human`, `/53-Changelog`, lessons/memory docs | Extract reusable patterns, gotchas, file insights, and recommendations after implementation. |
| `ideation_code_improvements.md` | `/10-Brainstorm`, `/11-Research` | Generate improvement candidates for users to select manually. |
| `ideation_code_quality.md` | `/41-Simplify`, `/33-Verify` | Find quality debt and refactor opportunities. |
| `ideation_documentation.md` | docs workflows, `docs-impact-agent` | Identify documentation gaps. |
| `ideation_performance.md` | `performance-optimizer` | Identify performance bottlenecks. |
| `ideation_security.md` | `security-auditor` | Identify security hardening work. |
| `ideation_ui_ux.md` | `/13-UI-UX`, `frontend-specialist` | Identify UI/UX improvements. |
| `github/pr_template_filler.md` | `/51-PR` | Fill PR body from task artifacts, diff, commit history, and template expectations. |
| `github/pr_reviewer.md`, `github/QA_REVIEW_SYSTEM_PROMPT.md` | `/55-PR-Review`, `/39-QA-Orchestrate` | Findings-first PR review with severity, file references, and test gaps. |
| `github/pr_quality_agent.md`, `github/pr_logic_agent.md`, `github/pr_security_agent.md`, `github/pr_structural.md`, `github/pr_codebase_fit_agent.md` | `/55-PR-Review`, `/33-Verify`, review agents | Review quality, logic, security, structure, and fit with existing code patterns. |
| `github/pr_finding_validator.md` | `/55-PR-Review`, `/56-PR-Followup` | Confirm findings are real, actionable, and in scope before reporting or fixing. |
| `github/pr_fixer.md`, `github/pr_followup*.md` | `/56-PR-Followup`, `/35-Followup`, `/32-Code` | Convert PR comments into focused fixes or follow-up subtasks. |
| `github/pr_orchestrator.md`, `github/pr_parallel_orchestrator.md` | `/55-PR-Review`, `/39-QA-Orchestrate` | Convert multi-agent PR orchestration into explicit review lanes and optional `/90-Agent` calls. |
| `github/issue_analyzer.md`, `github/issue_triager.md`, `github/duplicate_detector.md`, `github/spam_detector.md`, `github/pr_ai_triage.md` | `/57-Issue-Triage`, `/11-Research`, `/30-Task` | Issue analysis, duplicate detection, spam screening, and triage recommendations. |
| `mcp_tools/*` | `/33-Verify`, `/40-Test`, validation docs/skills | Convert API, database, browser, and Electron validation assumptions into available IDE tooling. |

## What To Convert From Claude Automation

Use these concepts:

- Structured output contracts.
- Required output paths.
- Read-back verification.
- Validation retry prompts.
- JSON repair before full re-generation.
- One-subtask-at-a-time execution.
- Recovery prompts for failed or stale sessions.
- QA review and fix loops.

Convert these Claude-specific features:

| Claude-style feature | PRPs conversion |
| :--- | :--- |
| `SpawnSubagent` autonomous delegation | Suggest `/90-Agent {agent} {target}` and wait for the user to run the next step. |
| Mandatory Claude `Write` tool | Mandatory PRP CLI artifact command. |
| AI SDK `Output.object()` | JSON Schema validation plus repair command. |
| Desktop state machines | Keep state fields in `implementation_plan.json`; no desktop runtime required. |
| Worktree automation | Keep path safety guidance; do not auto-create worktrees in core workflow. |
| Claude profile/rate-limit logic | Exclude from PRPs core. |
| Electron UI orchestration | Exclude from PRPs core; dashboard remains static artifact reader. |

## Workflow Responsibilities

`/30-Task`:

- Clarify objective and workflow type.
- Create task workspace with CLI.
- Populate `requirements.json` through script-first artifact commands.
- Validate before recommending `/31-Plan`.

`/31-Plan`:

- Assess complexity.
- Inspect project patterns.
- Populate `context.json`, `complexity_assessment.json`, and `implementation_plan.json` through script-first commands.
- Validate plan schema and dependency ordering.

`/32-Code`:

- Read `implementation_plan.json`.
- Work one pending subtask at a time.
- Run verification per subtask.
- Update subtask status through CLI.
- Log progress through CLI.

`/33-Verify`:

- Run validation and project checks.
- Produce `qa_report.md`.
- If artifacts are invalid, run repair first.
- If QA fails, route back to `/32-Code` with focused fix guidance.

`/90-Agent`:

- Specialist agents follow the same JSON contract.
- Agents can recommend artifact commands.
- Agents do not silently rewrite full JSON artifacts.

## Agent Responsibilities

Planning agents:

- Own task decomposition and dependency logic.
- Use plan helper commands once available.
- Avoid raw full-file `implementation_plan.json` rewrites.

Coding agents:

- Own implementation and verification.
- Update progress through subtask/status/log commands.

Review and QA agents:

- Own defect detection, validation, and report generation.
- Use repair commands before asking for full regeneration.

Coach/support agents:

- Recommend the next workflow command.
- Explain artifact state.
- Stay read-only unless the user explicitly asks for changes.

## Exit Criteria For This Contract

Phase 1 is complete when:

- The framework has a documented script-first JSON rule.
- Source prompt families are mapped to PRPs workflows and agents.
- Claude-only features are explicitly converted or excluded.
- Later implementation phases can add scripts without changing the concept.
