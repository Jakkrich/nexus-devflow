import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { checkSkillBudgets } from "../check-skill-budgets.mjs";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const agentsSkillsRoot = path.join(repoRoot, ".agents", "skills");

function collectSkillMarkdownFiles(...rootDirs: string[]): string[] {
  const results: string[] = [];
  for (const rootDir of rootDirs) {
    if (!fs.existsSync(rootDir)) continue;
    for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const skillDir = path.join(rootDir, entry.name);
      const skillMd = path.join(skillDir, "SKILL.md");
      if (fs.existsSync(skillMd)) {
        results.push(skillMd);
      }
      for (const sub of ["reference", "references"]) {
        const refDir = path.join(skillDir, sub);
        if (fs.existsSync(refDir)) {
          for (const refEntry of fs.readdirSync(refDir)) {
            if (refEntry.endsWith(".md")) {
              results.push(path.join(refDir, refEntry));
            }
          }
        }
      }
    }
  }
  return results;
}

const extrasSkillsRoot = path.join(repoRoot, "extras", "skills");

test("skills (including extras) do not leak developer local file:///d:/ paths", () => {
  const leaks: string[] = [];
  for (const file of collectSkillMarkdownFiles(agentsSkillsRoot, extrasSkillsRoot)) {
    const content = fs.readFileSync(file, "utf8");
    if (/file:\/\/\/[a-z]:\//i.test(content)) {
      leaks.push(path.relative(repoRoot, file));
    }
  }
  assert.deepEqual(leaks, [], `Found local drive URL leaks in: ${leaks.join(", ")}`);
});

test("skills (including extras) do not reference phantom /design or defuddle commands", () => {
  const leaks: string[] = [];
  for (const file of collectSkillMarkdownFiles(agentsSkillsRoot, extrasSkillsRoot)) {
    const content = fs.readFileSync(file, "utf8");
    if (/\/design\s+\{REQ-ID\}/.test(content) || /\bdefuddle\b/.test(content)) {
      leaks.push(path.relative(repoRoot, file));
    }
  }
  assert.deepEqual(leaks, [], `Phantom commands found in: ${leaks.join(", ")}`);
});

test("read-only and lightweight skills do not require blocking First action run-state writes", () => {
  const nonBlockingSkills = [
    "audit",
    "debug",
    "discovery",
    "analyze",
    "ci",
    "release",
    "rollback",
    "prototype",
    "setup-tests",
    "vendor"
  ];
  const extrasSkillsRoot = path.join(repoRoot, "extras", "skills");
  const offenders: string[] = [];
  for (const skill of nonBlockingSkills) {
    for (const base of [agentsSkillsRoot, extrasSkillsRoot]) {
      const file = path.join(base, skill, "SKILL.md");
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, "utf8");
      if (/\*\*First action:\*\*/.test(content)) {
        offenders.push(path.relative(repoRoot, file));
      }
    }
  }
  assert.deepEqual(offenders, [], `Blocking First action found in: ${offenders.join(", ")}`);
});

test("contextual help protocol uses lightweight chat markdown without mandatory HTML/SVG playbooks", () => {
  const helpProtocol = fs.readFileSync(
    path.join(repoRoot, "devflow", "reference", "help-playbook-protocol.md"),
    "utf8"
  );
  assert.doesNotMatch(helpProtocol, /playbooks\/\{skill\}\.html/);
  assert.doesNotMatch(helpProtocol, /Real Diagram Mandate/);

  const codingStandards = fs.readFileSync(
    path.join(repoRoot, "devflow", "context", "coding-standards.md"),
    "utf8"
  );
  assert.doesNotMatch(codingStandards, /every playbook/i);
});

test("agent-bundle.manifest.json does not hardcode browseros-neo in skill_contracts", () => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "agent-bundle.manifest.json"), "utf8")
  ) as { skill_contracts?: Record<string, string[]> };

  const offenders: string[] = [];
  for (const [skill, tokens] of Object.entries(manifest.skill_contracts ?? {})) {
    if (tokens.includes("browseros-neo")) {
      offenders.push(skill);
    }
  }
  assert.deepEqual(offenders, [], `browseros-neo hardcoded in skill_contracts: ${offenders.join(", ")}`);
});

test("overview skill guards npm run overview behind project package.json presence", () => {
  const overview = fs.readFileSync(path.join(agentsSkillsRoot, "overview", "SKILL.md"), "utf8");
  assert.match(overview, /package\.json.*overview|overview.*script/is);
  assert.match(overview, /project-overview-template\.md/);
  assert.doesNotMatch(overview, /^Run:\s*\r?\n\r?\n```bash\r?\nnpm run overview\r?\n```/m);
});

test("skills (including extras) use consistent npx nexus-devflow skill add/update CLI command", () => {
  const inconsistent: string[] = [];
  for (const file of collectSkillMarkdownFiles(agentsSkillsRoot, extrasSkillsRoot)) {
    const content = fs.readFileSync(file, "utf8");
    if (/npx\s+(?:@jakkrichm\/)?create-nexus-devflow\s+skill\s+(?:add|update)/.test(content)) {
      inconsistent.push(path.relative(repoRoot, file));
    }
  }
  assert.deepEqual(inconsistent, [], `Inconsistent skill CLI in: ${inconsistent.join(", ")}`);
});

test("115c & 131b core skills expose Adaptive /feature, 2-Track /debug, devflow-help, and devflow-mode", () => {
  const feature = fs.readFileSync(path.join(agentsSkillsRoot, "feature", "SKILL.md"), "utf8");
  assert.match(feature, /--preview/);
  assert.match(feature, /Adaptive Pre-Flight Clarification/i);

  const debug = fs.readFileSync(path.join(agentsSkillsRoot, "debug", "SKILL.md"), "utf8");
  assert.match(debug, /Track A/i);
  assert.match(debug, /Track B/i);

  const devflowHelp = fs.readFileSync(path.join(agentsSkillsRoot, "devflow-help", "SKILL.md"), "utf8");
  assert.match(devflowHelp, /doctor/);
  assert.match(devflowHelp, /Legacy Command Routing/i);

  const devflowMode = fs.readFileSync(path.join(agentsSkillsRoot, "devflow-mode", "SKILL.md"), "utf8");
  assert.match(devflowMode, /--all/);
  assert.match(devflowMode, /autonomous-queue\.md/);
  assert.doesNotMatch(devflowMode, /(?<![\w.])\/try(?![-\w])/);

  const workflow = fs.readFileSync(path.join(repoRoot, "devflow", "workflow.md"), "utf8");
  assert.doesNotMatch(workflow, /\/devflow-doctor|\/devflow-status|\/continuous\b/);
});

test("extras/skills/browseros-neo satisfies skill budgets and E2E test-plan/evidence contracts", () => {
  const budgetResult = checkSkillBudgets(extrasSkillsRoot);
  assert.deepEqual(
    budgetResult.violations,
    [],
    `extras/skills budget violations: ${budgetResult.violations.join("; ")}`
  );

  const skillPath = path.join(extrasSkillsRoot, "browseros-neo", "SKILL.md");
  const templatePath = path.join(extrasSkillsRoot, "browseros-neo", "reference", "e2e-templates.md");
  assert.equal(fs.existsSync(skillPath), true, "extras/skills/browseros-neo/SKILL.md must exist");
  assert.equal(fs.existsSync(templatePath), true, "extras/skills/browseros-neo/reference/e2e-templates.md must exist");

  const skill = fs.readFileSync(skillPath, "utf8");
  assert.match(skill, /name_session/);
  assert.match(skill, /devflow\/reports\/\{run-id\}\/browser-test-plan\.md/);
  assert.match(skill, /devflow\/reports\/\{run-id\}\/evidence\.md/);
  assert.match(skill, /E2E Test/i);
  assert.match(skill, /E2E Debug/i);
  assert.doesNotMatch(skill, /recordVideo/);
});

test("extras/skills/verify-harness satisfies skill budgets and verification harness contracts", () => {
  const budgetResult = checkSkillBudgets(extrasSkillsRoot);
  assert.deepEqual(
    budgetResult.violations,
    [],
    `extras/skills budget violations: ${budgetResult.violations.join("; ")}`
  );

  const skillPath = path.join(extrasSkillsRoot, "verify-harness", "SKILL.md");
  const templatePath = path.join(extrasSkillsRoot, "verify-harness", "reference", "harness-template.md");
  assert.equal(fs.existsSync(skillPath), true, "extras/skills/verify-harness/SKILL.md must exist");
  assert.equal(fs.existsSync(templatePath), true, "extras/skills/verify-harness/reference/harness-template.md must exist");

  const skill = fs.readFileSync(skillPath, "utf8");
  assert.match(skill, /Launch/);
  assert.match(skill, /Doctor/);
  assert.match(skill, /Drive/);
  assert.match(skill, /Evidence/);
  assert.match(skill, /Cleanup/);
  assert.doesNotMatch(skill, /\.cursor\b/);
});

test("131a autonomous feature-branch policies are present across feature, implement, audit, and complete", () => {
  const feature = fs.readFileSync(path.join(agentsSkillsRoot, "feature", "SKILL.md"), "utf8");
  assert.match(feature, /execution\.autoApproveSpec/);

  const implement = fs.readFileSync(path.join(agentsSkillsRoot, "implement", "SKILL.md"), "utf8");
  assert.match(implement, /execution\.autoCommitFeatureBranch/);
  assert.match(implement, /execution\.engine/);
  assert.match(implement, /option-a-evidence-packet/);

  const reviewRef = fs.readFileSync(
    path.join(agentsSkillsRoot, "audit", "reference", "independent-review.md"),
    "utf8"
  );
  assert.match(reviewRef, /execution\.autoCommitFeatureBranch/);

  const complete = fs.readFileSync(path.join(agentsSkillsRoot, "complete", "SKILL.md"), "utf8");
  assert.match(complete, /delivery\.gate/);
  assert.match(complete, /option-a-evidence-packet/);

  const devflowHelp = fs.readFileSync(path.join(agentsSkillsRoot, "devflow-help", "SKILL.md"), "utf8");
  assert.match(devflowHelp, /execution/);
  assert.match(devflowHelp, /delivery\.gate/);
});

test("131b devflow-mode, devflow-help, bundled playbooks, and pstack adapter contracts", () => {
  for (const name of ["feature.md", "bug-fix.md", "refactor.md", "discovery.md", "autonomous-queue.md"]) {
    const pbPath = path.join(agentsSkillsRoot, "devflow-mode", "playbooks", name);
    assert.equal(fs.existsSync(pbPath), true, `Missing bundled playbook: ${name}`);
  }

  const adaptersRef = fs.readFileSync(
    path.join(agentsSkillsRoot, "devflow-mode", "reference", "platform-adapters.md"),
    "utf8"
  );
  for (const runtime of ["Antigravity", "Claude Code", "Codex", "Copilot", "OpenCode", "pstack"]) {
    assert.match(adaptersRef, new RegExp(runtime, "i"));
  }

  const devflowHelp = fs.readFileSync(path.join(agentsSkillsRoot, "devflow-help", "SKILL.md"), "utf8");
  assert.match(devflowHelp, /Interactive Guide & Prompt Builder/i);
  assert.match(devflowHelp, /Legacy Command Routing/i);
  assert.equal(
    fs.existsSync(path.join(agentsSkillsRoot, "devflow-help", "scripts", "run-state.mjs")),
    true
  );

  const budgetResult = checkSkillBudgets(agentsSkillsRoot);
  assert.deepEqual(budgetResult.violations, [], `Budget violations: ${budgetResult.violations.join("; ")}`);
});
