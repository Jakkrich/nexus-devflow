import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { runTooling, ToolingError } from "../../packages/create-nexus-devflow/lib/tooling/index.js";

describe("Contract Verification & Hygiene Scan Commands", () => {
  it("runs scan-doc-contract cleanly on the repository", async () => {
    const result = await runTooling("scan-doc-contract");
    assert.equal(result.ok, true);
    assert.ok(result.message?.includes("Document contract check passed"));
  });

  it("runs scan-security-hygiene cleanly on an isolated clean directory", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "security-clean-test-"));
    await fs.writeFile(path.join(tempDir, "safe.txt"), "This is safe content without secrets.");

    const result = await runTooling("scan-security-hygiene", ["--dir", tempDir]);
    assert.equal(result.ok, true);
    assert.ok(result.message?.includes("Security hygiene check passed"));

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("fails with ToolingError when scan-security-hygiene detects leaked secret", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "security-leak-test-"));
    await fs.writeFile(path.join(tempDir, "leak.txt"), "apiKey = \"secret_super_secret_token_12345\"");

    await assert.rejects(
      async () => {
        await runTooling("scan-security-hygiene", ["--dir", tempDir]);
      },
      (error: unknown) => {
        assert.ok(error instanceof ToolingError);
        assert.equal(error.exitCode, 1);
        assert.ok(error.message.includes("Security hygiene violations found:"));
        return true;
      }
    );

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("checks skill descriptions across .agents/skills", async () => {
    const result = await runTooling("skill-descriptions", ["--check"]);
    assert.equal(result.ok, true);
    assert.ok(result.data);
  });
});
