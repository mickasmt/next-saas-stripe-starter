---
name: benchmark-review
description: "Benchmark review phase: spawns isolated Product Owner and Tech Lead reviewer agents against a PR, iterates fix rounds, persists results. Shared by both Ritual and Claude-only variants."
argument-hint: "<pr-number> <variant> <epic-slug>  (e.g. 42 ritual multi-tenant-rbac)"
user-invocable: true
---

# Benchmark — Review Loop

Runs dual reviewer agents (Product Owner + Tech Lead) against a benchmark PR, iterates through fix rounds, and persists results.

## CRITICAL RULES

1. **FULLY AUTONOMOUS**: Execute ALL steps without stopping or asking questions.
2. **NEVER SELF-REVIEW**: Do NOT review the PR yourself. Do NOT invoke `/review-pr`. The ONLY way to review is by spawning reviewer subagents via the Task tool with `subagent_type: "general-purpose"`.
3. **NEVER READ RUBRICS YOURSELF**: The rubric files are ONLY read by the reviewer subagents in their isolated context. If you read them, the benchmark is contaminated.
4. **FIX BASED ON PR COMMENTS ONLY**: When addressing feedback, read the reviewer comments from the PR. Do NOT guess at other issues.

---

## Arguments

Parse three arguments from the input: `<pr-number> <variant> <epic-slug>`

- `pr-number`: The GitHub PR number (e.g., `42`)
- `variant`: Either `ritual` or `claude-only`
- `epic-slug`: The epic identifier (e.g., `multi-tenant-rbac`)

Derive rubric paths:
- Product rubric: `benchmark/epics/<epic-slug>-product.md`
- Technical rubric: `benchmark/epics/<epic-slug>-technical.md`

## Step 1: Verify PR Exists

```bash
gh pr view <PR_NUMBER> --json number,title,headRefName,url
```

Store the branch name and URL. Verify you are on the correct branch:

```bash
git checkout <branch-name>
git pull origin <branch-name>
```

## Step 2: Review Loop

Max **5 rounds**. Start at `round = 1`. Track PO and Tech verdicts separately.

### 2a: Spawn BOTH Reviewers in Parallel

Each round, spawn **TWO** reviewer subagents using the Task tool. Launch them **in parallel** (both in the same message).

**Product Owner Reviewer** — Task tool with `subagent_type: "general-purpose"`:

```
You are a Product Owner reviewing PR #<PR_NUMBER>. You evaluate whether this feature is shippable to real users. Round <ROUND_N>.

STEPS:
1. Read the product rubric at: <product-rubric-path>
2. Get the PR diff: run `gh pr diff <PR_NUMBER>`
3. If round > 1, also read the previous review comments to see what was already flagged:
   run `gh pr view <PR_NUMBER> --comments --json comments | python3 -c "import sys,json; c=json.load(sys.stdin)['comments']; [print('---COMMENT---'); print(x['body']) for x in c]"`

YOUR PR COMMENT must read like a PM giving feedback:
- Focus on user experience, flows, and edge cases users will hit
- Ask questions like: "What does a new user see when they first land here?"
- Flag missing UX: "There's no confirmation before this destructive action"
- Point out product gaps: "I don't see a way to handle this edge case"
- Note what works well: "This flow handles the error case nicely"
- Think about: onboarding, error states, mobile, backward compatibility, security friction
- If round > 1, acknowledge fixes from previous round and focus on remaining gaps

DO NOT:
- Post a table of criteria with PASS/FAIL
- Reference the rubric file, criterion IDs like "PC-1", or "acceptance criteria"
- Give exact code fixes — describe the user problem, not the technical solution

End with EXACTLY one of:
- "A few product gaps to close before this is shippable." (if NEEDS_CHANGES)
- "This feels ready to ship. Good job." (if SATISFIES_REQUIREMENTS)

Post your review:
gh pr comment <PR_NUMBER> --body "<your review>"

Return ONLY this JSON (no other text):
{"reviewer":"product","verdict":"NEEDS_CHANGES or SATISFIES_REQUIREMENTS","round":<ROUND_N>,"criteria_results":{"PC-1":"PASS/FAIL/PARTIAL","PC-2":"PASS/FAIL/PARTIAL","PC-3":"PASS/FAIL/PARTIAL","PC-4":"PASS/FAIL/PARTIAL","PC-5":"PASS/FAIL/PARTIAL","PC-6":"PASS/FAIL/PARTIAL","PC-7":"PASS/FAIL/PARTIAL","PC-8":"PASS/FAIL/PARTIAL","PC-9":"PASS/FAIL/PARTIAL","PC-10":"PASS/FAIL/PARTIAL"},"pass_count":<N>,"total_criteria":10}
```

**Tech Lead Reviewer** — Task tool with `subagent_type: "general-purpose"`:

```
You are a senior Tech Lead reviewing PR #<PR_NUMBER>. You evaluate code quality, architecture, and technical correctness. Round <ROUND_N>.

STEPS:
1. Read the technical rubric at: <technical-rubric-path>
2. Get the PR diff: run `gh pr diff <PR_NUMBER>`
3. If round > 1, also read the previous review comments to see what was already flagged:
   run `gh pr view <PR_NUMBER> --comments --json comments | python3 -c "import sys,json; c=json.load(sys.stdin)['comments']; [print('---COMMENT---'); print(x['body']) for x in c]"`

YOUR PR COMMENT must read like a tech lead's code review:
- Point at specific concerns with file:line references
- Ask about architectural decisions: "Have you considered how this scales?"
- Flag missing pieces: "I don't see a migration file"
- Raise security concerns: "This parameter isn't validated against the session"
- Note what's solid: "The cascade delete setup looks correct"
- Be specific enough to guide without giving the exact solution
- If round > 1, acknowledge fixes from previous round and focus on remaining gaps

DO NOT:
- Post a table of criteria with PASS/FAIL
- Reference the rubric file, criterion IDs like "AC-1", or "acceptance criteria"
- Give exact code fixes — describe the problem, not the solution

End with EXACTLY one of:
- "Overall this is looking good — a few things to address before it's ready." (if NEEDS_CHANGES)
- "This looks solid and ready to go. Nice work." (if SATISFIES_REQUIREMENTS)

Post your review:
gh pr comment <PR_NUMBER> --body "<your review>"

Return ONLY this JSON (no other text):
{"reviewer":"technical","verdict":"NEEDS_CHANGES or SATISFIES_REQUIREMENTS","round":<ROUND_N>,"criteria_results":{"AC-1":"PASS/FAIL/PARTIAL","AC-2":"PASS/FAIL/PARTIAL","AC-3":"PASS/FAIL/PARTIAL","AC-4":"PASS/FAIL/PARTIAL","AC-5":"PASS/FAIL/PARTIAL","AC-6":"PASS/FAIL/PARTIAL","AC-7":"PASS/FAIL/PARTIAL","AC-8":"PASS/FAIL/PARTIAL","AC-9":"PASS/FAIL/PARTIAL","AC-10":"PASS/FAIL/PARTIAL"},"pass_count":<N>,"total_criteria":10}
```

### 2b: Process Both Verdicts

1. Parse both JSON verdicts from the subagents.
2. Track each reviewer's status separately:
   - If a reviewer says `SATISFIES_REQUIREMENTS`, record the round they passed at. Lock it in — even if they review again in subsequent rounds.
3. If **BOTH** say `SATISFIES_REQUIREMENTS` → exit loop, go to Step 3.
4. If **either** says `NEEDS_CHANGES` AND `round < 5`:
   - Read the latest PR comments from both reviewers:
     ```bash
     gh pr view <PR_NUMBER> --comments --json comments | python3 -c "import sys,json; c=json.load(sys.stdin)['comments']; [print('---'); print(x['body']) for x in c[-2:]]"
     ```
   - Make fixes addressing feedback from BOTH reviewers. Do NOT guess at other issues — only fix what was flagged.
   - Commit and push:
     ```bash
     git add -A && git commit -m "fix: address round <N> review feedback" && git push
     ```
   - Increment round. Go back to 2a.
5. If `round >= 5` → set final verdict to `MAX_ROUNDS_REACHED`, go to Step 3.

## Step 3: Persist Results

1. Read `benchmark/results.json` (create as `[]` if it doesn't exist).
2. Count total commits:
   ```bash
   git rev-list --count main..HEAD
   ```
3. Append this entry (fill in actual values):

```json
{
  "id": "run-<YYYYMMDD>-<HHmm>",
  "variant": "<ritual or claude-only>",
  "epic": "<epic-slug>",
  "branch": "<actual branch name>",
  "pr_number": "<number>",
  "pr_url": "<url>",
  "review_rounds": <total rounds>,
  "total_commits": <count>,
  "corrections_count": <number of rounds with at least one NEEDS_CHANGES>,
  "final_verdict": "SATISFIES_REQUIREMENTS or MAX_ROUNDS_REACHED",
  "product_review": {
    "passed_at_round": <round PO said SATISFIES or null>,
    "final_pass_rate": "<pass_count>/10",
    "criteria_results": { "PC-1": "...", "PC-2": "...", "PC-3": "...", "PC-4": "...", "PC-5": "...", "PC-6": "...", "PC-7": "...", "PC-8": "...", "PC-9": "...", "PC-10": "..." }
  },
  "technical_review": {
    "passed_at_round": <round tech said SATISFIES or null>,
    "final_pass_rate": "<pass_count>/10",
    "criteria_results": { "AC-1": "...", "AC-2": "...", "AC-3": "...", "AC-4": "...", "AC-5": "...", "AC-6": "...", "AC-7": "...", "AC-8": "...", "AC-9": "...", "AC-10": "..." }
  },
  "timestamp": "<current ISO8601>"
}
```

4. Write the updated array back to `benchmark/results.json`.
5. Commit and push:
   ```bash
   git add benchmark/results.json && git commit -m "chore: persist benchmark results" && git push
   ```

## Step 4: Final PR Comment

```bash
gh pr comment <PR_NUMBER> --body "$(cat <<'EOF'
## Benchmark Complete — <Variant> Variant

| Metric | Product Owner | Tech Lead |
|--------|-------------|-----------|
| Passed at Round | <N or "not passed"> | <N or "not passed"> |
| Criteria Pass Rate | <X>/10 | <X>/10 |

| Metric | Value |
|--------|-------|
| Total Rounds | <N> |
| Total Commits | <N> |
| Corrections | <N> |
| Final Verdict | <verdict> |

Generated by `/benchmark-review`
EOF
)"
```

## Step 5: Emit Trace (Ritual variant only)

If `variant` is `ritual`, call `mcp__ritual__emit_trace` with:
```json
{
  "workspace_id": "<workspace_id from results or PR body>",
  "exploration_id": "<exploration_id from results or PR body>",
  "event_type": "task_completed",
  "turns_count": "<total_commits>",
  "corrections_count": "<corrections_count>",
  "outcome": "accepted",
  "agent_type": "claude_code",
  "metadata": {
    "benchmark_variant": "ritual",
    "review_rounds": "<N>",
    "product_pass_rate": "X/10",
    "technical_pass_rate": "X/10",
    "pr_url": "<pr_url>",
    "final_verdict": "<verdict>"
  }
}
```

If `variant` is `claude-only`, skip this step.

## Step 6: Output Summary

Print:
```
Benchmark review complete.

- Variant: <variant>
- PR: <PR URL>
- Rounds: <N>
- Final Verdict: <verdict>
- Product Owner: <pass_count>/10 (passed at round <N or "not passed">)
- Tech Lead: <pass_count>/10 (passed at round <N or "not passed">)

Run /benchmark-summary to see all results.
```
