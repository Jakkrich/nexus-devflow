#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tempRoot = path.join(rootDir, '.agent', '.test-workspace-run-status');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function runSummary(args = []) {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'summarize-run-status.mjs'), ...args], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

try {
  fs.rmSync(tempRoot, { recursive: true, force: true });

  const specsRoot = path.join(tempRoot, '.workspaces', 'specs');

  writeFile(path.join(specsRoot, '101-alpha', '20-spec.md'), `# Spec\n\n## 15. Approval Status\n\n- Pending\n\n## 16. Next Allowed Command\n\n- \`/30-Plan 101\`\n`);
  writeFile(path.join(specsRoot, '101-alpha', 'checklists', 'verification-checklist.md'), `# Verification Checklist\n\n## 5. Approval Gate\n\n- **Approval Status**: \`Pending\`\n- **Ready For \`/60-Report\`**: \`no\`\n- **Why**: waiting for review\n- **Return To \`/40-Implement\` Needed**: \`no\`\n- **Human Review Required**: confirm acceptance criteria evidence\n- **Next Allowed Command**: \`/30-Plan 101\`\n- **Soft-Gate Warning**: spec still pending approval\n`);

  writeFile(path.join(specsRoot, '102-beta', '50-verify.md'), `# Verify\n\n## 14. Approval Status\n\n- Approved\n\n## 15. Next Allowed Command\n\n- \`/60-Report 102\`\n`);
  writeFile(path.join(specsRoot, '102-beta', 'checklists', 'verification-checklist.md'), `- [x] Report readiness confirmed | source: verify | owner: qa | updated: 2026-06-30 09:00 | evidence: tests passed | severity: none | review: approved | next: report\n\n## 5. Approval Gate\n\n- **Approval Status**: \`Approved\`\n- **Ready For \`/60-Report\`**: \`yes\`\n- **Why**: all evidence complete\n- **Return To \`/40-Implement\` Needed**: \`no\`\n- **Human Review Required**: final report sign-off only\n- **Next Allowed Command**: \`/60-Report 102\`\n- **Soft-Gate Warning**: none\n`);

  const jsonResult = runSummary(['--project-root', tempRoot, '--json']);
  assert(jsonResult.status === 0, `summary script should exit 0:\n${jsonResult.stdout}\n${jsonResult.stderr}`);
  const parsed = JSON.parse(jsonResult.stdout);
  assert(Array.isArray(parsed.runs), 'json output should include runs array');
  assert(parsed.runs.length === 2, 'json output should include two runs');

  const alpha = parsed.runs.find((run) => run.runId === '101');
  assert(alpha, 'alpha run should be present');
  assert(alpha.currentStage === '20-spec', 'alpha current stage should be 20-spec');
  assert(alpha.approvalStatus === 'Pending', 'alpha approval status should come from stage file');
  assert(alpha.nextAllowedCommand === '/30-Plan 101', 'alpha next command should come from stage file');
  assert(alpha.manualReviewOpen === true, 'alpha should be marked as manual review open');
  assert(alpha.verificationGate?.readyForRelease === 'no', 'alpha verification gate should show not ready for release');

  const beta = parsed.runs.find((run) => run.runId === '102');
  assert(beta, 'beta run should be present');
  assert(beta.currentStage === '50-verify', 'beta current stage should be 50-verify');
  assert(beta.approvalStatus === 'Approved', 'beta approval status should come from stage file');
  assert(beta.nextAllowedCommand === '/60-Report 102', 'beta next command should come from stage file');
  assert(beta.manualReviewOpen === false, 'beta should not be marked as manual review open');
  assert(beta.verificationGate?.readyForRelease === 'yes', 'beta verification gate should show ready for release');

  const textResult = runSummary(['--project-root', tempRoot]);
  assert(textResult.status === 0, `text summary should exit 0:\n${textResult.stdout}\n${textResult.stderr}`);
  assert(textResult.stdout.includes('101-alpha'), 'text summary should mention alpha workspace');
  assert(textResult.stdout.includes('manual review open'), 'text summary should mention manual review open state');
  assert(textResult.stdout.includes('/60-Report 102'), 'text summary should include next command for beta');

  console.log('[OK] summarize-run-status reads stage and checklist approval signals.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
