---
id: "DISC-20260819-004-devflow-extension-mcp-hub"
title: "Discover: Nexus-DevFlow IDE Extension Visual MCP Server Hub & Tool Sandbox GUI"
doc_type: "discovery"
stage: "00-discover"
created: "2026-08-19"
updated: "2026-08-19"
owner: "User & Antigravity"
status: "draft"
artifact_language: "th"
decision: "Proceed"
selected_route: "Direct decision"
related_runs:
  - "RUN-015-devflow-ide-extension-mcp-hub"
related_files:
  - "devflow/research/brainstorm-devflow-extension.md"
  - "extensions/vscode/src/extension.ts"
---

# Discover: Nexus-DevFlow IDE Extension Visual MCP Server Hub & Tool Sandbox GUI

## 1. Objective

- สำรวจและออกแบบสถาปัตยกรรมสำหรับ **Visual MCP Server Hub & Tool Sandbox GUI** เพื่อให้ Developer สามารถตรวจสอบสถานะ MCP Servers, ทดสอบยิง Request เข้า MCP Tools ผ่าน GUI Form, และแก้ไขการตั้งค่า MCP Config ได้โดยตรงจากใน IDE

## 2. Source Inputs

- User Request: Autopilot RUN-015 ถึง RUN-017
- Brainstorm Doc: `devflow/research/brainstorm-devflow-extension.md` (แกนที่ 5: MCP Hub & Tool Manager)
- Existing Extension Codebase: `extensions/vscode/` (v0.3.0)

## 3. Project Context To Preserve

- **Standard MCP Config Compatibility:** รองรับการอ่านและแก้ไขไฟล์ `mcp_config.json` ทั้งระดับ Workspace (`.nexus/mcp_config.json` หรือ `mcp_config.json`) และ Global (`.gemini/antigravity-ide/mcp`)
- **Safe Sandbox Execution:** การทดสอบ Tool ทำผ่าน Environment ที่ปลอดภัยและแสดงผล JSON คมชัด
- **Non-blocking UI:** โหลดรายชื่อ Tools และ Server Status แบบ Async

## 4. Problem Or Opportunity

- **ปัญหา:** ผู้ใช้และ Agent ไม่สามารถตรวจสอบสถานะและทดสอบ Tools ของ MCP Servers ได้ง่ายๆ ต้องเปิด Config แก้ไข JSON ดิบและเดา Arguments
- **โอกาส:** การมี Visual Hub & Sandbox ใน IDE ช่วยให้ทดสอบเครื่องมือก่อนให้ Agent ใช้งานได้อย่างมั่นใจ

## 5. Candidate Delivery Slices

- **`RUN-015`:** Visual MCP Server Hub, Tool Sandbox Webview & Config Manager

## 6. Decision

- Status: `Proceed`
- Allocated Run: `RUN-015-devflow-ide-extension-mcp-hub`

## 7. Approval Status

- Approved (Autopilot Loop)
