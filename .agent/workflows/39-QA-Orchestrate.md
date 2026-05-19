---
description: QA Orchestrate - Coordinate QA review, test planning, validation fixing, and focused repair routing.
---

# Phase 39: QA Orchestrate

## Target: $ARGUMENTS

Use this workflow when QA needs more structure than a single `/33-Verify`, such as complex review, multiple test scopes, or follow-up fixes.

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

```powershell
npm run agent -- validate {ID}
```

If JSON fails:

```powershell
npm run agent -- repair {ID}
npm run agent -- validate {ID}
```

### 2. Choose QA Lanes

Use the relevant lanes:

- correctness and acceptance criteria
- tests and regressions
- security and data safety
- performance and scalability
- UX/manual verification
- codebase fit and maintainability

### 3. Delegate Or Recommend Specialists

Use `/90-Agent` only when helpful:

```text
/90-Agent code-reviewer .workspaces/specs/{ID}-*/
/90-Agent test-engineer .workspaces/specs/{ID}-*/
/90-Agent security-auditor .workspaces/specs/{ID}-*/
```

### 4. Route Fixes

If findings are actionable:

- convert them into focused fix guidance
- recommend `/32-Code {ID}` for implementation
- recommend `/35-Followup {ID}` when the finding is new scope

## Output

Return a QA route with findings, recommended specialists, and the next command.
