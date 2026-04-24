---
name: ritual-feature-spec
description: Plan a feature implementation by entering plan mode, creating an implementation plan from codebase analysis, enriching it with Ritual MCP context, and presenting the final refined plan for approval — all within a single plan mode session.
argument-hint: "<feature description or ticket ID>"
user-invocable: true
---

# Ritual-Enriched Feature Spec

Create an implementation plan in two phases — both executed **within a single plan mode session**. Phase 1 drafts the plan from codebase analysis. Phase 2 enriches it with Ritual's organizational research. Only after both phases are complete do you exit plan mode and present the final plan for approval.

## When to Use This Skill

- You're about to implement a feature that has been explored in Ritual
- You want an implementation plan backed by organizational research and stakeholder input
- You need design specs, code specs, or strategic recommendations to inform your technical plan

## Workflow

**CRITICAL**: Do **NOT** call `ExitPlanMode` until Phase 2 is complete (or skipped because no Ritual data exists). Both phases happen inside plan mode.

Follow these phases **in exact order**.

---

### Phase 1: Draft Implementation Plan

Build an initial implementation plan purely from codebase analysis and the user's feature description.

1. **Enter plan mode** — use the `EnterPlanMode` tool.

2. **Explore the codebase** — use Glob, Grep, and Read to understand:
   - Existing patterns relevant to the feature
   - Files that will need to change
   - State management, API boundaries, and component architecture
   - Related tests and integration points

3. **Draft the implementation plan** to the plan file, covering:

   - **Product Context** — objective, scope, anti-goals, user flows
   - **Architecture** — state management, data models, component structure
   - **System Integration** — API contracts, payload structures, integration points
   - **Execution Details** — file-by-file change list, design constraints, I/O contracts
   - **Resilience** — error handling, loading/fallback states, edge cases
   - **Acceptance Criteria** — what "done" looks like, observability needs
   - **Phased Tasks / Milestones** — ordered work breakdown
   - **Testing Strategy** — unit, integration, E2E
   - **Risks & Mitigations**
   - **Rollout / Deployment Plan**

4. **Do NOT exit plan mode.** Proceed directly to Phase 2.

---

### Phase 2: Enrich with Ritual MCP

Still inside plan mode, fetch Ritual context and refine the plan before presenting it.

#### Step 2.1 — Find Relevant Explorations

Use `find_explorations` with a semantic query derived from the feature description:

```
Tool: mcp__ritual__find_explorations
query: "<feature description or keywords>"
```

Present the ranked results to the user (via text output in plan mode) and use `AskUserQuestion` to let them choose which exploration(s) to use.

- If **no explorations match**, inform the user that no Ritual context is available. Suggest running `/ritual-build-exploration` to create an exploration first, then re-running `/ritual-feature-spec` to enrich the plan. If the user wants to proceed without Ritual context, append a note to the plan: *"No Ritual explorations found — plan is based on codebase analysis only."* Then proceed to exit plan mode with the Phase 1 plan as-is.
- If the **Ritual MCP is unavailable** (tool calls fail), inform the user and proceed to exit plan mode with the Phase 1 plan.

#### Step 2.2 — Fetch Exploration Details

For the chosen exploration:

```
Tool: mcp__ritual__get_exploration
workspace_id: "<from find_explorations>"
exploration_id: "<from find_explorations>"
```

#### Step 2.3 — Fetch Requirement Packages

Make **two parallel calls** to get both design and code specs:

```
Tool: mcp__ritual__get_requirement_package  (package_type: "design")
Tool: mcp__ritual__get_requirement_package  (package_type: "code")
```

#### Step 2.4 — Fetch Recommendations and Execution Plan

Make **two parallel calls**:

```
Tool: mcp__ritual__get_recommendations
Tool: mcp__ritual__get_planning_full
```

If either returns empty or unavailable, proceed with whatever data was fetched.

#### Step 2.5 — Refine the Plan

Cross-reference the Ritual data against the Phase 1 plan:

| Plan Section | Ritual Source | What to Look For |
|---|---|---|
| Product Context | Exploration details, Design specs | Scope definitions, anti-goals, user flows from stakeholders |
| Architecture | Code specs | Data models, state management recommendations |
| System Integration | Code specs, Design specs | API contracts, payload structures, integration points |
| Execution Details | Design specs, Recommendations | UI/UX constraints, component patterns |
| Resilience | Recommendations | Error handling strategies, fallback patterns |
| Acceptance Criteria | Exploration details, Recommendations | Stakeholder-defined success criteria |
| Phased Tasks | Execution plan (planning_full) | Work item sequencing, dependencies, effort sizing |
| Risks | Recommendations | Risks surfaced by organizational research |

**Refinement rules:**
- **Add** details from Ritual that codebase analysis missed (stakeholder-defined criteria, design constraints, etc.)
- **Correct** assumptions in Phase 1 that conflict with Ritual's research findings
- **Align** phased tasks with Ritual's execution plan sequencing and dependencies if available
- **Preserve** codebase-specific technical details that Ritual doesn't cover (file paths, existing patterns, state management specifics)
- **Flag conflicts** — if Ritual specs contradict codebase patterns, highlight the conflict and recommend a resolution

#### Step 2.6 — Update the Plan File

Rewrite the plan file with the refined plan. Use inline annotations to show what came from Ritual: *(from Ritual: design spec)*, *(from Ritual: code spec)*, *(from Ritual: recommendations)*, *(from Ritual: execution plan)*.

Append a **Ritual Context Summary** section at the end:

```markdown
## Ritual Context Summary
- **Exploration**: [Name] (ID: [id])
- **Data sources used**: [which of Design Spec, Code Spec, Recommendations, Execution Plan were available]
- **Key findings incorporated**: [bullet list of what Ritual added or changed]
- **Conflicts resolved**: [any conflicts between codebase patterns and Ritual specs]
- **Ritual data not used**: [anything fetched but not relevant to this plan]
```

---

### Phase 3: Present the Final Plan

**Now** — and only now — call `ExitPlanMode` to present the enriched plan for user approval.

The user sees the complete plan (codebase analysis + Ritual enrichment) and can approve or request changes. If changes are requested, iterate on the plan file and call `ExitPlanMode` again.

---

## Edge Cases

- **No Ritual explorations found**: Inform the user and exit plan mode with the Phase 1 plan as-is. Ritual enrichment is additive — the plan is still valid without it.
- **Ritual MCP unavailable**: If MCP calls fail, inform the user and exit plan mode with the Phase 1 plan.
- **Multiple explorations match**: Present all matches and let the user choose. You may incorporate data from multiple explorations if requested.
- **Partial Ritual data**: Some explorations may only have design specs, or only recommendations. Use whatever is available — each piece adds value independently.
