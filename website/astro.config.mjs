// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://jakkrichm.github.io',
  base: '/nexus-devflow',
  integrations: [
    starlight({
      title: 'Nexus DevFlow',
      description: 'Agent-Ready Stage-Based Delivery Framework for AI & Human Teams',
      defaultLocale: 'root',
      logo: {
        src: './src/assets/logo-nexus-devflow.png',
      },
      social: {
        github: 'https://github.com/Jakkrich/nexus-devflow',
      },
      customCss: [
        './src/assets/custom.css',
      ],
      sidebar: [
        {
          label: 'Start',
          items: [
            { label: 'Welcome', link: '/' },
            { label: 'Getting Started', slug: 'start/getting-started' },
            { label: 'Existing Codebase (/adopt)', slug: 'start/existing-codebase' },
            { label: 'Project Context', slug: 'start/project-context' },
            { label: 'Role-Based Guides', slug: 'start/roles-guide' },
            { label: 'Updating DevFlow', slug: 'start/updating-devflow' },
          ],
        },
        {
          label: 'Workflow',
          items: [
            { label: 'Core Workflow Timeline', slug: 'workflow/core-workflow' },
            { label: 'Case Studies & Real Runs', slug: 'workflow/case-studies' },
            { label: 'Review Gates & Discipline', slug: 'workflow/review-gates' },
          ],
        },
        {
          label: 'Commands & Stages',
          items: [
            { label: 'Mainline Stages (00-70)', slug: 'commands/mainline-stages' },
            { label: 'Companion Commands', slug: 'commands/companion-commands' },
          ],
        },
        {
          label: 'Quality & Verification',
          items: [
            { label: 'Senior QA Verification', slug: 'quality/senior-qa-verification' },
            { label: 'The Findings Ledger', slug: 'quality/findings-ledger' },
            { label: 'Manual Review with /try', slug: 'quality/manual-review' },
            { label: 'Interactive HTML Reports', slug: 'quality/interactive-reports' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Multi-AI Adapters', slug: 'reference/tool-adapters' },
            { label: 'File & Directory Reference', slug: 'reference/file-reference' },
          ],
        },
      ],
    }),
  ],
});
