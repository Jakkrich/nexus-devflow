import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const packageRoot = path.join(repoRoot, "packages", "create-nexus-devflow");

interface NpmInvocation {
  command: string;
  prefix: string[];
}

function npmInvocation(): NpmInvocation {
  const npmExecPath = process.env.npm_execpath;

  if (npmExecPath) {
    return { command: process.execPath, prefix: [npmExecPath] };
  }

  return {
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    prefix: []
  };
}

function runNpm(args: readonly string[]): void {
  const { command, prefix } = npmInvocation();
  const result = spawnSync(command, [...prefix, ...args], {
    cwd: packageRoot,
    stdio: "inherit",
    shell: prefix.length === 0 && process.platform === "win32"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`npm ${args.join(" ")} failed with status ${result.status}.`);
  }
}

function readPackageName(): string {
  const raw = fs.readFileSync(path.join(packageRoot, "package.json"), "utf8");
  const parsed: unknown = JSON.parse(raw);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { name?: unknown }).name !== "string"
  ) {
    throw new Error("Installer package.json has no valid name.");
  }

  return (parsed as { name: string }).name;
}

function main(): void {
  const packageName = readPackageName();

  if (process.argv.slice(2).includes("--undo")) {
    runNpm(["rm", "--global", packageName]);
    console.log(
      `\nRan \`npm rm --global ${packageName}\`. Any global copy of that package, linked or installed, is gone.`
    );
    return;
  }

  runNpm(["run", "build"]);
  runNpm(["run", "prepare-template"]);
  runNpm(["link"]);

  console.log(`
Linked ${packageName} from this checkout.

These commands now run from your local files, with no network access:
  create-nexus-devflow --help
  nexus-devflow status
  devflow dashboard

Re-run \`npm run link:local\` after editing the source. The linked commands run
the compiled dist/ output and a copied template/, not the source files directly.

Undo with:
  npm run unlink:local`);
}

try {
  main();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
