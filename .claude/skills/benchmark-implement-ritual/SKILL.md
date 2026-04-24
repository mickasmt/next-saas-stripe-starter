---
name: benchmark-implement-ritual
description: "Benchmark implementation phase (Ritual variant): uses /ritual-builder-spec to research and plan, verifies task coverage against Ritual requirements before implementing, then pushes and creates a draft PR."
argument-hint: "<epic-slug>  (e.g. multi-tenant-rbac)"
user-invocable: true
---

# Benchmark — Implement with Ritual

## CRITICAL RULES

1. **FULLY AUTONOMOUS**: Do NOT ask the user questions. Make all decisions yourself.
2. **NEVER READ RUBRICS**: Files named `<epic>-product.md` and `<epic>-technical.md` in `benchmark/epics/` are evaluation rubrics. NEVER read them. Only the review skill uses them.
3. **NO SELF-REVIEW**: Do NOT review your own code. Do NOT invoke `/review-pr` or `/benchmark-review`. This skill ends after the PR is created.
4. **COMPOSE, DON'T DUPLICATE**: Use `/ritual-builder-spec` for the research workflow. Do NOT manually call MCP tools.
5. **MANDATORY GAP CHECK**: After creating your task list but BEFORE writing any code, you MUST run the gap analysis in Step 3. Do NOT skip it.

---

## Step 1: Read Raw Input

The argument is an **epic slug** (e.g., `multi-tenant-rbac`).

1. Read `benchmark/epics/<epic-slug>-raw-input.md`.
2. Store the raw feature description. This is your starting point.
3. **DO NOT** read any other files in `benchmark/epics/`.

## Step 2: Invoke /ritual-builder-spec

Invoke `/ritual-builder-spec` with the raw feature description.

This runs the full Ritual research workflow AND enters plan mode — producing a codebase-aware implementation plan informed by Ritual's requirement packages, recommendations, and project plan.

**Auto-select rules** — when prompted via `AskUserQuestion`, respond automatically:

| Prompt | Auto-selection |
|--------|---------------|
| Select workspace | First one |
| Select/create exploration | "Create new exploration" |
| Codebase reconnaissance | "Proceed with this context" |
| Choose template | "Feature Specification (Agentic Coding) (Recommended)" |
| Select considerations | Accept ALL |
| Approve problem statement | "Accept as-is" |
| Review discovery questions | "Accept all (Recommended)" |
| Review recommendations | "Looks good" for each |
| Generation depth | "Accept all and generate requirements + project plan (Recommended)" |
| Approve plan | Approve |

Store the `exploration_id` and `workspace_id` from the exploration creation.

## Step 3: Gap Analysis — Verify Tasks Against Ritual Requirements

**THIS STEP IS MANDATORY. Do NOT skip it. Do NOT start coding until this is done.**

After plan approval, you will have created your own task list (checklist of implementation tasks). Before writing any code, you must verify your tasks fully cover Ritual's requirements.

### 3a: Fetch Ritual's requirement packages

If not already in context, fetch them now:
```
mcp__ritual__get_requirement_package with package_type: "design"
mcp__ritual__get_requirement_package with package_type: "code"
```

### 3b: Cross-reference your tasks against Ritual's requirements

Go through EVERY requirement and EVERY acceptance criterion from each Ritual requirement area. For each one, check whether your current task list covers it.

Output a gap analysis like this:

```
## Gap Analysis: Tasks vs Ritual Requirements

### Requirement Area 1: <name>
- REQ-1.1: "<requirement text>" → ✅ Covered by task: <task name>
- REQ-1.2: "<requirement text>" → ✅ Covered by task: <task name>
- REQ-1.3: "<requirement text>" → ❌ NOT COVERED — adding task
- AC-1.1: "<acceptance criterion>" → ✅ Covered by task: <task name>
- AC-1.2: "<acceptance criterion>" → ❌ NOT COVERED — adding task

### Requirement Area 2: <name>
...

### Summary
- Total Ritual items: <N>
- Covered: <N>
- Gaps found: <N>
- Tasks added: <N>
```

### 3c: Add missing tasks

For every ❌ item, add a new task to your task list covering that requirement. Then proceed to implementation.

## Step 4: Create Branch

```bash
EPIC_SLUG="<epic-slug>"
TIMESTAMP=$(date +%Y%m%d-%H%M)
git checkout -b "benchmark/ritual-${EPIC_SLUG}-${TIMESTAMP}"
```

## Step 5: Implement

Implement the feature using your plan as the guide. As you complete each task, verify it satisfies the Ritual requirements mapped to it in the gap analysis.

- **Commit frequently** — after each logical unit of work:
  ```bash
  git add -A && git commit -m "feat: <descriptive message>"
  ```
- Aim for 3-8 commits during implementation.
- Follow existing codebase patterns and conventions.
- Actually implement — do not stub or mock.

## Step 6: Pre-PR Completeness Check

Before creating the PR, do one final scan:

1. Review your task list — are all tasks completed?
2. Review the gap analysis from Step 3 — are all Ritual requirements addressed?
3. If anything is still missing, implement it now and commit.

## Step 7: Push + Create Draft PR

```bash
git push -u origin HEAD
```

```bash
EPIC_SLUG="<epic-slug>"
gh pr create --base main \
  --title "BENCHMARK: [ritual] ${EPIC_SLUG}" \
  --body "$(cat <<'EOF'
## Benchmark Run — Ritual Variant

This PR was generated autonomously by Claude Code using Ritual's research workflow.

### Process
1. Raw feature idea → /ritual-builder-spec → exploration → requirement packages
2. Gap analysis: verified task list covers all Ritual requirements
3. Implementation with coverage tracking

### Variant
**Ritual-enriched** — used /ritual-builder-spec with MCP tools to research, define requirements, and verify implementation coverage.

### Next Step
Run `/benchmark-review <PR_NUMBER> ritual <epic-slug>` to start the review loop.
EOF
)" \
  --draft
```

## Step 8: Output Summary

Print:
```
Benchmark implementation complete (Ritual variant).

- Branch: <branch name>
- PR: <PR URL> (#<PR_NUMBER>)
- Exploration: <exploration_id>
- Workspace: <workspace_id>
- Gap analysis: <N> Ritual items checked, <N> gaps found and addressed

To start the review loop:
  /benchmark-review <PR_NUMBER> ritual <epic-slug>
```

**STOP HERE.** The review loop is a separate skill.
