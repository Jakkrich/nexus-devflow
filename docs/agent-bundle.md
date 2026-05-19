# Agent Bundle and npm Activation

The active framework bundle is `.agent`.

The old model used a Python switcher. The current model uses root npm scripts and does not switch between multiple checked-in IDE bundles.

## Supported Command Surface

```powershell
npm run activate
npm run validate
npm run index
npm run sync:check
npm run agent -- --help
npm run agent -- artifact:get 001 requirements
npm run agent -- plan:validate 001
```

## Bundle Rules

- `.agent` contains agents, commands, rules, schemas, scripts, skills, and dashboard assets.
- `.workspaces` contains generated project and roadmap artifacts.
- Agents should use script-first JSON commands for structured artifacts instead of rewriting whole JSON files.
- `scripts/` contains root automation wrappers and validation scripts.
- Root docs explain how humans should use and maintain the framework.
- `agent-bundle.manifest.json` defines the required bundle paths and forbidden legacy bundle paths.

## Why a Single Bundle

A single bundle avoids duplicate framework trees and makes updates easier to review. If another IDE requires a different layout later, generate that layout from `.agent` or a shared manifest instead of manually maintaining two full copies.

## Health Check

```powershell
npm run sync:check
```

This confirms `.agent` is present and legacy IDE bundle directories are absent.

