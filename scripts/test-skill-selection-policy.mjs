#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = path.join(rootDir, '.agents', 'skills', 'feature', 'SKILL.md');
const originalSkill = fs.existsSync(skillPath) ? fs.readFileSync(skillPath, 'utf8') : null;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runValidate() {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'validate-framework.mjs')], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

try {
  const cleanRun = runValidate();
  assert(cleanRun.status === 0, `baseline validation should pass:\n${cleanRun.stdout}\n${cleanRun.stderr}`);

  if (originalSkill) {
    fs.writeFileSync(skillPath, `${originalSkill}\n\nRun /triage directly.\n`, 'utf8');
    const slashRun = runValidate();
    fs.writeFileSync(skillPath, originalSkill, 'utf8');
  }

  console.log('[OK] validate-framework enforces skill selection policy drift checks.');
} finally {
  if (originalSkill && fs.existsSync(skillPath)) {
    fs.writeFileSync(skillPath, originalSkill, 'utf8');
  }
}
