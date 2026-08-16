#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-activate-agent-'));

function run(cwd) {
  return spawnSync(process.execPath, [path.join(cwd, 'scripts', 'activate-agent.mjs')], {
    cwd,
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
  const target = path.join(scratchRoot, 'target-project');
  fs.mkdirSync(path.join(target, 'devflow', 'context'), { recursive: true });
  fs.cpSync(path.join(rootDir, '.agents'), path.join(target, '.agents'), { recursive: true });
  fs.writeFileSync(
    path.join(target, 'package.json'),
    JSON.stringify({
      name: 'activate-test-project',
      private: true,
      scripts: {
        activate: 'node ./scripts/activate-agent.mjs',
        check: 'node ./scripts/validate-framework.mjs',
      },
    }, null, 2),
    'utf8',
  );
  fs.cpSync(path.join(rootDir, 'scripts'), path.join(target, 'scripts'), { recursive: true });

  const result = run(target);
  assert(result.status === 0, `activate should pass:\n${outputOf(result)}`);

  assert(fs.existsSync(path.join(target, 'devflow')), 'activate should create devflow');
  assert(fs.existsSync(path.join(target, 'devflow', 'discoveries')), 'activate should create devflow/discoveries');
  assert(fs.existsSync(path.join(target, 'devflow', 'runs')), 'activate should create devflow/runs');
  for (const dir of ['roadmap', 'issues', 'research', 'prds', 'debug', 'reports']) {
    assert(!fs.existsSync(path.join(target, 'devflow', dir)), `activate should not precreate devflow/${dir}`);
  }

  assert(!fs.existsSync(path.join(target, 'devflow', 'wiki')), 'activate should not create devflow/wiki in lean mode');
  console.log('[OK] activate-agent creates only the minimal workspace skeleton.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
