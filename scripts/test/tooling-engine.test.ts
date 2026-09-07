import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  runTooling,
  ToolingError,
  registerToolCommand,
  type ToolCommand,
  type ToolResult,
} from "../../packages/create-nexus-devflow/lib/tooling/index.js";

describe("ToolingEngine Seam", () => {
  it("executes built-in help command returning registered tools", async () => {
    const result = await runTooling("help");
    assert.equal(result.ok, true);
    assert.ok(result.message);
    assert.ok(result.message.includes("Available Tooling Commands:"));
    assert.ok(result.message.includes("help"));
  });

  it("throws ToolingError on unrecognized command without exiting process", async () => {
    await assert.rejects(
      async () => {
        await runTooling("non-existent-command-xyz");
      },
      (error: unknown) => {
        assert.ok(error instanceof ToolingError);
        assert.equal(error.exitCode, 1);
        assert.ok(error.message.includes("Unknown tooling command: non-existent-command-xyz"));
        return true;
      }
    );
  });

  it("dispatches to a registered command and passes arguments cleanly", async () => {
    const dummyCommand: ToolCommand = {
      name: "echo-test",
      description: "Echo arguments for testing",
      async run(args) {
        return {
          ok: true,
          message: `Echoed: ${args.join(" ")}`,
          data: { rawArgs: args },
        };
      },
    };

    registerToolCommand(dummyCommand);

    const result = await runTooling("echo-test", ["hello", "world"]);
    assert.equal(result.ok, true);
    assert.equal(result.message, "Echoed: hello world");
    assert.deepEqual(result.data, { rawArgs: ["hello", "world"] });
  });

  it("captures internal command errors into ToolingError without process crash", async () => {
    const failingCommand: ToolCommand = {
      name: "fail-test",
      description: "Throws an error for testing",
      async run() {
        throw new Error("Simulated failure inside command");
      },
    };

    registerToolCommand(failingCommand);

    await assert.rejects(
      async () => {
        await runTooling("fail-test");
      },
      (error: unknown) => {
        assert.ok(error instanceof ToolingError);
        assert.equal(error.exitCode, 1);
        assert.ok(error.message.includes("Simulated failure inside command"));
        return true;
      }
    );
  });
});
