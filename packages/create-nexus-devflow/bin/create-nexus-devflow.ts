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
  addIdea,
  formatIdeasHuman,
  readIdeas
} from "../lib/ideas.js";
import {
  addFinding,
  formatFindingsHuman,
  readFindings,
  resolveFinding,
  type FindingSeverity,
  type FindingStatus
} from "../lib/findings.js";
import {
  formatDoctorHuman,
  runDoctor
} from "../lib/doctor.js";
import {
  formatHistoryHuman,
  readHistory
} from "../lib/history.js";
import {
  evaluateGate,
  formatGateReport
} from "../lib/gatekeeper.js";
import {
  sliceContextForStage,
  type SliceStage
} from "../lib/context-slicer.js";
import {
  detectGitDrift,
  reconcileState
} from "../lib/drift-reconciler.js";
import {
  renderStudioHtml
} from "../lib/webview-studio.js";
import {
  buildCodeGraph,
  calculateBlastRadius
} from "../lib/code-graph.js";
import {
  generateSwarmPlan
} from "../lib/swarm-orchestrator.js";
import {
  startMcpServer
} from "../lib/mcp.js";
import {
  installGitHook,
  uninstallGitHooks,
  type GitHookType
} from "../lib/git-hooks.js";
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
const packageRoot = fsSync.existsSync(path.join(__dirname, "..", "package.json"))
  ? path.resolve(__dirname, "..")
  : path.resolve(__dirname, "..", "..");
const templateRoot = path.join(packageRoot, "template");

const adapterChoices = new Set(["codex", "antigravity", "claude", "copilot", "opencode", "both", "all"]);

interface CliOptions {
  command:
  | "dashboard"
  | "install"
  | "status"
  | "ui"
  | "update"
  | "uninstall"
  | "eject"
  | "idea"
  | "ideas"
  | "findings"
  | "doctor"
  | "archive"
  | "check-gate"
  | "hook"
  | "mcp"
  | "slice"
  | "drift"
  | "reconcile"
  | "studio"
  | "swarm"
  | "graph";
  subcommandAction?: "add" | "list" | "resolve" | "stats" | "install" | "uninstall";
  subcommandArg?: string;
  graphFile?: string;
  sliceStage?: SliceStage;
  maxTokens?: number;
  hookType?: GitHookType;
  ideaTitle?: string;
  findingStatus?: FindingStatus;
  findingSeverity?: FindingSeverity;
  findingId?: string;
  findingLocation?: string;
  findingImpact?: string;
  findingRemediation?: string;
  blockersOnly: boolean;
  fix: boolean;
  statsOnly: boolean;
  strict: boolean;
  deprecatedUi: boolean;
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

  if (options.deprecatedUi) {
    console.warn("Warning: `ui` is deprecated; use `dashboard` instead.");
  }

  if (options.command === "mcp") {
    startMcpServer(targetDir);
    return;
  }

  if (options.command === "slice") {
    const stage = options.sliceStage || "implement";
    const sliceResult = await sliceContextForStage(targetDir, stage, { maxTokens: options.maxTokens });
    if (options.json) {
      console.log(JSON.stringify(sliceResult, null, 2));
    } else {
      console.log(`[DevFlow JIT Context Slice - Stage: ${sliceResult.stage}]`);
      console.log(`Estimated Tokens: ~${sliceResult.estimatedTokens} (Reduction: ~${sliceResult.reductionPercentage}%)\n`);
      console.log(sliceResult.content);
    }
    return;
  }

  if (options.command === "drift") {
    const drift = await detectGitDrift(targetDir);
    if (options.json) {
      console.log(JSON.stringify(drift, null, 2));
    } else {
      const style = createStyle();
      if (!drift.hasDrift && drift.phantomFiles.length === 0) {
        console.log(style.green("✔ No Git drift detected. Living spec is in sync with repository files."));
      } else {
        console.log(style.bold(style.yellow("Git Drift Detection Report:")));
        if (drift.undocumentedFiles.length > 0) {
          console.log(style.red(`  - Undocumented modified files (${drift.undocumentedFiles.length}):`));
          for (const f of drift.undocumentedFiles) {
            console.log(`    ✖ ${f}`);
          }
        }
        if (drift.phantomFiles.length > 0) {
          console.log(style.yellow(`  - Phantom spec files (not modified in git) (${drift.phantomFiles.length}):`));
          for (const f of drift.phantomFiles) {
            console.log(`    ⚠ ${f}`);
          }
        }
        if (drift.stageDrift.isDrifted) {
          console.log(style.yellow(`  - Stage alignment drift: Active branch '${drift.stageDrift.activeBranch}' vs Stage ID '${drift.stageDrift.stageRunningId}'`));
        }
        console.log(`\nRun ${style.cyan("nexus-devflow reconcile --fix")} to auto-heal spec alignment.`);
      }
    }
    return;
  }

  if (options.command === "reconcile") {
    const result = await reconcileState(targetDir, {
      autoAddUndocumented: options.fix,
      healStage: options.fix
    });
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      const style = createStyle();
      if (result.reconciled) {
        console.log(style.green(`✔ ${result.message}`));
        if (result.addedFiles.length > 0) {
          for (const f of result.addedFiles) {
            console.log(style.dim(`  + Added to spec: ${f}`));
          }
        }
      } else {
        console.log(style.dim(result.message));
      }
    }
    return;
  }

  if (options.command === "studio") {
    const html = await renderStudioHtml(targetDir);
    if (options.json) {
      console.log(JSON.stringify({ html }, null, 2));
    } else {
      console.log(html);
    }
    return;
  }

  if (options.command === "swarm") {
    const plan = await generateSwarmPlan(targetDir);
    if (options.json) {
      console.log(JSON.stringify(plan, null, 2));
    } else {
      const style = createStyle();
      console.log(style.bold(style.cyan(`[Nexus-DevFlow Multi-Agent Swarm Matrix: ${plan.runId}]`)));
      console.log(`Title: ${plan.title} (Strategy: ${plan.executionStrategy})\n`);
      for (const t of plan.tasks) {
        const roleIcon = t.role === "coder" ? "👨‍💻" : t.role === "qa" ? "🕵️" : t.role === "security" ? "🛡️" : "👑";
        console.log(`  ${roleIcon} ${style.bold(t.id)}: ${t.title} [Role: ${t.role.toUpperCase()}]`);
        console.log(style.dim(`     Context: ${t.requiredContext.join(", ")}`));
        console.log(style.dim(`     Verify : ${t.verificationCriterion}`));
      }
    }
    return;
  }

  if (options.command === "graph") {
    const graph = await buildCodeGraph(targetDir);
    if (options.graphFile) {
      const blast = calculateBlastRadius(graph, options.graphFile);
      if (options.json) {
        console.log(JSON.stringify(blast, null, 2));
      } else {
        const style = createStyle();
        console.log(style.bold(style.cyan(`[Code Graph Blast Radius: ${blast.targetFile}]`)));
        console.log(`Impact Score: ${blast.impactScore} | Total Affected: ${blast.totalAffected} files\n`);
        if (blast.directDependents.length > 0) {
          console.log(style.bold("Direct Dependents:"));
          for (const d of blast.directDependents) console.log(`  - ${d}`);
        }
        if (blast.transitiveDependents.length > 0) {
          console.log(style.bold("Transitive Dependents:"));
          for (const t of blast.transitiveDependents) console.log(`  ~ ${t}`);
        }
      }
    } else {
      if (options.json) {
        console.log(JSON.stringify({ totalFiles: graph.totalFiles, totalEdges: graph.totalEdges, files: Object.keys(graph.nodes) }, null, 2));
      } else {
        const style = createStyle();
        console.log(style.bold(style.cyan("[Nexus-DevFlow Semantic Code Graph]")));
        console.log(`Indexed Files: ${graph.totalFiles} | Total Dependency Edges: ${graph.totalEdges}`);
        console.log(`\nRun ${style.yellow("nexus-devflow graph --file <path>")} to calculate Blast Radius.`);
      }
    }
    return;
  }

  if (options.command === "status") {

    const status = await readProjectStatus(targetDir);
    console.log(
      options.json
        ? JSON.stringify(status, null, 2)
        : formatHumanStatus(status, { color: shouldUseColor() })
    );
    return;
  }

  if (options.command === "check-gate") {
    const report = await evaluateGate(targetDir, {
      strict: options.strict,
      color: shouldUseColor()
    });

    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatGateReport(report, { color: shouldUseColor() }));
    }

    if (!report.passed) {
      process.exitCode = 1;
    }
    return;
  }

  if (options.command === "hook") {
    if (options.subcommandAction === "uninstall") {
      const result = await uninstallGitHooks(targetDir);
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        const style = createStyle(shouldUseColor());
        console.log(`\n${style.green("✔")} ${style.bold(result.message)}`);
      }
      return;
    }

    // Default: install
    const hookType: GitHookType = options.hookType || "pre-commit";
    const result = await installGitHook(targetDir, hookType, { strict: options.strict });
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      const style = createStyle(shouldUseColor());
      if (result.success) {
        console.log(`\n${style.green("✔")} ${style.bold(result.message)}`);
        console.log(`  ${style.dim("Hook:")} ${style.cyan(result.path)}`);
      } else {
        console.error(`\n${style.red("✖")} ${style.bold(result.message)}`);
        process.exitCode = 1;
      }
    }
    return;
  }

  if (options.command === "idea" || options.command === "ideas") {
    if (options.subcommandAction === "add") {
      const text = options.subcommandArg || "";
      if (!text.trim()) {
        throw new Error("Idea text is required. Example: nexus-devflow idea add \"My idea\"");
      }
      const created = await addIdea(targetDir, {
        text,
        title: options.ideaTitle
      });
      if (options.json) {
        console.log(JSON.stringify(created, null, 2));
      } else {
        const style = createStyle(shouldUseColor());
        console.log(`\n${style.green("✔")} ${style.bold("Idea added successfully!")}`);
        console.log(`  ${style.dim("ID   :")} ${style.bold(style.cyan(created.id))}`);
        console.log(`  ${style.dim("Title:")} ${style.bold(created.title)}`);
        console.log(`  ${style.dim("Start:")} ${style.yellow(`/feature ${created.id}`)} or ${style.yellow(`/discovery ${created.id}`)}`);
      }
      return;
    }

    const ideas = await readIdeas(targetDir);
    console.log(
      options.json
        ? JSON.stringify(ideas, null, 2)
        : formatIdeasHuman(ideas, { color: shouldUseColor() })
    );
    return;
  }

  if (options.command === "findings") {
    if (options.subcommandAction === "add") {
      const title = options.subcommandArg || "";
      if (!title.trim()) {
        throw new Error('Finding title is required. Example: nexus-devflow findings add "Hardcoded secret" --severity P0');
      }
      const result = await addFinding(targetDir, title, {
        id: options.findingId,
        severity: options.findingSeverity,
        status: options.findingStatus,
        location: options.findingLocation,
        impact: options.findingImpact,
        remediation: options.findingRemediation
      });
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        const style = createStyle(shouldUseColor());
        console.log(`\n${style.green("✔")} ${style.bold("Finding recorded successfully!")}`);
        console.log(`  ${style.dim("ID      :")} ${style.bold(style.cyan(result.finding?.id || ""))}`);
        const sev = result.finding?.severity || "P2";
        const isBlocker = sev === "P0" || sev === "P1";
        console.log(`  ${style.dim("Severity:")} ${style.bold(isBlocker ? style.red(`[${sev}]`) : style.yellow(`[${sev}]`))}`);
        console.log(`  ${style.dim("Status  :")} ${style.yellow(result.finding?.status || "")}`);
        console.log(`  ${style.dim("Title   :")} ${style.bold(result.finding?.title || "")}`);
        console.log(`  ${style.dim("File    :")} ${style.dim(result.filePath)}`);
      }
      return;
    }

    if (options.subcommandAction === "resolve") {
      const findingId = options.subcommandArg || "";
      if (!findingId.trim()) {
        throw new Error("Finding ID is required. Example: nexus-devflow findings resolve FIND-001");
      }
      const statusToSet: FindingStatus = options.findingStatus || "closed";
      const result = await resolveFinding(targetDir, findingId, statusToSet);
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        const style = createStyle(shouldUseColor());
        if (result.success) {
          console.log(`\n${style.green("✔")} ${style.bold(result.message)}`);
        } else {
          console.error(`\n${style.red("✖")} ${style.bold(result.message)}`);
          process.exitCode = 1;
        }
      }
      return;
    }

    const findings = await readFindings(targetDir);
    console.log(
      options.json
        ? JSON.stringify(findings, null, 2)
        : formatFindingsHuman(findings, {
          blockersOnly: options.blockersOnly,
          color: shouldUseColor()
        })
    );
    return;
  }

  if (options.command === "doctor") {
    const report = await runDoctor(targetDir, {
      fix: options.fix,
      color: shouldUseColor()
    });
    console.log(
      options.json
        ? JSON.stringify(report, null, 2)
        : formatDoctorHuman(report, { color: shouldUseColor() })
    );
    return;
  }

  if (options.command === "archive") {
    const history = await readHistory(targetDir);
    console.log(
      options.json
        ? JSON.stringify(history, null, 2)
        : formatHistoryHuman(history, {
          statsOnly: options.statsOnly,
          color: shouldUseColor()
        })
    );
    return;
  }

  if (options.command === "dashboard" || options.command === "ui") {
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
  let command: CliOptions["command"] = "install";
  let subcommandAction: CliOptions["subcommandAction"];
  let subcommandArg: string | undefined;
  let graphFile: string | undefined;
  let sliceStage: SliceStage | undefined;
  let maxTokens: number | undefined;
  let hookType: GitHookType | undefined;
  let ideaTitle: string | undefined;
  let findingStatus: FindingStatus | undefined;
  let findingSeverity: FindingSeverity | undefined;
  let findingId: string | undefined;
  let findingLocation: string | undefined;
  let findingImpact: string | undefined;
  let findingRemediation: string | undefined;
  let blockersOnly = false;
  let fix = false;
  let statsOnly = false;
  let strict = false;
  let deprecatedUi = false;
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

    if (arg === "--blockers") {
      blockersOnly = true;
      continue;
    }

    if (arg === "--file" && args[i + 1] && !args[i + 1].startsWith("-")) {
      graphFile = args[i + 1];
      i++;
      continue;
    }
    if (arg === "--fix") {
      fix = true;
      continue;
    }

    if (arg === "--stats") {
      statsOnly = true;
      continue;
    }

    if (arg === "--strict") {
      strict = true;
      continue;
    }

    if (arg === "--title") {
      const next = args[++i];
      if (!next) {
        throw new Error(`${arg} requires a title string`);
      }
      ideaTitle = next;
      continue;
    }

    if (arg.startsWith("--title=")) {
      ideaTitle = arg.slice("--title=".length);
      continue;
    }

    if (arg === "--status") {
      const next = args[++i];
      if (!next) {
        throw new Error(`${arg} requires a status string (e.g. closed, accepted, invalid)`);
      }
      findingStatus = next.toLowerCase() as FindingStatus;
      continue;
    }

    if (arg.startsWith("--status=")) {
      findingStatus = arg.slice("--status=".length).toLowerCase() as FindingStatus;
      continue;
    }

    if (arg === "--severity" || arg === "-s") {
      const next = args[++i];
      if (!next) {
        throw new Error(`${arg} requires a severity level (P0, P1, P2, P3)`);
      }
      const sev = next.toUpperCase() as FindingSeverity;
      if (sev !== "P0" && sev !== "P1" && sev !== "P2" && sev !== "P3") {
        throw new Error(`Invalid severity "${next}". Expected one of: P0, P1, P2, P3`);
      }
      findingSeverity = sev;
      continue;
    }

    if (arg.startsWith("--severity=")) {
      const sev = arg.slice("--severity=".length).toUpperCase() as FindingSeverity;
      if (sev !== "P0" && sev !== "P1" && sev !== "P2" && sev !== "P3") {
        throw new Error(`Invalid severity "${sev}". Expected one of: P0, P1, P2, P3`);
      }
      findingSeverity = sev;
      continue;
    }

    if (arg === "--id") {
      const next = args[++i];
      if (!next) throw new Error(`${arg} requires an ID string`);
      findingId = next;
      continue;
    }

    if (arg.startsWith("--id=")) {
      findingId = arg.slice("--id=".length);
      continue;
    }

    if (arg === "--location") {
      const next = args[++i];
      if (!next) throw new Error(`${arg} requires a location string`);
      findingLocation = next;
      continue;
    }

    if (arg.startsWith("--location=")) {
      findingLocation = arg.slice("--location=".length);
      continue;
    }

    if (arg === "--impact") {
      const next = args[++i];
      if (!next) throw new Error(`${arg} requires an impact string`);
      findingImpact = next;
      continue;
    }

    if (arg.startsWith("--impact=")) {
      findingImpact = arg.slice("--impact=".length);
      continue;
    }

    if (arg === "--remediation") {
      const next = args[++i];
      if (!next) throw new Error(`${arg} requires a remediation string`);
      findingRemediation = next;
      continue;
    }

    if (arg.startsWith("--remediation=")) {
      findingRemediation = arg.slice("--remediation=".length);
      continue;
    }

    if (arg === "--stage") {
      const next = args[++i];
      if (!next) throw new Error(`${arg} requires a stage name`);
      sliceStage = next.toLowerCase() as SliceStage;
      continue;
    }

    if (arg.startsWith("--stage=")) {
      sliceStage = arg.slice("--stage=".length).toLowerCase() as SliceStage;
      continue;
    }

    if (arg === "--max-tokens") {
      const next = args[++i];
      if (!next || isNaN(Number(next))) throw new Error(`${arg} requires a number`);
      maxTokens = Number(next);
      continue;
    }

    if (arg.startsWith("--max-tokens=")) {
      maxTokens = Number(arg.slice("--max-tokens=".length));
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
          `Invalid --adapter value "${value}". Expected one of: codex, antigravity, claude, copilot, opencode, both, all`
        );
      }
      adapter = value.toLowerCase();
      continue;
    }

    if (arg.startsWith("--adapter=")) {
      const value = arg.slice("--adapter=".length);
      if (!adapterChoices.has(value.toLowerCase())) {
        throw new Error(
          `Invalid --adapter value "${value}". Expected one of: codex, antigravity, claude, copilot, opencode, both, all`
        );
      }
      adapter = value.toLowerCase();
      continue;
    }

    if (arg === "--codex") {
      adapter = "codex";
      continue;
    }

    if (arg === "--claude") {
      adapter = "claude";
      continue;
    }

    if (arg === "--copilot") {
      adapter = "copilot";
      continue;
    }

    if (arg === "--antigravity") {
      adapter = "antigravity";
      continue;
    }

    if (arg === "--opencode") {
      adapter = "opencode";
      continue;
    }

    if (arg === "--all" || arg === "--both") {
      adapter = "all";
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option "${arg}". Use --help to see available options.`);
    }

    positional.push(arg);
  }

  if (positional.length > 0) {
    const first = positional[0].toLowerCase();
    if (first === "status") {
      command = "status";
      target = positional[1] || target || ".";
    } else if (first === "mcp") {
      command = "mcp";
      target = positional[1] || target || ".";
    } else if (first === "slice") {
      command = "slice";
      if (positional[1] && !positional[1].startsWith("-")) {
        sliceStage = positional[1].toLowerCase() as SliceStage;
        target = positional[2] || target || ".";
      } else {
        target = positional[1] || target || ".";
      }
    } else if (first === "drift") {
      command = "drift";
      target = positional[1] || target || ".";
    } else if (first === "reconcile") {
      command = "reconcile";
      target = positional[1] || target || ".";
    } else if (first === "studio") {
      command = "studio";
      target = positional[1] || target || ".";
    } else if (first === "swarm") {
      command = "swarm";
      target = positional[1] || target || ".";
    } else if (first === "graph") {
      command = "graph";
      target = positional[1] || target || ".";
    } else if (first === "check-gate") {
      command = "check-gate";
      target = positional[1] || target || ".";
    } else if (first === "hook" || first === "hooks") {
      command = "hook";
      if (positional[1] === "uninstall") {
        subcommandAction = "uninstall";
        target = positional[2] || target || ".";
      } else if (positional[1] === "install") {
        subcommandAction = "install";
        if (positional[2] === "pre-commit" || positional[2] === "pre-push") {
          hookType = positional[2];
          target = positional[3] || target || ".";
        } else {
          target = positional[2] || target || ".";
        }
      } else if (positional[1] === "pre-commit" || positional[1] === "pre-push") {
        subcommandAction = "install";
        hookType = positional[1];
        target = positional[2] || target || ".";
      } else {
        subcommandAction = "install";
        target = positional[1] || target || ".";
      }
    } else if (first === "dashboard") {
      command = "dashboard";
      target = positional[1] || target || ".";
    } else if (first === "ui") {
      command = "dashboard";
      deprecatedUi = true;
      target = positional[1] || target || ".";
    } else if (first === "update") {
      command = "update";
      target = positional[1] || target || ".";
    } else if (first === "uninstall") {
      command = "uninstall";
      target = positional[1] || target || ".";
    } else if (first === "eject") {
      command = "eject";
      target = positional[1] || target || ".";
    } else if (first === "idea" || first === "ideas") {
      command = first === "idea" ? "idea" : "ideas";
      if (positional[1] === "add") {
        subcommandAction = "add";
        subcommandArg = positional[2];
        target = positional[3] || target || ".";
      } else if (positional[1] === "list") {
        subcommandAction = "list";
        target = positional[2] || target || ".";
      } else if (positional[1] && !positional[1].startsWith("-")) {
        subcommandAction = "add";
        subcommandArg = positional[1];
        target = positional[2] || target || ".";
      } else {
        subcommandAction = "list";
        target = positional[1] || target || ".";
      }
    } else if (first === "findings") {
      command = "findings";
      if (positional[1] === "add") {
        subcommandAction = "add";
        subcommandArg = positional[2];
        target = positional[3] || target || ".";
      } else if (positional[1] === "resolve") {
        subcommandAction = "resolve";
        subcommandArg = positional[2];
        target = positional[3] || target || ".";
      } else if (positional[1] === "list") {
        subcommandAction = "list";
        target = positional[2] || target || ".";
      } else if (positional[1] && !positional[1].startsWith("-")) {
        subcommandAction = "add";
        subcommandArg = positional[1];
        target = positional[2] || target || ".";
      } else {
        subcommandAction = "list";
        target = positional[1] || target || ".";
      }
    } else if (first === "doctor") {
      command = "doctor";
      target = positional[1] || target || ".";
    } else if (first === "archive") {
      command = "archive";
      if (positional[1] === "list") {
        subcommandAction = "list";
        target = positional[2] || target || ".";
      } else if (positional[1] === "stats") {
        subcommandAction = "stats";
        statsOnly = true;
        target = positional[2] || target || ".";
      } else {
        subcommandAction = "list";
        target = positional[1] || target || ".";
      }
    } else if (first === "install") {
      command = "install";
      target = positional[1] || target || ".";
    } else {
      target = positional[0];
    }
  }

  return {
    command,
    subcommandAction,
    subcommandArg,
    graphFile,
    sliceStage,
    maxTokens,
    hookType,
    ideaTitle,
    findingStatus,
    findingSeverity,
    findingId,
    findingLocation,
    findingImpact,
    findingRemediation,
    blockersOnly,
    fix,
    statsOnly,
    strict,
    deprecatedUi,
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
  ${style.cyan("nexus-devflow mcp")} [target-dir]
  ${style.cyan("nexus-devflow slice")} [--stage <stage>] [--max-tokens <num>] [--json]
  ${style.cyan("nexus-devflow drift")} [target-dir] [--json]
  ${style.cyan("nexus-devflow reconcile")} [target-dir] [--fix] [--json]
  ${style.cyan("nexus-devflow studio")} [target-dir] [--json]
  ${style.cyan("nexus-devflow swarm")} [target-dir] [--json]
  ${style.cyan("nexus-devflow graph")} [target-dir] [--file <path>] [--json]
  ${style.cyan("nexus-devflow check-gate")} [--strict] [--json]
  ${style.cyan("nexus-devflow hook install")} [pre-commit|pre-push]
  ${style.cyan("nexus-devflow hook uninstall")}
  ${style.cyan("nexus-devflow dashboard")} [target-dir] [options]
  ${style.cyan("nexus-devflow idea")} add "<text>" [--title "<title>"]
  ${style.cyan("nexus-devflow ideas")} [list] [--json]
  ${style.cyan("nexus-devflow findings add")} "<title>" [--severity P0|P1|P2|P3] [--location <loc>]
  ${style.cyan("nexus-devflow findings")} [list] [--blockers] [--json]
  ${style.cyan("nexus-devflow findings resolve")} <ID> [--status <status>]
  ${style.cyan("nexus-devflow doctor")} [--fix] [--json]
  ${style.cyan("nexus-devflow archive")} [list|stats] [--json]
  ${style.cyan("nexus-devflow update")} [target-dir] [options]
  ${style.cyan("nexus-devflow uninstall")} [target-dir] [options]
  ${style.cyan("nexus-devflow eject")} [target-dir] [options]

${style.bold("Commands:")}
  ${style.brightCyan("status")}             Show project overview, progress, findings, git status, and next action
  ${style.brightCyan("mcp")}                Run Model Context Protocol (MCP) JSON-RPC Stdio Server for AI agents
  ${style.brightCyan("slice")}              Generate JIT stage-aware context slice (reduces AI tokens by 60-70%)
  ${style.brightCyan("check-gate")}         CI/CD quality gatekeeper check (returns exit code 0 or 1)
  ${style.brightCyan("hook")}               Install or remove local Git pre-commit/pre-push gatekeeper hooks
  ${style.brightCyan("dashboard")}          Run local interactive web dashboard for Nexus-DevFlow (alias: ui)
  ${style.brightCyan("idea, ideas")}        Manage idea backlog: add new ideas or list pending ideas
  ${style.brightCyan("findings")}           Inspect findings ledger, record new findings, filter blockers, or resolve
  ${style.brightCyan("doctor")}             Inspect project workspace health and auto-heal missing files (--fix)
  ${style.brightCyan("archive")}            Explore delivered runs and release statistics from devflow/history/
  ${style.brightCyan("update")}             Update existing DevFlow installation without overwriting user changes
  ${style.brightCyan("uninstall, eject")}   Completely remove DevFlow workflow files and adapters from project

${style.bold("Options:")}
  ${style.cyan("--strict")}           Strict mode for check-gate (blocks unverified runs)
  ${style.cyan("--title <text>")}     Custom title for idea add
  ${style.cyan("--severity, -s")}     Finding severity: P0, P1, P2, P3 (default: P2)
  ${style.cyan("--status <name>")}    Status to set when resolving finding (default: closed)
  ${style.cyan("--location <path>")}  Finding source code file and line location
  ${style.cyan("--blockers")}         Filter findings to only active P0/P1 blockers
  ${style.cyan("--fix")}              Automatically repair/create missing context files in doctor
  ${style.cyan("--stats")}            Display history summary statistics only
  ${style.cyan("--adapter <name>")}   Tool adapters to install: codex, antigravity, claude, copilot, opencode, both, all
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
