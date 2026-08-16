import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const skillsRoot = path.join(repoRoot, ".agents", "skills");
const casesRoot = path.join(repoRoot, "evals", "routing");

const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he",
  "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", "with"
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function parseSkillFrontmatter(content) {
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

export function loadSkills() {
  const skills = new Map();
  if (!fs.existsSync(skillsRoot)) return skills;
  const entries = fs.readdirSync(skillsRoot);
  for (const entry of entries) {
    const skillFile = path.join(skillsRoot, entry, "SKILL.md");
    if (fs.existsSync(skillFile)) {
      const content = fs.readFileSync(skillFile, "utf8");
      const meta = parseSkillFrontmatter(content);
      skills.set(entry.toLowerCase(), {
        name: meta.name || entry,
        description: meta.description || "",
        descTokens: new Set(tokenize(meta.description || ""))
      });
    }
  }
  return skills;
}

export function evaluateRouting() {
  console.log("Running DevFlow Skill Routing Evaluation...\n");
  const skills = loadSkills();
  if (skills.size === 0) {
    console.log("No skills found to evaluate.");
    return { totalCases: 0, rank1Passes: 0, accuracy: 100 };
  }

  if (!fs.existsSync(casesRoot)) {
    console.log("No evals/routing cases directory found.");
    return { totalCases: 0, rank1Passes: 0, accuracy: 100 };
  }

  const caseFiles = fs.readdirSync(casesRoot).filter((f) => f.endsWith(".json"));
  let totalCases = 0;
  let rank1Passes = 0;

  for (const caseFile of caseFiles) {
    const targetSkill = path.basename(caseFile, ".json").toLowerCase();
    const data = JSON.parse(fs.readFileSync(path.join(casesRoot, caseFile), "utf8"));
    const positiveCases = data.positive || [];

    for (const prompt of positiveCases) {
      totalCases++;
      const promptLower = prompt.toLowerCase();
      const promptTokens = tokenize(prompt);

      let bestSkill = "";
      let maxScore = -1;

      for (const [skillName, skillData] of skills) {
        let score = 0;

        // Exact or hyphenated skill name match in prompt
        const pattern = skillName.replace(/-/g, "[\\-\\s]");
        const nameRegex = new RegExp(`(?:^|\\s|\\/)${pattern}(?:$|\\s|\\/)`, "i");
        if (nameRegex.test(promptLower)) {
          score += 1000;
        }

        // Match description tokens
        for (const token of promptTokens) {
          if (skillData.descTokens.has(token)) {
            score += 10;
          }
        }

        if (score > maxScore) {
          maxScore = score;
          bestSkill = skillName;
        }
      }

      if (bestSkill === targetSkill) {
        rank1Passes++;
      } else {
        console.log(`  [MISS] Prompt "${prompt}" -> Best match: "${bestSkill}", Expected: "${targetSkill}"`);
      }
    }
  }

  const accuracy = totalCases > 0 ? (rank1Passes / totalCases) * 100 : 100;
  console.log(`\nEvaluated ${totalCases} test cases across ${caseFiles.length} skills.`);
  console.log(`Rank 1 Match Accuracy: ${accuracy.toFixed(2)}%\n`);

  return { totalCases, rank1Passes, accuracy };
}

if (process.argv[1] === __filename) {
  const result = evaluateRouting();
  if (result.accuracy < 80 && result.totalCases > 0) {
    console.error("Routing accuracy below 80% threshold!");
    process.exit(1);
  }
}
