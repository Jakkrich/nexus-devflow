---
id: "{feature_slug}-feature-benchmark"
title: "Feature Benchmark: {Feature Name}"
doc_type: "benchmark"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"

artifact_language: "en"
related_feature: "{feature_slug}"
related_files: []
---

# Feature Benchmark: {Feature Name}

## 1. Purpose

- Prove that a DevFlow feature works and measure whether it improves, preserves, or worsens framework quality.

## 2. Scope

### Feature Under Test

- [Feature]

### Baseline

- [Baseline artifact or commit]

### Scenario

- [Scenario]

## 3. Command Evidence

| Command | Status | Duration Ms | Notes |
| :--- | :--- | ---: | :--- |
| `[command]` | `[pass/fail]` | 0 | `[notes]` |

## 4. Metrics

| Metric | Current | Baseline | Delta | Direction |
| :--- | ---: | ---: | ---: | :--- |
| validation_duration_ms | 0 | 0 | 0 | neutral |

## 5. Human Scorecard

| Dimension | Score 1-5 | Evidence |
| :--- | ---: | :--- |
| Routing quality | 3 | [Evidence] |
| Stage ownership | 3 | [Evidence] |
| Artifact completeness | 3 | [Evidence] |
| Validation coverage | 3 | [Evidence] |
| Operator clarity | 3 | [Evidence] |
| Regression risk | 3 | [Evidence] |

## 6. Verdict

- [pass/fail/blocked]

## 7. Additional Notes

- Add any extra headings below this section when useful.
