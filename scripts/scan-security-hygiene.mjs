#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const excludedDirs = new Set([
  '.git',
  'node_modules',
  '.test-workspace-node',
  '.local-tools',
  '.specify',
  '.venv',
  'venv',
  'env',
  '.uv_cache',
  '.pytest_cache',
  'model_cache',
  'rag_storage',
  'tests',
  'docs'
]);
const allowedFiles = new Set([
  path.normalize('scripts/scan-security-hygiene.mjs'),
  path.normalize('README.md'),
  path.normalize('README_zh.md')
]);

const rules = [
  { name: 'OpenAI key', pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: 'AWS access key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Private key block', pattern: /BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY/ },
  { name: 'Likely assigned secret', pattern: /\b(password|secret|token|api[_-]?key)\s*[:=]\s*["'][^"']{8,}["']/i },
  { name: 'Destructive git reset', pattern: /\bgit\s+reset\s+--hard\b/i },
  { name: 'Force remove command', pattern: /\brm\s+-rf\b/i }
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excludedDirs.has(entry.name)) walk(path.join(dir, entry.name), files);
      continue;
    }
    if (!/\.(md|json|mjs|js|py|ps1|sh|txt|yaml|yml|toml)$/i.test(entry.name)) continue;
    files.push(path.join(dir, entry.name));
  }
  return files;
}

const hits = [];

for (const file of walk(projectRoot)) {
  const relative = path.normalize(path.relative(projectRoot, file));
  if (allowedFiles.has(relative)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) hits.push(`${relative}:${index + 1}: ${rule.name}`);
    }
  });
}

if (hits.length) {
  console.error('Security hygiene scan found review items:');
  for (const hit of hits) console.error(`- ${hit}`);
  process.exitCode = 1;
} else {
  console.log('Security hygiene scan passed.');
}
