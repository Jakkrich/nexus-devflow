'use strict';

export async function fetchDashboardCommands() {
  const response = await fetch('/api/commands', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Operations API unavailable (${response.status})`);
  return response.json();
}

export async function runDashboardCommand(id) {
  const response = await fetch('/api/commands/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const result = await response.json().catch(() => ({ ok: false, error: 'Invalid command response' }));
  if (!response.ok && !result.error && !result.stderr) result.error = `Command failed (${response.status})`;
  return result;
}

export function formatDuration(ms) {
  if (!Number.isFinite(ms)) return '-';
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.round(ms / 100) / 10;
  return `${seconds}s`;
}
