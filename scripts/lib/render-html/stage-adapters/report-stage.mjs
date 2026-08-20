import fs from 'node:fs';
import path from 'node:path';
import { renderReportWithMd2HtmlTemplate } from '../md2html-report.mjs';
import { parseFrontmatter } from '../markdown.mjs';
import { resolveWorkspaceDir as resolveSharedWorkspaceDir } from '../workspace-resolver.mjs';

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

export function resolveReportWorkspaceDir(argument, projectRoot) {
  const specsRoot = path.join(projectRoot, 'devflow', 'runs');
  if (!argument) {
    // Auto-detect latest run if no argument provided
    if (fs.existsSync(specsRoot) && fs.statSync(specsRoot).isDirectory()) {
      const runs = fs.readdirSync(specsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('RUN-'))
        .sort((a, b) => b.name.localeCompare(a.name));
      if (runs.length > 0) {
        return path.join(specsRoot, runs[0].name);
      }
    }
    throw new Error('Usage: node scripts/generate-report-html.mjs <workspace-path-or-running-id>');
  }

  const directPath = path.resolve(projectRoot, argument);
  if (fs.existsSync(directPath)) {
    const stats = fs.statSync(directPath);
    if (stats.isDirectory()) return directPath;
    if (stats.isFile() && (path.basename(directPath) === '60-report.md' || path.basename(directPath) === 'spec.md' || path.basename(directPath) === 'blueprint.md')) {
      return path.dirname(directPath);
    }
  }

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
  let reportPath = path.join(workspaceDir, '60-report.md');
  let outputPath = path.join(workspaceDir, '60-report.html');

  if (!fs.existsSync(reportPath)) {
    const specPath = path.join(workspaceDir, 'spec.md');
    const blueprintPath = path.join(workspaceDir, 'blueprint.md');
    if (fs.existsSync(specPath)) {
      reportPath = specPath;
      outputPath = path.join(workspaceDir, 'report.html');
    } else if (fs.existsSync(blueprintPath)) {
      reportPath = blueprintPath;
      outputPath = path.join(workspaceDir, 'report.html');
    } else {
      throw new Error(`Missing report markdown (60-report.md or spec.md) in ${workspaceDir}`);
    }
  }

  const reportMarkdown = readFileSafe(reportPath);
  if (!reportMarkdown) {
    throw new Error(`Could not read markdown: ${reportPath}`);
  }

  const { data: frontmatter } = parseFrontmatter(reportMarkdown);

  return renderReportWithMd2HtmlTemplate({
    sourcePath: reportPath,
    markdown: reportMarkdown,
    outputPath,
    metadata: {
      artifact_language: frontmatter.artifact_language || 'th',
      title: frontmatter.title || path.basename(workspaceDir)
    }
  });
}

export function runReportHtmlCommand({ projectRoot, argument }) {
  const workspaceDir = resolveReportWorkspaceDir(argument, projectRoot);
  const result = renderReportStageWorkspace({ workspaceDir });
  return result.outputPath;
}

