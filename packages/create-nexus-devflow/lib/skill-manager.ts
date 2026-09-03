import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { loadCoreSkillInventory } from "./core-skill-inventory.js";

const execFileAsync = promisify(execFile);

export interface InstalledSkillRecord {
  name: string;
  source: string;
  version?: string;
  description?: string;
  installedAt: string;
  type?: "git" | "local" | "npm" | "compound-knowledge";
  referencePath?: string;
}

export interface SkillDetail {
  name: string;
  category: "core" | "third-party" | "local-extension";
  description: string;
  version?: string;
  source?: string;
  adapters: string[];
  synced: boolean;
  path: string;
}

export interface SkillListResult {
  coreSkills: SkillDetail[];
  thirdPartySkills: SkillDetail[];
  totalCount: number;
}

export interface InstallSkillOptions {
  name?: string;
  all?: boolean;
  force?: boolean;
  overrideSource?: string;
}

export type DevFlowRole = "dev" | "sa" | "full";

export const DEV_ROLE_SKILLS: readonly string[] = Object.freeze([
  "adopt", "audit", "autopilot", "brainstorm", "brief", "browser-tests",
  "bughunter", "check", "ci", "complete", "continuous", "convert-any-to-md",
  "debug", "devflow", "discovery", "doctor", "feature", "fix", "grill",
  "idea", "implement", "onboard", "overview", "prototype", "release",
  "report-html", "rollback", "setup-tests", "status", "test", "try"
]);

export const SA_ROLE_SKILLS: readonly string[] = Object.freeze([
  "analyze", "audit", "brainstorm", "brief", "bughunter", "convert-any-to-md",
  "devflow", "discovery", "doctor", "grill", "idea", "overview", "prototype",
  "report-html", "status"
]);

export const FULL_ROLE_SKILLS: readonly string[] = Object.freeze([
  "adopt", "analyze", "audit", "autopilot", "brainstorm", "brief", "browser-tests",
  "bughunter", "check", "ci", "complete", "continuous", "convert-any-to-md",
  "debug", "devflow", "discovery", "doctor", "feature", "fix", "grill",
  "idea", "implement", "onboard", "overview", "prototype", "release",
  "report-html", "rollback", "setup-tests", "status", "test", "try"
]);

export function getSkillsForRole(role: DevFlowRole, allCoreSkills?: readonly string[]): readonly string[] {
  switch (role) {
    case "sa":
      return SA_ROLE_SKILLS;
    case "full":
      return allCoreSkills || FULL_ROLE_SKILLS;
    case "dev":
    default:
      return DEV_ROLE_SKILLS;
  }
}

export interface RecommendedSkillPreset {
  source: string;
  name?: string;
  all?: boolean;
  description?: string;
}

export const KNOWN_SKILL_ALIASES: Record<
  string,
  {
    source: string;
    name?: string;
    all?: boolean;
    type?: "git" | "local" | "compound-knowledge";
    referencePath?: string;
    description?: string;
  }
> = {
  archify: {
    source: "https://github.com/tt-a1i/archify",
    description: "Interactive technical system architecture, dataflow, and sequence trace diagrams"
  },
  "diagram-design": {
    source: "https://github.com/cathrynlavery/diagram-design",
    description: "39 editorial visual diagram templates (Business, Quadrants, Timelines, Mindmaps, Radar)"
  },
  "9arm-skills": {
    source: "https://github.com/thananon/9arm-skills",
    all: true,
    description: "6 specialized skills (debug-mantra, post-mortem, qwen-agent, scrutinize, management-talk, qwenchance)"
  },
  "9arm": {
    source: "https://github.com/thananon/9arm-skills",
    all: true,
    description: "4 specialized skills (debug-mantra, post-mortem, scrutinize, management-talk)"
  },
  bughunter: {
    source: "https://github.com/elementalsouls/Claude-BugHunter",
    type: "compound-knowledge",
    referencePath: "devflow/.vendor/bughunter",
    description: "[devflow] Offensive security orchestrator & bug hunting guide"
  }
};

export const RECOMMENDED_THIRD_PARTY_SKILLS: readonly RecommendedSkillPreset[] = Object.freeze([
  {
    source: "https://github.com/tt-a1i/archify",
    description: "Interactive technical system architecture, dataflow, and sequence trace diagrams"
  },
  {
    source: "https://github.com/cathrynlavery/diagram-design",
    description: "39 editorial visual diagram templates (Business, Quadrants, Timelines, Mindmaps, Radar)"
  },
  {
    source: "https://github.com/thananon/9arm-skills",
    all: true,
    description: "4 specialized skills (debug-mantra, post-mortem, scrutinize, management-talk)"
  }
]);

export interface InstallRecommendedOptions {
  presets?: readonly RecommendedSkillPreset[];
  force?: boolean;
}

export interface UpdateRecommendedOptions {
  presets?: readonly RecommendedSkillPreset[];
}

const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MANIFEST_PATH = path.join(".nexus", "nexus-devflow.json");
const AGENT_MANIFEST_PATH = "agent-bundle.manifest.json";

export function parseSkillFrontmatter(content: string): { name?: string; description?: string; version?: string } {
  if (!content.startsWith("---")) return {};
  const parts = content.split("---");
  if (parts.length < 3) return {};

  const lines = parts[1].split("\n");
  let name: string | undefined;
  let description: string | undefined;
  let version: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("name:")) {
      name = trimmed.replace("name:", "").trim().replace(/^["']|["']$/g, "");
    } else if (trimmed.startsWith("description:")) {
      description = trimmed.replace("description:", "").trim().replace(/^["']|["']$/g, "");
    } else if (trimmed.startsWith("version:")) {
      version = trimmed.replace("version:", "").trim().replace(/^["']|["']$/g, "");
    }
  }

  // Also check metadata: version block
  const metaMatch = parts[1].match(/version:\s*["']?([^"'\r\n]+)["']?/);
  if (!version && metaMatch) {
    version = metaMatch[1].trim();
  }

  return { name, description, version };
}

export async function readDevflowManifest(projectRoot: string): Promise<Record<string, unknown> | null> {
  const fullPath = path.join(projectRoot, MANIFEST_PATH);
  try {
    const raw = await fs.readFile(fullPath, "utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

export async function writeDevflowManifest(projectRoot: string, manifest: Record<string, unknown>): Promise<void> {
  const fullPath = path.join(projectRoot, MANIFEST_PATH);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

export async function listInstalledSkills(projectRoot: string): Promise<SkillListResult> {
  let coreNameSet: ReadonlySet<string> = new Set<string>();
  try {
    const inventory = await loadCoreSkillInventory(path.join(projectRoot, AGENT_MANIFEST_PATH));
    coreNameSet = inventory.nameSet;
  } catch {
    // fallback if manifest not found
  }

  const manifest = await readDevflowManifest(projectRoot);
  const recordedThirdParty = Array.isArray(manifest?.thirdPartySkills)
    ? (manifest.thirdPartySkills as InstalledSkillRecord[])
    : [];

  const thirdPartyMap = new Map<string, InstalledSkillRecord>();
  for (const record of recordedThirdParty) {
    if (record?.name) {
      thirdPartyMap.set(record.name, record);
    }
  }

  const agentsDir = path.join(projectRoot, ".agents", "skills");
  const claudeDir = path.join(projectRoot, ".claude", "skills");

  const agentsSkills = new Set<string>();
  const claudeSkills = new Set<string>();

  try {
    const entries = await fs.readdir(agentsDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) agentsSkills.add(e.name);
    }
  } catch {
    // ignore missing dir
  }

  try {
    const entries = await fs.readdir(claudeDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) claudeSkills.add(e.name);
    }
  } catch {
    // ignore missing dir
  }

  const allNames = new Set([...agentsSkills, ...claudeSkills, ...thirdPartyMap.keys()]);
  const coreSkills: SkillDetail[] = [];
  const thirdPartySkills: SkillDetail[] = [];

  for (const name of [...allNames].sort()) {
    const inAgents = agentsSkills.has(name);
    const inClaude = claudeSkills.has(name);
    const adapters: string[] = [];
    if (inAgents) adapters.push(".agents");
    if (inClaude) adapters.push(".claude");

    const skillFilePath = inAgents
      ? path.join(agentsDir, name, "SKILL.md")
      : path.join(claudeDir, name, "SKILL.md");

    let description = "";
    let version = "";

    try {
      const content = await fs.readFile(skillFilePath, "utf8");
      const meta = parseSkillFrontmatter(content);
      description = meta.description || "";
      version = meta.version || "";
    } catch {
      // no readable SKILL.md
    }

    const recorded = thirdPartyMap.get(name);
    const isCore = coreNameSet.has(name);

    let category: SkillDetail["category"] = "local-extension";
    if (isCore) {
      category = "core";
    } else if (recorded) {
      category = "third-party";
    }

    const detail: SkillDetail = {
      name,
      category,
      description: description || recorded?.description || "",
      version: version || recorded?.version,
      source: recorded?.source,
      adapters,
      synced: inAgents && inClaude,
      path: inAgents ? `.agents/skills/${name}` : `.claude/skills/${name}`
    };

    if (isCore) {
      coreSkills.push(detail);
    } else {
      thirdPartySkills.push(detail);
    }
  }

  return {
    coreSkills,
    thirdPartySkills,
    totalCount: coreSkills.length + thirdPartySkills.length
  };
}

export interface DiscoveredSkill {
  sourceSkillPath: string;
  skillName: string;
  meta: { name?: string; description?: string; version?: string };
}

export async function discoverSkillsInDirectory(
  rootDir: string,
  maxDepth = 5,
  currentDepth = 0
): Promise<DiscoveredSkill[]> {
  const results: DiscoveredSkill[] = [];
  if (currentDepth > maxDepth) return results;

  const skillMdPath = path.join(rootDir, "SKILL.md");
  if (fsSync.existsSync(skillMdPath)) {
    try {
      const content = await fs.readFile(skillMdPath, "utf8");
      const meta = parseSkillFrontmatter(content);
      const skillName = meta.name || path.basename(rootDir);
      results.push({
        sourceSkillPath: rootDir,
        skillName,
        meta
      });
      return results;
    } catch {
      // ignore read error
    }
  }

  let entries: fsSync.Dirent[];
  try {
    entries = await fs.readdir(rootDir, { withFileTypes: true });
  } catch {
    return results;
  }

  const IGNORED_DIRS = new Set([".git", "node_modules", "dist", ".nexus", "build", "coverage", ".turbo"]);

  for (const entry of entries) {
    if (entry.isDirectory() && !IGNORED_DIRS.has(entry.name)) {
      const subDir = path.join(rootDir, entry.name);
      const subResults = await discoverSkillsInDirectory(subDir, maxDepth, currentDepth + 1);
      results.push(...subResults);
    }
  }

  return results;
}

export async function findSkillSourceDirectory(
  sourceDir: string,
  requestedName?: string
): Promise<{ sourceSkillPath: string; skillName: string; meta: { name?: string; description?: string; version?: string } }> {
  const discovered = await discoverSkillsInDirectory(sourceDir);

  if (discovered.length === 0) {
    throw new Error(`Could not find any valid skill with SKILL.md in source: ${sourceDir}`);
  }

  if (requestedName) {
    const match = discovered.find(
      (s) => s.skillName === requestedName || path.basename(s.sourceSkillPath) === requestedName
    );
    if (match) {
      return {
        sourceSkillPath: match.sourceSkillPath,
        skillName: requestedName,
        meta: match.meta
      };
    }
    const available = discovered.map((s) => s.skillName).join(", ");
    throw new Error(
      `Skill "${requestedName}" not found in source. Available skills (${discovered.length}): ${available}`
    );
  }

  if (discovered.length === 1) {
    return {
      sourceSkillPath: discovered[0].sourceSkillPath,
      skillName: discovered[0].skillName,
      meta: discovered[0].meta
    };
  }

  // Check if one matches the sourceDir basename
  const baseName = path.basename(sourceDir);
  const baseMatch = discovered.find(
    (s) => s.skillName === baseName || path.basename(s.sourceSkillPath) === baseName
  );
  if (baseMatch) {
    return {
      sourceSkillPath: baseMatch.sourceSkillPath,
      skillName: baseMatch.skillName,
      meta: baseMatch.meta
    };
  }

  const available = discovered.map((s) => s.skillName).join(", ");
  throw new Error(
    `Multiple skills found in source (${discovered.length} skills: ${available}). Please specify --name <skill-name> or use --all to install all skills.`
  );
}

export async function installThirdPartySkill(
  projectRoot: string,
  source: string,
  options?: InstallSkillOptions
): Promise<SkillDetail | SkillDetail[]> {
  const alias = KNOWN_SKILL_ALIASES[source.toLowerCase()];
  let effectiveSource = source;
  let isCompound = false;
  let compoundName = "bughunter";
  let compoundRefPath = "devflow/.vendor/bughunter";

  if (alias) {
    effectiveSource = alias.source;
    if (alias.type === "compound-knowledge") {
      isCompound = true;
      compoundName = source.toLowerCase();
      compoundRefPath = alias.referencePath || path.join("devflow", ".vendor", compoundName);
    }
    if (alias.all && options?.all === undefined) {
      options = { ...options, all: true };
    }
    if (alias.name && !options?.name) {
      options = { ...options, name: alias.name };
    }
  } else if (source.includes("Claude-BugHunter")) {
    isCompound = true;
    compoundName = "bughunter";
    compoundRefPath = "devflow/.vendor/bughunter";
  }

  const isGitUrl = /^https?:\/\/|^git@|^ssh:\/\/|\.git$/.test(effectiveSource);
  let tempCloneDir: string | null = null;
  let sourceDirectory = effectiveSource;

  let coreNameSet: ReadonlySet<string> = new Set<string>();
  try {
    const inventory = await loadCoreSkillInventory(path.join(projectRoot, AGENT_MANIFEST_PATH));
    coreNameSet = inventory.nameSet;
  } catch {
    // ignore
  }

  try {
    if (isGitUrl) {
      tempCloneDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-skill-"));
      await execFileAsync("git", ["clone", "--depth", "1", effectiveSource, tempCloneDir]);
      sourceDirectory = tempCloneDir;
    } else {
      sourceDirectory = path.isAbsolute(effectiveSource) ? effectiveSource : path.resolve(projectRoot, effectiveSource);
      if (!fsSync.existsSync(sourceDirectory)) {
        throw new Error(`Source directory does not exist: ${effectiveSource}`);
      }
    }

    const recordedSource = options?.overrideSource || effectiveSource;
    const recordedType = isCompound ? "compound-knowledge" : isGitUrl || options?.overrideSource ? "git" : "local";

    if (isCompound) {
      const targetRefDir = path.join(projectRoot, compoundRefPath);
      await fs.mkdir(targetRefDir, { recursive: true });

      const srcSkills = path.join(sourceDirectory, "skills");
      if (fsSync.existsSync(srcSkills)) {
        await fs.cp(srcSkills, path.join(targetRefDir, "skills"), { recursive: true });
      }

      const srcCommands = path.join(sourceDirectory, "commands");
      if (fsSync.existsSync(srcCommands)) {
        await fs.cp(srcCommands, path.join(targetRefDir, "commands"), { recursive: true });
      }

      const srcReports = path.join(sourceDirectory, "docs", "disclosed-reports");
      if (fsSync.existsSync(srcReports)) {
        await fs.cp(srcReports, path.join(targetRefDir, "disclosed-reports"), { recursive: true });
      }

      for (const guideFile of ["ENGAGEMENTS.md", "USAGE.md", "README.md", "INSTALL.md"]) {
        const srcFile = path.join(sourceDirectory, guideFile);
        if (fsSync.existsSync(srcFile)) {
          await fs.copyFile(srcFile, path.join(targetRefDir, guideFile));
        }
      }

      // Ensure Master Skill is written in .agents and .claude
      const masterContent = `---
name: ${compoundName}
description: "[devflow] Offensive security orchestrator & bug hunting guide. Indexes 83 vulnerability classes, 5-phase methodology (Think, Hunt, Perimeter, Ship), 681 disclosed HackerOne patterns, and JIT reference guides in ${compoundRefPath}/. Use when running /bughunter, performing security reviews, verifying auth/injection risks in /check or /audit, or testing API endpoints for vulnerabilities."
argument-hint: "[{target, vuln-class, or topic}]"
---

# 🛡️ ${compoundName} - Offensive Security & Vulnerability Assessment Orchestrator

$ARGUMENTS

\`${compoundName}\` is the master security testing orchestrator in Nexus-DevFlow, bringing the complete power of **Claude-BugHunter** into your development lifecycle with **Zero Token Bloat**.

---

## ⚠️ Pre-Flight Check (Knowledge Base Availability)

Before executing any BugHunter analysis or security test:
1. **Check if \`${compoundRefPath}/\` exists in this project using your file inspection tool**.
2. **If \`${compoundRefPath}/\` is MISSING / NOT INSTALLED**:
   - **DO NOT hallucinate payloads or fake security reports**.
   - Inform the user in their configured communication language (per \`devflow/config.json\` and \`AGENTS.md\`):
     - State clearly that the BugHunter knowledge base (83 Vulnerability Classes, Payloads & 681 Disclosed Reports) is not yet downloaded in this project.
     - Provide the exact installation command:
       \`\`\`bash
       npx @jakkrichm/create-nexus-devflow skill add ${compoundName}
       \`\`\`
     - Offer to run the installation command on their behalf.
   - Stop and wait for installation before proceeding.
3. **If \`${compoundRefPath}/\` is PRESENT**:
   - Proceed with the JIT Knowledge Map and 5-phase testing methodology below.

---

### 📦 Full Upstream Arsenal in \`${compoundRefPath}/\`:
- **83 Full Skills** (\`${compoundRefPath}/skills/<skill-name>/SKILL.md\`): Detailed detection patterns, bypass tables, and payloads for all 83 classes.
- **15 Slash Commands** (\`${compoundRefPath}/commands/<command>.md\`): \`hunt\`, \`recon\`, \`triage\`, \`validate\`, \`chain\`, \`report\`, \`scope\`, \`token-scan\`, \`surface\`, \`autopilot\`, etc.
- **681 Disclosed HackerOne Reports** (\`${compoundRefPath}/disclosed-reports/<class>.md\`): Real-world vulnerability citations across 24 core classes.
- **Engagement Scaffolding** (\`${compoundRefPath}/ENGAGEMENTS.md\`): Comprehensive directory and methodology scaffolding for security assessments.

---

## 🧭 The 4-Layer Architecture & 5-Phase Methodology

\`\`\`text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. THINK      │ bb-methodology, redteam-mindset, 5-phase workflow      │
├───────────────┼────────────────────────────────────────────────────────┤
│ 2. HUNT       │ 58 web app vulnerability classes (IDOR, SSRF, SQLi)    │
├───────────────┼────────────────────────────────────────────────────────┤
│ 3. PERIMETER  │ M365/Entra, Okta, vCenter, Cloud IAM, SSL-VPN          │
├───────────────┼────────────────────────────────────────────────────────┤
│ 4. SHIP       │ 7-Question Gate, VRT-aware triage, H1/Bugcrowd reports │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

### The 5-Phase Workflow:
1. **Recon & Scope**: Fingerprint tech stack, enumerate subdomains/endpoints, define in-scope vs. out-of-scope boundaries (\`skills/web2-recon/\`, \`skills/recon-scope-triage/\`).
2. **Map & Surface Ranking**: Identify high-value targets (Auth, Payment, GraphQL mutations, File uploads, Webhook receivers) (\`commands/surface.md\`).
3. **Hunt & Test**: Apply vulnerability-specific bypass tables, edge-case payloads, and condition variations (\`skills/hunt-*/SKILL.md\`).
4. **Validate**: Apply the **7-Question Gate** (Impact, Pre-conditions, Repro steps, Root cause, Severity score) (\`skills/triage-validation/\`).
5. **Report / Remediate**: Produce actionable vulnerability proof, remediation advice, or bug bounty reports (\`commands/report.md\`, \`skills/report-writing/\`).

---

## 🗂️ Just-in-Time (JIT) Reference Knowledge Map

Before analyzing or probing any security concern, **ALWAYS read the relevant reference document in \`${compoundRefPath}/\` using your file reading tool (\`view_file\` / \`grep_search\`)**:

| Target Category | Specific Skill Path in \`${compoundRefPath}/\` | Disclosed Reports Path |
| :--- | :--- | :--- |
| **Index & Overview** | \`${compoundRefPath}/INDEX.md\` | - |
| **IDOR / BOLA** | \`skills/hunt-idor/SKILL.md\` | \`disclosed-reports/hunt-idor.md\` |
| **OAuth 2.0 / SSO** | \`skills/hunt-oauth/SKILL.md\` | \`disclosed-reports/hunt-oauth.md\` |
| **JWT Flaws & Crypto** | \`skills/hunt-jwt-crypto/SKILL.md\` | \`disclosed-reports/hunt-jwt-crypto.md\` |
| **SSRF (Cloud IMDS)** | \`skills/hunt-ssrf/SKILL.md\` | \`disclosed-reports/hunt-ssrf.md\` |
| **SQL & NoSQL Injection** | \`skills/hunt-sqli/SKILL.md\`, \`skills/hunt-nosqli/SKILL.md\` | \`disclosed-reports/hunt-sqli.md\` |
| **XSS & DOM Injection** | \`skills/hunt-xss/SKILL.md\`, \`skills/hunt-dom/SKILL.md\` | \`disclosed-reports/hunt-xss.md\` |
| **GraphQL & APIs** | \`skills/hunt-graphql/SKILL.md\`, \`skills/hunt-fintech-graphql/\` | \`disclosed-reports/hunt-graphql.md\` |
| **Next.js / Node.js** | \`skills/hunt-nextjs/SKILL.md\`, \`skills/hunt-nodejs/SKILL.md\` | - |
| **Cloud IAM & Perimeter** | \`skills/hunt-cloud-misconfig/\`, \`skills/m365-entra-attack/\` | \`disclosed-reports/hunt-cloud-misconfig.md\` |
| **CI/CD & Kubernetes** | \`skills/hunt-cicd/SKILL.md\`, \`skills/hunt-k8s/SKILL.md\` | - |
| **LLM & AI Security** | \`skills/hunt-llm-ai/SKILL.md\`, \`skills/hunt-rag-vector/SKILL.md\` | - |

---

## 🔗 Integration with Nexus-DevFlow Core Lifecycle

1. **During \`/check\` (Security & QA Verification)**:
   - When verifying a feature dealing with Auth, Multi-tenancy, or Data Exports, run a BugHunter self-assessment:
     *Read \`${compoundRefPath}/skills/hunt-idor/SKILL.md\` to test for IDOR and token tampering vulnerabilities on the affected endpoint.*
2. **During \`/audit\` (Code Audit)**:
   - Review code against Fowler smells AND offensive attack vectors simultaneously, logging findings into \`devflow/context/{xxx-slug}/findings.md\`.
3. **During \`/debug\` (Security Incident Investigation)**:
   - Trace vulnerability root causes using the 681 disclosed report patterns in \`disclosed-reports/\`.

---

## 🌐 Artifact & Communication Language

All generated reports, findings recorded in \`devflow/context/{xxx-slug}/findings.md\`, and user communication MUST follow the project's central configuration in \`devflow/config.json\` (and \`AGENTS.md\` directive #5 / \`ai-interaction.md\`, defaulting to Thai \`th\`), while code snippets, CVE IDs, HTTP payloads, and technical identifiers remain in English.

---

## 🔄 Updating Knowledge Base

To update all 83 skills, 15 commands, and report patterns to the latest upstream version:
\`\`\`bash
npx @jakkrichm/create-nexus-devflow skill update ${compoundName}
\`\`\`
`;
      const agentTarget = path.join(projectRoot, ".agents", "skills", compoundName, "SKILL.md");
      const claudeTarget = path.join(projectRoot, ".claude", "skills", compoundName, "SKILL.md");
      await fs.mkdir(path.dirname(agentTarget), { recursive: true });
      await fs.mkdir(path.dirname(claudeTarget), { recursive: true });
      if (!fsSync.existsSync(agentTarget) || options?.force) {
        await fs.writeFile(agentTarget, masterContent, "utf8");
      }
      if (!fsSync.existsSync(claudeTarget) || options?.force) {
        await fs.writeFile(claudeTarget, masterContent, "utf8");
      }

      // Update manifest
      const manifest = (await readDevflowManifest(projectRoot)) || {
        schemaVersion: 1,
        name: "nexus-devflow",
        package: "@jakkrichm/create-nexus-devflow",
        version: "2.9.5"
      };
      const existingThirdParty = Array.isArray(manifest.thirdPartySkills)
        ? (manifest.thirdPartySkills as InstalledSkillRecord[])
        : [];
      const filtered = existingThirdParty.filter((s) => s.name !== compoundName);
      filtered.push({
        name: compoundName,
        source: recordedSource,
        version: "2.0.0",
        description: "Offensive security orchestrator & bug hunting guide",
        installedAt: new Date().toISOString(),
        type: "compound-knowledge",
        referencePath: compoundRefPath
      });
      manifest.thirdPartySkills = filtered;
      await writeDevflowManifest(projectRoot, manifest);

      return {
        name: compoundName,
        category: "third-party",
        description: "Offensive security orchestrator & bug hunting guide",
        version: "2.0.0",
        source: recordedSource,
        adapters: [".agents", ".claude"],
        synced: true,
        path: `.agents/skills/${compoundName}`
      };
    }

    if (options?.all) {
      const discovered = await discoverSkillsInDirectory(sourceDirectory);
      if (discovered.length === 0) {
        throw new Error(`Could not find any valid skill with SKILL.md in source: ${source}`);
      }

      const installedList: SkillDetail[] = [];
      const manifest = (await readDevflowManifest(projectRoot)) || {
        schemaVersion: 1,
        name: "nexus-devflow",
        package: "@jakkrichm/create-nexus-devflow",
        version: "2.9.3"
      };

      const existingThirdParty = Array.isArray(manifest.thirdPartySkills)
        ? (manifest.thirdPartySkills as InstalledSkillRecord[])
        : [];
      let updatedThirdParty = [...existingThirdParty];

      for (const skill of discovered) {
        const skillName = skill.skillName;
        if (!SKILL_NAME_PATTERN.test(skillName)) {
          continue; // skip invalid names in batch mode
        }
        if (coreNameSet.has(skillName) && !options?.force) {
          continue; // skip core collisions in batch mode
        }

        const targetAgentsSkillDir = path.join(projectRoot, ".agents", "skills", skillName);
        const targetClaudeSkillDir = path.join(projectRoot, ".claude", "skills", skillName);

        await fs.rm(targetAgentsSkillDir, { recursive: true, force: true });
        await fs.rm(targetClaudeSkillDir, { recursive: true, force: true });

        await fs.mkdir(path.dirname(targetAgentsSkillDir), { recursive: true });
        await fs.mkdir(path.dirname(targetClaudeSkillDir), { recursive: true });

        await fs.cp(skill.sourceSkillPath, targetAgentsSkillDir, { recursive: true });
        await fs.cp(skill.sourceSkillPath, targetClaudeSkillDir, { recursive: true });

        updatedThirdParty = updatedThirdParty.filter((s) => s.name !== skillName);
        updatedThirdParty.push({
          name: skillName,
          source: recordedSource,
          version: skill.meta.version || "1.0.0",
          description: skill.meta.description || "",
          installedAt: new Date().toISOString(),
          type: recordedType
        });

        installedList.push({
          name: skillName,
          category: "third-party",
          description: skill.meta.description || "",
          version: skill.meta.version || "1.0.0",
          source: recordedSource,
          adapters: [".agents", ".claude"],
          synced: true,
          path: `.agents/skills/${skillName}`
        });
      }

      manifest.thirdPartySkills = updatedThirdParty;
      await writeDevflowManifest(projectRoot, manifest);

      return installedList;
    }

    const { sourceSkillPath, skillName, meta } = await findSkillSourceDirectory(sourceDirectory, options?.name);

    if (!SKILL_NAME_PATTERN.test(skillName)) {
      throw new Error(`Invalid skill name: "${skillName}". Must use kebab-case (e.g. "diagram-design").`);
    }

    if (coreNameSet.has(skillName) && !options?.force) {
      throw new Error(`Cannot install skill with name "${skillName}" as it conflicts with a Core DevFlow Skill.`);
    }

    const targetAgentsSkillDir = path.join(projectRoot, ".agents", "skills", skillName);
    const targetClaudeSkillDir = path.join(projectRoot, ".claude", "skills", skillName);

    await fs.rm(targetAgentsSkillDir, { recursive: true, force: true });
    await fs.rm(targetClaudeSkillDir, { recursive: true, force: true });

    await fs.mkdir(path.dirname(targetAgentsSkillDir), { recursive: true });
    await fs.mkdir(path.dirname(targetClaudeSkillDir), { recursive: true });

    // Copy verbatim to .agents/skills/<name>
    await fs.cp(sourceSkillPath, targetAgentsSkillDir, { recursive: true });
    // Copy verbatim to .claude/skills/<name>
    await fs.cp(sourceSkillPath, targetClaudeSkillDir, { recursive: true });

    // Update .nexus/nexus-devflow.json
    const manifest = (await readDevflowManifest(projectRoot)) || {
      schemaVersion: 1,
      name: "nexus-devflow",
      package: "@jakkrichm/create-nexus-devflow",
      version: "2.9.3"
    };

    const existingThirdParty = Array.isArray(manifest.thirdPartySkills)
      ? (manifest.thirdPartySkills as InstalledSkillRecord[])
      : [];

    const existingRecord = existingThirdParty.find((s) => s.name === skillName);
    const filtered = existingThirdParty.filter((s) => s.name !== skillName);
    filtered.push({
      name: skillName,
      source: recordedSource,
      version: meta.version || existingRecord?.version || "1.0.0",
      description: meta.description || existingRecord?.description || "",
      installedAt: new Date().toISOString(),
      type: existingRecord?.type || recordedType,
      referencePath: existingRecord?.referencePath
    });

    manifest.thirdPartySkills = filtered;
    await writeDevflowManifest(projectRoot, manifest);

    return {
      name: skillName,
      category: "third-party",
      description: meta.description || existingRecord?.description || "",
      version: meta.version || existingRecord?.version || "1.0.0",
      source: recordedSource,
      adapters: [".agents", ".claude"],
      synced: true,
      path: `.agents/skills/${skillName}`
    };
  } finally {
    if (tempCloneDir) {
      try {
        await fs.rm(tempCloneDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup error
      }
    }
  }
}

export async function removeThirdPartySkill(projectRoot: string, name: string): Promise<boolean> {
  let coreNameSet: ReadonlySet<string> = new Set<string>();
  try {
    const inventory = await loadCoreSkillInventory(path.join(projectRoot, AGENT_MANIFEST_PATH));
    coreNameSet = inventory.nameSet;
  } catch {
    // ignore
  }

  if (coreNameSet.has(name)) {
    throw new Error(`Cannot remove Core Skill: "${name}". Core skills are managed by Nexus-DevFlow.`);
  }

  const targetAgentsSkillDir = path.join(projectRoot, ".agents", "skills", name);
  const targetClaudeSkillDir = path.join(projectRoot, ".claude", "skills", name);

  let removedAny = false;

  if (fsSync.existsSync(targetAgentsSkillDir)) {
    await fs.rm(targetAgentsSkillDir, { recursive: true, force: true });
    removedAny = true;
  }

  if (fsSync.existsSync(targetClaudeSkillDir)) {
    await fs.rm(targetClaudeSkillDir, { recursive: true, force: true });
    removedAny = true;
  }

  const manifest = await readDevflowManifest(projectRoot);
  if (manifest && Array.isArray(manifest.thirdPartySkills)) {
    const prevList = manifest.thirdPartySkills as InstalledSkillRecord[];
    const nextList = prevList.filter((s) => s.name !== name);
    if (nextList.length !== prevList.length) {
      manifest.thirdPartySkills = nextList;
      await writeDevflowManifest(projectRoot, manifest);
      removedAny = true;
    }
  }

  return removedAny;
}

export async function syncSkills(projectRoot: string): Promise<{ syncedCount: number; skills: string[] }> {
  const agentsDir = path.join(projectRoot, ".agents", "skills");
  const claudeDir = path.join(projectRoot, ".claude", "skills");

  if (!fsSync.existsSync(agentsDir)) {
    return { syncedCount: 0, skills: [] };
  }

  await fs.rm(claudeDir, { recursive: true, force: true });
  await fs.mkdir(claudeDir, { recursive: true });

  const entries = await fs.readdir(agentsDir, { withFileTypes: true });
  const syncedSkills: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const src = path.join(agentsDir, entry.name);
      const dst = path.join(claudeDir, entry.name);
      await fs.cp(src, dst, { recursive: true });
      syncedSkills.push(entry.name);
    }
  }

  return {
    syncedCount: syncedSkills.length,
    skills: syncedSkills
  };
}

export interface SkillUpdateResult {
  updatedSkills: SkillDetail[];
  failedSkills: Array<{ name: string; reason: string }>;
  totalUpdated: number;
}

export async function updateThirdPartySkills(
  projectRoot: string,
  targetSkillName?: string,
  options?: { force?: boolean }
): Promise<SkillUpdateResult> {
  const manifest = await readDevflowManifest(projectRoot);
  const existingThirdParty = Array.isArray(manifest?.thirdPartySkills)
    ? (manifest.thirdPartySkills as InstalledSkillRecord[])
    : [];

  if (existingThirdParty.length === 0) {
    return { updatedSkills: [], failedSkills: [], totalUpdated: 0 };
  }

  let skillsToUpdate = existingThirdParty;
  if (targetSkillName && targetSkillName !== "--all") {
    skillsToUpdate = existingThirdParty.filter((s) => s.name === targetSkillName);
    if (skillsToUpdate.length === 0) {
      throw new Error(`Skill "${targetSkillName}" is not installed as a third-party skill.`);
    }
  }

  // Group by source to avoid duplicate cloning
  const sourceToSkillsMap = new Map<string, InstalledSkillRecord[]>();
  for (const skill of skillsToUpdate) {
    const list = sourceToSkillsMap.get(skill.source) || [];
    list.push(skill);
    sourceToSkillsMap.set(skill.source, list);
  }

  const updatedSkills: SkillDetail[] = [];
  const failedSkills: Array<{ name: string; reason: string }> = [];

  for (const [source, skills] of sourceToSkillsMap) {
    const isGit = /^https?:\/\/|^git@|^ssh:\/\/|\.git$/.test(source);
    let tempCloneDir: string | null = null;

    try {
      let sourceDir = source;
      if (isGit) {
        tempCloneDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-skill-update-"));
        await execFileAsync("git", ["clone", "--depth", "1", source, tempCloneDir]);
        sourceDir = tempCloneDir;
      }

      for (const skill of skills) {
        try {
          if (skill.type === "compound-knowledge") {
            let directSkillFound = false;
            try {
              const detail = (await installThirdPartySkill(projectRoot, sourceDir, {
                name: skill.name,
                force: true,
                overrideSource: isGit ? source : undefined
              })) as SkillDetail;
              updatedSkills.push(detail);
              directSkillFound = true;
            } catch {
              directSkillFound = false;
            }

            if (!directSkillFound) {
              const refRelPath = skill.referencePath || path.join("devflow", ".vendor", skill.name);
              const targetRefDir = path.join(projectRoot, refRelPath);
              await fs.mkdir(targetRefDir, { recursive: true });

              // 1. Sync source skills directory to reference/skills
              const srcSkills = path.join(sourceDir, "skills");
              if (fsSync.existsSync(srcSkills)) {
                await fs.cp(srcSkills, path.join(targetRefDir, "skills"), { recursive: true });
              }

              // 2. Sync source commands directory to reference/commands
              const srcCommands = path.join(sourceDir, "commands");
              if (fsSync.existsSync(srcCommands)) {
                await fs.cp(srcCommands, path.join(targetRefDir, "commands"), { recursive: true });
              }

              // 3. Sync source disclosed-reports directory
              const srcReports = path.join(sourceDir, "docs", "disclosed-reports");
              if (fsSync.existsSync(srcReports)) {
                await fs.cp(srcReports, path.join(targetRefDir, "disclosed-reports"), { recursive: true });
              }

              // 4. Sync source docs directory
              const srcDocs = path.join(sourceDir, "docs");
              if (fsSync.existsSync(srcDocs)) {
                await fs.cp(srcDocs, path.join(targetRefDir, "docs"), { recursive: true });
              }

              // 5. Copy notable guide files
              for (const guideFile of ["ENGAGEMENTS.md", "USAGE.md", "README.md", "INSTALL.md"]) {
                const srcFile = path.join(sourceDir, guideFile);
                if (fsSync.existsSync(srcFile)) {
                  await fs.copyFile(srcFile, path.join(targetRefDir, guideFile));
                }
              }

              let newVersion = skill.version || "1.0.0";
              try {
                const pkgPath = path.join(sourceDir, "package.json");
                if (fsSync.existsSync(pkgPath)) {
                  const pkgRaw = await fs.readFile(pkgPath, "utf8");
                  const pkg = JSON.parse(pkgRaw) as { version?: string };
                  if (pkg.version) newVersion = pkg.version;
                }
              } catch {
                // ignore
              }

              // Update manifest
              const currentManifest = (await readDevflowManifest(projectRoot)) || {};
              const existingList = Array.isArray(currentManifest.thirdPartySkills)
                ? (currentManifest.thirdPartySkills as InstalledSkillRecord[])
                : [];
              const updatedList = existingList.map((s) => {
                if (s.name === skill.name) {
                  return {
                    ...s,
                    version: newVersion,
                    installedAt: new Date().toISOString(),
                    type: "compound-knowledge",
                    referencePath: refRelPath
                  };
                }
                return s;
              });
              currentManifest.thirdPartySkills = updatedList;
              await writeDevflowManifest(projectRoot, currentManifest);

              updatedSkills.push({
                name: skill.name,
                category: "third-party",
                description: skill.description || "Compound Knowledge Skill",
                version: newVersion,
                source: skill.source,
                adapters: [".agents", ".claude"],
                synced: true,
                path: `.agents/skills/${skill.name}`
              });
            }
          } else {
            const detail = (await installThirdPartySkill(projectRoot, sourceDir, {
              name: skill.name,
              force: true,
              overrideSource: isGit ? source : undefined
            })) as SkillDetail;
            updatedSkills.push(detail);
          }
        } catch (err: unknown) {
          failedSkills.push({
            name: skill.name,
            reason: err instanceof Error ? err.message : String(err)
          });
        }
      }
    } catch (err: unknown) {
      for (const skill of skills) {
        failedSkills.push({
          name: skill.name,
          reason: err instanceof Error ? err.message : String(err)
        });
      }
    } finally {
      if (tempCloneDir) {
        try {
          await fs.rm(tempCloneDir, { recursive: true, force: true });
        } catch {
          // ignore
        }
      }
    }
  }

  return {
    updatedSkills,
    failedSkills,
    totalUpdated: updatedSkills.length
  };
}

export async function installRecommendedSkills(
  projectRoot: string,
  options?: InstallRecommendedOptions
): Promise<SkillDetail[]> {
  const presets = options?.presets || RECOMMENDED_THIRD_PARTY_SKILLS;
  const installedList: SkillDetail[] = [];

  for (const preset of presets) {
    const result = await installThirdPartySkill(projectRoot, preset.source, {
      name: preset.name,
      all: preset.all,
      force: options?.force ?? true
    });

    if (Array.isArray(result)) {
      installedList.push(...result);
    } else {
      installedList.push(result);
    }
  }

  return installedList;
}

export async function updateRecommendedSkills(
  projectRoot: string,
  options?: UpdateRecommendedOptions
): Promise<SkillUpdateResult> {
  const presets = options?.presets || RECOMMENDED_THIRD_PARTY_SKILLS;
  const updatedSkills: SkillDetail[] = [];
  const failedSkills: Array<{ name: string; reason: string }> = [];

  for (const preset of presets) {
    try {
      const result = await installThirdPartySkill(projectRoot, preset.source, {
        name: preset.name,
        all: preset.all,
        force: true
      });

      if (Array.isArray(result)) {
        updatedSkills.push(...result);
      } else {
        updatedSkills.push(result);
      }
    } catch (err: unknown) {
      failedSkills.push({
        name: preset.name || preset.source,
        reason: err instanceof Error ? err.message : String(err)
      });
    }
  }

  return {
    updatedSkills,
    failedSkills,
    totalUpdated: updatedSkills.length
  };
}

