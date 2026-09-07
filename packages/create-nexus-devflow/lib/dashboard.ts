import { spawn } from "node:child_process";
import http from "node:http";

import { renderDashboardPage } from "./dashboard-page.js";
import { DashboardStateEngine } from "./dashboard-engine.js";
import type { DashboardSnapshotOptions } from "./dashboard-snapshot.js";
import { readHistory } from "./history.js";

interface DashboardServer {
  close: () => Promise<void>;
  url: string;
}

interface DashboardServerOptions {
  port?: number;
  snapshotOptions?: DashboardSnapshotOptions;
  engine?: DashboardStateEngine;
}

const DASHBOARD_HOST = "127.0.0.1";
const CSP_HEADER = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

async function startDashboardServer(
  startPath: string = process.cwd(),
  options: DashboardServerOptions = {}
): Promise<DashboardServer> {
  const engine = options.engine ?? new DashboardStateEngine(startPath, {
    snapshotOptions: options.snapshotOptions
  });
  const status = await engine.getStatus();
  const projectRoot = status.project.root;

  const server = http.createServer((request, response) => {
    void handleRequest(engine, projectRoot, request, response, options.snapshotOptions);
  });

  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error): void => {
      server.off("listening", onListening);
      reject(error);
    };
    const onListening = (): void => {
      server.off("error", onError);
      resolve();
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(options.port ?? 0, DASHBOARD_HOST);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    await closeServer(server);
    throw new Error("Nexus-DevFlow dashboard could not determine its local address.");
  }

  // Pre-warm dashboard snapshot in the background on startup
  engine.prewarm();

  return {
    url: `http://${DASHBOARD_HOST}:${address.port}`,
    close: () => closeServer(server)
  };
}

async function handleRequest(
  engine: DashboardStateEngine,
  projectRoot: string,
  request: http.IncomingMessage,
  response: http.ServerResponse,
  snapshotOptions?: DashboardSnapshotOptions
): Promise<void> {
  const method = request.method || "GET";
  if (method !== "GET" && method !== "HEAD" && method !== "POST") {
    response.setHeader("Allow", "GET, HEAD, POST");
    sendResponse(response, method, 405, "text/plain; charset=utf-8", "Method not allowed.\n");
    return;
  }

  const urlObj = new URL(request.url || "/", `http://${DASHBOARD_HOST}`);
  const pathname = urlObj.pathname;

  if (pathname === "/") {
    response.setHeader("Content-Security-Policy", CSP_HEADER);
    try {
      const snapshot = await engine.getSnapshot(snapshotOptions);
      sendResponse(response, method, 200, "text/html; charset=utf-8", renderDashboardPage(snapshot));
    } catch {
      sendResponse(response, method, 200, "text/html; charset=utf-8", renderDashboardPage(null));
    }
    return;
  }

  if (pathname === "/api/status") {
    try {
      const status = await engine.getStatus();
      sendJsonResponse(response, method, 200, status);
    } catch (error) {
      sendErrorResponse(response, method, error, "Unable to read Nexus-DevFlow status.");
    }
    return;
  }

  if (pathname === "/api/snapshot" || pathname === "/api/dashboard") {
    try {
      const snapshot = await engine.getSnapshot(snapshotOptions);
      sendJsonResponse(response, method, 200, snapshot);
    } catch (error) {
      sendErrorResponse(response, method, error, "Unable to read dashboard snapshot.");
    }
    return;
  }

  if (pathname === "/api/history") {
    try {
      const history = await readHistory(projectRoot);
      sendJsonResponse(response, method, 200, history);
    } catch (error) {
      sendErrorResponse(response, method, error, "Unable to read DevFlow history.");
    }
    return;
  }

  if (pathname === "/api/codegraph" || pathname === "/api/graph") {
    try {
      const targetFile = urlObj.searchParams.get("file");
      if (targetFile && targetFile.trim().length > 0) {
        const blast = await engine.getBlastRadius(targetFile.trim());
        sendJsonResponse(response, method, 200, blast);
      } else {
        const graph = await engine.getCodeGraph();
        sendJsonResponse(response, method, 200, {
          totalFiles: graph.totalFiles,
          totalEdges: graph.totalEdges,
          files: Object.keys(graph.nodes)
        });
      }
    } catch (error) {
      sendErrorResponse(response, method, error, "Unable to query code graph.");
    }
    return;
  }

  if (pathname === "/api/action" || pathname === "/api/reconcile") {
    try {
      let actionType = pathname === "/api/reconcile" ? "reconcile" : urlObj.searchParams.get("type") || "";
      let payload: Record<string, unknown> = {};

      if (method === "POST") {
        const bodyText = await readBody(request);
        if (bodyText.trim().length > 0) {
          try {
            payload = JSON.parse(bodyText);
            if (payload.type && typeof payload.type === "string") {
              actionType = payload.type;
            }
          } catch {
            // Invalid JSON body
          }
        }
      }

      const result = await engine.dispatchAction({ type: actionType, ...payload });
      sendJsonResponse(response, method, 200, result);
    } catch (error) {
      sendErrorResponse(response, method, error, "Unable to execute action.");
    }
    return;
  }

  if (pathname === "/favicon.ico") {
    sendResponse(response, method, 204, "text/plain; charset=utf-8", "");
    return;
  }

  sendResponse(response, method, 404, "text/plain; charset=utf-8", "Not found.\n");
}

function readBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => { data += chunk; });
    request.on("end", () => resolve(data));
    request.on("error", reject);
  });
}

function sendJsonResponse(res: http.ServerResponse, method: string, status: number, data: unknown): void {
  sendResponse(res, method, status, "application/json; charset=utf-8", `${JSON.stringify(data)}\n`);
}

function sendErrorResponse(res: http.ServerResponse, method: string, err: unknown, fallback: string): void {
  sendJsonResponse(res, method, 500, { error: err instanceof Error ? err.message : fallback });
}

function sendResponse(res: http.ServerResponse, method: string, status: number, type: string, body: string): void {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", type);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(method === "HEAD" ? undefined : body);
}

async function closeServer(server: http.Server): Promise<void> {
  if (!server.listening) return;
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

async function openDashboard(url: string): Promise<void> {
  const command = process.platform === "darwin"
    ? "open"
    : process.platform === "win32"
      ? "cmd"
      : "xdg-open";
  const args = process.platform === "win32"
    ? ["/c", "start", "", url]
    : [url];

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore"
    });

    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

export { openDashboard, startDashboardServer };
export type { DashboardServer, DashboardServerOptions };
