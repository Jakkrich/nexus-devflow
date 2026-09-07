import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fsSync from "node:fs";
import {
  McpServerEngine,
  type JsonRpcRequest,
  type JsonRpcResponse
} from "../lib/mcp-server-engine.js";

describe("McpServerEngine Seam & Dispatch", () => {
  const projectRoot = fsSync.existsSync(path.join(process.cwd(), "agent-bundle.manifest.json"))
    ? process.cwd()
    : path.resolve(process.cwd(), "../..");

  it("handles initialize method in-memory", async () => {
    const engine = new McpServerEngine(projectRoot);
    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2024-11-05" }
    };
    const res = await engine.handleMessage(req);
    assert.equal(res.id, 1);
    const result = res.result as Record<string, unknown>;
    assert.equal(result.protocolVersion, "2024-11-05");
    assert.ok(result.serverInfo);
  });

  it("handles tools/list returning all registered DevFlow tools", async () => {
    const engine = new McpServerEngine(projectRoot);
    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list"
    };
    const res = await engine.handleMessage(req);
    assert.equal(res.id, 2);
    const result = res.result as { tools: Array<{ name: string; description: string }> };
    assert.ok(Array.isArray(result.tools));
    assert.ok(result.tools.length >= 10);
    assert.ok(result.tools.some((t) => t.name === "devflow_get_status"));
    assert.ok(result.tools.some((t) => t.name === "devflow_get_studio_html"));
    assert.ok(result.tools.some((t) => t.name === "devflow_evaluate_gate"));
  });

  it("dispatches devflow_get_status tool call in-memory", async () => {
    const engine = new McpServerEngine(projectRoot);
    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "devflow_get_status",
        arguments: {}
      }
    };
    const res = await engine.handleMessage(req);
    assert.equal(res.id, 3);
    const result = res.result as { content: Array<{ type: string; text: string }> };
    assert.ok(result.content);
    assert.ok(result.content[0].text.length > 0);
  });

  it("dispatches devflow_get_active_context via ActiveContextEngine in-memory", async () => {
    const engine = new McpServerEngine(projectRoot);
    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "devflow_get_active_context",
        arguments: {}
      }
    };
    const res = await engine.handleMessage(req);
    assert.equal(res.id, 4);
    const result = res.result as { content: Array<{ type: string; text: string }> };
    assert.ok(result.content);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok("paths" in parsed && "currentWork" in parsed);
  });

  it("dispatches devflow_get_studio_html via StudioViewRenderer in-memory", async () => {
    const engine = new McpServerEngine(projectRoot);
    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "devflow_get_studio_html",
        arguments: {}
      }
    };
    const res = await engine.handleMessage(req);
    assert.equal(res.id, 5);
    const result = res.result as { content: Array<{ type: string; text: string }> };
    assert.ok(result.content);
    assert.ok(result.content[0].text.length > 500);
    assert.ok(result.content[0].text.includes("Nexus-DevFlow") || result.content[0].text.includes("studio-container"));
  });

  it("returns error for unknown method or missing tool", async () => {
    const engine = new McpServerEngine(projectRoot);
    const unknownMethodRes = await engine.handleMessage({
      jsonrpc: "2.0",
      id: 6,
      method: "unknown_method"
    });
    assert.ok(unknownMethodRes.error);
    assert.equal(unknownMethodRes.error.code, -32601);

    const unknownToolRes = await engine.handleMessage({
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: { name: "non_existent_tool" }
    });
    assert.ok(unknownToolRes.error || (unknownToolRes.result as { isError?: boolean }).isError);
  });
});
