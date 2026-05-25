#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(rootDir, 'scripts', 'link-project.mjs');
const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-link-project-'));

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: rootDir,
    encoding: 'utf8',
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function outputOf(result) {
  return `${result.stdout || ''}${result.stderr || ''}`;
}

try {
  const dryRunTarget = path.join(scratchRoot, 'dry-run-target');
  fs.mkdirSync(dryRunTarget, { recursive: true });
  const dryRun = run([dryRunTarget, '--dry-run']);
  assert(dryRun.status === 0, `dry-run should pass:\n${outputOf(dryRun)}`);
  assert(outputOf(dryRun).includes('DRY RUN'), 'dry-run output should label planned actions');
  assert(!fs.existsSync(path.join(dryRunTarget, '.agent')), 'dry-run should not create .agent link');
  assert(!fs.existsSync(path.join(dryRunTarget, 'scripts')), 'dry-run should not create scripts link');
  console.log('[OK] link-project dry-run does not modify target.');

  const existingTarget = path.join(scratchRoot, 'existing-target');
  fs.mkdirSync(path.join(existingTarget, '.agent'), { recursive: true });
  const existing = run([existingTarget]);
  assert(existing.status !== 0, 'existing target path should require --overwrite');
  assert(outputOf(existing).includes('already exists'), `existing output should explain conflict:\n${outputOf(existing)}`);
  console.log('[OK] link-project requires explicit overwrite for existing paths.');

  const overwriteDryRun = run([existingTarget, '--dry-run', '--overwrite']);
  assert(overwriteDryRun.status === 0, `overwrite dry-run should pass:\n${outputOf(overwriteDryRun)}`);
  assert(outputOf(overwriteDryRun).includes('Would replace'), 'overwrite dry-run should describe replacement');
  assert(fs.statSync(path.join(existingTarget, '.agent')).isDirectory(), 'overwrite dry-run should leave existing directory intact');
  console.log('[OK] link-project overwrite dry-run is non-destructive.');

  const unsafeTarget = run([rootDir, '--dry-run']);
  assert(unsafeTarget.status !== 0, 'framework root should be rejected as a link target');
  assert(outputOf(unsafeTarget).includes('inside the Nexus-DevFlow framework'), `unsafe target output should explain rejection:\n${outputOf(unsafeTarget)}`);
  console.log('[OK] link-project rejects framework-root target.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
