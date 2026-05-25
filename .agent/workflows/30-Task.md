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

1. Generate a kebab-case slug from the title.
2. Run `npm run agent -- init ...`.
3. Confirm the task directory exists under `.workspaces/specs/{ID}-{slug}/`.
4. Leave branch creation to implementation, commit, or PR workflows where source edits begin.

### 3. Populate Artifacts

Use script commands to populate `requirements.json`. Edit `spec.md` directly only for the human-readable specification.
**MANDATORY:** Before creating or updating `spec.md`, inspect `.agent/resources/schemas/spec.template.md` and keep the file aligned to its required headings. The `npm run agent -- init ...` command creates an initial populated draft; manual edits must preserve that structure. Do not leave template text, placeholder brackets, `Requirement 1`, `Acceptance Criterion 1`, `TODO`, or `TBD` in `spec.md`. If information is missing, write a concrete question or explicit assumption. `npm run agent -- validate {ID}` must pass the Markdown quality gate before this phase is complete.

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

## Next Workflow Recommendation

- **Primary**: `/31-Plan {ID}`
- **Why**: The task artifacts exist and should be transformed into an implementation plan before coding.
- **Alternatives**:
  - `/90-Agent requirements-engineer .workspaces/specs/{ID}-{slug}/spec.md` - choose this when the spec needs specialist review.
  - `/11-Research "{topic}"` - choose this when external or codebase research is still missing.

## Wiki Update Recommendation

- **Needed**: `yes` only when task creation captures a durable project convention, domain concept, or framework workflow lesson.
- **Scope**: `project` for target-project knowledge, `framework` for DevFlow workflow improvements.
- **Reason**: Most task specs are source artifacts; wiki updates should wait until the knowledge is reusable or verified.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-{slug}/spec.md`
