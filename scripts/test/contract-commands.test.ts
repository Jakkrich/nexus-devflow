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

  it("rejects active instructions using retired v2/v3 commands while allowing migration notes", async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "doc-contract-retired-"));
    try {
      await fs.mkdir(path.join(tempDir, ".agents", "skills", "demo"), { recursive: true });
      await fs.writeFile(
        path.join(tempDir, "README.md"),
        [
          "# Demo",
          "- Migrating from v2 to v3: `/autopilot` and `/devflow-status` were retired.",
          "- Run `/devflow-status` to check progress."
        ].join("\n"),
        "utf8"
      );
      await fs.writeFile(
        path.join(tempDir, ".agents", "skills", "demo", "SKILL.md"),
        "---\nname: demo\ndescription: \"Use for /autopilot alias.\"\n---\nRun `npx nexus-devflow dashboard`.\n",
        "utf8"
      );

      await assert.rejects(
        async () => {
          await runTooling("scan-doc-contract", [], { projectRoot: tempDir });
        },
        (error: unknown) => {
          assert.ok(error instanceof ToolingError);
          assert.equal(error.exitCode, 1);
          assert.match(error.message, /\/devflow-status/);
          assert.match(error.message, /nexus-devflow dashboard/);
          assert.doesNotMatch(error.message, /Migrating from v2 to v3/);
          return true;
        }
      );

      // F-01 regression: bare /devflow-mode co-mention or unframed description: must still reject retired commands
      await fs.writeFile(
        path.join(tempDir, ".agents", "skills", "demo", "SKILL.md"),
        "---\nname: demo\ndescription: \"Run /autopilot\"\n---\nUse /devflow-mode or /autopilot.\n",
        "utf8"
      );
      await assert.rejects(
        async () => {
          await runTooling("scan-doc-contract", [], { projectRoot: tempDir });
        },
        (error: unknown) => {
          assert.ok(error instanceof ToolingError);
          assert.equal(error.exitCode, 1);
          assert.match(error.message, /\/autopilot/);
          return true;
        }
      );

      // Clean active lines while retaining migration & alias lines -> must pass
      await fs.writeFile(
        path.join(tempDir, "README.md"),
        "# Demo\n- Legacy aliases (`/autopilot`, `/devflow-status`, `/devflow-doctor`) route to `/devflow-mode` and `/devflow-help`.\n",
        "utf8"
      );
      await fs.writeFile(
        path.join(tempDir, ".agents", "skills", "demo", "SKILL.md"),
        "---\nname: demo\ndescription: \"Use for /autopilot alias.\"\n---\nRun `npx nexus-devflow status`.\n",
        "utf8"
      );
      const cleanResult = await runTooling("scan-doc-contract", [], { projectRoot: tempDir });
      assert.equal(cleanResult.ok, true);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});
