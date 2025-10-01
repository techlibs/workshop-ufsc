# Mastra UFSC Server - AI Agent Development Guide

This guide provides a concise overview of building AI agents with Mastra. For comprehensive documentation, see [docs/mastra.md](docs/mastra.md).

## Project Structure

```
src/mastra/
├── agents/       # AI agent definitions
├── tools/        # Reusable tools for agents
├── utils/        # Utility functions
├── workflows/    # Multi-step orchestrations
└── index.ts      # Mastra configuration
```

## Core Concepts

### 1. Agents
AI-powered assistants that use LLMs with tools and workflows to accomplish tasks. Agents maintain context through memory and can execute complex operations.

**Key features:**
- System instructions for behavior guidance
- Tool and workflow integration
- Memory persistence for conversation history
- Multi-language support

### 2. Tools
Discrete, reusable functions that agents can call to interact with external systems or perform specific operations.

**Tool anatomy:**
- Input/output schemas (Zod validation)
- Async execution function
- Clear descriptions for LLM understanding

### 3. Workflows
Multi-step orchestrations that chain operations together with control flow, error handling, and data transformation.

**Workflow features:**
- Sequential and parallel execution
- Conditional branching
- Error recovery
- State persistence

## Building Your First Agent

### Step 1: Create Tools

Tools are the building blocks that give agents capabilities:

```typescript
// src/mastra/tools/weather-tool.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather conditions", // LLM uses this to understand when to use the tool
  inputSchema: z.object({
    location: z.string().describe("City name"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
  }),
  execute: async ({ context }) => {
    // Implementation
    return { temperature: 25, conditions: "Sunny" };
  },
});
```

**AI Best Practices for Tools:**
- Write clear, specific descriptions that help the LLM understand tool purpose
- Use descriptive field names in schemas
- Include examples in descriptions when ambiguous
- Handle errors gracefully with meaningful messages

### Step 2: Create Workflows

Workflows orchestrate multiple steps for complex operations:

```typescript
// src/mastra/workflows/weather-workflow.ts
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

// Define reusable steps
const fetchWeather = createStep({
  id: "fetch-weather",
  description: "Fetches weather forecast",
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    condition: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("Fetching weather", { city: inputData.city });
    
    // Use tools or external APIs
    return { temperature: 25, condition: "Sunny" };
  },
});

// Chain steps into workflows
export const weatherWorkflow = createWorkflow({
  id: "weather-workflow",
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    activities: z.string(),
  }),
})
  .then(fetchWeather)
  .then(planActivities);

weatherWorkflow.commit();
```

**Workflow Design Patterns:**
- **Sequential Flow**: Chain steps with `.then()`
- **Parallel Execution**: Use `.parallel()` for concurrent operations
- **Conditional Logic**: Apply `.branch()` for decision trees
- **Error Handling**: Implement retry logic and fallbacks
- **State Management**: Use workflow context for data passing

### Step 3: Define the Agent

Agents combine LLM intelligence with tools and workflows:

```typescript
// src/mastra/agents/weather-agent.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: `
    You are a helpful weather assistant.
    
    **Tool Selection Guidelines:**
    - Use weatherTool for current conditions
    - Use weatherWorkflow for activity planning
    - Always ask for location if not provided
    
    **Response Guidelines:**
    - Be concise but informative
    - Match the user's language
    - Add helpful context when appropriate
  `,
  model: openai("gpt-4o-mini"),
  tools: { weatherTool, forecastTool },
  workflows: { weatherWorkflow },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
```

**AI Agent Instructions Best Practices:**

1. **Clear Role Definition**: Start with who the agent is and its primary purpose
2. **Tool/Workflow Selection Rules**: Explicitly guide when to use each capability
3. **Language Patterns**: Define tone, formality, and response structure
4. **Error Handling**: Specify how to handle edge cases
5. **Context Awareness**: Guide how to use conversation history

### Step 4: Configure Mastra

Register all components in the main configuration:

```typescript
// src/mastra/index.ts
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { weatherAgent } from "./agents/weather-agent";
import { weatherWorkflow } from "./workflows/weather-workflow";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: new LibSQLStore({
    url: ":memory:", // Use "file:../mastra.db" for persistence
  }),
  logger: new PinoLogger({
    level: "info",
  }),
});
```

## Advanced Patterns

### Utility Functions

Create shared utilities for common operations:

```typescript
// src/mastra/utils/geocoding.ts
export async function geocodeLocation(location: string) {
  // Shared logic for location resolution
  // Handle nicknames, validate coordinates, etc.
}
```

### Tool Composition

Build complex tools from simpler ones:

```typescript
const composedTool = createTool({
  // ...
  execute: async ({ context, mastra }) => {
    const weather = await weatherTool.execute({ context, mastra });
    const forecast = await forecastTool.execute({ context, mastra });
    // Combine results
  },
});
```

### Workflow Patterns

**Human-in-the-Loop**:
```typescript
.then(reviewStep)
.waitForEvent("approval")
.then(finalizeStep)
```

**Retry with Backoff**:
```typescript
const stepWithRetry = createStep({
  // ...
  retryConfig: {
    maxAttempts: 3,
    backoffMs: [1000, 2000, 4000],
  },
});
```

## Testing and Development

1. **Use `mastra dev`** for local development with hot reload
2. **Test tools independently** before integrating into workflows
3. **Monitor with structured logging** for debugging
4. **Validate schemas** to catch errors early

## Common Pitfalls and Solutions

1. **Circular Dependencies**: Avoid agents calling themselves through workflows
2. **Tool Overload**: Keep tool count reasonable (10-15 max per agent)
3. **Vague Instructions**: Be specific about tool selection criteria
4. **Memory Bloat**: Implement conversation pruning strategies

## Next Steps

- Explore the [complete Mastra documentation](docs/mastra.md)
- Check example implementations in `src/mastra/`
- Review the weather agent as a reference implementation
- Experiment with different LLM models and providers

## Quick Reference

- **Agents**: [docs/mastra.md#agents](docs/mastra.md) - Lines 15-145
- **Tools**: [docs/mastra.md#tools](docs/mastra.md) - Lines 111-118
- **Workflows**: [docs/mastra.md#workflows](docs/mastra.md) - Lines 119-135
- **Memory**: [docs/mastra.md#memory](docs/mastra.md) - Lines 72-77
- **Examples**: [docs/mastra.md#examples](docs/mastra.md) - Lines 137-251
