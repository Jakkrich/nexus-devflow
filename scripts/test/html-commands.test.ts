import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { runTooling, ToolingError } from "../../packages/create-nexus-devflow/lib/tooling/index.js";

describe("HTML Tooling Commands", () => {
  it("fails with ToolingError when render-html is invoked with missing arguments", async () => {
    await assert.rejects(
      async () => {
        await runTooling("render-html", []);
      },
      (error: unknown) => {
        assert.ok(error instanceof ToolingError);
        assert.equal(error.exitCode, 1);
        assert.ok(error.message.includes("Usage:"));
        return true;
      }
    );
  });

  it("fails with ToolingError when render-html receives unsupported stage", async () => {
    await assert.rejects(
      async () => {
        await runTooling("render-html", ["--stage", "unsupported-stage-name"]);
      },
      (error: unknown) => {
        assert.ok(error instanceof ToolingError);
        assert.equal(error.exitCode, 1);
        assert.ok(error.message.includes("Unsupported stage for render CLI"));
        return true;
      }
    );
  });

  it("renders a markdown document using render-html command", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "tooling-render-test-"));
    const sourcePath = path.join(tempDir, "doc.md");
    const outPath = path.join(tempDir, "out.html");
    const metaPath = path.join(tempDir, "meta.json");

    await fs.writeFile(sourcePath, "# Test Document\n\nContent here.", "utf8");
    await fs.writeFile(metaPath, JSON.stringify({ title: "Test Doc", date: "2026-09-07" }), "utf8");

    const result = await runTooling("render-html", [
      "--preset",
      "default-doc",
      "--source",
      sourcePath,
      "--out",
      outPath,
      "--metadata",
      metaPath,
    ]);

    assert.equal(result.ok, true);
    assert.ok(result.message?.includes("Generated"));
    const html = await fs.readFile(outPath, "utf8");
    assert.ok(html.includes("Test Document"));

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("fails with ToolingError when report-html targets non-existent task", async () => {
    await assert.rejects(
      async () => {
        await runTooling("report-html", ["non-existent-9999-slug"]);
      },
      (error: unknown) => {
        assert.ok(error instanceof ToolingError);
        assert.equal(error.exitCode, 1);
        return true;
      }
    );
  });
});
