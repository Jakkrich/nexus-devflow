# Script-First JSON Workflow

This guide shows how to use Nexus-DevFlow after the JSON artifact upgrade.

The core idea is simple: the AI decides what should change, but PRP CLI scripts write, repair, and validate JSON artifacts. This keeps token usage low and prevents malformed JSON from creeping into `.workspaces/specs`.

## Daily Flow

```text
/30-Task -> /31-Plan -> /32-Code -> /33-Verify -> /34-Human-Approve
```

Each workflow is still user-controlled inside the IDE. The framework does not run a Claude-style autonomous loop. The user chooses the next step, and agents update artifacts with commands.

## Lifecycle Commands

| Workflow | Enforced command contract |
| :--- | :--- |
| `/30-Task` | Create task artifacts with `init` and `artifact:*`, then `validate`. |
| `/31-Plan` | Build plan artifacts, then record approval with `plan:approve`. |
| `/32-Code` | Confirm approval with `plan:approval`, enter coding with `transition {ID} in_progress`, complete subtasks, then `transition {ID} ai_review`. |
| `/33-Verify` | Create `qa_report.md`, then `transition {ID} human_review` on pass or `transition {ID} in_progress` on fail. |
| `/34-Human-Approve` | Use `transition {ID} done --actor "Human" --summary "{Approval summary}"`. |
| `/34-Human-Reject` | Use `transition {ID} in_progress --actor "Human" --summary "{Rejection reason}"`, then record rejection history in `qa_report.md`. |
| `/34-Human-Feedback` | Use `transition {ID} in_progress --actor "Human" --summary "{Feedback summary}"`, then record feedback history in `qa_report.md`. |
| `/34-Human-ReCheck` | Read task artifacts and QA evidence without changing status by default; recommend approve, reject, feedback, or verify. |
| `/34-Human` | Compatibility dispatcher for legacy action-style commands. |

## Windows Command Note

If PowerShell blocks `npm.ps1`, use `npm.cmd`:

```powershell
npm.cmd run validate
npm.cmd run agent -- validate 001
```

Examples below use `npm run`. Replace it with `npm.cmd run` when needed.

## Start A Task

```powershell
npm run agent -- init 001 "First Task" first-task "Describe the task"
npm run agent -- validate 001
```

This creates the task workspace under:

```text
.workspaces/specs/001/
```

## Update Requirements Without Rewriting JSON

Use artifact commands for targeted edits:

```powershell
npm run agent -- artifact:set 001 requirements priority high
npm run agent -- artifact:set 001 requirements workflow_type standard
npm run agent -- artifact:append 001 requirements constraints "Must work from the IDE step by step"
npm run agent -- artifact:merge 001 requirements metadata "{\"owner\":\"product\"}"
npm run agent -- validate 001
```

Use `artifact:get` to inspect before changing:

```powershell
npm run agent -- artifact:get 001 requirements
npm run agent -- artifact:get 001 requirements priority
```

## Build A Plan With Helpers

Use plan helpers instead of asking the AI to print a full `implementation_plan.json`:

```powershell
npm run agent -- plan:add-phase 001 "Prepare artifact workflow" --type implementation
npm run agent -- plan:add-subtask 001 phase-1 "Add JSON command examples" --service docs --modify docs/script-first-json-workflow.md --verify-type command --verify-command "npm.cmd run validate"
npm run agent -- plan:validate 001
npm run agent -- plan:approve 001 --actor "Reviewer" --summary "Plan approved for implementation"
```

When implementation progresses:

```powershell
npm run agent -- plan:set-subtask-status 001 subtask-1 in_progress
npm run agent -- log 001 "Started docs update" --phase implementation
npm run agent -- plan:set-subtask-status 001 subtask-1 completed
npm run agent -- transition 001 ai_review
npm run agent -- validate 001
```

## Repair Before Regenerating

If a JSON artifact becomes invalid, repair the artifact first:

```powershell
npm run agent -- json:repair 001 implementation_plan
npm run agent -- repair 001
npm run agent -- validate 001
```

Only rewrite a full JSON file manually when no script can express the change. Validate immediately after any manual fallback.

## Agent Usage

Specialist agents follow the same contract:

```text
/90-Agent requirements-engineer .workspaces/specs/001/spec.md
/90-Agent prp-core-planner .workspaces/specs/001/
/90-Agent code-reviewer .workspaces/specs/001/
```

Agents should recommend or run the smallest useful command:

- `artifact:*` for generic JSON fields
- `plan:*` for `implementation_plan.json`
- `transition` for lifecycle status gates
- `followup:start` for new work on an existing task
- `json:repair`, `repair`, and `validate` for recovery
- `log` and `event` for traceability

Claude-only automation such as autonomous subagent spawning, desktop state machines, and automatic worktree loops is intentionally excluded from the core PRPs workflow. The PRPs version keeps human confirmation between phases.

## Validation Checklist

Run these before handing work back:

```powershell
npm.cmd run validate
node .agent\scripts\test-prp.mjs
```

For a single task:

```powershell
npm.cmd run agent -- plan:validate 001
npm.cmd run agent -- validate 001
```
