import "dotenv/config";
import { mastra } from "../../src/mastra";

async function testBeachAgent() {
  console.log("🏖️ Testing Floripa Beach Agent\n");

  const agent = mastra.getAgent("beachAgent");
  if (!agent) {
    console.error("Beach agent not found!");
    return;
  }

  // Test 1: Looking for surf beaches
  console.log("Test 1: User wants to surf (intermediate level)");
  console.log(
    "User: I'm an intermediate surfer visiting Floripa. Where should I go surfing?"
  );
  const surfResponse = await agent.generate(
    "I'm an intermediate surfer visiting Floripa. Where should I go surfing?",
    {
      memory: {
        resource: "test-user",
        thread: { id: "beach-test-1" },
      },
    }
  );
  console.log("\nAgent:", surfResponse.text);
  console.log("\n" + "=".repeat(80) + "\n");

  // Test 2: Looking for chill beaches
  console.log("Test 2: User wants to relax");
  console.log(
    "User: I just want to chill on a quiet beach with good infrastructure"
  );
  const chillResponse = await agent.generate(
    "I just want to chill on a quiet beach with good infrastructure",
    {
      memory: {
        resource: "test-user",
        thread: { id: "beach-test-2" },
      },
    }
  );
  console.log("\nAgent:", chillResponse.text);
  console.log("\n" + "=".repeat(80) + "\n");

  // Test 3: Asking about a specific beach
  console.log("Test 3: Asking about a specific beach");
  console.log("User: Tell me about Praia Mole");
  const specificResponse = await agent.generate("Tell me about Praia Mole", {
    memory: {
      resource: "test-user",
      thread: { id: "beach-test-3" },
    },
  });
  console.log("\nAgent:", specificResponse.text);
  console.log("\n" + "=".repeat(80) + "\n");

  // Test 4: Family-friendly beaches
  console.log("Test 4: Looking for family beaches");
  console.log(
    "User: I'm looking for family-friendly beaches in the North with calm water"
  );
  const familyResponse = await agent.generate(
    "I'm looking for family-friendly beaches in the North with calm water",
    {
      memory: {
        resource: "test-user",
        thread: { id: "beach-test-4" },
      },
    }
  );
  console.log("\nAgent:", familyResponse.text);
  console.log("\n" + "=".repeat(80) + "\n");

  // Test 5: Advanced surfer looking for challenges
  console.log("Test 5: Advanced surfer");
  console.log(
    "User: I'm an experienced surfer looking for the most challenging waves in Floripa"
  );
  const advancedResponse = await agent.generate(
    "I'm an experienced surfer looking for the most challenging waves in Floripa",
    {
      memory: {
        resource: "test-user",
        thread: { id: "beach-test-5" },
      },
    }
  );
  console.log("\nAgent:", advancedResponse.text);

  console.log("\n🏁 Beach Agent testing complete!");
}

// Run the test
testBeachAgent().catch(console.error);
