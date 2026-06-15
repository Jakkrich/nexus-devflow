#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateProjectIndex } from './generate-project-index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const manifest = readJson('agent-bundle.manifest.json', []);
const roadmapOnly = args.has('--roadmap-only');
const roadmapJsonArtifacts = [
  '.workspaces/roadmap/roadmap_discovery.json',
  '.workspaces/roadmap/roadmap.json'
];

const requiredJson = [
  '.workspaces/project_index.json',
  '.workspaces/roadmap/project_index.json'
];

const requiredPaths = [
  '.agent',
  'agent-bundle.manifest.json',
  'package.json',
  'docs/quickstart.md',
  'docs/workspace-artifacts.md',
  ...(manifest?.required_paths || [])
];

const forbiddenPaths = manifest?.forbidden_legacy_paths || [];

function fail(message, failures) {
  failures.push(message);
  console.error(`FAIL: ${message}`);
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function readJson(relativePath, failures) {
  const target = path.join(projectRoot, relativePath);
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch (error) {
    fail(`${relativePath} is not valid JSON: ${error.message}`, failures);
    return null;
  }
}

function scanForLegacyReferences(failures) {
  const excluded = new Set(['.git', 'node_modules', '.venv', 'venv', 'env']);
  const allowedLegacyMentions = new Set([
    path.normalize('scripts/activate-agent.mjs'),
    path.normalize('agent-bundle.manifest.json'),
    path.normalize('scripts/sync-agent-bundle.mjs'),
    path.normalize('scripts/validate-framework.mjs')
  ]);
  const legacyPatterns = ['.cursor', '.cursorrules'];
  const hits = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (excluded.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const relative = path.relative(projectRoot, full);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(md|json|mjs|js|py|toml|txt|yaml|yml)$/i.test(entry.name)) continue;
      if (allowedLegacyMentions.has(path.normalize(relative))) continue;
      const content = fs.readFileSync(full, 'utf8');
      for (const pattern of legacyPatterns) {
        if (content.includes(pattern)) hits.push(`${relative}: ${pattern}`);
      }
    }
  }

  walk(projectRoot);
  if (hits.length) fail(`Legacy references remain:\n  ${hits.join('\n  ')}`, failures);
  else ok('No legacy workspace or IDE-switcher references remain');
}

function validateRoadmap(failures) {
  if (!shouldValidateRoadmap()) {
    ok('Roadmap artifacts are optional for default framework validation');
    return;
  }

  const roadmap = readJson('.workspaces/roadmap/roadmap.json', failures);
  if (!roadmap) return;
  if (!Array.isArray(roadmap.phases) || roadmap.phases.length < 1) {
    fail('roadmap.json must contain at least one phase', failures);
  }
  if (!Array.isArray(roadmap.features) || roadmap.features.length < 3) {
    fail('roadmap.json must contain at least three features', failures);
    return;
  }
  const featureIds = new Set(roadmap.features.map((feature) => feature.id));
  for (const feature of roadmap.features) {
    for (const field of ['id', 'title', 'priority', 'phase_id']) {
      if (!feature[field]) fail(`Feature is missing ${field}: ${JSON.stringify(feature)}`, failures);
    }
  }
  for (const phase of roadmap.phases || []) {
    for (const id of phase.features || []) {
      if (!featureIds.has(id)) fail(`Phase ${phase.id} references missing feature ${id}`, failures);
    }
  }
  ok(`Roadmap has ${roadmap.phases.length} phases and ${roadmap.features.length} features`);
}

function shouldValidateRoadmap() {
  return roadmapOnly || roadmapJsonArtifacts.some((item) => fs.existsSync(path.join(projectRoot, item)));
}

function requiredRoadmapPaths() {
  return shouldValidateRoadmap() ? ['ROADMAP.md'] : [];
}

function validateWorkflowNumbering(failures) {
  const workflowDir = path.join(projectRoot, '.agent', 'workflows');
  if (!fs.existsSync(workflowDir)) {
    fail('Missing .agent/workflows directory', failures);
    return;
  }
  const files = fs.readdirSync(workflowDir)
    .filter((name) => name.endsWith('.md') && name !== 'README.md');
  const invalid = files.filter((name) => !/^\d{2}-[A-Za-z0-9][A-Za-z0-9-]*\.md$/.test(name));
  if (invalid.length) {
    fail(`Workflow files must start with a two-digit category number: ${invalid.join(', ')}`, failures);
  } else {
    ok(`Workflow numbering passed for ${files.length} workflow files`);
  }
}

function validateReportNamingConvention(failures) {
  const targetDirs = [
    '.workspaces/research',
    '.workspaces/reports',
    '.workspaces/debug',
    '.workspaces/prds',
    '.workspaces/issues'
  ];

  const allowedLegacyReports = new Set([
    'research/brainstorm-claude-code-goal.md',
    'research/brainstorm-date-prefixed-reports.md',
    'research/brainstorm-human-action-command-split.md',
    'research/brainstorm-markdown-first-devflow-mode.md',
    'research/brainstorm-new-system-requirements-interview-agent-skill.md',
    'research/brainstorm-soul-md.md',
    'research/brainstorm-test-first-implementation-flow.md',
    'research/brainstorm-universal-interview-skill.md',
    'research/Claude Code_goal.md',
    'research/implementation_plan_goal.md',
    'reports/project_evaluation_2026-05-21.md',
    'reports/project_evaluation_fix_report_2026-05-21.md',
    'reports/project_re_evaluation_2026-05-21.md',
    'reports/project_re_evaluation_fix_report_2026-05-21.md',
    'reports/project_re_evaluation_round3_2026-05-21.md',
    'reports/spec_orchestration-dashboard_upgrade.md',
    'prds/dashboard-upgrade.prd.md'
  ]);

  const datePrefixRegex = /^\d{4}-\d{2}-\d{2}-.*\.md$/i;
  let checkedCount = 0;
  const invalidFiles = [];

  for (const relativeDir of targetDirs) {
    const dirPath = path.join(projectRoot, relativeDir);
    if (!fs.existsSync(dirPath)) continue;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const cleanDir = relativeDir.replace('.workspaces/', '');
        const normalizedPath = `${cleanDir}/${entry.name}`;
        if (allowedLegacyReports.has(normalizedPath)) continue;

        checkedCount++;
        if (!datePrefixRegex.test(entry.name)) {
          invalidFiles.push(`${relativeDir}/${entry.name}`);
        }
      }
    }
  }

  if (invalidFiles.length > 0) {
    fail(`Report files must start with yyyy-mm-dd- prefix:\n  ${invalidFiles.join('\n  ')}`, failures);
  } else if (checkedCount > 0) {
    ok(`Report naming convention passed for ${checkedCount} files`);
  } else {
    ok('No new report files to validate');
  }
}

function main() {
  const failures = [];
  generateProjectIndex(projectRoot);
  const seenRequired = new Set();

  for (const item of [...requiredPaths, ...requiredRoadmapPaths()]) {
    if (seenRequired.has(item)) continue;
    seenRequired.add(item);
    if (!fs.existsSync(path.join(projectRoot, item))) fail(`Missing required path: ${item}`, failures);
    else ok(`Found ${item}`);
  }

  for (const item of forbiddenPaths) {
    if (fs.existsSync(path.join(projectRoot, item))) fail(`Forbidden legacy path exists: ${item}`, failures);
    else ok(`Legacy path absent: ${item}`);
  }

  for (const item of [...requiredJson, ...(shouldValidateRoadmap() ? roadmapJsonArtifacts : [])]) {
    if (!fs.existsSync(path.join(projectRoot, item))) {
      fail(`Missing JSON artifact: ${item}`, failures);
      continue;
    }
    if (readJson(item, failures)) ok(`Valid JSON: ${item}`);
  }

  validateRoadmap(failures);
  validateWorkflowNumbering(failures);
  validateReportNamingConvention(failures);
  if (!roadmapOnly) scanForLegacyReferences(failures);

  if (failures.length) {
    console.error(`\nValidation failed with ${failures.length} issue(s).`);
    process.exitCode = 1;
  } else {
    console.log('\nFramework validation passed.');
  }
}

main();

