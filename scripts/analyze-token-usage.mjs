#!/usr/bin/env node
// Token-usage analyzer for AI coding agent session transcripts
// Breaks down cost by thread (main vs subagent), cache vs fresh input, and computes cost units.
// Usage:
//   node scripts/analyze-token-usage.mjs <file.jsonl>
//   node scripts/analyze-token-usage.mjs --top 15

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

export const COST_WEIGHTS = {
  input: 1.0,
  cacheWrite: 1.25,
  cacheRead: 0.1,
  output: 5.0
};

export function calculateCostUnits(usage) {
  return Math.round(
    (usage.input || 0) * COST_WEIGHTS.input +
    (usage.cacheWrite || 0) * COST_WEIGHTS.cacheWrite +
    (usage.cacheRead || 0) * COST_WEIGHTS.cacheRead +
    (usage.output || 0) * COST_WEIGHTS.output
  );
}

export function createBlankUsage() {
  return { input: 0, cacheWrite: 0, cacheRead: 0, output: 0, turns: 0, webSearch: 0, webFetch: 0 };
}

export function addUsage(acc, u) {
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

export function parseTranscriptUsage(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter(Boolean);

  const main = createBlankUsage();
  const sub = createBlankUsage();
  const spawns = [];
  const turns = [];
  const seen = new Set();

  for (const line of lines) {
    let e;
    try {
      e = JSON.parse(line);
    } catch {
      continue;
    }

    const messageContent = e.message && e.message.content;
    const tools = [];
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
  for (const k of Object.keys(all)) {
    all[k] = main[k] + sub[k];
  }

  return { main, sub, all, spawns, turns };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const args = process.argv.slice(2);
  const positional = args.find(a => !a.startsWith('--') && a.endsWith('.jsonl'));
  const topFlagIdx = args.indexOf('--top');
  const TOP = topFlagIdx >= 0 && args[topFlagIdx + 1] ? Number(args[topFlagIdx + 1]) : 10;

  let targetFile = positional;
  if (!targetFile) {
    // Check possible local sessions in ~/.claude/projects or current directory
    const candidates = [
      join(homedir(), '.claude', 'projects'),
      join(homedir(), '.gemini', 'antigravity-ide', 'brain')
    ];
    for (const root of candidates) {
      if (existsSync(root)) {
        try {
          const findRecent = (dir) => {
            const files = [];
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
    console.log(`Usage: node scripts/analyze-token-usage.mjs <path-to-transcript.jsonl> [--top 10]`);
    console.log(`No active .jsonl transcript found to auto-inspect.`);
    process.exit(0);
  }

  const k = n => (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n));
  const result = parseTranscriptUsage(targetFile);

  console.log(`\n📄 Transcript: ${targetFile}`);
  console.log(`Assistant Turns: ${result.all.turns} (Main Thread: ${result.main.turns}, Subagents: ${result.sub.turns})\n`);

  function printRow(label, a) {
    const rawTotal = a.input + a.cacheWrite + a.cacheRead + a.output;
    const cost = calculateCostUnits(a);
    console.log(`  ${label.padEnd(14)} fresh ${k(a.input).padStart(6)} · cache-write ${k(a.cacheWrite).padStart(6)} · cache-read ${k(a.cacheRead).padStart(7)} · output ${k(a.output).padStart(6)}`);
    console.log(`  ${''.padEnd(14)} raw total: ${k(rawTotal)} · cost units: ${k(cost)} · turns: ${a.turns}\n`);
  }

  console.log(`TOKENS BY THREAD:`);
  printRow('Main Thread', result.main);
  printRow('Subagents', result.sub);
  printRow('TOTAL', result.all);

  const rawTotal = result.all.input + result.all.cacheWrite + result.all.cacheRead + result.all.output;
  if (rawTotal > 0) {
    const cacheReadPct = Math.round((result.all.cacheRead / rawTotal) * 100);
    const outCostPct = Math.round(((result.all.output * COST_WEIGHTS.output) / (calculateCostUnits(result.all) || 1)) * 100);
    console.log(`💡 Cost Insight: ${cacheReadPct}% of raw tokens were cache reads (billed ~10% of fresh input).`);
    console.log(`   Output generation accounts for ~${outCostPct}% of the billed cost units.`);
  }

  if (result.spawns.length > 0) {
    console.log(`\n🤖 Subagents Spawned (${result.spawns.length}):`);
    for (const s of result.spawns) {
      console.log(`  - [${s.type}] ${s.desc}`);
    }
  }

  if (result.turns.length > 0) {
    const heaviest = result.turns.sort((a, b) => b.output - a.output).slice(0, TOP);
    console.log(`\n🔥 Heaviest ${heaviest.length} Turns (by output tokens):`);
    for (const t of heaviest) {
      const loc = t.sidechain ? 'sub ' : 'main';
      const tools = t.tools.length ? `[${[...new Set(t.tools)].join(', ')}]` : '';
      console.log(`  ${loc}  out: ${k(t.output).padStart(6)} · cache-read: ${k(t.cacheRead).padStart(7)} · ${tools}`);
    }
  }
}
