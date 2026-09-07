import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { runTooling, ToolingError } from "../../packages/create-nexus-devflow/lib/tooling/index.js";

describe("Workspace & Artifact Maintenance Commands", () => {
  it("fails with ToolingError when switch-artifact-language receives invalid language", async () => {
    await assert.rejects(
      async () => {
        await runTooling("switch-artifact-language", ["fr"]);
      },
      (error: unknown) => {
        assert.ok(error instanceof ToolingError);
        assert.equal(error.exitCode, 1);
        assert.ok(error.message.includes("Invalid language: fr"));
        return true;
      }
    );
  });

  it("summarizes run status for current project returning structured data", async () => {
    const result = await runTooling("summarize-run-status", ["--json"]);
    assert.equal(result.ok, true);
    assert.ok(result.data);
    assert.ok(result.message);
  });

  it("fails with ToolingError when link-project is missing target project directory", async () => {
    await assert.rejects(
      async () => {
        await runTooling("link-project", []);
      },
      (error: unknown) => {
        assert.ok(error instanceof ToolingError);
        assert.equal(error.exitCode, 1);
        assert.ok(error.message.includes("Usage:"));
        return true;
      }
    );
  });

  it("runs migrate-stage-artifacts planning mode cleanly", async () => {
    const tempProject = await fs.mkdtemp(path.join(os.tmpdir(), "tooling-migrate-test-"));
    await fs.mkdir(path.join(tempProject, "devflow"), { recursive: true });

    const result = await runTooling("migrate-stage-artifacts", [
      "--project-root",
      tempProject,
    ]);

    assert.equal(result.ok, true);
    assert.ok(result.message?.includes("No legacy workspaces require migration"));

    await fs.rm(tempProject, { recursive: true, force: true });
  });
});
