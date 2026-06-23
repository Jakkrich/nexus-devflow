import path from 'node:path';

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) {
    return { data: {}, body: markdown };
  }

  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: markdown };
  }

  const raw = match[1];
  const body = match[2];
  const data = {};
  let currentArrayKey = null;

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const arrayItem = line.match(/^\s*-\s+(.*)$/);
    if (arrayItem && currentArrayKey) {
      data[currentArrayKey].push(stripQuotes(arrayItem[1]));
      continue;
    }

    const keyValue = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyValue) {
      currentArrayKey = null;
      continue;
    }

    const [, key, rawValue] = keyValue;
    if (!rawValue.trim()) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    data[key] = stripQuotes(rawValue);
    currentArrayKey = null;
  }

  return { data, body };
}

function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, '\n');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractH3Section(body, heading) {
  const normalized = normalizeLineEndings(body);
  const regex = new RegExp(`^### ${escapeRegex(heading)}\\n([\\s\\S]*?)(?=^### |^## )`, 'm');
  const match = normalized.match(regex);
  return match ? match[1].trim() : '';
}

export function extractH2Section(body, headingLabel, nextHeadingLabel = null) {
  const normalized = normalizeLineEndings(body);
  const headingToken = `## ${headingLabel}`;
  const startIndex = normalized.indexOf(headingToken);
  if (startIndex === -1) return '';

  const contentStart = normalized.indexOf('\n', startIndex);
  if (contentStart === -1) return '';

  const nextIndex = nextHeadingLabel
    ? normalized.indexOf(`\n## ${nextHeadingLabel}`, contentStart + 1)
    : -1;

  const content = nextIndex === -1
    ? normalized.slice(contentStart + 1)
    : normalized.slice(contentStart + 1, nextIndex);

  return content.trim();
}

export function renderInline(text) {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return escaped;
}

export function renderMarkdownToHtml(markdown, fallback = '<p class="placeholder">[No content provided]</p>') {
  const trimmed = markdown.trim();
  if (!trimmed) return fallback;

  const lines = normalizeLineEndings(trimmed).split('\n');
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trimEnd();
    if (!line.trim()) {
      index++;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines = [];
      index++;
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index]);
        index++;
      }
      if (index < lines.length) index++;
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^- /.test(line)) {
      const items = [];
      while (index < lines.length && /^- /.test(lines[index].trim())) {
        items.push(`<li>${renderInline(lines[index].trim().slice(2))}</li>`);
        index++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !/^- /.test(lines[index].trim()) && !lines[index].startsWith('```')) {
      paragraph.push(renderInline(lines[index].trim()));
      index++;
    }
    html.push(`<p>${paragraph.join('<br>')}</p>`);
  }

  return html.join('\n') || fallback;
}

export function renderDecisionHtml(markdown, fallback = '<div class="decision-item placeholder">[Decision 1]</div>') {
  const trimmed = markdown.trim();
  if (!trimmed) {
    return fallback;
  }

  const lines = normalizeLineEndings(trimmed).split('\n').map((line) => line.trim()).filter(Boolean);
  const items = [];
  let buffer = [];

  const flushBuffer = () => {
    if (!buffer.length) return;
    items.push(`<div class="decision-item">${renderInline(buffer.join(' '))}</div>`);
    buffer = [];
  };

  for (const line of lines) {
    if (/^- /.test(line)) {
      flushBuffer();
      items.push(`<div class="decision-item">${renderInline(line.slice(2))}</div>`);
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();

  return items.join('\n');
}

export function deriveRunningId(workspaceDir, frontmatter) {
  if (frontmatter.related_run) return frontmatter.related_run;
  const base = path.basename(workspaceDir);
  const match = base.match(/^(\d+)/);
  return match ? match[1] : base;
}

export function deriveWorkTitle(frontmatter, workspaceDir) {
  if (frontmatter.title) {
    return frontmatter.title.replace(/^(Report:|รายงานสรุป:)\s*/, '').trim();
  }
  return path.basename(workspaceDir).replace(/^\d+-/, '').replace(/-/g, ' ').trim() || 'Untitled Work';
}
