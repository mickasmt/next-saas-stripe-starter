# Ritual Benchmark — Claude Only (No Ritual)

## Invocation
`/ritual-benchmark-claude-only <path-to-raw-input-md>`

Example: `/ritual-benchmark-claude-only benchmark/epics/multi-tenant-rbac-raw-input.md`

## Description
Runs a fully autonomous benchmark: Claude reads a raw feature idea, explores the codebase, plans, implements, creates a PR, gets reviewed by an isolated reviewer agent (that writes PR comments like a tech lead), fixes based on those comments, and repeats until satisfied. No Ritual MCP tools are used — this is pure Claude analysis.

## Instructions

You are running an autonomous benchmark. Do NOT ask the user any questions. Make all decisions yourself. Proceed through every step without stopping.

**CRITICAL CONTEXT ISOLATION RULE**: You (the implementer) must NEVER read `benchmark/epics/multi-tenant-rbac.md`. That file is the evaluation rubric — only the reviewer subagent reads it. If you read it, the benchmark is contaminated. Your only feedback comes from PR comments written by the reviewer.

### Step 1: Read Raw Input

1. Read the raw input file provided as the argument (e.g., `benchmark/epics/multi-tenant-rbac-raw-input.md`)
2. Store the raw feature description. This is ALL you have to work with for planning and implementation.
3. **DO NOT** read any other files in `benchmark/epics/`. You only get the raw input.

### Step 2: Explore Codebase + Plan

Starting from ONLY the raw feature description:

1. Thoroughly explore the codebase:
   - Read the project structure, package.json, key config files
   - Understand the auth system (Auth.js v5 setup, session handling)
   - Read the Prisma schema and existing models
   - Study existing API routes, server actions, and their patterns
   - Review UI components, layouts, and dashboard structure
   - Read middleware configuration

2. Based on your understanding of the codebase and the raw feature idea, design your own implementation plan:
   - What models/schema changes are needed?
   - What API routes to create?
   - What UI components to build?
   - How does it integrate with existing auth?
   - What's the implementation order?

3. Reason through your plan internally — don't write it to a file. Just proceed to implementation.

### Step 3: Create Branch

```bash
TIMESTAMP=$(date +%Y%m%d-%H%M)
BRANCH="benchmark/claude-only-rbac-${TIMESTAMP}"
git checkout -b "${BRANCH}"
```

### Step 4: Implement

Implement the feature based entirely on:
- The raw feature description
- Your own analysis of the codebase
- Your own design decisions

Make atomic, well-structured commits as you go.

### Step 5: Create Draft PR

```bash
gh pr create --base main \
  --title "BENCHMARK: [claude-only] Multi-Tenant RBAC System" \
  --body "$(cat <<'EOF'
## Benchmark Run — Claude-Only Variant

This PR was generated autonomously by Claude Code working from a raw feature description.

### Process
1. Raw feature idea → codebase exploration → self-designed plan → implementation
2. No external research tools or requirement packages
3. Review loop with isolated reviewer agent

### Variant
**Claude-only** — no Ritual MCP tools, pure codebase analysis and implementation.

🤖 Generated with Claude Code (Ritual Benchmark)
EOF
)" \
  --draft
```

Store the PR number and URL.

### Step 6: Review Loop

Execute this loop (max 5 rounds):

#### 6a: Spawn Reviewer Subagent

Use the **Task tool** with `subagent_type: "general-purpose"` to spawn an isolated reviewer. The reviewer has its own context and the rubric never enters YOUR context.

**Prompt for the reviewer subagent** (fill in `<PR_NUMBER>` and `<ROUND_N>`):

```
You are a senior tech lead reviewing a pull request. You have an evaluation rubric and the PR diff. Your job is to write a PR comment that reads like natural, constructive feedback a tech lead would give — NOT a checklist or spec dump.

## Your Inputs

1. Read the evaluation rubric: benchmark/epics/multi-tenant-rbac.md
2. Get the PR diff by running: gh pr diff <PR_NUMBER>

## How to Write Your Review

Internally, evaluate the diff against each acceptance criterion (AC-1 through AC-10) in the rubric. Track PASS/FAIL/PARTIAL for each.

But your PR COMMENT must be written as a tech lead would write it:
- Ask probing questions about gaps: "What happens if the last admin leaves? I don't see that case handled."
- Point at specific concerns with file/line references: "In `lib/permissions.ts:42`, this check doesn't account for..."
- Raise architectural concerns: "The role assignment logic seems tightly coupled to the invite flow — have you considered..."
- Note what looks good: "The cascade delete setup looks solid."
- Be specific enough to guide without giving the exact solution
- Use a conversational, professional tone

DO NOT:
- Post a table of acceptance criteria with PASS/FAIL statuses
- Quote or reference the rubric directly
- Mention "AC-1", "AC-2", etc. or "acceptance criteria" in the comment
- Give the developer the exact code fix — describe the problem, not the solution

## What to Post

Post your review as a PR comment:
gh pr comment <PR_NUMBER> --body "<your review>"

End your comment with one of:
- "Overall this is looking good — a few things to address before it's ready." (if NEEDS_CHANGES)
- "This looks solid and ready to go. Nice work." (if SATISFIES_REQUIREMENTS)

## What to Return

After posting the comment, return ONLY this JSON (no other text):

{
  "verdict": "NEEDS_CHANGES" or "SATISFIES_REQUIREMENTS",
  "round": <ROUND_N>,
  "criteria_results": {
    "AC-1": "PASS" or "FAIL" or "PARTIAL",
    "AC-2": "PASS" or "FAIL" or "PARTIAL",
    ...through AC-10
  },
  "pass_count": <number of PASS>,
  "total_criteria": 10
}
```

#### 6b: Read Feedback and Decide

1. Parse the JSON verdict returned by the reviewer subagent.
2. If **SATISFIES_REQUIREMENTS**: Exit loop. Go to Step 7.
3. If **NEEDS_CHANGES**:
   - Read the latest PR comments to see the reviewer's feedback: `gh pr view <PR_NUMBER> --comments --json comments`
   - Read ONLY the most recent comment (the reviewer's feedback). This is your sole guidance for fixes.
   - Make fixes based on the reviewer's comments. Do NOT try to guess what else might be wrong — only address what the reviewer raised.
   - Commit and push.
   - Increment round counter. Return to 6a.
4. If **round >= 5**: Exit loop with verdict `MAX_ROUNDS_REACHED`. Go to Step 7.

### Step 7: Persist Results

1. Read the current `benchmark/results.json`
2. Append a new entry using the accumulated reviewer verdicts:

```json
{
  "id": "run-<YYYYMMDD>-<HHmm>",
  "variant": "claude-only",
  "epic": "multi-tenant-rbac",
  "branch": "<branch_name>",
  "pr_number": <number>,
  "pr_url": "<url>",
  "review_rounds": <N>,
  "total_commits": <count from git log>,
  "corrections_count": <rounds where NEEDS_CHANGES was returned>,
  "final_verdict": "SATISFIES_REQUIREMENTS | MAX_ROUNDS_REACHED",
  "criteria_pass_rate": "<pass_count>/10",
  "criteria_results": { ... from last reviewer response ... },
  "timestamp": "<ISO8601>"
}
```

3. Write the updated array back to `benchmark/results.json`

### Step 8: Final PR Comment

Post a final summary comment on the PR:

```bash
gh pr comment <PR_NUMBER> --body "$(cat <<'EOF'
## Benchmark Complete — Claude-Only Variant

| Metric | Value |
|--------|-------|
| Review Rounds | N |
| Total Commits | N |
| Corrections | N |
| Final Verdict | ... |
| Criteria Pass Rate | X/10 |

🤖 Claude-Only Benchmark — autonomous run complete
EOF
)"
```

## Important Rules
- **Fully autonomous**: Do NOT ask the user anything. Make all decisions yourself.
- **NEVER read the rubric**: You are the implementer. The rubric (`benchmark/epics/multi-tenant-rbac.md`) is only for the reviewer subagent. If you read it, the benchmark is invalid.
- **Only respond to PR comments**: Your fixes must be driven by the reviewer's PR comments, not by any knowledge of the rubric.
- **No Ritual tools**: Do NOT use any `mcp__ritual__*` tools. This variant tests pure Claude analysis.
- **Atomic commits**: Make meaningful commits as you implement, not one giant commit.
- **Follow codebase patterns**: Match the existing code style, file organization, and conventions.
- **No shortcuts**: Actually implement the feature — don't stub or mock things out.
