import { RuntimeContext } from "@mastra/core/runtime-context";
import { mastra } from "../../src/mastra";

async function testMovieAgent() {
  console.log("🎬 Testing Movie Recommendation Agent\n");

  const agent = mastra.getAgent("movieAgent");

  if (!agent) {
    console.error("❌ Movie agent not found!");
    return;
  }

  // Simulate a conversation
  const userId = `user-${Date.now()}`;
  const threadId = `movie-thread-${Date.now()}`;

  // Create runtime context with user ID
  const runtimeContext = new RuntimeContext();
  runtimeContext.set("userId", userId);

  try {
    // Test 1: Initial greeting and provider setup
    console.log("1️⃣ Initial interaction...\n");
    const response1 = await agent.generate(
      "Olá! Eu quero descobrir algo novo para assistir hoje à noite.",
      {
        memory: {
          thread: { id: threadId },
          resource: userId,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response1.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 2: Set streaming providers
    console.log("2️⃣ Setting streaming providers...\n");
    const response2 = await agent.generate("Eu tenho Netflix e HBO Max", {
      memory: {
        thread: { id: threadId },
        resource: userId,
      },
      runtimeContext,
    });
    console.log("Assistant:", response2.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 3: Mood-based recommendation
    console.log("3️⃣ Requesting mood-based recommendations...\n");
    const response3 = await agent.generate(
      "Estou me sentindo meio pensativo e reflexivo hoje, quero algo que me faça pensar",
      {
        memory: {
          thread: { id: threadId },
          resource: userId,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response3.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 4: Search for specific content
    console.log("4️⃣ Searching for specific content...\n");
    const response4 = await agent.generate(
      "Tem alguma série de ficção científica disponível?",
      {
        memory: {
          thread: { id: threadId },
          resource: userId,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response4.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 5: Get details about a specific movie
    console.log("5️⃣ Getting movie details...\n");
    const response5 = await agent.generate(
      "Me conta mais sobre Duna: Parte Dois",
      {
        memory: {
          thread: { id: threadId },
          resource: userId,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response5.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 6: Different mood recommendation
    console.log("6️⃣ Different mood recommendation...\n");
    const response6 = await agent.generate(
      "Actually, I changed my mind. I want something fun and lighthearted to watch with friends",
      {
        memory: {
          thread: { id: threadId },
          resource: userId,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response6.text);
    console.log("\n" + "=".repeat(80) + "\n");

    // Test 7: Check current providers
    console.log("7️⃣ Checking streaming providers...\n");
    const response7 = await agent.generate(
      "Which streaming services did I say I have?",
      {
        memory: {
          thread: { id: threadId },
          resource: userId,
        },
        runtimeContext,
      }
    );
    console.log("Assistant:", response7.text);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the test
testMovieAgent().catch(console.error);
