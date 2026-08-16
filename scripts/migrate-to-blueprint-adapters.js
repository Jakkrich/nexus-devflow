import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncAdapters } from "./sync-adapters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const oldWorkflowsDir = path.join(rootDir, ".agent", "workflows");
const oldSkillsDir = path.join(rootDir, ".agent", "skills");
const newAgentsSkillsDir = path.join(rootDir, ".agents", "skills");

async function migrate() {
  console.log("Migrating DevFlow workflows & skills to Blueprint .agents/skills layout...");

  await fs.mkdir(newAgentsSkillsDir, { recursive: true });

  // 1. Copy existing skills from .agent/skills
  try {
    const skillEntries = await fs.readdir(oldSkillsDir);
    for (const entry of skillEntries) {
      const src = path.join(oldSkillsDir, entry);
      const dest = path.join(newAgentsSkillsDir, entry);
      const stats = await fs.stat(src);
      if (stats.isDirectory()) {
        await fs.cp(src, dest, { recursive: true });
      }
    }
    console.log(`Copied ${skillEntries.length} skills from .agent/skills.`);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  // 2. Convert .agent/workflows/*.md into .agents/skills/<name>/SKILL.md
  try {
    const workflowFiles = await fs.readdir(oldWorkflowsDir);
    for (const file of workflowFiles) {
      if (!file.endsWith(".md")) continue;
      const name = path.basename(file, ".md");
      const skillFolderName = name.toLowerCase();
      const targetDir = path.join(newAgentsSkillsDir, skillFolderName);
      await fs.mkdir(targetDir, { recursive: true });

      const content = await fs.readFile(path.join(oldWorkflowsDir, file), "utf8");
      
      // Ensure frontmatter has name
      let updatedContent = content;
      if (content.startsWith("---")) {
        const parts = content.split("---");
        if (parts.length >= 3) {
          let frontmatter = parts[1];
          if (!frontmatter.includes("name:")) {
            frontmatter = `name: ${skillFolderName}\n` + frontmatter;
          }
          parts[1] = frontmatter;
          updatedContent = parts.join("---");
        }
      } else {
        updatedContent = `---\nname: ${skillFolderName}\ndescription: ${name} workflow\n---\n\n` + content;
      }

      await fs.writeFile(path.join(targetDir, "SKILL.md"), updatedContent, "utf8");

      // Also support exact case folder if different from lowercase
      if (skillFolderName !== name) {
        const exactCaseDir = path.join(newAgentsSkillsDir, name);
        await fs.mkdir(exactCaseDir, { recursive: true });
        await fs.writeFile(path.join(exactCaseDir, "SKILL.md"), updatedContent, "utf8");
      }
    }
    console.log(`Converted ${workflowFiles.length} workflow markdown files into skills.`);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  console.log("Migration complete. Now syncing to .claude/skills...");
  await syncAdapters();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
