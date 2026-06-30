#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-migrate-artifacts-'));

function run(args) {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'migrate-stage-artifacts.mjs'), ...args], {
    cwd: rootDir,
    encoding: 'utf8',
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFile(filePath, content = 'sample\n') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

try {
  const projectRoot = path.join(scratchRoot, 'project');
  const legacyRoot = path.join(projectRoot, '.workspaces', '001-sample-task');
  writeFile(path.join(legacyRoot, '00-discover', 'discover.md'));
  writeFile(path.join(legacyRoot, '10-define', 'define.md'));
  writeFile(path.join(legacyRoot, '20-spec', 'spec.md'));
  writeFile(path.join(legacyRoot, '60-report', 'report.md'));
  writeFile(path.join(legacyRoot, '60-report', 'report.html'), '<html></html>\n');

  const dryRun = run([projectRoot]);
  assert(dryRun.status === 0, `dry-run should pass:\n${dryRun.stdout}\n${dryRun.stderr}`);
  assert(fs.existsSync(path.join(legacyRoot, '00-discover', 'discover.md')), 'dry-run should not move legacy files');

  const writeRun = run([projectRoot, '--write']);
  assert(writeRun.status === 0, `write migration should pass:\n${writeRun.stdout}\n${writeRun.stderr}`);

  const targetRoot = path.join(projectRoot, '.workspaces', 'specs', '001-sample-task');
  assert(fs.existsSync(path.join(targetRoot, '00-discover.md')), 'discover artifact should move to flat stage filename');
  assert(fs.existsSync(path.join(targetRoot, '10-define.md')), 'define artifact should move to flat stage filename');
  assert(fs.existsSync(path.join(targetRoot, '20-spec.md')), 'spec artifact should move to flat stage filename');
  assert(fs.existsSync(path.join(targetRoot, '60-report.md')), 'report markdown should move to flat stage filename');
  assert(fs.existsSync(path.join(targetRoot, '60-report.html')), 'report html should move to flat stage filename');
  assert(!fs.existsSync(legacyRoot), 'legacy run directory should be removed when empty');

  console.log('[OK] migrate-stage-artifacts migrates legacy run folders to flat spec workspace layout.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
