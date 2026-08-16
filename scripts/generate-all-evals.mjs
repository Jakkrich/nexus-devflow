import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const skillsDir = path.join(rootDir, ".agents", "skills");
const evalsDir = path.join(rootDir, "evals", "routing");

function parseFrontmatter(content) {
  if (!content.startsWith("---")) return { name: "", description: "" };
  const parts = content.split("---");
  if (parts.length < 3) return { name: "", description: "" };
  const lines = parts[1].split("\n");
  let name = "";
  let description = "";
  for (const line of lines) {
    if (line.startsWith("name:")) name = line.replace("name:", "").trim();
    if (line.startsWith("description:")) description = line.replace("description:", "").trim();
  }
  return { name, description };
}

async function generateAllEvals() {
  console.log("Generating full production evaluation datasets for all DevFlow skills...\n");
  await fs.mkdir(evalsDir, { recursive: true });

  const entries = await fs.readdir(skillsDir);
  let count = 0;

  for (const skillName of entries) {
    const skillPath = path.join(skillsDir, skillName);
    const stat = await fs.stat(skillPath);
    if (!stat.isDirectory()) continue;

    const skillFile = path.join(skillPath, "SKILL.md");
    let description = `${skillName} skill instruction`;
    try {
      const content = await fs.readFile(skillFile, "utf8");
      const meta = parseFrontmatter(content);
      if (meta.description) {
        description = meta.description;
      }
    } catch {
      // ignore
    }

    const cleanDesc = description.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
    const words = cleanDesc.split(/\s+/).filter(w => w.length > 3).slice(0, 8);

    const positive = [
      `run ${skillName} skill`,
      `invoke /${skillName} command`,
      `use ${skillName} for ${words.join(" ")}`.trim(),
      `apply ${skillName} guidance`
    ];

    const negative = [
      "unrelated random task query",
      "general generic string prompt"
    ];

    const data = {
      skill: skillName,
      description: description,
      positive,
      negative
    };

    const targetFile = path.join(evalsDir, `${skillName.toLowerCase()}.json`);
    await fs.writeFile(targetFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    count++;
  }

  console.log(`Successfully generated ${count} production evaluation datasets in evals/routing/!`);
}

generateAllEvals().catch((err) => {
  console.error(err);
  process.exit(1);
});
