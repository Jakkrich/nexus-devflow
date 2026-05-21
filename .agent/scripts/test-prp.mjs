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

function runExpectFail(args, expectedText) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: projectRoot,
    env: { ...process.env, PRP_PROJECT_ROOT: projectRoot, PRP_AGENT_DIR: agentDir },
    encoding: 'utf8',
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.status === 0) throw new Error(`Command unexpectedly passed: prp ${args.join(' ')}`);
  if (expectedText && !output.includes(expectedText)) {
    throw new Error(`Expected failed command output to include "${expectedText}". Output:\n${output}`);
  }
  return output;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

fs.mkdirSync(projectRoot, { recursive: true });
fs.rmSync(taskDir, { recursive: true, force: true });

try {
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
  '```json\n{"task_description":"Needs repair","user_goal":"Goal","workflow_type":"feature","acceptance_criteria":["ok",],"technical_constraints":[],"dependencies":[],"schema_version":"1.0.0","created_at":"2026-05-21T00:00:00.000Z","updated_at":"2026-05-21T00:00:00.000Z",}\n```',
  'utf8',
);
run(['json:repair', '999', 'requirements']);
requirements = readJson(path.join(taskDir, 'requirements.json'));
assert(requirements.task_description === 'Needs repair', 'json:repair failed');
console.log('[OK] json:repair verified.');

run(['plan:add-phase', '999', 'Backend API', '--phase-id', 'phase-backend', '--type', 'implementation']);
plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.phases.length === 1, 'plan:add-phase should replace template example phase');
assert(plan.phases[0].id === 'phase-backend', 'plan:add-phase failed');
console.log('[OK] plan:add-phase verified.');

run([
  'plan:add-subtask',
  '999',
  'phase-backend',
  'Create health endpoint',
  '--description',
  'Create a health endpoint following existing API conventions',
  '--service',
  'backend',
  '--modify',
  'src/api/health.ts',
  '--pattern',
  'src/api/users.ts',
  '--verify-type',
  'command',
  '--verify-command',
  'npm test',
  '--verify-expected',
  'tests pass',
]);
plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.phases[0].subtasks.length === 1, 'plan:add-subtask failed');
assert(plan.phases[0].subtasks[0].service === 'backend', 'plan:add-subtask service failed');
assert(plan.summary.services_involved.includes('backend'), 'plan summary service update failed');
console.log('[OK] plan:add-subtask verified.');

run(['plan:set-subtask-status', '999', plan.phases[0].subtasks[0].id, 'complete']);
plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.phases[0].subtasks[0].status === 'completed', 'plan:set-subtask-status normalization failed');
console.log('[OK] plan:set-subtask-status verified.');

run(['plan:validate', '999']);
console.log('[OK] plan:validate verified.');

run(['validate', '999']);
console.log('[OK] schema validation passed.');

const planPath = path.join(taskDir, 'implementation_plan.json');
const validPlan = readJson(planPath);

const badTimestampPlan = structuredClone(validPlan);
badTimestampPlan.updated_at = 'not-a-date';
fs.writeFileSync(planPath, `${JSON.stringify(badTimestampPlan, null, 2)}\n`, 'utf8');
runExpectFail(['plan:validate', '999'], 'expected ISO timestamp');
console.log('[OK] invalid timestamp rejected.');

const badStatusPlan = structuredClone(validPlan);
badStatusPlan.status = 'in_progress';
badStatusPlan.planStatus = 'planning';
badStatusPlan.xstateState = 'planning';
fs.writeFileSync(planPath, `${JSON.stringify(badStatusPlan, null, 2)}\n`, 'utf8');
runExpectFail(['plan:validate', '999'], 'expected approved for status in_progress');
console.log('[OK] status mapping mismatch rejected.');

const unknownKeyPlan = structuredClone(validPlan);
unknownKeyPlan.extra_contract_drift = true;
fs.writeFileSync(planPath, `${JSON.stringify(unknownKeyPlan, null, 2)}\n`, 'utf8');
runExpectFail(['plan:validate', '999'], 'unknown top-level key');
console.log('[OK] unknown top-level key rejected.');

fs.writeFileSync(planPath, `${JSON.stringify(validPlan, null, 2)}\n`, 'utf8');
run(['validate', '999']);
console.log('[OK] schema validation restored after negative fixtures.');

run(['status']);
console.log('\nALL NODE PRP TESTS PASSED SUCCESSFULLY!');
} finally {
  if (!process.env.PRP_TEST_KEEP_WORKSPACE) {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
}
