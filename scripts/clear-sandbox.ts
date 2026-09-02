import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");
const sandboxRoot = path.join(repoRoot, ".sandbox");

export async function listSandboxEntries(root: string): Promise<string[]> {
  try {
    const stats = await fs.lstat(root);

    if (!stats.isDirectory() || stats.isSymbolicLink()) {
      throw new Error(`Sandbox root must be a real directory: ${root}`);
    }

    return (await fs.readdir(root)).sort();
  } catch (error: unknown) {
    if (getErrorCode(error) === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function clearSandboxEntries(
  root: string,
  entries: readonly string[]
): Promise<void> {
  const resolvedRoot = path.resolve(root);

  for (const entry of entries) {
    if (entry === "" || entry === "." || entry === ".." || path.basename(entry) !== entry) {
      throw new Error(`Unsafe sandbox entry: ${entry}`);
    }

    const target = path.resolve(resolvedRoot, entry);

    if (path.dirname(target) !== resolvedRoot) {
      throw new Error(`Sandbox entry escaped its root: ${entry}`);
    }

    await fs.rm(target, { recursive: true, force: false });
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const yes = args.includes("--yes");
  const unknown = args.filter((argument) => argument !== "--yes");

  if (unknown.length > 0) {
    throw new Error(`Unknown argument: ${unknown[0]}`);
  }

  const entries = await listSandboxEntries(sandboxRoot);

  if (entries.length === 0) {
    console.log("Sandbox is already empty.");
    return;
  }

  console.log(`Sandbox runs in ${sandboxRoot}:`);
  for (const entry of entries) {
    console.log(`- ${entry}`);
  }

  if (!yes) {
    if (!process.stdin.isTTY) {
      throw new Error("Confirmation requires a terminal. Pass --yes to clear non-interactively.");
    }

    const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
    let answer = "";

    try {
      answer = await prompt.question(`Delete ${entries.length} sandbox run${entries.length === 1 ? "" : "s"} permanently? [y/N]: `);
    } finally {
      prompt.close();
    }

    if (!/^(y|yes)$/i.test(answer.trim())) {
      console.log("Sandbox was not changed.");
      return;
    }
  }

  await clearSandboxEntries(sandboxRoot, entries);
  console.log(`Deleted ${entries.length} sandbox run${entries.length === 1 ? "" : "s"}.`);
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code: unknown }).code)
    : undefined;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (invokedPath === scriptPath) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
