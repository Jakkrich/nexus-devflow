import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillsDir = path.resolve(__dirname, '../.agents/skills');

const CUSTOM_DESCRIPTIONS = {
  'debug': '[Devflow] Root cause investigation and diagnostic loop before or during implementation without editing code. Use when encountering broken behavior, test failures, or bugs.',
  'test': '[Devflow] Test execution, missing test generation, and coverage analysis across unit, integration, and smoke test suites.',
  'prd': '[Devflow] Product Requirements Document drafting, user story mapping, and feature scoping before delivery commitment.',
  'simplify': '[Devflow] Code simplification and refactoring for clarity and maintainability without altering runtime behavior.',
  'preview': '[Devflow] Local preview server management, smoke-check, and temporary runtime inspection before formal verification.',
  'goal': '[Devflow] High-level goal routing and open-ended request intake before entering the 00-discover stage.',
  'followup': '[Devflow] Followup task tracking, post-verification iteration, and routing unresolved items to subsequent runs.',
  'changelog': '[Devflow] Update CHANGELOG.md automatically from specs, git commits, and stage report history.',
  'deploy': '[Devflow] Production deployment pre-flight checks, smoke validation, and deployment execution.',
  'pr': '[Devflow] Pull Request creation with automated change summaries, verification evidence, and linked stage artifacts.',
  'merge': '[Devflow] Safe PR branch merge into base branch, cleanup, and release readiness check.',
  'insight': '[Devflow] Extract reusable lessons, patterns, file insights, and post-mortem learning from completed work.',
  'agent': '[Devflow] Invoke specialist persona or role-based agent on a target file, folder, stage artifact, or concern.',
  'brainstorm': '[Devflow] Structured divergent and convergent ideation for features and ideas without allocating running IDs.',
  'research': '[Devflow] Deep codebase or web research with source-backed citations to support discovery and spec stages.',
  'issue-triage': '[Devflow] Intake, categorize, and prioritize incoming issues and bug reports before delivery commitment.',
  'security-review': '[Devflow] High-severity security code review and vulnerability audit for folders, projects, files, or diffs.',
  'wiki': '[Devflow] Knowledge base management, ingestion, linting, and querying under devflow/wiki/.',
  'check-for-updates': '[Devflow] Verify, inspect, and upgrade Nexus-DevFlow workspace configuration and adapters.',
  'help': '[Devflow] DevFlow 2.0 help, routing guide, workflow sitemap, and process navigation.',
  'onboard': '[Devflow] Set up Nexus-DevFlow after overlaying it onto a freshly scaffolded or early-stage project.',
  'adopt': '[Devflow] Survey existing brownfield codebase and bootstrap DevFlow context files.',
  'doctor': '[Devflow] Read-only DevFlow health check and diagnostics for context files, adapters, commands, and workflow drift.',
  'try': '[Devflow] Generate human manual QA review walkthrough guide (where to go, what to click, what to expect).',
  'rollback': '[Devflow] Plan safe feature or run reversal with dependency and commit risk analysis.',
  'ci': '[Devflow] Set up automated GitHub Actions CI workflow (.github/workflows/verify.yml) aligned with project verify command.',
  'brief': '[Devflow] Read-only scope, dependency, and risk pre-briefing before speccing a run.',
  'autopilot': '[Devflow] Optional explicit mode for one bounded spec/plan/implement/verify/report pass with checkpoint commits and review packet.',
  'devflow': '[Devflow] Flagship interactive guide, state inspector, and intent router for DevFlow workflows.',
  '00-discover': '[Devflow] Discover stage in DevFlow 2.0 - explore a request, route supporting inquiry, and decide whether delivery work should begin without allocating a running ID.',
  '10-define': '[Devflow] Define stage in DevFlow 2.0 - turn an approved discovery into one or more bounded delivery runs with stable scope.',
  '20-spec': '[Devflow] Spec stage in DevFlow 2.0 - write the formal markdown-first specification from a stable definition.',
  '30-plan': '[Devflow] Plan stage in DevFlow 2.0 - transform 20-spec.md into an executable task breakdown with test decisions.',
  '40-execute': '[Devflow] Execute stage in DevFlow 2.0 - execute planned tasks incrementally with evidence and unit tests.',
  '50-verify': '[Devflow] Verify stage in DevFlow 2.0 - perform senior QA review, record evidence, and decide pass or return-to-implement.',
  '60-report': '[Devflow] Report stage in DevFlow 2.0 - produce standardized markdown and HTML summary report for the completed run.',
  '70-release': '[Devflow] Release stage in DevFlow 2.0 - package verified work for delivery, git merge, PR, or deployment.',
  'feature': '[Devflow] Fast-Track Feature stage in DevFlow (Blueprint Mode) - define, spec, plan, and create the living current-feature.md contract for new features.',
  'fix': '[Devflow] Fast-Track Fix stage in DevFlow (Blueprint Mode) - define, spec, plan, and create the living current-feature.md contract for bug fixes.'
};

const entries = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

console.log(`Processing ${entries.length} skills in ${skillsDir}...`);

let updatedCount = 0;

entries.forEach(name => {
  const skillFile = path.join(skillsDir, name, 'SKILL.md');
  if (!fs.existsSync(skillFile)) return;

  const originalContent = fs.readFileSync(skillFile, 'utf8');

  // Replace frontmatter description
  // Matches: description: <something>
  let newDesc = CUSTOM_DESCRIPTIONS[name];

  let newContent;
  if (newDesc) {
    newContent = originalContent.replace(/description:\s*([^\r\n]+)/, `description: "${newDesc}"`);
  } else {
    // Keep existing description and prefix [Devflow] if not already present
    newContent = originalContent.replace(/description:\s*([^\r\n]+)/, (match, desc) => {
      let cleanDesc = desc.trim();
      if (cleanDesc.startsWith('"') && cleanDesc.endsWith('"')) {
        cleanDesc = cleanDesc.slice(1, -1).trim();
      }
      if (cleanDesc.startsWith('[Devflow]') || cleanDesc.startsWith('[DevFlow]')) {
        cleanDesc = cleanDesc.replace(/^\[DevFlow\]/i, '[Devflow]');
      } else {
        cleanDesc = `[Devflow] ${cleanDesc}`;
      }
      return `description: "${cleanDesc}"`;
    });
  }

  if (newContent !== originalContent) {
    fs.writeFileSync(skillFile, newContent, 'utf8');
    updatedCount++;
    console.log(`Updated: ${name}`);
  }
});

console.log(`\nSuccessfully processed and updated ${updatedCount} skill files.`);
