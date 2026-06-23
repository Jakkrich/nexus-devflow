import { defaultDocPreset } from './default-doc.mjs';

export const specPreset = {
  name: 'spec',
  render(context) {
    return defaultDocPreset.render(context);
  }
};
