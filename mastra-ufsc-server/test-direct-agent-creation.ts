// test-direct-agent-creation.ts
import { mastra } from "./src/mastra";

async function testDirectAgentCreation() {
  console.log("🔧 Testando Criação Direta de Agente...\n");

  try {
    const agent = mastra.getAgent("agentCreatorAgent");

    // Teste direto: criar agente usando a ferramenta específica
    console.log("⚙️ Criando agente usando ferramenta create-agent-structure...");
    
    // Primeiro, vamos listar os templates para obter o ID correto
    const listResponse = await agent.generate(
      "Liste templates disponíveis",
      { maxSteps: 2 }
    );
    
    console.log("Templates disponíveis:", listResponse.text.substring(0, 200) + "...");
    
    // Agora vamos tentar criar um agente específico
    console.log("\n🔨 Tentando criar agente 'simple-test-agent'...");
    const createResponse = await agent.generate(
      "Crie agente simple-test-agent usando template telegram-agent",
      { maxSteps: 10 }
    );
    
    console.log("Resultado da criação:", createResponse.text);
    
    // Verificar se os arquivos foram criados
    console.log("\n📁 Verificando arquivos criados...");
    const fs = await import('fs');
    const path = await import('path');
    
    const agentDir = path.join(process.cwd(), 'src/mastra/domains/simple-test-agent');
    const files = [
      'agent.ts',
      'index.ts'
    ];
    
    console.log("Arquivos do agente:");
    for (const file of files) {
      const filePath = path.join(agentDir, file);
      const exists = fs.existsSync(filePath);
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
      if (exists) {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`    Tamanho: ${content.length} caracteres`);
      }
    }
    
    // Verificar arquivos de configuração
    const configFiles = [
      'env.simple-test-agent.example',
      'README.simple-test-agent.md'
    ];
    
    console.log("\nArquivos de configuração:");
    for (const file of configFiles) {
      const filePath = path.join(process.cwd(), file);
      const exists = fs.existsSync(filePath);
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
      if (exists) {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`    Tamanho: ${content.length} caracteres`);
      }
    }

  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testDirectAgentCreation().catch(console.error);
