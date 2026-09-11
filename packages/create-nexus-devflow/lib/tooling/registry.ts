import type { ToolCommand, ToolResult } from "./types.js";

const toolRegistry = new Map<string, ToolCommand>();

export function registerToolCommand(command: ToolCommand): void {
  toolRegistry.set(command.name, command);
}

export function getToolCommand(name: string): ToolCommand | undefined {
  return toolRegistry.get(name);
}

export function listToolCommands(): ToolCommand[] {
  return Array.from(toolRegistry.values());
}

// Built-in help command
export const helpCommand: ToolCommand = {
  name: "help",
  description: "List all available tooling commands",
  async run(): Promise<ToolResult<ToolCommand[]>> {
    const commands = listToolCommands();
    const commandList = commands
      .map((cmd) => `  • ${cmd.name.padEnd(28)} - ${cmd.description}`)
      .join("\n");

    const message = `Available Tooling Commands:\n${commandList}`;
    return {
      ok: true,
      message,
      data: commands,
    };
  },
};

export const listCommand: ToolCommand = {
  name: "list",
  description: "Alias for help - list all available tooling commands",
  async run(args, options) {
    return helpCommand.run(args, options);
  },
};

import { renderHtmlCommand } from "./commands/render-html.js";
import { reportHtmlCommand } from "./commands/report-html.js";
import { switchArtifactLanguageCommand } from "./commands/switch-artifact-language.js";
import { migrateStageArtifactsCommand } from "./commands/migrate-stage-artifacts.js";
import { summarizeRunStatusCommand } from "./commands/summarize-run-status.js";
import { linkProjectCommand } from "./commands/link-project.js";
import { scanDocContractCommand } from "./commands/scan-doc-contract.js";
import { scanSecurityHygieneCommand } from "./commands/scan-security-hygiene.js";
import { skillDescriptionsCommand } from "./commands/skill-descriptions.js";
import { migrateStructureCommand } from "./commands/migrate-structure.js";

// Register built-in commands
registerToolCommand(helpCommand);
registerToolCommand(listCommand);
registerToolCommand(renderHtmlCommand);
registerToolCommand(reportHtmlCommand);
registerToolCommand(switchArtifactLanguageCommand);
registerToolCommand(migrateStageArtifactsCommand);
registerToolCommand(summarizeRunStatusCommand);
registerToolCommand(linkProjectCommand);
registerToolCommand(scanDocContractCommand);
registerToolCommand(scanSecurityHygieneCommand);
registerToolCommand(skillDescriptionsCommand);
registerToolCommand(migrateStructureCommand);

