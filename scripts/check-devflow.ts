#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const REQUIRED_PATHS = [
  "AGENTS.md",
  "CLAUDE.md",
  "LICENSE",
  "README.md",
  ".agents/skills",
  ".claude/skills",
  ".nexus/nexus-devflow.json",
  ".nexus/upstream-ai-blueprint.json",
  ".github/workflows/check-upstream.yml",
  "devflow/context/project-overview.md",
  "devflow/context/coding-standards.md",
  "devflow/context/ai-interaction.md",
  "devflow/context/findings.md",
  "devflow/reference/running-id-contract.md",
  "packages/create-nexus-devflow/package.json",
  "packages/create-nexus-devflow/bin/create-nexus-devflow.ts",
  "packages/create-nexus-devflow/lib/update.ts"
];

function runStep(label: string, command: string, args: string[], cwd: string = rootDir): void {
  console.log(`\n[check] ${label}`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
    windowsHide: true
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

async function checkPaths(): Promise<void> {
  console.log("[check] Nexus-DevFlow workspace integrity");
  let missingCount = 0;

  for (const relPath of REQUIRED_PATHS) {
    const fullPath = path.join(rootDir, relPath);
    try {
      await fs.stat(fullPath);
      console.log(`  [OK] ${relPath}`);
    } catch {
      console.error(`  [MISSING] ${relPath}`);
      missingCount++;
    }
  }

  if (missingCount > 0) {
    throw new Error(`Integrity check failed: ${missingCount} required path(s) missing.`);
  }
}

async function main() {
  console.log("=== Nexus-DevFlow Verification Gate ===\n");

  await checkPaths();
  runStep("Static framework & skill validation", "npx", ["tsx", "scripts/validate-framework.ts"]);
  runStep("Skill Routing Evaluations", "npx", ["tsx", "scripts/evals/routing.ts"]);
  runStep("Installer Package Unit Tests", "npm", ["--prefix", "packages/create-nexus-devflow", "test"]);
  runStep("Package Smoke Test", "npx", ["tsx", "scripts/smoke-package.ts"]);

  console.log("\n✅ All Nexus-DevFlow checks PASSED successfully!");
}

main().catch((err: unknown) => {
  console.error(`\n❌ Verification Gate FAILED: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
