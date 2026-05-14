---
description: Preview Management - Manage the local preview development server (start, stop, status check) using automation scripts.
---
# 🌐 Preview Management

## Usage: `/14-Preview [subcommand]`

Manage the local preview development server (start, stop, status check).

---

## 🛠️ Sub-commands

- `/14-Preview`           - Show current preview server status
- `/14-Preview start`     - Start the server
- `/14-Preview stop`      - Stop the server
- `/14-Preview restart`   - Restart the server
- `/14-Preview check`     - Health check

---

## 🚦 Internal Process

The AI will manage the preview server using the provided auto_preview script.
*Note: Execute with IDE-Agnostic paths like `python <ROOT_AI_FOLDER>/scripts/auto_preview.py ...` (e.g. `.cursor` or `.cursor`)*

Commands to execute:
- **Start**: `python <ROOT_AI_FOLDER>/scripts/auto_preview.py start [port]`
- **Stop**: `python <ROOT_AI_FOLDER>/scripts/auto_preview.py stop`
- **Status**: `python <ROOT_AI_FOLDER>/scripts/auto_preview.py status`

### Resolving Port Conflicts
If the port is in use, elegantly offer options to the user:
1. Start on a different port.
2. Terminate the process on the existing port.
3. Specify a custom port.

### Status Format
When displaying status, clearly state:
- 🌐 **URL**: e.g., `http://localhost:3000`
- 📁 **Project Path**: Absolute path to project
- 🏷️ **App Type**: Next.js, FastAPI, Odoo, PHP, etc.
- 💚 **Health Status**: e.g., OK
