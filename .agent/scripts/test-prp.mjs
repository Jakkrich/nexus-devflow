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
  'plan_approval.json',
  'spec.md',
];
for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(taskDir, file)), `${file} was not created`);
  console.log(`[OK] ${file} created.`);
}

runExpectFail(['transition', '999', 'in_progress'], 'before plan approval');
console.log('[OK] transition gate rejects coding before approval.');

let approvalOutput = run(['plan:approval', '999']);
assert(approvalOutput.includes('"approved": false'), 'plan:approval should report unapproved default');
run(['plan:approve', '999', '--actor', 'Test Agent', '--summary', 'Plan reviewed for contract tests']);
const approval = readJson(path.join(taskDir, 'plan_approval.json'));
assert(approval.approved === true, 'plan:approve should set approved true');
assert(approval.actor === 'Test Agent', 'plan:approve should record actor');
let logs = readJson(path.join(taskDir, 'task_logs.json'));
assert(logs.events.some((event) => event.event === 'plan.approved'), 'plan:approve should append log event');
run(['transition', '999', 'in_progress']);
let plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.status === 'in_progress', 'transition to in_progress failed');
console.log('[OK] plan approval and transition to coding verified.');

run(['update', '999', '--status', 'in_progress']);
plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.status === 'in_progress', 'status update failed');
assert(plan.planStatus === 'approved', 'planStatus mapping failed');
assert(plan.xstateState === 'coding', 'xstateState mapping failed');
console.log('[OK] status mapping verified.');

run(['log', '999', 'Testing log entry', '--phase', 'coding']);
logs = readJson(path.join(taskDir, 'task_logs.json'));
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

const validRequirementsAfterMutation = readJson(path.join(taskDir, 'requirements.json'));
runExpectFail(
  ['artifact:set', '999', 'requirements', 'extra_contract_drift', 'true'],
  'Artifact validation failed',
);
requirements = readJson(path.join(taskDir, 'requirements.json'));
assert(!('extra_contract_drift' in requirements), 'invalid artifact:set should not be saved');
assert(
  requirements.updated_at === validRequirementsAfterMutation.updated_at,
  'invalid artifact:set should leave the existing artifact unchanged',
);
console.log('[OK] invalid artifact mutation rejected without saving.');

runExpectFail(
  ['artifact:set', '999', 'requirements', 'workflow_type', 'not-a-real-type'],
  'Artifact validation failed',
);
requirements = readJson(path.join(taskDir, 'requirements.json'));
assert(requirements.workflow_type === validRequirementsAfterMutation.workflow_type, 'invalid enum mutation should be rolled back');
console.log('[OK] invalid enum mutation rejected without saving.');

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

runExpectFail(['transition', '999', 'ai_review'], 'until all plan subtasks');
console.log('[OK] transition gate rejects AI review while subtasks are pending.');

run(['plan:set-subtask-status', '999', plan.phases[0].subtasks[0].id, 'complete']);
plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.phases[0].subtasks[0].status === 'completed', 'plan:set-subtask-status normalization failed');
console.log('[OK] plan:set-subtask-status verified.');

run(['transition', '999', 'ai_review']);
plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.status === 'ai_review', 'transition to ai_review failed');
runExpectFail(['transition', '999', 'done', '--actor', 'Human Reviewer', '--summary', 'Looks good'], 'before human_review');
console.log('[OK] transition gates AI review and rejects done before human review.');

run(['plan:validate', '999']);
console.log('[OK] plan:validate verified.');

run(['validate', '999']);
console.log('[OK] schema validation passed.');

const specPath = path.join(taskDir, 'spec.md');
const validSpec = fs.readFileSync(specPath, 'utf8');
fs.writeFileSync(
  specPath,
  validSpec.replace('- **Objective**:', '- **Objective**: [What are we trying to achieve?]\n- **Original Objective**:'),
  'utf8',
);
runExpectFail(['validate', '999'], 'PLACEHOLDER TEXT in spec.md');
fs.writeFileSync(specPath, validSpec, 'utf8');
console.log('[OK] markdown placeholder rejected in task validation.');

const reportPath = path.join(projectRoot, '.workspaces', 'reports', 'placeholder-report.md');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(
  reportPath,
  '# Test Report\n\n## 1. Overview\n- **Objective**: [What are we trying to achieve?]\n',
  'utf8',
);
runExpectFail(['markdown:validate', reportPath], 'PLACEHOLDER TEXT');
console.log('[OK] markdown placeholder rejected in report validation.');

runExpectFail(['init', '998', 'Unsafe Slug', '../bad-slug'], 'Invalid task slug');
assert(!fs.existsSync(path.join(projectRoot, '.workspaces', 'bad-slug')), 'unsafe slug should not create a parent directory');
runExpectFail(['init', '../998', 'Unsafe ID', 'unsafe-id'], 'Invalid task ID');
assert(!fs.existsSync(path.join(projectRoot, '.workspaces', '998-unsafe-id')), 'unsafe id should not create a parent directory');
console.log('[OK] unsafe init id and slug rejected.');

const qaReportPath = path.join(taskDir, 'qa_report.md');
fs.writeFileSync(
  qaReportPath,
  `# QA Verification Report: 999 - Integration Test #doc/report #report/qa

## 1. Overview #section/summary

- QA Status: PASSED
- Date Verified: 2026-05-25 00:00
- Verified By: Test Agent

## 2. Testing Environment #section/context

- Environment: Local contract workspace
- OS/Browser: Node.js contract runner
- Commands Used: node .agent/scripts/test-prp.mjs

## 3. Verification Steps Executed #section/evidence

| # | Step | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| 1 | Run PRP contract tests | Commands pass | Commands pass | PASS |

## 4. Code Quality And Security Check #section/findings

- Linting/Formatting: Contract runner completed.
- Security: Path traversal cases rejected.
- Best Practices: CLI gates use explicit commands.
- Performance: Not applicable for this contract test.

## 5. Issues Found #section/findings

### Issue 1 #finding/bug #priority/medium

No issues found.

## 6. Manual Verification Required #section/followup

No manual verification required for this contract fixture.

## 7. Final Recommendation #section/decision

Ready for merge.

## 8. Sources #section/sources

- .agent/scripts/test-prp.mjs
`,
  'utf8',
);
run(['transition', '999', 'human_review']);
run(['transition', '999', 'done', '--actor', 'Human Reviewer', '--summary', 'Approved after QA report']);
plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.status === 'done', 'transition to done failed');
run(['followup:start', '999', 'Add a follow-up contract']);
plan = readJson(path.join(taskDir, 'implementation_plan.json'));
assert(plan.status === 'planning', 'followup:start should return task to planning');
assert(plan.summary.followup_round === 1, 'followup:start should increment follow-up round');
assert(plan.phases[0].subtasks[0].status === 'completed', 'followup:start should preserve completed subtasks');
console.log('[OK] human review, done transition, and follow-up start verified.');

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
