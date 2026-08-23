import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import type { Readable, Writable } from "node:stream";

import { readProjectStatus } from "./status.js";
import { addIdea } from "./ideas.js";
import { addFinding, resolveFinding, type FindingSeverity, type FindingStatus } from "./findings.js";
import { evaluateGate, formatGateReport } from "./gatekeeper.js";

const PROTOCOL_VERSION = "2024-11-05";
const SERVER_NAME = "nexus-devflow-mcp";
const SERVER_VERSION = "2.0.27";

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
  }
];

export async function handleToolCall(
  projectRoot: string,
  name: string,
  args: Record<string, unknown> = {}
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  try {
    switch (name) {
      case "devflow_get_status": {
        const status = await readProjectStatus(projectRoot);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(status, null, 2)
            }
          ]
        };
      }

      case "devflow_add_idea": {
        const text = typeof args.text === "string" ? args.text.trim() : "";
        if (!text) {
          return {
            content: [{ type: "text", text: "Error: 'text' parameter is required for devflow_add_idea" }],
            isError: true
          };
        }
        const title = typeof args.title === "string" ? args.title.trim() : undefined;
        const created = await addIdea(projectRoot, { text, title });
        return {
          content: [
            {
              type: "text",
              text: `Idea added successfully:\n- ID: ${created.id}\n- Title: ${created.title}\n- Value: ${created.value}\n- Feasibility: ${created.feasibility}`
            }
          ]
        };
      }

      case "devflow_record_finding": {
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

        const result = await addFinding(projectRoot, title, {
          id,
          severity,
          status,
          location
        });

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
      }

      case "devflow_resolve_finding": {
        const id = typeof args.id === "string" ? args.id.trim() : "";
        const status = typeof args.status === "string" ? (args.status.toLowerCase() as FindingStatus) : undefined;

        if (!id || !status) {
          return {
            content: [{ type: "text", text: "Error: 'id' and 'status' parameters are required for devflow_resolve_finding" }],
            isError: true
          };
        }

        const result = await resolveFinding(projectRoot, id, status);
        if (!result.success || !result.finding) {
          return {
            content: [{ type: "text", text: result.message }],
            isError: true
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Finding ${result.finding.id} updated to status: ${result.finding.status}`
            }
          ]
        };
      }


      case "devflow_evaluate_gate": {
        const strict = args.strict === true;
        const report = await evaluateGate(projectRoot, { strict });
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
      }

      case "devflow_get_context": {
        const doc = typeof args.document === "string" ? args.document.toLowerCase() : "";
        let relativePath: string;

        switch (doc) {
          case "overview":
            relativePath = path.join("devflow", "context", "project-overview.md");
            break;
          case "stage":
            relativePath = path.join("devflow", "context", "current-stage.md");
            break;
          case "standards":
            relativePath = path.join("devflow", "context", "coding-standards.md");
            break;
          case "findings":
            relativePath = path.join("devflow", "context", "findings.md");
            break;
          case "ideas":
            relativePath = path.join("devflow", "ideas.md");
            break;
          case "feature":
            relativePath = path.join("devflow", "context", "current-feature.md");
            break;
          case "build-plan":
            relativePath = path.join("devflow", "build-plan.md");
            break;
          case "project-plan":
            relativePath = path.join("devflow", "project-plan.md");
            break;
          default:
            return {
              content: [{ type: "text", text: `Error: Unknown document type '${doc}'` }],
              isError: true
            };
        }

        const fullPath = path.join(projectRoot, relativePath);
        try {
          const content = await fs.readFile(fullPath, "utf8");
          return {
            content: [{ type: "text", text: content }]
          };
        } catch {
          return {
            content: [{ type: "text", text: `Document '${relativePath}' not found or empty.` }],
            isError: false
          };
        }
      }

      default:
        return {
          content: [{ type: "text", text: `Error: Unknown tool name '${name}'` }],
          isError: true
        };
    }
  } catch (error: unknown) {
    return {
      content: [
        {
          type: "text",
          text: `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
}

export async function processMcpMessage(
  projectRoot: string,
  rawMessage: string
): Promise<JsonRpcResponse | null> {
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

    case "notifications/initialized":
    case "initialized": {
      return null;
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
      const toolArgs = typeof params.arguments === "object" && params.arguments !== null
        ? (params.arguments as Record<string, unknown>)
        : {};

      const result = await handleToolCall(projectRoot, toolName, toolArgs);
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
        const text = await fs.readFile(path.join(projectRoot, targetFile), "utf8");
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

export function startMcpServer(
  projectRoot: string,
  inStream: Readable = process.stdin,
  outStream: Writable = process.stdout
): void {
  const rl = readline.createInterface({
    input: inStream,
    terminal: false
  });

  rl.on("line", async (line) => {
    const response = await processMcpMessage(projectRoot, line);
    if (response) {
      outStream.write(JSON.stringify(response) + "\n");
    }
  });
}
