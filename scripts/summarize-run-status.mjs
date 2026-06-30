#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultProjectRoot = path.resolve(__dirname, '..');

const stageOrder = [
  '00-discover',
  '10-define',
  '20-spec',
  '30-plan',
  '40-implement',
  '50-verify',
  '60-report',
  '70-release'
];

function parseArgs(argv) {
  const args = {
    json: false,
    projectRoot: defaultProjectRoot
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') {
      args.json = true;
      continue;
    }
    if (arg === '--project-root') {
      args.projectRoot = path.resolve(argv[i + 1]);
      i++;
    }
  }

  return args;
}

function readIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function parseSectionBullet(content, headingText) {
  if (!content) return null;
  const escaped = headingText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`${escaped}[\\s\\S]*?\\n\\n-\\s+([^\\n]+)`));
  if (!match) return null;
  return cleanInlineValue(match[1]);
}

function parseLabeledValue(content, label) {
  if (!content) return null;
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`${escaped}\\**:\\s*([^\\n]+)`));
  if (!match) return null;
  return cleanInlineValue(match[1]);
}

function cleanInlineValue(value) {
  return value.replace(/[`*]/g, '').trim();
}

function detectCurrentStage(runDir) {
  let currentStage = null;
  for (const stage of stageOrder) {
    if (fs.existsSync(path.join(runDir, `${stage}.md`))) {
      currentStage = stage;
    }
  }
  return currentStage;
}

function parseStageSignals(runDir, currentStage) {
  if (!currentStage) {
    return { approvalStatus: null, nextAllowedCommand: null };
  }

  const content = readIfExists(path.join(runDir, `${currentStage}.md`));
  const approvalStatus = parseSectionBullet(content, 'Approval Status');
  const nextAllowedCommand = parseSectionBullet(content, 'Next Allowed Command');
  return { approvalStatus, nextAllowedCommand };
}

function parseVerificationGate(runDir) {
  const content = readIfExists(path.join(runDir, 'checklists', 'verification-checklist.md'));
  if (!content) return null;

  return {
    approvalStatus: parseLabeledValue(content, 'Approval Status'),
    readyForRelease: parseLabeledValue(content, 'Ready For `/60-Report`'),
    why: parseLabeledValue(content, 'Why'),
    returnToImplementNeeded: parseLabeledValue(content, 'Return To `/40-Implement` Needed'),
    humanReviewRequired: parseLabeledValue(content, 'Human Review Required'),
    nextAllowedCommand: parseLabeledValue(content, 'Next Allowed Command'),
    softGateWarning: parseLabeledValue(content, 'Soft-Gate Warning')
  };
}

function summarizeRun(runDir) {
  const runName = path.basename(runDir);
  const runId = runName.split('-')[0] || runName;
  const currentStage = detectCurrentStage(runDir);
  const stageSignals = parseStageSignals(runDir, currentStage);
  const verificationGate = parseVerificationGate(runDir);

  const approvalStatus = stageSignals.approvalStatus || verificationGate?.approvalStatus || 'Unknown';
  const nextAllowedCommand = stageSignals.nextAllowedCommand || verificationGate?.nextAllowedCommand || null;
  const manualReviewOpen = approvalStatus === 'Pending' || approvalStatus === 'Needs Revision';

  const warnings = [];
  if (manualReviewOpen) warnings.push('manual review open');
  if (!nextAllowedCommand) warnings.push('missing next allowed command');
  if (verificationGate?.readyForRelease === 'no') warnings.push('not ready for release');

  return {
    runId,
    runName,
    currentStage,
    approvalStatus,
    nextAllowedCommand,
    manualReviewOpen,
    verificationGate,
    warnings
  };
}

function listRunStatuses(projectRoot) {
  const specsRoot = path.join(projectRoot, '.workspaces', 'specs');
  if (!fs.existsSync(specsRoot)) {
    return [];
  }

  return fs.readdirSync(specsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => summarizeRun(path.join(specsRoot, entry.name)))
    .sort((a, b) => a.runName.localeCompare(b.runName));
}

function renderText(runs) {
  if (runs.length === 0) {
    return 'Help Summary:\nEnvironment: No runs found\n';
  }

  const lines = [
    'Help Summary:',
    'Environment: All OK',
    '',
    'Active Runs:'
  ];

  for (const run of runs) {
    const next = run.nextAllowedCommand || 'review current artifact first';
    const warningText = run.warnings.length ? ` | warnings: ${run.warnings.join(', ')}` : '';
    lines.push(
      `- ${run.runName}: stage=${run.currentStage || 'none'} | approval=${run.approvalStatus} | next=${next}${warningText}`
    );
  }

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const runs = listRunStatuses(args.projectRoot);

  if (args.json) {
    process.stdout.write(`${JSON.stringify({ runs }, null, 2)}\n`);
    return;
  }

  process.stdout.write(renderText(runs));
}

main();
