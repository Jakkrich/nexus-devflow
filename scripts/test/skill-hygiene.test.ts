import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const agentsSkillsRoot = path.join(repoRoot, ".agents", "skills");

function collectSkillMarkdownFiles(rootDir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillDir = path.join(rootDir, entry.name);
    const skillMd = path.join(skillDir, "SKILL.md");
    if (fs.existsSync(skillMd)) {
      results.push(skillMd);
    }
    const refDir = path.join(skillDir, "reference");
    if (fs.existsSync(refDir)) {
      for (const refEntry of fs.readdirSync(refDir)) {
        if (refEntry.endsWith(".md")) {
          results.push(path.join(refDir, refEntry));
        }
      }
    }
  }
  return results;
}

test("skills do not leak developer local file:///d:/ paths", () => {
  const leaks: string[] = [];
  for (const file of collectSkillMarkdownFiles(agentsSkillsRoot)) {
    const content = fs.readFileSync(file, "utf8");
    if (/file:\/\/\/[a-z]:\//i.test(content)) {
      leaks.push(path.relative(repoRoot, file));
    }
  }
  assert.deepEqual(leaks, [], `Found local drive URL leaks in: ${leaks.join(", ")}`);
});

test("skills do not reference phantom /design or defuddle commands", () => {
  const analyzePath = path.join(agentsSkillsRoot, "analyze", "SKILL.md");
  const content = fs.readFileSync(analyzePath, "utf8");
  assert.doesNotMatch(content, /\/design\s+\{REQ-ID\}/);
  assert.doesNotMatch(content, /\bdefuddle\b/);
});

test("read-only and lightweight skills do not require blocking First action run-state writes", () => {
  const nonBlockingSkills = [
    "audit",
    "debug",
    "discovery",
    "analyze",
    "vendor",
    "ci",
    "release",
    "rollback",
    "prototype",
    "setup-tests",
    "browser-tests"
  ];
  const offenders: string[] = [];
  for (const skill of nonBlockingSkills) {
    const file = path.join(agentsSkillsRoot, skill, "SKILL.md");
    const content = fs.readFileSync(file, "utf8");
    if (/\*\*First action:\*\*/.test(content)) {
      offenders.push(skill);
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

  const ponytail = fs.readFileSync(path.join(agentsSkillsRoot, "ponytail", "SKILL.md"), "utf8");
  assert.doesNotMatch(ponytail, /devflow\/docs\/playbooks\/ponytail\.html/);
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

test("overview and report-html skills do not assume nexus-devflow repo npm scripts exist in user projects", () => {
  const overview = fs.readFileSync(path.join(agentsSkillsRoot, "overview", "SKILL.md"), "utf8");
  assert.match(overview, /package\.json.*overview|overview.*script/is);
  assert.match(overview, /project-overview-template\.md/);
  assert.doesNotMatch(overview, /^Run:\s*\r?\n\r?\n```bash\r?\nnpm run overview\r?\n```/m);

  const reportHtml = fs.readFileSync(path.join(agentsSkillsRoot, "report-html", "SKILL.md"), "utf8");
  assert.match(reportHtml, /package\.json|declared/i);
});

test("skills use consistent npx nexus-devflow skill add CLI command", () => {
  const inconsistent: string[] = [];
  for (const file of collectSkillMarkdownFiles(agentsSkillsRoot)) {
    const content = fs.readFileSync(file, "utf8");
    if (/npx\s+(?:@jakkrichm\/)?create-nexus-devflow\s+skill\s+add/.test(content)) {
      inconsistent.push(path.relative(repoRoot, file));
    }
  }
  assert.deepEqual(inconsistent, [], `Inconsistent skill add CLI in: ${inconsistent.join(", ")}`);
});
