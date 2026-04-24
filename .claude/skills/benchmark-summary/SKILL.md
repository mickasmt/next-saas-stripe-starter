---
name: benchmark-summary
description: Read benchmark results and output a comparison table showing Ritual vs Claude-Only performance across Product Owner and Tech Lead review tracks.
user-invocable: true
---

# Benchmark Summary

## Invocation
`/benchmark-summary`

No arguments needed.

## Instructions

### Step 1: Read Results

Read `benchmark/results.json`. If empty or `[]`, output:
```
No benchmark runs found. Run /ritual-benchmark-with-ritual or /ritual-benchmark-claude-only first.
```

### Step 2: Handle Mixed Formats

Results may contain entries in two formats:
- **Legacy** (single reviewer): has `criteria_results` at top level, no `product_review`/`technical_review`
- **Current** (dual reviewer): has `product_review` and `technical_review` objects

Handle both gracefully. For legacy entries, treat them as technical-only.

### Step 3: Output Comparison

For each epic, output:

```markdown
## Benchmark Results: <epic-name>

### Run History

| Run ID | Variant | Rounds | Commits | PO Passed | Tech Passed | Final Verdict |
|--------|---------|--------|---------|-----------|-------------|---------------|
| run-... | ritual | 3 | 5 | Round 2 | Round 3 | SATISFIES |
| run-... | claude-only | 5 | 7 | — | — | MAX_ROUNDS |

### Head-to-Head: Latest Runs

| Metric | Ritual | Claude-Only | Delta |
|--------|--------|-------------|-------|
| Total Rounds | 3 | 5 | -2 (fewer = better) |
| Total Commits | 5 | 7 | -2 |
| PO Passed at Round | 2 | 4 | -2 |
| Tech Passed at Round | 3 | 5 | -2 |
| Product Pass Rate | 9/10 | 6/10 | +3 |
| Technical Pass Rate | 8/10 | 7/10 | +1 |
| Final Verdict | SATISFIES | MAX_ROUNDS | Ritual wins |

### Product Owner Criteria (Latest Runs)

| # | Criterion | Ritual | Claude-Only |
|---|-----------|--------|-------------|
| PC-1 | First-Time Team Experience | PASS | FAIL |
| PC-2 | Invite Flow Completeness | PASS | PARTIAL |
| ... | ... | ... | ... |

### Tech Lead Criteria (Latest Runs)

| # | Criterion | Ritual | Claude-Only |
|---|-----------|--------|-------------|
| AC-1 | Database Schema | PASS | PARTIAL |
| AC-2 | Auth Session Extension | PASS | PASS |
| ... | ... | ... | ... |
```

### Step 4: Key Insights

End with analysis:
- Which variant required fewer PO correction rounds? (This is Ritual's key value metric)
- Which variant required fewer tech lead rounds?
- Which product criteria were consistently missed by Claude-only but caught by Ritual?
- Any patterns in what Ritual-guided implementations get right on the first pass?

### Step 5: PR Links

Include PR URLs so the user can inspect the actual diffs and review comments.

## Important Rules
- **Read-only**: Do not modify any files.
- **Handle missing data**: If only one variant has been run, show what's available.
- **Handle legacy format**: Old runs without dual-reviewer data should still display.
