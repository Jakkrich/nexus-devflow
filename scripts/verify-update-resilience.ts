#!/usr/bin/env node
// Exhaustive check of the Nexus-DevFlow overlay update & rollback engine.
// Property: prepareUpdate and applyPreparedUpdate never silently overwrite
// customized or non-regular files, never prune protected/vendor/modified orphans,
// reject symlinks in managed paths, and roll back cleanly on mid-apply failure.

import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  applyPreparedUpdate,
  assertNoSymlinkParents,
  createManifest,
  prepareUpdate,
  type Manifest
} from "../packages/create-nexus-devflow/lib/update.js";

type FileCategory =
  | "core"
  | "normal-skill"
  | "protected-skill"
  | "third-party-skill"
  | "custom-vendor-skill"
  | "vendor-path";

type PreviousRecord = "absent" | "matches-old" | "matches-template";
type TemplatePresence = "present" | "absent";
type DiskState =
  | "missing"
  | "matches-old"
  | "matches-template"
  | "customized"
  | "not-file-dir";

type Clause =
  | "conflict-guard"
  | "no-overwrite-gate"
  | "protected-orphan-guard"
  | "rollback-atomicity"
  | "symlink-guard";

const FILE_CATEGORIES: readonly FileCategory[] = [
  "core",
  "normal-skill",
  "protected-skill",
  "third-party-skill",
  "custom-vendor-skill",
  "vendor-path"
];
const PREVIOUS_RECORDS: readonly PreviousRecord[] = [
  "absent",
  "matches-old",
  "matches-template"
];
const TEMPLATE_PRESENCES: readonly TemplatePresence[] = ["present", "absent"];
const DISK_STATES: readonly DiskState[] = [
  "missing",
  "matches-old",
  "matches-template",
  "customized",
  "not-file-dir"
];

const OLD_CONTENT = "old-framework-content\n";
const TEMPLATE_CONTENT = "new-framework-content\n";
const CUSTOM_CONTENT = "user-customized-content\n";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function relativePathFor(category: FileCategory): string {
  switch (category) {
    case "core":
      return "AGENTS.md";
    case "normal-skill":
      return ".agents/skills/feature/SKILL.md";
    case "protected-skill":
      return ".agents/skills/archify/SKILL.md";
    case "third-party-skill":
      return ".agents/skills/custom-tp/SKILL.md";
    case "custom-vendor-skill":
      return ".agents/skills/custom-vs/SKILL.md";
    case "vendor-path":
      return "devflow/.vendor/pkg/item.txt";
  }
}

function isProtectedCategory(category: FileCategory): boolean {
  return (
    category === "protected-skill" ||
    category === "third-party-skill" ||
    category === "custom-vendor-skill" ||
    category === "vendor-path"
  );
}

async function writeTargetFile(root: string, rel: string, content: string): Promise<void> {
  const full = path.join(root, ...rel.split("/"));
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf8");
}

function formatSample(parts: Record<string, unknown>): string {
  return Object.entries(parts)
    .map(([k, v]) => `${k}=${String(v)}`)
    .join(" ");
}

async function verifyMatrix(
  scratchRoot: string,
  found: Map<Clause, string>
): Promise<{ cases: number; gateChecks: number }> {
  const oldHash = sha256(OLD_CONTENT);
  const templateHash = sha256(TEMPLATE_CONTENT);
  let cases = 0;
  let gateChecks = 0;

  const note = (clause: Clause, detail: string) => {
    if (!found.has(clause)) {
      found.set(clause, detail);
    }
  };

  for (const category of FILE_CATEGORIES) {
    const rel = relativePathFor(category);
    for (const prevRecord of PREVIOUS_RECORDS) {
      for (const templatePresence of TEMPLATE_PRESENCES) {
        for (const diskState of DISK_STATES) {
          cases += 1;
          const caseDir = path.join(scratchRoot, `case-${cases}`);
          const targetDir = path.join(caseDir, "target");
          const templateDir = path.join(caseDir, "template");
          await fs.mkdir(targetDir, { recursive: true });
          await fs.mkdir(templateDir, { recursive: true });

          if (templatePresence === "present") {
            await writeTargetFile(templateDir, rel, TEMPLATE_CONTENT);
          }

          if (prevRecord !== "absent") {
            const manifest: Manifest = createManifest("2.19.0", ["antigravity"], new Map());
            manifest.managedFiles[rel] =
              prevRecord === "matches-old" ? oldHash : templateHash;
            manifest.thirdPartySkills = [
              { name: "custom-tp", source: "local/custom-tp" }
            ];
            manifest.customVendorSkills = [
              {
                name: "custom-vs",
                source: "local/custom-vs",
                vendorPath: "devflow/.vendor/custom-vs"
              }
            ];
            await writeTargetFile(
              targetDir,
              ".nexus/nexus-devflow.json",
              `${JSON.stringify(manifest, null, 2)}\n`
            );
          }

          if (diskState === "matches-old") {
            await writeTargetFile(targetDir, rel, OLD_CONTENT);
          } else if (diskState === "matches-template") {
            await writeTargetFile(targetDir, rel, TEMPLATE_CONTENT);
          } else if (diskState === "customized") {
            await writeTargetFile(targetDir, rel, CUSTOM_CONTENT);
          } else if (diskState === "not-file-dir") {
            await fs.mkdir(path.join(targetDir, ...rel.split("/")), { recursive: true });
          }

          const prepared = await prepareUpdate({
            targetDir,
            templateRoot: templateDir,
            version: "2.20.5",
            adapters: ["antigravity"]
          });

          const label = formatSample({
            category,
            rel,
            prevRecord,
            templatePresence,
            diskState
          });

          const inCreate = prepared.createList.includes(rel);
          const inUpdate = prepared.updateList.includes(rel);
          const conflict = prepared.conflictList.find((c) => c.relativePath === rel);
          const inOrphan = prepared.orphanedFiles.includes(rel);

          if (templatePresence === "present") {
            if (diskState === "customized") {
              if (inCreate || inUpdate || conflict?.reason !== "customized") {
                note(
                  "conflict-guard",
                  `${label} -> create=${inCreate} update=${inUpdate} conflict=${conflict?.reason ?? "none"}`
                );
              }
            } else if (diskState === "not-file-dir") {
              if (inCreate || inUpdate || conflict?.reason !== "not_file") {
                note(
                  "conflict-guard",
                  `${label} -> create=${inCreate} update=${inUpdate} conflict=${conflict?.reason ?? "none"}`
                );
              }
            } else if (diskState === "matches-old" && prevRecord !== "matches-old") {
              if (inCreate || inUpdate || conflict?.reason !== "customized") {
                note(
                  "conflict-guard",
                  `${label} -> expected customized conflict when recorded hash differs; got create=${inCreate} update=${inUpdate} conflict=${conflict?.reason ?? "none"}`
                );
              }
            }
          }

          if (templatePresence === "absent") {
            if (isProtectedCategory(category) && inOrphan) {
              note("protected-orphan-guard", `${label} -> protected entry entered orphanedFiles`);
            }
            if (diskState === "customized" && inOrphan) {
              note("protected-orphan-guard", `${label} -> customized orphan entered orphanedFiles`);
            }
            if (prevRecord === "matches-template" && diskState === "matches-old" && inOrphan) {
              note("protected-orphan-guard", `${label} -> hash-mismatched orphan entered orphanedFiles`);
            }
          }

          if (prepared.conflictList.length > 0) {
            gateChecks += 1;
            let rejected = false;
            try {
              await applyPreparedUpdate(prepared, { replaceConflicts: false });
            } catch {
              rejected = true;
            }
            if (!rejected) {
              note("no-overwrite-gate", `${label} -> applyPreparedUpdate succeeded despite conflictList`);
            } else if (diskState === "customized") {
              const after = await fs.readFile(path.join(targetDir, ...rel.split("/")), "utf8");
              if (after !== CUSTOM_CONTENT) {
                note("no-overwrite-gate", `${label} -> customized content mutated despite rejection`);
              }
            }
          }
        }
      }
    }
  }

  return { cases, gateChecks };
}

async function verifyRollbackAtomicity(
  scratchRoot: string,
  found: Map<Clause, string>
): Promise<number> {
  const rbDir = path.join(scratchRoot, "rollback-check");
  const targetDir = path.join(rbDir, "target");
  const templateDir = path.join(rbDir, "template");
  await fs.mkdir(targetDir, { recursive: true });
  await fs.mkdir(templateDir, { recursive: true });

  await writeTargetFile(targetDir, "AGENTS.md", OLD_CONTENT);
  await writeTargetFile(targetDir, ".agents/skills/retired/SKILL.md", OLD_CONTENT);

  const prevManifest = createManifest("2.19.0", ["antigravity"], new Map());
  prevManifest.managedFiles["AGENTS.md"] = sha256(OLD_CONTENT);
  prevManifest.managedFiles[".agents/skills/retired/SKILL.md"] = sha256(OLD_CONTENT);
  await writeTargetFile(
    targetDir,
    ".nexus/nexus-devflow.json",
    `${JSON.stringify(prevManifest, null, 2)}\n`
  );

  await writeTargetFile(templateDir, "AGENTS.md", TEMPLATE_CONTENT);
  await writeTargetFile(templateDir, ".agents/skills/new-skill/SKILL.md", TEMPLATE_CONTENT);

  const prepared = await prepareUpdate({
    targetDir,
    templateRoot: templateDir,
    version: "2.20.5",
    adapters: ["antigravity"]
  });

  // Inject deterministic mid-apply failure: replace template source hash mismatch
  // after staging or make second target path collide with a pre-created directory.
  const collidePath = path.join(targetDir, ".agents", "skills", "new-skill", "SKILL.md");
  await fs.mkdir(collidePath, { recursive: true });

  let rolledBackError = false;
  try {
    await applyPreparedUpdate(prepared, { replaceConflicts: false });
  } catch (err: unknown) {
    rolledBackError = err instanceof Error && err.message.includes("rolled back");
  }

  if (!rolledBackError) {
    found.set("rollback-atomicity", "applyPreparedUpdate did not trigger rollback on mid-apply write failure");
    return 1;
  }

  const agentsAfter = await fs.readFile(path.join(targetDir, "AGENTS.md"), "utf8");
  const retiredAfter = await fs.readFile(
    path.join(targetDir, ".agents", "skills", "retired", "SKILL.md"),
    "utf8"
  );
  const manifestAfter = JSON.parse(
    await fs.readFile(path.join(targetDir, ".nexus", "nexus-devflow.json"), "utf8")
  ) as Manifest;

  if (
    agentsAfter !== OLD_CONTENT ||
    retiredAfter !== OLD_CONTENT ||
    manifestAfter.version !== "2.19.0"
  ) {
    found.set(
      "rollback-atomicity",
      `post-rollback state mismatch: agents=${agentsAfter === OLD_CONTENT} retired=${retiredAfter === OLD_CONTENT} manifestVersion=${manifestAfter.version}`
    );
  }

  return 1;
}

async function verifySymlinkGuard(
  scratchRoot: string,
  found: Map<Clause, string>
): Promise<{ checked: boolean; skippedReason?: string }> {
  const symRoot = path.join(scratchRoot, "symlink-check");
  const outsideDir = path.join(scratchRoot, "outside");
  const targetDir = path.join(symRoot, "target");
  const templateDir = path.join(symRoot, "template");
  await fs.mkdir(outsideDir, { recursive: true });
  await fs.mkdir(path.join(targetDir, ".agents"), { recursive: true });
  await fs.mkdir(templateDir, { recursive: true });
  await writeTargetFile(templateDir, ".agents/skills/feature/SKILL.md", TEMPLATE_CONTENT);

  try {
    await fs.symlink(outsideDir, path.join(targetDir, ".agents", "skills"), "junction");
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code ?? "ERR";
    return { checked: false, skippedReason: code };
  }

  let rejected = false;
  try {
    await assertNoSymlinkParents(targetDir, ".agents/skills/feature/SKILL.md");
    await prepareUpdate({
      targetDir,
      templateRoot: templateDir,
      version: "2.20.5",
      adapters: ["antigravity"]
    });
  } catch {
    rejected = true;
  }

  if (!rejected) {
    found.set("symlink-guard", "prepareUpdate/assertNoSymlinkParents allowed symlinked parent directory");
  }

  return { checked: true };
}

async function main(): Promise<number> {
  const scratchRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-formal-update-"));
  const found = new Map<Clause, string>();

  try {
    const { cases, gateChecks } = await verifyMatrix(scratchRoot, found);
    const rollbackCases = await verifyRollbackAtomicity(scratchRoot, found);
    const symlinkRes = await verifySymlinkGuard(scratchRoot, found);

    console.log("verify-update-resilience");
    console.log(`cases: ${cases} matrix + ${rollbackCases} rollback + ${symlinkRes.checked ? 1 : 0} symlink`);
    console.log(`conflict-gate checks: ${gateChecks}`);
    if (!symlinkRes.checked) {
      console.log(`symlink-guard: skipped (${symlinkRes.skippedReason})`);
    }
    console.log(
      "property: update preserves customized, non-regular, protected, and vendor files, enforces conflict gate, rejects symlinks, and rolls back atomically on mid-apply failure."
    );

    const clauses: readonly Clause[] = [
      "conflict-guard",
      "no-overwrite-gate",
      "protected-orphan-guard",
      "rollback-atomicity",
      "symlink-guard"
    ];

    for (const clause of clauses) {
      if (clause === "symlink-guard" && !symlinkRes.checked) {
        continue;
      }
      const detail = found.get(clause);
      if (!detail) {
        console.log(`${clause}: pass`);
      } else {
        console.log(`${clause}: FAIL`);
        console.log(`  ${detail}`);
      }
    }

    if (found.size > 0) {
      console.log("exit: 1");
      return 1;
    }

    console.log("exit: 0");
    return 0;
  } finally {
    await fs.rm(scratchRoot, { recursive: true, force: true });
  }
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
