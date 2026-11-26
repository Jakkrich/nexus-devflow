---
description: pstack per-role model choices (overrides skill defaults)
trigger: always_on
---
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit subagent `Model`). Alias entries in a panel list still count toward its fan-out.
# defaults: 2
# budget: large (xhigh)
feature, refactoring: claude-opus-5-5-high
bug-fix: claude-opus-5-5-high
perf-issue: claude-opus-5-5-high
hillclimb: claude-opus-5-5-high
judgment and prose: claude-opus-5-5-high
hardest tasks: gemini-4-hydrogen-xhigh
reflect tooling: claude-opus-5-5-high
reflect judgment, divergent, synthesizer: claude-opus-5-5-high
arena runners: gemini-4-hydrogen-xhigh, claude-opus-5-5-high, gemini-4-carbon-high
arena cross-judge pool: gemini-4-hydrogen-xhigh, claude-opus-5-5-high, gemini-4-carbon-high
swarm workers: claude-opus-5-5-high
architect runners: gemini-4-hydrogen-xhigh, claude-opus-5-5-high, gemini-4-carbon-high
interrogate reviewers: gemini-4-hydrogen-xhigh, claude-opus-5-5-high, gemini-4-carbon-high
