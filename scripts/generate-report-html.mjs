import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  deriveRunningId,
  deriveWorkTitle,
  escapeHtml,
  extractH2Section,
  extractH3Section,
  parseFrontmatter,
  renderDecisionHtml,
  renderMarkdownToHtml
} from './lib/render-html/markdown.mjs';
import { resolveWorkspaceDir as resolveSharedWorkspaceDir } from './lib/render-html/workspace-resolver.mjs';

const projectRoot = process.cwd();
const templatePath = path.join(projectRoot, '.agent', 'resources', 'schemas', 'report.template.html');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

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

export function resolveWorkspaceDir(argument, rootOverride = projectRoot) {
  if (!argument) {
    fail('Usage: node scripts/generate-report-html.mjs <workspace-path-or-running-id>');
  }

  const directPath = path.resolve(rootOverride, argument);
  if (fs.existsSync(directPath)) {
    const stats = fs.statSync(directPath);
    if (stats.isDirectory()) return directPath;
    if (stats.isFile() && path.basename(directPath) === '70-report.md') return path.dirname(directPath);
  }

  const specsRoot = path.join(rootOverride, '.workspaces', 'specs');
  if (fs.existsSync(specsRoot) && fs.statSync(specsRoot).isDirectory()) {
    const specCandidates = fs.readdirSync(specsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith(argument))
      .map((entry) => path.join(specsRoot, entry.name));

    if (specCandidates.length === 1) {
      return specCandidates[0];
    }
    if (specCandidates.length > 1) {
      fail(`Multiple workspace directories match "${argument}". Use an explicit path.`);
    }
  }

  try {
    return resolveSharedWorkspaceDir({ argument, projectRoot: rootOverride });
  } catch (error) {
    fail(error.message);
  }
}

function replaceAll(template, replacements) {
  let output = template;
  for (const [key, value] of Object.entries(replacements)) {
    output = output.split(`{{${key}}}`).join(String(value));
  }
  return output;
}

function buildReportHtml(workspaceDir) {
  const reportMdPath = path.join(workspaceDir, '70-report.md');
  const reportMd = readFileSafe(reportMdPath);
  if (!reportMd) {
    fail(`Missing report markdown: ${reportMdPath}`);
  }

  const template = readFileSafe(templatePath);
  if (!template) {
    fail(`Missing HTML template: ${templatePath}`);
  }

  const { data: frontmatter, body } = parseFrontmatter(reportMd);
  const runningId = deriveRunningId(workspaceDir, frontmatter);
  const workTitle = deriveWorkTitle(frontmatter, workspaceDir);
  const reportTitle = frontmatter.title || `Report: ${workTitle}`;
  const reportId = frontmatter.id || `${runningId}-report`;
  const created = frontmatter.created || frontmatter.updated || new Date().toISOString().slice(0, 10);
  const updated = frontmatter.updated || frontmatter.created || new Date().toISOString().slice(0, 10);
  const owner = frontmatter.owner || 'unknown';
  const status = frontmatter.status || 'draft';
  const docType = frontmatter.doc_type || 'stage';
  const stage = frontmatter.stage || '70-report';

  const executiveSummary = renderMarkdownToHtml(extractH3Section(body, 'Executive Summary'), '<p class="placeholder">[Short summary of the whole job]</p>');
  const workCompleted = renderMarkdownToHtml(extractH3Section(body, 'Work Completed'), '<p class="placeholder">[What was completed]</p>');
  const validationOutcome = renderMarkdownToHtml(extractH3Section(body, 'Validation Outcome'), '<p class="placeholder">[What verification proved]</p>');
  const checklistSummarySource = extractH3Section(body, 'Checklist Summary');
  const openRisks = renderMarkdownToHtml(extractH3Section(body, 'Open Risks'), '<p class="placeholder">[Remaining concerns]</p>');
  const nextActions = renderMarkdownToHtml(extractH3Section(body, 'Next Actions'), '<p class="placeholder">[What happens next, if anything]</p>');
  const decisions = renderDecisionHtml(extractH2Section(body, '4. Decisions', '5. Outputs'));
  const additionalNotes = renderMarkdownToHtml(extractH2Section(body, '7. Additional Notes'), '<p class="placeholder">[Add any extra headings below this section when useful]</p>');

  const checklist = summarizeChecklists(workspaceDir);
  const derivedChecklistSummary = checklist.totals.total
    ? renderMarkdownToHtml(
        `- Overall completion: ${checklist.totals.complete}/${checklist.totals.total}\n- Blocked items: ${checklist.totals.blocked}\n- Skipped items: ${checklist.totals.skipped}`,
        ''
      )
    : '<p class="placeholder">[No checklist files were present for this run]</p>';
  const checklistSummary = renderMarkdownToHtml(checklistSummarySource, derivedChecklistSummary);

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

  const inputsListHtml = [...inputFiles, ...checklistInputFiles].join('\n');
  const outputsListHtml = [
    renderFileListItem('70-report.md', '70-report.md', '&#128196;', 'final markdown summary'),
    renderFileListItem('70-report.html', '70-report.html', '&#127760;', 'final HTML summary')
  ].join('\n');

  const footerText = `Generated from 70-report.md | Mainline next step: end of flow | Checklist items: ${checklist.totals.total}`;

  const replacements = {
    report_title: escapeHtml(reportTitle),
    report_id: escapeHtml(reportId),
    doc_type: escapeHtml(docType),
    stage: escapeHtml(stage),
    created: escapeHtml(created),
    updated: escapeHtml(updated),
    owner: escapeHtml(owner),
    status: escapeHtml(status),
    executive_summary_html: executiveSummary,
    work_completed_html: workCompleted,
    validation_outcome_html: validationOutcome,
    checklist_summary_html: checklistSummary,
    checklist_complete: escapeHtml(checklist.totals.complete),
    checklist_blocked: escapeHtml(checklist.totals.blocked),
    checklist_skipped: escapeHtml(checklist.totals.skipped),
    checklist_total: escapeHtml(checklist.totals.total),
    checklist_rows_html: renderChecklistRowsHtml(checklist.blockedOrSkipped),
    open_risks_html: openRisks,
    next_actions_html: nextActions,
    decisions_html: decisions,
    inputs_list_html: inputsListHtml,
    outputs_list_html: outputsListHtml,
    additional_notes_html: additionalNotes,
    footer_text: escapeHtml(footerText)
  };

  return replaceAll(template, replacements);
}

function main() {
  const workspaceDir = resolveWorkspaceDir(process.argv[2]);
  const html = buildReportHtml(workspaceDir);
  const outputPath = path.join(workspaceDir, '70-report.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Generated ${outputPath}`);
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  main();
}
