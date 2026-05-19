# JSON Artifact Handling

Use this skill whenever a workflow or agent needs to create, inspect, update, repair, or validate PRPs JSON artifacts under `.workspaces/specs/{ID}-*/`.

## Core Rule

Think in natural language, mutate JSON with scripts.

Do not rewrite full JSON files by hand unless no PRP CLI command can express the change. Prefer small, explicit commands that preserve schema shape and reduce token usage.

## Supported Artifacts

Artifact aliases:

- `requirements` -> `requirements.json`
- `context` -> `context.json`
- `complexity` -> `complexity_assessment.json`
- `plan` or `implementation_plan` -> `implementation_plan.json`
- `metadata` -> `task_metadata.json`
- `logs` -> `task_logs.json`

## Generic Artifact Commands

Read an artifact or field:

```powershell
npm run agent -- artifact:get {ID} {artifact}
npm run agent -- artifact:get {ID} {artifact} {field.path}
```

Set scalar or JSON values:

```powershell
npm run agent -- artifact:set {ID} requirements task_description "Add login"
npm run agent -- artifact:set {ID} requirements workflow_type "feature"
npm run agent -- artifact:set {ID} context patterns.service_pattern "Routes use APIRouter"
```

Append array items:

```powershell
npm run agent -- artifact:append {ID} requirements acceptance_criteria "Login succeeds with valid credentials"
npm run agent -- artifact:append {ID} context files_to_reference "src/auth/login.ts"
```

Merge object fields:

```powershell
npm run agent -- artifact:merge {ID} complexity metrics "{\"risk\":\"low\"}"
```

Repair and validate:

```powershell
npm run agent -- json:repair {ID} requirements
npm run agent -- repair {ID}
npm run agent -- validate {ID}
```

## Plan Commands

Use these instead of writing `implementation_plan.json` directly:

```powershell
npm run agent -- plan:add-phase {ID} "Backend API" --phase-id phase-backend --type implementation
npm run agent -- plan:add-subtask {ID} phase-backend "Create health endpoint" --description "Create endpoint following existing API conventions" --service backend --modify "src/api/health.ts" --pattern "src/api/users.ts" --verify-type command --verify-command "npm test" --verify-expected "tests pass"
npm run agent -- plan:set-subtask-status {ID} subtask-1.1 completed
npm run agent -- plan:validate {ID}
```

## Required Loop

After every mutation:

1. Run `npm run agent -- validate {ID}`.
2. If validation fails, run `npm run agent -- repair {ID}` or `npm run agent -- json:repair {ID} {artifact}`.
3. Re-run validation.
4. Report only the important changes and validation status to the user.

## Fallback Rule

Manual JSON edits are allowed only when:

- the CLI cannot express the needed structure,
- the edit is smaller than a full-file rewrite,
- the agent immediately runs validation afterward,
- and the agent explains why the script was insufficient.
