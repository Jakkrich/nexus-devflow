import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  AGENT_ADAPTERS,
  getAgentAdapter,
  parseAgentId,
  parseJsonOrJsonl,
  resolveSpawnSpec
} from "../e2e/harness.js";
import implementCheckScenario from "../e2e/scenarios/implement-check.js";

describe("E2E Harness AgentAdapter registry", () => {
  it("normalizes supported adapter IDs and aliases", () => {
    assert.equal(parseAgentId(undefined), "claude");
    assert.equal(parseAgentId("claude"), "claude");
    assert.equal(parseAgentId("CODEX"), "codex");
    assert.equal(parseAgentId("antigravity"), "antigravity");
    assert.equal(parseAgentId("agy"), "antigravity");
    assert.equal(parseAgentId("copilot"), "copilot");

    assert.throws(() => parseAgentId("unknown-agent"), /Unsupported E2E_AGENT/);
  });

  it("exposes installer flags and executables for claude, codex, and antigravity", () => {
    assert.equal(AGENT_ADAPTERS.claude.executable, "claude");
    assert.equal(AGENT_ADAPTERS.claude.installerFlag, "--claude");

    assert.equal(AGENT_ADAPTERS.codex.executable, "codex");
    assert.equal(AGENT_ADAPTERS.codex.installerFlag, "--codex");

    assert.equal(AGENT_ADAPTERS.antigravity.executable, "agy");
    assert.equal(AGENT_ADAPTERS.antigravity.installerFlag, "--antigravity");
  });

  it("builds isolated invocations per adapter", () => {
    const workspace = path.join(os.tmpdir(), "devflow-harness-test");

    const claudeInv = getAgentAdapter("claude").buildInvocation({
      prompt: "Run /check",
      maxTurns: 12,
      model: "sonnet",
      workspace
    });
    assert.ok(claudeInv.args.includes("-p"));
    assert.ok(claudeInv.args.includes("--dangerously-skip-permissions"));
    assert.ok(claudeInv.args.includes("--strict-mcp-config"));
    assert.ok(claudeInv.args.includes("12"));
    assert.ok(claudeInv.args.includes("sonnet"));
    assert.equal(claudeInv.envPatch?.CLAUDECODE, undefined);
    assert.ok("CLAUDECODE" in (claudeInv.envPatch ?? {}));

    const codexInv = getAgentAdapter("codex").buildInvocation({
      prompt: "Line 1\nLine 2",
      maxTurns: 12,
      model: "o3",
      workspace
    });
    assert.equal(codexInv.args[0], "exec");
    assert.ok(codexInv.args.includes("--json"));
    assert.ok(codexInv.args.includes("--ephemeral"));
    assert.ok(codexInv.args.includes("--ignore-user-config"));
    assert.ok(codexInv.args.includes("--dangerously-bypass-approvals-and-sandbox"));
    assert.equal(codexInv.args[codexInv.args.length - 1], "-");
    assert.equal(codexInv.stdinInput, "Line 1\nLine 2");

    const agyInv = getAgentAdapter("antigravity").buildInvocation({
      prompt: "Run /check",
      maxTurns: 12,
      model: "gemini",
      workspace
    });
    assert.ok(agyInv.args.includes("-p"));
    assert.ok(agyInv.args.includes("--output-format"));
    assert.ok(agyInv.args.includes("json"));
    assert.ok(agyInv.args.includes("--dangerously-skip-permissions"));
    assert.ok(agyInv.args.includes("--new-project"));
    assert.ok(agyInv.args.includes("auto"));
    assert.ok(agyInv.args.includes("gemini"));
  });

  it("parses JSON and JSONL transcripts without leaking prompt text", () => {
    const claudeParsed = getAgentAdapter("claude").parseTranscript(
      JSON.stringify({ type: "result", result: "PASS: Hello, world!" })
    );
    assert.equal(claudeParsed.resultText, "PASS: Hello, world!");

    const agyParsed = getAgentAdapter("antigravity").parseTranscript(
      JSON.stringify({ response: "PASS: observed Hello, world!" })
    );
    assert.equal(agyParsed.resultText, "PASS: observed Hello, world!");

    const agyErrorParsed = getAgentAdapter("antigravity").parseTranscript(
      JSON.stringify({ status: "ERROR", response: "", error: "print timeout after 15s" })
    );
    assert.equal(agyErrorParsed.resultText, "print timeout after 15s");

    const codexStdout = [
      JSON.stringify({ type: "thread.started", thread_id: "t1" }),
      JSON.stringify({ type: "item.completed", item: { id: "i1", type: "command_execution", command: "node src/greeting.js" } }),
      JSON.stringify({ type: "item.completed", item: { id: "i2", type: "agent_message", text: "PASS: Hello, world!" } })
    ].join("\n");
    const codexParsed = getAgentAdapter("codex").parseTranscript(codexStdout);
    assert.equal(codexParsed.resultText, "PASS: Hello, world!");

    assert.deepEqual(parseJsonOrJsonl('{"a":1}\n{"b":2}\n'), [{ a: 1 }, { b: 2 }]);
  });

  it("resolves Windows .cmd shims through cmd.exe while keeping native binaries direct", () => {
    const tmpBin = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-spawn-"));
    try {
      const codexCmd = path.join(tmpBin, "codex.cmd");
      const agyExe = path.join(tmpBin, "agy.exe");
      fs.writeFileSync(codexCmd, "@echo off\r\n");
      fs.writeFileSync(agyExe, "");

      const env = { PATH: tmpBin, ComSpec: "C:\\Windows\\System32\\cmd.exe" };

      const codexSpec = resolveSpawnSpec("codex", ["exec", "--json", "-"], "win32", env);
      assert.equal(codexSpec.command, "C:\\Windows\\System32\\cmd.exe");
      assert.deepEqual(codexSpec.args.slice(0, 3), ["/d", "/s", "/c"]);
      assert.equal(codexSpec.windowsVerbatimArguments, true);
      assert.ok(codexSpec.args[3].startsWith('"') && codexSpec.args[3].endsWith('"'));
      assert.ok(codexSpec.args[3].includes("codex.cmd"));

      const agySpec = resolveSpawnSpec("agy", ["-p", "hello world"], "win32", env);
      assert.equal(agySpec.command, agyExe);
      assert.deepEqual(agySpec.args, ["-p", "hello world"]);

      const posixSpec = resolveSpawnSpec("codex", ["exec", "--json", "-"], "linux", env);
      assert.equal(posixSpec.command, "codex");
      assert.deepEqual(posixSpec.args, ["exec", "--json", "-"]);
    } finally {
      fs.rmSync(tmpBin, { recursive: true, force: true });
    }
  });

  it("exports a valid minimal implement-check scenario", () => {
    assert.equal(implementCheckScenario.name, "implement-check");
    assert.equal(typeof implementCheckScenario.description, "string");
    assert.equal(typeof implementCheckScenario.run, "function");
  });
});
