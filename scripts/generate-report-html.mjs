#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runReportHtmlCommand, resolveReportWorkspaceDir as resolveWorkspaceDir } from './lib/render-html/stage-adapters/report-stage.mjs';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntrypoint) {
  try {
    const outputPath = runReportHtmlCommand({
      projectRoot: process.cwd(),
      argument: process.argv[2]
    });
    console.log(`Generated ${outputPath}`);
  } catch (error) {
    fail(error.message);
  }
}

export { resolveWorkspaceDir };
