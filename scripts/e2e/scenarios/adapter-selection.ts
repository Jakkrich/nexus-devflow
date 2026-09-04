import type { Runner } from "../harness.js";

async function run(t: Runner) {
  t.phase("install the shared trees with a Claude and Codex manifest");
  t.write(
    "package.json",
    `${JSON.stringify(
      {
        name: "adapter-selection-fixture",
        private: true,
        type: "module",
        scripts: { build: "node --check src/app.js" }
      },
      null,
      2
    )}\n`
  );
  t.write("src/app.js", 'console.log("ready");\n');
  t.write(".gitignore", "node_modules/\n");
  t.gitInit();
  t.git("add", ".gitignore", "package.json", "src/app.js");
  t.git("commit", "-m", "chore: scaffold application");
  const rootCommit = t.git("rev-parse", "HEAD");
  t.git("switch", "-c", "chore/devflow-setup");
  t.installDevFlow("--all");

  const manifestPath = ".nexus/nexus-devflow.json";
  const manifestText = t.read(manifestPath);
  if (!manifestText) {
    throw new Error("installer did not create a manifest");
  }
  const manifest = JSON.parse(manifestText) as { adapters: string[] };
  manifest.adapters = ["claude", "codex"];
  t.write(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  t.phase("onboard preserves the installer selection");
  const result = t.agent(
    "/onboard\n\nUse Efficient implementation style, commit DevFlow workflow files, keep the installer-selected adapters unchanged, do not add tests or CI, and do not commit. Finish the onboarding report.",
    { maxTurns: 50 }
  );
  const finalManifestText = t.read(manifestPath);
  const finalManifest = finalManifestText
    ? (JSON.parse(finalManifestText) as { adapters: string[] })
    : null;

  t.check("Onboard invocation succeeded", result.status === 0);
  t.check(
    "the manifest still selects only Claude and Codex",
    JSON.stringify(finalManifest?.adapters) === JSON.stringify(["claude", "codex"])
  );
  t.check("the Claude adapter remains installed", !!t.read(".claude/skills/onboard/SKILL.md"));
  t.check("the shared adapter remains installed", !!t.read(".agents/skills/onboard/SKILL.md"));
  t.check("the report names Claude", /\bclaude(?: code)?\b/i.test(result.resultText));
  t.check("the report names Codex", /Codex/i.test(result.resultText));
  t.check(
    "the report does not relabel the selection as all adapters",
    !/keep all adapters|all four (?:adapters|tools) (?:are )?(?:installed|selected)/i.test(
      result.resultText
    )
  );
  t.check("Onboard created no commit", t.git("rev-parse", "HEAD") === rootCommit);
}

export default {
  name: "adapter-selection",
  description:
    "Onboard preserves a Claude and Codex manifest without relabeling the shared tree as every compatible tool",
  run
};
