---
name: ritual-run-exploration
description: Run the full Ritual exploration pipeline — answer questions with AI, enrich from knowledge sources, submit answers, and generate strategic recommendations. Uses a fire-and-poll pattern for the long-running agentic process.
argument-hint: "<workspace name or exploration name (optional)>"
user-invocable: true
---

# Ritual Run Exploration

Guide the user through running the full agentic pipeline on an existing Ritual exploration. This is a long-running process (3-8 minutes) that uses a fire-and-poll pattern: start the run, then poll for progress until completion.

## When to Use This Skill

- The user has an exploration with discovery questions already created (via `/ritual-build-exploration` or manually)
- The user wants AI to answer all questions, enrich answers from knowledge sources, and generate recommendations
- The user says "run my exploration", "start the pipeline", "answer my questions", or similar

## Workflow

Follow these steps **in exact order**. Do NOT skip ahead. Wait for user input at each decision point.

---

### Step 1: Select Workspace

Fetch the user's accessible workspaces:

```
Tool: mcp__ritual__list_workspaces
```

Present as a numbered list. Use `AskUserQuestion` to let the user pick. If only one workspace, confirm it.

---

### Step 2: Select Exploration

Search for explorations in the selected workspace:

```
Tool: mcp__ritual__find_explorations
workspace_id: "<from Step 1>"
```

Present explorations as a numbered list showing name and status. Use `AskUserQuestion` to let the user pick. If the skill argument matches an exploration name, pre-select it but still confirm.

---

### Step 3: Confirm Before Starting

Fetch full exploration details to show the user what they're about to run:

```
Tool: mcp__ritual__get_exploration
workspace_id: "<from Step 1>"
exploration_id: "<from Step 2>"
```

Present a summary:

```
Ready to run the exploration pipeline:

  Name:        <exploration_name>
  Questions:   <count> questions across <count> matters
  Status:      <exploration_status>

This will:
1. Answer all discovery questions using AI
2. Enrich answers from connected knowledge sources
3. Submit all answers
4. Generate strategic recommendations

Estimated time: 3-8 minutes

Proceed?
```

Use `AskUserQuestion` with options:
1. **Start pipeline** — Run with default settings
2. **Configure options** — Let the user set processing_mode or sourcing_period
3. **Cancel** — Abort

If the user chooses "Configure options", ask about:
- **Processing mode**: `single_prompt` (faster, default) vs `iterative` (more thorough)
- **Sourcing period**: How many months of data to consider (default: 1)

---

### Step 4: Start the Run

```
Tool: mcp__ritual__start_agentic_run
workspace_id: "<from Step 1>"
exploration_id: "<from Step 2>"
processing_mode: "<if configured, otherwise omit>"
sourcing_period: <if configured, otherwise omit>
```

On success, store the returned `agentic_run_id` and `poll_url`. On 409 conflict (run already active), inform the user and offer to poll the existing run or cancel it.

---

### Step 5: Poll for Progress

Enter a polling loop. **IMPORTANT: Wait 30 seconds between each poll call.** Do NOT poll more frequently — the pipeline takes 3-8 minutes and polling faster wastes API calls without providing new information:

```
Tool: mcp__ritual__get_agentic_run_status
workspace_id: "<from Step 1>"
exploration_id: "<from Step 2>"
agentic_run_id: "<from Step 4>"
```

**Each poll cycle**, display a progress update. **Calculate elapsed time from the `created_at` field in the response** — do NOT estimate elapsed time by counting poll cycles:

```
[<percent_complete>%] <current_step_message> (<elapsed_time since created_at>)
```

**Highlight step transitions** — when the step changes, show a more detailed update:

```
Step complete: Answering questions (15/15 done)
Now: Evaluating answers against knowledge sources...
[45%] Enrichment in progress (2m 15s elapsed since start)
```

**Terminal statuses** — stop polling when status is one of:
- `completed` — Pipeline finished successfully
- `completed_with_errors` — Finished but some steps had issues
- `failed` — Pipeline failed
- `cancelled` — User or system cancelled the run

**Safety cap**: Stop polling after 20 minutes and inform the user the pipeline may still be running in the background.

**User cancellation**: If at any point the user says "cancel", "stop", or "abort", call `cancel_agentic_run` and exit the loop.

---

### Step 6: Handle Terminal Status

#### On `completed`:

```
Pipeline completed successfully!

  Duration:        <elapsed_time>
  Questions:       <total> answered
  Enrichments:     <applied>/<total> findings applied
  Answers submitted: <count>
  Recommendations: Generated

Fetching recommendations...
```

Proceed to Step 7.

#### On `completed_with_errors`:

```
Pipeline completed with some issues:

  Duration:        <elapsed_time>
  Error:           <error.message>
  Step:            <error.step>

Some results may still be available.
```

Still proceed to Step 7 to fetch whatever recommendations were generated.

#### On `failed`:

```
Pipeline failed:

  Failed at step: <error.step>
  Error:          <error.message>
  Code:           <error.code>

Work completed before the failure is preserved. You can try running the pipeline again.
```

Use `AskUserQuestion` to offer:
1. **Retry** — Start a new run
2. **Done** — Exit

#### On `cancelled`:

```
Pipeline cancelled.

  Cancelled at step: <current_step>
  Progress:          <percent_complete>%

Work completed before cancellation is preserved.
```

---

### Step 7: Fetch and Display Recommendations

On completion (or completed_with_errors), fetch recommendations:

```
Tool: mcp__ritual__get_recommendations
workspace_id: "<from Step 1>"
exploration_id: "<from Step 2>"
```

Display a summary of the recommendations. For each recommendation, show:
- **Title**
- **Priority** (if available)
- **Brief summary** (first 2-3 sentences)

Then suggest next steps:

```
Next steps:
- Use /ritual-feature-spec to create an implementation plan from these recommendations
- View the full exploration in Ritual for detailed answers and source citations
```

---

## Error Handling

- **409 Conflict (active run exists)**: Offer to poll the existing run or cancel it first
- **MCP tool errors**: Show the error and offer to retry
- **Polling failures**: If a single poll fails, retry once after 10 seconds. If it fails again, inform the user but keep polling (transient errors are common)
- **Timeout**: After 20 minutes, stop polling and inform the user. The pipeline may still be running — they can manually check status later

## Important Notes

- This skill does NOT enter plan mode — it's a conversational, interactive workflow
- Always wait for user confirmation before starting the pipeline (Step 3)
- The polling loop should show progress updates to keep the user informed
- Use `AskUserQuestion` for all decision points
- If the exploration has no questions, inform the user and suggest `/ritual-build-exploration` first
- The `get_agentic_run_status` tool has built-in recovery — if a run gets stuck, polling will automatically attempt to restart it
