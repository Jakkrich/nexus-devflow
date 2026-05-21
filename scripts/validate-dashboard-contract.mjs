#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { normalizeStatus } from '../.agent/dashboard/html/dashboard-status.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const fixtureRoot = path.join(projectRoot, '.workspaces', 'temp', 'dashboard-contract');
const agentDir = path.join(projectRoot, '.agent');
const cli = path.join(agentDir, 'scripts', 'prp.mjs');
const taskDir = path.join(fixtureRoot, '.workspaces', 'specs', '998-dashboard-contract');
const dashboardHtml = path.join(agentDir, 'dashboard', 'html', 'dashboard.html');
const dashboardJs = path.join(agentDir, 'dashboard', 'html', 'dashboard.js');
const dashboardCss = path.join(agentDir, 'dashboard', 'html', 'dashboard.css');

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: fixtureRoot,
    env: { ...process.env, PRP_PROJECT_ROOT: fixtureRoot, PRP_AGENT_DIR: agentDir },
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    throw new Error(`Command failed: prp ${args.join(' ')}`);
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertFileContains(file, snippets) {
  const content = fs.readFileSync(file, 'utf8');
  for (const snippet of snippets) {
    assert(content.includes(snippet), `${path.basename(file)} is missing expected snippet: ${snippet}`);
  }
}

fs.rmSync(fixtureRoot, { recursive: true, force: true });
fs.mkdirSync(fixtureRoot, { recursive: true });

try {
  run(['init', '998', 'Dashboard Contract', 'dashboard-contract', 'Fixture for dashboard parser']);
  run(['plan:add-phase', '998', 'Dashboard Fixture Phase', '--phase-id', 'phase-dashboard']);
  run(['plan:add-subtask', '998', 'phase-dashboard', 'Render CLI artifact shape', '--service', 'frontend', '--verify-type', 'manual', '--verify-command', 'Open dashboard fixture']);
  run(['update', '998', '--status', 'in_progress']);

  const spec = {
    id: '998-dashboard-contract',
    plan: readJson(path.join(taskDir, 'implementation_plan.json')),
    meta: readJson(path.join(taskDir, 'task_metadata.json')),
    logs: readJson(path.join(taskDir, 'task_logs.json')),
    requirements: readJson(path.join(taskDir, 'requirements.json')),
    context: readJson(path.join(taskDir, 'context.json')),
    complexity: readJson(path.join(taskDir, 'complexity_assessment.json'))
  };

  assert(normalizeStatus(spec) === 'in-progress', 'Dashboard status normalization did not match PRP CLI status.');
  assert(Array.isArray(spec.plan.phases) && spec.plan.phases.length === 1, 'Dashboard fixture plan has no phase.');
  assert(spec.plan.phases[0].subtasks.length === 1, 'Dashboard fixture plan has no subtask.');
  assert(spec.plan.phases[0].subtasks[0].files_to_modify.length === 0, 'Dashboard fixture subtask shape is unexpected.');
  assert(Array.isArray(spec.logs.events), 'Dashboard fixture logs events are missing.');
  assertFileContains(dashboardHtml, ['id="boardWrapper"', 'id="projectSwitcher"', 'dashboard.js']);
  assertFileContains(dashboardJs, ['function renderKanban', 'function buildCard', 'normalizeStatus']);
  assertFileContains(dashboardCss, ['.board', '.status-pill']);

  console.log('Dashboard contract validation passed.');
} finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
}
