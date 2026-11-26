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
  type ExtrasSkillPreset,
  getExtrasSkillCatalog,
  resolveBundledExtrasSkillDir,
  KNOWN_SKILL_ALIASES,
  parseSkillFrontmatter,
  type DiscoveredSkill,
  discoverSkillsInDirectory,
  findSkillSourceDirectory,
  isAntivirusSafeVendorPath
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
  type ExtrasSkillPreset,
  getExtrasSkillCatalog,
  resolveBundledExtrasSkillDir,
  KNOWN_SKILL_ALIASES,
  parseSkillFrontmatter,
  type DiscoveredSkill,
  discoverSkillsInDirectory,
  findSkillSourceDirectory,
  isAntivirusSafeVendorPath
};

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

export interface InstallExtrasOptions {
  force?: boolean;
  extrasRoot?: string;
}

export async function installExtrasSkills(
  projectRoot: string,
  skillNames: readonly string[],
  options?: InstallExtrasOptions
): Promise<SkillDetail[]> {
  const uniqueNames = Array.from(new Set(skillNames.map((n) => n.trim()).filter(Boolean)));
  const installedList: SkillDetail[] = [];

  for (const name of uniqueNames) {
    const alias = KNOWN_SKILL_ALIASES[name.toLowerCase()];
    const bundledDir = resolveBundledExtrasSkillDir(name, { extrasRoot: options?.extrasRoot });
    const source = bundledDir || name;
    const result = await installThirdPartySkill(projectRoot, source, {
      name: alias?.name || name,
      force: options?.force ?? true,
      ...(bundledDir && alias ? { overrideSource: alias.source } : {})
    });

    if (Array.isArray(result)) {
      installedList.push(...result);
    } else {
      installedList.push(result);
    }
  }

  return installedList;
}
