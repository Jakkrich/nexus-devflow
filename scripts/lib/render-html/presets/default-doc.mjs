import { escapeHtml, renderMarkdownBody } from '../markdown.mjs';

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
${renderMarkdownBody(markdown)}
</main>
</body>
</html>`,
      warnings: []
    };
  }
};
