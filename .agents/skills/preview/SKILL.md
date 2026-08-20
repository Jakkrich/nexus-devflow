---
name: preview
description: "[Devflow] Local preview server management, smoke-check, and temporary runtime inspection before formal verification."
---

# Preview Management & Local Runtime Inspection

## Overview

This is the preview master skill for Nexus-DevFlow. It manages local development/preview servers (`npm run dev`, `npm run preview`, `vite`, `next dev`), handles port conflicts, and executes smoke checks before formal verification.

## Usage & Sub-Commands

- `/preview`         - Inspect current preview status and health
- `/preview start`   - Start the local preview/dev server
- `/preview stop`    - Stop the running server process
- `/preview restart` - Restart the preview server
- `/preview check`   - Perform runtime smoke check against `http://localhost:<port>`

---

## 1. Process & Runtime Management

1. **Detect Framework & Command**: Identify the project runtime (`npm run dev`, `vite preview`, `pnpm start`, `python -m http.server`).
2. **Handle Port Conflicts**: Check if the standard port (3000, 5173, 8080) is occupied; auto-select fallback port or terminate stale background processes.
3. **Health & Smoke Check**: Query local endpoint via HTTP GET to verify HTTP 200 OK and asset loading.
4. **Report Status**:
   ```markdown
   ## Preview Status
   - **URL**: `http://localhost:3000`
   - **App Type**: Next.js / Vite / Node.js
   - **Health Status**: `OK` (200 OK)
   - **Console / Network**: Zero fatal runtime errors
   ```

---

## Relationship To DevFlow 2.0

- **Classification**: Companion command & Runtime support
- **Mainline stages**: `40-execute` (interactive visual check), `50-verify` (smoke test check)
- **Handoff**: `50-verify`
