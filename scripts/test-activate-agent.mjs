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
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(path.join(rootDir, '.agent'), path.join(target, '.agent'), { recursive: true });
  fs.writeFileSync(
    path.join(target, 'package.json'),
    JSON.stringify({
      name: 'activate-test-project',
      private: true,
      scripts: {
        activate: 'node ./scripts/activate-agent.mjs',
        validate: 'node ./scripts/validate-framework.mjs',
      },
    }, null, 2),
    'utf8',
  );
  fs.cpSync(path.join(rootDir, 'scripts'), path.join(target, 'scripts'), { recursive: true });

  const result = run(target);
  assert(result.status === 0, `activate should pass:\n${outputOf(result)}`);

  assert(fs.existsSync(path.join(target, '.workspaces')), 'activate should create .workspaces');
  assert(fs.existsSync(path.join(target, '.workspaces', 'specs')), 'activate should create .workspaces/specs');
  for (const dir of ['roadmap', 'issues', 'research', 'prds', 'debug', 'reports']) {
    assert(!fs.existsSync(path.join(target, '.workspaces', dir)), `activate should not precreate .workspaces/${dir}`);
  }

  assert(!fs.existsSync(path.join(target, '.workspaces', 'wiki')), 'activate should not create .workspaces/wiki in lean mode');
  assert(fs.existsSync(path.join(target, '.workspaces', 'active-agent.json')), 'activate should create active-agent.json');
  assert(fs.existsSync(path.join(target, '.workspaces', 'project_index.json')), 'activate should create project_index.json');
  console.log('[OK] activate-agent creates only the minimal workspace skeleton.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
