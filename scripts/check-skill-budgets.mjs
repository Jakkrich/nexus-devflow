#!/usr/bin/env node
// Skill Token-Budget and Portability Guard for Nexus-DevFlow
// Enforces Byte-Budget ceilings, description limits (<400 chars), and prompt hygiene.
// Run: node scripts/check-skill-budgets.mjs

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_SKILL_BYTE_BUDGET = 32 * 1024; // 32KB
export const DEFAULT_SUPPORT_MD_BYTE_BUDGET = 24 * 1024; // 24KB
export const DEFAULT_DESCRIPTION_CHAR_CAP = 400;
export const DEFAULT_WARN_AT = 0.9; // 90%

export const SKILL_BYTE_OVERRIDES = {
  // Granular grandfathered overrides if needed
};

export const SUPPORT_MD_OVERRIDES = {
  'diagram-design/references/primitive-icons.md': 128 * 1024, // Full SVG monochrome icon dictionary
  'diagram-design/references/type-line.md': 40 * 1024,
  'diagram-design/references/type-it-state.md': 36 * 1024,
  'diagram-design/references/type-process.md': 36 * 1024,
  'diagram-design/references/type-high-level.md': 36 * 1024,
  'diagram-design/references/type-medallion.md': 30 * 1024,
};

export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const raw = match[1];
  const result = {};

  const nameMatch = raw.match(/^name:\s*(.+)$/m);
  if (nameMatch) result.name = nameMatch[1].trim().replace(/^['"]|['"]$/g, '');

  const descMatch = raw.match(/^description:\s*["']?([\s\S]*?)["']?\s*$/m);
  if (descMatch) result.description = descMatch[1].trim().replace(/^"|"$/g, '');

  const toolsMatch = raw.match(/^allowed-tools:\s*(.+)$/m);
  if (toolsMatch) result.allowedTools = toolsMatch[1].trim();

  return result;
}

export function checkSkillBudgets(skillsDir, options = {}) {
  const skillBudget = options.skillBudget ?? DEFAULT_SKILL_BYTE_BUDGET;
  const supportBudget = options.supportBudget ?? DEFAULT_SUPPORT_MD_BYTE_BUDGET;
  const descCap = options.descCap ?? DEFAULT_DESCRIPTION_CHAR_CAP;
  const warnAt = options.warnThreshold ?? DEFAULT_WARN_AT;

  const violations = [];
  const warnings = [];
  const stats = [];

  if (!existsSync(skillsDir)) {
    return { violations, warnings, stats };
  }

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      const stat = statSync(p);
      if (stat.isDirectory()) {
        walk(p);
      } else if (entry.endsWith('.md')) {
        checkFile(p);
      }
    }
  }

  function checkFile(filePath) {
    const rel = filePath.slice(skillsDir.length).replace(/^[\\/]+/, '').replace(/\\/g, '/');
    const text = readFileSync(filePath, 'utf8');
    const isSkillMd = rel.endsWith('/SKILL.md') || rel === 'SKILL.md';
    const bytes = Buffer.byteLength(text, 'utf8');
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    stats.push({ rel, words, bytes, isSkillMd });

    if (isSkillMd) {
      const fm = parseFrontmatter(text);
      if (!fm.name) {
        violations.push(`${rel}: missing or invalid \`name\` in YAML frontmatter`);
      }
      if (!fm.description) {
        violations.push(`${rel}: missing or invalid \`description\` in YAML frontmatter`);
      } else {
        const descLen = fm.description.length;
        if (descLen > descCap) {
          violations.push(`${rel}: description is ${descLen} chars (cap ${descCap}) - it loads into every session`);
        } else if (descLen / descCap > warnAt) {
          warnings.push(`${rel}: description is ${descLen}/${descCap} chars (${(100 * descLen / descCap).toFixed(1)}% of cap)`);
        }
      }

      const skillName = rel.split('/')[0];
      const budget = SKILL_BYTE_OVERRIDES[skillName] ?? skillBudget;
      if (bytes > budget) {
        violations.push(`${rel}: ${bytes} bytes exceeds its budget of ${budget} (by ${bytes - budget} bytes)`);
      } else if (bytes / budget > warnAt) {
        warnings.push(`${rel}: ${bytes}/${budget} bytes (${(100 * bytes / budget).toFixed(1)}% of budget)`);
      }
    } else {
      const budget = SUPPORT_MD_OVERRIDES[rel] ?? supportBudget;
      if (bytes > budget) {
        violations.push(`${rel}: ${bytes} bytes exceeds its support-file budget of ${budget} (by ${bytes - budget} bytes)`);
      } else if (bytes / budget > warnAt) {
        warnings.push(`${rel}: ${bytes}/${budget} bytes (${(100 * bytes / budget).toFixed(1)}% of support budget)`);
      }
    }
  }

  walk(skillsDir);
  return { violations, warnings, stats };
}

// Direct CLI Invocation
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const targetDirs = [
    resolve('.agents/skills'),
    resolve('.claude/skills')
  ].filter(d => existsSync(d));

  let totalViolations = [];
  let totalWarnings = [];
  let allStats = [];

  for (const dir of targetDirs) {
    const res = checkSkillBudgets(dir);
    totalViolations.push(...res.violations.map(v => `[${dir.endsWith('.claude/skills') ? '.claude' : '.agents'}] ${v}`));
    totalWarnings.push(...res.warnings.map(w => `[${dir.endsWith('.claude/skills') ? '.claude' : '.agents'}] ${w}`));
    allStats.push(...res.stats);
  }

  if (totalViolations.length > 0) {
    console.error(`\n❌ Skill Token-Budget Check FAILED (${totalViolations.length} violations):`);
    for (const v of totalViolations) {
      console.error(`  - ${v}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`\n✅ Skill Token-Budget Check PASSED (All skills within byte ceilings)`);
  }

  // Heaviest 10 instruction files report
  const heaviest = allStats.sort((a, b) => b.bytes - a.bytes).slice(0, 10);
  console.log(`\n📊 Heaviest 10 Instruction Files:`);
  for (const s of heaviest) {
    const kb = (s.bytes / 1024).toFixed(1);
    console.log(`  - ${s.rel.padEnd(45)} ${String(s.words).padStart(5)} words · ${String(s.bytes).padStart(6)} B (${kb} KB)`);
  }

  if (totalWarnings.length > 0) {
    console.log(`\n⚠️ Warnings (>90% utilization):`);
    for (const w of totalWarnings) {
      console.log(`  - ${w}`);
    }
  }
}
