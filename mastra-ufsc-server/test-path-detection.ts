// test-path-detection.ts
import { mastra } from "./src/mastra";

async function testPathDetection() {
  console.log("🔍 Testando Detecção de Caminhos...\n");

  try {
    const agent = mastra.getAgent("agentCreatorAgent");

    // Teste simples: apenas listar templates
    console.log("📋 Testando listagem de templates...");
    const response = await agent.generate(
      "Liste templates disponíveis",
      { maxSteps: 2 }
    );
    
    console.log("✅ Listagem funcionou:", response.text.substring(0, 100) + "...");
    
    // Teste: obter detalhes de um template
    console.log("\n🔍 Testando obtenção de detalhes...");
    const response2 = await agent.generate(
      "Mostre detalhes do telegram-agent",
      { maxSteps: 3 }
    );
    
    console.log("✅ Detalhes funcionaram:", response2.text.substring(0, 100) + "...");
    
    console.log("\n🎉 TESTE DE FUNCIONALIDADE BÁSICA CONCLUÍDO!");
    console.log("O Agent Creator está funcionando para operações básicas.");
    console.log("O problema pode estar na criação de arquivos específica.");

  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testPathDetection().catch(console.error);
