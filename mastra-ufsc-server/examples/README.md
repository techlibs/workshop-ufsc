# Weather Agent Integration Examples

This directory contains practical examples demonstrating how to use the integrated Weather Agent + Workflow system.

## Quick Start

Run all examples:
```bash
npx tsx examples/api-usage-example.ts
```

Run specific examples:
```typescript
import { example1_QuickWeather } from './examples/api-usage-example';

example1_QuickWeather();
```

## Examples Included

### Example 1: Quick Weather Check
**Use Case**: Get current weather quickly
**Agent Behavior**: Uses `weatherTool` for fast response
```typescript
const response = await agent.generate([
  { role: 'user', content: "What's the weather in Tokyo?" }
]);
```
**Output**: Simple weather data (temperature, conditions, humidity, wind)

---

### Example 2: Activity Planning
**Use Case**: Get comprehensive activity suggestions
**Agent Behavior**: Uses `weatherWorkflow` for formatted response
```typescript
const response = await agent.generate([
  { role: 'user', content: 'Activity suggestions for Barcelona tomorrow' }
]);
```
**Output**: Rich formatted response with:
- Morning activities
- Afternoon activities
- Indoor alternatives
- Weather considerations

---

### Example 3: Streaming Response
**Use Case**: Real-time response for better UX
**Agent Behavior**: Streams workflow response
```typescript
const stream = await agent.stream([
  { role: 'user', content: 'Plan activities for Rome this weekend' }
]);

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```
**Output**: Streamed, formatted activity plan

---

### Example 4: Multi-turn Conversation
**Use Case**: Contextual conversation
**Agent Behavior**: Maintains conversation context
```typescript
// Turn 1: General inquiry
"I'm planning a trip to Amsterdam"

// Turn 2: Weather check
"What will the weather be like?"

// Turn 3: Activity planning
"Can you suggest some activities?"
```
**Output**: Contextually aware responses

---

### Example 5: Error Handling
**Use Case**: Handle invalid inputs gracefully
**Agent Behavior**: Returns helpful error messages
```typescript
try {
  const response = await agent.generate([
    { role: 'user', content: 'Activities in XYZ12345?' }
  ]);
} catch (error) {
  console.error('Error:', error.message);
}
```
**Output**: Error handling demonstration

---

### Example 6: Tool vs Workflow Comparison
**Use Case**: See the difference in responses
**Agent Behavior**: Side-by-side comparison
```typescript
// Tool response
"What's the weather in London?"

// Workflow response
"Plan activities for London"
```
**Output**: Comparison of tool vs workflow responses

---

### Example 7: Using with Memory
**Use Case**: Maintain conversation history
**Agent Behavior**: Remembers previous context
```typescript
// First query
agent.generate("What's the weather in Paris?", {
  memory: { resource: 'user_123', thread: { id: 'vacation_planning' } }
});

// Follow-up (agent remembers "Paris")
agent.generate("Can you suggest activities there?", {
  memory: { resource: 'user_123', thread: { id: 'vacation_planning' } }
});
```
**Output**: Context-aware responses using memory

---

## Response Patterns

### Tool Response (Fast)
```
Current weather in Tokyo:
Temperature: 22°C
Feels like: 20°C
Humidity: 70%
Wind Speed: 12 km/h
Conditions: Partly cloudy
```

### Workflow Response (Formatted)
```
📅 Saturday, March 16, 2024
═══════════════════════════

🌡️ WEATHER SUMMARY
• Conditions: Partly cloudy
• Temperature: 18°C to 24°C
• Precipitation: 10% chance

🌅 MORNING ACTIVITIES
Outdoor:
• Meiji Shrine Visit - Peaceful morning walk
  Best timing: 7:00-9:00
  Note: Cooler morning temperatures

🌞 AFTERNOON ACTIVITIES
...
```

## Integration Points

These examples can be used in:

1. **API Routes**: Integrate with Express, Hono, Next.js API routes
2. **CLI Tools**: Build command-line weather assistants
3. **Chat Interfaces**: Power conversational UIs
4. **Automated Systems**: Schedule activity planning
5. **Mobile Apps**: Backend for weather planning apps

## Best Practices Demonstrated

✅ **Error Handling**: Graceful error management
✅ **Streaming**: Real-time response delivery
✅ **Memory**: Conversation history management
✅ **Context**: Multi-turn conversations
✅ **Smart Routing**: Automatic tool/workflow selection
✅ **Type Safety**: Full TypeScript support

## Common Use Cases

### 1. Travel Planning App
```typescript
// User plans a trip
await agent.generate("I'm visiting Barcelona next week", { memory: {...} });

// Get weather
await agent.generate("What's the weather like?", { memory: {...} });

// Plan activities
await agent.generate("Suggest activities", { memory: {...} });
```

### 2. Quick Weather Widget
```typescript
// Simple weather display
const weather = await agent.generate("Weather in London?");
// Display in UI
```

### 3. Activity Recommendation Service
```typescript
// Comprehensive planning
const stream = await agent.stream("Plan weekend in Paris");
// Stream to user interface
```

## Next Steps

1. **Try the examples**: Run `npx tsx examples/api-usage-example.ts`
2. **Modify parameters**: Change cities, queries, memory settings
3. **Build your own**: Use these as templates for your use case
4. **Integrate**: Add to your API routes or application

## Troubleshooting

**Problem**: "Agent not found"
- **Solution**: Ensure `mastra` instance includes `weatherAgent`

**Problem**: "Tool execution failed"
- **Solution**: Check network connection for weather API calls

**Problem**: "Workflow timeout"
- **Solution**: Weather API might be slow, increase timeout

**Problem**: "Memory not persisting"
- **Solution**: Check LibSQL database connection

## Related Documentation

- [INTEGRATION_SUMMARY.md](../INTEGRATION_SUMMARY.md) - Overview
- [WEATHER_INTEGRATION.md](../WEATHER_INTEGRATION.md) - Technical details
- [INTEGRATION_DIAGRAM.md](../INTEGRATION_DIAGRAM.md) - Architecture
- [Mastra Agents Docs](https://mastra.ai/docs/agents/overview)

---

# Meta-Agent Web Search + RAG Examples

Two new scripts demonstrate the Requirements Collector RAG pipeline:

| Script | Purpose |
|--------|---------|
| `examples/meta-agent/web-search/ingest-and-retrieve.ts` | Direct use of RAG service: ingest + retrieve context chunks. |
| `examples/meta-agent/web-search/workflow-run.ts` | Executes the requirements collector workflow with ingestion integrated. |

## Quick Run
```bash
pnpm tsx examples/meta-agent/web-search/ingest-and-retrieve.ts "Design a workflow that summarizes daily dev standups"
pnpm tsx examples/meta-agent/web-search/workflow-run.ts "Create a workflow that processes GitHub issues and summarizes weekly"
```

## Environment Notes
- Works without API keys (search may fail gracefully; embeddings fallback to deterministic vectors).
- Set `META_AGENT_SEARCH_PROVIDER` and provider keys for real ingestion.

## Expected Output (Ingest + Retrieve)
```
[Meta-Agent RAG] Ingesting query: Design a workflow...
Ingestion summary:
- https://example.com/... :: chunks=0 (skipped: BRAVE_API_KEY missing)

[Meta-Agent RAG] Retrieving contextual chunks...
> Chunk abc123 (score=0.742)
Lorem ipsum excerpt...
```

## Roadmap Hooks
- Will evolve to include suspend/resume interview loop examples once workflow events land.
- Future examples: multi-provider comparison, citation formatting, and MCP docs hybrid retrieval.
