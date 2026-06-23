#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMarkdownDocument } from './lib/render-html/core.mjs';
import { resolveWorkspaceDir } from './lib/render-html/workspace-resolver.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-render-core-'));
const outputPath = path.join(scratchRoot, 'sample.html');

try {
  const sourcePath = path.join(scratchRoot, 'sample.md');
  const metadataPath = path.join(scratchRoot, 'metadata.json');
  fs.writeFileSync(sourcePath, '# Sample\n', 'utf8');

  const fullMetadata = {
    report_title: 'Report: Shared Renderer Smoke Test',
    report_id: 'smoke-report',
    doc_type: 'stage',
    stage: '70-report',
    artifact_language: 'en',
    created: '2026-06-23',
    updated: '2026-06-23',
    owner: 'codex',
    status: 'draft',
    status_display: 'Draft',
    executive_summary_html: '<p>Shared renderer is active.</p>',
    work_completed_html: '<p>Pending</p>',
    validation_outcome_html: '<p>Pending</p>',
    checklist_summary_html: '<p>Pending</p>',
    checklist_complete: '0',
    checklist_blocked: '0',
    checklist_skipped: '0',
    checklist_total: '0',
    checklist_rows_html: '<tr><td colspan="3">None</td></tr>',
    open_risks_html: '<p>None</p>',
    next_actions_html: '<p>None</p>',
    decisions_html: '<div class="decision-item">Adopt shared renderer</div>',
    inputs_list_html: '<li>70-report.md</li>',
    outputs_list_html: '<li>70-report.html</li>',
    additional_notes_html: '<p>n/a</p>',
    footer_text: 'Generated from smoke test'
  };
  fs.writeFileSync(metadataPath, JSON.stringify(fullMetadata, null, 2), 'utf8');

  const result = renderMarkdownDocument({
    sourcePath,
    markdown: '### Executive Summary\n\n- Shared renderer is active.',
    preset: 'report',
    outputPath,
    metadata: fullMetadata
  });

  assert(result.presetUsed === 'report', 'presetUsed should equal report');
  assert(result.outputPath === outputPath, 'outputPath should be preserved');
  assert(result.warnings.length === 0, 'warnings should be empty when all placeholders are populated');
  assert(fs.existsSync(outputPath), 'renderer should write output file');
  assert(result.html.includes('Shared Renderer Smoke Test'), 'html should include report title');
  assert(result.html.includes('Executive Summary'), 'report preset should use english html scaffold by default');

  const warningResult = renderMarkdownDocument({
    sourcePath,
    markdown: '# Partial\n',
    preset: 'report',
    metadata: {
      report_title: 'Report: Partial',
      report_id: 'partial-report'
    }
  });

  assert(warningResult.warnings.length > 0, 'warnings should report unresolved template placeholders');

  const escapedReportResult = renderMarkdownDocument({
    sourcePath,
    markdown: '# Escaped\n',
    preset: 'report',
    metadata: {
      ...fullMetadata,
      report_title: 'Report: <Unsafe "Title">'
    }
  });
  assert(
    escapedReportResult.html.includes('&lt;Unsafe &quot;Title&quot;&gt;'),
    'report preset should escape plain-text metadata before template substitution'
  );

  const defaultResult = renderMarkdownDocument({
    sourcePath,
    markdown: '# Generic\n\n- Item one\n- Item two',
    metadata: {
      title: 'Generic Document'
    }
  });
  assert(defaultResult.presetUsed === 'default-doc', 'default preset should be default-doc');
  assert(defaultResult.html.includes('<title>Generic Document</title>'), 'default-doc preset should render title');
  assert(defaultResult.html.includes('<h1>Generic</h1>'), 'default-doc preset should render markdown headings');
  assert(defaultResult.html.includes('<li>Item one</li>'), 'default-doc preset should render markdown lists');

  const specResult = renderMarkdownDocument({
    sourcePath: path.join(scratchRoot, 'spec.md'),
    markdown: '## Specification\n\nAcceptance criteria.',
    preset: 'spec',
    metadata: {
      title: 'Specification Document'
    }
  });
  assert(specResult.presetUsed === 'spec', 'spec preset should be routable');
  assert(specResult.html.includes('Specification Document'), 'spec preset should render generic html');
  assert(specResult.html.includes('<h2>Specification</h2>'), 'spec preset should render markdown structure');

  const planResult = renderMarkdownDocument({
    sourcePath: path.join(scratchRoot, 'plan.md'),
    markdown: '## Plan\n\n- Execution step',
    preset: 'plan',
    metadata: {
      title: 'Plan Document'
    }
  });
  assert(planResult.presetUsed === 'plan', 'plan preset should be routable');
  assert(planResult.html.includes('Plan Document'), 'plan preset should render generic html');
  assert(planResult.html.includes('<li>Execution step</li>'), 'plan preset should render markdown structure');

  const specsRoot = path.join(scratchRoot, '.workspaces', 'specs');
  const specsWorkspace = path.join(specsRoot, '999-sample-report');
  fs.mkdirSync(specsWorkspace, { recursive: true });
  const reportFilePath = path.join(specsWorkspace, '70-report.md');
  fs.writeFileSync(reportFilePath, '# Report\n', 'utf8');
  assert(
    resolveWorkspaceDir({ argument: '999', projectRoot: scratchRoot }) === specsWorkspace,
    'resolver should support .workspaces/specs running-id layout'
  );
  assert(
    resolveWorkspaceDir({ argument: reportFilePath, projectRoot: scratchRoot }) === specsWorkspace,
    'resolver should support direct 70-report.md file paths'
  );

  const flatWorkspace = path.join(scratchRoot, '.workspaces', '888-sample-report');
  fs.mkdirSync(flatWorkspace, { recursive: true });
  assert(
    resolveWorkspaceDir({ argument: '888', projectRoot: scratchRoot }) === flatWorkspace,
    'resolver should support flat .workspaces running-id layout'
  );

  const ambiguousOne = path.join(specsRoot, '777-first');
  const ambiguousTwo = path.join(specsRoot, '777-second');
  fs.mkdirSync(ambiguousOne, { recursive: true });
  fs.mkdirSync(ambiguousTwo, { recursive: true });
  let ambiguousError = null;
  try {
    resolveWorkspaceDir({ argument: '777', projectRoot: scratchRoot });
  } catch (error) {
    ambiguousError = error;
  }
  assert(ambiguousError instanceof Error, 'ambiguous running IDs should throw');
  assert(ambiguousError.message.includes('Could not resolve workspace path or running ID: 777'), 'ambiguous running IDs should fail clearly');

  const cliOutputPath = path.join(scratchRoot, 'cli-report.html');
  const cliRun = spawnSync(
    process.execPath,
    [
      path.join(scriptDir, 'render-html.mjs'),
      '--preset',
      'report',
      '--source',
      sourcePath,
      '--out',
      cliOutputPath,
      '--metadata',
      metadataPath
    ],
    {
      cwd: projectRoot,
      encoding: 'utf8'
    }
  );

  assert(cliRun.status === 0, `render-html CLI should pass:\n${cliRun.stdout}\n${cliRun.stderr}`);
  assert(fs.existsSync(cliOutputPath), 'render-html CLI should write output file');

  console.log('[OK] renderMarkdownDocument writes HTML through the shared preset pipeline.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
