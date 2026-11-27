import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile as execFileCb } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import fsSync from "node:fs";
import { promisify } from "node:util";
import { ProjectStatusEngine } from "../lib/project-status-engine.js";

const execFile = promisify(execFileCb);

describe("ProjectStatusEngine Seam & Snapshot", () => {
  const projectRoot = fsSync.existsSync(path.join(process.cwd(), "agent-bundle.manifest.json"))
    ? process.cwd()
    : path.resolve(process.cwd(), "../..");

  it("evaluates complete project status via getStatus()", async () => {
    const engine = new ProjectStatusEngine(projectRoot);
    const status = await engine.getStatus();
    assert.ok(status);
    assert.ok(typeof status.project.name === "string");
    assert.ok(status.currentWork);
    assert.ok(status.findings);
    assert.ok(status.git);
    assert.ok(status.completion);
    assert.ok(status.nextAction);
  });

  it("formats human-readable console report via formatHuman()", async () => {
    const engine = new ProjectStatusEngine(projectRoot);
    const status = await engine.getStatus();
    const formatted = engine.formatHuman(status, { color: false });
    assert.ok(typeof formatted === "string");
    assert.ok(formatted.length > 50);
    assert.ok(formatted.includes("Next action"));
  });

  it("falls back to unavailable git status instead of throwing when readGitStatus fails", async () => {
    const engine = new ProjectStatusEngine(projectRoot, {
      readGitStatus: async () => {
        throw new Error("stdout maxBuffer length exceeded");
      }
    });
    const status = await engine.getStatus();
    assert.equal(status.git.available, false);
    assert.equal(status.git.branch, null);
    assert.equal(status.git.changedFiles, 0);
    assert.equal(status.health, "warning");
    assert.ok(status.warnings.some((w) => w.code === "git_status_unavailable"));
    const formatted = engine.formatHuman(status, { color: false });
    assert.ok(formatted.includes("Next action"));
    assert.ok(formatted.includes("git status failed") || formatted.includes("git_status_unavailable") || formatted.includes("unavailable"));
  });

  it("includes specCheck and when-testable tryGuide policy in Quality gates line", async () => {
    const engine = new ProjectStatusEngine(projectRoot);
    const status = await engine.getStatus();
    status.configuration.values.qualityGates.regular.specCheck = "always";
    status.configuration.values.qualityGates.regular.tryGuide = "when-testable";
    const formatted = engine.formatHuman(status, { color: false });
    assert.match(formatted, /Quality gates\s+spec always.*try guide when-testable/);
  });

  it("displays Execution policy row in formatHuman() and reflects custom execution/delivery config", async () => {
    const engine = new ProjectStatusEngine(projectRoot);
    const status = await engine.getStatus();
    const defaultFormatted = engine.formatHuman(status, { color: false });
    assert.match(defaultFormatted, /Execution\s+tier: auto, gate: option-a-evidence-packet/);

    status.configuration.values.execution.tier = "high-risk";
    status.configuration.values.delivery.gate = "local-squash";
    const customFormatted = engine.formatHuman(status, { color: false });
    assert.match(customFormatted, /Execution\s+tier: high-risk, gate: local-squash/);
  });

  it("displays Worktree row in formatHuman when running inside a linked worktree", async () => {
    const engine = new ProjectStatusEngine(projectRoot);
    const status = await engine.getStatus();
    status.git.isWorktree = true;
    status.git.mainWorktreeRoot = "/repo/main-checkout";
    const formatted = engine.formatHuman(status, { color: false });
    assert.match(formatted, /Worktree\s+linked worktree \(main: \/repo\/main-checkout\)/);
  });

  it("aggregates worktreeRuns and handoff summaries across linked worktrees in getStatus() and formatHuman()", async () => {
    const baseDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-status-wt-"));
    const primaryDir = path.join(baseDir, "primary");
    const siblingWt = path.join(baseDir, "wt-131");
    try {
      await fs.mkdir(path.join(primaryDir, "devflow", "context", "130-alpha"), { recursive: true });
      await fs.mkdir(path.join(primaryDir, ".agents", "skills"), { recursive: true });
      await fs.writeFile(path.join(primaryDir, "AGENTS.md"), "# DevFlow\n", "utf8");
      await fs.writeFile(
        path.join(primaryDir, "devflow", "context", "130-alpha", "spec.md"),
        "# 📐 [130-alpha] Alpha\n\n- [ ] Task 1\n",
        "utf8"
      );
      await execFile("git", ["init", "-b", "main", primaryDir]);
      await execFile("git", ["-C", primaryDir, "config", "user.name", "DevFlow Test"]);
      await execFile("git", ["-C", primaryDir, "config", "user.email", "test@nexus.local"]);
      await execFile("git", ["-C", primaryDir, "add", "."]);
      await execFile("git", ["-C", primaryDir, "commit", "-m", "init"]);

      await execFile("git", ["-C", primaryDir, "worktree", "add", siblingWt, "-b", "feature/131-beta"]);
      await fs.mkdir(path.join(siblingWt, "devflow", "context", "131-beta"), { recursive: true });
      await fs.writeFile(
        path.join(siblingWt, "devflow", "context", "131-beta", "spec.md"),
        "# 📐 [131-beta] Beta\n\n- [ ] Task 1\n",
        "utf8"
      );
      await fs.mkdir(path.join(siblingWt, "devflow", ".state", "runs"), { recursive: true });
      await fs.writeFile(
        path.join(siblingWt, "devflow", ".state", "runs", "131-beta.json"),
        JSON.stringify({
          schemaVersion: 1,
          runId: "131-beta",
          branch: "feature/131-beta",
          worktreePath: siblingWt,
          command: "implement",
          status: "running",
          summary: "Working on beta",
          startedAt: "2026-11-19T10:00:00.000Z",
          updatedAt: "2026-11-19T10:15:00.000Z",
          handoff: { nextStep: "/check 131-beta", notes: "Sibling handoff note" }
        }),
        "utf8"
      );

      const engine = new ProjectStatusEngine(primaryDir);
      const status = await engine.getStatus();
      assert.equal(status.worktreeRuns?.length, 2);
      const beta = status.worktreeRuns?.find((r) => r.runId === "131-beta");
      assert.ok(beta);
      assert.equal(beta.isCurrentWorktree, false);
      assert.equal(beta.handoff?.notes, "Sibling handoff note");

      const formatted = engine.formatHuman(status, { color: false });
      assert.ok(formatted.includes("Worktree runs"));
      assert.ok(formatted.includes("131-beta"));
      assert.ok(formatted.includes("Sibling handoff note"));
    } finally {
      await execFile("git", ["-C", primaryDir, "worktree", "remove", "--force", siblingWt]).catch(() => {});
      await fs.rm(baseDir, { recursive: true, force: true });
    }
  });
});

