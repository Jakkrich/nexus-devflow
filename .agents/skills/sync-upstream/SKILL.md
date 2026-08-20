---
name: sync-upstream
description: "[Devflow] [Devflow Maintainer] Check AI Blueprint upstream for commits newer than the last Nexus review, clone and summarize upstream changes, identify conflicts with DevFlow behavior before editing, adapt approved compatible changes, verify the repository, and update the review GitHub issue with comments and status changes. Use only in the Nexus DevFlow maintainer repository when the user asks to check, review, pull, sync, or adopt AI Blueprint upstream updates."
---

# sync-upstream - Review and adapt AI Blueprint updates for DevFlow

Run this maintainer-only workflow explicitly. Never trigger it during ordinary consumer-project updates. Treat AI Blueprint as an upstream source of ideas and changes, not as a tree to merge or overwrite wholesale.

## Input

Accept an optional upstream commit, tag, or range. With no argument, compare the last reviewed upstream commit with `aiblueprinthq/ai-blueprint` `main`.

## Step 1 - Preflight

1. Confirm the repository root has package name `nexus-devflow` and `@jakkrichm/create-nexus-devflow`, plus both adapter trees.
2. Read `AGENTS.md`, `devflow/context/coding-standards.md`, and `references/nexus-divergence.md` completely.
3. Inspect the branch and worktree. Stop if unrelated changes or another active feature would mix with the sync.
4. Do not add a permanent Git remote or fetch into Nexus refs during discovery.

## Step 2 - Clone and Discover

Run from the repository root:

    npx tsx .agents/skills/sync-upstream/scripts/inspect-upstream.ts

The inspector clones `https://github.com/aiblueprinthq/ai-blueprint.git` into a temporary directory. It reads `.nexus/upstream-ai-blueprint.json` and outputs comparison JSON.

## Step 3 - Report & Adapt via DevFlow Loop

1. Create a discovery: `/00-discover sync-upstream <upstream-details>`
2. Define the delivery run: `/10-define`
3. Execute through the DevFlow delivery stages (`20-spec` -> `30-plan` -> `40-execute` -> `50-verify` -> `60-report` -> `70-release`)
4. Verify all gates pass (`npm run check`)
5. Update `.nexus/upstream-ai-blueprint.json` with the new reviewed commit.
