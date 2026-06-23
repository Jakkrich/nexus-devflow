import { defaultDocPreset } from './presets/default-doc.mjs';
import { planPreset } from './presets/plan.mjs';
import { reportPreset } from './presets/report.mjs';
import { specPreset } from './presets/spec.mjs';

const registry = new Map([
  [reportPreset.name, reportPreset],
  [specPreset.name, specPreset],
  [planPreset.name, planPreset],
  [defaultDocPreset.name, defaultDocPreset]
]);

export function getPreset(name = 'default-doc') {
  const preset = registry.get(name);
  if (!preset) {
    throw new Error(`Unknown render preset: ${name}`);
  }
  return preset;
}
