const fs = require("node:fs/promises");
const path = require("node:path");
const { starterTemplates } = require("../lib/starter-templates");

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

async function sanitizeFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      if (file !== "README.md" && file !== ".gitkeep") {
        await fs.rm(path.join(folderPath, file), { recursive: true, force: true });
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function sanitizeAgentsEntryFile(filePath) {
  let content = await fs.readFile(filePath, "utf8");

  const maintainerCommandsRegex = /## Verification & Commands[\s\S]*$/;
  const starterCommands = `## Commands

- Dev Server: \`npm run dev\`
- Build: \`npm run build\`
- Test: \`npm test\`
- Verify: \`npm run check\` (Run \`/onboard\` to auto-configure)
`;
  content = content.replace(maintainerCommandsRegex, starterCommands);

  await fs.writeFile(filePath, content, "utf8");
}

async function main() {
  await fs.rm(templateRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  await fs.mkdir(templateRoot, { recursive: true });

  for (const entry of entries) {
    await copyEntry(entry);
  }

  // 1. Apply clean starter templates for client projects
  const devflowContextDir = path.join(templateRoot, "devflow", "context");
  await fs.mkdir(devflowContextDir, { recursive: true });

  await fs.writeFile(
    path.join(devflowContextDir, "project-overview.md"),
    starterTemplates.projectOverview,
    "utf8"
  );
  await fs.writeFile(
    path.join(devflowContextDir, "coding-standards.md"),
    starterTemplates.codingStandards,
    "utf8"
  );
  await fs.writeFile(
    path.join(devflowContextDir, "current-stage.md"),
    starterTemplates.currentStage,
    "utf8"
  );
  await fs.writeFile(
    path.join(devflowContextDir, "findings.md"),
    starterTemplates.findings,
    "utf8"
  );
  await fs.writeFile(
    path.join(devflowContextDir, "ai-interaction.md"),
    starterTemplates.aiInteraction,
    "utf8"
  );

  // 2. Sanitize runs and discoveries directories (do not copy core run histories to client)
  await sanitizeFolder(path.join(templateRoot, "devflow", "runs"));
  await sanitizeFolder(path.join(templateRoot, "devflow", "discoveries"));

  // 3. Sanitize AGENTS.md for client
  await sanitizeAgentsEntryFile(path.join(templateRoot, "AGENTS.md"));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
