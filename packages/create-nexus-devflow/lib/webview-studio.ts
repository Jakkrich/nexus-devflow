import { DashboardStateEngine } from "./dashboard-engine.js";
import { readIdeas } from "./ideas.js";
import { StudioViewRenderer } from "./studio-view-renderer.js";

export interface StudioRenderOptions {
  theme?: "auto" | "dark" | "light";
  includeScripts?: boolean;
  engine?: DashboardStateEngine;
}

/**
 * Renders a self-contained, interactive Webview Studio HTML page.
 * Delegates to StudioViewRenderer.
 */
export async function renderStudioHtml(
  projectRoot: string,
  options: StudioRenderOptions = {}
): Promise<string> {
  const engine = options.engine ?? new DashboardStateEngine(projectRoot);
  const snapshot = await engine.getSnapshot();
  const ideas = await readIdeas(projectRoot);

  const renderer = new StudioViewRenderer({ defaultTheme: options.theme });
  return renderer.renderWebviewStudio(snapshot, ideas, {
    theme: options.theme,
    includeScripts: options.includeScripts,
  });
}

export { StudioViewRenderer };
