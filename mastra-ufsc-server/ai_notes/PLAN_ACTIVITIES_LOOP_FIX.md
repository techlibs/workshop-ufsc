# Plan Activities Loop Fix

## Problem
The weather workflow was getting into an infinite loop in the `planActivities` step. The logs showed multiple concurrent workflow runs being triggered with different runIds, causing the system to get stuck.

## Root Cause
The `weatherAgent` had access to both `weatherTool` and `weatherWorkflow`. When the workflow's `planActivities` step called the weatherAgent to generate activities, the agent could potentially try to use the `weatherWorkflow` again, creating a recursive loop:

```
weatherWorkflow → planActivities → weatherAgent → weatherWorkflow → ...
```

## Solution
Created a dedicated `activityPlannerAgent` that:
1. **No tools or workflows**: Prevents any possibility of recursive calls
2. **Focused purpose**: Only generates activity suggestions based on weather data
3. **Clear instructions**: Explicitly told it's being called from within a workflow

## Changes Made

### 1. Created new agent: `activity-planner-agent.ts`
```typescript
export const activityPlannerAgent = new Agent({
  name: "Activity Planner Agent",
  instructions: `...activity planning instructions...`,
  model: openai("gpt-4o-mini"),
  // NO tools or workflows to prevent recursion
});
```

### 2. Updated `weather-workflow.ts`
Changed from:
```typescript
const agent = mastra?.getAgent("weatherAgent");
```

To:
```typescript
const agent = mastra?.getAgent("activityPlannerAgent");
```

### 3. Updated `index.ts`
Added the new agent to the Mastra configuration:
```typescript
agents: { weatherAgent, activityPlannerAgent },
```

## Benefits
1. **No recursion**: The activity planner can't call workflows
2. **Clear separation**: Weather checking vs activity planning
3. **Better performance**: No risk of infinite loops
4. **Cleaner architecture**: Each agent has a specific purpose

## Testing
Run the test to verify the fix:
```bash
npx tsx test-weather-workflow-logging.ts
```

Expected behavior:
- Workflow completes without loops
- Single execution per runId
- Activity suggestions generated successfully
- No recursive workflow calls in logs
