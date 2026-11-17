import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fsSync from "node:fs";
import { ProjectStatusEngine } from "../lib/project-status-engine.js";

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
});

