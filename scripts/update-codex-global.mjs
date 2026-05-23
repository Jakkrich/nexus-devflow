#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
const skillFile = path.join(codexHome, 'skills', 'nexus-devflow', 'SKILL.md');
const manifestFile = path.join(codexHome, 'nexus-devflow.json');
const args = new Set(process.argv.slice(2));
const isWindows = process.platform === 'win32';
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));

function commandName(command) {
  if (isWindows && command === 'npm') return 'npm.cmd';
  return command;
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(commandName(command), commandArgs, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    shell: false
  });
  return result;
}

function text(result) {
  return [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
}

function assertOk(result, label) {
  if (result.status === 0) return;
  const details = text(result) || `exit status: ${result.status}; error: ${result.error?.message || 'none'}`;
  throw new Error(`${label} failed.\n${details}`);
}

function gitStatusShort() {
  const result = run('git', ['status', '--short']);
  if (result.status !== 0) return 'git status unavailable';
  return result.stdout.trim();
}

function checkGlobal() {
  const problems = [];
  if (!fs.existsSync(skillFile)) problems.push(`Missing global skill: ${skillFile}`);
  if (!fs.existsSync(manifestFile)) problems.push(`Missing manifest: ${manifestFile}`);
  if (fs.existsSync(manifestFile)) {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    if (manifest.framework_root !== projectRoot) {
      problems.push(`Manifest points to ${manifest.framework_root}, expected ${projectRoot}`);
    }
    if (manifest.version !== packageJson.version) {
      problems.push(`Installed version ${manifest.version || '<missing>'} does not match current framework version ${packageJson.version}`);
    }
  }
  assertOk(run('node', ['--check', path.join(projectRoot, 'scripts', 'install-codex-global.mjs')]), 'Installer syntax check');
  assertOk(run('node', [path.join(projectRoot, 'scripts', 'validate-framework.mjs')]), 'Framework validation');
  if (problems.length) {
    throw new Error(`Codex global install has ${problems.length} issue(s):\n- ${problems.join('\n- ')}`);
  }
  console.log('Codex global install check passed.');
  console.log(`Version: ${packageJson.version}`);
  console.log(`Skill: ${skillFile}`);
  console.log(`Manifest: ${manifestFile}`);
  const status = gitStatusShort();
  console.log(status ? `Git status:\n${status}` : 'Git status: clean');
}

function pullLatest() {
  const status = gitStatusShort();
  if (status && status !== 'git status unavailable') {
    throw new Error(`Refusing to pull with a dirty working tree. Review these files first:\n${status}`);
  }
  assertOk(run('git', ['pull', '--ff-only'], { stdio: 'inherit' }), 'git pull --ff-only');
}

function updateGlobal() {
  if (args.has('--pull')) pullLatest();
  assertOk(run('node', [path.join(projectRoot, 'scripts', 'install-codex-global.mjs')], { stdio: 'inherit' }), 'Codex global install');
  assertOk(run('node', [path.join(projectRoot, 'scripts', 'validate-framework.mjs')]), 'Framework validation');
  console.log('Codex global install updated.');
  console.log(`Skill: ${skillFile}`);
}

try {
  if (args.has('--check')) checkGlobal();
  else updateGlobal();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
