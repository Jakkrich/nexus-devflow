#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const stageMappings = [
  { legacyDir: '00-discover', legacyFile: 'discover.md', targetFile: '00-discover.md' },
  { legacyDir: '10-define', legacyFile: 'define.md', targetFile: '10-define.md' },
  { legacyDir: '20-spec', legacyFile: 'spec.md', targetFile: '20-spec.md' },
  { legacyDir: '30-plan', legacyFile: 'plan.md', targetFile: '30-plan.md' },
  { legacyDir: '40-implement', legacyFile: 'implement.md', targetFile: '40-implement.md' },
  { legacyDir: '50-verify', legacyFile: 'verify.md', targetFile: '50-verify.md' },
  { legacyDir: '60-release', legacyFile: 'release.md', targetFile: '60-release.md' },
  { legacyDir: '70-report', legacyFile: 'report.md', targetFile: '70-report.md' },
  { legacyDir: '70-report', legacyFile: 'report.html', targetFile: '70-report.html' }
];

function parseArgs(argv) {
  const values = { write: false, projectRoot: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--write') {
      values.write = true;
      continue;
    }
    if (arg === '--project-root') {
      values.projectRoot = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (!values.projectRoot) values.projectRoot = arg;
  }
  return values;
}

function isLegacyRunDirectory(workspacesRoot, entryName) {
  if (!/^\d{3}-/.test(entryName)) return false;
  const candidate = path.join(workspacesRoot, entryName);
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isDirectory()) return false;
  if (entryName === 'specs') return false;

  return stageMappings.some(({ legacyDir, legacyFile }) =>
    fs.existsSync(path.join(candidate, legacyDir, legacyFile))
  );
}

function planMigration(projectRoot) {
  const workspacesRoot = path.join(projectRoot, '.workspaces');
  const specsRoot = path.join(workspacesRoot, 'specs');
  if (!fs.existsSync(workspacesRoot)) {
    throw new Error(`Missing workspace root: ${workspacesRoot}`);
  }

  const runDirectories = fs.readdirSync(workspacesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isLegacyRunDirectory(workspacesRoot, entry.name))
    .map((entry) => entry.name)
    .sort();

  const plans = [];
  for (const dirName of runDirectories) {
    const sourceRoot = path.join(workspacesRoot, dirName);
    const targetRoot = path.join(specsRoot, dirName);
    const fileMoves = [];
    const missingArtifacts = [];
    const conflicts = [];

    for (const mapping of stageMappings) {
      const sourceFile = path.join(sourceRoot, mapping.legacyDir, mapping.legacyFile);
      const targetFile = path.join(targetRoot, mapping.targetFile);
      if (!fs.existsSync(sourceFile)) {
        missingArtifacts.push(path.relative(projectRoot, sourceFile));
        continue;
      }
      if (fs.existsSync(targetFile)) {
        conflicts.push(path.relative(projectRoot, targetFile));
        continue;
      }
      fileMoves.push({ sourceFile, targetFile });
    }

    plans.push({
      dirName,
      sourceRoot,
      targetRoot,
      fileMoves,
      missingArtifacts,
      conflicts
    });
  }

  return { projectRoot, workspacesRoot, specsRoot, plans };
}

function ensureDir(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function removeIfEmpty(dirPath, stopAt) {
  let current = dirPath;
  while (current.startsWith(stopAt) && current !== stopAt) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) break;
    if (fs.readdirSync(current).length > 0) break;
    fs.rmdirSync(current);
    current = path.dirname(current);
  }
}

function applyMigration(plan) {
  ensureDir(plan.specsRoot);
  for (const item of plan.plans) {
    if (item.conflicts.length > 0) continue;
    ensureDir(item.targetRoot);
    for (const move of item.fileMoves) {
      ensureDir(path.dirname(move.targetFile));
      fs.renameSync(move.sourceFile, move.targetFile);
    }

    const sourceStageDirs = [...new Set(stageMappings.map((mapping) => path.join(item.sourceRoot, mapping.legacyDir)))];
    for (const stageDir of sourceStageDirs) removeIfEmpty(stageDir, item.sourceRoot);
    removeIfEmpty(item.sourceRoot, plan.workspacesRoot);
  }
}

function printPlan(plan, writeMode) {
  const modeLabel = writeMode ? 'WRITE' : 'DRY-RUN';
  console.log(`Artifact migration mode: ${modeLabel}`);
  console.log(`Project root: ${plan.projectRoot}`);
  console.log(`Workspace root: ${plan.workspacesRoot}`);

  if (plan.plans.length === 0) {
    console.log('No legacy run directories found.');
    return;
  }

  for (const item of plan.plans) {
    console.log(`\nRun: ${item.dirName}`);
    console.log(`  from: ${path.relative(plan.projectRoot, item.sourceRoot)}`);
    console.log(`  to:   ${path.relative(plan.projectRoot, item.targetRoot)}`);

    for (const move of item.fileMoves) {
      console.log(`  move: ${path.relative(plan.projectRoot, move.sourceFile)} -> ${path.relative(plan.projectRoot, move.targetFile)}`);
    }
    for (const missing of item.missingArtifacts) {
      console.log(`  missing: ${missing}`);
    }
    for (const conflict of item.conflicts) {
      console.log(`  conflict: ${conflict}`);
    }
  }
}

function summarize(plan) {
  const totals = plan.plans.reduce((acc, item) => {
    acc.runs += 1;
    acc.moves += item.fileMoves.length;
    acc.conflicts += item.conflicts.length;
    acc.missing += item.missingArtifacts.length;
    return acc;
  }, { runs: 0, moves: 0, conflicts: 0, missing: 0 });

  console.log(`\nSummary: ${totals.runs} run(s), ${totals.moves} move(s), ${totals.conflicts} conflict(s), ${totals.missing} missing artifact(s)`);
  if (!plan.plans.some((item) => item.conflicts.length > 0) && totals.moves > 0) {
    console.log('Safe to apply with --write.');
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.projectRoot) {
    console.error('Usage: node ./scripts/migrate-stage-artifacts.mjs <project-root> [--write]');
    process.exit(1);
  }

  const projectRoot = path.resolve(args.projectRoot);
  const plan = planMigration(projectRoot);
  printPlan(plan, args.write);
  summarize(plan);

  if (!args.write) {
    console.log('\nDry-run only. Re-run with --write to apply changes.');
    return;
  }

  const hasConflicts = plan.plans.some((item) => item.conflicts.length > 0);
  if (hasConflicts) {
    console.error('\nMigration aborted because conflicts exist. Resolve target files first.');
    process.exit(1);
  }

  applyMigration(plan);
  console.log('\nMigration applied successfully.');
}

main();
