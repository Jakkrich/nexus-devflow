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

export interface InstallResult {
  installedSkills: string[];
  failedSkills: string[];
  details: SkillDetail[];
}

export interface SkillUpdateResult {
  updatedSkills: SkillDetail[];
  failedSkills: Array<{ name: string; reason: string }>;
  totalUpdated: number;
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
  bughunter: {
    source: "https://github.com/elementalsouls/Claude-BugHunter",
    type: "compound-knowledge",
    referencePath: "devflow/.vendor/bughunter",
    description: "[devflow] Offensive security orchestrator & bug hunting guide"
  },
  ponytail: {
    source: "https://github.com/DietrichGebert/ponytail",
    type: "compound-knowledge",
    referencePath: "devflow/.vendor/ponytail",
    description: "Lazy senior dev mode for AI agents - cuts code bloat & tokens via YAGNI ladder (Backend/Logic/Fixes)"
  }
};

export const RECOMMENDED_THIRD_PARTY_SKILLS: readonly RecommendedSkillPreset[] = Object.freeze([
  {
    source: "https://github.com/tt-a1i/archify",
    name: "archify",
    description: "Interactive technical system architecture, dataflow, and sequence trace diagrams"
  },
  {
    source: "https://github.com/cathrynlavery/diagram-design",
    name: "diagram-design",
    description: "39 editorial visual diagram templates (Business, Quadrants, Timelines, Mindmaps, Radar)"
  },
  {
    source: "https://github.com/elementalsouls/Claude-BugHunter",
    name: "bughunter",
    description: "Offensive security orchestrator & bug hunting guide (83 vuln classes, 681 H1 patterns)"
  },
  {
    source: "https://github.com/DietrichGebert/ponytail",
    name: "ponytail",
    description: "Lazy senior dev mode & YAGNI optimization orchestrator (cuts ~54% bloat & tokens)"
  }
]);

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

  const metaMatch = parts[1].match(/version:\s*["']?([^"'\r\n]+)["']?/);
  if (!version && metaMatch) {
    version = metaMatch[1].trim();
  }

  return { name, description, version };
}

export interface DiscoveredSkill {
  skillName: string;
  sourceSkillPath: string;
  meta: { name?: string; description?: string; version?: string };
}

export async function discoverSkillsInDirectory(
  searchDir: string,
  baseDir: string = searchDir
): Promise<DiscoveredSkill[]> {
  const discovered: DiscoveredSkill[] = [];

  async function walk(currentDir: string) {
    let entries: fsSync.Dirent[];
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    const hasSkillMd = entries.some((e) => e.isFile() && e.name.toLowerCase() === "skill.md");
    if (hasSkillMd) {
      const skillMdPath = path.join(currentDir, "SKILL.md");
      let meta = {};
      try {
        const content = await fs.readFile(skillMdPath, "utf8");
        meta = parseSkillFrontmatter(content);
      } catch {
        // ignore
      }
      const inferredName = path.basename(currentDir);
      const skillName = (meta as { name?: string }).name || inferredName;
      discovered.push({ skillName, sourceSkillPath: currentDir, meta });
      return;
    }

    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "node_modules" &&
        entry.name !== "vendor"
      ) {
        await walk(path.join(currentDir, entry.name));
      }
    }
  }

  await walk(searchDir);
  return discovered;
}

export async function findSkillSourceDirectory(
  extractedDir: string,
  targetSkillName?: string
): Promise<{ sourceSkillPath: string; skillName: string; meta: { name?: string; description?: string; version?: string } }> {
  const discovered = await discoverSkillsInDirectory(extractedDir);

  if (discovered.length === 0) {
    throw new Error(
      `No skill definition (SKILL.md) found in repository. Make sure the repository contains at least one folder with a SKILL.md file.`
    );
  }

  if (targetSkillName) {
    const match = discovered.find(
      (d) => d.skillName === targetSkillName || path.basename(d.sourceSkillPath) === targetSkillName
    );
    if (match) {
      return match;
    }
    const available = discovered.map((d) => d.skillName).join(", ");
    throw new Error(
      `Skill "${targetSkillName}" not found in source repository. Available skills: ${available}`
    );
  }

  if (discovered.length === 1) {
    return discovered[0];
  }

  const available = discovered.map((d) => `"${d.skillName}"`).join(", ");
  throw new Error(
    `Multiple skills found in source (${discovered.length} skills: ${available}). Please specify --name <skill-name> or use --all to install all skills.`
  );
}

// ---------------------------------------------------------------------------
// SkillRepositoryAdapter Seam
// ---------------------------------------------------------------------------

export interface SkillRepositoryAdapter {
  fetchPackage(source: string, targetDir: string, options?: { ref?: string; sparsePath?: string }): Promise<void>;
}

export class DefaultGitRepositoryAdapter implements SkillRepositoryAdapter {
  async fetchPackage(source: string, targetDir: string, _options?: { ref?: string; sparsePath?: string }): Promise<void> {
    const isGitUrl = /^https?:\/\/|^git@|^ssh:\/\/|\.git$/.test(source);
    if (isGitUrl) {
      await execFileAsync("git", ["clone", "--depth", "1", source, targetDir]);
    } else {
      const src = path.resolve(source);
      if (!fsSync.existsSync(src)) {
        throw new Error(`Source directory does not exist: ${source}`);
      }
      await fs.cp(src, targetDir, { recursive: true });
    }
  }
}

// ---------------------------------------------------------------------------
// SkillRegistryEngine Core
// ---------------------------------------------------------------------------

export class SkillRegistryEngine {
  constructor(
    private readonly projectRoot: string,
    private readonly repositoryAdapter: SkillRepositoryAdapter = new DefaultGitRepositoryAdapter()
  ) {}

  async readManifest(): Promise<Record<string, unknown> | null> {
    const fullPath = path.join(this.projectRoot, MANIFEST_PATH);
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

  async writeManifest(manifest: Record<string, unknown>): Promise<void> {
    const fullPath = path.join(this.projectRoot, MANIFEST_PATH);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }

  async list(options?: { role?: DevFlowRole }): Promise<SkillListResult> {
    let coreNameSet: ReadonlySet<string> = new Set<string>();
    try {
      const inventory = await loadCoreSkillInventory(path.join(this.projectRoot, AGENT_MANIFEST_PATH));
      coreNameSet = inventory.nameSet;
    } catch {
      // fallback
    }

    const manifest = await this.readManifest();
    const recordedThirdParty = Array.isArray(manifest?.thirdPartySkills)
      ? (manifest.thirdPartySkills as InstalledSkillRecord[])
      : [];

    const thirdPartyMap = new Map<string, InstalledSkillRecord>();
    for (const record of recordedThirdParty) {
      if (record?.name) {
        thirdPartyMap.set(record.name, record);
      }
    }

    const agentsDir = path.join(this.projectRoot, ".agents", "skills");
    const claudeDir = path.join(this.projectRoot, ".claude", "skills");

    const agentsSkills = new Set<string>();
    const claudeSkills = new Set<string>();

    try {
      const entries = await fs.readdir(agentsDir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory()) agentsSkills.add(e.name);
      }
    } catch {
      // ignore
    }

    try {
      const entries = await fs.readdir(claudeDir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory()) claudeSkills.add(e.name);
      }
    } catch {
      // ignore
    }

    const allSkillNames = new Set([...agentsSkills, ...claudeSkills, ...thirdPartyMap.keys()]);

    const coreSkills: SkillDetail[] = [];
    const thirdPartySkills: SkillDetail[] = [];

    const roleSkills = options?.role ? getSkillsForRole(options.role) : null;

    for (const skillName of allSkillNames) {
      if (roleSkills && !roleSkills.includes(skillName) && !thirdPartyMap.has(skillName)) {
        continue;
      }

      const inAgents = agentsSkills.has(skillName);
      const inClaude = claudeSkills.has(skillName);

      const adapters: string[] = [];
      if (inAgents) adapters.push(".agents");
      if (inClaude) adapters.push(".claude");

      const synced = inAgents && inClaude;

      let description = "";
      let version = "1.0.0";

      const skillPath = inAgents
        ? path.join(agentsDir, skillName, "SKILL.md")
        : path.join(claudeDir, skillName, "SKILL.md");

      try {
        const content = await fs.readFile(skillPath, "utf8");
        const parsed = parseSkillFrontmatter(content);
        if (parsed.description) description = parsed.description;
        if (parsed.version) version = parsed.version;
      } catch {
        // ignore
      }

      const isRecordedThirdParty = thirdPartyMap.has(skillName);
      const isCore = coreNameSet.has(skillName);

      if (isRecordedThirdParty) {
        const record = thirdPartyMap.get(skillName)!;
        thirdPartySkills.push({
          name: skillName,
          category: "third-party",
          description: record.description || description,
          version: record.version || version,
          source: record.source,
          adapters,
          synced,
          path: inAgents ? `.agents/skills/${skillName}` : `.claude/skills/${skillName}`
        });
      } else if (isCore) {
        coreSkills.push({
          name: skillName,
          category: "core",
          description,
          version,
          adapters,
          synced,
          path: inAgents ? `.agents/skills/${skillName}` : `.claude/skills/${skillName}`
        });
      } else {
        thirdPartySkills.push({
          name: skillName,
          category: "local-extension",
          description,
          version,
          adapters,
          synced,
          path: inAgents ? `.agents/skills/${skillName}` : `.claude/skills/${skillName}`
        });
      }
    }

    coreSkills.sort((a, b) => a.name.localeCompare(b.name));
    thirdPartySkills.sort((a, b) => a.name.localeCompare(b.name));

    return {
      coreSkills,
      thirdPartySkills,
      totalCount: coreSkills.length + thirdPartySkills.length
    };
  }

  async install(
    sourceOrOptions: string | InstallSkillOptions,
    options?: InstallSkillOptions
  ): Promise<InstallResult> {
    let source: string;
    let opts: InstallSkillOptions;

    if (typeof sourceOrOptions === "string") {
      source = sourceOrOptions;
      opts = options || {};
    } else {
      opts = sourceOrOptions || {};
      source = opts.overrideSource || opts.name || "";
    }

    if (!source && !opts.overrideSource && !opts.name) {
      throw new Error("No skill source or name provided to install.");
    }

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
      if (alias.all && opts.all === undefined) {
        opts = { ...opts, all: true };
      }
      if (alias.name && !opts.name) {
        opts = { ...opts, name: alias.name };
      }
    } else if (source.includes("Claude-BugHunter")) {
      isCompound = true;
      compoundName = "bughunter";
      compoundRefPath = "devflow/.vendor/bughunter";
    } else if (source.includes("mattpocock/skills") || source.includes("matt-pocock")) {
      isCompound = true;
      compoundName = "matt-pocock";
      compoundRefPath = "devflow/.vendor/matt-pocock";
    } else if (source.includes("DietrichGebert/ponytail") || source.includes("ponytail")) {
      isCompound = true;
      compoundName = "ponytail";
      compoundRefPath = "devflow/.vendor/ponytail";
    }

    let tempCloneDir: string | null = null;
    let coreNameSet: ReadonlySet<string> = new Set<string>();
    try {
      const inventory = await loadCoreSkillInventory(path.join(this.projectRoot, AGENT_MANIFEST_PATH));
      coreNameSet = inventory.nameSet;
    } catch {
      // ignore
    }

    try {
      tempCloneDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-skill-fetch-"));
      await this.repositoryAdapter.fetchPackage(effectiveSource, tempCloneDir);
      const sourceDirectory = tempCloneDir;

      const recordedSource = opts.overrideSource || effectiveSource;
      const isGitUrl = /^https?:\/\/|^git@|^ssh:\/\/|\.git$/.test(effectiveSource);
      const recordedType = isCompound ? "compound-knowledge" : isGitUrl || opts.overrideSource ? "git" : "local";

      if (isCompound) {
        const targetRefDir = path.join(this.projectRoot, compoundRefPath);
        await fs.mkdir(targetRefDir, { recursive: true });

        const srcSkills = path.join(sourceDirectory, "skills");
        if (fsSync.existsSync(srcSkills)) {
          await fs.cp(srcSkills, path.join(targetRefDir, "skills"), { recursive: true });
        }

        const srcCommands = path.join(sourceDirectory, "commands");
        if (fsSync.existsSync(srcCommands)) {
          await fs.cp(srcCommands, path.join(targetRefDir, "commands"), { recursive: true });
        }

        const srcDocs = path.join(sourceDirectory, "docs");
        if (fsSync.existsSync(srcDocs)) {
          await fs.cp(srcDocs, path.join(targetRefDir, "docs"), { recursive: true });
        }

        const srcExamples = path.join(sourceDirectory, "examples");
        if (fsSync.existsSync(srcExamples)) {
          await fs.cp(srcExamples, path.join(targetRefDir, "examples"), { recursive: true });
        }

        const srcBenchmarks = path.join(sourceDirectory, "benchmarks");
        if (fsSync.existsSync(srcBenchmarks)) {
          await fs.cp(srcBenchmarks, path.join(targetRefDir, "benchmarks"), { recursive: true });
        }

        for (const guideFile of [
          "ENGAGEMENTS.md", "USAGE.md", "README.md", "INSTALL.md",
          "CONTEXT.md", "AGENTS.md", "CLAUDE.md"
        ]) {
          const srcFile = path.join(sourceDirectory, guideFile);
          if (fsSync.existsSync(srcFile)) {
            await fs.copyFile(srcFile, path.join(targetRefDir, guideFile));
          }
        }

        let compoundDesc = "[devflow] Offensive security orchestrator & bug hunting guide";
        if (compoundName === "matt-pocock") {
          compoundDesc = "Master Matt Pocock's 6 AI-engineering flows (Getting Started, Main Flow, Shaping, Upkeep, Productivity, Reference)";
        } else if (compoundName === "ponytail") {
          compoundDesc = "Lazy senior dev mode for AI agents - cuts code bloat & tokens via YAGNI ladder";
        }

        let compoundVer = "1.0.0";
        try {
          const pkgPath = path.join(sourceDirectory, "package.json");
          if (fsSync.existsSync(pkgPath)) {
            const pkgRaw = await fs.readFile(pkgPath, "utf8");
            const pkg = JSON.parse(pkgRaw) as { version?: string };
            if (pkg.version) compoundVer = pkg.version;
          }
        } catch {
          // ignore
        }

        const masterSkillContent = `---\nname: ${compoundName}\ndescription: "${compoundDesc}"\nversion: ${compoundVer}\n---\n# ${compoundName}\n`;
        const targetAgentsDir = path.join(this.projectRoot, ".agents", "skills", compoundName);
        const targetClaudeDir = path.join(this.projectRoot, ".claude", "skills", compoundName);

        await fs.mkdir(targetAgentsDir, { recursive: true });
        await fs.mkdir(targetClaudeDir, { recursive: true });

        const targetAgentSkill = path.join(targetAgentsDir, "SKILL.md");
        if (!fsSync.existsSync(targetAgentSkill)) {
          await fs.writeFile(targetAgentSkill, masterSkillContent, "utf8");
        }
        const targetClaudeSkill = path.join(targetClaudeDir, "SKILL.md");
        if (!fsSync.existsSync(targetClaudeSkill)) {
          const content = fsSync.existsSync(targetAgentSkill)
            ? await fs.readFile(targetAgentSkill, "utf8")
            : masterSkillContent;
          await fs.writeFile(targetClaudeSkill, content, "utf8");
        }

        const manifest = (await this.readManifest()) || {
          schemaVersion: 1,
          name: "nexus-devflow",
          package: "@jakkrichm/create-nexus-devflow",
          version: "2.14.0"
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
        await this.writeManifest(manifest);

        const detail: SkillDetail = {
          name: compoundName,
          category: "third-party",
          description: compoundDesc,
          version: compoundVer,
          source: recordedSource,
          adapters: [".agents", ".claude"],
          synced: true,
          path: `.agents/skills/${compoundName}`
        };

        return {
          installedSkills: [compoundName],
          failedSkills: [],
          details: [detail]
        };
      }

      if (opts.all) {
        const discovered = await discoverSkillsInDirectory(sourceDirectory);
        if (discovered.length === 0) {
          throw new Error(`No skills found in repository to install.`);
        }

        const installedList: SkillDetail[] = [];
        const manifest = (await this.readManifest()) || {
          schemaVersion: 1,
          name: "nexus-devflow",
          package: "@jakkrichm/create-nexus-devflow",
          version: "2.14.0"
        };
        const existingThirdParty = Array.isArray(manifest.thirdPartySkills)
          ? (manifest.thirdPartySkills as InstalledSkillRecord[])
          : [];
        let updatedThirdParty = [...existingThirdParty];

        for (const skill of discovered) {
          const skillName = skill.skillName;
          if (!SKILL_NAME_PATTERN.test(skillName) || (coreNameSet.has(skillName) && !opts.force)) {
            continue;
          }

          const targetAgentsSkillDir = path.join(this.projectRoot, ".agents", "skills", skillName);
          const targetClaudeSkillDir = path.join(this.projectRoot, ".claude", "skills", skillName);

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
        await this.writeManifest(manifest);

        return {
          installedSkills: installedList.map((s) => s.name),
          failedSkills: [],
          details: installedList
        };
      }

      const { sourceSkillPath, skillName, meta } = await findSkillSourceDirectory(sourceDirectory, opts.name);

      if (!SKILL_NAME_PATTERN.test(skillName)) {
        throw new Error(`Invalid skill name: "${skillName}". Must use kebab-case (e.g. "diagram-design").`);
      }
      if (coreNameSet.has(skillName) && !opts.force) {
        throw new Error(`Cannot install skill with name "${skillName}" as it conflicts with a Core DevFlow Skill.`);
      }

      const targetAgentsSkillDir = path.join(this.projectRoot, ".agents", "skills", skillName);
      const targetClaudeSkillDir = path.join(this.projectRoot, ".claude", "skills", skillName);

      await fs.rm(targetAgentsSkillDir, { recursive: true, force: true });
      await fs.rm(targetClaudeSkillDir, { recursive: true, force: true });
      await fs.mkdir(path.dirname(targetAgentsSkillDir), { recursive: true });
      await fs.mkdir(path.dirname(targetClaudeSkillDir), { recursive: true });

      await fs.cp(sourceSkillPath, targetAgentsSkillDir, { recursive: true });
      await fs.cp(sourceSkillPath, targetClaudeSkillDir, { recursive: true });

      const manifest = (await this.readManifest()) || {
        schemaVersion: 1,
        name: "nexus-devflow",
        package: "@jakkrichm/create-nexus-devflow",
        version: "2.14.0"
      };
      const existingThirdParty = Array.isArray(manifest.thirdPartySkills)
        ? (manifest.thirdPartySkills as InstalledSkillRecord[])
        : [];
      const filtered = existingThirdParty.filter((s) => s.name !== skillName);
      filtered.push({
        name: skillName,
        source: recordedSource,
        version: meta.version || "1.0.0",
        description: meta.description || "",
        installedAt: new Date().toISOString(),
        type: recordedType
      });
      manifest.thirdPartySkills = filtered;
      await this.writeManifest(manifest);

      const detail: SkillDetail = {
        name: skillName,
        category: "third-party",
        description: meta.description || "",
        version: meta.version || "1.0.0",
        source: recordedSource,
        adapters: [".agents", ".claude"],
        synced: true,
        path: `.agents/skills/${skillName}`
      };

      return {
        installedSkills: [skillName],
        failedSkills: [],
        details: [detail]
      };
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

  async sync(): Promise<{ syncedCount: number; skills: string[] }> {
    const agentsDir = path.join(this.projectRoot, ".agents", "skills");
    const claudeDir = path.join(this.projectRoot, ".claude", "skills");

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

  async remove(name: string): Promise<{ removed: boolean; message?: string }> {
    let coreNameSet: ReadonlySet<string> = new Set<string>();
    try {
      const inventory = await loadCoreSkillInventory(path.join(this.projectRoot, AGENT_MANIFEST_PATH));
      coreNameSet = inventory.nameSet;
    } catch {
      // ignore
    }

    if (coreNameSet.has(name)) {
      throw new Error(`Cannot remove Core Skill: "${name}". Core skills are managed by Nexus-DevFlow.`);
    }

    const targetAgentsSkillDir = path.join(this.projectRoot, ".agents", "skills", name);
    const targetClaudeSkillDir = path.join(this.projectRoot, ".claude", "skills", name);

    let removedAny = false;

    if (fsSync.existsSync(targetAgentsSkillDir)) {
      await fs.rm(targetAgentsSkillDir, { recursive: true, force: true });
      removedAny = true;
    }

    if (fsSync.existsSync(targetClaudeSkillDir)) {
      await fs.rm(targetClaudeSkillDir, { recursive: true, force: true });
      removedAny = true;
    }

    const manifest = await this.readManifest();
    if (manifest && Array.isArray(manifest.thirdPartySkills)) {
      const prevList = manifest.thirdPartySkills as InstalledSkillRecord[];
      const nextList = prevList.filter((s) => s.name !== name);
      if (nextList.length !== prevList.length) {
        manifest.thirdPartySkills = nextList;
        await this.writeManifest(manifest);
        removedAny = true;
      }
    }

    return { removed: removedAny };
  }

  async update(
    targetSkillName?: string,
    options?: { force?: boolean }
  ): Promise<SkillUpdateResult> {
    const manifest = await this.readManifest();
    const existingThirdParty = Array.isArray(manifest?.thirdPartySkills)
      ? (manifest.thirdPartySkills as InstalledSkillRecord[])
      : [];

    if (existingThirdParty.length === 0) {
      return { updatedSkills: [], failedSkills: [], totalUpdated: 0 };
    }

    let skillsToUpdate = existingThirdParty;
    if (targetSkillName && targetSkillName !== "--all" && targetSkillName.toLowerCase() !== "all") {
      skillsToUpdate = existingThirdParty.filter((s) => s.name === targetSkillName);
      if (skillsToUpdate.length === 0) {
        throw new Error(`Skill "${targetSkillName}" is not installed as a third-party skill.`);
      }
    }

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
          await this.repositoryAdapter.fetchPackage(source, tempCloneDir);
          sourceDir = tempCloneDir;
        }

        for (const skill of skills) {
          try {
            if (skill.type === "compound-knowledge") {
              let directSkillFound = false;
              try {
                const res = await this.install(sourceDir, {
                  name: skill.name,
                  force: true,
                  overrideSource: isGit ? source : undefined
                });
                if (res.details[0]) {
                  updatedSkills.push(res.details[0]);
                  directSkillFound = true;
                }
              } catch {
                directSkillFound = false;
              }

              if (!directSkillFound) {
                const refRelPath = skill.referencePath || path.join("devflow", ".vendor", skill.name);
                const targetRefDir = path.join(this.projectRoot, refRelPath);
                await fs.mkdir(targetRefDir, { recursive: true });

                const srcSkills = path.join(sourceDir, "skills");
                if (fsSync.existsSync(srcSkills)) {
                  await fs.cp(srcSkills, path.join(targetRefDir, "skills"), { recursive: true });
                }

                const srcCommands = path.join(sourceDir, "commands");
                if (fsSync.existsSync(srcCommands)) {
                  await fs.cp(srcCommands, path.join(targetRefDir, "commands"), { recursive: true });
                }

                const srcReports = path.join(sourceDir, "docs", "disclosed-reports");
                if (fsSync.existsSync(srcReports)) {
                  await fs.cp(srcReports, path.join(targetRefDir, "disclosed-reports"), { recursive: true });
                }

                const srcDocs = path.join(sourceDir, "docs");
                if (fsSync.existsSync(srcDocs)) {
                  await fs.cp(srcDocs, path.join(targetRefDir, "docs"), { recursive: true });
                }

                const srcExamples = path.join(sourceDir, "examples");
                if (fsSync.existsSync(srcExamples)) {
                  await fs.cp(srcExamples, path.join(targetRefDir, "examples"), { recursive: true });
                }

                const srcBenchmarks = path.join(sourceDir, "benchmarks");
                if (fsSync.existsSync(srcBenchmarks)) {
                  await fs.cp(srcBenchmarks, path.join(targetRefDir, "benchmarks"), { recursive: true });
                }

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

                const currentManifest = (await this.readManifest()) || {};
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
                await this.writeManifest(currentManifest);

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
              const res = await this.install(sourceDir, {
                name: skill.name,
                force: true,
                overrideSource: isGit ? source : undefined
              });
              if (res.details[0]) {
                updatedSkills.push(res.details[0]);
              }
            }
          } catch (err: unknown) {
            failedSkills.push({
              name: skill.name,
              reason: err instanceof Error ? err.message : String(err)
            });
          }
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
}
