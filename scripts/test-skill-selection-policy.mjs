#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = path.join(rootDir, '.agent', 'skills', 'triage', 'SKILL.md');
const workflowPath = path.join(rootDir, '.agent', 'workflows', '20-Spec.md');
const originalSkill = fs.readFileSync(skillPath, 'utf8');
const originalWorkflow = fs.readFileSync(workflowPath, 'utf8');

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

  fs.writeFileSync(skillPath, `${originalSkill}\n\nRun /triage directly.\n`, 'utf8');
  const slashRun = runValidate();
  assert(slashRun.status !== 0, 'upstream slash command reference should fail validation');
  assert(
    slashRun.stderr.includes('references upstream slash command /triage'),
    'slash command validation should name the imported skill and command'
  );
  fs.writeFileSync(skillPath, originalSkill, 'utf8');

  fs.writeFileSync(
    workflowPath,
    `${originalWorkflow}\n\n- support skills: \`a\`, \`b\`, \`c\`, \`d\`, \`e\`, \`f\`\n`,
    'utf8'
  );
  const overloadRun = runValidate();
  assert(overloadRun.status !== 0, 'overloaded support skill hint should fail validation');
  assert(
    overloadRun.stderr.includes('lists 6 support skills in one hint'),
    'support hint validation should report the bounded skill count'
  );

  console.log('[OK] validate-framework enforces skill selection policy drift checks.');
} finally {
  fs.writeFileSync(skillPath, originalSkill, 'utf8');
  fs.writeFileSync(workflowPath, originalWorkflow, 'utf8');
}
