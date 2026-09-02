import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");
const packageRoot = path.join(repoRoot, "packages", "create-nexus-devflow");
const sandboxRoot = path.join(repoRoot, ".sandbox");

const adapters = ["all", "antigravity", "claude", "codex", "copilot", "opencode"] as const;
type Adapter = (typeof adapters)[number];

export interface SandboxOptions {
  adapter: Adapter | null;
  clean: boolean;
  demoPlan: boolean;
  help: boolean;
  name: string;
  server: boolean;
}

interface PackageJson {
  scripts?: Record<string, string>;
}

const helpText = `Create an inspectable app using the locally packed Nexus-DevFlow.

Usage:
  npm run sandbox
  npm run sandbox:demo
  npm run sandbox -- --name my-run
  npm run sandbox -- --demo-plan
  npm run sandbox -- --adapter claude --no-server --clean

Options:
  --name <name>        Folder name under .sandbox
  --adapter <name>     Skip the installer prompt and use all, antigravity, claude,
                       codex, copilot, or opencode
  --clean              Remove the sandbox after a successful run
  --demo-plan          Add example plans ready for overview and feature work
  --no-server          Skip the final development server
  --help               Show this help
`;

export function parseSandboxArgs(
  args: readonly string[],
  now: Date = new Date()
): SandboxOptions {
  const options: SandboxOptions = {
    adapter: null,
    clean: false,
    demoPlan: false,
    help: false,
    name: `minimal-app-${formatTimestamp(now)}`,
    server: true
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--clean") {
      options.clean = true;
      continue;
    }

    if (argument === "--demo-plan") {
      options.demoPlan = true;
      continue;
    }

    if (argument === "--no-server") {
      options.server = false;
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }

    if (argument === "--name" || argument === "--adapter") {
      const value = args[index + 1];

      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a value`);
      }

      index += 1;

      if (argument === "--name") {
        options.name = value;
      } else if (isAdapter(value)) {
        options.adapter = value;
      } else {
        throw new Error(`Unknown adapter: ${value}. Use ${adapters.join(", ")}.`);
      }

      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(options.name)) {
    throw new Error("Sandbox name can contain only letters, numbers, hyphens, and underscores");
  }

  return options;
}

export function createDevFlowNpxArguments(
  tarballPath: string,
  adapter: Adapter | null
): string[] {
  const args = ["--yes", "--package", tarballPath, "create-nexus-devflow"];

  if (adapter) {
    args.push("--", `--${adapter}`, "--yes");
  }

  return args;
}

export function sandboxChildEnvironment(
  baseEnvironment: NodeJS.ProcessEnv = process.env
): NodeJS.ProcessEnv {
  const environment = { ...baseEnvironment };

  for (const key of Object.keys(environment)) {
    if (key.startsWith("npm_config_")) {
      delete environment[key];
    }
  }

  environment.npm_config_audit = "false";
  environment.npm_config_fund = "false";
  environment.npm_config_update_notifier = "false";

  return environment;
}

export async function scaffoldProject(projectRoot: string): Promise<void> {
  await fs.mkdir(projectRoot, { recursive: true });

  const packageJson: PackageJson = {
    scripts: {
      dev: "node server.js",
      test: "node --test"
    }
  };

  const serverJs = `import http from "node:http";
import fs from "node:fs";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(fs.readFileSync("index.html"));
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
`;

  const indexHtml = `<!DOCTYPE html>
<html>
<head><title>Sandbox App</title></head>
<body><h1>App ready for inspection</h1></body>
</html>
`;

  await fs.writeFile(path.join(projectRoot, "package.json"), JSON.stringify(packageJson, null, 2) + "\n");
  await fs.writeFile(path.join(projectRoot, "server.js"), serverJs);
  await fs.writeFile(path.join(projectRoot, "index.html"), indexHtml);
}

export async function writeDemoPlans(projectRoot: string): Promise<void> {
  const devflowDir = path.join(projectRoot, "devflow");
  await fs.mkdir(devflowDir, { recursive: true });

  const projectPlan = `# Personal Task Tracker

A minimal task tracker app for personal productivity.
`;

  const buildPlan = `# Build Plan

- [ ] 1. Task List UI
- [ ] 2. Task Creation
- [ ] 3. Task Completion
`;

  await fs.writeFile(path.join(devflowDir, "project-plan.md"), projectPlan);
  await fs.writeFile(path.join(devflowDir, "build-plan.md"), buildPlan);
}

export async function addLocalDevFlowScripts(projectRoot: string, tarballPath: string): Promise<void> {
  const pkgPath = path.join(projectRoot, "package.json");
  const relativeTarball = path.relative(projectRoot, tarballPath).replace(/\\/g, "/");
  const content = JSON.parse(await fs.readFile(pkgPath, "utf8")) as PackageJson;

  content.scripts = {
    ...content.scripts,
    "devflow:status": `npx --yes --package ${relativeTarball} create-nexus-devflow status`,
    "devflow:dashboard": `npx --yes --package ${relativeTarball} create-nexus-devflow dashboard`
  };

  await fs.writeFile(pkgPath, JSON.stringify(content, null, 2) + "\n");
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/[:.]/g, "-");
}

function isAdapter(value: string): value is Adapter {
  return (adapters as readonly string[]).includes(value);
}

async function main(): Promise<void> {
  const options = parseSandboxArgs(process.argv.slice(2));

  if (options.help) {
    console.log(helpText);
    return;
  }

  const runDir = path.join(sandboxRoot, options.name);
  const artifactsDir = path.join(sandboxRoot, "artifacts");
  const projectRoot = path.join(runDir, "project");

  await fs.mkdir(artifactsDir, { recursive: true });
  await scaffoldProject(projectRoot);

  if (options.demoPlan) {
    await writeDemoPlans(projectRoot);
  }

  console.log(`Sandbox created at: ${projectRoot}`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (invokedPath === scriptPath) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
