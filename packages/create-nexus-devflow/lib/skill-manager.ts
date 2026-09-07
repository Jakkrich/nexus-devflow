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
  },
  "matt-pocock": {
    source: "https://github.com/mattpocock/skills",
    name: "matt-pocock",
    type: "compound-knowledge",
    referencePath: "devflow/.vendor/matt-pocock",
    description: "Master Matt Pocock's 6 AI-engineering flows (Getting Started, Main Flow, Shaping, Upkeep, Productivity, Reference)"
  },
  mattpocock: {
    source: "https://github.com/mattpocock/skills",
    name: "matt-pocock",
    type: "compound-knowledge",
    referencePath: "devflow/.vendor/matt-pocock",
    description: "Master Matt Pocock's 6 AI-engineering flows (Getting Started, Main Flow, Shaping, Upkeep, Productivity, Reference)"
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
      compoundName = alias.name || source.toLowerCase();
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
  } else if (source.includes("mattpocock/skills") || source.includes("matt-pocock")) {
    isCompound = true;
    compoundName = "matt-pocock";
    compoundRefPath = "devflow/.vendor/matt-pocock";
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

      const srcDocs = path.join(sourceDirectory, "docs");
      if (fsSync.existsSync(srcDocs)) {
        await fs.cp(srcDocs, path.join(targetRefDir, "docs"), { recursive: true });
      }

      for (const guideFile of [
        "ENGAGEMENTS.md",
        "USAGE.md",
        "README.md",
        "INSTALL.md",
        "CONTEXT.md",
        "AGENTS.md",
        "CLAUDE.md"
      ]) {
        const srcFile = path.join(sourceDirectory, guideFile);
        if (fsSync.existsSync(srcFile)) {
          await fs.copyFile(srcFile, path.join(targetRefDir, guideFile));
        }
      }

      const isMatt = compoundName === "matt-pocock";
      const compoundDesc = isMatt
        ? "Master Matt Pocock's 6 AI-engineering flows (Getting Started, Main Flow, Shaping, Upkeep, Productivity, Reference)"
        : "Offensive security orchestrator & bug hunting guide";
      const compoundVer = isMatt ? "1.0.0" : "2.0.0";

      // Ensure Master Skill is written in .agents and .claude
      const masterContent = isMatt
        ? `---
name: ${compoundName}
description: "[devflow] Master Matt Pocock's 6 AI-engineering flows (Getting Started, Main Flow, Shaping, Upkeep, Productivity, Reference) for developing software according to real-world situations, while interactively mentoring the developer. References JIT skills in ${compoundRefPath}/. Use when running /matt-pocock, learning AI workflows, or orchestrating spec-driven development."
argument-hint: "[{flow, topic, or question}]"
---

# 🧠 ${compoundName} — The 6 Canonical Matt Pocock Flows & Interactive Coaching

$ARGUMENTS

\`${compoundName}\` brings the full AI-engineering workflow pioneered by **Matt Pocock** (from [aihero.dev](https://www.aihero.dev)) into Nexus-DevFlow.

This skill serves two complementary purposes:
1. **Interactive Coach & Mentor**: Teaches the engineering discipline and mindset behind each flow based on real-world engineering situations.
2. **Execution & Routing Orchestrator**: Directs, prepares, and dispatches the actual skills located in \`${compoundRefPath}/\`.

---

## ⚠️ Pre-Flight Check (Knowledge Base Availability)

Before executing any Matt Pocock flow, advice, or skill guidance:
1. **Check if \`${compoundRefPath}/\` exists in this project using your file inspection tool (\`view_file\` or \`list_dir\`)**.
2. **If \`${compoundRefPath}/\` is MISSING / NOT INSTALLED**:
   - **DO NOT hallucinate skill instructions or invent fake flows**.
   - Inform the user in their configured communication language (defaulting to Thai per \`devflow/config.json\` and \`AGENTS.md\`):
     - State clearly that the Matt Pocock skill suite (\`${compoundRefPath}/\`) is not yet installed in this project.
     - Provide the exact installation command:
       \`\`\`bash
       npx @jakkrichm/create-nexus-devflow skill add ${compoundName}
       \`\`\`
     - Offer to run the installation command on their behalf.
   - Stop and wait for installation before proceeding.
3. **If \`${compoundRefPath}/\` is PRESENT**:
   - Proceed with the 6 Canonical Flows, JIT skill references, and interactive coaching below.

---

## 🧭 The Golden Rule: "Decisions are Yours, Facts are the Agent's"

Matt Pocock's workflow is built upon a strict division of responsibility:
- **Agent's Role**: Gather codebase facts, inspect primary sources, surface constraints, write deterministic tests, propose candidate options, and draft code.
- **Developer's Role**: Make architectural decisions, approve testing seams, define domain boundaries, and evaluate business trade-offs.

---

## 🗺️ The 6 Canonical Flows & Real-World Situations

\`\`\`text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 01. Getting Started  : Setup repo once & Router (/setup-matt-pocock-skills, /ask-matt) │
└──────┬──────────────────────────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────────────────────────┐
       ▼                                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ 03. Shaping                  │              │ 04. Upkeep                   │
│ Open questions & fuzzy ideas │              │ Maintenance & bug diagnosis  │
│ • /wayfinder (Decision map)  │              │ • /diagnosing-bugs (Red loop)│
│ • /prototype (Throwaway code)│              │ • /improve-codebase-arch     │
│ • /research (Primary docs)   │              │ • /resolving-merge-conflicts │
└──────┬───────────────────────┘              │ • /triage /wizard            │
       │ (Clarity reached)                    └──────────────┬───────────────┘
       │                                                     │ (Split into issues)
       ▼                                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 02. The Main Flow (Idea ➔ Ship Spine)                                       │
│ 1. /grill-with-docs ➔ 2. /to-spec ➔ 3. /to-tickets ➔ [CLEAR] ➔ 4. /implement ➔ 5. /code-review │
└─────────────────────────────────────────────────────────────────────────────┘
       ▲                                                             ▲
       │                                                             │
┌──────┴───────────────────────┐              ┌──────────────────────┴───────┐
│ 05. Productivity (Human Collab)             │ 06. Reference (Foundations)  │
│ • /grill-me (Repo-less idea) │              │ • /codebase-design (Seams)   │
│ • /handoff (Session transfer)│              │ • /domain-modeling (Glossary)│
│ • /to-questionnaire /teach   │              │ • /grilling (Interview core) │
│ • /wait-what /writing-for-agents            │ • /tdd (Red-Green-Refactor)  │
└──────────────────────────────┘              └──────────────────────────────┘
\`\`\`

---

## 01. Getting Started Flow (Initial Configuration & Routing)

> **Real-World Situation:**  
> - A freshly cloned or initialized repository where the AI does not yet know the issue tracker, triage labels, or domain context layout.  
> - You have 37 skills available and need an immediate GPS to pick the right flow.

### Key Skills:
1. **\`/setup-matt-pocock-skills\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/setup-matt-pocock-skills/SKILL.md)
   - **Action**: Run once per repo to explore the codebase and populate \`docs/agents/\` (configuring Issue Tracker location like \`.scratch/\`, triage labels, and \`CONTEXT.md\` layout).
   - **Command**: \`/${compoundName} setup\` or \`/setup-matt-pocock-skills\`
2. **\`/ask-matt\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/ask-matt/SKILL.md)
   - **Action**: Acts as an interactive router. Evaluates your current situation and directs you to the optimal flow.
   - **Command**: \`/${compoundName} ask "<your current situation...>"\`

> 💡 **Matt's Tip:** Never begin coding until the agent understands the project's environment. Running setup once establishes unified project awareness for every tool in the repository.

---

## 02. The Main Flow (The Spine: Idea ➔ Ship)

> **Real-World Situation:**  
> A feature or requirement is reasonably understood and needs to be taken from raw idea all the way to tested, verified, and shipped code.

### The 5 Progressive Steps:
1. **\`/grill-with-docs\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/grill-with-docs/SKILL.md)
   - Conduct 2–3 rounds of Socratic grilling to unearth boundaries, assumptions, and edge cases. Retain domain terms in \`CONTEXT.md\` and record hard-to-reverse decisions in \`docs/adr/\`.
2. **\`/to-spec\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/to-spec/SKILL.md)
   - Synthesize interview results into a Living Spec. Explicitly identify the **Testing Seam** (the highest level of integration to test against) and outline comprehensive User Stories.
3. **\`/to-tickets\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/to-tickets/SKILL.md)
   - Decompose the spec into thin, end-to-end **Tracer-bullet tickets** with explicit \`Blocked by:\` dependencies (saved under \`.scratch/<feature>/issues/<NN>-<slug>.md\` or an issue tracker).
4. ⚠️ **Phase Boundary (Context Hygiene)**:
   - **Clear Context (\`/clear\` or fresh session)** before coding! Because each ticket is self-contained with its own acceptance criteria, resetting the window brings the agent into the **Smart Zone (~150k tokens)** where code generation is sharpest.
5. **\`/implement\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/implement/SKILL.md)
   - Execute tickets sequentially, driven by **\`/tdd\`** (Red ➔ Green ➔ Refactor).
6. **\`/code-review\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/code-review/SKILL.md)
   - Perform independent two-axis review of the diff: **Spec Axis** (did we build what was asked?) and **Standards Axis** (clean code, deep modules, regression safety) prior to committing.

> 💡 **Matt's Tip:** Steps 1–3 must stay in a single unbroken context window so the grilling, spec, and tickets share continuous reasoning. But once tickets exist, *immediately clear context* before implementing.

---

## 03. Shaping Flow (Open Questions & Fog of War)

> **Real-World Situation:**  
> - A massive greenfield initiative or high-uncertainty feature with heavy Fog of War.  
> - UI/UX or state-machine dilemmas that cannot be resolved in conversation alone.  
> - Deep research into official docs or third-party source code needed before committing to a plan.

### Key Skills:
1. **\`/wayfinder\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/wayfinder/SKILL.md)
   - Constructs a **Decision Map** for sprawling projects, resolving fog node by node until an actionable path emerges to hand off to \`/to-spec\`.
2. **\`/prototype\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/prototype/SKILL.md)
   - Creates throwaway, minimal prototype code (e.g. single HTML file or standalone script) to provide tactile validation of UI or complex state logic. Commit onto a separate prototype branch and discard.
3. **\`/research\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/research/SKILL.md)
   - Dispatches a background subagent to inspect **Primary Sources** (official documentation, vendor source code) and generates cited summaries for \`/grill-with-docs\`.

> 💡 **Matt's Tip:** Prototypes are NOT production code! No unit tests, no real database. Their singular purpose is to answer nagging design questions as quickly as possible.

---

## 04. Upkeep Flow (Code Health & Maintenance)

> **Real-World Situation:**  
> - Complex, intermittent, or hard-to-pinpoint bugs.  
> - Modules that feel bloated, shallow, or tightly coupled.  
> - Git merge conflicts during branch integration.  
> - Incoming raw bug reports and feature requests needing categorization.

### Key Skills:
1. **\`/diagnosing-bugs\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/diagnosing-bugs/SKILL.md)
   - Enforces a **Tight Red Loop**: refuse to propose fixes or theorize until an exact, failing reproduction command is captured. Fix the defect and keep the test as a regression lock.
2. **\`/improve-codebase-architecture\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/improve-codebase-architecture/SKILL.md)
   - Analyzes codebase boundaries to identify shallow modules or tangled dependencies, outputting a prioritized refactoring plan.
3. **\`/resolving-merge-conflicts\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/resolving-merge-conflicts/SKILL.md)
   - Resolves conflicts hunk-by-hunk by discovering the underlying **engineering intent** of both branches rather than picking arbitrary lines.
4. **\`/triage\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/triage/SKILL.md)
   - Triages raw external requests and bugs, applying standard labels (\`needs-info\`, \`ready-for-agent\`, \`wontfix\`).
5. **\`/wizard\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/wizard/SKILL.md)
   - Generates interactive CLI scripts guiding developers through manual out-of-band setups (cloud provisioning, OAuth tokens, secrets).

---

## 05. Productivity Skills (Human Collaboration & Communication)

> **Real-World Situation:**  
> - Exploring an idea before any repository or directory exists.  
> - Context window nearing saturation, requiring seamless handover to a fresh session.  
> - Missing information is locked inside a teammate's or stakeholder's head.  
> - Explaining complex technical concepts cleanly.

### Key Skills:
1. **\`/grill-me\`** — [SKILL.md](file:///${compoundRefPath}/skills/productivity/grill-me/SKILL.md)
   - Stateless ideation interview without file writes or repo modifications. Ideal for early brainstorming.
2. **\`/handoff\`** — [SKILL.md](file:///${compoundRefPath}/skills/productivity/handoff/SKILL.md)
   - Exports the current session state and open threads into a standalone Markdown file in the OS temporary directory for instant agent pickup.
3. **\`/to-questionnaire\`** — [SKILL.md](file:///${compoundRefPath}/skills/productivity/to-questionnaire/SKILL.md)
   - Formulates targeted questionnaires to send to external stakeholders when domain knowledge is missing from code.
4. **\`/wait-what\`** — [SKILL.md](file:///${compoundRefPath}/skills/productivity/wait-what/SKILL.md)
   - Instant interruption command when the agent uses jargon or confusing explanations; forces plain-language re-explanation using \`CONTEXT.md\`.
5. **\`/teach\`** — [SKILL.md](file:///${compoundRefPath}/skills/productivity/teach/SKILL.md)
   - Teaches programming or architecture concepts interactively using the workspace as a live chalkboard.
6. **\`/writing-for-agents\`** — [SKILL.md](file:///${compoundRefPath}/skills/productivity/writing-for-agents/SKILL.md)
   - Guidelines for authoring markdown documentation optimized for AI agent readability and retrieval.

---

## 06. Reference Skills (Architecture Foundations & Mental Models)

> **Real-World Situation:**  
> Establishing foundational engineering standards, domain taxonomies, and testing discipline across the engineering team.

### Key Skills:
1. **\`/codebase-design\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/codebase-design/SKILL.md)
   - Principles of **Deep Modules & Clean Seams**: encapsulating complexity behind concise, stable interfaces.
2. **\`/domain-modeling\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/domain-modeling/SKILL.md)
   - Refining domain vocabulary, synchronizing \`CONTEXT.md\`, and documenting immutable decisions in Architecture Decision Records (ADRs).
3. **\`/grilling\`** — [SKILL.md](file:///${compoundRefPath}/skills/productivity/grilling/SKILL.md)
   - Core interview methodology leveraged by \`grill-with-docs\`, \`triage\`, and \`wayfinder\`.
4. **\`/tdd\`** — [SKILL.md](file:///${compoundRefPath}/skills/engineering/tdd/SKILL.md)
   - The ironclad Red ➔ Green ➔ Refactor discipline with deterministic assertions.

---

## 🗂️ Just-In-Time (JIT) Reference Knowledge Map

Before running any flow, inspect the exact primary skill document in \`${compoundRefPath}/\` using your file reading tool:

| Flow Category | Skill Name | Path in \`${compoundRefPath}/\` |
| :--- | :--- | :--- |
| **01. Getting Started** | \`setup-matt-pocock-skills\` | \`skills/engineering/setup-matt-pocock-skills/SKILL.md\` |
| | \`ask-matt\` | \`skills/engineering/ask-matt/SKILL.md\` |
| **02. The Main Flow** | \`grill-with-docs\` | \`skills/engineering/grill-with-docs/SKILL.md\` |
| | \`to-spec\` | \`skills/engineering/to-spec/SKILL.md\` |
| | \`to-tickets\` | \`skills/engineering/to-tickets/SKILL.md\` |
| | \`implement\` | \`skills/engineering/implement/SKILL.md\` |
| | \`code-review\` | \`skills/engineering/code-review/SKILL.md\` |
| **03. Shaping** | \`wayfinder\` | \`skills/engineering/wayfinder/SKILL.md\` |
| | \`prototype\` | \`skills/engineering/prototype/SKILL.md\` |
| | \`research\` | \`skills/engineering/research/SKILL.md\` |
| **04. Upkeep** | \`diagnosing-bugs\` | \`skills/engineering/diagnosing-bugs/SKILL.md\` |
| | \`improve-codebase-architecture\` | \`skills/engineering/improve-codebase-architecture/SKILL.md\` |
| | \`resolving-merge-conflicts\` | \`skills/engineering/resolving-merge-conflicts/SKILL.md\` |
| | \`triage\` | \`skills/engineering/triage/SKILL.md\` |
| | \`wizard\` | \`skills/engineering/wizard/SKILL.md\` |
| **05. Productivity** | \`grill-me\` | \`skills/productivity/grill-me/SKILL.md\` |
| | \`handoff\` | \`skills/productivity/handoff/SKILL.md\` |
| | \`to-questionnaire\` | \`skills/productivity/to-questionnaire/SKILL.md\` |
| | \`wait-what\` | \`skills/productivity/wait-what/SKILL.md\` |
| | \`teach\` | \`skills/productivity/teach/SKILL.md\` |
| | \`writing-for-agents\` | \`skills/productivity/writing-for-agents/SKILL.md\` |
| **06. Reference** | \`codebase-design\` | \`skills/engineering/codebase-design/SKILL.md\` |
| | \`domain-modeling\` | \`skills/engineering/domain-modeling/SKILL.md\` |
| | \`grilling\` | \`skills/productivity/grilling/SKILL.md\` |
| | \`tdd\` | \`skills/engineering/tdd/SKILL.md\` |

---

## 🕹️ CLI & Command Dispatcher

Invoke \`${compoundName}\` according to your specific task or question:

\`\`\`bash
# 01 Getting Started
/${compoundName} setup                       # Run one-time repo setup in docs/agents/
/${compoundName} ask "Encountering a bug..." # Consult Matt for flow selection

# 02 The Main Flow (Idea -> Ship)
/${compoundName} grill "Export PDF feature"  # Socratic grilling of the requirement
/${compoundName} spec                        # Establish Seam and generate Living Spec
/${compoundName} tickets                     # Split spec into tracer-bullet tickets
/${compoundName} run-ticket 01               # TDD implementation of ticket 01
/${compoundName} review                      # Two-axis review before git commit

# 03 Shaping
/${compoundName} wayfinder "Massive project" # Resolve high-fog architecture
/${compoundName} prototype "Test UI state"   # Fast throwaway tactile validation
/${compoundName} research "Library internals"# Deep-dive reading of official docs

# 04 Upkeep
/${compoundName} bug "check command failing" # Tight red loop root-cause diagnosis
/${compoundName} architecture                # Identify shallow modules for refactoring
/${compoundName} conflict                    # Semantic merge conflict resolution

# 05 Productivity & Learning
/${compoundName} learn "Explain Smart Zone"  # In-depth conceptual coaching
/${compoundName} handoff "Switching session" # Generate Markdown handoff note
\`\`\`

---

## 🌐 Artifact & Communication Language

All user-facing communication, guidance, coaching responses, and stage artifacts MUST default to **Thai (\`th\`)** (per \`devflow/config.json\` and \`AGENTS.md\` directive #5 / \`ai-interaction.md\`), while code snippets, CLI commands, file paths, and technical identifiers remain in English.
`
        : `---
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
        version: compoundVer,
        description: compoundDesc,
        installedAt: new Date().toISOString(),
        type: "compound-knowledge",
        referencePath: compoundRefPath
      });
      manifest.thirdPartySkills = filtered;
      await writeDevflowManifest(projectRoot, manifest);

      return {
        name: compoundName,
        category: "third-party",
        description: compoundDesc,
        version: compoundVer,
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

