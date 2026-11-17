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
  const leaks: string[] = [];
  for (const file of collectSkillMarkdownFiles(agentsSkillsRoot)) {
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

test("skills use consistent npx nexus-devflow skill add/update CLI command", () => {
  const inconsistent: string[] = [];
  for (const file of collectSkillMarkdownFiles(agentsSkillsRoot)) {
    const content = fs.readFileSync(file, "utf8");
    if (/npx\s+(?:@jakkrichm\/)?create-nexus-devflow\s+skill\s+(?:add|update)/.test(content)) {
      inconsistent.push(path.relative(repoRoot, file));
    }
  }
  assert.deepEqual(inconsistent, [], `Inconsistent skill CLI in: ${inconsistent.join(", ")}`);
});

test("115c consolidated skills expose Adaptive /feature, 2-Track /debug, unified /devflow, and /autopilot --all", () => {
  const feature = fs.readFileSync(path.join(agentsSkillsRoot, "feature", "SKILL.md"), "utf8");
  assert.match(feature, /--preview/);
  assert.match(feature, /Adaptive Pre-Flight Clarification/i);

  const debug = fs.readFileSync(path.join(agentsSkillsRoot, "debug", "SKILL.md"), "utf8");
  assert.match(debug, /Track A/i);
  assert.match(debug, /Track B/i);

  const devflow = fs.readFileSync(path.join(agentsSkillsRoot, "devflow", "SKILL.md"), "utf8");
  assert.match(devflow, /doctor/);
  assert.match(devflow, /Legacy Command Routing/i);

  const autopilot = fs.readFileSync(path.join(agentsSkillsRoot, "autopilot", "SKILL.md"), "utf8");
  assert.match(autopilot, /--all/);
  assert.match(autopilot, /continuous-loop\.md/);
});
