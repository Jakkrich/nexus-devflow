import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { execFile, execSync } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function ensureDistBuilt() {
  const installerDir = path.resolve(import.meta.dirname, "..");
  const distBin = path.join(installerDir, "dist/bin/create-nexus-devflow.js");
  if (!fsSync.existsSync(distBin)) {
    execSync("npm run build", { cwd: installerDir, stdio: "pipe" });
  }
}

test("unscoped nexus-devflow wrapper package is correctly configured and runnable", async () => {
  ensureDistBuilt();
  const pkgDir = path.resolve(import.meta.dirname, "../../nexus-devflow");
  const pkgJsonPath = path.join(pkgDir, "package.json");
  const binScriptPath = path.join(pkgDir, "bin/nexus-devflow.js");

  const rawJson = await fs.readFile(pkgJsonPath, "utf8");
  const parsed = JSON.parse(rawJson);

  assert.equal(parsed.name, "nexus-devflow");
  assert.ok(parsed.version);
  assert.equal(parsed.type, "module");
  assert.equal(parsed.bin["nexus-devflow"], "bin/nexus-devflow.js");
  assert.equal(parsed.bin["devflow"], "bin/nexus-devflow.js");
  assert.ok(parsed.dependencies["@jakkrichm/create-nexus-devflow"]);

  const binStats = await fs.stat(binScriptPath);
  assert.ok(binStats.isFile());

  // Execute shim with --help to verify runtime resolution
  const { stdout, stderr } = await execFileAsync(process.execPath, [binScriptPath, "--help"]);
  assert.ok(stdout.includes("nexus-devflow") || stdout.includes("DevFlow"));
  assert.equal(stderr, "");
});
