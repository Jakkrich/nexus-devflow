import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type LanguageId =
  | "typescript"
  | "javascript"
  | "python"
  | "php"
  | "rust"
  | "go"
  | "tla"
  | "lean";

export type GateLayer = 1 | 2 | 3;

export type CheckExecutionStatus = "pass" | "fail" | "missing_lib" | "skip";

export interface CheckStepSpec {
  readonly layer: GateLayer;
  readonly language: LanguageId;
  readonly label: string;
  readonly command: string;
  readonly requiredLib: string;
  readonly requiredBinary?: string;
  readonly requiredNpmDep?: string;
  readonly requiredPythonModule?: string;
  readonly requiredComposerDep?: string;
  readonly installHint: string;
  readonly source: "override" | "agents_md" | "package_json" | "composer_json" | "default";
}

export interface FormalGuardSpec {
  readonly tool: "tla" | "lean";
  readonly specPath: string;
  readonly guardedPaths: readonly string[];
  readonly command: string;
  readonly requiredLib: string;
  readonly requiredBinary: string;
  readonly installHint: string;
}

export interface LanguageProfile {
  readonly id: LanguageId;
  readonly extensions: readonly string[];
  readonly manifests: readonly string[];
}

export interface CheckPipelinePlan {
  readonly projectRoot: string;
  readonly changedFiles: readonly string[];
  readonly detectedLanguages: readonly LanguageId[];
  readonly layer1: readonly CheckStepSpec[];
  readonly layer2: readonly CheckStepSpec[];
  readonly layer3: readonly CheckStepSpec[];
  readonly formalGuardsMatched: readonly FormalGuardSpec[];
}

export interface CheckStepOutcome {
  readonly layer: GateLayer;
  readonly language: LanguageId;
  readonly label: string;
  readonly command: string;
  readonly requiredLib: string;
  readonly status: CheckExecutionStatus;
  readonly exitCode: number | null;
  readonly output: string;
  readonly installHint?: string;
}

export interface CheckPipelineResult {
  readonly passed: boolean;
  readonly exitCode: 0 | 1;
  readonly stoppedAtLayer: GateLayer | null;
  readonly failureKind: "command_failed" | "missing_lib" | null;
  readonly plan: CheckPipelinePlan;
  readonly outcomes: readonly CheckStepOutcome[];
  readonly summary: string;
}

export interface CommandExecResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly error?: string;
}

export type CommandExecutor = (command: string, cwd: string) => CommandExecResult;
export type AvailabilityChecker = (
  step: Pick<
    CheckStepSpec,
    "requiredBinary" | "requiredNpmDep" | "requiredPythonModule" | "requiredComposerDep"
  >,
  projectRoot: string
) => boolean;

export interface CheckPipelineOptions {
  files?: readonly string[];
  planOnly?: boolean;
  executor?: CommandExecutor;
  checkAvailability?: AvailabilityChecker;
}

interface CustomCheckLayersConfig {
  languages?: Partial<
    Record<
      LanguageId,
      {
        layer1?: Array<{
          label?: string;
          command: string;
          requiredLib: string;
          requiredBinary?: string;
          requiredNpmDep?: string;
          installHint?: string;
        }>;
        layer2?: Array<{
          label?: string;
          command: string;
          requiredLib: string;
          requiredBinary?: string;
          requiredNpmDep?: string;
          installHint?: string;
        }>;
      }
    >
  >;
  formalGuards?: Array<{
    tool: "tla" | "lean";
    specPath: string;
    guardedPaths: string[];
    command: string;
    requiredLib: string;
    requiredBinary?: string;
    installHint?: string;
  }>;
}

interface PackageJsonShape {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface ComposerJsonShape {
  scripts?: Record<string, unknown>;
  require?: Record<string, string>;
  "require-dev"?: Record<string, string>;
}

/**
 * Single authoritative table mapping source extensions & project manifests to LanguageId.
 */
export const LANGUAGE_PROFILES: Record<LanguageId, LanguageProfile> = {
  typescript: {
    id: "typescript",
    extensions: [".ts", ".tsx", ".mts", ".cts"],
    manifests: ["tsconfig.json"]
  },
  javascript: {
    id: "javascript",
    extensions: [".js", ".jsx", ".mjs", ".cjs"],
    manifests: ["package.json"]
  },
  python: {
    id: "python",
    extensions: [".py"],
    manifests: ["pyproject.toml", "requirements.txt", "setup.py"]
  },
  php: {
    id: "php",
    extensions: [".php", ".phtml"],
    manifests: ["composer.json", "phpunit.xml", "phpunit.xml.dist"]
  },
  rust: {
    id: "rust",
    extensions: [".rs"],
    manifests: ["Cargo.toml"]
  },
  go: {
    id: "go",
    extensions: [".go"],
    manifests: ["go.mod"]
  },
  tla: {
    id: "tla",
    extensions: [".tla", ".cfg"],
    manifests: []
  },
  lean: {
    id: "lean",
    extensions: [".lean"],
    manifests: ["lean-toolchain", "lakefile.lean", "lakefile.toml"]
  }
};

const ALL_LANGUAGE_IDS: readonly LanguageId[] = [
  "typescript",
  "javascript",
  "python",
  "php",
  "rust",
  "go",
  "tla",
  "lean"
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeRepoPath(filePath: string): string {
  return filePath.replace(/\\/g, "/").replace(/^\.\//, "");
}

function readPackageJson(projectRoot: string): PackageJsonShape | null {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) return null;
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return isRecord(parsed) ? (parsed as PackageJsonShape) : null;
  } catch {
    return null;
  }
}

function readCustomCheckLayersConfig(projectRoot: string): CustomCheckLayersConfig | null {
  const candidates = [
    path.join(projectRoot, "formal", "check-layers.json"),
    path.join(projectRoot, "devflow", "check-layers.json")
  ];
  for (const configPath of candidates) {
    if (!fs.existsSync(configPath)) continue;
    try {
      const parsed: unknown = JSON.parse(fs.readFileSync(configPath, "utf8"));
      return isRecord(parsed) ? (parsed as CustomCheckLayersConfig) : null;
    } catch {
      return null;
    }
  }
  return null;
}

function readComposerJson(projectRoot: string): ComposerJsonShape | null {
  const composerPath = path.join(projectRoot, "composer.json");
  if (!fs.existsSync(composerPath)) return null;
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(composerPath, "utf8"));
    return isRecord(parsed) ? (parsed as ComposerJsonShape) : null;
  } catch {
    return null;
  }
}

function hasComposerPackageDeclared(
  composer: ComposerJsonShape | null,
  projectRoot: string,
  name: string
): boolean {
  if (composer?.require?.[name] || composer?.["require-dev"]?.[name]) {
    return true;
  }
  return fs.existsSync(path.join(projectRoot, "vendor", ...name.split("/")));
}

function hasComposerPackageInstalled(projectRoot: string, name: string): boolean {
  return fs.existsSync(path.join(projectRoot, "vendor", ...name.split("/")));
}

function hasNpmPackage(pkg: PackageJsonShape | null, projectRoot: string, name: string): boolean {
  if (pkg?.dependencies?.[name] || pkg?.devDependencies?.[name]) {
    return true;
  }
  return fs.existsSync(path.join(projectRoot, "node_modules", ...name.split("/")));
}

function binaryExistsOnPath(binary: string, projectRoot: string): boolean {
  const localNpmBin = path.join(
    projectRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? `${binary}.cmd` : binary
  );
  if (fs.existsSync(localNpmBin)) {
    return true;
  }

  const localVendorBin = path.join(
    projectRoot,
    "vendor",
    "bin",
    process.platform === "win32" ? `${binary}.bat` : binary
  );
  if (fs.existsSync(localVendorBin) || fs.existsSync(path.join(projectRoot, "vendor", "bin", binary))) {
    return true;
  }

  const pathValue = process.env.PATH ?? process.env.Path ?? "";
  const dirs = pathValue.split(path.delimiter).filter(Boolean);
  const extensions =
    process.platform === "win32" ? [".exe", ".com", ".cmd", ".bat", ""] : [""];

  for (const dir of dirs) {
    for (const ext of extensions) {
      const candidate = path.join(dir, binary.endsWith(ext) ? binary : `${binary}${ext}`);
      if (fs.existsSync(candidate)) {
        return true;
      }
    }
  }
  return false;
}

function hasPythonDeclaration(projectRoot: string, moduleName: string): boolean {
  const pattern = new RegExp(`\\b${moduleName}\\b`, "i");
  for (const manifest of ["pyproject.toml", "requirements.txt", "requirements-dev.txt"]) {
    const full = path.join(projectRoot, manifest);
    if (fs.existsSync(full) && pattern.test(fs.readFileSync(full, "utf8"))) {
      return true;
    }
  }
  return false;
}

export const defaultAvailabilityChecker: AvailabilityChecker = (step, projectRoot) => {
  const pkg = readPackageJson(projectRoot);
  if (step.requiredNpmDep && hasNpmPackage(pkg, projectRoot, step.requiredNpmDep)) {
    return true;
  }
  if (step.requiredComposerDep && hasComposerPackageInstalled(projectRoot, step.requiredComposerDep)) {
    return true;
  }
  if (step.requiredBinary && binaryExistsOnPath(step.requiredBinary, projectRoot)) {
    return true;
  }
  if (step.requiredPythonModule && hasPythonDeclaration(projectRoot, step.requiredPythonModule)) {
    return binaryExistsOnPath(step.requiredPythonModule, projectRoot);
  }
  return (
    !step.requiredBinary &&
    !step.requiredNpmDep &&
    !step.requiredPythonModule &&
    !step.requiredComposerDep
  );
};

export const defaultCommandExecutor: CommandExecutor = (command, cwd) => {
  const result = spawnSync(command, {
    cwd,
    shell: true,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024
  });

  return {
    status: result.status,
    stdout: String(result.stdout ?? ""),
    stderr: String(result.stderr ?? ""),
    error: result.error ? result.error.message : undefined
  };
};

/**
 * Collect changed files from working tree and current branch diff, falling back gracefully outside git.
 */
export function detectChangedFiles(projectRoot: string): string[] {
  const gitCheck = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], {
    cwd: projectRoot,
    encoding: "utf8"
  });
  if (gitCheck.status !== 0) {
    return [];
  }

  const files = new Set<string>();
  const statusOut = spawnSync("git", ["status", "--porcelain"], {
    cwd: projectRoot,
    encoding: "utf8"
  });
  if (statusOut.status === 0 && statusOut.stdout) {
    for (const line of statusOut.stdout.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const entry = line.slice(3).trim();
      const target = entry.includes(" -> ") ? entry.split(" -> ").pop() ?? entry : entry;
      if (target) files.add(normalizeRepoPath(target));
    }
  }

  const diffOut = spawnSync("git", ["diff", "--name-only", "HEAD"], {
    cwd: projectRoot,
    encoding: "utf8"
  });
  if (diffOut.status === 0 && diffOut.stdout) {
    for (const line of diffOut.stdout.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed) files.add(normalizeRepoPath(trimmed));
    }
  }

  return Array.from(files).sort();
}

/**
 * Detect active languages from changed files first, then project manifests when no source files changed.
 */
export function detectLanguages(
  projectRoot: string,
  changedFiles: readonly string[]
): LanguageId[] {
  const found = new Set<LanguageId>();

  for (const file of changedFiles) {
    const lower = file.toLowerCase();
    for (const langId of ALL_LANGUAGE_IDS) {
      if (LANGUAGE_PROFILES[langId].extensions.some((ext) => lower.endsWith(ext))) {
        found.add(langId);
      }
    }
  }

  if (found.size === 0) {
    for (const langId of ALL_LANGUAGE_IDS) {
      if (
        LANGUAGE_PROFILES[langId].manifests.some((manifest) =>
          fs.existsSync(path.join(projectRoot, manifest))
        )
      ) {
        found.add(langId);
      }
    }
  }

  // TypeScript projects often declare package.json alongside tsconfig.json; avoid running duplicate JS fallback when TS is active unless .js files changed.
  const hasExplicitJsChange = changedFiles.some((f) =>
    LANGUAGE_PROFILES.javascript.extensions.some((ext) => f.toLowerCase().endsWith(ext))
  );
  if (found.has("typescript") && found.has("javascript") && !hasExplicitJsChange) {
    found.delete("javascript");
  }

  return ALL_LANGUAGE_IDS.filter((id) => found.has(id));
}

function hasRealNpmTestScript(pkg: PackageJsonShape | null): boolean {
  const testScript = pkg?.scripts?.test;
  if (!testScript) return false;
  return !/no test specified/i.test(testScript);
}

function resolveDefaultChecksForLanguage(
  lang: LanguageId,
  projectRoot: string,
  changedFiles: readonly string[],
  pkg: PackageJsonShape | null
): { layer1: CheckStepSpec[]; layer2: CheckStepSpec[] } {
  const layer1: CheckStepSpec[] = [];
  const layer2: CheckStepSpec[] = [];

  switch (lang) {
    case "typescript": {
      if (pkg?.scripts?.typecheck) {
        layer1.push({
          layer: 1,
          language: "typescript",
          label: "TypeScript typecheck",
          command: "npm run typecheck",
          requiredLib: "typescript",
          requiredNpmDep: "typescript",
          requiredBinary: "tsc",
          installHint: "npm install -D typescript",
          source: "package_json"
        });
      } else if (pkg?.scripts?.lint) {
        layer1.push({
          layer: 1,
          language: "typescript",
          label: "TypeScript lint",
          command: "npm run lint",
          requiredLib: hasNpmPackage(pkg, projectRoot, "@biomejs/biome")
            ? "@biomejs/biome"
            : "eslint",
          requiredNpmDep: hasNpmPackage(pkg, projectRoot, "@biomejs/biome")
            ? "@biomejs/biome"
            : "eslint",
          installHint: "npm install -D eslint (or @biomejs/biome)",
          source: "package_json"
        });
      } else {
        layer1.push({
          layer: 1,
          language: "typescript",
          label: "TypeScript tsc --noEmit",
          command: "npx --no-install tsc --noEmit",
          requiredLib: "typescript",
          requiredNpmDep: "typescript",
          requiredBinary: "tsc",
          installHint: "npm install -D typescript",
          source: "default"
        });
      }

      if (pkg?.scripts?.lint && pkg?.scripts?.typecheck) {
        layer1.push({
          layer: 1,
          language: "typescript",
          label: "TypeScript lint",
          command: "npm run lint",
          requiredLib: hasNpmPackage(pkg, projectRoot, "@biomejs/biome")
            ? "@biomejs/biome"
            : "eslint",
          requiredNpmDep: hasNpmPackage(pkg, projectRoot, "@biomejs/biome")
            ? "@biomejs/biome"
            : "eslint",
          installHint: "npm install -D eslint (or @biomejs/biome)",
          source: "package_json"
        });
      }

      if (hasRealNpmTestScript(pkg)) {
        const runnerLib = hasNpmPackage(pkg, projectRoot, "vitest")
          ? "vitest"
          : hasNpmPackage(pkg, projectRoot, "jest")
            ? "jest"
            : hasNpmPackage(pkg, projectRoot, "tsx")
              ? "tsx"
              : undefined;
        layer2.push({
          layer: 2,
          language: "typescript",
          label: "TypeScript test suite",
          command: "npm test",
          requiredLib: runnerLib ?? "node:test",
          requiredNpmDep: runnerLib,
          requiredBinary: runnerLib ? undefined : "node",
          installHint: runnerLib ? `npm install -D ${runnerLib}` : "Ensure Node.js >= 18.17",
          source: "package_json"
        });
      } else if (hasNpmPackage(pkg, projectRoot, "vitest")) {
        layer2.push({
          layer: 2,
          language: "typescript",
          label: "Vitest suite",
          command: "npx --no-install vitest run",
          requiredLib: "vitest",
          requiredNpmDep: "vitest",
          installHint: "npm install -D vitest",
          source: "default"
        });
      } else {
        layer2.push({
          layer: 2,
          language: "typescript",
          label: "Node test runner (tsx)",
          command: "npx --no-install tsx --test",
          requiredLib: "tsx",
          requiredNpmDep: "tsx",
          requiredBinary: "tsx",
          installHint: "npm install -D tsx (or add scripts.test in package.json)",
          source: "default"
        });
      }
      break;
    }

    case "javascript": {
      if (pkg?.scripts?.lint) {
        const lintLib = hasNpmPackage(pkg, projectRoot, "@biomejs/biome")
          ? "@biomejs/biome"
          : "eslint";
        layer1.push({
          layer: 1,
          language: "javascript",
          label: "JavaScript lint",
          command: "npm run lint",
          requiredLib: lintLib,
          requiredNpmDep: lintLib,
          installHint: `npm install -D ${lintLib}`,
          source: "package_json"
        });
      } else if (hasNpmPackage(pkg, projectRoot, "eslint")) {
        layer1.push({
          layer: 1,
          language: "javascript",
          label: "ESLint check",
          command: "npx --no-install eslint .",
          requiredLib: "eslint",
          requiredNpmDep: "eslint",
          installHint: "npm install -D eslint",
          source: "default"
        });
      } else {
        const jsTargets = changedFiles
          .filter((f) => LANGUAGE_PROFILES.javascript.extensions.some((ext) => f.toLowerCase().endsWith(ext)))
          .filter((f) => fs.existsSync(path.join(projectRoot, f)));
        const checkCmd =
          jsTargets.length > 0
            ? jsTargets.map((f) => `node --check "${f}"`).join(" && ")
            : "node --version";
        layer1.push({
          layer: 1,
          language: "javascript",
          label: "Node syntax check",
          command: checkCmd,
          requiredLib: "node",
          requiredBinary: "node",
          installHint: "Install Node.js >= 18.17",
          source: "default"
        });
      }

      if (hasRealNpmTestScript(pkg)) {
        layer2.push({
          layer: 2,
          language: "javascript",
          label: "JavaScript test suite",
          command: "npm test",
          requiredLib: "node:test",
          requiredBinary: "node",
          installHint: "Ensure Node.js >= 18.17",
          source: "package_json"
        });
      } else {
        layer2.push({
          layer: 2,
          language: "javascript",
          label: "Node built-in test runner",
          command: "node --test",
          requiredLib: "node:test",
          requiredBinary: "node",
          installHint: "Add test files or scripts.test in package.json",
          source: "default"
        });
      }
      break;
    }

    case "python": {
      const hasMypy = hasPythonDeclaration(projectRoot, "mypy");
      layer1.push({
        layer: 1,
        language: "python",
        label: hasMypy ? "Python mypy check" : "Python ruff lint",
        command: hasMypy ? "mypy ." : "ruff check .",
        requiredLib: hasMypy ? "mypy" : "ruff",
        requiredBinary: hasMypy ? "mypy" : "ruff",
        requiredPythonModule: hasMypy ? "mypy" : "ruff",
        installHint: hasMypy ? "pip install mypy" : "pip install ruff",
        source: "default"
      });
      layer2.push({
        layer: 2,
        language: "python",
        label: "Python pytest suite",
        command: "pytest",
        requiredLib: "pytest",
        requiredBinary: "pytest",
        requiredPythonModule: "pytest",
        installHint: "pip install pytest",
        source: "default"
      });
      break;
    }

    case "php": {
      const composer = readComposerJson(projectRoot);
      const phpTargets = changedFiles
        .filter((f) => LANGUAGE_PROFILES.php.extensions.some((ext) => f.toLowerCase().endsWith(ext)))
        .filter((f) => fs.existsSync(path.join(projectRoot, f)));
      const lintCmd =
        phpTargets.length > 0
          ? phpTargets.map((f) => `php -l "${f}"`).join(" && ")
          : "php -v";
      layer1.push({
        layer: 1,
        language: "php",
        label: "PHP syntax lint (php -l)",
        command: lintCmd,
        requiredLib: "php",
        requiredBinary: "php",
        installHint: "Install PHP CLI (>= 8.1)",
        source: "default"
      });

      const hasPhpstan =
        hasComposerPackageDeclared(composer, projectRoot, "phpstan/phpstan") ||
        hasComposerPackageDeclared(composer, projectRoot, "larastan/larastan") ||
        fs.existsSync(path.join(projectRoot, "phpstan.neon")) ||
        fs.existsSync(path.join(projectRoot, "phpstan.neon.dist"));
      const hasPint = hasComposerPackageDeclared(composer, projectRoot, "laravel/pint");
      const hasPhpcs = hasComposerPackageDeclared(composer, projectRoot, "squizlabs/php_codesniffer");

      if (hasPhpstan) {
        layer1.push({
          layer: 1,
          language: "php",
          label: "PHPStan static analysis",
          command: `${path.join("vendor", "bin", "phpstan")} analyse`,
          requiredLib: "phpstan/phpstan",
          requiredComposerDep: "phpstan/phpstan",
          requiredBinary: "phpstan",
          installHint: "composer require --dev phpstan/phpstan",
          source: "composer_json"
        });
      } else if (hasPint) {
        layer1.push({
          layer: 1,
          language: "php",
          label: "Laravel Pint style check",
          command: `${path.join("vendor", "bin", "pint")} --test`,
          requiredLib: "laravel/pint",
          requiredComposerDep: "laravel/pint",
          requiredBinary: "pint",
          installHint: "composer require --dev laravel/pint",
          source: "composer_json"
        });
      } else if (hasPhpcs) {
        layer1.push({
          layer: 1,
          language: "php",
          label: "PHP_CodeSniffer lint",
          command: path.join("vendor", "bin", "phpcs"),
          requiredLib: "squizlabs/php_codesniffer",
          requiredComposerDep: "squizlabs/php_codesniffer",
          requiredBinary: "phpcs",
          installHint: "composer require --dev squizlabs/php_codesniffer",
          source: "composer_json"
        });
      }

      const hasPest = hasComposerPackageDeclared(composer, projectRoot, "pestphp/pest");
      if (composer?.scripts?.test) {
        layer2.push({
          layer: 2,
          language: "php",
          label: "Composer test suite",
          command: "composer test",
          requiredLib: hasPest ? "pestphp/pest" : "phpunit/phpunit",
          requiredComposerDep: hasPest ? "pestphp/pest" : "phpunit/phpunit",
          requiredBinary: hasPest ? "pest" : "phpunit",
          installHint: hasPest
            ? "composer require --dev pestphp/pest"
            : "composer require --dev phpunit/phpunit",
          source: "composer_json"
        });
      } else if (hasPest) {
        layer2.push({
          layer: 2,
          language: "php",
          label: "Pest test suite",
          command: path.join("vendor", "bin", "pest"),
          requiredLib: "pestphp/pest",
          requiredComposerDep: "pestphp/pest",
          requiredBinary: "pest",
          installHint: "composer require --dev pestphp/pest",
          source: "composer_json"
        });
      } else {
        layer2.push({
          layer: 2,
          language: "php",
          label: "PHPUnit test suite",
          command: path.join("vendor", "bin", "phpunit"),
          requiredLib: "phpunit/phpunit",
          requiredComposerDep: "phpunit/phpunit",
          requiredBinary: "phpunit",
          installHint: "composer require --dev phpunit/phpunit",
          source: "default"
        });
      }
      break;
    }

    case "rust": {
      layer1.push({
        layer: 1,
        language: "rust",
        label: "Rust clippy lint",
        command: "cargo clippy --all-targets -- -D warnings",
        requiredLib: "clippy",
        requiredBinary: "cargo",
        installHint: "rustup component add clippy",
        source: "default"
      });
      layer2.push({
        layer: 2,
        language: "rust",
        label: "Rust cargo test",
        command: "cargo test",
        requiredLib: "cargo",
        requiredBinary: "cargo",
        installHint: "Install Rust toolchain via rustup",
        source: "default"
      });
      break;
    }

    case "go": {
      layer1.push({
        layer: 1,
        language: "go",
        label: "Go vet static check",
        command: "go vet ./...",
        requiredLib: "go",
        requiredBinary: "go",
        installHint: "Install Go toolchain",
        source: "default"
      });
      layer2.push({
        layer: 2,
        language: "go",
        label: "Go test suite",
        command: "go test ./...",
        requiredLib: "go",
        requiredBinary: "go",
        installHint: "Install Go toolchain",
        source: "default"
      });
      break;
    }

    case "tla":
    case "lean":
      // Syntax/model/proof checks for TLA+ and Lean execute in Layer 3 (or when triggered below).
      break;
  }

  return { layer1, layer2 };
}

function discoverFormalGuards(projectRoot: string): FormalGuardSpec[] {
  const guards: FormalGuardSpec[] = [];
  const custom = readCustomCheckLayersConfig(projectRoot);
  if (custom?.formalGuards) {
    for (const guard of custom.formalGuards) {
      guards.push({
        tool: guard.tool,
        specPath: normalizeRepoPath(guard.specPath),
        guardedPaths: guard.guardedPaths.map(normalizeRepoPath),
        command: guard.command,
        requiredLib: guard.requiredLib,
        requiredBinary: guard.requiredBinary ?? (guard.tool === "tla" ? "tlc" : "lake"),
        installHint:
          guard.installHint ??
          (guard.tool === "tla"
            ? "Install Java + tla2tools.jar (tlc on PATH)"
            : "Install elan / Lean 4 toolchain (lake on PATH)")
      });
    }
  }

  // Also discover top-level or formal/ .tla + .cfg files or Lean lakefiles automatically.
  const searchDirs = [projectRoot, path.join(projectRoot, "formal"), path.join(projectRoot, "specs")];
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (entry.name.endsWith(".tla")) {
        const relSpec = normalizeRepoPath(path.relative(projectRoot, path.join(dir, entry.name)));
        if (guards.some((g) => g.specPath === relSpec)) continue;
        const cfgName = entry.name.replace(/\.tla$/, ".cfg");
        const cfgPath = path.join(dir, cfgName);
        const relCfg = normalizeRepoPath(path.relative(projectRoot, cfgPath));
        const command = fs.existsSync(cfgPath)
          ? `tlc -config "${relCfg}" "${relSpec}"`
          : `tlc "${relSpec}"`;
        guards.push({
          tool: "tla",
          specPath: relSpec,
          guardedPaths: fs.existsSync(cfgPath) ? [relSpec, relCfg] : [relSpec],
          command,
          requiredLib: "tla2tools.jar (tlc)",
          requiredBinary: "tlc",
          installHint: "Install Java + tla2tools.jar (tlc on PATH)"
        });
      } else if (entry.name === "lakefile.lean" || entry.name === "lakefile.toml") {
        const relSpec = normalizeRepoPath(path.relative(projectRoot, path.join(dir, entry.name)));
        if (guards.some((g) => g.specPath === relSpec)) continue;
        guards.push({
          tool: "lean",
          specPath: relSpec,
          guardedPaths: [relSpec, "*.lean"],
          command: "lake build",
          requiredLib: "lean4 (lake)",
          requiredBinary: "lake",
          installHint: "Install elan / Lean 4 toolchain (lake on PATH)"
        });
      }
    }
  }

  return guards;
}

function pathMatchesPattern(changedFile: string, guardPattern: string): boolean {
  if (guardPattern === "*.lean") {
    return changedFile.toLowerCase().endsWith(".lean");
  }
  if (guardPattern.endsWith("/")) {
    return changedFile.startsWith(guardPattern);
  }
  return changedFile === guardPattern || changedFile.startsWith(`${guardPattern}/`);
}

function matchesFormalGuard(
  guard: FormalGuardSpec,
  changedFiles: readonly string[]
): boolean {
  if (changedFiles.length === 0) {
    return false;
  }
  return changedFiles.some(
    (file) =>
      file === guard.specPath ||
      guard.guardedPaths.some((pattern) => pathMatchesPattern(file, pattern))
  );
}

/**
 * Build a deterministic 3-layer verification plan for a project from changed files and manifests.
 */
export function planCheckPipeline(
  projectRoot: string,
  options: Pick<CheckPipelineOptions, "files"> = {}
): CheckPipelinePlan {
  const resolvedRoot = path.resolve(projectRoot);
  const changedFiles = options.files
    ? options.files.map(normalizeRepoPath)
    : detectChangedFiles(resolvedRoot);
  const detectedLanguages = detectLanguages(resolvedRoot, changedFiles);
  const pkg = readPackageJson(resolvedRoot);
  const custom = readCustomCheckLayersConfig(resolvedRoot);

  const layer1: CheckStepSpec[] = [];
  const layer2: CheckStepSpec[] = [];

  for (const lang of detectedLanguages) {
    const customLang = custom?.languages?.[lang];
    if (customLang) {
      for (const item of customLang.layer1 ?? []) {
        layer1.push({
          layer: 1,
          language: lang,
          label: item.label ?? `${lang} lint/typecheck`,
          command: item.command,
          requiredLib: item.requiredLib,
          requiredBinary: item.requiredBinary,
          requiredNpmDep: item.requiredNpmDep,
          installHint: item.installHint ?? `Install ${item.requiredLib}`,
          source: "override"
        });
      }
      for (const item of customLang.layer2 ?? []) {
        layer2.push({
          layer: 2,
          language: lang,
          label: item.label ?? `${lang} tests`,
          command: item.command,
          requiredLib: item.requiredLib,
          requiredBinary: item.requiredBinary,
          requiredNpmDep: item.requiredNpmDep,
          installHint: item.installHint ?? `Install ${item.requiredLib}`,
          source: "override"
        });
      }
      if ((customLang.layer1?.length ?? 0) > 0 || (customLang.layer2?.length ?? 0) > 0) {
        continue;
      }
    }

    const defaults = resolveDefaultChecksForLanguage(lang, resolvedRoot, changedFiles, pkg);
    layer1.push(...defaults.layer1);
    layer2.push(...defaults.layer2);
  }

  const discoveredGuards = discoverFormalGuards(resolvedRoot);
  const formalGuardsMatched = discoveredGuards.filter((guard) =>
    matchesFormalGuard(guard, changedFiles)
  );

  // If a .lean file changed without a lakefile, still enforce standalone `lean <file>` check.
  const leanFilesChanged = changedFiles.filter((f) => f.toLowerCase().endsWith(".lean"));
  const hasLeanGuard = formalGuardsMatched.some((g) => g.tool === "lean");
  const layer3: CheckStepSpec[] = formalGuardsMatched.map((guard) => ({
    layer: 3,
    language: guard.tool,
    label: `${guard.tool.toUpperCase()} formal verification (${guard.specPath})`,
    command: guard.command,
    requiredLib: guard.requiredLib,
    requiredBinary: guard.requiredBinary,
    installHint: guard.installHint,
    source: "default"
  }));

  if (!hasLeanGuard && leanFilesChanged.length > 0) {
    layer3.push({
      layer: 3,
      language: "lean",
      label: `LEAN formal proof check (${leanFilesChanged.join(", ")})`,
      command: leanFilesChanged.map((f) => `lean "${f}"`).join(" && "),
      requiredLib: "lean4 (lean)",
      requiredBinary: "lean",
      installHint: "Install elan / Lean 4 toolchain (lean on PATH)",
      source: "default"
    });
  }

  return {
    projectRoot: resolvedRoot,
    changedFiles,
    detectedLanguages,
    layer1,
    layer2,
    layer3
  ,
    formalGuardsMatched
  };
}

/**
 * Execute the 3-layer check pipeline sequentially with strict fail-fast semantics.
 * Never advances to Layer N+1 if any step in Layer N fails or lacks its required library/tool.
 */
export function runCheckPipeline(
  projectRoot: string,
  options: CheckPipelineOptions = {}
): CheckPipelineResult {
  const plan = planCheckPipeline(projectRoot, { files: options.files });

  if (options.planOnly) {
    return {
      passed: true,
      exitCode: 0,
      stoppedAtLayer: null,
      failureKind: null,
      plan,
      outcomes: [],
      summary: `Planned 3-layer check for languages: ${plan.detectedLanguages.join(", ") || "none"}`
    };
  }

  const executor = options.executor ?? defaultCommandExecutor;
  const checkAvailability = options.checkAvailability ?? defaultAvailabilityChecker;
  const outcomes: CheckStepOutcome[] = [];

  const layers: Array<{ layer: GateLayer; steps: readonly CheckStepSpec[] }> = [
    { layer: 1, steps: plan.layer1 },
    { layer: 2, steps: plan.layer2 },
    { layer: 3, steps: plan.layer3 }
  ];

  for (const { layer, steps } of layers) {
    for (const step of steps) {
      const available = checkAvailability(step, plan.projectRoot);
      if (!available) {
        outcomes.push({
          layer,
          language: step.language,
          label: step.label,
          command: step.command,
          requiredLib: step.requiredLib,
          status: "missing_lib",
          exitCode: 1,
          output: `Missing required library/tool "${step.requiredLib}" for ${step.label}.`,
          installHint: step.installHint
        });
        return {
          passed: false,
          exitCode: 1,
          stoppedAtLayer: layer,
          failureKind: "missing_lib",
          plan,
          outcomes,
          summary: `Blocked at Layer ${layer} (${step.language}): missing required library "${step.requiredLib}". ${step.installHint}`
        };
      }

      const execResult = executor(step.command, plan.projectRoot);
      const combinedOutput = [execResult.stdout, execResult.stderr, execResult.error]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (execResult.status !== 0) {
        outcomes.push({
          layer,
          language: step.language,
          label: step.label,
          command: step.command,
          requiredLib: step.requiredLib,
          status: "fail",
          exitCode: execResult.status,
          output: combinedOutput.slice(0, 2000),
          installHint: step.installHint
        });
        return {
          passed: false,
          exitCode: 1,
          stoppedAtLayer: layer,
          failureKind: "command_failed",
          plan,
          outcomes,
          summary: `Failed at Layer ${layer} (${step.label}): ${step.command} exited with ${execResult.status ?? "null"}`
        };
      }

      outcomes.push({
        layer,
        language: step.language,
        label: step.label,
        command: step.command,
        requiredLib: step.requiredLib,
        status: "pass",
        exitCode: 0,
        output: combinedOutput.slice(0, 1000)
      });
    }
  }

  return {
    passed: true,
    exitCode: 0,
    stoppedAtLayer: null,
    failureKind: null,
    plan,
    outcomes,
    summary: `All active check layers passed (languages: ${plan.detectedLanguages.join(", ") || "none"}, steps: ${outcomes.length}).`
  };
}

export function formatCheckPipelineReport(result: CheckPipelineResult): string {
  const lines: string[] = [];
  lines.push(
    `Languages: ${result.plan.detectedLanguages.length > 0 ? result.plan.detectedLanguages.join(", ") : "none"}`
  );
  lines.push(
    `Changed files: ${result.plan.changedFiles.length > 0 ? result.plan.changedFiles.join(", ") : "(manifest fallback)"}`
  );

  for (const outcome of result.outcomes) {
    const tag =
      outcome.status === "pass"
        ? "PASS"
        : outcome.status === "missing_lib"
          ? "MISSING_LIB"
          : "FAIL";
    lines.push(
      `  [Layer ${outcome.layer} | ${tag}] ${outcome.label} (lib: ${outcome.requiredLib}) -> ${outcome.command}`
    );
    if (outcome.status !== "pass" && outcome.output) {
      lines.push(`    ${outcome.output}`);
    }
    if (outcome.status === "missing_lib" && outcome.installHint) {
      lines.push(`    Install: ${outcome.installHint}`);
    }
  }

  if (result.plan.layer3.length === 0) {
    lines.push("  [Layer 3 | SKIP] TLA+/Lean formal check not triggered (no guarded files changed).");
  }

  lines.push(result.summary);
  return lines.join("\n");
}
