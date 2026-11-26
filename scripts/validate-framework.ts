#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  findCoreSkillCountDrift,
  inspectAdapterSkillInventory,
  loadCoreSkillInventory
} from "../packages/create-nexus-devflow/lib/core-skill-inventory.js";
import { checkSkillBudgets } from "./check-skill-budgets.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const args = new Set(process.argv.slice(2));
const roadmapOnly = args.has("--roadmap-only");
const coreSkillDocumentationPaths = [
  "README.md",
  "README.th.md",
  "packages/create-nexus-devflow/README.md",
  "scripts/data/workflow-pages.ts"
];

function fail(message: string, failures: string[]): void {
  failures.push(message);
  console.error(`FAIL: ${message}`);
}

function ok(message: string): void {
  console.log(`OK: ${message}`);
}

function readJson<T = unknown>(relativePath: string, failures: string[]): T | null {
  const target = path.join(projectRoot, relativePath);
  try {
    return JSON.parse(fs.readFileSync(target, "utf8")) as T;
  } catch (error: unknown) {
    fail(`${relativePath} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`, failures);
    return null;
  }
}

function readText(relativePath: string, failures: string[]): string | null {
  const target = path.join(projectRoot, relativePath);
  try {
    return fs.readFileSync(target, "utf8");
  } catch (error: unknown) {
    fail(`Could not read ${relativePath}: ${error instanceof Error ? error.message : String(error)}`, failures);
    return null;
  }
}

function scanForLegacyReferences(failures: string[]): void {
  const excluded = new Set([".git", "node_modules", ".venv", "venv", "env", "dist", "template", ".vendor", "vendor"]);
  const allowedLegacyMentions = new Set([
    path.normalize("scripts/activate-agent.mjs"),
    path.normalize("agent-bundle.manifest.json"),
    path.normalize("scripts/sync-agent-bundle.mjs"),
    path.normalize("scripts/validate-framework.ts")
  ]);
  const legacyPatterns = [".cursor", ".cursorrules"];
  const hits: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (excluded.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const relative = path.relative(projectRoot, full);

      if (entry.isDirectory()) {
        if (legacyPatterns.includes(entry.name) && !allowedLegacyMentions.has(path.normalize(relative))) {
          hits.push(`${relative} (directory)`);
        }
        walk(full);
      } else if (entry.isFile()) {
        if (legacyPatterns.includes(entry.name) && !allowedLegacyMentions.has(path.normalize(relative))) {
          hits.push(`${relative} (file)`);
        }
      }
    }
  }

  walk(projectRoot);
  if (hits.length > 0) {
    fail(`Found legacy rule files:\n  ${hits.join("\n  ")}`, failures);
  } else {
    ok("No legacy rule files found");
  }
}

function validateRoadmap(failures: string[]): void {
  const roadmapPath = path.join(projectRoot, "ROADMAP.md");
  if (!fs.existsSync(roadmapPath)) {
    fail("Missing ROADMAP.md", failures);
    return;
  }
  const roadmap = readText("ROADMAP.md", failures);
  if (!roadmap) return;

  for (const heading of [
    "## Strategic Direction",
    "## Phases",
    "## Current Focus"
  ]) {
    if (!roadmap.includes(heading)) fail(`ROADMAP.md is missing required heading: ${heading}`, failures);
  }

  ok("ROADMAP.md markdown validation passed");
}

function validateWorkflowNumbering(failures: string[]): void {
  const skillsDir = path.join(projectRoot, ".agents", "skills");
  if (!fs.existsSync(skillsDir)) {
    fail("Missing .agents/skills directory", failures);
    return;
  }
  const skillFolders = fs.readdirSync(skillsDir)
    .filter((name) => fs.statSync(path.join(skillsDir, name)).isDirectory());

  const invalid: string[] = [];
  for (const name of skillFolders) {
    const isNumbered = /^\d{2}-[a-z0-9-]+$/.test(name);
    if (isNumbered) {
      invalid.push(`${name} (skills must not use legacy numbered prefixes under DevFlow 2.5.0)`);
    }
  }

  if (invalid.length) {
    fail(`Skill naming is invalid under DevFlow 2.5.0:\n  ${invalid.join("\n  ")}`, failures);
  } else {
    ok(`Skill naming passed for ${skillFolders.length} skills in .agents/skills`);
  }
}

async function validateCoreSkillContract(failures: string[]): Promise<void> {
  try {
    const inventory = await loadCoreSkillInventory(
      path.join(projectRoot, "agent-bundle.manifest.json")
    );
    const inspection = await inspectAdapterSkillInventory(projectRoot, inventory);

    for (const adapter of [".agents", ".claude"] as const) {
      const state = inspection[adapter];
      if (state.missingCore.length > 0) {
        fail(
          `${adapter}/skills is missing Core Skills: ${state.missingCore.join(", ")}`,
          failures
        );
      } else {
        ok(`${adapter}/skills contains all ${inventory.count} Core Skills`);
      }

      if (state.localExtensions.length > 0) {
        ok(
          `${adapter}/skills has ${state.localExtensions.length} local extension(s), excluded from the Core count`
        );
      }
    }

    const documentationDrift = await findCoreSkillCountDrift(
      projectRoot,
      coreSkillDocumentationPaths,
      inventory.count
    );
    if (documentationDrift.length > 0) {
      for (const drift of documentationDrift) {
        fail(`Core Skill documentation drift: ${drift}`, failures);
      }
    } else {
      ok(`Core Skill documentation count is synchronized (${inventory.count})`);
    }
  } catch (error: unknown) {
    fail(
      `Core Skill inventory contract failed: ${error instanceof Error ? error.message : String(error)}`,
      failures
    );
  }
}

function validateManifestSync(failures: string[]): void {
  const pkg = readJson<{ version?: string }>("package.json", failures);
  const createPkg = readJson<{ version?: string }>("packages/create-nexus-devflow/package.json", failures);
  const wrapperPkg = readJson<{
    version?: string;
    dependencies?: Record<string, string>;
  }>("packages/nexus-devflow/package.json", failures);
  const devflowManifest = readJson<{
    version?: string;
    lifecycle?: {
      fastTrackStages?: string[];
      mainlineStages?: string[];
      companionCommands?: string[];
    };
  }>(".nexus/nexus-devflow.json", failures);

  if (!pkg || !createPkg || !wrapperPkg || !devflowManifest) return;

  if (devflowManifest.version !== pkg.version) {
    fail(
      `.nexus/nexus-devflow.json version ("${devflowManifest.version}") does not match package.json version ("${pkg.version}")`,
      failures
    );
  } else {
    ok(`.nexus/nexus-devflow.json version is synchronized ("${pkg.version}")`);
  }

  if (createPkg.version !== pkg.version) {
    fail(
      `packages/create-nexus-devflow/package.json version ("${createPkg.version}") does not match package.json version ("${pkg.version}")`,
      failures
    );
  } else {
    ok(`packages/create-nexus-devflow/package.json version is synchronized ("${pkg.version}")`);
  }

  if (wrapperPkg.version !== pkg.version) {
    fail(
      `packages/nexus-devflow/package.json version ("${wrapperPkg.version}") does not match package.json version ("${pkg.version}")`,
      failures
    );
  } else {
    ok(`packages/nexus-devflow/package.json version is synchronized ("${pkg.version}")`);
  }

  const depVersion = wrapperPkg.dependencies?.["@jakkrichm/create-nexus-devflow"];
  if (depVersion !== pkg.version) {
    fail(
      `packages/nexus-devflow/package.json dependency @jakkrichm/create-nexus-devflow ("${depVersion}") does not match package.json version ("${pkg.version}")`,
      failures
    );
  } else {
    ok(`packages/nexus-devflow/package.json dependency version is synchronized ("${pkg.version}")`);
  }

  if (!devflowManifest.lifecycle?.fastTrackStages) {
    fail(`.nexus/nexus-devflow.json is missing lifecycle.fastTrackStages`, failures);
  } else {
    ok(".nexus/nexus-devflow.json contains fastTrackStages");
  }
}

function validateSkillContracts(
  contracts: Record<string, string[]>,
  failures: string[]
): void {
  const initialFailureCount = failures.length;
  for (const [skill, requiredText] of Object.entries(contracts)) {
    const adapterContents: string[] = [];
    for (const adapter of [".agents", ".claude"]) {
      const relativePath = `${adapter}/skills/${skill}/SKILL.md`;
      const content = readText(relativePath, failures);
      if (!content) continue;
      adapterContents.push(content);
      for (const text of requiredText) {
        if (!content.includes(text)) {
          fail(`${relativePath} is missing lifecycle contract text: ${text}`, failures);
        }
      }
    }

    if (adapterContents.length === 2 && adapterContents[0] !== adapterContents[1]) {
      fail(`${skill} lifecycle contract differs between .agents and .claude adapters`, failures);
    }
  }

  if (Object.keys(contracts).length > 0 && failures.length === initialFailureCount) {
    ok(`Lifecycle contracts validated for ${Object.keys(contracts).length} skills across both adapters`);
  }
}

async function validateSkillMetadata(failures: string[]): Promise<void> {
  try {
    const inventory = await loadCoreSkillInventory(
      path.join(projectRoot, "agent-bundle.manifest.json")
    );
    let totalDescriptionCharacters = 0;

    for (const skill of inventory.names) {
      for (const adapter of [".agents", ".claude"] as const) {
        const skillFile = path.join(projectRoot, adapter, "skills", skill, "SKILL.md");
        if (!fs.existsSync(skillFile)) {
          fail(`Skill file missing for metadata validation: ${skillFile}`, failures);
          continue;
        }
        const content = fs.readFileSync(skillFile, "utf8");
        const match = content.match(/^description:\s*(?:"([^"]+)"|([^\r\n]+))/m);
        const description = match ? (match[1] || match[2]).trim() : "";

        if (!description) {
          fail(`Skill description is missing in ${skillFile}`, failures);
          continue;
        }

        if (description.length > 400) {
          fail(
            `Skill description exceeds the 400-character budget: ${skill} in ${adapter} (${description.length} chars)`,
            failures
          );
        }

        if (adapter === ".agents") {
          totalDescriptionCharacters += description.length;
        }
      }
    }

    if (totalDescriptionCharacters > 8000) {
      fail(
        `Core skill descriptions exceed the 8,000-character context budget: ${totalDescriptionCharacters}`,
        failures
      );
    } else {
      ok(
        `Core skill descriptions validated (${inventory.count} skills, ${totalDescriptionCharacters} total chars <= 8,000)`
      );
    }
  } catch (error: unknown) {
    fail(
      `Skill metadata validation failed: ${error instanceof Error ? error.message : String(error)}`,
      failures
    );
  }
}

function extractSkillReferenceTargets(markdown: string): string[] {
  const targets = new Set<string>();
  const pattern = /(?:^|[\s(`"\[])((?:\.\.\/)+[a-z0-9-]+\/reference\/[^\s)`"'>]+|reference\/[^\s)`"'>]+|[a-z0-9-]+\/reference\/[^\s)`"'>]+)/gi;
  for (const match of markdown.matchAll(pattern)) {
    const raw = (match[1] || "").split("#")[0].replace(/[.,:;!?]+$/, "");
    if (!raw || /[<>{}]/.test(raw) || raw.startsWith("devflow/reference/")) {
      continue;
    }
    targets.add(raw);
  }
  return [...targets];
}

function collectMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

export function findBrokenSkillReferenceLinks(
  skillsRoot: string,
  skillNames?: readonly string[]
): string[] {
  const resolvedRoot = path.resolve(skillsRoot);
  if (!fs.existsSync(resolvedRoot)) return [];
  const rootPrefix = resolvedRoot.endsWith(path.sep) ? resolvedRoot : `${resolvedRoot}${path.sep}`;
  const dirs = skillNames
    ? [...skillNames]
    : fs.readdirSync(resolvedRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);

  const broken: string[] = [];
  for (const skill of dirs) {
    const skillDir = path.join(resolvedRoot, skill);
    for (const mdFile of collectMarkdownFiles(skillDir)) {
      const content = fs.readFileSync(mdFile, "utf8");
      const relFile = path.relative(resolvedRoot, mdFile).replace(/\\/g, "/");
      for (const refPath of extractSkillReferenceTargets(content)) {
        const baseDir = refPath.startsWith("reference/") || refPath.startsWith("../")
          ? path.dirname(mdFile)
          : resolvedRoot;
        const resolvedTarget = path.resolve(baseDir, refPath);
        if (!resolvedTarget.startsWith(rootPrefix)) {
          broken.push(`${relFile} -> ${refPath} (escapes skills root)`);
          continue;
        }
        if (!fs.existsSync(resolvedTarget) || !fs.statSync(resolvedTarget).isFile()) {
          broken.push(`${relFile} -> ${refPath} (missing target)`);
        }
      }
    }
  }
  return broken;
}

async function validateSkillReferenceLinks(failures: string[]): Promise<void> {
  const inventory = await loadCoreSkillInventory(
    path.join(projectRoot, "agent-bundle.manifest.json")
  );
  for (const adapter of [".agents", ".claude"] as const) {
    const skillsRoot = path.join(projectRoot, adapter, "skills");
    const broken = findBrokenSkillReferenceLinks(skillsRoot, inventory.names);
    if (broken.length > 0) {
      for (const item of broken) {
        fail(`[${adapter}] Broken skill reference link: ${item}`, failures);
      }
    } else {
      ok(`[${adapter}] All cross-skill reference links resolved (${inventory.count} core skills)`);
    }
  }
}

function validateAgentsBudget(failures: string[]): void {
  const agentsPath = path.join(projectRoot, "AGENTS.md");
  if (!fs.existsSync(agentsPath)) return;
  const content = fs.readFileSync(agentsPath, "utf8");
  const bytes = Buffer.byteLength(content, "utf8");
  if (bytes > 8000) {
    fail(`AGENTS.md exceeds 8,000-byte budget (${bytes} bytes); keep reference sections in devflow/workflow.md`, failures);
  } else {
    ok(`AGENTS.md is compact (${bytes} <= 8,000 bytes)`);
  }
  for (const required of [
    "## Proportional engineering",
    "## Verification & Commands",
    "<!-- devflow:onboarding-required -->",
    "devflow/workflow.md",
    "devflow-help/scripts/run-state.mjs"
  ]) {
    if (!content.includes(required)) {
      fail(`AGENTS.md is missing required contract text: ${required}`, failures);
    }
  }
}

function validateSkillBudgets(failures: string[]): void {
  for (const adapter of [".agents", ".claude"]) {
    const skillsDir = path.join(projectRoot, adapter, "skills");
    if (!fs.existsSync(skillsDir)) continue;
    const res = checkSkillBudgets(skillsDir);
    if (res.violations.length > 0) {
      for (const v of res.violations) {
        fail(`[${adapter}] Skill budget violation: ${v}`, failures);
      }
    } else {
      ok(`[${adapter}] All skills within token byte budget ceilings (${res.stats.length} markdown instruction files)`);
    }
  }
}

async function main(): Promise<void> {
  const failures: string[] = [];
  const manifest = readJson<{
    required_paths?: string[];
    forbidden_legacy_paths?: string[];
    skill_contracts?: Record<string, string[]>;
  }>("agent-bundle.manifest.json", failures);
  const requiredPaths = [
    "agent-bundle.manifest.json",
    "package.json",
    "AGENTS.md",
    "CLAUDE.md",
    ".agents/skills",
    ".claude/skills",
    ".nexus/nexus-devflow.json",
    "devflow/context/project-overview.md",
    "devflow/context/coding-standards.md",
    "devflow/context/ai-interaction.md",
    "devflow/reference/running-id-contract.md",
    // Feature 085: Superpowers Debugging Heuristics & TDD Reference Guides
    ".agents/skills/debug/root-cause-tracing.md",
    ".agents/skills/debug/defense-in-depth.md",
    ".agents/skills/debug/condition-based-waiting.md",
    ".agents/skills/implement/tdd-anti-patterns.md",
    ".agents/skills/audit/two-stage-review-template.md",
    ".claude/skills/debug/root-cause-tracing.md",
    ".claude/skills/debug/defense-in-depth.md",
    ".claude/skills/debug/condition-based-waiting.md",
    ".claude/skills/implement/tdd-anti-patterns.md",
    ".claude/skills/audit/two-stage-review-template.md",
    // Feature 086: Upstream AI Blueprint v1.6.1 Reference Contracts
    ".agents/skills/complete/reference/completion-recovery.md",
    ".claude/skills/complete/reference/completion-recovery.md",
    ".agents/skills/feature/reference/build-history.md",
    ".claude/skills/feature/reference/build-history.md",
    ...(manifest?.required_paths || [])
  ];
  const forbiddenPaths = manifest?.forbidden_legacy_paths || [];

  const seenRequired = new Set<string>();
  for (const item of requiredPaths) {
    if (seenRequired.has(item)) continue;
    seenRequired.add(item);
    if (!fs.existsSync(path.join(projectRoot, item))) fail(`Missing required path: ${item}`, failures);
    else ok(`Found ${item}`);
  }

  for (const item of forbiddenPaths) {
    if (fs.existsSync(path.join(projectRoot, item))) fail(`Forbidden legacy path exists: ${item}`, failures);
    else ok(`Legacy path absent: ${item}`);
  }

  scanForLegacyReferences(failures);
  validateRoadmap(failures);
  validateWorkflowNumbering(failures);
  await validateCoreSkillContract(failures);
  await validateSkillMetadata(failures);
  await validateSkillReferenceLinks(failures);
  validateAgentsBudget(failures);
  validateSkillBudgets(failures);
  validateManifestSync(failures);
  validateSkillContracts(manifest?.skill_contracts || {}, failures);

  if (failures.length > 0) {
    console.error(`\nValidation failed with ${failures.length} issue(s).`);
    process.exit(1);
  }

  console.log("\nNexus-DevFlow framework static validation completed successfully!");
}

const isEntrypoint =
  Boolean(process.argv[1]) &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));

if (isEntrypoint) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
