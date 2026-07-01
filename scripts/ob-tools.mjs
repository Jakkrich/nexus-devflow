#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execSync } from 'node:child_process';

const HANDOFF_PATH = path.join('.agent', 'state', 'handoff.md');

const DEFAULT_TEMPLATE = `# O.B. Overnight Maintenance Handoff

## 📊 Active State
- **Current Task Branch**: \`none\`
- **Last Active Stage**: \`Status 00\`
- **Loop Cycle Count**: 0
- **Status**: \`running\`

## 📂 Pending Backlog (Status 00 Scans Find)
- [ ] Scanning queue is empty.

## 🟩 Completed Tasks (Status 70 Certified)
*(None yet)*

## 🟥 Morning Queue (Requires Human Intervention)
*(None yet)*

## 📑 Current Execution Log
- Loop initialized.
`;

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readHandoff() {
  if (!fs.existsSync(HANDOFF_PATH)) {
    console.log(DEFAULT_TEMPLATE);
    return;
  }
  const content = fs.readFileSync(HANDOFF_PATH, 'utf8');
  console.log(content);
}

function writeHandoff(content) {
  ensureDir(path.dirname(HANDOFF_PATH));
  fs.writeFileSync(HANDOFF_PATH, content, 'utf8');
  console.log(`[OK] Handoff file written to ${HANDOFF_PATH}`);
}

function checkDiff() {
  try {
    const diff = execSync('git diff', { encoding: 'utf8' }).trim();
    const status = execSync('git status --short', { encoding: 'utf8' }).trim();
    console.log('=== GIT STATUS ===');
    console.log(status || 'No uncommitted changes.');
    console.log('\n=== GIT DIFF ===');
    console.log(diff || 'No diff.');
  } catch (error) {
    console.error('Failed to run git diff:', error.message);
    process.exit(1);
  }
}

function runValidate() {
  console.log('Running linter and tests validation...');
  try {
    execSync('npm run validate', { encoding: 'utf8', stdio: 'inherit' });
    console.log('\n[PASS] Validation completed successfully.');
  } catch (error) {
    console.error('\n[FAIL] Validation failed.');
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log('Usage: node scripts/ob-tools.mjs <command> [args]');
    console.log('Commands:');
    console.log('  read-handoff               Read and print the active handoff file');
    console.log('  write-handoff <content>    Write to the handoff file (accepts file path or string content)');
    console.log('  check-diff                 Run git diff and status checks');
    console.log('  validate                   Run linter and tests verification');
    process.exit(1);
  }

  if (command === 'read-handoff') {
    readHandoff();
  } else if (command === 'write-handoff') {
    let content = '';
    const fileIndex = args.indexOf('--file') !== -1 ? args.indexOf('--file') : args.indexOf('-f');
    if (fileIndex !== -1 && args[fileIndex + 1]) {
      const filePath = args[fileIndex + 1];
      try {
        content = fs.readFileSync(filePath, 'utf8');
      } catch (err) {
        console.error(`Error: Failed to read file ${filePath}:`, err.message);
        process.exit(1);
      }
    } else if (!process.stdin.isTTY) {
      try {
        content = fs.readFileSync(0, 'utf-8');
      } catch (err) {
        console.error('Error: Failed to read from stdin:', err.message);
        process.exit(1);
      }
    } else {
      content = args.slice(1).join(' ');
      if (!content) {
        console.error('Error: No content or --file/-f argument provided for write-handoff.');
        process.exit(1);
      }
    }
    writeHandoff(content);
  } else if (command === 'check-diff') {
    checkDiff();
  } else if (command === 'validate') {
    runValidate();
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}

main();
