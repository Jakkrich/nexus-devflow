# Quickstart

This guide gets Nexus-DevFlow ready for local use with the `.agent` bundle.

## 1. Activate

```powershell
npm.cmd run activate
```

## 2. Validate

```powershell
npm.cmd run validate
```

## 3. Check Status

```powershell
npm.cmd run agent:status
```

## 4. Create a First Task

```powershell
npm.cmd run agent -- init 001 "First Task" first-task "Describe the first task"
npm.cmd run agent -- validate 001
```

The task files are created under:

```text
.workspaces/specs/
```

## 5. Update JSON Artifacts

Prefer PRP CLI commands over hand-editing JSON:

```powershell
npm.cmd run agent -- artifact:get 001 requirements
npm.cmd run agent -- artifact:set 001 requirements priority high
npm.cmd run agent -- artifact:append 001 requirements constraints "Use IDE-controlled step-by-step workflow"
npm.cmd run agent -- validate 001
```

## 6. Build A Plan

```powershell
npm.cmd run agent -- plan:add-phase 001 "Prepare implementation" --type implementation
npm.cmd run agent -- plan:add-subtask 001 phase-1 "Confirm artifact flow" --service docs --verify-type command --verify-command "npm.cmd run validate"
npm.cmd run agent -- plan:validate 001
```

## 7. Useful Commands

```powershell
npm.cmd run index
npm.cmd run sync:check
npm.cmd run roadmap:validate
```

## Troubleshooting

- If validation says a JSON artifact is missing, run `npm run activate`.
- If project structure changed, run `npm run index`.
- If JSON is malformed, run `npm.cmd run agent -- json:repair {ID} {artifact}` and then `npm.cmd run agent -- validate {ID}`.
- If `.agent` files are missing, restore the framework bundle before running validation.

For the full command flow, see [Script-First JSON Workflow](script-first-json-workflow.md).
