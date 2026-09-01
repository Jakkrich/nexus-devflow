---
name: try
description: "[devflow] Generate a human manual try guide for the current or most recently completed Blueprint feature, fix, or rollback. Reads the spec, project commands, and available app context, connects with MCP browseros-neo when available for interactive previews, then tells the user exactly what to start, where to go, what to click or run, what to expect, and what would count as wrong. Read-only. Use when the user runs /try, invokes $try, asks how to test manually, asks where to click, asks how to see the change, or wants a manual review path after /implement, /autopilot, /check, or /complete."
argument-hint: "[{latest|step-id|path}]"
---

# try - manual review guide

$ARGUMENTS

Where this sits in the workflow:

    /implement or /complete  ->  [try]  ->  human review
    (work exists)                (manual   (where to go,
                                  path)     what to click)

`/check` proves behavior from the agent side. `/try` gives the user a practical
manual walkthrough: start this command, open this route, click these controls,
expect this result, and watch for these failure signs.

It is always read-only. It does not edit files, install dependencies, commit,
merge, push, or run destructive commands.

## Input

Optional scope:

- no argument: use the active feature, fix, or rollback in
  `devflow/context/{xxx-slug}/spec.md`
- `latest`: use the most recent archive under `devflow/history/features/`,
  `devflow/history/fixes/`, or `devflow/history/rollbacks/`
- a step name or number: focus the guide on that active step
- a path, route, or command: include it as the main thing to try

If there is no active feature and no useful archive, ask what change the user
wants to try instead of guessing.

## Step 1 - find the work to explain

Read:

- `AGENTS.md`
- `devflow/context/{xxx-slug}/spec.md` (or active task workspace)
- `devflow/context/project-overview.md`
- `devflow/context/coding-standards.md`
- `devflow/build-plan.md`
- latest files under `devflow/history/features/`,
  `devflow/history/fixes/`, and `devflow/history/rollbacks/`, if no task is active
- git branch and working tree status

Prefer the active task spec. If no active task directory exists, use the most
recent archived feature, fix, or rollback by filename or modification time and
say that is what you used.

Do not dump the spec. Pull out the routes, commands, UI surfaces, CLI commands,
API endpoints, data states, and done-whens that matter for a human trying it.
For a rollback, lead with the path that proves the removed behavior is gone, then
include one unaffected regression path from the rollback spec.

## Step 2 - identify how to run the app

Use the Commands section in `AGENTS.md`. Match the project type:

- **Web app** - dev server command, URL, and the route or screen to open. If `browseros-neo` MCP server is active (`http://127.0.0.1:9010/mcp`), you can also offer to inspect or navigate in the live browser.
- **Server/API** - server command, base URL, endpoint, method, and expected
  response shape.
- **CLI** - exact command(s), arguments, and expected output.
- **Library** - example command, test fixture, REPL snippet, or sample call.
- **Hybrid app** - list the smallest set of commands needed, such as backend plus
  web dev server.

If the app may already be running, say how to reuse it. If a command is missing
from `AGENTS.md`, report that as a gap rather than inventing certainty.

## Step 3 - write the manual guide

Produce a short guide with these sections:

1. **Start** - commands to run and where to run them.
2. **Open** - URLs, screens, tabs, API endpoints, or CLI commands.
3. **Do** - clicks, inputs, selections, or command arguments.
4. **Expect** - visible result, output, response, state change, file, or lack of
    error.
5. **Watch For** - common wrong outcomes, console or network errors, stale data,
    missing fields, bad empty states, layout issues, or safety warnings.

Keep it concrete. Prefer:

    Open http://127.0.0.1:7788/api/snapshot
    Expect a JSON object with `generated_at`, `services`, `projects`, and
    `conflicts`.

Avoid:

    Check that the snapshot works.

## Step 4 - include confidence and gaps

End with:

- **Best signal** - the one thing the user should try first.
- **Optional deeper checks** - only if useful.
- **MCP Visual Preview** - mention live browser inspection via MCP `browseros-neo` if active.
- **Gaps** - anything the guide cannot know from the docs, such as missing route or seed data.