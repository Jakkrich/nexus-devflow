const fs = require("node:fs/promises");
const path = require("node:path");

const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");
const templateRoot = path.join(packageRoot, "template");

const entries = [
  "AGENTS.md",
  "CLAUDE.md",
  ".agents",
  ".claude",
  "devflow",
  ".nexus",
  "LICENSE"
];

async function copyEntry(entry) {
  const source = path.join(repoRoot, entry);
  const target = path.join(templateRoot, entry);
  try {
    await fs.cp(source, target, { recursive: true });
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}

async function main() {
  await fs.rm(templateRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  await fs.mkdir(templateRoot, { recursive: true });

  for (const entry of entries) {
    await copyEntry(entry);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
