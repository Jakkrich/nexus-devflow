#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runDir = path.join(rootDir, 'devflow', 'specs', '997-verify-impact-contract-test');

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
id: "997-check-impact"
title: "Impact & Safety Report: Check Impact Contract"
doc_type: "report"
stage: "check-impact"
created: "2026-06-23"
updated: "2026-06-23"
owner: "codex"
status: "draft"
related_run: "997"
related_files:
  - "devflow/runs/997-verify-impact-contract-test/check.md"
---

# Impact & Safety Report: Check Impact Contract

## 1. Changed Files

| File | Change Type | Why |
| :--- | :--- | :--- |
| \`scripts/validate-framework.mjs\` | Core Logic | Added impact artifact validation. |

## 2. Client Impact Analysis

| Client Flow | Before | After | Impact |
| :--- | :--- | :--- | :--- |
| DevFlow check workflow | No governed impact companion file | Optional governed impact companion file | Positive |

## 3. Verification Metrics

### A. Unit Verification

- Ran contract validation coverage.

### B. Integration Verification

- Verified framework validation behavior with fixture workspaces.

## 4. Rollback & Mitigation Plan

- Revert check-impact contract changes if downstream tooling cannot consume the companion file.
`;

try {
  fs.rmSync(runDir, { recursive: true, force: true });

  writeFile(path.join(runDir, 'spec.md'));
  writeFile(path.join(runDir, 'findings.md'));
  writeFile(path.join(runDir, 'check-impact.md'), validImpactReport);

  const okRun = runValidate();
  assert(okRun.status === 0, `valid check impact workspace should pass:\n${okRun.stdout}\n${okRun.stderr}`);

  console.log('[OK] validate-framework enforces check impact artifact contracts.');
} finally {
  fs.rmSync(runDir, { recursive: true, force: true });
}
