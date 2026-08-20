---
name: implement
description: "[Devflow] Fast-Track Implement stage in DevFlow (Blueprint Mode) - execute checklist tasks incrementally with TDD and update current-feature.md in context."
argument-hint: "{running-id or workspace path}"
---

# Fast-Track: Implement (Blueprint Mode)

$ARGUMENTS

Incremental code execution stage in Fast-Track. Reads the Single Living Spec (`devflow/context/current-feature.md`), executes checklist tasks, implements tests (TDD), and updates the implementation record.

## Invocations & Aliases

- `/implement`: Run implementation on current active run
- `/implement {id}`: Run implementation on specified ID
- `$implement`: Codex CLI invocation

## Fast-Track Mainline Workflow

```text
/feature (หรือ /fix) ──▶ /implement ──▶ /check ──▶ /complete
```

## Behavior & Contract

When invoked:

### 1. Load Active Context
1. Identify active Running ID from `devflow/context/current-stage.md` or `devflow/context/current-feature.md`.
2. Read `devflow/context/current-feature.md`.
3. Locate `## 2. Plan & Test Strategy` and `## 3. Implementation Checklist`.

### 2. Incremental Execution with TDD
1. Select unchecked items `- [ ]` from the checklist in order.
2. For each task:
   - **TDD (Red-Green-Refactor)**: When `Test Decision: Required`, create or update unit tests first.
   - Implement the minimal, clean code change satisfying the task.
   - Run localized verification (e.g. `npm test`, linter).
   - Mark the item as `- [x]` in `current-feature.md`.

### 3. Update Living Spec (`current-feature.md`)
Append or update `## 4. Implementation Record` in `devflow/context/current-feature.md` with:
- Summary of completed tasks and modified files
- Key architectural observations or notes
- Status of checklist items

Example:
```markdown
## 4. Implementation Record
- **[Task 1.1]**: Implemented JWT auth middleware in `src/middleware/auth.ts`
- **[Task 1.2]**: Added unit tests in `test/auth.test.ts` (All 6 tests passing)
- **[Task 1.3]**: Registered auth route in `src/server.ts`
```

### 4. Update Workspace Status
Update `devflow/context/current-stage.md`:
- `Current Stage`: `implement (Fast-Track -> Checklist Completed -> Ready for /check)`

### 5. Output Summary & Next Step
Report to the user:
- Completed checklist items and modified files
- Local verification results
- **Next Command**: `/check` (or `/check {ID}`)
