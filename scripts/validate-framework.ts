#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  findCoreSkillCountDrift,
  inspectAdapterSkillInventory,
  loadCoreSkillInventory
} from "../packages/create-nexus-devflow/lib/core-skill-inventory.js";
import { validateUpstreamMonitorContract } from "./lib/validate-upstream-monitor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const args = new Set(process.argv.slice(2));
const roadmapOnly = args.has("--roadmap-only");
const coreSkillDocumentationPaths = [
  "README.md",
  "README.th.md",
  "packages/create-nexus-devflow/README.md",
  "docs/USAGE.md",
  "docs/workflow-surface-map.md"
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
  const excluded = new Set([".git", "node_modules", ".venv", "venv", "env", "dist", "template"]);
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

function validateUpstreamWorkflow(failures: string[]): void {
  const workflowPath = path.join(projectRoot, ".github", "workflows", "check-upstream.yml");
  if (!fs.existsSync(workflowPath)) {
    fail("Missing .github/workflows/check-upstream.yml", failures);
    return;
  }

  const workflow = fs.readFileSync(workflowPath, "utf8").replace(/\r\n/g, "\n");
  try {
    validateUpstreamMonitorContract(workflow);
    ok(".github/workflows/check-upstream.yml contract passed");
  } catch (error: unknown) {
    fail(`Upstream monitor contract failed: ${error instanceof Error ? error.message : String(error)}`, failures);
  }
}

function validateManifestSync(failures: string[]): void {
  const pkg = readJson<{ version?: string }>("package.json", failures);
  const devflowManifest = readJson<{
    version?: string;
    lifecycle?: {
      fastTrackStages?: string[];
      mainlineStages?: string[];
      companionCommands?: string[];
    };
  }>(".nexus/nexus-devflow.json", failures);

  if (!pkg || !devflowManifest) return;

  if (devflowManifest.version !== pkg.version) {
    fail(
      `.nexus/nexus-devflow.json version ("${devflowManifest.version}") does not match package.json version ("${pkg.version}")`,
      failures
    );
  } else {
    ok(`.nexus/nexus-devflow.json version is synchronized ("${pkg.version}")`);
  }

  if (!devflowManifest.lifecycle?.fastTrackStages) {
    fail(`.nexus/nexus-devflow.json is missing lifecycle.fastTrackStages`, failures);
  } else {
    ok(".nexus/nexus-devflow.json contains fastTrackStages");
  }
}

async function main(): Promise<void> {
  const failures: string[] = [];
  const manifest = readJson<{ required_paths?: string[]; forbidden_legacy_paths?: string[] }>("agent-bundle.manifest.json", failures);
  const requiredPaths = [
    "agent-bundle.manifest.json",
    "package.json",
    "AGENTS.md",
    "CLAUDE.md",
    ".agents/skills",
    ".claude/skills",
    ".nexus/nexus-devflow.json",
    ".nexus/upstream-ai-blueprint.json",
    ".github/workflows/check-upstream.yml",
    "devflow/context/project-overview.md",
    "devflow/context/coding-standards.md",
    "devflow/context/ai-interaction.md",
    "devflow/reference/running-id-contract.md",
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
  validateUpstreamWorkflow(failures);
  validateManifestSync(failures);

  if (failures.length > 0) {
    console.error(`\nValidation failed with ${failures.length} issue(s).`);
    process.exit(1);
  }

  console.log("\nNexus-DevFlow framework static validation completed successfully!");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
