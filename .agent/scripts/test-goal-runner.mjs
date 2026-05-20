#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runner = path.join(__dirname, 'goal-runner.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-runner-test-'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

fs.mkdirSync(path.join(tempRoot, '.agent'), { recursive: true });

execFileSync(process.execPath, [
  runner,
  '--goal',
  'Debug failing login regression',
  '--max-turns',
  '15',
  '--parallel',
  '--dry-run',
], {
  cwd: tempRoot,
  stdio: 'pipe',
});

const latest = readJson(path.join(tempRoot, '.workspaces', 'specs', 'goal_latest_session.json'));
const executionLog = readJson(path.join(tempRoot, '.workspaces', 'specs', 'goal_execution_log.json'));

assert(latest.goal_id === executionLog.goal_id, 'latest session and execution log should match');
assert(latest.flow_selected === 'RCA / Debug Flow', 'debug goal should route to RCA / Debug Flow');
assert(latest.config.max_turns === 15, 'max turn config should be recorded');
assert(latest.config.parallel_enabled === true, 'parallel config should be recorded');
assert(latest.metrics.total_turns <= 15, 'total turns should respect max turn budget');
assert(Array.isArray(latest.tasks_decomposed) && latest.tasks_decomposed.length === 3, 'debug flow should create three tasks');
assert(Array.isArray(latest.recommended_commands) && latest.recommended_commands[0].startsWith('/20-Debug'), 'debug flow should recommend /20-Debug');

console.log('goal-runner tests passed');
