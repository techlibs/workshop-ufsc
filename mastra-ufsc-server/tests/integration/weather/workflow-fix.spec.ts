import "dotenv/config";
import { mastra } from "../../../src/mastra";

async function testWorkflowFix() {
  console.log("\n🔧 Testing Workflow Fix\n");
  console.log("=" + "=".repeat(60));

  const agent = mastra.getAgent("weatherAgent");

  // Test 1: Simple workflow call
  console.log("\n📍 Test 1: Direct Workflow Call for Ceará");
  console.log("-" + "-".repeat(60));

  try {
    const response = await agent.generate([
      {
        role: "user",
        content: "o que eu posso fazer hoje no ceara?",
      },
    ]);

    console.log("\n✅ Success! Response:");
    console.log(response.text);
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : error
    );
  }

  // Test 2: Test with a well-known city
  console.log("\n\n📍 Test 2: Activity Planning for Paris");
  console.log("-" + "-".repeat(60));

  try {
    const response = await agent.generate([
      {
        role: "user",
        content: "Can you suggest activities for tomorrow in Paris?",
      },
    ]);

    console.log("\n✅ Success! Response:");
    console.log(response.text);
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : error
    );
  }
}

testWorkflowFix().catch(console.error);
