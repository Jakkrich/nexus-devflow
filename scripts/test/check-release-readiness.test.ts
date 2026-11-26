import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { evaluateReleaseReadiness } from "../check-release-readiness.js";

async function seedCleanReleaseRepo(rootDir: string, version: string = "3.0.0"): Promise<void> {
  await fs.mkdir(path.join(rootDir, ".nexus"), { recursive: true });
  await fs.mkdir(path.join(rootDir, ".github", "workflows"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "packages", "create-nexus-devflow", "bin"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "packages", "create-nexus-devflow", "lib"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "packages", "create-nexus-devflow", "scripts"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "packages", "nexus-devflow", "bin"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "docs"), { recursive: true });

  await fs.writeFile(
    path.join(rootDir, "package.json"),
    JSON.stringify({ name: "nexus-devflow", version, engines: { node: ">=18.17" } }, null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(rootDir, "packages", "create-nexus-devflow", "package.json"),
    JSON.stringify({ name: "@jakkrichm/create-nexus-devflow", version, engines: { node: ">=18.17" } }, null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(rootDir, "packages", "nexus-devflow", "package.json"),
    JSON.stringify(
      {
        name: "nexus-devflow",
        version,
        dependencies: { "@jakkrichm/create-nexus-devflow": version },
        engines: { node: ">=18.17" }
      },
      null,
      2
    ),
    "utf8"
  );
  await fs.writeFile(
    path.join(rootDir, ".nexus", "nexus-devflow.json"),
    JSON.stringify({ schemaVersion: 1, version }, null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(rootDir, "CHANGELOG.md"),
    [
      "# Changelog",
      "",
      `## [${version}] - 2026-11-26`,
      "",
      "### Added",
      "- DevFlow v3 architecture.",
      "",
      "### Breaking Changes & Migration Guide (v2 -> v3)",
      "- Run `npx nexus-devflow update` to migrate retired `/autopilot` and `/devflow` skills.",
      "",
      "### Rollback Steps",
      "- Pin `npx @jakkrichm/create-nexus-devflow@2.21.0 update` or restore backup from `devflow/.state/backups/`."
    ].join("\n"),
    "utf8"
  );
  await fs.writeFile(
    path.join(rootDir, ".github", "workflows", "validate.yml"),
    [
      "jobs:",
      "  validate:",
      "    strategy:",
      "      matrix:",
      "        os: [ubuntu-latest, windows-latest, macos-latest]",
      "        node: [\"20\", \"22\", \"24\"]"
    ].join("\n"),
    "utf8"
  );
  await fs.writeFile(path.join(rootDir, "README.md"), "# Nexus-DevFlow\n\nRun `npx nexus-devflow`.\n", "utf8");
  await fs.writeFile(
    path.join(rootDir, "packages", "create-nexus-devflow", "lib", "index.ts"),
    "export const ok = true;\n",
    "utf8"
  );
}

function buildValidTarballFiles(): { createFiles: string[]; wrapperFiles: string[] } {
  const coreSkills = [
    "audit",
    "check",
    "complete",
    "debug",
    "devflow-help",
    "devflow-mode",
    "discovery",
    "explore",
    "feature",
    "fix",
    "idea",
    "implement",
    "onboard",
    "overview",
    "prototype"
  ];
  const extras = [
    "browseros-neo",
    "ci",
    "convert-any-to-md",
    "release",
    "rollback",
    "setup-tests",
    "vendor",
    "verify-harness"
  ];
  const createFiles = [
    "package.json",
    "README.md",
    "LICENSE",
    "dist/bin/create-nexus-devflow.js",
    "template/AGENTS.md",
    "template/CLAUDE.md",
    "template/devflow/project-plan.md",
    "template/devflow/build-plan.md",
    "template/devflow/context/project-overview.md",
    ...coreSkills.flatMap((s) => [
      `template/.agents/skills/${s}/SKILL.md`,
      `template/.claude/skills/${s}/SKILL.md`
    ]),
    ...extras.map((e) => `extras/skills/${e}/SKILL.md`)
  ];
  return {
    createFiles,
    wrapperFiles: ["package.json", "README.md", "LICENSE", "bin/nexus-devflow.js"]
  };
}

test("evaluateReleaseReadiness passes cleanly on synchronized 3.0.0 repo and tarball inventory", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "release-ready-pass-"));
  try {
    await seedCleanReleaseRepo(tempDir, "3.0.0");
    const validPack = buildValidTarballFiles();
    const report = await evaluateReleaseReadiness(tempDir, {
      packInspector: async () => validPack
    });
    assert.equal(report.ok, true, `Unexpected failures: ${JSON.stringify(report.checks.filter((c) => !c.ok))}`);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("evaluateReleaseReadiness rejects version mismatches, missing CHANGELOG/rollback, missing CI node 20, and leaked tarball files", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "release-ready-fail-"));
  try {
    await seedCleanReleaseRepo(tempDir, "3.0.0");
    const validPack = buildValidTarballFiles();

    // 1. Version mismatch + engine mismatch
    await fs.writeFile(
      path.join(tempDir, "packages", "create-nexus-devflow", "package.json"),
      JSON.stringify({ name: "@jakkrichm/create-nexus-devflow", version: "2.21.0", engines: { node: ">=18" } }, null, 2),
      "utf8"
    );
    const mismatchReport = await evaluateReleaseReadiness(tempDir, {
      packInspector: async () => validPack
    });
    assert.equal(mismatchReport.ok, false);
    assert.equal(mismatchReport.checks.find((c) => c.id === "semver_lockstep")?.ok, false);
    assert.equal(mismatchReport.checks.find((c) => c.id === "engines_alignment")?.ok, false);

    // 2. Restore manifest mismatch, break CHANGELOG & CI, and inject leaked tarball file
    await seedCleanReleaseRepo(tempDir, "3.0.0");
    await fs.writeFile(path.join(tempDir, "CHANGELOG.md"), "# Changelog\n\n## [2.21.0]\n- Old.\n", "utf8");
    await fs.writeFile(
      path.join(tempDir, ".github", "workflows", "validate.yml"),
      "matrix:\n  os: [ubuntu-latest]\n  node: [\"22\"]\n",
      "utf8"
    );
    const leakPack = {
      ...validPack,
      createFiles: [
        ...validPack.createFiles,
        "template/formal/RunStateAllocation.tla",
        "template/.agents/skills/publish-devflow/SKILL.md",
        "template/.agents/skills/archify/SKILL.md",
        "template/.agents/skills/chief-of-staff/SKILL.md",
        "template/.agents/tools/install-project.ps1",
        "template/AI_HANDOFF.md",
        "template/devflow/context/125-production-release-readiness/spec.md"
      ],
      wrapperFiles: [...validPack.wrapperFiles, ".env.local"],
      templateEntrypointsSanitized: false
    };
    const badReport = await evaluateReleaseReadiness(tempDir, {
      packInspector: async () => leakPack
    });
    assert.equal(badReport.ok, false);
    assert.equal(badReport.checks.find((c) => c.id === "changelog_release_entry")?.ok, false);
    assert.equal(badReport.checks.find((c) => c.id === "ci_matrix_coverage")?.ok, false);
    const tarballCheck = badReport.checks.find((c) => c.id === "tarball_hygiene");
    assert.equal(tarballCheck?.ok, false);
    assert.match(tarballCheck?.message ?? "", /archify/);
    assert.match(tarballCheck?.message ?? "", /chief-of-staff/);
    assert.match(tarballCheck?.message ?? "", /install-project\.ps1/);
    assert.match(tarballCheck?.message ?? "", /AI_HANDOFF\.md/);
    assert.match(tarballCheck?.message ?? "", /AGENT-STARTER-KIT/);
    assert.match(tarballCheck?.message ?? "", /nexus-devflow\/\.env\.local/);

    // 3. F-05 regression: missing CHANGELOG.md must fail cleanly
    await fs.rm(path.join(tempDir, "CHANGELOG.md"));
    const missingChangelogReport = await evaluateReleaseReadiness(tempDir, {
      packInspector: async () => validPack
    });
    assert.equal(missingChangelogReport.checks.find((c) => c.id === "changelog_release_entry")?.ok, false);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
