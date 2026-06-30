#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const discoverTemplate = path.join(rootDir, '.agent', 'resources', 'schemas', 'discover.template.md');
const quickstartDoc = path.join(rootDir, 'docs', 'quickstart.md');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runValidate() {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'validate-framework.mjs')], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

function combinedOutput(result) {
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
}

const originalDiscover = fs.readFileSync(discoverTemplate, 'utf8');
const originalQuickstart = fs.readFileSync(quickstartDoc, 'utf8');

try {
  const baseline = runValidate();
  assert(baseline.status === 0, `baseline validation should pass:\n${combinedOutput(baseline)}`);

  fs.writeFileSync(
    discoverTemplate,
    originalDiscover.replace('## 10. AI Actions Performed', '## 10. Work Summary'),
    'utf8'
  );
  const missingHeadingRun = runValidate();
  assert(missingHeadingRun.status !== 0, 'validation should fail when a required manual review heading is missing');
  assert(
    combinedOutput(missingHeadingRun).includes('discover.template.md is missing required heading: ## 10. AI Actions Performed'),
    'missing heading failure should name the missing manual review heading'
  );

  fs.writeFileSync(discoverTemplate, originalDiscover, 'utf8');
  fs.writeFileSync(
    quickstartDoc,
    originalQuickstart.replace(/manual review/gi, 'manual gate'),
    'utf8'
  );
  const docsSurfaceRun = runValidate();
  assert(docsSurfaceRun.status !== 0, 'validation should fail when workflow docs stop mentioning manual review');
  assert(
    combinedOutput(docsSurfaceRun).includes('docs/quickstart.md must mention manual review'),
    'docs surface failure should mention missing manual review wording'
  );

  console.log('[OK] validate-framework enforces manual review workflow contracts.');
} finally {
  fs.writeFileSync(discoverTemplate, originalDiscover, 'utf8');
  fs.writeFileSync(quickstartDoc, originalQuickstart, 'utf8');
}
