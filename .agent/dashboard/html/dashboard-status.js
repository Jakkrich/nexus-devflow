'use strict';

export const DEFAULT_KANBAN_KEYS = ['planning', 'in-progress', 'ai-review', 'human-review', 'done'];

export const KANBAN_COLUMNS = [
  { key: 'backlog', label: 'Backlog', color: 'var(--col-queue)', system: true, collapsed: true },
  { key: 'planning', label: 'Planning', color: 'var(--col-planning)' },
  { key: 'queue', label: 'Queue', color: 'var(--col-queue)', system: true, collapsed: true },
  { key: 'in-progress', label: 'In Progress', color: 'var(--col-progress)' },
  { key: 'ai-review', label: 'AI Review', color: 'var(--col-ai-review)' },
  { key: 'human-review', label: 'Human Review', color: 'var(--col-human-review)' },
  { key: 'done', label: 'Done', color: 'var(--col-done)' },
  { key: 'error', label: 'Error', color: 'var(--red)', system: true, collapsed: true },
];

export function normalizeStatus(spec) {
  const status = normalizeKanbanKey(spec?.plan?.status);
  if (status) return status;

  const state = normalizeKanbanKey(spec?.plan?.xstateState);
  if (state) return state;

  const planStatus = String(spec?.plan?.planStatus || '').toLowerCase().trim();
  if (planStatus === 'approved') return 'queue';
  if (planStatus === 'review') return 'ai-review';
  if (planStatus === 'done') return 'done';
  if (planStatus === 'rejected') return 'error';
  return 'planning';
}

export function normalizeKanbanKey(value) {
  const raw = String(value || '').toLowerCase().trim().replace(/_/g, '-');
  if (!raw) return null;
  if (raw === 'done' || raw === 'completed' || raw === 'complete') return 'done';
  if (raw === 'backlog') return 'backlog';
  if (raw === 'queue' || raw === 'queued') return 'queue';
  if (raw === 'planning') return 'planning';
  if (raw === 'in-progress' || raw === 'inprogress' || raw === 'coding') return 'in-progress';
  if (raw === 'ai-review' || raw === 'qa-review' || raw === 'validation') return 'ai-review';
  if (raw === 'human-review') return 'human-review';
  if (raw === 'error' || raw === 'failed' || raw === 'rejected') return 'error';
  return null;
}

export function getVisibleKanbanColumns(counts = {}, filterStatus = null) {
  return KANBAN_COLUMNS.filter(c => DEFAULT_KANBAN_KEYS.includes(c.key) || (counts[c.key] || 0) > 0 || filterStatus === c.key);
}

export function statusClass(key) {
  return key === 'in-progress' ? 'progress' : key;
}

export function priorityOrder(spec) {
  const priority = spec?.meta?.priority?.toLowerCase();
  return priority === 'high' ? 0 : priority === 'medium' ? 1 : priority === 'low' ? 2 : 3;
}

export function getCreated(spec) {
  return new Date(spec?.plan?.created_at || spec?.logs?.created_at || 0);
}
