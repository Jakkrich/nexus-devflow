#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runDir = path.join(rootDir, '.workspaces', 'specs', '998-checklist-validation-test');
const planWorkflowPath = path.join(rootDir, '.agent', 'workflows', '30-Plan.md');
let originalPlanWorkflow = null;

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

try {
  fs.rmSync(runDir, { recursive: true, force: true });
  originalPlanWorkflow = fs.readFileSync(planWorkflowPath, 'utf8');

  assertTemplateUsesChecklistMarkers('.agent/resources/schemas/implementation_checklist.template.md');
  assertTemplateUsesChecklistMarkers('.agent/resources/schemas/verification_checklist.template.md');

  writeFile(path.join(runDir, '30-plan.md'));
  writeFile(path.join(runDir, '40-implement.md'));
  writeFile(path.join(runDir, '50-verify.md'));
  writeFile(path.join(runDir, '70-report.md'));
  writeFile(path.join(runDir, '70-report.html'), '<html></html>\n');
  writeFile(path.join(runDir, 'checklists', 'implementation-checklist.md'), `| ID | Unit | Plan Phase | Status |\n| :--- | :--- | :--- | :--- |\n| I1 | Work unit | Phase 1 | blocked |\n`);
  writeFile(path.join(runDir, 'checklists', 'verification-checklist.md'), `- [x] Verify completed integration path\n- [!] Investigate flaky preview gate\n- [-] Skip release smoke on sandbox only run\n`);

  const okRun = runValidate();
  assert(okRun.status === 0, `valid checklist workspace should pass:\n${okRun.stdout}\n${okRun.stderr}`);
  assert(
    okRun.stdout.includes('Stage-local loop contract validation passed for 3 workflow file(s)'),
    'valid framework should report scoped loop contract validation'
  );

  fs.writeFileSync(
    planWorkflowPath,
    originalPlanWorkflow.replace('### Loop Contract', '### Planning Contract'),
    'utf8'
  );
  const missingLoopRun = runValidate();
  assert(missingLoopRun.status !== 0, 'missing loop contract marker should fail validation');
  assert(
    missingLoopRun.stderr.includes('.agent/workflows/30-Plan.md is missing stage-local loop contract marker: ### Loop Contract'),
    'missing loop contract error should name the scoped workflow and marker'
  );
  fs.writeFileSync(planWorkflowPath, originalPlanWorkflow, 'utf8');

  fs.rmSync(path.join(runDir, '70-report.html'));
  const missingHtmlRun = runValidate();
  assert(missingHtmlRun.status !== 0, 'missing 70-report.html should fail validation');
  assert(missingHtmlRun.stderr.includes('70-report.md exists but 70-report.html is missing'), 'missing html error should mention report html requirement');

  writeFile(path.join(runDir, '70-report.html'), '<html></html>\n');
  writeFile(path.join(runDir, 'checklists', 'verification-checklist.md'), `- [?] Unknown marker should fail\n`);
  const badStatusRun = runValidate();
  assert(badStatusRun.status !== 0, 'invalid checklist marker should fail validation');
  assert(badStatusRun.stderr.includes('unsupported checklist marker "[?]"'), 'invalid checklist marker error should be explicit');

  console.log('[OK] validate-framework enforces checklist/report consistency and checklist status contracts.');
} finally {
  if (originalPlanWorkflow !== null) {
    fs.writeFileSync(planWorkflowPath, originalPlanWorkflow, 'utf8');
  }
  fs.rmSync(runDir, { recursive: true, force: true });
}
