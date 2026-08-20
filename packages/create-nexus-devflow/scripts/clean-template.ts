import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const templateRoot = path.join(packageRoot, "template");

async function main() {
  await fs.rm(templateRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
