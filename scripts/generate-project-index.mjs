#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(__dirname, '..');

function exists(target) {
  return fs.existsSync(target);
}

function readJson(target) {
  return JSON.parse(fs.readFileSync(target, 'utf8'));
}

function listKeyDirectories(root, bundle) {
  const bundleRoot = path.join(root, bundle);
  const definitions = {
    agents: 'Specialist agent persona definitions',
    workflows: 'DevFlow 2.0 workflow prompts',
    docs: 'Framework documentation',
    resources: 'Markdown templates and shared delivery contracts',
    rules: 'Agent rules and coding guidance',
    scripts: 'Validation, activation, goal, preview, and session helpers',
    skills: 'Reusable knowledge and automation skills'
  };
  const result = {};
  for (const [dir, purpose] of Object.entries(definitions)) {
    if (exists(path.join(bundleRoot, dir))) result[dir] = { path: dir, purpose };
  }
  return result;
}

function buildAgentService(root) {
  const agentPackagePath = path.join(root, '.agent', 'package.json');
  const pkg = exists(agentPackagePath) ? readJson(agentPackagePath) : {};
  return {
    name: 'agent_flow',
    path: path.join(root, '.agent'),
    language: 'JavaScript and Python',
    framework: 'DevFlow 2.0 .agent bundle with stage-based markdown workflows',
    type: 'library',
    package_manager: 'npm',
    entry_point: './workflows',
    key_directories: listKeyDirectories(root, '.agent'),
    dependencies: ['Node.js >=18.17'],
    testing: 'Node.js script tests and framework validation',
    test_directory: exists(path.join(root, '.agent', 'scripts')) ? 'scripts' : undefined
  };
}

export function buildProjectIndex(projectRoot = defaultRoot) {
  const root = path.resolve(projectRoot);
  const rootPackagePath = path.join(root, 'package.json');
  const rootPkg = exists(rootPackagePath) ? readJson(rootPackagePath) : {};
  const services = {
    prps_framework: {
      name: 'prps_framework',
      path: root,
      language: 'JavaScript and Python',
      framework: 'PRPs Context Engineering Framework',
      type: 'library',
      package_manager: 'npm',
      entry_point: 'package.json',
      key_directories: {
        '.agent': {
          path: '.agent',
          purpose: 'Primary Antigravity IDE agent framework bundle'
        },
        'devflow': {
          path: 'devflow',
          purpose: 'Canonical workspace root for stage context, active runs, shared reports, and reference contracts'
        },
        'scripts': {
          path: 'scripts',
          purpose: 'Root npm automation scripts'
        },
        'docs': {
          path: 'docs',
          purpose: 'Human-readable user and maintainer guides'
        }
      },
      dependencies: [
        'Node.js >=18.17',
        'Python 3',
        'Git',
        'DevFlow-compatible agent adapters'
      ],
      dev_dependencies: [],
      testing: 'npm run check',
      test_directory: 'scripts',
      scripts: rootPkg.scripts || {}
    },
    agent_flow: buildAgentService(root)
  };

  return {
    project_root: root,
    project_type: 'single',
    services,
    infrastructure: {},
    conventions: {
      documentation: 'Markdown',
      artifact_format: 'Markdown-first',
      agent_bundle: '.agents',
      primary_ide: 'Codex',
      workspace_directory: 'devflow',
      package_manager: 'npm',
      legacy_cursor_removed: true
    },
    generated_by: 'scripts/generate-project-index.mjs',
    created_at: new Date().toISOString()
  };
}

export function generateProjectIndex(projectRoot = defaultRoot) {
  const index = buildProjectIndex(projectRoot);
  const targets = [
    path.join(projectRoot, 'devflow', 'context', 'project_index.json')
  ];
  for (const target of targets) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  }
  return index;
}

function main() {
  const index = generateProjectIndex(defaultRoot);
  console.log(`Generated project_index.json for ${index.project_root}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();


