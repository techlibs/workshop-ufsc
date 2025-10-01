#!/usr/bin/env node
/**
 * Test script to verify city nickname support
 */

import { geocodeLocation } from "../../../src/mastra/domains/weather";

async function testCityNicknames() {
  console.log("🧪 Testing City Nickname Support\n");
  console.log("=".repeat(50));

  const testCases = [
    "floripa", // Nickname
    "Florianópolis", // Official name
    "sampa", // São Paulo nickname
    "São Paulo", // Official
    "New York", // International
    "invalid-city-xyz", // Should fail
  ];

  for (const city of testCases) {
    try {
      console.log(`\n📍 Testing: "${city}"`);
      const result = await geocodeLocation(city);
      console.log(`   ✅ Found: ${result.name}`);
      console.log(`   📌 Coordinates: ${result.latitude}, ${result.longitude}`);
    } catch (error) {
      console.log(
        `   ❌ Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Test complete!\n");
}

testCityNicknames().catch(console.error);
