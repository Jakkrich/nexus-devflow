import fs from 'node:fs';
import path from 'node:path';
import { renderMarkdownDocument } from '../core.mjs';
import {
  deriveRunningId,
  deriveWorkTitle,
  escapeHtml,
  extractH2Section,
  extractH3Section,
  parseFrontmatter,
  renderDecisionHtml,
  renderMarkdownToHtml
} from '../markdown.mjs';
import { resolveWorkspaceDir as resolveSharedWorkspaceDir } from '../workspace-resolver.mjs';

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function parseMarkdownTable(markdown) {
  const rows = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  for (let index = 0; index < lines.length; index++) {
    if (!/^\|/.test(lines[index].trim())) continue;
    if (index + 1 >= lines.length || !/^\|\s*[:\- ]+\|/.test(lines[index + 1].trim())) continue;

    const headers = lines[index].split('|').slice(1, -1).map((cell) => cell.trim().toLowerCase());
    index += 2;

    while (index < lines.length && /^\|/.test(lines[index].trim())) {
      const cells = lines[index].split('|').slice(1, -1).map((cell) => cell.trim());
      const row = {};
      headers.forEach((header, cellIndex) => {
        row[header] = cells[cellIndex] ?? '';
      });
      rows.push(row);
      index++;
    }
  }

  return rows;
}

function parseCheckboxRows(markdown) {
  const rows = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*-\s*\[( |x|X)\]\s*(.+)$/);
    if (!match) continue;
    const checked = match[1].toLowerCase() === 'x';
    const text = match[2].trim();
    let status = checked ? 'done' : 'pending';
    if (/\(BLOCKED:/i.test(text)) status = 'blocked';
    if (/\(SKIPPED:/i.test(text)) status = 'skipped';
    rows.push({
      item: text,
      status,
      evidence: '',
      notes: text
    });
  }
  return rows;
}

function normalizeChecklistRows(markdown) {
  const tableRows = parseMarkdownTable(markdown);
  if (tableRows.length) {
    return tableRows.map((row) => ({
      item: row.item || row.unit || row.check || row.subtask || row.id || 'Unknown item',
      status: (row.status || 'pending').toLowerCase(),
      evidence: row.evidence || row.verification || row['note / evidence'] || '',
      notes: row.notes || row['important context'] || row.reason || row['finding severity'] || ''
    }));
  }
  return parseCheckboxRows(markdown);
}

function summarizeChecklists(workspaceDir) {
  const files = [
    path.join(workspaceDir, 'checklists', 'master-checklist.md'),
    path.join(workspaceDir, 'checklists', 'implementation-checklist.md'),
    path.join(workspaceDir, 'checklists', 'verification-checklist.md')
  ];

  const rows = files
    .map(readFileSafe)
    .filter(Boolean)
    .flatMap((content) => normalizeChecklistRows(content));

  const totals = {
    total: rows.length,
    complete: 0,
    blocked: 0,
    skipped: 0
  };

  for (const row of rows) {
    const status = String(row.status || '').toLowerCase();
    if (['done', 'complete', 'completed', 'released'].includes(status)) totals.complete++;
    if (status === 'blocked') totals.blocked++;
    if (status === 'skipped') totals.skipped++;
  }

  const blockedOrSkipped = rows.filter((row) => ['blocked', 'skipped'].includes(String(row.status || '').toLowerCase()));
  return { totals, blockedOrSkipped, files };
}

function renderChecklistRowsHtml(rows) {
  if (!rows.length) {
    return '<tr><td colspan="3" class="placeholder">No blocked or skipped items.</td></tr>';
  }

  return rows.map((row) => {
    const status = String(row.status || '').toLowerCase();
    const tagClass = status === 'blocked' ? 'blocked' : 'skipped';
    const note = row.evidence || row.notes || '[no note]';
    return `<tr><td>${escapeHtml(row.item)}</td><td><span class="tag ${tagClass}">${escapeHtml(status)}</span></td><td>${escapeHtml(note)}</td></tr>`;
  }).join('\n');
}

function renderFileListItem(href, label, icon, opt = '') {
  const optHtml = opt ? `<span class="opt">${escapeHtml(opt)}</span>` : '';
  return `<li><span class="icon">${icon}</span><a href="${escapeHtml(href)}">${escapeHtml(label)}</a>${optHtml}</li>`;
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

  const { data: frontmatter, body } = parseFrontmatter(reportMarkdown);
  const runningId = deriveRunningId(workspaceDir, frontmatter);
  const workTitle = deriveWorkTitle(frontmatter, workspaceDir);
  const checklist = summarizeChecklists(workspaceDir);

  const checklistSummarySource = extractH3Section(body, 'Checklist Summary');
  const derivedChecklistSummary = checklist.totals.total
    ? renderMarkdownToHtml(
        `- Overall completion: ${checklist.totals.complete}/${checklist.totals.total}\n- Blocked items: ${checklist.totals.blocked}\n- Skipped items: ${checklist.totals.skipped}`,
        ''
      )
    : '<p class="placeholder">[No checklist files were present for this run]</p>';

  const inputFiles = [
    '00-discover.md',
    '10-define.md',
    '20-spec.md',
    '30-plan.md',
    '40-implement.md',
    '50-verify.md',
    '60-release.md'
  ].filter((file) => fs.existsSync(path.join(workspaceDir, file)))
    .map((file) => renderFileListItem(file, file, '&#128196;'));

  const checklistInputFiles = checklist.files
    .filter((file) => fs.existsSync(file))
    .map((file) => {
      const rel = path.relative(workspaceDir, file).replace(/\\/g, '/');
      return renderFileListItem(rel, rel, '&#128203;', 'present');
    });

  const metadata = {
    report_title: frontmatter.title || `Report: ${workTitle}`,
    report_id: frontmatter.id || `${runningId}-report`,
    doc_type: frontmatter.doc_type || 'stage',
    stage: frontmatter.stage || '70-report',
    created: frontmatter.created || frontmatter.updated || new Date().toISOString().slice(0, 10),
    updated: frontmatter.updated || frontmatter.created || new Date().toISOString().slice(0, 10),
    owner: frontmatter.owner || 'unknown',
    status: frontmatter.status || 'draft',
    executive_summary_html: renderMarkdownToHtml(extractH3Section(body, 'Executive Summary'), '<p class="placeholder">[Short summary of the whole job]</p>'),
    work_completed_html: renderMarkdownToHtml(extractH3Section(body, 'Work Completed'), '<p class="placeholder">[What was completed]</p>'),
    validation_outcome_html: renderMarkdownToHtml(extractH3Section(body, 'Validation Outcome'), '<p class="placeholder">[What verification proved]</p>'),
    checklist_summary_html: renderMarkdownToHtml(checklistSummarySource, derivedChecklistSummary),
    checklist_complete: String(checklist.totals.complete),
    checklist_blocked: String(checklist.totals.blocked),
    checklist_skipped: String(checklist.totals.skipped),
    checklist_total: String(checklist.totals.total),
    checklist_rows_html: renderChecklistRowsHtml(checklist.blockedOrSkipped),
    open_risks_html: renderMarkdownToHtml(extractH3Section(body, 'Open Risks'), '<p class="placeholder">[Remaining concerns]</p>'),
    next_actions_html: renderMarkdownToHtml(extractH3Section(body, 'Next Actions'), '<p class="placeholder">[What happens next, if anything]</p>'),
    decisions_html: renderDecisionHtml(extractH2Section(body, '4. Decisions', '5. Outputs')),
    inputs_list_html: [...inputFiles, ...checklistInputFiles].join('\n'),
    outputs_list_html: [
      renderFileListItem('70-report.md', '70-report.md', '&#128196;', 'final markdown summary'),
      renderFileListItem('70-report.html', '70-report.html', '&#127760;', 'final HTML summary')
    ].join('\n'),
    additional_notes_html: renderMarkdownToHtml(extractH2Section(body, '7. Additional Notes'), '<p class="placeholder">[Add any extra headings below this section when useful]</p>'),
    footer_text: `Generated from 70-report.md | Mainline next step: end of flow | Checklist items: ${checklist.totals.total}`
  };

  const outputPath = path.join(workspaceDir, '70-report.html');
  return renderMarkdownDocument({
    sourcePath: reportPath,
    markdown: reportMarkdown,
    preset: 'report',
    outputPath,
    metadata,
    stagePolicy: { htmlRequired: true }
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
