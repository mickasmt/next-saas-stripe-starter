---
name: benchmark-implement-claude-only
description: "Benchmark implementation phase (Claude-only variant): explores codebase, plans, and implements a feature from a raw one-line description with no Ritual tools, then pushes and creates a draft PR."
argument-hint: "<epic-slug>  (e.g. multi-tenant-rbac)"
user-invocable: true
---

# Benchmark — Implement Claude-Only

## CRITICAL RULES

1. **FULLY AUTONOMOUS**: Do NOT ask the user questions. Make all decisions yourself.
2. **NEVER READ RUBRICS**: Files named `<epic>-product.md` and `<epic>-technical.md` in `benchmark/epics/` are evaluation rubrics. NEVER read them.
3. **NO SELF-REVIEW**: Do NOT review your own code. Do NOT invoke `/review-pr` or `/benchmark-review`. This skill ends after the PR is created.
4. **NO RITUAL TOOLS**: Do NOT use any `mcp__ritual__*` tools. This variant tests pure Claude analysis.

---

## Step 1: Read Raw Input

The argument is an **epic slug** (e.g., `multi-tenant-rbac`).

1. Read `benchmark/epics/<epic-slug>-raw-input.md`.
2. Store the raw feature description. This is ALL you have to work with.
3. **DO NOT** read any other files in `benchmark/epics/`.

## Step 2: Explore Codebase + Plan (USE PLAN MODE)

Starting from ONLY the raw feature description:

1. **Enter plan mode** by calling `EnterPlanMode`. This is MANDATORY.

2. While in plan mode, thoroughly explore the codebase:
   - Read the project structure, package.json, key config files
   - Understand the auth system, session handling, middleware
   - Read the database schema and existing models
   - Study existing API routes, server actions, and their patterns
   - Review UI components, layouts, and dashboard structure

3. Write a detailed implementation plan covering:
   - What models/schema changes are needed
   - What API routes to create
   - What UI components to build
   - How it integrates with existing auth
   - Implementation order
   - File-by-file breakdown of changes

4. Call `ExitPlanMode` to present the plan. The user will approve it.

## Step 3: Create Branch

**IMMEDIATELY after plan approval:**

```bash
EPIC_SLUG="<epic-slug>"
TIMESTAMP=$(date +%Y%m%d-%H%M)
git checkout -b "benchmark/claude-only-${EPIC_SLUG}-${TIMESTAMP}"
```

## Step 4: Implement

Implement the feature based on your plan:

- **Commit frequently** — after each logical unit of work:
  ```bash
  git add -A && git commit -m "descriptive message"
  ```
- Aim for 3-8 commits during implementation.
- Follow existing codebase patterns and conventions.
- Actually implement the feature — do not stub or mock.

## Step 5: Push + Create Draft PR

```bash
git push -u origin HEAD
```

```bash
EPIC_SLUG="<epic-slug>"
gh pr create --base main \
  --title "BENCHMARK: [claude-only] ${EPIC_SLUG}" \
  --body "$(cat <<'EOF'
## Benchmark Run — Claude-Only Variant

This PR was generated autonomously by Claude Code from a raw feature description.

### Process
1. Raw feature idea → codebase exploration → self-designed plan → implementation
2. No external research tools or requirement packages

### Variant
**Claude-only** — no Ritual MCP tools, pure codebase analysis and implementation.

### Next Step
Run `/benchmark-review <PR_NUMBER> claude-only <epic-slug>` to start the review loop.
EOF
)" \
  --draft
```

## Step 6: Output Summary

Print:
```
Benchmark implementation complete (Claude-only variant).

- Branch: <branch name>
- PR: <PR URL> (#<PR_NUMBER>)

To start the review loop:
  /benchmark-review <PR_NUMBER> claude-only <epic-slug>
```

**STOP HERE.** The review loop is a separate skill.
