---
name: benchmark-implement-ritual
description: "Benchmark implementation phase (Ritual variant): uses /ritual-builder-spec to research and plan (with built-in requirements coverage check), then implements and creates a draft PR."
argument-hint: "<epic-slug>  (e.g. multi-tenant-rbac)"
user-invocable: true
---

# Benchmark — Implement with Ritual

## CRITICAL RULES

1. **FULLY AUTONOMOUS**: Do NOT ask the user questions. Make all decisions yourself.
2. **NEVER READ RUBRICS**: Files named `<epic>-product.md` and `<epic>-technical.md` in `benchmark/epics/` are evaluation rubrics. NEVER read them. Only the review skill uses them.
3. **NO SELF-REVIEW**: Do NOT review your own code. Do NOT invoke `/review-pr` or `/benchmark-review`. This skill ends after the PR is created.
4. **COMPOSE, DON'T DUPLICATE**: Use `/ritual-builder-spec` for the research workflow. Do NOT manually call MCP tools.

---

## Step 1: Read Raw Input

The argument is an **epic slug** (e.g., `multi-tenant-rbac`).

1. Read `benchmark/epics/<epic-slug>-raw-input.md`.
2. Store the raw feature description. This is your starting point.
3. **DO NOT** read any other files in `benchmark/epics/`.

## Step 2: Invoke /ritual-builder-spec

Invoke `/ritual-builder-spec` with the raw feature description.

This runs the full Ritual research workflow, enters plan mode, and produces a codebase-aware implementation plan with a **requirements coverage check** that verifies every Ritual requirement is covered by a plan task.

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

## Step 3: Create Branch

```bash
EPIC_SLUG="<epic-slug>"
TIMESTAMP=$(date +%Y%m%d-%H%M)
git checkout -b "benchmark/ritual-${EPIC_SLUG}-${TIMESTAMP}"
```

## Step 4: Implement

Implement the feature using the approved plan. The plan includes a Requirements Coverage section mapping every Ritual requirement to a plan task — use it to track completeness as you implement.

- **Commit frequently** — after each logical unit of work:
  ```bash
  git add -A && git commit -m "feat: <descriptive message>"
  ```
- Aim for 3-8 commits during implementation.
- Follow existing codebase patterns and conventions.
- Actually implement — do not stub or mock.

## Step 5: Push + Create Draft PR

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
2. Plan verified against Ritual requirements (coverage check)
3. Implementation guided by Ritual-backed plan

### Variant
**Ritual-enriched** — used /ritual-builder-spec with MCP tools to research, define requirements, and verify plan coverage.

### Next Step
Run `/benchmark-review <PR_NUMBER> ritual <epic-slug>` to start the review loop.
EOF
)" \
  --draft
```

## Step 6: Output Summary

Print:
```
Benchmark implementation complete (Ritual variant).

- Branch: <branch name>
- PR: <PR URL> (#<PR_NUMBER>)
- Exploration: <exploration_id>
- Workspace: <workspace_id>

To start the review loop:
  /benchmark-review <PR_NUMBER> ritual <epic-slug>
```

**STOP HERE.** The review loop is a separate skill.
