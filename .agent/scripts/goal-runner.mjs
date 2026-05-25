#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_MAX_TURNS = 20;
const MIN_MAX_TURNS = 1;
const GOAL_SESSION_DIR = path.join('.workspaces', 'specs', 'goal-sessions');
const LATEST_SESSION_FILE = path.join('.workspaces', 'specs', 'goal_latest_session.json');
const EXECUTION_LOG_FILE = path.join('.workspaces', 'specs', 'goal_execution_log.json');

function findProjectRoot() {
  if (process.env.PRP_PROJECT_ROOT) return path.resolve(process.env.PRP_PROJECT_ROOT);

  let current = process.cwd();
  while (true) {
    if (fs.existsSync(path.join(current, '.agent'))) return current;
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

function parseArgs(argv) {
  const config = {
    goal: '',
    maxTurns: DEFAULT_MAX_TURNS,
    parallel: false,
    dryRun: false,
    flow: '',
    json: false,
  };
  const positional = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--') {
      continue;
    } else if (arg === '--help' || arg === '-h' || arg === 'help') {
      config.help = true;
    } else if (arg === '--goal' || arg === '-g' || arg === 'goal') {
      config.goal = argv[++index] || '';
    } else if (arg.startsWith('--goal=')) {
      config.goal = arg.slice('--goal='.length);
    } else if (arg === '--max-turns' || arg === 'max-turns') {
      config.maxTurns = Number.parseInt(argv[++index] || '', 10);
    } else if (arg.startsWith('--max-turns=')) {
      config.maxTurns = Number.parseInt(arg.slice('--max-turns='.length), 10);
    } else if (arg === '--parallel' || arg === 'parallel') {
      config.parallel = true;
    } else if (arg === '--dry-run' || arg === 'dry-run') {
      config.dryRun = true;
    } else if (arg === '--json' || arg === 'json') {
      config.json = true;
    } else if (arg === '--flow' || arg === 'flow') {
      config.flow = argv[++index] || '';
    } else if (arg.startsWith('--flow=')) {
      config.flow = arg.slice('--flow='.length);
    } else {
      positional.push(arg);
    }
  }

  if (!config.goal && positional.length) config.goal = positional.join(' ');
  if (!Number.isInteger(config.maxTurns) || config.maxTurns < MIN_MAX_TURNS) {
    throw new Error(`--max-turns must be an integer greater than or equal to ${MIN_MAX_TURNS}`);
  }

  return config;
}

function usage() {
  return [
    'Usage:',
    '  npm run goal -- --goal "Implement goal command" --max-turns 30 --parallel',
    '  npm run goal -- goal "Implement goal command" max-turns 30 parallel',
    '  node .agent/scripts/goal-runner.mjs --goal "Implement goal command" --max-turns 30 --parallel',
    '',
    'Options:',
    '  --goal, -g       Goal description to route and track',
    '  --max-turns     Maximum Boss/Worker turns (default: 20)',
    '  --parallel      Allow parallel worker grouping in the session plan',
    '  --flow          Override automatic flow routing',
    '  --dry-run       Mark the session as planned instead of ready for execution',
    '  --json          Print the full session JSON',
  ].join('\n');
}

function slugify(value) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || 'goal';
}

function makeGoalId(now, goal) {
  const stamp = now.toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
  return `goal-${stamp}-${slugify(goal).slice(0, 24)}`;
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function routeGoal(goal, override = '') {
  if (override) {
    return {
      flow: override,
      reason: 'Flow was provided explicitly with --flow.',
      nextCommands: flowCommands(override),
    };
  }

  const text = goal.toLowerCase();
  if (includesAny(text, ['brainstorm', 'ideate', 'options', 'explore ideas'])) {
    return {
      flow: 'Brainstorm Flow',
      reason: 'Goal asks for idea exploration before committing to a task.',
      nextCommands: ['/10-Brainstorm "{goal}"'],
    };
  }

  if (includesAny(text, ['prd', 'requirements', 'product requirement', 'spec', 'user story'])) {
    return {
      flow: 'PRD / Spec Flow',
      reason: 'Goal is requirements-heavy and should produce a spec before implementation.',
      nextCommands: ['/12-PRD "{goal}"', '/18-Spec-Orchestrate {ID}'],
    };
  }

  if (includesAny(text, ['debug', 'root cause', 'rca', 'regression', 'error', 'failing', 'crash'])) {
    return {
      flow: 'RCA / Debug Flow',
      reason: 'Goal describes a failure or investigation path.',
      nextCommands: ['/20-Debug "{goal}"'],
    };
  }

  return {
    flow: 'DevFlow Task Execution',
    reason: 'Goal appears actionable as a standard task that can move through Task -> Plan -> Code -> Verify.',
    nextCommands: ['/30-Task {next_id} "{goal}"', '/31-Plan {ID}', '/32-Code {ID}', '/33-Verify {ID}'],
  };
}

function flowCommands(flow) {
  const normalized = flow.toLowerCase();
  if (normalized.includes('brainstorm')) return ['/10-Brainstorm "{goal}"'];
  if (normalized.includes('prd') || normalized.includes('spec')) return ['/12-PRD "{goal}"'];
  if (normalized.includes('debug') || normalized.includes('rca')) return ['/20-Debug "{goal}"'];
  return ['/30-Task {next_id} "{goal}"', '/31-Plan {ID}', '/32-Code {ID}', '/33-Verify {ID}'];
}

function estimateComplexity(goal) {
  const words = goal.trim().split(/\s+/).filter(Boolean).length;
  const text = goal.toLowerCase();
  const complexSignals = ['multi', 'parallel', 'architecture', 'migration', 'end-to-end', 'full', 'system', 'workflow'];
  const standardSignals = ['implement', 'add', 'fix', 'refactor', 'test', 'docs', 'cli'];

  if (words > 28 || includesAny(text, complexSignals)) return 'complex';
  if (words > 10 || includesAny(text, standardSignals)) return 'standard';
  return 'simple';
}

function decomposeGoal(goal, flow, parallel, complexity) {
  if (flow === 'Brainstorm Flow') {
    return [
      makeTask('001', 'capture-problem-space', 'Capture the goal, assumptions, constraints, and success criteria.', 1),
      makeTask('002', 'generate-options', 'Generate implementation or product options with tradeoffs.', parallel ? 1 : 2),
      makeTask('003', 'recommend-path', 'Select the strongest option and list next DevFlow commands.', parallel ? 2 : 3),
    ];
  }

  if (flow === 'PRD / Spec Flow') {
    return [
      makeTask('001', 'draft-prd-or-spec', 'Create the product or requirements artifact from the goal.', 1),
      makeTask('002', 'review-acceptance-criteria', 'Tighten acceptance criteria, constraints, and non-goals.', 2),
      makeTask('003', 'prepare-task-handoff', 'Prepare the next task creation or planning command.', 3),
    ];
  }

  if (flow === 'RCA / Debug Flow') {
    return [
      makeTask('001', 'reproduce-or-characterize-failure', 'Collect symptoms, logs, reproduction steps, and suspected blast radius.', 1),
      makeTask('002', 'isolate-root-cause', 'Trace the failure to code, configuration, data, or environment.', 2),
      makeTask('003', 'fix-and-verify', 'Apply the fix and run targeted verification.', 3),
    ];
  }

  if (complexity === 'complex') {
    return [
      makeTask('001', 'create-task-spec', 'Create the task workspace and spec artifacts.', 1),
      makeTask('002', 'plan-implementation', 'Build an implementation plan from codebase context.', 2),
      makeTask('003', 'implement-worker-scope-a', 'Implement the first independent work package.', parallel ? 3 : 3),
      makeTask('004', 'implement-worker-scope-b', 'Implement the second independent work package if file ownership is clear.', parallel ? 3 : 4),
      makeTask('005', 'verify-and-synthesize', 'Run validation, review outputs, and summarize the result.', parallel ? 4 : 5),
    ];
  }

  return [
    makeTask('001', 'create-task-spec', 'Create or update the task specification and JSON artifacts.', 1),
    makeTask('002', 'plan-and-implement', 'Plan the implementation, make the focused change, and track subtask status.', 2),
    makeTask('003', 'verify-result', 'Run validation and produce the QA summary.', 3),
  ];
}

function makeTask(taskId, slug, description, parallelGroup) {
  return {
    task_id: taskId,
    slug,
    description,
    status: 'planned',
    parallel_group: parallelGroup,
  };
}

function makeStep(stepIndex, phase, actor, message, timestamp) {
  return { step_index: stepIndex, phase, actor, message, timestamp };
}

function makeContextUsageNotes() {
  return {
    tracking_mode: 'manual_optional',
    context_loaded: [],
    files_read: [],
    artifacts_read: [],
    token_usage: {
      tracking_mode: 'manual_optional',
      input_tokens: null,
      output_tokens: null,
      cached_tokens: null,
      total_tokens: null,
      source: 'not_recorded',
    },
    optimization_notes: [
      'Fill these notes after execution when a session loads more context than expected or token usage is available from the runtime.',
    ],
  };
}

function replaceGoal(command, goal) {
  return command.replaceAll('{goal}', goal.replaceAll('"', '\\"'));
}

function buildSession(config) {
  const start = new Date();
  const goalId = makeGoalId(start, config.goal);
  const route = routeGoal(config.goal, config.flow);
  const complexity = estimateComplexity(config.goal);
  const tasks = decomposeGoal(config.goal, route.flow, config.parallel, complexity);
  const totalTurns = Math.min(config.maxTurns, 1 + tasks.length + 2);
  const turnsByPhase = {
    routing: 1,
    decomposition: 1,
    worker_planning: Math.max(tasks.length - 1, 1),
    validation: 1,
    synthesis: 1,
  };
  const end = new Date(start.getTime() + 4000);
  const timestamps = {
    start: start.toISOString(),
    route: new Date(start.getTime() + 1000).toISOString(),
    decompose: new Date(start.getTime() + 2000).toISOString(),
    validate: new Date(start.getTime() + 3000).toISOString(),
    end: end.toISOString(),
  };

  const recommendedCommands = route.nextCommands.map((command) => replaceGoal(command, config.goal));

  return {
    goal_id: goalId,
    goal_description: config.goal,
    status: config.dryRun ? 'planned' : 'ready',
    execution_mode: 'recommendation_only',
    config: {
      max_turns: config.maxTurns,
      default_turns: DEFAULT_MAX_TURNS,
      parallel_enabled: config.parallel,
      dry_run: config.dryRun,
    },
    metrics: {
      start_time: timestamps.start,
      end_time: timestamps.end,
      duration_seconds: Math.max(0, Math.round((end.getTime() - start.getTime()) / 1000)),
      total_turns: totalTurns,
      turns_by_phase: turnsByPhase,
    },
    context_usage: makeContextUsageNotes(),
    flow_selected: route.flow,
    routing_reason: route.reason,
    complexity,
    tasks_decomposed: tasks,
    execution_steps: [
      makeStep(1, 'routing', 'Boss', `Selected ${route.flow}. ${route.reason}`, timestamps.route),
      makeStep(2, 'decomposition', 'Boss', `Estimated ${complexity} complexity and prepared ${tasks.length} worker task(s).`, timestamps.decompose),
      makeStep(3, 'validation', 'Boss', 'Prepared session log and recommended DevFlow command sequence.', timestamps.validate),
      makeStep(4, 'synthesis', 'Boss', 'Goal route is ready for human or agent execution of the recommended commands.', timestamps.end),
    ],
    recommended_commands: recommendedCommands,
  };
}

function printSummary(session, sessionPath) {
  console.log('Goal Router');
  console.log(`Goal ID: ${session.goal_id}`);
  console.log(`Flow: ${session.flow_selected}`);
  console.log(`Status: ${session.status}`);
  console.log(`Execution mode: ${session.execution_mode}`);
  console.log(`Complexity: ${session.complexity}`);
  console.log(`Tasks: ${session.tasks_decomposed.length}`);
  console.log(`Session log: ${sessionPath}`);
  console.log('');
  console.log('Recommended commands:');
  for (const command of session.recommended_commands) {
    console.log(`- ${command}`);
  }
}

function main() {
  const config = parseArgs(process.argv.slice(2));
  if (config.help) {
    console.log(usage());
    return;
  }
  if (!config.goal.trim()) {
    console.error('Error: --goal is required.');
    console.error('');
    console.error(usage());
    process.exitCode = 1;
    return;
  }

  const projectRoot = findProjectRoot();
  const session = buildSession(config);
  const sessionPath = path.join(projectRoot, GOAL_SESSION_DIR, `session-${session.goal_id}.json`);
  const latestPath = path.join(projectRoot, LATEST_SESSION_FILE);
  const executionLogPath = path.join(projectRoot, EXECUTION_LOG_FILE);

  writeJson(sessionPath, session);
  writeJson(latestPath, session);
  writeJson(executionLogPath, session);

  if (config.json) {
    console.log(JSON.stringify(session, null, 2));
  } else {
    printSummary(session, path.relative(projectRoot, sessionPath));
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
