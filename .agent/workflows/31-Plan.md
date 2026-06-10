---
description: Plan Implementation - Transform spec.md into a script-managed implementation plan.
---
# Phase 31: Plan Implementation

**Strict mode: planning only. Do not edit source code in this phase.**

Create a codebase-informed implementation plan using CLI plan helpers instead of manually writing full JSON.

## Usage

```text
/31-Plan {ID}
```

## Script-First JSON Rule

Use PRP CLI commands to update JSON artifacts:

```powershell
npm run agent -- transition {ID} planning
npm run agent -- artifact:set {ID} complexity level "{simple|standard|complex}"
npm run agent -- artifact:set {ID} complexity approach "{Planning approach}"
npm run agent -- artifact:set {ID} context task_description "{Task summary}"
npm run agent -- artifact:append {ID} context files_to_reference "{path/to/pattern}"
npm run agent -- plan:add-phase {ID} "{Phase Name}" --phase-id phase-1 --type implementation
npm run agent -- plan:add-subtask {ID} phase-1 "{Subtask Title}" --description "{Detailed instruction}" --service backend --modify "src/file.ts" --pattern "src/example.ts" --verify-type command --verify-command "npm test" --verify-expected "tests pass"
npm run agent -- plan:validate {ID}
npm run agent -- validate {ID}
npm run agent -- plan:approve {ID} --actor "{Approver}" --summary "{Approval summary}"
```

Raw `implementation_plan.json` rewrites are fallback only. Prefer many small commands over one large JSON response.

**MANDATORY RULE:** If you create temporary script files (e.g., `.ps1`, `.sh`) to execute multiple CLI commands in batch, you MUST save them inside the task workspace directory (e.g., `.workspaces/specs/{ID}-*/scratch/` or `.workspaces/specs/{ID}-*/`) and NEVER in the project's central `scripts/` directory.

## Process

### 1. Read Task Artifacts

Read:

- `.workspaces/specs/{ID}-*/spec.md`
- `requirements.json`
- `context.json`
- `complexity_assessment.json`
- `implementation_plan.json`

### 2. Assess Complexity

Use the `complexity_assessor` pattern:

- `simple`: 1 phase, 1-3 subtasks.
- `standard`: multiple ordered phases, clear verification per subtask.
- `complex`: deeper codebase exploration, possible `/90-Agent codebase-explorer` recommendation.

Store the result through `artifact:set`, then validate.

### 3. Explore Codebase Patterns

Use fast searches (`rg`, file reads) to find:

- Similar implementations
- Entry points
- Config and test commands
- Files likely to modify
- Files to reference as patterns

Save important findings to `context.json` with `artifact:set`, `artifact:append`, or `artifact:merge`.

### 4. Build Plan With Helpers

Use the `planner` pattern, but create plan structure through CLI:

- Add phases in dependency order.
- Add subtasks that are small, verifiable units.
- Include explicit files to modify/create.
- Include patterns to follow.
- Include verification command or manual check.
- Include a test decision for every subtask in the subtask description and the human-readable plan.
- Precision reminder: record material assumptions, choose the smallest useful path, map each subtask to target files and verification, and stop if ownership or target files are unclear.

Each subtask should answer:

- What to change
- Where to change it
- Which existing pattern to follow
- How to verify it
- Whether automated tests are required, not required, or replaced by manual/command-only verification

### 4.1 Test Decision Gate

For every subtask, decide one of:

- `Required`: automated tests must be created or updated before the subtask can be completed.
- `Manual/Command Only`: automated tests are not the right fit, but build, lint, typecheck, smoke test, screenshot, or manual verification is required.
- `Not Required`: no new automated test is needed because the change is docs-only, metadata-only, or otherwise has no behavior surface.

Record the decision with:

- **Reason**: why this decision fits the risk and behavior surface.
- **Planned cases**: concrete happy path, error path, edge case, or regression cases when tests are required.
- **Verification command**: the exact command or manual check that proves completion.
- **Expected result**: what passing evidence should look like.

Default to `Required` for bug fixes, regression fixes, business logic, auth or permission logic, payment or billing, data migration, parsers, API contracts, security-sensitive code, concurrency, persistence, and user-visible behavior with meaningful branching.

If the decision is `Not Required`, explain why automated tests would not add useful confidence and still provide a concrete verification path. Do not use "too simple" as the only reason.

### 5. Create Human-Readable Plan

Create a `plan.md` file in the task workspace (`.workspaces/specs/{ID}-*/plan.md`) that summarizes the JSON plan in a readable format.
**MANDATORY:** You MUST base the structure of this file strictly on the template provided at `.agent/resources/schemas/plan.template.md`. Before reporting completion, run `npm run agent -- markdown:validate {plan_md_path} plan.template.md` and replace any placeholder/template text with concrete phases, files, commands, dependencies, and verification evidence.
**MANDATORY:** The `plan.md` Verification Focus section MUST include the test decision table for every subtask. The user approves this testing strategy together with the implementation plan.
**MANDATORY:** You MUST present this `plan.md` content to the user for review and wait for their explicit approval. After approval, record it with `npm run agent -- plan:approve {ID} --actor "{Approver}" --summary "{Approval summary}"` before recommending `/32-Code`.

### 6. Validate And Close Planning

Run:

```powershell
npm run agent -- plan:validate {ID}
npm run agent -- validate {ID}
npm run agent -- log {ID} "Phase 31 completed: implementation plan ready" --phase planning --complete
```

If validation fails, run repair and update only the broken fields with script commands.

## Output Checklist

- Complexity is recorded.
- Context references are recorded.
- Plan phases are ordered by dependency.
- Every subtask has title, description, service, files, patterns, verification, and status.
- Every subtask has a test decision, reason, planned cases when needed, command or manual check, and expected result.
- Human-readable `plan.md` is created and presented.
- `plan:validate` passes.
- Next command: `/32-Code {ID}`

## Next Workflow Recommendation

- **Primary**: `/32-Code {ID}` after the user approves `plan.md`.
- **Why**: Approved planning is the gate before implementation.
- **Alternatives**:
  - `/90-Agent codebase-explorer .workspaces/specs/{ID}-*/` - choose this when architecture or data flow is unclear.
  - `/11-Research "{topic}"` - choose this when the plan depends on external docs or APIs.
  - `/30-Task {ID} "{title}"` - choose this only when the spec needs to be rewritten before planning continues.

## Wiki Update Recommendation

- **Needed**: `yes` when planning records a reusable architecture decision, project pattern, or context-loading lesson.
- **Scope**: `project` unless the planning lesson changes DevFlow framework behavior.
- **Reason**: Plans often discover stable patterns and minimal context references that future sessions should reuse.
- **Suggested Command**: `/59-Wiki project ingest .workspaces/specs/{ID}-*/plan.md`
