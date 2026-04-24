---
name: ritual-generate-questions
description: Generate suggested discovery questions for an existing Ritual exploration — select workspace, pick exploration, generate questions, review per matter, and add selected questions — all via interactive MCP tool calls.
argument-hint: "<optional exploration name or ID>"
user-invocable: true
---

# Ritual Generate Questions

Generate and add discovery questions to an **existing** exploration. This is the standalone version of the discovery questions flow — use it when you already have an exploration and want to populate it with suggested questions for structured research.

## When to Use This Skill

- You have an existing Ritual exploration that needs discovery questions
- You want AI-generated matters (topic categories) and questions to drive stakeholder research
- You want to review and selectively add questions to an exploration
- **After `/ritual-build-exploration`**: If you skipped the discovery questions step or want to regenerate them
- **Standalone**: When discovery questions are needed for an exploration that was created through the web app or another workflow

## How This Differs from the Web App

The web app uses a stateful, two-phase approach with polling, progressive loading, and refinement loops. The MCP path is **stateless** — one generation call, user picks, selected questions are added. No state persistence, no polling, no carry-over. Each invocation generates fresh questions.

## Workflow

Follow these steps **in exact order**. Do NOT skip ahead. Wait for user input at each decision point.

---

### Step 1: Select Workspace

Fetch the user's accessible workspaces:

```
Tool: mcp__ritual__list_workspaces
```

Present the workspaces as a numbered list. Use `AskUserQuestion` to let the user pick a workspace.

If only one workspace exists, confirm it with the user rather than auto-selecting.

---

### Step 2: Select Exploration

Fetch explorations in the chosen workspace:

```
Tool: mcp__ritual__find_explorations
workspace_id: "<from Step 1>"
```

Present the explorations as a numbered list showing name, state, and creation date. Use `AskUserQuestion` to let the user pick which exploration to generate questions for.

If the user provided an exploration name or ID as the skill argument, try to match it from the results. If a single match is found, confirm it. If multiple match, present them for selection.

**Format:**
```
Explorations in [workspace name]:
1. ExplorationName-A (active, created 2026-04-20)
2. ExplorationName-B (active, created 2026-04-18)
```

Store the selected `exploration_id`, `workspace_id`, and the exploration's `description` (problem statement) for the next steps.

---

### Step 3: Fetch Exploration Details

Get the full exploration details to retrieve the problem statement and deliverable ID:

```
Tool: mcp__ritual__get_exploration
workspace_id: "<from Step 1>"
exploration_id: "<from Step 2>"
```

Extract:
- `problem_statement` — the exploration's description or problem statement
- `deliverable_id` — if the exploration has an associated deliverable (for template-aware generation)

If the exploration has no problem statement/description, use `AskUserQuestion` to ask the user to provide one:

> This exploration doesn't have a problem statement. Please describe the problem or feature in a few sentences so we can generate relevant discovery questions.

---

### Step 4: Generate Discovery Questions

Generate matters and questions for the exploration:

```
Tool: mcp__ritual__generate_discovery_questions
workspace_id: "<from Step 1>"
exploration_id: "<from Step 2>"
problem_statement: "<from Step 3>"
deliverable_id: "<from Step 3, if available>"
```

This returns an array of **matters** (typically 5), each containing **questions** (typically 8). Proceed to Step 5 to let the user review them.

---

### Step 5: Review Discovery Questions (Matter by Matter)

Present the discovery questions **one matter at a time**. For each matter:

1. **Display the matter name** and its description.
2. **List all questions** in that matter as a **multi-select checklist** using `AskUserQuestion` with `multiSelect: true`.
3. Present each question as an option with:
   - **label**: First ~8 words of the question
   - **description**: The full question text

**Format:**

> **Matter 1 of N: [Matter Name]**
> [Matter description]
>
> Select the questions you want to add to your exploration:

The user can select one or more questions, or skip the matter entirely by selecting "Other" and typing "skip".

After the user selects questions for each matter, move to the next matter. Continue until all matters have been reviewed.

---

### Step 6: Add Selected Questions to Exploration

After all matters have been reviewed, make a **single batch call** with all selected matters and their questions:

```
Tool: mcp__ritual__add_questions_to_exploration
workspace_id: "<from Step 1>"
exploration_id: "<from Step 2>"
matters: [
  {
    "matter_name": "<matter 1 name>",
    "matter_description": "<matter 1 description>",
    "questions": [{ "text": "<selected question>" }, ...]
  },
  ...
]
```

Only include matters where the user selected at least one question. Skip empty matters.

---

### Step 7: Confirm Success

Present a summary to the user:

```
Discovery questions added to exploration!

  Exploration:    <exploration_name>
  ID:             <exploration_id>
  Workspace:      <workspace_name>

  Questions Added:
  - <Matter 1>: <N> questions
  - <Matter 2>: <N> questions
  ...
  Total: <N> questions across <N> matters

You can now use /ritual-feature-spec to create an implementation plan
backed by this exploration's research.
```

---

## Error Handling

- **MCP unavailable**: If any MCP tool call fails, inform the user with the specific error and ask if they want to retry or abort.
- **No workspaces**: Tell the user they need to create a project workspace in Ritual first.
- **No explorations**: Tell the user they need to create an exploration first — suggest `/ritual-build-exploration`.
- **AI generation fails**: Offer the user the option to retry with different parameters (e.g., fewer matters, different problem statement).
- **Adding questions fails**: Show the error. Questions not yet added are preserved in the conversation — the user can retry the batch call.

## Important Notes

- This skill does NOT enter plan mode — it's a conversational, interactive workflow.
- Always wait for user confirmation before proceeding to the next step.
- Use `AskUserQuestion` for all decision points — never assume the user's choice.
- Discovery questions are reviewed **one matter at a time** — do NOT present all matters at once.
- This is **stateless** — each invocation generates fresh questions. There is no refinement loop or carry-over from previous generations.
- If the exploration already has questions/matters, the new ones are added alongside existing ones (no overwrite).
