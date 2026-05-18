#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const manifestPath = path.join(projectRoot, 'agent-bundle.manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const required = manifest.required_paths;
const forbidden = manifest.forbidden_legacy_paths;
let failed = false;

for (const item of required) {
  if (!fs.existsSync(path.join(projectRoot, item))) {
    console.error(`Missing required .agent bundle item: ${item}`);
    failed = true;
  }
}

for (const item of forbidden) {
  if (fs.existsSync(path.join(projectRoot, item))) {
    console.error(`Legacy IDE bundle should not exist: ${item}`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('Agent bundle check passed. .agent is the single active framework bundle.');
}
