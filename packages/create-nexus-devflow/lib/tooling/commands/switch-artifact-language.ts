import fs from "node:fs";
import path from "node:path";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";
import { ToolingError } from "../types.js";

const VALID_LANGUAGES = new Set(["th", "en"]);

function updateTemplateLanguage(filePath: string, language: string): boolean {
  const content = fs.readFileSync(filePath, "utf8");
  const normalizedContent = content.replace(/^\uFEFF/, "");
  if (!normalizedContent.startsWith("---")) {
    throw new Error(`Template is missing frontmatter: ${filePath}`);
  }
  const frontmatterEnd = normalizedContent.indexOf("\n---", 3);
  if (frontmatterEnd === -1) {
    throw new Error(`Template frontmatter is not closed: ${filePath}`);
  }

  const frontmatter = normalizedContent.slice(0, frontmatterEnd);
  const body = normalizedContent.slice(frontmatterEnd);
  const languagePattern = /^artifact_language:\s*"(th|en)"\s*$/gm;
  const matches = [...frontmatter.matchAll(languagePattern)];
  if (matches.length === 0) {
    throw new Error(`Template is missing artifact_language frontmatter: ${filePath}`);
  }

  let keptLanguage = false;
  const normalizedFrontmatter = frontmatter
    .split(/\r?\n/)
    .filter((line) => {
      if (!/^artifact_language:\s*"(th|en)"\s*$/.test(line)) return true;
      if (keptLanguage) return false;
      keptLanguage = true;
      return true;
    })
    .join("\n");

  const updatedFrontmatter = normalizedFrontmatter.replace(
    /^artifact_language:\s*"(th|en)"\s*$/m,
    `artifact_language: "${language}"`
  );

  const updatedContent = `${updatedFrontmatter}${body}`;
  if (updatedContent === content) {
    return false;
  }

  fs.writeFileSync(filePath, updatedContent, "utf8");
  return true;
}

export const switchArtifactLanguageCommand: ToolCommand = {
  name: "switch-artifact-language",
  description: "Switch artifact language in schema templates (th or en)",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    const projectRoot = options.projectRoot ?? options.cwd ?? process.cwd();
    const language = args[0];

    if (!language || !VALID_LANGUAGES.has(language)) {
      throw new ToolingError(
        `Invalid language: ${language}. Expected one of: ${[...VALID_LANGUAGES].join(", ")}. Usage: switch-artifact-language <th|en> [--schemas-dir <path>]`,
        1
      );
    }

    let schemasDir = path.join(projectRoot, ".agent", "resources", "schemas");
    for (let i = 1; i < args.length; i++) {
      if (args[i] === "--schemas-dir" && args[i + 1]) {
        schemasDir = path.resolve(projectRoot, args[i + 1]);
        i++;
      }
    }

    if (!fs.existsSync(schemasDir)) {
      // In repos where .agent/resources/schemas doesn't exist, check devflow schemas
      return {
        ok: true,
        message: `Schemas directory not found at ${schemasDir} (skipping)`,
        data: { changed: 0, unchanged: 0 },
      };
    }

    const files = fs
      .readdirSync(schemasDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => path.join(schemasDir, file));

    let changed = 0;
    let unchanged = 0;
    for (const file of files) {
      if (updateTemplateLanguage(file, language)) {
        changed++;
      } else {
        unchanged++;
      }
    }

    return {
      ok: true,
      message: `Artifact language set to '${language}' (${changed} updated, ${unchanged} unchanged)`,
      data: { language, changed, unchanged },
    };
  },
};
