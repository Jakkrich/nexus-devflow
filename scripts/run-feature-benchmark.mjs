#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const feature = slugify(args.feature || args.f || 'devflow-feature');
const baselinePath = args.baseline ? path.resolve(rootDir, args.baseline) : null;
const outDir = path.join(rootDir, '.workspaces', 'benchmarks');
const stamp = new Date().toISOString().slice(0, 10);
const outputBase = path.join(outDir, `${stamp}-${feature}.benchmark`);

const commands = [
  { name: 'validate', command: process.platform === 'win32' ? 'npm.cmd' : 'npm', args: ['run', 'validate'] }
];

if (hasPackageScript('validate:skills:test')) {
  commands.push({
    name: 'validate:skills:test',
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'validate:skills:test']
  });
}

const result = {
  feature,
  created_at: new Date().toISOString(),
  git_commit: git(['rev-parse', '--short', 'HEAD']) || 'unknown',
  baseline: baselinePath ? path.relative(rootDir, baselinePath) : null,
  commands: commands.map(runCommand),
  repository_metrics: collectRepositoryMetrics(),
  human_scores: {
    routing_quality: 3,
    stage_ownership: 3,
    artifact_completeness: 3,
    validation_coverage: 3,
    operator_clarity: 3,
    regression_risk: 3
  },
  notes: [
    'Automated benchmark captures command evidence and repository metrics.',
    'Update human_scores after running a real scenario with docs/feature-benchmark-scorecard.md.'
  ]
};

result.status = result.commands.every((item) => item.status === 'pass') ? 'pass' : 'fail';
result.comparison = baselinePath && fs.existsSync(baselinePath)
  ? compareWithBaseline(result, JSON.parse(fs.readFileSync(baselinePath, 'utf8')))
  : null;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(`${outputBase}.json`, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
fs.writeFileSync(`${outputBase}.md`, renderMarkdown(result), 'utf8');

console.log(`Benchmark status: ${result.status}`);
console.log(`Wrote ${path.relative(rootDir, `${outputBase}.md`)}`);
console.log(`Wrote ${path.relative(rootDir, `${outputBase}.json`)}`);

if (result.status !== 'pass') {
  process.exitCode = 1;
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = rawArgs[i + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i++;
    }
  }
  return parsed;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'devflow-feature';
}

function hasPackageScript(name) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  return Boolean(packageJson.scripts?.[name]);
}

function runCommand(commandSpec) {
  const start = performance.now();
  const spawned = commandForPlatform(commandSpec);
  const run = spawnSync(spawned.command, spawned.args, {
    cwd: rootDir,
    encoding: 'utf8',
    shell: false
  });
  const durationMs = Math.round(performance.now() - start);

  return {
    name: commandSpec.name,
    command: [commandSpec.command, ...commandSpec.args].join(' '),
    status: run.status === 0 ? 'pass' : 'fail',
    exit_code: run.status,
    duration_ms: durationMs,
    stdout_tail: tail(run.stdout),
    stderr_tail: tail(run.stderr)
  };
}

function commandForPlatform(commandSpec) {
  if (process.platform !== 'win32') return commandSpec;

  const commandLine = [commandSpec.command, ...commandSpec.args]
    .map(windowsShellQuote)
    .join(' ');
  return {
    command: 'cmd.exe',
    args: ['/d', '/s', '/c', commandLine]
  };
}

function windowsShellQuote(value) {
  const stringValue = String(value);
  if (/^[A-Za-z0-9_:./\\-]+$/.test(stringValue)) return stringValue;
  return `"${stringValue.replace(/"/g, '\\"')}"`;
}

function tail(value, maxLines = 20) {
  return String(value || '')
    .trim()
    .split(/\r?\n/)
    .slice(-maxLines)
    .join('\n');
}

function git(gitArgs) {
  const run = spawnSync('git', gitArgs, {
    cwd: rootDir,
    encoding: 'utf8',
    shell: false
  });
  return run.status === 0 ? run.stdout.trim() : null;
}

function collectRepositoryMetrics() {
  return {
    workflow_count: countFiles('.agent/workflows', '.md'),
    skill_count: countSkillFiles(),
    schema_template_count: countFiles('.agent/resources/schemas', '.template.md'),
    public_companion_count: countPublicCompanions(),
    validation_script_count: countFiles('scripts', '.mjs')
  };
}

function countFiles(relativeDir, suffix) {
  const dir = path.join(rootDir, relativeDir);
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(suffix)).length;
}

function countSkillFiles() {
  const skillRoot = path.join(rootDir, '.agent', 'skills');
  if (!fs.existsSync(skillRoot)) return 0;
  return fs.readdirSync(skillRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillRoot, entry.name, 'SKILL.md'))).length;
}

function countPublicCompanions() {
  const agents = fs.readFileSync(path.join(rootDir, 'AGENTS.md'), 'utf8');
  const section = agents.split('## Public Companion Commands')[1]?.split('## Internal Companion Surfaces')[0] || '';
  return [...section.matchAll(/^\| `[^`]+` \|/gm)].length;
}

function compareWithBaseline(current, baseline) {
  const comparison = {
    command_duration_delta_ms: {},
    repository_metric_delta: {}
  };

  for (const command of current.commands) {
    const baselineCommand = baseline.commands?.find((item) => item.name === command.name);
    if (!baselineCommand) continue;
    comparison.command_duration_delta_ms[command.name] = command.duration_ms - baselineCommand.duration_ms;
  }

  for (const [key, value] of Object.entries(current.repository_metrics)) {
    const baselineValue = baseline.repository_metrics?.[key];
    if (typeof baselineValue === 'number') {
      comparison.repository_metric_delta[key] = value - baselineValue;
    }
  }

  return comparison;
}

function renderMarkdown(data) {
  const commandRows = data.commands
    .map((item) => `| \`${item.command}\` | ${item.status} | ${item.duration_ms} | ${item.exit_code} |`)
    .join('\n');
  const metricRows = Object.entries(data.repository_metrics)
    .map(([key, value]) => `| ${key} | ${value} |`)
    .join('\n');
  const scoreRows = Object.entries(data.human_scores)
    .map(([key, value]) => `| ${key} | ${value} | Update after scenario review |`)
    .join('\n');
  const comparisonBlock = data.comparison
    ? `\n## 6. Baseline Comparison\n\n\`\`\`json\n${JSON.stringify(data.comparison, null, 2)}\n\`\`\`\n`
    : '\n## 6. Baseline Comparison\n\nNo baseline provided. Treat this run as the baseline for this feature family.\n';

  return `# Feature Benchmark: ${data.feature}

## 1. Summary

- Feature: \`${data.feature}\`
- Status: \`${data.status}\`
- Commit: \`${data.git_commit}\`
- Created: ${data.created_at}
- Baseline: ${data.baseline || 'none'}

## 2. Command Evidence

| Command | Status | Duration Ms | Exit Code |
| :--- | :--- | ---: | ---: |
${commandRows}

## 3. Repository Metrics

| Metric | Current |
| :--- | ---: |
${metricRows}

## 4. Human Scorecard

| Dimension | Score 1-5 | Evidence |
| :--- | ---: | :--- |
${scoreRows}

## 5. Notes

${data.notes.map((note) => `- ${note}`).join('\n')}
${comparisonBlock}
## 7. Verdict

- ${data.status === 'pass' ? 'Benchmark command layer passed.' : 'Benchmark command layer failed.'}

## 8. Additional Notes

- Use docs/feature-benchmark-scorecard.md to complete the human scenario review.
`;
}
