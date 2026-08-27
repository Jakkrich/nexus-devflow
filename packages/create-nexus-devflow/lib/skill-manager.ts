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
  type?: "git" | "local" | "npm";
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
  force?: boolean;
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

export async function findSkillSourceDirectory(
  sourceDir: string,
  requestedName?: string
): Promise<{ sourceSkillPath: string; skillName: string; meta: { name?: string; description?: string; version?: string } }> {
  // Check 1: If sourceDir itself has SKILL.md
  const rootSkillMd = path.join(sourceDir, "SKILL.md");
  if (fsSync.existsSync(rootSkillMd)) {
    const content = await fs.readFile(rootSkillMd, "utf8");
    const meta = parseSkillFrontmatter(content);
    const skillName = requestedName || meta.name || path.basename(sourceDir);
    return { sourceSkillPath: sourceDir, skillName, meta };
  }

  // Check 2: Check inside skills/ subfolder
  const skillsSubDir = path.join(sourceDir, "skills");
  if (fsSync.existsSync(skillsSubDir)) {
    const entries = await fs.readdir(skillsSubDir, { withFileTypes: true });
    const skillDirs = entries.filter((e) => e.isDirectory());

    if (requestedName) {
      const targetDir = path.join(skillsSubDir, requestedName);
      if (fsSync.existsSync(path.join(targetDir, "SKILL.md"))) {
        const content = await fs.readFile(path.join(targetDir, "SKILL.md"), "utf8");
        const meta = parseSkillFrontmatter(content);
        return { sourceSkillPath: targetDir, skillName: requestedName, meta };
      }
    }

    if (skillDirs.length === 1) {
      const onlyDir = skillDirs[0].name;
      const targetDir = path.join(skillsSubDir, onlyDir);
      if (fsSync.existsSync(path.join(targetDir, "SKILL.md"))) {
        const content = await fs.readFile(path.join(targetDir, "SKILL.md"), "utf8");
        const meta = parseSkillFrontmatter(content);
        return { sourceSkillPath: targetDir, skillName: requestedName || meta.name || onlyDir, meta };
      }
    }

    if (skillDirs.length > 1) {
      // If one matches the requested name or base name of source
      const baseName = path.basename(sourceDir);
      for (const dir of skillDirs) {
        if (dir.name === requestedName || dir.name === baseName) {
          const targetDir = path.join(skillsSubDir, dir.name);
          if (fsSync.existsSync(path.join(targetDir, "SKILL.md"))) {
            const content = await fs.readFile(path.join(targetDir, "SKILL.md"), "utf8");
            const meta = parseSkillFrontmatter(content);
            return { sourceSkillPath: targetDir, skillName: dir.name, meta };
          }
        }
      }
    }
  }

  // Check 3: Check .agents/skills subfolder
  const dotAgentsSkills = path.join(sourceDir, ".agents", "skills");
  if (fsSync.existsSync(dotAgentsSkills)) {
    const entries = await fs.readdir(dotAgentsSkills, { withFileTypes: true });
    const skillDirs = entries.filter((e) => e.isDirectory());
    if (requestedName) {
      const targetDir = path.join(dotAgentsSkills, requestedName);
      if (fsSync.existsSync(path.join(targetDir, "SKILL.md"))) {
        const content = await fs.readFile(path.join(targetDir, "SKILL.md"), "utf8");
        const meta = parseSkillFrontmatter(content);
        return { sourceSkillPath: targetDir, skillName: requestedName, meta };
      }
    }
    if (skillDirs.length === 1) {
      const onlyDir = skillDirs[0].name;
      const targetDir = path.join(dotAgentsSkills, onlyDir);
      if (fsSync.existsSync(path.join(targetDir, "SKILL.md"))) {
        const content = await fs.readFile(path.join(targetDir, "SKILL.md"), "utf8");
        const meta = parseSkillFrontmatter(content);
        return { sourceSkillPath: targetDir, skillName: requestedName || meta.name || onlyDir, meta };
      }
    }
  }

  throw new Error(`Could not find a valid skill with SKILL.md in source: ${sourceDir}`);
}

export async function installThirdPartySkill(
  projectRoot: string,
  source: string,
  options?: InstallSkillOptions
): Promise<SkillDetail> {
  const isGitUrl = /^https?:\/\/|^git@|^ssh:\/\/|\.git$/.test(source);
  let tempCloneDir: string | null = null;
  let sourceDirectory = source;

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
      await execFileAsync("git", ["clone", "--depth", "1", source, tempCloneDir]);
      sourceDirectory = tempCloneDir;
    } else {
      sourceDirectory = path.isAbsolute(source) ? source : path.resolve(projectRoot, source);
      if (!fsSync.existsSync(sourceDirectory)) {
        throw new Error(`Source directory does not exist: ${source}`);
      }
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
      version: "2.9.0"
    };

    const existingThirdParty = Array.isArray(manifest.thirdPartySkills)
      ? (manifest.thirdPartySkills as InstalledSkillRecord[])
      : [];

    const filtered = existingThirdParty.filter((s) => s.name !== skillName);
    filtered.push({
      name: skillName,
      source,
      version: meta.version || "1.0.0",
      description: meta.description || "",
      installedAt: new Date().toISOString(),
      type: isGitUrl ? "git" : "local"
    });

    manifest.thirdPartySkills = filtered;
    await writeDevflowManifest(projectRoot, manifest);

    return {
      name: skillName,
      category: "third-party",
      description: meta.description || "",
      version: meta.version || "1.0.0",
      source,
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
