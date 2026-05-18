#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const agentDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = path.resolve(process.env.PRP_TEST_PROJECT_ROOT || path.join(agentDir, '.test-workspace-node'));
const cli = path.join(agentDir, 'scripts', 'prp.mjs');
const taskDir = path.join(projectRoot, '.workspaces', 'specs', '999-test-task');

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: projectRoot,
    env: { ...process.env, PRP_PROJECT_ROOT: projectRoot, PRP_AGENT_DIR: agentDir },
    encoding: 'utf8',
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error(`Command failed: prp ${args.join(' ')}`);
  return result.stdout;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

fs.mkdirSync(projectRoot, { recursive: true });
fs.rmSync(taskDir, { recursive: true, force: true });

run(['init', '999', 'Integration Test', 'test-task', 'Node contract test']);

const requiredFiles = [
  'task_metadata.json',
  'implementation_plan.json',
  'requirements.json',
  'task_logs.json',
  'context.json',
  'complexity_assessment.json',
  'spec.md',
];
for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(taskDir, file)), `${file} was not created`);
  console.log(`[OK] ${file} created.`);
}

run(['update', '999', '--status', 'in_progress']);
let plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.status === 'in_progress', 'status update failed');
assert(plan.planStatus === 'approved', 'planStatus mapping failed');
assert(plan.xstateState === 'coding', 'xstateState mapping failed');
console.log('[OK] status mapping verified.');

run(['log', '999', 'Testing log entry', '--phase', 'coding']);
let logs = readJson(path.join(taskDir, 'task_logs.json'));
assert(logs.coding.logs.some((line) => line.includes('Testing log entry')), 'phase log failed');
assert(logs.events.some((event) => event.message.includes('Testing log entry')), 'event log failed');
console.log('[OK] logs and events verified.');

run(['artifact:set', '999', 'requirements', 'task_description', 'Updated through artifact:set']);
let requirements = readJson(path.join(taskDir, 'requirements.json'));
assert(requirements.task_description === 'Updated through artifact:set', 'artifact:set failed');
console.log('[OK] artifact:set verified.');

run(['artifact:append', '999', 'requirements', 'acceptance_criteria', 'Artifact append works']);
requirements = readJson(path.join(taskDir, 'requirements.json'));
assert(requirements.acceptance_criteria.includes('Artifact append works'), 'artifact:append failed');
console.log('[OK] artifact:append verified.');

run(['artifact:merge', '999', 'complexity', 'metrics', '{"risk":"low"}']);
const complexity = readJson(path.join(taskDir, 'complexity_assessment.json'));
assert(complexity.metrics.risk === 'low', 'artifact:merge failed');
console.log('[OK] artifact:merge verified.');

const getOutput = run(['artifact:get', '999', 'requirements', 'task_description']);
assert(getOutput.includes('Updated through artifact:set'), 'artifact:get failed');
console.log('[OK] artifact:get verified.');

fs.writeFileSync(
  path.join(taskDir, 'requirements.json'),
  '```json\n{"task_description":"Needs repair","user_goal":"Goal","workflow_type":"feature","acceptance_criteria":["ok",],"technical_constraints":[],"dependencies":[],"schema_version":"1.0.0","created_at":"now","updated_at":"now",}\n```',
  'utf8',
);
run(['json:repair', '999', 'requirements']);
requirements = readJson(path.join(taskDir, 'requirements.json'));
assert(requirements.task_description === 'Needs repair', 'json:repair failed');
console.log('[OK] json:repair verified.');

run(['validate', '999']);
console.log('[OK] schema validation passed.');

run(['status']);
console.log('\nALL NODE PRP TESTS PASSED SUCCESSFULLY!');
