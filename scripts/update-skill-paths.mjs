import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncAdapters } from "./sync-adapters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const agentsSkillsDir = path.join(rootDir, ".agents", "skills");

async function updatePathsInSkill(skillFile) {
  let content = await fs.readFile(skillFile, "utf8");
  let updated = content;

  // Replace workspace paths to devflow equivalents
  updated = updated.replace(/\.workspaces\/specs\//g, "devflow/runs/");
  updated = updated.replace(/\.workspaces\/discoveries\//g, "devflow/discoveries/");
  updated = updated.replace(/\.workspaces\/reports\//g, "devflow/reports/");
  updated = updated.replace(/\.workspaces\/research\//g, "devflow/research/");
  updated = updated.replace(/\.workspaces\/issues\//g, "devflow/issues/");
  updated = updated.replace(/\.workspaces\/prds\//g, "devflow/prds/");
  updated = updated.replace(/\.workspaces\/wiki\//g, "devflow/wiki/");
  updated = updated.replace(/\.workspaces\/roadmap\//g, "devflow/roadmap/");
  updated = updated.replace(/\.workspaces\//g, "devflow/");
  updated = updated.replace(/\.agent\/workflows\//g, ".agents/skills/");
  updated = updated.replace(/\.agent\/skills\//g, ".agents/skills/");

  if (updated !== content) {
    await fs.writeFile(skillFile, updated, "utf8");
    return true;
  }
  return false;
}

async function processDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await processDir(fullPath);
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      const changed = await updatePathsInSkill(fullPath);
      if (changed) count++;
    }
  }
  return count;
}

async function main() {
  console.log("Updating skill file paths from devflow/ to devflow/...");
  const updatedCount = await processDir(agentsSkillsDir);
  console.log(`Updated paths in ${updatedCount} skill file(s).`);

  console.log("Syncing updated skills to .claude/skills...");
  await syncAdapters();
}

main().catch((err) => {
  console.error("Path update failed:", err);
  process.exit(1);
});
