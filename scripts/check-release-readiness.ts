import { execSync } from "node:child_process";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runTooling } from "../packages/create-nexus-devflow/lib/tooling/index.js";

export interface TarballInspectionResult {
  readonly createFiles: string[];
  readonly wrapperFiles: string[];
  readonly templatePlansSanitized?: boolean;
}

export interface ReleaseReadinessCheck {
  readonly id: string;
  readonly name: string;
  readonly ok: boolean;
  readonly message: string;
}

export interface ReleaseReadinessReport {
  readonly projectRoot: string;
  readonly version: string | null;
  readonly ok: boolean;
  readonly checks: ReleaseReadinessCheck[];
}

export interface ReleaseReadinessOptions {
  readonly packInspector?: (projectRoot: string) => Promise<TarballInspectionResult>;
  readonly skipNetworkOrPack?: boolean;
}

const CORE_SKILLS = [
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
] as const;

const EXTRAS_SKILLS = [
  "browseros-neo",
  "ci",
  "convert-any-to-md",
  "release",
  "rollback",
  "setup-tests",
  "vendor",
  "verify-harness"
] as const;

const FORBIDDEN_TARBALL_PATTERNS: readonly RegExp[] = [
  /(^|\/)\.nexus\//,
  /(^|\/)formal\//,
  /(^|\/)evals\//,
  /(^|\/)prototypes\//,
  /(^|\/)devflow\/\.state\//,
  /(^|\/)devflow\/\.vendor\//,
  /(^|\/)devflow\/reports\//,
  /(^|\/)devflow\/research\//,
  /(^|\/)devflow\/scratch\//,
  /(^|\/)devflow\/analysis\//,
  /(^|\/)devflow\/runs\//,
  /(^|\/)devflow\/inbox\//,
  /(^|\/)devflow\/backups\//,
  /(^|\/)devflow\/reference\/playbooks\//,
  /(^|\/)devflow\/history\/(features|fixes|rollbacks)\/(?!README\.md$).+/,
  /(^|\/)devflow\/(discoveries|decisions)\/(?!README\.md$|\.gitkeep$).+/,
  /(^|\/)devflow\/check-layers\.json$/,
  /(^|\/)devflow\/context\/\d+[^/]*\//,
  /(^|\/)\.(agents|claude)\/skills\/(publish-devflow|run-isolation-formal|concurrent-run-isolation-proof|update-resilience-proof|verify|verify-completion-gate|create-formal-verification-skill|maintain-formal-verification-skill)\//
];

const CORE_SKILL_SET = new Set<string>(CORE_SKILLS);
const ALLOWED_WRAPPER_FILES = new Set<string>([
  "package.json",
  "README.md",
  "LICENSE",
  "bin/nexus-devflow.js"
]);

const SEMVER_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const SECURITY_SCAN_DIRS = [
  "packages/create-nexus-devflow/bin",
  "packages/create-nexus-devflow/lib",
  "packages/create-nexus-devflow/scripts",
  "packages/nexus-devflow"
] as const;

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function parseNpmPackFiles(jsonStdout: string): string[] {
  const parsed = JSON.parse(jsonStdout) as Array<{ files?: Array<{ path?: string }> }>;
  const files = parsed?.[0]?.files ?? [];
  return files
    .map((entry) => (entry.path ?? "").replace(/\\/g, "/"))
    .filter(Boolean);
}

async function inspectRealPackageTarballs(projectRoot: string): Promise<TarballInspectionResult> {
  const createPkgDir = path.join(projectRoot, "packages", "create-nexus-devflow");
  const wrapperPkgDir = path.join(projectRoot, "packages", "nexus-devflow");
  const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
  const maxBuffer = 16 * 1024 * 1024;

  let primaryFailed = false;
  try {
    execSync(`${npmBin} --prefix packages/create-nexus-devflow run prepack`, {
      cwd: projectRoot,
      stdio: "pipe",
      maxBuffer
    });

    const templateProjectPlan = await fs.readFile(
      path.join(createPkgDir, "template", "devflow", "project-plan.md"),
      "utf8"
    );
    const refProjectPlan = await fs.readFile(
      path.join(projectRoot, "devflow", "reference", "project-plan-template.md"),
      "utf8"
    );
    const templateBuildPlan = await fs.readFile(
      path.join(createPkgDir, "template", "devflow", "build-plan.md"),
      "utf8"
    );
    const refBuildPlan = await fs.readFile(
      path.join(projectRoot, "devflow", "reference", "build-plan-template.md"),
      "utf8"
    );
    const createPackJson = execSync(`${npmBin} pack --dry-run --json --ignore-scripts`, {
      cwd: createPkgDir,
      encoding: "utf8",
      maxBuffer
    });
    const wrapperPackJson = execSync(`${npmBin} pack --dry-run --json --ignore-scripts`, {
      cwd: wrapperPkgDir,
      encoding: "utf8",
      maxBuffer
    });

    return {
      createFiles: parseNpmPackFiles(createPackJson),
      wrapperFiles: parseNpmPackFiles(wrapperPackJson),
      templatePlansSanitized:
        templateProjectPlan === refProjectPlan && templateBuildPlan === refBuildPlan
    };
  } catch (err: unknown) {
    primaryFailed = true;
    throw err;
  } finally {
    try {
      execSync(`${npmBin} --prefix packages/create-nexus-devflow run postpack`, {
        cwd: projectRoot,
        stdio: "pipe",
        maxBuffer
      });
    } catch (cleanupErr: unknown) {
      if (!primaryFailed) throw cleanupErr;
    }
  }
}

function extractChangelogVersionSection(changelog: string, version: string): string | null {
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headerRegex = new RegExp(`^## \\[${escaped}\\](?:\\s|$).*$`, "m");
  const match = headerRegex.exec(changelog);
  if (!match) return null;
  const start = match.index;
  const rest = changelog.slice(start + match[0].length);
  const nextHeader = /^## \[/m.exec(rest);
  return nextHeader ? changelog.slice(start, start + match[0].length + nextHeader.index) : changelog.slice(start);
}

export async function evaluateReleaseReadiness(
  projectRoot: string,
  options: ReleaseReadinessOptions = {}
): Promise<ReleaseReadinessReport> {
  const checks: ReleaseReadinessCheck[] = [];

  const rootPkg = await readJsonFile<{ version?: string; engines?: { node?: string } }>(
    path.join(projectRoot, "package.json")
  );
  const createPkg = await readJsonFile<{ version?: string; engines?: { node?: string } }>(
    path.join(projectRoot, "packages", "create-nexus-devflow", "package.json")
  );
  const wrapperPkg = await readJsonFile<{
    version?: string;
    dependencies?: Record<string, string>;
    engines?: { node?: string };
  }>(path.join(projectRoot, "packages", "nexus-devflow", "package.json"));
  const nexusManifest = await readJsonFile<{ version?: string }>(
    path.join(projectRoot, ".nexus", "nexus-devflow.json")
  );

  const version = rootPkg?.version ?? null;
  const depVersion = wrapperPkg?.dependencies?.["@jakkrichm/create-nexus-devflow"];
  const lockstepOk =
    typeof version === "string" &&
    SEMVER_PATTERN.test(version) &&
    createPkg?.version === version &&
    wrapperPkg?.version === version &&
    depVersion === version &&
    nexusManifest?.version === version;

  checks.push({
    id: "semver_lockstep",
    name: "SemVer 4-Way Lockstep",
    ok: lockstepOk,
    message: lockstepOk
      ? `All 4 manifests & wrapper dependency agree at "${version}".`
      : `Version mismatch: root=${rootPkg?.version}, create=${createPkg?.version}, wrapper=${wrapperPkg?.version}, dep=${depVersion}, manifest=${nexusManifest?.version}.`
  });

  const rootEngine = rootPkg?.engines?.node;
  const createEngine = createPkg?.engines?.node;
  const wrapperEngine = wrapperPkg?.engines?.node;
  const enginesOk =
    typeof rootEngine === "string" &&
    rootEngine.length > 0 &&
    createEngine === rootEngine &&
    wrapperEngine === rootEngine;

  checks.push({
    id: "engines_alignment",
    name: "Node Engines Alignment",
    ok: enginesOk,
    message: enginesOk
      ? `All 3 packages declare engines.node "${rootEngine}".`
      : `engines.node mismatch: root=${rootEngine}, create=${createEngine}, wrapper=${wrapperEngine}.`
  });

  let ciOk = false;
  let ciMessage = "Missing .github/workflows/validate.yml.";
  try {
    const workflowRaw = await fs.readFile(path.join(projectRoot, ".github", "workflows", "validate.yml"), "utf8");
    const requiredTokens = ["ubuntu-latest", "windows-latest", "macos-latest", "\"20\"", "\"22\"", "\"24\""];
    const missingTokens = requiredTokens.filter((token) => !workflowRaw.includes(token));
    ciOk = missingTokens.length === 0;
    ciMessage = ciOk
      ? "validate.yml covers ubuntu/windows/macos and Node 20/22/24."
      : `validate.yml is missing matrix entries: ${missingTokens.join(", ")}.`;
  } catch {
    ciOk = false;
  }
  checks.push({
    id: "ci_matrix_coverage",
    name: "CI OS & Node Matrix",
    ok: ciOk,
    message: ciMessage
  });

  let changelogOk = false;
  let changelogMsg = "CHANGELOG.md missing or version section incomplete.";
  if (version) {
    try {
      const changelogRaw = await fs.readFile(path.join(projectRoot, "CHANGELOG.md"), "utf8");
      const section = extractChangelogVersionSection(changelogRaw, version);
      if (!section) {
        changelogMsg = `CHANGELOG.md is missing section "## [${version}]".`;
      } else {
        const hasMigration = /migrat/i.test(section);
        const hasRollback = /rollback/i.test(section);
        changelogOk = hasMigration && hasRollback;
        changelogMsg = changelogOk
          ? `CHANGELOG.md section [${version}] contains Migration and Rollback guidance.`
          : `CHANGELOG.md [${version}] must document both Migration and Rollback steps.`;
      }
    } catch {
      changelogOk = false;
    }
  }
  checks.push({
    id: "changelog_release_entry",
    name: "Changelog Migration & Rollback",
    ok: changelogOk,
    message: changelogMsg
  });

  try {
    const docRes = await runTooling("scan-doc-contract", [], { projectRoot });
    checks.push({
      id: "doc_contract_gate",
      name: "Doc & Retired Command Contract",
      ok: Boolean(docRes.ok),
      message: docRes.message || "scan-doc-contract passed."
    });
  } catch (err: unknown) {
    checks.push({
      id: "doc_contract_gate",
      name: "Doc & Retired Command Contract",
      ok: false,
      message: err instanceof Error ? err.message : String(err)
    });
  }

  const securityFailures: string[] = [];
  for (const relDir of SECURITY_SCAN_DIRS) {
    const absDir = path.join(projectRoot, relDir);
    if (!fsSync.existsSync(absDir)) continue;
    try {
      await runTooling("scan-security-hygiene", ["--dir", relDir], { projectRoot });
    } catch (err: unknown) {
      securityFailures.push(`${relDir}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  checks.push({
    id: "security_hygiene_gate",
    name: "Publishable Security Hygiene",
    ok: securityFailures.length === 0,
    message:
      securityFailures.length === 0
        ? `Scanned ${SECURITY_SCAN_DIRS.join(", ")} with zero hygiene violations.`
        : securityFailures.join("\n")
  });

  if (!options.skipNetworkOrPack) {
    try {
      const inspectPack = options.packInspector ?? inspectRealPackageTarballs;
      const pack = await inspectPack(projectRoot);
      const createSet = new Set(pack.createFiles);
      const wrapperSet = new Set(pack.wrapperFiles);
      const missing: string[] = [];

      for (const skill of CORE_SKILLS) {
        if (!createSet.has(`template/.agents/skills/${skill}/SKILL.md`)) {
          missing.push(`template/.agents/skills/${skill}/SKILL.md`);
        }
        if (!createSet.has(`template/.claude/skills/${skill}/SKILL.md`)) {
          missing.push(`template/.claude/skills/${skill}/SKILL.md`);
        }
      }
      for (const extra of EXTRAS_SKILLS) {
        if (!createSet.has(`extras/skills/${extra}/SKILL.md`)) {
          missing.push(`extras/skills/${extra}/SKILL.md`);
        }
      }
      for (const requiredWrapper of ALLOWED_WRAPPER_FILES) {
        if (!wrapperSet.has(requiredWrapper)) {
          missing.push(`nexus-devflow/${requiredWrapper}`);
        }
      }

      const leakedCreate = pack.createFiles.filter((filePath) => {
        if (FORBIDDEN_TARBALL_PATTERNS.some((pattern) => pattern.test(filePath))) {
          return true;
        }
        const tplSkillMatch = /^template\/\.(?:agents|claude)\/skills\/([^/]+)\//.exec(filePath);
        return Boolean(tplSkillMatch && !CORE_SKILL_SET.has(tplSkillMatch[1]));
      });
      const leakedWrapper = pack.wrapperFiles
        .filter(
          (filePath) =>
            !ALLOWED_WRAPPER_FILES.has(filePath) ||
            FORBIDDEN_TARBALL_PATTERNS.some((pattern) => pattern.test(filePath))
        )
        .map((filePath) => `nexus-devflow/${filePath}`);
      const leaked = [...leakedCreate, ...leakedWrapper];
      const plansSanitized = pack.templatePlansSanitized !== false;
      const tarballOk = missing.length === 0 && leaked.length === 0 && plansSanitized;

      const reasons: string[] = [];
      if (missing.length > 0) reasons.push(`missing=[${missing.join(", ")}]`);
      if (leaked.length > 0) reasons.push(`leaked=[${leaked.join(", ")}]`);
      if (!plansSanitized) reasons.push("template starter plans differ from devflow/reference/*-template.md");

      checks.push({
        id: "tarball_hygiene",
        name: "Package Tarball Hygiene",
        ok: tarballOk,
        message: tarballOk
          ? `Tarballs verified clean (${pack.createFiles.length} create files, ${pack.wrapperFiles.length} wrapper files, 15 Core Skills/adapter, 8 extras, sanitized starter plans).`
          : reasons.join("; ")
      });
    } catch (err: unknown) {
      checks.push({
        id: "tarball_hygiene",
        name: "Package Tarball Hygiene",
        ok: false,
        message: err instanceof Error ? err.message : String(err)
      });
    }
  }

  return {
    projectRoot,
    version,
    ok: checks.every((check) => check.ok),
    checks
  };
}

async function main(): Promise<void> {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const report = await evaluateReleaseReadiness(projectRoot);
  console.log(`\n=== Nexus-DevFlow Release Readiness (${report.version ?? "unknown"}) ===`);
  for (const check of report.checks) {
    const badge = check.ok ? "[OK]" : "[FAIL]";
    console.log(`  ${badge} ${check.name}: ${check.message}`);
  }
  if (!report.ok) {
    console.error("\nRelease readiness gate FAILED.");
    process.exit(1);
  }
  console.log("\nRelease readiness gate PASSED.");
}

const isEntrypoint =
  Boolean(process.argv[1]) &&
  fsSync.realpathSync(process.argv[1]) === fsSync.realpathSync(fileURLToPath(import.meta.url));

if (isEntrypoint) {
  main().catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
