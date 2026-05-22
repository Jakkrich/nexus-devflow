#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateProjectIndex } from './generate-project-index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function exists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function ensureDir(relativePath) {
  fs.mkdirSync(path.join(projectRoot, relativePath), { recursive: true });
}

function writeJson(relativePath, data) {
  const target = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const problems = [];
  if (!exists('.agent')) problems.push('Missing .agent bundle');
  if (!exists('.agent/package.json')) problems.push('Missing .agent/package.json');
  if (!exists('.agent/scripts/prp.mjs')) problems.push('Missing .agent/scripts/prp.mjs');
  if (exists('.cursor')) problems.push('Legacy .cursor directory is still present');
  if (exists('active-ide.py')) problems.push('Legacy active-ide.py is still present');

  ensureDir('.workspaces/roadmap');
  ensureDir('.workspaces/specs');
  ensureDir('.workspaces/issues');
  ensureDir('.workspaces/research');
  ensureDir('.workspaces/prds');
  ensureDir('.workspaces/debug');
  ensureDir('.workspaces/reports');

  const now = new Date().toISOString();
  writeJson('.workspaces/active-agent.json', {
    active_bundle: '.agent',
    primary_ide: 'Codex',
    package_manager: 'npm',
    activated_at: now,
    scripts: {
      validate: 'npm run validate',
      generate_project_index: 'npm run index',
      prp_cli: 'npm run agent -- <command>'
    }
  });

  generateProjectIndex(projectRoot);

  if (problems.length) {
    console.error('Activation completed with issues:');
    for (const problem of problems) console.error(`- ${problem}`);
    process.exitCode = 1;
    return;
  }

  console.log('Nexus-DevFlow activated for Codex .agent workflow bundle.');
  console.log('Next: npm run validate');
}

main();

