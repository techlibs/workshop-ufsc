// src/mastra/domains/agent-creator/services/code-generator.ts
import { AgentTemplate, AgentToolTemplate, EnvVarTemplate } from '../templates/agent-templates';

export interface GeneratedAgent {
  agentCode: string;
  serviceCode?: string;
  utilsCode?: string;
  envExample: string;
  packageJson: string;
  readme: string;
  testCode: string;
}

export class CodeGenerator {
  static generateAgent(template: AgentTemplate, customizations?: {
    agentName?: string;
    description?: string;
    instructions?: string;
    additionalTools?: AgentToolTemplate[];
    additionalEnvVars?: EnvVarTemplate[];
  }): GeneratedAgent {
    const agentName = customizations?.agentName || template.name.toLowerCase().replace(/\s+/g, '-');
    const agentClassName = this.toPascalCase(agentName);
    const description = customizations?.description || template.description;
    const instructions = customizations?.instructions || template.instructions;
    
    const allTools = [...template.tools, ...(customizations?.additionalTools || [])];
    const allEnvVars = [...template.envVars, ...(customizations?.additionalEnvVars || [])];

    return {
      agentCode: this.generateAgentCode(agentName, agentClassName, description, instructions, allTools, template.id),
      serviceCode: this.generateServiceCode(template),
      utilsCode: this.generateUtilsCode(template),
      envExample: this.generateEnvExample(allEnvVars),
      packageJson: this.generatePackageJson(template.dependencies),
      readme: this.generateReadme(template, agentName, description),
      testCode: this.generateTestCode(agentName, allTools)
    };
  }

  private static generateAgentCode(
    agentName: string,
    agentClassName: string,
    description: string,
    instructions: string,
    tools: AgentToolTemplate[],
    templateId?: string
  ): string {
    const toolsCode = tools.map(tool => this.generateToolCode(tool)).join('\n\n');
    const toolsRegistration = tools.map(tool => `    ${tool.name}: ${tool.name}Tool`).join(',\n');

    // Generate specific imports based on template type
    let specificImports = '';
    if (templateId === 'api-agent') {
      specificImports = `import { ApiService } from './services/api-service';`;
    } else if (templateId === 'telegram-agent') {
      specificImports = `import { getTelegramConfig, TelegramService } from './services/telegram-service';`;
    } else if (templateId === 'email-agent') {
      specificImports = `import { EmailService } from './services/email-service';`;
    } else if (templateId === 'database-agent') {
      specificImports = `import { DatabaseService } from './services/database-service';`;
    }

    return `// src/mastra/domains/${agentName}/agent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { ModerationProcessor, PIIDetector } from "@mastra/core/processors";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
${specificImports}

${toolsCode}

export const ${agentClassName}Agent = new Agent({
  name: "${agentName}-agent",
  description: "${description}",
  instructions: \`${instructions}\`,

  model: openai("gpt-4o-mini"),
  
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./${agentName}-memory.db"
    })
  }),

  tools: {
${toolsRegistration}
  },

  inputProcessors: [
    new ModerationProcessor({
      model: openai("gpt-4o-mini"),
      threshold: 0.7,
      strategy: 'block',
      categories: ['sexual', 'harassment', 'violence']
    }),
    new PIIDetector({
      model: openai("gpt-4o-mini"),
      threshold: 0.6,
      strategy: 'redact',
      detectionTypes: ['email', 'phone', 'name', 'address']
    })
  ],

  outputProcessors: [
    new ModerationProcessor({
      model: openai("gpt-4o-mini"),
      threshold: 0.7,
      strategy: 'block',
      categories: ['sexual', 'harassment', 'violence']
    }),
    new PIIDetector({
      model: openai("gpt-4o-mini"),
      threshold: 0.6,
      strategy: 'redact',
      detectionTypes: ['email', 'phone', 'name', 'address']
    })
  ]
});`;
  }

  private static generateToolCode(tool: AgentToolTemplate): string {
    return `// Tool para ${tool.description}
const ${tool.name}Tool = createTool({
  id: "${tool.id}",
  description: "${tool.description}",
  inputSchema: ${tool.inputSchema},
  outputSchema: ${tool.outputSchema},
  execute: ${tool.implementation}
});`;
  }

  private static generateServiceCode(template: AgentTemplate): string {
    if (template.id === 'telegram-agent') {
      return `// src/mastra/domains/${template.name.toLowerCase().replace(/\s+/g, '-')}/services/telegram-service.ts
import TelegramBot from 'node-telegram-bot-api';

interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
}

export class TelegramService {
  private bot: TelegramBot;
  private rateLimiter: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private config: TelegramConfig) {
    this.bot = new TelegramBot(config.botToken, { polling: false });
  }

  async sendMessage(chatId: string, message: string, options?: {
    parseMode?: 'HTML' | 'Markdown';
    disableWebPagePreview?: boolean;
    disableNotification?: boolean;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.checkRateLimit(chatId)) {
        return { success: false, error: 'Rate limit exceeded' };
      }

      const result = await this.bot.sendMessage(chatId, message, {
        parse_mode: options?.parseMode || 'HTML',
        disable_web_page_preview: options?.disableWebPagePreview || false,
        disable_notification: options?.disableNotification || false
      });
      
      return { 
        success: true, 
        messageId: result.message_id.toString() 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private checkRateLimit(chatId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimiter.get(chatId);

    if (!userLimit) {
      this.rateLimiter.set(chatId, { count: 1, resetTime: now + this.config.rateLimit.windowMs });
      return true;
    }

    if (now > userLimit.resetTime) {
      this.rateLimiter.set(chatId, { count: 1, resetTime: now + this.config.rateLimit.windowMs });
      return true;
    }

    if (userLimit.count >= this.config.rateLimit.maxRequests) {
      return false;
    }

    userLimit.count++;
    return true;
  }
}`;
    }
    
    if (template.id === 'api-agent') {
      return `// src/mastra/domains/${template.name.toLowerCase().replace(/\s+/g, '-')}/services/api-service.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiCallOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class ApiService {
  private rateLimiter: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxRequests = parseInt(process.env.API_RATE_LIMIT || '100');
  private readonly windowMs = 60000; // 1 minute

  async call(options: ApiCallOptions): Promise<{ data: any; status: number }> {
    const { url, method, headers, body, timeout } = options;
    
    // Rate limiting check
    if (!this.checkRateLimit(url)) {
      throw new Error('Rate limit exceeded');
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: timeout || parseInt(process.env.API_TIMEOUT || '30000'),
      data: body
    };

    try {
      const response: AxiosResponse = await axios(config);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(\`API call failed: \${error.message}\`);
      }
      throw error;
    }
  }

  private checkRateLimit(url: string): boolean {
    const now = Date.now();
    const key = new URL(url).hostname;
    const userLimit = this.rateLimiter.get(key);

    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimiter.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (userLimit.count >= this.maxRequests) {
      return false;
    }

    userLimit.count++;
    return true;
  }
}`;
    }
    
    if (template.id === 'email-agent') {
      return `// src/mastra/domains/${template.name.toLowerCase().replace(/\s+/g, '-')}/services/email-service.ts
import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransporter(config);
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const result = await this.transporter.sendMail(options);
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}`;
    }
    
    if (template.id === 'database-agent') {
      return `// src/mastra/domains/${template.name.toLowerCase().replace(/\s+/g, '-')}/services/database-service.ts
import { Pool, PoolClient } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

export class DatabaseService {
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl || false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async executeQuery(query: string, params?: any[]): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
    rowCount?: number;
  }> {
    let client: PoolClient | null = null;
    
    try {
      client = await this.pool.connect();
      const result = await client.query(query, params);
      
      return {
        success: true,
        data: result.rows,
        rowCount: result.rowCount
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async executeTransaction(queries: Array<{ query: string; params?: any[] }>): Promise<{
    success: boolean;
    results?: any[];
    error?: string;
  }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const results = [];
      
      for (const { query, params } of queries) {
        const result = await client.query(query, params);
        results.push(result.rows);
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        results
      };
    } catch (error) {
      await client.query('ROLLBACK');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}`;
    }
    
    return '';
  }

  private static generateUtilsCode(template: AgentTemplate): string {
    if (template.id === 'telegram-agent') {
      return `// src/mastra/domains/${template.name.toLowerCase().replace(/\s+/g, '-')}/utils/env-config.ts
export interface TelegramEnvConfig {
  botToken: string;
  defaultChatId?: string;
  webhookUrl?: string;
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
}

export function getTelegramConfig(): TelegramEnvConfig {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const defaultChatId = process.env.TELEGRAM_CHAT_ID;
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
  
  if (!botToken) {
    throw new Error(\`
❌ Missing TELEGRAM_BOT_TOKEN in environment.
   → Create a .env file with: TELEGRAM_BOT_TOKEN=your_bot_token_here
   → Get your bot token from: @BotFather on Telegram
    \`);
  }

  return {
    botToken,
    defaultChatId,
    webhookUrl,
    rateLimit: {
      maxRequests: parseInt(process.env.TELEGRAM_RATE_LIMIT_MAX || '10'),
      windowMs: parseInt(process.env.TELEGRAM_RATE_LIMIT_WINDOW || '60000')
    }
  };
}`;
    }
    return '';
  }

  private static generateEnvExample(envVars: EnvVarTemplate[]): string {
    const requiredVars = envVars.filter(v => v.required);
    const optionalVars = envVars.filter(v => !v.required);

    return `# Configuração para o Agente
# Copie este arquivo para .env e configure suas chaves

# ====================================
# Variáveis Obrigatórias
# ====================================
${requiredVars.map(v => `# ${v.description}\n${v.name}=${v.example}`).join('\n\n')}

# ====================================
# Variáveis Opcionais
# ====================================
${optionalVars.map(v => `# ${v.description}\n# ${v.name}=${v.example}`).join('\n\n')}

# ====================================
# OpenAI Configuration
# ====================================
OPENAI_API_KEY=your_openai_api_key_here`;
  }

  private static generatePackageJson(dependencies: string[]): string {
    const deps = dependencies.map(dep => `    "${dep}": "latest"`).join(',\n');
    
    return `{
  "name": "mastra-agent-dependencies",
  "version": "1.0.0",
  "description": "Dependências para agentes Mastra",
  "dependencies": {
${deps}
  }
}`;
  }

  private static generateReadme(template: AgentTemplate, agentName: string, description: string): string {
    return `# ${template.name}

${description}

## Funcionalidades

${template.features.map(feature => `- ${feature}`).join('\n')}

## Instalação

1. Instale as dependências:
\`\`\`bash
pnpm add ${template.dependencies.join(' ')}
\`\`\`

2. Configure as variáveis de ambiente:
\`\`\`bash
cp env.example .env
# Edite o .env com suas configurações
\`\`\`

3. Registre o agente no Mastra:
\`\`\`typescript
import { ${agentName}Agent } from './domains/${agentName}';

export const mastra = new Mastra({
  agents: { ${agentName}Agent }
});
\`\`\`

## Uso

\`\`\`typescript
const agent = mastra.getAgent("${agentName}Agent");

// Exemplo de uso
${template.exampleUsage}
\`\`\`

## Configuração

### Variáveis de Ambiente

${template.envVars.map(v => `- **${v.name}**: ${v.description} ${v.required ? '(obrigatório)' : '(opcional)'}`).join('\n')}

## Testes

Execute os testes:
\`\`\`bash
npx tsx tests/${agentName}.test.ts
\`\`\``;
  }

  private static generateTestCode(agentName: string, tools: AgentToolTemplate[]): string {
    return `// tests/${agentName}.test.ts
import { ${agentName}Agent } from "../src/mastra/domains/${agentName}";

describe('${agentName} Agent Tests', () => {
  it('should create agent successfully', () => {
    expect(${agentName}Agent).toBeDefined();
    expect(${agentName}Agent.name).toBe("${agentName}-agent");
  });

  it('should have correct tools', async () => {
    const tools = await ${agentName}Agent.getTools();
    const toolNames = Object.keys(tools);
    
    expect(toolNames).toContain('${tools[0]?.name || 'exampleTool'}');
  });

  it('should generate response', async () => {
    const response = await ${agentName}Agent.generate("Test message");
    expect(response.text).toBeDefined();
  });
});`;
  }

  private static toPascalCase(str: string): string {
    return str.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());
  }
}
