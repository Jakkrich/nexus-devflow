#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultLocalUpstreamPath = "d:/devtools/ai-blueprint";
const fallbackRemoteRepository = "https://github.com/aiblueprinthq/ai-blueprint.git";
const upstreamBranch = "main";
const trackingRelativePath = ".nexus/upstream-ai-blueprint.json";

function run(command: string, args: string[], cwd: string): string {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "unknown error").trim();
    throw new Error(`${command} ${args.join(" ")} failed: ${detail}`);
  }

  return result.stdout.trim();
}

function parseArgs(argv: string[]) {
  const options: { repoRoot: string; upstreamPath: string | null; cloneParent: string | null; help?: boolean } = {
    repoRoot: process.cwd(),
    upstreamPath: null,
    cloneParent: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--help") {
      options.help = true;
    } else if (argument === "--repo-root" || argument === "--clone-parent" || argument === "--upstream-path") {
      const value = argv[index + 1];

      if (!value) {
        throw new Error(`${argument} requires a path`);
      }

      index += 1;
      if (argument === "--repo-root") options.repoRoot = value;
      else if (argument === "--clone-parent") options.cloneParent = value;
      else options.upstreamPath = value;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function validateNexusRepository(repoRoot: string) {
  const rootMetadata = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")
  ) as { name?: string };
  const packageMetadata = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "packages", "create-nexus-devflow", "package.json"),
      "utf8"
    )
  ) as { name?: string };

  if (
    rootMetadata.name !== "nexus-devflow" ||
    packageMetadata.name !== "@jakkrichm/create-nexus-devflow"
  ) {
    throw new Error("Run this inspector only in the Nexus DevFlow repository");
  }

  run("git", ["rev-parse", "--is-inside-work-tree"], repoRoot);
}

function readTracking(repoRoot: string, cloneRoot: string) {
  const trackingPath = path.join(repoRoot, ...trackingRelativePath.split("/"));

  if (!fs.existsSync(trackingPath)) {
    return null;
  }

  const tracking = JSON.parse(fs.readFileSync(trackingPath, "utf8")) as {
    schemaVersion: number;
    repository: string;
    branch: string;
    lastReviewedCommit?: string;
  };

  if (
    tracking.schemaVersion !== 1 ||
    !/^[0-9a-f]{40}$/.test(tracking.lastReviewedCommit || "")
  ) {
    return null;
  }

  const exists = spawnSync("git", ["cat-file", "-e", `${tracking.lastReviewedCommit}^{commit}`], {
    cwd: cloneRoot,
    stdio: "ignore",
    windowsHide: true
  });

  return exists.status === 0 ? tracking : null;
}

function discoverSharedBaseline(repoRoot: string, cloneRoot: string): string | null {
  const upstreamCommits = run("git", ["rev-list", "--max-count=500", "HEAD"], cloneRoot)
    .split(/\r?\n/)
    .filter(Boolean);

  for (const commit of upstreamCommits) {
    const exists = spawnSync("git", ["cat-file", "-e", `${commit}^{commit}`], {
      cwd: repoRoot,
      stdio: "ignore",
      windowsHide: true
    });

    if (exists.status !== 0) {
      continue;
    }

    const ancestor = spawnSync("git", ["merge-base", "--is-ancestor", commit, "HEAD"], {
      cwd: repoRoot,
      stdio: "ignore",
      windowsHide: true
    });

    if (ancestor.status === 0) {
      return commit;
    }
  }

  return null;
}

function parseChanges(output: string): Array<{ status: string; paths: string[] }> {
  if (!output) {
    return [];
  }

  return output.split(/\r?\n/).map((line) => {
    const fields = line.split("\t");
    return { status: fields[0], paths: fields.slice(1) };
  });
}

function flattenPaths(changes: Array<{ status: string; paths: string[] }>): string[] {
  return [...new Set(changes.flatMap((change) => change.paths))].sort();
}

function parseCommits(output: string): Array<{ commit: string; authoredAt: string; subject: string }> {
  if (!output) {
    return [];
  }

  return output.split("\u001e").filter(Boolean).map((record) => {
    const [commit, authoredAt, subject] = record.trim().split("\u001f");
    return { commit, authoredAt, subject };
  });
}

function tryDescribeTag(cloneRoot: string, commit: string): string | null {
  const result = spawnSync("git", ["describe", "--tags", "--abbrev=0", commit], {
    cwd: cloneRoot,
    encoding: "utf8",
    windowsHide: true
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(
      "Usage: inspect-upstream.ts [--repo-root PATH] [--upstream-path PATH] [--clone-parent PATH]\n" +
      "Inspects local or remote AI Blueprint upstream repository and outputs comparison JSON."
    );
    return;
  }

  const repoRoot = fs.realpathSync(path.resolve(options.repoRoot));
  validateNexusRepository(repoRoot);

  let upstreamRoot = "";
  let sourceMode = "local-disk";

  // Check for local project path first
  const candidateLocalPath = options.upstreamPath
    ? path.resolve(options.upstreamPath)
    : (fs.existsSync(defaultLocalUpstreamPath) ? defaultLocalUpstreamPath : path.resolve(repoRoot, "../ai-blueprint"));

  if (fs.existsSync(candidateLocalPath) && fs.existsSync(path.join(candidateLocalPath, ".git"))) {
    upstreamRoot = fs.realpathSync(candidateLocalPath);
    sourceMode = "local-disk";
  } else {
    // Fallback to clone if local path does not exist
    const cloneParent = options.cloneParent
      ? fs.realpathSync(path.resolve(options.cloneParent))
      : fs.mkdtempSync(path.join(os.tmpdir(), "nexus-upstream-review-"));
    upstreamRoot = path.join(cloneParent, "ai-blueprint");

    if (fs.existsSync(upstreamRoot)) {
      throw new Error(`Clone target already exists: ${upstreamRoot}`);
    }

    run(
      "git",
      ["clone", "--quiet", "--branch", upstreamBranch, "--single-branch", fallbackRemoteRepository, upstreamRoot],
      repoRoot
    );
    sourceMode = "network-clone";
  }

  const upstreamHead = run("git", ["rev-parse", "HEAD"], upstreamRoot);
  const tracking = readTracking(repoRoot, upstreamRoot);
  const nexusComparisonBase = discoverSharedBaseline(repoRoot, upstreamRoot);
  const baseline = tracking?.lastReviewedCommit || nexusComparisonBase || upstreamHead;
  const commitCount = Number(
    run("git", ["rev-list", "--count", `${baseline}..${upstreamHead}`], upstreamRoot)
  );
  const upstreamChanges = parseChanges(
    run("git", ["diff", "--name-status", "--find-renames", `${baseline}..${upstreamHead}`], upstreamRoot)
  );

  const localPathsOutput = run("git", ["ls-files"], repoRoot);
  const localPaths = new Set(localPathsOutput.split(/\r?\n/).filter(Boolean));
  const overlappingPaths = flattenPaths(upstreamChanges).filter((entry) => localPaths.has(entry));
  const commits = parseCommits(
    run(
      "git",
      ["log", "--reverse", "--format=%H%x1f%aI%x1f%s%x1e", `${baseline}..${upstreamHead}`],
      upstreamRoot
    )
  );

  console.log(
    JSON.stringify(
      {
        schemaVersion: 1,
        sourceMode,
        upstreamPath: upstreamRoot,
        repository: sourceMode === "local-disk" ? upstreamRoot : fallbackRemoteRepository,
        branch: upstreamBranch,
        trackingSource: tracking ? trackingRelativePath : (nexusComparisonBase ? "shared-git-history" : "upstream-head"),
        nexusComparisonBase,
        baseline: { commit: baseline, tag: tryDescribeTag(upstreamRoot, baseline) },
        upstream: {
          commit: upstreamHead,
          tag: tryDescribeTag(upstreamRoot, upstreamHead)
        },
        updateAvailable: commitCount > 0,
        commitCount,
        commits,
        upstreamChanges,
        overlappingPaths,
        nexusWorkingTreeClean: run("git", ["status", "--porcelain"], repoRoot) === ""
      },
      null,
      2
    )
  );
}

if (
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
) {
  try {
    main();
  } catch (error: unknown) {
    console.error(`Upstream inspection failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
