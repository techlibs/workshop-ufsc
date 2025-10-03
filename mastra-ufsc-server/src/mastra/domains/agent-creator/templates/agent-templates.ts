// src/mastra/domains/agent-creator/templates/agent-templates.ts
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'data' | 'automation' | 'integration' | 'ai' | 'utility';
  features: string[];
  tools: AgentToolTemplate[];
  dependencies: string[];
  envVars: EnvVarTemplate[];
  instructions: string;
  exampleUsage: string;
}

export interface AgentToolTemplate {
  id: string;
  name: string;
  description: string;
  inputSchema: string;
  outputSchema: string;
  implementation: string;
}

export interface EnvVarTemplate {
  name: string;
  description: string;
  required: boolean;
  example: string;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'telegram-agent',
    name: 'Telegram Agent',
    description: 'Agente especializado em integração com Telegram para envio de mensagens',
    category: 'communication',
    features: [
      'Envio de mensagens via Telegram',
      'Rate limiting automático',
      'Sistema de fila com retry',
      'Suporte a webhooks',
      'Validação de configuração'
    ],
    tools: [
      {
        id: 'send-telegram-message',
        name: 'sendTelegramMessage',
        description: 'Envia mensagem via Telegram',
        inputSchema: `z.object({
          chatId: z.string().optional().describe("ID do chat (opcional, usa padrão do .env)"),
          message: z.string().describe("Mensagem a ser enviada"),
          parseMode: z.enum(['HTML', 'Markdown']).optional().default('HTML'),
          disableNotification: z.boolean().optional().default(false)
        })`,
        outputSchema: `z.object({
          success: z.boolean().describe("Se a mensagem foi enviada com sucesso"),
          messageId: z.string().optional().describe("ID da mensagem enviada"),
          error: z.string().optional().describe("Erro, se houver"),
          chatId: z.string().describe("ID do chat usado")
        })`,
        implementation: `async ({ context }) => {
          const { chatId, message, parseMode, disableNotification } = context;
          
          try {
            const config = getTelegramConfig();
            const telegramService = new TelegramService(config);
            const targetChatId = chatId || config.defaultChatId;
            
            if (!targetChatId) {
              return {
                success: false,
                error: "Nenhum chatId fornecido e TELEGRAM_CHAT_ID não configurado",
                chatId: "unknown"
              };
            }
            
            const result = await telegramService.sendMessage(targetChatId, message, {
              parseMode,
              disableNotification
            });
            
            return {
              success: result.success,
              messageId: result.messageId,
              error: result.error,
              chatId: targetChatId
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Erro desconhecido",
              chatId: chatId || "unknown"
            };
          }
        }`
      }
    ],
    dependencies: ['node-telegram-bot-api'],
    envVars: [
      {
        name: 'TELEGRAM_BOT_TOKEN',
        description: 'Token do bot do Telegram obtido do @BotFather',
        required: true,
        example: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz'
      },
      {
        name: 'TELEGRAM_CHAT_ID',
        description: 'ID do chat padrão para envio de mensagens',
        required: false,
        example: '123456789'
      }
    ],
    instructions: `Você é um assistente especializado em integração com Telegram.

CAPACIDADES:
- Envio de mensagens via Telegram
- Configuração automática de rate limiting
- Tratamento de erros robusto
- Suporte a diferentes formatos de mensagem

DIRETRIZES:
- Sempre valide a configuração antes de enviar
- Use rate limiting para evitar spam
- Forneça feedback claro sobre o status do envio
- Mantenha logs detalhados para debugging`,
    exampleUsage: `const agent = mastra.getAgent("telegramAgent");

// Enviar mensagem simples
await agent.generate("Envie 'Olá mundo!' via Telegram");

// Enviar para chat específico
await agent.generate("Envie 'Teste' para o chat 123456789");`
  },
  {
    id: 'email-agent',
    name: 'Email Agent',
    description: 'Agente especializado em envio de emails com templates e anexos',
    category: 'communication',
    features: [
      'Envio de emails HTML/texto',
      'Sistema de templates',
      'Suporte a anexos',
      'Validação de destinatários',
      'Queue de emails'
    ],
    tools: [
      {
        id: 'send-email',
        name: 'sendEmail',
        description: 'Envia email com template e anexos',
        inputSchema: `z.object({
          to: z.string().email().describe("Email do destinatário"),
          subject: z.string().describe("Assunto do email"),
          template: z.string().optional().describe("Nome do template"),
          data: z.record(z.any()).optional().describe("Dados para o template"),
          attachments: z.array(z.string()).optional().describe("Caminhos dos anexos")
        })`,
        outputSchema: `z.object({
          success: z.boolean(),
          messageId: z.string().optional(),
          error: z.string().optional()
        })`,
        implementation: `async ({ context }) => {
          const { to, subject, template, data, attachments } = context;
          
          try {
            const emailService = new EmailService();
            const result = await emailService.send({
              to,
              subject,
              template,
              data,
              attachments
            });
            
            return {
              success: true,
              messageId: result.messageId
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Erro desconhecido"
            };
          }
        }`
      }
    ],
    dependencies: ['nodemailer', 'handlebars'],
    envVars: [
      {
        name: 'SMTP_HOST',
        description: 'Servidor SMTP para envio de emails',
        required: true,
        example: 'smtp.gmail.com'
      },
      {
        name: 'SMTP_USER',
        description: 'Usuário do SMTP',
        required: true,
        example: 'seu-email@gmail.com'
      },
      {
        name: 'SMTP_PASS',
        description: 'Senha do SMTP',
        required: true,
        example: 'sua-senha-app'
      }
    ],
    instructions: `Você é um assistente especializado em envio de emails.

CAPACIDADES:
- Envio de emails HTML e texto
- Uso de templates personalizados
- Suporte a anexos
- Validação de destinatários

DIRETRIZES:
- Sempre valide endereços de email
- Use templates para consistência
- Implemente rate limiting para evitar spam
- Mantenha logs de envio`,
    exampleUsage: `const agent = mastra.getAgent("emailAgent");

// Enviar email simples
await agent.generate("Envie email para joao@exemplo.com com assunto 'Teste'");

// Usar template
await agent.generate("Envie email de boas-vindas para maria@exemplo.com usando template welcome");`
  },
  {
    id: 'database-agent',
    name: 'Database Agent',
    description: 'Agente especializado em operações de banco de dados com queries seguras',
    category: 'data',
    features: [
      'Queries SQL seguras',
      'Validação de dados',
      'Transações automáticas',
      'Cache inteligente',
      'Backup automático'
    ],
    tools: [
      {
        id: 'execute-query',
        name: 'executeQuery',
        description: 'Executa query SQL com validação',
        inputSchema: `z.object({
          query: z.string().describe("Query SQL a ser executada"),
          params: z.array(z.any()).optional().describe("Parâmetros da query"),
          transaction: z.boolean().optional().default(false).describe("Usar transação")
        })`,
        outputSchema: `z.object({
          success: z.boolean(),
          data: z.array(z.any()).optional(),
          error: z.string().optional(),
          rowCount: z.number().optional()
        })`,
        implementation: `async ({ context }) => {
          const { query, params, transaction } = context;
          
          try {
            const dbService = new DatabaseService();
            const result = await dbService.execute(query, params, transaction);
            
            return {
              success: true,
              data: result.data,
              rowCount: result.rowCount
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Erro desconhecido"
            };
          }
        }`
      }
    ],
    dependencies: ['pg', 'sqlite3'],
    envVars: [
      {
        name: 'DATABASE_URL',
        description: 'URL de conexão com o banco de dados',
        required: true,
        example: 'postgresql://user:pass@localhost:5432/dbname'
      }
    ],
    instructions: `Você é um assistente especializado em operações de banco de dados.

CAPACIDADES:
- Execução de queries SQL seguras
- Validação de parâmetros
- Gerenciamento de transações
- Cache de resultados

DIRETRIZES:
- Sempre valide queries antes de executar
- Use parâmetros preparados para evitar SQL injection
- Implemente timeout para queries longas
- Mantenha logs de todas as operações`,
    exampleUsage: `const agent = mastra.getAgent("databaseAgent");

// Query simples
await agent.generate("Execute SELECT * FROM users WHERE active = true");

// Query com parâmetros
await agent.generate("Execute INSERT INTO users (name, email) VALUES (?, ?) com parâmetros ['João', 'joao@exemplo.com']");`
  },
  {
    id: 'api-agent',
    name: 'API Agent',
    description: 'Agente especializado em integração com APIs externas',
    category: 'integration',
    features: [
      'Chamadas HTTP seguras',
      'Rate limiting automático',
      'Cache de respostas',
      'Retry automático',
      'Validação de schemas'
    ],
    tools: [
      {
        id: 'make-api-call',
        name: 'makeApiCall',
        description: 'Faz chamada para API externa',
        inputSchema: `z.object({
          url: z.string().url().describe("URL da API"),
          method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
          headers: z.record(z.string()).optional().describe("Headers HTTP"),
          body: z.any().optional().describe("Corpo da requisição"),
          timeout: z.number().optional().default(30000).describe("Timeout em ms")
        })`,
        outputSchema: `z.object({
          success: z.boolean(),
          data: z.any().optional(),
          status: z.number().optional(),
          error: z.string().optional()
        })`,
        implementation: `async ({ context }) => {
          const { url, method, headers, body, timeout } = context;
          
          try {
            const apiService = new ApiService();
            const result = await apiService.call({
              url,
              method,
              headers,
              body,
              timeout
            });
            
            return {
              success: true,
              data: result.data,
              status: result.status
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Erro desconhecido"
            };
          }
        }`
      }
    ],
    dependencies: ['axios', 'node-cache'],
    envVars: [
      {
        name: 'API_TIMEOUT',
        description: 'Timeout padrão para chamadas de API',
        required: false,
        example: '30000'
      },
      {
        name: 'API_RATE_LIMIT',
        description: 'Limite de requisições por minuto',
        required: false,
        example: '100'
      }
    ],
    instructions: `Você é um assistente especializado em integração com APIs externas.

CAPACIDADES:
- Chamadas HTTP seguras
- Rate limiting automático
- Cache inteligente
- Retry com backoff exponencial

DIRETRIZES:
- Sempre valide URLs antes de chamar
- Implemente timeout para evitar travamentos
- Use cache para otimizar performance
- Mantenha logs detalhados`,
    exampleUsage: `const agent = mastra.getAgent("apiAgent");

// GET simples
await agent.generate("Faça GET para https://api.exemplo.com/users");

// POST com dados
await agent.generate("Faça POST para https://api.exemplo.com/users com dados {name: 'João', email: 'joao@exemplo.com'}");`
  }
];

export class AgentTemplateEngine {
  static getTemplateById(id: string): AgentTemplate | undefined {
    return AGENT_TEMPLATES.find(template => template.id === id);
  }

  static getTemplatesByCategory(category: AgentTemplate['category']): AgentTemplate[] {
    return AGENT_TEMPLATES.filter(template => template.category === category);
  }

  static getAllCategories(): AgentTemplate['category'][] {
    return [...new Set(AGENT_TEMPLATES.map(template => template.category))];
  }

  static searchTemplates(query: string): AgentTemplate[] {
    const lowerQuery = query.toLowerCase();
    return AGENT_TEMPLATES.filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.features.some(feature => feature.toLowerCase().includes(lowerQuery))
    );
  }
}
