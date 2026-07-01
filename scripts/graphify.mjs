#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const uvCacheDir = path.join(projectRoot, '.workspaces', '.uv-cache');
const isWindows = process.platform === 'win32';

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    shell: false,
    env: {
      ...process.env,
      UV_CACHE_DIR: process.env.UV_CACHE_DIR || uvCacheDir,
    },
  });
}

function outputOf(result) {
  return [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
}

function hasCommand(command) {
  const checker = isWindows ? 'where.exe' : 'sh';
  const args = isWindows ? [command] : ['-c', `command -v ${command}`];
  return run(checker, args).status === 0;
}

function graphifyWorks() {
  if (!hasCommand('graphify')) return false;
  const result = run('graphify', ['--help']);
  return result.status === 0;
}

function ensureUv() {
  if (hasCommand('uv')) return;
  throw new Error('uv is required to auto-install Graphify. Install it first: winget install astral-sh.uv');
}

function installGraphify() {
  ensureUv();
  fs.mkdirSync(uvCacheDir, { recursive: true });
  console.log('Installing Graphify with uv: uv tool install --force graphifyy');
  const result = run('uv', ['tool', 'install', '--force', 'graphifyy'], { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error('Graphify installation failed.');
  }
}

function ensureGraphify() {
  if (graphifyWorks()) return;
  installGraphify();
  if (!graphifyWorks()) {
    const result = run('graphify', ['--help']);
    throw new Error(`Graphify installed, but the CLI still does not run.\n${outputOf(result)}`);
  }
}

function runGraphify(args) {
  const result = run('graphify', args.length ? args : ['--help'], { stdio: 'inherit' });
  return result.status ?? 1;
}

function isAntigravityInstall(args) {
  if (args[0] === 'antigravity' && args[1] === 'install') return true;
  return args[0] === 'install' && args.includes('--platform') && args.includes('antigravity');
}

function normalizeAntigravityWorkflow(args) {
  if (!isAntigravityInstall(args)) return;
  const unnumbered = path.join(projectRoot, '.agent', 'workflows', 'graphify.md');
  const numbered = path.join(projectRoot, '.agent', 'workflows', '60-Graphify.md');
  if (!fs.existsSync(unnumbered)) return;
  if (!fs.existsSync(numbered)) {
    fs.renameSync(unnumbered, numbered);
    console.log('Moved Graphify workflow to .agent/workflows/60-Graphify.md');
    return;
  }
  fs.unlinkSync(unnumbered);
  console.log('Removed unnumbered Graphify workflow; using .agent/workflows/60-Graphify.md');
}

function main() {
  const args = process.argv.slice(2);
  try {
    ensureGraphify();
    const status = runGraphify(args);
    if (status === 0) normalizeAntigravityWorkflow(args);
    process.exitCode = status;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
