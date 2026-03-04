---
description: Check for and apply script updates to the PRP Framework. Safe for existing tasks and specs.
argument-hint: [optional: "check" or "apply"]
---

# Update PRP Framework 🚀

**Your Mission**: Help the user check for and install system updates to the PRP Framework directly from the central repository (`application-etc/rules-development`).

## Process Flow

### Step 1: Check for Updates 🔍
1. Check if the user specified an argument:
   - If they said exactly "apply" (e.g. `/98-Update apply`), skip to Step 2.
2. Otherwise, run the update script in **CheckOnly** mode:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .cursor\scripts\update-prp.ps1 -CheckOnly
   ```
3. Read the output from the terminal.
4. If the output contains `UPDATE_AVAILABLE=false`:
   - Tell the user: "✅ You are already on the latest framework version."
   - **STOP HERE.**
5. If the output contains `UPDATE_AVAILABLE=true`:
   - Inform the user that an update is available. State the `CURRENT_HASH` and the `LATEST_HASH`.
   - Explain clearly: **"This update will overwrite system files in `.cursor/` and `.auto-claude/`, but your configuration, tasks, specs, and project data are absolutely safe."**
   - **Prompt for Action**: "Do you want to apply this update now? Type 'Yes' to proceed."
   - *Wait for the user's response. Do NOT proceed to Step 2 until they say yes.*

### Step 2: Apply Update (Only if Confirmed) ⚡
1. Once the user confirms, execute the updater in Apply mode:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .cursor\scripts\update-prp.ps1 -Apply
   ```
   *(Note: The script has built-in cloning and self-runner logic, so it will handle overwriting safely without locking itself.)*
2. Monitor the script's terminal output.
3. Summarize the successful update to the user: "✅ PRP Framework updated successfully! You can resume working."

---
## ⛔ Rules for the Update Agent
- You MUST wait for the user to confirm before running with the `-Apply` flag.
- Do NOT read or download the repository manually. Trust the `.cursor\scripts\update-prp.ps1` script to do it securely.
- If the script fails due to network or Git credential issues, advise the user to check their GitLab access (`git.nstda.or.th`).
