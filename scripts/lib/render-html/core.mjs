import fs from 'node:fs';
import path from 'node:path';
import { getPreset } from './presets.mjs';

export function renderMarkdownDocument({
  sourcePath,
  markdown,
  preset,
  outputPath,
  metadata = {},
  assetsMode = 'self-contained',
  stagePolicy = { htmlRequired: false }
}) {
  const resolvedPreset = getPreset(preset);
  const renderResult = resolvedPreset.render({
    sourcePath,
    markdown,
    metadata,
    assetsMode,
    stagePolicy
  });
  const html = typeof renderResult === 'string' ? renderResult : renderResult.html;
  const warnings = typeof renderResult === 'string' ? [] : (renderResult.warnings ?? []);

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, 'utf8');
  }

  return {
    html,
    outputPath,
    presetUsed: resolvedPreset.name,
    warnings
  };
}
