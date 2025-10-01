import { RuntimeContext } from "@mastra/core/runtime-context";
import { mastra } from "../../src/mastra";

async function testInventoryAgent() {
  console.log("🛒 Testing Inventory Agent\n");

  const agent = mastra.getAgent("inventoryAgent");

  if (!agent) {
    console.error("❌ Inventory agent not found!");
    return;
  }

  // Simulate a shopping conversation
  const threadId = `test-thread-${Date.now()}`;
  const resource = "test-user";

  // Create runtime context with thread ID
  const runtimeContext = new RuntimeContext();
  runtimeContext.set("threadId", threadId);

  try {
    // Test 1: Search for fruits
    console.log("1️⃣ Searching for fruits...\n");
    const response1 = await agent.generate(
      "Hi! I'm looking for some fresh fruits. What do you have available?",
      {
        memory: {
          thread: { id: threadId },
          resource: resource,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response1.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 2: Add items to cart
    console.log("2️⃣ Adding items to cart...\n");
    const response2 = await agent.generate(
      "I'd like to add 2 kg of apples and 1 kg of bananas to my cart please.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response2.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 3: Search for drinks
    console.log("3️⃣ Searching for drinks...\n");
    const response3 = await agent.generate(
      "What drinks do you have? I'm looking for something refreshing.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response3.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 4: Add more items
    console.log("4️⃣ Adding more items...\n");
    const response4 = await agent.generate(
      "Add 2 bottles of orange juice to my cart.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response4.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 5: Remove item
    console.log("5️⃣ Removing an item...\n");
    const response5 = await agent.generate(
      "Actually, I changed my mind about the bananas. Please remove them from my cart.",
      {
        memory: {
          thread: { id: threadId },
          resource: resource,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response5.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 6: View final cart
    console.log("6️⃣ Viewing final cart...\n");
    const response6 = await agent.generate(
      "Can you show me what's in my cart now?",
      {
        memory: {
          thread: { id: threadId },
          resource: resource,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response6.text);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the test
testInventoryAgent().catch(console.error);
