#!/usr/bin/env node

const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");
const {
  MANIFEST_PATH,
  applyPreparedUpdate,
  prepareUpdate,
  writeInstallManifest
} = require("../lib/update");

const packageRoot = path.resolve(__dirname, "..");
const templateRoot = path.join(packageRoot, "template");

const adapterChoices = new Set(["codex", "antigravity", "claude", "both", "all"]);

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (options.version) {
    console.log(readPackageVersion());
    return;
  }

  if (!fsSync.existsSync(templateRoot)) {
    throw new Error(
      "Installer template is missing. Run `npm run prepare-template` before local testing."
    );
  }

  const targetDir = path.resolve(process.cwd(), options.target || ".");
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

  printInstallPlan(prepared, options);

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

  printInstallSuccess(targetDir, result, options);
}

function parseArgs(args) {
  let command = "install";
  let target = null;
  let adapter = "both";
  let force = false;
  let dryRun = false;
  let help = false;
  let version = false;
  let yes = false;

  const positional = [];

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
    if (positional[0] === "update") {
      command = "update";
      target = positional[1] || ".";
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
    version,
    yes
  };
}

function readPackageVersion() {
  const pkgPath = path.join(packageRoot, "package.json");
  const content = fsSync.readFileSync(pkgPath, "utf8");
  return JSON.parse(content).version;
}

function printHelp() {
  console.log(`
Nexus-DevFlow Installer v${readPackageVersion()}

Usage:
  npx @jakkrichm/create-nexus-devflow [target-dir] [options]
  npx @jakkrichm/create-nexus-devflow update [target-dir] [options]

Options:
  --adapter <name>   Tool adapters to install: codex, antigravity, claude, both (default: both)
  --force, -f        Overwrite conflicting files without prompting
  --dry-run          Preview changes without modifying disk
  -y, --yes          Automatically confirm interactive prompts
  --version, -v      Show version number
  --help, -h         Show help screen
`);
}

function printInstallPlan(prepared, options) {
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

function printUpdatePlan(prepared) {
  console.log(`\nNexus-DevFlow Update Plan (v${readPackageVersion()})`);
  console.log(`Target Directory: ${prepared.targetDir}`);
  console.log(`Active Adapters : ${prepared.activeAdapters.join(", ")}\n`);

  console.log(`Files to create : ${prepared.createList.length}`);
  console.log(`Files to update : ${prepared.updateList.length}`);
  console.log(`Orphaned files  : ${prepared.orphanedFiles.length}`);
  console.log(`Conflicts found : ${prepared.conflictList.length}`);
}

async function confirmInstallConflicts(prepared, options) {
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

async function confirmUpdateConflicts(prepared, options) {
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

function printInstallSuccess(targetDir, result, options) {
  console.log("\nNexus-DevFlow overlay successfully installed!");
  console.log(`Applied ${result.appliedCount} file(s).`);
  console.log("\nNext steps:");
  console.log("  1. Open your project in your AI IDE (Antigravity, Codex, Claude Code, etc.)");
  console.log("  2. Run `/00-Discover` or `/help` to start your DevFlow workspace workflow.");
}

function printUpdateSuccess(prepared, result) {
  console.log("\nNexus-DevFlow update successfully applied!");
  console.log(`Applied ${result.appliedCount} file(s), removed ${result.removedCount} orphaned file(s).`);
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
