# JSON Artifact Contract

This document defines the Phase 1 design contract for upgrading PRPs-Framework with Aperant-inspired structured artifact handling while preserving the PRPs manual, IDE-driven workflow.

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
npm run agent -- validate {ID}
npm run agent -- repair {ID}
```

Planned command surface for later phases:

```powershell
npm run agent -- plan:add-phase {ID} "{Name}" --type implementation
npm run agent -- plan:add-subtask {ID} {PHASE_ID} "{Title}" --service backend
npm run agent -- plan:set-subtask-status {ID} {SUBTASK_ID} completed
```

## Aperant Prompt Mapping

The Aperant prompt library at `D:\Aperant\apps\desktop\prompts` should be used as source material, not copied verbatim. Prompts must be adapted from Claude automation to PRPs manual IDE steps.

| Aperant prompt | PRPs destination | Adaptation |
| :--- | :--- | :--- |
| `spec_gatherer.md` | `/30-Task`, `discuss-spec` | Ask targeted questions, then use artifact commands to populate `requirements.json`. |
| `spec_quick.md` | `/30-Task` simple mode | Create small specs with minimal questions and script-created JSON. |
| `spec_writer.md` | `/30-Task`, `/31-Plan` | Write `spec.md`; JSON artifacts are created or updated via CLI. |
| `spec_critic.md` | `/31-Plan`, `/90-Agent discuss-spec` | Review spec completeness before planning. |
| `complexity_assessor.md` | `/31-Plan` | Fill `complexity_assessment.json` and choose simple, standard, or complex planning path. |
| `planner.md` | `/31-Plan`, `prp-core-planner` | Keep deep codebase investigation and dependency ordering; replace full JSON output with plan helper commands. |
| `coder.md` | `/32-Code`, `prp-core-coder` | Work one subtask at a time and update status through script commands. |
| `coder_recovery.md` | `/32-Code`, `/20-Debug` | Recover from failed subtasks, stale context, or validation failures. |
| `qa_reviewer.md` | `/33-Verify`, `code-reviewer`, `test-engineer` | Five-axis review, validation suite, QA report. |
| `qa_fixer.md` | `/33-Verify` fail path, `/32-Code` retry | Convert QA findings into focused fix subtasks. |
| `validation_fixer.md` | JSON repair workflow, validation agent/skill | Read validation errors, apply minimal fix, validate again. |
| `roadmap_discovery.md` | roadmap workflows | Improve project discovery and roadmap input quality. |
| `roadmap_features.md` | roadmap workflows | Improve prioritized roadmap generation. |
| `ideation_code_improvements.md` | `/10-Brainstorm`, `/11-Research` | Generate improvement candidates for users to select manually. |
| `ideation_code_quality.md` | `/41-Simplify`, `/33-Verify` | Find quality debt and refactor opportunities. |
| `ideation_documentation.md` | docs workflows, `docs-impact-agent` | Identify documentation gaps. |
| `ideation_performance.md` | `performance-optimizer` | Identify performance bottlenecks. |
| `ideation_security.md` | `security-auditor` | Identify security hardening work. |
| `ideation_ui_ux.md` | `/13-UI-UX`, `frontend-specialist` | Identify UI/UX improvements. |
| `github/pr_*` | `/51-PR`, review agents | Optional PR review, triage, and follow-up workflows. |
| `mcp_tools/*` | validation docs/skills | Convert tool assumptions into generic IDE/browser/API/database validation instructions. |

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

| Claude/Aperant feature | PRPs conversion |
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
- Aperant prompt sources are mapped to PRPs workflows and agents.
- Claude-only features are explicitly converted or excluded.
- Later implementation phases can add scripts without changing the concept.
