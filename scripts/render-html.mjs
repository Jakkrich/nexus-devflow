#!/usr/bin/env node

import fs from 'node:fs';
import { renderMarkdownDocument } from './lib/render-html/core.mjs';

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
