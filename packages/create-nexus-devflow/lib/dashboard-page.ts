import type { DashboardSnapshot } from "./dashboard-snapshot.js";
import { StudioViewRenderer } from "./studio-view-renderer.js";

const defaultRenderer = new StudioViewRenderer();

/**
 * Base static HTML template string for web dashboard.
 */
export const DASHBOARD_PAGE_HTML: string = defaultRenderer.getBaseDashboardHtml();

/**
 * Safely renders the dashboard HTML page with an optional embedded snapshot.
 * Delegates to StudioViewRenderer.
 */
export function renderDashboardPage(snapshot?: DashboardSnapshot | null): string {
  return defaultRenderer.renderWebDashboard(snapshot);
}

export { StudioViewRenderer };
