---
name: ritual-build-exploration
description: Walk the user through creating a Ritual exploration — select workspace, describe the feature, pick a template, generate considerations, approve a problem statement, create the exploration, and populate it with discovery questions — all via interactive MCP tool calls.
argument-hint: "<brief feature or problem description>"
user-invocable: true
---

# Ritual Build Exploration

Guide the user through the full exploration creation workflow using Ritual MCP tools. Each step is interactive — present options clearly and let the user make choices before proceeding.

## When to Use This Skill

- You want to create a new Ritual exploration for a feature or problem
- You want AI-generated considerations and a problem statement to frame the exploration
- You want the full guided workflow: workspace → input → template → considerations → problem statement → exploration → discovery questions
- **After `/ritual-feature-spec`**: If `find_explorations` returned no matching explorations, suggest this skill so the user can create one first, then re-run `/ritual-feature-spec` to enrich their plan with the new exploration's research

## Workflow

Follow these steps **in exact order**. Do NOT skip ahead. Wait for user input at each decision point.

---

### Step 1: Select Workspace

Fetch the user's accessible workspaces:

```
Tool: mcp__ritual__list_workspaces
```

Present the workspaces as a numbered list. Use `AskUserQuestion` to let the user pick which project workspace to create the exploration in.

**Format:**
```
Available workspaces:
1. WorkspaceName-A (project)
2. WorkspaceName-B (project)
```

If only one workspace exists, confirm it with the user rather than auto-selecting.

---

### Step 2: Capture Feature Description

If the user provided a feature description as the skill argument, use that. Otherwise, use `AskUserQuestion` to ask:

> What feature or problem would you like to explore? Describe it in a few sentences — the more context you provide, the better the considerations will be.

Store the user's raw input as `user_input` for the next steps.

---

### Step 3: Choose Template

Present the user with a template choice using `AskUserQuestion`. The template determines the lens through which considerations and discovery questions are generated (intersection model).

**Options:**

1. **Feature Specification (Agentic Coding) (Recommended)** — Uses `prototype-spec-premise-first`. Best for features you plan to implement with an AI coding agent. Sections focus on hypotheses, validation criteria, and thin-slice execution.
2. **Implementation Requirement Package** — Uses `implementation-requirement-package`. General-purpose template with broad requirement sections.
3. **Browse all templates** — Fetch the full list and let the user pick.

If the user chooses option 3, fetch templates:

```
Tool: mcp__ritual__list_templates
```

Present them as options with:
- **label**: Template name
- **description**: Template description + category

Store the selected `template_id` (e.g., `prototype-spec-premise-first` or `implementation-requirement-package`).

---

### Step 4: Create Deliverable

Create a deliverable from the chosen template. This captures the template structure for use in considerations and discovery question generation. The user does not need to know about this step — it happens automatically.

```
Tool: mcp__ritual__create_deliverable
workspace_id: "<from Step 1>"
template_id: "<from Step 3>"
title: "<derive from user_input — max 60 chars>"
```

Store the returned `deliverable_id` for later steps.

---

### Step 5: Generate and Select Considerations

Call the considerations endpoint with the user's input **and** the deliverable ID. The deliverable's template structure is used to generate context-aware considerations via the intersection model — the template's sections and subsections shape the lens through which the user's problem is analyzed.

```
Tool: mcp__ritual__generate_considerations
user_input: "<user's description from Step 2>"
deliverable_id: "<from Step 4>"
```

Present the 6 returned considerations as a **multi-select checklist**. Use `AskUserQuestion` with `multiSelect: true` so the user can pick multiple considerations.

**Format the question like this:**

> Here are 6 considerations for your exploration. Select the ones you want to include in your problem statement:

Present each consideration as an option with:
- **label**: A short summary (first ~8 words)
- **description**: The full consideration text

The user should select **at least 1** consideration. If they select none or want different ones, offer to regenerate with refined input.

---

### Step 6: Generate Problem Statement

Using the user's original input and their selected considerations, generate the problem statement:

```
Tool: mcp__ritual__generate_problem_statement
user_input: "<user's description from Step 2>"
selected_considerations: ["<selected consideration 1>", "<selected consideration 2>", ...]
```

Present the generated problem statement to the user and use `AskUserQuestion` with these options:

1. **Accept as-is** — proceed with this problem statement
2. **Accept with edits** — let the user type their modified version
3. **Regenerate** — call `generate_problem_statement` again with the same inputs
4. **Write my own** — let the user type a completely custom problem statement

If the user chooses "Accept with edits" or "Write my own", use `AskUserQuestion` to capture their text, then use that as the final problem statement.

---

### Step 7: Create the Exploration

With all inputs collected, create the exploration:

```
Tool: mcp__ritual__create_exploration
workspace_id: "<from Step 1>"
name: "<derive a concise name from the user's input — max 60 chars>"
description: "<the final problem statement from Step 6>"
template_id: "<from Step 3>"
deliverable_id: "<from Step 4>"
initial_problem_input: "<the final problem statement from Step 6>"
```

Store the returned `exploration_id` for the next steps.

---

### Step 8: Generate Discovery Questions

Now populate the exploration with discovery questions. This generates matters (topic categories) with questions the user can review and select.

```
Tool: mcp__ritual__generate_discovery_questions
workspace_id: "<from Step 1>"
exploration_id: "<from Step 7>"
problem_statement: "<the final problem statement from Step 6>"
deliverable_id: "<from Step 4>"
```

This returns an array of **matters**, each containing **questions**. Proceed to Step 9 to let the user review them.

---

### Step 9: Review Discovery Questions (Matter by Matter)

Present the discovery questions **one matter at a time**. For each matter:

1. **Display the matter name** and its description.
2. **List all questions** in that matter as a **multi-select checklist** using `AskUserQuestion` with `multiSelect: true`.
3. Present each question as an option with:
   - **label**: First ~8 words of the question
   - **description**: The full question text

**Format:**

> **Matter: [Matter Name]**
> [Matter description]
>
> Select the questions you want to add to your exploration:

The user can select one or more questions, or skip the matter entirely by selecting "Other" and typing "skip".

After the user selects questions for each matter, move to the next matter. Continue until all matters have been reviewed.

---

### Step 10: Add Selected Questions to Exploration

After all matters have been reviewed, make a **single batch call** with all selected matters and their questions:

```
Tool: mcp__ritual__add_questions_to_exploration
workspace_id: "<from Step 1>"
exploration_id: "<from Step 7>"
matters: [
  {
    "matter_name": "<matter 1 name>",
    "matter_description": "<matter 1 description>",
    "questions": [{ "text": "<selected question>" }, ...]
  },
  {
    "matter_name": "<matter 2 name>",
    "matter_description": "<matter 2 description>",
    "questions": [{ "text": "<selected question>" }, ...]
  }
]
```

Only include matters where the user selected at least one question. Skip empty matters.

---

### Step 11: Confirm Success

Present a summary to the user:

```
Exploration created and populated successfully!

  Name:           <exploration_name>
  ID:             <exploration_id>
  Workspace:      <workspace_name> (<workspace_id>)
  Template:       <template_id>

  Problem Statement:
  <the final problem statement>

  Discovery Questions Added:
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
- **No workspaces**: If `list_workspaces` returns empty, tell the user they need to create a project workspace in Ritual first.
- **Deliverable creation fails**: Show the error and ask if the user wants to retry with a different template.
- **AI generation fails**: If `generate_considerations`, `generate_problem_statement`, or `generate_discovery_questions` fails, offer the user the option to retry or proceed manually.
- **Exploration creation fails**: Show the error message and ask if they want to retry with different inputs.
- **Adding questions fails**: Show the error for the specific matter that failed. Questions already added to other matters are preserved.

## Important Notes

- This skill does NOT enter plan mode — it's a conversational, interactive workflow.
- Always wait for user confirmation before proceeding to the next step.
- Use `AskUserQuestion` for all decision points — never assume the user's choice.
- Keep the exploration name concise (max 60 chars) — derive it from the user's input, don't use the full problem statement as the name.
- The deliverable creation (Step 4) is automatic — do not ask the user about it. It's internal plumbing to enable the intersection model.
- Discovery questions are reviewed **one matter at a time** — do NOT present all matters at once. This keeps the selection focused and manageable.
- When adding questions (Step 10), only add matters where the user selected at least one question. Skip empty matters.
