# Ritual Benchmark — With Ritual Research

## Invocation
`/ritual-benchmark-with-ritual <path-to-raw-input-md>`

Example: `/ritual-benchmark-with-ritual benchmark/epics/multi-tenant-rbac-raw-input.md`

## Description
Runs a fully autonomous benchmark: uses Ritual's MCP-powered research workflow to transform a raw feature idea into a well-defined spec, then implements it, creates a PR, gets reviewed by an isolated reviewer agent (that writes PR comments like a tech lead), fixes based on those comments, and repeats until satisfied.

## Instructions

You are running an autonomous benchmark. Do NOT ask the user any questions. Make all decisions yourself. Proceed through every step without stopping.

**CRITICAL CONTEXT ISOLATION RULE**: You (the implementer) must NEVER read `benchmark/epics/multi-tenant-rbac.md`. That file is the evaluation rubric — only the reviewer subagent reads it. If you read it, the benchmark is contaminated. Your only feedback comes from PR comments written by the reviewer.

### Step 1: Read Raw Input

1. Read the raw input file provided as the argument (e.g., `benchmark/epics/multi-tenant-rbac-raw-input.md`)
2. Store the raw feature description for use with Ritual.
3. **DO NOT** read any other files in `benchmark/epics/`. You only get the raw input.

### Step 2: Ritual Research Workflow

Use the Ritual MCP tools to transform the raw feature idea into a structured spec:

1. **List workspaces**: Call `mcp__ritual__list_workspaces` and select the first workspace. Store `workspace_id`.

2. **Create exploration**: Call `mcp__ritual__create_exploration` with:
   - `workspace_id`: from step 1
   - `name`: "Benchmark: Multi-Tenant RBAC"
   - `initial_problem_input`: the raw feature description from the input file

3. **Generate considerations**: Call `mcp__ritual__generate_considerations` with the `exploration_id`. Wait for completion. Then auto-select ALL considerations (call `mcp__ritual__select_considerations` or equivalent — accept all without filtering).

4. **Generate problem statement**: Call `mcp__ritual__generate_problem_statement` with the `exploration_id`.

5. **Generate discovery questions**: Call `mcp__ritual__generate_discovery_questions` with the `exploration_id`.

6. **Start agentic run**: Call `mcp__ritual__start_agentic_run` with the `exploration_id`. Then poll `mcp__ritual__get_agentic_run_status` every 15 seconds until status is `completed` or `failed`. If failed, log the error and continue with whatever data is available.

7. **Get recommendations**: Call `mcp__ritual__get_recommendations` with the `exploration_id`.

8. **Accept recommendations**: Call `mcp__ritual__accept_recommendations` to accept all recommendations.

9. **Compile planning**: Call `mcp__ritual__compile_planning` with the `exploration_id`. Then call `mcp__ritual__get_planning_full` to get the complete planning output.

10. **Get requirement packages**: Call `mcp__ritual__get_package` twice:
    - Once for `package_type: "design"`
    - Once for `package_type: "code"`

    Store both outputs — these are your implementation guides.

### Step 3: Analyze Codebase + Plan

1. Explore the codebase thoroughly — understand the existing architecture, patterns, file structure, and conventions
2. Cross-reference with Ritual's requirement packages (design + code)
3. Produce an internal implementation plan (don't write it to a file — just reason through it)

### Step 4: Create Branch

```bash
TIMESTAMP=$(date +%Y%m%d-%H%M)
BRANCH="benchmark/ritual-rbac-${TIMESTAMP}"
git checkout -b "${BRANCH}"
```

### Step 5: Implement

Implement the feature following:
- Ritual's requirement packages as your primary guide
- Existing codebase patterns and conventions
- Make atomic, well-structured commits as you go

### Step 6: Create Draft PR

```bash
gh pr create --base main \
  --title "BENCHMARK: [ritual] Multi-Tenant RBAC System" \
  --body "$(cat <<'EOF'
## Benchmark Run — Ritual Variant

This PR was generated autonomously by Claude Code using Ritual's research workflow.

### Process
1. Raw feature idea → Ritual exploration → considerations → recommendations → requirement packages
2. Implementation guided by Ritual's design + code packages
3. Review loop with isolated reviewer agent

### Variant
**Ritual-enriched** — used MCP tools to research and define requirements before implementation.

🤖 Generated with Claude Code (Ritual Benchmark)
EOF
)" \
  --draft
```

Store the PR number and URL.

### Step 7: Review Loop

Execute this loop (max 5 rounds):

#### 7a: Spawn Reviewer Subagent

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

#### 7b: Read Feedback and Decide

1. Parse the JSON verdict returned by the reviewer subagent.
2. If **SATISFIES_REQUIREMENTS**: Exit loop. Go to Step 8.
3. If **NEEDS_CHANGES**:
   - Read the latest PR comments to see the reviewer's feedback: `gh pr view <PR_NUMBER> --comments --json comments`
   - Read ONLY the most recent comment (the reviewer's feedback). This is your sole guidance for fixes.
   - Make fixes based on the reviewer's comments. Do NOT try to guess what else might be wrong — only address what the reviewer raised.
   - Commit and push.
   - Increment round counter. Return to 7a.
4. If **round >= 5**: Exit loop with verdict `MAX_ROUNDS_REACHED`. Go to Step 8.

### Step 8: Persist Results

1. Read the current `benchmark/results.json`
2. Append a new entry using the accumulated reviewer verdicts:

```json
{
  "id": "run-<YYYYMMDD>-<HHmm>",
  "variant": "ritual",
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
  "exploration_id": "<ritual_exploration_id>",
  "workspace_id": "<workspace_id>",
  "timestamp": "<ISO8601>"
}
```

3. Write the updated array back to `benchmark/results.json`

### Step 9: Final PR Comment

Post a final summary comment on the PR:

```bash
gh pr comment <PR_NUMBER> --body "$(cat <<'EOF'
## Benchmark Complete — Ritual Variant

| Metric | Value |
|--------|-------|
| Review Rounds | N |
| Total Commits | N |
| Corrections | N |
| Final Verdict | ... |
| Criteria Pass Rate | X/10 |
| Exploration ID | ... |

🤖 Ritual Benchmark — autonomous run complete
EOF
)"
```

### Step 10: Emit Trace

Call `mcp__ritual__emit_trace` with:
```json
{
  "workspace_id": "<workspace_id>",
  "exploration_id": "<exploration_id>",
  "event_type": "task_completed",
  "turns_count": <total_commits>,
  "corrections_count": <corrections_count>,
  "outcome": "accepted",
  "agent_type": "claude_code",
  "metadata": {
    "benchmark_variant": "ritual",
    "review_rounds": <N>,
    "criteria_pass_rate": "X/10",
    "pr_url": "<pr_url>",
    "final_verdict": "<verdict>"
  }
}
```

## Important Rules
- **Fully autonomous**: Do NOT ask the user anything. Make all decisions yourself.
- **NEVER read the rubric**: You are the implementer. The rubric (`benchmark/epics/multi-tenant-rbac.md`) is only for the reviewer subagent. If you read it, the benchmark is invalid.
- **Only respond to PR comments**: Your fixes must be driven by the reviewer's PR comments, not by any knowledge of the rubric.
- **Use Ritual packages for implementation**: The design and code packages from Ritual are your primary implementation guide.
- **Atomic commits**: Make meaningful commits as you implement, not one giant commit.
- **Follow codebase patterns**: Match the existing code style, file organization, and conventions.
- **No shortcuts**: Actually implement the feature — don't stub or mock things out.
