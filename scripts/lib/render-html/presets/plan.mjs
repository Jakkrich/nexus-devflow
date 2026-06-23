import { defaultDocPreset } from './default-doc.mjs';

export const planPreset = {
  name: 'plan',
  render(context) {
    return defaultDocPreset.render(context);
  }
};
