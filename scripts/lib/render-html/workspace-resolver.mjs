import fs from 'node:fs';
import path from 'node:path';

export function resolveWorkspaceDir({ argument, projectRoot }) {
  const directPath = path.resolve(projectRoot, argument);
  if (fs.existsSync(directPath)) {
    const stats = fs.statSync(directPath);
    if (stats.isDirectory()) {
      return directPath;
    }
    if (stats.isFile() && path.basename(directPath) === '70-report.md') {
      return path.dirname(directPath);
    }
  }

  const searchRoots = [
    path.join(projectRoot, '.workspaces', 'specs'),
    path.join(projectRoot, '.workspaces')
  ].filter((root) => fs.existsSync(root) && fs.statSync(root).isDirectory());

  const candidates = searchRoots.flatMap((root) =>
    fs.readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith(argument))
      .map((entry) => path.join(root, entry.name))
  );

  if (candidates.length !== 1) {
    throw new Error(`Could not resolve workspace path or running ID: ${argument}`);
  }

  return candidates[0];
}
