#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-report-html-'));

function run(args) {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', 'generate-report-html.mjs'), ...args], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

try {
  const workspaceDir = path.join(scratchRoot, 'project', '.workspaces', 'specs', '999-sample-report');
  const checklistDir = path.join(workspaceDir, 'checklists');

  writeFile(path.join(workspaceDir, '70-report.md'), `---
id: "999-report"
title: "Report: Sample Password Reset"
artifact_language: "en"
doc_type: "stage"
stage: "70-report"
created: "2026-06-22"
updated: "2026-06-22"
owner: "codex"
status: "completed"
related_run: "999"
---

# Report: Sample Password Reset

## 1. Purpose

- Produce the final human-friendly summary for the full running flow.

## 2. Inputs

- \`00-discover.md\`

## 3. Required Content

### Executive Summary

- Delivered password reset flow and closed the main user pain point.

### Work Completed

- Added reset request endpoint
- Added reset confirmation endpoint
- Added regression tests

### Validation Outcome

- \`npm test\` passed
- Manual reset flow passed in preview

### Checklist Summary

- Core implementation and verification items completed
- Release note publication was intentionally deferred

### Open Risks

- Email provider sandbox still limits real recipients

### Next Actions

- Move sandbox provider to production

## 4. Decisions

- Use token-based reset flow
- Keep release notes outside this run

## 5. Outputs

- Final markdown summary
- Final HTML summary

## 6. Next Step Guidance

- Mainline recommendation: end of flow

## 7. Additional Notes

- Stakeholder demo is ready.
`);

  writeFile(path.join(checklistDir, 'master-checklist.md'), `- [x] Add reset request endpoint
- [x] Add regression tests
- [-] Publish release note
`);

  writeFile(path.join(checklistDir, 'implementation-checklist.md'), `| ID | Unit | Plan Phase | Status | Owner | Files | Updated | Verification | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| I1 | Build reset request API | Phase 1 | done | codex | src/api/auth.ts | 2026-06-22 09:40 | npm test | passed |
| I2 | Build reset confirmation API | Phase 1 | blocked | codex | src/api/auth.ts | 2026-06-22 09:55 | pending | waiting on sandbox token rule |
`);

  writeFile(path.join(checklistDir, 'verification-checklist.md'), `| ID | Check | Source | Status | Owner | Updated | Evidence | Finding Severity | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| V1 | Run unit tests | plan | done | codex | 2026-06-22 10:10 | npm test | none | all green |
| V2 | Validate email sandbox behavior | verify | blocked | codex | 2026-06-22 10:20 | sandbox account | medium | provider restriction |
`);

  const result = run([workspaceDir]);
  assert(result.status === 0, `report html generation should pass:\n${result.stdout}\n${result.stderr}`);

  const htmlPath = path.join(workspaceDir, '70-report.html');
  assert(fs.existsSync(htmlPath), '70-report.html should be generated');

  const html = fs.readFileSync(htmlPath, 'utf8');
  assert(html.includes('<title>Report: Sample Password Reset</title>'), 'html should include rendered title');
  assert(html.includes('Executive Summary'), 'html should use english report scaffold by default');
  assert(html.includes('Toggle Theme'), 'html should use english chrome text by default');
  assert(html.includes('Checklist items: 7'), 'html footer should include checklist total');
  assert(html.includes('Build reset confirmation API'), 'html should include blocked checklist row');
  assert(html.includes('Publish release note'), 'html should include skipped checklist row');
  assert(html.includes('Stakeholder demo is ready.'), 'html should include additional notes');
  assert(html.includes('checklists/master-checklist.md'), 'html should include checklist input links');
  assert(html.includes('class="num-big">4<'), 'html should include completed checklist count');
  assert(html.includes('class="num-big">2<'), 'html should include blocked checklist count');
  assert(html.includes('class="num-big">1<'), 'html should include skipped checklist count');

  const thaiWorkspaceDir = path.join(scratchRoot, 'project', '.workspaces', 'specs', '998-sample-report-th');
  writeFile(path.join(thaiWorkspaceDir, '70-report.md'), `---
id: "998-report"
title: "รายงานสรุป: ตัวอย่างภาษาไทย"
artifact_language: "th"
doc_type: "stage"
stage: "70-report"
created: "2026-06-22"
updated: "2026-06-22"
owner: "codex"
status: "completed"
related_run: "998"
---

# รายงานสรุป: ตัวอย่างภาษาไทย

## 3. Required Content

### Executive Summary

- สรุปรายงานภาษาไทย
`);
  writeFile(path.join(thaiWorkspaceDir, 'checklists', 'master-checklist.md'), `- [!] ตรวจสอบผลลัพธ์ภาษาไทย
`);

  const thaiResult = run([thaiWorkspaceDir]);
  assert(thaiResult.status === 0, `thai report html generation should pass:\n${thaiResult.stdout}\n${thaiResult.stderr}`);
  const thaiHtml = fs.readFileSync(path.join(thaiWorkspaceDir, '70-report.html'), 'utf8');
  assert(thaiHtml.includes('สรุปภาพรวม'), 'thai html should use thai report scaffold');
  assert(thaiHtml.includes('เปลี่ยนธีม'), 'thai html should use thai chrome text');

  console.log('[OK] generate-report-html renders locale-aware report HTML from markdown report and checklist tables.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
