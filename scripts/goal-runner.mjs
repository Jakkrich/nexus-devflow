#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_MAX_TURNS = 20;
const MIN_MAX_TURNS = 1;
const GOAL_SESSION_DIR = path.join('devflow', 'runs', 'goal-sessions');
const LATEST_SESSION_FILE = path.join('devflow', 'runs', 'goal_latest_session.json');
const EXECUTION_LOG_FILE = path.join('devflow', 'runs', 'goal_execution_log.json');

function findProjectRoot() {
  if (process.env.PRP_PROJECT_ROOT) return path.resolve(process.env.PRP_PROJECT_ROOT);

  let current = process.cwd();
  while (true) {
    if (
      fs.existsSync(path.join(current, '.nexus')) ||
      fs.existsSync(path.join(current, '.agents')) ||
      fs.existsSync(path.join(current, 'AGENTS.md')) ||
      fs.existsSync(path.join(current, '.agent'))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return process.cwd();
    current = parent;
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function parseArgs(args) {
  let goal = '';
  let maxTurns = DEFAULT_MAX_TURNS;
  let parallel = false;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--goal') {
      goal = args[++i] || '';
    } else if (arg === '--max-turns') {
      const parsed = Number.parseInt(args[++i], 10);
      if (!Number.isNaN(parsed) && parsed >= MIN_MAX_TURNS) {
        maxTurns = parsed;
      }
    } else if (arg === '--parallel') {
      parallel = true;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (!goal && !arg.startsWith('--')) {
      goal = arg;
    }
  }

  return { goal, maxTurns, parallel, dryRun };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'goal';
}

function classifyGoal(goal) {
  const text = goal.toLowerCase();
  if (text.includes('debug') || text.includes('fix') || text.includes('bug') || text.includes('fail') || text.includes('rca')) {
    return {
      flowName: 'RCA / Debug Flow',
      reason: 'Goal indicates defect investigation or failure remediation.',
      tasks: [
        'Reproduce failure state and record exact evidence',
        'Isolate root cause using Debug protocol before editing code',
        'Route findings to living spec /fix to own the delivery decision'
      ],
      commands: [
        '/debug {target}',
        '/fix {discovery-id or issue}',
        '/implement {running-id}'
      ]
    };
  }

  if (text.includes('security') || text.includes('audit') || text.includes('vulnerability') || text.includes('cve')) {
    return {
      flowName: 'Security & Hardening Flow',
      reason: 'Goal involves security posture, risk assessment, or vulnerability remediation.',
      tasks: [
        'Run Audit companion analysis',
        'Identify risk surface and missing controls',
        'Route actionable findings into discovery or feature stage'
      ],
      commands: [
        '/audit',
        '/discovery {goal-id}',
        '/feature {discovery-id}'
      ]
    };
  }

  return {
    flowName: 'Standard Feature Delivery Flow',
    reason: 'Goal targets feature enhancement or new capability development.',
    tasks: [
      'Framing problem, assumptions, and success criteria in Discovery',
      'Lock delivery boundary and assign running ID in Living Spec',
      'Formalize markdown-first spec and plan execution'
    ],
    commands: [
      '/discovery {goal-id}',
      '/feature {discovery-id}',
      '/implement {running-id}'
    ]
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = findProjectRoot();
  const timestamp = new Date().toISOString();
  const goalSlug = slugify(options.goal || 'unnamed-goal');
  const goalId = `GOAL-${timestamp.replace(/[:.]/g, '-').slice(0, 19)}-${goalSlug.slice(0, 20)}`;

  const classification = classifyGoal(options.goal);

  const sessionData = {
    goal_id: goalId,
    timestamp,
    goal: options.goal,
    execution_mode: 'recommendation_only',
    flow_selected: classification.flowName,
    reasoning: classification.reason,
    config: {
      max_turns: options.maxTurns,
      parallel_enabled: options.parallel,
      dry_run: options.dryRun
    },
    tasks_decomposed: classification.tasks,
    recommended_commands: classification.commands,
    context_usage: {
      token_usage: {
        tracking_mode: 'manual_optional',
        total_tokens_estimated: null
      },
      files_read: ['AGENTS.md'],
      optimization_notes: [
        'Used lightweight goal classifier without mutating code.',
        'Preserved markdown-first contract under devflow/runs/.'
      ]
    },
    metrics: {
      total_turns: 1,
      max_turn_budget: options.maxTurns
    }
  };

  const sessionFile = path.join(root, GOAL_SESSION_DIR, `${goalId}.json`);
  const latestFile = path.join(root, LATEST_SESSION_FILE);
  const logFile = path.join(root, EXECUTION_LOG_FILE);

  writeJson(sessionFile, sessionData);
  writeJson(latestFile, sessionData);
  writeJson(logFile, sessionData);

  console.log(`[Goal Runner] Session recorded: ${goalId}`);
  console.log(`[Goal Runner] Flow: ${classification.flowName}`);
  console.log(`[Goal Runner] Recommended Entry: ${classification.commands[0]}`);
}

main().catch((err) => {
  console.error('[Goal Runner Error]:', err.message);
  process.exit(1);
});
