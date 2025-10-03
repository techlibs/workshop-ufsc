// src/mastra/domains/motivational-message-sender/agent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { ModerationProcessor, PIIDetector } from "@mastra/core/processors";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getTelegramConfig } from "./utils/env-config";
import { TelegramService } from "./services/motivational-message-sender-service";

// Tool para Envia mensagem via Telegram
const sendTelegramMessageTool = createTool({
  id: "send-telegram-message",
  description: "Envia mensagem via Telegram",
  inputSchema: z.object({
          chatId: z.string().optional().describe("ID do chat (opcional, usa padrão do .env)"),
          message: z.string().describe("Mensagem a ser enviada"),
          parseMode: z.enum(['HTML', 'Markdown']).optional().default('HTML'),
          disableNotification: z.boolean().optional().default(false)
        }),
  outputSchema: z.object({
          success: z.boolean().describe("Se a mensagem foi enviada com sucesso"),
          messageId: z.string().optional().describe("ID da mensagem enviada"),
          error: z.string().optional().describe("Erro, se houver"),
          chatId: z.string().describe("ID do chat usado")
        }),
  execute: async ({ context }) => {
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
        }
});

export const MotivationalMessageSenderAgent = new Agent({
  name: "motivational-message-sender-agent",
  description: "Agente especializado em integração com Telegram para envio de mensagens",
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

  model: openai("gpt-4o-mini"),
  
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./motivational-message-sender-memory.db"
    })
  }),

  tools: {
    "send-telegram-message": sendTelegramMessageTool
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
});