import fs from "node:fs/promises";
import path from "node:path";

export type GitHookType = "pre-commit" | "pre-push";

export interface HookInstallResult {
  success: boolean;
  hookType: GitHookType;
  path: string;
  message: string;
}

export interface HookUninstallResult {
  success: boolean;
  removed: string[];
  message: string;
}

const HOOK_MARKER = "# Nexus-DevFlow Quality Gatekeeper Git Hook";

function createHookScript(strict: boolean = true): string {
  const strictFlag = strict ? " --strict" : "";
  return `#!/bin/sh
${HOOK_MARKER}
echo "[Nexus-DevFlow] Verifying Quality Gatekeeper before proceeding..."

if command -v npx >/dev/null 2>&1; then
  npx nexus-devflow check-gate${strictFlag}
else
  echo "[Nexus-DevFlow] Warning: 'npx' not found in PATH, skipping local gatekeeper check."
  exit 0
fi

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "[Nexus-DevFlow] Action aborted: Quality Gatekeeper failed."
  echo "[Nexus-DevFlow] Fix blockers, complete tasks, or resolve findings before proceeding."
  exit 1
fi
`;
}

async function resolveGitHooksDir(projectRoot: string): Promise<string | null> {
  const gitPath = path.join(projectRoot, ".git");
  try {
    const stats = await fs.lstat(gitPath);
    if (stats.isDirectory()) {
      return path.join(gitPath, "hooks");
    }
    if (stats.isFile()) {
      const content = await fs.readFile(gitPath, "utf8");
      const match = content.match(/^gitdir:\s*(.+)$/m);
      if (match) {
        const rawGitDir = match[1].trim();
        const gitDir = path.isAbsolute(rawGitDir)
          ? rawGitDir
          : path.resolve(projectRoot, rawGitDir);
        return path.join(gitDir, "hooks");
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function installGitHook(
  projectRoot: string,
  hookType: GitHookType = "pre-commit",
  options: { strict?: boolean } = {}
): Promise<HookInstallResult> {
  const hooksDir = await resolveGitHooksDir(projectRoot);
  if (!hooksDir) {
    return {
      success: false,
      hookType,
      path: "",
      message: "Target directory is not a Git repository (.git directory or worktree not found)."
    };
  }

  await fs.mkdir(hooksDir, { recursive: true });

  const hookPath = path.join(hooksDir, hookType);
  const scriptContent = createHookScript(options.strict !== false);

  await fs.writeFile(hookPath, scriptContent, { mode: 0o755 });

  return {
    success: true,
    hookType,
    path: hookPath,
    message: `Successfully installed DevFlow ${hookType} hook at ${hookPath}`
  };
}

export async function uninstallGitHooks(
  projectRoot: string
): Promise<HookUninstallResult> {
  const hooksDir = await resolveGitHooksDir(projectRoot);
  if (!hooksDir) {
    return {
      success: true,
      removed: [],
      message: "Target directory is not a Git repository (.git directory or worktree not found)."
    };
  }

  const removed: string[] = [];
  const types: GitHookType[] = ["pre-commit", "pre-push"];

  for (const t of types) {
    const hookPath = path.join(hooksDir, t);
    try {
      const content = await fs.readFile(hookPath, "utf8");
      if (content.includes(HOOK_MARKER)) {
        await fs.unlink(hookPath);
        removed.push(t);
      }
    } catch {
      // File does not exist or cannot be read
    }
  }

  return {
    success: true,
    removed,
    message:
      removed.length > 0
        ? `Removed DevFlow git hooks: ${removed.join(", ")}`
        : "No DevFlow git hooks found to remove."
  };
}

