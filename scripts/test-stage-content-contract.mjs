#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureDir = path.join(rootDir, 'devflow', 'discoveries', 'DISC-SECTION-CONTENT-TEST');
const fixturePath = path.join(fixtureDir, '00-explore.md');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runValidate() {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'validate-framework.mjs')], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

function outputOf(result) {
  return `${result.stdout || ''}\n${result.stderr || ''}`;
}

function writeArtifact(sectionBody) {
  fs.mkdirSync(fixtureDir, { recursive: true });
  fs.writeFileSync(fixturePath, `---
id: "DISC-SECTION-CONTENT-TEST-discover"
doc_type: "discovery"
artifact_language: "th"
---

# Section Content Test

## Required Finding

${sectionBody}

## Next Step

-
`, 'utf8');
}

try {
  writeArtifact('');
  const emptyRun = runValidate();
  assert(emptyRun.status !== 0, 'validation should fail when a generated artifact heading has no body');
  assert(outputOf(emptyRun).includes('has an empty section: ## Required Finding'), 'empty-section failure should name the heading');

  writeArtifact('- [Describe the finding]');
  const placeholderRun = runValidate();
  assert(placeholderRun.status !== 0, 'validation should fail when a generated artifact retains a template placeholder');
  assert(outputOf(placeholderRun).includes('has an unresolved placeholder under ## Required Finding'), 'placeholder failure should name the heading');

  writeArtifact('-');
  const dashRun = runValidate();
  assert(dashRun.status === 0, `a single dash should be accepted for unavailable information:\n${outputOf(dashRun)}`);

  console.log('[OK] generated artifacts require content under every heading and accept "-" for no information.');
} finally {
  fs.rmSync(fixtureDir, { recursive: true, force: true });
}
