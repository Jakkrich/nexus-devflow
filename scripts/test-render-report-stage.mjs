#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  extractH3Section,
  parseFrontmatter,
  renderMarkdownToHtml
} from './lib/render-html/markdown.mjs';
import { resolveWorkspaceDir } from './generate-report-html.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-report-stage-'));

try {
  const markdown = `---
id: "999-report"
title: "Report: Adapter Smoke Test"
related_run: "999"
---

# Report: Adapter Smoke Test

## 3. Required Content

### Executive Summary

- Adapter path renders this report.

### Work Completed

- Rendered through the shared stage adapter.
`;

  const parsed = parseFrontmatter(markdown);
  assert(parsed.data.id === '999-report', 'frontmatter id should parse');
  assert(parsed.data.related_run === '999', 'frontmatter related_run should parse');

  const summary = extractH3Section(parsed.body, 'Executive Summary');
  assert(summary.includes('Adapter path renders this report.'), 'Executive Summary section should extract');

  const html = renderMarkdownToHtml(summary);
  assert(html.includes('<li>Adapter path renders this report.</li>'), 'markdown list should render to html list');

  const workspaceDir = path.join(scratchRoot, '.workspaces', 'specs', '999-render-stage');
  const checklistDir = path.join(workspaceDir, 'checklists');

  writeFile(path.join(checklistDir, 'master-checklist.md'), `| ID | Item | Stage | Status | Owner | Depends On | Updated | Evidence | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| T1 | Build report adapter | /40-Implement | done | codex | none | 2026-06-23 10:00 | node test | complete |
| T2 | Verify html output | /50-Verify | blocked | codex | T1 | 2026-06-23 10:15 | pending | renderer mismatch |
`);

  const flatWorkspaceDir = path.join(scratchRoot, '.workspaces', '999-shadow-stage');
  writeFile(path.join(flatWorkspaceDir, '70-report.md'), '# Shadow\n');

  assert(
    resolveWorkspaceDir('999', scratchRoot) === workspaceDir,
    'report generator should prefer .workspaces/specs when both layouts share a running id'
  );

  const ambiguousRoot = path.join(scratchRoot, 'ambiguous-project');
  writeFile(path.join(ambiguousRoot, '.workspaces', 'specs', '123-first', '70-report.md'), '# First\n');
  writeFile(path.join(ambiguousRoot, '.workspaces', 'specs', '123-second', '70-report.md'), '# Second\n');
  const ambiguousRun = spawnSync(
    process.execPath,
    [path.join(path.resolve('scripts'), 'generate-report-html.mjs'), '123'],
    { cwd: ambiguousRoot, encoding: 'utf8' }
  );
  assert(ambiguousRun.status !== 0, 'ambiguous spec workspaces should fail');
  assert(ambiguousRun.stderr.includes('Multiple workspace directories match "123"'), 'ambiguous error should stay explicit');

  console.log('[OK] report-stage helpers preserve report generator extraction behavior.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
