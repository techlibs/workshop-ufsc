// test-registration-function.ts
import { mastra } from "./src/mastra";

async function testRegistrationFunction() {
  console.log("🔍 Testando Função de Registro...\n");

  try {
    const agent = mastra.getAgent("agentCreatorAgent");

    // Teste: apenas gerar código sem criar arquivos
    console.log("📝 Testando geração de código...");
    const response = await agent.generate(
      "Gere código para agente test-registration usando template telegram-agent",
      { maxSteps: 5 }
    );
    
    console.log("Resultado da geração:", response.text.substring(0, 300) + "...");
    
    // Verificar se há algum erro específico
    if (response.text.includes("erro") || response.text.includes("error")) {
      console.log("\n⚠️ Possível erro detectado na resposta");
    } else {
      console.log("\n✅ Geração de código aparentemente funcionou");
    }

  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testRegistrationFunction().catch(console.error);
