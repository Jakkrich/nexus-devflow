import fs from 'node:fs';
import path from 'node:path';
import { renderReportWithMd2HtmlTemplate } from '../md2html-report.mjs';
import { parseFrontmatter } from '../markdown.mjs';
import { resolveWorkspaceDir as resolveSharedWorkspaceDir } from '../workspace-resolver.mjs';

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

export function resolveReportWorkspaceDir(argument, projectRoot) {
  const directPath = path.resolve(projectRoot, argument);
  if (fs.existsSync(directPath)) {
    const stats = fs.statSync(directPath);
    if (stats.isDirectory()) return directPath;
    if (stats.isFile() && path.basename(directPath) === '70-report.md') return path.dirname(directPath);
  }

  const specsRoot = path.join(projectRoot, '.workspaces', 'specs');
  if (fs.existsSync(specsRoot) && fs.statSync(specsRoot).isDirectory()) {
    const specCandidates = fs.readdirSync(specsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith(argument))
      .map((entry) => path.join(specsRoot, entry.name));

    if (specCandidates.length === 1) {
      return specCandidates[0];
    }
    if (specCandidates.length > 1) {
      throw new Error(`Multiple workspace directories match "${argument}". Use an explicit path.`);
    }
  }

  return resolveSharedWorkspaceDir({ argument, projectRoot });
}

export function renderReportStageWorkspace({ workspaceDir }) {
  const reportPath = path.join(workspaceDir, '70-report.md');
  const reportMarkdown = readFileSafe(reportPath);
  if (!reportMarkdown) {
    throw new Error(`Missing report markdown: ${reportPath}`);
  }

  const { data: frontmatter } = parseFrontmatter(reportMarkdown);
  const outputPath = path.join(workspaceDir, '70-report.html');

  return renderReportWithMd2HtmlTemplate({
    sourcePath: reportPath,
    markdown: reportMarkdown,
    outputPath,
    metadata: {
      artifact_language: frontmatter.artifact_language || 'en',
      title: frontmatter.title || 'Report'
    }
  });
}

export function runReportHtmlCommand({ projectRoot, argument }) {
  if (!argument) {
    throw new Error('Usage: node scripts/generate-report-html.mjs <workspace-path-or-running-id>');
  }

  const workspaceDir = resolveReportWorkspaceDir(argument, projectRoot);
  const result = renderReportStageWorkspace({ workspaceDir });
  return result.outputPath;
}
