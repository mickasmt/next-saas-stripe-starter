---
name: benchmark-implement-ritual
description: "Benchmark implementation phase (Ritual variant): uses /ritual-builder-spec to research and plan, extracts requirements as a contract checklist, implements systematically against each requirement, then pushes and creates a draft PR."
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

**THIS IS THE MOST IMPORTANT STEP.** The requirement packages from Ritual are your implementation contract.

After `/ritual-builder-spec` completes, Ritual will have produced system requirement areas, each with requirements, acceptance criteria, dependencies, and metrics.

**Create a requirements checklist file** at `benchmark/REQUIREMENTS_CONTRACT.md`:

```markdown
# Requirements Contract — <feature name>

Extracted from Ritual exploration <exploration_id>.

## Requirement Area 1: <name>
<description from Ritual>

### Requirements
- [ ] REQ-1.1: <requirement text>
- [ ] REQ-1.2: <requirement text>
- [ ] REQ-1.3: <requirement text>

### Acceptance Criteria
- [ ] AC-1.1: <acceptance criterion>
- [ ] AC-1.2: <acceptance criterion>

## Requirement Area 2: <name>
...
```

**Rules for extraction:**
- Include EVERY requirement and EVERY acceptance criterion from ALL requirement areas
- Use checkboxes — you will check them off as you implement
- Preserve the exact wording from Ritual — do not paraphrase
- Number them hierarchically (REQ-1.1, REQ-1.2, AC-1.1, AC-1.2, etc.)
- Include dependencies and open questions as notes under each area

## Step 4: Create Branch

```bash
EPIC_SLUG="<epic-slug>"
TIMESTAMP=$(date +%Y%m%d-%H%M)
git checkout -b "benchmark/ritual-${EPIC_SLUG}-${TIMESTAMP}"
```

## Step 5: Implement Against the Contract

Implement the feature by working through the requirements contract **area by area**.

**For each Requirement Area:**
1. Read the requirements and acceptance criteria for that area
2. Implement all requirements for that area
3. Verify each acceptance criterion is met
4. Check off completed items in `benchmark/REQUIREMENTS_CONTRACT.md`
5. Commit with a message referencing the area:
   ```bash
   git add -A && git commit -m "feat: implement <Requirement Area name>"
   ```

**Implementation rules:**
- Work through areas in order (Area 1, then Area 2, etc.)
- Do NOT skip ahead — each area may depend on previous ones
- Follow existing codebase patterns and conventions
- Actually implement — do not stub or mock
- Aim for one commit per requirement area (3-8 commits total)

## Step 6: Self-Verify Against Contract

Before creating the PR, do a final pass:

1. Re-read `benchmark/REQUIREMENTS_CONTRACT.md`
2. For each unchecked item, either:
   - Implement it now and check it off
   - Note why it was intentionally skipped (add a note inline)
3. Commit any final changes:
   ```bash
   git add -A && git commit -m "feat: complete remaining requirements from contract"
   ```

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

### Variant
**Ritual-enriched** — used /ritual-builder-spec with MCP tools to research, define requirements, and guide implementation.

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
- Requirements: <X checked> / <Y total> from contract

To start the review loop:
  /benchmark-review <PR_NUMBER> ritual <epic-slug>
```

**STOP HERE.** The review loop is a separate skill.
