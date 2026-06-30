#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-validate-framework-'));
const fixtureRoot = path.join(scratchRoot, 'fixture');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function outputOf(result) {
  return `${result.stdout || ''}${result.stderr || ''}`;
}

try {
  fs.mkdirSync(fixtureRoot, { recursive: true });
  for (const item of ['.agent', '.workspaces', 'docs', 'scripts', 'package.json', 'ROADMAP.md', 'agent-bundle.manifest.json']) {
    fs.cpSync(path.join(rootDir, item), path.join(fixtureRoot, item), { recursive: true });
  }

  fs.writeFileSync(path.join(fixtureRoot, 'agent-bundle.manifest.json'), '{ invalid json', 'utf8');

  const result = spawnSync(process.execPath, [path.join(fixtureRoot, 'scripts', 'validate-framework.mjs')], {
    cwd: fixtureRoot,
    encoding: 'utf8'
  });

  assert(result.status !== 0, 'validate-framework should fail when the manifest is invalid JSON');
  assert(outputOf(result).includes('agent-bundle.manifest.json is not valid JSON'), `output should report the manifest parse failure:\n${outputOf(result)}`);
  assert(!outputOf(result).includes('Framework validation passed.'), 'output must not claim validation passed after manifest failure');

  console.log('[OK] validate-framework fails when the manifest JSON is invalid.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
