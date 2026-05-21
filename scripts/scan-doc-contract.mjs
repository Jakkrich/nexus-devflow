#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const targets = [
  'README.md',
  'USAGE.md',
  'docs',
  '.agent/agents',
  '.agent/resources/schemas',
  '.agent/scripts/README.md',
  '.agent/workflows'
];

const allowedFiles = new Set([
  path.normalize('.agent/docs/npm-framework-setup.md'),
  path.normalize('.agent/package.json')
]);

const forbiddenPatterns = [
  {
    pattern: /\bnpx\s+agent-flow\b/,
    message: 'Use repo-mode command examples (`npm.cmd run agent -- ...`) in canonical docs.'
  },
  {
    pattern: /\bnpm\.cmd\s+run\s+validate\s+\d+\b/,
    message: 'Task validation must use `npm.cmd run agent -- validate {ID}`.'
  }
];

function walk(target, files = []) {
  const full = path.join(projectRoot, target);
  if (!fs.existsSync(full)) return files;
  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      walk(path.join(target, entry.name), files);
    }
    return files;
  }
  if (/\.(md|json|mjs|js|txt)$/i.test(target)) files.push(path.normalize(target));
  return files;
}

const files = [...new Set(targets.flatMap((target) => walk(target)))];
const hits = [];

for (const file of files) {
  if (allowedFiles.has(file)) continue;
  const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of forbiddenPatterns) {
      if (rule.pattern.test(line)) {
        hits.push(`${file}:${index + 1}: ${rule.message}`);
      }
    }
  });
}

if (hits.length) {
  console.error('Documentation contract drift found:');
  for (const hit of hits) console.error(`- ${hit}`);
  process.exitCode = 1;
} else {
  console.log('Documentation contract scan passed.');
}
