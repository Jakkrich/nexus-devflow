#!/usr/bin/env node

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import {
  openDashboard,
  startDashboardServer
} from "../lib/dashboard.js";
import {
  formatHumanStatus,
  readProjectStatus,
  shouldUseColor
} from "../lib/status.js";
import {
  createSpinner,
  createStyle
} from "../lib/ui.js";
import {
  applyPreparedUpdate,
  prepareUpdate,
  type PreparedUpdate
} from "../lib/update.js";
import {
  applyUninstall,
  prepareUninstall,
  type PreparedUninstall
} from "../lib/uninstall.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..", "..");
const templateRoot = path.join(packageRoot, "template");

const adapterChoices = new Set(["codex", "antigravity", "claude", "copilot", "both", "all"]);

interface CliOptions {
  command: "install" | "status" | "ui" | "update" | "uninstall" | "eject";
  target: string | null;
  adapter: string;
  force: boolean;
  dryRun: boolean;
  help: boolean;
  json: boolean;
  open: boolean;
  version: boolean;
  yes: boolean;
  keepHistory: boolean;
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

  if (options.command === "ui") {
    const server = await startDashboardServer(targetDir);
    const style = createStyle();
    console.log(style.bold(style.cyan(`Nexus-DevFlow Dashboard live at ${server.url}`)));
    if (options.open) {
      try {
        await openDashboard(server.url);
      } catch (err: unknown) {
        console.error(style.yellow(`Could not open browser automatically: ${err instanceof Error ? err.message : String(err)}`));
      }
    }
    await waitForShutdown();
    await server.close();
    return;
  }

  if (options.command === "uninstall" || options.command === "eject") {
    const spinner = createSpinner("Analyzing DevFlow footprint...").start();
    const prepared = await prepareUninstall({
      targetDir,
      keepHistory: options.keepHistory
    });
    spinner.stop();

    if (options.json) {
      if (options.dryRun) {
        console.log(JSON.stringify({ dryRun: true, ...prepared }, null, 2));
      } else {
        const result = await applyUninstall(prepared);
        console.log(JSON.stringify(result, null, 2));
      }
      return;
    }

    printUninstallPlan(prepared);

    if (prepared.itemsToDelete.length === 0) {
      const style = createStyle();
      console.log(`\n${style.dim("No DevFlow files or directories found in target project.")}`);
      return;
    }

    if (options.dryRun) {
      const style = createStyle();
      console.log(`\n${style.yellow("[Dry-run] No files were removed.")}`);
      return;
    }

    const proceed = options.yes || options.force || (await confirmUninstall(prepared, options));
    if (!proceed) {
      console.log("Uninstall cancelled.");
      return;
    }

    spinner.start("Removing DevFlow files and adapters...");
    const result = await applyUninstall(prepared);
    spinner.succeed("Nexus-DevFlow has been completely removed.");
    printUninstallSuccess(result);
    return;
  }

  if (!fsSync.existsSync(templateRoot)) {
    throw new Error(
      "Installer template is missing. Run `npm run prepare-template` before local testing."
    );
  }

  const version = readPackageVersion();

  if (options.command === "update") {
    const spinner = createSpinner("Checking for DevFlow updates...").start();
    const prepared = await prepareUpdate({
      targetDir,
      templateRoot,
      version,
      adapter: options.adapter
    });
    spinner.stop();

    printUpdatePlan(prepared);

    if (options.dryRun) {
      return;
    }

    const replaceConflicts =
      options.force || (await confirmUpdateConflicts(prepared, options));

    spinner.start("Applying DevFlow updates...");
    const result = await applyPreparedUpdate(prepared, { replaceConflicts });
    spinner.succeed("Nexus-DevFlow update successfully applied!");
    printUpdateSuccess(prepared, result);
    return;
  }

  const spinner = createSpinner("Analyzing target project...").start();
  const prepared = await prepareUpdate({
    targetDir,
    templateRoot,
    version,
    adapter: options.adapter
  });
  spinner.stop();

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

  spinner.start("Installing Nexus-DevFlow overlay...");
  const result = await applyPreparedUpdate(prepared, {
    replaceConflicts: options.force || prepared.conflictList.length > 0
  });
  spinner.succeed("Nexus-DevFlow overlay successfully installed!");

  printInstallSuccess(targetDir, result);
}

function parseArgs(args: readonly string[]): CliOptions {
  let command: "install" | "status" | "ui" | "update" | "uninstall" | "eject" = "install";
  let target: string | null = null;
  let adapter = "both";
  let force = false;
  let dryRun = false;
  let help = false;
  let json = false;
  let open = true;
  let version = false;
  let yes = false;
  let keepHistory = false;

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

    if (arg === "--no-open") {
      open = false;
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

    if (arg === "--keep-history") {
      keepHistory = true;
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
          `Invalid --adapter value "${value}". Expected one of: codex, antigravity, claude, copilot, both, all`
        );
      }
      adapter = value.toLowerCase();
      continue;
    }

    if (arg.startsWith("--adapter=")) {
      const value = arg.slice("--adapter=".length);
      if (!adapterChoices.has(value.toLowerCase())) {
        throw new Error(
          `Invalid --adapter value "${value}". Expected one of: codex, antigravity, claude, copilot, both, all`
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
    } else if (positional[0] === "ui") {
      command = "ui";
      target = positional[1] || target || ".";
    } else if (positional[0] === "update") {
      command = "update";
      target = positional[1] || target || ".";
    } else if (positional[0] === "uninstall") {
      command = "uninstall";
      target = positional[1] || target || ".";
    } else if (positional[0] === "eject") {
      command = "eject";
      target = positional[1] || target || ".";
    } else if (positional[0] === "install") {
      command = "install";
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
    open,
    version,
    yes,
    keepHistory
  };
}

async function waitForShutdown(): Promise<void> {
  await new Promise<void>((resolve) => {
    const stop = (): void => {
      process.off("SIGINT", stop);
      process.off("SIGTERM", stop);
      resolve();
    };

    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
}

function readPackageVersion(): string {
  const pkgPath = path.join(packageRoot, "package.json");
  const content = fsSync.readFileSync(pkgPath, "utf8");
  return (JSON.parse(content) as { version: string }).version;
}

function printHelp(): void {
  const style = createStyle();
  console.log(`
${style.bold(style.cyan("Nexus-DevFlow CLI"))} ${style.bold(`v${readPackageVersion()}`)}

${style.bold("Usage:")}
  ${style.cyan("npx @jakkrichm/create-nexus-devflow")} [target-dir] [options]
  ${style.cyan("nexus-devflow status")} [target-dir] [options]
  ${style.cyan("nexus-devflow ui")} [target-dir] [options]
  ${style.cyan("nexus-devflow update")} [target-dir] [options]
  ${style.cyan("nexus-devflow uninstall")} [target-dir] [options]
  ${style.cyan("nexus-devflow eject")} [target-dir] [options]

${style.bold("Commands:")}
  ${style.brightCyan("status")}             Show project overview, progress, findings, git status, and next action
  ${style.brightCyan("ui")}                 Run local interactive web dashboard for Nexus-DevFlow
  ${style.brightCyan("update")}             Update existing DevFlow installation without overwriting user changes
  ${style.brightCyan("uninstall, eject")}   Completely remove DevFlow workflow files and adapters from project

${style.bold("Options:")}
  ${style.cyan("--adapter <name>")}   Tool adapters to install: codex, antigravity, claude, copilot, both, all
  ${style.cyan("--no-open")}          Start local dashboard without opening a browser
  ${style.cyan("--keep-history")}     Keep devflow/history/ directory during uninstall
  ${style.cyan("--json")}             Print output as structured JSON object
  ${style.cyan("--target, -t")}       Target project directory
  ${style.cyan("--force, -f")}        Overwrite conflicting files / force uninstall without prompting
  ${style.cyan("--dry-run")}          Preview changes without modifying disk
  ${style.cyan("-y, --yes")}          Automatically confirm interactive prompts
  ${style.cyan("--version, -v")}      Show version number
  ${style.cyan("--help, -h")}         Show help screen
`);
}

function printInstallPlan(prepared: PreparedUpdate): void {
  const style = createStyle();
  console.log(`\n${style.bold(style.cyan("Nexus-DevFlow"))} ${style.bold(`v${readPackageVersion()}`)}`);
  console.log(`  ${style.dim("Target Directory:")} ${style.bold(prepared.targetDir)}`);
  console.log(`  ${style.dim("Active Adapters :")} ${style.cyan(prepared.activeAdapters.join(", "))}\n`);

  console.log(`  ${style.dim("Files to create :")} ${style.bold(style.green(String(prepared.createList.length)))}`);
  console.log(`  ${style.dim("Files to update :")} ${style.bold(String(prepared.updateList.length))}`);
  console.log(`  ${style.dim("Conflicts found :")} ${prepared.conflictList.length > 0 ? style.bold(style.red(String(prepared.conflictList.length))) : style.green("0")}`);

  if (prepared.conflictList.length > 0) {
    console.log(`\n${style.yellow("Conflicting files:")}`);
    for (const conflict of prepared.conflictList) {
      console.log(`  - ${style.yellow(conflict.relativePath)} (${conflict.detail})`);
    }
  }
}

function printUpdatePlan(prepared: PreparedUpdate): void {
  const style = createStyle();
  console.log(`\n${style.bold(style.cyan("Nexus-DevFlow Update Plan"))} ${style.bold(`(v${readPackageVersion()})`)}`);
  console.log(`  ${style.dim("Target Directory:")} ${style.bold(prepared.targetDir)}`);
  console.log(`  ${style.dim("Active Adapters :")} ${style.cyan(prepared.activeAdapters.join(", "))}\n`);

  console.log(`  ${style.dim("Files to create :")} ${style.bold(style.green(String(prepared.createList.length)))}`);
  console.log(`  ${style.dim("Files to update :")} ${style.bold(String(prepared.updateList.length))}`);
  console.log(`  ${style.dim("Orphaned files  :")} ${style.bold(String(prepared.orphanedFiles.length))}`);
  console.log(`  ${style.dim("Conflicts found :")} ${prepared.conflictList.length > 0 ? style.bold(style.red(String(prepared.conflictList.length))) : style.green("0")}`);
}

function printUninstallPlan(prepared: PreparedUninstall): void {
  const style = createStyle();
  console.log(`\n${style.bold(style.red("Nexus-DevFlow Clean Eject / Uninstall"))} ${style.bold(`(v${readPackageVersion()})`)}`);
  console.log(`  ${style.dim("Target Directory:")} ${style.bold(prepared.targetDir)}\n`);

  console.log(`  ${style.dim("Items to delete :")} ${style.bold(style.red(String(prepared.itemsToDelete.length)))} (${prepared.totalFiles} files, ${prepared.totalDirectories} directories)`);
  if (prepared.itemsToDelete.length > 0) {
    console.log(`\n${style.yellow("DevFlow Footprint:")}`);
    for (const item of prepared.itemsToDelete) {
      console.log(`  - ${style.dim(item)}`);
    }
  }
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

async function confirmUninstall(prepared: PreparedUninstall, options: CliOptions): Promise<boolean> {
  if (options.yes) return true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answer = await rl.question(
    `\nAre you sure you want to completely remove DevFlow from this project? [y/N] `
  );
  rl.close();
  return answer.trim().toLowerCase() === "y";
}

function printNextSteps(): void {
  const style = createStyle();
  console.log(`\n${style.bold("Next steps in your AI IDE")} ${style.dim("(Antigravity, Claude Code, Codex, Cursor, etc.):")}`);
  console.log(`  - ${style.cyan("Existing project")} : Run ${style.bold(style.brightCyan("/adopt"))} ${style.dim("(or $adopt)")} to scan codebase and bootstrap context.`);
  console.log(`  - ${style.cyan("Fresh project")}    : Run ${style.bold(style.brightCyan("/onboard"))} ${style.dim("(or $onboard)")} to configure project baseline.`);
}

function printInstallSuccess(targetDir: string, result: { appliedCount: number }): void {
  const style = createStyle();
  console.log(`  ${style.dim("Applied:")} ${style.bold(style.green(String(result.appliedCount)))} file(s).`);
  printNextSteps();
}

function printUpdateSuccess(prepared: PreparedUpdate, result: { appliedCount: number; removedCount: number }): void {
  const style = createStyle();
  console.log(`  ${style.dim("Applied:")} ${style.bold(style.green(String(result.appliedCount)))} file(s), ${style.dim("removed")} ${style.bold(String(result.removedCount))} orphaned file(s).`);
  printNextSteps();
}

function printUninstallSuccess(result: { deletedCount: number; deletedItems: string[] }): void {
  const style = createStyle();
  console.log(`\n${style.green("✔")} ${style.bold("Nexus-DevFlow has been completely removed from the project.")}`);
  console.log(`  ${style.dim("Deleted")} ${style.bold(String(result.deletedCount))} item(s). No DevFlow traces remain.`);
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
