# npm Framework Setup

This repository can be installed as an npm package so projects can call the PRP contract tools through `npx`.

## Local Development

From `.agent`:

```bash
npm run prp -- --help
npm run test:prp
```

## Install Into A Project

From a target project:

```bash
npm install --save-dev agent-flow
npx agent-flow init 001 "First Task" first-task
npx agent-flow validate 001
```

If the framework is installed from a local path during development:

```bash
npm install --save-dev ../path/to/.agent
npx agent-flow status
```

## Agent Rule

Agents should use the CLI as the write path for dashboard state:

```bash
npx agent-flow update 001 --status in_progress
npx agent-flow log 001 "Implemented API route" --phase coding
npx agent-flow event 001 "Manual screenshot captured" --event evidence.added --phase validation
npx agent-flow repair 001
npx agent-flow validate 001
```


