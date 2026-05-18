# Quickstart

This guide gets PRPs-Framework ready for local use with the `.agent` bundle.

## 1. Activate

```powershell
npm run activate
```

## 2. Validate

```powershell
npm run validate
```

## 3. Check Status

```powershell
npm run agent:status
```

## 4. Create a First Task

```powershell
npm run agent -- init 001 "First Task" first-task "Describe the first task"
```

The task files are created under:

```text
.workspaces/specs/
```

## 5. Useful Commands

```powershell
npm run index
npm run sync:check
npm run roadmap:validate
```

## Troubleshooting

- If validation says a JSON artifact is missing, run `npm run activate`.
- If project structure changed, run `npm run index`.
- If `.agent` files are missing, restore the framework bundle before running validation.
