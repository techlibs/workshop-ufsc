// src/mastra/domains/weather-forecast-fortaleza/agent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { ModerationProcessor, PIIDetector } from "@mastra/core/processors";
import { createTool } from "@mastra/core/tools";
import { ApiService } from './services/api-service';

// Tool para Faz chamada para API externa
const makeApiCallTool = createTool({
  id: "make-api-call",
  description: "Faz chamada para API externa",
  inputSchema: z.object({
          url: z.string().url().describe("URL da API"),
          method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
          headers: z.record(z.string()).optional().describe("Headers HTTP"),
          body: z.any().optional().describe("Corpo da requisição"),
          timeout: z.number().optional().default(30000).describe("Timeout em ms")
        }),
  outputSchema: z.object({
          success: z.boolean(),
          data: z.any().optional(),
          status: z.number().optional(),
          error: z.string().optional()
        }),
  execute: async ({ context }) => {
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
        }
});

export const WeatherForecastFortalezaAgent = new Agent({
  name: "weather-forecast-fortaleza-agent",
  description: "Agente especializado em integração com APIs externas",
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

  model: openai("gpt-4o-mini"),
  
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./weather-forecast-fortaleza-memory.db"
    })
  }),

  tools: {
    makeApiCall: makeApiCallTool
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