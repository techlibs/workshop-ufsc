import "dotenv/config";
import { mastra } from "../../src/mastra";

async function testPRReviewerAgent() {
  console.log("🔍 Testing PR Reviewer Agent\n");

  const agent = mastra.getAgent("prReviewerAgent");

  console.log("Test 1: List Open PRs");
  console.log("=====================\n");

  const response1 = await agent.generate("Quais PRs estão abertos no repositório?");
  console.log(response1.text);
  console.log("\n---\n");

  console.log("Test 2: Get Specific PR Details");
  console.log("================================\n");

  const response2 = await agent.generate("Me dá os detalhes do PR #1");
  console.log(response2.text);
  console.log("\n---\n");

  console.log("Test 3: Format PR Message");
  console.log("==========================\n");

  const response3 = await agent.generate(
    "Formata uma mensagem sobre os PRs abertos para enviar no WhatsApp"
  );
  console.log(response3.text);
  console.log("\n---\n");

  console.log("Test 4: Send WhatsApp Notification (if configured)");
  console.log("===================================================\n");

  const response4 = await agent.generate(
    "Envia uma notificação no WhatsApp sobre os PRs pendentes"
  );
  console.log(response4.text);
  console.log("\n---\n");

  console.log("Test 5: PR Summary");
  console.log("==================\n");

  const response5 = await agent.generate("Me dá um resumo dos PRs do repositório");
  console.log(response5.text);
  console.log("\n---\n");

  console.log("Test 6: Multi-language Support");
  console.log("===============================\n");

  const response6 = await agent.generate(
    "What are the open pull requests in the repository?"
  );
  console.log(response6.text);
  console.log("\n---\n");

  console.log("Test 7: Error Handling - Invalid PR");
  console.log("====================================\n");

  const response7 = await agent.generate("Tell me about PR #999999");
  console.log(response7.text);

  console.log("\n\n✅ All tests completed!");
}

testPRReviewerAgent().catch(console.error);