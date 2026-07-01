#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(rootDir, 'scripts', 'install-codex-global.mjs');
const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-codex-global-'));
const codexHome = path.join(scratchRoot, '.codex');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function outputOf(result) {
  return `${result.stdout || ''}${result.stderr || ''}`;
}

try {
  const result = spawnSync(process.execPath, [cli], {
    cwd: rootDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      CODEX_HOME: codexHome
    }
  });

  assert(result.status === 0, `install-codex-global should pass:\n${outputOf(result)}`);

  const skillPath = path.join(codexHome, 'skills', 'nexus-devflow', 'SKILL.md');
  assert(fs.existsSync(skillPath), 'global skill file should be created');
  const skillContent = fs.readFileSync(skillPath, 'utf8');
  assert(skillContent.includes(path.join(rootDir, '.agent', 'workflows', 'Help.md')), 'generated skill should point to Help.md');
  assert(!skillContent.includes('99-Help.md'), 'generated skill must not point to legacy 99-Help.md');
  assert(skillContent.includes('`/00-Discover`'), 'generated skill should document the slash command surface');
  assert(skillContent.includes('`Check-For-Updates`'), 'generated skill should document companion commands');

  const manifestPath = path.join(codexHome, 'nexus-devflow.json');
  assert(fs.existsSync(manifestPath), 'global manifest should be created');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(manifest.slash_command_mode === 'single-global-skill', 'manifest should record single-global-skill mode');

  const agentsPath = path.join(codexHome, 'AGENTS.md');
  assert(fs.existsSync(agentsPath), 'global AGENTS.md should be created');
  const agentsContent = fs.readFileSync(agentsPath, 'utf8');
  assert(agentsContent.includes('Slash command routing: treat those command names as prompt forms handled by the single global skill'), 'global AGENTS.md should explain slash command routing');

  console.log('[OK] install-codex-global writes the single-skill slash command surface for Codex.');
} finally {
  fs.rmSync(scratchRoot, { recursive: true, force: true });
}
