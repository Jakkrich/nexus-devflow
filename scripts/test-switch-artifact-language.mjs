#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-artifact-language-'));
const schemasDir = path.join(scratchRoot, 'schemas');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function run(args) {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'switch-artifact-language.mjs'), ...args], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

try {
  writeFile(path.join(schemasDir, 'discover.template.md'), `---
id: "sample"
artifact_language: "en"
status: "draft"
---
`);
  writeFile(path.join(schemasDir, 'verify.template.md'), `---
id: "sample"
artifact_language: "en"
status: "draft"
---
`);

  const toThai = run(['th', '--schemas-dir', schemasDir]);
  assert(toThai.status === 0, `switch to th should pass:\n${toThai.stdout}\n${toThai.stderr}`);
  assert(fs.readFileSync(path.join(schemasDir, 'discover.template.md'), 'utf8').includes('artifact_language: "th"'), 'discover template should switch to th');
  assert(fs.readFileSync(path.join(schemasDir, 'verify.template.md'), 'utf8').includes('artifact_language: "th"'), 'verify template should switch to th');

  const toEnglish = run(['en', '--schemas-dir', schemasDir]);
  assert(toEnglish.status === 0, `switch to en should pass:\n${toEnglish.stdout}\n${toEnglish.stderr}`);
  assert(fs.readFileSync(path.join(schemasDir, 'discover.template.md'), 'utf8').includes('artifact_language: "en"'), 'discover template should switch back to en');

  const invalidLanguage = run(['jp', '--schemas-dir', schemasDir]);
  assert(invalidLanguage.status !== 0, 'invalid language should fail');

  writeFile(path.join(schemasDir, 'broken.template.md'), `---
id: "broken"
status: "draft"
---
`);
  const missingField = run(['th', '--schemas-dir', schemasDir]);
  assert(missingField.status !== 0, 'missing artifact_language should fail');
  assert(missingField.stderr.includes('missing artifact_language'), 'missing field failure should mention artifact_language');

  console.log('[OK] switch-artifact-language updates template artifact_language fields safely.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
