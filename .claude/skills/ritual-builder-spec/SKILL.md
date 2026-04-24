---
name: ritual-builder-spec
description: Plan a feature implementation by gathering Ritual's organizational research first, then entering plan mode for a single codebase-informed synthesis. Detects exploration readiness and offers to create, build, or run explorations inline when needed. When creating new explorations, runs codebase reconnaissance first so considerations and discovery questions are technically grounded.
argument-hint: "<feature description or ticket ID>"
user-invocable: true
---

# Ritual Build Spec

Build an implementation plan where Ritual's organizational research scopes the work and codebase analysis grounds the execution. Ritual context is fetched **before** entering plan mode so the plan is shaped by stakeholder-validated scope, acceptance criteria, and recommendations from the start — not patched afterward.

**Key innovation**: When creating a new exploration inline, codebase reconnaissance runs first so that considerations, problem statements, and discovery questions are technically grounded — not generic business questions divorced from the actual code.

## When to Use This Skill

- A feature has been explored in Ritual and you're ready to implement
- You want acceptance criteria, design constraints, and recommendations grounded in stakeholder input rather than guessed from a prompt
- You want phased task breakdowns aligned with Ritual's execution plan
- You're starting from scratch — the skill will guide you through creating and running an exploration if one doesn't exist yet

## Design Principles

1. **Ritual context is scope input, not plan overlay.** Fetch it first, use it to guide codebase exploration, then synthesize one plan. This avoids the anchoring problem where a codebase-first draft has to be structurally corrected against stakeholder-validated findings.
2. **Codebase reconnaissance enriches exploration input.** When creating a new exploration, scan the codebase first so that considerations and discovery questions reflect real technical constraints — not generic prompts. This eliminates the blind spot where Ritual's AI generates questions without codebase awareness.
3. **One plan per coherent feature.** Recommendations are facets of a feature, not independent features — plan them together so cross-cutting concerns, shared state, and sequencing are captured correctly.
4. **Decomposition is an explicit opt-in.** When an exploration genuinely spans multiple independent features, the user chooses upfront to break it into sub-plans; you never silently run N plan-mode sessions.
5. **Provenance is available, not intrusive.** Source attribution lives in a summary table at the end of the plan, not as inline annotations scattered through the body.
6. **Full funnel awareness.** The skill detects where the user is in the exploration lifecycle (no exploration → exploration without questions → questions but not run → run complete) and offers to complete missing steps inline rather than bouncing the user between skills.

---

## Workflow

### Phase 0: Gather Ritual Context (before plan mode)

This phase is reading and preparation, not planning. Do **not** enter plan mode yet.

#### 0.1 — Find relevant explorations

Use `mcp__ritual__find_explorations` with a semantic query derived from the feature description.

Present ranked matches as a numbered list. **Always include these additional options:**
- **"Create new exploration"** — triggers the inline creation flow (Step 0.1a)
- **"Proceed without Ritual context"** — skip to Phase 1 with codebase-only planning

If **no explorations match**, present these two options directly. If the **Ritual MCP is unavailable** (tool calls fail), tell the user which calls failed, then fall back to codebase-only planning.

Use `AskUserQuestion` for the selection. This happens **before** plan mode because it's a scope decision, not a plan edit — deciding inside plan mode means tearing down a plan if the user picks a different exploration than assumed.

#### 0.1a — Inline exploration creation (if user chose "Create new")

##### 0.1a.0 — Codebase reconnaissance (BEFORE exploration creation)

**Purpose**: Generate a technical brief so that considerations, problem statement, and discovery questions are grounded in codebase reality — not generic business prompts.

Using the feature description from the skill argument, perform a targeted codebase scan:

1. **Identify affected surfaces** — Use Glob and Grep to find files, components, modules, API endpoints, and data models likely involved in this feature. Search for:
   - Keywords from the feature description
   - Related component/service/handler names
   - Database tables, models, types mentioned or implied

2. **Read key files** — Read the most relevant 5-10 files to understand:
   - Existing patterns (auth, state management, data access, API conventions)
   - Data models and their relationships (DB schemas, TypeScript types)
   - Integration points (what calls what, cross-service boundaries)
   - Current limitations or technical debt in the affected area

3. **Compile the technical brief** — Synthesize findings into a structured brief (NOT a plan — just raw facts):

```
## Technical Brief

### Affected surfaces
- [List files, components, services, handlers that this feature touches]

### Data models & storage
- [Tables, schemas, types, access patterns relevant to this feature]

### Existing patterns & conventions
- [Auth approach, API conventions, state management, error handling patterns in this area]

### Integration points
- [Cross-service calls, shared libraries, external APIs, event flows]

### Technical constraints & debt
- [Missing indexes, stale fields, known limitations, patterns that constrain the design]

### Key observations
- [Anything surprising or important the feature author should know]
```

**Keep the brief factual and concise** — 200-400 words. It's input for AI consideration generation, not a document for humans to read.

Present the technical brief to the user:

> I've analyzed the codebase for areas related to this feature. Here's what I found:
>
> [technical brief summary — 3-5 bullet points of the most important findings]
>
> This context will be used to generate more technically-grounded considerations and discovery questions for the Ritual exploration.

Use `AskUserQuestion` with options:
1. **Proceed with this context** — use the brief to enrich exploration creation
2. **Refine the scan** — user can point to specific files or areas to include
3. **Skip codebase context** — create exploration from feature description only

##### 0.1a.1-7 — Build the exploration (with enriched input)

Run the `/ritual-build-exploration` workflow inline, but with the **enriched user input** that combines the original feature description with the technical brief:

```
enriched_input = """
## Feature Description
<user's original feature description>

## Codebase Technical Context
<technical brief from 0.1a.0>
"""
```

**Use `enriched_input` (not the raw feature description) for these calls:**
- `generate_considerations` → `user_input: enriched_input`
- `generate_problem_statement` → `user_input: enriched_input`
- `generate_discovery_questions` → `problem_statement: <the generated problem statement>` (already incorporates technical context because the problem statement was generated from enriched input)

The rest of the build flow follows these steps **in order** — do NOT skip any step:

**Step 1: Select workspace.** If workspace is already known from earlier in the conversation, confirm it. Otherwise fetch with `mcp__ritual__list_workspaces` and let the user pick via `AskUserQuestion`.

**Step 2: Capture feature description.** Reuse the skill argument if provided. Otherwise ask the user.

**Step 3: Choose template.** Present the user with a template choice using `AskUserQuestion`. **Do NOT auto-select — always ask the user.** Options:
1. **Feature Specification (Agentic Coding) (Recommended)** — template ID: `prototype-spec-premise-first`. Best for features you plan to implement with an AI coding agent.
2. **Implementation Requirement Package** — template ID: `implementation-requirement-package`. General-purpose template with broad requirement sections.
3. **Browse all templates** — Fetch the full list via `mcp__ritual__list_templates` and present them.

**Step 4: Create deliverable.** Call `mcp__ritual__create_deliverable` with the chosen template_id. This is automatic — do not ask the user. Store the returned `deliverable_id`.

**Step 5: Generate considerations.** Call `mcp__ritual__generate_considerations` with `user_input: enriched_input` and `deliverable_id` from Step 4. Present the 6 considerations as a multi-select checklist via `AskUserQuestion` with `multiSelect: true`. ← **technical brief injected here**

**Step 6: Generate and approve problem statement.** Call `mcp__ritual__generate_problem_statement` with `user_input: enriched_input` and the selected considerations. Present to user with options: Accept / Edit / Regenerate / Write own. ← **technical brief injected here**

**Step 7: Create the exploration.** Call `mcp__ritual__create_exploration` with all collected inputs.

**Step 8: Generate discovery questions.** Call `mcp__ritual__generate_discovery_questions` with the problem statement and deliverable_id.

**Step 9: Review questions — MATTERS AS TABS.** Use `AskUserQuestion` with **multiple questions** (one per matter) so the user sees matters as navigable tabs. Each matter is a separate question in the same call, with `multiSelect: true`. The user can tab between matters, see all of them, and select questions within each.

Since `AskUserQuestion` supports max 4 questions per call, batch matters into groups of 4:
- If 4 or fewer matters: one `AskUserQuestion` call with all matters
- If 5+ matters: first call with matters 1-4, second call with the rest

Each question (tab) should have:
- `header`: matter name (max 12 chars — abbreviate if needed)
- `question`: Display the matter name, description, and a **numbered list of all questions** in the question text itself, then ask the user how to proceed. Format:

```
**[Matter Name]**: [matter description]

1. [Question text]
2. [Question text]
3. [Question text]
...

How would you like to handle these questions?
```

- `multiSelect: false`
- `options`:
  1. **Accept all (Recommended)** — Include all questions from this matter
  2. **Exclude specific questions** — Specify question numbers to remove (e.g., "1, 4, 7")
  3. **Skip this matter** — Don't include any questions from this matter

If the user chooses "Exclude specific questions", they type the numbers to exclude in the "Other" text input. Remove those questions and keep the rest.

**Step 10: Add selected questions.** Call `mcp__ritual__add_questions_to_exploration` with all accepted/filtered matters and questions in a single batch call. Skip matters the user chose to skip entirely.

After creation, continue to Step 0.2 with the newly created exploration.

#### 0.2 — Check exploration readiness

Fetch full exploration details:

```
Tool: mcp__ritual__get_exploration
workspace_id: "<from selection>"
exploration_id: "<from selection>"
```

Evaluate readiness:

| Signal | Meaning | Action |
|---|---|---|
| No questions/matters | Exploration is empty | Offer to generate and add questions inline (run `/ritual-generate-questions` flow), then continue |
| Questions exist but no `recommendation_status` | Pipeline hasn't been run | Offer to run the pipeline inline (Step 0.2a) |
| `recommendation_status` is `GENERATED` | Recommendations exist but not accepted | Offer to accept and generate requirements (Step 0.2b) or proceed with recs only |
| `recommendation_status` is `ACCEPTED` but no `mcp_packages_generated_at` | Requirements still generating | Poll until packages are ready, then offer project plan (Step 0.2b) |
| `mcp_packages_generated_at` is set but no planning data | Requirements ready, no project plan | Offer to generate project plan (Step 0.2b option 1) or proceed |
| `mcp_packages_generated_at` is set AND planning data exists | Fully ready | Continue to Step 0.3 |

Present a summary of what's available and what's missing. Use `AskUserQuestion` with contextually appropriate options:

1. **Continue with available data** — proceed with whatever exists (partial is fine)
2. **Run the exploration pipeline first** — if pipeline hasn't been run (Step 0.2a)
3. **Generate requirements / project plan** — if recommendations exist but requirements or plan haven't been generated (Step 0.2b)
4. **Add questions first** — if exploration is empty
5. **Proceed without Ritual context** — skip to Phase 1

#### 0.2a — Inline pipeline run (if user chose "Run pipeline first")

Run the `/ritual-run-exploration` polling workflow inline:

1. Start the agentic run:
   ```
   Tool: mcp__ritual__start_agentic_run
   workspace_id: "<from selection>"
   exploration_id: "<from selection>"
   ```
2. **IMPORTANT: Wait 30 seconds between each poll call.** Calculate elapsed time from the `created_at` field in the response — do NOT estimate by counting poll cycles:
   ```
   Tool: mcp__ritual__get_agentic_run_status
   ```
3. On completion, continue to Step 0.2b
4. On failure, offer to retry or proceed with whatever data exists

**Important**: While waiting for the pipeline (3-8 minutes), inform the user they can continue working on other things. The polling loop will show periodic progress updates.

#### 0.2b — Review recommendations and generate requirements (after pipeline completes)

After the agentic run completes, recommendations exist but need to be reviewed and accepted before requirement concepts (design/code specs) and project plan can be generated.

##### 0.2b.1 — Fetch and present recommendations by category

Fetch recommendations:
```
Tool: mcp__ritual__get_recommendations
workspace_id: "<from selection>"
exploration_id: "<from selection>"
```

Group recommendations by `category`. Present them using `AskUserQuestion` with **categories as tabs** — same pattern as discovery question review.

Since `AskUserQuestion` supports max 4 questions per call, batch categories into groups of 4. If there are more, use multiple calls.

Each category tab should have:
- `header`: category name (max 12 chars — abbreviate if needed)
- `question`: Display the category name and a **numbered list of recommendations** with title, summary, and reasoning chain. Format:

```
**[Category Name]**

1. **[Recommendation Title]**
   [Summary]
   Reasoning: [rationale field — shows the discovery → tradeoffs → recommendation → justification chain]

2. **[Recommendation Title]**
   [Summary]
   Reasoning: [rationale]

...

Review these recommendations:
```

- `multiSelect: false`
- `options`:
  1. **Looks good** — Accept all recommendations in this category
  2. **Have concerns** — Type feedback about specific recommendations (captured but does not block acceptance)
  3. **Skip this category** — Not relevant to my implementation

##### 0.2b.2 — Accept recommendations and choose generation depth

After the user has reviewed all categories, present a final `AskUserQuestion`:

> You've reviewed all [N] recommendations across [N] categories. What would you like to do next?

Options:
1. **Accept all and generate requirements + project plan (Recommended)** — Accepts all recommendations, generates requirement concepts (design/code specs), and compiles a project plan with dependencies and sequencing. Takes ~5-8 minutes but produces the most complete context for planning.
2. **Accept all and generate requirements only** — Accepts all recommendations and generates requirement concepts (design/code specs) without the project plan. Takes ~3-5 minutes.
3. **Accept all and proceed without generation** — Accepts recommendations and moves straight to plan mode. Fastest, but the plan won't have design specs, code specs, or execution plan dependencies.
4. **Skip acceptance — proceed with recommendations as-is** — Don't accept recommendations, proceed directly to plan mode with just the recommendation data.

##### If user chose option 1, 2, or 3 (accept + generate):

**Step 1: Accept recommendations.** Call `mcp__ritual__accept_recommendations` to set recommendation status to ACCEPTED. This triggers the concept generation chain automatically via EventBridge.

**Step 2 (options 1 and 2): Poll for requirement packages.** The concept generation + MCP package pipeline runs automatically after acceptance. Poll `mcp__ritual__get_exploration` every 30 seconds and check for `mcp_packages_generated_at` to be set (non-null). Calculate elapsed time from the acceptance timestamp.

Show progress:
```
[Generating requirements...] Requirement concepts are being synthesized from recommendations. (~X min elapsed)
```

When `mcp_packages_generated_at` is set, requirements are ready.

**Step 3 (option 1 only): Trigger project plan compilation.** Call `mcp__ritual__compile_planning` to start planning generation. Then poll `mcp__ritual__get_planning_full` every 30 seconds until it returns planning data (non-empty groups/items).

Show progress:
```
[Generating project plan...] Compiling planning items, dependencies, and sequencing. (~X min elapsed)
```

When planning data is available, proceed to Step 0.3.

**Safety cap**: Stop polling after 15 minutes and offer to proceed with whatever data is available.

> **MCP tools required** (not yet implemented):
> - `accept_recommendations` — sets recommendation_status to ACCEPTED, triggers concept chain
> - `compile_planning` — triggers planning compilation
>
> Until these tools exist, the skill should inform the user: "Requirement generation requires accepting recommendations in the Ritual web app. Please accept them there, wait for the packages to generate, then come back and I'll fetch the context."

##### If user chose option 4:

Skip directly to Step 0.3.

#### 0.3 — Fetch the full Ritual package in parallel

Once the exploration is ready (or the user chose to proceed with partial data), fire these five calls in parallel:

- `mcp__ritual__get_exploration` — exploration details, user flows, stakeholder context
- `mcp__ritual__get_requirement_package` with `package_type: "design"`
- `mcp__ritual__get_requirement_package` with `package_type: "code"`
- `mcp__ritual__get_recommendations`
- `mcp__ritual__get_planning_full`

Proceed with whatever data is available — partial packages are still useful. If requirements or planning weren't generated (user skipped or tools unavailable), these calls will return empty — that's fine, the plan will note what's missing.

#### 0.4 — Present a scope summary and decide the plan shape

Show the user:
- Exploration name
- One-line scope summary
- Recommendation count
- Which packages are available (design / code / recs / execution plan)
- Subsystems touched (derived from the execution plan when available)

Then decide between two modes:

- **Integrated plan (default)** — one plan covering all recommendations, with each rec mapped to concrete work items. Use when recs are facets of a coherent feature.
- **Decomposed sub-plans (opt-in)** — when the exploration spans distinct, loosely coupled features. Propose seams along dependency boundaries from the execution plan and confirm with the user. Each sub-plan then runs its own Phase 1–3 cycle with its own approval gate.

**Heuristic for when to offer decomposition:**

| Shape | Default |
|---|---|
| 1–4 recs, one subsystem | Integrated, no prompt |
| 5+ recs OR 3+ subsystems | Offer decomposition, integrated as default choice |
| Execution plan has parallel tracks with no shared work items | Offer decomposition, decomposed as default choice |

---

### Phase 1: Enter Plan Mode with Ritual-Informed Codebase Analysis

#### 1.1 — Enter plan mode

Call `EnterPlanMode`.

#### 1.2 — Targeted codebase exploration

Use Glob, Grep, and Read to find:
- Files and components referenced in the **code spec**
- Integration points surfaced in the **design spec**
- Existing patterns relevant to each **recommendation**
- State management, data models, and test coverage in the affected areas

Ritual context makes this exploration targeted — you know which surfaces matter before you start reading, rather than speculating from the raw prompt.

**If codebase reconnaissance was done in 0.1a.0**: You already have the technical brief. Use it as a starting point but go deeper — the brief was a quick scan, this is a thorough investigation. Read full implementations, trace data flows, understand test coverage.

---

### Phase 2: Synthesize the Plan

Write the plan file as one integrated document. Ritual context and codebase findings are woven together from the start, not as a draft plus corrections.

**Plan structure:**

- **Product Context** — objective, scope, anti-goals, user flows (primarily from exploration + design spec)
- **Architecture** — state management, data models, component structure (code spec + codebase reality)
- **System Integration** — API contracts, payloads, integration points (code spec + codebase)
- **Recommendations → Implementation** — each Ritual recommendation mapped to concrete file changes, component work, and acceptance signals. This is the centerpiece; treat every rec as a first-class section with its own sub-scope, files touched, and done criteria.
- **Resilience** — error handling, loading/fallback states, edge cases
- **Acceptance Criteria** — stakeholder-defined success signals from the exploration, plus observability needs
- **Phased Tasks / Milestones** — ordered work breakdown **aligned with `get_planning_full`'s sequencing and dependencies** where available
- **Testing Strategy** — unit, integration, E2E
- **Risks & Mitigations** — surfaced by Ritual research and codebase realities
- **Rollout / Deployment**
- **Requirements Coverage** — gap analysis verifying the plan covers all Ritual requirements (see Phase 2.5)

**When codebase patterns conflict with Ritual specs:** flag the conflict once in the relevant section and recommend a resolution. Don't patch silently and don't bury the tension.

**Provenance:** append a single `## Ritual Context Summary` section at the end with a mapping table. Do not scatter `(from Ritual: ...)` annotations through the plan body — the plan reads cleaner and provenance is still inspectable.

```markdown
## Ritual Context Summary

- **Exploration**: [Name] (ID: [id])
- **Packages used**: Design Spec ✓ / Code Spec ✓ / Recommendations ✓ / Execution Plan ✓
- **Codebase reconnaissance**: [Yes — technical brief was used to enrich exploration | No — exploration existed prior]

### Source mapping

| Plan section | Primary sources |
|---|---|
| Product Context | Exploration, Design Spec |
| Architecture | Code Spec, codebase, technical brief |
| System Integration | Code Spec, Design Spec |
| Recommendations → Implementation | Recommendations, codebase |
| Phased Tasks | Execution Plan, codebase |
| Acceptance Criteria | Exploration, Recommendations |

### Notes

- **Conflicts resolved**: [any conflicts between codebase patterns and Ritual specs, with the resolution]
- **Ritual data not used**: [anything fetched but not relevant to this plan]
- **Technical brief impact**: [how codebase reconnaissance shaped the exploration — e.g., "identified missing GSI that became a consideration", "surfaced cross-service dependency that generated 3 additional discovery questions"]
```

---

### Phase 2.5: Requirements Coverage Check

Before presenting the plan, verify it covers all Ritual requirements. This ensures nothing from the research gets dropped during planning.

**If requirement packages were fetched** (design spec and/or code spec are available):

1. Go through every requirement and acceptance criterion from each Ritual requirement area
2. For each one, identify which plan task or section covers it
3. Append a **Requirements Coverage** section to the plan:

```markdown
## Requirements Coverage

Cross-reference of Ritual requirements against plan tasks.

### <Requirement Area 1 name>
| # | Requirement | Covered by |
|---|-------------|-----------|
| REQ-1.1 | <requirement text> | ✅ Task 3: Build auth engine |
| REQ-1.2 | <requirement text> | ✅ Task 5: Team server actions |
| AC-1.1 | <acceptance criterion> | ✅ Task 3: authorize() function |
| AC-1.2 | <acceptance criterion> | ❌ Gap — adding to plan |

### <Requirement Area 2 name>
...

### Summary
- Total Ritual items: <N>
- Covered by plan: <N>
- Gaps found: <N> → added as new tasks
```

4. **For every ❌ gap**: add a new task to the Phased Tasks section covering that requirement. Reference the Ritual requirement it addresses.

5. Update the gap count to 0 — all gaps should be resolved before presenting the plan.

**If no requirement packages are available** (user skipped generation or Ritual MCP unavailable): skip this phase — there's nothing to cross-reference against.

---

### Phase 3: Present the Final Plan

Call `ExitPlanMode` to present the plan for approval. If the user requests changes, iterate in plan mode and call `ExitPlanMode` again.

For **decomposed runs**, each sub-plan gets its own Phase 1–3 cycle. After the last sub-plan is approved, surface a brief index of all approved sub-plans (title + file path + which recommendations each covers) so the user has a single reference across the feature.

---

## Edge Cases

- **No Ritual explorations found** → offer to create one inline (0.1a, with codebase recon) or fall back to codebase-only planning. Note the absence at the top of the plan.
- **Ritual MCP unavailable** → same fallback; tell the user which calls failed so they can debug.
- **Multiple explorations match** → present all matches with "Create new" as the last option. Let the user select one or combine several. Combined runs treat recommendations as a single unified set.
- **Exploration exists but no questions** → offer to generate and add questions inline before running the pipeline.
- **Exploration has questions but pipeline hasn't run** → offer to run the pipeline inline (0.2a). The 3-8 minute wait is the price of getting recommendations; inform the user upfront.
- **Partial Ritual data** (e.g., design spec present but no execution plan) → proceed with what's available. Each package adds value independently; note missing packages in the Ritual Context Summary.
- **Exploration scope doesn't match user intent** → ask whether to re-query `find_explorations` with different phrasing, create a new exploration, or proceed with codebase-only planning. Don't force a bad fit — wrong scope input is worse than no scope input.
- **User wants to add a recommendation that wasn't in the exploration** → note it in the plan but flag: *"Not validated by Ritual exploration — stakeholder alignment unconfirmed."* Don't silently treat it as stakeholder-validated.
- **Pipeline fails mid-run** → offer to retry or proceed with partial data (answers completed before failure are preserved).
- **409 conflict when starting pipeline** → an active run already exists. Offer to poll the existing run's status instead.
- **Codebase reconnaissance finds nothing relevant** → proceed without technical brief. Note in the Ritual Context Summary that recon was attempted but didn't surface relevant findings. The exploration will still use the raw feature description.
- **User refines the scan** → if the user points to specific files/directories in 0.1a.0, re-run the scan focused on those areas and regenerate the technical brief.

---

## Important Notes

- This skill does NOT start in plan mode — Phase 0 (Ritual context gathering) is conversational and interactive.
- Plan mode begins in Phase 1 after all Ritual context is collected and the scope is confirmed.
- Use `AskUserQuestion` for all decision points — never assume the user's choice.
- The inline creation (0.1a) and pipeline run (0.2a) flows are optional — the user can always skip them and proceed with whatever data exists.
- When running the pipeline inline (0.2a), show progress updates but remind the user the wait is 3-8 minutes. Don't hide the cost.
- For codebase-only planning (no Ritual context), note prominently at the top of the plan: *"No Ritual explorations found — plan is based on codebase analysis only."*
- **Codebase reconnaissance (0.1a.0) only runs when creating a new exploration inline.** If the user selects an existing exploration, skip straight to 0.2 — the exploration was already created with whatever context was available at the time.
- The technical brief is **input enrichment**, not a plan. Keep it factual, concise (200-400 words), and focused on constraints and patterns — not solutions or recommendations. Let Ritual's AI do the synthesis.
