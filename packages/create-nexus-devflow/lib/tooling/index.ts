import { ToolingError, type ToolResult, type ToolingOptions } from "./types.js";
import { getToolCommand, listToolCommands } from "./registry.js";

export async function runTooling(
  commandName: string,
  args: string[] = [],
  options: ToolingOptions = {}
): Promise<ToolResult> {
  const trimmed = commandName.trim();
  const command = getToolCommand(trimmed);

  if (!command) {
    const available = listToolCommands().map((c) => c.name).join(", ");
    throw new ToolingError(
      `Unknown tooling command: ${trimmed}. Available commands: ${available}`,
      1
    );
  }

  try {
    return await command.run(args, options);
  } catch (error) {
    if (error instanceof ToolingError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new ToolingError(`Tooling command '${trimmed}' failed: ${message}`, 1);
  }
}

export * from "./types.js";
export * from "./registry.js";
