import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseArgs } from "../bin/create-nexus-devflow.js";
import {
  defaultAvailabilityChecker,
  detectLanguages,
  planCheckPipeline,
  runCheckPipeline,
  type CheckPipelineResult
} from "../lib/check-pipeline.js";
import { runTooling, ToolingError } from "../lib/tooling/index.js";

test("detectLanguages classifies TypeScript, Python, Rust, Go, TLA+, and Lean files", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-lang-detect-"));
  try {
    assert.deepEqual(detectLanguages(dir, ["src/app.ts"]), ["typescript"]);
    assert.deepEqual(detectLanguages(dir, ["app/main.py", "pkg/mod.go"]), ["python", "go"]);
    assert.deepEqual(detectLanguages(dir, ["app/Http/UserController.php"]), ["php"]);
    assert.deepEqual(detectLanguages(dir, ["src/lib.rs", "formal/Lock.tla", "Proof.lean"]), [
      "rust",
      "tla",
      "lean"
    ]);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("runCheckPipeline fails fast at Layer 1 on missing requiredLib without running Layer 2 or 3", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-missing-lib-"));
  try {
    await fs.writeFile(path.join(dir, "app.py"), "print('hi')\n");
    const executedCommands: string[] = [];

    const result = runCheckPipeline(dir, {
      files: ["app.py"],
      checkAvailability: () => false,
      executor: (cmd) => {
        executedCommands.push(cmd);
        return { status: 0, stdout: "", stderr: "" };
      }
    });

    assert.equal(result.passed, false);
    assert.equal(result.exitCode, 1);
    assert.equal(result.stoppedAtLayer, 1);
    assert.equal(result.failureKind, "missing_lib");
    assert.equal(result.outcomes.length, 1);
    assert.equal(result.outcomes[0].requiredLib, "ruff");
    assert.deepEqual(executedCommands, []);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("runCheckPipeline stops at Layer 1 and Layer 2 on command failure without running subsequent layers", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-fail-fast-"));
  try {
    await fs.mkdir(path.join(dir, "devflow"), { recursive: true });
    await fs.writeFile(
      path.join(dir, "devflow", "check-layers.json"),
      JSON.stringify({
        formalGuards: [
          {
            tool: "tla",
            specPath: "formal/State.tla",
            guardedPaths: ["src/state.ts"],
            command: "tlc -config formal/State.cfg formal/State.tla",
            requiredLib: "tla2tools.jar (tlc)"
          }
        ]
      })
    );

    const executedAtL1Fail: string[] = [];
    const l1FailResult = runCheckPipeline(dir, {
      files: ["src/state.ts"],
      checkAvailability: () => true,
      executor: (cmd) => {
        executedAtL1Fail.push(cmd);
        return { status: 1, stdout: "", stderr: "TS2322: type mismatch" };
      }
    });

    assert.equal(l1FailResult.passed, false);
    assert.equal(l1FailResult.stoppedAtLayer, 1);
    assert.equal(l1FailResult.failureKind, "command_failed");
    assert.equal(executedAtL1Fail.length, 1);

    const executedAtL2Fail: string[] = [];
    const l2FailResult = runCheckPipeline(dir, {
      files: ["src/state.ts"],
      checkAvailability: () => true,
      executor: (cmd) => {
        executedAtL2Fail.push(cmd);
        if (executedAtL2Fail.length === 1) {
          return { status: 0, stdout: "ok", stderr: "" };
        }
        return { status: 1, stdout: "", stderr: "1 test failed" };
      }
    });

    assert.equal(l2FailResult.passed, false);
    assert.equal(l2FailResult.stoppedAtLayer, 2);
    assert.equal(l2FailResult.failureKind, "command_failed");
    assert.equal(executedAtL2Fail.length, 2);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("Layer 3 TLA+/Lean formal check runs only when guarded paths change", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-layer3-"));
  try {
    await fs.mkdir(path.join(dir, "devflow"), { recursive: true });
    await fs.writeFile(
      path.join(dir, "devflow", "check-layers.json"),
      JSON.stringify({
        formalGuards: [
          {
            tool: "tla",
            specPath: "formal/State.tla",
            guardedPaths: ["src/state.ts"],
            command: "tlc -config formal/State.cfg formal/State.tla",
            requiredLib: "tla2tools.jar (tlc)"
          },
          {
            tool: "lean",
            specPath: "formal/Invariant.lean",
            guardedPaths: ["src/math.ts"],
            command: "lake build",
            requiredLib: "lean4 (lake)"
          }
        ]
      })
    );

    const unguardedPlan = planCheckPipeline(dir, { files: ["src/ui.ts"] });
    assert.equal(unguardedPlan.layer3.length, 0);

    const guardedPlan = planCheckPipeline(dir, { files: ["src/state.ts"] });
    assert.equal(guardedPlan.layer3.length, 1);
    assert.equal(guardedPlan.layer3[0].language, "tla");
    assert.equal(guardedPlan.layer3[0].requiredLib, "tla2tools.jar (tlc)");

    const executed: string[] = [];
    const fullPass = runCheckPipeline(dir, {
      files: ["src/state.ts", "src/math.ts"],
      checkAvailability: () => true,
      executor: (cmd) => {
        executed.push(cmd);
        return { status: 0, stdout: "ok", stderr: "" };
      }
    });

    assert.equal(fullPass.passed, true);
    assert.equal(fullPass.outcomes.filter((o) => o.layer === 3).length, 2);
    assert.equal(executed.length, 4);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("runTooling verify-layers executes real JS Layer 1 syntax + Layer 2 node:test in an isolated workspace", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-real-layers-"));
  try {
    await fs.mkdir(path.join(dir, "src"), { recursive: true });
    await fs.writeFile(
      path.join(dir, "src", "greet.mjs"),
      'export function greet(name) { return `Hello, ${name}!`; }\n'
    );
    await fs.writeFile(
      path.join(dir, "src", "greet.test.mjs"),
      'import assert from "node:assert/strict";\nimport test from "node:test";\nimport { greet } from "./greet.mjs";\ntest("greet", () => { assert.equal(greet("world"), "Hello, world!"); });\n'
    );

    const passResult = await runTooling("verify-layers", [
      "--dir",
      dir,
      "--files",
      "src/greet.mjs,src/greet.test.mjs"
    ]);
    assert.equal(passResult.ok, true);
    const data = passResult.data as CheckPipelineResult | undefined;
    assert.equal(data?.passed, true);
    assert.equal(data?.outcomes.length, 2);

    // Introduce a real Layer 1 syntax error and prove it stops before running Layer 2 tests.
    await fs.writeFile(path.join(dir, "src", "greet.mjs"), "export function greet( {\n");
    await assert.rejects(
      async () => {
        await runTooling("verify-layers", [
          "--dir",
          dir,
          "--files",
          "src/greet.mjs,src/greet.test.mjs",
          "--json"
        ]);
      },
      (err: unknown) => {
        assert.ok(err instanceof ToolingError);
        assert.equal(err.exitCode, 1);
        const parsed = JSON.parse(err.message) as { stoppedAtLayer: number; outcomes: unknown[] };
        assert.equal(parsed.stoppedAtLayer, 1);
        assert.equal(parsed.outcomes.length, 1);
        return true;
      }
    );
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("parseArgs supports verify-layers CLI command", () => {
  const options = parseArgs(["verify-layers", "./my-app", "--json", "--dry-run"]);
  assert.equal(options.command, "verify-layers");
  assert.equal(options.target, "./my-app");
  assert.equal(options.json, true);
  assert.equal(options.dryRun, true);
});

test("DevFlow repository formal guard triggers only when branch-context, run-state, or formal files change", () => {
  const repoRoot = path.resolve(import.meta.dirname, "../../..");

  const unguarded = planCheckPipeline(repoRoot, { files: ["README.md"] });
  assert.equal(unguarded.layer3.length, 0);

  const guarded = planCheckPipeline(repoRoot, {
    files: ["packages/create-nexus-devflow/lib/branch-context.ts"]
  });
  assert.equal(guarded.layer3.length, 1);
  assert.equal(guarded.layer3[0].command, "npx tsx formal/check-run-isolation.ts");
  assert.equal(guarded.layer3[0].requiredLib, "tsx");
});

test("PHP language profile plans php -l, phpstan/pint, and phpunit/pest with explicit Composer requiredLib", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-php-layers-"));
  try {
    await fs.mkdir(path.join(dir, "src"), { recursive: true });
    await fs.writeFile(path.join(dir, "src", "Invoice.php"), "<?php\n");
    await fs.writeFile(
      path.join(dir, "composer.json"),
      JSON.stringify({
        name: "acme/billing",
        "require-dev": {
          "phpstan/phpstan": "^1.11",
          "pestphp/pest": "^2.34"
        }
      })
    );

    const plan = planCheckPipeline(dir, { files: ["src/Invoice.php"] });
    assert.deepEqual(plan.detectedLanguages, ["php"]);
    assert.equal(plan.layer1.length, 2);
    assert.equal(plan.layer1[0].requiredLib, "php");
    assert.match(plan.layer1[0].command, /php -l "src\/Invoice\.php"/);
    assert.equal(plan.layer1[1].requiredLib, "phpstan/phpstan");
    assert.equal(plan.layer2.length, 1);
    assert.equal(plan.layer2[0].requiredLib, "pestphp/pest");

    // Real defaultAvailabilityChecker detects missing vendor/phpstan and passes once vendor/phpstan exists
    assert.equal(defaultAvailabilityChecker(plan.layer1[1], dir), false);
    assert.equal(defaultAvailabilityChecker(plan.layer2[0], dir), false);

    await fs.mkdir(path.join(dir, "vendor", "phpstan", "phpstan"), { recursive: true });
    assert.equal(defaultAvailabilityChecker(plan.layer1[1], dir), true);

    const blocked = runCheckPipeline(dir, {
      files: ["src/Invoice.php"],
      checkAvailability: (step, root) =>
        step.requiredBinary === "php" ? true : defaultAvailabilityChecker(step, root),
      executor: () => ({ status: 0, stdout: "No syntax errors", stderr: "" })
    });
    assert.equal(blocked.passed, false);
    assert.equal(blocked.stoppedAtLayer, 2);
    assert.equal(blocked.failureKind, "missing_lib");
    assert.equal(blocked.outcomes[2].requiredLib, "pestphp/pest");
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
