# DevFlow Feature Benchmark Standard

Use this standard after adding or changing a DevFlow framework feature.

This is both a benchmark and an acceptance evaluation. Tests answer "does it still work?" A benchmark answers "is the framework measurably better, no worse, or riskier than before?"

## When To Run

Run the feature benchmark when a change affects any of these:

- workflow behavior
- stage artifacts or templates
- skill routing or imported skills
- validation rules
- release, report, or HTML rendering
- setup, install, or update behavior
- public companion commands

Documentation-only changes may skip the benchmark only when they do not change operating guidance, routing, artifact contracts, or validation.

## Benchmark Layers

| Layer | Question | Evidence |
| :--- | :--- | :--- |
| Contract | Did required files, schemas, and workflow rules stay valid? | `npm.cmd run validate` |
| Regression | Did focused regression checks pass? | feature-specific test scripts |
| Routing quality | Did the feature make the correct DevFlow route easier to choose? | scenario scorecard |
| Artifact quality | Did outputs stay markdown-first, complete, and resumable? | artifact review |
| Operational cost | Did commands become slower, noisier, or broader? | command duration and metric deltas |
| Trend | Is this better than the last comparable run? | JSON comparison against baseline |

## Required Metrics

Every feature benchmark should record:

- feature name
- git commit
- benchmark date
- commands run
- pass/fail status per command
- command duration in milliseconds
- routing score, 1-5
- artifact score, 1-5
- regression score, 1-5
- operator notes
- baseline comparison when available

Scoring guide:

| Score | Meaning |
| :--- | :--- |
| 5 | Clear improvement with no meaningful trade-off |
| 4 | Improvement with small accepted trade-off |
| 3 | Neutral, safe, no measurable improvement |
| 2 | Works but adds complexity or ambiguity |
| 1 | Regression or unacceptable uncertainty |

## Standard Command

Run from the framework root:

```powershell
npm.cmd run benchmark:feature -- --feature <slug>
```

Compare with a previous run:

```powershell
npm.cmd run benchmark:feature -- --feature <slug> --baseline .workspaces/benchmarks/<previous>.benchmark.json
```

The command writes:

```text
.workspaces/benchmarks/{date}-{slug}.benchmark.md
.workspaces/benchmarks/{date}-{slug}.benchmark.json
```

## Baseline Rules

- Use the most recent successful benchmark for the same feature family as baseline.
- When a feature is new, record the first run as the baseline.
- If a metric gets worse, explain whether the trade-off is intentional.
- If a command fails, the benchmark fails even when qualitative scores look good.

## Required Human Review

Automation cannot fully measure workflow quality. Each benchmark must include a short human review:

- Did routing become easier or more confusing?
- Did the feature preserve stage ownership?
- Did artifacts become more complete or more noisy?
- Did validation catch the right failure mode?
- Would a future contributor know what to do from the generated evidence?

Use `docs/feature-benchmark-scorecard.md` for the review rubric.

## Release Gate

A DevFlow feature is ready to merge or release when:

- core validation passes
- focused regression checks pass
- benchmark markdown and JSON artifacts exist
- no required score is below 3 unless the trade-off is explicitly accepted
- any negative baseline delta is explained
