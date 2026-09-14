import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(filename), "..", "..");
const stopWords = new Set("a an and are as at be by for from has he in is it its of on that the to was were will with use when devflow skill run invoke guidance".split(" "));

export interface SkillInfo {
  name: string;
  description: string;
  descTokens: Set<string>;
}
export interface RoutingCases {
  skill: string;
  positive: string[];
  negative: string[];
}
export interface RoutingResult {
  totalCases: number;
  rank1Passes: number;
  negativeFailures: number;
  accuracy: number;
  failures: string[];
}
export function tokenize(text: string): string[] {
  // Preserve non-Latin scripts; this probe does not understand language semantics.
  return text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}-]/gu, " ").split(/\s+/)
    .filter(token => token.length > 1 && !stopWords.has(token));
}
export function parseSkillFrontmatter(content: string): { name: string; description: string } {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const field = (key: string): string => {
    const value = frontmatter?.[1].match(new RegExp("^" + key + ":\\s*(.*)$", "m"))?.[1].trim() ?? "";
    if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value) as string;
    if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
    return value;
  };
  return { name: field("name"), description: field("description") };
}
export function loadSkills(root = path.join(repoRoot, ".agents", "skills")): Map<string, SkillInfo> {
  const skills = new Map<string, SkillInfo>();
  for (const entry of fs.readdirSync(root)) {
    const file = path.join(root, entry, "SKILL.md");
    if (!fs.existsSync(file)) continue;
    const meta = parseSkillFrontmatter(fs.readFileSync(file, "utf8"));
    if (!/^[a-z0-9-]+$/.test(entry) || !meta.name || !meta.description) throw new Error("Invalid skill metadata: " + file);
    skills.set(entry, { ...meta, descTokens: new Set(tokenize(meta.description)) });
  }
  if (!skills.size) throw new Error("No skills found to evaluate");
  return skills;
}
export function rankSkill(prompt: string, skills: Map<string, SkillInfo>): string | null {
  const lower = prompt.toLowerCase().trim();
  const explicit = [...skills.keys()].filter(name =>
    /^[a-z0-9-]+$/.test(name) && (lower === name ||
      new RegExp("(?:^|\\s)[/$]" + name + "(?=$|[\\s?!,])", "u").test(lower) ||
      new RegExp("^(?:run|invoke|use|apply)\\s+" + name + "(?:\\s|$)", "u").test(lower)));
  if (explicit.length) return explicit.length === 1 ? explicit[0] : null;
  const tokens = new Set(tokenize(prompt));
  const scores = [...skills].map(([name, skill]) => ({
    name, score: [...tokens].filter(token => skill.descTokens.has(token)).length
  })).sort((a, b) => b.score - a.score);
  const first = scores[0];
  return first && first.score >= 2 && first.score > (scores[1]?.score ?? 0) ? first.name : null;
}
export function evaluateCases(cases: RoutingCases[], route: (prompt: string) => string | null): RoutingResult {
  let totalCases = 0;
  let rank1Passes = 0;
  let negativeFailures = 0;
  const failures: string[] = [];
  for (const group of cases) {
    for (const kind of ["positive", "negative"] as const) {
      for (const prompt of group[kind]) {
        totalCases++;
        const actual = route(prompt);
        const passed = kind === "positive" ? actual === group.skill : actual !== group.skill;
        if (passed) rank1Passes++;
        else {
          if (kind === "negative") negativeFailures++;
          failures.push(kind + ": " + JSON.stringify(prompt) + " -> " + (actual ?? "none") + "; " + (kind === "positive" ? "expected " : "must not select ") + group.skill);
        }
      }
    }
  }
  if (!totalCases) throw new Error("No routing cases to evaluate");
  return { totalCases, rank1Passes, negativeFailures, accuracy: 100 * rank1Passes / totalCases, failures };
}
export function evaluateRouting(): RoutingResult {
  const skills = loadSkills();
  const root = path.join(repoRoot, "evals", "routing");
  const cases = fs.readdirSync(root).filter(file => file.endsWith(".json")).map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(root, file), "utf8")) as RoutingCases;
    if (!skills.has(data.skill) || !Array.isArray(data.positive) || !Array.isArray(data.negative)
      || [...data.positive, ...data.negative].some(prompt => typeof prompt !== "string")) {
      throw new Error("Invalid routing fixture: " + file);
    }
    return data;
  });
  const result = evaluateCases(cases, prompt => rankSkill(prompt, skills));
  console.log("Lexical routing smoke check (not model behavior or language understanding)");
  for (const failure of result.failures) console.error("[MISS] " + failure);
  console.log(result.rank1Passes + "/" + result.totalCases + " positive + negative cases passed; false activations: " + result.negativeFailures);
  return result;
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(filename)) {
  const result = evaluateRouting();
  if (result.failures.length) process.exitCode = 1;
}
