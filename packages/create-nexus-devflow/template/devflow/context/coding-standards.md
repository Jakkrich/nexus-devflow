# Coding Standards

> Project conventions and rules to follow during development.
> Run `/onboard` (or `/adopt` for existing codebases) to tune these standards to your specific stack.

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
