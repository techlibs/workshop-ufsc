# Weather Agent + Workflow Integration - Complete Guide

## 🎯 What Was Done

Your weather agent now intelligently uses **both** the weather tool AND the weather workflow to provide the best response based on user intent.

## 📁 Files Modified & Created

### Modified Files
1. **`src/mastra/agents/weather-agent.ts`**
   - Added `weatherWorkflow` import
   - Added `workflows: { weatherWorkflow }` to agent config
   - Updated instructions to guide tool vs workflow usage

### Created Documentation
1. **`INTEGRATION_SUMMARY.md`** - Quick overview and key changes
2. **`WEATHER_INTEGRATION.md`** - Detailed technical explanation
3. **`INTEGRATION_DIAGRAM.md`** - Visual architecture diagrams
4. **`test-weather-integration.ts`** - Integration test script
5. **`examples/api-usage-example.ts`** - 7 practical examples
6. **`examples/README.md`** - Examples documentation

## 🚀 Quick Start

### Test the Integration

```bash
# Run the integration test
npx tsx test-weather-integration.ts

# Run all examples
npx tsx examples/api-usage-example.ts
```

### Use in Your Code

```typescript
import { mastra } from './src/mastra';

const agent = mastra.getAgent('weatherAgent');

// Quick weather check (uses tool)
const weather = await agent.generate("What's the weather in London?");

// Activity planning (uses workflow)
const activities = await agent.generate("Suggest activities for Paris");
```

## 🧠 How It Works

### The Agent Decides

The agent automatically chooses the right approach:

```typescript
if (user asks about "weather" only) {
  → Uses weatherTool
  → Fast, simple response
  → Basic weather data
}

if (user asks for "activities" or "planning") {
  → Uses weatherWorkflow
  → Comprehensive response
  → Formatted with emojis and structure
}
```

### Architecture Overview

```
┌─────────────────────┐
│   Weather Agent     │ ← You call this
├─────────────────────┤
│ Tools:              │
│  • weatherTool      │ ← Fast path
│                     │
│ Workflows:          │
│  • weatherWorkflow  │ ← Rich path
└─────────────────────┘
         │
         ├─► Simple query → weatherTool
         │                    ↓
         │                  Quick Response
         │
         └─► Complex query → weatherWorkflow
                               │
                               ├─► Step 1: fetchWeather
                               │
                               └─► Step 2: planActivities
                                      │
                                      └─► Uses Agent for formatting!
```

## 📊 Response Comparison

### Tool Response (Quick)
```
Temperature: 20°C
Feels like: 18°C
Humidity: 65%
Wind: 15 km/h
Conditions: Sunny
```

### Workflow Response (Formatted)
```
📅 Friday, March 15, 2024
═══════════════════════════

🌡️ WEATHER SUMMARY
• Conditions: Partly cloudy
• Temperature: 15°C to 22°C
• Precipitation: 20% chance

🌅 MORNING ACTIVITIES
Outdoor:
• Seine River Walk - Beautiful morning stroll
  Best timing: 8:00-10:00
  Note: Cooler temperatures, bring light jacket

🌞 AFTERNOON ACTIVITIES
Outdoor:
• Montmartre Exploration - Visit Sacré-Cœur
  Best timing: 14:00-17:00
  Note: Warmest part of day

🏠 INDOOR ALTERNATIVES
• Louvre Museum - World-class art
  Ideal for: If rain increases

⚠️ SPECIAL CONSIDERATIONS
• UV Index: Moderate
• Wind: Light breeze, 10-15 km/h
```

## 💡 Key Benefits

### 1. Smart Routing
✅ Automatic selection of tool vs workflow
✅ Based on user intent
✅ Optimized for speed when appropriate
✅ Rich formatting when needed

### 2. Better User Experience
✅ Fast responses for simple queries
✅ Comprehensive responses for planning
✅ Consistent formatting with emojis
✅ Structured, readable output

### 3. Composable Architecture
✅ Tool for data fetching
✅ Workflow for orchestration
✅ Agent for decision making + generation
✅ Reusable components

### 4. Maintainable Code
✅ Single agent handles both use cases
✅ Clear separation of concerns
✅ Type-safe throughout
✅ Easy to extend

## 🎓 Advanced Pattern: Circular Composition

**The Cool Part**: The workflow uses the agent!

```
Weather Agent
    │
    ├─ Has weatherTool (tool)
    │
    └─ Has weatherWorkflow (workflow)
            │
            └─ planActivities step
                    │
                    └─ Uses Weather Agent! ← Circular!
```

**Why This Works**:
1. Agent acts as **router** (which path to take)
2. Workflow acts as **orchestrator** (what steps, in order)
3. Agent acts as **generator** (format the output)

Different roles, no conflict!

## 📚 Documentation Map

Start here based on what you need:

| I Want To... | Read This |
|--------------|-----------|
| **Quick overview** | `INTEGRATION_SUMMARY.md` |
| **Understand architecture** | `INTEGRATION_DIAGRAM.md` |
| **Deep technical details** | `WEATHER_INTEGRATION.md` |
| **See code examples** | `examples/README.md` |
| **Test it** | `test-weather-integration.ts` |

## 🔧 Common Use Cases

### 1. API Endpoint
```typescript
app.post('/weather', async (req, res) => {
  const agent = mastra.getAgent('weatherAgent');
  const response = await agent.generate(req.body.message);
  res.json({ response: response.text });
});
```

### 2. Chat Interface
```typescript
const stream = await agent.stream(userMessage);
for await (const chunk of stream.textStream) {
  sendToUI(chunk); // Real-time updates
}
```

### 3. Scheduled Planning
```typescript
// Daily morning activity planner
const activities = await agent.generate(
  `Plan activities for ${city} today`
);
emailUser(activities.text);
```

## 🎯 When to Use Each

| Use weatherTool When... | Use weatherWorkflow When... |
|------------------------|----------------------------|
| Just need current data | Need activity suggestions |
| Speed is critical | Format is important |
| Simple display | Complex planning |
| Data for processing | Human-readable output |

## ⚠️ Important Notes

### The agent chooses automatically!
You don't need to specify tool or workflow. Just ask naturally:
- "Weather in Paris?" → Tool
- "Plan my day in Paris" → Workflow

### Both use the same agent
```typescript
const agent = mastra.getAgent('weatherAgent');
// Same agent, different responses based on query
```

### Workflow is slower (but richer)
- Tool: ~1-2 seconds
- Workflow: ~5-10 seconds (includes LLM generation)

### Memory works with both
```typescript
await agent.generate("Weather in Tokyo?", {
  memory: { resource: 'user_123', thread: { id: 'planning' } }
});
```

## 🧪 Testing Strategy

### 1. Unit Test: Tool
```typescript
const response = await agent.generate("Weather in London?");
expect(response.text).toContain('Temperature');
```

### 2. Unit Test: Workflow
```typescript
const response = await agent.generate("Plan activities for Paris");
expect(response.text).toContain('🌅 MORNING ACTIVITIES');
```

### 3. Integration Test
```bash
npx tsx test-weather-integration.ts
```

## 🚀 Next Steps

1. **Run Tests**
   ```bash
   npx tsx test-weather-integration.ts
   npx tsx examples/api-usage-example.ts
   ```

2. **Try Different Queries**
   - "Weather in Tokyo?"
   - "Plan my weekend in Barcelona"
   - "What should I do in London tomorrow?"

3. **Customize**
   - Modify workflow format in `planActivities` step
   - Adjust agent instructions
   - Add more tools/workflows

4. **Deploy**
   - Add API routes
   - Build UI
   - Integrate with your app

## 📞 Support

If you have questions:
1. Check the documentation files
2. Run the examples
3. Review the test file
4. Consult [Mastra Docs](https://mastra.ai/docs)

## ✨ Summary

**Before**: Agent with tool only
```
User → Agent → weatherTool → Simple response
```

**After**: Agent with tool AND workflow
```
User → Agent → Decides:
                ├─► Tool → Fast simple response
                └─► Workflow → Rich formatted response
```

**Result**: Smarter, more flexible, better UX! 🎉
