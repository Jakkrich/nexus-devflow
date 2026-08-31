---
name: publish-devflow
description: "[maintainer] Release, bump version, create git tag, and push to remote for Nexus-DevFlow framework repository. Automates semver versioning across package.json, manifest, CHANGELOG.md, runs full test suites, commits, creates annotated git tag, and pushes to origin/main with tags to trigger GitHub Actions CI/CD NPM publishing. Use when releasing a new version of Nexus-DevFlow after /complete."
argument-hint: "[{patch|minor|major|version}]"
---

# publish-devflow - Maintainer Release, Tag & NPM Publish Automation

Where this sits in the Nexus-DevFlow framework maintainer lifecycle:

    /complete  ->  /publish-devflow  ->  GitHub Actions CI/CD
    (feature       (bump, test,          (auto-publish to
     archived)      tag & push)           NPM registry)

This skill is designed **strictly for maintainers of the `nexus-devflow` repository**. It automates the post-`/complete` release ceremony: bumping package versions across the repository, ensuring all tests pass, creating the official release commit and annotated Git tag, and pushing to GitHub to trigger automatic NPM publication.

---

## Input

- `/publish-devflow` (or `/publish-devflow patch`): Bumps patch version (e.g. `2.9.4` -> `2.9.5`). Default.
- `/publish-devflow minor`: Bumps minor version (e.g. `2.9.4` -> `2.10.0`).
- `/publish-devflow major`: Bumps major version (e.g. `2.9.4` -> `3.0.0`).
- `/publish-devflow 2.9.5`: Sets explicit semantic version number.

---

## Execution Protocol

### Step 1: Pre-flight Safety Inspection
1. Verify working directory is clean (`git status`).
2. Verify active branch is `main` (or ask to switch/merge from completed feature branch).
3. Confirm all prior feature/fix living specs under `devflow/context/` have been archived via `/complete`.

### Step 2: Version Resolution & File Synchronization
Reads current version from `package.json` and updates the following files in lockstep:
- `package.json` -> `"version": "<new-version>"`
- `packages/create-nexus-devflow/package.json` -> `"version": "<new-version>"`
- `.nexus/nexus-devflow.json` -> `"version": "<new-version>"`
- `CHANGELOG.md` -> Inserts `## [<new-version>] - YYYY-MM-DD` release section.

### Step 3: Multi-Lane Verification
Runs full automated test and framework contract validation:
- `npm run check:static` (Static framework contracts & skill naming)
- `npm test` (Unit and integration test suites)
- `npm run check` (TypeScript typecheck & package smoke test)

### Step 4: Git Release Commit & Annotated Tagging
1. Stages release metadata files:
   ```bash
   git add package.json packages/create-nexus-devflow/package.json .nexus/nexus-devflow.json CHANGELOG.md
   ```
2. Commits release:
   ```bash
   git commit -m "chore(release): bump version to v<new-version>"
   ```
3. Creates annotated Git tag:
   ```bash
   git tag -a v<new-version> -m "Release v<new-version>: <summary>"
   ```

### Step 5: Push to Remote & Trigger GitHub Actions
Pushes commits and annotated tag to remote repository:
```bash
git push origin main --tags
```
Informs user that GitHub Actions CI/CD workflow is triggered to build, verify, and publish `@jakkrichm/create-nexus-devflow` to NPM.

---

## Automated Maintainer Script Alternative
You can also execute the automated script directly via terminal:
```bash
npm run release:tag
# or specify version type:
npm run release:tag minor
npm run release:tag 2.10.0
```
