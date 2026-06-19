#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const checks = [
  ['Framework validation', ['npm.cmd', ['run', 'validate']]],
  ['Bundle sync check', ['npm.cmd', ['run', 'sync:check']]],
  ['Activate contract test', [process.execPath, ['scripts/test-activate-agent.mjs']]],
  ['Link project contract test', [process.execPath, ['scripts/test-link-project.mjs']]],
  ['Goal runner contract test', [process.execPath, ['.agent/scripts/test-goal-runner.mjs']]],
  ['Workflow recommendation contract test', [process.execPath, ['.agent/scripts/test-workflow-recommendations.mjs']]],
  ['Documentation contract scan', [process.execPath, ['scripts/scan-doc-contract.mjs']]],
  ['Security hygiene scan', [process.execPath, ['scripts/scan-security-hygiene.mjs']]]
];

let failed = false;

for (const [label, [command, args]] of checks) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    failed = true;
    console.error(`Check failed: ${label}`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('\nAll validation checks passed.');
}
