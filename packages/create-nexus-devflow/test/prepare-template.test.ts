import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");
const templateRoot = path.join(packageRoot, "template");

test("root .gitignore covers transient, raw inbox, analysis, and development files", async () => {
  const gitignoreContent = await fs.readFile(path.join(repoRoot, ".gitignore"), "utf8");
  
  // Must ignore raw inbox files to protect client secrets / sensitive documents
  assert.match(gitignoreContent, /devflow\/inbox\/\*\/raw\/\*/);
  assert.match(gitignoreContent, /devflow\/inbox\/raw\/\*/);
  
  // Must ignore analysis artifacts
  assert.match(gitignoreContent, /devflow\/analysis\/\*/);
  
  // Must ignore scratch files
  assert.match(gitignoreContent, /devflow\/scratch\/\*/);
  
  // Must ignore vendor and state
  assert.match(gitignoreContent, /devflow\/\.state\//);
  assert.match(gitignoreContent, /devflow\/\.vendor\//);
  assert.match(gitignoreContent, /\.nexus\//);
});

test("template packaging strictly excludes devflow development and transient folders", async () => {
  // Check if template exists (or run check after build)
  try {
    const templateDevflow = path.join(templateRoot, "devflow");
    const stat = await fs.stat(templateDevflow);
    if (!stat.isDirectory()) return;

    // Must NOT contain devflow/inbox
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "inbox")),
      { code: "ENOENT" },
      "template should not contain devflow/inbox"
    );

    // Must NOT contain devflow/analysis
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "analysis")),
      { code: "ENOENT" },
      "template should not contain devflow/analysis"
    );

    // Must NOT contain devflow/scratch
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "scratch")),
      { code: "ENOENT" },
      "template should not contain devflow/scratch"
    );

    // Must NOT contain devflow/research
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "research")),
      { code: "ENOENT" },
      "template should not contain devflow/research"
    );

    // Must NOT contain devflow/reports
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "reports")),
      { code: "ENOENT" },
      "template should not contain devflow/reports"
    );

    // Must NOT contain prototypes
    await assert.rejects(
      async () => await fs.stat(path.join(templateRoot, "prototypes")),
      { code: "ENOENT" },
      "template should not contain prototypes"
    );
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
});
