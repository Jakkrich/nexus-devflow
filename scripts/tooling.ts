#!/usr/bin/env node
import process from "node:process";
import { runTooling, ToolingError } from "../packages/create-nexus-devflow/lib/tooling/index.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const commandName = args[0] || "help";
  const commandArgs = args.slice(1);

  try {
    const result = await runTooling(commandName, commandArgs, {
      projectRoot: process.cwd(),
      cwd: process.cwd(),
    });

    if (result.message) {
      console.log(result.message);
    }
    process.exitCode = 0;
  } catch (error) {
    if (error instanceof ToolingError) {
      console.error(error.message);
      process.exitCode = error.exitCode;
    } else {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Tooling execution error: ${message}`);
      process.exitCode = 1;
    }
  }
}

void main();
