#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
const skillDir = path.join(codexHome, 'skills', 'nexus-devflow');
const skillFile = path.join(skillDir, 'SKILL.md');
const agentsFile = path.join(codexHome, 'AGENTS.md');
const manifestFile = path.join(codexHome, 'nexus-devflow.json');
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));

function writeFile(targetFile, fileContent) {
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, fileContent, 'utf8');
}

function skillContent(root) {
  return [
    '---',
    'name: nexus-devflow',
    'description: Use when the user asks for Nexus-DevFlow, DevFlow 2.0, reusable/global Codex workflows, checking or updating the Codex global install, or stage commands such as /00-Discover, /10-Define, /20-Spec, /30-Plan, /40-Implement, /50-Verify, /60-Report, /70-Release, or companion commands such as Help.',
    '---',
    '',
    '# Nexus-DevFlow for Codex',
    '',
    'Use this skill to run Nexus-DevFlow as a global Codex workflow layer from any project.',
    '',
    'Canonical framework root:',
    '',
    '```text',
    root,
    '```',
    '',
    '## Workflow routing',
    '',
    '- If the user mentions a numbered workflow command, read the matching file under `' + path.join(root, '.agent', 'workflows') + '`.',
    '- If the user asks which workflow to use, read `' + path.join(root, '.agent', 'workflows', '99-Help.md') + '` first.',
    '- If the user asks for a goal-first flow, route them through Discover or Help first unless a local extension defines another entry point.',
    "- Keep target project artifacts in the target project's `.workspaces` folder. Do not write task artifacts into the Nexus-DevFlow framework repo unless the framework itself is the target.",
    '- Prefer the target project commands for verification, then use Nexus-DevFlow validation commands only when the framework is installed or linked into that project.',
    '',
    '## Codex global update workflow',
    '',
    '- When the user asks to check Nexus-DevFlow for Codex, run `npm run codex:check-global` from the framework root and report the result.',
    '- When the user asks to update the Codex global install from the local framework checkout, run `npm run codex:update-global` from the framework root.',
    '- When the user explicitly asks to pull the latest repository changes before updating Codex, run `npm run codex:update-global:pull`; require network approval if the environment asks for it.',
    '- If the Git working tree is dirty, do not pull automatically. Report the dirty files and ask whether to commit, stash, or skip pulling.',
    '- After any update, verify with `npm run validate` and confirm that the global skill path exists.',
    '',
    '## How to work',
    '',
    '1. Identify the target project root from the current workspace or the user path.',
    '2. Load the requested workflow markdown from the global framework root.',
    '3. Follow the workflow as Codex instructions, adapting IDE-specific wording to Codex.',
    '4. Use scripts from the framework root only when they are relevant and safe for the target project.',
    '5. Summarize changed artifacts, validation evidence, and the recommended next workflow.',
    '',
    '## Useful commands',
    '',
    '```powershell',
    'cd ' + root,
    'npm run codex:check-global',
    'npm run codex:update-global',
    'npm run codex:update-global:pull',
    'npm run validate',
    '```',
    ''
  ].join('\n');
}

function updateGlobalAgents(root) {
  const markerStart = '<!-- nexus-devflow-codex-global:start -->';
  const markerEnd = '<!-- nexus-devflow-codex-global:end -->';
  const block = [
    markerStart,
    '# Nexus-DevFlow Global Workflow',
    '',
    'When the user asks for Nexus-DevFlow, DevFlow 2.0, checking/updating the Codex global install, or stage commands like /00-Discover, /10-Define, /20-Spec, /30-Plan, /40-Implement, /50-Verify, /60-Report, /70-Release, or companion commands like Help, use the global Codex skill `nexus-devflow`.',
    '',
    'Framework root: `' + root + '`',
    'Update commands: `npm run codex:check-global`, `npm run codex:update-global`, `npm run codex:update-global:pull`',
    markerEnd
  ].join('\n');

  const existing = fs.existsSync(agentsFile) ? fs.readFileSync(agentsFile, 'utf8') : '';
  const pattern = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`);
  const next = pattern.test(existing)
    ? existing.replace(pattern, block)
    : [existing.trim(), block].filter(Boolean).join('\n\n') + '\n';
  writeFile(agentsFile, next);
}

writeFile(skillFile, skillContent(projectRoot));
writeFile(manifestFile, JSON.stringify({
  name: 'nexus-devflow',
  version: packageJson.version,
  installed_for: 'codex-global',
  framework_root: projectRoot,
  skill: path.relative(codexHome, skillFile),
  update_commands: {
    check: 'npm run codex:check-global',
    update: 'npm run codex:update-global',
    pull_and_update: 'npm run codex:update-global:pull'
  },
  installed_at: new Date().toISOString()
}, null, 2) + '\n');
updateGlobalAgents(projectRoot);

console.log('Nexus-DevFlow installed for Codex global use.');
console.log(`Skill: ${skillFile}`);
console.log(`Global instructions: ${agentsFile}`);
