#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
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
  assert(html.includes('<h1>Report: Sample Password Reset</h1>'), 'html should render the markdown document title');
  assert(html.includes('<h2>1. Purpose</h2>'), 'html should render markdown headings from the report body');
  assert(html.includes('<li>Stakeholder demo is ready.</li>'), 'html should include additional notes from markdown');
  assert(!html.includes('Toggle Theme'), 'html should not depend on the legacy report template chrome');
  assert(!html.includes('checklists/master-checklist.md'), 'html should not inject checklist template sections');

  const thaiWorkspaceDir = path.join(scratchRoot, 'project', '.workspaces', 'specs', '998-sample-report-th');
  writeFile(path.join(thaiWorkspaceDir, '70-report.md'), `---
id: "998-report"
title: "Thai Report Title"
artifact_language: "th"
doc_type: "stage"
stage: "70-report"
created: "2026-06-22"
updated: "2026-06-22"
owner: "codex"
status: "completed"
related_run: "998"
---

# Thai Report Title

## 3. Required Content

### Executive Summary

- Thai summary line
`);
  writeFile(path.join(thaiWorkspaceDir, 'checklists', 'master-checklist.md'), `- [!] Thai checklist item
`);

  const thaiResult = run([thaiWorkspaceDir]);
  assert(thaiResult.status === 0, `thai report html generation should pass:\n${thaiResult.stdout}\n${thaiResult.stderr}`);
  const thaiHtml = fs.readFileSync(path.join(thaiWorkspaceDir, '70-report.html'), 'utf8');
  assert(thaiHtml.includes('<html lang="th">'), 'thai html should set the html lang from frontmatter');
  assert(thaiHtml.includes('<h1>Thai Report Title</h1>'), 'thai html should render the markdown title');
  assert(!thaiHtml.includes('Toggle Theme'), 'thai html should not depend on the html template chrome');

  console.log('[OK] generate-report-html renders report markdown directly into html output.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
