export function validateUpstreamMonitorContract(workflow: string): void {
  const requirements = [
    '    - cron: "1 0 * * *"',
    '      timezone: "Asia/Bangkok"',
    "  workflow_dispatch:",
    "  contents: read",
    "      issues: write",
    "          persist-credentials: false",
    "npx tsx scripts/inspect-upstream.ts",
    "npx tsx scripts/upstream-monitor.ts",
    "npx tsx scripts/update-upstream-issue.ts",
    "    if: needs.detect.outputs.update-available == 'true'"
  ];

  for (const requirement of requirements) {
    if (!workflow.includes(requirement)) {
      throw new Error(`Upstream monitor workflow is missing: ${requirement.trim()}`);
    }
  }

  for (const forbidden of [
    "openai/codex-action",
    "OPENAI_API_KEY",
    "actions/upload-artifact",
    "contents: write",
    "pull-requests: write"
  ]) {
    if (workflow.includes(forbidden)) {
      throw new Error(`Upstream monitor workflow must not include: ${forbidden}`);
    }
  }

  const detectJob = extractJob(workflow, "detect");
  const publishJob = extractJob(workflow, "publish");

  if (detectJob.includes("issues: write") || detectJob.includes("GH_TOKEN")) {
    throw new Error("Upstream detector must remain contents-read only");
  }

  const detectCheckout = extractNamedStep(detectJob, "Check out Nexus DevFlow");

  if (!detectCheckout.includes("fetch-depth: 0")) {
    throw new Error("Upstream detector must check out full history");
  }

  if (!publishJob.includes("if: needs.detect.outputs.update-available == 'true'")) {
    throw new Error("Upstream Issue publisher must be gated by an available update");
  }

  if (!publishJob.includes("issues: write")) {
    throw new Error("Upstream Issue publisher is missing issues: write");
  }

  const issueStep = extractNamedStep(publishJob, "Create or update review Issue");

  if (!issueStep.includes("GH_TOKEN: ${{ github.token }}")) {
    throw new Error("GitHub token must be scoped to the gated Issue step");
  }
}

function extractJob(workflow: string, name: string): string {
  const lines = workflow.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `  ${name}:`);

  if (start === -1) {
    throw new Error(`Upstream monitor workflow is missing job: ${name}`);
  }

  let end = start + 1;

  while (end < lines.length && !/^  [a-zA-Z0-9_-]+:$/.test(lines[end])) {
    end += 1;
  }

  return lines.slice(start, end).join("\n");
}

function extractNamedStep(workflow: string, name: string): string {
  const lines = workflow.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `      - name: ${name}`);

  if (start === -1) {
    throw new Error(`Upstream monitor workflow is missing step: ${name}`);
  }

  let end = start + 1;

  while (end < lines.length && !/^      - name:/.test(lines[end])) {
    end += 1;
  }

  return lines.slice(start, end).join("\n");
}
