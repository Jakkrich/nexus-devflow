#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import test from "node:test";

interface OverviewRunResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

const tsxPackagePath = createRequire(import.meta.url).resolve("tsx/package.json");
const tsxBinaryPath = path.join(path.dirname(tsxPackagePath), "dist", "cli.cjs");
const overviewScript = path.resolve(process.cwd(), "scripts/overview.ts");

function runOverview(projectRoot: string, args: string[] = []): OverviewRunResult {
  const result = spawnSync(process.execPath, [tsxBinaryPath, overviewScript, "--project-root", projectRoot, ...args], {
    encoding: "utf8"
  });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

function makeWorkspace(): string {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-overview-"));
  const devflowDir = path.join(workspace, "devflow");
  fs.mkdirSync(devflowDir, { recursive: true });
  return workspace;
}

function writeProjectArtifacts(projectRoot: string): void {
  const projectPlanPath = path.join(projectRoot, "devflow", "project-plan.md");
  const buildPlanPath = path.join(projectRoot, "devflow", "build-plan.md");
  const ideasPath = path.join(projectRoot, "devflow", "ideas.md");
  const historyPath = path.join(projectRoot, "devflow", "history", "HISTORY.md");

  fs.writeFileSync(projectPlanPath, [
    "# Project Plan",
    "",
    "## Product Vision",
    "A focused CLI that generates a living project overview snapshot.",
    "",
    "## Architecture",
    "The project follows a simple command-and-checker architecture.",
    "",
    "## Constraints",
    "- No external network access required."
  ].join("\n"), "utf8");

  fs.writeFileSync(buildPlanPath, [
    "# Build Plan",
    "",
    "- [x] foundation setup",
    "- [ ] add integration test"
  ].join("\n"), "utf8");

  fs.mkdirSync(path.dirname(historyPath), { recursive: true });
  fs.writeFileSync(historyPath, [
    "# HISTORY",
    "",
    "| Date | Category | Title | Notes |",
    "| --- | --- | --- | --- |",
    "| 2026-08-20 | `Feature` | Added overview compiler | First draft for issue tracking. |"
  ].join("\n"), "utf8");

  fs.writeFileSync(ideasPath, [
    "# Ideas",
    "",
    "### [IDEA-013] Add test coverage for overview",
    "สถานะ: `Pending`",
    "Description: add dedicated tests."
  ].join("\n"), "utf8");

  fs.writeFileSync(path.join(projectRoot, "package.json"), JSON.stringify({
    scripts: {
      build: "npm run build",
      test: "npm test",
      check: "npm run check",
      "check:static": "npm run check:static"
    },
    engines: { node: ">=18.17" },
    devDependencies: { typescript: "5.7.2" }
  }, null, 2), "utf8");
}

test("overview renders generated content from project-plan and build-plan", () => {
  const workspace = makeWorkspace();
  writeProjectArtifacts(workspace);

  try {
    const { status, stdout, stderr } = runOverview(workspace);

    assert.equal(status, 0);
    assert.equal(stderr.length, 0);
    assert.match(stdout, /Project Overview & Source of Truth/);
    assert.match(stdout, /A focused CLI that generates a living project overview snapshot\./);
    assert.match(stdout, /\- \[x\] foundation setup/);
    assert.match(stdout, /\- \[ \] add integration test/);
    assert.match(stdout, /\*\*Feature\*\*:\s*Added overview compiler/);
    assert.match(stdout, /IDEA-013/);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("overview parses standard 7-column HISTORY.md table accurately", () => {
  const workspace = makeWorkspace();
  writeProjectArtifacts(workspace);

  const historyPath = path.join(workspace, "devflow", "history", "HISTORY.md");
  fs.writeFileSync(historyPath, [
    "# Nexus-DevFlow Master Release History Ledger",
    "",
    "| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |",
    "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |",
    "| 2026-08-22 | `038` | Feature | Sub-Feature Automatic Splitting Engine | `5b476b9` | `Released` | [038.md](features/038.md) |",
    "| 2026-08-22 | `039-fix` | Fix | Fix history row regex parsing | `HEAD` | `Released` | [039.md](fixes/039.md) |"
  ].join("\n"), "utf8");

  try {
    const { status, stdout } = runOverview(workspace);
    assert.equal(status, 0);
    assert.match(stdout, /\*\*Feature\*\*:\s*Sub-Feature Automatic Splitting Engine/);
    assert.match(stdout, /\*\*Fix\*\*:\s*Fix history row regex parsing/);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("overview supports custom templates and removes unknown placeholders", () => {
  const workspace = makeWorkspace();
  writeProjectArtifacts(workspace);

  const templatePath = path.join(workspace, "custom-template.md");
  fs.writeFileSync(templatePath, [
    "# {{projectName}}",
    "Purpose: {{projectPurpose}}",
    "Unknown field: {{does_not_exist}}"
  ].join("\n"), "utf8");

  try {
    const { status, stdout } = runOverview(workspace, ["--template", templatePath]);

    assert.equal(status, 0);
    assert.ok(/#/.test(stdout));
    assert.match(stdout, /Purpose: A focused CLI that generates a living project overview snapshot\./);
    assert.ok(!stdout.includes("{{does_not_exist}}"));
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("overview fails with clear error when required files are missing", () => {
  const workspace = makeWorkspace();

  try {
    const projectPlanPath = path.join(workspace, "devflow", "project-plan.md");
    const buildPlanPath = path.join(workspace, "devflow", "build-plan.md");
    fs.writeFileSync(buildPlanPath, "# Build Plan\n- [ ] sample", "utf8");

    const { status, stderr } = runOverview(workspace);

    assert.equal(status, 1);
    assert.ok(!fs.existsSync(projectPlanPath));
    assert.match(stderr, /Missing required file: .*project-plan\.md/);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("overview embeds devflow:source-hash and preserves hash across checkbox completion", () => {
  const workspace = makeWorkspace();
  writeProjectArtifacts(workspace);

  try {
    const first = runOverview(workspace);
    assert.equal(first.status, 0);
    const matchA = /<!--\s*devflow:source-hash\s+([0-9a-f]{64})\s*-->/.exec(first.stdout);
    assert.ok(matchA?.[1], "Expected devflow:source-hash in stdout");

    const buildPlanPath = path.join(workspace, "devflow", "build-plan.md");
    const updatedBuild = fs.readFileSync(buildPlanPath, "utf8").replace("- [ ] add integration test", "- [x] add integration test");
    fs.writeFileSync(buildPlanPath, updatedBuild, "utf8");

    const second = runOverview(workspace);
    assert.equal(second.status, 0);
    const matchB = /<!--\s*devflow:source-hash\s+([0-9a-f]{64})\s*-->/.exec(second.stdout);
    assert.ok(matchB?.[1]);
    assert.equal(matchA[1], matchB[1]);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("overview rejects placeholder plans without overwriting existing overview and enforces 20KB cap", () => {
  const workspace = makeWorkspace();
  writeProjectArtifacts(workspace);

  const overviewPath = path.join(workspace, "devflow", "context", "project-overview.md");
  fs.mkdirSync(path.dirname(overviewPath), { recursive: true });
  const sentinel = "# Previous Valid Overview\nKeep me intact.\n";
  fs.writeFileSync(overviewPath, sentinel, "utf8");

  try {
    // 1. Placeholder in project-plan.md must fail exit 1 and keep existing overview intact
    fs.writeFileSync(
      path.join(workspace, "devflow", "project-plan.md"),
      "# Project Plan\n\n## 1. Problem\n- **Core Problem**: [ระบุปัญหาหลักที่ผู้ใช้กำลังเผชิญ เช่น Manual]\n",
      "utf8"
    );
    const placeholderRun = runOverview(workspace, ["--write"]);
    assert.equal(placeholderRun.status, 1);
    assert.match(placeholderRun.stderr, /project-plan\.md/);
    assert.equal(fs.readFileSync(overviewPath, "utf8"), sentinel);

    // 2. Oversized output >= 20,000 bytes must fail exit 1 and keep existing overview intact
    writeProjectArtifacts(workspace);
    const hugePlan = `# Project Plan\n\n## Product Vision\n${"a".repeat(20_500)}\n`;
    fs.writeFileSync(path.join(workspace, "devflow", "project-plan.md"), hugePlan, "utf8");
    const oversizedRun = runOverview(workspace, ["--write"]);
    assert.equal(oversizedRun.status, 1);
    assert.match(oversizedRun.stderr, /20,000|20000/);
    assert.equal(fs.readFileSync(overviewPath, "utf8"), sentinel);

    // 3. F-02 & F-03 regressions: preserve "- description" prose and stamp valid source-hash even when body mentions "devflow:source-hash"
    writeProjectArtifacts(workspace);
    fs.writeFileSync(
      path.join(workspace, "devflow", "project-plan.md"),
      [
        "# Project Plan",
        "",
        "## Product Vision",
        "- description: Sync contract checks devflow:source-hash markers safely.",
        "",
        "## Constraints",
        "- Offline only"
      ].join("\n"),
      "utf8"
    );
    const customTemplatePath = path.join(workspace, "no-hash-template.md");
    fs.writeFileSync(customTemplatePath, "# {{projectName}}\n\n{{projectPurpose}}\n", "utf8");
    const customRun = runOverview(workspace, ["--template", customTemplatePath]);
    assert.equal(customRun.status, 0);
    assert.match(customRun.stdout, /- description: Sync contract checks devflow:source-hash markers safely\./);
    assert.match(customRun.stdout, /^<!--\s*devflow:source-hash\s+[0-9a-f]{64}\s*-->/m);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
