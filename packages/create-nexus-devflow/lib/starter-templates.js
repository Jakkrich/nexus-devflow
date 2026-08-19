const starterTemplates = {
  projectOverview: `# Project Overview

> **DevFlow Context Source of Truth.**
> Single AI-facing source of truth for project architecture, stack, and shipped capabilities.
> Run \`/onboard\` (for fresh projects) or \`/adopt\` (for existing codebases) to populate this file automatically.

## 1. Project Summary

- **Name**: [Project Name]
- **Description**: [One-line summary of project purpose]
- **Primary Stack**: [Framework / Language / Runtime]

## 2. Architecture & Modules

- \`src/\` - Core application source code

## 3. Shipped Capabilities

- None recorded yet. Run \`/onboard\` or \`/adopt\` to initialize.
`,

  codingStandards: `# Coding Standards

> Project conventions and rules to follow during development.
> Run \`/onboard\` (or \`/adopt\` for existing codebases) to tune these standards to your specific stack.

## Architecture and Conventions

- Write clean, modular, and maintainable code with clear single responsibilities.
- Prefer TypeScript and explicit interfaces where available.
- Keep dependencies lean and justified.

## Code Organization & Style

- Structure source code following framework-native conventions.
- Keep functions focused and avoid deeply nested logic.
- Use consistent naming conventions (camelCase for functions/variables, PascalCase for components/types).

## Error Handling & Security

- Handle errors explicitly and provide meaningful error messages.
- Never hardcode credentials, secrets, or API keys in source code.
- Sanitize and validate all user inputs.

## Testing & Quality

- Follow the TDD workflow for behavior-changing code units.
- Run tests and linting before completing features or fixes.
`,

  currentStage: `# Current DevFlow Run Status

- **Active Discovery ID**: None
- **Active Running ID**: None
- **Current Stage**: Idle
- **Last Completed Run**: None
- **Last Updated**: -
`,

  findings: `# Findings Ledger

> Review findings raised by \`/security-review\` or QA audits.
> Resolved findings are tracked with durable IDs.

- **Total Open P0/P1**: 0
- **Total Tracked**: 0

_No findings recorded._
`,

  aiInteraction: `# AI Interaction Guidelines for DevFlow

> **DevFlow is an agentic workflow layer**, overlaying on top of scaffolded or existing codebases.

## Communication & Interaction

- Be concise and direct in communication.
- Explain technical trade-offs and non-obvious design decisions briefly.
- Always confirm before performing major refactors or destructive operations.
- Maintain markdown-first evidence for all stage activities.

## Artifact Language

- Default language for user-facing artifacts and summaries is Thai (\`th\`), while code, paths, and identifiers remain in English.
- Use exact schema headings when validators check for specific contract sections.

## Output Formatting

- Use GitHub-style markdown for clean scanning.
- Use lists for steps, options, and findings.
- Use tables for comparative matrices or stage summaries.
- Use backticks for paths, filenames, identifiers, and CLI commands.

## DevFlow Timeline Lifecycle

\`\`\`text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
\`\`\`

- Run \`/00-Discover\` to explore requests under a Discovery ID.
- Run \`/10-Define\` to set delivery boundaries and allocate Running IDs.
- Run \`/20-Spec\` and \`/30-Plan\` to establish formal delivery specifications and execution plans.
- Run \`/40-Implement\` for step-by-step code implementation with evidence.
- Run \`/50-Verify\`, \`/60-Report\`, and \`/70-Release\` for quality verification, reporting, and release packaging.
`
};

module.exports = {
  starterTemplates
};
