import "dotenv/config";
import { mastra } from "./src/mastra";

async function testWeatherWorkflow() {
  console.log("=== Testing Weather Workflow with Enhanced Logging ===\n");

  try {
    const workflow = mastra.getWorkflow("weatherWorkflow");
    if (!workflow) {
      console.error("❌ Weather workflow not found!");
      return;
    }

    console.log("✅ Weather workflow found");
    console.log("📍 Testing with city: Santa Catarina\n");

    // Create a run instance
    const run = await workflow.createRunAsync();
    console.log(`🚀 Starting workflow run: ${run.id}\n`);

    // Watch for events
    run.watch((event) => {
      console.log(`📊 Event: ${event.type}`, {
        step: event.payload?.currentStep?.id,
        status: event.payload?.currentStep?.status,
      });
    });

    // Start the workflow
    const startTime = Date.now();
    const result = await run.start({
      inputData: {
        city: "Santa Catarina",
      },
    });
    const duration = Date.now() - startTime;

    console.log(`\n⏱️  Total workflow duration: ${duration}ms`);
    console.log(`📈 Workflow status: ${result.status}\n`);

    if (result.status === "success") {
      console.log("✅ Workflow completed successfully!");
      console.log("\n🌟 Generated Activities:");
      console.log("=".repeat(80));
      console.log(result.result?.activities);
      console.log("=".repeat(80));
    } else if (result.status === "suspended") {
      console.log("⏸️  Workflow suspended");
      console.log("Suspended steps:", result.suspended);
    } else if (result.status === "failed") {
      console.error("❌ Workflow failed!");
      console.error("Error:", result.error);
      console.error("\nStep errors:");
      Object.entries(result.steps || {}).forEach(([stepId, stepData]) => {
        if ((stepData as any).status === "failed") {
          console.error(`  - ${stepId}:`, (stepData as any).error);
        }
      });
    }

    // Test with an invalid city
    console.log("\n\n=== Testing with invalid city ===");
    const run2 = await workflow.createRunAsync();
    console.log(`🚀 Starting workflow run: ${run2.id}\n`);

    try {
      const result2 = await run2.start({
        inputData: {
          city: "InvalidCityName123456",
        },
      });
      console.log(`📈 Workflow status: ${result2.status}`);
      if (result2.status === "failed") {
        console.log("✅ Correctly handled invalid city");
        console.log("Error:", result2.error);
      }
    } catch (error) {
      console.log("✅ Correctly threw error for invalid city");
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("\n❌ Test failed with error:");
    console.error(error);
  }
}

// Run the test
console.log("Starting weather workflow test...\n");
testWeatherWorkflow()
  .then(() => {
    console.log("\n✅ Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  });
