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

function writeTextIfMissing(relativePath, content) {
  const target = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!fs.existsSync(target)) fs.writeFileSync(target, content, 'utf8');
}

function initializeProjectWiki() {
  const dirs = ['architecture', 'decisions', 'domain', 'gotchas', 'patterns', 'tasks', 'token-context', '_drafts'];
  for (const dir of dirs) ensureDir(`.workspaces/wiki/project/${dir}`);
  writeTextIfMissing('.workspaces/wiki/project/index.md', `# Project Wiki

This wiki compiles reusable knowledge about the current project. It is not the source of truth.

## Start Here

- [[architecture/overview]] - system shape, modules, and data flow
- [[decisions/index]] - durable project decisions and tradeoffs
- [[domain/index]] - domain concepts and business language
- [[patterns/index]] - implementation, testing, API, and UI patterns
- [[gotchas/index]] - recurring failure modes and traps
- [[tasks/index]] - compiled task lessons
- [[token-context/index]] - context loading and token usage lessons

## Sources

- \`.agent/workflows/59-Wiki.md\`
- \`docs/workspace-artifacts.md\`
- \`.workspaces/project_index.json\`
`);
  writeTextIfMissing('.workspaces/wiki/project/architecture/overview.md', `# Architecture Overview

## Summary

Project architecture notes compiled from source artifacts.

## When To Use

- Load this page when planning or debugging project structure.

## Details

Add source-backed project details during \`/59-Wiki ingest\`.

## Related Pages

- [[../patterns/index]]

## Sources

- \`.workspaces/project_index.json\`
`);
  for (const dir of dirs.filter((name) => name !== 'architecture' && name !== '_drafts')) {
    const title = dir.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
    writeTextIfMissing(`.workspaces/wiki/project/${dir}/index.md`, `# ${title}

## Summary

${title} knowledge compiled from verified project artifacts.

## When To Use

- Load this page when this category is relevant to the current workflow.

## Details

Add source-backed project details during \`/59-Wiki ingest\`.

## Related Pages

- [[../index]]

## Sources

- \`.agent/workflows/59-Wiki.md\`
`);
  }
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
  ensureDir('.workspaces/wiki/framework');
  initializeProjectWiki();

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

