#!/usr/bin/env node

import fs from 'node:fs';
import { renderMarkdownDocument } from './lib/render-html/core.mjs';
import { renderReportStageWorkspace, resolveReportWorkspaceDir } from './lib/render-html/stage-adapters/report-stage.mjs';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const args = process.argv.slice(2);

function readOption(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

const preset = readOption('--preset');
const sourcePath = readOption('--source');
const outputPath = readOption('--out');
const metadataPath = readOption('--metadata');
const stage = readOption('--stage');

const positionalArgs = args.filter((value, index) => {
  if (value.startsWith('--')) return false;
  const previous = args[index - 1];
  return !['--preset', '--source', '--out', '--metadata', '--stage'].includes(previous);
});

if (stage) {
  if (stage !== '70-report') {
    fail(`Unsupported stage for round-one render CLI: ${stage}`);
  }
  const target = positionalArgs[0];
  if (!target) {
    fail('Usage: node scripts/render-html.mjs --stage 70-report <workspace-path-or-running-id>');
  }

  try {
    const workspaceDir = resolveReportWorkspaceDir(target, process.cwd());
    const result = renderReportStageWorkspace({ workspaceDir });
    console.log(`Generated ${result.outputPath}`);
  } catch (error) {
    fail(error.message);
  }
  process.exit(0);
}

if (!preset || !sourcePath || !outputPath || !metadataPath) {
  fail('Usage: node scripts/render-html.mjs --preset <name> --source <markdown-file> --out <html-file> --metadata <json-file>');
}

const markdown = fs.readFileSync(sourcePath, 'utf8');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
const result = renderMarkdownDocument({
  sourcePath,
  markdown,
  preset,
  outputPath,
  metadata
});

for (const warning of result.warnings) {
  console.warn(`WARN: ${warning}`);
}

console.log(`Generated ${result.outputPath}`);
