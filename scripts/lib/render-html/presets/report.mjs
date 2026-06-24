import { escapeHtml, parseFrontmatter, renderMarkdownBody } from '../markdown.mjs';

export const reportPreset = {
  name: 'report',
  render({ markdown, metadata, sourcePath }) {
    const { data: frontmatter, body } = parseFrontmatter(markdown);
    const locale = metadata.artifact_language === 'th' || frontmatter.artifact_language === 'th' ? 'th' : 'en';
    const title = metadata.title || metadata.report_title || frontmatter.title || sourcePath || 'Report';
    const html = `<!DOCTYPE html>
<html lang="${escapeHtml(locale)}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
  :root {
    color-scheme: light dark;
    --bg: #f7f4ee;
    --card: #fffdf8;
    --text: #22201b;
    --muted: #6f665d;
    --border: #ddd3c7;
    --accent: #9c5f2d;
    --code: #f1eadf;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #171512;
      --card: #201d18;
      --text: #f1eadf;
      --muted: #c0b4a5;
      --border: #3a342d;
      --accent: #e2a368;
      --code: #2a251f;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: linear-gradient(180deg, var(--bg), color-mix(in srgb, var(--bg) 82%, var(--card)));
    color: var(--text);
    font: 16px/1.7 Georgia, "Times New Roman", serif;
  }
  main {
    max-width: 860px;
    margin: 0 auto;
    padding: 40px 20px 64px;
  }
  article {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 32px 28px;
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
  }
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.25;
    margin: 0 0 14px;
  }
  h1 {
    font-size: 2.2rem;
    margin-bottom: 22px;
    color: var(--accent);
  }
  h2 {
    font-size: 1.4rem;
    margin-top: 28px;
    padding-top: 22px;
    border-top: 1px solid var(--border);
  }
  h3 {
    font-size: 1.05rem;
    margin-top: 22px;
  }
  p, ul, pre {
    margin: 0 0 14px;
  }
  ul {
    padding-left: 22px;
  }
  code {
    background: var(--code);
    border-radius: 6px;
    padding: 0.12rem 0.35rem;
    font-family: Consolas, "Courier New", monospace;
    font-size: 0.92em;
  }
  pre {
    background: var(--code);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    overflow: auto;
  }
  pre code {
    background: transparent;
    padding: 0;
  }
  a {
    color: var(--accent);
  }
</style>
</head>
<body>
<main>
<article>
${renderMarkdownBody(body)}
</article>
</main>
</body>
</html>`;
    return {
      html,
      warnings: []
    };
  }
};
