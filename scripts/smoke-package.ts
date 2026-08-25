import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  inspectAdapterSkillInventory,
  loadCoreSkillInventory
} from "../packages/create-nexus-devflow/lib/core-skill-inventory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const pkgDir = path.join(rootDir, "packages", "create-nexus-devflow");

async function smokeTestPackage(): Promise<void> {
  console.log("Running smoke test for create-nexus-devflow package...\n");

  // 1. Build and prepare template
  console.log("1. Building create-nexus-devflow...");
  execSync("npm run build", { cwd: pkgDir, stdio: "inherit" });
  execSync("npm run prepare-template", { cwd: pkgDir, stdio: "inherit" });

  // 2. NPM Pack
  console.log("\n2. Packaging create-nexus-devflow...");
  const packOutput = execSync("npm pack", { cwd: pkgDir, encoding: "utf8" });
  const tgzName = packOutput.trim().split(/\r?\n/).pop()!;
  const tgzPath = path.join(pkgDir, tgzName);

  console.log(`Created tarball: ${tgzName}`);

  // Re-ensure template exists for direct bin execution test
  execSync("npm run prepare-template", { cwd: pkgDir, stdio: "inherit" });

  // 3. Test overlay in temp directory
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-smoke-"));
  console.log(`\n3. Testing overlay in temp directory: ${tempDir}`);

  try {
    const binPath = path.join(pkgDir, "dist", "bin", "create-nexus-devflow.js");
    execSync(`node "${binPath}" "${tempDir}" --yes`, { stdio: "inherit" });

    // Verify key files exist in temp directory
    const expected = [
      "AGENTS.md",
      "CLAUDE.md",
      "LICENSE",
      ".agents/skills",
      ".claude/skills",
      ".nexus/nexus-devflow.json",
      "devflow/context/project-overview.md"
    ];

    for (const rel of expected) {
      await fs.stat(path.join(tempDir, rel));
    }

    const inventory = await loadCoreSkillInventory(
      path.join(rootDir, "agent-bundle.manifest.json")
    );
    const installedSkills = await inspectAdapterSkillInventory(tempDir, inventory);
    for (const adapter of [".agents", ".claude"] as const) {
      const state = installedSkills[adapter];
      if (state.missingCore.length > 0 || state.localExtensions.length > 0) {
        throw new Error(
          `${adapter}/skills package inventory mismatch: missing=[${state.missingCore.join(", ")}], local=[${state.localExtensions.join(", ")}]`
        );
      }
    }

    console.log(`\n[SUCCESS] Package smoke test passed with ${inventory.count} Core Skills per adapter!`);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.rm(tgzPath, { force: true });
    execSync("npm run postpack", { cwd: pkgDir, stdio: "inherit" });
  }
}

smokeTestPackage().catch((err: unknown) => {
  console.error("\n[FAILED] Package smoke test failed:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
