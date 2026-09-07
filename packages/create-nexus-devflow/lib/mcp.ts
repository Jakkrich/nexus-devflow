import type { Readable, Writable } from "node:stream";
import {
  McpServerEngine,
  type JsonRpcRequest,
  type JsonRpcResponse,
  type McpToolDefinition,
  DEVFLOW_MCP_TOOLS,
  PROTOCOL_VERSION,
  SERVER_NAME,
  SERVER_VERSION
} from "./mcp-server-engine.js";

export {
  McpServerEngine,
  type JsonRpcRequest,
  type JsonRpcResponse,
  type McpToolDefinition,
  DEVFLOW_MCP_TOOLS,
  PROTOCOL_VERSION,
  SERVER_NAME,
  SERVER_VERSION
};

/**
 * Backward-compatible function to execute a single MCP tool by name.
 * Delegates to McpServerEngine.
 */
export async function handleToolCall(
  projectRoot: string,
  name: string,
  args: Record<string, unknown> = {}
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  const engine = new McpServerEngine(projectRoot);
  return engine.executeTool(name, args);
}

/**
 * Backward-compatible function to process a raw JSON-RPC string message.
 * Delegates to McpServerEngine.
 */
export async function processMcpMessage(
  projectRoot: string,
  rawMessage: string
): Promise<JsonRpcResponse | null> {
  const engine = new McpServerEngine(projectRoot);
  return engine.processRawMessage(rawMessage);
}

/**
 * Starts the DevFlow MCP Server over stdio streams.
 * Delegates to McpServerEngine.
 */
export function startMcpServer(
  projectRoot: string,
  inStream: Readable = process.stdin,
  outStream: Writable = process.stdout
): () => void {
  const engine = new McpServerEngine(projectRoot);
  return engine.listen(inStream, outStream);
}
