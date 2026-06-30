#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runDir = path.join(rootDir, '.workspaces', 'specs', '998-checklist-validation-test');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFile(filePath, content = 'sample\n') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function runValidate() {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'validate-framework.mjs')], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

function assertTemplateUsesChecklistMarkers(relativePath) {
  const content = fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
  assert(
    /(^|\n)- \[[ xX\/~!\-]\] /m.test(content),
    `${relativePath} should seed checklist items with markdown checkbox markers`
  );
}

function assertTemplateIncludes(relativePath, fragments) {
  const content = fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
  for (const fragment of fragments) {
    assert(content.includes(fragment), `${relativePath} should include "${fragment}"`);
  }
}

try {
  fs.rmSync(runDir, { recursive: true, force: true });

  assertTemplateUsesChecklistMarkers('.agent/resources/schemas/implementation_checklist.template.md');
  assertTemplateUsesChecklistMarkers('.agent/resources/schemas/verification_checklist.template.md');
  assertTemplateIncludes('.agent/resources/schemas/implementation_checklist.template.md', [
    '## 5. Manual Review Snapshot',
    'Approval status:',
    'Next Allowed Command'
  ]);
  assertTemplateIncludes('.agent/resources/schemas/verification_checklist.template.md', [
    '**Approval Status**:',
    '**Next Allowed Command**:',
    '**Soft-Gate Warning**:'
  ]);
  assertTemplateIncludes('.agent/resources/schemas/report.template.md', [
    '## 8. Manual Review And Gate Summary',
    'manual review and gate summary'
  ]);

  writeFile(path.join(runDir, '30-plan.md'));
  writeFile(path.join(runDir, '40-implement.md'));
  writeFile(path.join(runDir, '50-verify.md'));
  writeFile(path.join(runDir, '60-report.md'));
  writeFile(path.join(runDir, '60-report.html'), '<html></html>\n');
  writeFile(path.join(runDir, 'checklists', 'implementation-checklist.md'), `| ID | Unit | Plan Phase | Status |\n| :--- | :--- | :--- | :--- |\n| I1 | Work unit | Phase 1 | blocked |\n`);
  writeFile(path.join(runDir, 'checklists', 'verification-checklist.md'), `- [x] Verify completed integration path\n- [!] Investigate flaky preview gate\n- [-] Skip release smoke on sandbox only run\n`);

  const okRun = runValidate();
  assert(okRun.status === 0, `valid checklist workspace should pass:\n${okRun.stdout}\n${okRun.stderr}`);

  fs.rmSync(path.join(runDir, '60-report.html'));
  const missingHtmlRun = runValidate();
  assert(missingHtmlRun.status !== 0, 'missing 60-report.html should fail validation');
  assert(missingHtmlRun.stderr.includes('60-report.md exists but 60-report.html is missing'), 'missing html error should mention report html requirement');

  writeFile(path.join(runDir, '60-report.html'), '<html></html>\n');
  writeFile(path.join(runDir, 'checklists', 'verification-checklist.md'), `- [?] Unknown marker should fail\n`);
  const badStatusRun = runValidate();
  assert(badStatusRun.status !== 0, 'invalid checklist marker should fail validation');
  assert(badStatusRun.stderr.includes('unsupported checklist marker "[?]"'), 'invalid checklist marker error should be explicit');

  console.log('[OK] validate-framework enforces checklist/report consistency and checklist status contracts.');
} finally {
  fs.rmSync(runDir, { recursive: true, force: true });
}
