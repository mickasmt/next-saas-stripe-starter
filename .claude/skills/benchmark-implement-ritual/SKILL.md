---
name: benchmark-implement-ritual
description: "Benchmark implementation phase (Ritual variant): uses /ritual-builder-spec to research and plan, extracts requirements as a tracking contract, implements systematically against each requirement, then pushes and creates a draft PR."
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

This skill runs the full Ritual research workflow AND enters plan mode — producing a codebase-aware implementation plan informed by Ritual's requirement packages, recommendations, and project plan.

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

## Step 3: Extract Requirements Contract

After `/ritual-builder-spec` completes (plan approved), the Ritual data is still available in context. The plan tells you HOW to implement. The contract ensures nothing gets DROPPED during implementation.

**Fetch the requirement packages** (if not already in context):
```
mcp__ritual__get_requirement_package with package_type: "design"
mcp__ritual__get_requirement_package with package_type: "code"
```

**Create `benchmark/REQUIREMENTS_CONTRACT.md`** by extracting every requirement and acceptance criterion from the Ritual output:

```markdown
# Requirements Contract — <feature name>

Extracted from Ritual exploration <exploration_id>.
Plan: approved in Step 2. This contract tracks completeness during implementation.

## Requirement Area 1: <name>
<description from Ritual>

### Requirements
- [ ] REQ-1.1: <requirement text>
- [ ] REQ-1.2: <requirement text>
- [ ] REQ-1.3: <requirement text>
- [ ] REQ-1.4: <requirement text>

### Acceptance Criteria
- [ ] AC-1.1: <acceptance criterion>
- [ ] AC-1.2: <acceptance criterion>
- [ ] AC-1.3: <acceptance criterion>
- [ ] AC-1.4: <acceptance criterion>

### Dependencies
- <dependency notes>

### Open Questions
- <open question notes>

## Requirement Area 2: <name>
...

## Summary
- Total requirement areas: <N>
- Total requirements: <N>
- Total acceptance criteria: <N>
```

**Rules for extraction:**
- Include EVERY requirement and EVERY acceptance criterion from ALL requirement areas
- Use checkboxes (`- [ ]`) — you will check them off as you implement
- Preserve the exact wording from Ritual — do not paraphrase or summarize
- Number hierarchically: REQ-1.1, REQ-1.2 for requirements; AC-1.1, AC-1.2 for acceptance criteria
- Include dependencies and open questions as non-checkbox notes

## Step 4: Create Branch

```bash
EPIC_SLUG="<epic-slug>"
TIMESTAMP=$(date +%Y%m%d-%H%M)
git checkout -b "benchmark/ritual-${EPIC_SLUG}-${TIMESTAMP}"
```

Commit the contract as the first commit:
```bash
git add benchmark/REQUIREMENTS_CONTRACT.md && git commit -m "docs: add requirements contract from Ritual exploration"
```

## Step 5: Implement Against the Contract

Implement the feature using the plan from Step 2 as your guide and the contract from Step 3 as your checklist.

**For each Requirement Area (in order):**
1. Read the requirements and acceptance criteria for that area in the contract
2. Implement all requirements — use the approved plan for HOW, the contract for WHAT
3. Mentally verify each acceptance criterion is satisfied
4. Check off completed items in `benchmark/REQUIREMENTS_CONTRACT.md` (change `- [ ]` to `- [x]`)
5. Commit:
   ```bash
   git add -A && git commit -m "feat: implement <Requirement Area name>"
   ```

**Implementation rules:**
- Work through areas in order (Area 1, then Area 2, etc.)
- Follow existing codebase patterns and conventions
- Actually implement — do not stub or mock
- Aim for one commit per requirement area (3-8 commits total)
- If an open question from the contract affects implementation, make a reasonable decision and note it

## Step 6: Self-Verify Against Contract

Before creating the PR, do a completeness check:

1. Re-read `benchmark/REQUIREMENTS_CONTRACT.md`
2. Count checked vs unchecked items
3. For each unchecked requirement or acceptance criterion:
   - Implement it now and check it off
   - OR add a note explaining why it was intentionally skipped
4. Commit any final changes:
   ```bash
   git add -A && git commit -m "feat: address remaining items from requirements contract"
   ```

**Target: 100% of requirements checked off.** If you can't hit 100%, that's data — the review loop will catch what's missing.

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
2. Requirements extracted as implementation contract (see benchmark/REQUIREMENTS_CONTRACT.md)
3. Implementation done area-by-area against the contract
4. Self-verified against contract before PR creation

### Variant
**Ritual-enriched** — used /ritual-builder-spec with MCP tools to research, define requirements, and track implementation completeness.

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
- Contract: <checked>/<total> requirements completed

To start the review loop:
  /benchmark-review <PR_NUMBER> ritual <epic-slug>
```

**STOP HERE.** The review loop is a separate skill.
