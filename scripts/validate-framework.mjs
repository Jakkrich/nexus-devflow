#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateProjectIndex } from './generate-project-index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const manifest = readJson('agent-bundle.manifest.json', []);
const roadmapOnly = args.has('--roadmap-only');
const roadmapMarkdownArtifacts = [
  '.workspaces/roadmap/roadmap-discovery.md',
  'ROADMAP.md'
];

const requiredPaths = [
  '.agent',
  'agent-bundle.manifest.json',
  'package.json',
  'docs/quickstart.md',
  'docs/workspace-artifacts.md',
  ...(manifest?.required_paths || [])
];

const forbiddenPaths = manifest?.forbidden_legacy_paths || [];

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
  const excluded = new Set(['.git', 'node_modules', '.venv', 'venv', 'env', '.local-tools', '.specify', '.uv_cache', '.pytest_cache', 'model_cache', 'rag_storage', 'benchmarks']);
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
        walk(full);
        continue;
      }
      if (!/\.(md|json|mjs|js|py|toml|txt|yaml|yml)$/i.test(entry.name)) continue;
      if (allowedLegacyMentions.has(path.normalize(relative))) continue;
      const content = fs.readFileSync(full, 'utf8');
      for (const pattern of legacyPatterns) {
        if (content.includes(pattern)) hits.push(`${relative}: ${pattern}`);
      }
    }
  }

  walk(projectRoot);
  if (hits.length) fail(`Legacy references remain:\n  ${hits.join('\n  ')}`, failures);
  else ok('No legacy workspace or IDE-switcher references remain');
}

function validateRoadmap(failures) {
  if (!shouldValidateRoadmap()) {
    ok('Roadmap artifacts are optional for default framework validation');
    return;
  }

  const roadmap = readText('ROADMAP.md', failures);
  const discovery = readText('.workspaces/roadmap/roadmap-discovery.md', failures);
  if (!roadmap || !discovery) return;

  for (const heading of [
    '## Strategic Direction',
    '## Phases',
    '## Current Focus',
    '## Validation'
  ]) {
    if (!roadmap.includes(heading)) fail(`ROADMAP.md is missing required heading: ${heading}`, failures);
  }

  for (const heading of [
    '## 1. Purpose And Scope',
    '## 2. Target Users And Value',
    '## 3. Current State',
    '## 4. Constraints And Signals',
    '## 5. Strategy Inputs',
    '## 6. Sources'
  ]) {
    if (!discovery.includes(heading)) fail(`roadmap-discovery.md is missing required heading: ${heading}`, failures);
  }

  const phaseRows = countMarkdownTableRows(roadmap, '## Phases', '## Current Focus');
  if (phaseRows < 1) {
    fail('ROADMAP.md must contain at least one roadmap phase row', failures);
  }

  const focusRows = countMarkdownTableRows(roadmap, '## Current Focus', '## Machine-Readable Sources');
  if (focusRows < 3) {
    fail('ROADMAP.md must contain at least three current focus rows', failures);
  }

  ok(`Roadmap markdown passed with ${phaseRows} phases and ${focusRows} focus items`);
}

function shouldValidateRoadmap() {
  return roadmapOnly || roadmapMarkdownArtifacts.some((item) => fs.existsSync(path.join(projectRoot, item)));
}

function requiredRoadmapPaths() {
  return shouldValidateRoadmap() ? roadmapMarkdownArtifacts : [];
}

function countMarkdownTableRows(content, startHeading, endHeading) {
  const start = content.indexOf(startHeading);
  if (start === -1) return 0;
  const end = endHeading ? content.indexOf(endHeading, start + startHeading.length) : -1;
  const block = content.slice(start, end === -1 ? undefined : end);
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) =>
      line.startsWith('|') &&
      !/^\|\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?$/.test(line) &&
      !/^\|\s*Phase\s*\|/i.test(line) &&
      !/^\|\s*Priority\s*\|/i.test(line)
    ).length;
}

function validateWorkflowNumbering(failures) {
  const workflowDir = path.join(projectRoot, '.agent', 'workflows');
  if (!fs.existsSync(workflowDir)) {
    fail('Missing .agent/workflows directory', failures);
    return;
  }
  const numberedMainline = new Set([
    '00-Discover.md',
    '10-Define.md',
    '20-Spec.md',
    '30-Plan.md',
    '40-Implement.md',
    '50-Verify.md',
    '60-Release.md',
    '70-Report.md'
  ]);
  const files = fs.readdirSync(workflowDir)
    .filter((name) => name.endsWith('.md') && name !== 'README.md');
  const invalid = [];

  for (const name of files) {
    const isNumbered = /^\d{2}-[A-Za-z0-9][A-Za-z0-9-]*\.md$/.test(name);
    const isUnnumbered = /^[A-Za-z0-9][A-Za-z0-9-]*\.md$/.test(name);

    if (numberedMainline.has(name)) {
      if (!isNumbered) invalid.push(`${name} (mainline workflows must keep numbering)`);
      continue;
    }

    if (isNumbered) {
      invalid.push(`${name} (non-mainline workflows must not use numbering)`);
      continue;
    }

    if (!isUnnumbered) {
      invalid.push(`${name} (workflow filename format is invalid)`);
    }
  }

  if (invalid.length) {
    fail(`Workflow naming is invalid under DevFlow 2.0:\n  ${invalid.join('\n  ')}`, failures);
  } else {
    ok(`Workflow naming passed for ${files.length} workflow files`);
  }
}

function validateReportNamingConvention(failures) {
  const targetDirs = [
    '.workspaces/research',
    '.workspaces/reports',
    '.workspaces/debug',
    '.workspaces/benchmarks',
    '.workspaces/prds',
    '.workspaces/issues'
  ];

  const allowedLegacyReports = new Set([
    'research/brainstorm-claude-code-goal.md',
    'research/brainstorm-date-prefixed-reports.md',
    'research/brainstorm-human-action-command-split.md',
    'research/brainstorm-markdown-first-devflow-mode.md',
    'research/brainstorm-new-system-requirements-interview-agent-skill.md',
    'research/brainstorm-soul-md.md',
    'research/brainstorm-test-first-implementation-flow.md',
    'research/brainstorm-universal-interview-skill.md',
    'research/Claude Code_goal.md',
    'research/implementation_plan_goal.md',
    'reports/project_evaluation_2026-05-21.md',
    'reports/project_evaluation_fix_report_2026-05-21.md',
    'reports/project_re_evaluation_2026-05-21.md',
    'reports/project_re_evaluation_fix_report_2026-05-21.md',
    'reports/project_re_evaluation_round3_2026-05-21.md',
    'reports/spec_orchestration-dashboard_upgrade.md',
    'prds/dashboard-upgrade.prd.md'
  ]);

  const datePrefixRegex = /^\d{4}-\d{2}-\d{2}-.*\.md$/i;
  let checkedCount = 0;
  const invalidFiles = [];

  for (const relativeDir of targetDirs) {
    const dirPath = path.join(projectRoot, relativeDir);
    if (!fs.existsSync(dirPath)) continue;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const cleanDir = relativeDir.replace('.workspaces/', '');
        const normalizedPath = `${cleanDir}/${entry.name}`;
        if (allowedLegacyReports.has(normalizedPath)) continue;

        checkedCount++;
        if (!datePrefixRegex.test(entry.name)) {
          invalidFiles.push(`${relativeDir}/${entry.name}`);
        }
      }
    }
  }

  if (invalidFiles.length > 0) {
    fail(`Report files must start with yyyy-mm-dd- prefix:\n  ${invalidFiles.join('\n  ')}`, failures);
  } else if (checkedCount > 0) {
    ok(`Report naming convention passed for ${checkedCount} files`);
  } else {
    ok('No new report files to validate');
  }
}

function validateStageArtifactConventions(failures) {
  const filesToCheck = [
    '.agent/workflows/00-Discover.md',
    '.agent/workflows/10-Define.md',
    '.agent/workflows/20-Spec.md',
    '.agent/workflows/30-Plan.md',
    '.agent/workflows/40-Implement.md',
    '.agent/workflows/50-Verify.md',
    '.agent/workflows/60-Release.md',
    '.agent/workflows/70-Report.md',
    '.agent/resources/schemas/discover.template.md',
    '.agent/resources/schemas/define.template.md',
    '.agent/resources/schemas/spec.template.md',
    '.agent/resources/schemas/implement.template.md',
    '.agent/resources/schemas/verify.template.md',
    '.agent/resources/schemas/verify-impact.template.md',
    '.agent/resources/schemas/release.template.md',
    '.agent/resources/schemas/report.template.md',
    'docs/quickstart.md',
    'docs/workspace-artifacts.md'
  ];
  const forbiddenPhrases = ['เจ้านาย', 'boss ordered', 'boss request'];
  const legacyStagePaths = [
    '/00-discover/discover.md',
    '/10-define/define.md',
    '/20-spec/spec.md',
    '/30-plan/plan.md',
    '/40-implement/implement.md',
    '/50-verify/verify.md',
    '/60-release/release.md',
    '/70-report/report.md'
  ];
  const requiredStageNames = [
    '00-discover.md',
    '10-define.md',
    '20-spec.md',
    '30-plan.md',
    '40-implement.md',
    '50-verify.md',
    '60-release.md',
    '70-report.md'
  ];

  for (const relativePath of filesToCheck) {
    const content = readText(relativePath, failures);
    if (!content) continue;

    for (const phrase of forbiddenPhrases) {
      if (content.includes(phrase)) {
        fail(`${relativePath} contains non-anonymous stakeholder wording: ${phrase}`, failures);
      }
    }

    const allowLegacyExamples = relativePath === 'docs/workspace-artifacts.md';
    for (const legacyPath of legacyStagePaths) {
      if (!allowLegacyExamples && content.includes(legacyPath)) {
        fail(`${relativePath} still references legacy nested stage path: ${legacyPath}`, failures);
      }
    }
  }

  const workspaceDocs = readText('docs/workspace-artifacts.md', failures);
  if (workspaceDocs) {
    for (const stageName of requiredStageNames) {
      if (!workspaceDocs.includes(stageName)) {
        fail(`docs/workspace-artifacts.md must mention stage artifact ${stageName}`, failures);
      }
    }
  }

  ok('Stage artifact naming and anonymous wording checks passed');
}

function validateArtifactLanguageContracts(failures) {
  const schemasDir = path.join(projectRoot, '.agent', 'resources', 'schemas');
  const validLanguages = new Set(['th', 'en']);
  const templateFiles = fs.readdirSync(schemasDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.template.md'))
    .map((entry) => path.join(schemasDir, entry.name));

  for (const filePath of templateFiles) {
    const relativePath = path.relative(projectRoot, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^artifact_language:\s*"(.*)"\s*$/m);
    if (!match) {
      fail(`${relativePath} is missing required frontmatter field: artifact_language`, failures);
      continue;
    }
    if (!validLanguages.has(match[1])) {
      fail(`${relativePath} has unsupported artifact_language "${match[1]}"`, failures);
    }
  }

  ok(`Artifact language contract passed for ${templateFiles.length} template file(s)`);
}

function validateArtifactLanguageWorkflowSurface(failures) {
  const workflowFiles = [
    '.agent/workflows/00-Discover.md',
    '.agent/workflows/10-Define.md',
    '.agent/workflows/20-Spec.md',
    '.agent/workflows/30-Plan.md',
    '.agent/workflows/40-Implement.md',
    '.agent/workflows/50-Verify.md',
    '.agent/workflows/60-Release.md',
    '.agent/workflows/70-Report.md',
    '.agent/resources/schemas/SCHEMA.md',
    '.agent/resources/schemas/README.md',
    'docs/quickstart.md',
    'docs/workspace-artifacts.md'
  ];

  for (const relativePath of workflowFiles) {
    const content = readText(relativePath, failures);
    if (!content) continue;
    if (!content.includes('artifact_language')) {
      fail(`${relativePath} must mention artifact_language`, failures);
    }
  }

  ok('Artifact language workflow/docs surface is aligned');
}

function validateStageLocalLoopContracts(failures) {
  const loopEnabledWorkflows = [
    '.agent/workflows/30-Plan.md',
    '.agent/workflows/40-Implement.md',
    '.agent/workflows/50-Verify.md'
  ];
  const requiredMarkers = [
    '### Loop Contract',
    'Intent',
    'Context',
    'Action',
    'Observation',
    'Adjustment',
    'Stop Condition',
    'Handoff'
  ];

  for (const relativePath of loopEnabledWorkflows) {
    const content = readText(relativePath, failures);
    if (!content) continue;

    for (const marker of requiredMarkers) {
      if (!content.includes(marker)) {
        fail(`${relativePath} is missing stage-local loop contract marker: ${marker}`, failures);
      }
    }
  }

  ok(`Stage-local loop contract validation passed for ${loopEnabledWorkflows.length} workflow file(s)`);
}

function validateSkillSelectionPolicySurface(failures) {
  const requiredDocs = [
    'docs/skill-selection-policy.md',
    'docs/mattpocock-skills-devflow-mapping.md',
    'docs/mattpocock-skills-import-plan.md'
  ];

  for (const relativePath of requiredDocs) {
    if (!fs.existsSync(path.join(projectRoot, relativePath))) {
      fail(`Missing skill selection policy surface: ${relativePath}`, failures);
    }
  }

  const routingSkill = readText('.agent/skills/intelligent-routing/SKILL.md', failures);
  if (routingSkill && !routingSkill.includes('docs/skill-selection-policy.md')) {
    fail('.agent/skills/intelligent-routing/SKILL.md must reference docs/skill-selection-policy.md', failures);
  }

  const agents = readText('AGENTS.md', failures);
  if (agents && !agents.includes('docs/skill-selection-policy.md')) {
    fail('AGENTS.md must reference docs/skill-selection-policy.md near reusable skill guidance', failures);
  }

  validateImportedSupportSkills(failures);
  validateWorkflowSupportSkillHints(failures);
  ok('Skill selection policy surface is aligned');
}

function validateImportedSupportSkills(failures) {
  const importedSkills = [
    'grill-with-docs',
    'domain-modeling',
    'codebase-design',
    'diagnosing-bugs',
    'tdd',
    'review',
    'handoff',
    'writing-great-skills',
    'to-prd',
    'to-issues',
    'prototype',
    'triage'
  ];
  const forbiddenSlashCommands = [
    'grilling',
    'grill-with-docs',
    'domain-modeling',
    'codebase-design',
    'setup-matt-pocock-skills',
    'to-prd',
    'to-issues',
    'triage',
    'implement',
    'review'
  ];
  const allowedNumberedStages = new Set([
    '/00-Discover',
    '/10-Define',
    '/20-Spec',
    '/30-Plan',
    '/40-Implement',
    '/50-Verify',
    '/60-Release',
    '/70-Report'
  ]);

  for (const skillName of importedSkills) {
    const skillPath = `.agent/skills/${skillName}/SKILL.md`;
    const absoluteSkillPath = path.join(projectRoot, skillPath);
    if (!fs.existsSync(absoluteSkillPath)) {
      fail(`Imported support skill is missing: ${skillPath}`, failures);
      continue;
    }

    const content = fs.readFileSync(absoluteSkillPath, 'utf8');
    const numberedStageRefs = [...content.matchAll(/\/\d{2}-[A-Z][A-Za-z0-9-]+/g)].map((match) => match[0]);
    for (const stageRef of numberedStageRefs) {
      if (!allowedNumberedStages.has(stageRef)) {
        fail(`${skillPath} references unsupported numbered workflow route: ${stageRef}`, failures);
      }
    }

    for (const commandName of forbiddenSlashCommands) {
      const slashCommandPattern = new RegExp(`(^|[^A-Za-z0-9._-])/${escapeRegExp(commandName)}([^A-Za-z0-9._-]|$)`);
      if (slashCommandPattern.test(content)) {
        fail(`${skillPath} references upstream slash command /${commandName}; use DevFlow stage, companion, or bare skill names instead`, failures);
      }
    }
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validateWorkflowSupportSkillHints(failures) {
  const workflowDir = path.join(projectRoot, '.agent', 'workflows');
  if (!fs.existsSync(workflowDir)) return;

  const files = fs.readdirSync(workflowDir)
    .filter((name) => name.endsWith('.md') && name !== 'README.md');
  const maxSupportSkillsPerHint = 5;

  for (const name of files) {
    const relativePath = `.agent/workflows/${name}`;
    const content = readText(relativePath, failures);
    if (!content) continue;

    for (const line of content.split(/\r?\n/)) {
      if (!/support skills?:/i.test(line)) continue;
      const supportPart = line.split(/support skills?:/i).pop() || '';
      const matches = [...supportPart.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
      const supportSkillCount = matches.filter((item) => !item.startsWith('/')).length;
      if (supportSkillCount > maxSupportSkillsPerHint) {
        fail(`${relativePath} lists ${supportSkillCount} support skills in one hint; keep hints bounded to ${maxSupportSkillsPerHint} or fewer`, failures);
      }
    }
  }
}

function validateVerifyImpactContracts(failures) {
  const specsRoot = path.join(projectRoot, '.workspaces', 'specs');
  if (!fs.existsSync(specsRoot)) {
    ok('No spec workspaces found for verify impact validation');
    return;
  }

  const requiredHeadingsAlternatives = [
    ['## 1. Changed Files', '## 1. ไฟล์ที่มีการเปลี่ยนแปลง (Changed Files)'],
    ['## 2. Client Impact Analysis', '## 2. การวิเคราะห์ผลกระทบต่อผู้ใช้งาน (Client Impact Analysis)'],
    ['## 3. Verification Metrics', '## 3. ข้อมูลการยืนยันและการตรวจสอบ (Verification Metrics)'],
    ['### A. Unit Verification', '### ก. การตรวจสอบระบบแบบรายชิ้น (Unit Verification)', '### ก. การตรวจสอบการทำงานรายหน่วย (Unit Verification)'],
    ['### B. Integration Verification', '### ข. การตรวจสอบระบบร่วมกัน (Integration Verification)', '### ข. การตรวจสอบความสอดคล้องและการเชื่อมต่อ (Integration Verification)'],
    ['## 4. Rollback & Mitigation Plan', '## 4. แผนย้อนคืนและการลดความเสี่ยง (Rollback & Mitigation Plan)']
  ];
  let checkedRuns = 0;

  for (const entry of fs.readdirSync(specsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const runDir = path.join(specsRoot, entry.name);
    const relRun = path.relative(projectRoot, runDir);
    const verifyPath = path.join(runDir, '50-verify.md');
    const impactPath = path.join(runDir, '50-verify-impact.md');
    if (!fs.existsSync(impactPath)) continue;

    checkedRuns++;
    if (!fs.existsSync(verifyPath)) {
      fail(`${relRun}: 50-verify-impact.md exists but required stage artifact is missing: 50-verify.md`, failures);
      continue;
    }

    const content = fs.readFileSync(impactPath, 'utf8');
    for (const alts of requiredHeadingsAlternatives) {
      const found = alts.some((heading) => content.includes(heading));
      if (!found) {
        fail(`${relRun}: 50-verify-impact.md is missing required heading: ${alts[0]}`, failures);
      }
    }
  }

  ok(`Verify impact artifact validation passed for ${checkedRuns} run(s) with impact reports`);
}

function validateVerifyImpactSurface(failures) {
  const requiredMentions = [
    '.agent/workflows/50-Verify.md',
    '.agent/resources/schemas/verify.template.md',
    '.agent/resources/schemas/README.md',
    'docs/workspace-artifacts.md',
    'docs/quickstart.md'
  ];

  for (const relativePath of requiredMentions) {
    const content = readText(relativePath, failures);
    if (!content) continue;
    if (!content.includes('50-verify-impact.md')) {
      fail(`${relativePath} must mention 50-verify-impact.md`, failures);
    }
  }

  ok('Verify impact workflow/template/docs surface is aligned');
}

function validateChecklistContracts(failures) {
  const specsRoot = path.join(projectRoot, '.workspaces', 'specs');
  if (!fs.existsSync(specsRoot)) {
    ok('No spec workspaces found for checklist validation');
    return;
  }

  const allowedStatuses = new Set(['pending', 'in_progress', 'blocked', 'done', 'skipped', 'complete', 'completed', 'released']);
  let checkedRuns = 0;

  for (const entry of fs.readdirSync(specsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const runDir = path.join(specsRoot, entry.name);
    const relRun = path.relative(projectRoot, runDir);
    const planPath = path.join(runDir, '30-plan.md');
    const implementPath = path.join(runDir, '40-implement.md');
    const verifyPath = path.join(runDir, '50-verify.md');
    const reportMdPath = path.join(runDir, '70-report.md');
    const reportHtmlPath = path.join(runDir, '70-report.html');
    const checklistDir = path.join(runDir, 'checklists');

    if (fs.existsSync(reportMdPath) && !fs.existsSync(reportHtmlPath)) {
      fail(`${relRun}: 70-report.md exists but 70-report.html is missing. Run \`npm.cmd run report:html -- ${entry.name}\``, failures);
    }

    if (!fs.existsSync(checklistDir)) continue;
    checkedRuns++;

    if (!fs.existsSync(planPath)) {
      fail(`${relRun}: checklist directory exists but 30-plan.md is missing`, failures);
    }

    const checklistFiles = [
      { name: 'implementation-checklist.md', requires: implementPath },
      { name: 'verification-checklist.md', requires: verifyPath }
    ];

    for (const item of checklistFiles) {
      const filePath = path.join(checklistDir, item.name);
      if (!fs.existsSync(filePath)) continue;

      if (!fs.existsSync(item.requires)) {
        fail(`${relRun}: ${item.name} exists but required stage artifact is missing: ${path.basename(item.requires)}`, failures);
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const checklistValidation = validateChecklistContent(content, allowedStatuses);
      if (!checklistValidation.ok) {
        fail(`${relRun}: ${item.name} ${checklistValidation.message}`, failures);
      }
    }
  }

  ok(`Checklist contract validation passed for ${checkedRuns} run(s) with checklist directories`);
}

function validateChecklistContent(content, allowedStatuses) {
  const lines = content.split(/\r?\n/);
  let sawTableHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const header = lines[i].trim();
    const divider = lines[i + 1]?.trim() || '';
    if (!header.startsWith('|') || !divider.startsWith('|')) continue;
    if (!/^\|\s*[:\- ]+\|/.test(divider)) continue;

    const headers = header.split('|').slice(1, -1).map((cell) => cell.trim().toLowerCase());
    let statusIndex = headers.indexOf('status');
    if (statusIndex === -1) {
      statusIndex = headers.indexOf('สถานะ');
    }
    if (statusIndex === -1) continue;

    sawTableHeader = true;
    i += 2;
    let rowCount = 0;

    while (i < lines.length && lines[i].trim().startsWith('|')) {
      rowCount++;
      const cells = lines[i].split('|').slice(1, -1).map((cell) => cell.trim());
      const status = (cells[statusIndex] || '').toLowerCase().trim().replace(/`/g, '');
      if (!status) {
        return { ok: false, message: `contains a checklist row with empty status` };
      }
      if (!allowedStatuses.has(status)) {
        return { ok: false, message: `contains unsupported status "${status}"` };
      }
      i++;
    }

    if (rowCount === 0) {
      return { ok: false, message: `contains a checklist table with no data rows` };
    }

    return { ok: true };
  }

  if (sawTableHeader) {
    return { ok: false, message: `contains a checklist table with no data rows` };
  }

  return validateChecklistLines(lines, allowedStatuses);
}

function validateChecklistLines(lines, allowedStatuses) {
  const supportedMarkers = new Set([' ', 'x', 'X', '/', '~', '!', '-']);
  let rowCount = 0;
  let sawChecklistLikeLine = false;

  for (const line of lines) {
    const markerMatch = line.match(/^\s*-\s*\[(.)\]\s+(.+)$/);
    if (!markerMatch) continue;

    sawChecklistLikeLine = true;
    const marker = markerMatch[1];
    if (!supportedMarkers.has(marker)) {
      return { ok: false, message: `contains unsupported checklist marker "[${marker}]"` };
    }

    rowCount++;
    const explicitStatus = markerMatch[2].match(/\((pending|in[_ -]?progress|blocked|skipped|done|complete|completed|released)\)\s*$/i);
    if (!explicitStatus) continue;

    const normalizedStatus = explicitStatus[1].toLowerCase().replace(/[ -]/g, '_');
    if (!allowedStatuses.has(normalizedStatus)) {
      return { ok: false, message: `contains unsupported status "${normalizedStatus}"` };
    }
  }

  if (rowCount === 0) {
    if (sawChecklistLikeLine) {
      return { ok: false, message: `contains checklist lines but no valid checklist rows` };
    }
    return { ok: false, message: `does not contain a markdown table with a Status column or checklist lines` };
  }

  return { ok: true };
}

function main() {
  const failures = [];
  generateProjectIndex(projectRoot);
  const seenRequired = new Set();

  for (const item of [...requiredPaths, ...requiredRoadmapPaths()]) {
    if (seenRequired.has(item)) continue;
    seenRequired.add(item);
    if (!fs.existsSync(path.join(projectRoot, item))) fail(`Missing required path: ${item}`, failures);
    else ok(`Found ${item}`);
  }

  for (const item of forbiddenPaths) {
    if (fs.existsSync(path.join(projectRoot, item))) fail(`Forbidden legacy path exists: ${item}`, failures);
    else ok(`Legacy path absent: ${item}`);
  }

  validateRoadmap(failures);
  validateWorkflowNumbering(failures);
  validateReportNamingConvention(failures);
  validateStageArtifactConventions(failures);
  validateArtifactLanguageContracts(failures);
  validateArtifactLanguageWorkflowSurface(failures);
  validateStageLocalLoopContracts(failures);
  validateSkillSelectionPolicySurface(failures);
  validateChecklistContracts(failures);
  validateVerifyImpactContracts(failures);
  validateVerifyImpactSurface(failures);
  if (!roadmapOnly) scanForLegacyReferences(failures);

  if (failures.length) {
    console.error(`\nValidation failed with ${failures.length} issue(s).`);
    process.exitCode = 1;
  } else {
    console.log('\nFramework validation passed.');
  }
}

main();

