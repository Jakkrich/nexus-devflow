import fs from "node:fs/promises";
import path from "node:path";

export interface CoreSkillInventory {
  readonly names: readonly string[];
  readonly nameSet: ReadonlySet<string>;
  readonly count: number;
}

export type SkillAdapterName = ".agents" | ".claude";

export interface AdapterSkillState {
  readonly missingCore: readonly string[];
  readonly localExtensions: readonly string[];
}

export type AdapterSkillInspection = Readonly<Record<SkillAdapterName, AdapterSkillState>>;

interface AgentBundleManifestShape {
  readonly core_skills?: unknown;
}

const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ADAPTER_SKILL_PATH_PATTERN = /^\.(?:agents|claude)\/skills\/([^/]+)(?:\/|$)/;
const DOCUMENTED_SKILL_COUNT_PATTERN = /\b(\d+)\s+(?:(?:bundled|specialized)\s+)?(?:Core|Workflow)\s+Skills\b/gi;
const SKILL_ADAPTERS: readonly SkillAdapterName[] = [".agents", ".claude"];

function adapterSkillName(relativePath: string): string | undefined {
  const normalized = relativePath.replaceAll("\\", "/");
  return normalized.match(ADAPTER_SKILL_PATH_PATTERN)?.[1];
}

export async function loadCoreSkillInventory(manifestPath: string): Promise<CoreSkillInventory> {
  const raw = await fs.readFile(manifestPath, "utf8");
  const manifest = JSON.parse(raw) as AgentBundleManifestShape;
  const coreSkills = manifest.core_skills;

  if (!Array.isArray(coreSkills) || coreSkills.length === 0) {
    throw new Error("agent-bundle.manifest.json core_skills must be a non-empty array");
  }

  const names: string[] = [];
  const nameSet = new Set<string>();
  for (const value of coreSkills) {
    if (typeof value !== "string" || !SKILL_NAME_PATTERN.test(value)) {
      throw new Error(`core_skills skill names must use kebab-case; received ${String(value)}`);
    }
    if (nameSet.has(value)) {
      throw new Error(`core_skills contains duplicate skill: ${value}`);
    }
    names.push(value);
    nameSet.add(value);
  }

  return Object.freeze({
    names: Object.freeze(names),
    nameSet,
    count: names.length
  });
}

export function isBundledSkillPath(
  relativePath: string,
  inventory: CoreSkillInventory
): boolean {
  const skillName = adapterSkillName(relativePath);
  return skillName ? inventory.nameSet.has(skillName) : false;
}

export function shouldIncludeTemplatePath(
  relativePath: string,
  inventory: CoreSkillInventory
): boolean {
  const skillName = adapterSkillName(relativePath);
  return skillName ? inventory.nameSet.has(skillName) : true;
}

export async function inspectAdapterSkillInventory(
  projectRoot: string,
  inventory: CoreSkillInventory
): Promise<AdapterSkillInspection> {
  const inspection = {} as Record<SkillAdapterName, AdapterSkillState>;

  for (const adapter of SKILL_ADAPTERS) {
    const skillsRoot = path.join(projectRoot, adapter, "skills");
    let skillDirectories: string[] = [];
    try {
      const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
      skillDirectories = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    const localExtensions = skillDirectories.filter((name) => !inventory.nameSet.has(name));
    const missingCore: string[] = [];
    for (const name of inventory.names) {
      try {
        await fs.access(path.join(skillsRoot, name, "SKILL.md"));
      } catch {
        missingCore.push(name);
      }
    }

    inspection[adapter] = Object.freeze({
      missingCore: Object.freeze(missingCore),
      localExtensions: Object.freeze(localExtensions)
    });
  }

  return Object.freeze(inspection);
}

export async function findCoreSkillCountDrift(
  projectRoot: string,
  relativePaths: readonly string[],
  expectedCount: number
): Promise<string[]> {
  const drift: string[] = [];

  for (const relativePath of relativePaths) {
    const content = await fs.readFile(path.join(projectRoot, relativePath), "utf8");
    const counts = [...content.matchAll(DOCUMENTED_SKILL_COUNT_PATTERN)]
      .map((match) => Number(match[1]));

    if (counts.length === 0) {
      drift.push(`${relativePath} does not declare a Core/Workflow skill count`);
      continue;
    }

    for (const count of new Set(counts)) {
      if (count !== expectedCount) {
        drift.push(`${relativePath} documents ${count} skills; expected ${expectedCount}`);
      }
    }
  }

  return drift;
}
