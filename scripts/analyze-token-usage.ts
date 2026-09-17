#!/usr/bin/env node
/**
 * Token Usage and Cost Analytics Engine for AI Coding Agents
 * Analyzes session transcripts, token breakdown (input, cache write, cache read, output),
 * calculates USD cost per model, and measures prompt caching savings.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

export interface UsageBucket {
  input: number;
  cacheWrite: number;
  cacheRead: number;
  output: number;
  turns: number;
  webSearch: number;
  webFetch: number;
}

export interface ModelPricing {
  name: string;
  provider: string;
  inputPerMillion: number;
  cacheWritePerMillion: number;
  cacheReadPerMillion: number;
  outputPerMillion: number;
}

export const MODEL_PRICING_CATALOG: Record<string, ModelPricing> = {
  'claude-3-7-sonnet': {
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    inputPerMillion: 3.0,
    cacheWritePerMillion: 3.75,
    cacheReadPerMillion: 0.30,
    outputPerMillion: 15.0
  },
  'claude-3-5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPerMillion: 3.0,
    cacheWritePerMillion: 3.75,
    cacheReadPerMillion: 0.30,
    outputPerMillion: 15.0
  },
  'claude-3-5-haiku': {
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    inputPerMillion: 0.80,
    cacheWritePerMillion: 1.00,
    cacheReadPerMillion: 0.08,
    outputPerMillion: 4.00
  },
  'gemini-2.5-pro': {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    inputPerMillion: 1.25,
    cacheWritePerMillion: 1.25,
    cacheReadPerMillion: 0.3125,
    outputPerMillion: 5.00
  },
  'gemini-2.5-flash': {
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    inputPerMillion: 0.075,
    cacheWritePerMillion: 0.075,
    cacheReadPerMillion: 0.01875,
    outputPerMillion: 0.30
  },
  'gpt-4o': {
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPerMillion: 2.50,
    cacheWritePerMillion: 2.50,
    cacheReadPerMillion: 1.25,
    outputPerMillion: 10.00
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputPerMillion: 0.15,
    cacheWritePerMillion: 0.15,
    cacheReadPerMillion: 0.075,
    outputPerMillion: 0.60
  },
  'deepseek-v3': {
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    inputPerMillion: 0.27,
    cacheWritePerMillion: 0.27,
    cacheReadPerMillion: 0.07,
    outputPerMillion: 1.10
  }
};

export const DEFAULT_COST_WEIGHTS = {
  input: 1.0,
  cacheWrite: 1.25,
  cacheRead: 0.1,
  output: 5.0
};

export function createBlankUsage(): UsageBucket {
  return { input: 0, cacheWrite: 0, cacheRead: 0, output: 0, turns: 0, webSearch: 0, webFetch: 0 };
}

export function calculateCostUnits(usage: Partial<UsageBucket>, weights = DEFAULT_COST_WEIGHTS): number {
  return Math.round(
    (usage.input || 0) * weights.input +
    (usage.cacheWrite || 0) * weights.cacheWrite +
    (usage.cacheRead || 0) * weights.cacheRead +
    (usage.output || 0) * weights.output
  );
}

export interface CostCalculationResult {
  modelName: string;
  provider: string;
  actualCostUSD: number;
  uncachedCostUSD: number;
  savingsUSD: number;
  savingsPercent: number;
  costBreakdownUSD: {
    input: number;
    cacheWrite: number;
    cacheRead: number;
    output: number;
  };
}

export function calculateModelCost(usage: UsageBucket, modelKey = 'claude-3-7-sonnet'): CostCalculationResult {
  const pricing = MODEL_PRICING_CATALOG[modelKey] || MODEL_PRICING_CATALOG['claude-3-7-sonnet'];
  
  const inputCost = ((usage.input || 0) / 1_000_000) * pricing.inputPerMillion;
  const cacheWriteCost = ((usage.cacheWrite || 0) / 1_000_000) * pricing.cacheWritePerMillion;
  const cacheReadCost = ((usage.cacheRead || 0) / 1_000_000) * pricing.cacheReadPerMillion;
  const outputCost = ((usage.output || 0) / 1_000_000) * pricing.outputPerMillion;
  
  const actualCostUSD = inputCost + cacheWriteCost + cacheReadCost + outputCost;
  
  // Hypothetical uncached cost if all cached reads were full fresh inputs
  const totalInputTokens = (usage.input || 0) + (usage.cacheWrite || 0) + (usage.cacheRead || 0);
  const uncachedCostUSD = (totalInputTokens / 1_000_000) * pricing.inputPerMillion + outputCost;
  
  const savingsUSD = Math.max(0, uncachedCostUSD - actualCostUSD);
  const savingsPercent = uncachedCostUSD > 0 ? Math.round((savingsUSD / uncachedCostUSD) * 100) : 0;

  return {
    modelName: pricing.name,
    provider: pricing.provider,
    actualCostUSD: Number(actualCostUSD.toFixed(4)),
    uncachedCostUSD: Number(uncachedCostUSD.toFixed(4)),
    savingsUSD: Number(savingsUSD.toFixed(4)),
    savingsPercent,
    costBreakdownUSD: {
      input: Number(inputCost.toFixed(4)),
      cacheWrite: Number(cacheWriteCost.toFixed(4)),
      cacheRead: Number(cacheReadCost.toFixed(4)),
      output: Number(outputCost.toFixed(4))
    }
  };
}

export function addUsage(acc: UsageBucket, u: Record<string, any>): void {
  if (!u) return;
  acc.input += u.input_tokens || u.inputTokens || 0;
  acc.cacheWrite += u.cache_creation_input_tokens || u.cacheCreationInputTokens || 0;
  acc.cacheRead += u.cache_read_input_tokens || u.cacheReadInputTokens || 0;
  acc.output += u.output_tokens || u.outputTokens || 0;
  acc.turns += 1;
  const st = u.server_tool_use || {};
  acc.webSearch += st.web_search_requests || 0;
  acc.webFetch += st.web_fetch_requests || 0;
}

export interface ParsedTurn {
  sidechain: boolean;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  input: number;
  tools: string[];
}

export interface ParsedSpawn {
  type: string;
  desc: string;
}

export interface TranscriptAnalysisResult {
  targetFile: string;
  main: UsageBucket;
  sub: UsageBucket;
  all: UsageBucket;
  spawns: ParsedSpawn[];
  turns: ParsedTurn[];
  costs: Record<string, CostCalculationResult>;
}

export function parseTranscriptUsage(filePath: string): TranscriptAnalysisResult {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter(Boolean);

  const main = createBlankUsage();
  const sub = createBlankUsage();
  const spawns: ParsedSpawn[] = [];
  const turns: ParsedTurn[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    let e: Record<string, any>;
    try {
      e = JSON.parse(line);
    } catch {
      continue;
    }

    const messageContent = e.message && e.message.content;
    const tools: string[] = [];
    if (Array.isArray(messageContent)) {
      for (const c of messageContent) {
        if (c.type === 'tool_use' || c.type === 'tool_call') {
          const toolName = c.name || (c.function && c.function.name) || 'unknown';
          tools.push(toolName);
          if (toolName === 'Agent' || toolName === 'Task' || toolName === 'invoke_subagent') {
            spawns.push({
              type: (c.input && (c.input.subagent_type || c.input.role)) || 'subagent',
              desc: (c.input && (c.input.description || c.input.task)) || ''
            });
          }
        }
      }
    }

    if ((e.type !== 'assistant' && e.role !== 'assistant') || !e.message || !e.message.usage) continue;

    const dedupeKey = e.requestId || e.uuid || e.id;
    if (dedupeKey && seen.has(dedupeKey)) continue;
    if (dedupeKey) seen.add(dedupeKey);

    const u = e.message.usage;
    const isSub = Boolean(e.isSidechain || e.is_subagent || e.subagent);
    const bucket = isSub ? sub : main;
    addUsage(bucket, u);

    turns.push({
      sidechain: isSub,
      output: u.output_tokens || u.outputTokens || 0,
      cacheRead: u.cache_read_input_tokens || u.cacheReadInputTokens || 0,
      cacheWrite: u.cache_creation_input_tokens || u.cacheCreationInputTokens || 0,
      input: u.input_tokens || u.inputTokens || 0,
      tools
    });
  }

  const all = createBlankUsage();
  for (const k of Object.keys(all) as (keyof UsageBucket)[]) {
    all[k] = main[k] + sub[k];
  }

  // Calculate costs across popular models
  const costs: Record<string, CostCalculationResult> = {};
  for (const modelKey of Object.keys(MODEL_PRICING_CATALOG)) {
    costs[modelKey] = calculateModelCost(all, modelKey);
  }

  return { targetFile: filePath, main, sub, all, spawns, turns, costs };
}

export function formatTokenNumber(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

export function formatTokenTable(result: TranscriptAnalysisResult, selectedModel = 'claude-3-7-sonnet', topN = 10): string {
  const k = formatTokenNumber;
  const lines: string[] = [];

  lines.push(`\n📄 Transcript: ${result.targetFile}`);
  lines.push(`Assistant Turns: ${result.all.turns} (Main Thread: ${result.main.turns}, Subagents: ${result.sub.turns})\n`);

  function formatRow(label: string, a: UsageBucket) {
    const rawTotal = a.input + a.cacheWrite + a.cacheRead + a.output;
    const costUnits = calculateCostUnits(a);
    lines.push(`  ${label.padEnd(14)} fresh ${k(a.input).padStart(6)} · cache-write ${k(a.cacheWrite).padStart(6)} · cache-read ${k(a.cacheRead).padStart(7)} · output ${k(a.output).padStart(6)}`);
    lines.push(`  ${''.padEnd(14)} raw total: ${k(rawTotal)} · cost units: ${k(costUnits)} · turns: ${a.turns}\n`);
  }

  lines.push(`TOKENS BY THREAD:`);
  formatRow('Main Thread', result.main);
  formatRow('Subagents', result.sub);
  formatRow('TOTAL', result.all);

  const rawTotal = result.all.input + result.all.cacheWrite + result.all.cacheRead + result.all.output;
  if (rawTotal > 0) {
    const cacheReadPct = Math.round((result.all.cacheRead / rawTotal) * 100);
    const outCostPct = Math.round(((result.all.output * DEFAULT_COST_WEIGHTS.output) / (calculateCostUnits(result.all) || 1)) * 100);
    lines.push(`💡 Cost Insight: ${cacheReadPct}% of raw tokens were cache reads (prompt caching).`);
    lines.push(`   Output generation accounts for ~${outCostPct}% of relative billed weight.\n`);
  }

  // Model Cost Breakdown Table
  const cost = result.costs[selectedModel] || calculateModelCost(result.all, selectedModel);
  lines.push(`💵 ESTIMATED MODEL COST (${cost.modelName} - ${cost.provider}):`);
  lines.push(`  Actual Cost (with Caching) : $${cost.actualCostUSD.toFixed(4)} USD`);
  lines.push(`  Uncached Baseline Cost     : $${cost.uncachedCostUSD.toFixed(4)} USD`);
  lines.push(`  Estimated Savings          : $${cost.savingsUSD.toFixed(4)} USD (${cost.savingsPercent}% saved)\n`);

  if (result.spawns.length > 0) {
    lines.push(`🤖 Subagents Spawned (${result.spawns.length}):`);
    for (const s of result.spawns) {
      lines.push(`  - [${s.type}] ${s.desc}`);
    }
    lines.push('');
  }

  if (result.turns.length > 0) {
    const heaviest = [...result.turns].sort((a, b) => b.output - a.output).slice(0, topN);
    lines.push(`🔥 Heaviest ${heaviest.length} Turns (by output tokens):`);
    for (const t of heaviest) {
      const loc = t.sidechain ? 'sub ' : 'main';
      const tools = t.tools.length ? `[${[...new Set(t.tools)].join(', ')}]` : '';
      lines.push(`  ${loc}  out: ${k(t.output).padStart(6)} · cache-read: ${k(t.cacheRead).padStart(7)} · ${tools}`);
    }
  }

  return lines.join('\n');
}

// CLI Execution Handler
const isMain = process.argv[1] && (
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url)) ||
  process.argv[1].endsWith('analyze-token-usage.ts') ||
  process.argv[1].endsWith('analyze-token-usage.mjs')
);

if (isMain) {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');
  const positional = args.find(a => !a.startsWith('--') && (a.endsWith('.jsonl') || a.endsWith('.json')));
  const topFlagIdx = args.indexOf('--top');
  const TOP = topFlagIdx >= 0 && args[topFlagIdx + 1] ? Number(args[topFlagIdx + 1]) : 10;
  const modelFlagIdx = args.indexOf('--model');
  const selectedModel = modelFlagIdx >= 0 && args[modelFlagIdx + 1] ? args[modelFlagIdx + 1] : 'claude-3-7-sonnet';

  let targetFile = positional;
  if (!targetFile) {
    const candidates = [
      join(homedir(), '.claude', 'projects'),
      join(homedir(), '.gemini', 'antigravity-ide', 'brain')
    ];
    for (const root of candidates) {
      if (existsSync(root)) {
        try {
          const findRecent = (dir: string): { path: string; mtime: number }[] => {
            const files: { path: string; mtime: number }[] = [];
            for (const f of readdirSync(dir)) {
              const full = join(dir, f);
              const stat = statSync(full);
              if (stat.isDirectory()) {
                files.push(...findRecent(full));
              } else if (f.endsWith('.jsonl')) {
                files.push({ path: full, mtime: stat.mtimeMs });
              }
            }
            return files;
          };
          const allFound = findRecent(root).sort((a, b) => b.mtime - a.mtime);
          if (allFound.length > 0) {
            targetFile = allFound[0].path;
            break;
          }
        } catch {
          // ignore scan error
        }
      }
    }
  }

  if (!targetFile || !existsSync(targetFile)) {
    if (isJson) {
      console.log(JSON.stringify({ error: 'No active .jsonl transcript found to auto-inspect' }));
    } else {
      console.log(`Usage: npx nexus-devflow analyze-tokens <path-to-transcript.jsonl> [--json] [--model <model>] [--top 10]`);
      console.log(`No active .jsonl transcript found to auto-inspect.`);
    }
    process.exit(0);
  }

  const result = parseTranscriptUsage(targetFile);

  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatTokenTable(result, selectedModel, TOP));
  }
}
