import fs from "node:fs/promises";
import path from "node:path";

import { readManifest } from "./update.js";

type CommandFamily = "fast" | "deep" | "companion";

interface CommandCatalogItem {
  name: string;
  command: string;
  description: string;
  family: CommandFamily;
}

const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  devflow: "Inspect workflow state and route the request to the right next command.",
  doctor: "Run a read-only health check for setup, scripts, adapters, and workflow drift.",
  overview: "Compile repository plans and context into the living project overview.",
  idea: "Capture and enrich a new idea in the centralized Idea Inbox.",
  debug: "Investigate a bug and establish its root cause before implementation.",
  brief: "Preview scope, dependencies, risks, and likely size before creating a run.",
  onboard: "Detect the stack and establish baseline context for a fresh project.",
  adopt: "Survey an existing codebase and bootstrap DevFlow context.",
  try: "Guide a human through manual QA steps and expected results.",
  rollback: "Plan a safe reversal with dependency and regression risk analysis.",
  ci: "Set up project CI verification workflows.",
  test: "Inspect test suites and verify test runner configuration.",
  autopilot: "Run one bounded implementation and verification loop.",
  prototype: "Create a disposable UI mockup before production implementation.",
  "report-html": "Generate the optional standalone interactive HTML report.",
  brainstorm: "Explore vague requests and formulate option trade-offs without allocating a running ID.",
  grill: "Conduct interactive Socratic alignment, extract domain glossary, and record architecture decision records (ADRs).",
  discovery: "Conduct project-level roadmap discovery or feature-level exploration before delivery commitment."
};

async function readCommandCatalog(projectRoot: string): Promise<CommandCatalogItem[]> {
  const manifest = await readManifest(projectRoot);
  const fast = manifest?.lifecycle.fastTrackStages || ["feature", "fix", "implement", "check", "complete"];
  const deep = manifest?.lifecycle.mainlineStages || ["idea", "grill", "brainstorm", "discovery"];
  const companion = manifest?.lifecycle.companionCommands || Object.keys(FALLBACK_DESCRIPTIONS);
  const families: Array<[CommandFamily, string[]]> = [["fast", fast], ["deep", deep], ["companion", companion]];
  const seen = new Set<string>();
  const items: CommandCatalogItem[] = [];

  for (const [family, names] of families) {
    for (const name of names) {
      if (seen.has(name)) continue;
      seen.add(name);
      items.push({
        name,
        command: `/${name}`,
        description: await readSkillDescription(projectRoot, name) || FALLBACK_DESCRIPTIONS[name] || `Run the ${name} DevFlow command.`,
        family
      });
    }
  }
  return items;
}

async function readSkillDescription(projectRoot: string, name: string): Promise<string | null> {
  const skillPath = path.join(projectRoot, ".agents", "skills", name, "SKILL.md");
  try {
    const markdown = await fs.readFile(skillPath, "utf8");
    const raw = markdown.match(/^description:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim();
    return raw ? raw.replace(/^\[devflow\](?:\[[A-Z]\])?\s*/i, "") : null;
  } catch (error: unknown) {
    if (getErrorCode(error) === "ENOENT") return null;
    throw error;
  }
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
    ? error.code
    : undefined;
}

export { readCommandCatalog, readSkillDescription };
export type { CommandCatalogItem, CommandFamily };
