#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const cli = path.join(projectRoot, '.agent', 'scripts', 'prp.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wiki-contract-test-'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

assert(exists('.agent/resources/schemas/wiki_project_index.template.md'), 'project wiki index template should exist');
assert(exists('.agent/resources/schemas/wiki_page.template.md'), 'wiki page template should exist');
assert(exists('.agent/skills/devflow-wiki/SKILL.md'), 'devflow-wiki skill should exist');

fs.mkdirSync(path.join(tempRoot, '.agent'), { recursive: true });

execFileSync(process.execPath, [cli, 'wiki:init', 'project'], {
  cwd: tempRoot,
  env: { ...process.env, PRP_AGENT_DIR: path.join(projectRoot, '.agent') },
  stdio: 'pipe',
});

const projectWiki = path.join(tempRoot, '.workspaces', 'wiki', 'project');
const expectedDirs = ['architecture', 'decisions', 'domain', 'gotchas', 'patterns', 'tasks', 'token-context', '_drafts'];
for (const dir of expectedDirs) {
  assert(fs.existsSync(path.join(projectWiki, dir)), `project wiki should create ${dir}`);
}

const indexPath = path.join(projectWiki, 'index.md');
assert(fs.existsSync(indexPath), 'project wiki should create index.md');
const index = read(indexPath);
assert(index.includes('## Sources'), 'project wiki index should include Sources');
assert(index.includes('[[architecture/overview]]'), 'project wiki index should link architecture overview');

execFileSync(process.execPath, [cli, 'wiki:lint', 'project'], {
  cwd: tempRoot,
  env: { ...process.env, PRP_AGENT_DIR: path.join(projectRoot, '.agent') },
  stdio: 'pipe',
});

const badPage = path.join(projectWiki, 'patterns', 'missing-sources.md');
fs.writeFileSync(badPage, '# Missing Sources\n\nNo source section here.\n', 'utf8');
const badLint = spawnSync(process.execPath, [cli, 'wiki:lint', 'project'], {
  cwd: tempRoot,
  env: { ...process.env, PRP_AGENT_DIR: path.join(projectRoot, '.agent') },
  encoding: 'utf8',
});
assert(badLint.status !== 0, 'wiki lint should fail when a page is missing Sources');
assert(badLint.stderr.includes('missing ## Sources') || badLint.stdout.includes('missing ## Sources'), 'wiki lint should report missing Sources');

console.log('wiki contract tests passed');
