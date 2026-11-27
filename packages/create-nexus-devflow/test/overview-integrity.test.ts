import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  OVERVIEW_MAX_BYTES,
  computeOverviewSourceHash,
  extractOverviewSourceHash,
  inspectOverviewFreshness,
  normalizeBuildPlanForHash,
  validatePlanningInputs
} from "../lib/overview-integrity.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..");

test("computeOverviewSourceHash stays identical across checkbox completion toggles and detects real plan changes", () => {
  const projectPlan = [
    "# Project Plan",
    "",
    "## Product Vision",
    "Local-first deterministic workflow compiler for multi-agent teams.",
    "",
    "## Constraints",
    "- Preserve user-owned planning files and template guidelines."
  ].join("\n");

  const uncheckedBuild = [
    "# Build Plan",
    "",
    "- [ ] 1. **Core Schema** - Establish baseline types",
    "  - [ ] 1a. Sub-item one",
    "  - [ ] 1b. Sub-item two"
  ].join("\n");

  const checkedBuild = [
    "# Build Plan",
    "",
    "- [x] 1. **Core Schema** - Establish baseline types",
    "  - [X] 1a. Sub-item one",
    "  - [ ] 1b. Sub-item two"
  ].join("\n");

  const renamedBuild = [
    "# Build Plan",
    "",
    "- [x] 1. **Core Schema Updated** - Establish baseline types",
    "  - [X] 1a. Sub-item one",
    "  - [ ] 1b. Sub-item two"
  ].join("\n");

  const normalized = normalizeBuildPlanForHash(checkedBuild);
  assert.equal(normalized, uncheckedBuild);

  const hashA = computeOverviewSourceHash(projectPlan, uncheckedBuild);
  const hashB = computeOverviewSourceHash(projectPlan, checkedBuild);
  const hashC = computeOverviewSourceHash(projectPlan, renamedBuild);
  const hashD = computeOverviewSourceHash(`${projectPlan}\n- Added note`, uncheckedBuild);

  assert.match(hashA, /^[0-9a-f]{64}$/);
  assert.equal(hashA, hashB);
  assert.notEqual(hashA, hashC);
  assert.notEqual(hashA, hashD);
});

test("extractOverviewSourceHash parses valid HTML comment markers and rejects invalid ones", () => {
  const sampleHash = "a".repeat(64);
  const md = `# Project Overview\n\n<!-- devflow:source-hash ${sampleHash} -->\n\n## Section\n`;
  assert.equal(extractOverviewSourceHash(md), sampleHash);
  assert.equal(extractOverviewSourceHash("# Project Overview\n\nNo marker here.\n"), null);
  assert.equal(extractOverviewSourceHash("<!-- devflow:source-hash not-hex -->"), null);
});

test("validatePlanningInputs rejects starter template placeholders and empty/stub build plans", async () => {
  const refProjectTemplate = await fs.readFile(
    path.join(repoRoot, "devflow", "reference", "project-plan-template.md"),
    "utf8"
  );
  const refBuildTemplate = await fs.readFile(
    path.join(repoRoot, "devflow", "reference", "build-plan-template.md"),
    "utf8"
  );

  const tplResult = validatePlanningInputs(refProjectTemplate, refBuildTemplate);
  assert.equal(tplResult.valid, false);
  assert.ok(tplResult.issues.some((i) => i.code === "placeholder_project_plan"));
  assert.ok(tplResult.issues.some((i) => i.code === "placeholder_build_plan"));
  assert.ok(tplResult.issues.every((i) => i.remediation.length > 10));

  const stubResult = validatePlanningInputs("# stub\n", "# stub\n");
  assert.equal(stubResult.valid, false);
  assert.ok(stubResult.issues.some((i) => i.code === "placeholder_project_plan"));

  const realProjectPlan = [
    "# Project Plan",
    "",
    "## Product Vision",
    "Inventory tracking app for independent bookstores.",
    "",
    "## Architecture",
    "Single SQLite store with deterministic CLI commands.",
    "",
    "## Constraints",
    "- Support offline template export cleanly."
  ].join("\n");

  const emptyChecklistBuildPlan = [
    "# Build Plan",
    "",
    "## Overview",
    "Just notes, no tracked checklist items yet.",
    "",
    "## Later / Post-MVP",
    "- [ ] **Future Sync** - Deferred backlog item"
  ].join("\n");

  const mismatchEmpty = validatePlanningInputs(realProjectPlan, emptyChecklistBuildPlan);
  assert.equal(mismatchEmpty.valid, false);
  assert.ok(mismatchEmpty.issues.some((i) => i.code === "empty_build_checklist"));

  const mismatchStub = validatePlanningInputs(realProjectPlan, refBuildTemplate);
  assert.equal(mismatchStub.valid, false);
  assert.ok(mismatchStub.issues.some((i) => i.code === "stub_build_plan_mismatch"));

  const validBuildPlan = [
    "# Build Plan",
    "",
    "- [x] 1. **Catalog Import** - Parse CSV inventory feeds",
    "- [ ] 2. **Stock Lookup** - Fast barcode search"
  ].join("\n");

  const cleanResult = validatePlanningInputs(realProjectPlan, validBuildPlan);
  assert.equal(cleanResult.valid, true);
  assert.equal(cleanResult.issues.length, 0);

  // F-02 & F-05 regressions: domain names like "Feature Two-Factor Auth", short build item, and child subheadings inside ## Later
  const edgeBuildPlan = [
    "# Build Plan",
    "",
    "## Phase 1: Backlog Management",
    "- [ ] 1. Setup",
    "- [ ] 2. **Feature Two-Factor Auth** - Support TOTP",
    "",
    "## Later / Post-MVP",
    "### Future Security",
    "- [ ] **Enterprise SSO** - Deferred"
  ].join("\n");
  const edgeResult = validatePlanningInputs(realProjectPlan, edgeBuildPlan);
  assert.equal(edgeResult.valid, true, `Unexpected issues on valid edge build plan: ${JSON.stringify(edgeResult.issues)}`);
  assert.equal(edgeResult.activeChecklistCount, 2);
});

test("validatePlanningInputs accepts real Nexus-DevFlow planning documents without false positives", async () => {
  const realProjectPlan = await fs.readFile(path.join(repoRoot, "devflow", "project-plan.md"), "utf8");
  const realBuildPlan = await fs.readFile(path.join(repoRoot, "devflow", "build-plan.md"), "utf8");
  const result = validatePlanningInputs(realProjectPlan, realBuildPlan);
  assert.equal(result.valid, true, `Unexpected planning validation issues: ${JSON.stringify(result.issues)}`);
});

test("inspectOverviewFreshness detects oversized, stale hash, missing hash, placeholder leaks, and exempts plain # stub", () => {
  const projectPlan = "# Project Plan\n\n## Product Vision\nReal app.\n";
  const buildPlan = "# Build Plan\n\n- [ ] 1. **Init** - Real work\n";
  const expectedHash = computeOverviewSourceHash(projectPlan, buildPlan);

  // 1. Fresh compiled overview
  const compiled = [
    "# Project Overview & Source of Truth",
    "",
    "> Living context artifact generated by `scripts/overview.ts` on 2026-11-26T00:00:00.000Z.",
    `<!-- devflow:source-hash ${expectedHash} -->`,
    "",
    "## 1. Project Purpose",
    "Real app."
  ].join("\n");
  const fresh = inspectOverviewFreshness({
    overviewContent: compiled,
    projectPlanContent: projectPlan,
    buildPlanContent: buildPlan
  });
  assert.equal(fresh.ok, true);
  assert.equal(fresh.status, "fresh");

  // 2. Checkbox completion toggle keeps overview fresh
  const toggledBuild = "# Build Plan\n\n- [x] 1. **Init** - Real work\n";
  const toggledFresh = inspectOverviewFreshness({
    overviewContent: compiled,
    projectPlanContent: projectPlan,
    buildPlanContent: toggledBuild
  });
  assert.equal(toggledFresh.ok, true);
  assert.equal(toggledFresh.status, "fresh");

  // 3. Real plan change triggers stale_hash
  const stale = inspectOverviewFreshness({
    overviewContent: compiled,
    projectPlanContent: `${projectPlan}\n## Architecture\nChanged architecture.\n`,
    buildPlanContent: buildPlan
  });
  assert.equal(stale.ok, false);
  assert.equal(stale.status, "stale_hash");

  // 4. Oversized (>= 20,000 bytes) fails
  const oversized = inspectOverviewFreshness({
    overviewContent: `${compiled}\n${"x".repeat(OVERVIEW_MAX_BYTES)}`,
    projectPlanContent: projectPlan,
    buildPlanContent: buildPlan
  });
  assert.equal(oversized.ok, false);
  assert.equal(oversized.status, "oversized");

  // 5. Compiled overview missing source-hash
  const missingHash = inspectOverviewFreshness({
    overviewContent: "# Project Overview\n\n> Living context artifact generated by `scripts/overview.ts` on now.\n\n## Content\nHi",
    projectPlanContent: projectPlan,
    buildPlanContent: buildPlan
  });
  assert.equal(missingHash.ok, false);
  assert.equal(missingHash.status, "missing_hash");

  // 6. Placeholder leak inside compiled overview
  const leaked = inspectOverviewFreshness({
    overviewContent: compiled.replace("Real app.", "TODO: แผนยังคงเป็นแผนต้นแบบ"),
    projectPlanContent: projectPlan,
    buildPlanContent: buildPlan
  });
  assert.equal(leaked.ok, false);
  assert.equal(leaked.status, "placeholder_leak");

  // 7. Plain # stub fixture remains uncompiled_stub (ok: true) so doctor does not false-warn
  const stub = inspectOverviewFreshness({
    overviewContent: "# stub\n",
    projectPlanContent: "# stub\n",
    buildPlanContent: "# stub\n"
  });
  assert.equal(stub.ok, true);
  assert.equal(stub.status, "uncompiled_stub");
});

test("runDoctor reports overview_integrity pass/warn across fresh, stale, oversized, symlink, and stub states", async () => {
  const { runDoctor } = await import("../lib/doctor.js");
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-doctor-overview-"));

  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Test\n", "utf8");

    const projectPlan = "# Project Plan\n\n## Product Vision\nReal project vision.\n";
    const buildPlan = "# Build Plan\n\n- [ ] 1. **Init** - Initial delivery item\n";
    const expectedHash = computeOverviewSourceHash(projectPlan, buildPlan);
    const compiledOverview = [
      "# Project Overview & Source of Truth",
      "",
      `<!-- devflow:source-hash ${expectedHash} -->`,
      "",
      "> Living context artifact generated by `scripts/overview.ts` on 2026-11-26T00:00:00.000Z.",
      "",
      "## 1. Project Purpose",
      "Real project vision."
    ].join("\n");

    await fs.writeFile(path.join(tempDir, "devflow", "project-plan.md"), projectPlan, "utf8");
    await fs.writeFile(path.join(tempDir, "devflow", "build-plan.md"), buildPlan, "utf8");
    await fs.writeFile(path.join(tempDir, "devflow", "context", "project-overview.md"), compiledOverview, "utf8");

    // 1. Fresh compiled overview -> pass
    const freshDoc = await runDoctor(tempDir);
    const freshCheck = freshDoc.checks.find((c) => c.id === "overview_integrity");
    assert.ok(freshCheck);
    assert.equal(freshCheck.status, "pass");

    // 2. Modified plan without re-running overview -> warn
    await fs.writeFile(
      path.join(tempDir, "devflow", "project-plan.md"),
      `${projectPlan}\n## Architecture\nAdded module.\n`,
      "utf8"
    );
    const staleDoc = await runDoctor(tempDir);
    const staleCheck = staleDoc.checks.find((c) => c.id === "overview_integrity");
    assert.ok(staleCheck);
    assert.equal(staleCheck.status, "warn");
    assert.match(staleCheck.message, /out of date/i);

    // 3. Oversized overview (>= 20,000 bytes) -> warn
    await fs.writeFile(path.join(tempDir, "devflow", "project-plan.md"), projectPlan, "utf8");
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "project-overview.md"),
      `${compiledOverview}\n${"a".repeat(OVERVIEW_MAX_BYTES)}`,
      "utf8"
    );
    const oversizedDoc = await runDoctor(tempDir);
    const oversizedCheck = oversizedDoc.checks.find((c) => c.id === "overview_integrity");
    assert.ok(oversizedCheck);
    assert.equal(oversizedCheck.status, "warn");
    assert.match(oversizedCheck.message, /oversized/i);

    // 4. Plain # stub remains pass (zero false warning)
    await fs.writeFile(path.join(tempDir, "devflow", "context", "project-overview.md"), "# stub\n", "utf8");
    const stubDoc = await runDoctor(tempDir);
    const stubCheck = stubDoc.checks.find((c) => c.id === "overview_integrity");
    assert.ok(stubCheck);
    assert.equal(stubCheck.status, "pass");

    // 5. Symlinked project-overview.md -> warn (lstat guard)
    const outsideOverview = path.join(tempDir, "outside-overview.md");
    await fs.writeFile(outsideOverview, compiledOverview, "utf8");
    await fs.rm(path.join(tempDir, "devflow", "context", "project-overview.md"));
    await fs.symlink(outsideOverview, path.join(tempDir, "devflow", "context", "project-overview.md"));
    const symlinkDoc = await runDoctor(tempDir);
    const symlinkCheck = symlinkDoc.checks.find((c) => c.id === "overview_integrity");
    assert.ok(symlinkCheck);
    assert.equal(symlinkCheck.status, "warn");
    assert.match(symlinkCheck.message, /symbolic link/i);

    // 6. F-01 regression: Fresh sanitizeStarterFiles() output must pass overview_integrity with 0 warnings
    await fs.rm(path.join(tempDir, "devflow", "context", "project-overview.md"));
    const { sanitizeStarterFiles } = await import("../scripts/prepare-template.js");
    await sanitizeStarterFiles(tempDir, repoRoot);
    const starterDoc = await runDoctor(tempDir);
    const starterCheck = starterDoc.checks.find((c) => c.id === "overview_integrity");
    assert.ok(starterCheck);
    assert.equal(starterCheck.status, "pass", `Expected pass on fresh starter overview, got: ${starterCheck.message}`);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
