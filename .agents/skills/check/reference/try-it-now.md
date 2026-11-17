# Try It Now - manual observation guide

Use this reference for Steps 2–4 of `/check guide` (and `/try`), or when extracting a concise `## Try it now` proof path (1–3 concrete steps for `tryGuide` policies `when-testable`, `when-user-facing`, or `always`).

## Missing-detail & removed-behavior rules

- Do not dump the spec. Pull out the routes, commands, UI surfaces, CLI commands, API endpoints, data states, and done-whens that matter for a human trying it. Look up missing route, command, data-state, or credential details from `devflow/context/project-overview.md` or `devflow/build-plan.md` only when the spec omits them.
- For a rollback, lead with the path that proves the removed behavior is gone, then include one unaffected regression path from the rollback spec.

## Identify how to run the app

Use the Commands section in `AGENTS.md`. Match the project type:

- **Web app** - dev server command, URL, and the route or screen to open.
- **Server/API** - server command, base URL, endpoint, method, and expected response shape.
- **CLI** - exact command(s), arguments, and expected output.
- **Library** - example command, test fixture, REPL snippet, or sample call.
- **Hybrid app** - list the smallest set of commands needed, such as backend plus web dev server.

If the app may already be running, say how to reuse it. If a command is missing
from `AGENTS.md`, report that as a gap rather than inventing certainty.

## Write the manual guide

Produce a concise guide with these 5 sections (respond in Thai per project convention):

1. **Start** - commands to run and where to run them.
2. **Open** - URLs, screens, tabs, API endpoints, or CLI commands.
3. **Do** - clicks, inputs, selections, or command arguments.
4. **Expect** - visible result, output, response, state change, file, or lack of error.
5. **Watch For** - common wrong outcomes, console or network errors, stale data, missing fields, bad empty states, layout issues, or safety warnings.

Keep it concrete. Prefer:

    Open http://127.0.0.1:7788/api/snapshot
    Expect a JSON object with `generated_at`, `services`, `projects`, and
    `conflicts`.

Avoid:

    Check that the snapshot works.

## Include confidence and gaps

End with:

- **Best signal** - the one thing the user should try first.
- **Optional deeper checks** - only if useful.
- **Gaps** - anything the guide cannot know from the docs, such as missing route names, seed data, credentials, or external services.

If the feature is not user-visible, say so and provide the closest manual signal,
such as an API response, CLI output, log line, or unit test command.
