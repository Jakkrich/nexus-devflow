#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const roadmapOnly = args.has('--roadmap-only');
const roadmapMarkdownArtifacts = [
  'ROADMAP.md'
];

function fail(message, failures) {
  failures.push(message);
  console.error(`FAIL: ${message}`);
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function readJson(relativePath, failures) {
  const target = path.join(projectRoot, relativePath);
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch (error) {
    fail(`${relativePath} is not valid JSON: ${error.message}`, failures);
    return null;
  }
}

function readText(relativePath, failures) {
  const target = path.join(projectRoot, relativePath);
  try {
    return fs.readFileSync(target, 'utf8');
  } catch (error) {
    fail(`Could not read ${relativePath}: ${error.message}`, failures);
    return null;
  }
}

function scanForLegacyReferences(failures) {
  const excluded = new Set(['.git', 'node_modules', '.venv', 'venv', 'env', '.local-tools', '.specify', '.uv_cache', '.pytest_cache', 'model_cache', 'rag_storage']);
  const allowedLegacyMentions = new Set([
    path.normalize('scripts/activate-agent.mjs'),
    path.normalize('agent-bundle.manifest.json'),
    path.normalize('scripts/sync-agent-bundle.mjs'),
    path.normalize('scripts/validate-framework.mjs')
  ]);
  const legacyPatterns = ['.cursor', '.cursorrules'];
  const hits = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (excluded.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const relative = path.relative(projectRoot, full);

      if (entry.isDirectory()) {
        if (legacyPatterns.includes(entry.name) && !allowedLegacyMentions.has(path.normalize(relative))) {
          hits.push(`${relative} (directory)`);
        }
        walk(full);
      } else if (entry.isFile()) {
        if (legacyPatterns.includes(entry.name) && !allowedLegacyMentions.has(path.normalize(relative))) {
          hits.push(`${relative} (file)`);
        }
      }
    }
  }

  walk(projectRoot);
  if (hits.length > 0) {
    fail(`Found legacy rule files:\n  ${hits.join('\n  ')}`, failures);
  } else {
    ok('No legacy rule files found');
  }
}

function validateRoadmap(failures) {
  const roadmapPath = path.join(projectRoot, 'ROADMAP.md');
  if (!fs.existsSync(roadmapPath)) {
    fail('Missing ROADMAP.md', failures);
    return;
  }
  const roadmap = readText('ROADMAP.md', failures);
  if (!roadmap) return;

  for (const heading of [
    '## Strategic Direction',
    '## Phases',
    '## Current Focus'
  ]) {
    if (!roadmap.includes(heading)) fail(`ROADMAP.md is missing required heading: ${heading}`, failures);
  }

  ok('ROADMAP.md markdown validation passed');
}

function validateWorkflowNumbering(failures) {
  const skillsDir = path.join(projectRoot, '.agents', 'skills');
  if (!fs.existsSync(skillsDir)) {
    fail('Missing .agents/skills directory', failures);
    return;
  }
  const numberedMainline = new Set([
    '10-define',
    '20-spec',
    '30-plan',
    '40-execute',
    '50-verify',
    '60-report',
    '70-deliver'
  ]);
  const skillFolders = fs.readdirSync(skillsDir)
    .filter((name) => fs.statSync(path.join(skillsDir, name)).isDirectory());

  const invalid = [];
  for (const name of skillFolders) {
    const isNumbered = /^\d{2}-[a-z0-9-]+$/.test(name);
    if (numberedMainline.has(name)) {
      if (!isNumbered) invalid.push(`${name} (mainline skills must keep numbering)`);
      continue;
    }
    if (isNumbered) {
      invalid.push(`${name} (non-mainline skills must not use numbering)`);
      continue;
    }
  }

  if (invalid.length) {
    fail(`Skill naming is invalid under DevFlow 2.0:\n  ${invalid.join('\n  ')}`, failures);
  } else {
    ok(`Skill naming passed for ${skillFolders.length} skills in .agents/skills`);
  }
}

function validateArtifactLanguageWorkflowSurface(failures) {
  const stageSkills = [
    '.agents/skills/discovery/SKILL.md',
    '.agents/skills/10-define/SKILL.md',
    '.agents/skills/20-spec/SKILL.md',
    '.agents/skills/30-plan/SKILL.md',
    '.agents/skills/40-execute/SKILL.md',
    '.agents/skills/50-verify/SKILL.md',
    '.agents/skills/60-report/SKILL.md',
    '.agents/skills/70-deliver/SKILL.md'
  ];

  for (const relativePath of stageSkills) {
    if (!fs.existsSync(path.join(projectRoot, relativePath))) continue;
    const content = readText(relativePath, failures);
    if (!content) continue;
  }

  ok('Artifact language workflow/docs surface is aligned');
}

function main() {
  const failures = [];
  const manifest = readJson('agent-bundle.manifest.json', failures);
  const requiredPaths = [
    'agent-bundle.manifest.json',
    'package.json',
    'AGENTS.md',
    'CLAUDE.md',
    '.agents/skills',
    '.claude/skills',
    '.nexus/nexus-devflow.json',
    'devflow/context/project-overview.md',
    'devflow/context/coding-standards.md',
    'devflow/context/ai-interaction.md',
    'devflow/reference/running-id-contract.md',
    ...(manifest?.required_paths || [])
  ];
  const forbiddenPaths = manifest?.forbidden_legacy_paths || [];

  const seenRequired = new Set();
  for (const item of requiredPaths) {
    if (seenRequired.has(item)) continue;
    seenRequired.add(item);
    if (!fs.existsSync(path.join(projectRoot, item))) fail(`Missing required path: ${item}`, failures);
    else ok(`Found ${item}`);
  }

  for (const item of forbiddenPaths) {
    if (fs.existsSync(path.join(projectRoot, item))) fail(`Forbidden legacy path exists: ${item}`, failures);
    else ok(`Legacy path absent: ${item}`);
  }

  scanForLegacyReferences(failures);
  validateRoadmap(failures);
  validateWorkflowNumbering(failures);
  validateArtifactLanguageWorkflowSurface(failures);

  if (failures.length > 0) {
    console.error(`\nValidation failed with ${failures.length} issue(s).`);
    process.exit(1);
  }

  console.log('\nNexus-DevFlow framework static validation completed successfully!');
}

main();
