#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prepareMonitorResult } from "./lib/upstream-monitor.js";
import type { InspectionReport } from "./lib/upstream-monitor.js";

interface CliOptions {
  inspection?: string;
  issueBody?: string;
  githubOutput?: string;
  runUrl?: string;
}

function parseArgs(argv: string[]): CliOptions {
  const options: Record<string, string> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (["--inspection", "--issue-body", "--github-output", "--run-url"].includes(argument)) {
      const value = argv[index + 1];

      if (!value) {
        throw new Error(`${argument} requires a value`);
      }

      options[argument.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  for (const required of ["inspection", "issueBody", "githubOutput"]) {
    if (!options[required]) {
      throw new Error(`--${required.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} is required`);
    }
  }

  return options;
}

function writeOutputs(outputPath: string, outputs: Record<string, string>) {
  const content = Object.entries(outputs)
    .map(([name, value]) => `${name}=${value}\n`)
    .join("");
  fs.appendFileSync(path.resolve(outputPath), content, "utf8");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const inspection = JSON.parse(fs.readFileSync(path.resolve(options.inspection!), "utf8")) as InspectionReport;
  const result = prepareMonitorResult(inspection, { runUrl: options.runUrl });

  writeOutputs(options.githubOutput!, result.outputs as Record<string, string>);

  if (!result.updateAvailable || !result.issueBody) {
    console.log("No AI Blueprint upstream updates detected.");
    return;
  }

  fs.writeFileSync(path.resolve(options.issueBody!), result.issueBody, "utf8");
  console.log(`Detected ${inspection.commitCount} AI Blueprint upstream commit(s).`);
}

if (
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
) {
  try {
    main();
  } catch (error: unknown) {
    console.error(`Upstream monitor failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
