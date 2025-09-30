# Correct Approach to Fix Weather Workflow Loop

## Problem Analysis
The workflow was getting into a loop because:
1. `weatherWorkflow` → `planActivities` step calls `weatherAgent`
2. `weatherAgent` sees "activity plan" in the prompt
3. Agent's instructions say to use `weatherWorkflow` for activity requests
4. Agent calls `weatherWorkflow` again → Infinite loop!

## The Correct Solution

Instead of creating a separate agent, we use **context injection** to tell the agent it's being called from within a workflow and should not use any tools or workflows.

### Implementation

1. **System Message Context**
```typescript
agent.generate([
  {
    role: "system",
    content: "IMPORTANT: You are being called from within a workflow. DO NOT use any workflows or tools. Just provide the formatted activity suggestions directly.",
  },
  {
    role: "user",
    content: prompt,
  },
])
```

2. **Prompt Context Marker**
```typescript
const prompt = `[WORKFLOW CONTEXT - DO NOT USE TOOLS OR WORKFLOWS]

Create an activity plan for ${forecast.location} based on this weather...`
```

## Why This Works

1. **Explicit Context**: The agent knows it's being called from a workflow
2. **Clear Instructions**: Agent is told NOT to use workflows or tools
3. **Single Agent**: Maintains clean architecture with one weather agent
4. **Normal Flow**: Agent can still use workflows when called directly by users

## Benefits Over Separate Agent

1. **Simpler Architecture**: One agent handles all weather-related tasks
2. **Flexibility**: Same agent can use workflows when appropriate
3. **Maintainability**: No duplicate agent logic to maintain
4. **Clear Intent**: Context makes the constraint explicit

## How It Prevents Loops

- When called from workflow: Agent sees context → Only generates text
- When called by user: No context → Agent can use workflows/tools normally

## Key Learning

The issue wasn't that agents calling workflows is complex - it's that the agent needs to know when NOT to use workflows to prevent circular dependencies. Context injection is the clean solution.
