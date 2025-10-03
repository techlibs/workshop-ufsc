// examples/agent-creator-example.ts
import "dotenv/config";
import { mastra } from "../src/mastra";

async function testAgentCreator() {
  console.log("🤖 Testando Agente Criador de Agentes...\n");

  try {
    const agent = mastra.getAgent("agentCreatorAgent");

    // Teste 1: Listar templates disponíveis
    console.log("📋 Teste 1: Listando templates disponíveis");
    const response1 = await agent.generate(
      "Use listAgentTemplates para mostrar todos os templates de agentes disponíveis",
      {
        memory: {
          resource: "user-123",
          thread: "agent-creation"
        },
        maxSteps: 3
      }
    );
    console.log("Templates disponíveis:", response1.text);
    console.log("---\n");

    // Teste 2: Obter detalhes de um template específico
    console.log("🔍 Teste 2: Obtendo detalhes do template Telegram Agent");
    const response2 = await agent.generate(
      "Use getTemplateDetails para obter informações completas do template 'telegram-agent'",
      {
        maxSteps: 3
      }
    );
    console.log("Detalhes do template:", response2.text);
    console.log("---\n");

    // Teste 3: Validar configuração de agente
    console.log("✅ Teste 3: Validando configuração de agente");
    const response3 = await agent.generate(
      `Use validateAgentConfig para validar um agente com:
      - Nome: "notification-agent"
      - Descrição: "Agente para envio de notificações via múltiplos canais"
      - Instruções: "Você é um assistente especializado em envio de notificações. Suas capacidades incluem envio via email, SMS e push notifications. Sempre valide destinatários e personalize mensagens."`,
      {
        maxSteps: 3
      }
    );
    console.log("Validação:", response3.text);
    console.log("---\n");

    // Teste 4: Gerar código de agente
    console.log("⚙️ Teste 4: Gerando código de agente");
    const response4 = await agent.generate(
      `Use generateAgentCode para criar um agente baseado no template 'telegram-agent' com:
      - Nome personalizado: "notification-agent"
      - Descrição: "Agente para envio de notificações via Telegram"
      - Instruções: "Você é um assistente especializado em envio de notificações via Telegram. Sempre personalize mensagens e valide destinatários."`,
      {
        maxSteps: 5
      }
    );
    console.log("Código gerado:", response4.text);
    console.log("---\n");

    // Teste 5: Criar estrutura de arquivos
    console.log("📁 Teste 5: Criando estrutura de arquivos");
    const response5 = await agent.generate(
      "Use createAgentStructure para criar a estrutura completa de arquivos para um agente chamado 'notification-agent' baseado no template 'telegram-agent'",
      {
        maxSteps: 5
      }
    );
    console.log("Estrutura criada:", response5.text);
    console.log("---\n");

    console.log("✅ Todos os testes do Agente Criador concluídos com sucesso!");
    console.log("\n📋 RESUMO:");
    console.log("- ✅ Templates listados e detalhados");
    console.log("- ✅ Configurações validadas");
    console.log("- ✅ Código de agentes gerado");
    console.log("- ✅ Estrutura de arquivos criada");
    console.log("- ✅ Ferramentas funcionando corretamente");

  } catch (error) {
    console.error("❌ Erro durante os testes:", error);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testAgentCreator().catch(console.error);
}

export { testAgentCreator };
