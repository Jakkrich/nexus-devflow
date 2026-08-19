---
name: try
description: "[Devflow] Generate human manual QA review walkthrough guide (where to go, what to click, what to expect)."
---

# try - Manual QA & Review Walkthrough Guide

Where this sits in the workflow:

```text
40-implement or 50-verify or 60-report  ->  [try]  ->  human review & verification
(work implemented / verified)                  (manual    (where to go,
                                               steps)     what to click)
```

`50-verify` proves behavior from automated QA and test runs. `try` gives the user and testers an actionable, step-by-step manual walkthrough: start this command, open this route, click these controls, expect this result, and watch for these failure signs.

It is always **read-only 100%**. It does not edit files, install dependencies, commit, merge, push, or run destructive commands.

## Input

Optional scope:

- **no argument**: use the active run in `devflow/context/current-stage.md` (or the latest completed run under `devflow/runs/`)
- `latest`: use the most recent completed run in `devflow/runs/`
- a run ID or path: e.g. `try RUN-002-add-onboard-adopt-doctor-skills`
- a specific route, endpoint, or CLI command: focus the walkthrough on that surface

If there is no active run and no run history, ask what change or feature the user wants to test manually.

## Step 1 - Find The Work To Explain

Read:

- `AGENTS.md` (Commands section)
- `devflow/context/current-stage.md`
- `devflow/context/project-overview.md`
- `devflow/context/coding-standards.md`
- Active run artifacts: `20-spec.md`, `30-plan.md`, `40-implement.md`, `50-verify.md` (or archived run artifacts)
- Current git branch and status

Do not dump the full spec. Extract only the concrete routes, screens, CLI commands, API endpoints, test data, and expected outcomes that a human needs to verify the feature.

## Step 2 - Identify How To Run The App

Check the Commands section in `AGENTS.md`. Adapt to the project type:

- **Web app**: dev server command (e.g. `npm run dev`), local URL (e.g. `http://localhost:3000`), and specific route/screen.
- **Server / API**: start command, base URL, endpoint, HTTP method, payload, and expected response shape.
- **CLI**: exact CLI command, flags, arguments, and expected terminal output.
- **Library / Module**: sample usage snippet, REPL call, or interactive test command.
- **Fullstack / Microservices**: minimal combined startup commands (e.g. backend + frontend).

If a startup command is missing or unclear in `AGENTS.md`, report that as a configuration gap rather than guessing.

## Step 3 - Produce The Manual Walkthrough Guide

Format the guide with these 5 standard sections:

1. **1. Start** - exact command(s) to start the system and where to run them.
2. **2. Open** - URL(s), screens, tabs, API endpoints, or terminal locations.
3. **3. Do** - specific clicks, form inputs, toggles, selections, or arguments.
4. **4. Expect** - expected visible UI change, response payload, state change, output, or absence of errors.
5. **5. Watch For** - common failure symptoms, console errors, network 4xx/5xx errors, stale state, layout breakage, or safety warnings.

### Example Walkthrough Style:

```markdown
### 1. Start
Run `npm run dev` in the project root.

### 2. Open
Navigate to `http://localhost:3000/dashboard/reports`.

### 3. Do
1. Click the **"Export Report"** button in the top right.
2. Select **"Format: HTML"** from the dropdown.
3. Click **"Download"**.

### 4. Expect
- A new file `report.html` is downloaded.
- The UI displays a green success toast: *"Report exported successfully"*.
- The downloaded HTML file opens in the browser with full styling and charts.

### 5. Watch For
- Spinner hanging indefinitely without downloading.
- Console error related to `Blob` or `URL.createObjectURL`.
- Broken styling or unrendered Mermaid charts in the exported HTML.
```

## Step 4 - Include Confidence, Best Signal & Gaps

Conclude with:

- **Best Signal**: the single most critical action the user should try first to confirm functionality.
- **Edge Cases & Error Flows**: optional secondary checks (e.g. invalid input, empty state, network failure).
- **Gaps & Assumptions**: anything the guide cannot know for certain (e.g. seed credentials, third-party API keys, required database fixtures).

## Rules

- **Strictly Read-Only**: Never edit code, commit, push, install packages, or mutate repository state.
- **Do Not Run Automatically**: Do not launch the server or run commands unless the user explicitly instructs you to do so in the chat.
- **Be Concrete & Specific**: Provide exact URLs, button labels, and payloads.
- **Acknowledge Uncertainty**: If a route or behavior is not specified in the spec, state it clearly as an assumption.

## Output Formatting

Follow the project conventions in `devflow/context/ai-interaction.md`: concise, scannable markdown with numbered steps and clear bold headers.
