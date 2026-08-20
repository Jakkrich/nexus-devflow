#!/usr/bin/env node

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import {
  formatHumanStatus,
  readProjectStatus,
  shouldUseColor
} from "../lib/status.js";
import {
  applyPreparedUpdate,
  prepareUpdate,
  type PreparedUpdate
} from "../lib/update.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..", "..");
const templateRoot = path.join(packageRoot, "template");

const adapterChoices = new Set(["codex", "antigravity", "claude", "both", "all"]);

interface CliOptions {
  command: "install" | "status" | "update";
  target: string | null;
  adapter: string;
  force: boolean;
  dryRun: boolean;
  help: boolean;
  json: boolean;
  version: boolean;
  yes: boolean;
}

async function main(args: readonly string[] = process.argv.slice(2)): Promise<void> {
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    return;
  }

  if (options.version) {
    console.log(readPackageVersion());
    return;
  }

  const targetDir = path.resolve(process.cwd(), options.target || ".");

  if (options.command === "status") {
    const status = await readProjectStatus(targetDir);
    console.log(
      options.json
        ? JSON.stringify(status, null, 2)
        : formatHumanStatus(status, { color: shouldUseColor() })
    );
    return;
  }

  if (!fsSync.existsSync(templateRoot)) {
    throw new Error(
      "Installer template is missing. Run `npm run prepare-template` before local testing."
    );
  }

  const version = readPackageVersion();

  if (options.command === "update") {
    const prepared = await prepareUpdate({
      targetDir,
      templateRoot,
      version,
      adapter: options.adapter
    });
    printUpdatePlan(prepared);

    if (options.dryRun) {
      return;
    }

    const replaceConflicts =
      options.force || (await confirmUpdateConflicts(prepared, options));
    const result = await applyPreparedUpdate(prepared, { replaceConflicts });
    printUpdateSuccess(prepared, result);
    return;
  }

  const prepared = await prepareUpdate({
    targetDir,
    templateRoot,
    version,
    adapter: options.adapter
  });

  printInstallPlan(prepared);

  if (options.dryRun) {
    return;
  }

  if (prepared.conflictList.length > 0 && !options.force) {
    const proceed = await confirmInstallConflicts(prepared, options);
    if (!proceed) {
      console.log("Install cancelled.");
      return;
    }
  }

  const result = await applyPreparedUpdate(prepared, {
    replaceConflicts: options.force || prepared.conflictList.length > 0
  });

  printInstallSuccess(targetDir, result);
}

function parseArgs(args: readonly string[]): CliOptions {
  let command: "install" | "status" | "update" = "install";
  let target: string | null = null;
  let adapter = "both";
  let force = false;
  let dryRun = false;
  let help = false;
  let json = false;
  let version = false;
  let yes = false;

  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      help = true;
      continue;
    }

    if (arg === "--version" || arg === "-v") {
      version = true;
      continue;
    }

    if (arg === "--json") {
      json = true;
      continue;
    }

    if (arg === "--force" || arg === "-f") {
      force = true;
      continue;
    }

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "-y" || arg === "--yes") {
      yes = true;
      continue;
    }

    if (arg === "--target" || arg === "-t") {
      const next = args[++i];
      if (!next) {
        throw new Error(`${arg} requires a path`);
      }
      target = next;
      continue;
    }

    if (arg.startsWith("--target=")) {
      target = arg.slice("--target=".length);
      continue;
    }

    if (arg === "--adapter") {
      const value = args[++i];
      if (!value || !adapterChoices.has(value.toLowerCase())) {
        throw new Error(
          `Invalid --adapter value "${value}". Expected one of: codex, antigravity, claude, both, all`
        );
      }
      adapter = value.toLowerCase();
      continue;
    }

    if (arg.startsWith("--adapter=")) {
      const value = arg.slice("--adapter=".length);
      if (!adapterChoices.has(value.toLowerCase())) {
        throw new Error(
          `Invalid --adapter value "${value}". Expected one of: codex, antigravity, claude, both, all`
        );
      }
      adapter = value.toLowerCase();
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option "${arg}". Use --help to see available options.`);
    }

    positional.push(arg);
  }

  if (positional.length > 0) {
    if (positional[0] === "status") {
      command = "status";
      target = positional[1] || target || ".";
    } else if (positional[0] === "update") {
      command = "update";
      target = positional[1] || target || ".";
    } else {
      target = positional[0];
    }
  }

  return {
    command,
    target,
    adapter,
    force,
    dryRun,
    help,
    json,
    version,
    yes
  };
}

function readPackageVersion(): string {
  const pkgPath = path.join(packageRoot, "package.json");
  const content = fsSync.readFileSync(pkgPath, "utf8");
  return (JSON.parse(content) as { version: string }).version;
}

function printHelp(): void {
  console.log(`
Nexus-DevFlow CLI v${readPackageVersion()}

Usage:
  npx @jakkrichm/create-nexus-devflow [target-dir] [options]
  nexus-devflow status [target-dir] [options]
  nexus-devflow update [target-dir] [options]

Commands:
  status             Show project overview, progress, findings, git status, and next action
  update             Update existing DevFlow installation without overwriting user changes

Options:
  --adapter <name>   Tool adapters to install: codex, antigravity, claude, both (default: both)
  --json             Print status as structured JSON object
  --target, -t       Target project directory
  --force, -f        Overwrite conflicting files without prompting
  --dry-run          Preview changes without modifying disk
  -y, --yes          Automatically confirm interactive prompts
  --version, -v      Show version number
  --help, -h         Show help screen
`);
}

function printInstallPlan(prepared: PreparedUpdate): void {
  console.log(`\nNexus-DevFlow v${readPackageVersion()}`);
  console.log(`Target Directory: ${prepared.targetDir}`);
  console.log(`Active Adapters : ${prepared.activeAdapters.join(", ")}\n`);

  console.log(`Files to create : ${prepared.createList.length}`);
  console.log(`Files to update : ${prepared.updateList.length}`);
  console.log(`Conflicts found : ${prepared.conflictList.length}`);

  if (prepared.conflictList.length > 0) {
    console.log("\nConflicting files:");
    for (const conflict of prepared.conflictList) {
      console.log(`  - ${conflict.relativePath} (${conflict.detail})`);
    }
  }
}

function printUpdatePlan(prepared: PreparedUpdate): void {
  console.log(`\nNexus-DevFlow Update Plan (v${readPackageVersion()})`);
  console.log(`Target Directory: ${prepared.targetDir}`);
  console.log(`Active Adapters : ${prepared.activeAdapters.join(", ")}\n`);

  console.log(`Files to create : ${prepared.createList.length}`);
  console.log(`Files to update : ${prepared.updateList.length}`);
  console.log(`Orphaned files  : ${prepared.orphanedFiles.length}`);
  console.log(`Conflicts found : ${prepared.conflictList.length}`);
}

async function confirmInstallConflicts(prepared: PreparedUpdate, options: CliOptions): Promise<boolean> {
  if (options.yes) return true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answer = await rl.question(
    `\nOverwrite ${prepared.conflictList.length} conflicting file(s)? [y/N] `
  );
  rl.close();
  return answer.trim().toLowerCase() === "y";
}

async function confirmUpdateConflicts(prepared: PreparedUpdate, options: CliOptions): Promise<boolean> {
  if (options.yes) return true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answer = await rl.question(
    `\nOverwrite ${prepared.conflictList.length} customized file(s) with update? [y/N] `
  );
  rl.close();
  return answer.trim().toLowerCase() === "y";
}

function printNextSteps(): void {
  console.log("\nNext steps in your AI IDE (Antigravity, Claude Code, Codex, etc.):");
  console.log("  1. Project Setup & Baseline:");
  console.log("     - Existing project : Run `/adopt` (or `$adopt`) to scan codebase and bootstrap context.");
  console.log("     - Fresh project    : Run `/onboard` (or `$onboard`) to configure project baseline.");
  console.log("  2. System Health & CI:");
  console.log("     - Health check     : Run `/doctor` (or `$doctor`) to verify adapters and setup.");
  console.log("     - CI configuration : Run `/ci` (or `$ci`) to setup GitHub Actions workflow.");
  console.log("  3. Delivery Flow:");
  console.log("     - Interactive guide: Run `/devflow` (or `$devflow`) for state & routing assistance.");
  console.log("     - Start new work   : Run `/00-discover` (or `$00-discover`) to begin delivery lifecycle.");
}

function printInstallSuccess(targetDir: string, result: { appliedCount: number }): void {
  console.log("\nNexus-DevFlow overlay successfully installed!");
  console.log(`Applied ${result.appliedCount} file(s).`);
  printNextSteps();
}

function printUpdateSuccess(prepared: PreparedUpdate, result: { appliedCount: number; removedCount: number }): void {
  console.log("\nNexus-DevFlow update successfully applied!");
  console.log(`Applied ${result.appliedCount} file(s), removed ${result.removedCount} orphaned file(s).`);
  printNextSteps();
}

if (
  process.argv[1] &&
  fsSync.realpathSync(process.argv[1]) === fsSync.realpathSync(fileURLToPath(import.meta.url))
) {
  main().catch((err: unknown) => {
    console.error(`\nError: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  });
}

export { main, parseArgs };
