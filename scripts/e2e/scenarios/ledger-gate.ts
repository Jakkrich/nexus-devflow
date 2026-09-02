import fs from "node:fs";
import path from "node:path";
import type { Runner } from "../harness.js";

const FIX_SPEC = `# Current Feature

**Title:** Correct greeting punctuation
**Type:** Fix

## The problem

\`src/greeting.js\` returns "Hello world" without punctuation. The greeting
should read "Hello, world!".

## The fix

Return the punctuated greeting from \`greet()\`. Nothing else changes.

## Build steps

- [x] 1. Update \`src/greeting.js\` to return the punctuated greeting. Done when
  \`node -e "console.log(require('./src/greeting').greet())"\` prints
  "Hello, world!".

## Verify

Run \`node -e "console.log(require('./src/greeting').greet())"\` and confirm it
prints "Hello, world!".
`;

const OPEN_FINDING = `# Findings

### F-01 [P1] open - greet() output is not covered by any verification

**File:** src/greeting.js:2
**Found:** 2026-07-22 by /audit (scope: current)
**Why it matters:** The fix changes user-visible output with no recorded proof
that the new string is what ships.
**Suggested fix:** Capture the command output as evidence before completing.
**Resolution:**
`;

async function run(t: Runner) {
  t.phase("setup");
  t.installDevFlow();

  const agents = t.read("AGENTS.md") ?? "";
  t.write(
    "AGENTS.md",
    agents.slice(0, agents.indexOf("## Verification & Commands")) +
      "## Verification & Commands\n\n- Build: `npm run build`\n- Lint: `npm run lint`\n\nTesting is opt-in. This project declares no test command.\n"
  );
  t.write(
    "package.json",
    JSON.stringify(
      {
        name: "fixture-app",
        private: true,
        version: "0.1.0",
        scripts: {
          build: 'node -e "console.log(\'build ok\')"',
          lint: 'node -e "console.log(\'lint ok\')"'
        }
      },
      null,
      2
    ) + "\n"
  );
  t.write("src/greeting.js", 'exports.greet = () => "Hello world";\n');
  t.gitInit();
  t.git("add", "-A");
  t.git("commit", "-m", "chore: fixture app with devflow");
  const mainBefore = t.git("rev-parse", "main");

  t.git("checkout", "-b", "fix/greeting-punctuation");
  t.write("src/greeting.js", 'exports.greet = () => "Hello, world!";\n');
  t.write("devflow/context/001-fix-greeting/spec.md", FIX_SPEC);
  t.write("devflow/context/001-fix-greeting/findings.md", OPEN_FINDING);
  t.git("add", "-A");
  t.git("commit", "-m", "fix: checkpoint greeting punctuation");

  t.phase("blocked merge: /complete must refuse while F-01 [P1] is open");
  const blocked = t.agent(
    "Run /complete for the current fix. If anything blocks completion, stop and explain the blocker; do not work around it."
  );
  t.check("agent invocation succeeded", blocked.status === 0);
  t.check("main is untouched", t.git("rev-parse", "main") === mainBefore);
  t.check("fix branch still exists", t.git("branch", "--list", "fix/greeting-punctuation") !== "");
}

export default {
  name: "ledger-gate",
  description: "The findings ledger blocks, releases, and lazy-creates correctly",
  run
};
