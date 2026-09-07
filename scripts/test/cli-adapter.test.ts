import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(".");

describe("Tooling CLI Adapter", () => {
  it("executes help via CLI adapter with exit code 0", async () => {
    const { stdout } = await execFileAsync(
      process.execPath,
      ["--import", "tsx", "scripts/tooling.ts", "help"],
      { cwd: projectRoot }
    );
    assert.ok(stdout.includes("Available Tooling Commands:"));
  });

  it("exits with code 1 on unknown command", async () => {
    await assert.rejects(
      async () => {
        await execFileAsync(
          process.execPath,
          ["--import", "tsx", "scripts/tooling.ts", "unknown-command-fail"],
          { cwd: projectRoot }
        );
      },
      (error: any) => {
        assert.equal(error.code, 1);
        assert.ok(error.stderr.includes("Unknown tooling command: unknown-command-fail"));
        return true;
      }
    );
  });
});
