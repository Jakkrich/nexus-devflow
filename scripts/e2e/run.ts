import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Runner, ensureAgentAvailable, parseAgentId } from "./harness.js";
import type { AgentId, Scenario } from "./harness.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scenariosDir = path.join(__dirname, "scenarios");

interface CliArgs {
  agentId: AgentId;
  model: string | undefined;
  scenarios: string[];
}

function parseCliArgs(argv: readonly string[]): CliArgs {
  let rawAgent = process.env.E2E_AGENT;
  let model = process.env.E2E_MODEL || undefined;
  const scenarios: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--agent") {
      rawAgent = argv[++i];
      if (!rawAgent) {
        throw new Error("--agent requires a value");
      }
      continue;
    }
    if (arg.startsWith("--agent=")) {
      rawAgent = arg.slice("--agent=".length);
      continue;
    }
    if (arg === "--model") {
      model = argv[++i];
      if (!model) {
        throw new Error("--model requires a value");
      }
      continue;
    }
    if (arg.startsWith("--model=")) {
      model = arg.slice("--model=".length);
      continue;
    }
    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    scenarios.push(arg);
  }

  return {
    agentId: parseAgentId(rawAgent),
    model,
    scenarios
  };
}

async function main() {
  if (process.env.E2E_ACCEPT_RISK !== "1") {
    console.error(
      "This harness drives a live agent with --dangerously-skip-permissions in a\n" +
        "scratch workspace on this machine, and it spends real tokens.\n" +
        "Run it as: E2E_ACCEPT_RISK=1 npm run test:e2e"
    );
    process.exit(1);
  }

  const { agentId, model, scenarios: requested } = parseCliArgs(process.argv.slice(2));
  ensureAgentAvailable(agentId);

  if (!fs.existsSync(scenariosDir)) {
    console.log("No e2e scenarios found.");
    return;
  }

  const available = fs
    .readdirSync(scenariosDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => file.replace(/\.ts$/, ""))
    .sort();

  for (const name of requested) {
    if (!available.includes(name)) {
      throw new Error(`Unknown scenario: ${name}. Available: ${available.join(", ")}`);
    }
  }

  const selected = requested.length > 0 ? requested : available;
  let failures = 0;

  for (const name of selected) {
    const module: unknown = await import(
      pathToFileURL(path.join(scenariosDir, `${name}.ts`)).href
    );
    const scenario =
      typeof module === "object" &&
      module !== null &&
      "default" in module &&
      isScenario(module.default)
        ? module.default
        : null;

    if (!scenario) {
      throw new Error(`Scenario ${name} has no valid default export.`);
    }
    console.log(`\n=== Scenario: ${scenario.name} (${agentId}) - ${scenario.description} ===`);
    const runner = new Runner(scenario.name, agentId, model);

    try {
      await scenario.run(runner);
    } catch (error: unknown) {
      runner.check(
        `scenario ran without harness errors (${error instanceof Error ? error.message : String(error)})`,
        false
      );
    }

    failures += runner.report();
  }

  if (failures > 0) {
    console.error(`\nE2E failed: ${failures} check(s) did not pass.`);
    process.exit(1);
  }

  console.log("\nE2E passed.");
}

function isScenario(value: unknown): value is Scenario {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { name?: unknown }).name === "string" &&
    typeof (value as { description?: unknown }).description === "string" &&
    typeof (value as { run?: unknown }).run === "function"
  );
}

main().catch((error: unknown) => {
  console.error(`E2E harness error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
