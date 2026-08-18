---
name: ci
description: "[Devflow] Set up automated GitHub Actions CI workflow (.github/workflows/verify.yml) aligned with project verify command."
---

# ci - Automated GitHub Actions Pipeline Setup

Where this sits in the workflow:

```text
/onboard or /adopt  ->  [ci]  ->  Verify locally  ->  GitHub Actions runs Verify on PR & Push
(project setup)         (setup)    (same command)     (automated checks)
```

This skill connects local verification with automated GitHub checks using **one shared Verify recipe**:

- **Verify is the recipe**: Runs the project's real checks (typecheck, tests, build) defined in `AGENTS.md`.
- **GitHub Actions is the worker**: Executes the same recipe automatically on pull requests and pushes.
- **Branch Protection / Ruleset is the gate**: Optionally requires the check to pass before merging.

This skill configures the workflow file. It **never pushes to remote, changes remote repository rulesets, or publishes releases** without explicit permission.

## Input

No argument is required. A preferred package manager or branch name can be optionally provided.

## Step 1 - Inspect Project Setup (Read-Only)

Inspect the repository without modifying files:

1. **Commands in `AGENTS.md`**: Look for existing `Verify`, `Test`, `Build`, and `Dev` commands.
2. **Project Manifests**: `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, etc.
3. **Lockfiles & Package Manager**: `pnpm-lock.yaml` (pnpm), `package-lock.json` (npm), `yarn.lock` (yarn), `bun.lockb` (bun), `poetry.lock` (poetry), `Cargo.lock` (cargo).
4. **Runtime Versions**: `.node-version`, `.nvmrc`, `package.json` engines, `.python-version`.
5. **Existing Workflows**: Inspect `.github/workflows/` to check if a CI workflow already exists.
6. **Git Default Branch**: Detect `main` or `master`.

If a healthy and matching workflow already exists, report that CI is already in place and stop.

## Step 2 - Define The Single Verify Command

Build one combined Verify command from actual checks that exist in the project, in this standard order:

1. **Typecheck** (e.g. `tsc --noEmit`, `mypy`, `pyright`, `go vet`)
2. **Tests** (e.g. `npm test`, `pytest`, `go test ./...`, `cargo test`) - only if real tests exist
3. **Build** (e.g. `npm run build`, `cargo build`)

For JavaScript/TypeScript projects, ensure a `verify` or `check` script exists in `package.json` (or combine existing scripts: e.g. `npm run check:static && npm test && npm run build`).

Record the exact command in the Commands section of `AGENTS.md`:

```markdown
## Commands
- Verify: `npm run check` (or detected verify command)
```

## Step 3 - Generate `.github/workflows/verify.yml`

Create `.github/workflows/verify.yml` with security and stability best practices:

- **Trigger**: Pull requests to default branch + Pushes to default branch.
- **Permissions**: Set least privilege `permissions: contents: read`.
- **Concurrency**: Cancel in-progress runs on the same PR branch.
- **Lockfile-Safe Install**: Use `npm ci`, `pnpm install --frozen-lockfile`, `yarn install --immutable`, or `cargo --locked`.
- **Exact Verify Step**: Run the exact Verify command from `AGENTS.md`.

### Standard GitHub Actions Template (Node.js Example):

```yaml
name: Verify

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  verify:
    name: Run Verification Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Runtime
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Run Verify Checks
        run: npm run check
```

## Step 4 - Verify Locally

Execute the Verify command locally to confirm that it succeeds on clean code before recommending it:

```bash
npm run check
```

If local verification fails, report the failing check and assist in resolving it before claiming CI readiness.

## Step 5 - Summary & Handoff

Output a concise summary:

- **Verify Command**: Documented command in `AGENTS.md`.
- **Workflow File**: `.github/workflows/verify.yml` (created/updated).
- **Trigger Events**: `pull_request` & `push`.
- **Local Test**: Result of local execution.
- **Next Steps**: Advise user to commit and push the workflow to activate GitHub Actions.

## Rules

- **Preserve Existing CI**: Never overwrite existing custom workflows without explicit user consent.
- **No Dummy Tests**: Do not invent fake test commands or install unrequested test runners.
- **Least Privilege Security**: Always specify `permissions: contents: read`.
- **No Auto-Push**: Stop at local file creation; do not push to remote automatically.
