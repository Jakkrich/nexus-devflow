import {
  SkillRegistryEngine,
  type SkillRepositoryAdapter,
  DefaultGitRepositoryAdapter,
  type InstalledSkillRecord,
  type SkillDetail,
  type SkillListResult,
  type InstallSkillOptions,
  type InstallResult,
  type SkillUpdateResult,
  type DevFlowRole,
  DEV_ROLE_SKILLS,
  SA_ROLE_SKILLS,
  FULL_ROLE_SKILLS,
  getSkillsForRole,
  type RecommendedSkillPreset,
  KNOWN_SKILL_ALIASES,
  RECOMMENDED_THIRD_PARTY_SKILLS,
  parseSkillFrontmatter,
  type DiscoveredSkill,
  discoverSkillsInDirectory,
  findSkillSourceDirectory
} from "./skill-registry-engine.js";

export {
  SkillRegistryEngine,
  type SkillRepositoryAdapter,
  DefaultGitRepositoryAdapter,
  type InstalledSkillRecord,
  type SkillDetail,
  type SkillListResult,
  type InstallSkillOptions,
  type InstallResult,
  type SkillUpdateResult,
  type DevFlowRole,
  DEV_ROLE_SKILLS,
  SA_ROLE_SKILLS,
  FULL_ROLE_SKILLS,
  getSkillsForRole,
  type RecommendedSkillPreset,
  KNOWN_SKILL_ALIASES,
  RECOMMENDED_THIRD_PARTY_SKILLS,
  parseSkillFrontmatter,
  type DiscoveredSkill,
  discoverSkillsInDirectory,
  findSkillSourceDirectory
};

export interface InstallRecommendedOptions {
  presets?: readonly RecommendedSkillPreset[];
  force?: boolean;
}

export interface UpdateRecommendedOptions {
  presets?: readonly RecommendedSkillPreset[];
}

function getEngine(projectRoot: string): SkillRegistryEngine {
  return new SkillRegistryEngine(projectRoot);
}

export async function readDevflowManifest(projectRoot: string): Promise<Record<string, unknown> | null> {
  return getEngine(projectRoot).readManifest();
}

export async function writeDevflowManifest(projectRoot: string, manifest: Record<string, unknown>): Promise<void> {
  return getEngine(projectRoot).writeManifest(manifest);
}

export async function listInstalledSkills(projectRoot: string): Promise<SkillListResult> {
  return getEngine(projectRoot).list();
}

export async function installThirdPartySkill(
  projectRoot: string,
  source: string,
  options?: InstallSkillOptions
): Promise<SkillDetail | SkillDetail[]> {
  const result = await getEngine(projectRoot).install(source, options);
  if (result.details.length === 1 && !options?.all) {
    return result.details[0];
  }
  return result.details;
}

export async function removeThirdPartySkill(projectRoot: string, name: string): Promise<boolean> {
  const res = await getEngine(projectRoot).remove(name);
  return res.removed;
}

export async function syncSkills(projectRoot: string): Promise<{ syncedCount: number; skills: string[] }> {
  return getEngine(projectRoot).sync();
}

export async function updateThirdPartySkills(
  projectRoot: string,
  targetSkillName?: string,
  options?: { force?: boolean }
): Promise<SkillUpdateResult> {
  return getEngine(projectRoot).update(targetSkillName, options);
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
