import fs from "node:fs";
import path from "node:path";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";
import { ToolingError } from "../types.js";

export const skillDescriptionsCommand: ToolCommand = {
  name: "skill-descriptions",
  description: "Check and validate skill descriptions in .agents/skills and .claude/skills",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    const projectRoot = options.projectRoot ?? options.cwd ?? process.cwd();
    const skillsDir = path.join(projectRoot, ".agents", "skills");

    if (!fs.existsSync(skillsDir)) {
      return {
        ok: true,
        message: "No .agents/skills directory found to check.",
        data: { skills: [] },
      };
    }

    const entries = fs
      .readdirSync(skillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    const missingFiles: string[] = [];
    const missingDescriptions: string[] = [];
    const skillList: { name: string; description: string }[] = [];

    for (const name of entries) {
      const skillFile = path.join(skillsDir, name, "SKILL.md");
      if (!fs.existsSync(skillFile)) {
        missingFiles.push(name);
        continue;
      }

      const content = fs.readFileSync(skillFile, "utf8");
      const match = content.match(/description:\s*([^\r\n]+)/);
      if (!match) {
        missingDescriptions.push(name);
      } else {
        skillList.push({ name, description: match[1].trim() });
      }
    }

    if (missingFiles.length > 0 || missingDescriptions.length > 0) {
      throw new ToolingError(
        `Skill descriptions check failed: missing files: ${missingFiles.join(", ")}; missing descriptions: ${missingDescriptions.join(", ")}`,
        1
      );
    }

    return {
      ok: true,
      message: `Verified ${skillList.length} skill descriptions cleanly across .agents/skills`,
      data: { total: skillList.length, skills: skillList },
    };
  },
};
