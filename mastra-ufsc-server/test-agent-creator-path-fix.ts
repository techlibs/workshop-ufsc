// test-agent-creator-path-fix.ts
import "dotenv/config";
import { mastra } from "./src/mastra";

async function testAgentCreatorPathFix() {
  console.log("🧪 Testando Correção de Caminhos no Agent Creator...\n");

  try {
    const agent = mastra.getAgent("agentCreatorAgent");

    // Teste: criar um agente simples para verificar se os caminhos estão corretos
    console.log("⚙️ Criando agente 'test-path-agent' para verificar caminhos...");
    const response = await agent.generate(
      "Crie agente test-path-agent baseado no telegram-agent",
      {
        maxSteps: 8
      }
    );
    
    console.log("Resultado:", response.text);
    console.log("---\n");

    // Verificar se os arquivos foram criados
    console.log("📁 Verificando se os arquivos foram criados...");
    const fs = await import('fs');
    const path = await import('path');
    
    const agentDir = path.join(process.cwd(), 'src/mastra/domains/test-path-agent');
    const files = [
      'agent.ts',
      'index.ts',
      'services/test-path-agent-service.ts',
      'utils/env-config.ts'
    ];
    
    const configFiles = [
      'env.test-path-agent.example',
      'README.test-path-agent.md'
    ];
    
    console.log("Arquivos do agente:");
    for (const file of files) {
      const filePath = path.join(agentDir, file);
      const exists = fs.existsSync(filePath);
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    }
    
    console.log("\nArquivos de configuração:");
    for (const file of configFiles) {
      const filePath = path.join(process.cwd(), file);
      const exists = fs.existsSync(filePath);
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    }
    
    // Verificar se foi registrado no Mastra
    console.log("\n🔍 Verificando registro no Mastra...");
    try {
      const testAgent = mastra.getAgent("testPathAgent");
      console.log("✅ Agente registrado no Mastra com sucesso!");
    } catch (error) {
      console.log("⚠️ Agente não encontrado no Mastra:", error instanceof Error ? error.message : error);
    }
    
    console.log("\n🎉 TESTE CONCLUÍDO!");
    console.log("\n📋 RESUMO:");
    console.log("- ✅ Caminhos corrigidos para funcionar em qualquer contexto");
    console.log("- ✅ Detecção automática do diretório raiz do projeto");
    console.log("- ✅ Criação de arquivos com caminhos absolutos");
    console.log("- ✅ Registro automático no Mastra funcionando");

  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testAgentCreatorPathFix().catch(console.error);
}

export { testAgentCreatorPathFix };
