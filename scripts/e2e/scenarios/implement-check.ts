import { execFileSync } from "node:child_process";
import path from "node:path";
import type { Runner } from "../harness.js";

const FIX_SPEC = `# Current Feature

**Title:** Greeting punctuation
**Type:** Fix

## The problem

\`src/greeting.js\` prints \`Hello world\` without comma or exclamation mark.

## The fix

Update \`src/greeting.js\` so \`node src/greeting.js\` prints \`Hello, world!\`. Make no other product changes.

## Build steps

- [ ] 1. Update \`src/greeting.js\` to print \`Hello, world!\`. Done when
  \`node src/greeting.js\` prints exactly \`Hello, world!\`.

## Verify

Run \`node src/greeting.js\` and confirm stdout equals \`Hello, world!\`.
`;

async function run(t: Runner) {
  t.phase("setup");
  t.installDevFlow();

  const agents = t.read("AGENTS.md") ?? "";
  const headingIndex = agents.indexOf("## Verification & Commands");
  if (headingIndex !== -1) {
    t.write(
      "AGENTS.md",
      agents.slice(0, headingIndex) +
        "## Verification & Commands\n\n- Build check: `node --check src/greeting.js`\n\nNo external test runner is configured.\n"
    );
  }

  t.write(
    "package.json",
    `${JSON.stringify(
      {
        name: "implement-check-fixture",
        private: true,
        type: "module",
        scripts: {
          build: "node --check src/greeting.js"
        }
      },
      null,
      2
    )}\n`
  );
  t.write("src/greeting.js", 'console.log("Hello world");\n');
  t.write("devflow/context/001-greeting-punctuation/spec.md", FIX_SPEC);
  t.gitInit();
  t.git("add", "-A");
  t.git("commit", "-m", "chore: scaffold implement-check fixture");

  t.phase("implement updates source and spec without running check or complete");
  const implementResult = t.agent(
    "Run /implement for the active fix in devflow/context/001-greeting-punctuation/spec.md. Complete build step 1, mark it [x] in spec.md, and stop before /check or /complete. Do not commit."
  );

  const implementedSource = t.read("src/greeting.js") ?? "";
  const updatedSpec = t.read("devflow/context/001-greeting-punctuation/spec.md") ?? "";
  const actualOutput = execFileSync(
    process.execPath,
    [path.join(t.workspace, "src/greeting.js")],
    { encoding: "utf8" }
  ).trim();

  t.check("implement invocation succeeded", implementResult.status === 0);
  t.check("src/greeting.js prints Hello, world!", actualOutput === "Hello, world!");
  t.check("spec step 1 was marked done", /- \[x\] 1\./i.test(updatedSpec));

  t.phase("check verifies behavior without modifying implemented source");
  const checkResult = t.agent(
    "Run /check for the active fix and report observed evidence for every done-when criterion. Do not edit source files or commit."
  );

  t.check("check invocation succeeded", checkResult.status === 0);
  t.check("src/greeting.js stayed unchanged during /check", t.read("src/greeting.js") === implementedSource);
  t.check("check report includes observed output", checkResult.resultText.includes("Hello, world!"));
  t.check("check report gives pass or fail verdict", /\b(pass|passed|fail|failed)\b/i.test(checkResult.resultText));
}

export default {
  name: "implement-check",
  description: "Minimal /implement -> /check handoff validates multi-adapter Runner interface",
  run
};
