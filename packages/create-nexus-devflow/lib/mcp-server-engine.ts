import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import type { Readable, Writable } from "node:stream";

import { readProjectStatus } from "./status.js";
import { ActiveContextEngine } from "./active-context-engine.js";
import { GatekeeperEngine, formatGateReport } from "./gatekeeper.js";
import { StudioViewRenderer } from "./studio-view-renderer.js";
import { DashboardStateEngine } from "./dashboard-engine.js";
import { addIdea, readIdeas } from "./ideas.js";
import { addFinding, resolveFinding, type FindingSeverity, type FindingStatus } from "./findings.js";
import { sliceContextForStage, type SliceStage } from "./context-slicer.js";
import { buildCodeGraph, calculateBlastRadius } from "./code-graph.js";
import { generateSwarmPlan } from "./swarm-orchestrator.js";

export const PROTOCOL_VERSION = "2024-11-05";
export const SERVER_NAME = "nexus-devflow-mcp";
export const SERVER_VERSION = "2.14.0";

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export type ToolHandler = (
  args: Record<string, unknown>
) => Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }>;

export const DEVFLOW_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: "devflow_get_status",
    description: "Get current project status, active living spec, next recommended action, git state, and quality blockers.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "devflow_add_idea",
    description: "Add a new idea to the centralized Idea Inbox (devflow/ideas.md) with automated feasibility and value assessment.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Full description of the idea to capture"
        },
        title: {
          type: "string",
          description: "Optional short title for the idea"
        }
      },
      required: ["text"]
    }
  },
  {
    name: "devflow_record_finding",
    description: "Record a quality defect, security vulnerability, regression risk, or architectural debt finding to findings.md.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Finding title / short description"
        },
        severity: {
          type: "string",
          enum: ["P0", "P1", "P2", "P3"],
          description: "Finding severity level: P0 (Critical Blocker), P1 (High Blocker), P2 (Medium), P3 (Low / Polish)"
        },
        status: {
          type: "string",
          enum: ["open", "unverified"],
          description: "Initial status (default: open)"
        },
        id: {
          type: "string",
          description: "Optional custom ID (e.g. SEC-001)"
        },
        location: {
          type: "string",
          description: "Optional file path and line location"
        }
      },
      required: ["title"]
    }
  },
  {
    name: "devflow_resolve_finding",
    description: "Update the status of an existing finding in findings.md (e.g. mark fixed, closed, accepted, or invalid).",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Finding ID to update (e.g. F-001 or SEC-001)"
        },
        status: {
          type: "string",
          enum: ["open", "fixed", "closed", "accepted", "invalid"],
          description: "New status to set"
        }
      },
      required: ["id", "status"]
    }
  },
  {
    name: "devflow_evaluate_gate",
    description: "Run DevFlow Quality Gatekeeper evaluation (checks for unchecked tasks, blocking findings, and verification state).",
    inputSchema: {
      type: "object",
      properties: {
        strict: {
          type: "boolean",
          description: "When true, strictly blocks unverified living specs that need /check"
        }
      }
    }
  },
  {
    name: "devflow_get_context",
    description: "Retrieve content of a DevFlow context document (overview, stage, standards, findings, ideas, or active spec).",
    inputSchema: {
      type: "object",
      properties: {
        document: {
          type: "string",
          enum: [
            "overview",
            "stage",
            "standards",
            "findings",
            "ideas",
            "feature",
            "build-plan",
            "project-plan"
          ],
          description: "Name of the DevFlow context document to read"
        }
      },
      required: ["document"]
    }
  },
  {
    name: "devflow_get_sliced_context",
    description: "Retrieve a JIT Stage-Aware sliced context for AI coding (reduces tokens by 60-70% by extracting only relevant rules, tasks, and constraints for the current stage).",
    inputSchema: {
      type: "object",
      properties: {
        stage: {
          type: "string",
          enum: ["implement", "check", "explore", "feature", "status"],
          description: "Target DevFlow workflow stage"
        },
        maxTokens: {
          type: "number",
          description: "Optional maximum token budget limit"
        }
      },
      required: ["stage"]
    }
  },
  {
    name: "devflow_detect_drift",
    description: "Detect git drift between actual repository modified files and the Living Spec (identifies undocumented files and phantom files).",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "devflow_reconcile_state",
    description: "Automatically reconcile and heal workspace drift (syncs undocumented files into living spec and heals stage alignment).",
    inputSchema: {
      type: "object",
      properties: {
        autoAddUndocumented: {
          type: "boolean",
          description: "When true, automatically adds undocumented files into active living spec (default: true)"
        },
        healStage: {
          type: "boolean",
          description: "When true, heals stage pointer to match active branch (default: true)"
        }
      }
    }
  },
  {
    name: "devflow_get_studio_html",
    description: "Retrieve a self-contained, interactive HTML/CSS/JS Webview Studio for embedding inside IDE panels (VS Code, Cursor, Antigravity) or browsers.",
    inputSchema: {
      type: "object",
      properties: {
        theme: {
          type: "string",
          enum: ["auto", "dark", "light"],
          description: "Theme mode (default: auto)"
        }
      }
    }
  },
  {
    name: "devflow_swarm_plan",
    description: "Generate a multi-agent specialized swarm execution plan (Coder, QA, Security, Architect) with task allocations and context requirements.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "devflow_query_code_graph",
    description: "Query the codebase semantic dependency graph to analyze imports, exports, and calculate the Blast Radius of file changes.",
    inputSchema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          description: "Optional target file path to calculate Blast Radius and impacted dependents"
        }
      }
    }
  }
];

export class McpServerEngine {
  public readonly projectRoot: string;
  private readonly tools = new Map<string, { definition: McpToolDefinition; handler: ToolHandler }>();
  private readonly activeContextEngine: ActiveContextEngine;
  private readonly gatekeeperEngine: GatekeeperEngine;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = path.resolve(projectRoot);
    this.activeContextEngine = new ActiveContextEngine(this.projectRoot);
    this.gatekeeperEngine = new GatekeeperEngine(this.projectRoot);
    this.registerDefaultTools();
  }

  public registerTool(definition: McpToolDefinition, handler: ToolHandler): void {
    this.tools.set(definition.name, { definition, handler });
  }

  public getTools(): McpToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.definition);
  }

  private registerDefaultTools(): void {
    // 1. devflow_get_status
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_get_status")!, async () => {
      const status = await readProjectStatus(this.projectRoot);
      return {
        content: [{ type: "text", text: JSON.stringify(status, null, 2) }]
      };
    });

    // 2. devflow_get_active_context (dynamic tool)
    this.registerTool(
      {
        name: "devflow_get_active_context",
        description: "Retrieve structured active task context (workspace paths, task checklist progress, workflow stage, discoveries).",
        inputSchema: { type: "object", properties: {} }
      },
      async () => {
        const context = await this.activeContextEngine.getActiveContext();
        return {
          content: [{ type: "text", text: JSON.stringify(context, null, 2) }]
        };
      }
    );

    // 3. devflow_add_idea
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_add_idea")!, async (args) => {
      const text = typeof args.text === "string" ? args.text.trim() : "";
      if (!text) {
        return {
          content: [{ type: "text", text: "Error: 'text' parameter is required for devflow_add_idea" }],
          isError: true
        };
      }
      const title = typeof args.title === "string" ? args.title.trim() : undefined;
      const created = await addIdea(this.projectRoot, { text, title });
      return {
        content: [
          {
            type: "text",
            text: `Idea added successfully:\n- ID: ${created.id}\n- Title: ${created.title}\n- Value: ${created.value}\n- Feasibility: ${created.feasibility}`
          }
        ]
      };
    });

    // 4. devflow_record_finding
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_record_finding")!, async (args) => {
      const title = typeof args.title === "string" ? args.title.trim() : "";
      if (!title) {
        return {
          content: [{ type: "text", text: "Error: 'title' parameter is required for devflow_record_finding" }],
          isError: true
        };
      }
      const severity = typeof args.severity === "string" ? (args.severity.toUpperCase() as FindingSeverity) : undefined;
      const status = typeof args.status === "string" ? (args.status.toLowerCase() as FindingStatus) : undefined;
      const id = typeof args.id === "string" ? args.id.trim() : undefined;
      const location = typeof args.location === "string" ? args.location.trim() : undefined;

      const result = await addFinding(this.projectRoot, title, { id, severity, status, location });
      if (!result.success || !result.finding) {
        return {
          content: [{ type: "text", text: `Failed to record finding: ${result.message}` }],
          isError: true
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Finding recorded successfully:\n- ID: ${result.finding.id}\n- Severity: [${result.finding.severity}]\n- Status: ${result.finding.status}\n- Title: ${result.finding.title}`
          }
        ]
      };
    });

    // 5. devflow_resolve_finding
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_resolve_finding")!, async (args) => {
      const id = typeof args.id === "string" ? args.id.trim() : "";
      const status = typeof args.status === "string" ? (args.status.toLowerCase() as FindingStatus) : undefined;

      if (!id || !status) {
        return {
          content: [{ type: "text", text: "Error: 'id' and 'status' parameters are required for devflow_resolve_finding" }],
          isError: true
        };
      }

      const result = await resolveFinding(this.projectRoot, id, status);
      if (!result.success || !result.finding) {
        return {
          content: [{ type: "text", text: result.message }],
          isError: true
        };
      }

      return {
        content: [{ type: "text", text: `Finding ${result.finding.id} updated to status: ${result.finding.status}` }]
      };
    });

    // 6. devflow_evaluate_gate
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_evaluate_gate")!, async (args) => {
      const strict = args.strict === true;
      const report = await this.gatekeeperEngine.evaluate({ strict });
      const humanText = formatGateReport(report);
      return {
        content: [
          {
            type: "text",
            text: `${humanText}\n\nJSON Report:\n${JSON.stringify(report, null, 2)}`
          }
        ],
        isError: !report.passed
      };
    });

    // 7. devflow_get_context
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_get_context")!, async (args) => {
      const doc = typeof args.document === "string" ? args.document.toLowerCase() : "";
      const contextPaths = await this.activeContextEngine.getPaths();
      let fullPath: string;

      switch (doc) {
        case "overview":
          fullPath = path.join(this.projectRoot, "devflow", "context", "project-overview.md");
          break;
        case "stage":
          fullPath = contextPaths.stagePath;
          break;
        case "standards":
          fullPath = path.join(this.projectRoot, "devflow", "context", "coding-standards.md");
          break;
        case "findings":
          fullPath = contextPaths.findingsPath || path.join(this.projectRoot, "devflow", "context", "findings.md");
          break;
        case "ideas":
          fullPath = path.join(this.projectRoot, "devflow", "ideas.md");
          break;
        case "feature":
          fullPath = contextPaths.featureSpecPath;
          break;
        case "build-plan":
          fullPath = path.join(this.projectRoot, "devflow", "build-plan.md");
          break;
        case "project-plan":
          fullPath = path.join(this.projectRoot, "devflow", "project-plan.md");
          break;
        default:
          return {
            content: [{ type: "text", text: `Error: Unknown document type '${doc}'` }],
            isError: true
          };
      }

      try {
        const content = await fs.readFile(fullPath, "utf8");
        return { content: [{ type: "text", text: content }] };
      } catch {
        return {
          content: [{ type: "text", text: `Document '${doc}' not found or empty at ${fullPath}.` }],
          isError: false
        };
      }
    });

    // 8. devflow_get_sliced_context
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_get_sliced_context")!, async (args) => {
      const stage = (typeof args.stage === "string" ? args.stage.toLowerCase() : "status") as SliceStage;
      const maxTokens = typeof args.maxTokens === "number" ? args.maxTokens : undefined;
      const slice = await sliceContextForStage(this.projectRoot, stage, { maxTokens });
      return {
        content: [
          {
            type: "text",
            text: `[JIT Context Slice - Stage: ${slice.stage}] (Tokens: ~${slice.estimatedTokens}, Saved: ${slice.reductionPercentage}%)\n\n${slice.content}`
          }
        ]
      };
    });

    // 9. devflow_detect_drift
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_detect_drift")!, async () => {
      const drift = await this.gatekeeperEngine.getDrift();
      return {
        content: [{ type: "text", text: JSON.stringify(drift, null, 2) }]
      };
    });

    // 10. devflow_reconcile_state
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_reconcile_state")!, async (args) => {
      const autoAdd = args.autoAddUndocumented !== false;
      const heal = args.healStage !== false;
      const result = await this.gatekeeperEngine.reconcile({
        autoAddUndocumented: autoAdd,
        healStage: heal
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    });

    // 11. devflow_get_studio_html
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_get_studio_html")!, async (args) => {
      const theme = (typeof args.theme === "string" ? args.theme : "auto") as "auto" | "dark" | "light";
      const dashboardEngine = new DashboardStateEngine(this.projectRoot);
      const snapshot = await dashboardEngine.getSnapshot();
      const ideas = await readIdeas(this.projectRoot);
      const renderer = new StudioViewRenderer({ defaultTheme: theme });
      const html = renderer.renderWebviewStudio(snapshot, ideas, { theme });
      return {
        content: [{ type: "text", text: html }]
      };
    });

    // 12. devflow_swarm_plan
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_swarm_plan")!, async () => {
      const plan = await generateSwarmPlan(this.projectRoot);
      return {
        content: [{ type: "text", text: JSON.stringify(plan, null, 2) }]
      };
    });

    // 13. devflow_query_code_graph
    this.registerTool(DEVFLOW_MCP_TOOLS.find((t) => t.name === "devflow_query_code_graph")!, async (args) => {
      const graph = await buildCodeGraph(this.projectRoot);
      if (typeof args.file === "string" && args.file.trim().length > 0) {
        const blast = calculateBlastRadius(graph, args.file.trim());
        return {
          content: [{ type: "text", text: JSON.stringify(blast, null, 2) }]
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                totalFiles: graph.totalFiles,
                totalEdges: graph.totalEdges,
                files: Object.keys(graph.nodes)
              },
              null,
              2
            )
          }
        ]
      };
    });
  }

  public async executeTool(
    name: string,
    args: Record<string, unknown> = {}
  ): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
    const entry = this.tools.get(name);
    if (!entry) {
      return {
        content: [{ type: "text", text: `Error: Unknown tool name '${name}'` }],
        isError: true
      };
    }
    try {
      return await entry.handler(args);
    } catch (err: unknown) {
      return {
        content: [
          {
            type: "text",
            text: `Tool execution failed: ${err instanceof Error ? err.message : String(err)}`
          }
        ],
        isError: true
      };
    }
  }

  public async handleMessage(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const { id = null, method, params = {} } = request;

    switch (method) {
      case "initialize": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: PROTOCOL_VERSION,
            capabilities: {
              tools: {},
              resources: {}
            },
            serverInfo: {
              name: SERVER_NAME,
              version: SERVER_VERSION
            }
          }
        };
      }

      case "ping": {
        return {
          jsonrpc: "2.0",
          id,
          result: {}
        };
      }

      case "tools/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: DEVFLOW_MCP_TOOLS
          }
        };
      }

      case "tools/call": {
        const toolName = typeof params.name === "string" ? params.name : "";
        const toolArgs = (params.arguments as Record<string, unknown>) || {};
        const result = await this.executeTool(toolName, toolArgs);
        return {
          jsonrpc: "2.0",
          id,
          result
        };
      }

      case "resources/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            resources: [
              {
                uri: "devflow://overview",
                name: "Project Overview",
                mimeType: "text/markdown",
                description: "Living project overview and architecture source of truth"
              },
              {
                uri: "devflow://current-stage",
                name: "Current Stage",
                mimeType: "text/markdown",
                description: "Active delivery run and stage root switch"
              },
              {
                uri: "devflow://findings",
                name: "Findings Ledger",
                mimeType: "text/markdown",
                description: "Recorded quality and security findings"
              },
              {
                uri: "devflow://ideas",
                name: "Ideas Inbox",
                mimeType: "text/markdown",
                description: "Idea backlog with feasibility and value assessment"
              }
            ]
          }
        };
      }

      case "resources/read": {
        const uri = typeof params.uri === "string" ? params.uri : "";
        let targetFile = "";
        if (uri === "devflow://overview") targetFile = path.join("devflow", "context", "project-overview.md");
        else if (uri === "devflow://current-stage") targetFile = path.join("devflow", "context", "current-stage.md");
        else if (uri === "devflow://findings") targetFile = path.join("devflow", "context", "findings.md");
        else if (uri === "devflow://ideas") targetFile = path.join("devflow", "ideas.md");

        if (!targetFile) {
          return {
            jsonrpc: "2.0",
            id,
            error: {
              code: -32602,
              message: `Invalid resource URI: ${uri}`
            }
          };
        }

        try {
          const text = await fs.readFile(path.join(this.projectRoot, targetFile), "utf8");
          return {
            jsonrpc: "2.0",
            id,
            result: {
              contents: [
                {
                  uri,
                  mimeType: "text/markdown",
                  text
                }
              ]
            }
          };
        } catch {
          return {
            jsonrpc: "2.0",
            id,
            result: {
              contents: [
                {
                  uri,
                  mimeType: "text/markdown",
                  text: ""
                }
              ]
            }
          };
        }
      }

      default: {
        return {
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        };
      }
    }
  }

  public async processRawMessage(rawMessage: string): Promise<JsonRpcResponse | null> {
    const trimmed = rawMessage.trim();
    if (!trimmed) return null;

    let request: JsonRpcRequest;
    try {
      request = JSON.parse(trimmed) as JsonRpcRequest;
    } catch {
      return {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: "Parse error: Invalid JSON"
        }
      };
    }

    if (request.method === "initialized" || request.method === "notifications/initialized") {
      return null;
    }

    return this.handleMessage(request);
  }

  public listen(inStream: Readable = process.stdin, outStream: Writable = process.stdout): () => void {
    const rl = readline.createInterface({
      input: inStream,
      output: undefined,
      terminal: false
    });

    const sendResponse = (response: JsonRpcResponse) => {
      outStream.write(`${JSON.stringify(response)}\n`);
    };

    rl.on("line", async (line: string) => {
      try {
        const response = await this.processRawMessage(line);
        if (response) {
          sendResponse(response);
        }
      } catch (err: unknown) {
        sendResponse({
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32603,
            message: `Internal error: ${err instanceof Error ? err.message : String(err)}`
          }
        });
      }
    });

    return () => {
      rl.close();
    };
  }
}
