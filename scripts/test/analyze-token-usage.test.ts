import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  calculateCostUnits,
  calculateModelCost,
  createBlankUsage,
  formatTokenTable,
  parseTranscriptUsage,
  MODEL_PRICING_CATALOG
} from "../analyze-token-usage.js";

test("AC-1: calculateCostUnits applies standard Anthropic/AI cost weights accurately", () => {
  const usage = {
    input: 1000,       // 1000 * 1.0 = 1000
    cacheWrite: 2000,  // 2000 * 1.25 = 2500
    cacheRead: 10000,  // 10000 * 0.1 = 1000
    output: 500        // 500 * 5.0 = 2500
  };

  const cost = calculateCostUnits(usage);
  assert.equal(cost, 7000);
});

test("AC-1: calculateModelCost calculates USD pricing and cache savings correctly across models", () => {
  const usage = {
    input: 1_000_000,      // 1M fresh input
    cacheWrite: 500_000,   // 0.5M cache write
    cacheRead: 8_000_000,  // 8M cache read
    output: 100_000,       // 0.1M output
    turns: 10,
    webSearch: 0,
    webFetch: 0
  };

  // Claude 3.7 Sonnet: $3/M input, $3.75/M cache write, $0.30/M cache read, $15/M output
  // Actual = (1 * 3) + (0.5 * 3.75) + (8 * 0.3) + (0.1 * 15) = 3 + 1.875 + 2.4 + 1.5 = 8.775 USD
  // Uncached = (9.5 * 3) + (0.1 * 15) = 28.5 + 1.5 = 30.0 USD
  // Savings = 30.0 - 8.775 = 21.225 USD (approx 71%)
  const sonnetCost = calculateModelCost(usage, 'claude-3-7-sonnet');
  assert.equal(sonnetCost.actualCostUSD, 8.775);
  assert.equal(sonnetCost.uncachedCostUSD, 30.0);
  assert.equal(sonnetCost.savingsUSD, 21.225);
  assert.equal(sonnetCost.savingsPercent, 71);

  // Gemini 2.5 Flash: $0.075/M input, $0.01875/M cache read, $0.30/M output
  const flashCost = calculateModelCost(usage, 'gemini-2.5-flash');
  assert.ok(flashCost.actualCostUSD > 0);
  assert.ok(flashCost.savingsPercent > 0);
});

test("AC-2: parseTranscriptUsage parses JSONL transcript and separates main vs subagent turns", () => {
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
    assert.ok(result.costs['claude-3-7-sonnet']);

    // Check formatting
    const formatted = formatTokenTable(result, 'claude-3-7-sonnet', 5);
    assert.ok(formatted.includes('Main Thread'));
    assert.ok(formatted.includes('Subagents'));
    assert.ok(formatted.includes('ESTIMATED MODEL COST'));
  } finally {
    fs.rmSync(tempFile, { force: true });
  }
});

test("AC-3: handles zero values and empty transcripts cleanly", () => {
  const blank = createBlankUsage();
  const cost = calculateCostUnits(blank);
  assert.equal(cost, 0);

  const modelCost = calculateModelCost(blank, 'gemini-2.5-pro');
  assert.equal(modelCost.actualCostUSD, 0);
  assert.equal(modelCost.savingsUSD, 0);
  assert.equal(modelCost.savingsPercent, 0);
});
