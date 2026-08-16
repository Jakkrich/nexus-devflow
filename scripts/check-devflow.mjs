import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const REQUIRED_PATHS = [
  "AGENTS.md",
  "CLAUDE.md",
  "LICENSE",
  "README.md",
  ".agents/skills",
  ".claude/skills",
  ".nexus/nexus-devflow.json",
  "devflow/context/project-overview.md",
  "devflow/context/coding-standards.md",
  "devflow/context/ai-interaction.md",
  "devflow/context/findings.md",
  "devflow/reference/running-id-contract.md",
  "packages/create-nexus-devflow/package.json",
  "packages/create-nexus-devflow/bin/create-nexus-devflow.js",
  "packages/create-nexus-devflow/lib/update.js"
];

async function checkDevflow() {
  console.log("Checking Nexus-DevFlow workspace integrity...\n");
  let missingCount = 0;

  for (const relPath of REQUIRED_PATHS) {
    const fullPath = path.join(rootDir, relPath);
    try {
      await fs.stat(fullPath);
      console.log(`  [OK] ${relPath}`);
    } catch (err) {
      console.error(`  [MISSING] ${relPath}`);
      missingCount++;
    }
  }

  if (missingCount > 0) {
    console.error(`\nValidation failed: ${missingCount} required path(s) missing.`);
    process.exit(1);
  }

  console.log("\nAll required Nexus-DevFlow files and directories are present!");
}

checkDevflow().catch((err) => {
  console.error(err);
  process.exit(1);
});
