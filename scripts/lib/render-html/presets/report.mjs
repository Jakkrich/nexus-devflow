import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
const templatePaths = {
  en: path.join(projectRoot, '.agent', 'resources', 'schemas', 'report.template.html'),
  th: path.join(projectRoot, '.agent', 'resources', 'schemas', 'report.template.th.html')
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const reportPreset = {
  name: 'report',
  render({ metadata }) {
    const locale = metadata.artifact_language === 'th' ? 'th' : 'en';
    const templatePath = templatePaths[locale] || templatePaths.en;
    const template = fs.readFileSync(templatePath, 'utf8');
    const safeMetadata = Object.fromEntries(
      Object.entries(metadata).map(([key, value]) => [
        key,
        key.endsWith('_html') ? String(value) : escapeHtml(value)
      ])
    );
    const html = Object.entries(safeMetadata).reduce(
      (output, [key, value]) => output.split(`{{${key}}}`).join(String(value)),
      template
    );
    const unresolved = [...html.matchAll(/{{([^}]+)}}/g)].map((match) => match[1]);
    return {
      html,
      warnings: unresolved.map((key) => `Unresolved placeholder: ${key}`)
    };
  }
};
