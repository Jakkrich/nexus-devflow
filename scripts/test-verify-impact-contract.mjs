#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runDir = path.join(rootDir, '.workspaces', 'specs', '997-verify-impact-contract-test');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFile(filePath, content = 'sample\n') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function runValidate() {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'validate-framework.mjs')], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

function combinedOutput(result) {
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
}

function includesAny(text, candidates) {
  return candidates.some((candidate) => text.includes(candidate));
}

const validImpactReport = `---
id: "997-verify-impact"
title: "Impact & Safety Report: Verify Impact Contract"
doc_type: "report"
stage: "50-verify-impact"
created: "2026-06-23"
updated: "2026-06-23"
owner: "codex"
status: "draft"
related_run: "997"
related_files:
  - ".workspaces/specs/997-verify-impact-contract-test/50-verify.md"
---

# Impact & Safety Report: Verify Impact Contract

## 1. Changed Files

| File | Change Type | Why |
| :--- | :--- | :--- |
| \`scripts/validate-framework.mjs\` | Core Logic | Added verify impact artifact validation. |

## 2. Client Impact Analysis

| Client Flow | Before | After | Impact |
| :--- | :--- | :--- | :--- |
| DevFlow verify workflow | No governed impact companion file | Optional governed impact companion file | Positive |

## 3. Verification Metrics

### A. Unit Verification

- Ran contract validation coverage.

### B. Integration Verification

- Verified framework validation behavior with fixture workspaces.

## 4. Rollback & Mitigation Plan

- Revert verify-impact contract changes if downstream tooling cannot consume the companion file.
`;

try {
  fs.rmSync(runDir, { recursive: true, force: true });

  writeFile(path.join(runDir, '30-plan.md'));
  writeFile(path.join(runDir, '40-implement.md'));
  writeFile(path.join(runDir, '50-verify.md'));
  writeFile(path.join(runDir, '50-verify-impact.md'), validImpactReport);

  const okRun = runValidate();
  assert(okRun.status === 0, `valid verify impact workspace should pass:\n${okRun.stdout}\n${okRun.stderr}`);

  fs.rmSync(path.join(runDir, '50-verify.md'));
  const missingVerifyRun = runValidate();
  assert(missingVerifyRun.status !== 0, 'verify impact artifact without 50-verify.md should fail validation');
  assert(
    combinedOutput(missingVerifyRun).includes('50-verify-impact.md exists but required stage artifact is missing: 50-verify.md'),
    'missing verify error should be explicit'
  );

  writeFile(path.join(runDir, '50-verify.md'));
  writeFile(path.join(runDir, '50-verify-impact.md'), `# Impact & Safety Report: Broken\n\n## 1. Changed Files\n`);
  const badHeadingRun = runValidate();
  assert(badHeadingRun.status !== 0, 'verify impact artifact missing required headings should fail validation');
  assert(
    includesAny(combinedOutput(badHeadingRun), [
      '50-verify-impact.md is missing required heading: ## 2. Client Impact Analysis',
      '50-verify-impact.md is missing required heading (or its Thai equivalent): ## 2. Client Impact Analysis'
    ]),
    'missing heading error should be explicit'
  );

  console.log('[OK] validate-framework enforces verify impact artifact contracts.');
} finally {
  fs.rmSync(runDir, { recursive: true, force: true });
}
