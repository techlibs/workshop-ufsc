/**
 * Example: Using the Weather Agent Integration in Different Scenarios
 *
 * This file demonstrates various ways to interact with the integrated
 * Weather Agent + Workflow system.
 */

import { mastra } from "../../src/mastra";

// ============================================================================
// Example 1: Direct Agent Usage (Simple)
// ============================================================================
async function example1_QuickWeather() {
  console.log("\n📍 Example 1: Quick Weather Check");
  console.log("=" + "=".repeat(60));

  const agent = mastra.getAgent("weatherAgent");

  const response = await agent.generate([
    {
      role: "user",
      content: "What's the current weather in Tokyo?",
    },
  ]);

  console.log(response.text);
  console.log("\n✅ Used: weatherTool (fast response)\n");
}

// ============================================================================
// Example 2: Activity Planning Request
// ============================================================================
async function example2_ActivityPlanning() {
  console.log("\n📍 Example 2: Activity Planning");
  console.log("=" + "=".repeat(60));

  const agent = mastra.getAgent("weatherAgent");

  const response = await agent.generate([
    {
      role: "user",
      content: "I need activity suggestions for tomorrow in Barcelona",
    },
  ]);

  console.log(response.text);
  console.log("\n✅ Used: weatherWorkflow (formatted response)\n");
}

// ============================================================================
// Example 3: Streaming Response (Real-time)
// ============================================================================
async function example3_StreamingActivities() {
  console.log("\n📍 Example 3: Streaming Activity Planning");
  console.log("=" + "=".repeat(60));

  const agent = mastra.getAgent("weatherAgent");

  const stream = await agent.stream([
    {
      role: "user",
      content: "Can you plan outdoor activities for Rome this weekend?",
    },
  ]);

  // Stream the response as it's generated
  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }

  console.log("\n\n✅ Streamed: weatherWorkflow response\n");
}

// ============================================================================
// Example 4: Multi-turn Conversation
// ============================================================================
async function example4_Conversation() {
  console.log("\n📍 Example 4: Multi-turn Conversation");
  console.log("=" + "=".repeat(60));

  const agent = mastra.getAgent("weatherAgent");

  // First message: General inquiry
  console.log('\nUser: "I\'m planning a trip to Amsterdam"');
  const response1 = await agent.generate([
    {
      role: "user",
      content: "I'm planning a trip to Amsterdam",
    },
  ]);
  console.log(`Agent: ${response1.text}`);

  // Follow-up: Weather check
  console.log('\nUser: "What will the weather be like?"');
  const response2 = await agent.generate([
    {
      role: "user",
      content: "I'm planning a trip to Amsterdam",
    },
    {
      role: "assistant",
      content: response1.text,
    },
    {
      role: "user",
      content: "What will the weather be like?",
    },
  ]);
  console.log(`Agent: ${response2.text}`);

  // Follow-up: Activity planning
  console.log('\nUser: "Can you suggest some activities?"');
  const response3 = await agent.generate([
    {
      role: "user",
      content: "I'm planning a trip to Amsterdam",
    },
    {
      role: "assistant",
      content: response1.text,
    },
    {
      role: "user",
      content: "What will the weather be like?",
    },
    {
      role: "assistant",
      content: response2.text,
    },
    {
      role: "user",
      content: "Can you suggest some activities?",
    },
  ]);
  console.log(`Agent: ${response3.text}`);

  console.log("\n✅ Multi-turn conversation with context\n");
}

// ============================================================================
// Example 5: Error Handling
// ============================================================================
async function example5_ErrorHandling() {
  console.log("\n📍 Example 5: Error Handling");
  console.log("=" + "=".repeat(60));

  const agent = mastra.getAgent("weatherAgent");

  try {
    const response = await agent.generate([
      {
        role: "user",
        content: "What about activities in XYZ12345?", // Invalid city
      },
    ]);

    console.log(response.text);
  } catch (error) {
    console.error(
      "Error occurred:",
      error instanceof Error ? error.message : error
    );
  }

  console.log("\n✅ Error handling demonstrated\n");
}

// ============================================================================
// Example 6: Comparing Tool vs Workflow Response
// ============================================================================
async function example6_Comparison() {
  console.log("\n📍 Example 6: Tool vs Workflow Comparison");
  console.log("=" + "=".repeat(60));

  const agent = mastra.getAgent("weatherAgent");

  // Tool-based response
  console.log("\n--- TOOL RESPONSE (Quick Weather) ---");
  const toolResponse = await agent.generate([
    {
      role: "user",
      content: "What's the weather in London?",
    },
  ]);
  console.log(toolResponse.text);

  console.log("\n--- WORKFLOW RESPONSE (Activity Planning) ---");
  // Workflow-based response
  const workflowResponse = await agent.generate([
    {
      role: "user",
      content: "Plan activities for London",
    },
  ]);
  console.log(workflowResponse.text);

  console.log("\n✅ Comparison complete\n");
}

// ============================================================================
// Example 7: Using with Memory (Conversation History)
// ============================================================================
async function example7_WithMemory() {
  console.log("\n📍 Example 7: Using Agent with Memory");
  console.log("=" + "=".repeat(60));

  const agent = mastra.getAgent("weatherAgent");

  // First interaction
  const response1 = await agent.generate("What's the weather in Paris?", {
    memory: {
      resource: "user_123",
      thread: { id: "vacation_planning" },
    },
  });
  console.log("\nFirst query:", response1.text);

  // Second interaction (agent remembers context)
  const response2 = await agent.generate("Can you suggest activities there?", {
    memory: {
      resource: "user_123",
      thread: { id: "vacation_planning" },
    },
  });
  console.log("\nFollow-up query:", response2.text);

  console.log("\n✅ Agent used memory to maintain context\n");
}

// ============================================================================
// Run All Examples
// ============================================================================
async function runAllExamples() {
  console.log("\n🚀 Weather Agent Integration Examples\n");
  console.log("=" + "=".repeat(70));

  try {
    await example1_QuickWeather();
    await example2_ActivityPlanning();
    await example3_StreamingActivities();
    await example4_Conversation();
    await example5_ErrorHandling();
    await example6_Comparison();
    await example7_WithMemory();

    console.log("\n✨ All examples completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export {
  example1_QuickWeather,
  example2_ActivityPlanning,
  example3_StreamingActivities,
  example4_Conversation,
  example5_ErrorHandling,
  example6_Comparison,
  example7_WithMemory,
};
