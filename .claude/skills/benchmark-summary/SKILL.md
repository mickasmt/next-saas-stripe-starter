# Benchmark Summary

## Invocation
`/benchmark-summary`

No arguments needed.

## Description
Reads all benchmark run results from `benchmark/results.json` and outputs a formatted comparison table showing Ritual vs Claude-Only performance across all runs.

## Instructions

### Step 1: Read Results

Read `benchmark/results.json`. If the file is empty or contains `[]`, output:

```
No benchmark runs found. Run /ritual-benchmark-with-ritual or /ritual-benchmark-claude-only first.
```

### Step 2: Group by Epic

Group results by `epic` field. For each epic, separate into `ritual` and `claude-only` variants.

### Step 3: Output Comparison

For each epic, output a comparison table:

```markdown
## Benchmark Results: <epic-name>

### Run History

| Run ID | Variant | Rounds | Commits | Corrections | Verdict | AC Pass Rate |
|--------|---------|--------|---------|-------------|---------|--------------|
| run-... | ritual | 3 | 5 | 2 | SATISFIES | 8/10 |
| run-... | claude-only | 5 | 7 | 4 | MAX_ROUNDS | 6/10 |

### Head-to-Head (Latest Runs)

| Metric | Ritual | Claude-Only | Delta |
|--------|--------|-------------|-------|
| Review Rounds | 3 | 5 | -2 (fewer is better) |
| Total Commits | 5 | 7 | -2 |
| Corrections | 2 | 4 | -2 |
| Final Verdict | SATISFIES | MAX_ROUNDS | Ritual wins |
| AC Pass Rate | 8/10 | 6/10 | +2 criteria |

### Acceptance Criteria Breakdown (Latest Runs)

| # | Criterion | Ritual | Claude-Only |
|---|-----------|--------|-------------|
| AC-1 | Database Schema | PASS | PASS |
| AC-2 | Auth Session Extension | PASS | PARTIAL |
| ... | ... | ... | ... |
```

### Step 4: Aggregate Stats (if multiple runs exist)

If there are multiple runs per variant, also show averages:

```markdown
### Averages Across All Runs

| Metric | Ritual (avg) | Claude-Only (avg) |
|--------|-------------|-------------------|
| Review Rounds | 2.5 | 4.0 |
| Corrections | 1.5 | 3.5 |
| AC Pass Rate | 85% | 65% |
| SATISFIES Rate | 100% | 50% |
```

### Step 5: Key Insights

End with a brief analysis:
- Which variant required fewer correction rounds?
- Which acceptance criteria were consistently harder for each variant?
- Any patterns in what Ritual-guided implementations get right that Claude-only misses (or vice versa)?

## Important Rules
- **Read-only**: This skill only reads data and outputs analysis. It does not modify any files.
- **Handle missing data gracefully**: If only one variant has been run, show what's available without failing.
- **PR links**: Include PR URLs so the user can inspect the actual diffs.
