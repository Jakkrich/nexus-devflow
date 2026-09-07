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
});

