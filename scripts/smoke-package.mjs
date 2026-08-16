import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const pkgDir = path.join(rootDir, "packages", "create-nexus-devflow");

async function smokeTestPackage() {
  console.log("Running smoke test for create-nexus-devflow package...\n");

  // 1. Prepare template
  console.log("1. Running prepare-template...");
  execSync("npm run prepare-template", { cwd: pkgDir, stdio: "inherit" });

  // 2. NPM Pack
  console.log("\n2. Packaging create-nexus-devflow...");
  const packOutput = execSync("npm pack", { cwd: pkgDir, encoding: "utf8" });
  const tgzName = packOutput.trim().split("\n").pop();
  const tgzPath = path.join(pkgDir, tgzName);

  console.log(`Created tarball: ${tgzName}`);

  // Re-ensure template exists for direct bin execution test
  execSync("npm run prepare-template", { cwd: pkgDir, stdio: "inherit" });

  // 3. Test overlay in temp directory
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-smoke-"));
  console.log(`\n3. Testing overlay in temp directory: ${tempDir}`);

  try {
    // Run installer executable directly
    const binPath = path.join(pkgDir, "bin", "create-nexus-devflow.js");
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

    console.log("\n[SUCCESS] Package smoke test passed!");
  } finally {
    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.rm(tgzPath, { force: true });
    execSync("npm run postpack", { cwd: pkgDir, stdio: "inherit" });
  }
}

smokeTestPackage().catch((err) => {
  console.error("\n[FAILED] Package smoke test failed:", err.message);
  process.exit(1);
});
