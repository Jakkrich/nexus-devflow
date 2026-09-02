import fs from 'node:fs';
import path from 'node:path';
import { renderReportWithMd2HtmlTemplate } from '../md2html-report.mjs';
import { parseFrontmatter } from '../markdown.mjs';
import { resolveWorkspaceDir as resolveSharedWorkspaceDir } from '../workspace-resolver.mjs';

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

export function resolveReportWorkspaceDir(argument, projectRoot) {
  // If no argument, check context task directories first, then current-feature.md or current-run
  if (!argument) {
    const contextRoot = path.join(projectRoot, 'devflow', 'context');
    if (fs.existsSync(contextRoot) && fs.statSync(contextRoot).isDirectory()) {
      const activeTasks = fs.readdirSync(contextRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory() && fs.existsSync(path.join(contextRoot, e.name, 'spec.md')))
        .sort((a, b) => b.name.localeCompare(a.name));
      if (activeTasks.length > 0) {
        return path.join(contextRoot, activeTasks[0].name);
      }
    }

    const currentFeature = path.join(projectRoot, 'devflow', 'context', 'current-feature.md');
    if (fs.existsSync(currentFeature)) {
      const content = fs.readFileSync(currentFeature, 'utf8');
      if (content.trim() !== '' && !content.includes('_Nothing in progress.')) {
        return path.dirname(currentFeature);
      }
    }
    const currentRun = path.join(projectRoot, 'devflow', 'context', 'current-run');
    if (fs.existsSync(currentRun) && fs.statSync(currentRun).isDirectory()) {
      return currentRun;
    }
    // Check latest in history/features
    const historyFeatures = path.join(projectRoot, 'devflow', 'history', 'features');
    if (fs.existsSync(historyFeatures) && fs.statSync(historyFeatures).isDirectory()) {
      const entries = fs.readdirSync(historyFeatures, { withFileTypes: true })
        .filter((e) => e.isDirectory() || e.name.endsWith('.md'))
        .sort((a, b) => b.name.localeCompare(a.name));
      if (entries.length > 0) {
        return entries[0].isDirectory() ? path.join(historyFeatures, entries[0].name) : historyFeatures;
      }
    }
  }

  if (argument) {
    const directPath = path.resolve(projectRoot, argument);
    if (fs.existsSync(directPath)) {
      const stats = fs.statSync(directPath);
      if (stats.isDirectory()) return directPath;
      if (stats.isFile()) return path.dirname(directPath);
    }

    // Search in task-isolated active context
    const contextRoot = path.join(projectRoot, 'devflow', 'context');
    if (fs.existsSync(contextRoot) && fs.statSync(contextRoot).isDirectory()) {
      const contextCandidates = fs.readdirSync(contextRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory() && e.name.startsWith(argument));
      if (contextCandidates.length === 1) {
        return path.join(contextRoot, contextCandidates[0].name);
      }
    }

    // Search in history folders
    for (const cat of ['features', 'fixes', 'rollbacks']) {
      const catDir = path.join(projectRoot, 'devflow', 'history', cat);
      if (fs.existsSync(catDir) && fs.statSync(catDir).isDirectory()) {
        const candidates = fs.readdirSync(catDir, { withFileTypes: true })
          .filter((e) => e.name.startsWith(argument));
        if (candidates.length === 1) {
          const match = candidates[0];
          return match.isDirectory() ? path.join(catDir, match.name) : catDir;
        }
      }
    }

    // Search in legacy runs
    const specsRoot = path.join(projectRoot, 'devflow', 'runs');
    if (fs.existsSync(specsRoot) && fs.statSync(specsRoot).isDirectory()) {
      const specCandidates = fs.readdirSync(specsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith(argument))
        .map((entry) => path.join(specsRoot, entry.name));

      if (specCandidates.length === 1) {
        return specCandidates[0];
      }
    }
  }

  return resolveSharedWorkspaceDir({ argument, projectRoot });
}

export function renderReportStageWorkspace({ workspaceDir }) {
  let reportPath = path.join(workspaceDir, 'report.md');
  let outputPath = path.join(workspaceDir, 'report.html');

  if (!fs.existsSync(reportPath)) {
    const featurePath = path.join(workspaceDir, 'current-feature.md');
    const specPath = path.join(workspaceDir, 'spec.md');
    const blueprintPath = path.join(workspaceDir, 'blueprint.md');
    if (fs.existsSync(featurePath)) {
      reportPath = featurePath;
      outputPath = path.join(workspaceDir, 'report.html');
    } else if (fs.existsSync(specPath)) {
      reportPath = specPath;
      outputPath = path.join(workspaceDir, 'report.html');
    } else if (fs.existsSync(blueprintPath)) {
      reportPath = blueprintPath;
      outputPath = path.join(workspaceDir, 'report.html');
    } else {
      // Check if any *.md file exists in workspaceDir
      const mdFiles = fs.readdirSync(workspaceDir).filter(f => f.endsWith('.md') && f !== 'README.md');
      if (mdFiles.length > 0) {
        reportPath = path.join(workspaceDir, mdFiles[0]);
        outputPath = path.join(workspaceDir, `${path.basename(mdFiles[0], '.md')}.html`);
      } else {
        throw new Error(`Missing report markdown (report.md or current-feature.md) in ${workspaceDir}`);
      }
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
