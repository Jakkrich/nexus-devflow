import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const agentsSkillsDir = path.join(rootDir, ".agents", "skills");
const claudeSkillsDir = path.join(rootDir, ".claude", "skills");

export async function syncAdapters() {
  console.log("Syncing .agents/skills to .claude/skills...");

  await fs.rm(claudeSkillsDir, { recursive: true, force: true });
  await fs.mkdir(claudeSkillsDir, { recursive: true });

  try {
    const skills = await fs.readdir(agentsSkillsDir);

    for (const skill of skills) {
      const sourcePath = path.join(agentsSkillsDir, skill);
      const stats = await fs.stat(sourcePath);

      if (stats.isDirectory()) {
        const targetPath = path.join(claudeSkillsDir, skill);
        await fs.cp(sourcePath, targetPath, { recursive: true });
      }
    }

    console.log(`Successfully synced ${skills.length} skills to .claude/skills.`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("No .agents/skills directory found yet.");
    } else {
      throw err;
    }
  }
}

if (process.argv[1] === __filename) {
  syncAdapters().catch((err) => {
    console.error(`Sync failed: ${err.message}`);
    process.exit(1);
  });
}
