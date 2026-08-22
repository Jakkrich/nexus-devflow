---
name: ci
description: "[Devflow] Set up automated GitHub Actions CI workflow (.github/workflows/verify.yml) aligned with project verify command."
---

# CI/CD Pipeline Automation & Quality Gates

## Overview

This is the CI/CD and automation master skill for Nexus-DevFlow. It automates quality gates so that no change reaches production without passing static analysis, typechecking, tests, security audits, and builds.

```text
PR / Push ➔ Lint & Typecheck ➔ Unit & Integration Tests ➔ Build Verification ➔ Security Audit
```

---

## 1. Shift-Left Quality Gate Pipeline

1. **Static Analysis & Typecheck**: `tsc --noEmit`, `eslint`, `biome` (Catches syntax & type flaws in seconds).
2. **Automated Tests**: Unit & Integration tests (`npm test`, `pytest`, `go test`).
3. **Build Integrity**: `npm run build` (Ensures bundle compiles cleanly without warnings).
4. **Security Hygiene**: `npm audit --audit-level=high` (Flags vulnerable dependencies).

---

## 2. GitHub Actions Setup (`.github/workflows/verify.yml`)

When setting up or updating CI:
- **Trigger**: Pull requests and pushes to `main` / `master`.
- **Permissions**: Enforce least privilege (`permissions: contents: read`).
- **Concurrency**: Cancel stale in-progress runs on the same PR.
- **Deterministic Install**: Use `npm ci` or `--frozen-lockfile`.

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

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Run Verify Checks
        run: npm run check
```

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Automated testing infrastructure
- **Mainline integration**: Invoked via `/ci` during `onboard` or `adopt`.
- **Handoff**: `50-verify`, `70-deliver`
