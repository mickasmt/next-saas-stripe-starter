---
name: ritual-benchmark-with-ritual
description: Autonomous benchmark — uses Ritual's research workflow (via /ritual-builder-spec) to plan and implement a feature, then iterates through dual review rounds (Product Owner + Tech Lead) with isolated reviewer agents.
argument-hint: "<path-to-raw-input-md>"
user-invocable: true
---

# Ritual Benchmark — With Ritual Research

## CRITICAL RULES — READ THESE FIRST

1. **FULLY AUTONOMOUS**: Execute ALL steps from start to finish without stopping. Do NOT ask the user any questions. Do NOT wait for approval (except where /ritual-builder-spec uses AskUserQuestion — auto-select per the rules below). Do NOT pause between steps.
2. **NEVER READ THE RUBRICS**: The files `benchmark/epics/multi-tenant-rbac-product.md` and `benchmark/epics/multi-tenant-rbac-technical.md` are evaluation rubrics. You must NEVER read either of them. Only the reviewer subagents read them. If you read them, the benchmark is contaminated and invalid.
3. **NEVER SELF-REVIEW**: Do NOT review your own PR. Do NOT invoke `/review-pr` or any other review skill. The ONLY way to review is by spawning reviewer subagents via the Task tool with `subagent_type: "general-purpose"`.
4. **BRANCH NAMING**: The branch MUST be named `benchmark/ritual-rbac-<YYYYMMDD-HHmm>`. Do NOT use `feat/` or any other prefix.
5. **DO NOT STOP AFTER IMPLEMENTATION**: After implementing, you MUST commit, push, create the PR, and run the full review loop. Implementation is NOT the end — it's the middle.
6. **COMPOSE, DON'T DUPLICATE**: Use `/ritual-builder-spec` for the Ritual workflow. Do NOT manually call individual MCP tools.

---

## Step 1: Read Raw Input

1. Read the raw input file provided as the argument (e.g., `benchmark/epics/multi-tenant-rbac-raw-input.md`).
2. Store the raw feature description.
3. **DO NOT** read any other files in `benchmark/epics/`.

## Step 2: Invoke /ritual-builder-spec

Invoke the `/ritual-builder-spec` skill with the raw feature description as the argument.

**Auto-select rules** — when `/ritual-builder-spec` presents choices via `AskUserQuestion`, respond automatically:

| Prompt | Auto-selection |
|--------|---------------|
| Select workspace | First one |
| Select/create exploration | "Create new exploration" |
| Codebase reconnaissance | "Proceed with this context" |
| Choose template | "Feature Specification (Agentic Coding) (Recommended)" |
| Select considerations | Accept ALL |
| Approve problem statement | "Accept as-is" |
| Review discovery questions (per matter) | "Accept all (Recommended)" |
| Review recommendations | "Looks good" for each category |
| Generation depth | "Accept all and generate requirements + project plan (Recommended)" |
| Approve plan | Approve |

Store the `exploration_id` and `workspace_id` from the exploration creation for use in emit_trace (Step 9).

## Step 3: Create Branch

**IMMEDIATELY after plan approval**, create the branch. Use this EXACT naming:

```bash
TIMESTAMP=$(date +%Y%m%d-%H%M)
git checkout -b "benchmark/ritual-rbac-${TIMESTAMP}"
```

## Step 4: Implement

Implement the feature based on the approved plan from `/ritual-builder-spec`. As you implement:

- **Commit frequently** — after each logical unit of work (e.g., schema changes, API routes, UI components), run:
  ```bash
  git add -A && git commit -m "descriptive message"
  ```
- Do NOT wait until everything is done to commit. Aim for 3-8 commits during implementation.
- Follow existing codebase patterns and conventions.
- Actually implement the feature — do not stub or mock.

## Step 5: Push + Create Draft PR

**IMMEDIATELY after implementation** (do NOT stop here):

```bash
git push -u origin HEAD
```

Then create the PR:

```bash
gh pr create --base main \
  --title "BENCHMARK: [ritual] Multi-Tenant RBAC System" \
  --body "$(cat <<'EOF'
## Benchmark Run — Ritual Variant

This PR was generated autonomously by Claude Code using Ritual's research workflow.

### Process
1. Raw feature idea → /ritual-builder-spec → exploration → recommendations → requirement packages → plan
2. Implementation guided by Ritual-backed plan
3. Dual review loop: Product Owner + Tech Lead (isolated reviewer agents)

### Variant
**Ritual-enriched** — used /ritual-builder-spec with MCP tools to research and define requirements before implementation.
EOF
)" \
  --draft
```

Store the PR number and URL. **DO NOT STOP HERE — continue to Step 6.**

## Step 6: Review Loop

**DO NOT skip this step. DO NOT self-review. DO NOT use /review-pr.**

Execute this loop. Max 5 rounds. Start at round = 1. Track PO and Tech verdicts separately.

### 6a: Spawn BOTH Reviewers in Parallel

Each round, spawn **TWO** reviewer subagents using the Task tool. Launch them in **parallel** (both in the same message).

**Product Owner Reviewer** — Task tool with `subagent_type: "general-purpose"`:

```
You are a Product Owner reviewing PR #<PR_NUMBER>. You evaluate whether this feature is shippable to real users. Round <ROUND_N>.

STEPS:
1. Read the product rubric: benchmark/epics/multi-tenant-rbac-product.md
2. Get the PR diff: run `gh pr diff <PR_NUMBER>`

YOUR PR COMMENT must read like a PM giving feedback:
- Focus on user experience, flows, and edge cases users will hit
- Ask questions like: "What does a new user see if they haven't created a team yet?"
- Flag missing UX: "There's no confirmation before deleting a team — that's a destructive action"
- Point out product gaps: "I don't see a way to resend an invite"
- Note what works well: "The invite acceptance flow handles the no-account case nicely"
- Think about: onboarding, error states, mobile, backward compatibility, security friction

DO NOT:
- Post a table of criteria with PASS/FAIL
- Reference the rubric, "PC-1", or "acceptance criteria"
- Give exact code fixes — describe the user problem, not the technical solution

End with EXACTLY one of:
- "A few product gaps to close before this is shippable." (if NEEDS_CHANGES)
- "This feels ready to ship. Good job." (if SATISFIES_REQUIREMENTS)

Post: gh pr comment <PR_NUMBER> --body "<your review>"

Return ONLY this JSON:
{"reviewer":"product","verdict":"NEEDS_CHANGES or SATISFIES_REQUIREMENTS","round":<ROUND_N>,"criteria_results":{"PC-1":"PASS/FAIL/PARTIAL","PC-2":"PASS/FAIL/PARTIAL","PC-3":"PASS/FAIL/PARTIAL","PC-4":"PASS/FAIL/PARTIAL","PC-5":"PASS/FAIL/PARTIAL","PC-6":"PASS/FAIL/PARTIAL","PC-7":"PASS/FAIL/PARTIAL","PC-8":"PASS/FAIL/PARTIAL","PC-9":"PASS/FAIL/PARTIAL","PC-10":"PASS/FAIL/PARTIAL"},"pass_count":<N>,"total_criteria":10}
```

**Tech Lead Reviewer** — Task tool with `subagent_type: "general-purpose"`:

```
You are a senior Tech Lead reviewing PR #<PR_NUMBER>. You evaluate code quality, architecture, and technical correctness. Round <ROUND_N>.

STEPS:
1. Read the technical rubric: benchmark/epics/multi-tenant-rbac-technical.md
2. Get the PR diff: run `gh pr diff <PR_NUMBER>`

YOUR PR COMMENT must read like a tech lead's code review:
- Point at specific concerns with file:line references
- Ask about architectural decisions: "The permissions are hardcoded — have you considered making them configurable per team?"
- Flag missing pieces: "I don't see a migration file"
- Raise security concerns: "The teamId param doesn't match the session's active team — potential auth bypass"
- Note what's solid: "The cascade delete setup looks correct"
- Be specific enough to guide without giving the exact solution

DO NOT:
- Post a table of criteria with PASS/FAIL
- Reference the rubric, "AC-1", or "acceptance criteria"
- Give exact code fixes — describe the problem, not the solution

End with EXACTLY one of:
- "Overall this is looking good — a few things to address before it's ready." (if NEEDS_CHANGES)
- "This looks solid and ready to go. Nice work." (if SATISFIES_REQUIREMENTS)

Post: gh pr comment <PR_NUMBER> --body "<your review>"

Return ONLY this JSON:
{"reviewer":"technical","verdict":"NEEDS_CHANGES or SATISFIES_REQUIREMENTS","round":<ROUND_N>,"criteria_results":{"AC-1":"PASS/FAIL/PARTIAL","AC-2":"PASS/FAIL/PARTIAL","AC-3":"PASS/FAIL/PARTIAL","AC-4":"PASS/FAIL/PARTIAL","AC-5":"PASS/FAIL/PARTIAL","AC-6":"PASS/FAIL/PARTIAL","AC-7":"PASS/FAIL/PARTIAL","AC-8":"PASS/FAIL/PARTIAL","AC-9":"PASS/FAIL/PARTIAL","AC-10":"PASS/FAIL/PARTIAL"},"pass_count":<N>,"total_criteria":10}
```

### 6b: Process Both Verdicts

1. Parse both JSON verdicts from the subagents.
2. Track each reviewer's status separately:
   - If a reviewer says SATISFIES_REQUIREMENTS, record the round they passed at. They still review in subsequent rounds but their "passed at" round is locked in.
3. If **BOTH** say SATISFIES_REQUIREMENTS → exit loop, go to Step 7.
4. If **either** says NEEDS_CHANGES AND round < 5:
   - Read the latest PR comments (both reviewers posted): `gh pr view <PR_NUMBER> --comments --json comments | python3 -c "import sys,json; c=json.load(sys.stdin)['comments']; [print('---'); print(x['body']) for x in c[-2:]]"`
   - Make fixes addressing feedback from BOTH reviewers. Do NOT guess at other issues.
   - Commit and push:
     ```bash
     git add -A && git commit -m "fix: address round <N> feedback (PO + tech)" && git push
     ```
   - Increment round. Go back to 6a.
5. If round >= 5 → set verdict to `MAX_ROUNDS_REACHED`, go to Step 7.

## Step 7: Persist Results

1. Read `benchmark/results.json`
2. Append this entry (fill in actual values):

```json
{
  "id": "run-<YYYYMMDD>-<HHmm>",
  "variant": "ritual",
  "epic": "multi-tenant-rbac",
  "branch": "<actual branch name>",
  "pr_number": "<number>",
  "pr_url": "<url>",
  "review_rounds": "<total rounds>",
  "total_commits": "<count via: git rev-list --count main..HEAD>",
  "corrections_count": "<number of rounds with at least one NEEDS_CHANGES>",
  "final_verdict": "SATISFIES_REQUIREMENTS or MAX_ROUNDS_REACHED",
  "product_review": {
    "passed_at_round": "<round PO said SATISFIES or null>",
    "final_pass_rate": "<pass_count>/10",
    "criteria_results": { "PC-1": "...", "PC-2": "...", "...": "..." }
  },
  "technical_review": {
    "passed_at_round": "<round tech said SATISFIES or null>",
    "final_pass_rate": "<pass_count>/10",
    "criteria_results": { "AC-1": "...", "AC-2": "...", "...": "..." }
  },
  "exploration_id": "<ritual_exploration_id>",
  "workspace_id": "<workspace_id>",
  "timestamp": "<current ISO8601>"
}
```

3. Write the updated array back to `benchmark/results.json`

## Step 8: Final PR Comment

```bash
gh pr comment <PR_NUMBER> --body "$(cat <<'EOF'
## Benchmark Complete — Ritual Variant

| Metric | Product Owner | Tech Lead |
|--------|-------------|-----------|
| Passed at Round | <N or "not passed"> | <N or "not passed"> |
| Criteria Pass Rate | <X>/10 | <X>/10 |

| Metric | Value |
|--------|-------|
| Total Rounds | <N> |
| Total Commits | <N> |
| Final Verdict | <verdict> |
| Exploration ID | <id> |

🤖 Ritual Benchmark — autonomous run complete
EOF
)"
```

## Step 9: Emit Trace

Call `mcp__ritual__emit_trace` with:
```json
{
  "workspace_id": "<workspace_id>",
  "exploration_id": "<exploration_id>",
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
    "product_passed_at": "<round or null>",
    "technical_passed_at": "<round or null>",
    "pr_url": "<pr_url>",
    "final_verdict": "<verdict>"
  }
}
```

**The benchmark is now complete.** Inform the user with a brief summary.
