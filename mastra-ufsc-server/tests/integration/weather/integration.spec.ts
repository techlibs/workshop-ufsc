import "dotenv/config";
import { mastra } from "../../../src/mastra";

async function testWeatherIntegration() {
  const agent = mastra.getAgent("weatherAgent");

  console.log("\n🔷 Test 1: Quick Weather Check (uses weatherTool)");
  console.log("=" + "=".repeat(60));
  const quickWeather = await agent.generate([
    {
      role: "user",
      content: "What's the weather in London?",
    },
  ]);
  console.log(quickWeather.text);

  console.log("\n\n🔷 Test 2: Activity Planning (uses weatherWorkflow)");
  console.log("=" + "=".repeat(60));
  const activityPlan = await agent.generate([
    {
      role: "user",
      content: "Can you suggest activities for tomorrow in Paris?",
    },
  ]);
  console.log(activityPlan.text);
}

testWeatherIntegration().catch(console.error);
