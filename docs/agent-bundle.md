# Agent Bundle

The active framework bundle is `.agent`.

DevFlow 2.0 uses a single checked-in bundle plus root automation scripts. It no longer depends on a dashboard UI or PRP task runtime for JSON artifact mutation.

## Supported Command Surface

```powershell
npm run activate
npm run validate
npm run validate:all
npm run index
npm run sync:check
```

## Bundle Rules

- `.agent/workflows/` contains the workflow prompts.
- `.agent/agents/` contains specialist agent personas.
- `.agent/skills/` contains reusable methods and discipline layers.
- `.agent/resources/schemas/` contains markdown templates and shared delivery contracts.
- `.agent/scripts/` contains framework helpers that still matter in 2.0, such as goal runner tests and preview/session helpers.
- `scripts/` contains root activation, validation, install, and linking automation.

## What Changed In 2.0

- Removed dashboard assets from the active bundle contract.
- Removed PRP runtime commands from the active bundle contract.
- Retired JSON task schema/template files from the mainline workflow engine.
- Kept markdown templates as the handoff source of truth.

## Health Check

```powershell
npm run validate
npm run sync:check
```
