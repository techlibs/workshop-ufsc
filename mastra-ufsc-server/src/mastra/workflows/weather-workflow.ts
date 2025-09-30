import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { forecastTool } from "../tools/forecast-tool";

const forecastSchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  precipitationChance: z.number(),
  condition: z.string(),
  location: z.string(),
});

const fetchWeather = createStep({
  id: "fetch-weather",
  description: "Fetches weather forecast for a given city",
  inputSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  outputSchema: forecastSchema,
  execute: async ({ inputData, mastra, runId }) => {
    const logger = mastra?.getLogger();
    const startTime = Date.now();

    logger?.info("[fetchWeather] Starting weather fetch using forecast tool", {
      city: inputData?.city,
      runId,
      step: "fetch-weather",
    });

    if (!inputData) {
      logger?.error("[fetchWeather] Input data not found", { runId });
      throw new Error("Input data not found");
    }

    try {
      logger?.info("[fetchWeather] Calling forecast tool", {
        city: inputData.city,
        runId,
      });

      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Forecast tool timed out after 15 seconds")),
          15000
        );
      });

      // Race between tool execution and timeout
      const forecast = (await Promise.race([
        forecastTool.execute({
          context: { location: inputData.city },
          mastra,
        }),
        timeoutPromise,
      ])) as any;

      const totalDuration = Date.now() - startTime;
      logger?.info("[fetchWeather] Weather fetch completed successfully", {
        location: forecast.location,
        forecast,
        totalDuration: `${totalDuration}ms`,
        runId,
      });

      return forecast;
    } catch (error) {
      const totalDuration = Date.now() - startTime;

      if (error instanceof Error) {
        logger?.error("[fetchWeather] Failed to fetch weather data", {
          error: error.message,
          stack: error.stack,
          city: inputData.city,
          totalDuration: `${totalDuration}ms`,
          runId,
        });

        throw new Error(`Failed to fetch weather data: ${error.message}`);
      }

      logger?.error("[fetchWeather] Unknown error occurred", {
        error,
        city: inputData.city,
        totalDuration: `${totalDuration}ms`,
        runId,
      });
      throw error;
    }
  },
});

const planActivities = createStep({
  id: "plan-activities",
  description: "Suggests activities based on weather conditions",
  inputSchema: forecastSchema,
  outputSchema: z.object({
    activities: z.string(),
  }),
  execute: async ({ inputData, mastra, runId }) => {
    const logger = mastra?.getLogger();
    const startTime = Date.now();
    const forecast = inputData;

    logger?.info("[planActivities] Starting activity planning", {
      location: forecast?.location,
      forecast,
      runId,
      step: "plan-activities",
    });

    if (!forecast) {
      logger?.error("[planActivities] Forecast data not found", { runId });
      throw new Error("Forecast data not found");
    }

    const agent = mastra?.getAgent("weatherAgent");
    if (!agent) {
      logger?.error("[planActivities] Weather agent not found", {
        agentName: "weatherAgent",
        runId,
      });
      throw new Error("Weather agent not found");
    }

    logger?.info("[planActivities] Weather agent retrieved", {
      agentName: "weatherAgent",
      runId,
    });

    const prompt = `[WORKFLOW CONTEXT - DO NOT USE TOOLS OR WORKFLOWS]

Create an activity plan for ${forecast.location} based on this weather:
Temperature: ${forecast.minTemp}°C to ${forecast.maxTemp}°C
Conditions: ${forecast.condition}
Precipitation chance: ${forecast.precipitationChance}%

Format your response EXACTLY like this (use emojis):

📅 [Today's Date]
═══════════════════════════

🌡️ RESUMO DO TEMPO
• Condições: ${forecast.condition}
• Temperatura: ${forecast.minTemp}°C a ${forecast.maxTemp}°C
• Chance de precipitação: ${forecast.precipitationChance}%

🌅 ATIVIDADES DA MANHÃ
Ao ar livre:
• [Activity] - [Description]
  Melhor horário: [time]
  Nota: [weather tip]

🌞 ATIVIDADES DA TARDE
Ao ar livre:
• [Activity] - [Description]
  Melhor horário: [time]
  Nota: [weather tip]

🏠 ALTERNATIVAS INDOOR
• [Activity] - [Description]
  Ideal para: [condition]

⚠️ CONSIDERAÇÕES ESPECIAIS
• [Weather warnings or tips]

Keep it brief but helpful. Use specific local venues/locations for ${forecast.location}.`;

    try {
      logger?.info("[planActivities] Calling AI agent to generate activities", {
        location: forecast.location,
        promptLength: prompt.length,
        runId,
      });

      // Use generate instead of stream for workflow to avoid loops
      const agentStartTime = Date.now();

      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(new Error("Agent generation timed out after 30 seconds")),
          30000
        );
      });

      // Race between agent generation and timeout
      const response = (await Promise.race([
        agent.generate([
          {
            role: "system",
            content:
              "IMPORTANT: You are being called from within a workflow. DO NOT use any workflows or tools. Just provide the formatted activity suggestions directly.",
          },
          {
            role: "user",
            content: prompt,
          },
        ]),
        timeoutPromise,
      ])) as any;

      const agentDuration = Date.now() - agentStartTime;
      logger?.info("[planActivities] AI agent response received", {
        responseLength: response.text?.length || 0,
        duration: `${agentDuration}ms`,
        runId,
      });

      const totalDuration = Date.now() - startTime;
      logger?.info(
        "[planActivities] Activity planning completed successfully",
        {
          location: forecast.location,
          activitiesLength: response.text?.length || 0,
          totalDuration: `${totalDuration}ms`,
          runId,
        }
      );

      return {
        activities: response.text,
      };
    } catch (error) {
      const totalDuration = Date.now() - startTime;

      if (error instanceof Error) {
        logger?.error("[planActivities] Failed to generate activities", {
          error: error.message,
          stack: error.stack,
          location: forecast.location,
          totalDuration: `${totalDuration}ms`,
          runId,
        });
        throw new Error(`Failed to generate activities: ${error.message}`);
      }

      logger?.error("[planActivities] Unknown error occurred", {
        error,
        location: forecast.location,
        totalDuration: `${totalDuration}ms`,
        runId,
      });
      throw error;
    }
  },
});

const weatherWorkflow = createWorkflow({
  id: "weather-workflow",
  inputSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  outputSchema: z.object({
    activities: z.string(),
  }),
  retryConfig: {
    attempts: 3,
    delay: 2000,
  },
})
  .then(fetchWeather)
  .then(planActivities);

weatherWorkflow.commit();

export { weatherWorkflow };
