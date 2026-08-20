#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const upstreamRepository = "https://github.com/aiblueprinthq/ai-blueprint.git";
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
  const options: { repoRoot: string; cloneParent: string | null; help?: boolean } = {
    repoRoot: process.cwd(),
    cloneParent: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--help") {
      options.help = true;
    } else if (argument === "--repo-root" || argument === "--clone-parent") {
      const value = argv[index + 1];

      if (!value) {
        throw new Error(`${argument} requires a path`);
      }

      index += 1;
      options[argument === "--repo-root" ? "repoRoot" : "cloneParent"] = value;
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
    tracking.repository !== upstreamRepository ||
    tracking.branch !== upstreamBranch ||
    !/^[0-9a-f]{40}$/.test(tracking.lastReviewedCommit || "")
  ) {
    throw new Error(`${trackingRelativePath} has an unsupported tracking contract`);
  }

  run("git", ["cat-file", "-e", `${tracking.lastReviewedCommit}^{commit}`], cloneRoot);
  return tracking;
}

function discoverSharedBaseline(repoRoot: string, cloneRoot: string): string | null {
  const upstreamCommits = run("git", ["rev-list", upstreamBranch], cloneRoot)
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
      "Usage: inspect-upstream.ts [--repo-root PATH] [--clone-parent PATH]\n" +
      "Clones AI Blueprint and prints a read-only upstream comparison as JSON."
    );
    return;
  }

  const repoRoot = fs.realpathSync(path.resolve(options.repoRoot));
  validateNexusRepository(repoRoot);

  const cloneParent = options.cloneParent
    ? fs.realpathSync(path.resolve(options.cloneParent))
    : fs.mkdtempSync(path.join(os.tmpdir(), "nexus-upstream-review-"));
  const cloneRoot = path.join(cloneParent, "ai-blueprint");

  if (fs.existsSync(cloneRoot)) {
    throw new Error(`Clone target already exists: ${cloneRoot}`);
  }

  run(
    "git",
    ["clone", "--quiet", "--branch", upstreamBranch, "--single-branch", upstreamRepository, cloneRoot],
    repoRoot
  );

  const upstreamHead = run("git", ["rev-parse", upstreamBranch], cloneRoot);
  const tracking = readTracking(repoRoot, cloneRoot);
  const nexusComparisonBase = discoverSharedBaseline(repoRoot, cloneRoot);
  const baseline = tracking?.lastReviewedCommit || nexusComparisonBase || upstreamHead;
  const commitCount = Number(
    run("git", ["rev-list", "--count", `${baseline}..${upstreamHead}`], cloneRoot)
  );
  const upstreamChanges = parseChanges(
    run("git", ["diff", "--name-status", "--find-renames", `${baseline}..${upstreamHead}`], cloneRoot)
  );
  const nexusChanges = nexusComparisonBase
    ? parseChanges(
        run(
          "git",
          ["diff", "--name-status", "--find-renames", `${nexusComparisonBase}..HEAD`],
          repoRoot
        )
      )
    : [];
  const nexusPaths = new Set(flattenPaths(nexusChanges));
  const overlappingPaths = flattenPaths(upstreamChanges).filter((entry) =>
    nexusPaths.has(entry)
  );
  const commits = parseCommits(
    run(
      "git",
      ["log", "--reverse", "--format=%H%x1f%aI%x1f%s%x1e", `${baseline}..${upstreamHead}`],
      cloneRoot
    )
  );

  console.log(
    JSON.stringify(
      {
        schemaVersion: 1,
        repository: upstreamRepository,
        branch: upstreamBranch,
        cloneRoot,
        trackingSource: tracking ? trackingRelativePath : (nexusComparisonBase ? "shared-git-history" : "upstream-head"),
        nexusComparisonBase,
        baseline: { commit: baseline, tag: tryDescribeTag(cloneRoot, baseline) },
        upstream: {
          commit: upstreamHead,
          tag: tryDescribeTag(cloneRoot, upstreamHead)
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
