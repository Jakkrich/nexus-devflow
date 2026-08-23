import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
import test from "node:test";

import {
  DEVFLOW_MCP_TOOLS,
  processMcpMessage,
  startMcpServer,
  type JsonRpcResponse
} from "../lib/mcp.js";

async function setupDevFlowTestProject(dir: string): Promise<void> {
  await fs.mkdir(path.join(dir, "devflow", "context"), { recursive: true });
  await fs.mkdir(path.join(dir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow Instructions\n", "utf8");
  await fs.writeFile(
    path.join(dir, "devflow", "context", "current-feature.md"),
    "# Current Feature\n\n_Nothing in progress. Run /feature, /fix, or /rollback to start._\n",
    "utf8"
  );
  await fs.writeFile(
    path.join(dir, "devflow", "context", "current-stage.md"),
    "# Current Stage\n\n- Track: `idle`\n- Current Stage: `idle`\n",
    "utf8"
  );
}

test("MCP Server responds to initialize, ping, and initialized notification", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-mcp-init-"));

  try {
    await setupDevFlowTestProject(tempDir);

    // 1. initialize
    const initReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} }
    });
    const initRes = await processMcpMessage(tempDir, initReq);
    assert.ok(initRes);
    assert.equal(initRes.id, 1);
    assert.equal((initRes.result as { protocolVersion: string }).protocolVersion, "2024-11-05");
    assert.equal((initRes.result as { serverInfo: { name: string } }).serverInfo.name, "nexus-devflow-mcp");

    // 2. initialized notification
    const notifyReq = JSON.stringify({
      jsonrpc: "2.0",
      method: "notifications/initialized"
    });
    const notifyRes = await processMcpMessage(tempDir, notifyReq);
    assert.equal(notifyRes, null);

    // 3. ping
    const pingReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "ping"
    });
    const pingRes = await processMcpMessage(tempDir, pingReq);
    assert.ok(pingRes);
    assert.equal(pingRes.id, 2);
    assert.deepEqual(pingRes.result, {});
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("MCP Server lists all 9 DevFlow tools in tools/list", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-mcp-tools-"));

  try {
    await setupDevFlowTestProject(tempDir);

    const req = JSON.stringify({
      jsonrpc: "2.0",
      id: "tools-1",
      method: "tools/list"
    });
    const res = await processMcpMessage(tempDir, req);
    assert.ok(res);
    assert.equal(res.id, "tools-1");

    const tools = (res.result as { tools: typeof DEVFLOW_MCP_TOOLS }).tools;
    assert.equal(tools.length, 9);

    const names = tools.map((t) => t.name);
    assert.ok(names.includes("devflow_get_status"));
    assert.ok(names.includes("devflow_add_idea"));
    assert.ok(names.includes("devflow_record_finding"));
    assert.ok(names.includes("devflow_resolve_finding"));
    assert.ok(names.includes("devflow_evaluate_gate"));
    assert.ok(names.includes("devflow_get_context"));
    assert.ok(names.includes("devflow_get_sliced_context"));
    assert.ok(names.includes("devflow_detect_drift"));
    assert.ok(names.includes("devflow_reconcile_state"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});



test("MCP tools/call executes devflow_get_status, add_idea, record_finding, evaluate_gate", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-mcp-exec-"));

  try {
    await setupDevFlowTestProject(tempDir);

    // 1. devflow_get_status
    const statusReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 10,
      method: "tools/call",
      params: { name: "devflow_get_status", arguments: {} }
    });
    const statusRes = await processMcpMessage(tempDir, statusReq);
    assert.ok(statusRes);
    const statusResult = statusRes.result as { content: Array<{ type: string; text: string }> };
    assert.match(statusResult.content[0].text, /currentWork/);

    // 2. devflow_add_idea
    const ideaReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 11,
      method: "tools/call",
      params: { name: "devflow_add_idea", arguments: { text: "Add voice coding assistant", title: "Voice Agent" } }
    });
    const ideaRes = await processMcpMessage(tempDir, ideaReq);
    assert.ok(ideaRes);
    const ideaResult = ideaRes.result as { content: Array<{ type: string; text: string }> };
    assert.match(ideaResult.content[0].text, /Voice Agent/);

    // Verify ideas.md was written
    const ideasContent = await fs.readFile(path.join(tempDir, "devflow", "ideas.md"), "utf8");
    assert.match(ideasContent, /Voice Agent/);

    // 3. devflow_record_finding
    const findReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 12,
      method: "tools/call",
      params: {
        name: "devflow_record_finding",
        arguments: { title: "Unescaped HTML in dashboard", severity: "P1", id: "SEC-999" }
      }
    });
    const findRes = await processMcpMessage(tempDir, findReq);
    assert.ok(findRes);
    const findResult = findRes.result as { content: Array<{ type: string; text: string }> };
    assert.match(findResult.content[0].text, /SEC-999/);

    // Verify findings.md was written
    const findingsContent = await fs.readFile(path.join(tempDir, "devflow", "context", "findings.md"), "utf8");
    assert.match(findingsContent, /SEC-999/);

    // 4. devflow_evaluate_gate (should fail because SEC-999 is P1 open)
    const gateReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 13,
      method: "tools/call",
      params: { name: "devflow_evaluate_gate", arguments: { strict: false } }
    });
    const gateRes = await processMcpMessage(tempDir, gateReq);
    assert.ok(gateRes);
    const gateResult = gateRes.result as { content: Array<{ type: string; text: string }>; isError?: boolean };
    assert.equal(gateResult.isError, true);
    assert.match(gateResult.content[0].text, /DevFlow Quality Gate BLOCKED/);

    // 5. devflow_resolve_finding
    const resolveReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 14,
      method: "tools/call",
      params: { name: "devflow_resolve_finding", arguments: { id: "SEC-999", status: "closed" } }
    });
    const resolveRes = await processMcpMessage(tempDir, resolveReq);
    assert.ok(resolveRes);

    // 6. devflow_get_context
    const ctxReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 15,
      method: "tools/call",
      params: { name: "devflow_get_context", arguments: { document: "findings" } }
    });
    const ctxRes = await processMcpMessage(tempDir, ctxReq);
    assert.ok(ctxRes);
    const ctxResult = ctxRes.result as { content: Array<{ type: string; text: string }> };
    assert.match(ctxResult.content[0].text, /Findings Ledger/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("MCP resources/list and resources/read works properly", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-mcp-res-"));

  try {
    await setupDevFlowTestProject(tempDir);

    // 1. resources/list
    const listReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 20,
      method: "resources/list"
    });
    const listRes = await processMcpMessage(tempDir, listReq);
    assert.ok(listRes);
    const resList = (listRes.result as { resources: Array<{ uri: string }> }).resources;
    assert.equal(resList.length, 4);

    // 2. resources/read
    const readReq = JSON.stringify({
      jsonrpc: "2.0",
      id: 21,
      method: "resources/read",
      params: { uri: "devflow://current-stage" }
    });
    const readRes = await processMcpMessage(tempDir, readReq);
    assert.ok(readRes);
    const readContent = (readRes.result as { contents: Array<{ text: string }> }).contents[0].text;
    assert.match(readContent, /Current Stage/);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("MCP handles malformed JSON and unknown methods gracefully", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-mcp-err-"));

  try {
    await setupDevFlowTestProject(tempDir);

    // 1. Malformed JSON
    const errRes1 = await processMcpMessage(tempDir, "invalid json string {");
    assert.ok(errRes1);
    assert.equal(errRes1.error?.code, -32700);

    // 2. Unknown method
    const errRes2 = await processMcpMessage(tempDir, JSON.stringify({ jsonrpc: "2.0", id: 99, method: "unknown/method" }));
    assert.ok(errRes2);
    assert.equal(errRes2.error?.code, -32601);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("startMcpServer reads from inStream and writes to outStream", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-mcp-stream-"));

  try {
    await setupDevFlowTestProject(tempDir);

    const inStream = new PassThrough();
    const outStream = new PassThrough();

    startMcpServer(tempDir, inStream, outStream);

    const responses: string[] = [];
    outStream.on("data", (chunk: Buffer) => {
      responses.push(chunk.toString("utf8"));
    });

    inStream.write(JSON.stringify({ jsonrpc: "2.0", id: "stream-1", method: "ping" }) + "\n");

    // Allow event loop tick
    await new Promise((r) => setTimeout(r, 50));

    assert.equal(responses.length, 1);
    const parsed = JSON.parse(responses[0].trim()) as JsonRpcResponse;
    assert.equal(parsed.id, "stream-1");
    assert.deepEqual(parsed.result, {});
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
