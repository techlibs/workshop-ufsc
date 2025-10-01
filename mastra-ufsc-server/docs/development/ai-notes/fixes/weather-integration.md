# Weather Agent + Workflow Integration

## Overview

The project integrates the **Weather Agent** with the **Weather Workflow** to provide two levels of weather assistance:

1. **Quick Weather Checks**: Uses `weatherTool` for fast, concise weather information
2. **Activity Planning**: Uses `weatherWorkflow` for detailed, formatted activity suggestions based on weather

## Architecture

```
User Request
     │
     ▼
Weather Agent (decides which approach to use)
     │
     ├─► Quick weather? ──► weatherTool ──► Simple response
     │
     └─► Activity planning? ──► weatherWorkflow ──► Formatted activities
                                      │
                                      ├─► Step 1: fetchWeather
                                      └─► Step 2: planActivities (uses agent)
```

## Components

### 1. Weather Agent (`src/mastra/agents/weather-agent.ts`)

The agent intelligently decides whether to:
- Use the **tool** for simple weather queries
- Use the **workflow** for activity planning with formatting

**Key Configuration:**
```typescript
{
  tools: { weatherTool },      // For quick weather
  workflows: { weatherWorkflow } // For activity planning
}
```

### 2. Weather Tool (`src/mastra/tools/weather-tool.ts`)

- **Purpose**: Fetch current weather data quickly
- **Returns**: Temperature, feels like, humidity, wind, conditions
- **Use Case**: "What's the weather in London?"

### 3. Weather Workflow (`src/mastra/workflows/weather-workflow.ts`)

- **Purpose**: Comprehensive activity planning based on weather
- **Steps**:
  1. `fetchWeather`: Gets weather forecast data
  2. `planActivities`: Uses the agent to suggest activities with rich formatting
- **Use Case**: "Suggest activities for tomorrow in Paris"

**Output Format:**
```
📅 [Date]
═══════════════════════════

🌡️ WEATHER SUMMARY
• Conditions: [description]
• Temperature: [range]
• Precipitation: [chance]

🌅 MORNING ACTIVITIES
Outdoor:
• [Activity] - [Description]
  Best timing: [time]
  Note: [weather consideration]

🌞 AFTERNOON ACTIVITIES
...

🏠 INDOOR ALTERNATIVES
...

⚠️ SPECIAL CONSIDERATIONS
...
```

## How It Works

### Scenario 1: Quick Weather Check

**User**: "What's the weather in London?"

**Agent Decision**: Uses `weatherTool`

**Flow**:
1. Agent receives request
2. Calls weatherTool with location "London"
3. Returns simple weather data
4. Agent formats concise response

**Response**: Brief weather summary with current conditions

---

### Scenario 2: Activity Planning

**User**: "Can you suggest activities for tomorrow in Paris?"

**Agent Decision**: Uses `weatherWorkflow`

**Flow**:
1. Agent receives request
2. Identifies need for activity planning
3. Invokes weatherWorkflow with city "Paris"
4. Workflow Step 1 (`fetchWeather`): Fetches forecast data
5. Workflow Step 2 (`planActivities`):
   - Uses Weather Agent internally
   - Generates structured activity suggestions
   - Applies emoji formatting
6. Returns comprehensive, formatted response

**Response**: Detailed activity plan with emojis and structure

## Benefits of This Integration

### 1. **Best of Both Worlds**
- **Tool**: Fast, lightweight for simple queries
- **Workflow**: Comprehensive, formatted for complex requests

### 2. **Smart Routing**
The agent automatically chooses the right approach based on:
- User intent (quick info vs planning)
- Context (weather check vs activity suggestions)

### 3. **Consistent Formatting**
Workflow ensures activity suggestions follow a consistent, readable format with:
- Emojis for visual appeal
- Structured sections
- Time-specific recommendations
- Weather considerations

### 4. **Composable Architecture**
The workflow's `planActivities` step reuses the agent, demonstrating:
- Agent-in-workflow pattern
- Separation of concerns
- Reusability

## Testing

Run the integration test:

```bash
npx tsx test-weather-integration.ts
```

This will demonstrate:
1. Quick weather check (tool usage)
2. Activity planning (workflow usage)

## Key Takeaways

1. **Agents can use both tools AND workflows**: This provides flexibility
2. **Workflows can use agents**: The `planActivities` step calls the agent
3. **Smart routing**: The agent decides which approach based on user intent
4. **Better UX**: Workflows provide structured, formatted output for complex tasks

## When to Use Each Approach

| Use Tool When... | Use Workflow When... |
|-----------------|---------------------|
| Quick data fetch | Multi-step process |
| Simple response | Formatted output needed |
| Low latency critical | Rich context required |
| Stateless operation | Orchestration needed |

## Related Documentation

- [Mastra Workflows with Agents](https://mastra.ai/docs/workflows/using-with-agents-and-tools)
- [Agent Tools](https://mastra.ai/docs/agents/using-tools-and-mcp)
- [Workflow Overview](https://mastra.ai/docs/workflows/overview)
