const fs = require("node:fs/promises");
const path = require("node:path");

const packageRoot = path.resolve(__dirname, "..");
const templateRoot = path.join(packageRoot, "template");

async function main() {
  try {
    await fs.rm(templateRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (err) {
    // Ignore busy errors on Windows cleanup
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(0);
});
