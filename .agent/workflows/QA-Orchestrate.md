---
description: QA Orchestrate - Coordinate QA review, test planning, validation fixing, and focused repair routing.
---

# Phase 39: QA Orchestrate

## Target: $ARGUMENTS

Use this workflow when QA needs more structure than a single `/50-Verify`, such as complex review, multiple test scopes, or follow-up fixes.

Primary behavior now lives in:

```text
.agent/skills/verification-orchestration/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill.

## Prompt Source

Adapted from:

- `qa_orchestrator_agentic.md`
- `qa_reviewer.md`
- `qa_fixer.md`
- `validation_fixer.md`

## Manual PRPs Conversion

Do not auto-run all QA and fix loops. Present the next step and wait for user confirmation.

## Process

### 1. Validate Artifacts First

Run `npm run validate` only when framework files, shared templates, or docs were changed during the QA workflow.

If JSON fails:

If legacy artifacts are discovered, document the issue in the report and move the active source of truth back into stage markdown instead of repairing task JSON.

### 2. Choose QA Lanes

Use the relevant lanes:

- correctness and acceptance criteria
- tests and regressions
- security and data safety
- performance and scalability
- UX/manual verification
- codebase fit and maintainability

### 3. Delegate Or Recommend Specialists

Use `Agent` only when helpful:

```text
Agent code-reviewer .workspaces/specs/{ID}-*/
Agent test-engineer .workspaces/specs/{ID}-*/
Agent security-auditor .workspaces/specs/{ID}-*/
```

### 4. Create QA Orchestration Report
- **MANDATORY:** Before generating the final report, inspect `.agent/resources/schemas/qa_orchestration.template.md`, preserve its required layout, and replace placeholder text with concrete QA scope, matrix results, blockers, and recommendations.
- Save the final report to `.workspaces/reports/{date}-qa-orchestrate-{ID}.md` (where `{date}` is today's date in `YYYY-MM-DD` format and `{ID}` is the target task ID).

### 5. Route Fixes

If findings are actionable:

- convert them into focused fix guidance
- recommend `/40-Implement {ID}` for implementation
- recommend `Followup {ID}` when the finding is new scope

## Output

Return a QA route with findings, recommended specialists, verify that the report has been successfully written to the specified path, and recommend the next command.

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Verification support command, not a numbered stage
- Typical entry points: `/50-Verify` when multiple QA lanes need coordination
- Typical handoff targets: `/50-Verify`, `/40-Implement`, `Agent`, `Test`

## Sources

- `AGENTS.md`
- `.agent/skills/verification-orchestration/SKILL.md`
- `.agent/resources/schemas/qa_orchestration.template.md`
- Related commands: `/50-Verify`, `/40-Implement`, `Agent`, `Test`, `PR-Review`


