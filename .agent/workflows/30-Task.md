---
description: Create New Task (Structured Entry) - Create a task directory, spec.md, and initial JSON artifacts without touching source code.
---
# Phase 30: Create New Task

**Strict mode: spec and task artifacts only. Do not edit source code in this phase.**

Create a task workspace, clarify the user's intent, and populate the initial human-readable and machine-readable task artifacts.

## Usage

```text
/30-Task {ID} {Title} ["Description"]
```

If the ID is missing, inspect `.workspaces/specs/` and choose the next available numeric ID.

## Script-First JSON Rule

Do not manually rewrite full JSON artifacts. Use PRP CLI commands for JSON mutation:

```powershell
npm run agent -- init {ID} "{Title}" {slug} "{Description}"
npm run agent -- artifact:set {ID} requirements task_description "{Description}"
npm run agent -- artifact:set {ID} requirements user_goal "{Goal}"
npm run agent -- artifact:set {ID} requirements workflow_type "{feature|bugfix|refactor|docs|test|investigation|migration|simple}"
npm run agent -- artifact:append {ID} requirements acceptance_criteria "{Criterion}"
npm run agent -- artifact:append {ID} requirements technical_constraints "{Constraint}"
npm run agent -- validate {ID}
```

If validation fails:

```powershell
npm run agent -- repair {ID}
npm run agent -- validate {ID}
```

## Process

### 1. Clarify Intent

Use the `spec_gatherer` pattern:

- Confirm the task in one sentence.
- Identify workflow type: `feature`, `bugfix`, `refactor`, `docs`, `test`, `investigation`, `migration`, or `simple`.
- Ask only necessary clarifying questions.
- Capture acceptance criteria and constraints before creating the task when the request is vague.

### 2. Create Workspace

1. **Branch Check:** Check the current git branch. If it is `main` or `master`, you MUST automatically create and checkout a new feature branch (e.g., `git checkout -b feature/{ID}-{slug}`) before proceeding.
2. Generate a kebab-case slug from the title.
3. Run `npm run agent -- init ...`.
4. Confirm the task directory exists under `.workspaces/specs/{ID}-{slug}/`.

### 3. Populate Artifacts

Use script commands to populate `requirements.json`. Edit `spec.md` directly only for the human-readable specification.

`spec.md` should include:

- Overview
- Workflow Type
- Task Scope
- Success Criteria
- Constraints
- Out of Scope
- Next Suggested Phase

### 4. Validate

Run:

```powershell
npm run agent -- validate {ID}
```

Repair and re-run validation if needed.

## Output

Report:

- Task ID and directory
- Workflow type
- Key acceptance criteria
- Validation status
- Next command: `/31-Plan {ID}`
