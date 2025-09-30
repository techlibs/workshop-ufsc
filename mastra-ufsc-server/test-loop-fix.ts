import "dotenv/config";
import { mastra } from "./src/mastra";

async function testLoopFix() {
  console.log("\n🔧 Testing Loop Fix\n");
  console.log("=" + "=".repeat(70));

  const agent = mastra.getAgent("weatherAgent");
  const startTime = Date.now();

  console.log("\n📍 Testing: Activity request in Portuguese (Florianópolis)");
  console.log("-" + "-".repeat(70));
  console.log("Query: 'o que fazer hoje em Florianópolis?'");
  console.log("\n⏱️  Starting workflow...\n");

  try {
    const response = await agent.generate([
      {
        role: "user",
        content: "o que fazer hoje em Florianópolis?",
      },
    ]);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("\n" + "=".repeat(70));
    console.log("✅ SUCCESS!");
    console.log("=".repeat(70));
    console.log(`⏱️  Time taken: ${duration}s`);
    console.log(`📝 Response length: ${response.text.length} characters`);
    console.log("\n📄 Response:\n");
    console.log(response.text);
    console.log("\n" + "=".repeat(70));

    // Verify no loops (response should appear only once)
    const lines = response.text.split("\n");
    const dateLines = lines.filter((line) => line.includes("📅"));

    if (dateLines.length > 1) {
      console.log(
        "\n⚠️  WARNING: Multiple date headers found - possible loop!"
      );
      console.log(`Found ${dateLines.length} date headers`);
    } else {
      console.log("✅ No loops detected - response appears only once");
    }

    // Performance check
    if (parseFloat(duration) > 15) {
      console.log(`\n⚠️  WARNING: Slow response (${duration}s > 15s expected)`);
    } else {
      console.log(`✅ Good performance (${duration}s)`);
    }
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

testLoopFix().catch(console.error);
