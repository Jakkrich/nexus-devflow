import fs from "node:fs/promises";
import path from "node:path";
import { renderStudioHtml } from "../packages/create-nexus-devflow/lib/webview-studio.js";

async function main() {
  const projectRoot = process.cwd();
  const html = await renderStudioHtml(projectRoot);
  const outPath = path.join(projectRoot, "devflow", "reference", "studio.html");
  await fs.writeFile(outPath, html, "utf8");
  console.log(`Studio HTML successfully generated: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
