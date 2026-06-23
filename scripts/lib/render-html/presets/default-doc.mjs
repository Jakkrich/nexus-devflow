function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderBody(markdown) {
  const lines = markdown.split(/\r?\n/);
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
      if (index < lines.length) {
        index++;
      }
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      html.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
      index++;
      continue;
    }

    if (/^- /.test(line.trim())) {
      const items = [];
      while (index < lines.length && /^- /.test(lines[index].trim())) {
        items.push(`<li>${escapeHtml(lines[index].trim().slice(2))}</li>`);
        index++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !/^#{1,6}\s+/.test(lines[index].trim()) && !/^- /.test(lines[index].trim()) && !lines[index].startsWith('```')) {
      paragraph.push(escapeHtml(lines[index].trim()));
      index++;
    }
    html.push(`<p>${paragraph.join('<br>')}</p>`);
  }

  return html.join('\n');
}

export const defaultDocPreset = {
  name: 'default-doc',
  render({ markdown, metadata, sourcePath }) {
    const title = metadata.title || metadata.report_title || sourcePath || 'Document';
    return {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
</head>
<body>
<main>
<h1>${escapeHtml(title)}</h1>
${renderBody(markdown)}
</main>
</body>
</html>`,
      warnings: []
    };
  }
};
