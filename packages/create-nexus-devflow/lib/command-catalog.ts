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
  devflow: "Inspect workflow state, run doctor diagnostics, or route requests to the right command.",
  overview: "Compile repository plans and context into the living project overview.",
  idea: "Capture and enrich a new idea in the centralized Idea Inbox.",
  debug: "Investigate a bug using 2-Track diagnosis and establish root cause before implementation.",
  onboard: "Detect the stack and establish baseline context for fresh or existing brownfield projects.",
  autopilot: "Run one bounded pass or continuous multi-feature queue (--all / --merge) with quality gates.",
  prototype: "Create a disposable UI mockup before production implementation.",
  audit: "Review code quality, YAGNI discipline, security, performance, and tests.",
  discovery: "Conduct roadmap discovery, SA requirement intake, Socratic alignment (ADR/glossary), or exploration.",
  explore: "Explore an idea and compare 2-3 option trade-offs without changing files."
};

async function readCommandCatalog(projectRoot: string): Promise<CommandCatalogItem[]> {
  const manifest = await readManifest(projectRoot);
  const fast = manifest?.lifecycle.fastTrackStages || ["feature", "fix", "implement", "check", "complete"];
  const deep = manifest?.lifecycle.mainlineStages || ["idea", "explore", "discovery"];
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
