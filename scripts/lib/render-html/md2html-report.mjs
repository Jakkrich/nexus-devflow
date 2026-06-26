import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, parseFrontmatter, renderInline } from './markdown.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..', '..');
const templatePath = path.join(projectRoot, '.agent', 'skills', 'md2html', 'template.html');

const LABELS = {
  en: {
    brand: 'Report',
    tocTitle: 'Contents',
    printTooltip: 'Print / Save PDF',
    themeTooltip: 'Toggle theme',
    closeLabel: 'Close',
    skipLinkLabel: 'Skip to content',
    footerPrefix: 'Source:',
    readTime: (minutes) => `~${minutes} min read`,
    keyPoint: 'Key point',
    recLabel: '◎ Recommended',
    docType: 'REPORT'
  },
  th: {
    brand: 'รายงาน',
    tocTitle: 'สารบัญ',
    printTooltip: 'พิมพ์ / บันทึก PDF',
    themeTooltip: 'เปลี่ยนธีม',
    closeLabel: 'ปิด',
    skipLinkLabel: 'ข้ามไปเนื้อหา',
    footerPrefix: 'ที่มา:',
    readTime: (minutes) => `อ่านประมาณ ${minutes} นาที`,
    keyPoint: 'ประเด็นสำคัญ',
    recLabel: '◎ แนะนำ',
    docType: 'REPORT'
  }
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/gi, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

function stripMarkdown(value) {
  return String(value)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .trim();
}

function wordCount(text) {
  const tokens = String(text)
    .replace(/[`#>*_\-[\]()]|\.{3}/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return tokens.length;
}

function deriveSubtitle(body) {
  const lines = body.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || /^#{1,6}\s+/.test(line) || /^```/.test(line)) continue;
    if (/^- /.test(line)) {
      return stripMarkdown(line.slice(2));
    }
    return stripMarkdown(line);
  }
  return '';
}

function splitTitleAndBody(markdown, fallbackTitle) {
  const { data, body } = parseFrontmatter(markdown);
  const lines = body.split(/\r?\n/);
  let title = data.title || fallbackTitle || 'Report';
  let startIndex = 0;

  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^#\s+(.+)$/);
    if (!match) continue;
    title = stripMarkdown(match[1]) || title;
    startIndex = index + 1;
    break;
  }

  return {
    frontmatter: data,
    title,
    body: lines.slice(startIndex).join('\n').trim()
  };
}

function renderBodyWithToc(markdownBody) {
  const lines = markdownBody.split(/\r?\n/);
  const html = [];
  const tocEntries = [];
  const slugCounts = new Map();
  let index = 0;

  function uniqueSlug(text) {
    const base = slugify(text);
    const next = (slugCounts.get(base) || 0) + 1;
    slugCounts.set(base, next);
    return next === 1 ? base : `${base}-${next}`;
  }

  while (index < lines.length) {
    const line = lines[index].trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      index++;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const codeLines = [];
      index++;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index++;
      }
      if (index < lines.length) index++;
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    const headingMatch = trimmed.match(/^(#{2,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = stripMarkdown(headingMatch[2]);
      const id = uniqueSlug(text);
      if (level <= 3) {
        tocEntries.push({
          level,
          id,
          text
        });
      }
      html.push(`<h${level} id="${escapeHtml(id)}">${renderInline(headingMatch[2])}</h${level}>`);
      index++;
      continue;
    }

    if (/^- /.test(trimmed)) {
      const items = [];
      while (index < lines.length && /^- /.test(lines[index].trim())) {
        items.push(`<li>${renderInline(lines[index].trim().slice(2))}</li>`);
        index++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    const paragraph = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{2,6}\s+/.test(lines[index].trim()) &&
      !/^- /.test(lines[index].trim()) &&
      !lines[index].trim().startsWith('```')
    ) {
      paragraph.push(renderInline(lines[index].trim()));
      index++;
    }
    html.push(`<p>${paragraph.join('<br>')}</p>`);
  }

  return { html: html.join('\n'), tocEntries };
}

function buildTocHtml(entries) {
  return entries
    .map((entry) => `<a href="#${escapeHtml(entry.id)}" class="lvl-${entry.level}">${escapeHtml(entry.text)}</a>`)
    .join('\n');
}

function replaceAll(template, values) {
  let output = template;
  for (const [key, value] of Object.entries(values)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  return output;
}

export function renderReportWithMd2HtmlTemplate({ sourcePath, markdown, outputPath }) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const { frontmatter, title, body } = splitTitleAndBody(markdown, path.basename(sourcePath));
  const locale = frontmatter.artifact_language === 'th' ? 'th' : 'en';
  const labels = LABELS[locale] || LABELS.en;
  const subtitle = deriveSubtitle(body) || title;
  const minutes = Math.max(1, Math.round(wordCount(body || title) / 250));
  const { html: renderedBody, tocEntries } = renderBodyWithToc(body);
  const date = frontmatter.updated || frontmatter.created || new Date().toISOString().slice(0, 10);

  const contentHtml = renderedBody || `<div class="highlight"><span class="highlight-label">${escapeHtml(labels.keyPoint)}</span><p>${escapeHtml(subtitle)}</p></div>`;
  const values = {
    LANG: escapeHtml(locale),
    REC_LABEL: escapeHtml(labels.recLabel),
    TITLE: escapeHtml(title),
    SUBTITLE: escapeHtml(subtitle),
    DOC_TYPE: escapeHtml(labels.docType),
    SOURCE_FILE: escapeHtml(path.basename(sourcePath)),
    DATE: escapeHtml(date),
    READ_TIME: escapeHtml(labels.readTime(minutes)),
    BRAND_LABEL: escapeHtml(labels.brand),
    TOC_TITLE: escapeHtml(labels.tocTitle),
    PRINT_TOOLTIP: escapeHtml(labels.printTooltip),
    THEME_TOOLTIP: escapeHtml(labels.themeTooltip),
    CLOSE_LABEL: escapeHtml(labels.closeLabel),
    SKIP_LINK_LABEL: escapeHtml(labels.skipLinkLabel),
    FOOTER_NOTE: escapeHtml(`${labels.footerPrefix} ${path.basename(sourcePath)}`)
  };

  let html = replaceAll(template, values);
  html = html.replace('<!-- TOC_ENTRIES -->', buildTocHtml(tocEntries));
  html = html.replace(
    /<!-- CONTENT_START -->[\s\S]*?<!-- CONTENT_END -->/,
    `<!-- CONTENT_START -->\n${contentHtml}\n\n      <!-- CONTENT_END -->`
  );

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, 'utf8');
  }

  return {
    html,
    outputPath,
    warnings: []
  };
}
