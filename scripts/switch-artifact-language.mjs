#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const VALID_LANGUAGES = new Set(['th', 'en']);

function usage() {
  console.error('Usage: node scripts/switch-artifact-language.mjs <th|en> [--schemas-dir <path>]');
}

function parseArgs(argv) {
  const [language, ...rest] = argv;
  let schemasDir = path.join(projectRoot, '.agent', 'resources', 'schemas');

  for (let index = 0; index < rest.length; index++) {
    const arg = rest[index];
    if (arg === '--schemas-dir') {
      const next = rest[index + 1];
      if (!next) {
        throw new Error('Missing value for --schemas-dir');
      }
      schemasDir = path.resolve(projectRoot, next);
      index++;
    }
  }

  return { language, schemasDir };
}

function updateTemplateLanguage(filePath, language) {
  const content = fs.readFileSync(filePath, 'utf8');
  const normalizedContent = content.replace(/^\uFEFF/, '');
  if (!normalizedContent.startsWith('---')) {
    throw new Error(`Template is missing frontmatter: ${filePath}`);
  }
  if (!/^artifact_language:\s*"(th|en)"\s*$/m.test(normalizedContent)) {
    throw new Error(`Template is missing artifact_language frontmatter: ${filePath}`);
  }

  const updated = normalizedContent.replace(
    /^artifact_language:\s*"(th|en)"\s*$/m,
    `artifact_language: "${language}"`
  );

  if (updated !== normalizedContent) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function main() {
  try {
    const { language, schemasDir } = parseArgs(process.argv.slice(2));
    if (!VALID_LANGUAGES.has(language)) {
      usage();
      process.exitCode = 1;
      return;
    }

    if (!fs.existsSync(schemasDir)) {
      throw new Error(`Schemas directory does not exist: ${schemasDir}`);
    }

    const templateFiles = fs.readdirSync(schemasDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.template.md'))
      .map((entry) => path.join(schemasDir, entry.name));

    for (const filePath of templateFiles) {
      updateTemplateLanguage(filePath, language);
    }

    console.log(`Updated artifact_language to "${language}" in ${templateFiles.length} template file(s).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
