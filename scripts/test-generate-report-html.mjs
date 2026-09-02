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
  const workspaceDir = path.join(scratchRoot, 'project', 'devflow', 'specs', '999-sample-report');
  const checklistDir = path.join(workspaceDir, 'checklists');

  writeFile(path.join(workspaceDir, 'report.md'), `---
id: "999-report"
title: "Report: Sample Password Reset"
artifact_language: "th"
doc_type: "report"
stage: "report"
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

- \`discovery.md\`

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

  const htmlPath = path.join(workspaceDir, 'report.html');
  assert(fs.existsSync(htmlPath), 'report.html should be generated');

  const html = fs.readFileSync(htmlPath, 'utf8');
  assert(html.includes('<title>Report: Sample Password Reset</title>'), 'html should include rendered title');
  assert(html.includes('>Report: Sample Password Reset</h1>'), 'html should render the markdown document title');
  assert(html.includes('>1. Purpose</h2>'), 'html should render markdown headings from the report body');
  assert(html.includes('<li>Stakeholder demo is ready.</li>'), 'html should include additional notes from markdown');
  assert(html.includes('เปลี่ยนธีม'), 'html should localize the md2html template chrome from artifact_language');
  assert(html.includes('id="toc-nav"'), 'html should include the md2html toc shell');
  assert(!html.includes('checklists/implementation-checklist.md'), 'html should not inject checklist template sections');

  const thaiWorkspaceDir = path.join(scratchRoot, 'project', 'devflow', 'specs', '998-sample-report-th');
  writeFile(path.join(thaiWorkspaceDir, 'report.md'), `---
id: "998-report"
title: "Thai Report Title"
artifact_language: "th"
doc_type: "report"
stage: "report"
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
  writeFile(path.join(thaiWorkspaceDir, 'checklists', 'verification-checklist.md'), `- [!] Thai checklist item
`);

  const thaiResult = run([thaiWorkspaceDir]);
  assert(thaiResult.status === 0, `thai report html generation should pass:\n${thaiResult.stdout}\n${thaiResult.stderr}`);
  const thaiHtml = fs.readFileSync(path.join(thaiWorkspaceDir, 'report.html'), 'utf8');
  assert(thaiHtml.includes('<html lang="th"'), 'thai html should set the html lang from frontmatter');
  assert(thaiHtml.includes('>Thai Report Title</h1>'), 'thai html should render the markdown title');
  assert(thaiHtml.includes('เปลี่ยนธีม'), 'thai html should localize the md2html theme tooltip');
  assert(thaiHtml.includes('id="toc-nav"'), 'thai html should include the md2html toc shell');

  const contextWorkspaceDir = path.join(scratchRoot, 'devflow', 'context', '068-mermaid-feature');
  writeFile(path.join(contextWorkspaceDir, 'spec.md'), `---
id: "068-mermaid-feature"
title: "Mermaid Integration Spec"
artifact_language: "th"
doc_type: "feature"
stage: "spec"
created: "2026-09-02"
---

# Mermaid Integration Spec

## 1. Architecture Flow

\`\`\`mermaid
flowchart TD
  Client --> API[Gateway API]
  API --> DB[(Database)]
\`\`\`
`);

  const contextResult = run([contextWorkspaceDir]);
  assert(contextResult.status === 0, `context report html generation should pass:\n${contextResult.stdout}\n${contextResult.stderr}`);
  const contextHtml = fs.readFileSync(path.join(contextWorkspaceDir, 'report.html'), 'utf8');
  assert(contextHtml.includes('<pre class="mermaid">'), 'html should render mermaid code fence as <pre class="mermaid">');
  assert(!contextHtml.includes('<pre><code>flowchart TD'), 'html should not render raw code block for mermaid');

  // Task 2: Task Diagrams Showcase with SVG and Interactive HTML
  const diagramsDir = path.join(contextWorkspaceDir, 'diagrams');
  writeFile(path.join(diagramsDir, 'architecture.svg'), '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="coral" /></svg>');
  writeFile(path.join(diagramsDir, 'interactive-flow.html'), '<!DOCTYPE html><html><body>Interactive Diagram Content</body></html>');

  const diagramRunResult = run([contextWorkspaceDir]);
  assert(diagramRunResult.status === 0, `diagram run should pass:\n${diagramRunResult.stdout}\n${diagramRunResult.stderr}`);
  const diagramHtml = fs.readFileSync(path.join(contextWorkspaceDir, 'report.html'), 'utf8');
  assert(diagramHtml.includes('class="diagrams-showcase"'), 'html should render diagrams showcase section when diagrams/ exist');
  assert(diagramHtml.includes('<svg viewBox="0 0 100 100">'), 'html should embed svg diagram');
  assert(diagramHtml.includes('src="./diagrams/interactive-flow.html"'), 'html should embed iframe for html diagram');

  console.log('[OK] generate-report-html renders report markdown directly into html output.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}


