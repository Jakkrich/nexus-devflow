import { spawnSync } from "node:child_process";
import type { SpawnSyncOptions } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const packageRoot = path.join(repoRoot, "packages", "create-nexus-devflow");
const runsRoot = path.join(__dirname, "runs");

export type AgentId = "claude" | "copilot" | "codex" | "antigravity";

export interface AgentInvocationOptions {
  prompt: string;
  maxTurns: number;
  model?: string;
  workspace: string;
}

export interface AgentInvocation {
  args: string[];
  stdinInput?: string;
  envPatch?: Record<string, string | undefined>;
}

export interface ParsedTranscript {
  transcript: unknown;
  resultText: string;
}

export interface AgentAdapter {
  readonly id: AgentId;
  readonly aliases: readonly string[];
  readonly executable: string;
  readonly installerFlag: `--${AgentId}`;
  readonly versionArgs: readonly string[];
  buildInvocation(options: AgentInvocationOptions): AgentInvocation;
  parseTranscript(rawStdout: string): ParsedTranscript;
}

export interface SpawnSpec {
  command: string;
  args: string[];
  windowsVerbatimArguments?: boolean;
}

interface CommandOptions extends SpawnSyncOptions {
  allowFailure?: boolean;
  stdinInput?: string;
}

interface Check {
  phase: string;
  description: string;
  passed: boolean;
}

interface AgentResult {
  status: number | null;
  resultText: string;
  transcript: unknown;
}

export interface Scenario {
  name: string;
  description: string;
  run: (runner: Runner) => Promise<void>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Parse single-document JSON or newline-delimited JSONL stdout into a typed JS value.
 */
export function parseJsonOrJsonl(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const parsedLines: unknown[] = [];
    for (const line of trimmed.split(/\r?\n/)) {
      const candidate = line.trim();
      if (!candidate) continue;
      try {
        parsedLines.push(JSON.parse(candidate) as unknown);
      } catch {
        // Ignore non-JSON preamble or progress lines emitted before structured events.
      }
    }
    return parsedLines.length > 0 ? parsedLines : trimmed;
  }
}

function extractGenericText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) {
    return node.map(extractGenericText).filter(Boolean).join("\n");
  }
  if (isRecord(node)) {
    if (typeof node.result === "string" && node.result.length > 0) return node.result;
    if (typeof node.response === "string" && node.response.length > 0) return node.response;
    if (typeof node.text === "string" && node.text.length > 0) return node.text;
    if (typeof node.content === "string" && node.content.length > 0) return node.content;
    if (typeof node.output_text === "string" && node.output_text.length > 0) return node.output_text;
    if (typeof node.message === "string" && node.message.length > 0) return node.message;
    if (Array.isArray(node.content)) return extractGenericText(node.content);
    if (isRecord(node.message)) return extractGenericText(node.message);
    if (Array.isArray(node.messages)) return extractGenericText(node.messages);
    if (typeof node.error === "string" && node.error.length > 0) return node.error;
  }
  return "";
}

function extractCodexText(transcript: unknown): string {
  if (!Array.isArray(transcript)) {
    return extractGenericText(transcript);
  }

  const messages: string[] = [];
  for (const event of transcript) {
    if (!isRecord(event)) continue;

    // Codex `exec --json` item.completed events
    if (event.type === "item.completed" && isRecord(event.item)) {
      if (event.item.type === "agent_message" && typeof event.item.text === "string") {
        messages.push(event.item.text);
        continue;
      }
    }

    // Legacy Codex event envelope `{ msg: { type: "agent_message", message: "..." } }`
    if (isRecord(event.msg) && event.msg.type === "agent_message" && typeof event.msg.message === "string") {
      messages.push(event.msg.message);
      continue;
    }
  }

  if (messages.length > 0) {
    return messages.join("\n");
  }

  return extractGenericText(transcript);
}

function createStandardParser(extractor: (transcript: unknown) => string = extractGenericText) {
  return (rawStdout: string): ParsedTranscript => {
    const transcript = parseJsonOrJsonl(rawStdout);
    return {
      transcript,
      resultText: extractor(transcript)
    };
  };
}

/**
 * Authoritative registry of supported E2E agent CLI adapters.
 */
export const AGENT_ADAPTERS = {
  claude: {
    id: "claude",
    aliases: [],
    executable: "claude",
    installerFlag: "--claude",
    versionArgs: ["--version"],
    buildInvocation({ prompt, maxTurns, model }) {
      const args = [
        "-p",
        prompt,
        "--output-format",
        "json",
        "--max-turns",
        String(maxTurns),
        "--dangerously-skip-permissions",
        "--strict-mcp-config"
      ];
      if (model) args.push("--model", model);
      return {
        args,
        envPatch: {
          CLAUDECODE: undefined,
          CLAUDE_CODE_ENTRYPOINT: undefined
        }
      };
    },
    parseTranscript: createStandardParser()
  },
  copilot: {
    id: "copilot",
    aliases: [],
    executable: "copilot",
    installerFlag: "--copilot",
    versionArgs: ["--version"],
    buildInvocation({ prompt, model }) {
      const args = [
        "-p",
        prompt,
        "--output-format",
        "json",
        "--allow-all",
        "--no-ask-user",
        "--no-remote",
        "--no-remote-export"
      ];
      if (model) args.push("--model", model);
      return { args };
    },
    parseTranscript: createStandardParser()
  },
  codex: {
    id: "codex",
    aliases: [],
    executable: "codex",
    installerFlag: "--codex",
    versionArgs: ["--version"],
    buildInvocation({ prompt, model, workspace }) {
      const args = [
        "exec",
        "--json",
        "--ephemeral",
        "--ignore-user-config",
        "--dangerously-bypass-approvals-and-sandbox",
        "-C",
        workspace
      ];
      if (model) args.push("-m", model);
      // Read the prompt from stdin so Windows cmd.exe shims never mangle newlines or quotes.
      args.push("-");
      return {
        args,
        stdinInput: prompt
      };
    },
    parseTranscript: createStandardParser(extractCodexText)
  },
  antigravity: {
    id: "antigravity",
    aliases: ["agy"],
    executable: "agy",
    installerFlag: "--antigravity",
    versionArgs: ["--version"],
    buildInvocation({ prompt, model }) {
      const args = [
        "-p",
        prompt,
        "--output-format",
        "json",
        "--dangerously-skip-permissions",
        "--mode",
        "auto",
        "--new-project"
      ];
      if (model) args.push("--model", model);
      return { args };
    },
    parseTranscript: createStandardParser()
  }
} as const satisfies Record<AgentId, AgentAdapter>;

const ALIAS_LOOKUP: Record<string, AgentId> = Object.values(AGENT_ADAPTERS).reduce<Record<string, AgentId>>(
  (acc, adapter) => {
    acc[adapter.id] = adapter.id;
    for (const alias of adapter.aliases) {
      acc[alias] = adapter.id;
    }
    return acc;
  },
  {}
);

/**
 * Normalize and validate an `E2E_AGENT` string at the harness boundary.
 */
export function parseAgentId(raw: string | undefined = process.env.E2E_AGENT): AgentId {
  const normalized = (raw ?? "claude").trim().toLowerCase();
  const resolved = ALIAS_LOOKUP[normalized];
  if (!resolved) {
    const supported = Object.values(AGENT_ADAPTERS)
      .map((adapter) =>
        adapter.aliases.length > 0 ? `${adapter.id} (${adapter.aliases.join(", ")})` : adapter.id
      )
      .join(", ");
    throw new Error(`Unsupported E2E_AGENT: ${raw ?? ""}. Use one of: ${supported}.`);
  }
  return resolved;
}

export function getAgentAdapter(agentId: AgentId = parseAgentId()): AgentAdapter {
  return AGENT_ADAPTERS[agentId];
}

function quoteCmdArg(arg: string): string {
  if (/^[a-zA-Z0-9_./:\\=-]+$/.test(arg)) {
    return arg;
  }
  return `"${arg.replace(/"/g, '\\"')}"`;
}

function findExecutableOnPath(command: string, env: NodeJS.ProcessEnv): string | null {
  if (path.isAbsolute(command) || command.includes(path.sep) || command.includes("/")) {
    return fs.existsSync(command) ? command : null;
  }

  const pathValue = env.PATH ?? env.Path ?? "";
  const dirs = pathValue.split(path.delimiter).filter(Boolean);
  const extensions = [".exe", ".com", ".cmd", ".bat"];

  for (const dir of dirs) {
    for (const ext of extensions) {
      const candidate = path.join(dir, command.endsWith(ext) ? command : `${command}${ext}`);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }
  return null;
}

/**
 * Resolve platform-specific execution details at the process boundary.
 * On Windows, `.cmd`/`.bat` npm shims (such as `npm` and `codex`) must run via `cmd.exe`,
 * while native `.exe` binaries (`claude`, `agy`, `git`, `node`) execute directly without a shell.
 */
export function resolveSpawnSpec(
  command: string,
  args: readonly string[],
  platform: NodeJS.Platform = process.platform,
  env: NodeJS.ProcessEnv = process.env
): SpawnSpec {
  if (platform !== "win32") {
    return { command, args: [...args] };
  }

  const resolvedPath = findExecutableOnPath(command, env);
  const isCmdShim =
    command === "npm" ||
    (resolvedPath !== null && /\.(cmd|bat)$/i.test(resolvedPath));

  if (!isCmdShim) {
    return { command: resolvedPath ?? command, args: [...args] };
  }

  const cmdTarget = resolvedPath ? quoteCmdArg(resolvedPath) : command;
  const cmdLine = `"${[cmdTarget, ...args.map(quoteCmdArg)].join(" ")}"`;
  return {
    command: env.ComSpec || "cmd.exe",
    args: ["/d", "/s", "/c", cmdLine],
    windowsVerbatimArguments: true
  };
}

function runNpm(args: string[], cwd: string) {
  return run("npm", args, cwd);
}

function run(
  command: string,
  args: readonly string[],
  cwd: string,
  options: CommandOptions = {}
) {
  const { allowFailure, stdinInput, env: rawEnv, ...spawnOptions } = options;
  const env = rawEnv ?? process.env;
  const spec = resolveSpawnSpec(command, args, process.platform, env);

  const result = spawnSync(spec.command, spec.args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    input: stdinInput,
    windowsVerbatimArguments: spec.windowsVerbatimArguments,
    env,
    ...spawnOptions
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !allowFailure) {
    throw new Error(
      `${command} ${args.join(" ")} failed (${result.status}): ${(result.stderr || "").slice(0, 2000)}`
    );
  }

  return result;
}

function git(workspace: string, ...args: string[]): string {
  return String(run("git", args, workspace).stdout).trim();
}

export class Runner {
  name: string;
  adapter: AgentAdapter;
  model: string | undefined;
  checks: Check[];
  currentPhase: string;
  runDir: string;
  workspace: string;
  phaseCount: number;

  constructor(
    scenarioName: string,
    agentId: AgentId = parseAgentId(),
    model: string | undefined = process.env.E2E_MODEL || undefined
  ) {
    this.name = scenarioName;
    this.adapter = getAgentAdapter(agentId);
    this.model = model;
    this.checks = [];
    this.currentPhase = "setup";
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    this.runDir = path.join(runsRoot, `${stamp}-${scenarioName}`);
    this.workspace = path.join(this.runDir, "workspace");
    this.phaseCount = 0;
    fs.mkdirSync(this.workspace, { recursive: true });
  }

  phase(name: string): void {
    this.currentPhase = name;
    console.log(`\n== ${this.name} / ${name} ==`);
  }

  check(description: string, condition: unknown): void {
    this.checks.push({ phase: this.currentPhase, description, passed: Boolean(condition) });
    console.log(`  ${condition ? "PASS" : "FAIL"}  ${description}`);
  }

  installDevFlow(adapterFlag: string = this.adapter.installerFlag): void {
    const artifacts = path.join(this.runDir, "artifacts");
    const runner = path.join(this.runDir, "npm-runner");
    fs.mkdirSync(artifacts, { recursive: true });
    fs.mkdirSync(runner, { recursive: true });

    runNpm(["pack", "--pack-destination", path.relative(packageRoot, artifacts)], packageRoot);
    const tarball = fs.readdirSync(artifacts).find((file) => file.endsWith(".tgz"));

    if (!tarball) {
      throw new Error("npm pack produced no tarball");
    }

    runNpm(
      [
        "install",
        "--prefix",
        "npm-runner",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--no-package-lock",
        `./artifacts/${tarball}`
      ],
      this.runDir
    );

    const binary = path.join(
      runner,
      "node_modules",
      "@jakkrichm",
      "create-nexus-devflow",
      "dist",
      "bin",
      "create-nexus-devflow.js"
    );
    run(process.execPath, [binary, "--target", this.workspace, adapterFlag, "--yes"], this.runDir);
  }

  gitInit(): void {
    run("git", ["init", "-b", "main"], this.workspace);
    run("git", ["config", "user.email", "e2e@nexus-devflow.test"], this.workspace);
    run("git", ["config", "user.name", "DevFlow E2E"], this.workspace);
  }

  write(relativePath: string, content: string): void {
    const target = path.join(this.workspace, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }

  read(relativePath: string): string | null {
    const target = path.join(this.workspace, relativePath);
    return fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
  }

  git(...args: string[]): string {
    return git(this.workspace, ...args);
  }

  agent(
    prompt: string,
    {
      maxTurns = 50,
      timeoutMs = 15 * 60 * 1000,
      model = this.model
    }: { maxTurns?: number; timeoutMs?: number; model?: string } = {}
  ): AgentResult {
    this.phaseCount += 1;
    const invocation = this.adapter.buildInvocation({
      prompt,
      maxTurns,
      model,
      workspace: this.workspace
    });

    const env: NodeJS.ProcessEnv = { ...process.env };
    if (invocation.envPatch) {
      for (const [key, value] of Object.entries(invocation.envPatch)) {
        if (value === undefined) {
          delete env[key];
        } else {
          env[key] = value;
        }
      }
    }

    const result = run(this.adapter.executable, invocation.args, this.workspace, {
      allowFailure: true,
      timeout: timeoutMs,
      stdinInput: invocation.stdinInput,
      env
    });

    const logBase = path.join(this.runDir, `phase-${this.phaseCount}`);
    fs.writeFileSync(`${logBase}.stdout.jsonl`, result.stdout || "");

    if (result.stderr) {
      fs.writeFileSync(`${logBase}.stderr.log`, result.stderr);
    }

    const parsed = this.adapter.parseTranscript(String(result.stdout ?? ""));

    return {
      status: result.status,
      resultText: parsed.resultText,
      transcript: parsed.transcript
    };
  }

  report(): number {
    const failed = this.checks.filter((check) => !check.passed);
    console.log(`\n${this.name}: ${this.checks.length - failed.length}/${this.checks.length} checks passed`);

    if (failed.length > 0) {
      console.log(`Artifacts: ${this.runDir}`);
    }

    return failed.length;
  }
}

export function ensureAgentAvailable(agentId: AgentId = parseAgentId()): void {
  const adapter = getAgentAdapter(agentId);
  const version = run(adapter.executable, adapter.versionArgs, repoRoot, { allowFailure: true });

  if (version.status !== 0) {
    throw new Error(`The ${adapter.executable} executable (for adapter "${adapter.id}") was not found on PATH.`);
  }
}
