#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function exists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function ensureDir(relativePath) {
  fs.mkdirSync(path.join(projectRoot, relativePath), { recursive: true });
}

function main() {
  const problems = [];
  if (!exists('.agents')) problems.push('Missing .agents adapter');
  if (!exists('devflow/context')) problems.push('Missing devflow/context directory');

  ensureDir('devflow');
  ensureDir('devflow/discoveries');
  ensureDir('devflow/runs');

  if (problems.length) {
    console.error('Activation completed with issues:');
    for (const problem of problems) console.error(`- ${problem}`);
    process.exitCode = 1;
    return;
  }

  console.log('Nexus-DevFlow activated successfully.');
  console.log('Next: npm run check');
}

main();
