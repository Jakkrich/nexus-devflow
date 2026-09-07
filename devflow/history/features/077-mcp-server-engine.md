# Living Spec: 077-mcp-server-engine

> **Status**: In Progress  
> **Phase**: 04 Upkeep & Refactoring (ADR-0008)  
> **Track**: Fast-Track Refactor  
> **Testing Seam**: `McpServerEngine.handleMessage()` in-memory message seam (`packages/create-nexus-devflow/lib/mcp-server-engine.ts`)

---

## 1. Context & Architecture Seam

`packages/create-nexus-devflow/lib/mcp.ts` is a 735-line procedural file combining raw readline stdin/stdout streams with a 15-case switch statement and importing deprecated modules (`branch-context.js`, `gatekeeper.js`, `drift-reconciler.js`, `webview-studio.js`).

### The New Deep Module:
- **`McpServerEngine`**: Encapsulates JSON-RPC protocol handling, schema validation, and tool dispatching behind an in-memory seam:
  - `handleMessage(request: JsonRpcRequest): Promise<JsonRpcResponse>`
  - `registerTool(definition: McpToolDefinition, handler: ToolHandler): void`
  - `listen(input: Readable, output: Writable): () => void`
- **Tool Registry**: All 15 DevFlow MCP tools are registered cleanly with their schemas and handlers.
- **Deep Engine Integration**:
  - `devflow_get_active_context`: uses `ActiveContextEngine.getActiveContext()`
  - `devflow_evaluate_gate`: uses `GatekeeperEngine.evaluateGate()`
  - `devflow_reconcile_state`: uses `GatekeeperEngine.reconcileState()`
  - `devflow_get_studio_html`: uses `StudioViewRenderer.renderWebviewStudio()`

---

## 2. Invariants & Acceptance Criteria

1. **Protocol Fidelity**: Implements JSON-RPC 2.0 (`initialize`, `tools/list`, `tools/call`, `ping`) with 100% backward compatibility for all MCP clients.
2. **Eliminate Deprecated Imports**: No imports of deprecated files (`branch-context.js`, `gatekeeper.js`, `drift-reconciler.js`, `webview-studio.js`).
3. **In-Memory Testability**: Every tool can be tested by dispatching JSON-RPC requests to `engine.handleMessage()` directly without streams.
4. **All Tests Pass**: Existing MCP tests in `test/mcp.test.ts` must pass without regressions, along with new unit tests in `test/mcp-server-engine.test.ts`.

---

## 3. Tasks & Tracer-Bullet Tickets

- [x] **Ticket 01**: Implement `McpServerEngine` core with in-memory `handleMessage` and protocol lifecycle (`initialize`, `tools/list`, `tools/call`, `ping`).
- [x] **Ticket 02**: Register all 15 DevFlow MCP tools with typed handlers delegating to `ActiveContextEngine`, `GatekeeperEngine`, and `StudioViewRenderer`.
- [x] **Ticket 03**: Wire `mcp.ts` as a thin transport facade exporting `startMcpServer`, `DEVFLOW_MCP_TOOLS`, and re-exporting `McpServerEngine`.
- [x] **Ticket 04**: Implement unit tests in `packages/create-nexus-devflow/test/mcp-server-engine.test.ts`.
