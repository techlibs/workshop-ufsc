import "dotenv/config";
import { mastra } from "../../src/mastra";

async function testStudyAgent() {
  console.log("🎓 Testing Study Agent for Blockchain & AI Learning\n");

  const agent = mastra.getAgent("studyAgent");

  // Test 1: Basic concept explanation
  console.log("Test 1: Explaining a blockchain concept");
  console.log("=====================================\n");

  const response1 = await agent.generate(
    "What is a smart contract? Explain it in simple terms."
  );
  console.log(response1.text);
  console.log("\n---\n");

  // Test 2: AI agent concept
  console.log("Test 2: Explaining an AI agent concept");
  console.log("=====================================\n");

  const response2 = await agent.generate(
    "Explain the ReAct pattern in AI agents and why it's useful."
  );
  console.log(response2.text);
  console.log("\n---\n");

  // Test 3: Generate a study plan
  console.log("Test 3: Creating a personalized study plan");
  console.log("=========================================\n");

  const response3 = await agent.generate(
    "I'm a beginner programmer with 30 days available. Create a study plan for learning blockchain development."
  );
  console.log(response3.text);
  console.log("\n---\n");

  // Test 4: Quiz generation
  console.log("Test 4: Generating a quiz");
  console.log("=========================\n");

  const response4 = await agent.generate(
    "Create a quiz with 5 questions about AI agents for intermediate level learners."
  );
  console.log(response4.text);
  console.log("\n---\n");

  // Test 5: Finding resources
  console.log("Test 5: Finding learning resources");
  console.log("==================================\n");

  const response5 = await agent.generate(
    "Find me free tutorials and tools for learning Solidity and smart contract development."
  );
  console.log(response5.text);
  console.log("\n---\n");

  // Test 6: Complex learning scenario
  console.log("Test 6: Complex learning guidance");
  console.log("=================================\n");

  const response6 = await agent.generate(
    "I want to build a DeFi protocol. What concepts should I learn first, and in what order? I have intermediate programming skills."
  );
  console.log(response6.text);
  console.log("\n---\n");

  // Test 7: Combining blockchain and AI
  console.log("Test 7: Intersection of blockchain and AI");
  console.log("=========================================\n");

  const response7 = await agent.generate(
    "How can AI agents be used in blockchain applications? Give me examples and explain the benefits."
  );
  console.log(response7.text);

  console.log("\n\n✅ All tests completed!");
}

// Run the tests
testStudyAgent().catch(console.error);
