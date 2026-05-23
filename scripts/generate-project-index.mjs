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
    workflows: 'Numbered Antigravity workflow prompts',
    docs: 'Framework documentation',
    resources: 'Schemas and templates for structured workflow artifacts',
    rules: 'Agent rules and coding guidance',
    scripts: 'CLI, task tooling, validation, status, preview, and session helpers',
    skills: 'Reusable knowledge and automation skills',
    'dashboard/html': 'Static dashboard UI assets'
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
    framework: 'Antigravity .agent bundle with Node.js ESM CLI and numbered Markdown workflows',
    type: 'library',
    package_manager: 'npm',
    entry_point: pkg.bin?.prp || './scripts/prp.mjs',
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
        '.workspaces': {
          path: '.workspaces',
          purpose: 'Canonical generated project, task, research, roadmap, PRD, debug, report, wiki, and lesson artifacts'
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
        'Antigravity IDE .agent workflows'
      ],
      dev_dependencies: [],
      testing: 'npm run validate',
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
      artifact_format: 'JSON and Markdown',
      agent_bundle: '.agent',
      primary_ide: 'Antigravity',
      workspace_directory: '.workspaces',
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
    path.join(projectRoot, '.workspaces', 'project_index.json'),
    path.join(projectRoot, '.workspaces', 'roadmap', 'project_index.json')
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


