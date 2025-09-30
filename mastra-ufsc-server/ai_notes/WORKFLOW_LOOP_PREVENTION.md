# Workflow Loop Prevention

## Problem
After refactoring the weather workflow to be more concise and educational, the workflow started getting stuck in infinite loops again. The agent was recursively calling workflows or tools from within the workflow context.

## Root Cause
When simplifying the code, the critical instruction that prevents recursive workflow/tool calls was removed from the agent's system prompt:

### Original (Working)
```typescript
{
  role: "system",
  content: "IMPORTANT: You are being called from within a workflow. DO NOT use any workflows or tools. Just provide the formatted activity suggestions directly.",
}
```

### Refactored (Broken)
```typescript
{
  role: "system",
  content: "You are an activity planner. Provide concise, practical suggestions based on weather conditions.",
}
```

## Solution
Always include the loop prevention instruction when agents are called from within workflows:

```typescript
{
  role: "system",
  content: "IMPORTANT: You are being called from within a workflow. DO NOT use any workflows or tools. Just provide the formatted activity suggestions directly. You are an activity planner that provides concise, practical suggestions based on weather conditions.",
}
```

## Key Learnings
1. **Never remove workflow context instructions** - Even when refactoring for simplicity
2. **Agents need explicit boundaries** - They must be told when they're operating within a workflow
3. **Test after refactoring** - Always test workflow execution after code changes

## References
- Mastra Documentation: `workflows/using-with-agents-and-tools.mdx`
- Related fix: `CORRECT_LOOP_FIX.md`
