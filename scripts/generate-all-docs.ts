import * as fs from 'node:fs';
import * as path from 'node:path';
import { DocPage, renderPage } from './build-docs-site.js';
import { START_PAGES } from './data/start-pages.js';
import { WORKFLOW_PAGES } from './data/workflow-pages.js';
import { COMMANDS_PAGES } from './data/commands-pages.js';
import { CLI_PAGES } from './data/cli-pages.js';
import { REFERENCE_PAGES } from './data/reference-pages.js';
import { QUALITY_PAGES } from './data/quality-pages.js';
import { SHIP_PAGES } from './data/ship-pages.js';

const DOCS_DIR = path.resolve('docs');

const ALL_PAGES: DocPage[] = [
  ...START_PAGES,
  ...WORKFLOW_PAGES,
  ...COMMANDS_PAGES,
  ...CLI_PAGES,
  ...REFERENCE_PAGES,
  ...QUALITY_PAGES,
  ...SHIP_PAGES
];

console.log(`Starting generation for ${ALL_PAGES.length} documentation subpages...`);

let count = 0;
for (const page of ALL_PAGES) {
  const html = renderPage(page);
  const targetDir = path.join(DOCS_DIR, page.slug);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf-8');
  console.log(`[${page.category}] Generated: ${page.slug}/index.html`);
  count++;
}

console.log(`Successfully generated ${count} documentation pages!`);

// Also generate synchronized docs-search.json
const searchIndex = ALL_PAGES.map(p => ({
  title: p.title,
  description: p.lead,
  section: p.category,
  slug: p.slug,
  href: `../${p.slug}/`,
  tags: [...(p.pills || []), p.category.toLowerCase(), p.slug.replace(/\//g, ' ')]
}));

const searchJsonPath = path.join(DOCS_DIR, 'docs-search.json');
fs.writeFileSync(searchJsonPath, JSON.stringify(searchIndex, null, 2), 'utf-8');
console.log(`Generated synchronized search index at ${searchJsonPath} (${searchIndex.length} items)`);

export { ALL_PAGES };
