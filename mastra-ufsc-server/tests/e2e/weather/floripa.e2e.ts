#!/usr/bin/env node
/**
 * Test specifically with "floripa" nickname
 */

import { mastra } from "../../../src/mastra";

async function testFloripa() {
  console.log("🧪 Testing workflow with 'floripa' nickname\n");

  try {
    const result = await mastra.workflows.getWorkflow("weather-workflow")!.run({
      input: { city: "floripa" },
    });

    console.log("\n✅ SUCCESS! Floripa nickname works!");
    console.log("\n📊 Result:");
    console.log(result.results.activities);
  } catch (error) {
    console.error("❌ Failed:", error);
  }
}

testFloripa();
