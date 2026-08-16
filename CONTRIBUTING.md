# Contributing to Nexus-DevFlow

Thank you for helping improve Nexus-DevFlow!

## How to Contribute

1. **Report Issues**: Check existing issues before opening a new one. Use our YAML Issue Forms (`.github/ISSUE_TEMPLATE/`).
2. **Propose Changes**: Open a Pull Request from a feature branch.
3. **Run Validation**: Before submitting, ensure all maintainer validation scripts pass:
   ```bash
   npm run check
   npm run check:static
   npm test
   npm run test:routing
   npm run test:package
   ```

## Development Workflow

- Workflow skills live in `.agents/skills/<skill>/SKILL.md`.
- Keep `.claude/skills` in sync by running `npm run sync:adapters`.
- Ensure all markdown contracts remain Thai-default for user-facing artifacts (`artifact_language: "th"`).

## License

By contributing to Nexus-DevFlow, you agree that your contributions will be licensed under its MIT License.
