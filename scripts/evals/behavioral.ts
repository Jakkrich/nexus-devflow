import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Scenario {
  id: string;
  prompt: string;
  expectedAction: string;
  expectedSkills: string[];
}

export function scoreObservations(scenarios: Scenario[], input: unknown): { passed: number; total: number; failures: string[] } {
  if (!input || typeof input !== "object") throw new Error("Missing observation record");
  const record = input as Record<string, unknown>;
  if (typeof record.reviewer !== "string" || !record.reviewer.trim() || typeof record.model !== "string" || !record.model.trim()
    || !Array.isArray(record.observations)) throw new Error("Missing reviewer, model, or observations");
  if (!scenarios.length || new Set(scenarios.map(item => item.id)).size !== scenarios.length) throw new Error("Empty or duplicate scenarios");
  const observed = new Map<string, { action: string; skills: string[] }>();
  for (const item of record.observations) {
    if (!item || typeof item !== "object") throw new Error("Malformed observation");
    const value = item as Record<string, unknown>;
    if (typeof value.id !== "string" || typeof value.action !== "string" || typeof value.reason !== "string" || !value.reason.trim()
      || !Array.isArray(value.skills) || value.skills.some(skill => typeof skill !== "string")) throw new Error("Malformed observation");
    if (observed.has(value.id) || !scenarios.some(scenario => scenario.id === value.id)) throw new Error("Duplicate or unknown observation: " + value.id);
    observed.set(value.id, { action: value.action, skills: value.skills as string[] });
  }
  const failures = scenarios.filter(scenario => {
    const actual = observed.get(scenario.id);
    return !actual || actual.action !== scenario.expectedAction || JSON.stringify(actual.skills) !== JSON.stringify(scenario.expectedSkills);
  }).map(scenario => scenario.id);
  return { passed: scenarios.length - failures.length, total: scenarios.length, failures };
}

const filename = fileURLToPath(import.meta.url);
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(filename)) {
  if (!process.argv[2]) throw new Error("Usage: npx tsx scripts/evals/behavioral.ts <observations.json>");
  const scenarios = JSON.parse(fs.readFileSync(path.resolve(path.dirname(filename), "../../evals/behavioral/skill-routing.json"), "utf8")) as Scenario[];
  const record: unknown = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const result = scoreObservations(scenarios, record);
  console.log(JSON.stringify(result, null, 2));
  if (result.failures.length) process.exitCode = 1;
}
