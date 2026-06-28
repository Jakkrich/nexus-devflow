# Feature Benchmark: feature-benchmark-standard

## 1. Summary

- Feature: `feature-benchmark-standard`
- Status: `pass`
- Commit: `e5f3a6a`
- Created: 2026-06-28T13:07:33.828Z
- Baseline: .workspaces\benchmarks\2026-06-28-feature-benchmark-standard.benchmark.json

## 2. Command Evidence

| Command | Status | Duration Ms | Exit Code |
| :--- | :--- | ---: | ---: |
| `npm.cmd run validate` | pass | 737 | 0 |
| `npm.cmd run validate:skills:test` | pass | 1027 | 0 |

## 3. Repository Metrics

| Metric | Current |
| :--- | ---: |
| workflow_count | 39 |
| skill_count | 87 |
| schema_template_count | 34 |
| public_companion_count | 9 |
| validation_script_count | 26 |

## 4. Human Scorecard

| Dimension | Score 1-5 | Evidence |
| :--- | ---: | :--- |
| routing_quality | 3 | Update after scenario review |
| stage_ownership | 3 | Update after scenario review |
| artifact_completeness | 3 | Update after scenario review |
| validation_coverage | 3 | Update after scenario review |
| operator_clarity | 3 | Update after scenario review |
| regression_risk | 3 | Update after scenario review |

## 5. Notes

- Automated benchmark captures command evidence and repository metrics.
- Update human_scores after running a real scenario with docs/feature-benchmark-scorecard.md.

## 6. Baseline Comparison

```json
{
  "command_duration_delta_ms": {
    "validate": 29,
    "validate:skills:test": 82
  },
  "repository_metric_delta": {
    "workflow_count": 0,
    "skill_count": 0,
    "schema_template_count": 0,
    "public_companion_count": 0,
    "validation_script_count": 1
  }
}
```

## 7. Verdict

- Benchmark command layer passed.

## 8. Additional Notes

- Use docs/feature-benchmark-scorecard.md to complete the human scenario review.
