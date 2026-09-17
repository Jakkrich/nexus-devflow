import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { calculateCostUnits, parseTranscriptUsage } from "../analyze-token-usage.mjs";

test("calculateCostUnits applies standard Anthropic/AI cost weights accurately", () => {
  const usage = {
    input: 1000,       // 1000 * 1.0 = 1000
    cacheWrite: 2000,  // 2000 * 1.25 = 2500
    cacheRead: 10000,  // 10000 * 0.1 = 1000
    output: 500        // 500 * 5.0 = 2500
  };

  const cost = calculateCostUnits(usage);
  assert.equal(cost, 7000);
});

test("parseTranscriptUsage parses JSONL transcript and separates main vs subagent turns", () => {
  const transcriptLines = [
    JSON.stringify({
      type: "assistant",
      requestId: "req-1",
      message: {
        content: [{ type: "text", text: "Hello" }],
        usage: {
          input_tokens: 100,
          cache_creation_input_tokens: 50,
          cache_read_input_tokens: 500,
          output_tokens: 40
        }
      }
    }),
    JSON.stringify({
      type: "assistant",
      requestId: "req-2",
      isSidechain: true,
      message: {
        content: [{ type: "tool_use", name: "Read", input: { path: "foo.txt" } }],
        usage: {
          input_tokens: 200,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 300,
          output_tokens: 80
        }
      }
    })
  ];

  const tempFile = path.resolve("devflow/tmp/test-transcript.jsonl");
  fs.mkdirSync(path.dirname(tempFile), { recursive: true });
  fs.writeFileSync(tempFile, transcriptLines.join("\n"), "utf8");

  try {
    const result = parseTranscriptUsage(tempFile);
    assert.equal(result.main.input, 100);
    assert.equal(result.main.output, 40);
    assert.equal(result.sub.input, 200);
    assert.equal(result.sub.output, 80);
    assert.equal(result.all.output, 120);
    assert.equal(result.turns.length, 2);
  } finally {
    fs.rmSync(tempFile, { force: true });
  }
});
